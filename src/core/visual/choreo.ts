// Coreografia de uma posse: transforma o que o motor decidiu numa jogada visível,
// com a bola a passar de jogador em jogador, a equipa que ataca a subir com os 4
// e a que defende a fechar com os 4 entre a bola e a baliza, conforme as táticas.
// É a mesma para o 2D e para o 3D.
//
// Coordenadas em metros: x de -20 a 20 (comprimento), y de -10 a 10 (largura).
import type { Action, Possession } from '../engine/match';
import type { Tactics } from '../tactics';

export interface P2 { x: number; y: number }
export interface Ball { x: number; y: number; z: number }

export interface Frame {
  pos: Record<string, P2>; // posição de cada jogador em campo
  ball: Ball;
  holder: string | null;
  stoppage: boolean; // bola parada (relógio parado)
  label: string; // ação em curso (para legendas)
}

export interface StartState {
  holder: string | null;
  ball: P2;
}

// u: distância à própria baliza (0 a 40); v: largura (-10 a 10)
type UV = [number, number];

const ATTACK: Record<Tactics['system'], UV[]> = {
  '3-1': [[21, 0], [27, -7.5], [27, 7.5], [35, 0]],
  '4-0': [[22, -3.5], [26, -8.5], [26, 8.5], [22, 3.5]],
  '2-2': [[22, -4.5], [32, -5.5], [32, 5.5], [22, 4.5]],
  '1-2-1': [[20, 0], [28, -7], [28, 7], [35, 0]],
};
const FLYING: UV[] = [[23, 0], [27, -7.5], [27, 7.5], [34, -3.5], [34, 3.5]];
const DEFENSE: Record<Tactics['pressure'], UV[]> = {
  baixa: [[8, 0], [11, -4.5], [11, 4.5], [14.5, 0]],
  media: [[11, 0], [15, -5], [15, 5], [19.5, 0]],
  alta: [[18, 0], [23, -6], [23, 6], [28, 0]],
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const ease = (k: number) => k * k * (3 - 2 * k);
const dist = (a: P2, b: P2) => Math.hypot(a.x - b.x, a.y - b.y);

function rnd(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)), ((s ^= s >>> 16) >>> 0) / 4294967296);
}

/** Sentido de ataque: a equipa da casa ataca para +x nas partes ímpares. */
export const attackDir = (side: number, period: number) => ((period % 2 === 1) === (side === 0) ? 1 : -1);

interface Touch {
  t: number; // instante em que o jogador fica com a bola
  id: string;
  side: number;
}

interface Shot {
  t: number;
  from: string;
  side: number;
  target: Ball;
  after: Ball; // para onde vai a bola depois
  result: Action['result'];
  keeper?: string;
}

export class Choreo {
  readonly duration: number; // tempo de jogo da posse
  readonly extra: number; // tempo de bola parada mostrado a seguir (faltas, cantos, livres)
  private touches: Touch[] = [];
  private shots: Shot[] = [];
  private ids: [(string | null)[], (string | null)[]];
  private uStart: number;
  private uEnd: number;
  private vBias: number;
  private stopAt: number | null = null; // falta: o jogo para
  private restarts: { t: number; at: P2; taker: string; until: number }[] = [];
  private dirAtt: number;
  private att: number;
  readonly end: StartState;
  private labels: { t: number; text: string }[] = [];

