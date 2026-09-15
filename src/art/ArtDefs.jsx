// Definições de arte compartilhadas (gradientes e padrões) referenciadas por id em todos os SVGs.
// Montado uma vez no App. Luz vem do alto-esquerda; volumes usam gradientes radiais "esféricos".
import { memo } from 'react';

/** Gradiente esférico: claro no alto-esquerda, base no meio, sombra embaixo-direita. */
function Sphere({ id, light, base, dark }) {
  return (
    <radialGradient id={id} cx="35%" cy="30%" r="78%">
      <stop offset="0" stopColor={light} />
      <stop offset="0.45" stopColor={base} />
      <stop offset="1" stopColor={dark} />
    </radialGradient>
  );
}

/** Gradiente vertical para faces planas (topo mais claro). */
function Face({ id, top, bottom }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={top} />
      <stop offset="1" stopColor={bottom} />
    </linearGradient>
  );
}

export const ArtDefs = memo(function ArtDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true" focusable="false">
      <defs>
        {/* Corpos de animais */}
        <Sphere id="s-cream" light="#FFFDF6" base="#FFF3DC" dark="#E4CDA6" />
        <Sphere id="s-white" light="#FFFFFF" base="#F7F7F5" dark="#CFCBC3" />
        <Sphere id="s-pink" light="#FFD6DF" base="#FFB5C2" dark="#E3849A" />
        <Sphere id="s-pinkdark" light="#FFB9C7" base="#F58FA5" dark="#C9647B" />
        <Sphere id="s-brown" light="#6A5852" base="#4A3B36" dark="#2E2320" />
        <Sphere id="s-dark" light="#4F4540" base="#2F2724" dark="#1B1512" />
        <Sphere id="s-red" light="#FF8F82" base="#E85B4E" dark="#A83A30" />
        <Sphere id="s-orange" light="#FFC96B" base="#F5A233" dark="#C4741B" />
        <Sphere id="s-yellow" light="#FFF0A8" base="#FFD84D" dark="#D9A81E" />
        <Sphere id="s-gold" light="#FFF6C4" base="#FFD24A" dark="#C99A1F" />
        <Sphere id="s-green" light="#B9EE8C" base="#7CC15A" dark="#4B8F35" />
        <Sphere id="s-leaf" light="#8FDA66" base="#5FAF42" dark="#3B7D2A" />
        <Sphere id="s-blue" light="#C3EEFF" base="#6ECBF5" dark="#3D9BC9" />
        <Sphere id="s-water" light="#DDF6FF" base="#8AD8F7" dark="#4FA9D6" />
        <Sphere id="s-mud" light="#B98A5F" base="#8E5E36" dark="#5B3A21" />
        <Sphere id="s-wood" light="#F0C48C" base="#D9A066" dark="#9F6A3C" />
        <Sphere id="s-straw" light="#FFEFB0" base="#EACB6E" dark="#B8933D" />
        <Sphere id="s-gray" light="#F4F6F8" base="#CFD6DC" dark="#96A0A8" />
        <Sphere id="s-shell" light="#FFFFFF" base="#FFF8EA" dark="#E3D2B4" />

        {/* Faces de construções */}
        <Face id="f-cream" top="#FFF7E6" bottom="#F1DFC0" />
        <Face id="f-cream-side" top="#E9D5B4" bottom="#D2B88F" />
        <Face id="f-wood" top="#E6B47C" bottom="#C58A52" />
        <Face id="f-wood-side" top="#C08650" bottom="#9A6538" />
        <Face id="f-wood-top" top="#F5D3A5" bottom="#E3B47C" />
        <Face id="f-red" top="#EE6D60" bottom="#C74B40" />
        <Face id="f-red-side" top="#C24A3F" bottom="#963429" />
        <Face id="f-roof-red" top="#F2857A" bottom="#D1483D" />
        <Face id="f-roof-red-side" top="#C7433A" bottom="#9A302A" />
        <Face id="f-roof-brown" top="#C58C5A" bottom="#8F5C33" />
        <Face id="f-roof-brown-side" top="#8F5C33" bottom="#6B421F" />
        <Face id="f-roof-blue" top="#8AD3F2" bottom="#4FA9D6" />
        <Face id="f-metal" top="#F2F5F7" bottom="#BFC9D1" />
        <Face id="f-soil" top="#B27D50" bottom="#8C5B34" />
        <Face id="f-soil-wet" top="#8E5E36" bottom="#66401F" />
        <Face id="f-sky" top="#8FD0F0" bottom="#DDF3FB" />
        <Face id="f-grass" top="#A9DE7C" bottom="#5FB343" />
        <Face id="f-path" top="#EFD3AA" bottom="#D9B283" />
        <Face id="f-glass" top="#FFFFFF" bottom="#CFEFFB" />

        {/* Sombra de contato: elipse com borda suave, sem filtro */}
        <radialGradient id="g-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#3A2A18" stopOpacity=".34" />
          <stop offset="0.7" stopColor="#3A2A18" stopOpacity=".18" />
          <stop offset="1" stopColor="#3A2A18" stopOpacity="0" />
        </radialGradient>
        {/* Brilho especular suave */}
        <radialGradient id="g-gloss" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".75" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        {/* Vinheta do chão (bordas um pouco mais escuras dão profundidade) */}
        <radialGradient id="g-ground-vignette" cx="50%" cy="60%" r="70%">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1E4A12" stopOpacity=".28" />
        </radialGradient>
        {/* Textura de grama: folhinhas discretas */}
        <pattern id="p-grass" width="140" height="96" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#4F9E36" strokeWidth="3" strokeLinecap="round" opacity=".28">
            <path d="M12 60c2-8 6-12 9-14M30 30c1-7 4-11 7-13M78 70c2-8 5-12 8-14M110 24c1-6 4-10 7-12M60 90c2-7 5-11 8-13M124 74c2-7 5-11 8-12" />
          </g>
          <g fill="none" stroke="#C6EF9E" strokeWidth="3" strokeLinecap="round" opacity=".32">
            <path d="M22 62c0-8-3-13-6-15M40 32c0-7-3-11-6-13M88 72c0-8-3-13-6-15M120 26c0-6-3-10-6-12" />
          </g>
        </pattern>
        {/* Textura de terra: pedrinhas */}
        <pattern id="p-soil" width="80" height="60" patternUnits="userSpaceOnUse">
          <g fill="#7A4E2B" opacity=".35">
            <circle cx="14" cy="18" r="2.5" /><circle cx="52" cy="40" r="2" /><circle cx="66" cy="12" r="1.8" /><circle cx="30" cy="48" r="1.6" />
          </g>
          <g fill="#D6A876" opacity=".3"><circle cx="40" cy="22" r="1.8" /><circle cx="8" cy="46" r="1.5" /></g>
        </pattern>
      </defs>
    </svg>
  );
});
