// MINIGAME 3 — Lavar o porquinho.
// Fase 1: esfregar a esponja sobre o porquinho até a lama sumir (cada mancha some conforme o dedo passa).
// Fase 2: tocar no chuveiro para enxaguar. Depois: porquinho brilhando e uma trufa vai para a cesta.
// Não há como perder; sair no meio deixa o porquinho como estava.
import { useEffect, useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';
import { LAYOUT } from '../config/layout.js';
import { useGame } from '../state/GameProvider.jsx';
import { useFx } from '../components/Fx.jsx';
import { audio } from '../audio/AudioManager.js';
import { ItemIcon } from '../components/ItemIcon.jsx';
import { PigSprite, PIG_MUD_SPOTS } from '../animals/Pig.jsx';
import { ExitButton } from './MinigameHost.jsx';

const INK = '#5B3D2E';
const PIG = { x: 700, y: 640, scale: 3.1, w: 200, h: 150 }; // centro-base do porquinho no palco
const SHOWER = { x: 1250, y: 300 };

export function WashPig({ params, onDone, onExit }) {
  const { actions } = useGame();
  const fx = useFx();
  const cfg = BALANCE.minigames.washPig;
  const [mud, setMud] = useState(() => PIG_MUD_SPOTS.map(() => 1));
  const [phase, setPhase] = useState('scrub'); // scrub | rinse | rinsing | done
  const [sponge, setSponge] = useState({ x: 330, y: 820, held: false });
  const zoneRef = useRef(null);
  const last = useRef(null);
  const sinceBubble = useRef(0);
  const finished = useRef(false);

  const boxW = PIG.w * PIG.scale, boxH = PIG.h * PIG.scale;
  const boxLeft = PIG.x - boxW / 2, boxTop = PIG.y - boxH;

  // Ponto do dedo em coordenadas locais do porquinho (200×150)
  const localFrom = (e) => {
    const r = zoneRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * PIG.w, y: ((e.clientY - r.top) / r.height) * PIG.h };
  };
  const stageFrom = (p) => ({ x: boxLeft + p.x * PIG.scale, y: boxTop + p.y * PIG.scale });

  const onDown = (e) => {
    if (phase !== 'scrub') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = localFrom(e);
    last.current = p;
    const s = stageFrom(p);
    setSponge({ x: s.x, y: s.y, held: true });
  };
  const onMove = (e) => {
    if (!last.current || phase !== 'scrub') return;
    const p = localFrom(e);
    const moved = Math.hypot(p.x - last.current.x, p.y - last.current.y);
    last.current = p;
    const s = stageFrom(p);
    setSponge({ x: s.x, y: s.y, held: true });
    if (moved <= 0) return;
    sinceBubble.current += moved;
    if (sinceBubble.current > 26) {
      sinceBubble.current = 0;
      fx.burst({ x: s.x, y: s.y, kind: 'poof', size: 0.6 });
      audio.play('bubble', 120);
    }
    setMud((m) => {
      const next = m.map((amt, i) => {
        const spot = PIG_MUD_SPOTS[i];
        const d = Math.hypot(p.x - spot.x, p.y - spot.y);
        if (d > cfg.scrubRadius) return amt;
        return Math.max(0, amt - moved * cfg.scrubPerUnit);
      });
      if (next.every((a) => a <= 0.04) && !next.every((a, i) => a === m[i])) {
        setTimeout(() => setPhase('rinse'), 250);
        audio.play('happy');
      }
      return next;
    });
  };
  const onUp = () => { last.current = null; setSponge((s) => ({ ...s, held: false })); };

  const startRinse = () => {
    if (phase !== 'rinse') return;
    setPhase('rinsing');
    audio.play('water');
    setTimeout(() => audio.play('water', 0), 600);
    let n = 0;
    const t = setInterval(() => {
      fx.burst({ x: PIG.x - 120 + Math.random() * 240, y: PIG.y - 200 - Math.random() * 120, kind: 'splash', size: 0.8 });
      if (++n >= 6) clearInterval(t);
    }, 200);
    setTimeout(finish, cfg.rinseMs);
  };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase('done');
    setMud(PIG_MUD_SPOTS.map(() => 0));
    actions.finishCollect(params.animalId);
    fx.burst({ x: PIG.x, y: PIG.y - 260, kind: 'confetti' });
    setTimeout(() => {
      fx.fly({ kind: 'truffle', from: { x: 800, y: 480 }, to: { x: LAYOUT.basket.x, y: LAYOUT.basket.y - 30 }, duration: 800, onArrive: () => audio.play('happy', 0) });
      onDone();
    }, 1800);
  };

  useEffect(() => () => { finished.current = true; }, []);

  const remaining = mud.filter((a) => a > 0.04).length;

  return (
    <>
      <ExitButton onClick={onExit} />
      <svg className="fz-box" style={{ left: 0, top: 0 }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        {/* Tina de madeira atrás do porquinho */}
        <ellipse cx={PIG.x} cy={PIG.y + 40} rx="420" ry="40" fill="rgba(60,40,20,.14)" />
        <path d={`M${PIG.x - 380} ${PIG.y - 220} h760 l-40 250 h-680 z`} fill="#D19A5B" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <g stroke="#A8703A" strokeWidth="5" opacity=".7">
          {[-300, -200, -100, 0, 100, 200, 300].map((dx) => <line key={dx} x1={PIG.x + dx} y1={PIG.y - 220} x2={PIG.x + dx * 0.9} y2={PIG.y + 30} />)}
        </g>
        <rect x={PIG.x - 390} y={PIG.y - 236} width="780" height="26" rx="10" fill="#E3B47C" stroke={INK} strokeWidth="5" />
        {/* Água da tina */}
        <ellipse cx={PIG.x} cy={PIG.y - 210} rx="360" ry="34" fill="#B7E9F7" stroke="#6ECBF5" strokeWidth="4" />
        {/* Chuveiro */}
        <g transform={`translate(${SHOWER.x} ${SHOWER.y})`}>
          <path d="M0 -140v60" stroke={INK} strokeWidth="14" strokeLinecap="round" />
          <path d="M0 -140h-120" stroke={INK} strokeWidth="14" strokeLinecap="round" />
          <path d="M-60 -60c0-40 120-40 120 0z" fill="#DCE6EE" stroke={INK} strokeWidth="6" />
          <g fill={INK}>{[-40, -20, 0, 20, 40].map((dx) => <circle key={dx} cx={dx} cy="-50" r="5" />)}</g>
        </g>
        {phase === 'rinsing' && (
          <g className="fz-rain" stroke="#6ECBF5" strokeWidth="10" strokeLinecap="round" opacity=".9">
            {[-44, -22, 0, 22, 44].map((dx, i) => (
              <line key={dx} x1={SHOWER.x + dx} y1={SHOWER.y - 40} x2={PIG.x + dx * 4} y2={PIG.y - 200} style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </g>
        )}
      </svg>

      {/* Porquinho grande com lama */}
      <div
        ref={zoneRef}
        className={`fz-wash-zone ${phase === 'done' ? 'is-happy' : ''}`}
        style={{ left: boxLeft, top: boxTop, width: boxW, height: boxH }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div className="fz-press" style={{ width: PIG.w, height: PIG.h, transform: `scale(${PIG.scale})`, transformOrigin: '0 0' }}>
          <PigSprite expression={phase === 'done' || phase === 'rinsing' ? 'happy' : 'normal'} mudAmounts={mud} />
        </div>
        {phase === 'done' && [[10, 20], [80, 10], [90, 60], [20, 70]].map(([l, t], i) => (
          <svg key={i} className="fz-twinkle" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${i * 0.25}s` }} width="60" height="60" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l2 7 7 3-7 3-2 7-2-7-7-3 7-3z" fill="#FFF3B0" stroke="#F0B429" strokeWidth="1.2" strokeLinejoin="round" />
          </svg>
        ))}
      </div>

      {/* Esponja: segue o dedo enquanto esfrega; descansa na beira da tina */}
      {phase === 'scrub' && (
        <div className={`fz-care-tool ${sponge.held ? 'is-rubbing' : 'is-resting'}`} style={{ left: sponge.x, top: sponge.y, zIndex: 3 }}>
          <ItemIcon kind="sponge" size={150} />
        </div>
      )}
      {phase === 'scrub' && remaining === PIG_MUD_SPOTS.length && (
        <svg className="fz-care-hint" style={{ left: PIG.x, top: PIG.y - 300 }} width="220" height="80" viewBox="0 0 160 60" aria-hidden="true">
          <path d="M10 40 L40 16 L70 40 L100 16 L130 40 L150 24" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
          <path d="M10 40 L40 16 L70 40 L100 16 L130 40 L150 24" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {/* Botão do chuveiro (fase de enxágue) */}
      {phase === 'rinse' && (
        <div className="fz-obj fz-tappable is-hinted" style={{ left: SHOWER.x, top: SHOWER.y + 40, width: 200, height: 200 }} onClick={startRinse}>
          <div className="fz-press" style={{ width: 200, height: 200 }}>
            <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
              <circle cx="100" cy="100" r="80" fill="#FFF6E4" stroke={INK} strokeWidth="6" />
              <g fill="#6ECBF5" stroke="#4FB3E0" strokeWidth="3">
                <path d="M70 70c0-14 14-24 14-24s14 10 14 24a14 14 0 0 1-28 0z" />
                <path d="M104 100c0-14 14-24 14-24s14 10 14 24a14 14 0 0 1-28 0z" />
                <path d="M74 122c0-14 14-24 14-24s14 10 14 24a14 14 0 0 1-28 0z" />
              </g>
              <path d="M100 150v-10" stroke={INK} strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="fz-touch" style={{ width: 240, height: 240 }} />
        </div>
      )}

      {phase === 'done' && (
        <div className="fz-mg-done">
          <div className="big"><ItemIcon kind="truffle" size={240} /></div>
        </div>
      )}
    </>
  );
}
