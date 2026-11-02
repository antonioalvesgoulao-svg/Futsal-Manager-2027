// Época portuguesa: calendário e regras das competições (formatos reais)
//
// Liga Placard: 2 voltas; play-off com os 8 primeiros (quartos e meias à melhor de 3, final à melhor de 5)
// Taça da Liga: final eight com os 8 primeiros no fim da 1.ª volta (jogos únicos, local neutro, em janeiro;
//   sorteio livre, exceto os 2 primeiros não se cruzarem nos quartos)
// Taça de Portugal: eliminatória inicial e final eight em Gondomar em abril (jogos únicos)
//   (as equipas das divisões inferiores entram quando essas divisões existirem no jogo)
// Supertaça: campeão contra vencedor da Taça (se for o mesmo, joga com o finalista vencido), no início da época
import { rng } from '../attributes';
import type { CompId, Fixture, FixtureResult, SeasonState, Series } from './types';

export const addDays = (d: string, n: number) => {
  const x = new Date(d + 'T12:00:00Z');
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const weekday = (d: string) => new Date(d + 'T12:00:00Z').getUTCDay(); // 0 = domingo
const nextWeekday = (d: string, wd: number) => addDays(d, (wd - weekday(d) + 7) % 7);

// Datas-chave de uma época que começa no ano `y`
export function keyDates(y: number) {
  const n = y + 1;
  return {
    supertaca: nextWeekday(`${y}-09-01`, 6),
    leagueStart: nextWeekday(`${y}-09-10`, 6),
    tacaR1: nextWeekday(`${y}-12-07`, 3),
    tacaLigaQF: addDays(nextWeekday(`${n}-01-25`, 6), -2), // quinta
    tacaLigaSF: nextWeekday(`${n}-01-25`, 6), // sábado
    tacaLigaF: addDays(nextWeekday(`${n}-01-25`, 6), 1), // domingo
    playoffQF: nextWeekday(`${n}-03-12`, 6),
    playoffSF: nextWeekday(`${n}-04-02`, 6),
    tacaQF: nextWeekday(`${n}-04-20`, 3), // quarta
    tacaSF: addDays(nextWeekday(`${n}-04-20`, 3), 2), // sexta
    tacaF: addDays(nextWeekday(`${n}-04-20`, 3), 4), // domingo
    playoffF: nextWeekday(`${n}-05-08`, 6),
    end: `${n}-06-30`,
  };
}

// Jornadas da liga aos sábados, saltando o Natal/Ano Novo e o fim de semana da Taça da Liga
function leagueDates(y: number, rounds: number) {
  const k = keyDates(y);
  const blocked = (d: string) => (d >= `${y}-12-23` && d <= `${y + 1}-01-04`) || (d >= addDays(k.tacaLigaSF, -3) && d <= k.tacaLigaF);
  const out: string[] = [];
  let d = k.leagueStart;
  while (out.length < rounds) {
    if (!blocked(d)) out.push(d);
    d = addDays(d, 7);
  }
  return out;
}

// Todos contra todos (método do círculo), com alternância casa/fora
function roundRobin(ids: string[]): [string, string][][] {
  const t = [...ids];
  if (t.length % 2) t.push('__folga');
  const n = t.length;
  const rounds: [string, string][][] = [];
  for (let r = 0; r < n - 1; r++) {
    const games: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = t[i];
      const b = t[n - 1 - i];
      if (a === '__folga' || b === '__folga') continue;
      games.push([a, b]);
    }
    rounds.push(games);
    t.splice(1, 0, t.pop()!);
  }
  // casa/fora alternado: em cada jogo joga em casa quem jogou fora na jornada anterior
  // (desempate: quem tem menos jogos em casa), como nos calendários reais
  const last: Record<string, 'C' | 'F'> = {};
  const homes: Record<string, number> = {};
  for (const games of rounds) {
    for (let g = 0; g < games.length; g++) {
      const [a, b] = games[g];
      const score = (x: string) => (last[x] === 'F' ? 2 : last[x] === 'C' ? -2 : 0) - (homes[x] ?? 0) * 0.1;
      const [h, w] = score(a) >= score(b) ? [a, b] : [b, a];
      games[g] = [h, w];
      last[h] = 'C'; last[w] = 'F';
      homes[h] = (homes[h] ?? 0) + 1;
    }
  }
  return rounds;
}

let fid = 0;
const newId = (y: number) => `f${y}_${++fid}`;

/**
 * Cria a época.
 * @param ranking  clubes ordenados pela época anterior (melhor primeiro): define cabeças de série na Taça
 * @param supercup [campeão, vencedor da Taça ou finalista]
 */
