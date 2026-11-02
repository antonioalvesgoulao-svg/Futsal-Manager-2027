import type { CustomPlay } from '../tactics';
// Coreografia de uma posse: transforma o que o motor decidiu numa jogada visível e contínua.
// É a mesma para o 2D e para o 3D.
//
// Cada jogador tem um percurso (pontos-chave ligados por curvas suaves, com velocidade máxima
// realista); a bola passa de pé em pé; cada jogador pode ter uma ação em curso (passe, remate,
// finta, bloqueio, desarme, mergulho...). O ataque usa movimentos reais do futsal:
// paralela, diagonal, bola no pivô, bloqueio e continuação, passe e corte (4-0), segundo poste,
// contra-ataques 2x1/3x2; a defesa pressiona, cobre e troca marcações conforme as táticas.
// Bolas paradas com organização ofensiva e defensiva: cantos (4 jogadas), livres com barreira
// a 5 m, livres de 10 m e penáltis.
//
// Coordenadas em metros: x de -20 a 20 (comprimento), y de -10 a 10 (largura).
// Internamente usa-se u (0 = baliza de quem ataca, 40 = baliza de quem defende) e v (largura).
import type { Action, Possession } from '../engine/match';
import type { Tactics } from '../tactics';
import type { Player } from '../types';
import { bakeMovementTrajectory, movementProfile, type MovementProfile } from './movement';

export interface P2 { x: number; y: number }
export interface Ball { x: number; y: number; z: number }

export type ActKind = 'receive' | 'footsave' | 'poke' | 'pass' | 'shoot' | 'dive' | 'splits' | 'spread' | 'shove' | 'whistle' | 'catch' | 'tackle' | 'feint' | 'screen' | 'shield' | 'block' | 'celebrate' | 'fall' | 'run' | 'throw' | 'idle';
export interface Act {
  kind: ActKind;
  k: number; // progresso da ação (0 a 1)
  ang: number; // direção (atan2(dx, dy)) para onde o corpo se vira
  to?: P2; // destino (desmarcações, mergulhos)
  h?: number; // altura do mergulho
  side?: number; // lado do mergulho (calculado pela vista 3D)
}

export interface Frame {
  pos: Record<string, P2>; // posição de cada jogador em campo
  ball: Ball;
  holder: string | null;
  stoppage: boolean; // bola parada (relógio parado)
  label: string; // ação em curso (para legendas)
  phase: string; // momento do jogo (ataque organizado, contra-ataque, canto...)
  acts: Record<string, Act>;
  focus?: P2; // para onde olham as câmaras (por omissão, a bola)
  hideBall?: boolean;
}

/** O que a vista 3D precisa de uma cena (jogada ou cerimónia de entrada). */
export interface Scene3D {
  at(ct: number): Frame;
  readonly attackDirection: number;
  readonly total: number;
  /** energia de cada jogador (0-100), para o cansaço se ver no corpo */
  readonly energy?: Readonly<Record<string, number>>;
}

export interface StartState {
  holder: string | null;
  ball: P2;
  pos?: Record<string, P2>;
  kind?: 'live' | 'gk' | 'kickoff' | 'lateral';
}

type UV = [number, number];
type Sys = Tactics['system'] | '5x4';

// estruturas ofensivas (u, v) na fase de finalização
const SHAPES: Record<Sys, UV[]> = {
  '3-1': [[19.5, 0], [26.5, -8.4], [26.5, 8.4], [34, 0]], // fixo, ala E, ala D, pivô (largura total, como nos jogos reais)
  '1-2-1': [[18.5, 0], [26, -8.2], [26, 8.2], [33.5, 0]],
  '4-0': [[22, -3.6], [28.5, -8.6], [28.5, 8.6], [22, 3.6]], // universal E, ala E, ala D, universal D
  '2-2': [[22, -4.5], [31.5, -6], [31.5, 6], [22, 4.5]],
  '5x4': [[24, 0], [27.5, -8.3], [27.5, 8.3], [34.5, -6.5], [34.5, 6.5]], // GR avançado no topo, alas, dois nos cantos da área
};
// bloco defensivo à espera (u medido a partir da baliza de quem ataca)
const BLOCK: Record<Tactics['pressure'], UV[]> = {
  alta: [[17, 0], [21, -6], [21, 6], [26, 0]],
  media: [[21, 0], [25, -5], [25, 5], [29.5, 0]],
  baixa: [[26, 0], [29, -4.5], [29, 4.5], [32, 0]],
};
const PRESS_LINE: Record<Tactics['pressure'], number> = { alta: 7, media: 18.5, baixa: 25 };
const VMAX = 7.4; // m/s (sprint de futsal)
const AMAX = 9; // m/s² (arranques, travagens e mudanças de direção)
const BAKE_DT = 1 / 30;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => k * k * (3 - 2 * k);
const dist = (a: P2, b: P2) => Math.hypot(a.x - b.x, a.y - b.y);
const angTo = (a: P2, b: P2) => Math.atan2(b.x - a.x, b.y - a.y);

function rnd(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)), ((s ^= s >>> 16) >>> 0) / 4294967296);
}

/** Sentido de ataque: a equipa da casa ataca para +x nas partes ímpares. */
export const REFS = ['arbitro1', 'arbitro2'];

export const attackDir = (side: number, period: number) => ((period % 2 === 1) === (side === 0) ? 1 : -1);

// ---------- percurso de um jogador ----------
interface Key { t: number; x: number; y: number; hold: boolean }

class Track {
  keys: Key[] = [];

  set(t: number, p: P2, hold = false) {
    this.baked = null;
    const k: Key = { t, x: p.x, y: clamp(p.y, -10.6, 10.6), hold };
    let i = this.keys.length;
    while (i > 0 && this.keys[i - 1].t > t) i--;
    if (i > 0 && Math.abs(this.keys[i - 1].t - t) < 0.06) { this.keys[i - 1] = k; return; }
    if (i < this.keys.length && Math.abs(this.keys[i].t - t) < 0.06) { this.keys[i] = k; return; }
    this.keys.splice(i, 0, k);
  }

  /** Movimentos de apoio sem bola: onde o jogador ficaria parado muito tempo, faz desmarcações curtas
   * (fintar a marcação, aproximar-se e voltar a abrir), como no futsal real. */
  liven(r: () => number, t0: number, t1: number, amp: number, skip: (t: number) => boolean) {
    const out: Key[] = [];
    for (let i = 0; i < this.keys.length; i++) {
      const a = this.keys[i], b = this.keys[i + 1];
      out.push(a);
      if (!b || b.t < t0 || a.t > t1) continue;
      const gap = b.t - a.t;
      const n = Math.floor(gap / 3.2); // pausas posicionais: ~1 ajuste a cada 2,4 s parado (antes 1,3 s)
      for (let k = 1; k <= n; k++) {
        const t = a.t + (gap * k) / (n + 1);
        if (skip(t)) continue;
        const kk = k / (n + 1);
        const bx = a.x + (b.x - a.x) * kk, by = a.y + (b.y - a.y) * kk;
        const ang = r() * Math.PI * 2;
        const m = amp * (0.5 + r() * 0.5);
        out.push({ t, x: clamp(bx + Math.cos(ang) * m, -19.5, 19.5), y: clamp(by + Math.sin(ang) * m, -9.8, 9.8), hold: false });
      }
    }
    this.keys = out;
    this.baked = null;
  }

  /** Remove pontos-chave dentro de um intervalo (para dar lugar a movimentos explícitos). */
  clear(t0: number, t1: number) {
    this.baked = null;
    this.keys = this.keys.filter((k) => k.t < t0 || k.t > t1);
  }

  /** Nenhum troço mais rápido do que vmax (exceto chegadas obrigatórias a bolas paradas). */
  limit(vmax: number) {
    for (let i = 1; i < this.keys.length; i++) {
      const a = this.keys[i - 1], b = this.keys[i];
      if (b.hold) continue;
      const max = vmax * (b.t - a.t);
      const d = Math.hypot(b.x - a.x, b.y - a.y);
      if (d > max && d > 0) { b.x = a.x + ((b.x - a.x) * max) / d; b.y = a.y + ((b.y - a.y) * max) / d; }
    }
  }

  private tangent(i: number): P2 {
    const ks = this.keys;
    if (i === 0 || i === ks.length - 1 || ks[i].hold) return { x: 0, y: 0 };
    const a = ks[i - 1], b = ks[i], c = ks[i + 1];
    const d0 = { x: (b.x - a.x) / (b.t - a.t), y: (b.y - a.y) / (b.t - a.t) };
    const d1 = { x: (c.x - b.x) / (c.t - b.t), y: (c.y - b.y) / (c.t - b.t) };
    if (d0.x * d1.x + d0.y * d1.y <= 0) return { x: 0, y: 0 }; // inversão de sentido: trava
    const m = { x: (c.x - a.x) / (c.t - a.t), y: (c.y - a.y) / (c.t - a.t) };
    const cap = Math.min(Math.hypot(d0.x, d0.y), Math.hypot(d1.x, d1.y));
    const mm = Math.hypot(m.x, m.y);
    return mm > cap && mm > 0 ? { x: (m.x * cap) / mm, y: (m.y * cap) / mm } : m;
  }

  // percurso final, com inércia: velocidade e aceleração máximas (como um jogador real)
  baked: { t0: number; xs: Float32Array; ys: Float32Array } | null = null;

  bake(t0: number, t1: number, vmax: number, amax: number, accelerationFactor = 1, agilityFactor = 1) {
    this.baked = null;
    const points = bakeMovementTrajectory(
      (time) => this.at(time), t0, t1, vmax, amax,
      accelerationFactor, agilityFactor, BAKE_DT,
    );
    const xs = Float32Array.from(points, (point) => point.x);
    const ys = Float32Array.from(points, (point) => point.y);
    this.baked = { t0, xs, ys };
  }

  at(t: number): P2 {
    const bk = this.baked;
    if (bk) {
      const f = clamp((t - bk.t0) / BAKE_DT, 0, bk.xs.length - 1.001);
      const i = Math.floor(f), k = f - i;
      return { x: lerp(bk.xs[i], bk.xs[i + 1], k), y: lerp(bk.ys[i], bk.ys[i + 1], k) };
    }
    const ks = this.keys;
    if (!ks.length) return { x: 0, y: 0 };
    if (t <= ks[0].t) return { x: ks[0].x, y: ks[0].y };
    const n = ks.length - 1;
    if (t >= ks[n].t) return { x: ks[n].x, y: ks[n].y };
    let i = 0;
    while (i < n - 1 && ks[i + 1].t <= t) i++;
    const a = ks[i], b = ks[i + 1];
    const h = b.t - a.t;
    const s = (t - a.t) / h;
    const m0 = this.tangent(i), m1 = this.tangent(i + 1);
    const s2 = s * s, s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
    return {
      x: h00 * a.x + h10 * h * m0.x + h01 * b.x + h11 * h * m1.x,
      y: h00 * a.y + h10 * h * m0.y + h01 * b.y + h11 * h * m1.y,
    };
  }
}

// ---------- bola ----------
type BSeg =
  | { k: 'foot'; t0: number; id: string }
  | { k: 'hands'; t0: number; id: string; z?: number }
  | { k: 'pass'; t0: number; t1: number; from: string; to: string; lift: number }
  | { k: 'fly'; t0: number; t1: number; from: string | Ball; b: Ball | string; lift: number }
  | { k: 'still'; t0: number; at: Ball };

interface ActRec { id: string; kind: ActKind; t0: number; t1: number; ang?: number; to?: P2; h?: number; face?: string }

interface Ending { kind: 'shot' | 'lost' | 'foul' | 'none'; shot?: Action; lost?: Action; foul?: Action }

export class Choreo {
  readonly duration: number; // tempo de jogo da posse
  readonly extra: number; // bola parada mostrada a seguir (relógio parado)
  readonly lead: number; // preparação antes de a bola rolar (pontapé de saída, reposição do GR)
  readonly end: StartState;

  private tr = new Map<string, Track>();
  private movement = new Map<string, MovementProfile>();
  private attrsOf = new Map<string, Player['attrs']>();
  /** atributo 1-20 normalizado a 0-1 (0,5 sem dados: jogo sem plantéis) */
  private au(id: string | null | undefined, k: keyof Player['attrs']) { const a = id ? this.attrsOf.get(id) : undefined; return a ? clamp((a[k] - 1) / 19, 0, 1) : 0.5; }
  private sideOf = new Map<string, number>();
  private balls: BSeg[] = [];
  private acts: ActRec[] = [];
  private labels: { t: number; text: string }[] = [];
  private phases: { t: number; text: string }[] = [];
  private fixed = new Map<string, [number, number][]>(); // janelas com movimento explícito (a defesa automática não mexe)
  private later: (() => void)[] = [];
  private post: (() => void)[] = [];
  private dirA: number;
  private att: number;
  private r: () => number;
  private attOut: string[];
  private defOut: string[];
  private gkA: string | null;
  private gkD: string | null;
  private sys: Sys;
  private slot = new Map<string, number>();
  private progFn: (t: number) => number = () => 1;
  private D: number;
  private finalT: number;

