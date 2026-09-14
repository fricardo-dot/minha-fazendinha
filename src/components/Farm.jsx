// A fazenda é o menu principal: um mapa com áreas (FarmMap) e uma camada persistente por cima
// (moedas, cesta, caminhão, kit de cuidados, área dos pais, minigames).
import { useState } from 'react';
import { FarmMap } from './FarmMap.jsx';
import { CareKit } from '../buildings/CareKit.jsx';
import { Basket, DeliveryBox } from '../buildings/BasketAndDelivery.jsx';
import { CoinJar, ParentButton } from './HUD.jsx';
import { ParentPanel } from './ParentPanel.jsx';
import { MinigameHost } from '../minigames/MinigameHost.jsx';

export function Farm() {
  const [parentOpen, setParentOpen] = useState(false);

  return (
    <>
      <FarmMap />
      {/* Camada persistente: acompanha a criança em todas as áreas */}
      <div className="fz-persistent" onPointerDown={(e) => e.stopPropagation()}>
        <CareKit />
        <Basket />
        <DeliveryBox />
      </div>
      <CoinJar />
      <ParentButton onOpen={() => setParentOpen(true)} />
      <MinigameHost />
      {parentOpen && <ParentPanel onClose={() => setParentOpen(false)} />}
    </>
  );
}