export function createSeason(y: number, ranking: string[], supercup: [string, string], esp?: { ranking: string[]; four: string[] }, ita?: { ranking: string[]; four: string[] }): SeasonState {
  fid = 0;
  const r = rng('calendario' + y);
  const shuffled = [...ranking].sort(() => r() - 0.5);
  const first = roundRobin(shuffled);
  const rounds = [...first, ...first.map((g) => g.map(([a, b]) => [b, a] as [string, string]))];
  const dates = leagueDates(y, rounds.length);
  const k = keyDates(y);
  const fixtures: Fixture[] = [];

  fixtures.push({ id: newId(y), comp: 'supertaca', stage: 'Final', date: k.supertaca, home: supercup[0], away: supercup[1], neutral: true, knockout: true });

  rounds.forEach((games, i) =>
    games.forEach(([h, a]) => fixtures.push({ id: newId(y), comp: 'liga', stage: `Jornada ${i + 1}`, round: i + 1, date: dates[i], home: h, away: a, knockout: false }))
  );

  // Taça de Portugal: 1.ª eliminatória entre os classificados de 5.º a 12.º (o pior classificado joga em casa)
  const low = ranking.slice(4);
  for (let i = 0; i < low.length / 2; i++) {
    const strong = low[i];
    const weak = low[low.length - 1 - i];
    fixtures.push({ id: newId(y), comp: 'taca', stage: '1.ª eliminatória', date: k.tacaR1, home: weak, away: strong, knockout: true });
  }

  const season: SeasonState = { year: y, label: `${y}/${String((y + 1) % 100).padStart(2, '0')}`, fixtures, series: [], winners: {}, finished: false };
  if (esp) addSpain(season, y, esp.ranking, esp.four);
  if (ita) addItaly(season, y, ita.ranking, ita.four);
  return season;
}

// ---------------- Espanha (RFEF, Liga Prime Futsal) ----------------
// Formato novo anunciado pela RFEF (texto enviado pelo António; o site da RFEF já mostra "Apertura" em 2026/27):
// - Torneio Apertura (set.–8 jan.) e Clausura (15 jan.–22 mai.), 16 equipas, 15 jornadas cada (Clausura = Apertura com casa/fora trocados);
//   cada torneio tem campeão
// - Supercampeão: fase final de 8 (29 mai.–30 jun.), eliminatórias à melhor de 3: 1.º e 2.º do Apertura e do Clausura + os melhores da
//   classificação acumulada até completar 8; prémio 50 000 €
// - Copa de España S.M. el Rey (normas RFEF 2026/27, Art. 8; 11–14 mar.): fase final de 8 = 6 primeiros do Apertura + 2 vencedores das
//   eliminatórias, onde o 7.º-16.º entram na 4.ª eliminatória com equipas das divisões inferiores (jogo único, o mais bem classificado no
//   Apertura em casa entre equipas da Prime). Sem divisões inferiores no jogo: 3 rondas só com o 7.º-16.º (aproximação). 1.º e 2.º do
//   Apertura em lados diferentes do quadro. Quartos e meias: penáltis diretos; final com prolongamento 2 x 3 min. Prémio 25 000 €
// - Supercopa (Art. 21-26): final four a jogo único, meias por sorteio (penáltis diretos), final com prolongamento; 2027/28 em diante:
//   Supercampeão, Apertura, Clausura, Copa (repetidos → melhores da classificação acumulada)
// - Descidas (acumulado): o último desce; 14.º e 15.º jogam a permanência à melhor de 3 (as descidas efetivas entram com a Segunda División)
// - Supercopa de España (final four no início da época): não consta do anúncio; mantida com campeões do Apertura, Clausura, Supercampeão e Copa (estimativa)
// - Vagas na Champions (melhor da classificação acumulada; Supercampeão): entram na etapa 13
// Datas exatas e ordem dos cruzamentos: estimativa.
export function spainDates(y: number) {
  const n = y + 1;
  const sat = (d: string) => nextWeekday(d, 6);
  return {
    superSF: addDays(sat(`${y}-09-01`), -1), superF: sat(`${y}-09-01`),
    aperturaStart: sat(`${y}-09-11`), aperturaEnd: `${n}-01-08`, clausuraStart: sat(`${n}-01-15`), clausuraEnd: `${n}-05-22`,
    qualR1: nextWeekday(`${n}-01-20`, 3), qualR2: nextWeekday(`${n}-02-03`, 3), qualR3: nextWeekday(`${n}-02-17`, 3),
    copaQF: `${n}-03-11`, copaSF: `${n}-03-13`, copaF: `${n}-03-14`,
    finalQF: sat(`${n}-05-29`), finalSF: sat(`${n}-06-09`), finalF: sat(`${n}-06-20`), perm: sat(`${n}-05-29`),
  };
}

function addSpain(s: SeasonState, y: number, ranking: string[], four: string[]) {
  const k = spainDates(y);
  const r = rng('calendario-esp' + y);
  const first = roundRobin([...ranking].sort(() => r() - 0.5));
  const blocked = (d: string) => (d >= `${y}-12-23` && d <= `${y + 1}-01-04`) || (d >= addDays(k.copaQF, -3) && d <= addDays(k.copaF, 1)) || d === k.superF;
  const dates = (from: string, to: string) => { const out: string[] = []; for (let d = from; out.length < first.length && d <= to; d = addDays(d, 7)) if (!blocked(d)) out.push(d); while (out.length < first.length) out.push(addDays(out[out.length - 1], 3)); return out; };
  const ap = dates(k.aperturaStart, k.aperturaEnd), cl = dates(k.clausuraStart, k.clausuraEnd);
  first.forEach((games, i) => games.forEach(([h, a]) => s.fixtures.push({ id: newId(y), comp: 'esp', stage: `Apertura - Jornada ${i + 1}`, round: i + 1, date: ap[i], home: h, away: a, knockout: false })));
  first.forEach((games, i) => games.forEach(([h, a]) => s.fixtures.push({ id: newId(y), comp: 'esp', stage: `Clausura - Jornada ${i + 1}`, round: first.length + i + 1, date: cl[i], home: a, away: h, knockout: false })));
  if (four.length >= 4) {
    s.fixtures.push({ id: newId(y), comp: 'superEsp', stage: 'Meias-finais', date: k.superSF, home: four[0], away: four[3], neutral: true, knockout: true });
    s.fixtures.push({ id: newId(y), comp: 'superEsp', stage: 'Meias-finais', date: k.superSF, home: four[1], away: four[2], neutral: true, knockout: true });
  }
  s.esp = {};
}

