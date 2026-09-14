// ─────────────────────────────────────────────────────────────
// BALANCEAMENTO — todos os números ajustáveis do jogo ficam aqui.
// Tempos em milissegundos. Nada disto é lido de outro lugar.
// ─────────────────────────────────────────────────────────────
export const BALANCE = {
  animals: {
    chicken: {
      eatMs: 2000,          // duração da animação de comer
      produceMs: 8000,      // depois de comer, tempo até o ovo aparecer
      hungryAgainMs: 4000,  // depois de coletar o ovo, tempo até ter fome de novo
      food: 'corn',
      product: 'egg',
      sound: 'chicken',
    },
    cow: {
      eatMs: 2500,
      produceMs: 6000,      // depois de comer, tempo até o leite ficar pronto
      hungryAgainMs: 5000,
      food: 'hay',
      product: 'milk',
      collectMinigame: 'milking',
      readyIcon: 'milk',
      sound: 'cow',
    },
    pig: {
      eatMs: 2500,
      produceMs: 6000,      // depois de comer, rola na lama até ficar bem enlameado
      hungryAgainMs: 5000,
      food: 'corn',
      product: 'truffle',   // depois do banho, fareja uma trufa
      mudBath: true,        // a sujeira do porco é a lama do ciclo (minigame), não o timer de esponja
      collectMinigame: 'washPig',
      readyIcon: 'sponge',  // o que ele "pede" quando está pronto
      sound: 'pig',
    },
    sheep: {
      eatMs: 2500,
      produceMs: 8000,      // depois de comer, a lã cresce até ficar bem fofa
      hungryAgainMs: 5000,
      food: 'hay',
      product: 'wool',      // a tosa rende um novelo
      collectMinigame: 'shear',
      readyIcon: 'shears',
      sound: 'sheep',
    },
    sleepAfterIdleMs: 25000, // animal alimentado e sem interação por este tempo → cochila
    petCooldownMs: 8000,     // intervalo mínimo entre corações por carinho
  },

  care: {
    // Cuidados com gesto de esfregar (lavar com esponja, escovar)
    dirtyAfterMs: 90000,     // depois de um cuidado, tempo até o animal ficar empoeirado de novo
    scruffyAfterMs: 150000,  // idem para ficar despenteado
    firstDirtyMs: 40000,     // na primeira partida, sujeira aparece cedo para a criança descobrir
    firstScruffyMs: 110000,
    strokes: 6,              // esfregadas para concluir
    strokeDistance: 110,     // deslocamento do dedo (unidades lógicas) que conta como uma esfregada
    idleCancelMs: 12000,     // sem esfregar por este tempo, a ferramenta volta sozinha
    heartCooldownMs: 30000,  // coração por cuidado "sem necessidade" só depois deste intervalo
    breatherMs: 45000,       // depois de um cuidado, o outro pedido espera pelo menos isto
  },

  crops: {
    corn: {
      stageMs: 3000,        // tempo entre cada estágio: semente → broto → crescendo → pronto
      yield: 1,             // milhos por colheita
      plots: 3,
    },
  },

  inventory: {
    startCorn: 2,           // milho no celeiro ao começar (para alimentar já no início)
    maxCornShown: 6,        // quantidade máxima desenhada na pilha
    hayInfinite: true,      // V1: feno nunca acaba
  },

  rewards: {
    egg: 1,                 // moedas por ovo entregue
    milk: 3,                // moedas por leite entregue
    truffle: 4,             // moedas por trufa entregue
    wool: 5,                // moedas por novelo entregue
    eggMinigameBonus: 2,    // bônus ao concluir o minigame da cesta
    eggMinigameThreshold: 4,// ovos na cesta para o minigame aparecer
    maxCoinsShown: 24,      // moedas desenhadas no pote (visual)
  },

  friendship: {
    perCare: 1,             // corações ganhos por cuidado (alimentar, carinho, ordenhar)
    stage2At: 5,            // corações para estágio 2 (sino / ninho bonito)
    stage3At: 12,           // corações para estágio 3 (laço / pintinho)
  },

  minigames: {
    milking: { squirtsToFill: 8, dragThreshold: 40 },
    eggBasket: { maxEggs: 6 },
    washPig: { scrubRadius: 46, scrubPerUnit: 0.012, rinseMs: 1800 }, // raio da esponja e velocidade de limpeza (coords do porquinho)
    shear: { radius: 44, perUnit: 0.0055 },                            // raio da máquina e velocidade da tosa (coords da ovelha)
  },

  hints: {
    idleMs: 6000,           // segundos sem toque até a dica aparecer
    repeatMs: 3000,         // intervalo entre pulsos da dica enquanto ocioso
  },

  anim: {
    eatMs: 2000,
    celebrateSmallMs: 900,
    celebrateBigMs: 1800,
    flyMs: 650,
    returnMs: 420,
    heartMeterMs: 2200,
  },

  parent: {
    holdMs: 3000,           // segurar o ícone por este tempo para abrir a área dos pais
  },

  save: {
    debounceMs: 500,
  },
};
