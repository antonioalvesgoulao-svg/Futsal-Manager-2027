import { scoutDays } from './scouting';
import { afterMatchSatisfaction } from './squadlife';
import { managerAttrs, mgrK } from './manager';
import { overall } from './attributes';
import { importanceOf, refereesFor } from './referees';
// Ciclo de jogo: avançar no calendário, jogar jogos, fim de época
import { aiTactics } from './coaches';
import { normalizeTactics } from './tactics';
import { accumulate, dailyFitness, matchFatigue, shootingFocus, trainingBonus } from './training';
import { contractsSeasonEnd, ensureContracts } from './contracts';
import { matchRevenue, monthlyFinance, book, PRIZES } from './finance';
import { aiMarket, endLoans, ensurePool } from './market';
import { analystBonus, academyIntake, academySeasonEnd, ensureStaff, gkTrainingK, juniorsOf, trainingK } from './staff';
import { ensureMyContract, interimOf, afterMyMatch, aiCoachChanges, boardAfterMatch, onTitle, staffSeasonEnd } from './career';
import { applyMorale, moraleEvent } from './morale';
import { injuryOf, matchInjuries, trainingInjuries } from './injuries';
import { applyDiscipline, banFor, seasonEndDiscipline } from './discipline';
import type { CompId } from './season/types';
import { developPlayer, injuryDecline, retires, youthIntake, DevChange } from './development';
import { simulateMatch } from './engine/match';
import type { MatchResult, TeamSetup } from './engine/types';
import { addDays, afterMatchday, createSeason, keyDates, leagueTable, runnerUp } from './season/season';
import { COMP_NAMES, Fixture, type TacSum } from './season/types';
import type { GameState } from './types';

/** Clubes da Primera División (vazio em gravações antigas, sem Espanha). */
export const espIds = (s: GameState) => s.leagues.find((l) => l.id === 'esp1')?.clubIds ?? [];

/** Tipo de golo pelo texto do relato (relatórios do analista). */
export function goalKind(t: string) {
  return /contra-ataque/.test(t) ? 'contra' : /canto/.test(t) ? 'canto' : /10 metros/.test(t) ? 'livre10' : /penálti/.test(t) ? 'penalti' : /deserta/.test(t) ? 'baliza deserta' : /recarga/.test(t) ? 'recarga' : 'jogada';
}

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
    return { clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics, coachTactical: managerAttrs(s).tatico + analystBonus(s, c.id), cardK: 2 - mgrK(s, 'disciplina', 0.025), coachName: s.manager.name, morale: s.morale, fitness: s.fitness };
  }
  const coach = s.coaches.find((x) => x.clubId === c.id);
  return {
    clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics: aiTactics(squad, c, coach),
    coachTactical: (coach?.tactical ?? interimOf(s, c.id)?.tactical ?? 11) + analystBonus(s, c.id), morale: s.morale, fitness: s.fitness, coachName: coach?.name ?? interimOf(s, c.id)?.name ?? 'Treinador interino',
  };
}

function news(s: GameState, text: string) {
  s.news.unshift({ date: s.date, text });
  s.news = s.news.slice(0, 60);
}

// Primeira época: classificação e Supertaça reais da época anterior (2025/26)
export function startFirstSeason(s: GameState) {
  // ordem final 2025/26 aproximada pelos níveis atuais; Supertaça real: Benfica (campeão e vencedor da Taça) x Sporting (finalista)
  const ranking = s.leagues[0].clubIds.map((id) => s.clubs.find((c) => c.id === id)!).sort((a, b) => b.level - a.level).map((c) => c.id);
  // Espanha: ordem 2025/26 aproximada pelos níveis atuais (estimativa); Supercopa com os 4 primeiros dessa ordem
  const esp = espIds(s).map((id) => s.clubs.find((c) => c.id === id)!).sort((a, b) => b.level - a.level).map((c) => c.id);
  s.season = createSeason(2026, ranking, ['slb', 'scp'], esp.length ? { ranking: esp, four: esp.slice(0, 4) } : undefined);
  s.date = '2026-07-01';
  s.pstats = {};
  ensureContracts(s);
  ensurePool(s);
  ensureStaff(s);
  for (const c of s.clubs) if (!juniorsOf(s, c.id).length) s.players.push(...academyIntake(s, c, s.season.year));
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
  // Espanha (normas RFEF 2026/27): Copa de España, quartos e meias da fase final e meias da Supercopa vão diretos a penáltis;
  // prolongamento de 2 x 3 min. Play-off (melhor de 3): estimativa com o mesmo prolongamento
  const esp = ['esp', 'espPlayoff', 'copaEsp', 'superEsp', 'copaRey'].includes(f.comp);
  const noExtraTime = (f.comp === 'taca' || f.comp === 'copaEsp' || f.comp === 'superEsp') && (f.stage === 'Quartos-de-final' || f.stage === 'Meias-finais');
  return { knockout: f.knockout, noExtraTime, extraTimeLen: esp ? 180 : undefined, seed: `${f.id}-${s.season.year}`, manual: f.home === s.clubId ? (0 as const) : f.away === s.clubId ? (1 as const) : undefined, referees: ref, importance: importanceOf(s, f) };
}

