// Registro de minigames. Para adicionar um novo: criar o componente e registrar aqui.
// Contrato do componente: props { params, onDone, onExit }.
//   - onDone(): o minigame terminou com sucesso (o próprio componente já disparou a ação do jogo)
//   - onExit(): a criança saiu antes de terminar (nunca é punição)
import { Milking } from './Milking.jsx';
import { EggBasket } from './EggBasket.jsx';
import { WashPig } from './WashPig.jsx';

export const MINIGAMES = {
  milking: { Component: Milking },
  eggBasket: { Component: EggBasket },
  washPig: { Component: WashPig },
  // futuros: shearSheep, pickFruit, driveTractor, matchFood, fishing, sortBarn, memory
};
