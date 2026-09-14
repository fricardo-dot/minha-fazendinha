// Porquinho (SVG 200×150). Estados: normal, fome, comendo, feliz, dormindo.
// `muddy` (0..1) cobre o porquinho de lama depois de rolar; `scruff` para a escova.
// Estágio 2: laço na orelha. Estágio 3: coroa de flores e borboleta no focinho.
import { memo } from 'react';

const INK = '#5B3D2E';
const PINK = '#FFB5C2';
const PINK_DARK = '#F58FA5';

/** Manchas de lama em coordenadas locais do porquinho (usadas também pelo minigame). */
export const PIG_MUD_SPOTS = [
  { x: 60, y: 92, rx: 22, ry: 12 }, { x: 108, y: 106, rx: 26, ry: 13 }, { x: 150, y: 90, rx: 18, ry: 11 },
  { x: 86, y: 66, rx: 16, ry: 9 }, { x: 130, y: 60, rx: 14, ry: 8 }, { x: 46, y: 60, rx: 12, ry: 8 },
];

export const PigSprite = memo(function PigSprite({ expression = 'normal', stage = 1, muddy = 0, scruff = 0, mudAmounts = null }) {
  const sleeping = expression === 'sleep';
  const happy = expression === 'happy';
  const hungry = expression === 'hungry';
  const eating = expression === 'eating';
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" aria-hidden="true">
      <ellipse cx="100" cy="144" rx="72" ry="7" fill="rgba(60,40,20,.16)" />
      {/* Rabo enrolado */}
      <path d="M32 84c-10-4-16 2-12 8s12 4 10-2-8-6-10-2" fill="none" stroke={PINK_DARK} strokeWidth="4" strokeLinecap="round" />
      {/* Pernas */}
      <g fill={PINK} stroke={INK} strokeWidth="3.5">
        <rect x="52" y="108" width="22" height="34" rx="9" /><rect x="84" y="112" width="22" height="30" rx="9" />
        <rect x="118" y="112" width="22" height="30" rx="9" /><rect x="148" y="108" width="22" height="34" rx="9" />
      </g>
      <g fill={INK}>
        <rect x="52" y="132" width="22" height="10" rx="5" /><rect x="84" y="134" width="22" height="8" rx="4" />
        <rect x="118" y="134" width="22" height="8" rx="4" /><rect x="148" y="132" width="22" height="10" rx="5" />
      </g>
      {/* Corpo */}
      <ellipse cx="108" cy="84" rx="74" ry="46" fill={PINK} stroke={INK} strokeWidth="4" />
      {/* Barriga mais clara */}
      <ellipse cx="108" cy="104" rx="46" ry="20" fill="#FFD0D8" opacity=".8" />
      {/* Cabeça */}
      <circle cx="152" cy="62" r="38" fill={PINK} stroke={INK} strokeWidth="4" />
      {/* Orelhas */}
      <path d="M124 38c-4-16 4-26 14-24 4 6 2 16-4 22z" fill={PINK_DARK} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M176 36c6-16-2-26-12-24-4 6-2 16 4 22z" fill={PINK_DARK} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {/* Focinho */}
      <ellipse cx="168" cy="76" rx="20" ry="14" fill={PINK_DARK} stroke={INK} strokeWidth="3.5" />
      <ellipse cx="161" cy="76" rx="3.5" ry="5" fill={INK} /><ellipse cx="175" cy="76" rx="3.5" ry="5" fill={INK} />
      {/* Boca */}
      {eating && <path d="M150 96c8 8 22 8 30 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
      {happy && !eating && <path d="M148 94c10 10 26 10 34 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
      {/* Olhos */}
      {sleeping || happy ? (
        <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
          <path d={happy ? 'M132 56c4-6 12-6 16 0' : 'M132 58c4 5 12 5 16 0'} />
          <path d={happy ? 'M172 52c4-6 12-6 16 0' : 'M172 54c4 5 12 5 16 0'} />
        </g>
      ) : (
        <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx="140" cy="56" r="8" fill="#fff" stroke={INK} strokeWidth="2.5" /><circle cx="180" cy="52" r="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="142" cy="57" r="4.2" fill={INK} /><circle cx="182" cy="53" r="4.2" fill={INK} />
          <circle cx="144" cy="55" r="1.5" fill="#fff" /><circle cx="184" cy="51" r="1.5" fill="#fff" />
        </g>
      )}
      {hungry && <path d="M128 44c6-3 12-3 18 0M172 40c6-3 12-3 18 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />}
      {/* Bochecha */}
      <circle cx="130" cy="72" r="6" fill="#FF8FA8" opacity=".7" />

      {/* Lama (depois de rolar) — cada mancha pode ter quantidade própria (minigame) */}
      {(muddy > 0 || mudAmounts) && (
        <g className="fz-dirt">
          {PIG_MUD_SPOTS.map((m, i) => {
            const amt = mudAmounts ? mudAmounts[i] : muddy;
            if (amt <= 0.02) return null;
            return (
              <g key={i} style={{ opacity: Math.min(1, amt) }}>
                <ellipse cx={m.x} cy={m.y} rx={m.rx} ry={m.ry} fill="#8E5E36" />
                <ellipse cx={m.x - m.rx * 0.3} cy={m.y - m.ry * 0.3} rx={m.rx * 0.45} ry={m.ry * 0.4} fill="#A56F42" />
              </g>
            );
          })}
          {(mudAmounts ? mudAmounts[2] : muddy) > 0.3 && <circle cx="150" cy="40" r="6" fill="#8E5E36" opacity={mudAmounts ? mudAmounts[2] : muddy} />}
        </g>
      )}
      {/* Pelo arrepiado (escova) */}
      {scruff > 0 && (
        <g className="fz-scruff" style={{ opacity: scruff }} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M70 42l-6-14M90 38l-2-16M112 40l4-16" />
        </g>
      )}

      {/* Estágio 2: laço na orelha */}
      {stage >= 2 && (
        <g transform="translate(178 30)">
          <path d="M0 0l-12-8v16zM0 0l12-8v16z" fill="#E0574B" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <circle r="4" fill="#FFD24A" stroke={INK} strokeWidth="2" />
        </g>
      )}
      {/* Estágio 3: coroa de flores + borboleta */}
      {stage >= 3 && (
        <g>
          {[-18, -6, 6, 18].map((x, i) => (
            <g key={x} transform={`translate(${152 + x} ${26 + Math.abs(x) * 0.25})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 4.5} cy={Math.sin((a * Math.PI) / 180) * 4.5} r="3.2" fill={['#FF6F91', '#FFD24A', '#C89BFF', '#6ECBF5'][i]} stroke={INK} strokeWidth="1" />
              ))}
              <circle r="2" fill="#FFF3B0" />
            </g>
          ))}
          <g transform="translate(190 64)">
            <path d="M0 0c-5-9-13-10-14-3s6 9 14 3zM0 0c5-9 13-10 14-3s-6 9-14 3z" fill="#6ECBF5" stroke={INK} strokeWidth="1.6" />
            <line x1="0" y1="-4" x2="0" y2="6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}
    </svg>
  );
});
