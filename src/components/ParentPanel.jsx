// Área dos pais: som, música, apagar progresso (com confirmação em dois toques) e versão.
// Sem links externos. Só abre por toque longo.
import { useEffect, useState } from 'react';
import { useGame } from '../state/GameProvider.jsx';

export function ParentPanel({ onClose }) {
  const { state, actions } = useGame();
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!confirm) return undefined;
    const t = setTimeout(() => setConfirm(false), 4000);
    return () => clearTimeout(t);
  }, [confirm]);

  const reset = () => {
    if (!confirm) { setConfirm(true); return; }
    actions.resetFarm();
    setConfirm(false);
    onClose();
  };

  return (
    <div className="fz-overlay" onClick={onClose}>
      <div className="fz-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Área dos pais">
        <h2>Área dos pais</h2>

        <div className="row">
          <div className="label"><SpeakerIcon /> Sons</div>
          <button type="button" className={`fz-toggle ${state.settings.sound ? 'on' : ''}`} aria-pressed={state.settings.sound} aria-label="Sons" onClick={() => actions.setSetting('sound', !state.settings.sound)} />
        </div>
        <div className="row">
          <div className="label"><NoteIcon /> Música</div>
          <button type="button" className={`fz-toggle ${state.settings.music ? 'on' : ''}`} aria-pressed={state.settings.music} aria-label="Música" onClick={() => actions.setSetting('music', !state.settings.music)} />
        </div>
        <div className="row">
          <div className="label"><TrashIcon /> Recomeçar a fazenda</div>
          <button type="button" className={`fz-btn danger ${confirm ? 'confirm' : ''}`} onClick={reset}>
            {confirm ? 'Tem certeza? Toque de novo' : 'Apagar'}
          </button>
        </div>
        <div className="row">
          <div className="label">Fechar</div>
          <button type="button" className="fz-btn primary" onClick={onClose}>Voltar ao jogo</button>
        </div>
        <div className="version">Minha Fazendinha · versão {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'} · o progresso fica salvo só neste aparelho</div>
      </div>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="#5B3D2E" /><path d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11" fill="none" stroke="#5B3D2E" strokeWidth="2" strokeLinecap="round" /></svg>
  );
}
function NoteIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18a3 3 0 1 1-2-2.8V5l11-2v12a3 3 0 1 1-2-2.8V6.5L9 8z" fill="#5B3D2E" /></svg>
  );
}
function TrashIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" fill="none" stroke="#5B3D2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}
