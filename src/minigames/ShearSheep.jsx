// MINIGAME 4 — Tosar a ovelha.
// A criança passa a máquina de tosar sobre a lã; cada tufo encolhe por onde a máquina passa
// e voa para o cesto de lã. Sem lã, a ovelha fica lisinha e feliz e um novelo vai para a cesta.
// Não há como perder; sair no meio deixa a ovelha como estava.
import { useEffect, useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useFx } from '../components/Fx.jsx';
import { audio } from '../audio/AudioManager.js';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { SheepSprite, SHEEP_WOOL_TUFTS } from '../animals/Sheep.jsx';
import { ExitButton } from './MinigameHost.jsx';
import { capturePointer } from '../interaction/pointer.js';

const INK = '#5B3D2E';
const SHEEP = { x: 700, y: 700, scale: 3.0, w: 200, h: 170 }; // centro-base da ovelha no palco
const WOOL_BASKET = { x: 1280, y: 720 };

export function ShearSheep({ params, onDone, onExit }) {
  const { actions } = useGame();
  const fx = useFx();
  const cfg = BALANCE.minigames.shear;
  const [wool, setWoolState] = useState(() => SHEEP_WOOL_TUFTS.map(() => 1));
  const woolRef = useRef(wool);
  const setWool = (next) => { woolRef.current = next; setWoolState(next); };
  const [done, setDone] = useState(false);
  const [tool, setTool] = useState({ x: 330, y: 860, held: false });
  const [collected, setCollected] = useState(0);
  const zoneRef = useRef(null);
  const last = useRef(null);
  const sinceTuft = useRef(0);
  const finished = useRef(false);

  const boxW = SHEEP.w * SHEEP.scale, boxH = SHEEP.h * SHEEP.scale;
  const boxLeft = SHEEP.x - boxW / 2, boxTop = SHEEP.y - boxH;

  const localFrom = (e) => {
    const r = zoneRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SHEEP.w, y: ((e.clientY - r.top) / r.height) * SHEEP.h };
  };
  const stageFrom = (p) => ({ x: boxLeft + p.x * SHEEP.scale, y: boxTop + p.y * SHEEP.scale });

  const onDown = (e) => {
    if (done) return;
    e.preventDefault();
    capturePointer(e);
    const p = localFrom(e);
    last.current = p;
    const s = stageFrom(p);
    setTool({ x: s.x, y: s.y, held: true });
    audio.play('buzz', 150);
  };
  const onMove = (e) => {
    if (!last.current || done) return;
    const p = localFrom(e);
    const moved = Math.hypot(p.x - last.current.x, p.y - last.current.y);
    last.current = p;
    const s = stageFrom(p);
    setTool({ x: s.x, y: s.y, held: true });
    if (moved <= 0) return;
    audio.play('buzz', 220);
    sinceTuft.current += moved;
    // Calcula fora do setState: efeitos (fx) não podem rodar durante a atualização do React
    const w = woolRef.current;
    let touched = false;
    const next = w.map((amt, i) => {
      const t = SHEEP_WOOL_TUFTS[i];
      const d = Math.hypot(p.x - t.x, p.y - t.y);
      if (d > cfg.radius || amt <= 0) return amt;
      touched = true;
      return Math.max(0, amt - moved * cfg.perUnit);
    });
    if (!touched) return;
    setWool(next);
    if (sinceTuft.current > 30) {
      sinceTuft.current = 0;
      fx.burst({ x: s.x, y: s.y, kind: 'poof', size: 0.5 });
      fx.fly({ kind: 'wool', from: s, to: { x: WOOL_BASKET.x, y: WOOL_BASKET.y - 40 }, duration: 600, onArrive: () => setCollected((c) => c + 1) });
    }
    if (next.every((a) => a <= 0.04)) setTimeout(finish, 300);
  };
  const onUp = () => { last.current = null; setTool((t) => ({ ...t, held: false })); };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setDone(true);
    setWool(SHEEP_WOOL_TUFTS.map(() => 0));
    actions.finishCollect(params.animalId);
    fx.burst({ x: SHEEP.x, y: SHEEP.y - 260, kind: 'confetti' });
    setTimeout(() => {
      fx.fly({ kind: 'wool', from: { x: 800, y: 480 }, to: { x: LAYOUT.basket.x, y: LAYOUT.basket.y - 30 }, duration: 800, onArrive: () => audio.play('happy', 0) });
      onDone();
    }, 1800);
  };

  useEffect(() => () => { finished.current = true; }, []);

  const untouched = wool.every((a) => a >= 0.98);
  const shownWool = Math.min(collected, 8);

  return (
    <>
      <ExitButton onClick={onExit} />
      <svg className="fz-box" style={{ left: 0, top: 0 }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        {/* Tapete de tosa */}
        <ellipse cx={SHEEP.x} cy={SHEEP.y + 30} rx="420" ry="50" fill="#D19A5B" stroke={INK} strokeWidth="5" />
        <ellipse cx={SHEEP.x} cy={SHEEP.y + 30} rx="360" ry="34" fill="#E3B47C" />
        {/* Cesto de lã */}
        <g transform={`translate(${WOOL_BASKET.x} ${WOOL_BASKET.y})`}>
          <ellipse cx="0" cy="110" rx="130" ry="16" fill="rgba(60,40,20,.14)" />
          <path d="M-120 -20h240l-24 130h-192z" fill="#D19A5B" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
          <g stroke="#A8703A" strokeWidth="4" opacity=".7"><line x1="-108" y1="30" x2="108" y2="30" /><line x1="-100" y1="76" x2="100" y2="76" /></g>
          {Array.from({ length: shownWool }, (_, i) => (
            <circle key={i} cx={-70 + (i % 4) * 46} cy={i >= 4 ? -30 : 0} r="30" fill="#FFF6E4" stroke={INK} strokeWidth="4" />
          ))}
          <path d="M-120 -20h240v22h-240z" fill="#E3B47C" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        </g>
      </svg>

      {/* Ovelha grande */}
      <div
        ref={zoneRef}
        className={`fz-wash-zone ${done ? 'is-happy' : ''}`}
        style={{ left: boxLeft, top: boxTop, width: boxW, height: boxH }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div className="fz-press" style={{ width: SHEEP.w, height: SHEEP.h, transform: `scale(${SHEEP.scale})`, transformOrigin: '0 0' }}>
          <SheepSprite expression={done ? 'happy' : 'normal'} woolAmounts={wool} stage={done ? 3 : 1} />
        </div>
        {done && [[10, 20], [80, 10], [90, 60], [20, 70]].map(([l, t], i) => (
          <svg key={i} className="fz-twinkle" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.25}s` }} width="60" height="60" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z" fill="#FFF3B0" stroke="#F0B429" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        ))}
      </div>

      {/* Máquina de tosar: segue o dedo; descansa no tapete */}
      {!done && (
        <div className={`fz-care-tool ${tool.held ? 'is-rubbing' : 'is-resting'}`} style={{ left: tool.x, top: tool.y, zIndex: 3 }}>
          <ItemIcon kind="shears" size={150} />
        </div>
      )}
      {!done && untouched && (
        <svg className="fz-care-hint" style={{ left: SHEEP.x, top: SHEEP.y - 320 }} width="220" height="80" viewBox="0 0 160 60" aria-hidden="true">
          <path d="M10 40 L40 16 L70 40 L100 16 L130 40 L150 24" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
          <path d="M10 40 L40 16 L70 40 L100 16 L130 40 L150 24" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {done && (
        <div className="fz-mg-done">
          <div className="big"><ItemIcon kind="wool" size={240} /></div>
        </div>
      )}
    </>
  );
}
