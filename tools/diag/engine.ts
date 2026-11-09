// Validação do motor de resultados (auditoria 2026): N épocas das ligas de Portugal e Espanha (2 voltas), com as
// táticas que a IA escolhe e as mudanças táticas durante o jogo. Mede golos/jogo, casa/empate/fora, distribuição dos
// sistemas usados (no início e no fim dos jogos) e campeões por pontos. Mesma semente = mesmos números.
// Uso: npx esbuild tools/diag/engine.ts --bundle --platform=node --format=esm --outfile=diagnostics/.engine.mjs && node diagnostics/.engine.mjs [--epocas 5] [--nome x]
import { writeFileSync } from 'node:fs';
import { newGame } from '../../src/core/state';
import { setupFor, ITA_GOAL_FACTOR, FRA_GOAL_FACTOR, ITA_TIE, FRA_TIE } from '../../src/core/game';
import { simulateMatch } from '../../src/core/engine/match';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const SEASONS = Number(arg('epocas', '5'));
const name = arg('nome', 'motor');
const s = newGame('Validação', 'Portugal', 'slb');
s.clubId = '__nenhum__'; // todas as equipas com táticas da IA
let n = 0, goals = 0, home = 0, draw = 0, away = 0, low = 0;
const sysStart: Record<string, number> = {}, sysEnd: Record<string, number> = {};
const champs: string[][] = [];
const perLg: Record<string, { n: number; g: number; h: number; d: number }> = {};
for (let se = 0; se < SEASONS; se++) {
  const row: string[] = [];
  for (const lg of s.leagues) {
    const pts: Record<string, number> = {}, gd: Record<string, number> = {};
    for (const h of lg.clubIds) for (const a of lg.clubIds) {
      if (h === a) continue;
      const hs = setupFor(s, h), as = setupFor(s, a);
      sysStart[hs.tactics.system] = (sysStart[hs.tactics.system] ?? 0) + 1; sysStart[as.tactics.system] = (sysStart[as.tactics.system] ?? 0) + 1;
      const r = simulateMatch(hs, as, { seed: `val${se}-${h}-${a}`, goalFactor: lg.id === 'ita1' ? ITA_GOAL_FACTOR : lg.id === 'fra1' ? FRA_GOAL_FACTOR : undefined, tieCaution: lg.id === 'ita1' ? ITA_TIE : lg.id === 'fra1' ? FRA_TIE : undefined });
      sysEnd[hs.tactics.system] = (sysEnd[hs.tactics.system] ?? 0) + 1; sysEnd[as.tactics.system] = (sysEnd[as.tactics.system] ?? 0) + 1;
      const [x, y] = r.score; n++; const L = (perLg[lg.name] ??= { n: 0, g: 0, h: 0, d: 0 }); L.n++; L.g += x + y; if (x > y) L.h++; else if (x === y) L.d++; goals += x + y; if (x + y < 3) low++;
      if (x > y) { home++; pts[h] = (pts[h] ?? 0) + 3; } else if (y > x) { away++; pts[a] = (pts[a] ?? 0) + 3; } else { draw++; pts[h] = (pts[h] ?? 0) + 1; pts[a] = (pts[a] ?? 0) + 1; }
      gd[h] = (gd[h] ?? 0) + x - y; gd[a] = (gd[a] ?? 0) + y - x;
    }
    const best = [...lg.clubIds].sort((p, q) => (pts[q] ?? 0) - (pts[p] ?? 0) || (gd[q] ?? 0) - (gd[p] ?? 0))[0];
    row.push(`${lg.name}: ${s.clubs.find((c) => c.id === best)?.name}`);
  }
  champs.push(row);
}
const pct = (v: number) => Math.round((1000 * v) / n) / 10;
const dist = (o: Record<string, number>) => { const t = Object.values(o).reduce((a, b) => a + b, 0); return Object.fromEntries(Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, `${Math.round((1000 * v) / t) / 10}%`])); };
const out = { epocas: SEASONS, jogos: n, golosPorJogo: Math.round((goals / n) * 100) / 100, casa: pct(home), empates: pct(draw), fora: pct(away), menosDe3Golos: pct(low), sistemasNoInicio: dist(sysStart), sistemasNoFim: dist(sysEnd), campeoes: champs, porLiga: Object.fromEntries(Object.entries(perLg).map(([k, v]) => [k, { golos: Math.round((v.g / v.n) * 100) / 100, casa: Math.round((1000 * v.h) / v.n) / 10, empates: Math.round((1000 * v.d) / v.n) / 10 }])) };
writeFileSync(`diagnostics/motor-${name}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