/** Classificação de um torneio (Apertura = jornadas 1-15, Clausura = 16-30) ou acumulada. */
export function spainTable(s: SeasonState, clubIds: string[], part: 'apertura' | 'clausura' | 'total', upToRound = 99) {
  const half = Math.max(0, ...s.fixtures.filter((f) => f.comp === 'esp').map((f) => f.round ?? 0)) / 2;
  if (part === 'apertura') return leagueTable(s, clubIds, Math.min(half, upToRound), 'esp');
  if (part === 'total') return leagueTable(s, clubIds, upToRound, 'esp');
  const all = leagueTable(s, clubIds, upToRound, 'esp'), ap = leagueTable(s, clubIds, half, 'esp');
  const rows = all.map((r) => { const a = ap.find((x) => x.club === r.club)!; return { ...r, p: r.p - a.p, w: r.w - a.w, d: r.d - a.d, l: r.l - a.l, gf: r.gf - a.gf, ga: r.ga - a.ga, pts: r.pts - a.pts }; });
  return rows.sort((x, y) => y.pts - x.pts || y.gf - y.ga - (x.gf - x.ga) || y.gf - x.gf || x.club.localeCompare(y.club));
}

function afterSpain(s: SeasonState, clubIds: string[], name: (id: string) => string, news: string[]) {
  if (!s.esp || !clubIds.length) return;
  const e = s.esp as NonNullable<SeasonState['esp']> & { clausura?: string[]; total?: string[] };
  const k = spainDates(s.year);
  const ssf = byStage(s, 'superEsp', 'Meias-finais');
  if (done(ssf) && !byStage(s, 'superEsp', 'Final').length) addCupRound(s, 'superEsp', 'Final', k.superF, [[winnerOf(ssf[0])!, winnerOf(ssf[1])!]], true);
  const liga = s.fixtures.filter((f) => f.comp === 'esp');
  const half = Math.max(...liga.map((f) => f.round ?? 0)) / 2;
  // fim do Apertura: campeão; Copa de España (6 primeiros) e eliminatórias do 7.º ao 16.º
  if (!e.halfTable && done(liga.filter((f) => (f.round ?? 0) <= half))) {
    const t = (e.halfTable = spainTable(s, clubIds, 'apertura').map((x) => x.club));
    s.winners.espAp = t[0];
    news.push(`${name(t[0])} vence o Torneio Apertura da Liga Prime Futsal.`);
    news.push(`Copa de España: ${t.slice(0, 6).map(name).join(', ')} apurados diretamente; do 7.º ao 16.º lutam pelas 2 vagas restantes.`);
    // 1.ª ronda: 9.º-16.º (o pior classificado em casa)
    addCupRound(s, 'copaEsp', 'Eliminatória 1', k.qualR1, [[t[8], t[15]], [t[9], t[14]], [t[10], t[13]], [t[11], t[12]]], false);
  }
  const q1 = byStage(s, 'copaEsp', 'Eliminatória 1');
  if (done(q1) && !byStage(s, 'copaEsp', 'Eliminatória 2').length) { const w = q1.map(winnerOf) as string[]; const hb = (a: string, b: string): [string, string] => (e.halfTable!.indexOf(a) < e.halfTable!.indexOf(b) ? [a, b] : [b, a]); addCupRound(s, 'copaEsp', 'Eliminatória 2', k.qualR2, [hb(w[0], w[3]), hb(w[1], w[2])], false); }
  const q2 = byStage(s, 'copaEsp', 'Eliminatória 2');
  if (done(q2) && e.halfTable && !byStage(s, 'copaEsp', 'Eliminatória 3').length) { const w = q2.map(winnerOf) as string[]; addCupRound(s, 'copaEsp', 'Eliminatória 3', k.qualR3, [[e.halfTable[6], w[0]], [e.halfTable[7], w[1]]], false); }
  const q3 = byStage(s, 'copaEsp', 'Eliminatória 3');
  if (done(q3) && e.halfTable && !byStage(s, 'copaEsp', 'Quartos-de-final').length) {
    const t = e.halfTable; const w = q3.map(winnerOf) as string[];
    addCupRound(s, 'copaEsp', 'Quartos-de-final', k.copaQF, [[t[0], w[1]], [t[3], t[4]], [t[1], w[0]], [t[2], t[5]]], true);
  }
  for (const [from, to, d] of [['Quartos-de-final', 'Meias-finais', k.copaSF], ['Meias-finais', 'Final', k.copaF]] as const) {
    const prev = byStage(s, 'copaEsp', from);
    if (done(prev) && !byStage(s, 'copaEsp', to).length) {
      const ws = prev.map(winnerOf) as string[];
      const pairs: [string, string][] = [];
      for (let i = 0; i < ws.length; i += 2) pairs.push([ws[i], ws[i + 1]]);
      addCupRound(s, 'copaEsp', to, d, pairs, true);
    }
  }
  for (const comp of ['copaEsp', 'superEsp'] as CompId[]) {
    const fin = byStage(s, comp, 'Final')[0];
    if (fin?.result && !s.winners[comp]) {
      s.winners[comp] = winnerOf(fin)!;
      news.push(`${name(s.winners[comp]!)} vence a ${comp === 'copaEsp' ? 'Copa de España' : 'Supercopa de España'}.`);
    }
  }
  // fim do Clausura: campeão, fase final do Supercampeão e permanência
  if (!e.regularTable && done(liga)) {
    const c = spainTable(s, clubIds, 'clausura').map((x) => x.club);
    const tot = (e.regularTable = spainTable(s, clubIds, 'total').map((x) => x.club));
    s.winners.espCl = c[0];
    news.push(`${name(c[0])} vence o Torneio Clausura. ${name(tot[0])} é o melhor da classificação acumulada.`);
    const eight: string[] = [];
    for (const x of [e.halfTable![0], e.halfTable![1], c[0], c[1], ...tot]) if (!eight.includes(x) && eight.length < 8) eight.push(x);
    const seed = [...eight].sort((a, b) => tot.indexOf(a) - tot.indexOf(b)); // cruzamentos pela classificação acumulada (estimativa)
    news.push(`Fase final do Supercampeão: ${seed.map(name).join(', ')}.`);
    for (const [a, b] of [[0, 7], [3, 4], [1, 6], [2, 5]]) makeSeries(s, 'Quartos-de-final', seed[a], seed[b], 3, k.finalQF, 'espPlayoff');
    makeSeries(s, 'Permanência', tot[13], tot[14], 3, k.perm, 'espPlayoff');
    news.push(`${name(tot[15])} termina em último e desceria à Segunda División; ${name(tot[13])} e ${name(tot[14])} jogam a permanência (as descidas entram quando a Segunda existir no jogo).`);
  }
  const rank = (x: string) => (e.regularTable ?? []).indexOf(x);
  const order = (a: string, b: string): [string, string] => (rank(a) <= rank(b) ? [a, b] : [b, a]);
  const ser = (stage: string) => s.series.filter((x) => x.comp === 'espPlayoff' && x.stage === stage);
  const qf = ser('Quartos-de-final');
  if (qf.length === 4 && qf.every((x) => x.winner) && !ser('Meias-finais').length) {
    makeSeries(s, 'Meias-finais', ...order(qf[0].winner!, qf[1].winner!), 3, k.finalSF, 'espPlayoff');
    makeSeries(s, 'Meias-finais', ...order(qf[2].winner!, qf[3].winner!), 3, k.finalSF, 'espPlayoff');
  }
  const sf = ser('Meias-finais');
  if (sf.length === 2 && sf.every((x) => x.winner) && !ser('Final').length) makeSeries(s, 'Final', ...order(sf[0].winner!, sf[1].winner!), 3, k.finalF, 'espPlayoff');
  const fin = ser('Final')[0];
  if (fin?.winner && !s.winners.esp) {
    s.winners.esp = fin.winner;
    news.push(`${name(fin.winner)} é o Supercampeão de Espanha!`);
  }
  const perm = ser('Permanência')[0];
  if (perm?.winner && !(e as { permDone?: boolean }).permDone) {
    (e as { permDone?: boolean }).permDone = true;
    news.push(`${name(perm.winner)} garante a permanência; ${name(perm.winner === perm.hi ? perm.lo : perm.hi)} desceria com o último.`);
  }
}

