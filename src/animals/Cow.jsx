// Vaca (SVG). Estágio 2: sino no pescoço. Estágio 3: coroa de flores e rabo que abana.
import { memo } from 'react';

const INK = '#5B3D2E';

export const CowSprite = memo(function CowSprite({ expression = 'normal', stage = 1 }) {
  const sleeping = expression === 'sleep';
  const happy = expression === 'happy';
  const hungry = expression === 'hungry';
  const eating = expression === 'eating';
  return (
    <svg width="300" height="240" viewBox="0 0 300 240" aria-hidden="true">
      <ellipse cx="150" cy="232" rx="110" ry="10" fill="rgba(60,40,20,.16)" />
      {/* Rabo */}
      <g className={stage >= 3 ? 'fz-tail' : ''} style={{ transformBox: 'fill-box', transformOrigin: '10% 10%' }}>
        <path d="M46 120c-20 20-26 50-14 74" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M32 194c-10 8-6 20 4 18s10-14 2-18" fill="#5B3D2E" />
      </g>
      {/* Pernas */}
      <g fill="#FFFFFF" stroke={INK} strokeWidth="4">
        <rect x="70" y="160" width="30" height="66" rx="12" />
        <rect x="112" y="166" width="30" height="60" rx="12" />
        <rect x="172" y="166" width="30" height="60" rx="12" />
        <rect x="212" y="160" width="30" height="66" rx="12" />
      </g>
      <g fill="#5B3D2E">
        <rect x="70" y="210" width="30" height="18" rx="8" /><rect x="112" y="212" width="30" height="16" rx="8" />
        <rect x="172" y="212" width="30" height="16" rx="8" /><rect x="212" y="210" width="30" height="18" rx="8" />
      </g>
      {/* Corpo */}
      <rect x="50" y="70" width="210" height="112" rx="52" fill="#FFFFFF" stroke={INK} strokeWidth="4.5" />
      {/* Manchas */}
      <path d="M90 90c20-10 40 0 44 18s-14 34-34 28-30-36-10-46z" fill="#4A3B36" />
      <path d="M180 120c14-14 40-10 46 6s-8 32-26 30-34-22-20-36z" fill="#4A3B36" />
      {/* Úbere */}
      <path d="M120 176c0-12 60-12 60 0 0 14-14 22-30 22s-30-8-30-22z" fill="#FFB5C2" stroke={INK} strokeWidth="3.5" />
      <g fill="#FFB5C2" stroke={INK} strokeWidth="2.5"><rect x="128" y="188" width="8" height="14" rx="4" /><rect x="146" y="192" width="8" height="14" rx="4" /><rect x="164" y="188" width="8" height="14" rx="4" /></g>
      {/* Cabeça */}
      <g transform="translate(206 20)">
        <ellipse cx="0" cy="60" rx="52" ry="48" fill="#FFFFFF" stroke={INK} strokeWidth="4.5" />
        {/* Orelhas */}
        <path d="M-48 40c-16-8-30-2-30 8s14 14 30 6z" fill="#FFFFFF" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-56 46c-8-2-14 0-14 4s6 6 14 2z" fill="#FFB5C2" />
        <path d="M48 40c16-8 30-2 30 8s-14 14-30 6z" fill="#FFFFFF" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M56 46c8-2 14 0 14 4s-6 6-14 2z" fill="#FFB5C2" />
        {/* Chifres */}
        <path d="M-30 18c-6-14-2-26 8-28 2 10 0 18-4 26M30 18c6-14 2-26-8-28-2 10 0 18 4 26" fill="#E8C466" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        {/* Topete */}
        <path d="M-14 16c4-10 24-10 28 0-6-2-22-2-28 0z" fill="#4A3B36" />
        {/* Focinho */}
        <ellipse cx="0" cy="84" rx="34" ry="22" fill="#FFB5C2" stroke={INK} strokeWidth="4" />
        <ellipse cx="-12" cy="82" rx="5" ry="6" fill={INK} /><ellipse cx="12" cy="82" rx="5" ry="6" fill={INK} />
        {eating && <path d="M-12 98c6 6 18 6 24 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
        {happy && <path d="M-14 96c6 8 22 8 28 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
        {/* Olhos */}
        {sleeping || happy ? (
          <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
            <path d={happy ? 'M-30 50c5-8 15-8 20 0' : 'M-30 52c5 6 15 6 20 0'} />
            <path d={happy ? 'M10 50c5-8 15-8 20 0' : 'M10 52c5 6 15 6 20 0'} />
          </g>
        ) : (
          <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="-20" cy="50" r="11" fill="#fff" stroke={INK} strokeWidth="3" />
            <circle cx="20" cy="50" r="11" fill="#fff" stroke={INK} strokeWidth="3" />
            <circle cx="-17" cy="52" r="5.5" fill={INK} /><circle cx="23" cy="52" r="5.5" fill={INK} />
            <circle cx="-15" cy="49" r="2" fill="#fff" /><circle cx="25" cy="49" r="2" fill="#fff" />
          </g>
        )}
        {hungry && (
          <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
            <path d="M-34 34c6-4 14-4 20 0M14 34c6-4 14-4 20 0" />
          </g>
        )}
        {/* Bochechas */}
        <circle cx="-38" cy="70" r="7" fill="#FFB5C2" opacity=".8" /><circle cx="38" cy="70" r="7" fill="#FFB5C2" opacity=".8" />
        {/* Estágio 3: coroa de flores */}
        {stage >= 3 && (
          <g transform="translate(0 14)">
            {[-26, -13, 0, 13, 26].map((x, i) => (
              <g key={x} transform={`translate(${x} ${Math.abs(x) * 0.3})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5.5} cy={Math.sin((a * Math.PI) / 180) * 5.5} r="4" fill={['#FF6F91', '#FFD24A', '#C89BFF', '#6ECBF5', '#FF9F68'][i]} stroke={INK} strokeWidth="1.2" />
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
          <path d="M-12 8c0-14 24-14 24 0v14a4 4 0 0 1-4 4h-16a4 4 0 0 1-4-4z" fill="#FFD24A" stroke={INK} strokeWidth="3" />
          <circle cx="0" cy="26" r="4" fill={INK} />
        </g>
      )}
    </svg>
  );
});
