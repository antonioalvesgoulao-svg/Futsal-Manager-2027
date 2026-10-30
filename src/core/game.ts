// Ciclo de jogo: avançar no calendário, jogar jogos, fim de época
import { aiTactics } from './coaches';
import { developPlayer, retires, youthIntake, DevChange } from './development';
import { simulateMatch } from './engine/match';
import type { MatchResult, TeamSetup } from './engine/types';
import { afterMatchday, createSeason, keyDates, leagueTable, runnerUp } from './season/season';
import { COMP_NAMES, Fixture } from './season/types';
import type { GameState } from './types';

export function clubName(s: GameState, id: string) {
  return s.clubs.find((c) => c.id === id)?.name ?? id;
}

export function setupFor(s: GameState, clubId: string): TeamSetup & { coachName: string } {
  const c = s.clubs.find((x) => x.id === clubId)!;
  const squad = s.players.filter((p) => p.clubId === c.id);
  if (c.id === s.clubId) {
    return { clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics: s.tactics, coachTactical: 12, coachName: s.manager.name };
  }
  const coach = s.coaches.find((x) => x.clubId === c.id);
  return {
    clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics: aiTactics(squad, c, coach),
    coachTactical: coach?.tactical ?? 11, coachName: coach?.name ?? 'Treinador interino',
  };
}

function news(s: GameState, text: string) {
  s.news.unshift({ date: s.date, text });
  s.news = s.news.slice(0, 60);
}

// Primeira época: classificação e Supertaça reais da época anterior (2025/26)
export function startFirstSeason(s: GameState) {
  // ordem final 2025/26 aproximada pelos níveis atuais; Supertaça real: Benfica (campeão e vencedor da Taça) x Sporting (finalista)
  const ranking = [...s.clubs].sort((a, b) => b.level - a.level).map((c) => c.id);
  s.season = createSeason(2026, ranking, ['slb', 'scp']);
  s.date = '2026-07-01';
  s.pstats = {};
}

export function myFixtures(s: GameState) {
  return s.season.fixtures.filter((f) => !f.cancelled && (f.home === s.clubId || f.away === s.clubId)).sort((a, b) => a.date.localeCompare(b.date));
}

export function nextMyFixture(s: GameState) {
  return myFixtures(s).find((f) => !f.result);
}

function playFixture(s: GameState, f: Fixture): MatchResult {
  const m = simulateMatch(setupFor(s, f.home), setupFor(s, f.away), { knockout: f.knockout, seed: `${f.id}-${s.season.year}` });
  f.result = {
    score: m.score,
    pens: m.penalties,
    et: m.extraTime,
    scorers: m.events.filter((e) => e.type === 'golo').map((e) => ({ id: e.playerId!, side: e.side!, min: Math.floor(e.t / 60) + 1 })),
  };
  // estatísticas da época (só competições oficiais)
  for (const [id, st] of Object.entries(m.players)) {
    if (st.minutes < 30) continue;
    const ps = (s.pstats[id] ??= { games: 0, goals: 0, assists: 0, minutes: 0, ratingSum: 0 });
    ps.games++;
    ps.goals += st.goals;
    ps.assists += st.assists;
    ps.minutes += st.minutes;
    ps.ratingSum += st.rating;
  }
  return m;
}

function nextDate(s: GameState) {
  const pending = s.season.fixtures.filter((f) => !f.result && !f.cancelled).map((f) => f.date).sort();
  return pending[0];
}

export type AdvanceResult = { kind: 'match'; fixture: Fixture } | { kind: 'day' } | { kind: 'seasonEnd'; changes: DevChange[] };

/**
 * Continuar: avança até ao próximo dia com jogos.
 * Se nesse dia o teu clube joga, para e devolve o jogo (jogas no ecrã de dia de jogo).
 */
export function advance(s: GameState): AdvanceResult {
  const d = nextDate(s);
  if (!d) {
    s.date = keyDates(s.season.year).end;
    return { kind: 'seasonEnd', changes: endSeason(s) };
  }
  s.date = d;
  const mine = s.season.fixtures.find((f) => f.date === d && !f.result && !f.cancelled && (f.home === s.clubId || f.away === s.clubId));
  if (mine) return { kind: 'match', fixture: mine };
  playDay(s, d);
  return { kind: 'day' };
}

