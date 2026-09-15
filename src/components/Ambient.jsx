// Vida ambiente: borboletas que passeiam em volta de um ponto. Só apresentação.
import { memo } from 'react';

export const Butterflies = memo(function Butterflies({ x, y }) {
  return (
    <div className="fz-box" style={{ left: x, top: y, width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
      <div className="fz-butterfly" style={{ '--dur': '11s', '--rx': '170px', '--ry': '70px' }}>
        <Butterfly color="url(#s-yellow)" />
      </div>
      <div className="fz-butterfly" style={{ '--dur': '14s', '--rx': '120px', '--ry': '90px', animationDelay: '-6s' }}>
        <Butterfly color="url(#s-blue)" />
      </div>
    </div>
  );
});

function Butterfly({ color }) {
  return (
    <svg width="44" height="36" viewBox="0 0 44 36" className="fz-butterfly-wings">
      <g className="wing-l" style={{ transformOrigin: '22px 18px' }}>
        <path d="M22 18c-8-14-22-16-22-6s10 14 22 6z" fill={color} stroke="rgba(60,35,20,.3)" strokeWidth="1" />
        <path d="M22 20c-8 12-20 14-20 6s10-10 20-6z" fill={color} stroke="rgba(60,35,20,.3)" strokeWidth="1" />
      </g>
      <g className="wing-r" style={{ transformOrigin: '22px 18px' }}>
        <path d="M22 18c8-14 22-16 22-6s-10 14-22 6z" fill={color} stroke="rgba(60,35,20,.3)" strokeWidth="1" />
        <path d="M22 20c8 12 20 14 20 6s-10-10-20-6z" fill={color} stroke="rgba(60,35,20,.3)" strokeWidth="1" />
      </g>
      <rect x="20" y="8" width="4" height="20" rx="2" fill="#5B3D2E" />
    </svg>
  );
}