  constructor(
    private p: Possession,
    private tactics: [Tactics, Tactics],
    period: number,
    start: StartState | null,
    private names: Record<string, string> = {},
    playersById: Readonly<Record<string, Player>> = {},
    readonly energy: Readonly<Record<string, number>> = {}
  ) {
    for (const [id, player] of Object.entries(playersById)) { this.movement.set(id, movementProfile(player)); this.attrsOf.set(id, player.attrs); }
    this.r = rnd(Math.floor(p.start * 100) + 7);
    const r = this.r;
    const att = (this.att = p.side);
    const def = 1 - att;
    this.dirA = attackDir(att, period);
    this.D = this.duration = Math.max(0.5, p.end - p.start);
    const D = this.D;
    const ids = p.onCourt;
    const out = (sd: number) => (p.flying[sd] ? ids[sd].filter((x): x is string => !!x) : ids[sd].slice(1).filter((x): x is string => !!x));
    this.attOut = out(att);
    this.defOut = ids[def].slice(1).filter((x): x is string => !!x);
    this.gkA = p.flying[att] ? null : ids[att][0];
    this.gkD = ids[def][0];
    for (const sd of [0, 1]) for (const id of ids[sd]) if (id) { this.sideOf.set(id, sd); this.tr.set(id, new Track()); }
    // os dois árbitros, um em cada linha lateral, a acompanhar o jogo
    for (const id of REFS) this.tr.set(id, new Track());
    this.sys = p.flying[att] ? '5x4' : tactics[att].system;
    this.attOut.forEach((id, i) => this.slot.set(id, i % SHAPES[this.sys].length));

    // ---- ponto de partida ----
    const kind0 = start?.kind ?? (start ? 'live' : 'kickoff');
    // reposição do GR só se a bola for mesmo do GR de quem ataca agora
    const kind = kind0 === 'gk' && (!this.gkA || start?.holder !== this.gkA) ? 'live' : kind0;
    this.lead = kind === 'kickoff' ? (start ? 4 : 1.6) : kind === 'gk' ? 2.4 : kind === 'lateral' ? 3.6 : 0;
    const t0 = -this.lead;
    for (const [id, tr] of this.tr) {
      const prev = start?.pos?.[id];
      // quem entra por substituição vem da zona de substituição, do lado dos bancos
      tr.set(t0, prev ?? (start?.pos ? { x: 0, y: -10.4 } : this.restPos(id, kind === 'lateral' ? 'live' : kind)), true);
    }

    let holder: string;
    const sb = start?.ball ?? { x: 0, y: 0 };
    if (kind === 'kickoff') {
      holder = this.attOut.find((id) => id !== ids[att][0]) ?? this.attOut[0];
      for (const id of this.tr.keys()) this.tr.get(id)!.set(-0.15, this.restPos(id, 'kickoff', holder), true);
      // a bola volta ao centro
      const b0: Ball = { x: sb.x, y: sb.y, z: 0.11 };
      this.balls.push({ k: 'still', t0, at: b0 });
      // devolvida ao centro dentro do tempo de preparação (antes podia chegar depois do pontapé de saída)
      const tBack = t0 + Math.min(2.4, this.lead - 0.35);
      if (Math.hypot(sb.x, sb.y) > 0.5) this.balls.push({ k: 'fly', t0: t0 + Math.min(0.8, (this.lead - 0.35) * 0.3), t1: tBack, from: b0, b: { x: 0, y: 0, z: 0.11 }, lift: 1.2 });
      this.balls.push({ k: 'still', t0: tBack, at: { x: 0, y: 0, z: 0.11 } });
      this.phase(t0, 'Pontapé de saída');
      this.progFn = this.makeProg(0, 0);
    } else if (kind === 'gk' && this.gkA) {
      holder = this.gkA;
      for (const id of this.tr.keys()) this.tr.get(id)!.set(-0.15, this.restPos(id, 'gk'), id === holder);
      // o GR vai buscar a bola (atrás da baliza ou perto dela) e volta para repor; se estiver longe, um apanha-bolas devolve-a
      const b0: Ball = { x: sb.x, y: sb.y, z: 0.11 };
      this.balls.push({ k: 'still', t0, at: b0 });
      const gp = this.P(holder, t0);
      if (dist(gp, b0) < 6) {
        const tg = t0 + clamp(dist(gp, b0) / 5, 0.4, 1.2);
        this.key(holder, tg, { x: clamp(b0.x, -20.8, 20.8), y: b0.y }, true);
        this.balls.push({ k: 'hands', t0: tg, id: holder });
      } else {
        this.balls.push({ k: 'fly', t0: t0 + 0.3, t1: t0 + 1.3, from: { x: b0.x, y: Math.sign(b0.y || 1) * 11.5, z: 0.6 }, b: holder, lift: 0.8 });
        this.balls.push({ k: 'hands', t0: t0 + 1.3, id: holder });
      }
      this.phase(t0, 'Reposição do guarda-redes');
      this.progFn = this.makeProg(0, 0);
    } else if (kind === 'lateral') {
      // pontapé de linha lateral (regra do futsal: bola parada sobre a linha, 4 segundos para repor)
      const spot = { x: clamp(sb.x, -19, 19), y: Math.sign(sb.y || 1) * 10 };
      holder = this.attOut.reduce((x, y) => (dist(this.P(y, t0), spot) < dist(this.P(x, t0), spot) ? y : x));
      const mates = this.attOut.filter((x) => x !== holder);
      // variantes: apoio curto ao lado, passe atrás para o fixo (que entra de frente), ou bloqueio e desmarcação em diagonal
      const variant = r() < 0.45 ? 'curto' : r() < 0.6 ? 'atras' : 'bloqueio';
      const near = mates.length ? mates.reduce((x, y) => (dist(this.P(y, t0), spot) < dist(this.P(x, t0), spot) ? y : x)) : holder;
      const back = mates.length ? mates.reduce((x, y) => (this.U(this.P(y, t0)) < this.U(this.P(x, t0)) ? y : x)) : holder;
      const mate = variant === 'atras' ? back : near;
      const sgn = Math.sign(spot.y);
      // a bola está onde saiu: quem repõe vai buscá-la, pousa-a sobre a linha e bate
      this.balls.push({ k: 'still', t0, at: { x: sb.x, y: sb.y, z: 0.11 } });
      this.key(holder, -1.5, { x: sb.x, y: sb.y }, true);
      this.balls.push({ k: 'hands', t0: -1.5, id: holder, z: 0.95 });
      this.key(holder, -0.9, { x: spot.x - this.dirA * 0.3, y: spot.y + sgn * 0.2 }, true);
      this.balls.push({ k: 'still', t0: -0.85, at: { x: spot.x, y: spot.y, z: 0.11 } });
      const recv = variant === 'atras' ? { x: clamp(spot.x - this.dirA * 6, -17, 17), y: spot.y - sgn * 5.5 }
        : variant === 'bloqueio' ? { x: clamp(spot.x + this.dirA * 3.5, -17, 17), y: spot.y - sgn * 4.5 }
          : { x: clamp(spot.x - this.dirA * 2.5, -17, 17), y: spot.y - sgn * 3.8 };
      if (variant === 'bloqueio') {
        // um colega bloqueia o marcador de quem vai receber, que sai em diagonal para a frente
        const scr = mates.find((x) => x !== mate);
        if (scr) { this.key(scr, -0.6, { x: recv.x - this.dirA * 2.2, y: recv.y + sgn * 1.2 }, true); this.act(scr, 'screen', -0.9, 0.3, { face: mate }); }
        this.key(mate, -1.0, { x: recv.x - this.dirA * 3, y: recv.y + sgn * 1.5 }, true);
      }
      this.key(mate, -0.1, recv, true);
      this.act(holder, 'pass', -0.35, 0.05, { face: mate });
      this.balls.push({ k: 'pass', t0: -0.1, t1: 0.45, from: holder, to: mate, lift: 0.05 });
      this.balls.push({ k: 'foot', t0: 0.45, id: mate });
      this.phase(t0, 'Pontapé de linha lateral');
      this.label(-0.6, `Pontapé de linha lateral: ${this.nm(holder)}`);
      this.progFn = this.makeProg(0, clamp((this.U(spot) - 12) / 16, 0, 1));
      holder = mate;
    } else {
      const h0 = start?.holder && this.attOut.concat(this.gkA ? [this.gkA] : []).includes(start.holder) ? start.holder : null;
      const near0 = this.nearestOut(sb, t0);
      // quem ganhou a bola (lance anterior) só fica com ela se estiver perto; senão vai o mais próximo
      holder = h0 && dist(this.P(h0, t0), sb) < dist(this.P(near0, t0), sb) + 2.5 ? h0 : near0;
      if (!start?.pos) this.tr.get(holder)!.set(t0, sb, true);
      const hp0 = this.P(holder, t0);
      const outside = Math.abs(sb.x) > 20.2 || Math.abs(sb.y) > 10.2;
      if (start && outside) {
        // bola fora do campo (ex.: remate para fora contra 5x4, sem GR na baliza): um apanha-bolas devolve-a logo
        const hq = this.P(holder, t0 + 1);
        this.balls.push({ k: 'fly', t0, t1: t0 + 0.9, from: { x: sb.x, y: sb.y, z: 0.6 }, b: holder, lift: 0.6 });
        this.balls.push({ k: 'foot', t0: t0 + 0.9, id: holder });
        void hq;
        this.label(0.1, `${this.nm(holder)} recebe a bola`);
      } else if (start && Math.hypot(hp0.x - sb.x, hp0.y - sb.y) > 1.2) {
        // bola solta: o mais próximo vai buscá-la, a correr (o tempo que for preciso)
        const tg = clamp(t0 + Math.hypot(hp0.x - sb.x, hp0.y - sb.y) / 6, 0.5, Math.max(0.5, this.D - 0.5));
        this.balls.push({ k: 'still', t0, at: { x: sb.x, y: sb.y, z: 0.11 } });
        this.key(holder, tg, sb);
        this.balls.push({ k: 'foot', t0: tg, id: holder });
        this.label(0.2, `${this.nm(holder)} ganha a bola`);
      } else this.balls.push({ k: 'foot', t0, id: holder });
      const u0 = this.U(sb);
      this.progFn = this.makeProg(0, clamp((u0 - 12) / 16, 0, 1));
      this.phase(t0, p.counter ? 'Transição ofensiva' : 'Recuperação de bola');
      this.turnover = !!start;
    }

    // ---- como acaba a posse ----
    const first = p.actions[0];
    const ending: Ending =
      first?.type === 'foul' ? { kind: 'foul', foul: first }
        : first?.type === 'lost' ? { kind: 'lost', lost: first }
          : first?.type === 'shot' && first.side === att ? { kind: 'shot', shot: first }
            : { kind: 'none' };
    const counter = p.counter || ending.shot?.kind === 'counter';
    this.isCounter = counter;

    // ---- jogo corrido ----
    let T = 0;
    const gkStyle = tactics[att].gkStyle ?? 'classico';
    if (holder === this.gkA && gkStyle !== 'classico' && D > 7 && r() < (gkStyle === 'avancado' ? 0.3 : 0.12)) {
      // GR que joga com os pés: pousa a bola e sai a conduzir antes de passar
      const g0 = this.P(holder, 0);
      // o GR atacante conduz até ao meio-campo (como o GR do Benfica no clipe da Liga dos Campeões)
      const carryTo = this.A(gkStyle === 'avancado' ? 15 + r() * 4.5 : 7 + r() * 2, clamp(g0.y + (r() - 0.5) * 6, -5, 5));
      this.balls.push({ k: 'foot', t0: 0.3, id: holder });
      const tc = Math.min(D - 1.2, 0.3 + dist(g0, carryTo) / 4.6); // condução a ~4,6 m/s
      this.key(holder, tc, carryTo);
      this.attKeysAt(tc, new Set([holder]));
      this.label(0.4, `${this.nm(holder)} sai a jogar com os pés`);
      const to = this.attOut.reduce((x, y) => (this.U(this.P(y, tc)) > this.U(this.P(x, tc)) ? y : x));
      this.act(holder, 'pass', tc - 0.05, tc + 0.3, { face: to });
      this.pass(holder, to, tc + 0.1, tc + 0.7);
      this.key(holder, tc + 2.2, this.A(gkStyle === 'avancado' ? 9 : 5, 0));
      holder = to;
      T = tc + 0.7;
    } else if (holder === this.gkA) {
      // o GR repõe com a mão ou com o pé para um colega aberto
      // reposição (máx. 4 s, à mão): procura o colega mais livre; perto rola a bola, longe lança
      const tl = Math.min(1.1 + r() * 0.8, D * 0.3);
      this.attKeysAt(tl + 0.4, new Set([this.gkA!]));
      const gp0 = this.P(holder, tl);
      const freeOf = (id: string) => {
        const q = this.P(id, tl + 0.4);
        const md = Math.min(9, ...this.defOut.map((d) => dist(this.P(d, tl), q)));
        return Math.min(md, 5) - Math.max(0, dist(gp0, q) - 14) * 0.25 + r() * 0.8;
      };
      const to = this.attOut.reduce((x, y) => (freeOf(y) > freeOf(x) ? y : x));
      const td = dist(gp0, this.P(to, tl + 0.4));
      const tf = Math.min(clamp(td < 9 ? td / 9 : 0.25 + td / 15, 0.35, 1.8), Math.max(0.35, D - tl - 0.4));
      this.act(holder, 'throw', tl - 0.45, tl + 0.1, { face: to });
      this.pass(holder, to, tl, tl + tf, td < 9 ? 0.03 : 0.12 + td * 0.03);
      this.label(tl, `${this.nm(holder)} repõe a bola`);
      holder = to;
      T = tl + tf;
    } else if (kind === 'kickoff') {
      const back = this.attOut.find((id) => id !== holder && this.slot.get(id) === 0) ?? this.attOut.find((id) => id !== holder)!;
      this.act(holder, 'pass', -0.1, 0.25, { face: back });
      this.pass(holder, back, 0.15, 0.8, 0.05);
      this.attKeysAt(1.4, new Set());
      holder = back;
      T = 0.8;
    } else if (kind === 'lateral') T = 0.5;
    this.phase(Math.max(0, T), counter && p.counter ? 'Contra-ataque' : this.sys === '5x4' ? 'Ataque 5x4 (guarda-redes avançado)' : `Ataque organizado (${this.sys})`);

    const shotA = ending.shot;
    const gkRun = !!(shotA?.gkRun && this.gkA && shotA.shooter === this.gkA);
    const shooter = shotA && (this.attOut.includes(shotA.shooter!) || gkRun) ? shotA.shooter! : undefined;
    const assist = shotA?.assist && this.attOut.includes(shotA.assist) && shotA.assist !== shooter ? shotA.assist : undefined;
    const tS = D - 0.25; // instante do remate
    const finishLen = gkRun ? 4.4 : counter ? 4.6 : 2.6;
    // no contra-ataque com assistência, quem conduz é o assistente (para o passe lateral final)
    const needed = ending.kind === 'shot' && shooter ? (counter ? assist ?? holder : assist ?? shooter) : ending.kind === 'foul' && this.attOut.includes(ending.foul!.shooter!) ? ending.foul!.shooter! : undefined;
    const tFin = ending.kind === 'shot' && shooter ? Math.max(T + 0.3, tS - finishLen) : ending.kind === 'foul' ? D - 1.5 : ending.kind === 'lost' ? D - 1.1 : D;
    holder = this.beats(T, tFin, holder, gkRun ? undefined : counter ? (assist ? needed : undefined) : needed);
    T = Math.max(T, tFin);

    // ---- finalização / perda / falta ----
    let afterT = D;
    if (ending.kind === 'shot' && shooter) {
      if (gkRun) this.gkCarry(holder, T, tS, shooter);
      else if (counter) this.counterRun(holder, T, tS, shooter, assist, shotA!);
      else this.finish(holder, T, tS, shooter, assist, shotA!);
      // o remate parte de onde o rematador consegue chegar (posses curtas: não chega à zona de remate planeada)
      this.tr.get(shooter)?.limit(VMAX * 0.85);
      this.spillNext = p.actions[1]?.kind === 'rebound' && p.actions[1].side === att;
      afterT = this.shot(tS, shooter, shotA!, this.dirA);
    } else if (ending.kind === 'lost') {
      this.loseBall(holder, T, D, ending.lost!.other);
      if (this.outAt) afterT = D + 0.7;
    } else if (ending.kind === 'foul') {
      this.fouled(holder, T, D, ending.foul!);
      afterT = D + 0.6;
    } else {
      this.attKeysAt(D, new Set([holder]));
    }

    // ---- defesa (depois de o ataque estar definido) ----
    this.sortBalls();
    for (const id of this.attOut) if (id !== this.gkA) this.tr.get(id)?.liven(this.r, 0, D - 0.3, 0.8, (t) => this.isFixed(id, t) || this.holderAt(t) === id);
    for (const id of this.tr.keys()) if (this.sideOf.get(id) === att) {
      const profile = id !== this.gkA ? this.movement.get(id) : undefined; // física individual em todos os sistemas
      this.tr.get(id)!.limit(VMAX);
      this.tr.get(id)!.bake(-this.lead, D + 1, VMAX, AMAX, profile?.accelerationFactor, profile?.agilityFactor);
    }
    this.sortBalls();
    for (const f of this.later) f();
    this.later = [];
    this.defend(0.35, Math.min(D, afterT));
    for (const f of this.post) f();
    this.escapeMarkers(D);

    // ---- bolas paradas e o que vem a seguir (relógio parado) ----
    T = this.restarts(Math.max(D, afterT), ending);
    this.sortBalls();
    for (const f of this.later) f();
    for (const tr of this.tr.values()) tr.limit(VMAX * 1.1);
    const gks = new Set([this.p.onCourt[0][0], this.p.onCourt[1][0]]);
    for (const [id, tr] of this.tr) {
      const goalkeeper = gks.has(id);
      const profile = !goalkeeper ? this.movement.get(id) : undefined; // atacantes e defensores (pressão, recuperação)
      tr.bake(-this.lead, T + 0.5, goalkeeper ? VMAX * 1.1 : VMAX,
        goalkeeper ? AMAX * 2.2 : this.sideOf.get(id) === att ? AMAX : AMAX * 1.3,
        profile?.accelerationFactor, profile?.agilityFactor);
    }

    this.fixPassSpeeds();
    this.holderCache = new Map(); // a partir daqui a bola já não muda: quem tem a bola pode ficar em memória
    this.breathe();
    for (let pass = 0; pass < 3; pass++) this.separate(T + 0.5);
    this.keepInside();
    this.finalT = T;
    this.extra = Math.max(0, T - D);

    // ---- estado final (ponto de partida da posse seguinte) ----
    const pos: Record<string, P2> = {};
    for (const [id, tr] of this.tr) pos[id] = tr.at(T);
    const goal = this.lastGoal;
    const ballEnd = this.ballAt(T);
    const h = this.holderAt(T);
    this.end = goal ? { holder: null, ball: ballEnd, pos, kind: 'kickoff' }
      : this.outAt && ending.kind === 'lost' ? { holder: null, ball: this.outAt, pos, kind: 'lateral' }
      : h && this.gkOfAny(h) && this.balls[this.balls.length - 1].k === 'hands' ? { holder: h, ball: ballEnd, pos, kind: 'gk' }
        : this.endGk ? { holder: this.endGk, ball: ballEnd, pos, kind: 'gk' }
          : { holder: h, ball: ballEnd, pos, kind: 'live' };
  }

  private lastGoal = false;
  private turnover = false; // a posse começou com uma perda de bola do adversário (transição)
  private accelNext = false; // depois de uma jogada que ganha espaço, o lance seguinte é rápido
  private isCounter = false; // em transição: quem tem a bola e espaço à frente conduz para a baliza (nunca passa para trás)
  private spillNext = false; // a defesa seguinte dá ressalto (recarga a seguir)
  private outAt: P2 | null = null; // bola fora pela linha lateral (pontapé de linha lateral a seguir)
  private endGk: string | null = null;

  get attackDirection() { return this.dirA; }
  get total() { return this.lead + this.duration + this.extra; }
  /** Tempo de jogo decorrido (o relógio não anda na preparação nem nas bolas paradas). */
  clockAt(ct: number) { return clamp(ct - this.lead, 0, this.duration); }
  /** Momentos que merecem ser vistos devagar: a finalização e as bolas paradas. */
  isKey(ct: number) { const t = ct - this.lead; return t > this.D - 4.5 && (this.shotTimes.length > 0 || t > this.D); }
  private shotTimes: number[] = [];
  /** Instante (na escala de at) do remate que deu golo, para a repetição. */
  private bigSave: number | null = null; // instante de uma grande defesa (voo, espargata, pé, cruz), para a repetição
  get bigSaveCt(): number | null { return this.bigSave != null ? this.lead + this.bigSave : null; }
  get goalShotCt(): number | null { return this.lastGoal && this.shotTimes.length ? this.lead + this.shotTimes[this.shotTimes.length - 1] : null; }

