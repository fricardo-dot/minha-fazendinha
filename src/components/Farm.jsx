// A fazenda é o menu principal: tudo acontece tocando nela.
import { useState } from 'react';
import { unlockedAnimalDefs } from '../config/content.js';
import { useGame } from '../state/GameProvider.jsx';
import { Backdrop } from './Backdrop.jsx';
import { Coop } from '../buildings/Coop.jsx';
import { Barn } from '../buildings/Barn.jsx';
import { FlowerBed } from '../buildings/FlowerBed.jsx';
import { Pigpen } from '../buildings/Pigpen.jsx';
import { CornField } from '../buildings/CornField.jsx';
import { CornPile, HayBale, WateringCan } from '../buildings/FoodSources.jsx';
import { CareKit } from '../buildings/CareKit.jsx';
import { Basket, DeliveryBox } from '../buildings/BasketAndDelivery.jsx';
import { UpgradeSigns } from '../buildings/UpgradeSign.jsx';
import { AnimalActor } from '../animals/AnimalActor.jsx';
import { CoinJar, ParentButton } from './HUD.jsx';
import { ParentPanel } from './ParentPanel.jsx';
import { MinigameHost } from '../minigames/MinigameHost.jsx';

export function Farm() {
  const { state } = useGame();
  const [parentOpen, setParentOpen] = useState(false);

  return (
    <>
      <Backdrop />
      <FlowerBed planted={state.upgrades.flowers} />
      {state.upgrades.pigpen && <Pigpen />}
      <Coop upgraded={state.upgrades.coop2} />
      <Barn upgraded={state.upgrades.barn2} />
      <UpgradeSigns />
      <CornField />
      <CornPile />
      <HayBale />
      <WateringCan />
      <CareKit />
      <Basket />
      <DeliveryBox />
      {unlockedAnimalDefs(state).map((d) => <AnimalActor key={d.id} id={d.id} />)}
      <CoinJar />
      <ParentButton onOpen={() => setParentOpen(true)} />
      <MinigameHost />
      {parentOpen && <ParentPanel onClose={() => setParentOpen(false)} />}
    </>
  );
}
