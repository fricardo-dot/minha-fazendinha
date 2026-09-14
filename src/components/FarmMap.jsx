// Mapa da fazenda: áreas lado a lado, setas grandes nas bordas e deslizar com o dedo.
// A camada persistente (HUD, cesta, caminhão, kit) fica fora daqui, por cima de todas as áreas.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AREAS, HOME_AREA, areaIndex, areasOfHint } from '../config/areas.js';
import { LAYOUT, STAGE } from '../config/layout.js';
import { ANIMALS } from '../config/content.js';
import { useGame } from '../state/GameProvider.jsx';
import { useDrag } from '../interaction/DragContext.jsx';
import { useStage } from './Stage.jsx';
import { audio } from '../audio/AudioManager.js';
import { YardArea } from '../areas/YardArea.jsx';
import { PastureArea } from '../areas/PastureArea.jsx';
import { LakeArea } from '../areas/LakeArea.jsx';

const AREA_COMPONENTS = { yard: YardArea, pasture: PastureArea, lake: LakeArea };
const SWIPE_DX = 140;   // deslocamento horizontal (lógico) para virar a página
const SWIPE_MAX_DY = 120;

export function FarmMap() {
  const { hint, minigame } = useGame();
  const { held } = useDrag();
  const stage = useStage();
  const [index, setIndex] = useState(() => areaIndex(HOME_AREA));
  const indexRef = useRef(index); indexRef.current = index;
  const swipe = useRef(null);

  const go = useCallback((next) => {
    const clamped = Math.max(0, Math.min(AREAS.length - 1, next));
    if (clamped === indexRef.current) return;
    setIndex(clamped);
    audio.play('swish', 200);
  }, []);

  // Deslizar com o dedo sobre a área (ignorado durante um arraste de item)
  const onPointerDown = (e) => {
    if (held && !held.sticky) return;
    const p = stage.toLogical(e.clientX, e.clientY);
    swipe.current = { x: p.x, y: p.y, pointerId: e.pointerId, done: false };
  };
  useEffect(() => {
    const onMove = (e) => {
      const s = swipe.current;
      if (!s || s.done || e.pointerId !== s.pointerId) return;
      if (held && !held.sticky) { swipe.current = null; return; }
      const p = stage.toLogical(e.clientX, e.clientY);
      const dx = p.x - s.x, dy = p.y - s.y;
      if (Math.abs(dy) > SWIPE_MAX_DY) { swipe.current = null; return; }
      if (Math.abs(dx) >= SWIPE_DX) { s.done = true; go(indexRef.current + (dx < 0 ? 1 : -1)); }
    };
    const onUp = (e) => { if (swipe.current && e.pointerId === swipe.current.pointerId) swipe.current = null; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [go, held, stage]);

  // A dica está em outra área? Então a seta para lá pulsa.
  const hintDir = useMemo(() => {
    const areas = areasOfHint(hint, ANIMALS);
    if (!areas) return 0;
    const current = AREAS[index].id;
    if (areas.includes(current)) return 0;
    const target = areas.map(areaIndex).sort((a, b) => Math.abs(a - index) - Math.abs(b - index))[0];
    return target > index ? 1 : -1;
  }, [hint, index]);

  return (
    <>
      <div
        className="fz-map-strip"
        style={{ width: STAGE.width * AREAS.length, transform: `translateX(${-index * STAGE.width}px)` }}
        onPointerDown={onPointerDown}
      >
        {AREAS.map((a, i) => {
          const Area = AREA_COMPONENTS[a.id];
          return (
            <div key={a.id} className={`fz-area ${i === index ? 'is-current' : ''}`} aria-hidden={i !== index} inert={i !== index ? '' : undefined}>
              <Area />
            </div>
          );
        })}
      </div>
      {!minigame && index > 0 && <NavArrow dir={-1} target={AREAS[index - 1]} hinted={hintDir < 0} onClick={() => go(index - 1)} />}
      {!minigame && index < AREAS.length - 1 && <NavArrow dir={1} target={AREAS[index + 1]} hinted={hintDir > 0} onClick={() => go(index + 1)} />}
    </>
  );
}

const ICONS = {
  house: (
    <g>
      <path d="M-26 4 L0 -20 L26 4 Z" fill="#E0574B" stroke="#5B3D2E" strokeWidth="3" strokeLinejoin="round" />
      <rect x="-20" y="4" width="40" height="24" rx="4" fill="#FFF1D6" stroke="#5B3D2E" strokeWidth="3" />
      <rect x="-6" y="12" width="12" height="16" rx="3" fill="#5B3D2E" />
    </g>
  ),
  cow: (
    <g>
      <ellipse cx="0" cy="4" rx="24" ry="22" fill="#FFFFFF" stroke="#5B3D2E" strokeWidth="3" />
      <path d="M-22 -6c-8-4-14 0-14 4s6 6 14 2zM22 -6c8-4 14 0 14 4s-6 6-14 2z" fill="#fff" stroke="#5B3D2E" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M-12 -14c-3-8 0-14 5-14M12 -14c3-8 0-14-5-14" fill="none" stroke="#5B3D2E" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="0" cy="14" rx="14" ry="9" fill="#FFB5C2" stroke="#5B3D2E" strokeWidth="2.5" />
      <circle cx="-8" cy="-2" r="3" fill="#5B3D2E" /><circle cx="8" cy="-2" r="3" fill="#5B3D2E" />
      <circle cx="-5" cy="14" r="2" fill="#5B3D2E" /><circle cx="5" cy="14" r="2" fill="#5B3D2E" />
    </g>
  ),
  frog: (
    <g>
      <ellipse cx="0" cy="8" rx="24" ry="16" fill="#7CC15A" stroke="#5B3D2E" strokeWidth="3" />
      <circle cx="-11" cy="-8" r="9" fill="#7CC15A" stroke="#5B3D2E" strokeWidth="3" /><circle cx="11" cy="-8" r="9" fill="#7CC15A" stroke="#5B3D2E" strokeWidth="3" />
      <circle cx="-11" cy="-8" r="4.5" fill="#fff" /><circle cx="11" cy="-8" r="4.5" fill="#fff" />
      <circle cx="-10" cy="-7" r="2.2" fill="#5B3D2E" /><circle cx="12" cy="-7" r="2.2" fill="#5B3D2E" />
      <path d="M-8 10c4 4 12 4 16 0" fill="none" stroke="#5B3D2E" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
};

/** Seta de navegação: placa de madeira redonda com o desenho da área vizinha. */
function NavArrow({ dir, target, hinted, onClick }) {
  const pos = dir < 0 ? LAYOUT.nav.left : LAYOUT.nav.right;
  return (
    <div
      className={`fz-obj fz-nav fz-tappable ${hinted ? 'is-hinted' : ''}`}
      style={{ left: pos.x, top: pos.y, width: 140, height: 170 }}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      data-keep-held=""
      role="button"
      aria-label={`Ir para ${target.name}`}
    >
      <div className="fz-press" style={{ width: 140, height: 170 }}>
        <svg width="140" height="170" viewBox="0 0 140 170" aria-hidden="true">
          <ellipse cx="70" cy="164" rx="30" ry="6" fill="rgba(60,40,20,.15)" />
          <rect x="60" y="110" width="20" height="54" rx="6" fill="#A8703A" stroke="#5B3D2E" strokeWidth="4" />
          <circle cx="70" cy="64" r="56" fill="#FFF6E4" stroke="#5B3D2E" strokeWidth="5" />
          <circle cx="70" cy="64" r="46" fill="none" stroke="#E3B47C" strokeWidth="3" strokeDasharray="6 8" />
          <g transform="translate(70 56) scale(.95)">{ICONS[target.icon]}</g>
          <path d={dir < 0 ? 'M58 104l-14-12 14-12' : 'M82 104l14-12-14-12'} fill="none" stroke="#5B3D2E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d={dir < 0 ? 'M44 92h50' : 'M46 92h50'} stroke="#5B3D2E" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="fz-touch" style={{ width: 170, height: 200 }} />
    </div>
  );
}
