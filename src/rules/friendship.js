import { BALANCE } from '../config/balance.js';

const F = BALANCE.friendship;

/** Estágio visual (1, 2 ou 3) a partir dos corações acumulados. */
export function stageFor(hearts) {
  if (hearts >= F.stage3At) return 3;
  if (hearts >= F.stage2At) return 2;
  return 1;
}

/** Progresso 0..1 dentro do estágio atual (para o medidor de corações). */
export function progressFor(hearts) {
  const stage = stageFor(hearts);
  if (stage === 3) return 1;
  const from = stage === 1 ? 0 : F.stage2At;
  const to = stage === 1 ? F.stage2At : F.stage3At;
  return Math.min(1, (hearts - from) / (to - from));
}

export function canPet(animal, now) {
  return now - (animal.lastPetAt || 0) >= BALANCE.animals.petCooldownMs;
}
