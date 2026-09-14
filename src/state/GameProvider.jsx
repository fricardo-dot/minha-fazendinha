// Provedor do jogo: estado (reducer), loop de tempo, salvamento automático,
// dicas por ociosidade e as AÇÕES de alto nível que os componentes chamam.
// As ações combinam: regra (dispatch) + som + efeito visual. Os componentes não decidem regras.
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { reducer } from './reducer.js';
import { createInitialState } from './initialState.js';
import { nextHint } from './selectors.js';
import { BALANCE } from '../config/balance.js';
import { LAYOUT } from '../config/layout.js';
import { createStorage } from '../persistence/storage.js';
import { pickAdapter } from '../persistence/adapters.js';
import { audio } from '../audio/AudioManager.js';
import { useFx } from '../components/Fx.jsx';
import { stageFor, canPet } from '../rules/friendship.js';
import { basketValue, canAfford, shouldPlayEggMinigame, upgradeById } from '../rules/economy.js';
import { PRODUCT_REWARD } from '../config/content.js';

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

const storage = createStorage(pickAdapter());

function init() {
  const saved = storage.load();
  return saved || createInitialState();
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const stateRef = useRef(state);
  stateRef.current = state;
  const fx = useFx();

  const [minigame, setMinigame] = useState(null); // { id, animalId? }
  const [hint, setHint] = useState(null);
  const [heartMeter, setHeartMeter] = useState(null); // { animalId, until }
  const [coinFlash, setCoinFlash] = useState(0);      // incrementa quando faltam moedas
  const lastInputAt = useRef(Date.now());

  // ── Loop de tempo ────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), 250);
    return () => clearInterval(t);
  }, []);

  // ── Salvamento automático ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => storage.save(state), BALANCE.save.debounceMs);
    return () => clearTimeout(t);
  }, [state]);
  useEffect(() => {
    const flush = () => storage.save(stateRef.current);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  // ── Áudio segue as configurações ─────────────────────────────
  useEffect(() => { audio.setSound(state.settings.sound); }, [state.settings.sound]);
  useEffect(() => { audio.setMusic(state.settings.music); }, [state.settings.music]);

  // ── Registro de toque (para dicas + desbloqueio de áudio) ────
  useEffect(() => {
    const onDown = () => { lastInputAt.current = Date.now(); audio.unlock(); setHint(null); };
    window.addEventListener('pointerdown', onDown, true);
    return () => window.removeEventListener('pointerdown', onDown, true);
  }, []);

  // ── Dicas por ociosidade ─────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      if (minigame) { setHint(null); return; }
      const idle = Date.now() - lastInputAt.current;
      if (idle < BALANCE.hints.idleMs) return;
      setHint(nextHint(stateRef.current));
    }, 500);
    return () => clearInterval(t);
  }, [minigame]);

  // ── Helpers ──────────────────────────────────────────────────
  const showHearts = useCallback((animalId, at) => {
    fx.burst({ x: at.x, y: at.y - 60, kind: 'hearts' });
    setHeartMeter({ animalId, until: Date.now() + BALANCE.anim.heartMeterMs });
  }, [fx]);

  const checkLevelUp = useCallback((animalId, before, at) => {
    const after = stateRef.current.animals[animalId];
    if (!after) return;
    // stateRef ainda pode ser o estado antigo neste tick; comparamos no próximo frame
    requestAnimationFrame(() => {
      const now = stateRef.current.animals[animalId];
      if (now && stageFor(now.hearts) > stageFor(before.hearts)) {
        audio.play('fanfare');
        fx.burst({ x: at.x, y: at.y - 40, kind: 'confetti' });
      }
    });
  }, [fx]);

  // ── Ações ────────────────────────────────────────────────────
  const actions = useMemo(() => ({
    /** Alimenta um animal com um item. Retorna false se não deu (o item volta com uma reação). */
    feed(animalId, food, at) {
      const s = stateRef.current;
      const a = s.animals[animalId];
      if (!a || a.state !== 'hungry' || BALANCE.animals[a.type].food !== food) return false;
      if (food === 'corn' && s.inventory.corn <= 0) return false;
      const now = Date.now();
      dispatch({ type: 'FEED', animalId, food, now });
      audio.play('munch');
      showHearts(animalId, at);
      checkLevelUp(animalId, a, at);
      return true;
    },

    /** Carinho: reação sempre; coração só depois do intervalo. */
    pet(animalId, at) {
      const a = stateRef.current.animals[animalId];
      if (!a) return false;
      const now = Date.now();
      const gained = canPet(a, now);
      dispatch({ type: 'PET', animalId, now });
      audio.play(a.type === 'cow' ? 'cow' : 'chicken', 350);
      if (gained) { showHearts(animalId, at); checkLevelUp(animalId, a, at); }
      else fx.burst({ x: at.x, y: at.y - 50, kind: 'sparkle', size: 0.6 });
      return gained;
    },

    plant(index, at) {
      if (stateRef.current.plots[index]?.stage !== 'empty') return false;
      dispatch({ type: 'PLANT', index });
      audio.play('plant');
      fx.burst({ x: at.x, y: at.y, kind: 'poof', size: 0.6 });
      return true;
    },

    water(index, at) {
      const p = stateRef.current.plots[index];
      if (!p || p.stage !== 'seed' || p.watered) {
        // Regar de novo é sempre bem-vindo: só o splash, sem efeito
        if (p && p.stage !== 'empty') { audio.play('water'); fx.burst({ x: at.x, y: at.y, kind: 'splash', size: 0.8 }); return true; }
        return false;
      }
      dispatch({ type: 'WATER', index, now: Date.now() });
      audio.play('water');
      fx.burst({ x: at.x, y: at.y, kind: 'splash' });
      return true;
    },

    harvest(index, at) {
      if (stateRef.current.plots[index]?.stage !== 'ready') return false;
      dispatch({ type: 'HARVEST', index });
      audio.play('collect');
      fx.burst({ x: at.x, y: at.y - 30, kind: 'sparkle', size: 0.8 });
      fx.fly({ kind: 'corn', from: at, to: { x: LAYOUT.cornPile.x, y: LAYOUT.cornPile.y }, onArrive: () => audio.play('plant', 0) });
      return true;
    },

    /** Ovo do chão → cesta (voando). */
    collectEgg(animalId, at) {
      const a = stateRef.current.animals[animalId];
      if (!a || a.state !== 'ready') return false;
      dispatch({ type: 'COLLECT', animalId, now: Date.now() });
      audio.play('collect');
      fx.burst({ x: at.x, y: at.y, kind: 'sparkle', size: 0.7 });
      fx.fly({ kind: 'egg', from: at, to: { x: LAYOUT.basket.x, y: LAYOUT.basket.y - 20 }, onArrive: () => audio.play('happy', 0) });
      return true;
    },

    /** Entrega: com muitos ovos abre o minigame da cesta; senão entrega direto. */
    deliver() {
      const s = stateRef.current;
      if (basketValue(s.basket) <= 0) { audio.play('oops'); return false; }
      if (shouldPlayEggMinigame(s.basket)) { setMinigame({ id: 'eggBasket' }); return true; }
      actions.completeDelivery(0, false);
      return true;
    },

    completeDelivery(bonus, fromMinigame) {
      const s = stateRef.current;
      const eggs = s.basket.eggs, milk = s.basket.milk;
      const value = basketValue(s.basket) + bonus;
      if (value <= 0) return;
      dispatch({ type: 'DELIVER', bonus, minigame: fromMinigame });
      audio.play('success');
      const from = { x: LAYOUT.delivery.x, y: LAYOUT.delivery.y - 40 };
      const to = { x: LAYOUT.hud.coinJar.x + 70, y: LAYOUT.hud.coinJar.y + 80 };
      const coins = Math.min(value, 10);
      for (let i = 0; i < coins; i++) {
        fx.fly({ kind: 'coin', from, to, delay: i * 90, duration: 800, onArrive: () => audio.play('coin', 0) });
      }
      if (eggs + milk >= 3 || bonus > 0) fx.burst({ x: from.x, y: from.y, kind: 'confetti', size: 0.8 });
      else fx.burst({ x: from.x, y: from.y, kind: 'sparkle' });
    },

    openMilking(animalId) {
      const a = stateRef.current.animals[animalId];
      if (!a || a.state !== 'ready') return false;
      setMinigame({ id: 'milking', animalId });
      return true;
    },

    /** Chamado pelo minigame de ordenha quando o balde enche. */
    finishMilking(animalId) {
      const a = stateRef.current.animals[animalId];
      if (!a || a.state !== 'ready') return;
      dispatch({ type: 'COLLECT', animalId, now: Date.now() });
      dispatch({ type: 'MINIGAME_PLAYED' });
      audio.play('fanfare');
    },

    closeMinigame() { setMinigame(null); },

    buyUpgrade(id, at) {
      const s = stateRef.current;
      if (!canAfford(s, id)) { audio.play('oops'); setCoinFlash((n) => n + 1); return false; }
      dispatch({ type: 'BUY_UPGRADE', id });
      audio.play('build');
      fx.burst({ x: at.x, y: at.y, kind: 'poof' });
      setTimeout(() => fx.burst({ x: at.x, y: at.y - 60, kind: 'confetti' }), 250);
      return true;
    },

    setSetting(key, value) { dispatch({ type: 'SET_SETTING', key, value }); },

    resetFarm() { storage.clear(); dispatch({ type: 'RESET' }); },
  }), [fx, showHearts, checkLevelUp]);

  // Gancho de depuração (só em desenvolvimento): window.__fz.getState() / dispatch(action)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return undefined;
    window.__fz = { getState: () => stateRef.current, dispatch, actions };
    return () => { delete window.__fz; };
  }, [actions]);

  // Medidor de corações some sozinho
  useEffect(() => {
    if (!heartMeter) return undefined;
    const t = setTimeout(() => setHeartMeter(null), Math.max(0, heartMeter.until - Date.now()));
    return () => clearTimeout(t);
  }, [heartMeter]);

  const value = useMemo(() => ({
    state, actions, minigame, hint, heartMeter, coinFlash,
    rewards: PRODUCT_REWARD, upgradeById,
  }), [state, actions, minigame, hint, heartMeter, coinFlash]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