  constructor(
    private p: Possession,
    private tactics: [Tactics, Tactics],
    private period: number,
    start: StartState | null,
    private names: Record<string, string> = {}
  ) {
    const r = rnd(Math.floor(p.start * 100) + 7);
    this.att = p.side;
    this.dirAtt = attackDir(p.side, period);
    this.ids = p.onCourt;
    this.duration = Math.max(0.5, p.end - p.start);
    this.vBias = (r() - 0.5) * 8;

    const att = p.side;
    const court = (sd: number) => (p.flying[sd] ? this.ids[sd].filter((x): x is string => !!x) : this.ids[sd].slice(1).filter((x): x is string => !!x));
    const attCourt = court(att);
    const gkAtt = this.ids[att][0];

    // de onde parte a bola (em coordenadas da equipa que ataca)
    let startHolder = start?.holder && this.ids[att].includes(start.holder) ? start.holder : null;
    const sb = start?.ball ?? { x: 0, y: 0 };
    this.uStart = clamp(this.dirAtt * sb.x + 20, 3, 30);
    if (!startHolder) {
      startHolder = p.counter ? attCourt[Math.floor(r() * attCourt.length)] : gkAtt ?? attCourt[0];
      if (!p.counter && gkAtt) this.uStart = 3;
    }

    const first = p.actions[0];
    const shot = p.actions.find((a) => a.type === 'shot' && a.side === att);
    const foul = first?.type === 'foul' ? first : null;
    const lost = first?.type === 'lost' ? first : null;

    // até onde chega a jogada
    this.uEnd = foul ? 18 + r() * 12 : lost ? 14 + r() * 14 : shot ? 30 + r() * 5 : 18 + r() * 8;
    if (p.counter) this.uEnd = Math.max(this.uEnd, 31);

    // cadeia de passes
    const tempo = this.tactics[att].tempo;
    const interval = p.counter ? 1.6 : tempo === 'rapido' ? 2.0 : tempo === 'paciente' ? 3.1 : 2.5;
    const D = this.duration;
    const finalShooter = foul ? foul.shooter : shot && shot.kind !== 'free10' && shot.kind !== 'penalty' && shot.kind !== 'setpiece' && !foul ? shot.shooter : undefined;
    const assist = finalShooter ? shot?.assist : undefined;
    const lastAt = finalShooter ? D - 0.45 : D - 0.1;
    const n = Math.max(finalShooter ? 1 : 1, Math.round(lastAt / interval));
    const chain: string[] = [startHolder!];
    for (let i = 1; i <= n; i++) {
      const forced = i === n ? finalShooter : i === n - 1 ? assist : undefined;
      if (forced && attCourt.includes(forced) && forced !== chain[chain.length - 1]) chain.push(forced);
      else {
        const opts = attCourt.filter((x) => x !== chain[chain.length - 1] && x !== finalShooter && x !== assist);
        const pool = opts.length ? opts : attCourt.filter((x) => x !== chain[chain.length - 1]);
        if (pool.length) chain.push(pool[Math.floor(r() * pool.length)]);
      }
    }
    const step = lastAt / Math.max(1, chain.length - 1);
    chain.forEach((id, i) => this.touches.push({ t: i === 0 ? 0 : Math.min(lastAt, i * step + (r() - 0.5) * step * 0.3), id, side: att }));
    this.touches.sort((a, b) => a.t - b.t);
    this.labelAt(0, '');

    let extra = 0;
    const goalX = (dir: number) => dir * 20;
    const shotTarget = (res: Action['result'], dir: number): { target: Ball; after: Ball } => {
      const side = r() < 0.5 ? -1 : 1;
      if (res === 'goal') { const v = (r() - 0.5) * 2.4; return { target: { x: goalX(dir) + dir * 0.4, y: v, z: 0.2 + r() * 1.4 }, after: { x: goalX(dir) + dir * 0.8, y: v * 1.1, z: 0.1 } }; }
      if (res === 'post') return { target: { x: goalX(dir), y: side * 1.5, z: 0.4 + r() * 1.3 }, after: { x: goalX(dir) - dir * 6, y: side * 4, z: 0.1 } };
      if (res === 'wide') return { target: { x: goalX(dir) + dir * 0.6, y: side * (1.9 + r() * 1.5), z: 0.3 + r() * 1.6 }, after: { x: goalX(dir) + dir * 1.2, y: side * 3.5, z: 0.1 } };
      if (res === 'saved') { const v = (r() - 0.5) * 2.2; return { target: { x: goalX(dir) - dir * 0.8, y: v, z: 0.3 + r() } , after: { x: goalX(dir) - dir * 3, y: v + side * 5, z: 0.1 } }; }
      return { target: { x: 0, y: 0, z: 0.2 }, after: { x: 0, y: 0, z: 0.1 } };
    };

    // remate de jogada corrida
    if (shot && finalShooter && !foul) {
      const tg = shotTarget(shot.result, this.dirAtt);
      this.shots.push({ t: D - 0.25, from: finalShooter, side: att, result: shot.result, keeper: shot.other, ...tg });
      this.labelAt(D - 0.25, `Remate de ${this.nm(finalShooter)}`);
    }
    if (lost) this.labelAt(D - 0.2, `${this.nm(lost.other)} recupera a bola`);

    // bola parada a seguir (relógio parado): faltas, livres de 10 m, penáltis, cantos
    const runShot = this.shots[0];
    let tExtra = foul ? D : runShot ? runShot.t + 1.5 : D;
    const rest = p.actions.slice(foul ? 1 : shot ? p.actions.indexOf(shot) + 1 : 1);
    if (foul) {
      this.stopAt = D;
      this.labelAt(D, `Falta de ${this.nm(foul.other)} sobre ${this.nm(foul.shooter)}`);
      tExtra += 0.6;
    }
    let pendingRestart: { t: number; at: P2; taker: string } | null = null;
    const closeRestart = (until: number) => {
      if (pendingRestart) this.restarts.push({ ...pendingRestart, until });
      pendingRestart = null;
    };
    for (const a of rest) {
      if (a.type === 'corner') {
        tExtra += 1.4; // tempo para ir buscar a bola
        const cy = r() < 0.5 ? -9.7 : 9.7;
        pendingRestart = { t: tExtra, at: { x: this.dirAtt * 19.7, y: cy }, taker: a.shooter! };
        this.touches.push({ t: tExtra, id: a.shooter!, side: att });
        this.labelAt(tExtra - 1.4, `Canto, marcado por ${this.nm(a.shooter)}`);
        tExtra += 0.6;
      } else if (a.type === 'shot' && a.side === att) {
        if (a.kind === 'free10' || a.kind === 'penalty') {
          tExtra += 1.2;
          const d = a.kind === 'penalty' ? 6 : 10;
          pendingRestart = { t: tExtra, at: { x: this.dirAtt * (20 - d), y: 0 }, taker: a.shooter! };
          this.touches.push({ t: tExtra, id: a.shooter!, side: att });
          this.labelAt(tExtra - 1.2, `${a.kind === 'penalty' ? 'Penálti' : 'Livre de 10 m'}: ${this.nm(a.shooter)}`);
          tExtra += 1.2;
        } else if (a.kind === 'setpiece') {
          if (!pendingRestart && foul) {
            tExtra += 1.0;
            const kicker = a.assist ?? a.shooter!;
            pendingRestart = { t: tExtra, at: this.posAtAttack(clamp(this.uEnd, 18, 28), clamp(this.vBias, -6, 6)), taker: kicker };
            this.touches.push({ t: tExtra, id: kicker, side: att });
            this.labelAt(tExtra - 1.0, `Livre: ${this.nm(kicker)}`);
            tExtra += 0.6;
          }
          if (a.assist && a.assist !== a.shooter) {
            closeRestart(tExtra);
            tExtra += 0.9;
            this.touches.push({ t: tExtra, id: a.shooter!, side: att });
          }
          tExtra += 0.3;
        }
        closeRestart(tExtra);
        const tg = shotTarget(a.result, this.dirAtt);
        if (a.result === 'blocked') {
          tg.target = { ...this.posAtAttack(31, 0), z: 0.3 };
          tg.after = { x: this.dirAtt * 20.5, y: r() < 0.5 ? -9 : 9, z: 0.1 };
        }
        this.shots.push({ t: tExtra, from: a.shooter!, side: att, result: a.result, keeper: a.other, ...tg });
        this.labelAt(tExtra, `Remate de ${this.nm(a.shooter)}`);
        tExtra += 1.5;
      }
    }
    closeRestart(tExtra);
    extra = rest.length || foul ? Math.max(0, tExtra - D) : 0;
    this.extra = extra;

    // quem fica com a bola no fim
    const lastShot = this.shots[this.shots.length - 1];
    if (lost) this.end = { holder: lost.other ?? null, ball: this.ballAt(D) };
    else if (lastShot?.result === 'goal') this.end = { holder: null, ball: { x: 0, y: 0 } };
    else if (lastShot) this.end = { holder: null, ball: { x: this.dirAtt * 18, y: 0 } };
    else this.end = { holder: null, ball: this.ballAt(D) };
  }