// ---------------- Itália (Divisione Calcio a 5, Serie A) ----------------
// Formato 2026/27 (Comunicati Ufficiali 027, 028 e 029 da Divisione Calcio a 5, agosto 2026):
// - Serie A: 14 clubes, 2 voltas (26 jornadas), 19 set. 2026 – 9 abr. 2027
// - Play-in (gara única em casa da melhor classificada; empate: prolongamento 2x5 e passa a melhor classificada):
//   A 7.º-8.º (vencedor = 7.ª cabeça de série), B 9.º-10.º, C perdedor A vs vencedor B (vencedor = 8.ª)
// - Play-off: quartos 1-8, 4-5, 3-6, 2-7; meias Q1-Q2 e Q3-Q4; tudo à melhor de 3, jogo 1 em casa do pior classificado,
//   jogos 2 e 3 em casa do melhor; prolongamento 2x5 e penáltis
// - Descidas: os 2 últimos; play-out a duas mãos entre o 11.º e o 12.º (ida em casa do 12.º); empate no agregado:
//   prolongamento e fica o mais bem classificado; com 8+ pontos de diferença não há play-out e desce o 12.º
// - Coppa Italia: Final Eight com os 8 primeiros no fim da 1.ª volta (modalidades a definir pela Divisione: quartos 1-8, 4-5,
//   3-6, 2-7 em campo neutro, estimativa)
// - Supercoppa: Final Four (2026/27: L84 campeão, Meta Catania Coppa Italia, Napoli melhor da fase regular, Feldi finalista
//   da Coppa); a partir de 2027/28 campeão, Coppa Italia, 1.º da fase regular e Coppa della Divisione (esta não existe no jogo:
//   entra o finalista da Coppa Italia)
// Datas da Coppa Italia e da Supercoppa, prolongamento do play-out (simplificado: empate no agregado = fica o 11.º): estimativa.
export function italyDates(y: number) {
  const n = y + 1;
  const fri = (d: string) => nextWeekday(d, 5);
  return {
    superSF: `${y}-09-05`, superF: `${y}-09-06`, leagueStart: fri(`${y}-09-18`), leagueEnd: `${n}-04-09`,
    coppaQF: `${n}-03-05`, coppaSF: `${n}-03-06`, coppaF: `${n}-03-07`,
    playInAB: `${n}-04-24`, playInC: `${n}-05-01`, qf: `${n}-05-08`, sf: `${n}-05-22`, f: `${n}-06-05`, playout1: `${n}-04-24`, playout2: `${n}-05-01`,
  };
}

