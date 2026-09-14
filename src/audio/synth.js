// Sons sintetizados com WebAudio. Nenhum arquivo externo.
// Cada função recebe (ctx, out) e agenda o som no tempo atual.

function env(ctx, gainNode, t0, { a = 0.005, d = 0.1, s = 0, r = 0.08, peak = 0.5, hold = 0 }) {
  const g = gainNode.gain;
  g.cancelScheduledValues(t0);
  g.setValueAtTime(0.0001, t0);
  g.linearRampToValueAtTime(peak, t0 + a);
  g.exponentialRampToValueAtTime(Math.max(0.0001, peak * (s || 0.001)), t0 + a + d);
  g.setValueAtTime(Math.max(0.0001, peak * (s || 0.001)), t0 + a + d + hold);
  g.exponentialRampToValueAtTime(0.0001, t0 + a + d + hold + r);
  return t0 + a + d + hold + r;
}

function tone(ctx, out, { type = 'sine', f0, f1, t0, dur, peak = 0.4, curve = 'exp' }) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t0);
  if (f1) {
    if (curve === 'exp') osc.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    else osc.frequency.linearRampToValueAtTime(f1, t0 + dur);
  }
  osc.connect(g);
  g.connect(out);
  const end = env(ctx, g, t0, { a: 0.008, d: dur * 0.6, s: 0.3, r: dur * 0.4, peak });
  osc.start(t0);
  osc.stop(end + 0.05);
}

function noiseBuffer(ctx) {
  if (!noiseBuffer.cache) {
    const len = ctx.sampleRate * 1;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffer.cache = buf;
  }
  return noiseBuffer.cache;
}

