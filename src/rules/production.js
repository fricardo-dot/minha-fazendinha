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
  // Sujeira e pelo despenteado aparecem com o tempo, um de cada vez, nunca como castigo
  if (!a.dirty && !a.scruffy && a.dirtyAt && now >= a.dirtyAt) {
    a = { ...a, dirty: true };
  } else if (!a.scruffy && !a.dirty && a.scruffyAt && now >= a.scruffyAt) {
    a = { ...a, scruffy: true };
  }
  return a;
}

/** Aplica um cuidado (lavar / escovar). Retorna { animal, gainedHeart }. */
export function applyCare(animal, kind, now) {
  const C = BALANCE.care;
  const breather = now + C.breatherMs; // o outro pedido não aparece logo em seguida
  if (kind === 'wash') {
    const needed = animal.dirty;
    const gainedHeart = needed || now - (animal.lastWashAt || 0) >= C.heartCooldownMs;
    return {
      gainedHeart,
      animal: {
        ...animal, dirty: false, dirtyAt: now + C.dirtyAfterMs, lastWashAt: now, lastCareAt: now,
        scruffyAt: animal.scruffy ? animal.scruffyAt : Math.max(animal.scruffyAt || 0, breather),
      },
    };
  }
  const needed = animal.scruffy;
  const gainedHeart = needed || now - (animal.lastBrushAt || 0) >= C.heartCooldownMs;
  return {
    gainedHeart,
    animal: {
      ...animal, scruffy: false, scruffyAt: now + C.scruffyAfterMs, lastBrushAt: now, lastCareAt: now,
      dirtyAt: animal.dirty ? animal.dirtyAt : Math.max(animal.dirtyAt || 0, breather),
    },
  };
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
