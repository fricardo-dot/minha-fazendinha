// ─────────────────────────────────────────────────────────────
// LAYOUT — posições no palco lógico (1600 × 1000, paisagem).
// Tudo é escalado para caber na tela; nunca use pixels reais aqui.
// ─────────────────────────────────────────────────────────────
export const STAGE = { width: 1600, height: 1000 };

// Tamanho mínimo de área de toque em unidades lógicas (≈ 64–72 px reais em um iPad).
export const MIN_TOUCH = 96;

export const LAYOUT = {
  hud: {
    coinJar: { x: 40, y: 30 },
    parentButton: { x: 1520, y: 34 },
  },
  coop: { x: 70, y: 300, w: 380, h: 300 },
  coopYard: { x: 90, y: 560, w: 460, h: 170 },   // onde as galinhas andam
  chickenSlots: [
    { x: 200, y: 640 },
    { x: 400, y: 660 },
  ],
  pigpenArea: { x: 600, y: 200, w: 400, h: 160 },   // morro atrás do pasto (mais ao fundo, fora do alcance da vaca)
  pigpen: { x: 620, y: 250, w: 360, h: 95 },         // onde o porquinho anda (pés em 283..345)
  pig: { x: 830, y: 335 },
  pasture: { x: 590, y: 560, w: 460, h: 170 },      // a vaca fica na frente do pasto (pés em 620..720)
  cow: { x: 800, y: 590 },
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
  flowerbed: { x: 680, y: 800, w: 360, h: 150 },
  careKit: { x: 1040, y: 745 },                 // caixote com esponja e escova
  basket: { x: 1180, y: 860 },
  delivery: { x: 1420, y: 850 },
  signs: {
    coop2: { x: 470, y: 470 },
    flowers: { x: 860, y: 900 },
    barn2: { x: 1060, y: 470 },
    pigpen: { x: 800, y: 352 },
  },
};
