// QUINTAL — área inicial em 3/4: galinheiro com pátio cercado, milharal, celeiro com ração, canteiro de flores.
// Ordem de desenho = profundidade (do fundo para a frente).
import { useGame } from '../state/GameProvider.jsx';
import { LAYOUT } from '../config/layout.js';
import { Backdrop, Fence } from '../components/Backdrop.jsx';
import { Coop } from '../buildings/Coop.jsx';
import { Barn } from '../buildings/Barn.jsx';
import { FlowerBed } from '../buildings/FlowerBed.jsx';
import { CornField } from '../buildings/CornField.jsx';
import { CornPile, HayBale, WateringCan } from '../buildings/FoodSources.jsx';
import { UpgradeSigns } from '../buildings/UpgradeSign.jsx';
import { AreaAnimals } from './AreaAnimals.jsx';
import { Butterflies } from '../components/Ambient.jsx';

export function YardArea() {
  const { state } = useGame();
  const y = LAYOUT.coopYard;
  return (
    <>
      <Backdrop variant="yard" />
      <Coop upgraded={state.upgrades.coop2} />
      <Barn upgraded={state.upgrades.barn2} />
      {/* Laterais do pátio das galinhas (a frente vem depois dos animais) */}
      <svg className="fz-box" style={{ left: 0, top: 0, pointerEvents: 'none' }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        <SideFence x={y.x - 20} y1={y.y + 20} y2={y.y + y.h + 20} />
        <SideFence x={y.x + y.w + 20} y1={y.y + 20} y2={y.y + y.h + 20} />
      </svg>
      <FlowerBed planted={state.upgrades.flowers} />
      <UpgradeSigns area="yard" />
      <AreaAnimals area="yard" />
      <svg className="fz-box" style={{ left: 0, top: 0, pointerEvents: 'none' }} width="1600" height="1000" viewBox="0 0 1600 1000" aria-hidden="true">
        <Fence x1={y.x - 20} x2={y.x + y.w + 20} y={y.y + y.h + 24} short />
      </svg>
      <CornField />
      <CornPile />
      <HayBale />
      <WateringCan />
      <Butterflies x={LAYOUT.flowerbed.x + 190} y={LAYOUT.flowerbed.y + 60} />
    </>
  );
}

/** Cerca lateral em perspectiva: postes cada vez mais próximos ao longe. */
function SideFence({ x, y1, y2 }) {
  const posts = [];
  for (let yy = y1; yy <= y2; yy += 56) posts.push(yy);
  return (
    <g>
      <rect x={x - 4} y={y1 - 30} width="8" height={y2 - y1 + 30} rx="4" fill="url(#f-wood)" stroke="rgba(60,35,20,.25)" strokeWidth="1" />
      {posts.map((yy) => (
        <g key={yy}>
          <rect x={x - 9} y={yy - 46} width="18" height="46" rx="5" fill="url(#f-wood)" stroke="rgba(60,35,20,.28)" strokeWidth="1" />
          <path d={`M${x - 9} ${yy - 42} L${x} ${yy - 54} L${x + 9} ${yy - 42}`} fill="#F0C58D" stroke="rgba(60,35,20,.28)" strokeWidth="1" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}
