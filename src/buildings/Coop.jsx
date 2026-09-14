// Galinheiro. Estágio 1: madeira simples. Estágio 2 (melhoria): pintado, telhado novo, floreira e cata-vento.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';

export const Coop = memo(function Coop({ upgraded }) {
  const { x, y, w, h } = LAYOUT.coop;
  const wall = upgraded ? '#FFF1D6' : '#D19A5B';
  const wallDark = upgraded ? '#F0DDB8' : '#B8813F';
  const roof = upgraded ? '#E0574B' : '#A8703A';
  const trim = upgraded ? '#6ECBF5' : '#FFF6E4';
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox="0 0 380 300" aria-hidden="true">
      {/* Sombra */}
      <ellipse cx="200" cy="292" rx="180" ry="14" fill="rgba(60,40,20,.15)" />
      {/* Pernas / base */}
      <rect x="40" y="230" width="20" height="60" rx="6" fill="#8E5E36" />
      <rect x="320" y="230" width="20" height="60" rx="6" fill="#8E5E36" />
      {/* Corpo */}
      <rect x="30" y="110" width="320" height="140" rx="14" fill={wall} stroke="#5B3D2E" strokeWidth="5" />
      {!upgraded && (
        <g stroke={wallDark} strokeWidth="4" opacity=".8">
          <line x1="30" y1="150" x2="350" y2="150" /><line x1="30" y1="190" x2="350" y2="190" /><line x1="30" y1="230" x2="350" y2="230" />
        </g>
      )}
      {/* Porta com rampa */}
      <rect x="150" y="160" width="80" height="90" rx="30" fill="#5B3D2E" />
      <path d="M150 250 L110 296 L270 296 L230 250 Z" fill="#E3B47C" stroke="#5B3D2E" strokeWidth="4" strokeLinejoin="round" />
      <g stroke="#A8703A" strokeWidth="3"><line x1="140" y1="262" x2="240" y2="262" /><line x1="128" y1="276" x2="252" y2="276" /></g>
      {/* Janela redonda */}
      <circle cx="80" cy="170" r="24" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="5" />
      <path d="M80 146v48M56 170h48" stroke="#5B3D2E" strokeWidth="4" />
      <circle cx="300" cy="170" r="24" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="5" />
      <path d="M300 146v48M276 170h48" stroke="#5B3D2E" strokeWidth="4" />
      {/* Telhado */}
      <path d="M10 120 L190 30 L370 120 Z" fill={roof} stroke="#5B3D2E" strokeWidth="5" strokeLinejoin="round" />
      {upgraded && (
        <g fill="#C94A3F" opacity=".9">
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              {Array.from({ length: 6 + r * 2 }, (_, i) => {
                const rowY = 52 + r * 18;
                const span = (r + 1) * 40;
                const x0 = 190 - span + (i * (span * 2)) / (5 + r * 2);
                return <circle key={i} cx={x0} cy={rowY} r="9" />;
              })}
            </g>
          ))}
        </g>
      )}
      <rect x="0" y="112" width="380" height="16" rx="8" fill={trim} stroke="#5B3D2E" strokeWidth="4" />
      {/* Melhorias visuais */}
      {upgraded && (
        <g>
          {/* Floreira */}
          <rect x="48" y="200" width="66" height="22" rx="6" fill="#A8703A" stroke="#5B3D2E" strokeWidth="3" />
          <circle cx="60" cy="196" r="9" fill="#FF6F91" /><circle cx="80" cy="192" r="9" fill="#FFD24A" /><circle cx="100" cy="196" r="9" fill="#C89BFF" />
          <rect x="266" y="200" width="66" height="22" rx="6" fill="#A8703A" stroke="#5B3D2E" strokeWidth="3" />
          <circle cx="278" cy="196" r="9" fill="#FFD24A" /><circle cx="298" cy="192" r="9" fill="#FF6F91" /><circle cx="318" cy="196" r="9" fill="#6ECBF5" />
          {/* Cata-vento galinha */}
          <line x1="190" y1="30" x2="190" y2="-2" stroke="#5B3D2E" strokeWidth="4" />
          <path d="M178 2c0-8 6-12 12-12 4 0 8 2 10 6l8-2-2 8c0 6-6 10-12 10s-16-2-16-10z" fill="#FFD24A" stroke="#5B3D2E" strokeWidth="3" />
          <line x1="170" y1="2" x2="210" y2="2" stroke="#5B3D2E" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
});
