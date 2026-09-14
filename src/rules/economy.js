import { BALANCE } from '../config/balance.js';
import { UPGRADES, PRODUCT_REWARD } from '../config/content.js';

export function basketValue(basket) {
  return basket.eggs * PRODUCT_REWARD.egg + basket.milk * PRODUCT_REWARD.milk;
}

export function basketIsEmpty(basket) {
  return basket.eggs === 0 && basket.milk === 0;
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
