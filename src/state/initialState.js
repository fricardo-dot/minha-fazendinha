import { BALANCE } from '../config/balance.js';
import { ANIMALS } from '../config/content.js';

export const SCHEMA_VERSION = 1;

export function makeAnimal(def, now) {
  return {
    dirty: false,      // precisa de banho (esponja)
    scruffy: false,    // precisa de escova
    dirtyAt: now + BALANCE.care.firstDirtyMs,
    scruffyAt: now + BALANCE.care.firstScruffyMs,
    lastWashAt: 0,
    lastBrushAt: 0,
    id: def.id,
    type: def.type,
    state: 'hungry',   // hungry | eating | producing | ready | resting
    eatUntil: 0,
    produceAt: 0,
    hungryAt: 0,
    hearts: 0,
    lastPetAt: 0,
    lastCareAt: 0,
  };
}

export function createInitialState() {
  const now = Date.now();
  const animals = {};
  for (const def of Object.values(ANIMALS)) animals[def.id] = makeAnimal(def, now);
  return {
    version: SCHEMA_VERSION,
    coins: 0,
    inventory: { corn: BALANCE.inventory.startCorn },
    animals,
    plots: Array.from({ length: BALANCE.crops.corn.plots }, () => ({
      stage: 'empty', watered: false, nextStageAt: null,
    })),
    basket: { eggs: 0, milk: 0, truffles: 0 },
    upgrades: { coop2: false, flowers: false, barn2: false, pigpen: false },
    stats: { deliveries: 0, minigames: 0, harvests: 0 },
    settings: { sound: true, music: true },
    createdAt: Date.now(),
  };
}
