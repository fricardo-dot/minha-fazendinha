// MINIGAME 2 — Cesta de ovos.
// Os ovos da cesta de coleta são espalhados; a criança arrasta cada um para a cesta grande.
// Soltar fora: o ovo dá um pulinho engraçado e volta. Ao terminar: entrega com bônus.
import { useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';
import { useGame } from '../state/GameProvider.jsx';
import { useFx } from '../components/Fx.jsx';
import { useStage } from '../components/Stage.jsx';
import { audio } from '../audio/AudioManager.js';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { ExitButton } from './MinigameHost.jsx';

const INK = '#5B3D2E';
const BASKET = { x: 1100, y: 520, w: 420, h: 300 };
const SLOTS = [
  { x: 260, y: 820 }, { x: 420, y: 860 }, { x: 580, y: 830 }, { x: 300, y: 660 }, { x: 470, y: 690 }, { x: 640, y: 670 },
];

export function EggBasket({ onDone, onExit }) {
  const { state, actions } = useGame();
  const fx = useFx();
  const stage = useStage();
  const count = Math.min(state.basket.eggs, BALANCE.minigames.eggBasket.maxEggs);
  const [eggs, setEggs] = useState(() => SLOTS.slice(0, count).map((s, i) => ({ id: i, home: s, x: s.x, y: s.y, placed: false, dragging: false, returning: false })));
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  const dragRef = useRef(null);

  const placedCount = eggs.filter((e) => e.placed).length;

  const inBasket = (p) =>
    p.x > BASKET.x - BASKET.w / 2 - 40 && p.x < BASKET.x + BASKET.w / 2 + 40 && p.y > BASKET.y - BASKET.h / 2 - 60 && p.y < BASKET.y + BASKET.h / 2 + 40;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    audio.play('fanfare');
    fx.burst({ x: BASKET.x, y: BASKET.y - 80, kind: 'confetti' });
    setTimeout(() => {
      actions.completeDelivery(BALANCE.rewards.eggMinigameBonus, true);
      onDone();
    }, 1600);
  };

  const exitEarly = () => {
    // Sair não é castigo: entrega normal, sem bônus.
    actions.completeDelivery(0, false);
    onExit();
  };

  const onDown = (e, id) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = stage.toLogical(e.clientX, e.clientY);
    dragRef.current = { id, pointerId: e.pointerId, dx: 0, dy: 0 };
    setEggs((es) => es.map((eg) => (eg.id === id ? { ...eg, dragging: true, returning: false, x: p.x, y: p.y } : eg)));
    audio.play('collect', 120);
  };
  const onMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const p = stage.toLogical(e.clientX, e.clientY);
    setEggs((es) => es.map((eg) => (eg.id === d.id ? { ...eg, x: p.x, y: p.y } : eg)));
  };
  const onUp = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    const p = stage.toLogical(e.clientX, e.clientY);
    if (inBasket(p)) {
      audio.play('collect');
      fx.burst({ x: p.x, y: p.y, kind: 'sparkle', size: .7 });
      // Posição arrumada dentro da cesta
      setEggs((es) => {
        const placedSoFar = es.filter((eg) => eg.placed).length;
        const next = es.map((eg) => (eg.id === d.id ? {
          ...eg, dragging: false, placed: true,
          x: BASKET.x - 120 + (placedSoFar % 4) * 80 + (placedSoFar >= 4 ? 40 : 0),
          y: BASKET.y + 30 - (placedSoFar >= 4 ? 50 : 0),
        } : eg));
        if (next.every((eg) => eg.placed)) setTimeout(finish, 300);
        return next;
      });
    } else {
      audio.play('oops', 150);
      setEggs((es) => es.map((eg) => (eg.id === d.id ? { ...eg, dragging: false, returning: true, x: eg.home.x, y: eg.home.y } : eg)));
      setTimeout(() => setEggs((es) => es.map((eg) => (eg.id === d.id ? { ...eg, returning: false } : eg))), 550);
    }
  };

  return (
    <>
      <ExitButton onClick={exitEarly} />
      <svg className="fz-box" style={{ left: 0, top: 0 }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        {/* Toalha xadrez */}
        <rect x="120" y="580" width="700" height="360" rx="30" fill="#FFF6E4" stroke={INK} strokeWidth="5" />
        <g fill="#FFB5C2" opacity=".5">
          {Array.from({ length: 7 }, (_, r) => Array.from({ length: 14 }, (_, c) => ((r + c) % 2 === 0 ? <rect key={`${r}-${c}`} x={120 + c * 50} y={580 + r * 51.4} width="50" height="51.4" /> : null)))}
        </g>
        {/* Cesta grande (fundo) */}
        <g transform={`translate(${BASKET.x} ${BASKET.y})`}>
          <ellipse cx="0" cy="150" rx="220" ry="22" fill="rgba(60,40,20,.14)" />
          <path d="M-150 -40c0-150 300-150 300 0" fill="none" stroke="#A8703A" strokeWidth="22" strokeLinecap="round" />
          <path d="M-150 -40c0-130 300-130 300 0" fill="none" stroke="#E3B47C" strokeWidth="9" strokeLinecap="round" />
          <path d="M-210 -40h420l-40 190h-340z" fill="#D19A5B" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <g stroke="#A8703A" strokeWidth="5" opacity=".7"><line x1="-195" y1="20" x2="195" y2="20" /><line x1="-185" y1="80" x2="185" y2="80" /></g>
          <g stroke="#A8703A" strokeWidth="5" opacity=".5"><line x1="-100" y1="-40" x2="-92" y2="150" /><line x1="0" y1="-40" x2="0" y2="150" /><line x1="100" y1="-40" x2="92" y2="150" /></g>
        </g>
        {placedCount === 0 && !done && (
          <g className="fz-hint-self is-hinted" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <path d="M700 720 C 760 600, 820 570, 870 580" fill="none" stroke="#FFFFFF" strokeWidth="16" strokeLinecap="round" />
            <path d="M700 720 C 760 600, 820 570, 870 580" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeDasharray="2 22" />
            <path d="M840 550l34 32-44 14" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>

      {/* Ovos */}
      {eggs.map((eg) => (
        <div
          key={eg.id}
          className={`fz-mg-egg ${eg.dragging ? 'is-dragging' : ''} ${eg.returning ? 'is-returning' : ''} ${eg.placed ? 'is-placed' : ''}`}
          style={{ left: eg.x, top: eg.y, width: 130, height: 130, pointerEvents: eg.placed ? 'none' : 'auto' }}
          onPointerDown={eg.placed ? undefined : (e) => onDown(e, eg.id)}
          onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        >
          <div className="fz-press" style={{ transform: eg.placed ? 'scale(.8)' : undefined }}><ItemIcon kind="egg" size={130} /></div>
        </div>
      ))}

      {/* Borda frontal da cesta cobre os ovos colocados */}
      <svg className="fz-box" style={{ left: 0, top: 0, pointerEvents: 'none' }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        <g transform={`translate(${BASKET.x} ${BASKET.y})`}>
          <path d="M-210 -40h420v26h-420z" fill="#E3B47C" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        </g>
      </svg>

      {done && (
        <div className="fz-mg-done">
          <div className="big"><ItemIcon kind="coin" size={240} /></div>
        </div>
      )}
    </>
  );
}
