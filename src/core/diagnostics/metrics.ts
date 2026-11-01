// Fase 0 da evolução tática: MEDIÇÃO da simulação visual atual (sem mudar nada).
// Lê só o que a coreografia já produz para o 2D/3D (Frame: posições, bola, portador, ações) e o que o motor
// já regista por posse (equipa, jogadores em campo, ações). Não escreve em lado nenhum.
//
// Amostragem: a cada DT segundos de jogo corrido (sem bolas paradas nem preparação), como a câmara veria.
// Coordenadas do jogo: x = comprimento (-20..20), y = largura (-10..10); u = metros desde a própria baliza
// no sentido do ataque (0..40).
import type { Possession } from '../engine/match';
import type { Frame, P2, Scene3D } from '../visual/choreo';

export const DT = 0.1;

// limiares (definições do diagnóstico, iguais para todas as versões a comparar)
export const TH = {
  stillSpeed: 0.3, // m/s: abaixo disto conta como "praticamente parado"
  lineMin: 2, // m: colega a menos disto não é linha de passe útil
  lineMax: 16, // m: mais longe que isto não conta como linha de passe
  blockR: 0.9, // m: adversário a menos disto da linha de passe obstrui-a
  ballHitR: 0.5, // m: bola a passar a menos disto de um adversário "atravessa-o"
  ballLowZ: 1.0, // m: só conta se a bola for baixa (passe rasteiro ou meia altura)
  sprint: 4, // m/s: desmarcação (sem bola, a andar para a frente ou para o espaço)
  swapHyst: 1, // m: margem para contar trocas de posição (rotações)
  supportGain: 2, // m: aproximar-se do portador pelo menos isto em 1 s
  supportMin: 3, supportMax: 8, // m: a que distância fica o apoio
  transWin: 3, // s: janela analisada depois de uma perda/recuperação
  pressR: 4, // m: jogadores a menos disto da bola contam como "pressão pós-perda"
};

export interface Acc { sum: number; n: number }
const acc = (): Acc => ({ sum: 0, n: 0 });
const add = (a: Acc, v: number) => { if (Number.isFinite(v)) { a.sum += v; a.n++; } };
export const mean = (a: Acc) => (a.n ? a.sum / a.n : NaN);

export interface Metrics {
  samples: number; // instantes de jogo corrido analisados
  playSeconds: number;
  width: Acc; depth: Acc; // equipa com bola
  defWidth: Acc; defDepth: Acc; // equipa sem bola
  mateDist: Acc; nearestMate: Acc; // distância média entre colegas (com bola) e ao colega mais próximo
  defMateDist: Acc;
  defToOpp: Acc; // cada defensor ao atacante mais próximo
  pressOnBall: Acc; // portador ao defensor mais próximo
  linesOffered: Acc; // linhas de passe livres por instante com portador
  linesCandidates: number; linesBlocked: number;
  passes: number; passesThrough: number; // passes que atravessam um adversário
  stillShareAtt: Acc; stillShareDef: Acc; // fração do tempo praticamente parado (jogadores de campo)
  longestStill: Acc; // maior período seguido parado, por jogador e posse (s)
  runActs: number; sprints: number; rotations: number; supports: number;
  transitions: number;
  transWindowComplete: number; transWindowIncomplete: number;
  transPressNow: Acc; transPress3: Acc; // equipa que perdeu, excluindo o portador que perdeu a bola
  transRetreat: Acc; // quem perdeu: recuo médio (m) do bloco em 3 s
  transProgress: Acc; // quem recuperou: metros que a bola avança para a baliza em 3 s
  transForward: Acc; // quem recuperou: jogadores a atacar o espaço (velocidade para a frente > 2 m/s) no 1.º segundo
}
export const emptyMetrics = (): Metrics => ({
  samples: 0, playSeconds: 0, width: acc(), depth: acc(), defWidth: acc(), defDepth: acc(), mateDist: acc(), nearestMate: acc(), defMateDist: acc(),
  defToOpp: acc(), pressOnBall: acc(), linesOffered: acc(), linesCandidates: 0, linesBlocked: 0, passes: 0, passesThrough: 0,
  stillShareAtt: acc(), stillShareDef: acc(), longestStill: acc(), runActs: 0, sprints: 0, rotations: 0, supports: 0,
  transitions: 0, transWindowComplete: 0, transWindowIncomplete: 0, transPressNow: acc(), transPress3: acc(), transRetreat: acc(), transProgress: acc(), transForward: acc(),
});

