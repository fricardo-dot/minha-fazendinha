// Camada de efeitos: explosões de estrelinhas/confete/corações e itens voando.
// Nada aqui altera o estado do jogo.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';
import { ItemIcon } from './ItemIcon.jsx';

const FxContext = createContext(null);
export const useFx = () => useContext(FxContext);

let nextId = 1;

export function FxProvider({ children }) {
  const [bursts, setBursts] = useState([]);
  const [flights, setFlights] = useState([]);
  const timers = useRef(new Set());

  const later = useCallback((fn, ms) => {
    const t = setTimeout(() => { timers.current.delete(t); fn(); }, ms);
    timers.current.add(t);
  }, []);

  const burst = useCallback(({ x, y, kind = 'sparkle', size = 1 }) => {
    const id = nextId++;
    const ms = kind === 'confetti' ? BALANCE.anim.celebrateBigMs : BALANCE.anim.celebrateSmallMs;
    setBursts((b) => [...b, { id, x, y, kind, size, ms }]);
    later(() => setBursts((b) => b.filter((e) => e.id !== id)), ms + 50);
  }, [later]);

  const fly = useCallback(({ kind, from, to, duration = BALANCE.anim.flyMs, delay = 0, onArrive }) => {
    const id = nextId++;
    later(() => {
      setFlights((f) => [...f, { id, kind, from, to, duration }]);
      later(() => {
        setFlights((f) => f.filter((e) => e.id !== id));
        onArrive && onArrive();
      }, duration);
    }, delay);
  }, [later]);

  const api = useMemo(() => ({ burst, fly }), [burst, fly]);

  return (
    <FxContext.Provider value={api}>
      {children}
      <div className="fz-fx-layer" aria-hidden="true">
        {flights.map((f) => <Flight key={f.id} {...f} />)}
        {bursts.map((b) => <Burst key={b.id} {...b} />)}
      </div>
    </FxContext.Provider>
  );
}

function Flight({ kind, from, to, duration }) {
  // Curva simples: translate com um pequeno arco via keyframe de "sobe e desce".
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return (
    <div
      className="fz-flight"
      style={{
        left: from.x, top: from.y,
        '--dx': `${dx}px`, '--dy': `${dy}px`, '--dur': `${duration}ms`,
      }}
    >
      <div className="fz-flight-arc"><ItemIcon kind={kind} size={64} /></div>
    </div>
  );
}

const SPARKLE_COLORS = ['#FFD24A', '#FFF3B0', '#FF9F68', '#FFFFFF'];
const CONFETTI_COLORS = ['#FF6F91', '#FFD24A', '#6ECBF5', '#8FD36A', '#C89BFF', '#FF9F68'];

function Burst({ x, y, kind, size, ms }) {
  const n = kind === 'confetti' ? 26 : kind === 'hearts' ? 6 : kind === 'poof' ? 10 : 12;
  const parts = useMemo(() => Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 + Math.random() * 0.6;
    const dist = (kind === 'confetti' ? 160 + Math.random() * 140 : 60 + Math.random() * 70) * size;
    return {
      i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - (kind === 'hearts' ? 90 : kind === 'confetti' ? 60 : 20),
      rot: Math.random() * 720 - 360,
      delay: Math.random() * 120,
      color: (kind === 'confetti' ? CONFETTI_COLORS : SPARKLE_COLORS)[i % (kind === 'confetti' ? CONFETTI_COLORS.length : SPARKLE_COLORS.length)],
      scale: 0.7 + Math.random() * 0.8,
    };
  }), [n, kind, size]);

  return (
    <div className={`fz-burst fz-burst-${kind}`} style={{ left: x, top: y, '--dur': `${ms}ms` }}>
      {parts.map((p) => (
        <span
          key={p.i}
          className="fz-particle"
          style={{
            '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg`,
            '--delay': `${p.delay}ms`, '--c': p.color, '--s': p.scale,
          }}
        >
          {kind === 'hearts' ? <HeartShape /> : kind === 'sparkle' ? <StarShape /> : null}
        </span>
      ))}
    </div>
  );
}

function StarShape() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28">
      <path d="M12 1.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17l-6.2 3.6 1.6-7L2 8.8l7.1-.7z" fill="var(--c)" stroke="#8a6a12" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartShape({ size = 30, fill = '#FF6F91' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z" fill={fill} stroke="#8f2a44" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
