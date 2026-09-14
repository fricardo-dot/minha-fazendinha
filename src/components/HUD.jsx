// HUD mínimo: pote de moedas (visual) e botão discreto da área dos pais (segurar).
import { useEffect, useRef, useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { BALANCE } from '../config/balance.js';
import { useGame } from '../state/GameProvider.jsx';

export function CoinJar() {
  const { state, coinFlash } = useGame();
  const coins = state.coins;
  const shown = Math.min(coins, BALANCE.rewards.maxCoinsShown);
  const [flash, setFlash] = useState(false);
  const [pop, setPop] = useState(false);
  const prev = useRef(coins);
  const firstFlash = useRef(true);

  useEffect(() => {
    if (firstFlash.current) { firstFlash.current = false; return undefined; }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 650);
    return () => clearTimeout(t);
  }, [coinFlash]);

  useEffect(() => {
    if (coins > prev.current) { setPop(true); const t = setTimeout(() => setPop(false), 450); prev.current = coins; return () => clearTimeout(t); }
    prev.current = coins;
    return undefined;
  }, [coins]);

  // Moedas empilhadas em 4 colunas dentro do pote
  const cols = 4;
  return (
    <div className={`fz-hud fz-coinjar ${flash ? 'is-flashing' : ''} ${pop ? 'is-popping' : ''}`} style={{ left: LAYOUT.hud.coinJar.x, top: LAYOUT.hud.coinJar.y, width: 150, height: 150 }}>
      <div className="fz-press" style={{ width: 150, height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
          <path d="M34 34h82v10c8 6 14 18 14 34v50a16 16 0 0 1-16 16H36a16 16 0 0 1-16-16V78c0-16 6-28 14-34z" fill="rgba(210,240,250,.75)" stroke="#5B3D2E" strokeWidth="4.5" strokeLinejoin="round" />
          <rect x="28" y="20" width="94" height="20" rx="8" fill="#D19A5B" stroke="#5B3D2E" strokeWidth="4" />
          {Array.from({ length: shown }, (_, i) => {
            const c = i % cols, r = Math.floor(i / cols);
            return (
              <g key={i} transform={`translate(${44 + c * 21} ${130 - r * 12})`}>
                <ellipse cx="0" cy="0" rx="12" ry="7" fill="#FFD24A" stroke="#B8860B" strokeWidth="2.5" />
                <ellipse cx="0" cy="-2" rx="12" ry="7" fill="#FFE27A" stroke="#B8860B" strokeWidth="2" />
              </g>
            );
          })}
          <path d="M40 60c-6 20-6 40-2 60" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".7" />
        </svg>
      </div>
      <div className="fz-coin-count">{coins}</div>
    </div>
  );
}

export function ParentButton({ onOpen }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef(null);
  const start = (e) => {
    e.stopPropagation();
    setHolding(true);
    timer.current = setTimeout(() => { setHolding(false); onOpen(); }, BALANCE.parent.holdMs);
  };
  const cancel = () => { setHolding(false); clearTimeout(timer.current); };
  return (
    <div
      className={`fz-hud fz-parent-btn ${holding ? 'is-holding' : ''}`}
      style={{ left: LAYOUT.hud.parentButton.x, top: LAYOUT.hud.parentButton.y, '--hold-ms': `${BALANCE.parent.holdMs}ms` }}
      onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel} onPointerCancel={cancel}
      role="button" aria-label="Área dos pais (segure)"
    >
      <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(91,61,46,.25)" strokeWidth="5" />
        <circle className="ring" cx="32" cy="32" r="28" fill="none" stroke="#5B3D2E" strokeWidth="5" strokeLinecap="round" transform="rotate(-90 32 32)" />
        <g fill="#5B3D2E" transform="translate(32 32)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <rect key={a} x="-4" y="-17" width="8" height="10" rx="2" transform={`rotate(${a})`} />)}
          <circle r="11" /><circle r="5" fill="rgba(255,255,255,.7)" />
        </g>
      </svg>
    </div>
  );
}
