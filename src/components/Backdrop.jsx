// Fundo de cada área em vista 3/4: céu, sol, nuvens que andam, colinas ao longe,
// chão em perspectiva (mais claro ao longe, mais vivo perto) com textura de grama e vinheta.
// Detalhes por variante (caminho, adereços, espaços reservados).
import { memo } from 'react';
import { STAGE, LAYOUT } from '../config/layout.js';
import { Shadow, RIM } from '../art/shading.jsx';

export const HORIZON = 250;

export const Backdrop = memo(function Backdrop({ variant = 'yard' }) {
  const { width: W, height: H } = STAGE;
  return (
    <>
      {/* Céu e sol (estático) */}
      <svg className="fz-box" style={{ left: 0, top: 0 }} width={W} height={HORIZON + 40} viewBox={`0 0 ${W} ${HORIZON + 40}`} aria-hidden="true">
        <rect width={W} height={HORIZON + 40} fill="url(#f-sky)" />
        <circle cx="1380" cy="110" r="150" fill="url(#g-gloss)" opacity=".8" />
        <circle cx="1380" cy="110" r="58" fill="url(#s-gold)" />
        <circle cx="1380" cy="110" r="74" fill="none" stroke="#FFF3B0" strokeWidth="6" opacity=".35" />
      </svg>
      {/* Nuvens em camada própria (animação de transform composta, sem repintar o fundo) */}
      <div className="fz-clouds-layer" aria-hidden="true">
        <div className="fz-clouds">
          <svg width={W * 2} height="200" viewBox={`0 0 ${W * 2} 200`}>
            <g fill="#FFFFFF" opacity=".96">
              <Cloud x={220} y={90} s={1} /><Cloud x={720} y={60} s={.75} /><Cloud x={1080} y={130} s={.6} />
              <g transform={`translate(${W} 0)`}><Cloud x={220} y={90} s={1} /><Cloud x={720} y={60} s={.75} /><Cloud x={1080} y={130} s={.6} /></g>
            </g>
          </svg>
        </div>
      </div>
      {/* Colinas, chão e detalhes */}
      <svg className="fz-box" style={{ left: 0, top: 0 }} width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <path d={`M0 ${HORIZON + 20} C 200 150, 420 170, 600 230 S 1000 160, 1200 220 S 1500 180, 1600 220 L1600 ${HORIZON + 60} L0 ${HORIZON + 60} Z`} fill="#BFE7A6" />
        <path d={`M0 ${HORIZON + 40} C 260 200, 520 230, 760 270 S 1200 210, 1600 270 L1600 ${HORIZON + 80} L0 ${HORIZON + 80} Z`} fill="#A9DB8C" />
        <g>
          {[60, 190, 330, 520, 640, 900, 1010, 1150, 1310, 1470, 1580].map((x, i) => <FarTree key={x} x={x} y={HORIZON + 34 + (i % 3) * 6} s={0.55 + (i % 4) * 0.12} />)}
        </g>
        <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill="url(#f-grass)" />
        <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill="url(#p-grass)" />
        <g fill="#B7E58E" opacity=".35">
          <ellipse cx="300" cy="420" rx="220" ry="40" /><ellipse cx="1200" cy="470" rx="260" ry="46" /><ellipse cx="760" cy="880" rx="300" ry="60" /><ellipse cx="1450" cy="900" rx="180" ry="40" />
        </g>
        <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill="url(#g-ground-vignette)" />
        {variant === 'yard' && <YardDetails />}
        {variant === 'pasture' && <PastureDetails />}
        {variant === 'lake' && <LakeDetails />}
      </svg>
    </>
  );
});

