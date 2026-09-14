// ─────────────────────────────────────────────────────────────
// MAPA DA FAZENDA — áreas lado a lado (cada uma é um palco 1600×1000).
// Para adicionar uma área: entrada aqui + componente em src/areas + posições em layout.js.
// ─────────────────────────────────────────────────────────────
export const AREAS = [
  { id: 'lake', name: 'Lago', icon: 'frog' },
  { id: 'yard', name: 'Quintal', icon: 'house' },
  { id: 'pasture', name: 'Pasto', icon: 'cow' },
];

export const HOME_AREA = 'yard';

export const areaIndex = (id) => AREAS.findIndex((a) => a.id === id);

/**
 * Em quais áreas um alvo de dica pode ser atendido.
 * `null` = está na camada persistente (visível em todas as áreas).
 */
export function areasOfHint(hint, animalsById) {
  if (!hint) return null;
  const [kind, id] = hint.split(':');
  switch (kind) {
    case 'egg':
    case 'plot':
      return ['yard'];
    case 'animal':
      return animalsById && animalsById[id] ? [animalsById[id].area] : null;
    case 'sign':
      return SIGN_AREAS[id] ? [SIGN_AREAS[id]] : null;
    case 'source':
      return SOURCE_AREAS[id] || null;
    default:
      return null; // delivery, basket, sponge/brush… são persistentes
  }
}

const SIGN_AREAS = { coop2: 'yard', flowers: 'yard', barn2: 'yard', pigpen: 'pasture', sheepPen: 'pasture' };
const SOURCE_AREAS = { corn: ['yard', 'pasture'], hay: ['yard', 'pasture'], water: ['yard'] };
