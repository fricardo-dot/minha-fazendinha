// Renderiza os animais desbloqueados que moram em uma área, do fundo para a frente.
import { unlockedAnimalDefs } from '../config/content.js';
import { useGame } from '../state/GameProvider.jsx';
import { AnimalActor } from '../animals/AnimalActor.jsx';

export function AreaAnimals({ area }) {
  const { state } = useGame();
  return (
    <>
      {unlockedAnimalDefs(state).filter((d) => d.area === area).map((d) => <AnimalActor key={d.id} id={d.id} />)}
    </>
  );
}