function YardDetails() {
  return (
    <g>
      {/* Caminho em perspectiva: largo perto, estreito ao longe, até a porta do celeiro */}
      <path d="M560 1000 C 640 900, 820 860, 980 830 S 1240 760, 1300 690 L1360 690 C 1300 790, 1180 830, 1040 870 S 760 960, 700 1000 Z" fill="#D9B283" opacity=".55" />
      <path d="M590 1000 C 660 910, 830 870, 985 840 S 1235 775, 1305 700 L1340 700 C 1285 785, 1175 820, 1040 858 S 770 950, 720 1000 Z" fill="url(#f-path)" />
      <g fill="#C9A276" opacity=".5"><ellipse cx="760" cy="930" rx="10" ry="5" /><ellipse cx="900" cy="880" rx="8" ry="4" /><ellipse cx="1100" cy="820" rx="9" ry="4" /></g>
      {/* Pedras e adereços */}
      <Rock x={600} y={520} s={1} /><Rock x={640} y={535} s={.6} /><Rock x={1560} y={760} s={.9} />
      <HayStack x={1510} y={690} />
      <Barrel x={1080} y={690} /><Barrel x={1118} y={700} />
      <Bucket x={560} y={790} />
      <Log x={1020} y={500} />
      {/* Espaço reservado: horta maior */}
      <ellipse cx="760" cy="470" rx="120" ry="26" fill="#C6EC9E" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 12" opacity=".35" />
      <WildFlowers x={640} y={460} /><WildFlowers x={1000} y={960} /><WildFlowers x={40} y={760} /><WildFlowers x={1560} y={560} /><WildFlowers x={880} y={520} />
    </g>
  );
}

function PastureDetails() {
  const f = LAYOUT.pastureFence;
  return (
    <g>
      <ellipse cx="1250" cy="430" rx="130" ry="26" fill="#C6EC9E" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="10 12" opacity=".35" />
      <path d="M0 850 C 200 820, 500 800, 940 810 S 1400 870, 1600 910 L1600 960 C 1400 920, 1250 880, 940 860 S 500 850, 0 890 Z" fill="url(#f-path)" opacity=".9" />
      <Rock x={60} y={520} s={.8} /><Rock x={1560} y={960} s={1} />
      <WildFlowers x={960} y={470} /><WildFlowers x={40} y={980} /><WildFlowers x={600} y={960} />
      <FenceBack x1={f.x} x2={f.x + f.w} y={f.y + 8} />
    </g>
  );
}

function LakeDetails() {
  return (
    <g>
      <path d="M1600 850 C 1400 830, 1250 810, 1100 820 L1100 870 C 1250 860, 1400 880, 1600 910 Z" fill="url(#f-path)" opacity=".9" />
      <BigTree x={1300} y={470} s={1.1} /><BigTree x={120} y={430} s={.8} />
      <Rock x={1200} y={560} s={.9} /><Rock x={80} y={960} s={.7} />
      <WildFlowers x={1100} y={960} /><WildFlowers x={700} y={450} />
    </g>
  );
}

// ── Peças de cenário ────────────────────────────────────────
function Cloud({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="80" ry="34" />
      <circle cx="-30" cy="-16" r="34" /><circle cx="20" cy="-26" r="42" /><circle cx="60" cy="-8" r="30" />
      <ellipse cx="10" cy="14" rx="70" ry="18" fill="#DDEFF6" opacity=".6" />
    </g>
  );
}

function FarTree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".85">
      <rect x="-5" y="-6" width="10" height="26" rx="4" fill="#9A6A3C" />
      <circle cx="0" cy="-26" r="26" fill="#6FB852" /><circle cx="-16" cy="-14" r="18" fill="#7FC45E" /><circle cx="16" cy="-14" r="18" fill="#7FC45E" />
      <circle cx="-6" cy="-32" r="12" fill="#94D470" opacity=".8" />
    </g>
  );
}

export function BigTree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow x={0} y={44} rx={70} />
      <rect x="-12" y="-10" width="24" height="54" rx="8" fill="url(#f-wood-side)" />
      <circle cx="0" cy="-46" r="50" fill="url(#s-leaf)" /><circle cx="-34" cy="-24" r="36" fill="url(#s-leaf)" /><circle cx="34" cy="-26" r="36" fill="url(#s-leaf)" />
      <circle cx="-8" cy="-56" r="16" fill="#B9EE8C" opacity=".6" />
      <circle cx="-14" cy="-50" r="7" fill="url(#s-red)" /><circle cx="20" cy="-30" r="7" fill="url(#s-red)" /><circle cx="-32" cy="-14" r="6" fill="url(#s-red)" />
    </g>
  );
}

function Rock({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow x={0} y={16} rx={30} />
      <path d="M-28 12c-4-16 8-30 26-30s32 12 30 28c-2 10-14 14-30 14s-24-4-26-12z" fill="url(#s-gray)" stroke={RIM} strokeWidth="1" />
      <ellipse cx="-8" cy="-8" rx="10" ry="5" fill="#fff" opacity=".5" />
    </g>
  );
}

