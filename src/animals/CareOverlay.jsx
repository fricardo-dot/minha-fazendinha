// Sessão de "esfregar": a ferramenta segue o dedo sobre o animal; cada trecho de movimento conta
// uma esfregada. Tocar fora do animal (ou ficar parado por um tempo) devolve a ferramenta ao kit.
import { useEffect, useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';
import { useGame } from '../state/GameProvider.jsx';
import { useStage } from '../components/Stage.jsx';
import { ItemIcon } from '../components/ItemIcon.jsx';

export function CareOverlay({ animalId, pos, width, height }) {
  const { care, actions } = useGame();
  const stage = useStage();
  const zoneRef = useRef(null);
  const [tool, setTool] = useState({ x: width / 2, y: height * 0.35 }); // posição local da ferramenta
  const [rubbing, setRubbing] = useState(false);
  const last = useRef(null);       // último ponto (lógico) do dedo
  const acc = useRef(0);           // distância acumulada desde a última esfregada
  const idleTimer = useRef(null);
  const strokes = care ? care.strokes : 0;

  // Posição absoluta (no palco) de um ponto local do overlay
  const toStage = (lx, ly) => ({ x: pos.x - width / 2 + lx, y: pos.y - height + ly });

  const armIdle = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      const t = toStage(tool.x, tool.y);
      actions.cancelCare(t);
    }, BALANCE.care.idleCancelMs);
  };

  useEffect(() => { armIdle(); return () => clearTimeout(idleTimer.current); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Tocar fora da zona devolve a ferramenta
  useEffect(() => {
    const onDown = (e) => {
      const el = zoneRef.current;
      if (el && el.contains(e.target)) return;
      e.stopPropagation();
      e.preventDefault();
      actions.cancelCare(toStage(tool.x, tool.y));
    };
    window.addEventListener('pointerdown', onDown, true);
    return () => window.removeEventListener('pointerdown', onDown, true);
  }, [tool.x, tool.y, pos.x, pos.y]); // eslint-disable-line react-hooks/exhaustive-deps

  const localFrom = (e) => {
    const r = zoneRef.current.getBoundingClientRect();
    return { x: (e.clientX - r.left) / stage.scale, y: (e.clientY - r.top) / stage.scale };
  };

  const onDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = localFrom(e);
    last.current = p;
    setTool(p);
    setRubbing(true);
    armIdle();
  };
  const onMove = (e) => {
    if (!last.current) return;
    const p = localFrom(e);
    const clamped = { x: Math.max(0, Math.min(width, p.x)), y: Math.max(0, Math.min(height, p.y)) };
    acc.current += Math.hypot(p.x - last.current.x, p.y - last.current.y);
    last.current = p;
    setTool(clamped);
    if (acc.current >= BALANCE.care.strokeDistance) {
      acc.current = 0;
      armIdle();
      actions.careStroke(animalId, toStage(clamped.x, clamped.y));
    }
  };
  const onUp = () => { last.current = null; setRubbing(false); };

  return (
    <div
      ref={zoneRef}
      className="fz-care-zone"
      style={{ left: pos.x, top: pos.y, width, height }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      onClick={(e) => e.stopPropagation()}
    >
      {strokes === 0 && !rubbing && (
        <svg className="fz-care-hint" width="160" height="60" viewBox="0 0 160 60" aria-hidden="true">
          <path d="M10 40 L40 16 L70 40 L100 16 L130 40 L150 24" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
          <path d="M10 40 L40 16 L70 40 L100 16 L130 40 L150 24" fill="none" stroke="#5B3D2E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <div className={`fz-care-tool ${rubbing ? 'is-rubbing' : 'is-resting'}`} style={{ left: tool.x, top: tool.y }}>
        <ItemIcon kind={care ? care.tool : 'sponge'} size={110} />
      </div>
    </div>
  );
}
