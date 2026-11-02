// Época completa da Liga Placard (132 jogos, 2 voltas) passada pela coreografia que alimenta o 2D/3D, com atributos.
// Mede o que se veria no 3D: ritmo de corrida, saltos de posição, sobreposições, bola, remates, GR, enquadramento.
// Uso: npx esbuild tools/diag/season.ts --bundle --platform=node --format=esm --outfile=diagnostics/.season.mjs && node diagnostics/.season.mjs
import { writeFileSync } from 'node:fs';
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo, type StartState } from '../../src/core/visual/choreo';

const CLUBS = ['scp', 'slb', 'scb', 'fun', 'lps', 'fzz', 'ele', 'rav', 'uvn', 'por', 'fam', 'tor'];
const s = newGame('Época', 'Portugal', 'slb');
type P2 = { x: number; y: number };
const dist = (a: P2, b: P2) => Math.hypot(a.x - b.x, a.y - b.y);
const segD = (a: P2, b: P2, q: P2) => { const ax = b.x - a.x, ay = b.y - a.y, l2 = ax * ax + ay * ay || 1; const k = Math.max(0, Math.min(1, ((q.x - a.x) * ax + (q.y - a.y) * ay) / l2)); return Math.hypot(a.x + ax * k - q.x, a.y + ay * k - q.y); };

