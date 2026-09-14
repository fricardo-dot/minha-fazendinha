// PASTO — vaca com espaço para passear, chiqueiro na frente, estação de ração.
import { useGame } from '../state/GameProvider.jsx';
import { LAYOUT } from '../config/layout.js';
import { Backdrop, Fence } from '../components/Backdrop.jsx';
import { Pigpen, PigpenFront, PigpenPlaceholder } from '../buildings/Pigpen.jsx';
import { SheepPen, SheepPenFront, SheepPenPlaceholder } from '../buildings/SheepPen.jsx';
import { CornPile, HayBale } from '../buildings/FoodSources.jsx';
import { UpgradeSigns } from '../buildings/UpgradeSign.jsx';
import { AreaAnimals } from './AreaAnimals.jsx';

export function PastureArea() {
  const { state } = useGame();
  const f = LAYOUT.pastureFence;
  return (
    <>
      <Backdrop variant="pasture" />
      {state.upgrades.sheepPen ? <SheepPen /> : <SheepPenPlaceholder />}
      {state.upgrades.pigpen ? <Pigpen /> : <PigpenPlaceholder />}
      <UpgradeSigns area="pasture" />
      {/* Estação de ração: o mesmo milho do celeiro e feno à vontade */}
      <HayBale pos={LAYOUT.pastureFeed.hay} />
      <CornPile pos={LAYOUT.pastureFeed.corn} />
      <AreaAnimals area="pasture" />
      {state.upgrades.sheepPen && <SheepPenFront />}
      {/* Cercas da frente, por cima dos animais */}
      <svg className="fz-box" style={{ left: 0, top: 0, pointerEvents: 'none' }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        <Fence x1={f.x} x2={f.x + f.w} y={f.y + f.h} />
      </svg>
      {state.upgrades.pigpen && <PigpenFront />}
    </>
  );
}
