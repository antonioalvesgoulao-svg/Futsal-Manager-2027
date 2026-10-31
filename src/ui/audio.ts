// Som do jogo, todo gerado no próprio browser (Web Audio), sem gravações com direitos:
// ambiente do pavilhão (público conforme a assistência, cânticos, palmas, festa do golo, assobios, "uuuh"),
// apito dos árbitros, buzina do fim das partes e sons da bola (passe, remate, poste, rede).

type Vol = 'off' | 'low' | 'mid' | 'high';

// ---------- cânticos ----------
// Cada cântico: letra (com {C} = nome curto do clube que canta, {R} = rival), melodia em meios-tons por sílaba
// (repete-se se a letra for maior) e duração de cada sílaba. Melodias originais, simples, ao estilo das bancadas.
interface ChantDef { text: string; mel: number[]; beat: number; claps?: boolean; who?: 'slb' | 'scp'; rude?: boolean; reps?: number }
const CHANTS: ChantDef[] = [
  // de qualquer equipa
  { text: 'Allez allez allez, {C} allez', mel: [0, 0, 2, 4, 4, 2, 0, -1, 0], beat: 0.32, claps: true, reps: 3 },
  { text: 'Força {C}!', mel: [0, 4, 4], beat: 0.45, claps: true, reps: 4 },
  { text: '{C}! {C}!', mel: [0, 0, 4, 4], beat: 0.38, claps: true, reps: 4 },
  { text: 'Vamos {C}, vamos ganhar', mel: [0, 2, 4, 4, 2, 0, -1, 0], beat: 0.33, claps: true, reps: 3 },
  { text: 'Olé, olé, olé, olé', mel: [0, 4, 4, 2, 2, 0, -1, 0], beat: 0.34, reps: 2 },
  { text: 'Nós somos {C}, nós vamos ganhar', mel: [4, 4, 2, 0, 0, 2, 4, 2, 0], beat: 0.3, claps: true, reps: 2 },
  { text: 'Ninguém nos para, {C} até morrer', mel: [0, 0, 2, 4, 4, 5, 4, 2, 0, -1, 0], beat: 0.3, reps: 2 },
  // Benfica
  { text: 'Benfica! Benfica!', mel: [0, 4, 4, 0, 4, 4], beat: 0.4, claps: true, who: 'slb', reps: 4 },
  { text: 'Benfica allez, Benfica allez', mel: [0, 2, 4, 4, 2, 0, 2, 4, 2, 0], beat: 0.3, claps: true, who: 'slb', reps: 3 },
  { text: 'Glorioso SLB, Glorioso SLB', mel: [0, 2, 4, 5, 4, 2, 0, 2, 4, 5, 4, 2, 0], beat: 0.28, claps: true, who: 'slb', reps: 2 },
  { text: 'Somos águias, vamos voar', mel: [0, 2, 4, 2, 0, 2, 4, 5, 4], beat: 0.32, who: 'slb', reps: 2 },
  // Sporting
  { text: 'Sporting allez, Sporting allez', mel: [0, 2, 4, 4, 2, 0, 2, 4, 2, 0], beat: 0.3, claps: true, who: 'scp', reps: 3 },
  { text: 'Sporting! Sporting!', mel: [0, 4, 4, 0, 4, 4], beat: 0.4, claps: true, who: 'scp', reps: 4 },
  { text: 'Leões! Leões! Leões!', mel: [0, 4, 0, 4, 0, 4], beat: 0.4, claps: true, who: 'scp', reps: 3 },
  { text: 'Verde e branco até morrer', mel: [0, 2, 4, 4, 2, 0, -1, 0], beat: 0.32, who: 'scp', reps: 2 },
  // provocações (só no dérbi Benfica-Sporting; desligáveis nas Definições)
  { text: 'E o Sporting vai para o caralho', mel: [0, 2, 4, 4, 4, 2, 0, -1, 0, 0], beat: 0.28, claps: true, who: 'slb', rude: true, reps: 3 },
  { text: 'E o Benfica vai para o caralho', mel: [0, 2, 4, 4, 4, 2, 0, -1, 0, 0], beat: 0.28, claps: true, who: 'scp', rude: true, reps: 3 },
  { text: 'Lagartos! Lagartos!', mel: [0, 0, -2, 0, 0, -2], beat: 0.38, who: 'slb', rude: true, reps: 3 },
  { text: 'Lampiões! Lampiões!', mel: [0, 0, -2, 0, 0, -2], beat: 0.38, who: 'scp', rude: true, reps: 3 },
  { text: 'Quem não salta é lagarto, olé', mel: [0, 0, 2, 2, 4, 4, 2, 0, 0], beat: 0.27, claps: true, who: 'slb', rude: true, reps: 3 },
  { text: 'Quem não salta é lampião, olé', mel: [0, 0, 2, 2, 4, 4, 2, 0, 0], beat: 0.27, claps: true, who: 'scp', rude: true, reps: 3 },
];
// formantes das vogais (Hz): a voz do público "canta" a vogal de cada sílaba
const VOWEL: Record<string, [number, number]> = { a: [800, 1250], e: [520, 1850], i: [320, 2300], o: [520, 900], u: [360, 820] };
function syllables(text: string): string[] {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const out: string[] = [];
  for (const w of norm.split(/[^a-z]+/).filter(Boolean)) {
    const groups = w.match(/[aeiou]+/g) ?? ['a'];
    for (const g of groups) out.push(g[g.length - 1]);
  }
  return out;
}
export interface MatchSound { home: { id: string; short: string }; away: { id: string; short: string }; big: boolean; derby: boolean; rude: boolean; words: boolean }

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
  private match: MatchSound | null = null;
  private chanting = 0; // até quando dura o cântico atual
  private babbleAt = 0;
  setMatch(m: MatchSound) { this.match = m; }

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
      this.crowdFilter.type = 'bandpass'; this.crowdFilter.frequency.value = 900; this.crowdFilter.Q.value = 1.2;
      this.crowdGain = c.createGain(); this.crowdGain.gain.value = 0;
      src.connect(this.crowdFilter).connect(this.crowdGain).connect(this.master);
      src.start();
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
    // fundo de sala muito baixo; o "público" ouve-se sobretudo pelas vozes soltas (conversa, gritos)
    const base = 0.012 + this.fill * 0.03;
    this.crowdGain.gain.setTargetAtTime(base * (1 + this.excite * 3), c.currentTime, 0.25);
    this.crowdFilter.frequency.setTargetAtTime(900 + this.excite * 500, c.currentTime, 0.3);
    const now = c.currentTime;
    // conversa do público: vozes curtas a falar/gritar, mais com o pavilhão cheio e nos lances perigosos
    while (this.babbleAt < now + 0.2) {
      this.babbleAt = Math.max(this.babbleAt, now) + (0.09 + Math.random() * 0.12) / (0.4 + this.fill + this.excite);
      const t = this.babbleAt - now;
      const vw = 'aeiou'[Math.floor(Math.random() * 5)];
      this.voices(0.12 + Math.random() * 0.25, vw, vw, 110 + Math.random() * 120, (0.014 + this.fill * 0.026) * (1 + this.excite * 2.5), 2, t);
    }
    // de vez em quando palmas ritmadas da bancada
    if (now > this.chantTimer) {
      this.chantTimer = now + 25 + Math.random() * 30;
      if (Math.random() < 0.3 + this.fill * 0.4) this.claps();
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

  /** Vozes de pessoas: várias vozes (dente de serra) desafinadas, filtradas nas formantes de uma vogal
   *  que pode mudar a meio (ex.: "u" -> "o"). Base para "uuuh", assobios de desagrado e gritos. */
  private voices(dur: number, v0: string, v1: string, pitch: number, gain: number, n = 10, when = 0, pitchEnd?: number) {
    const c = this.ctx!;
    const t = c.currentTime + when;
    const [a1, a2] = VOWEL[v0] ?? VOWEL.a, [b1, b2] = VOWEL[v1] ?? VOWEL.a;
    const f1 = c.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 5; f1.frequency.setValueAtTime(a1, t); f1.frequency.linearRampToValueAtTime(b1, t + dur);
    const f2 = c.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 7; f2.frequency.setValueAtTime(a2, t); f2.frequency.linearRampToValueAtTime(b2, t + dur);
    const env = c.createGain();
    env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(gain, t + Math.min(0.25, dur * 0.3));
    env.gain.setValueAtTime(gain, t + dur * 0.6); env.gain.linearRampToValueAtTime(0, t + dur);
    const mix = c.createGain();
    mix.connect(f1); mix.connect(f2); f1.connect(env); f2.connect(env); env.connect(this.master);
    for (let k = 0; k < n; k++) {
      const o = c.createOscillator(); o.type = 'sawtooth';
      const p = pitch * Math.pow(2, ((Math.random() - 0.5) * 300) / 1200); // cada pessoa no seu tom
      o.frequency.setValueAtTime(p, t);
      if (pitchEnd) o.frequency.linearRampToValueAtTime(p * (pitchEnd / pitch), t + dur);
      const og = c.createGain(); og.gain.value = 1 / Math.sqrt(n);
      o.connect(og).connect(mix);
      o.start(t + Math.random() * 0.08); o.stop(t + dur + 0.05);
    }
  }

  /** Cântico: frase de 4 tempos, vozes masculinas (formantes ~500 e ~1100 Hz). */
  chant(side?: 0 | 1) {
    if (!this.ok() || !this.match) return;
    const c = this.ctx!;
    if (c.currentTime < this.chanting) return;
    const m = this.match;
    // quem canta: sobretudo a casa; visitantes de vez em quando (mais nos dérbis)
    const sd: 0 | 1 = side ?? (Math.random() < (m.derby ? 0.4 : 0.22) ? 1 : 0);
    const team = sd === 0 ? m.home : m.away;
    const rival = sd === 0 ? m.away : m.home;
    const pool = CHANTS.filter((d) => (!d.who || d.who === team.id) && (!d.rude || (m.derby && m.rude)));
    // os cânticos próprios do clube saem mais vezes
    const own = pool.filter((d) => d.who === team.id);
    const def = own.length && Math.random() < 0.6 ? own[Math.floor(Math.random() * own.length)] : pool[Math.floor(Math.random() * pool.length)];
    const text = def.text.split('{C}').join(team.short).split('{R}').join(rival.short);
    this.sing(text, def, sd === 0 ? 1 : 0.55);
  }

  /** Coro do público: muitas vozes ligeiramente desafinadas a cantar as vogais, com palmas no tempo. */
  private sing(text: string, def: ChantDef, level: number) {
    const c = this.ctx!;
    const syl = syllables(text);
    const reps = def.reps ?? 2;
    const base = 138 * Math.pow(2, (Math.random() * 3 - 1.5) / 12); // vozes masculinas
    const g = (0.035 + this.fill * 0.06) * level * (this.match?.big ? 1.3 : 1);
    const phrase = syl.length * def.beat + def.beat * 1.5;
    const t0 = c.currentTime + 0.05;
    for (let r = 0; r < reps; r++) {
      syl.forEach((v, i) => {
        const t = t0 + r * phrase + i * def.beat;
        const f = base * Math.pow(2, def.mel[i % def.mel.length] / 12);
        const [f1, f2] = VOWEL[v] ?? VOWEL.a;
        const dur = def.beat * 0.92;
        const f1n = c.createBiquadFilter(); f1n.type = 'bandpass'; f1n.frequency.value = f1; f1n.Q.value = 4;
        const f2n = c.createBiquadFilter(); f2n.type = 'bandpass'; f2n.frequency.value = f2; f2n.Q.value = 6;
        const env = c.createGain();
        env.gain.setValueAtTime(0, t); env.gain.linearRampToValueAtTime(g, t + 0.04); env.gain.setValueAtTime(g, t + dur - 0.06); env.gain.linearRampToValueAtTime(0, t + dur);
        const mix = c.createGain(); mix.gain.value = 1;
        f1n.connect(env); f2n.connect(env); env.connect(this.chantGain);
        for (let k = 0; k < 6; k++) {
          const o = c.createOscillator(); o.type = 'sawtooth';
          o.frequency.value = f * Math.pow(2, ((Math.random() - 0.5) * 40) / 1200) * (k === 5 ? 2 : 1);
          o.connect(mix); o.start(t); o.stop(t + dur + 0.02);
        }
        mix.connect(f1n); mix.connect(f2n);
        // ruído de muitas vozes por cima (consoantes e "multidão")
        this.noise(dur, f1, 1.5, 'bandpass', g * 1.2, t - c.currentTime, 0.03, this.chantGain);
        if (def.claps && i % 2 === 0) this.noise(0.08, 1900, 0.9, 'bandpass', g * 2.2, t - c.currentTime, 0.002, this.chantGain);
      });
      // letra dita pela voz do sistema (português), a acompanhar o coro
      if (this.match?.words && 'speechSynthesis' in window && r < 2) {
        const when = (t0 + r * phrase - c.currentTime) * 1000;
        setTimeout(() => {
          if (!this.ok()) return;
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'pt-PT'; u.rate = Math.min(1.6, (syl.length * 0.32) / Math.max(0.6, syl.length * def.beat)); u.pitch = 0.7;
          u.volume = Math.min(1, VOL[this.vol] * 0.55 * level);
          const pt = speechSynthesis.getVoices().find((v) => v.lang === 'pt-PT') ?? speechSynthesis.getVoices().find((v) => v.lang.startsWith('pt'));
          if (pt) u.voice = pt;
          speechSynthesis.speak(u);
        }, Math.max(0, when));
      }
    }
    this.chanting = t0 + reps * phrase + 1;
    this.chantGain.gain.setTargetAtTime(1, c.currentTime, 0.05);
  }

  /** Petardos (jogos grandes, nos golos): estrondos secos com eco no pavilhão. */
  petards(n = 4) {
    if (!this.ok()) return;
    for (let i = 0; i < n; i++) {
      const w = 0.3 + i * (0.4 + Math.random() * 0.9);
      this.noise(0.9, 180, 0.4, 'lowpass', 0.9, w, 0.002);
      this.noise(0.25, 2500, 0.5, 'bandpass', 0.5, w, 0.001);
      this.tone(60, 0.5, 0.5, 'sine', w, 35);
      this.noise(1.6, 400, 0.7, 'bandpass', 0.12, w + 0.12, 0.05); // eco
    }
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
    const c = this.ctx!;
    for (const [w, d] of parts) {
      const t = c.currentTime + w;
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = 3200;
      const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 6400; // harmónico agudo
      const tr = c.createOscillator(); tr.frequency.value = 26 + Math.random() * 6; // a bolinha dentro do apito
      const fm = c.createGain(); fm.gain.value = 240; tr.connect(fm); fm.connect(o.frequency); fm.connect(o2.frequency);
      const am = c.createGain(); am.gain.value = 0.35; tr.connect(am);
      const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32, t + 0.02); g.gain.setValueAtTime(0.32, t + d - 0.05); g.gain.linearRampToValueAtTime(0, t + d);
      am.connect(g.gain);
      const g2 = c.createGain(); g2.gain.value = 0.25;
      o.connect(g); o2.connect(g2).connect(g); g.connect(this.master);
      for (const x of [o, o2, tr]) { x.start(t); x.stop(t + d + 0.05); }
      this.noise(d, 3200, 2, 'bandpass', 0.05, w, 0.02); // sopro
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
    const g = (0.1 + this.fill * 0.18) * k;
    // centenas de pessoas: "uuuh" que sobe e desce de tom (vozes graves e agudas)
    this.voices(1.7, 'u', 'o', 170, g, 14, 0, 125);
    this.voices(1.5, 'u', 'o', 260, g * 0.6, 10, 0.05, 190);
    this.noise(1.5, 500, 1.2, 'bandpass', g * 0.5, 0, 0.2);
  }
  /** Festa do golo: explosão do público (mais forte se for da casa). */
  goal(home: boolean) {
    if (!this.ok()) return;
    const g = (0.45 + this.fill * 0.75) * (home ? 1 : 0.55);
    this.voices(4, 'o', 'a', 190, g * 0.9, 18, 0, 210); // "GOOOLO"
    this.noise(5.5, 900, 0.5, 'bandpass', g * 0.6, 0, 0.12);
    this.noise(4.5, 2400, 0.8, 'bandpass', g * 0.35, 0.1, 0.2);
    this.net();
    if (this.match?.big) this.petards(3 + Math.floor(Math.random() * 4));
    this.chanting = 0;
    setTimeout(() => this.claps(), 4500);
  }
  /** Assobios (visitante ou decisão contra a casa). */
  boo() {
    if (!this.ok()) return;
    const g = 0.08 + this.fill * 0.14;
    this.voices(2.6, 'u', 'u', 120, g, 16, 0, 105); // "buuuu"
    for (let i = 0; i < 10; i++) {
      const f0 = 2200 + Math.random() * 1400;
      this.tone(f0, 0.8 + Math.random() * 1.2, g * 0.35, 'sine', Math.random() * 1.2, f0 * (0.75 + Math.random() * 0.2)); // assobios com os dedos
    }
  }
}

export const sound = new Sound();
export type { Vol };
