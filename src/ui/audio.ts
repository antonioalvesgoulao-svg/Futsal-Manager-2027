// Som do jogo: só gravações reais (freesound, escolhidas pelo António; créditos em public/sons/CREDITOS.txt).
// Sem sons sintéticos: se uma gravação faltar, esse momento fica em silêncio.
// O volume do público depende do nº real de espetadores e da ocupação; apito e buzina não.

type Vol = 'off' | 'low' | 'mid' | 'high';
const VOL: Record<Vol, number> = { off: 0, low: 0.35, mid: 0.7, high: 1 };
const FILES = ['publico', 'golo', 'apito', 'apito_fim', 'petardo', 'assobios', 'uuuh', 'palmas', 'buzina'];

export interface MatchSound { home: { id: string; short: string }; away: { id: string; short: string }; big: boolean; derby: boolean; rude: boolean; words: boolean }

class Sound {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private crowdBus!: GainNode; // público (fundo e reações) — é este que se abafa nas repetições
  private muffleF!: BiquadFilterNode;
  private vol: Vol = 'mid';
  private fill = 0.5; // nível do público (0 a 1): pessoas × ocupação
  private excite = 0;
  private clapsAt = 0;
  private running = false;
  private match: MatchSound | null = null;
  private buf: Record<string, AudioBuffer> = {};
  private crowdLoop: GainNode | null = null;
  private duck = 1; // golo do visitante: a maioria do pavilhão cala-se
  private duckUntil = 0;

  setMatch(m: MatchSound) { this.match = m; }
  setVolume(v: Vol) {
    this.vol = v;
    if (this.ctx) this.master.gain.setTargetAtTime(VOL[v] * 0.8, this.ctx.currentTime, 0.1);
  }
  get volume() { return this.vol; }