function addItaly(s: SeasonState, y: number, ranking: string[], four: string[]) {
  const k = italyDates(y);
  const r = rng('calendario-ita' + y);
  const first = roundRobin([...ranking].sort(() => r() - 0.5));
  const rounds = [...first, ...first.map((g) => g.map(([a, b]) => [b, a] as [string, string]))];
  const blocked = (d: string) => (d >= `${y}-12-23` && d <= `${y + 1}-01-03`) || (d >= addDays(k.coppaQF, -2) && d <= addDays(k.coppaF, 1));
  const dates: string[] = [];
  for (let d = k.leagueStart; dates.length < rounds.length; d = addDays(d, 7)) if (!blocked(d)) dates.push(d);
  rounds.forEach((games, i) => games.forEach(([h, a]) => s.fixtures.push({ id: newId(y), comp: 'ita', stage: `Giornata ${i + 1}`, round: i + 1, date: dates[i], home: h, away: a, knockout: false })));
  if (four.length >= 4) {
    s.fixtures.push({ id: newId(y), comp: 'superIta', stage: 'Meias-finais', date: k.superSF, home: four[0], away: four[3], neutral: true, knockout: true });
    s.fixtures.push({ id: newId(y), comp: 'superIta', stage: 'Meias-finais', date: k.superSF, home: four[1], away: four[2], neutral: true, knockout: true });
  }
  s.ita = {};
}

