// Cerimónia antes do jogo (3D): a dupla de arbitragem e as duas equipas saem do túnel em fila,
// vêm do lado dos bancos (de frente para a câmara) e alinham no centro, viradas para a bancada principal (casa à esquerda,
// visitantes à direita, árbitros ao meio).
import type { Act, Frame, P2, Scene3D } from './choreo';

const SPEED = 1.8; // m/s (passo de entrada)
const GAP = 0.45; // segundos entre jogadores à saída do túnel
const TUNNEL_Y = -13.9; // fundo do túnel (ao centro, do lado dos bancos; vem do interior do pavilhão)
const HOLD = 4; // alinhados, antes do gráfico dos cinco iniciais

interface Walker { id: string; t0: number; path: P2[]; len: number[] }

export class IntroScene implements Scene3D {
  readonly attackDirection = 1;
  readonly total: number;
  readonly lineupAt: number; // instante em que estão todos alinhados
  private walkers: Walker[] = [];

  /** teams: ids de cada equipa (titulares primeiro); refs: os dois árbitros. */
  constructor(teams: [string[], string[]], refs: string[]) {
    const add = (id: string, t0: number, lineX: number, spot: P2) => {
      const path = [{ x: lineX, y: TUNNEL_Y }, { x: lineX, y: -1.2 }, { x: spot.x, y: -1.2 }, spot];
      const len = [0];
      for (let i = 1; i < path.length; i++) len.push(len[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y));
      this.walkers.push({ id, t0, path, len });
    };
    // os árbitros à frente, depois as duas filas lado a lado
    refs.forEach((id, i) => add(id, 0, i ? 0.4 : -0.4, { x: i ? 0.45 : -0.45, y: 0 }));
    const n = Math.max(teams[0].length, teams[1].length);
    for (let i = 0; i < n; i++) {
      const t0 = 1.2 + i * GAP;
      if (teams[0][i]) add(teams[0][i], t0, -0.45, { x: -1.3 - i * 0.92, y: 0 });
      if (teams[1][i]) add(teams[1][i], t0, 0.45, { x: 1.3 + i * 0.92, y: 0 });
    }
    this.lineupAt = Math.max(...this.walkers.map((w) => w.t0 + w.len[w.len.length - 1] / SPEED)) + 0.6;
    this.total = this.lineupAt + HOLD;
  }

  private posOf(w: Walker, t: number): { p: P2; dir: P2; moving: boolean } | null {
    if (t < w.t0) return null;
    const d = Math.min(w.len[w.len.length - 1], (t - w.t0) * SPEED);
    let i = 1;
    while (i < w.len.length - 1 && w.len[i] < d) i++;
    const a = w.path[i - 1], b = w.path[i];
    const seg = w.len[i] - w.len[i - 1] || 1;
    const k = Math.min(1, Math.max(0, (d - w.len[i - 1]) / seg));
    return { p: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }, dir: { x: (b.x - a.x) / seg, y: (b.y - a.y) / seg }, moving: d < w.len[w.len.length - 1] - 0.01 };
  }

  at(ct: number): Frame {
    const t = Math.max(0, Math.min(this.total, ct));
    const pos: Record<string, P2> = {};
    const acts: Record<string, Act> = {};
    let fx = 0, fy = 0, nm = 0;
    for (const w of this.walkers) {
      const s = this.posOf(w, t);
      if (!s) continue;
      pos[w.id] = s.p;
      // a andar olham em frente; alinhados olham para a bancada principal (a câmara de TV)
      acts[w.id] = { kind: 'idle', k: 0, ang: s.moving ? Math.atan2(s.dir.x, s.dir.y) : 0 };
      if (s.moving) { fx += s.p.x; fy += s.p.y; nm++; }
    }
    const lined = t >= this.lineupAt - 0.5;
    const focus = lined || !nm ? { x: 0, y: 0 } : { x: fx / nm, y: fy / nm };
    return {
      pos,
      ball: { x: 0, y: 0, z: 0.11 },
      hideBall: true,
      holder: null,
      stoppage: true,
      label: '',
      phase: lined ? 'Alinhamento' : 'Entrada das equipas',
      acts,
      focus,
    };
  }
}
