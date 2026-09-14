// ─────────────────────────────────────────────────────────────
// LAYOUT — posições no palco lógico (1600 × 1000, paisagem).
// Cada ÁREA do mapa é um palco 1600×1000 próprio; as posições abaixo são locais à área.
// Itens "persistentes" (HUD, cesta, caminhão, kit) aparecem em todas as áreas, no mesmo lugar.
// Nunca use pixels reais aqui.
// ─────────────────────────────────────────────────────────────
export const STAGE = { width: 1600, height: 1000 };

// Tamanho mínimo de área de toque em unidades lógicas (≈ 64–72 px reais em um iPad).
export const MIN_TOUCH = 96;

export const LAYOUT = {
  // ── Persistentes (todas as áreas) ─────────────────────────
  hud: {
    coinJar: { x: 40, y: 30 },
    parentButton: { x: 1520, y: 34 },
  },
  nav: { left: { x: 80, y: 520 }, right: { x: 1520, y: 520 } }, // setas do mapa
  careKit: { x: 960, y: 880 },                                   // caixote com esponja e escova
  basket: { x: 1180, y: 860 },
  delivery: { x: 1420, y: 850 },

  // ── QUINTAL ───────────────────────────────────────────────
  coop: { x: 70, y: 300, w: 380, h: 300 },
  coopYard: { x: 90, y: 560, w: 460, h: 170 },   // onde as galinhas andam
  chickenSlots: [
    { x: 200, y: 640 },
    { x: 400, y: 660 },
  ],
  barn: { x: 1090, y: 250, w: 470, h: 380 },
  cornPile: { x: 1150, y: 660 },
  hayBale: { x: 1400, y: 655 },
  field: { x: 60, y: 780, w: 500, h: 190 },
  plots: [
    { x: 140, y: 870 },
    { x: 300, y: 870 },
    { x: 460, y: 870 },
  ],
  wateringCan: { x: 590, y: 850 },
  flowerbed: { x: 620, y: 590, w: 380, h: 160 },

  // ── PASTO ─────────────────────────────────────────────────
  pasture: { x: 100, y: 610, w: 800, h: 140 },   // onde a vaca anda (pés em 659..750), longe do curral do morro
  sheepPenArea: { x: 120, y: 240, w: 520, h: 200 }, // curral da ovelha no morro
  sheepPen: { x: 160, y: 300, w: 440, h: 110 },     // onde a ovelha anda (pés em 338..410)
  sheep: { x: 380, y: 400 },
  pastureFence: { x: 80, y: 470, w: 840, h: 300 },
  cow: { x: 460, y: 680 },
  pastureFeed: { corn: { x: 300, y: 900 }, hay: { x: 120, y: 895 } }, // estação de ração
  pigpenArea: { x: 960, y: 500, w: 580, h: 280 },  // cerca do chiqueiro
  pigpen: { x: 1020, y: 600, w: 460, h: 140 },     // onde o porquinho anda (pés em 649..740)
  pig: { x: 1250, y: 720 },

  // ── LAGO ──────────────────────────────────────────────────
  pond: { x: 160, y: 480, w: 880, h: 440 },
  frog: { x: 420, y: 790 },
  duckLane: { x: 300, y: 640, w: 560 },
  pier: { x: 1040, y: 560 },

  // Placas de melhoria (área indicada em config/areas.js)
  signs: {
    coop2: { x: 470, y: 470 },
    flowers: { x: 810, y: 780 },
    barn2: { x: 1060, y: 470 },
    pigpen: { x: 1250, y: 720 },
    sheepPen: { x: 380, y: 432 },
  },
};
