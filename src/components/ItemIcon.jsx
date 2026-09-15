// Ícones dos itens (milho, feno, ovo, leite, água, moeda, semente, esponja, escova, trufa, lã, tesoura)
// em estilo "3D": volumes com gradiente, brilho e contorno fino quente.
import { RIM } from '../art/shading.jsx';

const gloss = (cx, cy, rx, ry) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#g-gloss)" />;

export function ItemIcon({ kind, size = 72 }) {
  const s = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'corn':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M22 54c-6-6-8-18-4-30S30 6 33 6c6 0 12 12 12 24s-6 24-12 26c-3 1-8 1-11-2z" fill="url(#s-gold)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <g fill="#E0A81E" opacity=".65">
            <circle cx="30" cy="18" r="2.4" /><circle cx="37" cy="20" r="2.4" /><circle cx="28" cy="27" r="2.4" /><circle cx="36" cy="29" r="2.4" />
            <circle cx="27" cy="36" r="2.4" /><circle cx="35" cy="38" r="2.4" /><circle cx="29" cy="45" r="2.4" /><circle cx="36" cy="46" r="2.4" />
          </g>
          {gloss(28, 16, 5, 8)}
          <path d="M20 50c-8 0-12-8-14-14 6 0 12 4 14 8M42 48c8-2 12-10 12-16-6 1-11 5-12 10" fill="url(#s-leaf)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
        </svg>
      );
    case 'hay':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <rect x="8" y="18" width="48" height="34" rx="9" fill="url(#s-straw)" stroke={RIM} strokeWidth="1.2" />
          <path d="M14 26h36M14 34h36M14 42h36" stroke="#B8933D" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
          <path d="M20 18v34M44 18v34" stroke="#8E6B25" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          {gloss(20, 26, 8, 4)}
        </svg>
      );
    case 'egg':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M32 6c11 0 20 16 20 30 0 12-9 22-20 22S12 48 12 36C12 22 21 6 32 6z" fill="url(#s-shell)" stroke={RIM} strokeWidth="1.2" />
          {gloss(25, 22, 5, 9)}
        </svg>
      );
    case 'milk':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M24 6h16v8l6 10v30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V24l6-10z" fill="#EAF7FD" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M18 30h28v24a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#FFFFFF" />
          <path d="M18 30h28v24a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="url(#s-water)" opacity=".35" />
          <rect x="24" y="4" width="16" height="6" rx="2" fill="url(#s-red)" stroke={RIM} strokeWidth="1" />
          {gloss(24, 36, 3, 12)}
        </svg>
      );
    case 'water':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M14 24h30v26a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="url(#s-water)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M44 30l12-8 4 4-14 12z" fill="url(#s-blue)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <path d="M22 24c0-8 4-12 8-12s8 4 8 12" fill="none" stroke="#3D9BC9" strokeWidth="4" strokeLinecap="round" />
          <circle cx="58" cy="24" r="5" fill="url(#s-blue)" stroke={RIM} strokeWidth="1" />
          {gloss(22, 38, 3, 9)}
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <circle cx="32" cy="32" r="26" fill="url(#s-gold)" stroke="#B8860B" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="18" fill="none" stroke="#E0A81E" strokeWidth="2.5" />
          <path d="M32 20v24M26 26h10a4 4 0 0 1 0 8h-8a4 4 0 0 0 0 8h10" fill="none" stroke="#9A7A1A" strokeWidth="3.5" strokeLinecap="round" />
          {gloss(22, 20, 8, 5)}
        </svg>
      );
    case 'sponge':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <rect x="8" y="22" width="48" height="30" rx="10" fill="url(#s-yellow)" stroke={RIM} strokeWidth="1.2" />
          <g fill="#D9A81E" opacity=".45"><circle cx="20" cy="32" r="3" /><circle cx="34" cy="40" r="3.5" /><circle cx="44" cy="30" r="2.5" /><circle cx="26" cy="45" r="2.2" /></g>
          <g fill="#DDF6FF" stroke="#4FA9D6" strokeWidth="1.5" opacity=".95">
            <circle cx="16" cy="16" r="6" /><circle cx="30" cy="10" r="4.5" /><circle cx="46" cy="14" r="5.5" /><circle cx="56" cy="24" r="3.5" />
          </g>
          <g fill="#fff"><circle cx="14" cy="14" r="1.6" /><circle cx="44" cy="12" r="1.6" /></g>
          {gloss(18, 28, 6, 3)}
        </svg>
      );
    case 'brush':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M10 34c0-10 8-16 22-16s22 6 22 16v6H10z" fill="url(#s-wood)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <rect x="24" y="8" width="16" height="14" rx="6" fill="url(#s-red)" stroke={RIM} strokeWidth="1" />
          <g stroke="#9F6A3C" strokeWidth="3" strokeLinecap="round">
            <line x1="14" y1="40" x2="14" y2="54" /><line x1="21" y1="40" x2="21" y2="56" /><line x1="28" y1="40" x2="28" y2="55" />
            <line x1="35" y1="40" x2="35" y2="56" /><line x1="42" y1="40" x2="42" y2="55" /><line x1="49" y1="40" x2="49" y2="54" />
          </g>
          {gloss(22, 26, 8, 3)}
        </svg>
      );
    case 'truffle':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M12 30c0-14 9-22 20-22s20 8 20 22c0 6-4 10-8 10H20c-4 0-8-4-8-10z" fill="url(#s-mud)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M24 40h16v10a8 8 0 0 1-16 0z" fill="url(#s-straw)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <g fill="#FFF6E4" opacity=".85"><circle cx="24" cy="24" r="4" /><circle cx="36" cy="18" r="3.5" /><circle cx="42" cy="30" r="3" /></g>
          {gloss(22, 16, 6, 4)}
        </svg>
      );
    case 'wool':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <circle cx="32" cy="34" r="24" fill="url(#s-white)" stroke={RIM} strokeWidth="1.2" />
          <path d="M14 28c10-4 26-4 36 0M12 36c12 4 28 4 40 0M18 44c8 3 20 3 28 0" fill="none" stroke="#D9D3C8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 16c6 2 8 8 8 12" fill="none" stroke="#E3849A" strokeWidth="3" strokeLinecap="round" />
          {gloss(22, 24, 8, 5)}
        </svg>
      );
    case 'shears':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <rect x="18" y="24" width="28" height="32" rx="8" fill="url(#s-red)" stroke={RIM} strokeWidth="1.2" />
          <rect x="22" y="10" width="20" height="16" rx="3" fill="url(#f-metal)" stroke={RIM} strokeWidth="1" />
          <g stroke="#7A7F86" strokeWidth="2.5" strokeLinecap="round"><line x1="26" y1="6" x2="26" y2="12" /><line x1="32" y1="6" x2="32" y2="12" /><line x1="38" y1="6" x2="38" y2="12" /></g>
          <circle cx="32" cy="40" r="4" fill="#FFD84D" />
          {gloss(24, 32, 4, 8)}
        </svg>
      );
    case 'seed':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M16 22h32l-4 34H20z" fill="url(#s-wood)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M14 14h36v10H14z" fill="url(#s-red)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <circle cx="26" cy="40" r="3" fill="#FFD24A" /><circle cx="36" cy="44" r="3" fill="#FFD24A" /><circle cx="32" cy="34" r="3" fill="#FFD24A" />
        </svg>
      );
    default:
      return null;
  }
}
