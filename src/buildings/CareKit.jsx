// Kit de cuidados: um caixote com balde de esponja e escova. Ambos são fontes de "pegar e levar".
import { LAYOUT } from '../config/layout.js';
import { useDrag } from '../interaction/DragContext.jsx';
import { useGame } from '../state/GameProvider.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';

export function CareKit() {
  const { hint, care } = useGame();
  const { startHold } = useDrag();
  const { x, y } = LAYOUT.careKit;
  const busy = !!care; // uma ferramenta em uso: a outra fica quietinha (o toque continua funcionando)

  return (
    <div className="fz-obj" style={{ left: x, top: y, width: 220, height: 150 }}>
      <svg width="220" height="150" viewBox="0 0 220 150" aria-hidden="true">
        <ellipse cx="110" cy="142" rx="96" ry="10" fill="rgba(60,40,20,.15)" />
        <path d="M14 84h192l-10 58H24z" fill="#D19A5B" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
        <g stroke="#A8703A" strokeWidth="3" opacity=".8"><line x1="22" y1="106" x2="198" y2="106" /><line x1="26" y1="126" x2="194" y2="126" /></g>
        <rect x="10" y="78" width="200" height="14" rx="6" fill="#E3B47C" stroke="#5B3D2E" strokeWidth="4" />
        {/* Balde de água atrás da esponja */}
        <path d="M30 40h70l-6 46H36z" fill="#6ECBF5" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
        <ellipse cx="65" cy="40" rx="35" ry="8" fill="#B7E9F7" stroke="#5B3D2E" strokeWidth="4" />
        <path d="M32 38c0-24 66-24 66 0" fill="none" stroke="#5B3D2E" strokeWidth="5" strokeLinecap="round" />
      </svg>

      {/* Esponja */}
      <div
        className={['fz-obj', 'fz-tappable', hint === 'source:sponge' && 'is-hinted', busy && care.tool === 'sponge' && 'is-away'].filter(Boolean).join(' ')}
        style={{ left: 66, top: 34, width: 90, height: 90, opacity: busy && care.tool === 'sponge' ? 0.25 : 1 }}
        onPointerDown={(e) => { if (!busy) startHold(e, { kind: 'sponge' }); }}
      >
        <div className="fz-press"><ItemIcon kind="sponge" size={84} /></div>
        <div className="fz-touch" style={{ width: 110, height: 120 }} />
      </div>

      {/* Escova */}
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