export const SOUNDS = {
  // Moeda: dois "plins" brilhantes
  coin(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, { f0: 988, t0: t, dur: 0.09, peak: 0.25 });
    tone(ctx, out, { f0: 1319, t0: t + 0.08, dur: 0.16, peak: 0.28 });
  },
  // Coleta: "pop" macio
  collect(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, { type: 'triangle', f0: 520, f1: 880, t0: t, dur: 0.12, peak: 0.3 });
  },
  // Plantar: "tump" abafado
  plant(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, { type: 'sine', f0: 180, f1: 90, t0: t, dur: 0.14, peak: 0.35 });
  },
  // Água: ruído filtrado com varredura
  water(ctx, out) {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.Q.value = 1.2;
    filt.frequency.setValueAtTime(900, t);
    filt.frequency.exponentialRampToValueAtTime(2400, t + 0.45);
    const g = ctx.createGain();
    src.connect(filt); filt.connect(g); g.connect(out);
    const end = env(ctx, g, t, { a: 0.03, d: 0.2, s: 0.5, hold: 0.15, r: 0.15, peak: 0.22 });
    src.start(t); src.stop(end + 0.05);
  },
  // Galinha: três "buk" curtos
  chicken(ctx, out) {
    const t = ctx.currentTime;
    const pattern = [0, 0.11, 0.25];
    pattern.forEach((dt, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass'; filt.frequency.value = 1800;
      osc.type = 'square';
      const f = i === 2 ? 820 : 640;
      osc.frequency.setValueAtTime(f, t + dt);
      osc.frequency.exponentialRampToValueAtTime(f * 0.6, t + dt + 0.09);
      osc.connect(filt); filt.connect(g); g.connect(out);
      const end = env(ctx, g, t + dt, { a: 0.005, d: 0.05, s: 0.2, r: 0.05, peak: 0.12 });
      osc.start(t + dt); osc.stop(end + 0.02);
    });
  },
  // Vaca: "muuu" grave com vibrato
  cow(ctx, out) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.7);
    lfo.frequency.value = 5.5; lfoGain.gain.value = 6;
    lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
    filt.type = 'lowpass'; filt.frequency.setValueAtTime(500, t);
    filt.frequency.linearRampToValueAtTime(320, t + 0.7);
    osc.connect(filt); filt.connect(g); g.connect(out);
    const end = env(ctx, g, t, { a: 0.06, d: 0.2, s: 0.7, hold: 0.35, r: 0.25, peak: 0.22 });
    osc.start(t); lfo.start(t); osc.stop(end + 0.05); lfo.stop(end + 0.05);
  },
  // Sucesso: arpejo alegre
  success(ctx, out) {
    const t = ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => tone(ctx, out, { f0: f, t0: t + i * 0.09, dur: 0.22, peak: 0.22 }));
  },
  // Celebração grande: arpejo + brilho
  fanfare(ctx, out) {
    const t = ctx.currentTime;
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(ctx, out, { f0: f, t0: t + i * 0.08, dur: 0.3, peak: 0.2 }));
    tone(ctx, out, { type: 'triangle', f0: 1568, t0: t + 0.5, dur: 0.5, peak: 0.12 });
  },
  // "Ops" engraçado: boing descendente (nunca punitivo)
  oops(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, { type: 'triangle', f0: 520, f1: 210, t0: t, dur: 0.22, peak: 0.22 });
  },
  // Feliz: dois toques rápidos (carinho)
  happy(ctx, out) {
    const t = ctx.currentTime;
    tone(ctx, out, { type: 'triangle', f0: 740, t0: t, dur: 0.08, peak: 0.2 });
    tone(ctx, out, { type: 'triangle', f0: 988, t0: t + 0.09, dur: 0.14, peak: 0.2 });
  },
  // Mastigar: pequenos toques secos
  munch(ctx, out) {
    const t = ctx.currentTime;
    [0, 0.18, 0.36].forEach((dt) => tone(ctx, out, { type: 'triangle', f0: 260, f1: 180, t0: t + dt, dur: 0.06, peak: 0.12 }));
  },
  // Construção: "puf" + brilho
  build(ctx, out) {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.setValueAtTime(1200, t);
    filt.frequency.exponentialRampToValueAtTime(200, t + 0.3);
    const g = ctx.createGain();
    src.connect(filt); filt.connect(g); g.connect(out);
    const end = env(ctx, g, t, { a: 0.01, d: 0.25, s: 0.1, r: 0.1, peak: 0.3 });
    src.start(t); src.stop(end + 0.05);
    [659, 880, 1319].forEach((f, i) => tone(ctx, out, { f0: f, t0: t + 0.25 + i * 0.1, dur: 0.25, peak: 0.18 }));
  },
  // Escovar: "shh" curto e macio
  swish(ctx, out) {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.Q.value = 0.8;
    filt.frequency.setValueAtTime(1400, t);
    filt.frequency.exponentialRampToValueAtTime(3200, t + 0.16);
    const g = ctx.createGain();
    src.connect(filt); filt.connect(g); g.connect(out);
    const end = env(ctx, g, t, { a: 0.02, d: 0.08, s: 0.4, hold: 0.04, r: 0.08, peak: 0.14 });
    src.start(t); src.stop(end + 0.05);
  },
  // Lavar: bolhinha estourando
  bubble(ctx, out) {
    const t = ctx.currentTime;
    const f = 700 + Math.random() * 500;
    tone(ctx, out, { type: 'sine', f0: f, f1: f * 1.8, t0: t, dur: 0.09, peak: 0.16 });
    tone(ctx, out, { type: 'sine', f0: f * 0.7, f1: f * 1.3, t0: t + 0.07, dur: 0.07, peak: 0.1 });
  },
  // Ordenha: esguicho curto
  squirt(ctx, out) {
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.Q.value = 2;
    filt.frequency.setValueAtTime(1800, t);
    filt.frequency.exponentialRampToValueAtTime(700, t + 0.12);
    const g = ctx.createGain();
    src.connect(filt); filt.connect(g); g.connect(out);
    const end = env(ctx, g, t, { a: 0.005, d: 0.08, s: 0.2, r: 0.06, peak: 0.25 });
    src.start(t); src.stop(end + 0.05);
    tone(ctx, out, { type: 'sine', f0: 900, f1: 1300, t0: t, dur: 0.1, peak: 0.08 });
  },
};

/**
 * Música ambiente: um pad suave, dois osciladores levemente desafinados,
 * trocando acordes lentamente. Retorna função para parar.
 */
export function startAmbientPad(ctx, out) {
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  const filt = ctx.createBiquadFilter();
  filt.type = 'lowpass'; filt.frequency.value = 900;
  master.connect(filt); filt.connect(out);
  master.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 2.5);

  const chords = [[261.6, 329.6, 392.0], [293.7, 349.2, 440.0], [246.9, 329.6, 392.0], [261.6, 349.2, 440.0]];
  const voices = chords[0].map(() => {
    const oscA = ctx.createOscillator(); const oscB = ctx.createOscillator();
    oscA.type = 'triangle'; oscB.type = 'triangle';
    oscB.detune.value = 7;
    const g = ctx.createGain(); g.gain.value = 0.33;
    oscA.connect(g); oscB.connect(g); g.connect(master);
    oscA.start(); oscB.start();
    return { oscA, oscB };
  });

  let step = 0;
  const change = () => {
    step = (step + 1) % chords.length;
    const t = ctx.currentTime;
    chords[step].forEach((f, i) => {
      voices[i].oscA.frequency.linearRampToValueAtTime(f, t + 1.5);
      voices[i].oscB.frequency.linearRampToValueAtTime(f, t + 1.5);
    });
  };
  const timer = setInterval(change, 6000);

  return () => {
    clearInterval(timer);
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.0001, t + 1.2);
    setTimeout(() => voices.forEach((v) => { try { v.oscA.stop(); v.oscB.stop(); } catch { /* */ } }), 1400);
  };
}
