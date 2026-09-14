// Chiqueiro (área do Pasto): cerca em volta, poça de lama e cocho. Aparece após a compra.
// A cerca da frente é desenhada separadamente (PigpenFront) para ficar na frente do porquinho.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';
import { Fence } from '../components/Backdrop.jsx';

export const Pigpen = memo(function Pigpen() {
  const { x, y, w, h } = LAYOUT.pigpenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {/* Terra do chiqueiro */}
      <ellipse cx={w / 2} cy={h - 60} rx={w / 2 - 20} ry="70" fill="#C9A24A" opacity=".45" />
      {/* Poça de lama */}
      <ellipse cx="200" cy={h - 60} rx="120" ry="34" fill="#8E5E36" stroke="#5B3D2E" strokeWidth="4" />
      <ellipse cx="180" cy={h - 68} rx="60" ry="14" fill="#A56F42" />
      <ellipse cx="240" cy={h - 52} rx="18" ry="7" fill="#B9804F" opacity=".7" />
      {/* Cocho */}
      <g transform={`translate(${w - 170} ${h - 120})`}>
        <path d="M0 8h110l-10 36H10z" fill="#D19A5B" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
        <rect x="-6" y="0" width="122" height="12" rx="5" fill="#E3B47C" stroke="#5B3D2E" strokeWidth="3.5" />
        <ellipse cx="55" cy="18" rx="42" ry="5" fill="#FFD24A" />
      </g>
      {/* Cerca de trás e laterais */}
      <Fence x1={10} x2={w - 10} y={52} short />
      {[10, w - 28].map((fx) => (
        <g key={fx}>
          <rect x={fx} y={52} width="18" height={h - 90} rx="6" fill="#F0C58D" stroke="#A8703A" strokeWidth="3" />
        </g>
      ))}
      {/* Plaquinha com porquinho */}
      <g transform={`translate(${w / 2 + 120} 0)`}>
        <rect x="16" y="34" width="12" height="40" rx="4" fill="#A8703A" />
        <rect x="0" y="0" width="44" height="38" rx="9" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="3" />
        <circle cx="22" cy="19" r="10" fill="#FFB5C2" stroke="#5B3D2E" strokeWidth="2" />
        <ellipse cx="24" cy="21" rx="5" ry="3.5" fill="#F58FA5" stroke="#5B3D2E" strokeWidth="1.5" />
        <circle cx="18" cy="16" r="1.5" fill="#5B3D2E" /><circle cx="27" cy="16" r="1.5" fill="#5B3D2E" />
      </g>
    </svg>
  );
});

/** Cerca da frente do chiqueiro (fica por cima do porquinho). */
export const PigpenFront = memo(function PigpenFront() {
  const { x, y, w, h } = LAYOUT.pigpenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y, pointerEvents: 'none' }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <Fence x1={10} x2={w - 10} y={h - 10} />
    </svg>
  );
});

/** Antes da compra: só uma marcação suave de onde o chiqueiro vai ficar. */
export const PigpenPlaceholder = memo(function PigpenPlaceholder() {
  const { x, y, w, h } = LAYOUT.pigpenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y, pointerEvents: 'none' }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <ellipse cx={w / 2} cy={h - 60} rx={w / 2 - 40} ry="60" fill="#B8E39B" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 14" opacity=".4" />
    </svg>
  );
});
