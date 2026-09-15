// Fontes de comida: caixote de milho (limitado), fardos de feno (infinitos na V1) e regador.
// Todos são fontes de "pegar e levar". Desenhados em 3/4 com volume.
import { useEffect, useRef, useState } from 'react';
import { LAYOUT, MIN_TOUCH } from '../config/layout.js';
import { BALANCE } from '../config/balance.js';
import { useDrag } from '../interaction/DragContext.jsx';
import { useGame } from '../state/GameProvider.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { audio } from '../audio/AudioManager.js';
import { Shadow, Box, Gloss, RIM } from '../art/shading.jsx';

export function CornPile({ pos = LAYOUT.cornPile }) {
  const { state, hint } = useGame();
  const { startHold } = useDrag();
  const count = state.inventory.corn;
  const shown = Math.min(count, BALANCE.inventory.maxCornShown);
  const [pop, setPop] = useState(false);
  const [shake, setShake] = useState(false);
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
  const cls = ['fz-obj', 'fz-tappable', hint === 'source:corn' && count > 0 && 'is-hinted', pop && 'is-popping', shake && 'is-shaking'].filter(Boolean).join(' ');

  return (
    <div className={cls} style={{ left: pos.x, top: pos.y, width: 150, height: 120 }} onPointerDown={onDown}>
      <div className="fz-press" style={{ width: 150, height: 120, position: 'relative' }}>
        <svg width="150" height="120" viewBox="0 0 150 120" aria-hidden="true">
          <Shadow x={75} y={114} rx={70} ry={10} />
          <Box x={12} y={112} w={110} h={50} d={26} front="url(#f-wood)" side="url(#f-wood-side)" top="#8E5E36" rx={3} />
          <g stroke="#A8703A" strokeWidth="2" opacity=".5"><line x1="12" y1="80" x2="122" y2="80" /><line x1="12" y1="96" x2="122" y2="96" /></g>
          <rect x="12" y="62" width="110" height="5" fill="#F5D3A5" opacity=".6" />
          {shown === 0 && <circle cx="70" cy="46" r="16" fill="#FFF6E4" opacity=".6" />}
        </svg>
        {Array.from({ length: shown }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 14 + (i % 3) * 36 + (i >= 3 ? 18 : 0), top: i >= 3 ? 4 : 24, transform: `rotate(${(i % 2 ? 1 : -1) * 12}deg)` }}>
            <ItemIcon kind="corn" size={46} />
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
          <Shadow x={75} y={114} rx={70} ry={10} />
          <Box x={8} y={112} w={110} h={46} d={26} front="url(#s-straw)" side="#C9A24A" top="#FFF0B8" rx={6} />
          <Box x={26} y={66} w={86} h={42} d={24} front="url(#s-straw)" side="#C9A24A" top="#FFF0B8" rx={6} />
          <g stroke="#B8933D" strokeWidth="2.5" strokeLinecap="round" opacity=".6">
            <line x1="20" y1="80" x2="106" y2="80" /><line x1="20" y1="96" x2="106" y2="96" /><line x1="40" y1="36" x2="100" y2="36" /><line x1="40" y1="52" x2="100" y2="52" />
          </g>
          <g stroke="#8E6B25" strokeWidth="4" strokeLinecap="round" opacity=".8"><line x1="44" y1="66" x2="44" y2="112" /><line x1="86" y1="66" x2="86" y2="112" /><line x1="56" y1="24" x2="56" y2="66" /><line x1="86" y1="24" x2="86" y2="66" /></g>
          <Gloss x={44} y={34} rx={14} ry={6} />
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
          <Shadow x={56} y={112} rx={48} ry={9} />
          <path d="M22 44h58v50a10 10 0 0 1-10 10H32a10 10 0 0 1-10-10z" fill="url(#s-water)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <ellipse cx="51" cy="44" rx="29" ry="7" fill="#DDF6FF" stroke={RIM} strokeWidth="1" />
          <path d="M80 56l22-16 8 8-24 22z" fill="url(#s-blue)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <circle cx="106" cy="44" r="10" fill="url(#s-blue)" stroke={RIM} strokeWidth="1" />
          <g fill="#FFF"><circle cx="103" cy="42" r="1.8" /><circle cx="109" cy="42" r="1.8" /><circle cx="106" cy="47" r="1.8" /></g>
          <path d="M36 44c0-14 8-22 16-22s16 8 16 22" fill="none" stroke="#3D9BC9" strokeWidth="6" strokeLinecap="round" />
          <path d="M22 70c-10 2-14 10-12 22" fill="none" stroke="#3D9BC9" strokeWidth="6" strokeLinecap="round" />
          <Gloss x={38} y={64} rx={8} ry={16} opacity={.5} />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 150, height: 150 }} />
    </div>
  );
}
