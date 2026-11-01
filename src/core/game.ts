import { overall } from './attributes';
import { importanceOf, refereesFor } from './referees';
// Ciclo de jogo: avançar no calendário, jogar jogos, fim de época
import { aiTactics } from './coaches';
import { normalizeTactics } from './tactics';
import { accumulate, shootingFocus, trainingBonus } from './training';
import { applyMorale, moraleEvent } from './morale';
import { injuryOf, matchInjuries, trainingInjuries } from './injuries';
import { applyDiscipline, banFor, seasonEndDiscipline } from './discipline';
import type { CompId } from './season/types';
import { developPlayer, injuryDecline, retires, youthIntake, DevChange } from './development';
import { simulateMatch } from './engine/match';
import type { MatchResult, TeamSetup } from './engine/types';
import { afterMatchday, createSeason, keyDates, leagueTable, runnerUp } from './season/season';
import { COMP_NAMES, Fixture } from './season/types';
import type { GameState } from './types';

export function clubName(s: GameState, id: string) {
  return s.clubs.find((c) => c.id === id)?.name ?? id;
}

/** comp: competição oficial do jogo (os castigados ficam de fora). */
export function setupFor(s: GameState, clubId: string, comp?: CompId): TeamSetup & { coachName: string } {
  const c = s.clubs.find((x) => x.id === clubId)!;
  const all = s.players.filter((p) => p.clubId === c.id && !(comp && banFor(s, p.id, comp) > 0));
  let squad = all.filter((p) => !injuryOf(s, p.id));
  // sem guarda-redes disponível (lesionados/castigados): vai à baliza o jogador de campo com mais jeito (lesionados nunca jogam)
  if (!squad.some((p) => p.position === 'GR') && squad.length) {
    const a = (p: (typeof squad)[0]) => p.attrs.reflexos + p.attrs.agilidade + p.attrs.umParaUm + p.attrs.posicionamento;
    const best = [...squad].sort((x, y) => a(y) - a(x))[0];
    squad = squad.map((p) => (p === best ? { ...p, position: 'GR' as const } : p));
  }
  if (c.id === s.clubId) {
    normalizeTactics(s.tactics, squad);
    const ok = (ids: string[]) => ids.filter((id) => squad.some((p) => p.id === id));
    const tactics = comp ? { ...s.tactics, q1: ok(s.tactics.q1), q2: ok(s.tactics.q2) } : s.tactics;
    return { clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics, coachTactical: 12, coachName: s.manager.name, morale: s.morale };
  }
  const coach = s.coaches.find((x) => x.clubId === c.id);
  return {
    clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics: aiTactics(squad, c, coach),
    coachTactical: coach?.tactical ?? 11, morale: s.morale, coachName: coach?.name ?? 'Treinador interino',
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

export function matchOptions(s: GameState, f: Fixture) {
  const ref = refereesFor(s, f);
  // Taça de Portugal (Regulamento 2026/27, Art. 14.4): quartos e meias da Final Eight vão diretos a penáltis; a final tem prolongamento
  const noExtraTime = f.comp === 'taca' && (f.stage === 'Quartos-de-final' || f.stage === 'Meias-finais');
  return { knockout: f.knockout, noExtraTime, seed: `${f.id}-${s.season.year}`, manual: f.home === s.clubId ? (0 as const) : f.away === s.clubId ? (1 as const) : undefined, referees: ref, importance: importanceOf(s, f) };
}

function playFixture(s: GameState, f: Fixture, given?: MatchResult): MatchResult {
  const m = given ?? simulateMatch(setupFor(s, f.home, f.comp), setupFor(s, f.away, f.comp), matchOptions(s, f));
  f.result = {
    score: m.score,
    pens: m.penalties,
    et: m.extraTime,
    scorers: m.events.filter((e) => e.type === 'golo').map((e) => ({ id: e.playerId!, side: e.side!, min: Math.floor(e.t / 60) + 1 })),
  };
  // castigos (Regulamento Disciplinar da FPF): notícias só do teu clube
  const mine = (id: string) => s.players.find((p) => p.id === id)?.clubId === s.clubId;
  const pname = (id: string) => s.players.find((p) => p.id === id)?.name ?? id;
  const banned = applyDiscipline(s, f, m, pname);
  for (const t of banned) if (s.players.some((p) => mine(p.id) && t.startsWith(p.name + ':'))) news(s, t);
  // moral (antes das lesões e castigos deste jogo, que a fazem descer)
  for (const t of applyMorale(s, f, m, importanceOf(s, f))) if (/excelente|fraca/.test(t)) news(s, t);
  moraleEvent(s, Object.entries(m.players).filter(([, st]) => st.red).map(([id]) => id), -3);
  // lesões no jogo
  const newInj = matchInjuries(s, m, `${f.id}-${s.season.year}`);
  moraleEvent(s, newInj.filter(([, i]) => i.days > 7).map(([id]) => id), -6);
  for (const [id, i] of newInj) if (mine(id)) news(s, `${pname(id)} lesionou-se no jogo: ${i.type.toLowerCase()}, ${i.days} dia${i.days > 1 ? 's' : ''} de paragem.`);
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

// Evolução durante a época: no 1.º dia de cada mês (setembro a maio) aplica-se 1/9 da evolução anual
function monthlyDevelopment(s: GameState, to: string) {
  const month = to.slice(0, 7);
  if (s.devMonth === month) return;
  const m = Number(to.slice(5, 7));
  if (m >= 6 && m <= 8) return;
  s.devMonth = month;
  if ((s.devFrac ?? 0) >= 8 / 9 - 1e-6) return; // o resto fica para o fim da época
  s.devStart ??= {};
  for (const p of s.players) {
    s.devStart[p.id] ??= overall(p.attrs, p.position);
    const inj = injuryOf(s, p.id);
    if (inj) { injuryDecline(p, inj.days, month); continue; } // lesionado não evolui; paragens longas fazem perder físico
    // minutos até agora projetados para a época inteira
    const st = s.pstats[p.id] && { ...s.pstats[p.id], minutes: s.pstats[p.id].minutes / ((s.devFrac ?? 0) + 1 / 9) };
    developPlayer(p, st, s.season.year, trainingBonus(s, p.id, p.position === 'GR'), shootingFocus(s, p.id, p.clubId), { frac: 1 / 9, seed: month, final: false });
  }
  s.devFrac = (s.devFrac ?? 0) + 1 / 9;
}

function trainingNews(s: GameState, from: string, to: string) {
  const days = Math.round((Date.parse(to) - Date.parse(from)) / 864e5);
  if (days > 0 && days <= 60) accumulate(s, days);
  monthlyDevelopment(s, to);
  const { fresh, healed } = trainingInjuries(s, from, to);
  moraleEvent(s, fresh.filter(([, i]) => i.days > 7).map(([id]) => id), -6);
  const name = (id: string) => s.players.find((p) => p.id === id);
  for (const id of healed) if (name(id)?.clubId === s.clubId) news(s, `${name(id)!.name} recuperou da lesão.`);
  for (const [id, i] of fresh) if (name(id)?.clubId === s.clubId) news(s, `${name(id)!.name} lesionou-se no treino: ${i.type.toLowerCase()}, ${i.days} dia${i.days > 1 ? 's' : ''} de paragem.`);
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
  trainingNews(s, s.date, d);
  s.date = d;
  const mine = s.season.fixtures.find((f) => f.date === d && !f.result && !f.cancelled && (f.home === s.clubId || f.away === s.clubId));
  if (mine) return { kind: 'match', fixture: mine };
  playDay(s, d);
  return { kind: 'day' };
}

// Joga o teu jogo e os restantes jogos do dia
export function playMyMatch(s: GameState, f: Fixture, given?: MatchResult): MatchResult {
  const m = playFixture(s, f, given);
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
  const before = { ...s.season.winners };
  for (const t of afterMatchday(s.season, clubIds, (id) => clubName(s, id))) news(s, t);
  // títulos: todo o plantel ganha moral
  for (const [comp, w] of Object.entries(s.season.winners)) if (w && before[comp as keyof typeof before] !== w) moraleEvent(s, s.players.filter((p) => p.clubId === w).map((p) => p.id), 10);
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
    const c = developPlayer(p, s.pstats[p.id], old.year, trainingBonus(s, p.id, p.position === 'GR'), shootingFocus(s, p.id, p.clubId), { frac: Math.max(0, 1 - (s.devFrac ?? 0)), seed: '-fim', final: true });
    c.before = s.devStart?.[p.id] ?? c.before;
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
  seasonEndDiscipline(s);
  s.trainLog = {};
  s.devFrac = 0; s.devStart = {};
  news(s, `Começa a época ${s.season.label}.`);
  return changes;
}
