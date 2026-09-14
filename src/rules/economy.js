import { BALANCE } from '../config/balance.js';
import { UPGRADES, PRODUCT_REWARD, PRODUCT_KEY } from '../config/content.js';

export function basketValue(basket) {
  return Object.entries(PRODUCT_KEY).reduce((sum, [product, key]) => sum + (basket[key] || 0) * PRODUCT_REWARD[product], 0);
}

export function basketIsEmpty(basket) {
  return Object.values(PRODUCT_KEY).every((key) => !(basket[key] > 0));
}

export function shouldPlayEggMinigame(basket) {
  return basket.eggs >= BALANCE.rewards.eggMinigameThreshold;
}

export function upgradeById(id) {
  return UPGRADES.find((u) => u.id === id);
}

export function canAfford(state, upgradeId) {
  const up = upgradeById(upgradeId);
  return !!up && !state.upgrades[upgradeId] && state.coins >= up.cost;
}