const N: Record<string, number> = {};
const add = (k: string, v = 1) => { N[k] = (N[k] ?? 0) + v; };
const L: Record<string, number[]> = {};
const push = (k: string, v: number) => { (L[k] ??= []).push(v); };
let games = 0, goals = 0;
const t0 = Date.now();
const ONLY = process.argv.includes('--rapido');
for (const h of CLUBS) for (const a of CLUBS) {
  if (ONLY && games >= 12) break;
  if (h === a) continue;
  const hs = setupFor(s, h), as = setupFor(s, a);
  const pl = Object.fromEntries([...hs.squad, ...as.squad].map((p) => [p.id, p]));
  const m = createMatch(hs, as, { seed: `epoca-${h}-${a}` });
  let start: StartState | null = null;
  while (m.step()) {
    const sn = m.snapshot();
    if (!sn.possession) { start = null; continue; }
    const P = sn.possession;
    const c: any = new Choreo(P, [hs.tactics, as.tactics], sn.period, start, m.names, pl);
    start = c.end;
    add('posses'); push('duracaoPosse', c.duration);
    push('passesPosse', c.balls.filter((b: any) => b.k === 'pass').length);
    const gks = new Set([P.onCourt[0][0], P.onCourt[1][0]]);
    let prev: Record<string, P2> | null = null;
    for (let t = 0; t <= c.duration; t += 0.1) {
      const f = c.at(c.lead + t);
      if (f.stoppage) { prev = null; continue; }
      add('frames');
      const ids = Object.keys(f.pos).filter((id) => c.sideOf.has(id));
      for (const id of ids) {
        const q = f.pos[id];
        if (!gks.has(id) && (Math.abs(q.x) > 20.4 || Math.abs(q.y) > 10.4)) add('foraDoCampo');
        if (prev && prev[id]) {
          const v = dist(q, prev[id]) / 0.1;
          if (v > 10) add('saltos');
          if (!gks.has(id)) {
            add('amostrasCampo'); add('distCampo', v * 0.1);
            const role = c.sideOf.get(id) === c.att ? 'Atac' : 'Def'; add('am' + role); add('dist' + role, v * 0.1);
            add(v < 0.5 ? 'v_parado' : v < 2 ? 'v_andar' : v < 4 ? 'v_trote' : v < 5.5 ? 'v_corrida' : v < 7 ? 'v_rapida' : 'v_sprint');
          }
        }
      }
      // sobreposições (dois corpos no mesmo sítio)
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (dist(f.pos[ids[i]], f.pos[ids[j]]) < 0.4) { add('sobreposicoes'); const same = c.sideOf.get(ids[i]) === c.sideOf.get(ids[j]); const gk = gks.has(ids[i]) || gks.has(ids[j]); const hold = f.holder === ids[i] || f.holder === ids[j]; add('sob_' + (gk ? 'comGR' : same ? 'colegas' : hold ? 'adversarioPortador' : 'adversarios')); }
      // bola: longe de quem a tem, alta demais em jogo corrido
      if (f.holder && f.pos[f.holder] && dist(f.pos[f.holder], f.ball) > 1.3 && f.ball.z < 0.5) add('bolaSolta');
      if (f.ball.z > 3.2) add('bolaAlta');
      // portador: distância ao defensor mais próximo
      if (f.holder && !gks.has(f.holder)) {
        const sd = c.sideOf.get(f.holder);
        let md = 99; for (const id of ids) if (c.sideOf.get(id) !== sd && !gks.has(id)) md = Math.min(md, dist(f.pos[id], f.pos[f.holder]));
        push('portadorDef', md);
      }
      prev = f.pos;
    }
    // remates: enquadramento defensivo e posição
    for (const x of c.acts) if (x.kind === 'shoot') {
      const fly = c.balls.find((b: any) => b.k === 'fly' && b.from === x.id && b.t0 > x.t0 && b.t0 < x.t1);
      if (!fly) continue;
      const T = fly.t0, sd = c.sideOf.get(x.id), sp = c.tr.get(x.id).at(T);
      const gx = Math.sign(fly.b.x) * 20, goal = { x: gx, y: 0 };
      add('remates'); push('distRemate', dist(sp, goal));
      let md = 99, between = false;
      for (const id of [...c.attOut, ...c.defOut]) if (c.sideOf.get(id) !== sd && !gks.has(id)) {
        const q = c.tr.get(id).at(T); md = Math.min(md, dist(q, sp));
        if (segD(sp, goal, q) < 1.2 && Math.abs(gx - q.x) < Math.abs(gx - sp.x)) between = true;
      }
      push('rematadorDef', md); if (between) add('rematesComDefensorNoCaminho');
      const kId = P.onCourt[1 - sd][0];
      if (kId && !P.flying[1 - sd]) {
        const gp = c.tr.get(kId).at(T); const dl = dist(sp, goal);
        const tight = Math.abs(sp.y) > 1.3 && Math.abs(gx - sp.x) < Math.abs(sp.y) * 1.2;
        push('grErro', dist(gp, c.gkSpot(gx, sp, tight ? 0.35 : Math.min(2.2, 0.45 + dl * 0.12))));
      }
    }
    for (const x of c.acts) add('acao_' + x.kind);
  }
  games++; goals += m.result().score[0] + m.result().score[1];
}
const q = (a: number[] = [], p: number) => { const z = [...a].sort((x, y) => x - y); return Math.round((z[Math.floor(z.length * p)] ?? 0) * 100) / 100; };
const pct = (k: string, d: string) => Math.round((1000 * (N[k] ?? 0)) / (N[d] || 1)) / 10;
const playMin = (N.frames ?? 0) / 600;
const out = {
  jogos: games, golosPorJogo: Math.round((goals / games) * 100) / 100, minutosJogoCorrido: Math.round(playMin),
  segundos: Math.round((Date.now() - t0) / 1000),
  velocidades: { parado: pct('v_parado', 'amostrasCampo'), andar: pct('v_andar', 'amostrasCampo'), trote: pct('v_trote', 'amostrasCampo'), corrida: pct('v_corrida', 'amostrasCampo'), rapida: pct('v_rapida', 'amostrasCampo'), sprint: pct('v_sprint', 'amostrasCampo') },
  metrosPorMinutoJogador: Math.round((N.distCampo ?? 0) / ((N.amostrasCampo ?? 1) / 600)),
  metrosPorMinutoAtacantes: Math.round((N.distAtac ?? 0) / ((N.amAtac ?? 1) / 600)), metrosPorMinutoDefensores: Math.round((N.distDef ?? 0) / ((N.amDef ?? 1) / 600)),
  saltosPorJogo: Math.round(((N.saltos ?? 0) / games) * 10) / 10,
  foraDoCampoPorJogo: Math.round(((N.foraDoCampo ?? 0) / games) * 10) / 10,
  sobreposicoesSegPorJogo: Math.round(((N.sobreposicoes ?? 0) / 10 / games) * 10) / 10,
  bolaSoltaSegPorJogo: Math.round(((N.bolaSolta ?? 0) / 10 / games) * 10) / 10,
  bolaAltaSegPorJogo: Math.round(((N.bolaAlta ?? 0) / 10 / games) * 10) / 10,
  possesPorJogo: Math.round((N.posses ?? 0) / games), duracaoPosse: { med: q(L.duracaoPosse, 0.5), p90: q(L.duracaoPosse, 0.9) },
  passesPorPosse: { med: q(L.passesPosse, 0.5), p90: q(L.passesPosse, 0.9) },
  portadorDefensorMaisProximo: { med: q(L.portadorDef, 0.5), p10: q(L.portadorDef, 0.1), p90: q(L.portadorDef, 0.9) },
  rematesPorJogo: Math.round(((N.remates ?? 0) / games) * 10) / 10, distanciaRemate: { med: q(L.distRemate, 0.5), p10: q(L.distRemate, 0.1), p90: q(L.distRemate, 0.9) },
  rematadorDefensorMaisProximo: { med: q(L.rematadorDef, 0.5), p10: q(L.rematadorDef, 0.1), p90: q(L.rematadorDef, 0.9) },
  rematesComDefensorNoCaminho: pct('rematesComDefensorNoCaminho', 'remates'),
  grErroNoRemate: { med: q(L.grErro, 0.5), p90: q(L.grErro, 0.9) },
  sobreposicoesTipo: Object.fromEntries(Object.entries(N).filter(([k]) => k.startsWith('sob_')).map(([k, v]) => [k.slice(4), Math.round((v / 10 / games) * 10) / 10])),
  acoesPorJogo: Object.fromEntries(Object.entries(N).filter(([k]) => k.startsWith('acao_')).map(([k, v]) => [k.slice(5), Math.round((v / games) * 10) / 10])),
};
writeFileSync('diagnostics/epoca.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
