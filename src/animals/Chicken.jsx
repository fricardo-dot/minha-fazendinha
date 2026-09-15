// Galinha (SVG 200×200) em estilo "brinquedo 3D": volumes com gradiente, sem contorno grosso.
// Expressões por estado. Estágio 2: ninho bonito. Estágio 3: pintinho acompanhando.
import { memo } from 'react';
import { Shadow, Gloss, Eye, EyeArc, Blush, RIM } from '../art/shading.jsx';

export const ChickenSprite = memo(function ChickenSprite({ expression = 'normal', stage = 1, dirt = 0, scruff = 0 }) {
  const sleeping = expression === 'sleep';
  const happy = expression === 'happy';
  const hungry = expression === 'hungry';
  const eating = expression === 'eating';
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
      <Shadow x={100} y={190} rx={66} />
      {/* Patas */}
      <g stroke="#E48F2A" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M84 156v26M74 184h20M84 182l-8 8M84 182l8 8" />
        <path d="M116 156v26M106 184h20M116 182l-8 8M116 182l8 8" />
      </g>
      <g stroke="#FFC46B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".7">
        <path d="M82 158v22M114 158v22" />
      </g>
      {/* Cauda */}
      <g fill="url(#s-cream)" stroke={RIM} strokeWidth="1.2">
        <ellipse cx="40" cy="92" rx="14" ry="26" transform="rotate(30 40 92)" />
        <ellipse cx="30" cy="104" rx="12" ry="22" transform="rotate(55 30 104)" />
        <ellipse cx="46" cy="76" rx="11" ry="20" transform="rotate(10 46 76)" />
      </g>
      {/* Corpo */}
      <ellipse cx="100" cy="122" rx="62" ry="50" fill="url(#s-cream)" stroke={RIM} strokeWidth="1.4" />
      {/* Oclusão sob a cabeça */}
      <ellipse cx="124" cy="100" rx="26" ry="14" fill="#C9AE84" opacity=".25" />
      {/* Asa */}
      <path d="M60 116c8-18 40-24 60-10-6 24-38 34-60 10z" fill="url(#s-cream)" stroke={RIM} strokeWidth="1.2" />
      <path d="M72 122c10-8 26-12 40-8" fill="none" stroke="#D9BE93" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <Gloss x={78} y={104} rx={22} ry={10} opacity={.5} />
      {/* Sujeira (banho) */}
      {dirt > 0 && (
        <g className="fz-dirt" style={{ opacity: dirt }}>
          <ellipse cx="86" cy="150" rx="14" ry="8" fill="url(#s-mud)" /><ellipse cx="116" cy="158" rx="11" ry="6" fill="url(#s-mud)" />
          <ellipse cx="60" cy="132" rx="9" ry="6" fill="url(#s-mud)" /><circle cx="140" cy="146" r="6" fill="url(#s-mud)" />
        </g>
      )}
      {/* Penas despenteadas (escova) */}
      {scruff > 0 && (
        <g className="fz-scruff" style={{ opacity: scruff }} fill="none" stroke="#C9AE84" strokeWidth="3.5" strokeLinecap="round">
          <path d="M70 78l-10-16M84 74l-4-18M98 74l6-18M56 96l-16-8" />
        </g>
      )}
      {/* Pescoço/cabeça */}
      <circle cx="132" cy="70" r="36" fill="url(#s-cream)" stroke={RIM} strokeWidth="1.4" />
      <Gloss x={120} y={56} rx={14} ry={9} opacity={.6} />
      {/* Crista */}
      <g fill="url(#s-red)" stroke={RIM} strokeWidth="1">
        <circle cx="118" cy="38" r="9" /><circle cx="132" cy="31" r="11" /><circle cx="147" cy="37" r="9" />
      </g>
      {/* Bico */}
      {eating ? (
        <g>
          <path d="M162 68l26 4-26 8z" fill="url(#s-orange)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <path d="M162 84l22 6-22 6z" fill="#D9821D" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
        </g>
      ) : (
        <path d="M162 72l27 6-27 10z" fill="url(#s-orange)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
      )}
      {/* Barbela */}
      <ellipse cx="154" cy="96" rx="7" ry="10" fill="url(#s-red)" stroke={RIM} strokeWidth="1" />
      {/* Olho */}
      {sleeping || happy ? <EyeArc x={142} y={68} w={16} happy={happy} /> : (
        <g className="fz-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <Eye x={142} y={68} r={8.5} />
        </g>
      )}
      {hungry && <path d="M130 52c6-2 12 0 16 4" fill="none" stroke="#7A5A3A" strokeWidth="3" strokeLinecap="round" />}
      <Blush x={124} y={84} r={6} />

      {/* Estágio 3: pintinho */}
      {stage >= 3 && (
        <g transform="translate(20 130)">
          <Shadow x={0} y={60} rx={22} />
          <circle cx="0" cy="36" r="20" fill="url(#s-yellow)" stroke={RIM} strokeWidth="1.2" />
          <circle cx="8" cy="16" r="14" fill="url(#s-yellow)" stroke={RIM} strokeWidth="1.2" />
          <Gloss x={2} y={10} rx={6} ry={4} />
          <path d="M20 16l10 3-10 4z" fill="url(#s-orange)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
          <Eye x={12} y={14} r={3.4} />
          <path d="M-8 36c6-6 16-6 20 2" fill="#F2C93B" opacity=".7" />
          <g stroke="#E48F2A" strokeWidth="4" strokeLinecap="round"><path d="M-6 54v6M6 54v6" /></g>
        </g>
      )}
    </svg>
  );
});

/** Ninho fixo no pátio (estágio 2+ fica mais bonito). É onde o ovo aparece. */
export const Nest = memo(function Nest({ stage = 1 }) {
  return (
    <svg width="150" height="70" viewBox="0 0 150 70" aria-hidden="true">
      <Shadow x={75} y={62} rx={62} ry={9} />
      <ellipse cx="75" cy="40" rx="62" ry="22" fill="url(#s-straw)" stroke={RIM} strokeWidth="1.2" />
      <ellipse cx="75" cy="34" rx="46" ry="12" fill="#B8933D" opacity=".55" />
      <ellipse cx="75" cy="36" rx="38" ry="9" fill="#8E6B25" opacity=".35" />
      <g stroke="#FFF1B8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".7">
        <path d="M24 40c14 8 30 10 45 8M84 52c16 0 30-4 40-10M28 30c10-4 26-6 40-4" />
      </g>
      <g stroke="#9C7A2C" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".6">
        <path d="M40 50c12 4 24 6 36 4M96 46c10-2 18-6 24-10" />
      </g>
      {stage >= 2 && (
        <g>
          <circle cx="30" cy="30" r="7" fill="url(#s-pink)" /><circle cx="120" cy="32" r="7" fill="url(#s-blue)" />
          <circle cx="75" cy="56" r="6" fill="url(#s-yellow)" />
          <ellipse cx="14" cy="38" rx="9" ry="5" fill="url(#s-leaf)" transform="rotate(-30 14 38)" />
          <ellipse cx="136" cy="40" rx="9" ry="5" fill="url(#s-leaf)" transform="rotate(30 136 40)" />
        </g>
      )}
    </svg>
  );
});