function HayStack({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow x={0} y={30} rx={56} />
      <path d="M-54 28c0-46 22-70 54-70s54 24 54 70z" fill="url(#s-straw)" stroke={RIM} strokeWidth="1.2" />
      <g stroke="#B8933D" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".6"><path d="M-30 10c10-20 22-32 34-38M0 20c4-24 12-40 24-50M-44 24c4-14 10-24 18-32" /></g>
      <ellipse cx="-12" cy="-28" rx="16" ry="8" fill="#FFF4C4" opacity=".5" />
      <rect x="-4" y="-56" width="8" height="24" rx="3" fill="url(#f-wood-side)" />
    </g>
  );
}

function Barrel({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow x={0} y={22} rx={26} />
      <path d="M-20 20c-6-16-6-40 0-56h40c6 16 6 40 0 56z" fill="url(#f-wood)" stroke={RIM} strokeWidth="1.2" />
      <ellipse cx="0" cy="-36" rx="20" ry="6" fill="url(#f-wood-top)" stroke={RIM} strokeWidth="1" />
      <g stroke="#7A7F86" strokeWidth="4"><path d="M-23 -22h46M-23 6h46" /></g>
      <ellipse cx="-8" cy="-8" rx="4" ry="14" fill="#fff" opacity=".25" />
    </g>
  );
}

function Bucket({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow x={0} y={14} rx={22} />
      <path d="M-18 12l-4-38h44l-4 38z" fill="url(#f-metal)" stroke={RIM} strokeWidth="1.2" strokeLinejoin="round" />
      <ellipse cx="0" cy="-26" rx="22" ry="6" fill="#DCE6EE" stroke={RIM} strokeWidth="1" />
      <ellipse cx="0" cy="-26" rx="16" ry="4" fill="url(#s-water)" />
      <path d="M-20 -28c0-24 40-24 40 0" fill="none" stroke="#7A7F86" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Log({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow x={0} y={12} rx={48} ry={10} />
      <rect x="-46" y="-14" width="92" height="26" rx="13" fill="url(#f-wood)" stroke={RIM} strokeWidth="1.2" />
      <ellipse cx="46" cy="-1" rx="10" ry="13" fill="#F0C48C" stroke={RIM} strokeWidth="1" />
      <ellipse cx="46" cy="-1" rx="5" ry="7" fill="none" stroke="#B8823F" strokeWidth="2" />
    </g>
  );
}

function WildFlowers({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0c-4-14-10-20-16-24 8 2 14 8 16 14 2-10 8-18 16-22-8 8-12 18-12 32z" fill="#4F9E36" opacity=".8" />
      <circle cx="-14" cy="-22" r="5" fill="url(#s-pink)" /><circle cx="12" cy="-20" r="5" fill="url(#s-yellow)" /><circle cx="2" cy="-30" r="4" fill="#fff" />
    </g>
  );
}

/** Cerca vista de 3/4: postes com topo e tábuas com brilho. */
export function Fence({ x1, x2, y, short }) {
  const posts = [];
  for (let x = x1; x <= x2; x += 92) posts.push(x);
  const h = short ? 46 : 66;
  return (
    <g>
      <Shadow x={(x1 + x2) / 2} y={y + 4} rx={(x2 - x1) / 2} ry={7} opacity={.7} />
      <rect x={x1} y={y - h + 14} width={x2 - x1} height="13" rx="5" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" />
      <rect x={x1} y={y - h + 14} width={x2 - x1} height="4" rx="2" fill="#F5D3A5" opacity=".7" />
      <rect x={x1} y={y - h / 2 + 8} width={x2 - x1} height="13" rx="5" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" />
      <rect x={x1} y={y - h / 2 + 8} width={x2 - x1} height="4" rx="2" fill="#F5D3A5" opacity=".7" />
      {posts.map((x) => (
        <g key={x}>
          <rect x={x - 10} y={y - h} width="20" height={h} rx="5" fill="url(#f-wood)" stroke={RIM} strokeWidth="1" />
          <rect x={x + 3} y={y - h} width="6" height={h} rx="3" fill="#A8703A" opacity=".35" />
          <path d={`M${x - 10} ${y - h + 4} L${x} ${y - h - 9} L${x + 10} ${y - h + 4}`} fill="#F0C58D" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

/** Cerca de fundo (mais baixa, sem sombra forte). */
function FenceBack({ x1, x2, y }) {
  return <Fence x1={x1} x2={x2} y={y} short />;
}
