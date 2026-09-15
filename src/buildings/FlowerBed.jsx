// Canteiro de flores em 3/4: terra com borda de pedrinhas; antes da melhoria é só uma marcação suave.
import { memo } from 'react';
import { LAYOUT } from '../config/layout.js';
import { Shadow, RIM } from '../art/shading.jsx';

const FLOWERS = [
  { x: 50, y: 118, c: 's-pink', s: 1 }, { x: 105, y: 96, c: 's-yellow', s: .9 }, { x: 160, y: 122, c: 's-blue', s: 1.05 },
  { x: 215, y: 94, c: 's-orange', s: .9 }, { x: 270, y: 120, c: 's-pink', s: .95 }, { x: 325, y: 100, c: 's-blue', s: .85 },
  { x: 130, y: 62, c: 's-white', s: .8 }, { x: 250, y: 64, c: 's-yellow', s: .8 },
];

export const FlowerBed = memo(function FlowerBed({ planted }) {
  const { x, y, w, h } = LAYOUT.flowerbed;
  return (
    <svg className="fz-box" style={{ left: x, top: y }} width={w} height={h} viewBox="0 0 380 160" aria-hidden="true">
      {planted ? (
        <g>
          <Shadow x={190} y={136} rx={180} ry={20} />
          <ellipse cx="190" cy="120" rx="176" ry="30" fill="url(#f-soil)" stroke={RIM} strokeWidth="1.2" />
          <ellipse cx="190" cy="116" rx="160" ry="22" fill="url(#p-soil)" />
          {/* Pedrinhas da borda */}
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <ellipse key={i} cx={190 + Math.cos(a) * 178} cy={122 + Math.sin(a) * 30} rx="9" ry="5" fill="url(#s-gray)" />;
          })}
          {FLOWERS.map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
              <g className="fz-flower" style={{ animationDelay: `${i * 0.35}s`, transformBox: 'fill-box', transformOrigin: '50% 100%' }}>
                <line x1="0" y1="0" x2="0" y2="-40" stroke="#4F9E36" strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="-9" cy="-20" rx="10" ry="5" fill="url(#s-leaf)" transform="rotate(-30 -9 -20)" />
                <ellipse cx="9" cy="-28" rx="10" ry="5" fill="url(#s-leaf)" transform="rotate(30 9 -28)" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 13} cy={-40 + Math.sin((a * Math.PI) / 180) * 13} r="10" fill={`url(#${f.c})`} />
                ))}
                <circle cx="0" cy="-40" r="7" fill="url(#s-gold)" />
              </g>
            </g>
          ))}
        </g>
      ) : (
        <ellipse cx="190" cy="120" rx="170" ry="28" fill="#C6EC9E" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 12" opacity=".4" />
      )}
    </svg>
  );
});