function afterItaly(s: SeasonState, clubIds: string[], name: (id: string) => string, news: string[]) {
  if (!s.ita || !clubIds.length) return;
  const e = s.ita;
  const k = italyDates(s.year);
  const ssf = byStage(s, 'superIta', 'Meias-finais');
  if (done(ssf) && !byStage(s, 'superIta', 'Final').length) addCupRound(s, 'superIta', 'Final', k.superF, [[winnerOf(ssf[0])!, winnerOf(ssf[1])!]], true);
  const liga = s.fixtures.filter((f) => f.comp === 'ita');
  const half = Math.max(...liga.map((f) => f.round ?? 0)) / 2;
  // fim da 1.ª volta: Coppa Italia (Final Eight com os 8 primeiros)
  if (!e.halfTable && done(liga.filter((f) => (f.round ?? 0) <= half))) {
    const t = (e.halfTable = leagueTable(s, clubIds, half, 'ita').map((x) => x.club));
    news.push(`Coppa Italia: Final Eight com ${t.slice(0, 8).map(name).join(', ')}.`);
    addCupRound(s, 'coppaIta', 'Quartos-de-final', k.coppaQF, [[t[0], t[7]], [t[3], t[4]], [t[2], t[5]], [t[1], t[6]]], true);
  }
  for (const [from, to, d] of [['Quartos-de-final', 'Meias-finais', k.coppaSF], ['Meias-finais', 'Final', k.coppaF]] as const) {
    const prev = byStage(s, 'coppaIta', from);
    if (done(prev) && !byStage(s, 'coppaIta', to).length) {
      const ws = prev.map(winnerOf) as string[];
      const pairs: [string, string][] = [];
      for (let i = 0; i < ws.length; i += 2) pairs.push([ws[i], ws[i + 1]]);
      addCupRound(s, 'coppaIta', to, d, pairs, true);
    }
  }
  for (const comp of ['coppaIta', 'superIta'] as CompId[]) {
    const fin = byStage(s, comp, 'Final')[0];
    if (fin?.result && !s.winners[comp]) {
      s.winners[comp] = winnerOf(fin)!;
      news.push(`${name(s.winners[comp]!)} vence a ${comp === 'coppaIta' ? 'Coppa Italia' : 'Supercoppa Italiana'}.`);
    }
  }
  // fim da fase regular: play-in, play-off (1.º-6.º diretos) e play-out/descidas
  if (!e.regularTable && done(liga)) {
    const t = (e.regularTable = leagueTable(s, clubIds, 99, 'ita').map((x) => x.club));
    news.push(`${name(t[0])} termina a fase regular da Serie A em 1.º. Play-off: ${t.slice(0, 6).map(name).join(', ')}; play-in: ${t.slice(6, 10).map(name).join(', ')}.`);
    s.fixtures.push({ id: newId(s.year), comp: 'itaPlayoff', stage: 'Play-in A', date: k.playInAB, home: t[6], away: t[7], knockout: true, tieToHome: true });
    s.fixtures.push({ id: newId(s.year), comp: 'itaPlayoff', stage: 'Play-in B', date: k.playInAB, home: t[8], away: t[9], knockout: true, tieToHome: true });
    const n = t.length;
    const tab = leagueTable(s, clubIds, 99, 'ita');
    const pts = (c: string) => tab.find((x) => x.club === c)!.pts;
    news.push(`${name(t[n - 1])} e ${name(t[n - 2])} descem à Serie A2 Elite (as descidas efetivas entram quando houver divisões inferiores no jogo).`);
    if (pts(t[n - 4]) - pts(t[n - 3]) >= 8) news.push(`Sem play-out (8+ pontos de diferença): ${name(t[n - 3])} desce diretamente.`);
    else {
      s.fixtures.push({ id: newId(s.year), comp: 'itaPlayoff', stage: 'Play-out - ida', date: k.playout1, home: t[n - 3], away: t[n - 4], knockout: false });
      s.fixtures.push({ id: newId(s.year), comp: 'itaPlayoff', stage: 'Play-out - volta', date: k.playout2, home: t[n - 4], away: t[n - 3], knockout: false });
    }
  }
  const t = e.regularTable;
  if (!t) return;
  const rank = (x: string) => t.indexOf(x);
  const order = (a: string, b: string): [string, string] => (rank(a) <= rank(b) ? [a, b] : [b, a]);
  const pa = byStage(s, 'itaPlayoff', 'Play-in A'), pb = byStage(s, 'itaPlayoff', 'Play-in B');
  if (done(pa) && done(pb) && !byStage(s, 'itaPlayoff', 'Play-in C').length) {
    const loserA = winnerOf(pa[0]) === pa[0].home ? pa[0].away : pa[0].home;
    const [h, a] = order(loserA, winnerOf(pb[0])!);
    s.fixtures.push({ id: newId(s.year), comp: 'itaPlayoff', stage: 'Play-in C', date: k.playInC, home: h, away: a, knockout: true, tieToHome: true });
  }
  const pc = byStage(s, 'itaPlayoff', 'Play-in C');
  const ser = (stage: string) => s.series.filter((x) => x.comp === 'itaPlayoff' && x.stage === stage);
  if (done(pc) && !ser('Quartos-de-final').length) {
    const seed7 = winnerOf(pa[0])!, seed8 = winnerOf(pc[0])!;
    for (const [hi, lo] of [[t[0], seed8], [t[3], t[4]], [t[2], t[5]], [t[1], seed7]] as [string, string][]) makeSeries(s, 'Quartos-de-final', hi, lo, 3, k.qf, 'itaPlayoff', true);
  }
  const qf = ser('Quartos-de-final');
  if (qf.length === 4 && qf.every((x) => x.winner) && !ser('Meias-finais').length) {
    makeSeries(s, 'Meias-finais', ...order(qf[0].winner!, qf[1].winner!), 3, k.sf, 'itaPlayoff', true);
    makeSeries(s, 'Meias-finais', ...order(qf[2].winner!, qf[3].winner!), 3, k.sf, 'itaPlayoff', true);
  }
  const sf = ser('Meias-finais');
  if (sf.length === 2 && sf.every((x) => x.winner) && !ser('Final').length) makeSeries(s, 'Final', ...order(sf[0].winner!, sf[1].winner!), 3, k.f, 'itaPlayoff', true);
  const fin = ser('Final')[0];
  if (fin?.winner && !s.winners.ita) {
    s.winners.ita = fin.winner;
    news.push(`${name(fin.winner)} é campeão de Itália (Scudetto)!`);
  }
  const po = [...byStage(s, 'itaPlayoff', 'Play-out - ida'), ...byStage(s, 'itaPlayoff', 'Play-out - volta')];
  if (po.length === 2 && done(po) && !e.playout) {
    e.playout = true;
    const n = t.length, a = t[n - 4], b = t[n - 3];
    const ga = (po[0].home === a ? po[0].result!.score[0] : po[0].result!.score[1]) + (po[1].home === a ? po[1].result!.score[0] : po[1].result!.score[1]);
    const gb = (po[0].home === b ? po[0].result!.score[0] : po[0].result!.score[1]) + (po[1].home === b ? po[1].result!.score[0] : po[1].result!.score[1]);
    const stays = ga >= gb ? a : b; // empate no agregado: fica o mais bem classificado (simplificação do prolongamento)
    news.push(`Play-out: ${name(stays)} garante a permanência na Serie A; ${name(stays === a ? b : a)} desce.`);
  }
}

