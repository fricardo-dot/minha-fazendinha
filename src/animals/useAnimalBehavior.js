// Comportamento "vivo" dos animais: passeios curtos, cochilos e reações.
// Nada disto é salvo; é só apresentação.
import { useEffect, useRef, useState } from 'react';
import { BALANCE } from '../config/balance.js';

const WALK_MS = 2400;
const MAX_STEP = 130;

export function useAnimalBehavior(animal, zone, home, frozen = false) {
  const frozenRef = useRef(frozen); frozenRef.current = frozen;
  const [pos, setPos] = useState(home);
  const [facing, setFacing] = useState(1);
  const [mood, setMood] = useState('idle'); // idle | walk | sleep
  const animalRef = useRef(animal); animalRef.current = animal;
  const posRef = useRef(pos); posRef.current = pos;
  const sleepingRef = useRef(false);
  const wakeRef = useRef(null);

  useEffect(() => {
    let timer = null;
    let walkTimer = null;
    let alive = true;

    const schedule = (ms) => { if (alive) timer = setTimeout(step, ms); };

    const step = () => {
      const a = animalRef.current;
      if (a.state === 'eating' || sleepingRef.current || frozenRef.current) { schedule(3000); return; }

      const now = Date.now();
      const idleLong = now - (a.lastCareAt || 0) > BALANCE.animals.sleepAfterIdleMs;
      if ((a.state === 'producing' || a.state === 'resting') && idleLong && Math.random() < 0.45) {
        sleepingRef.current = true;
        setMood('sleep');
        wakeRef.current = setTimeout(() => { sleepingRef.current = false; setMood('idle'); }, 9000);
        schedule(10000);
        return;
      }

      const cur = posRef.current;
      const minX = zone.x + 50, maxX = zone.x + zone.w - 50;
      const minY = zone.y + zone.h * 0.35, maxY = zone.y + zone.h - 10;
      const tx = Math.max(minX, Math.min(maxX, cur.x + (Math.random() * 2 - 1) * MAX_STEP));
      const ty = Math.max(minY, Math.min(maxY, cur.y + (Math.random() * 2 - 1) * 40));
      if (Math.abs(tx - cur.x) > 20) setFacing(tx < cur.x ? -1 : 1);
      setMood('walk');
      setPos({ x: tx, y: ty });
      walkTimer = setTimeout(() => setMood((m) => (m === 'walk' ? 'idle' : m)), WALK_MS);
      schedule(4500 + Math.random() * 5000);
    };

    schedule(2500 + Math.random() * 4000);
    return () => { alive = false; clearTimeout(timer); clearTimeout(walkTimer); clearTimeout(wakeRef.current); };
  }, [zone.x, zone.y, zone.w, zone.h]);

  /** Acorda o animal (toque). */
  const wake = () => {
    if (sleepingRef.current) { sleepingRef.current = false; clearTimeout(wakeRef.current); setMood('idle'); }
  };

  return { pos, facing, mood, wake, walkMs: WALK_MS };
}
