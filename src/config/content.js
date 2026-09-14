// ─────────────────────────────────────────────────────────────
// CONTEÚDO — registro data-driven do que existe na fazenda.
// Para adicionar um animal, cultivo ou melhoria, comece aqui.
// ─────────────────────────────────────────────────────────────
import { BALANCE } from './balance.js';

export const ANIMALS = {
  chicken1: { id: 'chicken1', type: 'chicken', home: 'coop', slot: 0 },
  chicken2: { id: 'chicken2', type: 'chicken', home: 'coop', slot: 1 },
  cow1: { id: 'cow1', type: 'cow', home: 'pasture', slot: 0 },
};

export const CROPS = {
  corn: { id: 'corn', stages: ['empty', 'seed', 'sprout', 'growing', 'ready'] },
};

// Melhorias compráveis. `cost` em moedas; `effect` é só documentação para o código visual.
export const UPGRADES = [
  { id: 'coop2', cost: 6, target: 'coop', effect: 'Galinheiro pintado, com telhado novo e ninhos' },
  { id: 'flowers', cost: 8, target: 'flowerbed', effect: 'Canteiro de flores no caminho' },
  { id: 'barn2', cost: 12, target: 'barn', effect: 'Celeiro maior com silo' },
];

// Espaços reservados para expansão futura (só desenho sutil na V1).
export const EXPANSION_SLOTS = [
  { id: 'pond', label: 'lago' },
  { id: 'orchard', label: 'pomar' },
  { id: 'pigpen', label: 'chiqueiro' },
];

export const PRODUCT_REWARD = {
  egg: BALANCE.rewards.egg,
  milk: BALANCE.rewards.milk,
};