// Joga o teu jogo e os restantes jogos do dia
export function playMyMatch(s: GameState, f: Fixture): MatchResult {
  const m = playFixture(s, f);
  const mySide = f.home === s.clubId ? 0 : 1;
  const [a, b] = mySide === 0 ? m.score : [m.score[1], m.score[0]];
  const opp = clubName(s, mySide === 0 ? f.away : f.home);
  const res = a > b || (m.penalties && (mySide === 0 ? m.penalties[0] > m.penalties[1] : m.penalties[1] > m.penalties[0])) ? 'Vitória' : a < b || m.penalties ? 'Derrota' : 'Empate';
  news(s, `${COMP_NAMES[f.comp]}, ${f.stage}: ${res} frente ao ${opp}, ${a}-${b}${m.penalties ? ` (${mySide === 0 ? m.penalties[0] : m.penalties[1]}-${mySide === 0 ? m.penalties[1] : m.penalties[0]} g.p.)` : m.extraTime ? ' (a.p.)' : ''}.`);
  playDay(s, f.date);
  return m;
}

function playDay(s: GameState, d: string) {
  for (const f of s.season.fixtures.filter((x) => x.date === d && !x.result && !x.cancelled)) playFixture(s, f);
  const clubIds = s.leagues[0].clubIds;
  for (const t of afterMatchday(s.season, clubIds, (id) => clubName(s, id))) news(s, t);
}

// Fim de época: palmarés, evolução, reformas, formação e nova época
function endSeason(s: GameState): DevChange[] {
  const old = s.season;
  for (const comp of ['supertaca', 'tacaLiga', 'taca', 'liga'] as const) {
    if (old.winners[comp]) s.honours.push({ season: old.label, comp, winner: old.winners[comp]!, runnerUp: runnerUp(old, comp) });
  }
  const top = Object.entries(s.pstats).sort((a, b) => b[1].goals - a[1].goals)[0];
  if (top) {
    const p = s.players.find((x) => x.id === top[0]);
    if (p) news(s, `Melhor marcador ${old.label}: ${p.name} (${clubName(s, p.clubId)}), ${top[1].goals} golos.`);
  }

  // evolução
  const changes: DevChange[] = [];
  for (const p of s.players) {
    const c = developPlayer(p, s.pstats[p.id], old.year);
    if (p.clubId === s.clubId) changes.push(c);
  }
  // reformas
  const retired = s.players.filter((p) => retires(p, old.year));
  for (const p of retired) if (p.clubId === s.clubId) news(s, `${p.name} terminou a carreira.`);
  s.players = s.players.filter((p) => !retired.includes(p));
  s.tactics.q1 = s.tactics.q1.filter((id) => s.players.some((p) => p.id === id));
  s.tactics.q2 = s.tactics.q2.filter((id) => s.players.some((p) => p.id === id));
  // formação
  for (const c of s.clubs) {
    const squad = s.players.filter((p) => p.clubId === c.id);
    const youth = youthIntake(c, squad, old.year + 1);
    s.players.push(...youth);
    if (c.id === s.clubId && youth.length) news(s, `Sobem da formação: ${youth.map((p) => `${p.name} (${p.position})`).join(', ')}.`);
  }

  // nova época: ranking pela classificação final; Supertaça campeão x vencedor da Taça
  const table = old.regularTable ?? leagueTable(old, s.leagues[0].clubIds).map((x) => x.club);
  const champ = old.winners.liga ?? table[0];
  const ranking = [champ, ...table.filter((c) => c !== champ)];
  const cup = old.winners.taca ?? table[1];
  const second = cup === champ ? runnerUp(old, 'taca') ?? table[1] : cup;
  s.season = createSeason(old.year + 1, ranking, [champ, second]);
  s.leagues[0].season = s.season.label;
  s.date = `${old.year + 1}-07-01`;
  s.pstats = {};
  news(s, `Começa a época ${s.season.label}.`);
  return changes;
}
