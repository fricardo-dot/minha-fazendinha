// Peças de sombreado reutilizáveis (usam os ids de ArtDefs).
export const RIM = 'rgba(60, 35, 20, .28)'; // contorno fino e quente, só para separar do fundo

/** Sombra de contato no chão. */
export function Shadow({ x, y, rx, ry = rx * 0.32, opacity = 1 }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="url(#g-shadow)" opacity={opacity} />;
}

/** Brilho especular. */
export function Gloss({ x, y, rx, ry = rx * 0.6, opacity = 1 }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="url(#g-gloss)" opacity={opacity} />;
}

/** Olho "3D": esclera, íris escura, dois reflexos. */
export function Eye({ x, y, r = 8, dark = '#2A1F1B', look = { x: 0.15, y: 0.1 } }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="url(#s-white)" stroke={RIM} strokeWidth="1" />
      <circle cx={x + look.x * r} cy={y + look.y * r} r={r * 0.58} fill={dark} />
      <circle cx={x + look.x * r - r * 0.18} cy={y + look.y * r - r * 0.22} r={r * 0.22} fill="#fff" />
      <circle cx={x + look.x * r + r * 0.2} cy={y + look.y * r + r * 0.24} r={r * 0.1} fill="#fff" opacity=".8" />
    </g>
  );
}

/** Olho fechado / feliz (arco). */
export function EyeArc({ x, y, w = 14, happy, color = '#2A1F1B', width = 3.5 }) {
  const d = happy ? `M${x - w / 2} ${y}c${w * 0.25}-${w * 0.55} ${w * 0.75}-${w * 0.55} ${w} 0` : `M${x - w / 2} ${y}c${w * 0.25} ${w * 0.4} ${w * 0.75} ${w * 0.4} ${w} 0`;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />;
}

/** Bochecha rosada. */
export function Blush({ x, y, r = 6, opacity = .55 }) {
  return <circle cx={x} cy={y} r={r} fill="#FF8FA8" opacity={opacity} />;
}

/**
 * Caixa em 3/4 oblíqua: face da frente + face lateral direita + topo.
 * (x, y) = canto inferior esquerdo da frente; w/h = frente; d = profundidade (deslocada para cima-direita).
 */
export function Box({ x, y, w, h, d = 40, front, side, top, rim = RIM, rx = 0 }) {
  const dx = d * 0.9, dy = d * 0.5;
  return (
    <g>
      <polygon points={`${x + w},${y - h} ${x + w + dx},${y - h - dy} ${x + w + dx},${y - dy} ${x + w},${y}`} fill={side} stroke={rim} strokeWidth="1.2" strokeLinejoin="round" />
      <polygon points={`${x},${y - h} ${x + dx},${y - h - dy} ${x + w + dx},${y - h - dy} ${x + w},${y - h}`} fill={top} stroke={rim} strokeWidth="1.2" strokeLinejoin="round" />
      <rect x={x} y={y - h} width={w} height={h} rx={rx} fill={front} stroke={rim} strokeWidth="1.2" />
    </g>
  );
}
