// Fundo da fazenda: céu, sol, nuvens, colinas, chão, caminho e espaços reservados para expansão.
import { memo } from 'react';
import { STAGE } from '../config/layout.js';

export const Backdrop = memo(function Backdrop() {
  const { width: W, height: H } = STAGE;
  return (
    <svg className="fz-box" style={{ left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9DFF3" />
          <stop offset="1" stopColor="#DDF3FB" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#95D66F" />
          <stop offset="1" stopColor="#6DBB4C" />
        </linearGradient>
        <radialGradient id="sunglow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF3B0" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFF3B0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Céu */}
      <rect width={W} height={H} fill="url(#sky)" />
      <circle cx="1380" cy="120" r="150" fill="url(#sunglow)" />
      <circle cx="1380" cy="120" r="62" fill="#FFD24A" stroke="#F0B429" strokeWidth="6" />

      {/* Nuvens */}
      <g fill="#FFFFFF" opacity=".95">
        <Cloud x={220} y={110} s={1} />
        <Cloud x={720} y={70} s={.8} />
        <Cloud x={1080} y={150} s={.65} />
      </g>

      {/* Colinas distantes */}
      <path d="M0 330 C 200 230, 420 250, 600 310 S 1000 240, 1200 300 S 1500 260, 1600 300 L1600 420 L0 420 Z" fill="#B7E3A1" />
      <path d="M0 380 C 260 300, 520 330, 760 370 S 1200 300, 1600 370 L1600 460 L0 460 Z" fill="#A5DA8A" />

      {/* Árvores ao fundo */}
      <Tree x={40} y={360} s={.9} />
      <Tree x={560} y={340} s={.7} />
      <Tree x={1010} y={330} s={.75} />
      <Tree x={1590} y={350} s={.85} />

      {/* Chão */}
      <path d="M0 400 C 300 370, 600 390, 800 380 S 1300 360, 1600 390 L1600 1000 L0 1000 Z" fill="url(#ground)" />

      {/* Espaços reservados para expansão (sutis) */}
      <g opacity=".35" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 14" fill="#C7F0FA">
        <ellipse cx="1280" cy="445" rx="110" ry="30" />
      </g>
      <g opacity=".28" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="12 14" fill="#B8E39B">
        <ellipse cx="760" cy="430" rx="120" ry="28" />
      </g>

      {/* Caminho de terra */}
      <path d="M520 1000 C 560 900, 700 860, 900 830 S 1250 800, 1330 700 S 1420 620, 1470 640" fill="none" stroke="#E9C9A0" strokeWidth="70" strokeLinecap="round" opacity=".85" />
      <path d="M520 1000 C 560 900, 700 860, 900 830 S 1250 800, 1330 700 S 1420 620, 1470 640" fill="none" stroke="#F4DDBB" strokeWidth="44" strokeLinecap="round" opacity=".9" />

      {/* Tufos de grama */}
      <g fill="#5FAF42" opacity=".8">
        <Tuft x={620} y={760} /><Tuft x={1060} y={740} /><Tuft x={980} y={950} /><Tuft x={560} y={520} /><Tuft x={1540} y={820} /><Tuft x={40} y={740} />
      </g>

      {/* Cerca do pasto */}
      <Fence x1={590} x2={1050} y={720} />
      <Fence x1={590} x2={1050} y={478} short />
    </svg>
  );
});

function Cloud({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="80" ry="34" />
      <circle cx="-30" cy="-16" r="34" />
      <circle cx="20" cy="-26" r="42" />
      <circle cx="60" cy="-8" r="30" />
    </g>
  );
}

function Tree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-10" y="-10" width="20" height="50" rx="6" fill="#A8703A" />
      <circle cx="0" cy="-40" r="46" fill="#5FAF42" />
      <circle cx="-30" cy="-20" r="34" fill="#6DBB4C" />
      <circle cx="30" cy="-22" r="34" fill="#6DBB4C" />
      <circle cx="-12" cy="-46" r="8" fill="#E0574B" /><circle cx="18" cy="-28" r="8" fill="#E0574B" />
    </g>
  );
}

function Tuft({ x, y }) {
  return <path transform={`translate(${x} ${y})`} d="M0 0c-4-14-10-20-16-24 8 2 14 8 16 14 2-10 8-18 16-22-8 8-12 18-12 32z" />;
}

function Fence({ x1, x2, y, short }) {
  const posts = [];
  for (let x = x1; x <= x2; x += 92) posts.push(x);
  const h = short ? 44 : 64;
  return (
    <g>
      <rect x={x1} y={y - h + 14} width={x2 - x1} height="12" rx="6" fill="#E3B47C" stroke="#A8703A" strokeWidth="3" />
      <rect x={x1} y={y - h / 2 + 8} width={x2 - x1} height="12" rx="6" fill="#E3B47C" stroke="#A8703A" strokeWidth="3" />
      {posts.map((x) => (
        <g key={x}>
          <rect x={x - 9} y={y - h} width="18" height={h} rx="6" fill="#F0C58D" stroke="#A8703A" strokeWidth="3" />
          <path d={`M${x - 9} ${y - h + 4} L${x} ${y - h - 8} L${x + 9} ${y - h + 4}`} fill="#F0C58D" stroke="#A8703A" strokeWidth="3" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}
