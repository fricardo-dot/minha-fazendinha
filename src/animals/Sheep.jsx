// Ovelha (SVG 200×170) em estilo "brinquedo 3D". A lã é feita de tufos com volume;
// `wool` (0..1) controla o tamanho de todos, `woolAmounts` cada tufo (minigame de tosar).
import { memo } from 'react';
import { Shadow, Gloss, Eye, EyeArc, Blush, RIM } from '../art/shading.jsx';

export const SHEEP_WOOL_TUFTS = [
  { x: 70, y: 70, r: 40 }, { x: 110, y: 58, r: 44 }, { x: 150, y: 74, r: 36 },
  { x: 56, y: 104, r: 36 }, { x: 100, y: 102, r: 42 }, { x: 142, y: 108, r: 34 },
  { x: 118, y: 36, r: 30 },
];

export const SheepSprite = memo(function SheepSprite({ expression = 'normal', stage = 1, wool = 1, woolAmounts = null, dirt = 0, scruff = 0 }) {
  const sleeping = expression === 'sleep';
  const happy = expression === 'happy';
  const hungry = expression === 'hungry';
  const eating = expression === 'eating';
  const amt = (i) => (woolAmounts ? woolAmounts[i] : wool);
  const radius = (t, i) => t.r * (0.42 + 0.58 * Math.max(0, Math.min(1, amt(i))));
  return (
    <svg width="200" height="170" viewBox="0 0 200 170" aria-hidden="true">
      <Shadow x={100} y={163} rx={70} />
      {/* Pernas */}
      <g fill="url(#s-brown)" stroke={RIM} strokeWidth="1">
        <rect x="62" y="122" width="18" height="40" rx="8" /><rect x="90" y="126" width="18" height="36" rx="8" />
        <rect x="118" y="126" width="18" height="36" rx="8" /><rect x="144" y="122" width="18" height="40" rx="8" />
      </g>
      {/* Corpo base (aparece quando tosada) */}
      <ellipse cx="104" cy="92" rx="62" ry="40" fill="url(#s-cream)" stroke={RIM} strokeWidth="1.2" />
      {/* Lã */}
      <g fill="url(#s-white)" stroke={RIM} strokeWidth="1">
        {SHEEP_WOOL_TUFTS.map((t, i) => <circle key={i} cx={t.x} cy={t.y} r={radius(t, i)} />)}
      </g>
      {SHEEP_WOOL_TUFTS.slice(0, 3).map((t, i) => <Gloss key={i} x={t.x - 8} y={t.y - 12} rx={radius(t, i) * 0.4} ry={radius(t, i) * 0.25} opacity={.5} />)}
      {dirt > 0 && (
        <g className="fz-dirt" style={{ opacity: dirt }}>
          <ellipse cx="80" cy="118" rx="14" ry="8" fill="url(#s-mud)" /><ellipse cx="128" cy="122" rx="12" ry="7" fill="url(#s-mud)" />
          <circle cx="60" cy="90" r="6" fill="url(#s-mud)" />
        </g>
      )}
      {scruff > 0 && (
        <g className="fz-scruff" style={{ opacity: scruff }} fill="none" stroke="#CFCBC3" strokeWidth="3" strokeLinecap="round">
          <path d="M60 46l-8-14M96 30l-2-16M136 40l8-14M164 70l14-6" />
        </g>
      )}
      {/* Cabeça */}
      <g transform="translate(160 78)">
        <ellipse cx="-24" cy="-6" rx="12" ry="7" fill="url(#s-brown)" stroke={RIM} strokeWidth="1" transform="rotate(-20 -24 -6)" />
        <ellipse cx="24" cy="-6" rx="12" ry="7" fill="url(#s-brown)" stroke={RIM} strokeWidth="1" transform="rotate(20 24 -6)" />
        <ellipse cx="0" cy="0" rx="26" ry="30" fill="url(#s-brown)" stroke={RIM} strokeWidth="1.2" />
        <Gloss x={-8} y={-12} rx={10} ry={7} opacity={.35} />
        {/* Topete de lã */}
        <circle cx="-8" cy="-26" r="12" fill="url(#s-white)" stroke={RIM} strokeWidth="1" />
        <circle cx="8" cy="-28" r="13" fill="url(#s-white)" stroke={RIM} strokeWidth="1" />
        {sleeping || happy ? (
          <g><EyeArc x={-10} y={-4} w={12} happy={happy} color="#fff" width={3} /><EyeArc x={10} y={-4} w={12} happy={happy} color="#fff" width={3} /></g>
        ) : (
          <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <Eye x={-10} y={-4} r={7} /><Eye x={10} y={-4} r={7} />
          </g>
        )}
        {hungry && <path d="M-18 -14c4-3 10-3 14 0M4 -14c4-3 10-3 14 0" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />}
        <ellipse cx="0" cy="14" rx="9" ry="6" fill="#6B5A54" />
        <path d={eating ? 'M-8 22c4 5 12 5 16 0' : happy ? 'M-8 20c4 6 12 6 16 0' : 'M-6 22c3 2 9 2 12 0'} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <Blush x={-18} y={10} r={4} /><Blush x={18} y={10} r={4} />
        {stage >= 3 && (
          <g transform="translate(0 -36)">
            {[-16, -5, 6, 17].map((x, i) => (
              <g key={x} transform={`translate(${x} ${Math.abs(x) * 0.2})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 4} cy={Math.sin((a * Math.PI) / 180) * 4} r="2.8" fill={['#FF6F91', '#FFD24A', '#C89BFF', '#6ECBF5'][i]} />
                ))}
                <circle r="1.8" fill="#FFF3B0" />
              </g>
            ))}
          </g>
        )}
      </g>
      {stage >= 2 && (
        <g transform="translate(150 112)">
          <path d="M-14 -10c6 12 22 12 28 0" fill="none" stroke="#E0574B" strokeWidth="6" strokeLinecap="round" />
          <path d="M-8 4c0-10 16-10 16 0v9a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3z" fill="url(#s-gold)" stroke={RIM} strokeWidth="1" />
          <circle cx="0" cy="16" r="3" fill="#7A5A1A" />
        </g>
      )}
      {stage >= 3 && (
        <g transform="translate(44 80)">
          <path d="M0 0l-10-7v14zM0 0l10-7v14z" fill="url(#s-blue)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <circle r="3" fill="url(#s-gold)" />
        </g>
      )}
    </svg>
  );
});
