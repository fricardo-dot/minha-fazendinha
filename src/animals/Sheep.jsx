// Ovelha (SVG 200×170). A lã é feita de tufos; `wool` (0..1) controla o tamanho de todos,
// `woolAmounts` (array) controla cada tufo (usado pelo minigame de tosar).
// Estágio 2: sino. Estágio 3: coroa de flores e laço.
import { memo } from 'react';

const INK = '#5B3D2E';
const FACE = '#4A3B36';
const WOOL = '#FFF6E4';

/** Tufos de lã em coordenadas locais (usados também pelo minigame). */
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
      <ellipse cx="100" cy="164" rx="66" ry="7" fill="rgba(60,40,20,.16)" />
      {/* Pernas */}
      <g fill={FACE} stroke={INK} strokeWidth="3">
        <rect x="62" y="122" width="18" height="40" rx="8" /><rect x="90" y="126" width="18" height="36" rx="8" />
        <rect x="118" y="126" width="18" height="36" rx="8" /><rect x="144" y="122" width="18" height="40" rx="8" />
      </g>
      {/* Corpo base (aparece quando tosada) */}
      <ellipse cx="104" cy="92" rx="62" ry="40" fill="#F3E4C8" stroke={INK} strokeWidth="4" />
      {/* Lã */}
      <g fill={WOOL} stroke={INK} strokeWidth="3.5">
        {SHEEP_WOOL_TUFTS.map((t, i) => <circle key={i} cx={t.x} cy={t.y} r={radius(t, i)} />)}
      </g>
      {/* Sujeira (banho) */}
      {dirt > 0 && (
        <g className="fz-dirt" style={{ opacity: dirt }}>
          <ellipse cx="80" cy="118" rx="14" ry="8" fill="#A56F42" /><ellipse cx="128" cy="122" rx="12" ry="7" fill="#8E5E36" />
          <circle cx="60" cy="90" r="6" fill="#A56F42" />
        </g>
      )}
      {/* Lã despenteada (escova) */}
      {scruff > 0 && (
        <g className="fz-scruff" style={{ opacity: scruff }} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M60 46l-8-14M96 30l-2-16M136 40l8-14M164 70l14-6" />
        </g>
      )}
      {/* Cabeça */}
      <g transform="translate(160 78)">
        <ellipse cx="0" cy="0" rx="26" ry="30" fill={FACE} stroke={INK} strokeWidth="4" />
        {/* Orelhas */}
        <ellipse cx="-24" cy="-6" rx="12" ry="7" fill={FACE} stroke={INK} strokeWidth="3" transform="rotate(-20 -24 -6)" />
        <ellipse cx="24" cy="-6" rx="12" ry="7" fill={FACE} stroke={INK} strokeWidth="3" transform="rotate(20 24 -6)" />
        {/* Topete de lã */}
        <circle cx="-8" cy="-26" r="12" fill={WOOL} stroke={INK} strokeWidth="3" />
        <circle cx="8" cy="-28" r="13" fill={WOOL} stroke={INK} strokeWidth="3" />
        {/* Olhos */}
        {sleeping || happy ? (
          <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
            <path d={happy ? 'M-16 -4c3-5 9-5 12 0' : 'M-16 -2c3 4 9 4 12 0'} />
            <path d={happy ? 'M4 -4c3-5 9-5 12 0' : 'M4 -2c3 4 9 4 12 0'} />
          </g>
        ) : (
          <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="-10" cy="-4" r="7" fill="#fff" /><circle cx="10" cy="-4" r="7" fill="#fff" />
            <circle cx="-8" cy="-3" r="3.6" fill={INK} /><circle cx="12" cy="-3" r="3.6" fill={INK} />
            <circle cx="-7" cy="-5" r="1.3" fill="#fff" /><circle cx="13" cy="-5" r="1.3" fill="#fff" />
          </g>
        )}
        {hungry && <path d="M-18 -14c4-3 10-3 14 0M4 -14c4-3 10-3 14 0" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />}
        {/* Focinho */}
        <ellipse cx="0" cy="14" rx="9" ry="6" fill="#6B5A54" />
        <path d={eating ? 'M-8 22c4 5 12 5 16 0' : happy ? 'M-8 20c4 6 12 6 16 0' : 'M-6 22c3 2 9 2 12 0'} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="-18" cy="10" r="4" fill="#FFB5C2" opacity=".7" /><circle cx="18" cy="10" r="4" fill="#FFB5C2" opacity=".7" />
        {/* Estágio 3: coroa de flores */}
        {stage >= 3 && (
          <g transform="translate(0 -36)">
            {[-16, -5, 6, 17].map((x, i) => (
              <g key={x} transform={`translate(${x} ${Math.abs(x) * 0.2})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 4} cy={Math.sin((a * Math.PI) / 180) * 4} r="2.8" fill={['#FF6F91', '#FFD24A', '#C89BFF', '#6ECBF5'][i]} stroke={INK} strokeWidth="1" />
                ))}
                <circle r="1.8" fill="#FFF3B0" />
              </g>
            ))}
          </g>
        )}
      </g>
      {/* Estágio 2: sino */}
      {stage >= 2 && (
        <g transform="translate(150 112)">
          <path d="M-14 -10c6 12 22 12 28 0" fill="none" stroke="#E0574B" strokeWidth="6" strokeLinecap="round" />
          <path d="M-8 4c0-10 16-10 16 0v9a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3z" fill="#FFD24A" stroke={INK} strokeWidth="2.5" />
          <circle cx="0" cy="16" r="3" fill={INK} />
        </g>
      )}
      {/* Estágio 3: laço na cauda */}
      {stage >= 3 && (
        <g transform="translate(44 80)">
          <path d="M0 0l-10-7v14zM0 0l10-7v14z" fill="#6ECBF5" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <circle r="3" fill="#FFD24A" stroke={INK} strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
});
