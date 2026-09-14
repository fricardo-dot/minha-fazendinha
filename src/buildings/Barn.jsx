// Celeiro. Estágio 1: celeiro vermelho pequeno. Estágio 2: maior, com silo e sótão de feno.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';

export const Barn = memo(function Barn({ upgraded }) {
  const { x, y, w, h } = LAYOUT.barn;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox="0 0 470 380" aria-hidden="true">
      <ellipse cx="220" cy="372" rx="215" ry="16" fill="rgba(60,40,20,.15)" />
      {upgraded && (
        <g>
          {/* Silo */}
          <rect x="360" y="120" width="96" height="250" rx="18" fill="#DCE6EE" stroke="#5B3D2E" strokeWidth="5" />
          <path d="M360 130c0-40 96-40 96 0z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="5" />
          <g stroke="#B7C6D3" strokeWidth="4"><line x1="360" y1="190" x2="456" y2="190" /><line x1="360" y1="250" x2="456" y2="250" /><line x1="360" y1="310" x2="456" y2="310" /></g>
          <circle cx="408" cy="160" r="10" fill="#5B3D2E" />
        </g>
      )}
      {/* Corpo do celeiro */}
      {upgraded ? (
        <path d="M30 370 V180 L60 120 L200 60 L340 120 L370 180 V370 Z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="5" strokeLinejoin="round" />
      ) : (
        <path d="M50 370 V200 L90 140 L200 90 L310 140 L350 200 V370 Z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="5" strokeLinejoin="round" />
      )}
      {/* Telhado */}
      {upgraded ? (
        <path d="M14 190 L60 116 L200 46 L340 116 L386 190" fill="none" stroke="#5B3D2E" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M36 208 L90 136 L200 78 L310 136 L364 208" fill="none" stroke="#5B3D2E" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {upgraded ? (
        <path d="M14 190 L60 116 L200 46 L340 116 L386 190" fill="none" stroke="#A8703A" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M36 208 L90 136 L200 78 L310 136 L364 208" fill="none" stroke="#A8703A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {/* Janela do sótão */}
      <rect x="170" y={upgraded ? 120 : 160} width="60" height="50" rx="10" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="5" />
      <path d={`M200 ${upgraded ? 120 : 160}v50M170 ${upgraded ? 145 : 185}h60`} stroke="#5B3D2E" strokeWidth="4" />
      {upgraded && (
        <g>
          <rect x="176" y="135" width="48" height="28" rx="6" fill="#E8C466" />
          <path d="M180 145h40M180 155h40" stroke="#C9A24A" strokeWidth="3" />
        </g>
      )}
      {/* Portas grandes com X */}
      <rect x="120" y="230" width="160" height="140" rx="10" fill="#C94A3F" stroke="#5B3D2E" strokeWidth="5" />
      <line x1="200" y1="230" x2="200" y2="370" stroke="#5B3D2E" strokeWidth="5" />
      <g stroke="#FFF6E4" strokeWidth="9" strokeLinecap="round">
        <line x1="132" y1="242" x2="190" y2="358" /><line x1="190" y1="242" x2="132" y2="358" />
        <line x1="210" y1="242" x2="268" y2="358" /><line x1="268" y1="242" x2="210" y2="358" />
      </g>
      <rect x="112" y="222" width="176" height="14" rx="7" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="4" />
      {/* Ferradura da sorte */}
      <path d="M186 205c0-12 28-12 28 0 0 10-6 14-6 14M186 205c0 10 6 14 6 14" fill="none" stroke="#FFD24A" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
});