const d2 = (a: P2, b: P2) => Math.hypot(a.x - b.x, a.y - b.y);
/** distância de um ponto a um segmento, só na parte interior (15%-90%) para não contar quem está colado ao passador/recetor */
function segDist(p: P2, a: P2, b: P2) {
  const vx = b.x - a.x, vy = b.y - a.y, L2 = vx * vx + vy * vy || 1;
  const k = ((p.x - a.x) * vx + (p.y - a.y) * vy) / L2;
  if (k < 0.15 || k > 0.9) return Infinity;
  return Math.hypot(a.x + vx * k - p.x, a.y + vy * k - p.y);
}

/** Quem está em campo nesta posse: jogadores de campo de cada lado (GR fora, exceto se for o 5.º jogador no 5x4). */
function sides(p: Possession) {
  const out = (sd: 0 | 1) => (p.flying[sd] ? p.onCourt[sd].filter((x): x is string => !!x) : p.onCourt[sd].slice(1).filter((x): x is string => !!x));
  return { att: out(p.side), def: out((1 - p.side) as 0 | 1) };
}

/** Mede uma posse (o seu jogo corrido) e soma às métricas. prev = posse anterior (para as transições). */
export function measurePossession(m: Metrics, p: Possession, sc: Scene3D & { duration: number; lead: number }, prev?: { p: Possession; lostHolder: string | null } | null) {
  const dir = sc.attackDirection;
  const U = (q: P2) => dir * q.x + 20;
  const { att, def } = sides(p);
  // jogo corrido da posse: instantes [lead, lead + duração] da coreografia (antes é preparação, depois bola parada)
  const frames: Frame[] = [];
  for (let t = 0; t <= sc.duration + 1e-6; t += DT) frames.push(sc.at(sc.lead + t));
  const live = frames.filter((f) => !f.stoppage);
  if (!live.length) return;
  m.samples += live.length;
  // Há um frame em t=0 e outro em t=duration: N amostras representam N-1 intervalos.
  // Contar N * DT inflacionava o tempo útil em 0,1 s por posse e enviesava todas as taxas por minuto.
  m.playSeconds += Math.max(0, live.length - 1) * DT;

  const still: Record<string, { n: number; run: number; best: number; tot: number }> = {};
  let prevF: Frame | null = null;
  let stableOrder = '', stableOrderY = '';
  let candidateOrder = '', candidateOrderY = '';
  let candidateOrderSince = 0, candidateOrderYSince = 0;
  let frameIndex = 0;
  let lastHolder: string | null = null, releaseF: Frame | null = null, flight: Frame[] = [];
  const runStarted = new Set<string>();
  for (const f of live) {
    const P = (id: string) => f.pos[id];
    const A = att.filter((id) => P(id)), Dd = def.filter((id) => P(id));
    if (A.length >= 2) {
      const ys = A.map((id) => P(id).y), us = A.map((id) => U(P(id)));
      add(m.width, Math.max(...ys) - Math.min(...ys)); add(m.depth, Math.max(...us) - Math.min(...us));
      let s = 0, k = 0;
      for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) { s += d2(P(A[i]), P(A[j])); k++; }
      add(m.mateDist, s / k);
      for (const id of A) add(m.nearestMate, Math.min(...A.filter((x) => x !== id).map((x) => d2(P(id), P(x)))));
    }
    if (Dd.length >= 2) {
      const ys = Dd.map((id) => P(id).y), us = Dd.map((id) => U(P(id)));
      add(m.defWidth, Math.max(...ys) - Math.min(...ys)); add(m.defDepth, Math.max(...us) - Math.min(...us));
      let s = 0, k = 0;
      for (let i = 0; i < Dd.length; i++) for (let j = i + 1; j < Dd.length; j++) { s += d2(P(Dd[i]), P(Dd[j])); k++; }
      add(m.defMateDist, s / k);
    }
    if (A.length) for (const id of Dd) add(m.defToOpp, Math.min(...A.map((a) => d2(P(id), P(a)))));
    // portador: pressão e linhas de passe
    const h = f.holder && A.includes(f.holder) ? f.holder : null;
    if (h && Dd.length) add(m.pressOnBall, Math.min(...Dd.map((x) => d2(P(h), P(x)))));
    if (h) {
      let free = 0;
      for (const mate of A) {
        if (mate === h) continue;
        const dd = d2(P(h), P(mate));
        if (dd < TH.lineMin || dd > TH.lineMax) continue;
        m.linesCandidates++;
        const blocked = Dd.some((x) => segDist(P(x), P(h), P(mate)) < TH.blockR);
        if (blocked) m.linesBlocked++; else free++;
      }
      add(m.linesOffered, free);
    }
    // passes: o portador muda para outro colega depois de a bola andar sozinha
    if (f.holder && att.includes(f.holder)) {
      if (lastHolder && f.holder !== lastHolder && releaseF && flight.length) {
        m.passes++;
        // só o meio do trajeto (20%-85%): o defensor colado ao passador ou ao recetor não é "atravessado"
        const mid = flight.slice(Math.floor(flight.length * 0.2), Math.ceil(flight.length * 0.85));
        const through = mid.some((ff) => ff.ball.z < TH.ballLowZ && def.some((x) => ff.pos[x] && d2(ff.pos[x], ff.ball) < TH.ballHitR));
        if (through) m.passesThrough++;
      }
      lastHolder = f.holder; releaseF = f; flight = [];
    } else if (!f.holder && lastHolder) flight.push(f);
    // ações explícitas de desmarcação da coreografia ('run'), contadas uma vez por ação
    for (const id of A) {
      const a = f.acts[id];
      if (a?.kind === 'run' && !runStarted.has(id)) { runStarted.add(id); m.runActs++; }
      if (a?.kind !== 'run') runStarted.delete(id);
    }
    // rotações: uma nova ordem só conta se persistir 0,5 s; evita contar oscilações
    // momentâneas junto de um colega como trocas táticas repetidas.
    if (A.length >= 3) {
      const ord = [...A].sort((a, b) => U(P(a)) - U(P(b)));
      const ordY = [...A].sort((a, b) => P(a).y - P(b).y);
      const okGap = (o: string[], val: (id: string) => number) => o.every((id, i) => i === 0 || val(id) - val(o[i - 1]) > TH.swapHyst);
      const sig = ord.join(','), sigY = ordY.join(',');
      const now = frameIndex * DT;
      if (okGap(ord, (id) => U(P(id)))) {
        if (!stableOrder) stableOrder = sig;
        if (sig === stableOrder) { candidateOrder = ''; candidateOrderSince = now; }
        else if (sig !== candidateOrder) { candidateOrder = sig; candidateOrderSince = now; }
        else if (now - candidateOrderSince >= 0.5) { m.rotations++; stableOrder = sig; candidateOrder = ''; }
      } else { candidateOrder = ''; }
      if (okGap(ordY, (id) => P(id).y)) {
        if (!stableOrderY) stableOrderY = sigY;
        if (sigY === stableOrderY) { candidateOrderY = ''; candidateOrderYSince = now; }
        else if (sigY !== candidateOrderY) { candidateOrderY = sigY; candidateOrderYSince = now; }
        else if (now - candidateOrderYSince >= 0.5) { m.rotations++; stableOrderY = sigY; candidateOrderY = ''; }
      } else { candidateOrderY = ''; }
    }
    // parado / velocidade (precisa do instante anterior)
    if (prevF) {
      for (const id of [...A, ...Dd]) {
        const a = P(id), b = prevF.pos[id];
        if (!a || !b) continue;
        const v = d2(a, b) / DT;
        const s = (still[id] ??= { n: 0, run: 0, best: 0, tot: 0 });
        s.tot++;
        if (v < TH.stillSpeed) { s.n++; s.run += DT; s.best = Math.max(s.best, s.run); } else s.run = 0;
      }
    }
    prevF = f;
    frameIndex++;
  }
  for (const [id, s] of Object.entries(still)) {
    if (!s.tot) continue;
    add(att.includes(id) ? m.stillShareAtt : m.stillShareDef, s.n / s.tot);
    add(m.longestStill, s.best);
  }
  // desmarcações por sprint e movimentos de apoio (janelas de 1 s, sem bola)
  const step = Math.round(1 / DT);
  for (const id of att) {
    let inSprint = false;
    for (let i = step; i < live.length; i++) {
      const f = live[i], g = live[i - step], q = f.pos[id], q0 = g.pos[id];
      if (!q || !q0 || f.holder === id) { inSprint = false; continue; }
      const v = d2(q, q0); // metros em 1 s
      const fwd = U(q) - U(q0);
      const sprint = v >= TH.sprint && (fwd > 1.5 || Math.abs(q.y - q0.y) > 2.5);
      if (sprint && !inSprint) m.sprints++;
      inSprint = sprint;
      // apoio: aproxima-se do portador e fica a 3-8 m com linha livre
      const h = f.holder && att.includes(f.holder) && f.holder !== id ? f.holder : null;
      if (h && g.pos[h] && f.pos[h]) {
        const before = d2(q0, g.pos[h]), now = d2(q, f.pos[h]);
        if (before - now >= TH.supportGain && now >= TH.supportMin && now <= TH.supportMax && !def.some((x) => f.pos[x] && segDist(f.pos[x], f.pos[h], q) < TH.blockR)) { m.supports++; i += step; }
      }
    }
  }
  // transição: a posse anterior acabou com perda de bola em jogo corrido
  if (prev && prev.p.side !== p.side && prev.p.actions.some((x) => x.type === 'lost')) {
    m.transitions++;
    // Exclui o portador no instante final da posse anterior: foi quem perdeu a bola.
    const losers = def.filter((id) => id !== prev.lostHolder);
    const winners = att;
    const f0 = live[0];
    const near = (f: Frame) => losers.filter((x) => f.pos[x] && d2(f.pos[x], f.ball) < TH.pressR).length;
    add(m.transPressNow, near(f0));
    const complete3s = (live.length - 1) * DT + 1e-6 >= TH.transWin;
    if (complete3s) {
      m.transWindowComplete++;
      const f1 = live[Math.min(live.length - 1, step)], f3 = live[Math.min(live.length - 1, Math.round(TH.transWin / DT))];
      add(m.transPress3, near(f3));
      // recuo de quem perdeu: aproximação à própria baliza (na direção de quem agora ataca, u aumenta para lá)
      const uAvg = (f: Frame, ids: string[]) => { const v = ids.filter((x) => f.pos[x]).map((x) => U(f.pos[x])); return v.reduce((a, b) => a + b, 0) / Math.max(1, v.length); };
      add(m.transRetreat, uAvg(f3, losers) - uAvg(f0, losers));
      add(m.transProgress, U(f3.ball) - U(f0.ball));
      add(m.transForward, winners.filter((x) => f0.pos[x] && f1.pos[x] && U(f1.pos[x]) - U(f0.pos[x]) > 2).length);
    } else {
      m.transWindowIncomplete++;
    }
  }
}

