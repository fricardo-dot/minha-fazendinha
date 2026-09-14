// MINIGAME 1 — Ordenhar a vaca.
// Arrastar para baixo (ou só tocar) em uma teta faz um esguicho de leite cair no balde.
// Oito esguichos enchem o balde. Não há como perder.
import { useEffect, useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useFx } from '../components/Fx.jsx';
import { useStage } from '../components/Stage.jsx';
import { audio } from '../audio/AudioManager.js';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { ExitButton } from './MinigameHost.jsx';

const INK = '#5B3D2E';
const TEATS = [{ x: 690, y: 560 }, { x: 760, y: 572 }, { x: 830, y: 572 }, { x: 900, y: 560 }];
const BUCKET = { x: 795, y: 780 };

export function Milking({ params, onDone, onExit }) {
  const { actions } = useGame();
  const fx = useFx();
  const total = BALANCE.minigames.milking.squirtsToFill;
  const [fill, setFill] = useState(0);
  const [streams, setStreams] = useState([]);
  const [done, setDone] = useState(false);
  const [happy, setHappy] = useState(false);
  const doneRef = useRef(false);

  const squirt = (teatIndex) => {
    if (doneRef.current) return;
    audio.play('squirt', 80);
    const id = Math.random();
    setStreams((s) => [...s, { id, x: TEATS[teatIndex].x }]);
    setTimeout(() => setStreams((s) => s.filter((e) => e.id !== id)), 500);
    setHappy(true); setTimeout(() => setHappy(false), 400);
    setFill((f) => {
      const n = Math.min(total, f + 1);
      if (n >= total && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => finish(), 350);
      }
      return n;
    });
  };

  const finish = () => {
    setDone(true);
    actions.finishMilking(params.animalId);
    fx.burst({ x: BUCKET.x, y: BUCKET.y - 60, kind: 'confetti' });
    setTimeout(() => {
      fx.fly({ kind: 'milk', from: { x: 800, y: 500 }, to: { x: LAYOUT.basket.x, y: LAYOUT.basket.y - 30 }, duration: 800, onArrive: () => audio.play('happy', 0) });
      onDone();
    }, 1700);
  };

  const level = fill / total;

  return (
    <>
      <ExitButton onClick={onExit} />
      {/* Cenário */}
      <svg className="fz-box" style={{ left: 0, top: 0 }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        {/* Vaca grande de lado, virada para a esquerda */}
        <ellipse cx="800" cy="880" rx="420" ry="26" fill="rgba(60,40,20,.14)" />
        <g fill="#FFFFFF" stroke={INK} strokeWidth="6">
          <rect x="520" y="560" width="64" height="160" rx="26" /><rect x="620" y="580" width="64" height="150" rx="26" />
          <rect x="920" y="580" width="64" height="150" rx="26" /><rect x="1020" y="560" width="64" height="160" rx="26" />
        </g>
        <g fill={INK}>
          <rect x="520" y="690" width="64" height="30" rx="14" /><rect x="620" y="700" width="64" height="30" rx="14" />
          <rect x="920" y="700" width="64" height="30" rx="14" /><rect x="1020" y="690" width="64" height="30" rx="14" />
        </g>
        <rect x="470" y="300" width="660" height="300" rx="140" fill="#FFFFFF" stroke={INK} strokeWidth="7" />
        <path d="M560 360c50-30 110-10 120 40s-40 90-90 70-80-90-30-110z" fill="#4A3B36" />
        <path d="M880 420c40-40 120-30 130 20s-30 90-80 80-90-60-50-100z" fill="#4A3B36" />
        {/* Rabo */}
        <path d="M1130 380c50 20 70 90 40 150" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        {/* Cabeça (esquerda) */}
        <g transform="translate(430 330)">
          <ellipse cx="0" cy="60" rx="110" ry="96" fill="#FFFFFF" stroke={INK} strokeWidth="7" />
          <path d="M-100 20c-40-20-70-4-70 14s34 30 70 14z" fill="#FFFFFF" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M100 20c40-20 70-4 70 14s-34 30-70 14z" fill="#FFFFFF" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M-60 -20c-14-30-4-56 16-60 4 22 0 40-8 56M60 -20c14-30 4-56-16-60-4 22 0 40 8 56" fill="#E8C466" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <path d="M-30 -30c10-20 50-20 60 0-12-4-48-4-60 0z" fill="#4A3B36" />
          <ellipse cx="0" cy="110" rx="72" ry="46" fill="#FFB5C2" stroke={INK} strokeWidth="6" />
          <ellipse cx="-26" cy="104" rx="10" ry="12" fill={INK} /><ellipse cx="26" cy="104" rx="10" ry="12" fill={INK} />
          {happy || done ? (
            <g fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round">
              <path d="M-64 40c10-18 34-18 44 0M20 40c10-18 34-18 44 0" />
              <path d="M-30 136c14 16 46 16 60 0" />
            </g>
          ) : (
            <g>
              <circle cx="-42" cy="42" r="22" fill="#fff" stroke={INK} strokeWidth="6" /><circle cx="42" cy="42" r="22" fill="#fff" stroke={INK} strokeWidth="6" />
              <circle cx="-38" cy="46" r="11" fill={INK} /><circle cx="46" cy="46" r="11" fill={INK} />
              <circle cx="-34" cy="40" r="4" fill="#fff" /><circle cx="50" cy="40" r="4" fill="#fff" />
            </g>
          )}
          <circle cx="-84" cy="80" r="14" fill="#FFB5C2" opacity=".8" /><circle cx="84" cy="80" r="14" fill="#FFB5C2" opacity=".8" />
        </g>
        {/* Úbere */}
        <path d="M660 560c0-40 280-40 280 0 0 40-60 70-140 70s-140-30-140-70z" fill="#FFB5C2" stroke={INK} strokeWidth="6" />
        {/* Balde */}
        <g transform={`translate(${BUCKET.x} ${BUCKET.y})`}>
          <path d="M-90 -80h180l-22 150h-136z" fill="#B7C6D3" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <clipPath id="bucketClip"><path d="M-90 -80h180l-22 150h-136z" /></clipPath>
          <g clipPath="url(#bucketClip)">
            <rect x="-100" y={70 - level * 150} width="200" height="200" fill="#FFFFFF" />
            <ellipse cx="0" cy={70 - level * 150} rx="88" ry="8" fill="#F3FBFF" stroke="#DCE6EE" strokeWidth="3" />
          </g>
          <ellipse cx="0" cy="-80" rx="90" ry="14" fill="#DCE6EE" stroke={INK} strokeWidth="6" />
          <path d="M-88 -84c0-70 176-70 176 0" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        </g>
        {/* Esguichos */}
        {streams.map((s) => (
          <g key={s.id} className="fz-milk-stream" style={{ transformBox: 'fill-box', transformOrigin: '50% 0' }}>
            <path d={`M${s.x} 632 Q ${s.x + (s.x < 795 ? 30 : -30)} 700 ${795 + (s.x < 795 ? -20 : 20)} 720`} fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" />
          </g>
        ))}
        {/* Setinha suave mostrando "para baixo" enquanto ninguém tocou */}
        {fill === 0 && !done && (
          <g className="fz-hint-self is-hinted" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <path d="M795 640v56M769 672l26 30 26-30" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
            <path d="M795 640v56M769 672l26 30 26-30" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>

      {/* Tetas (áreas de toque) */}
      {TEATS.map((t, i) => <Teat key={i} x={t.x} y={t.y} onSquirt={() => squirt(i)} disabled={done} />)}

      {done && (
        <div className="fz-mg-done">
          <div className="big"><ItemIcon kind="milk" size={260} /></div>
        </div>
      )}
    </>
  );
}

function Teat({ x, y, onSquirt, disabled }) {
  const stage = useStage();
  const [squirting, setSquirting] = useState(false);
  const start = useRef(null);
  const fired = useRef(false);

  const fire = () => {
    if (fired.current || disabled) return;
    fired.current = true;
    setSquirting(true);
    setTimeout(() => setSquirting(false), 300);
    onSquirt();
  };

  const onDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    fired.current = false;
    start.current = stage.toLogical(e.clientX, e.clientY);
  };
  const onMove = (e) => {
    if (!start.current) return;
    const p = stage.toLogical(e.clientX, e.clientY);
    if (p.y - start.current.y > BALANCE.minigames.milking.dragThreshold) fire();
  };
  const onUp = () => {
    if (start.current && !fired.current) fire(); // só tocar também funciona
    start.current = null;
    setTimeout(() => { fired.current = false; }, 250);
  };

  return (
    <div
      className={`fz-obj fz-teat ${squirting ? 'is-squirting' : ''}`}
      style={{ left: x, top: y + 40, width: 110, height: 170, touchAction: 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
    >
      <svg className="teat-shape" width="110" height="170" viewBox="0 0 110 170" style={{ transformOrigin: '50% 0' }} aria-hidden="true">
        <rect x="35" y="8" width="40" height="70" rx="20" fill="#FFB5C2" stroke={INK} strokeWidth="5" />
      </svg>
    </div>
  );
}
