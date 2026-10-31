// Som do jogo, todo gerado no próprio browser (Web Audio), sem gravações com direitos:
// ambiente do pavilhão (público conforme a assistência, cânticos, palmas, festa do golo, assobios, "uuuh"),
// apito dos árbitros, buzina do fim das partes e sons da bola (passe, remate, poste, rede).

type Vol = 'off' | 'low' | 'mid' | 'high';
const VOL: Record<Vol, number> = { off: 0, low: 0.35, mid: 0.7, high: 1 };

class Sound {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private crowdGain!: GainNode;
  private crowdFilter!: BiquadFilterNode;
  private chantGain!: GainNode;
  private noiseBuf!: AudioBuffer;
  private vol: Vol = 'mid';
  private fill = 0.5; // ocupação do pavilhão (0 a 1)
  private excite = 0;
  private chantTimer = 0;
  private running = false;

  setVolume(v: Vol) {
    this.vol = v;
    if (this.ctx) this.master.gain.setTargetAtTime(VOL[v] * 0.8, this.ctx.currentTime, 0.1);
  }
  get volume() { return this.vol; }

  /** Começa o ambiente (chamar a partir de um clique: os browsers só deixam tocar som depois de um gesto). */
  start(fill: number) {
    this.fill = Math.max(0.05, Math.min(1, fill));
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const c = this.ctx;
      this.master = c.createGain();
      this.master.gain.value = VOL[this.vol] * 0.8;
      this.master.connect(c.destination);
      // ruído rosa (base do público)
      const n = c.sampleRate * 3;
      this.noiseBuf = c.createBuffer(1, n, c.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048;
        d[i] = (b0 + b1 + b2 + w * 0.02) * 0.9;
      }
      // público: murmúrio contínuo com respiração lenta
      const src = c.createBufferSource();
      src.buffer = this.noiseBuf; src.loop = true;
      this.crowdFilter = c.createBiquadFilter();
      this.crowdFilter.type = 'bandpass'; this.crowdFilter.frequency.value = 700; this.crowdFilter.Q.value = 0.6;
      this.crowdGain = c.createGain(); this.crowdGain.gain.value = 0;
      src.connect(this.crowdFilter).connect(this.crowdGain).connect(this.master);
      src.start();
      const lfo = c.createOscillator(); lfo.frequency.value = 0.13;
      const lfoG = c.createGain(); lfoG.gain.value = 120;
      lfo.connect(lfoG).connect(this.crowdFilter.frequency); lfo.start();
      // cânticos (vozes em uníssono: ruído filtrado em formantes, pulsado ao ritmo)
      this.chantGain = c.createGain(); this.chantGain.gain.value = 0;
      this.chantGain.connect(this.master);
    }
    void this.ctx.resume();
    this.running = true;
    this.update(0);
  }

  stop() {
    this.running = false;
    if (this.ctx) this.crowdGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
  }

  /** Chamar a cada fotograma: excitação 0 (calmo) a 1 (lance de golo). */
  update(excite: number) {
    if (!this.ctx || !this.running) return;
    const c = this.ctx;
    this.excite += (excite - this.excite) * 0.08;
    const base = 0.05 + this.fill * 0.22;
    this.crowdGain.gain.setTargetAtTime(base * (1 + this.excite * 2.2), c.currentTime, 0.25);
    this.crowdFilter.frequency.setTargetAtTime(600 + this.excite * 700, c.currentTime, 0.3);
    // de vez em quando um cântico ou palmas ritmadas (mais com pavilhão cheio)
    const now = c.currentTime;
    if (now > this.chantTimer) {
      this.chantTimer = now + 14 + Math.random() * 20;
      if (Math.random() < 0.35 + this.fill * 0.5) Math.random() < 0.5 ? this.chant() : this.claps();
    }
  }

  private noise(dur: number, f: number, q: number, type: BiquadFilterType, gain: number, when = 0, attack = 0.01, out?: AudioNode) {
    const c = this.ctx!;
    const t = c.currentTime + when;
    const s = c.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true;
    const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl).connect(g).connect(out ?? this.master);
    s.start(t, Math.random() * 2); s.stop(t + dur + 0.05);
    return fl;
  }
  private tone(f: number, dur: number, gain: number, type: OscillatorType = 'sine', when = 0, fEnd?: number) {
    const c = this.ctx!;
    const t = c.currentTime + when;
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (fEnd) o.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  private ok() { return !!this.ctx && this.running && this.vol !== 'off'; }

  /** Cântico: frase de 4 tempos, vozes masculinas (formantes ~500 e ~1100 Hz). */
  chant() {
    if (!this.ok()) return;
    const g = 0.05 + this.fill * 0.09;
    for (let rep = 0; rep < 3; rep++) for (let i = 0; i < 4; i++) {
      const w = rep * 2.2 + i * 0.5;
      this.noise(0.42, 520, 3, 'bandpass', g, w, 0.06, this.chantGain);
      this.noise(0.42, 1150, 4, 'bandpass', g * 0.6, w, 0.06, this.chantGain);
    }
    this.chantGain.gain.setTargetAtTime(1, this.ctx!.currentTime, 0.05);
  }
  /** Palmas ritmadas da bancada. */
  claps() {
    if (!this.ok()) return;
    const g = 0.06 + this.fill * 0.1;
    for (let i = 0; i < 12; i++) { const w = i * 0.55 + (i % 4 === 3 ? 0.15 : 0); this.noise(0.09, 1800, 0.8, 'bandpass', g, w, 0.002); }
  }
  /** Apito: dois tons agudos com trilo. kind: curto (falta), longo (início/fim), triplo (fim do jogo). */
  whistle(kind: 'short' | 'long' | 'triple' = 'short') {
    if (!this.ok()) return;
    const parts = kind === 'triple' ? [[0, 0.35], [0.45, 0.35], [0.9, 1.1]] : kind === 'long' ? [[0, 0.9]] : [[0, 0.32]];
    for (const [w, d] of parts) {
      for (const f of [2900, 3150]) {
        const o = this.tone(f, d, 0.1, 'sine', w);
        const tr = this.ctx!.createOscillator(); tr.frequency.value = 38;
        const tg = this.ctx!.createGain(); tg.gain.value = 60;
        tr.connect(tg).connect(o.frequency); tr.start(this.ctx!.currentTime + w); tr.stop(this.ctx!.currentTime + w + d);
      }
    }
  }
  /** Buzina do pavilhão (fim das partes, desconto de tempo). */
  horn(dur = 1.4) {
    if (!this.ok()) return;
    for (const f of [233, 466, 699]) this.tone(f, dur, f === 233 ? 0.09 : 0.04, 'sawtooth');
  }
  /** Toque na bola: passe (fraco) ou remate (forte). */
  kick(strong = false) {
    if (!this.ok()) return;
    this.tone(strong ? 120 : 160, strong ? 0.12 : 0.07, strong ? 0.35 : 0.14, 'sine', 0, strong ? 55 : 90);
    this.noise(strong ? 0.06 : 0.04, strong ? 2200 : 3000, 1, 'bandpass', strong ? 0.25 : 0.08);
  }
  /** Bola no poste: som metálico. */
  post() {
    if (!this.ok()) return;
    for (const [f, g] of [[620, 0.12], [1490, 0.07], [2630, 0.05], [3810, 0.03]] as const) this.tone(f, 1.2, g, 'sine');
    this.ooh(0.8);
  }
  /** Bola na rede. */
  net() {
    if (!this.ok()) return;
    this.noise(0.35, 4000, 0.7, 'highpass', 0.12, 0, 0.01);
  }
  /** Chiar das sapatilhas no piso. */
  squeak() {
    if (!this.ok()) return;
    this.tone(2400 + Math.random() * 1500, 0.08, 0.025, 'triangle', 0, 3800 + Math.random() * 600);
  }
  /** "Uuuh!" do público numa ocasião falhada ou grande defesa. */
  ooh(k = 1) {
    if (!this.ok()) return;
    const g = (0.12 + this.fill * 0.22) * k;
    const f = this.noise(1.6, 420, 2.5, 'bandpass', g, 0, 0.25);
    f.frequency.setValueAtTime(380, this.ctx!.currentTime);
    f.frequency.linearRampToValueAtTime(650, this.ctx!.currentTime + 0.5);
    f.frequency.linearRampToValueAtTime(330, this.ctx!.currentTime + 1.6);
  }
  /** Festa do golo: explosão do público (mais forte se for da casa). */
  goal(home: boolean) {
    if (!this.ok()) return;
    const g = (0.45 + this.fill * 0.75) * (home ? 1 : 0.55);
    this.noise(5.5, 900, 0.5, 'bandpass', g, 0, 0.12);
    this.noise(4.5, 2400, 0.8, 'bandpass', g * 0.5, 0.1, 0.2);
    this.net();
    if (home) setTimeout(() => this.chant(), 4500);
  }
  /** Assobios (visitante ou decisão contra a casa). */
  boo() {
    if (!this.ok()) return;
    const g = 0.04 + this.fill * 0.06;
    for (let i = 0; i < 6; i++) this.tone(1800 + Math.random() * 900, 1.2 + Math.random(), g, 'sine', Math.random() * 0.5, 1500 + Math.random() * 700);
  }
}

export const sound = new Sound();
export type { Vol };
