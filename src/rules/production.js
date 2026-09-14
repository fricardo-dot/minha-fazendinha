// Regras de produção baseadas em timestamps absolutos.
// Assim o progresso continua mesmo com o app fechado, e nunca há punição.
import { BALANCE } from '../config/balance.js';
import { CROPS } from '../config/content.js';

/** Avança um animal no tempo. Retorna o mesmo objeto se nada mudou. */
export function tickAnimal(animal, now) {
  const cfg = BALANCE.animals[animal.type];
  let a = animal;

  if (a.state === 'eating' && now >= a.eatUntil) {
    a = { ...a, state: 'producing', produceAt: a.eatUntil + cfg.produceMs };
  }
  if (a.state === 'producing' && now >= a.produceAt) {
    a = { ...a, state: 'ready' }; // ovo no chão / leite pronto
  }
  if (a.state === 'resting' && now >= a.hungryAt) {
    a = { ...a, state: 'hungry' };
  }
  return a;
}

/** Avança um canteiro. Só cresce depois de regado; nunca murcha. */
export function tickPlot(plot, now) {
  if (!plot.nextStageAt || now < plot.nextStageAt) return plot;
  const stages = CROPS.corn.stages;
  const idx = stages.indexOf(plot.stage);
  if (idx < 0 || idx >= stages.length - 1) return plot;
  const nextStage = stages[idx + 1];
  const isLast = nextStage === 'ready';
  return {
    ...plot,
    stage: nextStage,
    nextStageAt: isLast ? null : plot.nextStageAt + BALANCE.crops.corn.stageMs,
  };
}

export function feedAnimal(animal, now) {
  const cfg = BALANCE.animals[animal.type];
  return { ...animal, state: 'eating', eatUntil: now + cfg.eatMs, lastCareAt: now };
}

export function collectFromAnimal(animal, now) {
  const cfg = BALANCE.animals[animal.type];
  return { ...animal, state: 'resting', hungryAt: now + cfg.hungryAgainMs };
}
