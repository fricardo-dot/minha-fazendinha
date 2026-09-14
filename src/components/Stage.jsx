// Palco lógico 1600×1000 escalado para caber na tela (letterbox).
// Todas as posições do jogo são em unidades lógicas; a conversão acontece aqui.
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { STAGE } from '../config/layout.js';

const StageContext = createContext(null);
export const useStage = () => useContext(StageContext);

function measure() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(vw / STAGE.width, vh / STAGE.height);
  return {
    scale,
    offsetX: (vw - STAGE.width * scale) / 2,
    offsetY: (vh - STAGE.height * scale) / 2,
    portrait: vh > vw,
    vw, vh,
  };
}

export function Stage({ children, onPointerDownCapture }) {
  const [m, setM] = useState(measure);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const update = () => setM(measure());
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    // iOS Safari muda o viewport quando a barra some/aparece
    const vv = window.visualViewport;
    vv && vv.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      vv && vv.removeEventListener('resize', update);
    };
  }, []);

  // Bloqueia gestos do navegador (zoom por pinça, pull-to-refresh, seleção)
  useEffect(() => {
    const prevent = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); };
    document.addEventListener('touchmove', prevent, { passive: false });
    document.addEventListener('gesturestart', prevent);
    return () => {
      document.removeEventListener('touchmove', prevent);
      document.removeEventListener('gesturestart', prevent);
    };
  }, []);

  const ctx = useMemo(() => ({
    ...m,
    rootRef,
    toLogical(clientX, clientY) {
      return { x: (clientX - m.offsetX) / m.scale, y: (clientY - m.offsetY) / m.scale };
    },
    toClient(x, y) {
      return { x: x * m.scale + m.offsetX, y: y * m.scale + m.offsetY };
    },
  }), [m]);

  return (
    <StageContext.Provider value={ctx}>
      <div className="fz-viewport" onPointerDownCapture={onPointerDownCapture}>
        <div
          ref={rootRef}
          className="fz-stage"
          style={{
            width: STAGE.width,
            height: STAGE.height,
            transform: `translate(${m.offsetX}px, ${m.offsetY}px) scale(${m.scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </StageContext.Provider>
  );
}
