// Galinha (SVG). Expressões por estado. Estágio 2: ninho bonito. Estágio 3: pintinho acompanhando.
import { memo } from 'react';

const INK = '#5B3D2E';

export const ChickenSprite = memo(function ChickenSprite({ expression = 'normal', stage = 1 }) {
  const sleeping = expression === 'sleep';
  const happy = expression === 'happy';
  const hungry = expression === 'hungry';
  const eating = expression === 'eating';
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="192" rx="62" ry="9" fill="rgba(60,40,20,.16)" />
      {/* Patas */}
      <g stroke="#F0A030" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M84 156v26M74 184h20M84 182l-8 8M84 182l8 8" />
        <path d="M116 156v26M106 184h20M116 182l-8 8M116 182l8 8" />
      </g>
      {/* Cauda */}
      <path d="M40 112c-18-10-26-34-16-50 6 12 14 16 22 18-6-12-4-24 4-32 4 14 12 20 20 24" fill="#FFF0D0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* Corpo */}
      <ellipse cx="100" cy="122" rx="62" ry="50" fill="#FFF6E4" stroke={INK} strokeWidth="4.5" />
      {/* Asa */}
      <path d="M62 118c10-16 40-20 56-8-10 22-40 30-56 8z" fill="#FFE8C4" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* Cabeça */}
      <circle cx="132" cy="70" r="36" fill="#FFF6E4" stroke={INK} strokeWidth="4.5" />
      {/* Crista */}
      <path d="M112 42c-2-14 8-20 14-12 2-14 16-16 18-4 6-8 18-4 14 8-4 8-10 10-18 10h-20c-4 0-8-1-8-2z" fill="#E0574B" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {/* Bico */}
      {eating ? (
        <g>
          <path d="M162 70l24 2-24 8z" fill="#F0A030" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M162 84l22 6-22 6z" fill="#E0891C" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      ) : (
        <path d="M162 72l26 6-26 10z" fill="#F0A030" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      )}
      {/* Barbela */}
      <path d="M156 88c6 2 8 12 2 18s-14 0-12-8" fill="#E0574B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {/* Olho */}
      {sleeping || happy ? (
        <path d={happy ? 'M134 66c4-6 12-6 16 0' : 'M134 70c4 4 12 4 16 0'} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      ) : (
        <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="142" cy="68" r="8" fill="#fff" stroke={INK} strokeWidth="3" />
          <circle cx="144" cy="69" r="4.2" fill={INK} />
          <circle cx="146" cy="66" r="1.5" fill="#fff" />
        </g>
      )}
      {hungry && <path d="M130 54c6-2 12 0 16 4" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
      {/* Bochecha */}
      <circle cx="122" cy="84" r="6" fill="#FFB5C2" opacity=".8" />

      {/* Estágio 3: pintinho */}
      {stage >= 3 && (
        <g transform="translate(20 130)">
          <ellipse cx="0" cy="58" rx="20" ry="4" fill="rgba(60,40,20,.15)" />
          <circle cx="0" cy="36" r="20" fill="#FFE066" stroke={INK} strokeWidth="3.5" />
          <circle cx="8" cy="16" r="14" fill="#FFE066" stroke={INK} strokeWidth="3.5" />
          <path d="M20 16l10 3-10 4z" fill="#F0A030" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="2.6" fill={INK} />
          <path d="M-8 36c6-6 16-6 20 2" fill="#FFD24A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <g stroke="#F0A030" strokeWidth="4" strokeLinecap="round"><path d="M-6 54v6M6 54v6" /></g>
        </g>
      )}
    </svg>
  );
});

/** Ninho fixo no pátio (estágio 2+ fica mais bonito). É onde o ovo aparece. */
export const Nest = memo(function Nest({ stage = 1 }) {
  return (
    <svg width="150" height="70" viewBox="0 0 150 70" aria-hidden="true">
      <ellipse cx="75" cy="62" rx="64" ry="7" fill="rgba(60,40,20,.14)" />
      <path d="M14 34c0 22 122 22 122 0 0 16-30 30-61 30S14 50 14 34z" fill="#C9A24A" stroke={INK} strokeWidth="3.5" />
      <ellipse cx="75" cy="34" rx="61" ry="14" fill="#E8C466" stroke={INK} strokeWidth="3.5" />
      <g stroke="#A97C3A" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M30 42c14 6 30 8 45 6M80 50c16 0 30-4 40-10M24 30c10-4 26-6 40-4M90 26c14 0 26 2 34 8" />
      </g>
      {stage >= 2 && (
        <g>
          <circle cx="30" cy="28" r="7" fill="#FF6F91" stroke={INK} strokeWidth="2" />
          <circle cx="120" cy="30" r="7" fill="#6ECBF5" stroke={INK} strokeWidth="2" />
          <circle cx="75" cy="52" r="6" fill="#FFD24A" stroke={INK} strokeWidth="2" />
          <path d="M10 40c-8-2-12-8-10-14 6 0 10 6 10 14z" fill="#8FD36A" stroke={INK} strokeWidth="2" />
          <path d="M140 40c8-2 12-8 10-14-6 0-10 6-10 14z" fill="#8FD36A" stroke={INK} strokeWidth="2" />
        </g>
      )}
    </svg>
  );
});