/** Resumo legível (valores médios e por minuto de jogo corrido). */
export function summarize(m: Metrics) {
  const perMin = (n: number) => (m.playSeconds ? (n / m.playSeconds) * 60 : NaN);
  const r = (v: number, d = 2) => (Number.isFinite(v) ? Math.round(v * 10 ** d) / 10 ** d : null);
  return {
    'Minutos de jogo corrido analisados': r(m.playSeconds / 60, 1),
    'Largura da equipa com bola (m)': r(mean(m.width)),
    'Profundidade da equipa com bola (m)': r(mean(m.depth)),
    'Largura da equipa sem bola (m)': r(mean(m.defWidth)),
    'Profundidade da equipa sem bola (m)': r(mean(m.defDepth)),
    'Distância média entre colegas com bola (m)': r(mean(m.mateDist)),
    'Distância ao colega mais próximo com bola (m)': r(mean(m.nearestMate)),
    'Distância média entre colegas sem bola (m)': r(mean(m.defMateDist)),
    'Defensor → atacante mais próximo (m)': r(mean(m.defToOpp)),
    'Portador → defensor mais próximo (m)': r(mean(m.pressOnBall)),
    'Linhas de passe livres por instante': r(mean(m.linesOffered)),
    'Linhas de passe obstruídas (%)': r(m.linesCandidates ? (m.linesBlocked / m.linesCandidates) * 100 : NaN, 1),
    'Passes por minuto de jogo corrido': r(perMin(m.passes), 1),
    'Passes que atravessam um adversário (%)': r(m.passes ? (m.passesThrough / m.passes) * 100 : NaN, 1),
    'Tempo parado, equipa com bola (%)': r(mean(m.stillShareAtt) * 100, 1),
    'Tempo parado, equipa sem bola (%)': r(mean(m.stillShareDef) * 100, 1),
    'Maior período seguido parado (s, média)': r(mean(m.longestStill)),
    'Desmarcações explícitas da coreografia (por min)': r(perMin(m.runActs), 1),
    'Sprints sem bola (por min)': r(perMin(m.sprints), 1),
    'Rotações / trocas de posição (por min)': r(perMin(m.rotations), 1),
    'Movimentos de apoio ao portador (por min)': r(perMin(m.supports), 1),
    'Transições analisadas (perdas em jogo corrido)': m.transitions,
    'Transições com janela completa de 3 s': m.transWindowComplete,
    'Transições com janela inferior a 3 s (excluídas das métricas aos 3 s)': m.transWindowIncomplete,
    'Pós-perda: jogadores perto da bola logo (n.º)': r(mean(m.transPressNow)),
    'Pós-perda: jogadores perto da bola aos 3 s (n.º)': r(mean(m.transPress3)),
    'Pós-perda: recuo do bloco em 3 s (m)': r(mean(m.transRetreat)),
    'Pós-recuperação: avanço da bola em 3 s (m)': r(mean(m.transProgress)),
    'Pós-recuperação: jogadores a atacar o espaço no 1.º s (n.º)': r(mean(m.transForward)),
  };
}
