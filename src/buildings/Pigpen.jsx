// Chiqueiro no morro atrás do pasto: cerquinhas laterais, poça de lama e cocho. Aparece após a compra.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';

export const Pigpen = memo(function Pigpen() {
  const { x, y, w, h } = LAYOUT.pigpenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {/* Terra do chiqueiro */}
      <ellipse cx={w / 2} cy={h - 30} rx={w / 2 - 10} ry="34" fill="#C9A24A" opacity=".55" />
      {/* Poça de lama */}
      <ellipse cx="110" cy={h - 26} rx="78" ry="22" fill="#8E5E36" stroke="#5B3D2E" strokeWidth="3.5" />
      <ellipse cx="96" cy={h - 32} rx="40" ry="10" fill="#A56F42" />
      <ellipse cx="130" cy={h - 22} rx="14" ry="5" fill="#B9804F" opacity=".7" />
      {/* Cocho */}
      <g transform={`translate(${w - 110} ${h - 60})`}>
        <path d="M0 6h80l-8 28H8z" fill="#D19A5B" stroke="#5B3D2E" strokeWidth="3.5" strokeLinejoin="round" />
        <rect x="-4" y="0" width="88" height="10" rx="4" fill="#E3B47C" stroke="#5B3D2E" strokeWidth="3" />
        <ellipse cx="40" cy="14" rx="30" ry="4" fill="#FFD24A" />
      </g>
      {/* Cerquinhas laterais */}
      {[8, w - 26].map((fx) => (
        <g key={fx}>
          <rect x={fx} y={h - 96} width="18" height="70" rx="6" fill="#F0C58D" stroke="#A8703A" strokeWidth="3" />
          <path d={`M${fx} ${h - 92} L${fx + 9} ${h - 104} L${fx + 18} ${h - 92}`} fill="#F0C58D" stroke="#A8703A" strokeWidth="3" strokeLinejoin="round" />
        </g>
      ))}
      <rect x="8" y={h - 78} width="60" height="10" rx="5" fill="#E3B47C" stroke="#A8703A" strokeWidth="3" />
      <rect x="8" y={h - 52} width="60" height="10" rx="5" fill="#E3B47C" stroke="#A8703A" strokeWidth="3" />
      <rect x={w - 68} y={h - 78} width="60" height="10" rx="5" fill="#E3B47C" stroke="#A8703A" strokeWidth="3" />
      <rect x={w - 68} y={h - 52} width="60" height="10" rx="5" fill="#E3B47C" stroke="#A8703A" strokeWidth="3" />
      {/* Plaquinha com porquinho */}
      <g transform={`translate(${w / 2 - 20} ${h - 120})`}>
        <rect x="14" y="30" width="12" height="40" rx="4" fill="#A8703A" />
        <rect x="0" y="0" width="40" height="34" rx="8" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="3" />
        <circle cx="20" cy="17" r="9" fill="#FFB5C2" stroke="#5B3D2E" strokeWidth="2" />
        <ellipse cx="22" cy="19" rx="4.5" ry="3.2" fill="#F58FA5" stroke="#5B3D2E" strokeWidth="1.5" />
        <circle cx="17" cy="14" r="1.4" fill="#5B3D2E" /><circle cx="25" cy="14" r="1.4" fill="#5B3D2E" />
      </g>
    </svg>
  );
});
