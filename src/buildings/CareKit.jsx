// Kit de cuidados em 3/4: caixote com balde de esponja e escova. Ambos são fontes de "pegar e levar".
import { LAYOUT } from '../config/layout.js';
import { useDrag } from '../interaction/DragContext.jsx';
import { useGame } from '../state/GameProvider.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { Shadow, Box, Gloss, RIM } from '../art/shading.jsx';

export function CareKit() {
  const { hint, care } = useGame();
  const { startHold } = useDrag();
  const { x, y } = LAYOUT.careKit;
  const busy = !!care;

  return (
    <div className="fz-obj" style={{ left: x, top: y, width: 220, height: 150 }}>
      <svg width="220" height="150" viewBox="0 0 220 150" aria-hidden="true">
        <Shadow x={110} y={142} rx={100} ry={11} />
        <Box x={14} y={142} w={168} h={56} d={28} front="url(#f-wood)" side="url(#f-wood-side)" top="#8E5E36" rx={3} />
        <g stroke="#A8703A" strokeWidth="2" opacity=".45"><line x1="14" y1="106" x2="182" y2="106" /><line x1="14" y1="126" x2="182" y2="126" /></g>
        <rect x="14" y="86" width="168" height="5" fill="#F5D3A5" opacity=".6" />
        {/* Balde de água atrás da esponja */}
        <path d="M30 40h70l-6 46H36z" fill="url(#f-metal)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
        <ellipse cx="65" cy="40" rx="35" ry="8" fill="#DCE6EE" stroke={RIM} strokeWidth="1" />
        <ellipse cx="65" cy="40" rx="28" ry="5" fill="url(#s-water)" />
        <path d="M32 38c0-24 66-24 66 0" fill="none" stroke="#7A7F86" strokeWidth="4" strokeLinecap="round" />
        <Gloss x={44} y={60} rx={5} ry={14} opacity={.5} />
      </svg>
      <div
        className={['fz-obj', 'fz-tappable', hint === 'source:sponge' && 'is-hinted'].filter(Boolean).join(' ')}
        style={{ left: 66, top: 34, width: 90, height: 90, opacity: busy && care.tool === 'sponge' ? 0.25 : 1 }}
        onPointerDown={(e) => { if (!busy) startHold(e, { kind: 'sponge' }); }}
      >
        <div className="fz-press"><ItemIcon kind="sponge" size={84} /></div>
        <div className="fz-touch" style={{ width: 110, height: 120 }} />
      </div>
      <div
        className={['fz-obj', 'fz-tappable', hint === 'source:brush' && 'is-hinted'].filter(Boolean).join(' ')}
        style={{ left: 158, top: 44, width: 90, height: 90, opacity: busy && care.tool === 'brush' ? 0.25 : 1 }}
        onPointerDown={(e) => { if (!busy) startHold(e, { kind: 'brush' }); }}
      >
        <div className="fz-press" style={{ transform: 'rotate(-20deg)' }}><ItemIcon kind="brush" size={88} /></div>
        <div className="fz-touch" style={{ width: 110, height: 120 }} />
      </div>
    </div>
  );
}
