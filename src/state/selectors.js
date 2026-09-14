import { BALANCE } from '../config/balance.js';
import { UPGRADES } from '../config/content.js';
import { basketIsEmpty } from '../rules/economy.js';

export const animalsOfType = (state, type) =>
  Object.values(state.animals).filter((a) => a.type === type);

export const hungryOf = (state, type) => animalsOfType(state, type).filter((a) => a.state === 'hungry');

export function affordableUpgrade(state) {
  return UPGRADES.find((u) => !state.upgrades[u.id] && state.coins >= u.cost) || null;
}

/**
 * O que a criança deveria fazer agora, em ordem de prioridade.
 * Retorna um id de alvo usado pelo sistema de dicas (brilho/balanço).
 */
export function nextHint(state) {
  const animals = Object.values(state.animals);

  const eggOnGround = animals.find((a) => a.type === 'chicken' && a.state === 'ready');
  if (eggOnGround) return `egg:${eggOnGround.id}`;

  const readyPlot = state.plots.findIndex((p) => p.stage === 'ready');
  if (readyPlot >= 0) return `plot:${readyPlot}`;

  const milkReady = animals.find((a) => a.type === 'cow' && a.state === 'ready');
  if (milkReady) return `animal:${milkReady.id}`;

  if (hungryOf(state, 'chicken').length && state.inventory.corn > 0) return 'source:corn';
  if (hungryOf(state, 'cow').length) return 'source:hay';

  if (animals.some((a) => a.dirty)) return 'source:sponge';
  if (animals.some((a) => a.scruffy)) return 'source:brush';

  const dryPlot = state.plots.findIndex((p) => p.stage === 'seed' && !p.watered);
  if (dryPlot >= 0) return 'source:water';

  if (!basketIsEmpty(state.basket) && (affordableUpgrade(state) === null || state.basket.eggs >= BALANCE.rewards.eggMinigameThreshold)) return 'delivery';

  const up = affordableUpgrade(state);
  if (up) return `sign:${up.id}`;

  if (!basketIsEmpty(state.basket)) return 'delivery';

  const emptyPlot = state.plots.findIndex((p) => p.stage === 'empty');
  if (emptyPlot >= 0 && (state.inventory.corn === 0 || hungryOf(state, 'chicken').length === 0)) return `plot:${emptyPlot}`;

  return null;
}
