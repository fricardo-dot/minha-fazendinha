// Abstração de persistência. O jogo só conhece load/save/clear.
// Trocar o adapter (IndexedDB, arquivo nativo, nuvem) não exige tocar no jogo.
import { SCHEMA_VERSION, createInitialState } from '../state/initialState.js';

export const SAVE_KEY = 'fazendinha.save.v1';

/** Migra saves antigos para o schema atual. Sempre retorna um estado completo. */
export function migrate(saved) {
  if (!saved || typeof saved !== 'object') return null;
  const base = createInitialState();
  // Merge raso e defensivo: campos novos ganham o valor padrão.
  const state = {
    ...base,
    ...saved,
    inventory: { ...base.inventory, ...(saved.inventory || {}) },
    basket: { ...base.basket, ...(saved.basket || {}) },
    upgrades: { ...base.upgrades, ...(saved.upgrades || {}) },
    stats: { ...base.stats, ...(saved.stats || {}) },
    settings: { ...base.settings, ...(saved.settings || {}) },
    animals: { ...base.animals },
    plots: base.plots.map((p, i) => ({ ...p, ...((saved.plots || [])[i] || {}) })),
    version: SCHEMA_VERSION,
  };
  for (const [id, a] of Object.entries(saved.animals || {})) {
    if (state.animals[id]) state.animals[id] = { ...state.animals[id], ...a };
  }
  return state;
}

export function createStorage(adapter) {
  return {
    load() {
      try {
        const raw = adapter.getItem(SAVE_KEY);
        if (!raw) return null;
        return migrate(JSON.parse(raw));
      } catch {
        return null;
      }
    },
    save(state) {
      try {
        adapter.setItem(SAVE_KEY, JSON.stringify(state));
        return true;
      } catch {
        return false;
      }
    },
    clear() {
      try { adapter.removeItem(SAVE_KEY); } catch { /* ignore */ }
    },
  };
}
