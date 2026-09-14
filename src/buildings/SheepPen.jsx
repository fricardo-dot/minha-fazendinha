// Curral da ovelha (morro do Pasto): cerquinha, bebedouro e uma árvore de sombra. Aparece após a compra.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';
import { Fence } from '../components/Backdrop.jsx';

export const SheepPen = memo(function SheepPen() {
  const { x, y, w, h } = LAYOUT.sheepPenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {/* Grama mais clarinha */}
      <ellipse cx={w / 2} cy={h - 40} rx={w / 2 - 16} ry="46" fill="#B8E39B" opacity=".7" />
      {/* Árvore de sombra */}
      <g transform={`translate(${w - 60} ${h - 60})`}>
        <rect x="-9" y="-10" width="18" height="44" rx="6" fill="#A8703A" />
        <circle cx="0" cy="-42" r="40" fill="#5FAF42" />
        <circle cx="-26" cy="-22" r="30" fill="#6DBB4C" /><circle cx="26" cy="-24" r="30" fill="#6DBB4C" />
        <circle cx="-10" cy="-48" r="6" fill="#FF6F91" /><circle cx="16" cy="-30" r="6" fill="#FF6F91" />
      </g>
      {/* Bebedouro */}
      <g transform={`translate(26 ${h - 74})`}>
        <path d="M0 6h90l-8 30H8z" fill="#B7C6D3" stroke="#5B3D2E" strokeWidth="3.5" strokeLinejoin="round" />
        <rect x="-4" y="0" width="98" height="10" rx="4" fill="#DCE6EE" stroke="#5B3D2E" strokeWidth="3" />
        <ellipse cx="45" cy="14" rx="36" ry="4" fill="#6ECBF5" />
      </g>
      {/* Cerca de trás e laterais */}
      <Fence x1={10} x2={w - 10} y={50} short />
      {[10, w - 28].map((fx) => <rect key={fx} x={fx} y={50} width="18" height={h - 70} rx="6" fill="#F0C58D" stroke="#A8703A" strokeWidth="3" />)}
      {/* Plaquinha com ovelha */}
      <g transform={`translate(${w / 2 - 22} 0)`}>
        <rect x="16" y="30" width="12" height="34" rx="4" fill="#A8703A" />
        <rect x="0" y="0" width="44" height="34" rx="9" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="3" />
        <circle cx="16" cy="18" r="8" fill="#fff" stroke="#5B3D2E" strokeWidth="2" /><circle cx="26" cy="15" r="9" fill="#fff" stroke="#5B3D2E" strokeWidth="2" />
        <circle cx="32" cy="20" r="5" fill="#4A3B36" stroke="#5B3D2E" strokeWidth="1.5" />
      </g>
    </svg>
  );
});

/** Cerca da frente do curral (fica por cima da ovelha). */
export const SheepPenFront = memo(function SheepPenFront() {
  const { x, y, w, h } = LAYOUT.sheepPenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y, pointerEvents: 'none' }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <Fence x1={10} x2={w - 10} y={h - 6} short />
    </svg>
  );
});

export const SheepPenPlaceholder = memo(function SheepPenPlaceholder() {
  const { x, y, w, h } = LAYOUT.sheepPenArea;
  return (
    <svg className="fz-box" style={{ left: x, top: y, pointerEvents: 'none' }} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <ellipse cx={w / 2} cy={h - 40} rx={w / 2 - 40} ry="36" fill="#B8E39B" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 14" opacity=".4" />
    </svg>
  );
});
