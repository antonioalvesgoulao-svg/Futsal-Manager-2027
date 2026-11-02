// Despedimentos de treinadores em várias épocas completas do jogo (calendário, jogos, direção), sem o jogador
// interferir: conta quantos treinadores são despedidos por época e com que registo. Uso: ... careers.ts && node ... [--epocas 3]
import { newGame } from '../../src/core/state';
import { advance, playMyMatch } from '../../src/core/game';
const ai = process.argv.indexOf('--epocas');
const N = ai > 0 ? Number(process.argv[ai + 1]) : 3;
const s = newGame('T', 'PT', 'scp');
const seen = new Set<string>();
const per: number[] = [];
for (let y = 0; y < N; y++) {
  let sacked = 0;
  for (;;) {
    const r = advance(s);
    if (r.kind === 'match') playMyMatch(s, r.fixture);
    for (const n of s.news) { const k = n.date + n.text; if (!seen.has(k)) { seen.add(k); if (/despediu/.test(n.text)) { sacked++; console.log(n.date, n.text.slice(0, 150)); } } }
    if (r.kind === 'seasonEnd') break;
  }
  per.push(sacked);
}
console.log('despedimentos por época:', per.join(', '));
