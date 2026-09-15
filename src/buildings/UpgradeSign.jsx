// Placa de melhoria em madeira com relevo: desenho do que vai mudar e moedinhas (cheias = já tem).
import { useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { UPGRADES } from '../config/content.js';
import { useGame } from '../state/GameProvider.jsx';
import { Shadow, Gloss, RIM } from '../art/shading.jsx';

const ICONS = {
  coop2: (
    <g transform="translate(0 -4)">
      <path d="M-30 6 L0 -20 L30 6 Z" fill="url(#f-roof-red)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
      <rect x="-24" y="6" width="48" height="26" rx="4" fill="url(#f-cream)" stroke={RIM} strokeWidth="1" />
      <circle cx="0" cy="18" r="6" fill="url(#f-glass)" stroke="#5FB6E8" strokeWidth="2" />
      <path d="M-40 -10c0-7 10-7 10 0 0 5-5 8-5 8s-5-3-5-8z" fill="#FF6F91" />
    </g>
  ),
  flowers: (
    <g transform="translate(0 4)">
      {[-22, 0, 22].map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <line x1="0" y1="8" x2="0" y2="28" stroke="#4F9E36" strokeWidth="4" strokeLinecap="round" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 8} cy={Math.sin((a * Math.PI) / 180) * 8} r="6" fill={['url(#s-pink)', 'url(#s-yellow)', 'url(#s-blue)'][i]} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#FFF3B0" />
        </g>
      ))}
    </g>
  ),
  pigpen: (
    <g transform="translate(0 2)">
      <ellipse cx="0" cy="22" rx="34" ry="8" fill="url(#s-mud)" />
      <circle cx="0" cy="0" r="20" fill="url(#s-pink)" stroke={RIM} strokeWidth="1" />
      <path d="M-18 -12c-4-10 2-16 8-14 2 4 0 10-4 12zM18 -12c4-10-2-16-8-14-2 4 0 10 4 12z" fill="url(#s-pinkdark)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
      <ellipse cx="0" cy="6" rx="10" ry="7" fill="url(#s-pinkdark)" stroke={RIM} strokeWidth="1" />
      <circle cx="-3.5" cy="6" r="1.8" fill="#9A4A60" /><circle cx="3.5" cy="6" r="1.8" fill="#9A4A60" />
      <circle cx="-8" cy="-4" r="2.6" fill="#2A1F1B" /><circle cx="8" cy="-4" r="2.6" fill="#2A1F1B" />
    </g>
  ),
  sheepPen: (
    <g transform="translate(0 2)">
      <g fill="url(#s-white)" stroke={RIM} strokeWidth="1"><circle cx="-14" cy="0" r="14" /><circle cx="2" cy="-6" r="16" /><circle cx="16" cy="4" r="12" /><circle cx="-4" cy="10" r="12" /></g>
      <ellipse cx="22" cy="-2" rx="9" ry="11" fill="url(#s-brown)" stroke={RIM} strokeWidth="1" />
      <circle cx="19" cy="-5" r="2" fill="#fff" /><circle cx="26" cy="-5" r="2" fill="#fff" />
      <circle cx="20" cy="-4" r="1" fill="#2A1F1B" /><circle cx="27" cy="-4" r="1" fill="#2A1F1B" />
    </g>
  ),
  barn2: (
    <g transform="translate(-6 -2)">
      <path d="M-30 30 V4 L-22 -8 L0 -20 L22 -8 L30 4 V30 Z" fill="url(#f-red)" stroke={RIM} strokeWidth="1" strokeLinejoin="round" />
      <rect x="-10" y="10" width="20" height="20" rx="2" fill="url(#f-red-side)" stroke={RIM} strokeWidth="1" />
      <rect x="34" y="-4" width="16" height="34" rx="4" fill="url(#f-metal)" stroke={RIM} strokeWidth="1" />
      <path d="M34 -2c0-8 16-8 16 0z" fill="url(#f-roof-red)" stroke={RIM} strokeWidth="1" />
    </g>
  ),
};

export function UpgradeSigns({ area }) {
  const { state } = useGame();
  return (
    <>
      {UPGRADES.filter((u) => !state.upgrades[u.id] && (!area || u.area === area)).map((u) => <UpgradeSign key={u.id} upgrade={u} />)}
    </>
  );
}

function UpgradeSign({ upgrade }) {
  const { state, actions, hint } = useGame();
  const pos = LAYOUT.signs[upgrade.id];
  const [shake, setShake] = useState(false);
  const have = Math.min(state.coins, upgrade.cost);
  const affordable = state.coins >= upgrade.cost;

  const onTap = () => {
    const ok = actions.buyUpgrade(upgrade.id, { x: pos.x, y: pos.y });
    if (!ok) { setShake(true); setTimeout(() => setShake(false), 500); }
  };

  const cols = upgrade.cost > 8 ? 6 : upgrade.cost > 4 ? Math.ceil(upgrade.cost / 2) : upgrade.cost;
  const rows = Math.ceil(upgrade.cost / cols);
  const cls = ['fz-obj', 'anchor-bottom', 'fz-tappable', hint === `sign:${upgrade.id}` && 'is-hinted', shake && 'is-shaking'].filter(Boolean).join(' ');

  return (
    <div className={cls} style={{ left: pos.x, top: pos.y, width: 170, height: 200 }} onClick={onTap}>
      <div className="fz-press" style={{ width: 170, height: 200 }}>
        <svg width="170" height="200" viewBox="0 0 170 200" aria-hidden="true">
          <Shadow x={85} y={194} rx={34} ry={7} />
          <rect x="75" y="120" width="20" height="74" rx="6" fill="url(#f-wood-side)" stroke={RIM} strokeWidth="1" />
          <rect x="79" y="120" width="5" height="74" fill="#F0C48C" opacity=".5" />
          {/* Tábua com relevo */}
          <rect x="10" y="12" width="150" height="116" rx="16" fill="url(#f-wood-side)" />
          <rect x="10" y="10" width="150" height="112" rx="16" fill={affordable ? 'url(#f-cream)' : 'url(#f-wood)'} stroke={RIM} strokeWidth="1.2" />
          <rect x="18" y="18" width="134" height="96" rx="12" fill="none" stroke={affordable ? '#E3B47C' : '#9F6A3C'} strokeWidth="2" strokeDasharray="6 8" opacity=".7" />
          <g transform="translate(85 54)">{ICONS[upgrade.id]}</g>
          {/* Moedinhas */}
          <g transform={`translate(${85 - ((cols - 1) * 20) / 2} ${98 - (rows - 1) * 10})`}>
            {Array.from({ length: upgrade.cost }, (_, i) => {
              const c = i % cols, r = Math.floor(i / cols);
              const filled = i < have;
              return <circle key={i} cx={c * 20} cy={r * 20} r="8" fill={filled ? 'url(#s-gold)' : 'rgba(91,61,46,.12)'} stroke={filled ? '#B8860B' : 'rgba(91,61,46,.3)'} strokeWidth="1.5" />;
            })}
          </g>
          <Gloss x={40} y={24} rx={20} ry={6} opacity={.35} />
          {affordable && <path d="M132 -2l6 14 15 1.5-11.5 10 3.5 15L132 30l-13 8.5 3.5-15L111 13.5l15-1.5z" fill="url(#s-gold)" stroke="#B8860B" strokeWidth="1.5" strokeLinejoin="round" />}
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 200, height: 220, top: '45%' }} />
    </div>
  );
}
