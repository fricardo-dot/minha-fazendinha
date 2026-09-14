// Abre o minigame ativo em tela cheia dentro do palco, com um botão grande de voltar.
import { useEffect } from 'react';
import { useGame } from '../state/GameProvider.jsx';
import { useDrag } from '../interaction/DragContext.jsx';
import { MINIGAMES } from './registry.js';

export function MinigameHost() {
  const { minigame, actions } = useGame();
  const { held, cancelHold } = useDrag();

  // Ao abrir um minigame, qualquer item "na mão" volta para o lugar.
  useEffect(() => { if (minigame && held) cancelHold(); }, [minigame]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!minigame) return null;
  const entry = MINIGAMES[minigame.id];
  if (!entry) return null;
  const { Component } = entry;

  return (
    <div className="fz-minigame" role="dialog" aria-label="Minijogo">
      <Component params={minigame} onDone={() => actions.closeMinigame()} onExit={() => actions.closeMinigame()} />
    </div>
  );
}

export function ExitButton({ onClick }) {
  return (
    <div className="fz-mg-exit" onClick={onClick} role="button" aria-label="Voltar">
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <path d="M34 10L16 28l18 18" fill="none" stroke="#5B3D2E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
