// Celeiro em 3/4 com volume. Estágio 1: celeiro vermelho. Estágio 2: maior, com silo e sótão de feno.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';
import { Shadow, Gloss, RIM } from '../art/shading.jsx';

export const Barn = memo(function Barn({ upgraded }) {
  const { x, y, w, h } = LAYOUT.barn;
  const dx = 84, dy = 42;
  const top = upgraded ? 40 : 80; // altura do cume
  const wallTop = upgraded ? 170 : 200;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox="0 0 520 400" preserveAspectRatio="none" aria-hidden="true">
      <Shadow x={240} y={378} rx={260} ry={24} />
      {upgraded && (
        <g transform="translate(400 0)">
          {/* Silo */}
          <rect x="0" y="130" width="96" height="240" rx="6" fill="url(#f-metal)" stroke={RIM} strokeWidth="1.2" />
          <rect x="0" y="130" width="24" height="240" fill="#fff" opacity=".35" />
          <rect x="70" y="130" width="26" height="240" fill="#7A8791" opacity=".25" />
          <path d="M0 132c0-48 96-48 96 0z" fill="url(#f-roof-red)" stroke={RIM} strokeWidth="1.2" />
          <g stroke="#9AA6AE" strokeWidth="3" opacity=".6"><line x1="0" y1="200" x2="96" y2="200" /><line x1="0" y1="260" x2="96" y2="260" /><line x1="0" y1="320" x2="96" y2="320" /></g>
          <circle cx="48" cy="166" r="10" fill="#3D2A20" />
        </g>
      )}
      {/* Lateral direita */}
      <polygon points={`360,${wallTop} ${360 + dx},${wallTop - dy} ${360 + dx},${370 - dy} 360,370`} fill="url(#f-red-side)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Frente */}
      <rect x="40" y={wallTop} width="320" height={370 - wallTop} fill="url(#f-red)" stroke={RIM} strokeWidth="1.2" />
      <g stroke="#B8433A" strokeWidth="2" opacity=".35">{[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={80 + i * 50} y1={wallTop} x2={80 + i * 50} y2="370" />)}</g>
      {/* Telhado gambrel: lado (quadriláteros) e frente */}
      <polygon points={`200,${top} 360,${wallTop} ${360 + dx},${wallTop - dy} ${200 + dx},${top - dy}`} fill="url(#f-roof-red-side)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points={`24,${wallTop + 6} 90,${wallTop - 60} 200,${top} 310,${wallTop - 60} 376,${wallTop + 6}`} fill="url(#f-roof-red)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={`M200 ${top} L310 ${wallTop - 60}`} stroke="#fff" strokeWidth="3" opacity=".3" />
      <rect x="16" y={wallTop} width="352" height="12" rx="6" fill="#FFF6E4" stroke={RIM} strokeWidth="1" />
      {/* Janela do sótão */}
      <rect x="170" y={wallTop - 44} width="60" height="50" rx="10" fill="#fff" stroke={RIM} strokeWidth="1.2" />
      <rect x="175" y={wallTop - 39} width="50" height="40" rx="7" fill={upgraded ? 'url(#s-straw)' : 'url(#f-glass)'} />
      {!upgraded && <path d={`M200 ${wallTop - 39}v40M175 ${wallTop - 19}h50`} stroke="#FFF6E4" strokeWidth="3" />}
      {/* Portas grandes com X */}
      <rect x="120" y="230" width="160" height="140" rx="8" fill="url(#f-red-side)" stroke={RIM} strokeWidth="1.2" />
      <line x1="200" y1="230" x2="200" y2="370" stroke="#8E2E26" strokeWidth="3" />
      <g stroke="#FFF6E4" strokeWidth="10" strokeLinecap="round" opacity=".95">
        <line x1="134" y1="244" x2="188" y2="356" /><line x1="188" y1="244" x2="134" y2="356" />
        <line x1="212" y1="244" x2="266" y2="356" /><line x1="266" y1="244" x2="212" y2="356" />
      </g>
      <rect x="112" y="222" width="176" height="14" rx="7" fill="#FFF6E4" stroke={RIM} strokeWidth="1" />
      <Gloss x={150} y={260} rx={20} ry={10} opacity={.25} />
      {/* Ferradura da sorte */}
      <path d="M186 205c0-12 28-12 28 0 0 10-6 14-6 14M186 205c0 10 6 14 6 14" fill="none" stroke="url(#s-gold)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
});
