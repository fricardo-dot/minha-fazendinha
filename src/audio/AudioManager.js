// Gerente de áudio. O jogo só chama audio.play('nome').
// Hoje os sons são sintetizados (synth.js); no futuro basta mapear nomes para arquivos aqui.
import { SOUNDS, startAmbientPad } from './synth.js';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.soundOn = true;
    this.musicOn = true;
    this.stopMusic = null;
    this.lastPlayed = new Map();
  }

  /** Deve ser chamado dentro de um gesto do usuário (iOS exige). */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    this._syncMusic();
  }

  setSound(on) { this.soundOn = !!on; }
  setMusic(on) { this.musicOn = !!on; this._syncMusic(); }

  _syncMusic() {
    if (!this.ctx) return;
    if (this.musicOn && !this.stopMusic) this.stopMusic = startAmbientPad(this.ctx, this.master);
    if (!this.musicOn && this.stopMusic) { this.stopMusic(); this.stopMusic = null; }
  }

  /** Toca um som pelo nome. `minGapMs` evita metralhadora de sons iguais. */
  play(name, minGapMs = 60) {
    if (!this.soundOn || !this.ctx || this.ctx.state !== 'running') return;
    const gen = SOUNDS[name];
    if (!gen) return;
    const now = performance.now();
    if (now - (this.lastPlayed.get(name) || 0) < minGapMs) return;
    this.lastPlayed.set(name, now);
    try { gen(this.ctx, this.master); } catch { /* nunca quebrar o jogo por causa de som */ }
  }
}

export const audio = new AudioManager();
