// Placa de melhoria: mostra o desenho do que vai mudar e as moedas necessárias como moedinhas.
// Moedas que a criança já tem aparecem cheias; as que faltam, apagadas. Sem números.
import { useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { UPGRADES } from '../config/content.js';
import { useGame } from '../state/GameProvider.jsx';

const ICONS = {
  coop2: (
    <g transform="translate(0 -4)">
      <path d="M-30 6 L0 -20 L30 6 Z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="3" strokeLinejoin="round" />
      <rect x="-24" y="6" width="48" height="26" rx="4" fill="#FFF1D6" stroke="#5B3D2E" strokeWidth="3" />
      <circle cx="0" cy="18" r="6" fill="#6ECBF5" stroke="#5B3D2E" strokeWidth="2" />
      <path d="M-40 -10c0-7 10-7 10 0 0 5-5 8-5 8s-5-3-5-8z" fill="#FF6F91" />
    </g>
  ),
  flowers: (
    <g transform="translate(0 4)">
      {[-22, 0, 22].map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <line x1="0" y1="8" x2="0" y2="28" stroke="#5FAF42" strokeWidth="4" strokeLinecap="round" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 8} cy={Math.sin((a * Math.PI) / 180) * 8} r="6" fill={['#FF6F91', '#FFD24A', '#C89BFF'][i]} stroke="#5B3D2E" strokeWidth="1.5" />
          ))}
          <circle cx="0" cy="0" r="4" fill="#FFF3B0" />
        </g>
      ))}
    </g>
  ),
  pigpen: (
    <g transform="translate(0 2)">
      <ellipse cx="0" cy="22" rx="34" ry="8" fill="#8E5E36" />
      <circle cx="0" cy="0" r="20" fill="#FFB5C2" stroke="#5B3D2E" strokeWidth="3" />
      <path d="M-18 -12c-4-10 2-16 8-14 2 4 0 10-4 12zM18 -12c4-10-2-16-8-14-2 4 0 10 4 12z" fill="#F58FA5" stroke="#5B3D2E" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="0" cy="6" rx="10" ry="7" fill="#F58FA5" stroke="#5B3D2E" strokeWidth="2.5" />
      <circle cx="-3.5" cy="6" r="1.8" fill="#5B3D2E" /><circle cx="3.5" cy="6" r="1.8" fill="#5B3D2E" />
      <circle cx="-8" cy="-4" r="2.6" fill="#5B3D2E" /><circle cx="8" cy="-4" r="2.6" fill="#5B3D2E" />
    </g>
  ),
  barn2: (
    <g transform="translate(-6 -2)">
      <path d="M-30 30 V4 L-22 -8 L0 -20 L22 -8 L30 4 V30 Z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="3" strokeLinejoin="round" />
      <rect x="-10" y="10" width="20" height="20" rx="2" fill="#C94A3F" stroke="#5B3D2E" strokeWidth="2.5" />
      <rect x="34" y="-4" width="16" height="34" rx="4" fill="#DCE6EE" stroke="#5B3D2E" strokeWidth="3" />
      <path d="M34 -2c0-8 16-8 16 0z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="2.5" />
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
          <ellipse cx="85" cy="194" rx="30" ry="6" fill="rgba(60,40,20,.15)" />
          <rect x="75" y="120" width="20" height="74" rx="6" fill="#A8703A" stroke="#5B3D2E" strokeWidth="4" />
          <rect x="10" y="12" width="150" height="116" rx="16" fill={affordable ? '#FFF1D6' : '#E3B47C'} stroke="#5B3D2E" strokeWidth="5" />
          <rect x="18" y="20" width="134" height="100" rx="12" fill="none" stroke="#A8703A" strokeWidth="3" strokeDasharray="6 8" opacity=".6" />
          <g transform="translate(85 56)">{ICONS[upgrade.id]}</g>
          {/* Moedinhas */}
          <g transform={`translate(${85 - ((cols - 1) * 20) / 2} ${100 - (rows - 1) * 10})`}>
            {Array.from({ length: upgrade.cost }, (_, i) => {
              const c = i % cols, r = Math.floor(i / cols);
              const filled = i < have;
              return (
                <circle key={i} cx={c * 20} cy={r * 20} r="8" fill={filled ? '#FFD24A' : 'rgba(91,61,46,.15)'} stroke={filled ? '#B8860B' : 'rgba(91,61,46,.35)'} strokeWidth="2.5" />
              );
            })}
          </g>
          {affordable && <path d="M132 -2l6 14 15 1.5-11.5 10 3.5 15L132 30l-13 8.5 3.5-15L111 13.5l15-1.5z" fill="#FFD24A" stroke="#B8860B" strokeWidth="2.5" strokeLinejoin="round" />}
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 200, height: 220, top: '45%' }} />
    </div>
  );
}
