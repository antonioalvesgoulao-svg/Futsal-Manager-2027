// Festa do título em 3D: os campeões vão para o palanque (atrás, do lado dos bancos, virados para a câmara de TV),
// o capitão fica ao centro e levanta a taça; os vencidos ficam de lado a aplaudir; depois saltam todos a festejar.
import type { Act, Frame, P2, Scene3D } from './choreo';

export const PODIUM = { x0: -5.2, x1: 5.2, y0: -5.4, y1: -2.6, h: 0.55 }; // palanque (coordenadas do jogo; y = lado)
const SPEED = 1.7;
export const LIFT_AT = 8; // instante em que o capitão levanta a taça

interface Walker { id: string; from: P2; to: P2; t0: number; dur: number; role: 'win' | 'lose' | 'ref' }

export class TrophyScene implements Scene3D {
  readonly attackDirection = 1;
  readonly total = 26;
  private walkers: Walker[] = [];

  /** start: posições no fim do jogo; winners[0] = capitão. */
  constructor(start: Record<string, P2>, winners: string[], losers: string[], refs: string[]) {
    const add = (id: string, to: P2, role: Walker['role'], t0: number) => {
      const from = start[id] ?? { x: to.x * 0.6, y: 2 };
      this.walkers.push({ id, from, to, t0, dur: Math.hypot(to.x - from.x, to.y - from.y) / SPEED, role });
    };
    // campeões: duas filas no palanque (a de trás mais alta na imagem), capitão ao centro e à frente
    winners.forEach((id, i) => {
      if (i === 0) return add(id, { x: 0, y: -2.95 }, 'win', 0.5);
      const k = i - 1, row = k % 2, n = Math.floor(k / 2);
      const side = n % 2 ? 1 : -1, off = 0.85 + Math.floor(n / 2) * 0.85;
      add(id, { x: side * off + (row ? 0.42 : 0), y: row ? -4.55 : -3.25 }, 'win', 0.3 + k * 0.12);
    });
    // vencidos: em fila do lado direito, virados para o palanque, a aplaudir
    losers.forEach((id, i) => add(id, { x: 8 + (i % 7) * 0.85, y: -1.2 - Math.floor(i / 7) * 0.9 }, 'lose', 0.2 + i * 0.08));
    refs.forEach((id, i) => add(id, { x: -8 - i * 0.9, y: -1.2 }, 'ref', 0));
  }

  at(ct: number): Frame {
    const t = Math.max(0, Math.min(this.total, ct));
    const pos: Record<string, P2> = {};
    const acts: Record<string, Act> = {};
    for (const w of this.walkers) {
      const k = Math.max(0, Math.min(1, (t - w.t0) / Math.max(0.01, w.dur)));
      pos[w.id] = { x: w.from.x + (w.to.x - w.from.x) * k, y: w.from.y + (w.to.y - w.from.y) * k };
      const moving = k < 1;
      const face = moving ? Math.atan2(w.to.x - w.from.x, w.to.y - w.from.y) : w.role === 'lose' ? Math.atan2(-pos[w.id].x, -3.5 - pos[w.id].y) : 0;
      // depois de levantar a taça, os campeões saltam e festejam
      acts[w.id] = w.role === 'win' && !moving && t >= LIFT_AT - 0.2 ? { kind: 'celebrate', k: ((t - LIFT_AT + 2) / 1.6) % 1, ang: 0 } : { kind: moving ? 'run' : 'idle', k: 0, ang: face };
    }
    return { pos, ball: { x: 0, y: 0, z: 0.11 }, hideBall: true, holder: null, stoppage: true, label: '', phase: 'Festa do título', acts, focus: { x: 0, y: -3.4 } };
  }
}