  /** Começa o ambiente (a partir de um clique: os browsers só tocam som depois de um gesto). */
  start(fill: number) {
    this.fill = Math.max(0.03, Math.min(1, fill));
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const c = this.ctx;
      this.master = c.createGain();
      this.master.gain.value = VOL[this.vol] * 0.8;
      this.master.connect(c.destination);
      this.muffleF = c.createBiquadFilter(); this.muffleF.type = 'lowpass'; this.muffleF.frequency.value = 20000;
      this.crowdBus = c.createGain();
      this.crowdBus.connect(this.muffleF).connect(this.master);
    }
    void this.ctx.resume();
    if (!Object.keys(this.buf).length) void this.loadAll();
    this.running = true;
  }

  stop() {
    this.running = false;
    if (this.ctx && this.crowdLoop) this.crowdLoop.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
  }

  private async loadAll() {
    const c = this.ctx!;
    const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/';
    await Promise.all(FILES.map(async (n) => {
      try {
        const r = await fetch(`${base}sons/${n}.mp3`);
        if (r.ok) this.buf[n] = await c.decodeAudioData(await r.arrayBuffer());
      } catch { /* sem a gravação: silêncio */ }
    }));
    if (this.buf.publico && !this.crowdLoop) {
      const s = c.createBufferSource(); s.buffer = this.buf.publico; s.loop = true;
      this.crowdLoop = c.createGain(); this.crowdLoop.gain.value = 0;
      s.connect(this.crowdLoop).connect(this.crowdBus); s.start(0, Math.random() * this.buf.publico.duration);
    }
  }

  private ok() { return !!this.ctx && this.running && this.vol !== 'off'; }

  /** Toca uma gravação (troço [from, from+dur] s, velocidade, atraso, filtro opcional, saída). */
  private sample(n: string, gain: number, o: { from?: number; dur?: number; rate?: number; when?: number; lowpass?: number; crowd?: boolean } = {}) {
    const b = this.buf[n];
    if (!b || !this.ok()) return false;
    const c = this.ctx!;
    const from = o.from ?? 0, rate = o.rate ?? 1;
    const t = c.currentTime + (o.when ?? 0);
    const d = Math.min(o.dur ?? b.duration - from, b.duration - from);
    const s = c.createBufferSource(); s.buffer = b; s.playbackRate.value = rate;
    const g = c.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.015);
    g.gain.setValueAtTime(gain, t + Math.max(0.02, d / rate - 0.12)); g.gain.linearRampToValueAtTime(0, t + d / rate);
    let node: AudioNode = s;
    if (o.lowpass) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lowpass; node.connect(f); node = f; }
    node.connect(g).connect(o.crowd === false ? this.master : this.crowdBus);
    s.start(t, from, d + 0.05);
    return true;
  }

  /** A cada fotograma: excitação 0 (calmo) a 1 (lance de golo). */
  update(excite: number) {
    if (!this.ctx || !this.running) return;
    const c = this.ctx, now = c.currentTime;
    this.excite += (excite - this.excite) * 0.08;
    if (now > this.duckUntil) this.duck += (1 - this.duck) * 0.05;
    if (this.crowdLoop) this.crowdLoop.gain.setTargetAtTime((0.015 + this.fill * 0.22) * (1 + this.excite * 2.2) * this.duck, now, 0.3);
    // de vez em quando palmas ritmadas da bancada
    if (now > this.clapsAt) {
      this.clapsAt = now + 25 + Math.random() * 30;
      if (Math.random() < 0.3 + this.fill * 0.4) this.claps();
    }
  }

  /** Repetições: o público fica abafado e mais baixo (como numa transmissão). */
  muffle(on: boolean) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.muffleF.frequency.setTargetAtTime(on ? 700 : 20000, t, 0.15);
    this.crowdBus.gain.setTargetAtTime(on ? 0.45 : 1, t, 0.15);
  }

  claps() { this.sample('palmas', 0.08 + this.fill * 0.5); }

  /** Apito real: curto = só o golpe inicial; longo = inteiro; fim do jogo = os três apitos. */
  whistle(kind: 'short' | 'long' | 'triple' = 'short') {
    if (kind === 'short') this.sample('apito', 1.2, { dur: 0.4, crowd: false });
    else if (kind === 'long') this.sample('apito', 1.2, { dur: 1.6, crowd: false });
    else this.sample('apito_fim', 1.2, { crowd: false });
  }

  /** Buzina do pavilhão (fim das partes, desconto de tempo). */
  horn(dur = 1.4) { this.sample('buzina', 1.4, { dur: dur + 0.6, crowd: false }); }

  /** "Uuuh" de desilusão do público (defesas, remates ao lado, postes). */
  ooh(k = 1) { this.sample('uuuh', (0.12 + this.fill * 0.9) * k); }

  /** Assobios (expulsões, confrontos). */
  boo() { this.sample('assobios', 0.12 + this.fill * 0.9, { from: Math.random() * 2, dur: 6 }); }

  /** Petardos (jogos grandes, nos golos): cada um com tamanho e distância diferentes. */
  petards(n = 4) {
    for (let i = 0, w = 0.3; i < n; i++, w += 0.35 + Math.random() * 0.9) this.sample('petardo', 0.8 + Math.random() * 0.7, { rate: 0.85 + Math.random() * 0.3, when: w });
  }

  /** Golo. Da casa: explosão do pavilhão. Do visitante: a maioria cala-se e só se ouve, ao longe, a festa dos visitantes. */
  goal(home: boolean) {
    if (!this.ok()) return;
    if (home) {
      this.sample('golo', Math.min(1.6, (0.2 + this.fill * 1.05) * 1.4));
      setTimeout(() => this.claps(), 4500);
    } else {
      this.duck = 0.25; this.duckUntil = this.ctx!.currentTime + 4;
      this.sample('golo', Math.min(0.5, 0.08 + this.fill * 0.22), { lowpass: 1400 });
    }
    if (this.match?.big) this.petards(3 + Math.floor(Math.random() * 4));
  }
}

export const sound = new Sound();
export type { Vol };