  // ---------- utilidades ----------
  /** Corpos não se atravessam: depois do bake, afasta pares demasiado próximos (colegas 0,75 m, adversários 0,5 m =
   *  ombro com ombro), com a correção suavizada no tempo para não tremer. Quem tem a bola, o GR em ação e jogadores
   *  em contacto voluntário (carga, desarme, queda, festejo, confronto) cedem menos ou nada. */
  private separate(tEnd: number) {
    const ids = [...this.tr.keys()].filter((id) => this.tr.get(id)!.baked);
    if (ids.length < 2) return;
    const t0 = this.tr.get(ids[0])!.baked!.t0;
    const n = Math.min(...ids.map((id) => this.tr.get(id)!.baked!.xs.length));
    if (ids.some((id) => this.tr.get(id)!.baked!.t0 !== t0)) return;
    const contact = new Set<ActKind>(['shove', 'tackle', 'fall', 'celebrate', 'shield', 'block', 'screen', 'dive', 'splits', 'spread', 'footsave', 'poke']);
    // janelas de contacto voluntário por jogador, calculadas uma vez (o teste por par e por instante era o mais pesado)
    const busyArr = new Map<string, Uint8Array>();
    for (const a of this.acts) {
      if (!contact.has(a.kind)) continue;
      let arr = busyArr.get(a.id);
      if (!arr) { arr = new Uint8Array(n); busyArr.set(a.id, arr); }
      const i0 = Math.max(0, Math.floor((a.t0 - 0.2 - t0) / BAKE_DT)), i1 = Math.min(n - 1, Math.ceil((a.t1 + 0.2 - t0) / BAKE_DT));
      for (let i = i0; i <= i1; i++) arr[i] = 1;
    }
    const busyAt = (id: string, i: number) => busyArr.get(id)?.[i] === 1;
    const ox = ids.map(() => new Float32Array(n)), oy = ids.map(() => new Float32Array(n));
    const B = ids.map((id) => this.tr.get(id)!.baked!);
    const side = ids.map((id) => this.sideOf.get(id) ?? (REFS.includes(id) ? 9 : 8));
    const gk = ids.map((id) => this.gkOfAny(id));
    for (let i = 0; i < n; i++) {
      const t = t0 + i * BAKE_DT;
      if (t > tEnd) break;
      let holder: string | null | undefined;
      for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
        const ax = B[a].xs[i] + ox[a][i], ay = B[a].ys[i] + oy[a][i], bx = B[b].xs[i] + ox[b][i], by = B[b].ys[i] + oy[b][i];
        let dx = bx - ax, dy = by - ay;
        const d2 = dx * dx + dy * dy;
        if (d2 >= 0.5625) continue; // 0,75 m: mais longe do que qualquer mínimo
        const same = side[a] === side[b];
        const minD = same ? 0.75 : gk[a] || gk[b] ? 0.6 : 0.5;
        const d = Math.sqrt(d2);
        if (d >= minD) continue;
        if (!same && (busyAt(ids[a], i) || busyAt(ids[b], i))) continue; // contacto voluntário entre adversários
        if (d < 1e-3) { dx = 1; dy = 0; } else { dx /= d; dy /= d; }
        const push = minD - d;
        if (holder === undefined) holder = this.holderAt(t);
        // quem tem a bola ou está numa ação de GR não é empurrado
        let wa = 0.5, wb = 0.5;
        const fa = ids[a] === holder || (gk[a] && busyAt(ids[a], i)), fb = ids[b] === holder || (gk[b] && busyAt(ids[b], i));
        if (fa && !fb) { wa = 0; wb = 1; } else if (fb && !fa) { wa = 1; wb = 0; }
        ox[a][i] -= dx * push * wa; oy[a][i] -= dy * push * wa;
        ox[b][i] += dx * push * wb; oy[b][i] += dy * push * wb;
      }
    }
    // passes: os adversários de quem passa não ficam em cima da trajetória da bola (se lá estivessem tinham cortado);
    // cedem para o lado, como quem chega tarde ao corte
    const passes = this.balls.filter((b): b is Extract<BSeg, { k: 'pass' }> => b.k === 'pass');
    for (const ps of passes) {
      const ia0 = Math.max(0, Math.ceil((ps.t0 + (ps.t1 - ps.t0) * 0.15 - t0) / BAKE_DT));
      const ia1 = Math.min(n - 1, Math.floor((ps.t1 - (ps.t1 - ps.t0) * 0.12 - t0) / BAKE_DT));
      const ps0 = this.sideOf.get(ps.from);
      for (let i = ia0; i <= ia1; i++) {
        const b = this.ballAt(t0 + i * BAKE_DT);
        if (b.z > 1) continue;
        for (let k = 0; k < ids.length; k++) {
          if (side[k] === ps0 || side[k] > 1 || ids[k] === ps.to) continue;
          const x = B[k].xs[i] + ox[k][i], y = B[k].ys[i] + oy[k][i];
          let dx = x - b.x, dy = y - b.y; const d = Math.hypot(dx, dy);
          if (d >= 0.65) continue;
          // afasta na perpendicular à trajetória (para o lado em que já está)
          const q = this.ballAt(t0 + (i + 1) * BAKE_DT); let tx = q.x - b.x, ty = q.y - b.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
          let px = -ty, py = tx; if (px * dx + py * dy < 0) { px = -px; py = -py; }
          void dx; void dy;
          ox[k][i] += px * (0.65 - d); oy[k][i] += py * (0.65 - d);
        }
      }
    }
    // suaviza a correção: alarga-a no tempo (máximo em ±0,25 s) e depois faz a média (±0,25 s): desvio contínuo,
    // como quem contorna o colega, sem saltos; nunca empurra ninguém para fora do campo
    const W = 8;
    // máximo numa janela deslizante (fila monótona, O(n)): mesmo resultado que procurar em cada janela
    const dil = (o: Float32Array, o2: Float32Array) => {
      const rx = new Float32Array(n), ry = new Float32Array(n);
      const mag = new Float32Array(n);
      for (let i = 0; i < n; i++) mag[i] = Math.hypot(o[i], o2[i]);
      const q = new Int32Array(n); let h = 0, tl = 0, j = 0;
      for (let i = 0; i < n; i++) {
        const hi = Math.min(n - 1, i + W);
        for (; j <= hi; j++) { while (tl > h && mag[q[tl - 1]] <= mag[j]) tl--; q[tl++] = j; }
        while (q[h] < i - W) h++;
        const m = q[h];
        if (mag[m] > 0) { rx[i] = o[m]; ry[i] = o2[m]; }
      }
      return [rx, ry] as const;
    };
    const box = (o: Float32Array) => {
      const r = new Float32Array(n); let acc = 0;
      const pre = new Float64Array(n + 1); for (let i = 0; i < n; i++) pre[i + 1] = pre[i] + o[i];
      for (let i = 0; i < n; i++) { const lo = Math.max(0, i - W), hi = Math.min(n - 1, i + W); r[i] = (pre[hi + 1] - pre[lo]) / (hi - lo + 1); }
      void acc; return r;
    };
    for (let k = 0; k < ids.length; k++) {
      if (!ox[k].some((v) => v !== 0) && !oy[k].some((v) => v !== 0)) continue; // sem correção
      const [dx, dy] = dil(ox[k], oy[k]);
      const sx = box(dx), sy = box(dy);
      const ref = side[k] === 9;
      for (let i = 0; i < n; i++) {
        const x = B[k].xs[i], y = B[k].ys[i];
        // contínuo: aplica sempre a correção, sem nunca empurrar para mais longe do campo do que já estava
        const mx = Math.max(20, Math.abs(x)), my = Math.max(10, Math.abs(y));
        B[k].xs[i] = clamp(x + sx[i], -mx, mx);
        B[k].ys[i] = ref ? y : clamp(y + sy[i], -my, my);
      }
    }
  }

  /** Ninguém fica imóvel muito tempo perto do lance: depois de ~2,2 s parado com a bola a menos de 9 m, o jogador faz
   *  pequenos ajustes (passo de ~0,4 m para o lado ou para dar linha, e volta), como se vê nos jogos reais. */
  private breathe() {
    for (const [id, tr] of this.tr) {
      if (!this.sideOf.has(id) || this.gkOfAny(id) || !tr.baked) continue;
      const B = tr.baked;
      const n = B.xs.length;
      const X = Float32Array.from(B.xs), Y = Float32Array.from(B.ys); // trajetória original (para medir a imobilidade)
      let still = 0, k = 0;
      for (let i = 1; i < n; i++) {
        const t = B.t0 + i * BAKE_DT;
        if (t < 0 || t > this.D) { still = 0; continue; }
        const v = Math.hypot(X[i] - X[i - 1], Y[i] - Y[i - 1]) / BAKE_DT;
        const ball = this.ballAt(t);
        const near = Math.hypot(ball.x - X[i], ball.y - Y[i]) < 9;
        if (v < 0.35 && near && this.holderAt(t) !== id && !this.isFixed(id, t)) still += BAKE_DT; else { still = 0; continue; }
        if (still < 2.2) continue;
        // ajuste: 1,6 s de ida e volta, perpendicular à linha para a bola (alternando o lado)
        const ph = (still - 2.2) / 1.6;
        if (ph >= 1) { still = 1.4; k++; continue; }
        const dx = ball.x - X[i], dy = ball.y - Y[i], dl = Math.hypot(dx, dy) || 1;
        const sgn = (id.charCodeAt(id.length - 1) + k) % 2 ? 1 : -1;
        const amp = 0.42 * Math.sin(ph * Math.PI);
        B.xs[i] = X[i] + (-dy / dl) * amp * sgn; B.ys[i] = Y[i] + (dx / dl) * amp * sgn;
      }
    }
  }

  /** Passes nunca mais rápidos do que ~22 m/s (~80 km/h, passe forte de futsal): se o recetor se afastou do previsto,
   *  quem passa solta a bola mais cedo (enquanto ainda a tinha no pé), em vez de a bola "voar" a velocidade impossível. */
  private fixPassSpeeds() {
    for (let i = 1; i < this.balls.length; i++) {
      const sg = this.balls[i];
      if (sg.k !== 'pass') continue;
      const prev = this.balls[i - 1];
      const d = dist(this.P(sg.from, sg.t0), this.P(sg.to, sg.t1));
      if (d / Math.max(0.01, sg.t1 - sg.t0) <= 22) continue;
      const want = sg.t1 - d / 22;
      sg.t0 = Math.max(prev.t0 + 0.15, Math.min(sg.t0, want));
    }
  }

  /** Movimentação sem bola com intenção: o atacante sem bola que fica colado ao defensor (<1,3 m) desmarca-se ~0,9 m
   *  para o espaço (para longe do defensor, a abrir linha para o portador), sem sair do campo. O defensor reage com
   *  atraso, como na realidade, e a linha de passe abre-se. */
  private escapeMarkers(D: number) {
    for (const id of this.attOut) {
      if (id === this.gkA) continue;
      const tr = this.tr.get(id);
      if (!tr) continue;
      for (const k of tr.keys) {
        if (k.hold || k.t < 0.3 || k.t > D - 0.3 || this.isFixed(id, k.t) || this.holderAt(k.t) === id) continue;
        // espaço: colegas sem bola a menos de 3,2 m afastam-se (largura e profundidade, sem se amontoarem perto da bola)
        let cd = 99, cq: P2 | null = null;
        for (const m of this.attOut) { if (m === id || m === this.gkA) continue; const q = this.P(m, k.t); const dd = Math.hypot(q.x - k.x, q.y - k.y); if (dd < cd) { cd = dd; cq = q; } }
        if (cq && cd < 3.2) {
          let sx = k.x - cq.x, sy = k.y - cq.y; const sl = Math.hypot(sx, sy) || 1; sx /= sl; sy /= sl;
          const push = Math.min(1.4, 3.2 - cd);
          k.x = clamp(k.x + sx * push, -19.5, 19.5); k.y = clamp(k.y + sy * push, -9.6, 9.6);
        }
        let nd = 99, nq: P2 | null = null;
        for (const d of this.defOut) { const q = this.P(d, k.t); const dd = Math.hypot(q.x - k.x, q.y - k.y); if (dd < nd) { nd = dd; nq = q; } }
        if (!nq || nd > 1.3) continue;
        const ball = this.ballAt(k.t);
        // afasta-se do defensor, puxando ligeiramente para o lado de onde está a bola (dar linha)
        let ex = k.x - nq.x, ey = k.y - nq.y; const el = Math.hypot(ex, ey) || 1; ex /= el; ey /= el;
        let bx = ball.x - k.x, by = ball.y - k.y; const bl = Math.hypot(bx, by) || 1; bx /= bl; by /= bl;
        const mx = ex * 0.8 + bx * 0.35, my = ey * 0.8 + by * 0.35, ml = Math.hypot(mx, my) || 1;
        k.x = clamp(k.x + (mx / ml) * 0.9, -19.5, 19.5);
        k.y = clamp(k.y + (my / ml) * 0.9, -9.6, 9.6);
      }
      (tr as unknown as { baked: unknown }).baked = null;
    }
  }

  /** Em jogo corrido nenhum jogador sai da quadra: quem já está dentro fica dentro (linhas laterais e de fundo). */
  private keepInside() {
    for (const [id, tr] of this.tr) {
      const sd = this.sideOf.get(id);
      if (sd === undefined || REFS.includes(id) || !tr.baked) continue;
      const B = tr.baked;
      let inside = false;
      for (let i = 0; i < B.xs.length; i++) {
        const t = B.t0 + i * BAKE_DT;
        if (t < 0 || t > this.D) { inside = false; continue; }
        if (!inside && Math.abs(B.xs[i]) <= 20 && Math.abs(B.ys[i]) <= 10) inside = true;
        // o suplente que entra pode estar fora um instante, mas nunca joga a bola fora da quadra
        if (!inside) {
          const b = this.ballAt(t);
          const ballAct = this.acts.some((a) => a.id === id && (a.kind === 'pass' || a.kind === 'shoot' || a.kind === 'throw') && t >= a.t0 - 0.3 && t <= a.t1);
          const ballSeg = this.balls.some((bs) => (bs.k === 'pass' || bs.k === 'fly') && bs.from === id && t >= bs.t0 - 0.4 && t <= bs.t0 + 0.05);
          if (ballAct || ballSeg || this.holderAt(t) === id || Math.hypot(b.x - B.xs[i], b.y - B.ys[i]) < 1.5) inside = true;
        }
        if (inside) { B.xs[i] = clamp(B.xs[i], -19.9, 19.9); B.ys[i] = clamp(B.ys[i], -9.9, 9.9); }
      }
    }
  }

  private sortBalls() { this.balls = this.balls.map((b, i) => [b, i] as const).sort((x, y) => x[0].t0 - y[0].t0 || x[1] - y[1]).map((x) => x[0]); }
  private nm(id?: string | null) { return id ? this.names[id] ?? '' : ''; }
  private label(t: number, text: string) { this.labels.push({ t, text }); }
  private phase(t: number, text: string) { this.phases.push({ t, text }); }
  private A(u: number, v: number): P2 { return { x: this.dirA * (u - 20), y: v }; }
  private U(p: P2) { return this.dirA * p.x + 20; }
  /** Posição de baliza do GR que defende a baliza em x = gx (±20) contra uma bola em b: na bissetriz do ângulo
   *  dos postes, à profundidade dada (m da linha), mas nunca mais à frente do que a bola (−0,8 m) e sempre entre os
   *  postes (+0,25 m). Com ângulo fechado fica no primeiro poste. */
  private gkSpot(gx: number, b: P2, depth: number): P2 {
    const sg = Math.sign(gx);
    const u1 = { x: gx - b.x, y: -1.5 - b.y }, u2 = { x: gx - b.x, y: 1.5 - b.y };
    const l1 = Math.hypot(u1.x, u1.y) || 1, l2 = Math.hypot(u2.x, u2.y) || 1;
    const bis = { x: u1.x / l1 + u2.x / l2, y: u1.y / l1 + u2.y / l2 };
    const bdist = Math.abs(gx - b.x);
    const d = Math.max(0.25, Math.min(depth, bdist - 0.8));
    const s0 = Math.abs(bis.x) > 0.05 ? (bdist - d) / Math.abs(bis.x) : 0;
    const q = s0 > 0 ? { x: b.x + bis.x * s0, y: b.y + bis.y * s0 } : { x: gx - sg * d, y: Math.sign(b.y) * 1.3 };
    return { x: q.x, y: clamp(q.y, -1.75, 1.75) };
  }
  private P(id: string, t: number): P2 { return this.tr.get(id)?.at(t) ?? { x: 0, y: 0 }; }
  private key(id: string, t: number, p: P2, hold = false) { this.tr.get(id)?.set(t, p, hold); }
  private fix(id: string, t0: number, t1: number) {
    const l = this.fixed.get(id) ?? [];
    l.push([t0, t1]);
    this.fixed.set(id, l);
  }
  private isFixed(id: string, t: number) { return (this.fixed.get(id) ?? []).some(([a, b]) => t >= a && t <= b); }
  private act(id: string, kind: ActKind, t0: number, t1: number, o: { ang?: number; to?: P2; h?: number; face?: string } = {}) {
    this.acts.push({ id, kind, t0, t1, ...o });
  }
  private pass(from: string, to: string, t0: number, t1: number, lift = 0.08) {
    this.balls.push({ k: 'pass', t0, t1, from, to, lift });
    this.balls.push({ k: 'foot', t0: t1, id: to });
  }
  private gkOfAny(id: string) { return id === this.p.onCourt[0][0] || id === this.p.onCourt[1][0]; }
  private nearestOut(b: P2, t: number) {
    let best = this.attOut[0], bd = 1e9;
    for (const id of this.attOut) { const d = dist(this.P(id, t), b); if (d < bd) { bd = d; best = id; } }
    return best;
  }
  private makeProg(t0: number, p0: number) {
    const span = Math.max(3, Math.min(8, (this.D - t0) * 0.5));
    return (t: number) => lerp(p0, 1, ease(clamp((t - t0) / span, 0, 1)));
  }

  /** Posição na estrutura ofensiva (slot), conforme a progressão e o lado da bola. */
  private slotPos(i: number, t: number, bv: number, jitter = 0): P2 {
    const [au, av] = SHAPES[this.sys][i];
    const pr = this.progFn(t);
    const u = lerp(au - 13, au, pr) + (jitter ? (this.r() - 0.5) * jitter : 0);
    const v = av + bv * 0.22 + (jitter ? (this.r() - 0.5) * jitter : 0);
    return this.A(clamp(u, 2, 38), clamp(v, -8.6, 8.6));
  }

  /** Posição de partida em reposições (pontapé de saída, GR) */
  private restPos(id: string, kind: 'kickoff' | 'gk' | 'live', kicker?: string): P2 {
    if (REFS.includes(id)) return { x: id === REFS[0] ? -2 : 2, y: id === REFS[0] ? -10.7 : 10.7 };
    const sd = this.sideOf.get(id)!;
    const isAtt = sd === this.att;
    const gk = id === this.p.onCourt[sd][0] && !this.p.flying[sd];
    if (isAtt) {
      if (gk) return this.A(kind === 'gk' ? 1.4 : 2, 0);
      const i = this.slot.get(id) ?? 0;
      if (kind === 'kickoff') {
        if (id === kicker) return this.A(19.6, 0.3);
        const [au, av] = SHAPES[this.sys][i];
        return this.A(clamp(au - 8, 10, 19), av * 0.9);
      }
      const [au, av] = SHAPES[this.sys][i];
      return this.A(clamp(au - 12, 5, 30), av * (Math.abs(av) > 5 ? 1.08 : 1));
    }
    if (gk || id === this.p.onCourt[sd][0]) return this.A(39, 0);
    const di = Math.max(0, this.defOut.indexOf(id));
    const [bu, bv] = BLOCK[this.tactics[sd].pressure][di % 4];
    return kind === 'kickoff' ? this.A(Math.max(23.4, bu + 3), bv) : this.A(bu, bv);
  }

  /** Pontos-chave para os atacantes não envolvidos num lance, na estrutura. */
  private attKeysAt(t: number, skip: Set<string>, bv?: number) {
    const b = bv ?? this.ballAt(Math.min(t, this.lastBallT())).y;
    for (const id of this.attOut) if (!skip.has(id)) this.key(id, t, this.slotPos(this.slot.get(id) ?? 0, t, b, 0.4)); // pequena variação (antes 1,6 m: andavam sempre)
    // posição do GR conforme o estilo: clássico perto da baliza, construtor e atacante mais subidos
    const gs = this.tactics[this.att].gkStyle ?? 'classico';
    const gkU = gs === 'avancado' ? lerp(2, 10, this.progFn(t)) : gs === 'construtor' ? lerp(1.6, 6.5, this.progFn(t)) : lerp(1.4, 4.2, this.progFn(t));
    if (this.gkA && !skip.has(this.gkA)) this.key(this.gkA, t, this.A(gkU, clamp(b * (gs === 'classico' ? 0.12 : 0.25), -2, 2)));
  }
  private lastBallT() {
    const s = this.balls[this.balls.length - 1];
    return s ? s.t0 : 0;
  }
  private slotHolder(i: number, except?: string) { return this.attOut.find((id) => this.slot.get(id) === i && id !== except); }

  // ---------- ataque organizado: passes e movimentos ----------
  private beats(T: number, tEnd: number, holder: string, forced?: string): string {
    const r = this.r;
    const tA = this.tactics[this.att];
    // futsal: 1 a 2 toques e passe (~1,2 s com a bola); de vez em quando uma pausa a ler o jogo
    const interval = tA.tempo === 'rapido' ? 1.15 : tA.tempo === 'paciente' ? 1.7 : 1.4;
    while (tEnd - T > 0.9) {
      // ritmo de futsal: circulação paciente na construção, aceleração perto da área; depois de uma jogada que ganha
      // espaço o lance seguinte é mais rápido (1-2 toques); quem decide pior fica mais tempo com a bola
      const hu = this.U(this.P(holder, T));
      const zoneK = hu < 18 ? 1.2 : hu > 28 ? 0.85 : 1;
      const qd = this.au(holder, 'decisoes');
      let len = interval * (0.75 + r() * 0.5) * (r() < 0.12 ? 1.6 : 1) * zoneK * (1.12 - 0.24 * qd) * (this.accelNext ? 0.7 : 1);
      this.accelNext = false;
      len = Math.min(len, 2.4); // nunca muito tempo com a bola: ao fim de ~2,4 s passa (para trás ou para quem se desmarcou)
      if (tEnd - T - len < 0.9) len = tEnd - T;
      const last = T + len >= tEnd - 0.01;
      const want = last && forced && forced !== holder ? forced : undefined;
      holder = this.move(T, len, holder, want);
      T += len;
    }
    if (forced && forced !== holder && tEnd - T > 0.4) holder = this.move(T, tEnd - T, holder, forced);
    else if (tEnd > T) this.attKeysAt(tEnd, new Set([holder]));
    return holder;
  }

  /** Um lance de ataque: escolhe um padrão real conforme o sistema e executa-o. */
  private move(T: number, len: number, holder: string, forced?: string): string {
    const r = this.r;
    const sys = this.sys;
    const tA = this.tactics[this.att];
    const hs = this.slot.get(holder);
    const others = this.attOut.filter((x) => x !== holder);
    if (this.isCounter && !forced && hs !== undefined && this.U(this.P(holder, T)) >= 27) {
      // o contra-ataque chegou à zona de finalização sem remate: a equipa organiza o ataque (circulação e jogadas
      // do sistema), em vez de o portador ficar parado a proteger a bola à espera
      this.isCounter = false;
      this.phase(T, `Ataque organizado (${this.sys})`);
    }
    if (this.isCounter && !forced && hs !== undefined) {
      // contra-ataque: conduz em velocidade para a baliza, os colegas acompanham pelos corredores
      const hp0 = this.P(holder, T);
      const go = this.A(Math.min(this.U(hp0) + len * 5.2, 29), hp0.y * 0.75);
      this.key(holder, T + len, go);
      this.attKeysAt(T + len, new Set([holder]), go.y);
      return holder;
    }
    if (hs === undefined || !others.length) {
      // GR com a bola ou jogador sozinho: passe simples
      const to = forced ?? others[0] ?? holder;
      if (to !== holder) { this.act(holder, 'pass', T + len - 0.75, T + len - 0.4, { face: to }); this.pass(holder, to, T + len - 0.55, T + len); }
      this.attKeysAt(T + len, new Set([holder]));
      return to;
    }
    const hp = this.P(holder, T);
    const sideOfBall = hp.y >= 0 ? 1 : -1;
    const fixoLike = (sys === '3-1' || sys === '1-2-1') && hs === 0;
    const backLike = (sys === '4-0' || sys === '2-2') && (hs === 0 || hs === 3);
    const pivo = sys === '3-1' || sys === '1-2-1' ? this.slotHolder(3) : undefined;
    type Opt = [string, number];
    const opts: Opt[] = [['circ', tA.tempo === 'paciente' ? 3 : 2]];
    if (len >= 1.2) {
      if (fixoLike) opts.push(['paralela', 2], ['diagonal', 1.6]);
      if ((sys === '3-1' || sys === '1-2-1') && hs !== 3 && pivo) opts.push(['pivo', sys === '3-1' ? 1.3 : 0.8]);
      if (backLike) opts.push(['passaCorta', sys === '4-0' ? 3.5 : 1.6]);
      if (sys === '2-2' && hs !== undefined) opts.push(['cruzamento', 1.4]);
      if (len >= 1.6) opts.push(['bloqueio', sys === '4-0' ? 0.9 : 0.7], ['drible', tA.tempo === 'rapido' ? 0.45 : 0.3]);
      if (sys === '5x4') opts.push(['inversao', 2.5], ['diagonalCurta', 2]);
      // falso pivô: o pivô sai da área para receber e o ala ataca o espaço nas costas
      if ((sys === '3-1' || sys === '1-2-1') && hs !== 3 && pivo && len >= 1.5) opts.push(['falsoPivo', 1.1]);
    }
    // saída de pressão: contra pressão alta, no próprio meio-campo, a bola volta ao GR e sai pelo lado contrário
    const oppPress = this.tactics[1 - this.att].pressure;
    // ataque à zona: o ala do lado contrário faz o movimento em "U" por trás de quem tem a bola e aparece do lado da bola
    if (len >= 1.6 && others.length >= 2) opts.push(['emU', this.tactics[1 - this.att].marking === 'zona' ? 0.9 : 0.35]);
    if (len >= 2 && this.U(hp) < 20 && pivo) opts.push(['cortina', oppPress === 'alta' ? 2 : 0.6]);
    if (this.gkA && this.U(hp) < 17 && len >= 1.5) opts.push(['saidaGR', oppPress === 'alta' ? 3 : oppPress === 'media' ? 0.8 : 0.2]);
    // leitura do jogo: a escolha depende de como o adversário defende, da pressão, do sistema e da inteligência de
    // quem tem a bola (decisões + visão). Contra individual ganham os bloqueios e as mudanças de ritmo; contra zona
    // as inversões, o pivô e o "U"; contra pressão alta o jogo direto (diagonal, pivô) e a saída pelo GR; contra bloco
    // baixo a circulação paciente e o 1x1. Quem lê pior arrisca menos (mais circulação segura)
    const oppMark = this.tactics[1 - this.att].marking;
    const q = (this.au(holder, 'decisoes') + this.au(holder, 'visao')) / 2;
    const MOD: Record<string, number> = {
      bloqueio: oppMark === 'individual' ? 1.9 : oppMark === 'misto' ? 1.3 : 0.8,
      cortina: oppMark === 'individual' ? 1.5 : 1,
      paralela: oppMark === 'individual' ? 1.25 : 1,
      emU: oppMark === 'zona' ? 1.4 : 1,
      pivo: (oppMark === 'zona' ? 1.25 : 1) * (oppPress === 'alta' ? 1.3 : 1),
      diagonal: oppPress === 'alta' ? 1.4 : 1,
      drible: oppPress === 'baixa' ? 1.5 : 1,
      circ: (oppPress === 'baixa' ? 1.3 : 1) * (1.3 - 0.6 * q),
    };
    for (const o of opts) { o[1] *= MOD[o[0]] ?? 1; if (o[0] !== 'circ') o[1] *= 0.7 + 0.6 * q; }
    let pick = r() * opts.reduce((a, o) => a + o[1], 0);
    let mv = opts[0][0];
    for (const [k, w] of opts) { pick -= w; if (pick <= 0) { mv = k; break; } }
    if (forced) {
      // o recetor está decidido: usa um padrão que o permita
      const fs = this.slot.get(forced);
      if (mv === 'pivo' && fs !== 3) mv = 'circ';
      if ((mv === 'paralela' || mv === 'diagonal') && (fs !== 1 && fs !== 2)) mv = 'circ';
      if (mv === 'bloqueio' || mv === 'drible' || mv === 'saidaGR') mv = 'circ';
      if (mv === 'falsoPivo' && fs !== 3) mv = 'circ';
      if (mv === 'emU' || mv === 'diagonalCurta' || mv === 'cortina') mv = 'circ';
      if (mv === 'passaCorta' && fs !== (hs === 0 ? 1 : 2)) mv = 'circ';
    }
    // jogada que ganha espaço: o lance seguinte acelera (1-2 toques)
    this.accelNext = mv !== 'circ' && r() < 0.6;

    const flightOf = (a: P2, b: P2) => clamp(dist(a, b) / 12, 0.3, 0.9);
    const passTo = (to: string, toSpot: P2, lift = 0.08) => {
      const fl = flightOf(hp, toSpot);
      const tp = T + len - fl;
      this.act(holder, 'pass', tp - 0.2, tp + 0.15, { face: to });
      this.pass(holder, to, tp, T + len, lift);
    };
    const carry = (to: P2) => this.key(holder, T + len * 0.55, to);
    const tEnd = T + len;

    if (mv === 'paralela' || mv === 'diagonal') {
      const s = r() < 0.5 ? -1 : 1;
      const alaSlot = s < 0 ? 1 : 2;
      const ala = this.slotHolder(alaSlot) ?? others[0];
      const opp = this.slotHolder(s < 0 ? 2 : 1);
      const recv = forced ?? ala;
      const spot = this.slotPos(this.slot.get(recv) ?? alaSlot, tEnd, s * 4);
      carry(this.A(this.U(hp) + 1.2, hp.y * 0.6 + s * 1.2));
      passTo(recv, spot);
      this.key(recv, tEnd, spot);
      if (mv === 'paralela') {
        // o fixo segue pela linha, por fora do ala; o ala fecha por dentro
        const run = this.A(this.U(spot) + 5, s * 8.6);
        this.key(holder, tEnd + 0.6, run);
        this.act(holder, 'run', T + len * 0.6, tEnd + 0.8, { to: run });
        this.slot.set(holder, alaSlot);
        this.slot.set(recv, 0);
        this.label(T + len * 0.6, `Paralela de ${this.nm(holder)}`);
      } else {
        // diagonal: o fixo corta para o lado contrário, o outro ala recua para fixo
        const run = this.A(this.U(spot) + 4, -s * 4.5);
        this.key(holder, tEnd + 0.6, run);
        this.act(holder, 'run', T + len * 0.6, tEnd + 0.9, { to: run });
        this.slot.set(holder, s < 0 ? 2 : 1);
        if (opp) { this.slot.set(opp, 0); this.key(opp, tEnd + 0.4, this.slotPos(0, tEnd, s * 4)); }
        this.slot.set(recv, alaSlot);
        this.label(T + len * 0.6, `Diagonal de ${this.nm(holder)}`);
      }
      this.attKeysAt(tEnd, new Set([holder, recv, ...(opp && mv === 'diagonal' ? [opp] : [])]), s * 4);
      return recv;
    }

    if (mv === 'pivo' && pivo) {
      // bola no pivô de costas; quem passa faz o corte
      const s = sideOfBall;
      const spot = this.A(clamp(this.U(this.slotPos(3, tEnd, 0)) - 1.5, 26, 34), s * 2.2);
      this.key(pivo, T + len * 0.5, this.A(this.U(spot) + 0.8, s * 1.0));
      this.key(pivo, tEnd, spot);
      this.act(pivo, 'run', T, tEnd, { to: spot });
      if (r() < 0.7) this.act(pivo, 'shield', tEnd, tEnd + 1.0, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 }); // de costas, a proteger; às vezes recebe já orientado
      passTo(pivo, spot);
      const cut = this.A(clamp(this.U(hp) + 6, 24, 34), s * 3.5);
      this.key(holder, tEnd + 0.7, cut);
      this.act(holder, 'run', tEnd - 0.3, tEnd + 0.8, { to: cut });
      this.label(tEnd - 0.4, `Bola no pivô (${this.nm(pivo)}), corte de ${this.nm(holder)}`);
      this.attKeysAt(tEnd, new Set([holder, pivo]), s * 2);
      return pivo;
    }

    if (mv === 'passaCorta' || mv === 'cruzamento' || mv === 'inversao') {
      const s = hs === 0 || hs === 1 ? -1 : 1;
      if (mv === 'passaCorta') {
        // 4-0: passa para o ala do mesmo lado e corta por dentro até ao lado contrário (rotação)
        const wideSlot = s < 0 ? 1 : 2, oppWide = s < 0 ? 2 : 1, oppBack = s < 0 ? 3 : 0;
        const recv = forced ?? this.slotHolder(wideSlot) ?? others[0];
        const spot = this.slotPos(this.slot.get(recv) ?? wideSlot, tEnd, s * 4);
        passTo(recv, spot);
        this.key(recv, tEnd, spot);
        const mid = this.A(clamp(this.U(spot) + 4, 20, 34), s * 1.5);
        const fin = this.slotPos(oppWide, tEnd + 1.6, s * 4);
        this.key(holder, tEnd + 0.5, mid);
        this.key(holder, tEnd + 1.6, fin);
        this.act(holder, 'run', tEnd - 0.2, tEnd + 1.4, { to: mid });
        const pw = this.slotHolder(oppWide), pb = this.slotHolder(oppBack);
        if (pw && pw !== recv) { this.slot.set(pw, oppBack); this.key(pw, tEnd + 1.2, this.slotPos(oppBack, tEnd + 1.2, s * 4)); }
        if (pb && pb !== recv) { this.slot.set(pb, hs); this.key(pb, tEnd + 1.0, this.slotPos(hs, tEnd + 1.0, s * 4)); }
        this.slot.set(holder, oppWide);
        this.label(tEnd - 0.3, `Passe e corte de ${this.nm(holder)}`);
        this.attKeysAt(tEnd, new Set([holder, recv, ...(pw ? [pw] : []), ...(pb ? [pb] : [])]), s * 4);
        return recv;
      }
      if (mv === 'cruzamento') {
        // 2-2: os dois da frente cruzam-se para arrastar marcações
        const f1 = this.slotHolder(1), f2 = this.slotHolder(2);
        const recv = forced ?? others.find((x) => x !== f1 && x !== f2) ?? others[0];
        const spot = this.slotPos(this.slot.get(recv) ?? 0, tEnd, 0);
        passTo(recv, spot);
        this.key(recv, tEnd, spot);
        if (f1 && f2 && f1 !== recv && f2 !== recv) {
          this.slot.set(f1, 2); this.slot.set(f2, 1);
          this.act(f1, 'run', T, tEnd, { to: this.slotPos(2, tEnd, 0) });
          this.act(f2, 'run', T, tEnd, { to: this.slotPos(1, tEnd, 0) });
          this.label(T + 0.4, 'Cruzamento dos avançados');
        }
        this.attKeysAt(tEnd, new Set([holder, recv]), 0);
        return recv;
      }
      // 5x4: inversão de lado pelo GR avançado / topo
      const recv = forced ?? others.reduce((a, b) => (Math.abs(this.P(b, T).y - hp.y) > Math.abs(this.P(a, T).y - hp.y) ? b : a));
      const spot = this.slotPos(this.slot.get(recv) ?? 0, tEnd, -hp.y * 0.3);
      passTo(recv, spot);
      this.key(recv, tEnd, spot);
      this.label(tEnd - 0.5, 'Inversão do centro do jogo');
      this.attKeysAt(tEnd, new Set([holder, recv]), -hp.y * 0.3);
      return recv;
    }

    if (mv === 'saidaGR' && this.gkA) {
      // passe atrás para o GR (que se oferece fora da baliza) e saída pelo lado contrário, onde um colega
      // baixa para receber longe da pressão
      const gk = this.gkA;
      const s = sideOfBall;
      const gSpot = this.A(3.2, clamp(hp.y * 0.3, -2, 2));
      const t1 = T + len * 0.45;
      this.key(gk, t1, gSpot);
      this.act(holder, 'pass', t1 - 0.45, t1 - 0.1, { face: gk });
      this.pass(holder, gk, t1 - 0.3, t1, 0.03);
      const recv = others.reduce((a, b) => (this.P(b, T).y * -s > this.P(a, T).y * -s ? b : a));
      const rSpot = this.A(clamp(this.U(this.P(recv, T)) - 3, 6, 14), -s * 7.6);
      this.key(recv, tEnd, rSpot);
      this.act(recv, 'run', t1 - 0.4, tEnd, { to: rSpot });
      this.act(gk, 'pass', tEnd - 0.75, tEnd - 0.4, { face: recv });
      this.pass(gk, recv, tEnd - 0.6, tEnd, 0.12);
      // quem passou atrás abre para dar linha
      this.key(holder, tEnd, this.A(clamp(this.U(hp) + 2, 6, 16), s * 7));
      this.label(t1 - 0.3, `Saída de pressão pelo guarda-redes`);
      this.attKeysAt(tEnd, new Set([holder, recv, gk]), -s * 4);
      this.key(gk, tEnd + 1.2, this.A(1.2, 0));
      return recv;
    }

    if (mv === 'diagonalCurta') {
      // 5x4 em pirâmide: passe curto em diagonal para o vão entre as linhas da defesa (o da base vem ao espaço)
      const s = sideOfBall;
      const base = others.filter((x) => this.U(this.P(x, T)) > 31).sort((a, b) => dist(this.P(a, T), hp) - dist(this.P(b, T), hp))[0] ?? others[0];
      const gapSpot = this.A(clamp(this.U(hp) + 3, 29, 33), clamp(hp.y * 0.45, -4.5, 4.5));
      this.key(base, tEnd, gapSpot);
      this.act(base, 'run', T + len * 0.3, tEnd, { to: gapSpot });
      passTo(base, gapSpot, 0.03);
      this.label(tEnd - 0.4, `Diagonal curta para ${this.nm(base)}, entre as linhas`);
      this.attKeysAt(tEnd, new Set([holder, base]), s * 2);
      this.key(base, tEnd + 1, this.slotPos(this.slot.get(base) ?? 3, tEnd + 1, s * 2));
      return base;
    }

    if (mv === 'cortina' && pivo) {
      // saída de pressão: um colega faz a cortina ao marcador, passe atravessado de primeira para o ala,
      // passe de primeira para o pivô e corte de quem iniciou
      const s = sideOfBall;
      const wing = others.filter((x) => x !== pivo).reduce((a, b) => (this.P(b, T).y * -s > this.P(a, T).y * -s ? b : a));
      const curtain = others.find((x) => x !== pivo && x !== wing);
      const t1 = T + len * 0.45;
      if (curtain) {
        const cs = { x: hp.x + this.dirA * 1.6, y: hp.y - s * 1.2 };
        this.key(curtain, t1 - 0.2, cs);
        this.act(curtain, 'screen', t1 - 0.5, t1 + 0.3, { face: holder });
      }
      const wSpot = this.A(clamp(this.U(hp) + 3, 10, 24), -s * 7.6);
      this.key(wing, t1 + 0.5, wSpot);
      this.act(holder, 'pass', t1 - 0.35, t1, { face: wing });
      this.pass(holder, wing, t1 - 0.2, t1 + 0.5, 0.05);
      const pSpot = this.A(33, -s * 1.8);
      this.key(pivo, tEnd, pSpot);
      this.act(wing, 'pass', t1 + 0.4, t1 + 0.7, { face: pivo });
      this.pass(wing, pivo, t1 + 0.55, tEnd, 0.05);
      this.act(pivo, 'shield', tEnd, tEnd + 0.8, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
      const cut = this.A(clamp(this.U(hp) + 9, 22, 32), -s * 3);
      this.key(holder, tEnd + 0.4, cut);
      this.act(holder, 'run', t1, tEnd + 0.4, { to: cut });
      this.label(t1 - 0.3, `Cortina, passe de primeira para o pivô e corte de ${this.nm(holder)}`);
      this.attKeysAt(tEnd, new Set([holder, wing, pivo, ...(curtain ? [curtain] : [])]), -s * 3);
      return pivo;
    }

    if (mv === 'emU') {
      const s = sideOfBall;
      const recv = others.reduce((a, b) => (this.P(b, T).y * -s > this.P(a, T).y * -s ? b : a));
      const behind = this.A(clamp(this.U(hp) - 2.2, 5, 30), hp.y * 0.2);
      const spot = this.A(clamp(this.U(hp) + 2.5, 8, 33), clamp(hp.y + s * 2.5, -8.5, 8.5));
      this.key(recv, T + len * 0.55, behind);
      this.key(recv, tEnd, spot);
      this.act(recv, 'run', T, tEnd, { to: spot });
      carry(this.A(this.U(hp) + 0.6, hp.y - s * 0.8));
      passTo(recv, spot);
      this.label(T + len * 0.5, `Movimento em U de ${this.nm(recv)} por trás de ${this.nm(holder)}`);
      const rs = this.slot.get(recv);
      if (rs !== undefined) { this.slot.set(recv, hs); this.slot.set(holder, rs); }
      this.attKeysAt(tEnd, new Set([holder, recv]), spot.y);
      this.key(holder, tEnd + 0.9, this.slotPos(this.slot.get(holder) ?? hs, tEnd + 0.9, spot.y, 1));
      return recv;
    }

    if (mv === 'falsoPivo' && pivo) {
      // o pivô sai ao encontro da bola (arrasta o fixo adversário) e o ala do lado contrário ataca as costas
      const s = sideOfBall;
      const come = this.A(clamp(this.U(hp) + 5.5, 18, 28), clamp(hp.y * 0.5, -4, 4));
      this.key(pivo, tEnd, come);
      this.act(pivo, 'run', T, tEnd, { to: come });
      passTo(pivo, come);
      const runner = others.find((x) => x !== pivo && (this.P(x, T).y >= 0 ? 1 : -1) !== s) ?? others.find((x) => x !== pivo);
      if (runner) {
        const deep = this.A(34.5, -s * 1.5);
        this.key(runner, tEnd + 0.9, deep);
        this.act(runner, 'run', tEnd - 0.5, tEnd + 0.9, { to: deep });
        this.slot.set(runner, 3);
      }
      this.slot.set(pivo, this.slot.get(runner ?? '') ?? hs);
      this.label(tEnd - 0.4, `Falso pivô: ${this.nm(pivo)} sai para receber${runner ? `, ${this.nm(runner)} ataca as costas` : ''}`);
      // o fixo adversário acompanha o pivô e abre o espaço
      this.later.push(() => {
        const m = this.defOut.reduce((a, b) => (dist(this.P(b, T), this.P(pivo, T)) < dist(this.P(a, T), this.P(pivo, T)) ? b : a), this.defOut[0]);
        if (!m) return;
        this.fix(m, T + 0.2, tEnd + 0.6);
        this.key(m, tEnd + 0.1, { x: come.x + this.dirA * 1.1, y: come.y });
      });
      this.attKeysAt(tEnd, new Set([holder, pivo, ...(runner ? [runner] : [])]), come.y);
      return pivo;
    }

    if (mv === 'bloqueio') {
      // bloqueio direto: um colega fixa o defensor de quem tem a bola; condução e continuação
      const screener = pivo && pivo !== holder ? pivo : others.reduce((a, b) => (dist(this.P(b, T), hp) < dist(this.P(a, T), hp) ? b : a));
      const g = this.A(40, 0);
      const gd = dist(hp, g) || 1;
      const toward = { x: (g.x - hp.x) / gd, y: (g.y - hp.y) / gd };
      const lat = hp.y >= 0 ? -1 : 1;
      const scr = { x: hp.x + toward.x * 1.9 + lat * 0.0, y: hp.y + toward.y * 1.9 + lat * 0.9 };
      const tScr = T + Math.min(1.1, len * 0.45);
      this.key(screener, tScr, scr, false);
      this.key(screener, tScr + 0.6, scr, false);
      this.act(screener, 'screen', tScr - 0.1, tScr + 0.7, { face: holder });
      const drive = this.A(clamp(this.U(hp) + 3.2, 6, 33), clamp(hp.y + lat * 4, -7.5, 7.5));
      this.key(holder, tScr + 0.2, { x: hp.x + toward.x * 0.3, y: hp.y });
      this.key(holder, tEnd, drive);
      this.act(holder, 'feint', tScr - 0.1, tScr + 0.4, { ang: angTo(hp, drive) });
      const roll = this.A(clamp(this.U(scr) + 4, 18, 35), scr.y * 0.4);
      this.key(screener, tEnd + 0.3, roll);
      this.act(screener, 'run', tScr + 0.6, tEnd + 0.4, { to: roll });
      this.label(tScr - 0.2, `Bloqueio de ${this.nm(screener)} para ${this.nm(holder)}`);
      // o defensor de quem tinha a bola fica preso no bloqueio
      this.later.push(() => {
        const m = this.defOut.reduce((a, b) => (dist(this.P(b, tScr - 0.4), hp) < dist(this.P(a, tScr - 0.4), hp) ? b : a), this.defOut[0]);
        if (!m) return;
        const sp = this.P(screener, tScr + 0.2);
        const stuck = { x: sp.x + toward.x * 0.75, y: sp.y + toward.y * 0.75 - lat * 0.4 };
        this.fix(m, tScr - 0.1, tScr + 0.9);
        this.key(m, tScr + 0.15, stuck);
        this.key(m, tScr + 0.8, { x: stuck.x + toward.x * 0.4, y: stuck.y + lat * 0.8 });
      });
      this.attKeysAt(tEnd, new Set([holder, screener]), drive.y);
      return holder;
    }

    if (mv === 'drible') {
      // 1x1: finta e condução para dentro
      const lat = hp.y >= 0 ? -1 : 1;
      const drive = this.A(clamp(this.U(hp) + 3.5, 6, 33), clamp(hp.y + lat * 3, -7.5, 7.5));
      const tf = T + len * 0.35;
      this.act(holder, 'feint', tf - 0.3, tf + 0.3, { ang: angTo(hp, drive) });
      this.key(holder, tf, { x: hp.x - lat * 0.0 + this.dirA * 0.4, y: hp.y - lat * 0.6 });
      this.key(holder, tEnd, drive);
      this.label(tf - 0.2, `Finta de ${this.nm(holder)}`);
      this.later.push(() => {
        const m = this.defOut.reduce((a, b) => (dist(this.P(b, tf), hp) < dist(this.P(a, tf), hp) ? b : a), this.defOut[0]);
        if (!m) return;
        const mp = this.P(m, tf - 0.3);
        this.fix(m, tf - 0.2, tf + 0.7);
        this.key(m, tf + 0.1, { x: mp.x, y: mp.y - lat * 1.1 }); // vai na finta
        this.key(m, tf + 0.6, { x: mp.x + this.dirA * 0.6, y: mp.y - lat * 0.4 });
      });
      this.attKeysAt(tEnd, new Set([holder]), drive.y);
      return holder;
    }

    // circulação: passe para um apoio próximo
    const ADJ: Record<Sys, number[][]> = {
      '3-1': [[1, 2, 3], [0, 3], [0, 3], [0, 1, 2]],
      '1-2-1': [[1, 2], [0, 3], [0, 3], [1, 2]],
      '4-0': [[1, 3], [0, 2], [1, 3], [0, 2]],
      '2-2': [[3, 1], [0, 2], [3, 1], [0, 2]],
      '5x4': [[1, 2], [0, 3], [0, 4], [1, 4], [2, 3]],
    };
    const nb = (ADJ[sys][hs] ?? []).map((i) => this.slotHolder(i)).filter((x): x is string => !!x && x !== holder);
    const recv = forced ?? (nb.length ? nb[Math.floor(r() * nb.length)] : others[Math.floor(r() * others.length)]);
    const rs = this.slot.get(recv) ?? 0;
    const spot = this.slotPos(rs, tEnd, this.P(recv, T).y * 0.5, 1.2);
    // apoio: o recetor dá linha de passe (aproxima-se ou abre)
    this.key(recv, tEnd, spot);
    carry(this.A(this.U(hp) + 0.8, hp.y + (r() - 0.5) * 1.6));
    passTo(recv, spot);
    this.attKeysAt(tEnd, new Set([holder, recv]), spot.y);
    this.key(holder, tEnd + 0.4, this.slotPos(hs, tEnd + 0.4, spot.y, 1));
    return recv;
  }

  // ---------- finalização de ataque organizado ----------
  /** Apaga movimentos planeados para depois de T (um novo lance substitui-os). */
  private replan(T: number) {
    for (const id of this.attOut) this.tr.get(id)!.clear(T + 0.05, 1e9);
    if (this.gkA) this.tr.get(this.gkA)!.clear(T + 0.05, 1e9);
  }

  private finish(holder: string, T: number, tS: number, shooter: string, assist: string | undefined, a: Action) {
    const r = this.r;
    this.replan(T);
    const pivoSlot = (this.sys === '3-1' || this.sys === '1-2-1') && this.slot.get(shooter) === 3;
    let kind: 'poste2' | 'pivo' | 'meia' | 'individual';
    if (!assist || holder === shooter) kind = a.result === 'blocked' || r() < 0.4 ? (r() < 0.5 ? 'meia' : 'individual') : 'individual';
    else if (pivoSlot) kind = 'pivo';
    else if (a.result === 'blocked' || a.result === 'wide') kind = r() < 0.7 ? 'meia' : 'poste2';
    else kind = r() < 0.55 ? 'poste2' : r() < 0.5 ? 'meia' : 'pivo';
    const hp = this.P(holder, T);
    const s = hp.y >= 0 ? 1 : -1;
    const skip = new Set<string>([holder, shooter]);

    if (kind === 'individual' || holder === shooter) {
      const from = this.P(shooter, T);
      const spot = this.A(kind === 'meia' ? 28 : 31.5, clamp(from.y * 0.45, -5, 5));
      if (holder !== shooter) {
        this.pass(holder, shooter, T + 0.1, T + 0.6);
        this.act(holder, 'pass', T - 0.1, T + 0.25, { face: shooter });
      }
      const tf = lerp(T, tS, 0.45);
      if (kind !== 'meia' && r() < 0.45) { // finta antes do remate só às vezes (nem todos os remates são precedidos de finta)
        this.act(shooter, 'feint', tf - 0.3, tf + 0.3, { ang: angTo(from, spot) });
        this.label(tf - 0.3, `${this.nm(shooter)} em 1x1`);
        this.later.push(() => {
          const m = this.defOut.reduce((x, y) => (dist(this.P(y, tf), this.P(shooter, tf)) < dist(this.P(x, tf), this.P(shooter, tf)) ? y : x), this.defOut[0]);
          if (!m) return;
          const mp = this.P(m, tf - 0.2);
          this.fix(m, tf - 0.1, tf + 0.8);
          this.key(m, tf + 0.2, { x: mp.x, y: mp.y + s * 1.1 });
          this.key(m, tf + 0.8, { x: mp.x + this.dirA * 0.8, y: mp.y + s * 0.4 });
        });
      }
      this.key(shooter, tf, { x: lerp(from.x, spot.x, 0.4), y: lerp(from.y, spot.y, 0.4) - s * 0.6 });
      this.key(shooter, tS, spot);
      this.attKeysAt(tS, skip, spot.y);
      return;
    }

    if (kind === 'poste2') {
      // assistência rasteira ao segundo poste: quem remata ataca o poste contrário
      const wide = this.A(clamp(this.U(hp) + 3, 30, 34), s * 7);
      const post = this.A(37.6, -s * 2.3);
      const tp = tS - 0.55;
      this.key(holder, tp, wide);
      const sp0 = this.P(shooter, T);
      this.key(shooter, tS - 1.6, this.A(clamp(this.U(sp0) + 2, 26, 34), -s * 5.5));
      this.key(shooter, tS, post);
      this.act(shooter, 'run', tS - 1.7, tS, { to: post });
      this.act(holder, 'pass', tp - 0.2, tp + 0.15, { face: shooter });
      this.pass(holder, shooter, tp, tS - 0.02, 0.05);
      this.label(tS - 1.6, `Desmarcação de ${this.nm(shooter)} ao segundo poste`);
      this.attKeysAt(tS, skip, s * 3);
      return;
    }

    if (kind === 'pivo') {
      // o pivô recebe de costas, roda sobre o defensor e remata
      const spot = this.A(32.5, s * 1.6);
      const turn = this.A(31.8, s * 0.2);
      const tr = tS - 1.25;
      this.key(shooter, tr, spot);
      this.act(shooter, 'shield', tr - 0.1, tr + 0.5, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
      this.act(holder, 'pass', tr - 0.7, tr - 0.35, { face: shooter });
      this.pass(holder, shooter, tr - 0.5, tr);
      this.act(shooter, 'feint', tr + 0.4, tr + 0.85, { ang: angTo(spot, turn) });
      this.key(shooter, tS, turn);
      this.label(tr, `${this.nm(shooter)} recebe de costas e roda`);
      this.later.push(() => {
        const m = this.defOut.reduce((x, y) => (dist(this.P(y, tr), spot) < dist(this.P(x, tr), spot) ? y : x), this.defOut[0]);
        if (!m) return;
        this.fix(m, tr - 0.3, tS + 0.3);
        this.key(m, tr, this.A(33.6, s * 1.6));
        this.key(m, tS, this.A(33.2, s * 1.4));
      });
      this.attKeysAt(tS, skip, s * 2);
      return;
    }

    // meia distância: passe atrasado e remate de primeira
    const spot = this.A(28.5 + r() * 1.5, s * (0.5 + r() * 2));
    const tp = tS - 0.6;
    this.key(holder, tp, this.A(clamp(this.U(hp) + 1.5, 28, 33), s * 5));
    const sp0 = this.P(shooter, T);
    this.key(shooter, tS - 1.0, this.A(clamp(this.U(sp0), 22, 27), spot.y * 0.6));
    this.key(shooter, tS, spot);
    this.act(shooter, 'run', tS - 1.1, tS, { to: spot });
    this.act(holder, 'pass', tp - 0.2, tp + 0.15, { face: shooter });
    this.pass(holder, shooter, tp, tS - 0.02);
    this.label(tS - 1.0, `${this.nm(shooter)} aparece para o remate de fora`);
    this.attKeysAt(tS, skip, s * 2);
  }

  // ---------- GR atacante: recebe atrás, conduz até ao meio-campo e remata de longe ----------
  private gkCarry(holder: string, T: number, tS: number, gk: string) {
    this.replan(T);
    const hp = this.P(holder, T);
    const g0 = this.P(gk, T);
    // atraso para o GR
    this.act(holder, 'pass', T + 0.1, T + 0.45, { face: gk });
    this.pass(holder, gk, T + 0.3, T + 1.0);
    this.key(holder, T + 1.4, this.A(clamp(this.U(hp) + 4, 14, 30), hp.y));
    this.key(gk, T + 1.0, g0);
    const v = clamp(g0.y + (this.r() - 0.5) * 5, -5, 5);
    const spot = this.A(18 + this.r() * 4, v);
    this.key(gk, lerp(T + 1.0, tS, 0.55), this.A(lerp(this.U(g0), this.U(spot), 0.6), lerp(g0.y, v, 0.6)));
    this.key(gk, tS, spot);
    // os colegas abrem e dão linhas (o GR leva a equipa para a frente)
    for (const id of this.attOut) if (id !== holder) this.key(id, tS, this.slotPos(this.slot.get(id) ?? 0, tS, v, 1.2));
    this.label(T + 1.2, `${this.nm(gk)} (GR) sai a jogar com a bola`);
    this.label(tS - 0.3, `${this.nm(gk)} arrisca o remate de longe!`);
  }

  // ---------- contra-ataque: 2x1, 3x2, 2x0 ----------
  private counterRun(carrier: string, T: number, tS: number, shooter: string, assist: string | undefined, a: Action) {
    const r = this.r;
    this.replan(T);
    const cp = this.P(carrier, T);
    const others = this.attOut.filter((x) => x !== carrier);
    const ahead = others.sort((x, y) => this.U(this.P(y, T)) - this.U(this.P(x, T)));
    const s1 = cp.y <= 0 ? 1 : -1;
    const r1 = shooter !== carrier ? shooter : ahead[0];
    const r2 = assist && assist !== carrier && assist !== r1 ? assist : ahead.find((x) => x !== r1);
    const vc = clamp(cp.y * 0.4, -3, 3);
    const end = this.A(32 + r() * 2, vc * 0.6);
    this.phase(T, 'Contra-ataque');
    // quem conduz ataca o espaço pelo meio; os colegas abrem as linhas
    this.key(carrier, lerp(T, tS, 0.5), this.A(lerp(this.U(cp), this.U(end), 0.6), lerp(cp.y, vc, 0.6)));
    if (r1) {
      const lane = this.A(clamp(this.U(this.P(r1, T)) + 7, 22, 33), s1 * 6.5);
      this.key(r1, lerp(T, tS, 0.55), lane);
      this.act(r1, 'run', T, tS, { to: lane });
    }
    if (r2) {
      const lane = this.A(clamp(this.U(this.P(r2, T)) + 6, 18, 28), -s1 * 5);
      this.key(r2, lerp(T, tS, 0.6), lane);
      this.act(r2, 'run', T, tS - 0.5, { to: lane });
    }
    for (const id of others) if (id !== r1 && id !== r2) this.key(id, tS, this.A(clamp(this.U(this.P(id, T)) + 6, 10, 20), this.P(id, T).y * 0.6));
    if (this.gkA) this.key(this.gkA, tS, this.A(3.5, 0));

    if (shooter === carrier) {
      this.key(carrier, tS, end);
      if (r() < 0.5) {
        this.act(carrier, 'feint', tS - 1.0, tS - 0.5, { ang: angTo(cp, end) });
        this.label(tS - 1.1, `${this.nm(carrier)} finta o último defensor`);
      }
    } else if (assist && assist !== carrier && r2) {
      // 3x2: quem conduz solta para o ala, que serve o segundo poste
      const wing = this.A(32, s1 * 6);
      this.key(assist, tS - 1.1, wing);
      this.key(carrier, tS - 1.5, this.A(lerp(this.U(cp), this.U(end), 0.8), vc));
      this.act(carrier, 'pass', tS - 1.85, tS - 1.5, { face: assist });
      this.pass(carrier, assist, tS - 1.65, tS - 1.05);
      const post = this.A(37.4, -s1 * 2.2);
      this.key(shooter, tS, post);
      this.act(assist, 'pass', tS - 0.75, tS - 0.4, { face: shooter });
      this.pass(assist, shooter, tS - 0.55, tS - 0.02, 0.05);
    } else {
      // 2x1 / 2x0: os dois sobem lado a lado, quem conduz atrai o defensor (e o GR) e solta para o lado;
      // o colega encosta para a baliza quase vazia
      const uc = lerp(this.U(cp), this.U(end), 0.95);
      const post = this.A(Math.min(36.6, uc + 4.6), s1 * 1.9);
      this.key(carrier, tS - 0.55, this.A(uc, vc));
      this.key(shooter, lerp(T, tS, 0.75), this.A(uc - 1.2, vc + s1 * 3.4));
      this.key(shooter, tS - 0.5, this.A(uc + 0.4, vc + s1 * 3.2));
      this.key(shooter, tS, post);
      this.label(tS - 0.6, `Passe lateral para ${this.nm(shooter)}`);
      this.act(shooter, 'run', T, tS, { to: post });
      this.act(carrier, 'pass', tS - 0.75, tS - 0.4, { face: shooter });
      this.pass(carrier, shooter, tS - 0.55, tS - 0.02, 0.05);
    }
    // superioridade real: os defensores apanhados à frente da bola ficam para trás (correm a recuperar, sem chegar);
    // só 0, 1 ou 2 defendem (2x0, 2x1, 3x2), e o GR é atraído por quem conduz antes do passe lateral
    const nAttack = shooter === carrier ? 1 : assist && assist !== carrier && r2 ? 3 : 2;
    const keep = nAttack === 3 ? 2 : nAttack === 1 ? (r() < 0.4 ? 0 : 1) : 1;
    const defs = [...this.defOut].sort((x, y) => this.U(this.P(y, T)) - this.U(this.P(x, T)));
    defs.slice(keep).forEach((id, i) => {
      const d0 = this.P(id, T);
      this.fix(id, T, tS + 0.6);
      this.key(id, T, d0);
      // corre para a própria baliza atrás da jogada, sempre uns metros atrás
      this.later.push(() => {
        const bu = this.U(this.P(carrier, tS - 0.8));
        this.key(id, tS - 0.3, this.A(Math.min(bu - 2.5 - i * 1.6, this.U(d0) + 0.8 * (tS - T) * 5.6), d0.y * 0.5));
        this.key(id, tS + 0.6, this.A(Math.min(bu - 1 - i * 1.6, 36), d0.y * 0.4));
      });
      this.act(id, 'run', T, tS);
    });
    if (keep === 0) this.label(T + 0.6, `${this.nm(carrier)} isolado, sozinho para a baliza!`);
    if (this.gkD && shooter !== carrier) {
      const gk = this.gkD;
      this.later.push(() => {
        const cpp = this.P(carrier, tS - 0.7);
        this.fix(gk, tS - 1.4, tS - 0.05);
        this.key(gk, tS - 0.65, this.A(37.2, clamp(cpp.y * 0.55, -1.6, 1.6)));
      });
    }
    // descrição real do lance: quantos atacantes contra quantos defensores (depois de a defesa se mexer)
    this.post.push(() => {
      const tm = tS - 1.2;
      const ball = this.ballAt(tm);
      const bu = this.U(ball);
      const nAtt = this.attOut.filter((id) => this.U(this.P(id, tm)) >= bu - 3).length;
      const nDef = this.defOut.filter((id) => this.U(this.P(id, tm)) > bu - 0.5).length;
      const na = Math.max(1, Math.min(4, nAtt)), nd = Math.min(4, nDef);
      this.label(T + 0.2, na > nd ? `Contra-ataque em superioridade: ${na}x${nd}` : 'Transição rápida, a defesa recupera a tempo');
    });
  }

  // ---------- perda de bola ----------
  private loseBall(holder: string, T: number, D: number, tackler?: string) {
    const r = this.r;
    this.replan(T);
    const hp = this.P(holder, T);
    const drive = this.A(clamp(this.U(hp) + 2.5, 4, 34), hp.y * 0.8);
    this.key(holder, D, drive);
    this.attKeysAt(D, new Set([holder]));
    if (!tackler || !this.tr.has(tackler)) return;
    const intercept = r() < 0.5;
    if (intercept) {
      // passe intercetado
      const mate = this.attOut.find((x) => x !== holder) ?? holder;
      this.act(holder, 'pass', D - 0.75, D - 0.4, { face: mate });
      this.later.push(() => {
        const a = this.P(holder, D - 0.55), b = this.P(mate, D);
        const cut = { x: lerp(a.x, b.x, 0.55), y: lerp(a.y, b.y, 0.55) };
        this.fix(tackler, D - 0.8, D + 0.3);
        this.key(tackler, D - 0.6, { x: cut.x + this.dirA * 1.2, y: cut.y + 0.8 });
        this.key(tackler, D, cut);
      });
      this.pass(holder, tackler, D - 0.55, D);
      this.label(D - 0.3, `${this.nm(tackler)} interceta o passe`);
    } else if (r() < 0.4) {
      // desarme com a bola a sair pela linha lateral
      const hp2 = this.P(holder, D);
      const out = { x: clamp(hp2.x + this.dirA * (1 + r() * 2), -19, 19), y: (hp2.y >= 0 ? 1 : -1) * 10.6 };
      this.later.push(() => {
        this.fix(tackler, D - 0.8, D + 0.3);
        this.key(tackler, D - 0.55, { x: hp2.x + this.dirA * 1.6, y: hp2.y + 0.8 });
        this.key(tackler, D, { x: hp2.x + this.dirA * 0.55, y: hp2.y + 0.25 });
      });
      this.act(tackler, 'tackle', D - 0.45, D + 0.2, { face: holder });
      this.balls.push({ k: 'fly', t0: D - 0.05, t1: D + 0.6, from: holder, b: { x: out.x, y: out.y, z: 0.11 }, lift: 0.3 });
      this.balls.push({ k: 'still', t0: D + 0.6, at: { x: out.x, y: out.y, z: 0.11 } });
      this.outAt = out;
      this.label(D - 0.3, `${this.nm(tackler)} desarma e a bola sai pela lateral`);
    } else {
      // desarme
      this.later.push(() => {
        const hp2 = this.P(holder, D);
        this.fix(tackler, D - 0.8, D + 0.3);
        this.key(tackler, D - 0.55, { x: hp2.x + this.dirA * 1.6, y: hp2.y + 0.8 });
        this.key(tackler, D, { x: hp2.x + this.dirA * 0.55, y: hp2.y + 0.25 });
      });
      this.act(tackler, 'tackle', D - 0.45, D + 0.2, { face: holder });
      this.balls.push({ k: 'foot', t0: D - 0.05, id: tackler });
      // no choque, quem perde a bola vai muitas vezes ao chão (como se vê nos jogos)
      if (r() < 0.35) this.act(holder, 'fall', D - 0.05, D + 1.3);
      this.label(D - 0.3, `Desarme de ${this.nm(tackler)}`);
    }
  }

  // ---------- falta ----------
  private fouled(holder: string, T: number, D: number, f: Action) {
    this.replan(T);
    const hp = this.P(holder, T);
    // penálti: a falta é sempre dentro da área (o portador entra na área e é derrubado)
    const drive = f.kind === 'penalty' ? this.A(35.2 + this.r() * 1.6, clamp(hp.y * 0.5, -4, 4)) : this.A(clamp(this.U(hp) + 3, 6, 33), hp.y * 0.8);
    this.key(holder, D, drive);
    this.attKeysAt(D, new Set([holder]));
    this.act(holder, 'fall', D, D + 1.4);
    this.key(holder, D + 1.3, drive, true);
    const fouler = f.other;
    if (fouler && this.tr.has(fouler)) {
      this.later.push(() => {
        // quem faz a falta persegue o portador durante ~2 s e só o toca quando está colado a ele (nada de rasteiras à distância)
        this.fix(fouler, D - 2.4, D + 0.7);
        for (const [dt, gap] of [[1.8, 2.6], [1.2, 1.6], [0.7, 0.9], [0.3, 0.55], [0, 0.35]] as const) {
          const hp2 = this.P(holder, D - dt);
          this.key(fouler, D - dt, { x: hp2.x + this.dirA * gap * 0.8, y: hp2.y - Math.sign(hp2.y || 1) * gap * 0.5 });
        }
      });
      this.act(fouler, 'tackle', D - 0.4, D + 0.15, { face: holder });
    }
    this.balls.push({ k: 'still', t0: D, at: { x: drive.x + this.dirA * 0.4, y: drive.y, z: 0.11 } });
    this.label(D, `Falta de ${this.nm(fouler)} sobre ${this.nm(holder)}`);
  }

  // ---------- defesa: pressão, cobertura e troca de marcações ----------
  private defend(t0: number, t1: number) {
    const def = 1 - this.att;
    const tD = this.tactics[def];
    const press = PRESS_LINE[tD.pressure];
    // distâncias de marcação (lado da baliza): futsal é jogado muito em cima do adversário
    const gap = tD.marking === 'individual' ? 1.0 : tD.marking === 'misto' ? 1.3 : 1.6;
    // quem tem a bola é marcado muito em cima (corpo a corpo, como se vê nos jogos)
    const pressGap = tD.pressure === 'alta' ? 0.65 : tD.pressure === 'media' ? 0.85 : 1.1;
    let fixedPairs: Map<string, string> | null = null;
    let pressUntil = -1;
    const dt = 0.25;
    for (let t = t0; t <= t1 + 1e-6; t += dt) {
      const ball = this.ballAt(t);
      const bu = this.U(ball), bv = ball.y;
      const holder = this.holderAt(t);
      // antecipação: o defensor lê para onde vai o atacante (posição daqui a 0,15 s)
      const atts = this.attOut.map((id) => ({ id, p: this.P(id, Math.min(t1, t + 0.15)) }));
      // com menos defensores (5x4, expulsões) fica livre o atacante mais longe da bola
      const marks = [...atts];
      while (marks.length > this.defOut.length) {
        let wi = 0, wd = -1;
        marks.forEach((m, i) => { const d = dist(m.p, ball) + (m.id === holder ? -99 : 0); if (d > wd) { wd = d; wi = i; } });
        marks.splice(wi, 1);
      }
      // gatilho de pressão: passe para trás (a bola recua >2 m em 0,5 s) faz o bloco subir junto durante ~1,5 s
      const bPrev = this.ballAt(Math.max(t0, t - 0.5));
      if (tD.pressure !== 'baixa' && this.U(bPrev) - bu > 2 && t > pressUntil) pressUntil = t + 1.5;
      const pressing = t < pressUntil;
      const spots = new Map<string, P2>();
      for (const m of marks) {
        const au = this.U(m.p), av = m.p.y;
        const gu = 40 - au, gv = -av;
        const gl = Math.hypot(gu, gv) || 1;
        const isH = m.id === holder;
        const g0 = isH ? pressGap * (pressing ? 0.8 : 1) : gap;
        let u = au + (gu / gl) * g0, v = av + (gv / gl) * g0;
        if (!isH) {
          // à zona só o portador é apertado: os outros guardam o espaço entre a bola e a baliza, a 2-3 m do seu
          // atacante, do lado da bola e por dentro (bloco compacto que fecha o meio); quanto mais longe da bola, mais ajuda
          const dB = Math.hypot(au - bu, av - bv);
          const zone = tD.marking === 'zona' ? 1 : tD.marking === 'misto' ? 0.55 : 0.15;
          const help = clamp(0.2 + (dB - 4) / 12, 0.15, 0.8) * zone;
          const sag = help * 2.2; // afasta-se do atacante para o lado da baliza
          u += (gu / gl) * sag + help * 1.5;
          v = lerp(v + (gv / gl) * sag, bv * 0.45, help * 0.8);
        }
        if (pressing) u -= isH ? 0.6 : 2.5; // o bloco sobe em conjunto
        u = clamp(Math.max(u, isH ? press : press + 1.5), 2, 39.2);
        spots.set(m.id, this.A(u, clamp(v, -9.4, 9.4)));
      }
      // cobertura (zona/mista): o defensor do colega mais próximo do portador fica atrás e por dentro de quem pressiona
      if (holder && tD.marking !== 'individual') {
        const hm = marks.find((m) => m.id === holder);
        if (hm) {
          const near = marks.filter((m) => m.id !== holder).map((m) => ({ m, d: dist(m.p, hm.p) })).filter((x) => x.d < 9).sort((a, b) => a.d - b.d)[0];
          if (near) {
            const hu2 = this.U(hm.p), hv = hm.p.y;
            const cover = this.A(clamp(hu2 + 2.8, 2, 38.5), hv * 0.55);
            const sp = spots.get(near.m.id)!;
            spots.set(near.m.id, { x: lerp(sp.x, cover.x, 0.55), y: lerp(sp.y, cover.y, 0.55) });
          }
        }
      }
      // atribuição: individual mantém os pares; zona/misto troca conforme as posições
      const free = this.defOut.filter((id) => !this.isFixed(id, t));
      const assign = new Map<string, string>();
      if (tD.marking === 'individual' && fixedPairs) {
        for (const [d, a] of fixedPairs) if (spots.has(a) && free.includes(d)) assign.set(d, a);
      }
      const taken = new Set(assign.values());
      const pairs: [number, string, string][] = [];
      for (const d of free) if (!assign.has(d)) for (const [a, sp] of spots) if (!taken.has(a)) pairs.push([dist(this.P(d, t - dt), sp), d, a]);
      pairs.sort((x, y) => x[0] - y[0]);
      for (const [, d, a] of pairs) if (!assign.has(d) && !taken.has(a)) { assign.set(d, a); taken.add(a); }
      if (!fixedPairs) fixedPairs = new Map(assign);
      // transição defensiva (quem acabou de perder a bola), ~2,5 s: os 2 mais próximos (1 com bloco baixo) atacam já a
      // bola (pressão imediata); os outros correm para trás da linha da bola, para o lado da própria baliza
      const transition = this.turnover && t < 2.6;
      const pressers = transition ? [...free].sort((x, y) => dist(this.P(x, t - dt), ball) - dist(this.P(y, t - dt), ball)).slice(0, tD.pressure === 'baixa' ? 1 : 2) : [];
      for (const d of free) {
        const a = assign.get(d);
        let target = a ? spots.get(a)! : this.A(clamp(Math.max(bu + 4, press + 4), 20, 36), bv * 0.3);
        if (transition) {
          if (pressers.includes(d)) target = this.A(clamp(bu + 0.7, 1, 39), bv);
          else target = this.A(clamp(Math.max(this.U(target), bu + 3), 2, 38.5), target.y);
        }
        const prev = this.P(d, t - dt);
        // defensor humano: pequenas diferenças não o fazem mexer (fica apoiado, pronto); corrige devagar o que é pouco
        // e só sprinta quando fica mesmo para trás (perto do portador reage sempre)
        const dd = dist(prev, target);
        const nearBall = a === holder || dist(prev, ball) < 3.5;
        const dead = nearBall ? 0.15 : dist(prev, ball) < 8 ? 0.5 : 0.9; // perto do lance ajusta-se a cada passe
        const vmax = transition ? VMAX : Math.min(VMAX * 1.05, (nearBall ? 2.0 : 0.8) + Math.max(0, dd - dead) * 1.4);
        const maxd = vmax * dt;
        const np = dd <= dead && !transition ? prev : dd > maxd ? { x: prev.x + ((target.x - prev.x) * maxd) / dd, y: prev.y + ((target.y - prev.y) * maxd) / dd } : target;
        this.key(d, t, np);
      }
      // árbitros: cada um na sua linha lateral, ligeiramente desfasados, a seguir a bola
      for (const [k, id] of REFS.entries()) {
        if (this.isFixed(id, t)) continue;
        const target = { x: clamp(ball.x * 0.85 + (k ? 2.5 : -2.5) * this.dirA, -17, 17), y: k ? 10.7 : -10.7 };
        const prev = this.P(id, t - dt);
        const maxd = 6 * dt, dd = dist(prev, target);
        this.key(id, t, dd > maxd ? { x: prev.x + ((target.x - prev.x) * maxd) / dd, y: target.y } : target);
      }
      // guarda-redes: na bissetriz do ângulo formado pelos postes (fecha os dois lados por igual), com profundidade
      // conforme a distância e o ângulo (ângulo fechado = junto ao poste) e o atributo saídas; reage à bola com
      // ~0,15 s de atraso e desloca-se de lado no máximo a ~4,5 m/s (passos curtos), sem saltos de posição
      if (this.gkD && !this.isFixed(this.gkD, t)) {
        const gx = this.dirA * 20;
        const bl = this.ballAt(Math.max(t0, t - 0.15));
        const prev = this.P(this.gkD, t - dt);
        let target: P2;
        if (this.U(bl) < 16) target = { x: gx - this.dirA * 3.6, y: clamp(bl.y * 0.12, -1, 1) };
        else {
          const dl = Math.hypot(gx - bl.x, bl.y);
          const tight = clamp(1 - (Math.abs(bl.y) / Math.max(1, dl)) * 0.75, 0.35, 1); // ângulo fechado: fica na linha
          const depth = clamp(0.45 + dl * 0.12, 0.6, 2.4) * tight * (0.85 + this.au(this.gkD, 'saidas') * 0.3);
          target = this.gkSpot(gx, bl, depth);
        }
        // passos de ajuste: perto do alvo não se mexe (fica fixo, pronto); longe desloca-se de lado
        const dd = dist(prev, target);
        // fora da baliza (GR que saiu a jogar e perdeu a bola) volta a sprintar; perto, passos curtos
        const sprint = dd > 3;
        const maxLat = (sprint ? VMAX : 4.5) * dt, maxDep = (sprint ? VMAX : 3) * dt;
        const np = dd < 0.12 ? prev : { x: prev.x + clamp(target.x - prev.x, -maxDep, maxDep), y: prev.y + clamp(target.y - prev.y, -maxLat, maxLat) };
        this.key(this.gkD, t, np);
      }
    }
  }

  // ---------- remate ----------
  /** Remate e reação do guarda-redes / do defensor que bloqueia. Devolve o instante em que a bola fica parada. */
  private shot(T: number, shooter: string, a: Action, g: number): number {
    const r = this.r;
    // o remate parte sempre de onde o rematador consegue chegar (em qualquer lance: jogo, recarga, contra-ataque, bola parada)
    this.tr.get(shooter)?.limit(VMAX * 0.85);
    const res = a.result ?? 'wide';
    const from = this.P(shooter, T);
    const side = r() < 0.5 ? -1 : 1;
    let target: Ball, after: Ball;
    let caught = false;
    const spill = this.spillNext;
    this.spillNext = false;
    // onde está o GR (a defesa acontece à frente dele, não na linha de golo)
    const kSide = 1 - (this.sideOf.get(shooter) ?? this.att);
    const kId = this.p.onCourt[kSide][0];
    const kPos = kId && !this.p.flying[kSide] ? this.P(kId, T) : null;
    // remate de perto (1x1, contra-ataque): o GR sai ao encontro do atacante e fecha-o em queda (como na liga espanhola)
    const fromDist = Math.hypot(g * 20 - from.x, from.y);
    // ângulo fechado (bola perto da linha de fundo, ao lado do poste): o GR fecha o primeiro poste, não sai
    const tightShot = Math.abs(from.y) > 1.3 && Math.abs(g * 20 - from.x) < Math.abs(from.y) * 1.2;
    // saída ao encontro do atacante só no 1x1: contra-ataque ou rematador sem nenhum defensor no caminho da baliza
    const mates = [...this.attOut, ...this.defOut].filter((d) => this.sideOf.get(d) === kSide && d !== kId);
    const segD = (q: P2) => { const ax = g * 20 - from.x, ay = -from.y, l2 = ax * ax + ay * ay || 1; const k = clamp(((q.x - from.x) * ax + (q.y - from.y) * ay) / l2, 0, 1); return Math.hypot(from.x + ax * k - q.x, from.y + ay * k - q.y); };
    const oneOnOne = (this.isCounter || !mates.some((d) => segD(this.P(d, T)) < 1.3)) && fromDist < 8.5;
    const rush = kPos && oneOnOne && !tightShot && res !== 'blocked' ? clamp((8.5 - fromDist) * 0.45, 0.4, 2.6) : 0;
    // posição de partida da defesa: no ângulo da bola; na saída avança no mesmo caminho até 1-2 m do rematador
    const kDepth = tightShot ? 0.35 : rush ? clamp(Math.abs(g * 20 - from.x) - 2, 0.6, 1.3 + (8.5 - fromDist) * 0.35) : clamp(0.45 + fromDist * 0.12, 0.6, 2.2);
    const kBase = kPos ? this.gkSpot(g * 20, from, kDepth) : { x: g * 19.4, y: 0 };
    const gkX = kBase.x;
    if (res === 'goal') { const v = (r() - 0.5) * 2.5; target = { x: g * 20.35, y: v, z: 0.15 + r() * 1.6 }; after = { x: g * 20.9, y: v * 0.9, z: 0.1 }; }
    else if (res === 'post') { target = { x: g * 19.95, y: side * 1.52, z: 0.3 + r() * 1.4 }; after = { x: g * 15, y: side * 4.5, z: 0.1 }; }
    else if (res === 'wide') { target = { x: g * 20.2, y: side * (1.9 + r() * 1.6), z: 0.2 + r() * 1.8 }; after = { x: g * 21.8, y: side * (3 + r() * 2), z: 0.1 }; }
    else if (res === 'saved') {
      const v = (r() - 0.5) * 2.6;
      target = { x: gkX - g * 0.2, y: v, z: 0.2 + r() * 1.3 };
      // remates sem muita força ou à figura: o GR agarra (a maioria das defesas em futsal)
      caught = spill ? false : a.caught ?? (target.z < 1.7 && (Math.abs(v) < 0.8 || r() < 0.45));
      if (caught && target.z > 1.5) target.z = 1.1;
      // defesa para canto, ou para a frente (ressalto que dá recarga)
      // desviada pelo GR: para canto (sai pela linha de fundo bem longe dos postes) ou para a frente (ressalto)
      const sv = Math.sign(v) || side;
      after = caught ? target : spill ? { x: g * (14.5 + r() * 2), y: clamp(v * 2.5 + side * 1.5, -5, 5), z: 0.1 } : { x: g * (20.6 + r() * 0.8), y: sv * (2.6 + r() * 2.2), z: 0.1 };
    } else {
      const gl = Math.hypot(g * 20 - from.x, -from.y) || 1;
      target = { x: from.x + ((g * 20 - from.x) / gl) * 2.2, y: from.y + (-from.y / gl) * 2.2, z: 0.4 };
      // bloqueado: a bola ressalta no defensor e fica em jogo (às vezes sai pela linha de fundo, para canto)
      after = r() < 0.3 ? { x: g * 20.6, y: (from.y >= 0 ? 1 : -1) * (6 + r() * 3), z: 0.1 } : { x: clamp(target.x - g * (2 + r() * 4), -19, 19), y: clamp(target.y + (r() - 0.5) * 6, -9, 9), z: 0.1 };
    }
    // força do remate: potente (peito do pé, 80-110 km/h) ou colocado/de bico (50-75 km/h), conforme o atributo remate e a distância
    const rem = this.au(shooter, 'remate');
    const sdist = Math.hypot(target.x - from.x, target.y - from.y);
    const power = r() < (sdist < 6 ? 0.3 : 0.4 + 0.4 * rem);
    const vball = res === 'blocked' ? 16 : power ? 21 + 7 * rem + r() * 2.5 : 14 + 5 * rem + r() * 3; // máx. ~110 km/h
    const fl = clamp((sdist + 1.5) / vball, 0.18, 1.1); // +1,5 m: o rematador pode chegar um pouco atrás do ponto planeado
    const windup = power ? 0.3 : 0.2; // preparação maior no remate potente
    this.shotTimes.push(T);
    this.act(shooter, 'shoot', T - windup, T + windup * 0.75, { ang: angTo(from, target), h: vball }); // h = força (gesto)
    this.balls.push({ k: 'fly', t0: T, t1: T + fl, from: shooter, b: target, lift: res === 'blocked' ? 0.1 : 0.15 });
    this.label(T - 0.1, `Remate de ${this.nm(shooter)}`);

    const keeperSide = 1 - (this.sideOf.get(shooter) ?? this.att);
    const gk = this.p.onCourt[keeperSide][0];
    const gkInGoal = gk && !this.p.flying[keeperSide];
    let gkTech: ActKind | null = null;
    // remate para fora (longe dos postes): o GR acompanha com os olhos e um passo, sem gesto de defesa
    const offTarget = (res === 'wide' && Math.abs(target.y) > 1.65) || target.z > 2.05;
    if (gkInGoal && res !== 'blocked' && offTarget) {
      const step = clamp(target.y * 0.25, -1.2, 1.2);
      this.later.push(() => { const g0 = this.P(gk, T); this.fix(gk, T, T + fl + 0.8); this.key(gk, T, g0); this.key(gk, T + fl + 0.3, { x: g0.x, y: clamp(g0.y + step * 0.5, -1.7, 1.7) }); });
    } else if (gkInGoal && res !== 'blocked') {
      // técnica de futsal conforme a distância lateral da bola ao GR e a altura: à figura agarra; rasteira de lado em
      // espargata; alta e longe em voo; de perto abertura em cruz. O gesto só começa depois do remate (reação pelos reflexos)
      const ty = clamp(target.y, -1.75, 1.75);
      const close = Math.hypot(g * 20 - from.x, from.y) < 7.5;
      const gPos = kBase;
      const lat = Math.abs(ty - gPos.y);
      // rasteira a meia distância do corpo: defesa com o pé, de pé (muito usada no futsal); mais longe, espargata
      let tech: ActKind = lat < 0.45 && target.z < 1.7 ? 'catch' : close && lat < 1.3 ? 'spread' : target.z < 0.4 && lat < 1.0 ? 'footsave' : target.z < 0.55 ? 'splits' : lat > 0.9 || target.z > 1.2 ? 'dive' : 'splits';
      // defesa sem agarrar: tem de se ver o gesto que desvia a bola (nunca a bola a atravessar o GR)
      if (res === 'saved' && !caught && tech === 'catch') tech = target.z > 1.1 ? 'dive' : close ? 'spread' : 'splits';
      gkTech = tech;
      const react = rush ? 0 : clamp(0.2 - this.au(gk, 'reflexos') * 0.1, 0.08, 0.2);
      // o corpo desloca-se de lado (sem recuar para a baliza) até a mão/perna ficar na bola
      const sy = Math.sign(ty - gPos.y) || 1;
      const reach = tech === 'dive' ? 0.9 : tech === 'splits' ? 0.75 : tech === 'footsave' ? 0.65 : 0;
      const ky = res === 'saved' || res === 'post' ? ty - sy * reach : tech === 'spread' ? lerp(gPos.y, ty, 0.3) : lerp(gPos.y, ty - sy * reach, res === 'goal' ? 0.55 : 0.7);
      const tgt = { x: gkX, y: clamp(rush || tightShot ? lerp(kBase.y, ky, 0.35) : ky, -1.8, 1.8) };
      if (rush) this.label(T - 0.2, `${this.nm(gk)} sai ao encontro do atacante`);
      const tR = T + Math.min(react, Math.max(0, fl - 0.12));
      this.later.push(() => {
        const g0 = this.P(gk, T - 0.15);
        this.fix(gk, T - (rush ? 0.9 : 0.2), T + fl + 1.6);
        // a saída começa antes do remate (lê o 1x1); sem saída fica fixo, apoiado, até reagir
        if (rush) { const g1 = this.P(gk, T - 0.9); this.key(gk, T - 0.9, g1); this.key(gk, T - 0.05, kBase); }
        else { const set = { x: lerp(g0.x, kBase.x, 0.7), y: lerp(g0.y, kBase.y, 0.7) }; this.key(gk, T - 0.2, set); this.key(gk, tR, set); }
        this.key(gk, T + fl, tgt, true);
        this.key(gk, T + fl + 1.3, tgt);
      });
      // a extensão máxima coincide com a chegada da bola
      const peak = tech === 'dive' ? 0.42 : tech === 'splits' ? 0.31 : tech === 'footsave' ? 0.35 : 0.29;
      if (tech === 'catch') this.act(gk, 'catch', tR, T + fl + 0.8, { face: shooter, h: target.z });
      else this.act(gk, tech, tR, tR + Math.max(0.12, fl - (tR - T) + 0.05) / peak, { to: { x: target.x, y: target.y }, h: target.z, face: shooter });
      if (res === 'saved' && tech !== 'catch') this.bigSave = T;
      if (res === 'saved' && tech !== 'catch') this.label(T + fl, tech === 'dive' ? `Voo de ${this.nm(gk)} ao ângulo!` : tech === 'footsave' ? `${this.nm(gk)} defende com o pé` : tech === 'splits' ? `${this.nm(gk)} defende com a perna, em espargata` : `${this.nm(gk)} fecha o ângulo em cruz`);
    }
    if (res === 'blocked' && a.other && this.tr.has(a.other)) {
      const bl = a.other;
      this.later.push(() => {
        this.fix(bl, T - 0.7, T + 0.8);
        this.key(bl, T - 0.4, { x: target.x + g * 0.8, y: target.y + 0.7 });
        this.key(bl, T + fl, { x: target.x + g * 0.35, y: target.y });
        this.key(bl, T + 0.8, { x: target.x + g * 0.35, y: target.y });
      });
      this.act(bl, 'block', T - 0.35, T + 0.6, { face: shooter });
      this.label(T + fl, `Remate bloqueado por ${this.nm(bl)}`);
    }

    let tEnd = T + fl;
    if (caught && gk) {
      // o GR agarra, levanta-se (se mergulhou) e repõe a bola à mão para um colega aberto na ala
      // no chão (voo/espargata) agarra junto ao chão; de pé, agarra à altura do peito
      const dived = gkTech === 'dive' || gkTech === 'splits';
      this.balls.push({ k: 'hands', t0: tEnd, id: gk, z: dived ? 0.45 : 1.0 });
      this.label(tEnd, `${this.nm(gk)} agarra a bola`);
      const tUp = tEnd + (dived ? 1.4 : 0.6);
      this.balls.push({ k: 'hands', t0: tUp, id: gk, z: 1.0 });
      const mates = this.p.onCourt[keeperSide].slice(1).filter((x): x is string => !!x && this.tr.has(x));
      if (!mates.length) { this.endGk = gk; return tUp + 0.6; }
      // reposição rápida à mão: ala aberta (curta), fixo ao meio (rolada) ou longa para o pivô/ala do lado contrário (contra-ataque)
      const sgn = r() < 0.5 ? -1 : 1;
      const opts: P2[] = [{ x: g * 11.5, y: sgn * 7.2 }, { x: g * 13, y: (r() - 0.5) * 3 }, { x: g * 2, y: -sgn * 6.5 }];
      const weights = [0.5, 0.25, 0.25 + 0.2 * this.au(gk, 'jogoPes')];
      // escolhe a opção com mais espaço (adversário mais próximo do ponto de receção), com preferência por estilo
      const opp = [...this.attOut, ...this.defOut].filter((d) => this.sideOf.get(d) !== keeperSide);
      const room = (q: P2) => Math.min(6, ...opp.map((d) => dist(this.P(d, tEnd), q)));
      const si = [0, 1, 2].reduce((x, y) => (room(opts[y]) + weights[y] * 3 + r() > room(opts[x]) + weights[x] * 3 + r() ? y : x));
      const spot = opts[si];
      const mate = mates.reduce((x, y) => (dist(this.P(y, T), spot) < dist(this.P(x, T), spot) ? y : x));
      const tThrow = tUp + 0.7 + r() * 0.5;
      const thrD = dist({ x: g * 18.6, y: 0 }, spot);
      const thrT = thrD < 9 ? thrD / 9 : 0.25 + thrD / 15; // rolada curta ~9 m/s; lançamento ~15 m/s
      this.later.push(() => {
        this.key(mate, tThrow + thrT, spot);
        this.key(gk, tUp + 0.4, { x: g * 18.6, y: clamp(this.P(gk, tEnd).y, -1.5, 1.5) });
      });
      this.act(gk, 'throw', tThrow - 0.6, tThrow + 0.2, { face: mate });
      this.balls.push({ k: 'pass', t0: tThrow, t1: tThrow + thrT, from: gk, to: mate, lift: thrD < 9 ? 0.03 : 0.12 + thrD * 0.03 });
      this.balls.push({ k: 'foot', t0: tThrow + thrT, id: mate });
      this.label(tThrow - 0.4, `${this.nm(gk)} repõe a bola com a mão`);
      return tThrow + thrT + 0.35;
    }
    const fl2 = res === 'goal' ? 0.25 : 0.8;
    this.balls.push({ k: 'fly', t0: tEnd, t1: tEnd + fl2, from: target, b: after, lift: res === 'goal' ? 0 : 0.5 });
    this.balls.push({ k: 'still', t0: tEnd + fl2, at: after });
    if (res === 'post') this.label(tEnd, 'Ao poste!');
    if (res === 'goal') {
      this.lastGoal = true;
      this.label(tEnd, `GOLO de ${this.nm(shooter)}!`);
    }
    if (spill && res === 'saved') { this.label(tEnd, `${this.nm(gk)} defende para a frente... ressalto!`); return tEnd + 0.5; }
    if ((res === 'wide' || res === 'saved') && gk && !this.p.flying[keeperSide]) this.endGk = gk;
    tEnd += fl2 + 0.3;
    return tEnd;
  }

  // ---------- bolas paradas e lances seguintes ----------
  private restarts(T: number, ending: Ending): number {
    const p = this.p;
    const att = this.att;
    const first = p.actions[0];
    const rest = p.actions.slice(first ? 1 : 0);
    if (ending.kind === 'shot' && ending.shot?.result === 'goal') return this.celebrate(T, ending.shot.shooter!, att);
    let foulPending = ending.kind === 'foul';
    for (let i = 0; i < rest.length; i++) {
      const a = rest[i];
      if (a.type === 'brawl') {
        T = this.brawl(T, a);
        continue;
      }
      if (a.type === 'corner') {
        const nx = rest[i + 1];
        const withShot = nx && nx.type === 'shot' && nx.side === att && nx.kind === 'setpiece' ? nx : undefined;
        T = this.corner(T, a.shooter!, withShot);
        if (withShot) {
          i++;
          if (withShot.result === 'goal') return this.celebrate(T, withShot.shooter!, att);
        } else T = this.clearance(T);
        continue;
      }
      if (a.type !== 'shot') continue;
      if (a.kind === 'rebound') {
        T = this.rebound(T, a);
        if (a.result === 'goal') return this.celebrate(T, a.shooter!, att);
        continue;
      }
      if (a.side !== att) {
        // contra-ataque do adversário (perda num canto) ou remate à baliza deserta
        T = this.oppShot(T, a);
        if (a.result === 'goal') return this.celebrate(T, a.shooter!, a.side);
        continue;
      }
      if (a.kind === 'free10' || a.kind === 'penalty') {
        T = this.spotKick(T, a);
        foulPending = false;
        if (a.result === 'goal') return this.celebrate(T, a.shooter!, att);
        continue;
      }
      if (a.kind === 'setpiece' && foulPending) {
        T = this.freeKick(T, a);
        foulPending = false;
        if (a.result === 'goal') return this.celebrate(T, a.shooter!, att);
      }
    }
    if (foulPending && ending.foul?.kind !== 'free10' && ending.foul?.kind !== 'penalty') T = this.freeKick(T, null);
    return T;
  }

  /** Posições de todos num instante, com marcação "hold" (chegada obrigatória). */
  private placeAll(t: number, m: Map<string, P2>, hold = true) {
    for (const [id, p] of m) { this.key(id, t, p, hold); this.fix(id, t - 0.1, t + 0.1); }
  }

  private corner(T: number, taker: string, sh?: Action): number {
    const r = this.r;
    const att = this.att;
    const routine = this.tactics[att].setPieces?.cornerRoutine ?? 'primeiro_poste';
    const s = this.ballAt(T).y >= 0 ? 1 : -1; // lado do canto
    const spot: Ball = { x: this.dirA * 19.75, y: s * 9.75, z: 0.11 };
    // quem marca vai buscar a bola onde ela parou e leva-a à mão até ao canto (nada é reposto sozinho)
    const b0 = this.ballAt(T);
    const tp0 = this.P(taker, T);
    const tPick = T + clamp(dist(tp0, b0) / 6, 0.5, 2.6);
    const tPlace = tPick + clamp(dist(b0, spot) / 4.5, 0.4, 2.5);
    const tSet = Math.max(T + 3.4, tPlace + 0.6); // organização
    const tKick = tSet + 0.9;
    this.key(taker, tPick, { x: b0.x, y: b0.y }, true);
    this.key(taker, tPlace, { x: spot.x + this.dirA * 0.5, y: spot.y + Math.sign(spot.y) * 0.5 }, true);
    this.fix(taker, T, tKick);
    this.balls.push({ k: 'still', t0: T, at: { x: b0.x, y: b0.y, z: 0.11 } });
    this.balls.push({ k: 'hands', t0: tPick, id: taker, z: 0.95 });
    this.balls.push({ k: 'still', t0: tPlace, at: spot });
    const NAMES = { primeiro_poste: 'ao primeiro poste', remate_fora: 'remate de fora', bloqueio_pivo: 'bloqueio para o pivô', curto: 'canto curto', personalizado: 'jogada desenhada' };
    this.phase(T, `Canto (${NAMES[routine]})`);
    this.label(T + 0.4, `Canto para ${this.nm(taker)} marcar`);
    const others = this.attOut.filter((x) => x !== taker);
    const cpC = this.tactics[att].setPieces?.customCorner;
    if (routine === 'personalizado' && cpC) return this.customPlay(T, taker, this.A(40.3, s * 10.35), s, tSet, tKick, sh, cpC);
    const shooter = sh && others.includes(sh.shooter!) ? sh.shooter! : others[Math.floor(r() * others.length)];
    const rest = others.filter((x) => x !== shooter);
    const m = new Map<string, P2>();
    m.set(taker, this.A(40.3, s * 10.35));
    // organização ofensiva (conforme a jogada ensaiada)
    let shotSpot: P2, startShooter: P2;
    const roles: P2[] = [];
    if (routine === 'primeiro_poste') {
      startShooter = this.A(32.5, s * 4.5); shotSpot = this.A(38.1, s * 1.9);
      roles.push(this.A(30, 0), this.A(33.5, -s * 3.5));
    } else if (routine === 'remate_fora') {
      startShooter = this.A(26.5, s * 2); shotSpot = this.A(30, s * 1.2);
      // bloqueios colados ao GR, a tapar-lhe a visão do remate (como nos cantos ensaiados reais)
      roles.push(this.A(37.6, s * 0.5), this.A(36.9, -s * 1.3));
    } else if (routine === 'bloqueio_pivo') {
      startShooter = this.A(33.5, 0); shotSpot = this.A(36.6, s * 2.4);
      roles.push(this.A(34, s * 2), this.A(29.5, -s * 2));
    } else {
      startShooter = this.A(31.5, s * 2.5); shotSpot = this.A(33.5, s * 3.5);
      roles.push(this.A(37, s * 7.6), this.A(30.5, -s * 3));
    }
    m.set(shooter, startShooter);
    rest.forEach((id, i) => m.set(id, roles[i] ?? this.A(24, (i - 1) * 4)));
    if (this.gkA) m.set(this.gkA, this.A(4, 0));
    // organização defensiva: zona mista (1.º poste, centro, 2.º poste, homem de fora); GR junto ao 1.º poste
    const dSpots = [this.A(36.8, s * 3.6), this.A(34.6, s * 0.3), this.A(36.2, -s * 2.8), this.A(31.2, s * 1.2)];
    const dIds = [...this.defOut];
    // quem defende o homem de fora fica com o rematador quando ele está fora da área
    dIds.forEach((id, i) => m.set(id, dSpots[i] ?? this.A(28, 0)));
    if (this.gkD) m.set(this.gkD, this.A(39.5, s * 0.9));
    this.placeAll(tSet, m);
    for (const [id, p2] of m) this.key(id, tKick - 0.15, p2, true);
    this.label(tSet - 1.6, 'Organização ofensiva e defensiva para o canto');

    // execução
    this.act(taker, 'pass', tKick - 0.25, tKick + 0.15, { face: shooter });
    const tr = tKick + (routine === 'curto' ? 0.45 : 0.75);
    if (routine === 'primeiro_poste') {
      this.act(shooter, 'run', tKick - 0.5, tr, { to: shotSpot });
      this.key(rest[0] ?? shooter, tr, this.A(33, s * 1.5));
      if (rest[1]) this.key(rest[1], tr, this.A(37.5, -s * 1.6));
      this.label(tKick, `Bola tensa ao primeiro poste para ${this.nm(shooter)}`);
    } else if (routine === 'remate_fora') {
      // dois bloqueios dentro da área, passe atrasado para o remate de primeira
      rest.forEach((id) => this.act(id, 'screen', tKick - 0.3, tr + 0.5, { face: shooter }));
      this.act(shooter, 'run', tKick - 0.5, tr, { to: shotSpot });
      this.label(tKick, `Passe atrasado para o remate de ${this.nm(shooter)}`);
    } else if (routine === 'bloqueio_pivo') {
      if (rest[0]) { this.key(rest[0], tKick + 0.1, this.A(35.5, s * 1)); this.act(rest[0], 'screen', tKick - 0.1, tr + 0.4, { face: taker }); }
      this.act(shooter, 'run', tKick - 0.2, tr, { to: shotSpot });
      this.label(tKick - 0.2, `Bloqueio de ${this.nm(rest[0])} para libertar ${this.nm(shooter)}`);
    } else {
      // curto: aproximação ao marcador, passe curto e remate de quem chega
      if (rest[0]) this.key(rest[0], tKick + 0.2, this.A(37, s * 6.8));
      this.act(shooter, 'run', tKick - 0.3, tr, { to: shotSpot });
      this.label(tKick, 'Canto jogado curto');
    }
    this.key(shooter, tr, shotSpot);
    this.key(taker, tr + 0.6, this.A(37.5, s * 8));
    this.pass(taker, shooter, tKick, tr, routine === 'remate_fora' ? 0.03 : 0.06);
    // reação defensiva: o defensor mais próximo ataca o rematador
    const near = dIds.reduce((x, y) => (dist(m.get(y)!, shotSpot) < dist(m.get(x)!, shotSpot) ? y : x), dIds[0]);
    if (near) this.key(near, tr + 0.25, { x: lerp(m.get(near)!.x, shotSpot.x, 0.7), y: lerp(m.get(near)!.y, shotSpot.y, 0.7) });
    for (const id of dIds) if (id !== near) this.key(id, tr + 0.5, { x: m.get(id)!.x, y: lerp(m.get(id)!.y, shotSpot.y, 0.25) });
    if (!sh) {
      this.attKeysAt(tr + 1.2, new Set([shooter, taker]));
      return tr;
    }
    const tShot = tr + (routine === 'curto' ? 0.55 : 0.05);
    if (routine === 'curto') {
      this.act(shooter, 'feint', tr, tShot, { ang: angTo(shotSpot, this.A(40, 0)) });
      this.key(shooter, tShot, this.A(33.3, s * 2.5));
    }
    return this.shot(tShot, shooter, sh, this.dirA);
  }

  /** Jogada desenhada pelo treinador (cantos e livres): posições, setas (movimentos) e tracejados (passes). */
  private customPlay(T: number, taker: string, takerAt: P2, s: number, tSet: number, tKick: number, sh: Action | undefined | null, cp: CustomPlay): number {
    const att = this.att;
    const others = this.attOut.filter((x) => x !== taker);
    // jogadores nas funções: o escolhido (se estiver em campo) ou o mais indicado dos restantes
    const free = [...others];
    const ids: string[] = cp.slots.map((sl) => {
      const want = sl.player && free.includes(sl.player) ? sl.player : sl.role === 'rematador' && sh?.shooter && free.includes(sh.shooter) ? sh.shooter : free[0];
      free.splice(free.indexOf(want), 1);
      return want;
    }).filter(Boolean);
    const P = (q: { x: number; y: number }) => this.A(q.x, s * q.y);
    const m = new Map<string, P2>();
    m.set(taker, takerAt);
    cp.slots.forEach((sl, i) => { if (ids[i]) m.set(ids[i], P(sl)); });
    free.forEach((id, i) => m.set(id, this.A(22, (i - 0.5) * 6)));
    if (this.gkA) m.set(this.gkA, this.A(4, 0));
    // defesa: zona perto da baliza, a acompanhar as posições desenhadas
    const dIds = [...this.defOut];
    dIds.forEach((id, i) => { const near = ids[i] ? m.get(ids[i])! : this.A(34, 0); m.set(id, { x: lerp(near.x, this.A(39, 0).x, 0.35), y: near.y * 0.8 }); });
    if (this.gkD) m.set(this.gkD, this.A(39.5, s * 0.9));
    this.placeAll(tSet, m);
    for (const [id, p2] of m) this.key(id, tKick - 0.15, p2, true);
    this.label(tSet - 1.6, 'Jogada ensaiada desenhada pelo treinador');
    const tr = tKick + 0.8;
    // setas: movimentos; o bloqueio faz bloqueio
    for (const path of cp.paths.filter((x) => x.kind === 'run' && x.from >= 0)) {
      const id = ids[path.from];
      if (!id) continue;
      this.key(id, tr, P(path.to));
      this.act(id, cp.slots[path.from].role === 'bloqueio' ? 'screen' : 'run', tKick - 0.4, tr, cp.slots[path.from].role === 'bloqueio' ? { face: taker } : { to: P(path.to) });
    }
    cp.slots.forEach((sl, i) => { if (sl.role === 'bloqueio' && ids[i] && !cp.paths.some((x) => x.from === i && x.kind === 'run')) this.act(ids[i], 'screen', tKick - 0.3, tr + 0.4, { face: taker }); });
    // tracejados: passes (o do marcador vai para quem acaba mais perto do fim do tracejado)
    const pass0 = cp.paths.find((x) => x.kind === 'pass' && x.from === -1);
    const endOf = (i: number) => { const rp = cp.paths.find((x) => x.kind === 'run' && x.from === i); return P(rp ? rp.to : cp.slots[i]); };
    const recvIdx = pass0 ? cp.slots.map((_, i) => i).filter((i) => ids[i]).sort((a, b) => dist(endOf(a), P(pass0.to)) - dist(endOf(b), P(pass0.to)))[0] : cp.slots.findIndex((x) => x.role === 'rematador');
    const receiver = ids[recvIdx] ?? ids[0] ?? others[0];
    this.key(receiver, tr, endOf(recvIdx));
    this.pass(taker, receiver, tKick, tr, 0.05);
    let shooter = receiver, tShot = tr + 0.05;
    const pass2 = cp.paths.find((x) => x.kind === 'pass' && x.from === recvIdx);
    if (pass2) {
      const j = cp.slots.map((_, i) => i).filter((i) => ids[i] && i !== recvIdx).sort((a, b) => dist(endOf(a), P(pass2.to)) - dist(endOf(b), P(pass2.to)))[0];
      if (j !== undefined && ids[j]) { this.key(ids[j], tr + 0.6, endOf(j)); this.pass(receiver, ids[j], tr + 0.1, tr + 0.6, 0.05); shooter = ids[j]; tShot = tr + 0.65; }
    }
    this.label(tKick, `Jogada desenhada: ${this.nm(taker)} para ${this.nm(receiver)}`);
    if (!sh) { this.attKeysAt(tShot + 1.2, new Set([shooter, taker])); return tShot; }
    // o motor decide quem remata; se for outro, a bola ainda lhe chega num último passe
    const realShooter = sh.shooter && this.attOut.includes(sh.shooter) ? sh.shooter : shooter;
    if (realShooter !== shooter) { const sp = this.P(realShooter, tShot); this.pass(shooter, realShooter, tShot, tShot + 0.5, 0.05); this.key(realShooter, tShot + 0.5, sp); tShot += 0.55; }
    void att;
    return this.shot(tShot, realShooter, sh, this.dirA);
  }

  /** A defesa afasta a bola depois de um canto ou livre sem remate. */
  private clearance(T: number): number {
    const def = this.defOut;
    if (!def.length) return T;
    const ball = this.ballAt(T);
    const cl = def.reduce((x, y) => (dist(this.P(y, T), ball) < dist(this.P(x, T), ball) ? y : x), def[0]);
    const cp = this.P(cl, T);
    this.key(cl, T + 0.4, { x: lerp(cp.x, ball.x, 0.85), y: lerp(cp.y, ball.y, 0.85) });
    this.balls.push({ k: 'foot', t0: T + 0.4, id: cl });
    this.act(cl, 'pass', T + 0.45, T + 0.8, { ang: this.dirA > 0 ? -Math.PI / 2 : Math.PI / 2 });
    const to: Ball = { x: this.dirA * -2, y: ball.y * 0.4, z: 0.1 };
    this.balls.push({ k: 'fly', t0: T + 0.6, t1: T + 1.6, from: cl, b: to, lift: 1.6 });
    this.balls.push({ k: 'still', t0: T + 1.6, at: to });
    this.label(T + 0.5, `${this.nm(cl)} afasta o perigo`);
    // quem recupera fica com a bola para a posse seguinte
    const rec = def.filter((x) => x !== cl).reduce((x, y) => (dist(this.P(y, T), to) < dist(this.P(x, T), to) ? y : x), def.find((x) => x !== cl) ?? cl);
    this.key(rec, T + 1.8, { x: to.x, y: to.y - 0.3 });
    this.balls.push({ k: 'foot', t0: T + 1.8, id: rec });
    for (const id of this.attOut) this.key(id, T + 2.0, this.slotPos(this.slot.get(id) ?? 0, T + 2, 0));
    return T + 2.0;
  }

  private freeKick(T: number, sh: Action | null): number {
    const r = this.r;
    const att = this.att;
    const ball = this.ballAt(T);
    const routine = this.tactics[att].setPieces?.freeKickRoutine ?? 'remate_direto';
    let at: P2 = { x: ball.x, y: ball.y };
    // o livre marca-se no local da falta (só se corrige se a bola estiver dentro da área, que seria penálti)
    if (this.U(at) > 31.5 - Math.max(0, Math.abs(at.y) - 3) * 0.4) at = this.A(31.5 - Math.max(0, Math.abs(at.y) - 3) * 0.4, clamp(at.y, -8, 8));
    const bu = this.U(at);
    const kicker = sh ? (sh.assist && this.attOut.includes(sh.assist) ? sh.assist : sh.shooter!) : this.nearestOut(at, T);
    const shooter = sh?.shooter && this.attOut.includes(sh.shooter) ? sh.shooter : kicker;
    // quem marca vai buscar a bola (se rolou) e pousa-a no sítio da falta
    const kp0 = this.P(kicker, T);
    const tPick = T + clamp(dist(kp0, ball) / 5.5, 0.4, 1.8);
    const tPlace = tPick + clamp(dist(ball, at) / 4.5, 0.3, 1.6);
    const tSet = Math.max(T + (sh ? 2.8 : 1.4), tPlace + 0.5);
    const tKick = tSet + (sh ? 0.9 : 0.3);
    this.balls.push({ k: 'still', t0: T, at: { x: ball.x, y: ball.y, z: 0.11 } });
    this.key(kicker, tPick, { x: ball.x, y: ball.y }, true);
    this.balls.push({ k: 'hands', t0: tPick, id: kicker, z: 0.95 });
    this.key(kicker, tPlace, { x: at.x, y: at.y }, true);
    this.balls.push({ k: 'still', t0: tPlace, at: { ...at, z: 0.11 } });
    this.fix(kicker, T, tPlace + 0.1);
    // jogada desenhada pelo treinador (só quando há remate a sério; livre do lado +y, espelhado se a falta for do outro lado)
    const cpF = this.tactics[att].setPieces?.customFk;
    if (routine === 'personalizado' && cpF && sh) { this.key(kicker, tSet, at, true); this.fix(kicker, T, tKick + 0.3); return this.customPlay(T, kicker, at, at.y >= 0 ? 1 : -1, tSet, tKick + 0.4, sh, cpF); }
    const m = new Map<string, P2>();
    const g = this.A(40, 0);
    const gl = dist(at, g) || 1;
    const toG = { x: (g.x - at.x) / gl, y: (g.y - at.y) / gl };
    const perp = { x: -toG.y, y: toG.x };
    m.set(kicker, { x: at.x - toG.x * 0.9, y: at.y - toG.y * 0.9 });
    const others = this.attOut.filter((x) => x !== kicker);
    if (!sh) {
      // reposição rápida: passe curto para um colega
      const mate = others.reduce((x, y) => (dist(this.P(y, T), at) < dist(this.P(x, T), at) ? y : x), others[0] ?? kicker);
      this.key(kicker, tSet, m.get(kicker)!, true);
      this.fix(kicker, T, tKick + 0.3);
      this.act(kicker, 'pass', tKick - 0.2, tKick + 0.15, { face: mate });
      this.pass(kicker, mate, tKick, tKick + 0.7);
      this.label(T + 0.3, `Livre marcado por ${this.nm(kicker)}`);
      return tKick + 0.7;
    }
    this.phase(T, 'Livre direto');
    const barrier = bu > 22;
    const dIds = [...this.defOut];
    if (barrier) {
      // barreira a 5 m, entre a bola e a baliza; o GR cobre o outro lado
      const b0 = { x: at.x + toG.x * 5, y: at.y + toG.y * 5 };
      if (dIds[0]) m.set(dIds[0], { x: b0.x + perp.x * 0.32, y: b0.y + perp.y * 0.32 });
      if (dIds[1]) m.set(dIds[1], { x: b0.x - perp.x * 0.32, y: b0.y - perp.y * 0.32 });
      this.label(tSet - 1.2, 'Barreira a 5 metros');
    }
    const s = at.y >= 0 ? 1 : -1;
    if (routine === 'jogada_ensaiada' && shooter !== kicker) m.set(shooter, { x: at.x + perp.x * 3 - toG.x * 1.5, y: at.y + perp.y * 3 - toG.y * 1.5 });
    else if (shooter !== kicker) m.set(shooter, this.A(33.5, -s * 4));
    others.filter((x) => x !== shooter).forEach((id, i) => m.set(id, i === 0 ? this.A(36, -s * 3) : this.A(bu - 4, s * 6)));
    dIds.slice(barrier ? 2 : 0).forEach((id, i) => {
      const a = [...m.entries()].filter(([k]) => this.sideOf.get(k) === att && k !== kicker)[i];
      m.set(id, a ? { x: a[1].x + this.dirA * 1.4, y: a[1].y * 0.9 } : this.A(34, 0));
    });
    // com barreira o GR cobre o lado contrário; sem barreira fica no ângulo da bola
    if (this.gkD) m.set(this.gkD, barrier ? this.A(39.4, clamp(-s * 0.7, -1.3, 1.3)) : this.gkSpot(this.dirA * 20, at, 1.3));
    if (this.gkA) m.set(this.gkA, this.A(4, 0));
    this.placeAll(tSet, m);
    for (const [id, p2] of m) this.key(id, tKick - 0.2, p2, true);
    let tShot = tKick;
    if (routine === 'remate_direto' || shooter === kicker) {
      this.label(tSet - 0.3, `${this.nm(kicker)} prepara o remate direto`);
      this.key(kicker, tKick, { x: at.x - toG.x * 0.4, y: at.y - toG.y * 0.4 });
      this.balls.push({ k: 'foot', t0: tKick - 0.05, id: kicker });
    } else if (routine === 'jogada_ensaiada') {
      // toque curto para o lado e remate de quem chega
      const sp = { x: at.x + perp.x * 2.2 + toG.x * 0.6, y: at.y + perp.y * 2.2 + toG.y * 0.6 };
      this.act(kicker, 'pass', tKick - 0.2, tKick + 0.1, { face: shooter });
      this.pass(kicker, shooter, tKick, tKick + 0.45, 0.02);
      this.key(shooter, tKick + 0.45, sp);
      this.act(shooter, 'run', tKick - 0.3, tKick + 0.45, { to: sp });
      tShot = tKick + 0.5;
      this.label(tKick - 0.3, `Jogada ensaiada: ${this.nm(kicker)} toca para ${this.nm(shooter)}`);
    } else {
      // cruzamento ao segundo poste
      const sp = this.A(37.4, -s * 2);
      this.act(kicker, 'pass', tKick - 0.2, tKick + 0.15, { face: shooter });
      this.pass(kicker, shooter, tKick, tKick + 0.75, 0.6);
      this.key(shooter, tKick + 0.75, sp);
      this.act(shooter, 'run', tKick - 0.4, tKick + 0.75, { to: sp });
      tShot = tKick + 0.78;
      this.label(tKick - 0.3, `Cruzamento ao segundo poste para ${this.nm(shooter)}`);
    }
    return this.shot(tShot, shooter, sh, this.dirA);
  }

  /** Livre direto de 10 m (6.ª falta) ou penálti (6 m): todos atrás da linha da bola, a 5 m. */
  private spotKick(T: number, a: Action): number {
    const pen = a.kind === 'penalty';
    const d = pen ? 6 : 10;
    const att = this.att;
    const at = this.A(40 - d, 0);
    const kicker = a.shooter!;
    const tSet = T + (pen ? 5.0 : 3.0); // no penálti os jogadores ainda vão até ao meio-campo
    const tKick = tSet + 1.0;
    this.phase(T, pen ? 'Penálti' : 'Livre direto de 10 metros');
    this.label(T + 0.3, pen ? `Penálti: ${this.nm(kicker)}` : `Livre de 10 m: ${this.nm(kicker)} na marca`);
    this.balls.push({ k: 'fly', t0: T, t1: T + 1.2, from: this.ballAt(T), b: { ...at, z: 0.11 }, lift: 0.3 });
    this.balls.push({ k: 'still', t0: T + 1.2, at: { ...at, z: 0.11 } });
    const m = new Map<string, P2>();
    m.set(kicker, this.A(40 - d - 2.2, 0.6));
    const line = 40 - d - 1.2; // atrás da linha da bola, fora da área
    const lanes = [-8.6, -6.4, 6.4, 8.6, -4.6, 4.6];
    let li = 0;
    for (const id of [...this.attOut.filter((x) => x !== kicker), ...this.defOut]) {
      const v = lanes[li++ % lanes.length];
      // penálti: os outros esperam na linha do meio-campo (pedido do António); livre de 10 m: atrás da bola, a 5 m (regra)
      if (pen) m.set(id, this.A(-0.6 - (li % 2) * 0.8, ((li % 2 ? -1 : 1) * (1.5 + Math.floor(li / 2) * 2.4))));
      else m.set(id, this.A(line - (this.sideOf.get(id) === att ? 1.2 : 0) - (li > 4 ? 2 : 0), v + (this.sideOf.get(id) === att ? 0.6 : -0.6)));
    }
    // penálti: GR sobre a linha de golo (regra); livre de 10 m: o GR sai 1,5-3 m para reduzir o ângulo (pode ir até 5 m da bola)
    if (this.gkD) m.set(this.gkD, pen ? this.A(39.75, 0) : this.A(40 - (1.5 + this.r() * 1.5), 0));
    if (this.gkA) m.set(this.gkA, this.A(3.5, 0));
    this.placeAll(tSet, m);
    for (const [id, p2] of m) this.key(id, tKick - 0.45, p2, true);
    this.key(kicker, tKick, this.A(40 - d - 0.4, 0.15));
    this.balls.push({ k: 'foot', t0: tKick - 0.05, id: kicker });
    const tE = this.shot(tKick, kicker, a, this.dirA);
    // depois do remate todos entram para a recarga (no penálti vêm de longe)
    for (const id of [...this.attOut, ...this.defOut]) if (id !== kicker) this.key(id, tKick + (pen ? 1.6 : 1.0), { x: m.get(id)!.x + this.dirA * (pen ? 6 : 1.8), y: m.get(id)!.y * 0.7 });
    return tE;
  }

  /** Confronto depois de uma falta: os jogadores juntam-se, empurram-se, os árbitros entram para separar
   *  e mostram os cartões. */
  private brawl(T: number, a: Action): number {
    const who = (a.players ?? []).filter((id) => this.tr.has(id));
    if (who.length < 2) return T;
    const c = this.ballAt(T);
    const center = { x: clamp(c.x, -15, 15), y: clamp(c.y, -7, 7) };
    this.phase(T, 'Confronto!');
    this.label(T + 0.2, `Confronto: ${this.nm(who[0])} e ${this.nm(who[1])}${who.length > 2 ? ` (+${who.length - 2})` : ''}`);
    who.forEach((id, i) => {
      const ang = (i / who.length) * Math.PI * 2 + (i % 2 ? 0.4 : 0);
      const rad = i < 2 ? 0.45 : 0.9 + (i % 3) * 0.35;
      const spot = { x: center.x + Math.cos(ang) * rad, y: center.y + Math.sin(ang) * rad };
      this.key(id, T + 1.2 + i * 0.12, spot);
      this.key(id, T + 3.6, { x: spot.x + Math.cos(ang) * 0.3, y: spot.y + Math.sin(ang) * 0.3 });
      this.act(id, 'shove', T + 1.0 + i * 0.12, T + 3.4, { face: who[i === 0 ? 1 : 0] });
    });
    // os árbitros entram a separar e apitam
    REFS.forEach((id, k) => {
      this.key(id, T + 1.6, { x: center.x + (k ? 0.6 : -0.6), y: center.y + (k ? 0.3 : -0.3) });
      this.key(id, T + 4.0, { x: center.x + (k ? 1.4 : -1.4), y: center.y + (k ? 1.2 : -1.2) });
      this.act(id, 'whistle', T + 1.6, T + 4.2, { face: who[0] });
    });
    for (const [i, cd] of (a.cards ?? []).entries()) this.label(T + 4.2 + i * 0.7, `${cd.red ? 'Cartão vermelho' : 'Cartão amarelo'} para ${this.nm(cd.id)}`);
    // cada um volta ao seu lugar
    const back = T + 4.6 + (a.cards?.length ?? 0) * 0.7;
    for (const id of who) this.key(id, back + 1.2, this.restPos(id, 'gk'));
    return back + 1.2;
  }

  /** Remate da outra equipa no mesmo lance (contra-ataque após canto, baliza deserta). */
  // recarga: o atacante mais perto ataca a bola solta e remata logo
  private rebound(T: number, a: Action): number {
    const ball = this.ballAt(T);
    const cand = this.attOut.filter((x) => this.tr.has(x));
    if (!cand.length) return T;
    // vai à recarga quem está perto da bola (o rematador original só se estiver a menos de 6 m); chega a correr (~6,5 m/s)
    const nearest = cand.reduce((x, y) => (dist(this.P(y, T), ball) < dist(this.P(x, T), ball) ? y : x));
    const sh = a.shooter && cand.includes(a.shooter) && dist(this.P(a.shooter, T), ball) < 6 ? a.shooter : nearest;
    const tl = clamp(dist(this.P(sh, T - 0.6), ball) / 6.5, 0.45, 3);
    this.later.push(() => { this.fix(sh, T - 0.6, T + tl + 0.4); this.key(sh, T + tl, { x: ball.x - this.dirA * 0.4, y: ball.y }); });
    this.balls.push({ k: 'foot', t0: T + tl, id: sh });
    this.label(T + 0.1, `${this.nm(sh)} vai à recarga`);
    this.spillNext = false;
    return this.shot(T + tl + 0.15, sh, a, this.dirA);
  }

  private oppShot(T: number, a: Action): number {
    const sh = a.shooter!;
    if (!this.tr.has(sh)) return T;
    const g = -this.dirA;
    const ball = this.ballAt(T);
    const sp = this.P(sh, T);
    this.phase(T, a.kind === 'open' ? 'Baliza deserta!' : 'Contra-ataque');
    this.key(sh, T + 0.5, { x: ball.x, y: ball.y });
    this.balls.push({ k: 'foot', t0: T + 0.5, id: sh });
    let tS = T + 0.9;
    if (a.kind !== 'open') {
      const tgt = { x: g * 9, y: clamp(sp.y * 0.4, -3, 3) };
      const tl = clamp(dist(ball, tgt) / 6.2, 1.2, 3.6);
      this.key(sh, T + 0.5 + tl, tgt);
      tS = T + 0.6 + tl;
      // a equipa que estava a atacar corre para trás
      for (const id of this.attOut) this.key(id, tS, { x: lerp(this.P(id, T).x, g * 12, 0.6), y: this.P(id, T).y * 0.6 });
      for (const id of this.defOut) if (id !== sh) this.key(id, tS, { x: lerp(this.P(id, T).x, g * 10, 0.6), y: this.P(id, T).y * 0.8 });
      this.label(T + 0.6, `${this.nm(sh)} sai em contra-ataque`);
    } else this.label(T + 0.3, `${this.nm(sh)} remata para a baliza deserta`);
    return this.shot(tS, sh, a, g);
  }

  private celebrate(T: number, scorer: string, side: number): number {
    if (!this.tr.has(scorer)) return T + 2;
    const dir = side === this.att ? this.dirA : -this.dirA;
    const sp = this.P(scorer, T);
    const corner = { x: dir * 16, y: (sp.y >= 0 ? 1 : -1) * 9.6 };
    this.phase(T, 'Golo!');
    this.key(scorer, T + 2.2, corner);
    this.act(scorer, 'celebrate', T + 0.3, T + 6.2);
    let i = 0;
    for (const [id, s] of this.sideOf) {
      if (REFS.includes(id)) continue;
      if (id === scorer) continue;
      const p0 = this.P(id, T);
      const gk = id === this.p.onCourt[s][0] && !this.p.flying[s];
      if (s === side && !gk) {
        const a = (i++ / 3) * Math.PI;
        this.key(id, T + 2.6, { x: corner.x - dir * (1 + Math.cos(a)), y: corner.y - Math.sign(corner.y) * (0.8 + Math.sin(a) * 1.2) });
        // abraço: juntam-se ao marcador e ficam a festejar
        this.key(id, T + 4.2, { x: corner.x - dir * (0.5 + Math.cos(a) * 0.4), y: corner.y - Math.sign(corner.y) * (0.5 + Math.sin(a) * 0.5) });
        this.act(id, 'celebrate', T + 2.0, T + 6.2);
      } else if (!gk) this.key(id, T + 4.5, { x: lerp(p0.x, 0, 0.35), y: p0.y * 0.7 }); // quem sofreu volta, cabisbaixo, para o meio-campo
      else this.key(id, T + 4.5, p0, true);
    }
    return T + 6.4;
  }

  // ---------- consulta ----------
  private holderCache: Map<number, string | null> | null = null;
  private holderAt(t: number): string | null {
    if (this.holderCache) {
      const key = Math.round(t * 1000);
      const c = this.holderCache.get(key);
      if (c !== undefined) return c;
      const v = this.holderCalc(t);
      this.holderCache.set(key, v);
      return v;
    }
    return this.holderCalc(t);
  }
  private holderCalc(t: number): string | null {
    let idx = -1;
    for (let i = 0; i < this.balls.length; i++) if (this.balls[i].t0 <= t) idx = i;
    const seg = idx >= 0 ? this.balls[idx] : null;
    if (!seg || (seg.k !== 'foot' && seg.k !== 'hands')) return null;
    // a bola ainda a caminho (transição contínua de ballAt): só é dono quando ela chega ao pé/mãos
    if (idx > 0 && t - seg.t0 < 0.9) {
      const here = this.segAt(seg, t), b = this.ballAt(t);
      if (Math.hypot(here.x - b.x, here.y - b.y) > 0.8) return null;
    }
    return seg.id;
  }

  private foot(id: string, t: number): Ball {
    const p = this.P(id, t);
    const q = this.P(id, t - 0.12);
    const vx = (p.x - q.x) / 0.12, vy = (p.y - q.y) / 0.12;
    const sp = Math.hypot(vx, vy);
    const sd = this.sideOf.get(id) ?? this.att;
    const d = sd === this.att ? this.dirA : -this.dirA;
    // condução: a correr, a bola vai à frente a toques (empurra, o pé volta a alcançá-la);
    // parado ou devagar, bola à sola (arrasta-a de lado, típico do futsal)
    if (sp > 1.5) {
      const rate = 1.4 + sp * 0.22; // toques por segundo
      const ph = (t * rate) % 1;
      const lead = 0.32 + Math.min(1, sp / 7) * 0.75 * Math.sin(ph * Math.PI);
      return { x: p.x + (vx / sp) * lead, y: p.y + (vy / sp) * lead, z: 0.11 };
    }
    const side = Math.sin(t * 2.6) * 0.14;
    const fx = sp > 0.6 ? vx / sp : d, fy = sp > 0.6 ? vy / sp : 0;
    return { x: p.x + fx * 0.3 - fy * side, y: p.y + fy * 0.3 + fx * side, z: 0.11 };
  }

  private ballAt(t: number): Ball {
    let idx = -1;
    for (let i = 0; i < this.balls.length; i++) if (this.balls[i].t0 <= t) idx = i;
    if (idx < 0) idx = 0;
    const seg = this.balls[idx];
    if (!seg) return { x: 0, y: 0, z: 0.11 };
    const here = this.segAt(seg, t);
    // continuidade: quando a bola passa a outro segmento (outro pé, bola parada noutro sítio), nunca salta; faz o
    // caminho em pouco tempo (conduzida/rolada), proporcional à distância
    if (idx > 0) {
      // (vale para todos os segmentos: pé, bola parada, mãos, passe e voo que começam onde a bola ainda não está)
      const prev = this.segAt(this.balls[idx - 1], seg.t0);
      const start = this.segAt(seg, seg.t0);
      const gap = Math.hypot(prev.x - start.x, prev.y - start.y);
      if (gap > 0.3) {
        const tr = Math.min(0.9, 0.12 + gap / 12);
        const k = (t - seg.t0) / tr;
        if (k < 1) { const e = k * k * (3 - 2 * k); return { x: lerp(prev.x, here.x, e), y: lerp(prev.y, here.y, e), z: lerp(prev.z, here.z, e) }; }
      }
    }
    return here;
  }

  private segAt(seg: BSeg, t: number): Ball {
    if (seg.k === 'foot') return this.foot(seg.id, t);
    if (seg.k === 'hands') {
      // bola nas mãos, à frente do peito (virado para o campo): nunca escondida dentro do corpo
      const p = this.P(seg.id, t);
      const q = this.P(seg.id, t - 0.15);
      const vx = p.x - q.x, vy = p.y - q.y, vl = Math.hypot(vx, vy);
      let dx: number, dy: number;
      if (vl > 0.12) { dx = vx / vl; dy = vy / vl; } else { const cl = Math.hypot(p.x, p.y) || 1; dx = -p.x / cl; dy = -p.y / cl; }
      return { x: p.x + dx * 0.34, y: p.y + dy * 0.34, z: seg.z ?? 1.05 };
    }
    if (seg.k === 'still') return seg.at;
    const k = clamp((t - seg.t0) / Math.max(0.01, seg.t1 - seg.t0), 0, 1);
    if (seg.k === 'pass') {
      const a = this.foot(seg.from, seg.t0), b = this.foot(seg.to, seg.t1);
      const len = dist(a, b);
      // rasteiro: a bola sai mais rápida e abranda com o atrito do piso; picado: voo em arco
      const ground = seg.lift < 0.2 && len <= 14 && len / Math.max(0.05, seg.t1 - seg.t0) < 14; // atrito só em passes de velocidade normal
      const kk = ground ? 1 - Math.pow(1 - k, 1.45) : k;
      return { x: lerp(a.x, b.x, kk), y: lerp(a.y, b.y, kk), z: 0.11 + Math.sin(k * Math.PI) * (seg.lift + (len > 14 ? 0.4 : 0)) };
    }
    const a = typeof seg.from === 'string' ? this.foot(seg.from, seg.t0) : seg.from;
    const b = typeof seg.b === 'string' ? { ...this.P(seg.b, seg.t1), z: 1.05 } : seg.b;
    // bola que sai a rolar (ressalto, defesa para canto): abranda; remates e bolas no ar seguem direitos, com pequeno ressalto no fim
    const rolling = a.z < 0.4 && b.z < 0.4 && seg.lift < 0.3;
    const kk = rolling ? 1 - Math.pow(1 - k, 1.6) : k;
    const bounce = !rolling && b.z < 0.3 && k > 0.8 ? Math.abs(Math.sin(((k - 0.8) / 0.2) * Math.PI)) * 0.12 : 0;
    return { x: lerp(a.x, b.x, kk), y: lerp(a.y, b.y, kk), z: Math.max(0.11, lerp(a.z, b.z, k) + Math.sin(k * Math.PI) * seg.lift + bounce) };
  }

  at(ct: number): Frame {
    const t = clamp(ct - this.lead, -this.lead, this.finalT);
    const pos: Record<string, P2> = {};
    for (const [id, tr] of this.tr) pos[id] = tr.at(t);
    const ball = this.ballAt(t);
    let label = '';
    for (const l of this.labels) if (l.t <= t && t - l.t < 2.6) label = l.text;
    let phase = '';
    for (const ph of this.phases) if (ph.t <= t) phase = ph.text;
    const acts: Record<string, Act> = {};
    for (const a of this.acts) {
      if (t < a.t0 || t > a.t1) continue;
      const me = pos[a.id];
      if (!me) continue;
      const ang = a.ang ?? (a.face && pos[a.face] ? angTo(me, pos[a.face]) : a.to ? angTo(me, a.to) : angTo(me, ball));
      acts[a.id] = { kind: a.kind, k: (t - a.t0) / Math.max(0.01, a.t1 - a.t0), ang, to: a.to, h: a.h };
    }
    // quem tem a bola com um adversário encostado protege-a de costas para ele (sola na bola), como nos jogos reais
    const holder = this.holderAt(t);
    // receção orientada: nos primeiros 0,3 s com a bola, o jogador controla-a virado para de onde veio
    if (holder && !acts[holder] && t >= 0 && !this.gkOfAny(holder)) {
      let d = 0;
      while (d < 0.3 && this.holderAt(t - d - 0.05) === holder) d += 0.05;
      if (d < 0.3 && this.holderAt(t - d - 0.05) !== holder) acts[holder] = { kind: 'receive', k: d / 0.3, ang: angTo(pos[holder], this.ballAt(t - d - 0.25)) };
    }
    if (holder && !acts[holder] && t >= 0 && t <= this.D && !this.gkOfAny(holder)) {
      const hp = pos[holder];
      const hq = this.tr.get(holder)!.at(t - 0.2);
      const slow = dist(hp, hq) < 0.5;
      const opp = this.sideOf.get(holder) === this.att ? this.defOut : this.attOut;
      let near: P2 | null = null, nd = 1.15;
      for (const id of opp) { const p = pos[id]; if (p) { const d = dist(p, hp); if (d < nd) { nd = d; near = p; } } }
      if (near && slow) {
        acts[holder] = { kind: 'shield', k: 0.5, ang: angTo(near, hp) };
        // o defensor encostado tenta tirar a bola (perna por um dos lados, braço nas costas)
        const nid = opp.find((id) => pos[id] && pos[id].x === near!.x && pos[id].y === near!.y);
        if (nid && !acts[nid]) acts[nid] = { kind: 'poke', k: 0.5, ang: angTo(near, hp) };
      }
    }
    return { pos, ball, holder, stoppage: t < 0 || t > this.D, label, phase, acts };
  }
}