  get attackDirection() {
    return this.dirAtt;
  }

  private nm(id?: string) {
    return id ? this.names[id] ?? '' : '';
  }

  private labelAt(t: number, text: string) {
    this.labels.push({ t, text });
  }

  private posAtAttack(u: number, v: number): P2 {
    return { x: this.dirAtt * (u - 20), y: v };
  }

  /** progresso da equipa que ataca (u da bola) ao longo da posse */
  private ballU(t: number) {
    const k = clamp(t / Math.max(0.1, this.duration), 0, 1);
    return lerp(this.uStart, this.uEnd, ease(k));
  }

  private ballV(t: number) {
    return Math.sin(t * 0.45 + this.vBias) * 4.5;
  }

  /** Posição tática de cada jogador num instante (sem contar com a bola nos pés) */
  private shapePos(t: number): Record<string, P2> {
    const out: Record<string, P2> = {};
    const att = this.att;
    const def = 1 - att;
    const bu = this.ballU(Math.min(t, this.duration));
    const bv = this.ballV(Math.min(t, this.duration));
    const phase = clamp((bu - 9) / 16, 0, 1);
    const dirA = this.dirAtt;
    const dirD = -dirA;

    // equipa que ataca
    const tA = this.tactics[att];
    const flyingA = this.p.flying[att];
    const attIds = flyingA ? this.ids[att].filter((x): x is string => !!x) : this.ids[att].slice(1).filter((x): x is string => !!x);
    const shape = flyingA ? FLYING : ATTACK[tA.system];
    attIds.forEach((id, i) => {
      const [au, av] = shape[i % shape.length];
      let u = lerp(Math.max(5, au - 14), au, phase);
      let v = av + bv * 0.25;
      if (tA.system === '4-0' && !flyingA) {
        u += Math.sin(t * 0.55 + (i * Math.PI) / 2) * 2.2;
        v += Math.cos(t * 0.55 + (i * Math.PI) / 2) * 2.2;
      }
      out[id] = { x: dirA * (clamp(u, 2, 38) - 20), y: clamp(v, -9.4, 9.4) };
    });
    const gkA = this.ids[att][0];
    if (gkA && !flyingA) out[gkA] = { x: dirA * (lerp(1.2, 4, phase) - 20), y: bv * 0.12 };

    // equipa que defende: zona, individual ou mista; o mais próximo da bola pressiona
    const tD = this.tactics[def];
    const defIds = this.ids[def].slice(1).filter((x): x is string => !!x);
    const zone = DEFENSE[tD.pressure];
    // altura do bloco acompanha a bola
    const ballUD = 40 - bu; // posição da bola vista por quem defende
    const shift = clamp((ballUD - 20) * 0.35, -6, 4);
    const attPts = attIds.map((id) => out[id]);
    // pares: o defesa mais recuado marca o atacante mais adiantado
    const attByDepth = [...attPts].sort((a, b) => dirA * (b.x - a.x));
    defIds.forEach((id, i) => {
      const [zu, zv] = zone[i % zone.length];
      const zonePos = { x: dirD * (clamp(zu + shift, 3, 32) - 20), y: zv + bv * 0.4 };
      const target = attByDepth[i] ?? zonePos;
      const manPos = { x: target.x - dirA * 2.3, y: target.y * 0.9 };
      const k = tD.marking === 'individual' ? 0.8 : tD.marking === 'misto' ? 0.5 : 0.25;
      out[id] = { x: lerp(zonePos.x, manPos.x, k), y: clamp(lerp(zonePos.y, manPos.y, k), -9.4, 9.4) };
    });
    const gkD = this.ids[def][0];
    if (gkD) out[gkD] = { x: dirD * (0.9 - 20), y: bv * 0.22 };
    return out;
  }

