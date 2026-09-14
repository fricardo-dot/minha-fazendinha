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
