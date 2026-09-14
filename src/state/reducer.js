// Reducer puro do jogo. Nenhum efeito colateral, nenhum som, nenhuma animação aqui.
import { BALANCE } from '../config/balance.js';
import { tickAnimal, tickPlot, feedAnimal, collectFromAnimal, applyCare } from '../rules/production.js';
import { basketValue, upgradeById } from '../rules/economy.js';
import { canPet } from '../rules/friendship.js';
import { createInitialState, makeAnimal } from './initialState.js';
import { ANIMALS, PRODUCT_KEY } from '../config/content.js';

const F = BALANCE.friendship;

function updateAnimal(state, id, fn) {
  const a = state.animals[id];
  if (!a) return state;
  const next = fn(a);
  if (next === a) return state;
  return { ...state, animals: { ...state.animals, [id]: next } };
}

function updatePlot(state, index, fn) {
  const p = state.plots[index];
  if (!p) return state;
  const next = fn(p);
  if (next === p) return state;
  const plots = state.plots.slice();
  plots[index] = next;
  return { ...state, plots };
}

export function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'RESET':
      return { ...createInitialState(), settings: state.settings };

    case 'TICK': {
      const { now } = action;
      let changed = false;
      const animals = {};
      for (const [id, a] of Object.entries(state.animals)) {
        const n = tickAnimal(a, now);
        if (n !== a) changed = true;
        animals[id] = n;
      }
      const plots = state.plots.map((p) => {
        const n = tickPlot(p, now);
        if (n !== p) changed = true;
        return n;
      });
      return changed ? { ...state, animals, plots } : state;
    }

    case 'FEED': {
      const { animalId, food, now } = action;
      const a = state.animals[animalId];
      if (!a || a.state !== 'hungry') return state;
      const cfg = BALANCE.animals[a.type];
      if (cfg.food !== food) return state;
      let next = state;
      if (food === 'corn') {
        if (state.inventory.corn <= 0) return state;
        next = { ...next, inventory: { ...next.inventory, corn: next.inventory.corn - 1 } };
      }
      return updateAnimal(next, animalId, (an) => ({
        ...feedAnimal(an, now),
        hearts: an.hearts + F.perCare,
      }));
    }

    case 'PET': {
      const { animalId, now } = action;
      return updateAnimal(state, animalId, (a) =>
        canPet(a, now) ? { ...a, hearts: a.hearts + F.perCare, lastPetAt: now, lastCareAt: now } : a,
      );
    }

    case 'CARE': {
      const { animalId, kind, now } = action;
      return updateAnimal(state, animalId, (a) => {
        const { animal, gainedHeart } = applyCare(a, kind, now);
        return gainedHeart ? { ...animal, hearts: animal.hearts + F.perCare } : animal;
      });
    }

    case 'PLANT':
      return updatePlot(state, action.index, (p) =>
        p.stage === 'empty' ? { stage: 'seed', watered: false, nextStageAt: null } : p,
      );

    case 'WATER':
      return updatePlot(state, action.index, (p) =>
        p.stage === 'seed' && !p.watered
          ? { ...p, watered: true, nextStageAt: action.now + BALANCE.crops.corn.stageMs }
          : p,
      );

    case 'HARVEST': {
      const p = state.plots[action.index];
      if (!p || p.stage !== 'ready') return state;
      const next = updatePlot(state, action.index, () => ({ stage: 'empty', watered: false, nextStageAt: null }));
      return {
        ...next,
        inventory: { ...next.inventory, corn: next.inventory.corn + BALANCE.crops.corn.yield },
        stats: { ...next.stats, harvests: next.stats.harvests + 1 },
      };
    }

    case 'COLLECT': {
      // Ovo do chão → cesta; leite (após ordenha) → cesta.
      const { animalId, now } = action;
      const a = state.animals[animalId];
      if (!a || a.state !== 'ready') return state;
      const product = BALANCE.animals[a.type].product;
      const key = PRODUCT_KEY[product];
      const viaMinigame = !!BALANCE.animals[a.type].collectMinigame; // ordenhar/lavar é cuidado: dá coração
      const next = updateAnimal(state, animalId, (an) => ({
        ...collectFromAnimal(an, now),
        hearts: viaMinigame ? an.hearts + F.perCare : an.hearts,
        lastCareAt: viaMinigame ? now : an.lastCareAt,
      }));
      return {
        ...next,
        basket: { ...next.basket, [key]: (next.basket[key] || 0) + 1 },
      };
    }

    case 'DELIVER': {
      const value = basketValue(state.basket) + (action.bonus || 0);
      if (value <= 0) return state;
      return {
        ...state,
        coins: state.coins + value,
        basket: { eggs: 0, milk: 0, truffles: 0 },
        stats: {
          ...state.stats,
          deliveries: state.stats.deliveries + 1,
          minigames: state.stats.minigames + (action.minigame ? 1 : 0),
        },
      };
    }

    case 'MINIGAME_PLAYED':
      return { ...state, stats: { ...state.stats, minigames: state.stats.minigames + 1 } };

    case 'BUY_UPGRADE': {
      const up = upgradeById(action.id);
      if (!up || state.upgrades[action.id] || state.coins < up.cost) return state;
      let next = { ...state, coins: state.coins - up.cost, upgrades: { ...state.upgrades, [action.id]: true } };
      if (up.unlocksAnimal && ANIMALS[up.unlocksAnimal]) {
        // O animal chega "novo": timers contam a partir de agora
        next = { ...next, animals: { ...next.animals, [up.unlocksAnimal]: makeAnimal(ANIMALS[up.unlocksAnimal], action.now || Date.now()) } };
      }
      return next;
    }

    case 'SET_SETTING':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };

    default:
      return state;
  }
}