export interface TableRow {
  club: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

export function leagueTable(s: SeasonState, clubIds: string[], upToRound = 99, comp: CompId = 'liga'): TableRow[] {
  const rows: Record<string, TableRow> = {};
  for (const c of clubIds) rows[c] = { club: c, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  for (const f of s.fixtures) {
    if (f.comp !== comp || !f.result || (f.round ?? 0) > upToRound || !rows[f.home] || !rows[f.away]) continue;
    const [hg, ag] = f.result.score;
    const h = rows[f.home];
    const a = rows[f.away];
    h.p++; a.p++;
    h.gf += hg; h.ga += ag; a.gf += ag; a.ga += hg;
    if (hg > ag) { h.w++; a.l++; h.pts += 3; }
    else if (hg < ag) { a.w++; h.l++; a.pts += 3; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }
  // Desempates (Regulamento da Liga Placard, Art. 18.5): confronto direto entre os empatados (pontos, diferença
  // de golos), diferença de golos geral, vitórias, golos marcados, golos sofridos
  const games = s.fixtures.filter((f) => f.comp === comp && f.result && (f.round ?? 0) <= upToRound);
  const all = Object.values(rows);
  const h2h = (club: string, group: Set<string>) => {
    let pts = 0, gd = 0;
    for (const f of games) {
      if (!group.has(f.home) || !group.has(f.away) || (f.home !== club && f.away !== club)) continue;
      const [a, b] = f.home === club ? f.result!.score : [f.result!.score[1], f.result!.score[0]];
      pts += a > b ? 3 : a === b ? 1 : 0; gd += a - b;
    }
    return { pts, gd };
  };
  const hh: Record<string, { pts: number; gd: number }> = {};
  for (const r of all) hh[r.club] = h2h(r.club, new Set(all.filter((x) => x.pts === r.pts).map((x) => x.club)));
  return all.sort((x, y) => y.pts - x.pts || hh[y.club].pts - hh[x.club].pts || hh[y.club].gd - hh[x.club].gd
    || y.gf - y.ga - (x.gf - x.ga) || y.w - x.w || y.gf - x.gf || x.ga - y.ga || x.club.localeCompare(y.club));
}

// Vencedor de um jogo a eliminar
export function winnerOf(f: Fixture): string | null {
  if (!f.result) return null;
  if (f.tieToHome && !f.result.pens && f.result.score[0] === f.result.score[1]) return f.home; // Itália: empate = passa a melhor classificada
  const [h, a] = f.result.pens ?? f.result.score;
  return h > a ? f.home : f.away;
}

function makeSeries(s: SeasonState, stage: string, hi: string, lo: string, bestOf: number, firstDate: string, comp: CompId = 'playoff', italian = false): Series {
  const id = `s${s.year}_${s.series.length + 1}`;
  // melhor de 3: casa do melhor nos jogos 1 e 3; melhor de 5: jogos 1, 2 e 5
  // Itália (Comunicato 029, 1.3): jogo 1 em casa do pior classificado, jogos 2 e 3 em casa do melhor
  const homes = italian ? [lo, hi, hi] : bestOf === 3 ? [hi, lo, hi] : [hi, hi, lo, lo, hi];
  const gaps = italian ? [0, 5, 7] : bestOf === 3 ? [0, 4, 7] : [0, 4, 7, 11, 14];
  const ser: Series = { id, stage, hi, lo, bestOf, wins: [0, 0], fixtureIds: [], ...(comp !== 'playoff' ? { comp } : {}) };
  homes.forEach((h, i) => {
    const f: Fixture = {
      id: newId(s.year), comp, stage: `${stage} - jogo ${i + 1}`, date: addDays(firstDate, gaps[i]),
      home: h, away: h === hi ? lo : hi, knockout: true, seriesId: id,
    };
    s.fixtures.push(f);
    ser.fixtureIds.push(f.id);
  });
  s.series.push(ser);
  return ser;
}

function addCupRound(s: SeasonState, comp: CompId, stage: string, date: string, pairs: [string, string][], neutral: boolean) {
  for (const [h, a] of pairs) s.fixtures.push({ id: newId(s.year), comp, stage, date, home: h, away: a, neutral, knockout: true });
}

const done = (fs: Fixture[]) => fs.length > 0 && fs.every((f) => f.result || f.cancelled);
const byStage = (s: SeasonState, comp: CompId, stage: string) => s.fixtures.filter((f) => f.comp === comp && f.stage === stage);

/**
 * Depois de cada dia de jogos: atualiza séries, cria as rondas seguintes e regista vencedores.
 * Devolve mensagens para as notícias.
 */
export function afterMatchday(s: SeasonState, clubIds: string[], name: (id: string) => string, espIds: string[] = [], itaIds: string[] = []): string[] {
  const news: string[] = [];
  const k = keyDates(s.year);
  const r = rng('sorteio' + s.year + s.fixtures.filter((f) => f.result).length);

  // Supertaça
  const sup = s.fixtures.find((f) => f.comp === 'supertaca');
  if (sup?.result && !s.winners.supertaca) {
    s.winners.supertaca = winnerOf(sup)!;
    news.push(`${name(s.winners.supertaca)} conquista a Supertaça.`);
  }

  // Séries do play-off
  for (const ser of s.series) {
    if (ser.winner) continue;
    ser.wins = [0, 0];
    for (const id of ser.fixtureIds) {
      const f = s.fixtures.find((x) => x.id === id)!;
      const w = winnerOf(f);
      if (w) ser.wins[w === ser.hi ? 0 : 1]++;
    }
    const need = Math.ceil(ser.bestOf / 2);
    if (ser.wins[0] === need || ser.wins[1] === need) {
      ser.winner = ser.wins[0] === need ? ser.hi : ser.lo;
      for (const id of ser.fixtureIds) {
        const f = s.fixtures.find((x) => x.id === id)!;
        if (!f.result) f.cancelled = true;
      }
    }
  }

  // Fim da 1.ª volta: Taça da Liga
  const liga = s.fixtures.filter((f) => f.comp === 'liga');
  const half = Math.max(...liga.map((f) => f.round ?? 0)) / 2;
  if (!s.halfTable && done(liga.filter((f) => (f.round ?? 0) <= half))) {
    s.halfTable = leagueTable(s, clubIds, half).map((x) => x.club);
    const top8 = s.halfTable.slice(0, 8);
    // sorteio: os dois primeiros não se podem cruzar nos quartos
    let pairs: [string, string][] = [];
    for (let tries = 0; tries < 50; tries++) {
      const pool = [...top8].sort(() => r() - 0.5);
      pairs = [[pool[0], pool[1]], [pool[2], pool[3]], [pool[4], pool[5]], [pool[6], pool[7]]];
      if (!pairs.some(([a, b]) => [a, b].includes(top8[0]) && [a, b].includes(top8[1]))) break;
    }
    addCupRound(s, 'tacaLiga', 'Quartos-de-final', k.tacaLigaQF, pairs, true);
    news.push(`Fim da 1.ª volta: ${top8.map(name).join(', ')} apurados para a final eight da Taça da Liga.`);
  }

  // Rondas seguintes das taças (jogos únicos)
  const nextCup = (comp: CompId, from: string, to: string, date: string, neutral: boolean) => {
    const prev = byStage(s, comp, from);
    if (done(prev) && byStage(s, comp, to).length === 0) {
      const ws = prev.map(winnerOf) as string[];
      const pairs: [string, string][] = [];
      for (let i = 0; i < ws.length; i += 2) pairs.push([ws[i], ws[i + 1]]);
      addCupRound(s, comp, to, date, pairs, neutral);
    }
  };
  nextCup('tacaLiga', 'Quartos-de-final', 'Meias-finais', k.tacaLigaSF, true);
  nextCup('tacaLiga', 'Meias-finais', 'Final', k.tacaLigaF, true);

  // Taça de Portugal: final eight com os 4 vencedores da 1.ª eliminatória e os 4 primeiros da época anterior
  const r1 = byStage(s, 'taca', '1.ª eliminatória');
  if (done(r1) && byStage(s, 'taca', 'Quartos-de-final').length === 0) {
    const seeds = s.fixtures.filter((f) => f.comp === 'liga' && f.round === 1).length ? clubIds : clubIds;
    const qualified = r1.map(winnerOf) as string[];
    const r1Teams = new Set(r1.flatMap((f) => [f.home, f.away]));
    const top = seeds.filter((c) => !r1Teams.has(c));
    const pool = [...top, ...qualified].sort(() => r() - 0.5);
    const pairs: [string, string][] = [[pool[0], pool[1]], [pool[2], pool[3]], [pool[4], pool[5]], [pool[6], pool[7]]];
    addCupRound(s, 'taca', 'Quartos-de-final', k.tacaQF, pairs, true);
  }
  nextCup('taca', 'Quartos-de-final', 'Meias-finais', k.tacaSF, true);
  nextCup('taca', 'Meias-finais', 'Final', k.tacaF, true);

  for (const comp of ['taca', 'tacaLiga'] as CompId[]) {
    const fin = byStage(s, comp, 'Final')[0];
    if (fin?.result && !s.winners[comp]) {
      s.winners[comp] = winnerOf(fin)!;
      news.push(`${name(s.winners[comp]!)} vence a ${comp === 'taca' ? 'Taça de Portugal' : 'Taça da Liga'}.`);
    }
  }

  // Fim da fase regular: play-off
  if (!s.regularTable && done(liga)) {
    s.regularTable = leagueTable(s, clubIds).map((x) => x.club);
    const t = s.regularTable;
    news.push(`Fim da fase regular: ${name(t[0])} termina em 1.º lugar.`);
    makeSeries(s, 'Quartos-de-final', t[0], t[7], 3, k.playoffQF);
    makeSeries(s, 'Quartos-de-final', t[3], t[4], 3, k.playoffQF);
    makeSeries(s, 'Quartos-de-final', t[1], t[6], 3, k.playoffQF);
    makeSeries(s, 'Quartos-de-final', t[2], t[5], 3, k.playoffQF);
  }
  const rank = (c: string) => (s.regularTable ?? []).indexOf(c);
  const order = (a: string, b: string): [string, string] => (rank(a) <= rank(b) ? [a, b] : [b, a]);
  const por = s.series.filter((x) => !x.comp);
  const qf = por.filter((x) => x.stage === 'Quartos-de-final');
  if (qf.length === 4 && qf.every((x) => x.winner) && !por.some((x) => x.stage === 'Meias-finais')) {
    makeSeries(s, 'Meias-finais', ...order(qf[0].winner!, qf[1].winner!), 3, k.playoffSF);
    makeSeries(s, 'Meias-finais', ...order(qf[2].winner!, qf[3].winner!), 3, k.playoffSF);
  }
  const sf = s.series.filter((x) => !x.comp && x.stage === 'Meias-finais');
  if (sf.length === 2 && sf.every((x) => x.winner) && !s.series.some((x) => !x.comp && x.stage === 'Final')) {
    makeSeries(s, 'Final', ...order(sf[0].winner!, sf[1].winner!), 5, k.playoffF);
  }
  const fin = s.series.find((x) => !x.comp && x.stage === 'Final');
  if (fin?.winner && !s.winners.liga) {
    s.winners.liga = fin.winner;
    news.push(`${name(fin.winner)} é campeão nacional!`);
  }
  afterSpain(s, espIds, name, news);
  afterItaly(s, itaIds, name, news);
  return news;
}

// Finalista vencido de uma taça
export function runnerUp(s: SeasonState, comp: CompId): string | undefined {
  if (comp === 'liga' || comp === 'esp') {
    const fin = s.series.find((x) => (comp === 'esp' ? x.comp === 'espPlayoff' : !x.comp) && x.stage === 'Final');
    return fin?.winner ? (fin.winner === fin.hi ? fin.lo : fin.hi) : undefined;
  }
  const f = s.fixtures.find((x) => x.comp === comp && x.stage === 'Final');
  const w = f && winnerOf(f);
  return f && w ? (w === f.home ? f.away : f.home) : undefined;
}

export type { FixtureResult };
