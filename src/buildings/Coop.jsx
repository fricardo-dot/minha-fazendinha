// Galinheiro em 3/4 com volume: frente, lateral, telhado de duas águas, rampa.
// Estágio 1: madeira. Estágio 2 (melhoria): pintado de creme e azul, telhado de telhas, floreiras, cata-vento.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';
import { Shadow, Gloss, RIM } from '../art/shading.jsx';

export const Coop = memo(function Coop({ upgraded }) {
  const { x, y, w, h } = LAYOUT.coop;
  const front = upgraded ? 'url(#f-cream)' : 'url(#f-wood)';
  const side = upgraded ? 'url(#f-cream-side)' : 'url(#f-wood-side)';
  const roof = upgraded ? 'url(#f-roof-red)' : 'url(#f-roof-brown)';
  const roofSide = upgraded ? 'url(#f-roof-red-side)' : 'url(#f-roof-brown-side)';
  const trim = upgraded ? '#5FB6E8' : '#F5D3A5';
  // Geometria (viewBox 0 0 420 330; chão em y=300)
  const dx = 64, dy = 34;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox="0 0 420 330" preserveAspectRatio="none" aria-hidden="true">
      <Shadow x={200} y={306} rx={200} ry={20} />
      {/* Base/pilotis */}
      <g fill="url(#f-wood-side)"><rect x="40" y="236" width="20" height="62" rx="5" /><rect x="270" y="236" width="20" height="62" rx="5" /><rect x="318" y="210" width="16" height="56" rx="5" /></g>
      {/* Lateral direita */}
      <polygon points={`${290},${150} ${290 + dx},${150 - dy} ${290 + dx},${246 - dy} ${290},${246}`} fill={side} stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      {!upgraded && <g stroke="#9A6538" strokeWidth="2" opacity=".5">{[180, 205, 230].map((yy) => <line key={yy} x1="290" y1={yy} x2={290 + dx} y2={yy - dy} />)}</g>}
      {/* Frente */}
      <rect x="30" y="150" width="260" height="96" fill={front} stroke={RIM} strokeWidth="1.2" />
      {!upgraded && <g stroke="#B87E4B" strokeWidth="2" opacity=".55"><line x1="30" y1="182" x2="290" y2="182" /><line x1="30" y1="214" x2="290" y2="214" /></g>}
      {/* Piso (borda inferior) */}
      <rect x="24" y="242" width="272" height="12" rx="4" fill="url(#f-wood-top)" stroke={RIM} strokeWidth="1" />
      <polygon points={`296,242 ${296 + dx},${242 - dy} ${296 + dx},${254 - dy} 296,254`} fill="#B98B57" stroke={RIM} strokeWidth="1" />
      {/* Porta com rampa */}
      <rect x="128" y="176" width="64" height="70" rx="26" fill="#3D2A20" />
      <rect x="132" y="180" width="56" height="66" rx="24" fill="#5B3D2E" />
      <path d="M128 254 L100 300 L220 300 L192 254 Z" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
      <g stroke="#A8703A" strokeWidth="2.5" opacity=".6"><line x1="120" y1="268" x2="200" y2="268" /><line x1="112" y1="282" x2="208" y2="282" /></g>
      {/* Janelas redondas */}
      {[76, 244].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="196" r="22" fill="#fff" stroke={RIM} strokeWidth="1.2" />
          <circle cx={cx} cy="196" r="17" fill="url(#f-glass)" />
          <path d={`M${cx} 179v34M${cx - 17} 196h34`} stroke={trim} strokeWidth="3" />
          <Gloss x={cx - 6} y={188} rx={7} ry={4} />
        </g>
      ))}
      {/* Telhado: água da frente (triângulo) + água do lado (quadrilátero) */}
      <polygon points={`160,60 300,150 ${300 + dx},${150 - dy} ${160 + dx},${60 - dy}`} fill={roofSide} stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points="12,152 160,60 308,152" fill={roof} stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      {upgraded && (
        <g fill="#C94A3F" opacity=".55">
          {[0, 1, 2, 3].map((r) => Array.from({ length: 6 + r * 2 }, (_, i) => {
            const rowY = 82 + r * 17; const span = (r + 1) * 36;
            return <circle key={`${r}-${i}`} cx={160 - span + (i * span * 2) / (5 + r * 2)} cy={rowY} r="7" />;
          }))}
        </g>
      )}
      <path d="M160 60 L300 150" stroke="#FFFFFF" strokeWidth="3" opacity=".35" />
      <rect x="4" y="146" width="312" height="12" rx="6" fill={trim} stroke={RIM} strokeWidth="1" />
      {/* Melhorias visuais */}
      {upgraded && (
        <g>
          <rect x="46" y="222" width="60" height="18" rx="5" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" />
          <circle cx="58" cy="218" r="8" fill="url(#s-pink)" /><circle cx="76" cy="214" r="8" fill="url(#s-yellow)" /><circle cx="94" cy="218" r="8" fill="#C89BFF" />
          <rect x="214" y="222" width="60" height="18" rx="5" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" />
          <circle cx="226" cy="218" r="8" fill="url(#s-yellow)" /><circle cx="244" cy="214" r="8" fill="url(#s-pink)" /><circle cx="262" cy="218" r="8" fill="url(#s-blue)" />
          <line x1="160" y1="60" x2="160" y2="26" stroke="#5B3D2E" strokeWidth="4" />
          <path d="M148 30c0-8 6-12 12-12 4 0 8 2 10 6l8-2-2 8c0 6-6 10-12 10s-16-2-16-10z" fill="url(#s-gold)" stroke={RIM} strokeWidth="1" />
          <line x1="140" y1="30" x2="180" y2="30" stroke="#5B3D2E" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
});
