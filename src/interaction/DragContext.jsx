// Sistema de "pegar e levar" para mãos pequenas.
// Dois caminhos sempre válidos:
//   1. arrastar: apertar na fonte, mover e soltar sobre o alvo;
//   2. tocar: tocar a fonte (o item fica "na mão", flutuando) e depois tocar o alvo.
// Soltar fora de um alvo devolve o item ao lugar com um balanço engraçado. Nunca some.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useStage } from '../components/Stage.jsx';
import { BALANCE } from '../config/balance.js';
import { audio } from '../audio/AudioManager.js';
import { ItemIcon } from '../components/ItemIcon.jsx';

const DragContext = createContext(null);
export const useDrag = () => useContext(DragContext);

const TAP_SLOP = 18; // unidades lógicas de movimento tolerado para ainda ser "toque"

export function DragProvider({ children }) {
  const stage = useStage();
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const targets = useRef(new Map());
  const [held, setHeld] = useState(null);
  const heldRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);
  const sessionRef = useRef(null); // { downX, downY, moved, pointerId }

  const setHeldBoth = (h) => { heldRef.current = h; setHeld(h); };

  const registerTarget = useCallback((id, def) => {
    targets.current.set(id, def);
    return () => { targets.current.delete(id); };
  }, []);

  /** Encontra o alvo sob o ponto (em coordenadas de tela), com área inflada. */
  const hitTest = useCallback((clientX, clientY, item) => {
    const st = stageRef.current;
    let best = null;
    let rejected = null;
    for (const [id, t] of targets.current) {
      const el = t.ref.current;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const inf = (t.inflate ?? 40) * st.scale;
      if (clientX < r.left - inf || clientX > r.right + inf || clientY < r.top - inf || clientY > r.bottom + inf) continue;
      const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
      const d = Math.hypot(clientX - cx, clientY - cy);
      if (!t.accepts(item)) { rejected = rejected || { id, t }; continue; }
      if (!best || d < best.d) best = { id, t, d };
    }
    return { best, rejected };
  }, []);

  const returnHome = useCallback((withOops) => {
    const h = heldRef.current;
    if (!h) return;
    if (withOops) audio.play('oops', 200);
    setHeldBoth({ ...h, returning: true, sticky: false });
    setHoverId(null);
    setTimeout(() => { if (heldRef.current && heldRef.current.id === h.id) setHeldBoth(null); }, BALANCE.anim.returnMs);
  }, []);

  const tryDrop = useCallback((clientX, clientY) => {
    const h = heldRef.current;
    if (!h) return;
    const { best, rejected } = hitTest(clientX, clientY, h.item);
    if (best) {
      const p = stageRef.current.toLogical(clientX, clientY);
      const ok = best.t.onDrop(h.item, p);
      if (ok !== false) { setHeldBoth(null); setHoverId(null); return; }
      returnHome(true);
      return;
    }
    if (rejected) { rejected.t.onReject && rejected.t.onReject(h.item); returnHome(true); return; }
    returnHome(false);
  }, [hitTest, returnHome]);

  // Listeners globais enquanto há um item na mão (dependem só de "ativo", não da posição)
  const active = !!held && !held.returning;
  useEffect(() => {
    if (!active) return undefined;

    const onMove = (e) => {
      const s = sessionRef.current;
      const h = heldRef.current;
      if (!h || h.sticky) return;
      if (s && e.pointerId !== s.pointerId) return;
      const p = stageRef.current.toLogical(e.clientX, e.clientY);
      if (s && !s.moved && Math.hypot(p.x - s.downX, p.y - s.downY) > TAP_SLOP) s.moved = true;
      setHeldBoth({ ...h, x: p.x, y: p.y });
      const { best } = hitTest(e.clientX, e.clientY, h.item);
      setHoverId(best ? best.id : null);
    };

    const onUp = (e) => {
      const s = sessionRef.current;
      const h = heldRef.current;
      if (!h || h.sticky) return;
      if (s && e.pointerId !== s.pointerId) return;
      sessionRef.current = null;
      if (s && !s.moved) {
        // Foi um toque: ou ação automática, ou fica "na mão"
        if (h.onTap) { setHeldBoth(null); h.onTap(); return; }
        setHeldBoth({ ...h, sticky: true });
        setHoverId(null);
        return;
      }
      tryDrop(e.clientX, e.clientY);
    };

    const onDownSticky = (e) => {
      const h = heldRef.current;
      if (!h || !h.sticky) return;
      // Setas do mapa (e o que mais tiver data-keep-held): o item continua na mão e o toque passa
      if (e.target && e.target.closest && e.target.closest('[data-keep-held]')) return;
      e.stopPropagation();
      e.preventDefault();
      // O clique que vem depois deste toque não deve acionar o alvo (ex.: carinho por cima da entrega)
      const swallow = (ce) => { ce.stopPropagation(); ce.preventDefault(); };
      window.addEventListener('click', swallow, true);
      setTimeout(() => window.removeEventListener('click', swallow, true), 500);
      tryDrop(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('pointerdown', onDownSticky, true);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointerdown', onDownSticky, true);
    };
  }, [active, hitTest, tryDrop]);

  /**
   * Inicia "segurar" a partir de um pointerdown.
   * item: { kind, ...dados }; onTap: ação automática quando é só um toque (opcional).
   */
  const startHold = useCallback((e, item, { onTap = null, originEl = null } = {}) => {
    if (heldRef.current) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const st = stageRef.current;
    const el = originEl || e.currentTarget;
    const r = el.getBoundingClientRect();
    const origin = st.toLogical((r.left + r.right) / 2, (r.top + r.bottom) / 2);
    const p = st.toLogical(e.clientX, e.clientY);
    sessionRef.current = { downX: p.x, downY: p.y, moved: false, pointerId: e.pointerId };
    setHeldBoth({ id: Math.random().toString(36).slice(2), item, origin, x: p.x, y: p.y, sticky: false, returning: false, onTap });
    audio.play('collect', 120);
  }, []);

  const cancelHold = useCallback(() => returnHome(false), [returnHome]);

  const api = useMemo(() => ({ held, hoverId, registerTarget, startHold, cancelHold }), [held, hoverId, registerTarget, startHold, cancelHold]);

  return (
    <DragContext.Provider value={api}>
      {children}
      <HeldItem held={held} />
    </DragContext.Provider>
  );
}

