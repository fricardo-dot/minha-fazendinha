// Ícones dos itens que a criança carrega ou vê voar: milho, feno, ovo, leite, água, moeda.
// Todos em SVG próprio, estilo brinquedo (traço grosso e quente).
const STROKE = '#5B3D2E';

export function ItemIcon({ kind, size = 72 }) {
  const s = { width: size, height: size, display: 'block' };
  switch (kind) {
    case 'corn':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M22 54c-6-6-8-18-4-30S30 6 33 6c6 0 12 12 12 24s-6 24-12 26c-3 1-8 1-11-2z" fill="#FFD24A" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <g fill="#F0B429" opacity=".9">
            <circle cx="30" cy="18" r="2.4" /><circle cx="37" cy="20" r="2.4" /><circle cx="28" cy="27" r="2.4" /><circle cx="36" cy="29" r="2.4" />
            <circle cx="27" cy="36" r="2.4" /><circle cx="35" cy="38" r="2.4" /><circle cx="29" cy="45" r="2.4" /><circle cx="36" cy="46" r="2.4" />
          </g>
          <path d="M20 50c-8 0-12-8-14-14 6 0 12 4 14 8 M42 48c8-2 12-10 12-16-6 1-11 5-12 10" fill="#7CC15A" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      );
    case 'hay':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <rect x="8" y="18" width="48" height="34" rx="9" fill="#E8C466" stroke={STROKE} strokeWidth="3" />
          <path d="M14 26h36M14 34h36M14 42h36" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" />
          <path d="M20 18v34M44 18v34" stroke="#A97C3A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'egg':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M32 6c11 0 20 16 20 30 0 12-9 22-20 22S12 48 12 36C12 22 21 6 32 6z" fill="#FFF6E4" stroke={STROKE} strokeWidth="3" />
          <ellipse cx="25" cy="24" rx="4" ry="7" fill="#fff" opacity=".8" />
        </svg>
      );
    case 'milk':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M24 6h16v8l6 10v30a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V24l6-10z" fill="#F3FBFF" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <path d="M18 30h28v24a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" fill="#6ECBF5" opacity=".55" />
          <rect x="24" y="4" width="16" height="6" rx="2" fill="#E0574B" stroke={STROKE} strokeWidth="2.5" />
        </svg>
      );
    case 'water':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M14 24h30v26a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="#6ECBF5" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <path d="M44 30l12-8 4 4-14 12z" fill="#4FB3E0" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <path d="M22 24c0-8 4-12 8-12s8 4 8 12" fill="none" stroke={STROKE} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="58" cy="24" r="5" fill="#4FB3E0" stroke={STROKE} strokeWidth="2.5" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <circle cx="32" cy="32" r="26" fill="#FFD24A" stroke="#B8860B" strokeWidth="3" />
          <circle cx="32" cy="32" r="18" fill="none" stroke="#F0B429" strokeWidth="3" />
          <path d="M32 20v24M26 26h10a4 4 0 0 1 0 8h-8a4 4 0 0 0 0 8h10" fill="none" stroke="#B8860B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case 'sponge':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <rect x="8" y="22" width="48" height="30" rx="10" fill="#FFE066" stroke={STROKE} strokeWidth="3" />
          <g fill="#F0C040"><circle cx="20" cy="32" r="3" /><circle cx="34" cy="40" r="3.5" /><circle cx="44" cy="30" r="2.5" /><circle cx="26" cy="45" r="2.2" /></g>
          <g fill="#DDF3FB" stroke="#4FB3E0" strokeWidth="2">
            <circle cx="16" cy="16" r="6" /><circle cx="30" cy="10" r="4.5" /><circle cx="46" cy="14" r="5.5" /><circle cx="56" cy="24" r="3.5" />
          </g>
          <g fill="#fff"><circle cx="14" cy="14" r="1.6" /><circle cx="44" cy="12" r="1.6" /></g>
        </svg>
      );
    case 'brush':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M10 34c0-10 8-16 22-16s22 6 22 16v6H10z" fill="#D19A5B" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <rect x="24" y="8" width="16" height="14" rx="6" fill="#E0574B" stroke={STROKE} strokeWidth="3" />
          <g stroke="#A8703A" strokeWidth="3" strokeLinecap="round">
            <line x1="14" y1="40" x2="14" y2="54" /><line x1="21" y1="40" x2="21" y2="56" /><line x1="28" y1="40" x2="28" y2="55" />
            <line x1="35" y1="40" x2="35" y2="56" /><line x1="42" y1="40" x2="42" y2="55" /><line x1="49" y1="40" x2="49" y2="54" />
          </g>
        </svg>
      );
    case 'truffle':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M12 30c0-14 9-22 20-22s20 8 20 22c0 6-4 10-8 10H20c-4 0-8-4-8-10z" fill="#8E5E36" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <path d="M24 40h16v10a8 8 0 0 1-16 0z" fill="#E8C466" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <g fill="#FFF6E4"><circle cx="24" cy="24" r="4" /><circle cx="36" cy="18" r="3.5" /><circle cx="42" cy="30" r="3" /></g>
          <path d="M20 20c2-6 6-9 10-10" fill="none" stroke="#B9804F" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'wool':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <circle cx="32" cy="34" r="24" fill="#FFF6E4" stroke={STROKE} strokeWidth="3" />
          <g fill="none" stroke="#E3CFA8" strokeWidth="3" strokeLinecap="round">
            <path d="M12 26c10 4 30 4 40 0M10 38c12 4 32 4 44 0M20 14c4 12 4 28 0 40M44 14c-4 12-4 28 0 40" />
          </g>
          <path d="M50 24c6-8 10-6 12-2" fill="none" stroke={STROKE} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'shears':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <rect x="22" y="26" width="24" height="32" rx="8" fill="#E0574B" stroke={STROKE} strokeWidth="3" />
          <rect x="18" y="14" width="32" height="16" rx="5" fill="#DCE6EE" stroke={STROKE} strokeWidth="3" />
          <g stroke={STROKE} strokeWidth="2.5" strokeLinecap="round">
            <line x1="22" y1="10" x2="22" y2="14" /><line x1="28" y1="8" x2="28" y2="14" /><line x1="34" y1="8" x2="34" y2="14" /><line x1="40" y1="8" x2="40" y2="14" /><line x1="46" y1="10" x2="46" y2="14" />
          </g>
          <circle cx="34" cy="44" r="4" fill="#FFD24A" stroke={STROKE} strokeWidth="2" />
        </svg>
      );
    case 'seed':
      return (
        <svg viewBox="0 0 64 64" style={s}>
          <path d="M16 22h32l-4 34H20z" fill="#D19A5B" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <path d="M14 14h36v10H14z" fill="#E0574B" stroke={STROKE} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="26" cy="40" r="3" fill="#FFD24A" /><circle cx="36" cy="44" r="3" fill="#FFD24A" /><circle cx="32" cy="34" r="3" fill="#FFD24A" />
        </svg>
      );
    default:
      return null;
  }
}
