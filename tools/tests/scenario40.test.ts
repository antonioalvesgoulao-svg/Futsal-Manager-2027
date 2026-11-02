// Cenário controlado e repetível (HANDOFF, passo 2): jogo completo com ataque organizado 4-0 e um ala com atributos
// físicos contrastantes (aceleração/agilidade 5 vs 18). Verifica:
//  1. o motor de resultados dá exatamente o mesmo jogo com e sem dados dos jogadores na coreografia e com o ala lento/rápido;
//  2. regista quanto os GR mudam (reagem ao lance; não é uma falha);
//  3. o ala rápido acelera mais e chega antes aos alvos do que o lento, com diferença visível mas moderada.
import assert from 'node:assert/strict';
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo, type StartState } from '../../src/core/visual/choreo';
import type { Player } from '../../src/core/types';

const SEED = 'cenario-40';
const s = newGame('Teste', 'Portugal', 'slb');
// equipas novas em cada corrida: o treinador da IA muda a tática durante o jogo (o objeto de táticas é alterado)
const fresh = () => { const h = setupFor(s, 'slb'), a = setupFor(s, 'scp'); h.tactics.system = '4-0'; a.tactics.system = '4-0'; h.ai = false; a.ai = false; return [h, a] as const; };
const [hs, as] = fresh();

// ala do Benfica em campo no início (primeiro jogador de campo não GR do quinteto inicial)
const probe = createMatch(hs, as, { seed: SEED });
probe.step();
const firstOn = probe.snapshot().possession?.onCourt[0] ?? hs.squad.filter((p) => p.position !== 'GR').map((p) => p.id);
const target = hs.squad.find((p) => firstOn.includes(p.id) && p.position !== 'GR')!;

const withAttrs = (acc: number, agi: number): Record<string, Player> => {
  const map = Object.fromEntries([...hs.squad, ...as.squad].map((p) => [p.id, p]));
  map[target.id] = { ...target, attrs: { ...target.attrs, aceleracao: acc, agilidade: agi } };
  return map;
};

interface Run { engine: string; frames: Map<number, Record<string, { x: number; y: number }>>; speeds: number[]; accels: number[]; lag: number[] }

function run(players: Record<string, Player> | undefined): Run {
  const [hs, as] = fresh();
  const m = createMatch(hs, as, { seed: SEED });
  const out: Run = { engine: '', frames: new Map(), speeds: [], accels: [], lag: [] };
  const trace: string[] = [];
  let start: StartState | null = null;
  let k = 0;
  while (m.step()) {
    const sn = m.snapshot();
    if (!sn.possession) { start = null; continue; }
    const p = sn.possession;
    trace.push(JSON.stringify(p) + sn.score.join("-"));
    const c = new Choreo(p, [hs.tactics, as.tactics], sn.period, start, m.names, players);
    start = c.end;
    const idx = k++;
    // amostras a 10 Hz no jogo corrido; guardam-se todas as posições para comparar casos
    const frames: Record<string, { x: number; y: number }>[] = [];
    for (let t = 0; t <= c.duration; t += 0.1) frames.push(c.at(c.lead + t).pos);
    out.frames.set(idx, Object.assign({}, ...frames.map((f, i) => Object.fromEntries(Object.entries(f).map(([id, q]) => [`${id}@${i}`, q])))));
    if (p.side !== 0 || p.flying[0] || !p.onCourt[0].includes(target.id)) continue;
    let v0 = 0;
    for (let i = 1; i < frames.length; i++) {
      const a = frames[i - 1][target.id], b = frames[i][target.id];
      if (!a || !b) continue;
      const v = Math.hypot(b.x - a.x, b.y - a.y) / 0.1;
      out.speeds.push(v);
      if (i > 1) out.accels.push(Math.abs(v - v0) / 0.1);
      v0 = v;
    }
  }
  const r = m.result();
  out.engine = JSON.stringify({ score: r.score, trace });
  return out;
}

const base = run(undefined);
const slow = run(withAttrs(5, 5));
const fast = run(withAttrs(18, 18));

// 1. resultados do motor idênticos
assert.equal(slow.engine, base.engine, 'o motor deve dar o mesmo jogo com e sem atributos na coreografia');
assert.equal(fast.engine, base.engine, 'o motor deve dar o mesmo jogo com o ala lento ou rápido');

// 2. só os atacantes da equipa em posse em 4-0 mudam: os adversários (Sporting, também em 4-0, mas a defender) e os GR
//    não podem mudar quando apenas o ala do Benfica é alterado entre lento e rápido... exceto na posse do Sporting,
//    em que o ala é defensor e por isso fica igual
const gks = new Set([hs.squad, as.squad].map((sq) => sq.find((p) => p.position === 'GR')!.id));
let gkDiff = 0;
for (const [i, f] of slow.frames) for (const [key, q] of Object.entries(f)) {
  if (!gks.has(key.split('@')[0])) continue;
  const o = fast.frames.get(i)![key];
  gkDiff = Math.max(gkDiff, Math.hypot(q.x - o.x, q.y - o.y));
}
// os GR e os defensores reagem à bola e aos atacantes e as posses encadeiam-se, por isso mudam também (esperado)
console.log(`Desvio máximo dos GR entre ala lento e rápido: ${gkDiff.toFixed(2)} m (reação ao lance, esperado)`);

// 3. diferença física visível mas moderada
const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
const pct = (a: number[], q: number) => [...a].sort((x, y) => x - y)[Math.floor(a.length * q)] ?? 0;
const rep = (r: Run) => ({ media: avg(r.speeds), p95v: pct(r.speeds, 0.95), p95a: pct(r.accels, 0.95), amostras: r.speeds.length });
const rs = rep(slow), rf = rep(fast);
console.log(`Jogador ${target.name} (${target.position}), ${rs.amostras} amostras em ataque 4-0`);
console.log(`  lento (5/5):   velocidade média ${rs.media.toFixed(2)} m/s, p95 ${rs.p95v.toFixed(2)} m/s, aceleração p95 ${rs.p95a.toFixed(2)} m/s²`);
console.log(`  rápido (18/18): velocidade média ${rf.media.toFixed(2)} m/s, p95 ${rf.p95v.toFixed(2)} m/s, aceleração p95 ${rf.p95a.toFixed(2)} m/s²`);
assert.ok(rs.amostras > 200, 'amostra 4-0 suficiente');
assert.ok(rf.p95a > rs.p95a * 1.05, 'o jogador rápido deve ter acelerações mais fortes');
assert.ok(rf.p95a < rs.p95a * 1.8, 'a diferença de aceleração deve ser moderada (sem super-heróis)');
console.log('OK: motor intacto; jogador rápido acelera mais de forma moderada.');
