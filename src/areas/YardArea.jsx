// QUINTAL — área inicial: galinheiro, milharal, celeiro com ração, canteiro de flores.
import { useGame } from '../state/GameProvider.jsx';
import { Backdrop } from '../components/Backdrop.jsx';
import { Coop } from '../buildings/Coop.jsx';
import { Barn } from '../buildings/Barn.jsx';
import { FlowerBed } from '../buildings/FlowerBed.jsx';
import { CornField } from '../buildings/CornField.jsx';
import { CornPile, HayBale, WateringCan } from '../buildings/FoodSources.jsx';
import { UpgradeSigns } from '../buildings/UpgradeSign.jsx';
import { AreaAnimals } from './AreaAnimals.jsx';

export function YardArea() {
  const { state } = useGame();
  return (
    <>
      <Backdrop variant="yard" />
      <FlowerBed planted={state.upgrades.flowers} />
      <Coop upgraded={state.upgrades.coop2} />
      <Barn upgraded={state.upgrades.barn2} />
      <UpgradeSigns area="yard" />
      <CornField />
      <CornPile />
      <HayBale />
      <WateringCan />
      <AreaAnimals area="yard" />
    </>
  );
}
