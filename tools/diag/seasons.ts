// Várias épocas (por omissão 4 x 132 jogos), com táticas sorteadas por equipa e por época (sistema, pressão,
// marcação, ritmo, estilo do GR) para cobrir todos os casos. Além das medidas da época, procura anomalias e guarda
// os piores lances de cada uma (época, jogo, posse, instante) para os rever em imagem.
// Uso: ... seasons.ts ... && node diagnostics/.seasons.mjs [--epocas 4]
// (base: época completa da Liga Placard (132 jogos, 2 voltas) passada pela coreografia que alimenta o 2D/3D, com atributos.
// Mede o que se veria no 3D: ritmo de corrida, saltos de posição, sobreposições, bola, remates, GR, enquadramento.
// Uso: npx esbuild tools/diag/season.ts --bundle --platform=node --format=esm --outfile=diagnostics/.season.mjs && node diagnostics/.season.mjs
import { writeFileSync } from 'node:fs';
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo, type StartState } from '../../src/core/visual/choreo';
import { suggestTactics } from '../../src/core/tactics';

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
const ai = process.argv.indexOf('--epocas');
const SEASONS = ai > 0 ? Number(process.argv[ai + 1]) : 4;
const rnd = (seed: number) => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
const pick = <T,>(r: () => number, a: T[]) => a[Math.floor(r() * a.length)];
const worst: Record<string, { v: number; where: string }[]> = {};
const note = (k: string, v: number, where: string) => { const w = (worst[k] ??= []); w.push({ v, where }); w.sort((x, y) => y.v - x.v); if (w.length > 5) w.pop(); };
const sysCount: Record<string, number> = {};
for (let se = 0; se < SEASONS; se++) {
 const r = rnd(1000 + se * 77);
 const tac: Record<string, any> = {};
 for (const c of CLUBS) tac[c] = { system: pick(r, ['3-1', '3-1', '4-0', '2-2', '1-2-1']), pressure: pick(r, ['alta', 'media', 'media', 'baixa']), marking: pick(r, ['zona', 'zona', 'individual', 'misto']), tempo: pick(r, ['rapido', 'equilibrado', 'paciente']), gkStyle: pick(r, ['classico', 'classico', 'construtor', 'avancado']) };
for (const h of CLUBS) for (const a of CLUBS) {
  if (ONLY && games >= 12) break;
  if (h === a) continue;
  const hs = setupFor(s, h), as = setupFor(s, a);
  hs.tactics = suggestTactics(hs.squad, tac[h]); as.tactics = suggestTactics(as.squad, tac[a]);
  sysCount[tac[h].system] = (sysCount[tac[h].system] ?? 0) + 1;
  const pl = Object.fromEntries([...hs.squad, ...as.squad].map((p) => [p.id, p]));
  const m = createMatch(hs, as, { seed: `epocas${se}-${h}-${a}` });
  let start: StartState | null = null;
  let pi = -1;
  while (m.step()) {
    const sn = m.snapshot();
    if (!sn.possession) { start = null; continue; }
    const P = sn.possession;
    const c: any = new Choreo(P, [hs.tactics, as.tactics], sn.period, start, m.names, pl);
    start = c.end;
    pi++;
    const where = `${se}|${h}|${a}|${pi}`;
    const still: Record<string, number> = {};
    const vi = process.argv.indexOf('--ver');
    if (vi > 0 && process.argv[vi + 1] === where) {
      const gD = c.gkD, gA = c.gkA;
      console.log('POSSE', where, 'lado', P.side, 'voador', JSON.stringify(P.flying), 'fases', c.phases.map((x: any) => x.t.toFixed(1) + ' ' + x.text).join(' | '));
      console.log('acoes', JSON.stringify(P.actions.map((x: any) => [x.type, x.kind, x.result])));
      for (const b of c.balls) if (b.k === 'fly' && typeof b.from === 'string') console.log('fly', b.from, b.t0.toFixed(2), b.t1.toFixed(2), JSON.stringify(c.tr.get(b.from)?.at(b.t0)), JSON.stringify(b.b), JSON.stringify(c.acts.filter((y: any) => y.id === b.from && y.t0 <= b.t0 + 0.5 && y.t1 >= b.t0 - 0.5).map((y: any) => [y.kind, y.t0.toFixed(2)])));
      for (let t = -c.lead; t <= c.duration + c.extra; t += 1) { const f = c.at(c.lead + t); console.log(t.toFixed(1), 'GRdef', JSON.stringify(f.pos[gD]), 'GRatq', JSON.stringify(f.pos[gA]), 'bola', JSON.stringify(f.ball), 'dono', f.holder, 'acts', JSON.stringify(Object.entries(f.acts).map(([k, v]: any) => [k, v.kind]))); }
      const pid = process.argv[process.argv.indexOf('--ver') + 2];
      if (pid) { const tr = c.tr.get(pid); console.log('keys', JSON.stringify(tr.keys.filter((k: any) => k.t < 1.5).map((k: any) => [k.t.toFixed(2), k.x.toFixed(1), k.y.toFixed(1), k.hold]))); for (let t = 0; t < 0.8; t += 0.05) console.log(t.toFixed(2), JSON.stringify(c.at(c.lead + t).pos[pid]), JSON.stringify(c.at(c.lead + t).acts[pid])); console.log('baked t0', tr.baked?.t0, 'lead', c.lead, 'fixed', JSON.stringify(c.fixed.get(pid))); }
      process.exit(0);
    }
    add('posses'); push('duracaoPosse', c.duration);
    push('passesPosse', c.balls.filter((b: any) => b.k === 'pass').length);
    const gks = new Set([P.onCourt[0][0], P.onCourt[1][0]]);
    let prev: Record<string, P2> | null = null;
    let prevBall: P2 | null = null;
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
          if (v > 10) { add('saltos'); note('saltos', v, `${where}|${t.toFixed(1)}|${id}`); }
          if (!gks.has(id) && v > 8.6 && v <= 10) add('sobreHumano');
          // jogador "congelado" com a bola perto (mais de 4 s parado a menos de 8 m da bola)
          if (!gks.has(id)) { if (v < 0.3 && dist(q, f.ball) < 8) { still[id] = (still[id] ?? 0) + 0.1; if (Math.abs(still[id] - 4) < 0.05) { add('congelados'); note('congelados', 4, `${where}|${t.toFixed(1)}|${id}`); } } else still[id] = 0; }
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
      // bola sem dono em jogo corrido longe de toda a gente (bola "morta")
      const bv = prevBall ? dist(f.ball, prevBall) / 0.1 : 0; prevBall = f.ball;
      if (!f.holder && bv < 1) { let nb = 99; for (const id of ids) nb = Math.min(nb, dist(f.pos[id], f.ball)); if (nb > 4) { add('bolaMorta'); if (nb > 8) note('bolaMorta', nb, `${where}|${t.toFixed(1)}`); } }
      // GR fora da sua área em jogo corrido sem ser GR avançado nem a jogar com os pés
      for (const sd of [0, 1]) { const gk = P.onCourt[sd][0]; if (!gk || P.flying[sd] || !f.pos[gk] || f.holder === gk) continue; const gx = c.sideOf.get(gk) === c.att ? -c.dirA * 20 : c.dirA * 20; const off = Math.abs(gx - f.pos[gk].x); if (off > 7 && c.sideOf.get(gk) !== c.att) { add('grForaDefesa'); note('grForaDefesa', off, `${where}|${t.toFixed(1)}|${gk}`); } }
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
    // remates impossíveis (bola > 36 m/s) e GR sem gesto a remate à baliza
    for (const b of c.balls) if (b.k === 'fly' && typeof b.from === 'string') { const fp = c.tr.get(b.from)?.at(b.t0); if (fp && typeof b.b !== 'string') { const vv = dist(fp, b.b) / Math.max(0.01, b.t1 - b.t0); if (vv > 36) { add('rematesRapidos'); note('rematesRapidos', vv, where); } } }
    for (const x of P.actions) if (x.type === 'shot' && (x.result === 'saved' || x.result === 'goal')) {
      const sd = x.side; const gk = P.onCourt[1 - sd][0];
      if (gk && !P.flying[1 - sd] && !c.acts.some((y: any) => y.id === gk && ['dive', 'splits', 'spread', 'catch'].includes(y.kind))) { add('defesaSemGesto' + x.result); if (x.result === 'saved') note('defesaSemGesto', 1, where); }
      add('rematesBaliza');
    }
  }
  games++; goals += m.result().score[0] + m.result().score[1];
}
}
const q = (a: number[] = [], p: number) => { const z = [...a].sort((x, y) => x - y); return Math.round((z[Math.floor(z.length * p)] ?? 0) * 100) / 100; };
const pct = (k: string, d: string) => Math.round((1000 * (N[k] ?? 0)) / (N[d] || 1)) / 10;
const playMin = (N.frames ?? 0) / 600;
const per = (k: string) => Math.round(((N[k] ?? 0) / games) * 100) / 100;
const out = {
  epocas: SEASONS, sistemasSorteados: sysCount,
  anomaliasPorJogo: { congelados4s: per('congelados'), bolaMortaSeg: per('bolaMorta') / 10, grForaDaAreaSeg: per('grForaDefesa') / 10, velocidadeSobreHumanaSeg: per('sobreHumano') / 10, rematesAcima130kmh: per('rematesRapidos'), defesasSemGesto: per('defesaSemGestosaved'), golosSemGesto: per('defesaSemGestogoal') },
  piores: worst,
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
writeFileSync('diagnostics/epocas.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