function HeldItem({ held }) {
  if (!held) return null;
  const x = held.returning ? held.origin.x : held.x;
  const y = held.returning ? held.origin.y : held.y;
  const cls = ['fz-held', held.sticky && 'is-sticky', held.returning && 'is-returning'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ left: x, top: y, '--return-ms': `${BALANCE.anim.returnMs}ms` }}>
      <div className="fz-held-inner">
        <ItemIcon kind={held.item.kind} size={96} />
      </div>
    </div>
  );
}

/** Hook para um alvo de soltura. Retorna a ref a aplicar no elemento e se está sob o item. */
export function useDropTarget(id, { accepts, onDrop, onReject, inflate }) {
  const { registerTarget, hoverId, held } = useDrag();
  const ref = useRef(null);
  const acceptsRef = useRef(accepts); acceptsRef.current = accepts;
  const onDropRef = useRef(onDrop); onDropRef.current = onDrop;
  const onRejectRef = useRef(onReject); onRejectRef.current = onReject;
  useEffect(() => registerTarget(id, {
    ref,
    inflate,
    accepts: (item) => acceptsRef.current(item),
    onDrop: (item, p) => onDropRef.current(item, p),
    onReject: (item) => onRejectRef.current && onRejectRef.current(item),
  }), [id, inflate, registerTarget]);
  const wantsHeld = !!held && !held.returning && accepts(held.item);
  return { ref, isHover: hoverId === id, wantsHeld };
}
