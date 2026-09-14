// LAGO — cenário calmo com um sapo e um pato para tocar. Espaço reservado para pescar no futuro.
import { useState } from 'react';
import { LAYOUT } from '../config/layout.js';
import { Backdrop } from '../components/Backdrop.jsx';
import { useFx } from '../components/Fx.jsx';
import { audio } from '../audio/AudioManager.js';

const INK = '#5B3D2E';

export function LakeArea() {
  const p = LAYOUT.pond;
  return (
    <>
      <Backdrop variant="lake" />
      {/* Lago */}
      <svg className="fz-box" style={{ left: p.x, top: p.y }} width={p.w} height={p.h} viewBox={`0 0 ${p.w} ${p.h}`} aria-hidden="true">
        <ellipse cx={p.w / 2} cy={p.h / 2 + 10} rx={p.w / 2} ry={p.h / 2 - 10} fill="#C9A24A" opacity=".35" />
        <ellipse cx={p.w / 2} cy={p.h / 2} rx={p.w / 2 - 24} ry={p.h / 2 - 34} fill="#6ECBF5" stroke="#4FB3E0" strokeWidth="6" />
        <ellipse cx={p.w / 2 - 60} cy={p.h / 2 - 40} rx={p.w / 2 - 160} ry={p.h / 2 - 120} fill="#9DDBF0" opacity=".7" />
        <g fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".7">
          <path d="M180 120q30-10 60 0t60 0" /><path d="M520 300q30-10 60 0t60 0" /><path d="M300 360q30-10 60 0t60 0" />
        </g>
        {/* Vitórias-régias */}
        <LilyPad x={200} y={330} r={46} flower="#FF6F91" />
        <LilyPad x={660} y={150} r={38} />
        <LilyPad x={720} y={340} r={40} flower="#FFF3B0" />
        {/* Juncos */}
        <g stroke="#5FAF42" strokeWidth="8" strokeLinecap="round">
          <path d="M60 300v-120M84 320v-90M40 320v-70" /><path d="M820 120v-90M846 140v-70" />
        </g>
        <g fill="#A56F42"><rect x="52" y="150" width="16" height="36" rx="8" /><rect x="812" y="0" width="16" height="36" rx="8" /></g>
      </svg>

      {/* Píer (reservado para pescar) */}
      <svg className="fz-box" style={{ left: LAYOUT.pier.x, top: LAYOUT.pier.y }} width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
        <g fill="#A8703A"><rect x="20" y="60" width="16" height="110" rx="6" /><rect x="150" y="70" width="16" height="110" rx="6" /></g>
        <rect x="0" y="40" width="190" height="40" rx="8" fill="#D19A5B" stroke={INK} strokeWidth="4" />
        <g stroke="#A8703A" strokeWidth="3"><line x1="40" y1="40" x2="40" y2="80" /><line x1="80" y1="40" x2="80" y2="80" /><line x1="120" y1="40" x2="120" y2="80" /><line x1="160" y1="40" x2="160" y2="80" /></g>
      </svg>

      <Duck />
      <Frog />
    </>
  );
}

function LilyPad({ x, y, r, flower }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M0 0 L${r} -${r * 0.35} A${r} ${r} 0 1 1 ${r} ${r * 0.35} Z`} fill="#5FAF42" stroke="#3E8F2C" strokeWidth="4" strokeLinejoin="round" />
      {flower && (
        <g transform="translate(-6 -10)">
          {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx={Math.cos((a * Math.PI) / 180) * 10} cy={Math.sin((a * Math.PI) / 180) * 10} rx="8" ry="5" fill={flower} stroke={INK} strokeWidth="1.5" transform={`rotate(${a} ${Math.cos((a * Math.PI) / 180) * 10} ${Math.sin((a * Math.PI) / 180) * 10})`} />)}
          <circle r="5" fill="#FFD24A" stroke={INK} strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

function Frog() {
  const fx = useFx();
  const [jump, setJump] = useState(false);
  const { x, y } = LAYOUT.frog;
  const onTap = () => {
    audio.play('frog', 250);
    setJump(true); setTimeout(() => setJump(false), 650);
    fx.burst({ x, y: y - 60, kind: 'sparkle', size: .5 });
  };
  return (
    <div className={`fz-obj anchor-bottom fz-tappable ${jump ? 'is-bouncing' : ''}`} style={{ left: x, top: y, width: 140, height: 110 }} onClick={onTap}>
      <div className="fz-press" style={{ width: 140, height: 110 }}>
        <svg width="140" height="110" viewBox="0 0 140 110" aria-hidden="true">
          <ellipse cx="70" cy="104" rx="50" ry="6" fill="rgba(60,40,20,.15)" />
          <ellipse cx="70" cy="76" rx="46" ry="28" fill="#7CC15A" stroke={INK} strokeWidth="4" />
          <ellipse cx="70" cy="86" rx="30" ry="14" fill="#C9E88A" />
          <g fill="#7CC15A" stroke={INK} strokeWidth="4"><ellipse cx="28" cy="96" rx="16" ry="9" /><ellipse cx="112" cy="96" rx="16" ry="9" /></g>
          <circle cx="48" cy="46" r="16" fill="#7CC15A" stroke={INK} strokeWidth="4" /><circle cx="92" cy="46" r="16" fill="#7CC15A" stroke={INK} strokeWidth="4" />
          <circle cx="48" cy="46" r="9" fill="#fff" stroke={INK} strokeWidth="2.5" /><circle cx="92" cy="46" r="9" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="50" cy="47" r="4.5" fill={INK} /><circle cx="94" cy="47" r="4.5" fill={INK} />
          <path d="M52 72c10 8 26 8 36 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="40" cy="70" r="5" fill="#FFB5C2" opacity=".8" /><circle cx="100" cy="70" r="5" fill="#FFB5C2" opacity=".8" />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 170, height: 150 }} />
    </div>
  );
}

function Duck() {
  const fx = useFx();
  const [bob, setBob] = useState(false);
  const lane = LAYOUT.duckLane;
  const onTap = (e) => {
    audio.play('duck', 250);
    setBob(true); setTimeout(() => setBob(false), 550);
    fx.burst({ x: lane.x + lane.w / 2, y: lane.y - 60, kind: 'splash', size: .6 });
  };
  return (
    <div className="fz-duck-lane" style={{ left: lane.x, top: lane.y, width: lane.w, '--lane': `${lane.w - 120}px` }}>
      <div className={`fz-duck fz-tappable ${bob ? 'is-bouncing' : ''}`} onClick={onTap}>
        <div className="fz-press">
          <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden="true">
            <ellipse cx="60" cy="86" rx="46" ry="8" fill="#4FB3E0" opacity=".5" />
            <path d="M14 66c0-22 26-30 50-28 26 2 42 14 42 30 0 12-20 18-46 18S14 80 14 66z" fill="#FFF6E4" stroke={INK} strokeWidth="4" />
            <path d="M18 60c-10-6-14-16-10-24 8 4 14 10 16 18" fill="#FFF6E4" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="90" cy="34" r="20" fill="#FFF6E4" stroke={INK} strokeWidth="4" />
            <path d="M108 36l22 4-22 8z" fill="#F0A030" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="94" cy="30" r="4.5" fill={INK} />
            <path d="M40 66c8-8 24-10 34-4" fill="none" stroke="#E8C466" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="fz-touch" style={{ width: 160, height: 140 }} />
      </div>
    </div>
  );
}
