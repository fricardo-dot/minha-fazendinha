// ─────────────────────────────────────────────────────────────
// CONTEÚDO — registro data-driven do que existe na fazenda.
// Para adicionar um animal, cultivo ou melhoria, comece aqui.
// ─────────────────────────────────────────────────────────────
import { BALANCE } from './balance.js';

export const ANIMALS = {
  // depth: ordem de desenho (menor = mais ao fundo)
  // area: em qual área do mapa o animal mora (config/areas.js)
  chicken1: { id: 'chicken1', type: 'chicken', home: 'coop', slot: 0, depth: 2, area: 'yard' },
  chicken2: { id: 'chicken2', type: 'chicken', home: 'coop', slot: 1, depth: 2, area: 'yard' },
  cow1: { id: 'cow1', type: 'cow', home: 'pasture', slot: 0, depth: 1, area: 'pasture' },
  pig1: { id: 'pig1', type: 'pig', home: 'pigpen', slot: 0, requires: 'pigpen', depth: 2, area: 'pasture' }, // só depois de comprar o chiqueiro
};

/** Animais visíveis/ativos no estado atual (respeita desbloqueios). */
export function unlockedAnimalDefs(state) {
  return Object.values(ANIMALS)
    .filter((d) => !d.requires || state.upgrades[d.requires])
    .sort((a, b) => (a.depth || 0) - (b.depth || 0));
}

export const CROPS = {
  corn: { id: 'corn', stages: ['empty', 'seed', 'sprout', 'growing', 'ready'] },
};

// Melhorias compráveis. `cost` em moedas; `effect` é só documentação para o código visual.
export const UPGRADES = [
  { id: 'coop2', cost: 6, target: 'coop', area: 'yard', effect: 'Galinheiro pintado, com telhado novo e ninhos' },
  { id: 'flowers', cost: 8, target: 'flowerbed', area: 'yard', effect: 'Canteiro de flores no quintal' },
  { id: 'barn2', cost: 12, target: 'barn', area: 'yard', effect: 'Celeiro maior com silo' },
  { id: 'pigpen', cost: 14, target: 'pigpen', area: 'pasture', effect: 'Chiqueiro no pasto e o porquinho chega', unlocksAnimal: 'pig1' },
];

// Ferramentas de cuidado: item que a criança carrega → tipo de cuidado no animal.
export const CARE_TOOLS = {
  sponge: { kind: 'wash', need: 'dirty' },
  brush: { kind: 'brush', need: 'scruffy' },
};

// Espaços reservados para expansão futura (só desenho sutil na V1).
export const EXPANSION_SLOTS = [
  { id: 'pond', label: 'lago' },
  { id: 'orchard', label: 'pomar' },
  { id: 'pigpen', label: 'chiqueiro' },
];

export const PRODUCT_REWARD = {
  egg: BALANCE.rewards.egg,
  milk: BALANCE.rewards.milk,
  truffle: BALANCE.rewards.truffle,
};

// Produto → campo da cesta
export const PRODUCT_KEY = { egg: 'eggs', milk: 'milk', truffle: 'truffles' };
