// Vaca (SVG 300×240) em estilo "brinquedo 3D". Estágio 2: sino. Estágio 3: coroa de flores.
import { memo } from 'react';
import { Shadow, Gloss, Eye, EyeArc, Blush, RIM } from '../art/shading.jsx';

export const CowSprite = memo(function CowSprite({ expression = 'normal', stage = 1, dirt = 0, scruff = 0 }) {
  const sleeping = expression === 'sleep';
  const happy = expression === 'happy';
  const hungry = expression === 'hungry';
  const eating = expression === 'eating';
  return (
    <svg width="300" height="240" viewBox="0 0 300 240" aria-hidden="true">
      <Shadow x={150} y={230} rx={112} />
      {/* Rabo */}
      <path d="M46 120c-20 20-26 50-14 74" fill="none" stroke="#D9D3C8" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="34" cy="198" rx="9" ry="13" fill="url(#s-brown)" transform="rotate(20 34 198)" />
      {/* Pernas */}
      <g fill="url(#s-white)" stroke={RIM} strokeWidth="1.2">
        <rect x="70" y="160" width="30" height="66" rx="13" />
        <rect x="112" y="166" width="30" height="60" rx="13" />
        <rect x="172" y="166" width="30" height="60" rx="13" />
        <rect x="212" y="160" width="30" height="66" rx="13" />
      </g>
      <g fill="url(#s-dark)">
        <rect x="70" y="210" width="30" height="18" rx="8" /><rect x="112" y="212" width="30" height="16" rx="8" />
        <rect x="172" y="212" width="30" height="16" rx="8" /><rect x="212" y="210" width="30" height="18" rx="8" />
      </g>
      {/* Corpo */}
      <rect x="50" y="70" width="210" height="112" rx="54" fill="url(#s-white)" stroke={RIM} strokeWidth="1.4" />
      <ellipse cx="150" cy="176" rx="90" ry="10" fill="#B9B2A6" opacity=".25" />
      {/* Manchas */}
      <path d="M90 90c20-10 40 0 44 18s-14 34-34 28-30-36-10-46z" fill="url(#s-brown)" />
      <path d="M180 120c14-14 40-10 46 6s-8 32-26 30-34-22-20-36z" fill="url(#s-brown)" />
      <Gloss x={110} y={92} rx={34} ry={14} opacity={.55} />
      {/* Lama (banho) */}
      {dirt > 0 && (
        <g className="fz-dirt" style={{ opacity: dirt }}>
          <ellipse cx="85" cy="205" rx="18" ry="10" fill="url(#s-mud)" /><ellipse cx="227" cy="207" rx="17" ry="9" fill="url(#s-mud)" />
          <ellipse cx="128" cy="212" rx="12" ry="7" fill="url(#s-mud)" /><ellipse cx="188" cy="214" rx="13" ry="7" fill="url(#s-mud)" />
          <ellipse cx="110" cy="166" rx="20" ry="9" fill="url(#s-mud)" /><ellipse cx="230" cy="150" rx="12" ry="8" fill="url(#s-mud)" />
        </g>
      )}
      {scruff > 0 && (
        <g className="fz-scruff" style={{ opacity: scruff }} fill="none" stroke="#B9B2A6" strokeWidth="4" strokeLinecap="round">
          <path d="M96 72l-6-18M120 70l2-20M150 68l6-18M180 70l-2-20M210 74l8-16" />
        </g>
      )}
      {/* Úbere */}
      <path d="M120 176c0-12 60-12 60 0 0 14-14 22-30 22s-30-8-30-22z" fill="url(#s-pink)" stroke={RIM} strokeWidth="1.2" />
      <g fill="url(#s-pink)"><rect x="128" y="188" width="8" height="14" rx="4" /><rect x="146" y="192" width="8" height="14" rx="4" /><rect x="164" y="188" width="8" height="14" rx="4" /></g>
      {/* Cabeça */}
      <g transform="translate(206 20)">
        {/* Orelhas */}
        <ellipse cx="-58" cy="46" rx="22" ry="11" fill="url(#s-white)" stroke={RIM} strokeWidth="1.2" transform="rotate(-15 -58 46)" />
        <ellipse cx="-58" cy="46" rx="13" ry="5" fill="#FFB5C2" opacity=".8" transform="rotate(-15 -58 46)" />
        <ellipse cx="58" cy="46" rx="22" ry="11" fill="url(#s-white)" stroke={RIM} strokeWidth="1.2" transform="rotate(15 58 46)" />
        <ellipse cx="58" cy="46" rx="13" ry="5" fill="#FFB5C2" opacity=".8" transform="rotate(15 58 46)" />
        {/* Chifres */}
        <path d="M-30 18c-6-14-2-26 8-28 2 10 0 18-4 26M30 18c6-14 2-26-8-28-2 10 0 18 4 26" fill="url(#s-straw)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
        <ellipse cx="0" cy="60" rx="52" ry="48" fill="url(#s-white)" stroke={RIM} strokeWidth="1.4" />
        <Gloss x={-16} y={36} rx={20} ry={12} opacity={.6} />
        {/* Topete */}
        <path d="M-18 18c6-12 30-12 36 0-8-3-28-3-36 0z" fill="url(#s-brown)" />
        {/* Focinho */}
        <ellipse cx="0" cy="84" rx="34" ry="22" fill="url(#s-pink)" stroke={RIM} strokeWidth="1.2" />
        <ellipse cx="-12" cy="82" rx="5" ry="6" fill="#8A4A5A" /><ellipse cx="12" cy="82" rx="5" ry="6" fill="#8A4A5A" />
        {eating && <path d="M-12 98c6 6 18 6 24 0" fill="none" stroke="#8A4A5A" strokeWidth="3" strokeLinecap="round" />}
        {happy && <path d="M-14 96c6 8 22 8 28 0" fill="none" stroke="#8A4A5A" strokeWidth="3" strokeLinecap="round" />}
        {/* Olhos */}
        {sleeping || happy ? (
          <g><EyeArc x={-20} y={50} w={20} happy={happy} /><EyeArc x={20} y={50} w={20} happy={happy} /></g>
        ) : (
          <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <Eye x={-20} y={50} r={11} /><Eye x={20} y={50} r={11} />
          </g>
        )}
        {hungry && <path d="M-34 34c6-4 14-4 20 0M14 34c6-4 14-4 20 0" fill="none" stroke="#7A6A62" strokeWidth="3" strokeLinecap="round" />}
        <Blush x={-38} y={70} r={8} /><Blush x={38} y={70} r={8} />
        {stage >= 3 && (
          <g transform="translate(0 14)">
            {[-26, -13, 0, 13, 26].map((x, i) => (
              <g key={x} transform={`translate(${x} ${Math.abs(x) * 0.3})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5.5} cy={Math.sin((a * Math.PI) / 180) * 5.5} r="4" fill={['#FF6F91', '#FFD24A', '#C89BFF', '#6ECBF5', '#FF9F68'][i]} />
                ))}
                <circle r="2.6" fill="#FFF3B0" />
              </g>
            ))}
          </g>
        )}
      </g>
      {/* Estágio 2: coleira com sino */}
      {stage >= 2 && (
        <g transform="translate(206 104)">
          <path d="M-40 -6c10 20 70 20 80 0" fill="none" stroke="#E0574B" strokeWidth="9" strokeLinecap="round" />
          <path d="M-12 8c0-14 24-14 24 0v14a4 4 0 0 1-4 4h-16a4 4 0 0 1-4-4z" fill="url(#s-gold)" stroke={RIM} strokeWidth="1" />
          <circle cx="0" cy="26" r="4" fill="#7A5A1A" />
          <Gloss x={-4} y={8} rx={5} ry={4} />
        </g>
      )}
    </svg>
  );
});
