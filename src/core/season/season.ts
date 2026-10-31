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
      games.push(i === 0 && r % 2 ? [b, a] : (r + i) % 2 ? [b, a] : [a, b]);
    }
    rounds.push(games);
    t.splice(1, 0, t.pop()!);
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
export function createSeason(y: number, ranking: string[], supercup: [string, string]): SeasonState {
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

  return { year: y, label: `${y}/${String((y + 1) % 100).padStart(2, '0')}`, fixtures, series: [], winners: {}, finished: false };
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

export function leagueTable(s: SeasonState, clubIds: string[], upToRound = 99): TableRow[] {
  const rows: Record<string, TableRow> = {};
  for (const c of clubIds) rows[c] = { club: c, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  for (const f of s.fixtures) {
    if (f.comp !== 'liga' || !f.result || (f.round ?? 0) > upToRound) continue;
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
  const games = s.fixtures.filter((f) => f.comp === 'liga' && f.result && (f.round ?? 0) <= upToRound);
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
  const [h, a] = f.result.pens ?? f.result.score;
  return h > a ? f.home : f.away;
}

function makeSeries(s: SeasonState, stage: string, hi: string, lo: string, bestOf: number, firstDate: string): Series {
  const id = `s${s.year}_${s.series.length + 1}`;
  // melhor de 3: casa do melhor nos jogos 1 e 3; melhor de 5: jogos 1, 2 e 5
  const homes = bestOf === 3 ? [hi, lo, hi] : [hi, hi, lo, lo, hi];
  const gaps = bestOf === 3 ? [0, 4, 7] : [0, 4, 7, 11, 14];
  const ser: Series = { id, stage, hi, lo, bestOf, wins: [0, 0], fixtureIds: [] };
  homes.forEach((h, i) => {
    const f: Fixture = {
      id: newId(s.year), comp: 'playoff', stage: `${stage} - jogo ${i + 1}`, date: addDays(firstDate, gaps[i]),
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
export function afterMatchday(s: SeasonState, clubIds: string[], name: (id: string) => string): string[] {
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
  const qf = s.series.filter((x) => x.stage === 'Quartos-de-final');
  if (qf.length === 4 && qf.every((x) => x.winner) && !s.series.some((x) => x.stage === 'Meias-finais')) {
    makeSeries(s, 'Meias-finais', ...order(qf[0].winner!, qf[1].winner!), 3, k.playoffSF);
    makeSeries(s, 'Meias-finais', ...order(qf[2].winner!, qf[3].winner!), 3, k.playoffSF);
  }
  const sf = s.series.filter((x) => x.stage === 'Meias-finais');
  if (sf.length === 2 && sf.every((x) => x.winner) && !s.series.some((x) => x.stage === 'Final')) {
    makeSeries(s, 'Final', ...order(sf[0].winner!, sf[1].winner!), 5, k.playoffF);
  }
  const fin = s.series.find((x) => x.stage === 'Final');
  if (fin?.winner && !s.winners.liga) {
    s.winners.liga = fin.winner;
    news.push(`${name(fin.winner)} é campeão nacional!`);
  }

  return news;
}

// Finalista vencido de uma taça
export function runnerUp(s: SeasonState, comp: CompId): string | undefined {
  if (comp === 'liga') {
    const fin = s.series.find((x) => x.stage === 'Final');
    return fin?.winner ? (fin.winner === fin.hi ? fin.lo : fin.hi) : undefined;
  }
  const f = s.fixtures.find((x) => x.comp === comp && x.stage === 'Final');
  const w = f && winnerOf(f);
  return f && w ? (w === f.home ? f.away : f.home) : undefined;
}

export type { FixtureResult };