function playFixture(s: GameState, f: Fixture, given?: MatchResult): MatchResult {
  const hsu = setupFor(s, f.home, f.comp), asu = setupFor(s, f.away, f.comp);
  const m = given ?? simulateMatch(hsu, asu, matchOptions(s, f));
  matchRevenue(s, f);
  // direções: pontos conseguidos vs esperados (força do adversário, casa/fora)
  boardAfterMatch(s, s.clubs.find((c) => c.id === f.home)!, s.clubs.find((c) => c.id === f.away)!, m.score, m.penalties, importanceOf(s, f), !!f.neutral);
  f.result = {
    score: m.score,
    pens: m.penalties,
    et: m.extraTime,
    scorers: m.events.filter((e) => e.type === 'golo').map((e) => ({ id: e.playerId!, side: e.side!, min: Math.floor(e.t / 60) + 1, kind: goalKind(e.text) })),
    // táticas usadas (para os relatórios do analista)
    tac: [hsu, asu].map((x) => ({ sys: x.tactics.system, press: x.tactics.pressure, mark: x.tactics.marking, fly: x.tactics.flyingKeeper })) as [TacSum, TacSum],
  };
  // castigos (Regulamento Disciplinar da FPF): notícias só do teu clube
  const mine = (id: string) => s.players.find((p) => p.id === id)?.clubId === s.clubId;
  const pname = (id: string) => s.players.find((p) => p.id === id)?.name ?? id;
  // lesões no jogo (antes dos castigos: a agressão que lesiona é castigada pelos dias de paragem)
  const newInj = matchInjuries(s, m, `${f.id}-${s.season.year}`);
  const banned = applyDiscipline(s, f, m, pname);
  for (const t of banned) if (s.players.some((p) => mine(p.id) && t.startsWith(p.name + ':'))) news(s, t);
  // moral (antes das lesões e castigos deste jogo, que a fazem descer)
  for (const t of applyMorale(s, f, m, importanceOf(s, f))) if (/excelente|fraca/.test(t)) news(s, t);
  moraleEvent(s, Object.entries(m.players).filter(([, st]) => st.red).map(([id]) => id), -3);
  moraleEvent(s, newInj.filter(([, i]) => i.days > 7).map(([id]) => id), -6);
  for (const [id, i] of newInj) if (mine(id)) news(s, `${pname(id)} lesionou-se no jogo: ${i.type.toLowerCase()}, ${i.days} dia${i.days > 1 ? 's' : ''} de paragem.`);
  // satisfação (papel vs minutos, resultado) e valor de mercado dinâmico
  const [hg, ag] = m.penalties ?? m.score;
  for (const t of afterMatchSatisfaction(s, [f.home, f.away], { [f.home]: hg > ag ? 0.5 : hg < ag ? -0.5 : 0, [f.away]: ag > hg ? 0.5 : ag < hg ? -0.5 : 0 })) news(s, t);
  matchFatigue(s, Object.fromEntries(Object.entries(m.players).map(([id, st]) => [id, st.minutes])));
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

// Evolução contínua, dia a dia: cada intervalo entre duas datas aplica dias/365 da evolução anual.
// Dias lesionado não contam para evoluir; numa paragem longa esses dias fazem perder (injuryDecline).
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
function dailyDevelopment(s: GameState, from: string, to: string) {
  const days = dayDiff(from, to);
  if (days <= 0) return;
  s.devStart ??= {};
  const preseason = !Object.keys(s.pstats).length; // antes do 1.º jogo oficial: sem dados da época
  for (const p of s.players) {
    s.devStart[p.id] ??= overall(p.attrs, p.position);
    const start = ((s.devAttrs ??= {})[p.id] ??= { ...p.attrs });
    const inj = s.injuries?.[p.id];
    let injDays = 0;
    if (inj) {
      const start = addDays(inj.until, -inj.days);
      injDays = Math.max(0, dayDiff(start > from ? start : from, inj.until < to ? inj.until : to));
      if (injDays) injuryDecline(p, inj.days, injDays / 30, `${from}-${to}`);
    }
    const fit = days - injDays;
    if (fit <= 0) continue;
    const frac = fit / 365;
    // minutos até agora projetados para a época inteira
    const done = (s.devFrac ?? 0) + days / 365;
    const junior = p.clubId.endsWith('@jun');
    // juniores jogam nos campeonatos de formação: contam como titulares com nota razoável (estimativa)
    const st = junior ? { games: 20, goals: 0, assists: 0, minutes: 600 * 60 * 0.7, ratingSum: 20 * 6.8 } : s.pstats[p.id] && { ...s.pstats[p.id], minutes: s.pstats[p.id].minutes / Math.max(0.15, done) };
    const owner = junior ? p.clubId.slice(0, -4) : p.clubId;
    let boost = owner ? (p.position === 'GR' ? gkTrainingK(s, owner) : trainingK(s, owner)) : 1;
    // atributos do treinador (o meu clube): treino técnico e trabalho com jovens
    if (owner === s.clubId) boost *= mgrK(s, 'treino', 0.02) * (p.age <= 21 ? mgrK(s, 'jovens', 0.03) : 1);
    developPlayer(p, st, s.season.year, junior ? {} : trainingBonus(s, p.id, p.position === 'GR'), shootingFocus(s, p.id, p.clubId), { frac, seed: `${from}-${to}`, final: false, preseason: preseason && !junior, start, boost });
  }
  s.devFrac = (s.devFrac ?? 0) + days / 365;
}

function trainingNews(s: GameState, from: string, to: string) {
  const days = Math.round((Date.parse(to) - Date.parse(from)) / 864e5);
  if (days > 0 && days <= 60) accumulate(s, days);
  if (days > 0) dailyFitness(s, days);
  if (days > 0) for (const t of scoutDays(s, days)) news(s, t);
  dailyDevelopment(s, from, to);
  monthlyFinance(s, from, to);
  for (const t of aiMarket(s, from, to)) news(s, t);
  // aviso em janeiro: contratos do meu plantel que acabam no fim da época
  const jan = `${s.season.year + 1}-01-01`;
  if (from < jan && to >= jan) {
    const end = s.players.filter((p) => p.clubId === s.clubId && p.contract && p.contract.until <= s.season.year + 1);
    if (end.length) news(s, `Contratos a acabar em junho: ${end.map((p) => p.name).join(', ')}. Renova no perfil do jogador ou saem a custo zero.`);
    const st = (s.staff ?? []).filter((x) => x.clubId === s.clubId && x.until <= s.season.year + 1);
    if (st.length) news(s, `Staff com contrato a acabar em junho: ${st.map((x) => x.name).join(', ')}. Renova no ecrã Staff.`);
  }
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
  ensureContracts(s);
  ensureMyContract(s);
  if (!s.staff?.length) { ensureStaff(s); for (const c of s.clubs) if (!juniorsOf(s, c.id).length) s.players.push(...academyIntake(s, c, s.season.year)); }
  const d = nextDate(s);
  if (!d) {
    const end = keyDates(s.season.year).end;
    dailyDevelopment(s, s.date, end);
    s.date = end;
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
  // reputação e, se a confiança da direção cair demasiado, despedimento
  for (const t of afterMyMatch(s, res === 'Vitória', res === 'Derrota')) news(s, t);
  playDay(s, f.date);
  return m;
}

function playDay(s: GameState, d: string) {
  for (const f of s.season.fixtures.filter((x) => x.date === d && !x.result && !x.cancelled)) playFixture(s, f);
  const clubIds = s.leagues[0].clubIds;
  const before = { ...s.season.winners };
  for (const t of afterMatchday(s.season, clubIds, (id) => clubName(s, id), espIds(s))) news(s, t);
  // títulos: todo o plantel ganha moral
  for (const [comp, w] of Object.entries(s.season.winners)) if (w && before[comp as keyof typeof before] !== w) {
    moraleEvent(s, s.players.filter((p) => p.clubId === w).map((p) => p.id), 10);
    if (PRIZES[comp]) book(s, w, `Prémio: ${COMP_NAMES[comp as keyof typeof COMP_NAMES]}`, PRIZES[comp]);
    onTitle(s, w, comp);
  }
  for (const t of aiCoachChanges(s)) news(s, t);
}

// Fim de época: palmarés, evolução, reformas, formação e nova época
function endSeason(s: GameState): DevChange[] {
  const old = s.season;
  for (const comp of ['supertaca', 'tacaLiga', 'taca', 'liga', 'superEsp', 'espAp', 'copaEsp', 'espCl', 'esp'] as const) {
    if (old.winners[comp]) s.honours.push({ season: old.label, comp, winner: old.winners[comp]!, runnerUp: runnerUp(old, comp) });
  }
  for (const lg of s.leagues) {
    const top = Object.entries(s.pstats).filter(([id]) => lg.clubIds.includes(s.players.find((x) => x.id === id)?.clubId ?? '')).sort((a, b) => b[1].goals - a[1].goals)[0];
    const p = top && s.players.find((x) => x.id === top[0]);
    if (p) news(s, `Melhor marcador ${lg.name} ${old.label}: ${p.name} (${clubName(s, p.clubId)}), ${top[1].goals} golos.`);
  }

  // evolução
  const changes: DevChange[] = [];
  for (const p of s.players) {
    const c = developPlayer(p, s.pstats[p.id], old.year, trainingBonus(s, p.id, p.position === 'GR'), shootingFocus(s, p.id, p.clubId), { frac: Math.max(0, 1 - (s.devFrac ?? 0)), seed: '-fim', final: true, start: s.devAttrs?.[p.id] });
    c.before = s.devStart?.[p.id] ?? c.before;
    if (p.clubId === s.clubId) changes.push(c);
  }
  // contratos que acabam (antes das reformas)
  for (const t of endLoans(s, old.year + 1)) news(s, t);
  for (const t of contractsSeasonEnd(s, old.year + 1)) news(s, t);
  for (const t of staffSeasonEnd(s, old.year + 1)) news(s, t);
  // reformas
  const retired = s.players.filter((p) => retires(p, old.year));
  for (const p of retired) if (p.clubId === s.clubId) news(s, `${p.name} terminou a carreira.`);
  s.players = s.players.filter((p) => !retired.includes(p));
  s.tactics.q1 = s.tactics.q1.filter((id) => s.players.some((p) => p.id === id));
  s.tactics.q2 = s.tactics.q2.filter((id) => s.players.some((p) => p.id === id));
  // formação: juniores chegam, os de 19 anos sobem ou saem; se faltar gente ao plantel, sobe a formação antiga
  for (const t of academySeasonEnd(s, old.year + 1)) news(s, t);
  for (const c of s.clubs) {
    const squad = s.players.filter((p) => p.clubId === c.id);
    if (squad.length >= 12) continue;
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
  // Espanha: Supercopa com os campeões do Apertura e do Clausura, o Supercampeão e o vencedor da Copa (vagas repetidas → seguintes na tabela)
  let espNext: { ranking: string[]; four: string[] } | undefined;
  if (espIds(s).length) {
    const et = old.esp?.regularTable ?? leagueTable(old, espIds(s), 99, 'esp').map((x) => x.club);
    const ec = old.winners.esp ?? et[0];
    const four: string[] = [];
    for (const c of [old.winners.espAp, old.winners.espCl, ec, old.winners.copaEsp, ...et]) if (c && !four.includes(c) && four.length < 4) four.push(c);
    espNext = { ranking: [ec, ...et.filter((c) => c !== ec)], four };
  }
  s.season = createSeason(old.year + 1, ranking, [champ, second], espNext);
  for (const l of s.leagues) l.season = s.season.label;
  s.date = `${old.year + 1}-07-01`;
  s.pstats = {};
  ensureContracts(s);
  seasonEndDiscipline(s);
  s.trainLog = {};
  s.devFrac = 0; s.devStart = {}; s.devAttrs = {};
  news(s, `Começa a época ${s.season.label}.`);
  return changes;
}
