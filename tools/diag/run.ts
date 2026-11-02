// Diagnóstico da simulação tática (Fase 0): corre vários jogos com uma semente fixa, mede o jogo corrido
// da coreografia (o mesmo que se vê no 2D/3D) e escreve um relatório comparável entre versões.
// Uso:  npm run diag -- --seed base --jogos 12 [--nome atual] [--comparar diagnostics/atual.json]
// Não mexe no jogo: só lê o motor e a coreografia. Corre fora do browser (Node), por isso não pesa no jogo.
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo, type StartState } from '../../src/core/visual/choreo';
import { emptyMetrics, measurePossession, summarize, TH, type Metrics } from '../../src/core/diagnostics/metrics';
import type { Possession } from '../../src/core/engine/match';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const seed = arg('seed', 'base');
const nGames = Number(arg('jogos', '12'));
const name = arg('nome', 'atual');
const cmp = arg('comparar', '');
// --atributos: passa os jogadores à coreografia como o jogo ao vivo (física individual no 4-0); sem a opção mantém a linha de base
const useAttrs = process.argv.includes('--atributos');

// jogos fixos (mesmos confrontos em todas as versões): grandes, médios e pequenos, Portugal e Espanha
const PAIRS: [string, string][] = [
  ['slb', 'scp'], ['scb', 'fun'], ['lps', 'tor'], ['rav', 'uvn'], ['por', 'fam'], ['ele', 'fzz'],
  ['bar', 'epz'], ['jca', 'pal'], ['int', 'jae'], ['val', 'man'], ['zar', 'pen'], ['par', 'noi'],
  ['scp', 'fam'], ['epz', 'stc'], ['slb', 'tor'], ['bar', 'eji'],
];

const s = newGame('Diagnóstico', 'Portugal', 'slb');
const total: Metrics = emptyMetrics();
const perGame: { jogo: string; resultado: string; m: ReturnType<typeof summarize> }[] = [];
const t0 = Date.now();
for (let g = 0; g < nGames; g++) {
  const [h, a] = PAIRS[g % PAIRS.length];
  const hs = setupFor(s, h), as = setupFor(s, a);
  const m = createMatch(hs, as, { seed: `${seed}-${g}` });
  const one = emptyMetrics();
  const playersById = useAttrs ? Object.fromEntries([...hs.squad, ...as.squad].map((p) => [p.id, p])) : undefined;
  let start: StartState | null = null;
  let prev: { p: Possession } | null = null;
  // encadeia as posses exatamente como o jogo ao vivo (a posse seguinte parte de onde a anterior acabou)
  while (m.step()) {
    const sn = m.snapshot();
    if (!sn.possession) { start = null; prev = null; continue; }
    const c = new Choreo(sn.possession, [hs.tactics, as.tactics], sn.period, start, m.names, playersById);
    start = c.end;
    measurePossession(one, sn.possession, c, prev);
    measurePossession(total, sn.possession, c, prev);
    prev = { p: sn.possession };
  }
  const res = m.result();
  perGame.push({ jogo: `${h}-${a}`, resultado: `${res.score[0]}-${res.score[1]}`, m: summarize(one) });
}
const summary = summarize(total);
let commit = '';
try { commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch { /* fora do git */ }
const out = { versao: name, semente: seed, jogos: nGames, atributos: useAttrs, commit, data: new Date().toISOString(), limiares: TH, segundos: Math.round((Date.now() - t0) / 1000), resumo: summary, porJogo: perGame };
mkdirSync('diagnostics', { recursive: true });
writeFileSync(`diagnostics/${name}.json`, JSON.stringify(out, null, 1));

// relatório em texto (Markdown), com comparação opcional com outra versão
let base: typeof out | null = null;
if (cmp && existsSync(cmp)) base = JSON.parse(readFileSync(cmp, 'utf8'));
const rows = Object.entries(summary).map(([k, v]) => {
  const b = base ? (base.resumo as Record<string, number | null>)[k] : undefined;
  const diff = base && typeof v === 'number' && typeof b === 'number' ? ` | ${b} | ${v - b >= 0 ? '+' : ''}${Math.round((v - b) * 100) / 100}` : base ? ' | — | —' : '';
  return `| ${k} | ${v ?? '—'}${diff} |`;
});
const md = [
  `# Diagnóstico da simulação tática — ${name}`,
  ``,
  `Semente **${seed}**, ${nGames} jogos${useAttrs ? ', com atributos na coreografia' : ''} (mesmos confrontos e semente em todas as versões), commit ${commit || '?'}, ${out.data.slice(0, 10)}.`,
  ``,
  base ? `| Métrica | ${name} | ${base.versao} | Diferença |\n|---|---|---|---|` : `| Métrica | Valor |\n|---|---|`,
  ...rows,
  ``,
  `## Por jogo`,
  `| Jogo | Resultado | Largura c/ bola | Linhas livres | Obstruídas % | Passes/min | Atravessam % | Parado c/ bola % |`,
  `|---|---|---|---|---|---|---|---|`,
  ...perGame.map((x) => `| ${x.jogo} | ${x.resultado} | ${x.m['Largura da equipa com bola (m)']} | ${x.m['Linhas de passe livres por instante']} | ${x.m['Linhas de passe obstruídas (%)']} | ${x.m['Passes por minuto de jogo corrido']} | ${x.m['Passes que atravessam um adversário (%)']} | ${x.m['Tempo parado, jogadores com bola (%)']} |`),
  ``,
  `Definições: ${JSON.stringify(TH)}`,
].join('\n');
writeFileSync(`diagnostics/${name}.md`, md);
console.log(md.split('## Por jogo')[0]);
console.log(`(${out.segundos} s; ficheiros diagnostics/${name}.json e diagnostics/${name}.md)`);
