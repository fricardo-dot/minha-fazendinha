// Fontes de comida na frente do celeiro: pilha de milho (limitada) e fardo de feno (infinito na V1).
// Ambos são fontes de "pegar e levar".
import { useEffect, useRef, useState } from 'react';
import { LAYOUT, MIN_TOUCH } from '../config/layout.js';
import { BALANCE } from '../config/balance.js';
import { useDrag } from '../interaction/DragContext.jsx';
import { useGame } from '../state/GameProvider.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { audio } from '../audio/AudioManager.js';

export function CornPile({ pos = LAYOUT.cornPile }) {
  const { state, hint } = useGame();
  const { startHold } = useDrag();
  const count = state.inventory.corn;
  const shown = Math.min(count, BALANCE.inventory.maxCornShown);
  const [pop, setPop] = useState(false);
  const prev = useRef(count);
  useEffect(() => {
    if (count > prev.current) { setPop(true); const t = setTimeout(() => setPop(false), 450); prev.current = count; return () => clearTimeout(t); }
    prev.current = count;
    return undefined;
  }, [count]);

  const onDown = (e) => {
    if (count <= 0) { audio.play('oops', 300); setShake(true); setTimeout(() => setShake(false), 500); return; }
    startHold(e, { kind: 'corn' });
  };
  const [shake, setShake] = useState(false);
  const cls = ['fz-obj', 'fz-tappable', hint === 'source:corn' && count > 0 && 'is-hinted', pop && 'is-popping', shake && 'is-shaking'].filter(Boolean).join(' ');

  return (
    <div className={cls} style={{ left: pos.x, top: pos.y, width: 150, height: 120 }} onPointerDown={onDown}>
      <div className="fz-press" style={{ width: 150, height: 120, position: 'relative' }}>
        <svg width="150" height="120" viewBox="0 0 150 120" aria-hidden="true">
          <ellipse cx="75" cy="112" rx="66" ry="9" fill="rgba(60,40,20,.15)" />
          <rect x="12" y="56" width="126" height="56" rx="10" fill="#D19A5B" stroke="#5B3D2E" strokeWidth="4" />
          <g stroke="#A8703A" strokeWidth="3"><line x1="12" y1="76" x2="138" y2="76" /><line x1="12" y1="94" x2="138" y2="94" /></g>
          {shown === 0 && <text x="75" y="48" textAnchor="middle" fontSize="26" fontFamily="var(--font)" fontWeight="800" fill="#5B3D2E" opacity=".45">…</text>}
        </svg>
        {Array.from({ length: shown }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 14 + (i % 3) * 38 + (i >= 3 ? 19 : 0), top: i >= 3 ? 2 : 24, transform: `rotate(${(i % 2 ? 1 : -1) * 12}deg)` }}>
            <ItemIcon kind="corn" size={48} />
          </div>
        ))}
      </div>
      <div className="fz-touch" style={{ width: Math.max(MIN_TOUCH * 1.6, 170), height: Math.max(MIN_TOUCH, 150) }} />
    </div>
  );
}

export function HayBale({ pos = LAYOUT.hayBale }) {
  const { hint } = useGame();
  const { startHold } = useDrag();
  const cls = ['fz-obj', 'fz-tappable', hint === 'source:hay' && 'is-hinted'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ left: pos.x, top: pos.y, width: 150, height: 120 }} onPointerDown={(e) => startHold(e, { kind: 'hay' })}>
      <div className="fz-press" style={{ width: 150, height: 120 }}>
        <svg width="150" height="120" viewBox="0 0 150 120" aria-hidden="true">
          <ellipse cx="75" cy="112" rx="66" ry="9" fill="rgba(60,40,20,.15)" />
          <rect x="10" y="62" width="130" height="50" rx="12" fill="#E8C466" stroke="#5B3D2E" strokeWidth="4" />
          <rect x="30" y="18" width="96" height="48" rx="12" fill="#F0D178" stroke="#5B3D2E" strokeWidth="4" />
          <g stroke="#C9A24A" strokeWidth="3" strokeLinecap="round">
            <line x1="22" y1="76" x2="128" y2="76" /><line x1="22" y1="88" x2="128" y2="88" /><line x1="22" y1="100" x2="128" y2="100" />
            <line x1="42" y1="30" x2="114" y2="30" /><line x1="42" y1="42" x2="114" y2="42" /><line x1="42" y1="54" x2="114" y2="54" />
          </g>
          <g stroke="#A97C3A" strokeWidth="4" strokeLinecap="round"><line x1="46" y1="62" x2="46" y2="112" /><line x1="104" y1="62" x2="104" y2="112" /><line x1="60" y1="18" x2="60" y2="66" /><line x1="96" y1="18" x2="96" y2="66" /></g>
          <path d="M28 20c-6-8-4-16 2-18M124 24c8-6 10-14 6-18" fill="none" stroke="#C9A24A" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 170, height: 150 }} />
    </div>
  );
}

export function WateringCan() {
  const { hint } = useGame();
  const { startHold } = useDrag();
  const cls = ['fz-obj', 'fz-tappable', hint === 'source:water' && 'is-hinted'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ left: LAYOUT.wateringCan.x, top: LAYOUT.wateringCan.y, width: 120, height: 120 }} onPointerDown={(e) => startHold(e, { kind: 'water' })}>
      <div className="fz-press" style={{ width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
          <ellipse cx="56" cy="112" rx="46" ry="8" fill="rgba(60,40,20,.15)" />
          <path d="M22 44h58v50a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10z" fill="#6ECBF5" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
          <path d="M22 62h58" stroke="#4FB3E0" strokeWidth="5" />
          <path d="M80 56l22-16 8 8-24 22z" fill="#4FB3E0" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="106" cy="44" r="10" fill="#4FB3E0" stroke="#5B3D2E" strokeWidth="4" />
          <g fill="#FFF"><circle cx="103" cy="42" r="1.8" /><circle cx="109" cy="42" r="1.8" /><circle cx="106" cy="47" r="1.8" /></g>
          <path d="M36 44c0-14 8-22 16-22s16 8 16 22" fill="none" stroke="#5B3D2E" strokeWidth="5" strokeLinecap="round" />
          <path d="M22 70c-10 2-14 10-12 22" fill="none" stroke="#5B3D2E" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 150, height: 150 }} />
    </div>
  );
}
