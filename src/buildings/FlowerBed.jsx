// Canteiro de flores: antes da melhoria é só um pedaço de terra suave; depois floresce.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';

const FLOWERS = [
  { x: 40, y: 120, c: '#FF6F91', s: 1 }, { x: 95, y: 100, c: '#FFD24A', s: .85 }, { x: 150, y: 125, c: '#C89BFF', s: 1.05 },
  { x: 205, y: 98, c: '#FF9F68', s: .9 }, { x: 260, y: 122, c: '#FF6F91', s: .95 }, { x: 315, y: 104, c: '#6ECBF5', s: .85 },
  { x: 120, y: 60, c: '#FFFFFF', s: .8 }, { x: 240, y: 62, c: '#FFD24A', s: .8 },
];

export const FlowerBed = memo(function FlowerBed({ planted }) {
  const { x, y, w, h } = LAYOUT.flowerbed;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox="0 0 360 150" aria-hidden="true">
      <ellipse cx="180" cy="120" rx="170" ry="26" fill={planted ? '#8E5E36' : '#A9D58C'} stroke={planted ? '#5B3D2E' : '#FFFFFF'} strokeWidth="4" strokeDasharray={planted ? '0' : '12 14'} opacity={planted ? 1 : .5} />
      {planted && (
        <g>
          <ellipse cx="180" cy="116" rx="156" ry="18" fill="#B9804F" opacity=".7" />
          {FLOWERS.map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
            <g className="fz-flower" style={{ animationDelay: `${i * 0.35}s`, transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
              <line x1="0" y1="0" x2="0" y2="-40" stroke="#5FAF42" strokeWidth="6" strokeLinecap="round" />
              <path d="M0 -20c-14-2-20-10-18-16 8 0 14 6 18 16z" fill="#6DBB4C" />
              <path d="M0 -26c14-4 20-12 18-18-8 0-14 8-18 18z" fill="#6DBB4C" />
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 13} cy={-40 + Math.sin((a * Math.PI) / 180) * 13} r="10" fill={f.c} stroke="#5B3D2E" strokeWidth="2" />
              ))}
              <circle cx="0" cy="-40" r="7" fill="#FFF3B0" stroke="#5B3D2E" strokeWidth="2" />
            </g>
            </g>
          ))}
          {/* Borboleta */}
          <g transform="translate(300 30)">
            <path d="M0 0c-6-12-18-14-20-4s8 12 20 4zM0 0c6-12 18-14 20-4s-8 12-20 4z" fill="#FFD24A" stroke="#5B3D2E" strokeWidth="2" />
            <line x1="0" y1="-6" x2="0" y2="8" stroke="#5B3D2E" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      )}
    </svg>
  );
});