  private holderAt(t: number): Touch | null {
    let h: Touch | null = null;
    for (const tc of this.touches) if (tc.t <= t) h = tc;
    return h;
  }

  private ballAt(t: number): Ball {
    return this.at(t).ball;
  }

  at(t: number): Frame {
    const D = this.duration;
    const tt = clamp(t, 0, D + this.extra);
    const pos = this.shapePos(tt);
    const dirA = this.dirAtt;
    const foot = (p: P2): Ball => ({ x: p.x + dirA * 0.45, y: p.y, z: 0.11 });
    let label = '';
    for (const l of this.labels) if (l.t <= tt) label = l.text;

    // reposição (canto, livre, penálti): o marcador fica no local até bater
    const rs = this.restarts.find((x) => tt >= x.t - 1.2 && tt <= x.until + 0.3);
    if (rs && pos[rs.taker]) {
      const spot = { x: rs.at.x - dirA * 0.45, y: rs.at.y };
      const k = clamp((tt - (rs.t - 1.2)) / 1.0, 0, 1);
      pos[rs.taker] = { x: lerp(pos[rs.taker].x, spot.x, k), y: lerp(pos[rs.taker].y, spot.y, k) };
    }

    // o defesa mais próximo pressiona quem tem a bola
    const h = this.holderAt(tt);
    const defSide = 1 - this.att;
    const defIds = this.ids[defSide].slice(1).filter((x): x is string => !!x);
    if (h && pos[h.id] && !this.stopAt) {
      const hp = pos[h.id];
      let near = '';
      let nd = 99;
      for (const id of defIds) { const d = dist(pos[id], hp); if (d < nd) { nd = d; near = id; } }
      if (near && nd < 8) {
        const k = this.tactics[defSide].pressure === 'alta' ? 0.85 : this.tactics[defSide].pressure === 'media' ? 0.6 : 0.35;
        pos[near] = { x: lerp(pos[near].x, hp.x + dirA * 1.9, k), y: lerp(pos[near].y, hp.y + (pos[near].y > hp.y ? 0.6 : -0.6), k) };
      }
    }

    // remates (a bola sai do pé e voa para o destino)
    for (const s of this.shots) {
      if (tt >= s.t) {
        const flight = 0.55;
        const k = (tt - s.t) / flight;
        const from = foot(pos[s.from] ?? { x: 0, y: 0 });
        if (k <= 1) {
          if (s.keeper && s.result === 'saved' && pos[s.keeper]) pos[s.keeper] = { x: lerp(pos[s.keeper].x, s.target.x, ease(k) * 0.6), y: lerp(pos[s.keeper].y, s.target.y, ease(k)) };
          if (s.keeper && s.result === 'blocked' && pos[s.keeper]) pos[s.keeper] = { x: s.target.x, y: s.target.y };
          return { pos, holder: null, stoppage: tt > D, label, ball: { x: lerp(from.x, s.target.x, k), y: lerp(from.y, s.target.y, k), z: lerp(0.15, s.target.z, k) + Math.sin(k * Math.PI) * 0.25 } };
        }
        const nextTouch = this.touches.find((x) => x.t > s.t);
        if (!nextTouch || tt < nextTouch.t - 1.2) {
          const k2 = clamp((tt - s.t - flight) / 0.8, 0, 1);
          if (s.keeper && s.result === 'saved' && pos[s.keeper]) pos[s.keeper] = { x: s.target.x, y: s.target.y };
          return { pos, holder: null, stoppage: tt > D, label, ball: { x: lerp(s.target.x, s.after.x, k2), y: lerp(s.target.y, s.after.y, k2), z: lerp(s.target.z, s.after.z, k2) * (1 - k2 * 0.5) } };
        }
      }
    }

    // reposição: bola parada no local
    if (rs && tt < rs.t) {
      // a bola é levada até ao local da reposição
      const b0 = this.at(rs.t - 1.25).ball;
      const k = clamp((tt - (rs.t - 1.2)) / 0.9, 0, 1);
      return { pos, holder: null, stoppage: true, label, ball: { x: lerp(b0.x, rs.at.x, ease(k)), y: lerp(b0.y, rs.at.y, ease(k)), z: 0.11 } };
    }

    // falta: bola parada onde aconteceu
    const firstRs = this.restarts[0];
    if (this.stopAt !== null && tt >= this.stopAt && (!firstRs || tt < firstRs.t - 1.2)) {
      const vic = this.touches[this.touches.length - 1];
      const at = this.touches.filter((x) => x.t <= this.stopAt!).pop();
      const p = pos[at?.id ?? vic.id] ?? { x: 0, y: 0 };
      return { pos, holder: null, stoppage: true, label, ball: foot(p) };
    }

    // passes: entre dois toques a bola viaja do passador para o recetor
    const idx = this.touches.findIndex((x) => x.t > tt);
    const cur = idx === -1 ? this.touches[this.touches.length - 1] : this.touches[idx - 1];
    const nxt = idx === -1 ? null : this.touches[idx];
    if (cur && nxt) {
      const fromP = pos[cur.id];
      const toP = pos[nxt.id];
      if (fromP && toP) {
        const flight = clamp(dist(fromP, toP) / 13, 0.35, 1.1);
        if (tt >= nxt.t - flight) {
          const k = (tt - (nxt.t - flight)) / flight;
          const a = foot(fromP), b = foot(toP);
          const len = dist(fromP, toP);
          return { pos, holder: null, stoppage: tt > D, label, ball: { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: 0.11 + Math.sin(k * Math.PI) * (len > 12 ? 0.6 : 0.08) } };
        }
      }
    }
    // condução: a bola segue nos pés de quem a tem
    const hp = cur ? pos[cur.id] : undefined;
    return { pos, holder: cur?.id ?? null, stoppage: tt > D, label, ball: hp ? foot(hp) : { x: 0, y: 0, z: 0.11 } };
  }
}
