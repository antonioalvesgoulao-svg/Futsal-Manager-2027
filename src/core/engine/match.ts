import type { CustomPlay } from '../tactics';
// Motor de jogo de futsal: simulação posse a posse com regras oficiais.
import { systemScores } from '../tacticalAI';
import { gauss, overall, rng } from '../attributes';
import { roleFit, SLOTS } from '../tactics';
import type { Player } from '../types';
import type { MatchEvent, MatchOptions, MatchResult, PlayerStats, Side, TeamSetup, TeamStats, EventType } from './types';

const HALF = 1200; // 20 minutos de tempo útil
const ET = 300; // prolongamento: 2 x 5 minutos
// Regulamento da Liga Placard, Art. 69.2: 5 + 7 suplentes; até 9 suplentes se 2 da ficha forem Sub-20 formados localmente
const MAX_SQUAD = 12;
const INJ_PER_S = 25.9 / 1000 / 3600;
const injRisk = (l: { p: { age: number; position: string; attrs: { resistencia: number } } }) =>
  (1 + Math.max(0, l.p.age - 28) * 0.03) * (1.25 - l.p.attrs.resistencia / 40) * (l.p.position === 'GR' ? 0.6 : 1);
const REBOUND = 0.25; // defesas para a frente que dão recarga (estimativa)

type A = Player['attrs'];

interface Live {
  p: Player;
  energy: number; // 0 a 100
  onCourt: boolean;
  sentOff: boolean;
  yellow: number;
  mor: number; // fator da moral nos atributos
}

interface TeamState {
  setup: TeamSetup;
  players: Live[];
  gk: Live | null; // guarda-redes em campo (null com guarda-redes avançado)
  court: Live[]; // jogadores de campo em campo
  flying: boolean;
  shortUntil: number; // inferioridade numérica até este segundo (absoluto)
  shortCount: number; // jogadores a menos
  lastRotation: number;
  qIdx: 0 | 1; // quinteto em campo
  fouls: number[]; // faltas acumuladas por período
  timeoutUsed: boolean[];
  conceded: number[]; // segundos dos golos sofridos (para pedir time-out)
}

const fmt = (t: number) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export function createMatch(home: TeamSetup, away: TeamSetup, opts: MatchOptions = {}) {
  const r = rng(opts.seed ?? `${home.clubId}-${away.clubId}-${Math.random()}`);
  const pick = <T>(arr: T[], w: (x: T) => number): T => {
    const ws = arr.map((x) => Math.max(0.01, w(x)));
    let v = r() * ws.reduce((a, b) => a + b, 0);
    for (let i = 0; i < arr.length; i++) if ((v -= ws[i]) <= 0) return arr[i];
    return arr[arr.length - 1];
  };

  // Ritmo do jogo e inspiração de cada equipa nesse dia: dão variedade aos resultados
  // (jogos fechados com poucos golos e jogos abertos com muitos, como no futsal real)
  const pace = Math.max(0.7, Math.min(1.3, 1 + gauss(r) * 0.08));
  const form: [number, number] = [Math.max(0.7, Math.min(1.3, 1 + gauss(r) * 0.08)), Math.max(0.7, Math.min(1.3, 1 + gauss(r) * 0.08))];

  const events: MatchEvent[] = [];
  const score: [number, number] = [0, 0];
  const pstats: Record<string, PlayerStats> = {};
  const names: Record<string, string> = {};
  const tstats: [TeamStats, TeamStats] = [newTeamStats(), newTeamStats()];
  const conceded: Record<string, number> = {};

  let clock = 0; // segundos absolutos de jogo
  let period = 1;
  let periodStart = 0;
  let periodLen = HALF;
  const teams = [home, away].map((setup) => buildTeam(setup)) as [TeamState, TeamState];

  function newTeamStats(): TeamStats {
    return { possession: 0, shots: 0, onTarget: 0, corners: 0, fouls: 0, foulsByPeriod: [0, 0, 0, 0, 0], yellow: 0, red: 0, timeouts: [] };
  }

  function buildTeam(setup: TeamSetup): TeamState {
    // Convocatória: 2 guarda-redes + melhores jogadores de campo até 14
    const gks = setup.squad.filter((p) => p.position === 'GR').sort((a, b) => overall(b.attrs, 'GR') - overall(a.attrs, 'GR'));
    const out = setup.squad.filter((p) => p.position !== 'GR').sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position));
    // os escolhidos pelo treinador entram sempre na convocatória
    const tac = setup.tactics;
    const wanted = new Set([tac.gk, ...tac.q1, ...tac.q2].filter(Boolean) as string[]);
    const gkList = [...gks.filter((p) => wanted.has(p.id)), ...gks.filter((p) => !wanted.has(p.id))].slice(0, 2);
    const outList = [...out.filter((p) => wanted.has(p.id)), ...out.filter((p) => !wanted.has(p.id))];
    // Sub-20 formados localmente (estimativa: portugueses até 20 anos): com 2 na ficha, mais 2 lugares
    const youth = outList.filter((p) => p.age <= 20 && p.nationality === 'Portugal').slice(0, 2);
    const rest = outList.filter((p) => !youth.includes(p));
    const called = youth.length === 2
      ? [...gkList, ...youth, ...rest.slice(0, MAX_SQUAD + 2 - gkList.length - 2)]
      : [...gkList, ...outList.slice(0, MAX_SQUAD - gkList.length)];
    const players: Live[] = called.map((p) => ({ p, energy: Math.max(40, setup.fitness?.[p.id] ?? 100), onCourt: false, sentOff: false, yellow: 0, mor: 1 + (((setup.morale?.[p.id] ?? 65) - 65) / 100) * 0.12 }));
    for (const l of players) {
      names[l.p.id] = l.p.name;
      pstats[l.p.id] = { minutes: 0, goals: 0, assists: 0, shots: 0, onTarget: 0, saves: 0, fouls: 0, tackles: 0, yellow: 0, red: false, rating: 6 };
      conceded[l.p.id] = 0;
    }
    const t: TeamState = {
      setup, players, gk: null, court: [], flying: false, shortUntil: 0, shortCount: 0, lastRotation: 0, qIdx: 0,
      fouls: [0, 0, 0, 0, 0], timeoutUsed: [false, false, false], conceded: [],
    };
    t.gk = players.find((l) => l.p.id === tac.gk) ?? players.find((l) => l.p.position === 'GR') ?? null;
    if (t.gk) t.gk.onCourt = true;
    t.court = quintet(t, 0, 4);
    t.court.forEach((l) => (l.onCourt = true));
    return t;
  }

  // Escolhe 4 jogadores de campo: um defensivo, um pivô e dois alas, pelos que estão mais frescos e melhores
  function chooseFour(t: TeamState, exclude: Live[] = []): Live[] {
    const avail = t.players.filter((l) => !l.sentOff && l.p.position !== 'GR' && !exclude.includes(l));
    // penaliza ligeiramente quem já jogou muito, para a IA rodar 9 a 10 jogadores como no futsal real
    const share = (l: Live) => (clock > 120 ? pstats[l.p.id].minutes / clock : 0);
    const value = (l: Live) => overall(l.p.attrs, l.p.position) * (0.3 + 0.7 * (l.energy / 100)) * (1 - 0.3 * share(l));
    const take = (pred: (l: Live) => boolean, chosen: Live[]) => {
      const c = avail.filter((l) => pred(l) && !chosen.includes(l)).sort((a, b) => value(b) - value(a))[0];
      if (c) chosen.push(c);
    };
    const chosen: Live[] = [];
    take((l) => ['FIX', 'FIX/ALA', 'UNI'].includes(l.p.position), chosen);
    take((l) => ['PIV', 'ALA/PIV'].includes(l.p.position), chosen);
    while (chosen.length < 4) {
      const before = chosen.length;
      take(() => true, chosen);
      if (chosen.length === before) break;
    }
    return chosen;
  }

  // Quinteto definido pelo treinador (completa com os melhores disponíveis se faltar alguém)
  function quintet(t: TeamState, idx: 0 | 1, size: number): Live[] {
    const ids = idx === 0 ? t.setup.tactics.q1 : t.setup.tactics.q2;
    const chosen = ids
      .map((id) => t.players.find((l) => l.p.id === id))
      .filter((l): l is Live => !!l && !l.sentOff && l.energy > 45 && l !== t.gk);
    if (chosen.length < size) {
      const extra = chooseFour(t, chosen).filter((l) => !chosen.includes(l));
      chosen.push(...extra.slice(0, size - chosen.length));
    }
    return chosen.slice(0, size);
  }

  const REF = opts.referees ?? { names: ['', ''] as [string, string], tolerance: 1, cards: 1, harsh: 1 };
  const ROT = { curta: { min: 60, energy: 80, max: 180 }, normal: { min: 90, energy: 72, max: 300 }, longa: { min: 120, energy: 62, max: 420 } };
  const PRESS_DRAIN = { alta: 1.15, media: 1, baixa: 0.92 };

  const eff = (l: Live, k: keyof A) => l.p.attrs[k] * (0.72 + 0.28 * (l.energy / 100)) * l.mor;
  const avg = (ls: Live[], ks: (keyof A)[]) =>
    ls.length ? ls.reduce((s, l) => s + ks.reduce((a, k) => a + eff(l, k), 0) / ks.length, 0) / ls.length : 5;

  // Jogadores de campo ativos (com guarda-redes avançado, um jogador de campo extra)
  const outfield = (t: TeamState) => t.court;
  const numbers = (t: TeamState) => t.court.length + (t.gk ? 1 : 0);

  function log(type: EventType, text: string, side?: Side, playerId?: string, assistId?: string) {
    events.push({ t: clock, period, side, type, playerId, assistId, text: `${fmt(clock)} ${text}`, score: [score[0], score[1]] });
  }

  function tick(dt: number) {
    for (const t of teams) {
      for (const l of t.players) {
        if (l.sentOff) continue;
        if (l.onCourt) {
          pstats[l.p.id].minutes += dt;
          if (opts.injuries !== false && r() < INJ_PER_S * dt * injRisk(l)) injure(t, l);
          const drain = l.p.position === 'GR' ? 0.012 : 0.085 * (1.35 - l.p.attrs.resistencia / 25) * PRESS_DRAIN[t.setup.tactics.pressure];
          l.energy = Math.max(20, l.energy - drain * dt);
        } else {
          l.energy = Math.min(100, l.energy + 0.11 * dt);
        }
      }
    }
    clock += dt;
  }

  // Lesão a meio do jogo (Lopes et al. 2023: 25,9 por 1000 h em campo): sai e entra um suplente (sem inferioridade)
  function injure(t: TeamState, l: Live) {
    const s = teams.indexOf(t) as Side;
    l.sentOff = true; l.onCourt = false;
    pstats[l.p.id].injured = true;
    const bench = t.players.filter((x) => !x.onCourt && !x.sentOff);
    if (t.gk === l) {
      const gk2 = bench.find((x) => x.p.position === 'GR');
      if (gk2) { gk2.onCourt = true; t.gk = gk2; }
      else {
        // sem guarda-redes no banco: vai à baliza o jogador de campo com mais jeito, entra outro para o lugar dele
        const g = [...t.court].sort((a, b) => b.p.attrs.reflexos + b.p.attrs.agilidade - a.p.attrs.reflexos - a.p.attrs.agilidade)[0];
        if (g) { t.court = t.court.filter((x) => x !== g); t.gk = g; }
        const sub = bench.filter((x) => x.p.position !== 'GR').sort((a, b) => b.energy - a.energy)[0];
        if (sub) { sub.onCourt = true; t.court.push(sub); }
      }
    } else {
      t.court = t.court.filter((x) => x !== l);
      const sub = bench.filter((x) => x.p.position !== 'GR').sort((a, b) => b.energy - a.energy)[0];
      if (sub) { sub.onCourt = true; t.court.push(sub); }
    }
    log('lesao', `${l.p.name} lesiona-se e tem de sair (${sideName(s)})`, s, l.p.id);
  }

  function sideName(s: Side) {
    return teams[s].setup.shortName;
  }

  // Rotação de quintetos (substituições volantes, ilimitadas)
  function rotate(s: Side) {
    const t = teams[s];
    const avgEnergy = t.court.reduce((a, l) => a + l.energy, 0) / Math.max(1, t.court.length);
    const since = clock - t.lastRotation;
    if (t.setup.tactics.rotation === 'manual') return; // só o treinador substitui
    const rot = ROT[t.setup.tactics.rotation] ?? ROT.normal;
    if (since < rot.min) return;
    if (avgEnergy > rot.energy && since < rot.max) return;
    const target = 4 - (clock < t.shortUntil ? t.shortCount : 0) + (t.flying ? 1 : 0);
    const out = t.court;
    const hasQuintets = t.setup.tactics.q1.length + t.setup.tactics.q2.length > 0;
    let next: Live[];
    if (hasQuintets) {
      t.qIdx = t.qIdx === 0 ? 1 : 0;
      next = quintet(t, t.qIdx, Math.max(0, target));
    } else {
      const fresh = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== 'GR' && l.energy > 70).length;
      next = chooseFour(t, fresh >= 4 ? out : out.filter(() => r() < 0.6)).slice(0, Math.max(0, target));
    }
    // completa com os que estavam em campo se não houver suplentes suficientes
    while (next.length < target) {
      const extra = out.find((l) => !next.includes(l) && !l.sentOff);
      if (!extra) break;
      next.push(extra);
    }
    const ins = next.filter((l) => !out.includes(l));
    if (!ins.length) return;
    out.forEach((l) => (l.onCourt = false));
    next.forEach((l) => (l.onCourt = true));
    t.court = next;
    t.lastRotation = clock;
    log('substituicao', `${sideName(s)}: troca de quinteto (${ins.map((l) => l.p.name).join(', ')})`, s);
  }

  // Mudanças táticas do treinador da IA durante o jogo (auditoria 2026; valores estimados): a perder nos últimos
  // 10 minutos sobe a pressão, acelera e, se o plantel servir, passa a 4-0 (mais mobilidade para desequilibrar);
  // a ganhar nos últimos 6 minutos gere o jogo (posse paciente, pressão menos arriscada). Cada mudança só uma vez
  const aiChanged: [Set<string>, Set<string>] = [new Set(), new Set()];
  function aiTacticalAdjust(s: Side) {
    const t = teams[s];
    const tac = t.setup.tactics;
    const lastPeriod = period === 2 || period === 4;
    if (!lastPeriod) return;
    const remaining = periodStart + periodLen - clock;
    const diff = score[s] - score[1 - s];
    const done = aiChanged[s];
    if (diff < 0 && remaining < 600 && !done.has('perder')) {
      done.add('perder');
      tac.pressure = 'alta';
      tac.tempo = 'rapido';
      if (tac.system !== '4-0') {
        const sc = systemScores(t.setup.squad);
        if (sc['4-0'] >= sc[tac.system] - 1.2) tac.system = '4-0';
      }
    } else if (diff > 0 && remaining < 360 && !done.has('ganhar')) {
      done.add('ganhar');
      tac.tempo = 'paciente';
      if (tac.pressure === 'alta') tac.pressure = 'media';
    }
  }

  // Guarda-redes avançado
  function flyingDecision(s: Side) {
    const t = teams[s];
    const diff = score[s] - score[1 - s];
    const remaining = periodStart + periodLen - clock;
    let want = false;
    const fk = flyingOverride[s] === true ? 'sempre' : flyingOverride[s] === false ? 'nunca' : t.setup.tactics.flyingKeeper;
    const lastPeriod = period === 2 || period === 4;
    const needWin = opts.needWin?.[s] ?? false;
    if (fk === 'sempre') want = true;
    else if (fk === 'auto') {
      want = lastPeriod && diff < 0 && diff >= -3 && remaining <= (diff === -1 ? 180 : 300);
      if (opts.knockout && period === 4 && diff < 0 && remaining <= 150) want = true;
    } else if (fk === 'agressivo') {
      want = lastPeriod && diff < 0 && diff >= -4 && remaining <= (diff === -1 ? 300 : 420);
      if (needWin && lastPeriod && diff === 0 && remaining <= 180) want = true;
    }
    if (want && !t.flying && t.gk) {
      const bench = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== 'GR');
      const chosen = bench.find((l) => l.p.id === t.setup.tactics.flyingPlayer); // escolhido pelo treinador nas táticas
      const sub = chosen ?? bench.sort((a, b) => eff(b, 'passe') + eff(b, 'decisoes') - eff(a, 'passe') - eff(a, 'decisoes'))[0];
      if (!sub) return;
      t.gk.onCourt = false;
      t.gk = null;
      sub.onCourt = true;
      t.court = [...t.court, sub];
      t.flying = true;
      log('gr_avancado_on', `${sideName(s)} arrisca com guarda-redes avançado (${sub.p.name})`, s);
    } else if (!want && t.flying) {
      removeFlying(s);
    }
  }

  function removeFlying(s: Side) {
    const t = teams[s];
    if (!t.flying) return;
    const gk = t.players.find((l) => l.p.position === 'GR' && !l.sentOff);
    const outP = [...t.court].sort((a, b) => a.energy - b.energy)[0];
    if (outP) {
      outP.onCourt = false;
      t.court = t.court.filter((l) => l !== outP);
    }
    if (gk) {
      gk.onCourt = true;
      t.gk = gk;
    }
    t.flying = false;
    log('gr_avancado_off', `${sideName(s)} volta a jogar com guarda-redes`, s);
  }

  function maybeTimeout(s: Side) {
    const t = teams[s];
    const idx = period <= 2 ? period : 2;
    if (period > 2 || t.timeoutUsed[idx] || clock - periodStart < 60) return;
    const remaining = periodStart + periodLen - clock;
    const diff = score[s] - score[1 - s];
    const recentGoals = t.conceded.filter((x) => clock - x < 240).length;
    if (recentGoals >= 2 || (diff < 0 && remaining < 150 && period === 2) || (remaining < 60 && r() < 0.3 && diff <= 0)) {
      t.timeoutUsed[idx] = true;
      tstats[s].timeouts.push(clock);
      log('time_out', `Desconto de tempo pedido pelo ${sideName(s)}`, s);
      // descanso: recupera energia dos jogadores em campo
      for (const l of t.court) l.energy = Math.min(100, l.energy + 6);
    }
  }

  function goal(s: Side, scorer: Live, assist?: Live, how = '') {
    score[s]++;
    pstats[scorer.p.id].goals++;
    if (assist) pstats[assist.p.id].assists++;
    const opp = teams[1 - s];
    if (opp.gk) conceded[opp.gk.p.id]++;
    opp.conceded.push(clock);
    log('golo', `GOLO! ${scorer.p.name}${how}${assist ? `, assistência de ${assist.p.name}` : ''}. ${home.shortName} ${score[0]}-${score[1]} ${away.shortName}`, s, scorer.p.id, assist?.p.id);
    // inferioridade termina se a equipa em superioridade marcar
    if (clock < opp.shortUntil) {
      opp.shortUntil = clock;
      opp.shortCount = 0;
      completeTeam(1 - s as Side);
    }
  }

  function completeTeam(s: Side) {
    const t = teams[s];
    const need = 4 + (t.flying ? 1 : 0) - t.court.length;
    for (let i = 0; i < need; i++) {
      const sub = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== 'GR').sort((a, b) => b.energy - a.energy)[0];
      if (!sub) break;
      sub.onCourt = true;
      t.court.push(sub);
    }
  }

  function card(s: Side, l: Live, red: boolean, why: 'dogso' | 'brawl' | 'agressao' | 'violento' = 'dogso') {
    const t = teams[s];
    if (!red) {
      l.yellow++;
      pstats[l.p.id].yellow++;
      tstats[s].yellow++;
      if (l.yellow < 2) {
        log('amarelo', `Cartão amarelo para ${l.p.name} (${sideName(s)})`, s, l.p.id);
        return;
      }
    }
    // expulsão
    l.sentOff = true;
    l.onCourt = false;
    pstats[l.p.id].red = true;
    pstats[l.p.id].redKind = red ? why : 'twoYellows';
    tstats[s].red++;
    log('vermelho', `Cartão vermelho${red ? '' : ' (segundo amarelo)'} para ${l.p.name}. ${sideName(s)} fica em inferioridade`, s, l.p.id);
    if (t.gk === l) {
      t.gk = null;
      const gk2 = t.players.find((x) => x.p.position === 'GR' && !x.sentOff);
      const outP = t.court.sort((a, b) => a.energy - b.energy)[0];
      if (gk2 && outP) {
        outP.onCourt = false;
        t.court = t.court.filter((x) => x !== outP);
        gk2.onCourt = true;
        t.gk = gk2;
      }
    } else {
      t.court = t.court.filter((x) => x !== l);
    }
    t.shortUntil = clock + 120;
    t.shortCount = 1;
  }

  // Escolhas de jogadores
  const shooterWeight = (l: Live) => {
    const posW: Record<string, number> = { PIV: 1.3, 'ALA/PIV': 1.25, ALA: 1.15, UNI: 1, 'FIX/ALA': 0.85, FIX: 0.7, GR: 0.1 };
    return (14 + eff(l, 'finalizacao') + eff(l, 'remate')) * (posW[l.p.position] ?? 1);
  };
  const best = (ls: Live[], f: (l: Live) => number) => [...ls].sort((a, b) => f(b) - f(a))[0];

  let setPiece: { q: number; block: number; assist?: Live } | null = null;
  // defesa com a bola agarrada: a equipa do GR pode sair em contra-ataque com reposição rápida à mão
  let savedCaught: { side: Side; gk: Live } | null = null;
  // Ações da posse em curso (quem passa, remata, rouba), para a visualização 2D/3D
  let actions: Action[] = [];

  function shot(s: Side, kind: 'jogada' | 'contra' | 'livre10' | 'penalti' | 'canto' | 'baliza_aberta' | 'recarga', shooterIn?: Live): void {
    const att = teams[s];
    const def = teams[1 - s];
    const shooter = shooterIn ?? pick(outfield(att), shooterWeight);
    const others = outfield(att).filter((l) => l !== shooter);
    const assist = setPiece ? setPiece.assist : kind === 'jogada' || kind === 'contra' || kind === 'canto' ? (r() < 0.62 && others.length ? pick(others, (l) => eff(l, 'passe') + eff(l, 'visao')) : undefined) : undefined;
    tstats[s].shots++;
    pstats[shooter.p.id].shots++;

    const finish = kind === 'jogada' || kind === 'canto' ? (eff(shooter, 'finalizacao') * 0.6 + eff(shooter, 'remate') * 0.4) : eff(shooter, 'finalizacao');
    const compo = eff(shooter, 'compostura');
    const defQ = avg(outfield(def), ['desarme', 'posicionamento', 'antecipacao']);
    const gk = def.gk;
    const gkQ = gk ? (eff(gk, 'reflexos') + eff(gk, 'umParaUm') + eff(gk, 'posicionamento') + eff(gk, 'agilidade')) / 4 : 0;

    let pBlock = 0.24 + (defQ - finish) * 0.01;
    let pOn = 0.47 + (finish - 10) * 0.016 + (compo - 10) * 0.006;
    let pGoal = 0.155 + (finish - gkQ) * 0.022; // calibrado com 5 épocas reais (6,38 golos/jogo); 0,155 após os planteis oficiais da FPF (2/11)
    if (kind === 'contra') { pBlock *= 0.5; pOn += 0.08; pGoal += 0.1; }
    if (kind === 'livre10') { pBlock = 0; pOn = 0.72 + (finish - 10) * 0.015; pGoal = 0.42 + (finish - gkQ) * 0.025; }
    if (kind === 'penalti') { pBlock = 0; pOn = 0.86 + (compo - 10) * 0.01; pGoal = 0.78 + (finish - gkQ) * 0.02; }
    if (kind === 'canto') { pBlock += 0.05 + (setPiece?.block ?? 0); pOn -= 0.05; pGoal *= setPiece?.q ?? 1; }
    if (!gk || kind === 'baliza_aberta') { pGoal = kind === 'baliza_aberta' ? (gk ? 0.6 : 0.85) : 0.75; } // GR fora da baliza (a recuperar) ainda pode chegar
    // recarga: a bola sai da defesa para a frente da baliza e alguém chega primeiro (GR ainda no chão)
    if (kind === 'recarga') { pBlock = 0.18; pOn = 0.62 + (finish - 10) * 0.012; pGoal = 0.3 + (finish - gkQ) * 0.02; }
    if (kind === 'baliza_aberta') { pBlock = 0.08; pOn = 0.5 + (eff(shooter, 'remate') - 10) * 0.02; }
    const cl = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
    if (kind === 'jogada' || kind === 'contra' || kind === 'canto') pGoal *= form[s] * pace * TEMPO[att.setup.tactics.tempo].quality;
    pBlock = cl(pBlock, 0, 0.45); pOn = cl(pOn, 0.2, 0.95); pGoal = cl(pGoal, 0.06, 0.92);

    const how: Record<string, string> = {
      jogada: '', contra: ' em contra-ataque', livre10: ' no livre direto dos 10 metros', penalti: ' de penálti', canto: ' na sequência de um canto', baliza_aberta: ' para a baliza deserta', recarga: ' na recarga',
    };

    const vk = kind === 'livre10' ? 'free10' : kind === 'penalti' ? 'penalty' : kind === 'canto' ? 'setpiece' : kind === 'baliza_aberta' ? 'open' : kind === 'contra' ? 'counter' : kind === 'recarga' ? 'rebound' : 'play';
    if (r() < pBlock) {
      const blocker = pick(outfield(def), (l) => eff(l, 'desarme') + eff(l, 'posicionamento'));
      pstats[blocker.p.id].tackles++;
      actions.push({ type: 'shot', side: s, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: 'blocked', other: blocker.p.id });
      if (r() < 0.25) corner(s);
      else log('remate_bloqueado', `Remate de ${shooter.p.name} bloqueado por ${blocker.p.name}`, s, shooter.p.id);
      return;
    }
    if (r() > pOn) {
      const post = r() < 0.07;
      actions.push({ type: 'shot', side: s, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: post ? 'post' : 'wide' });
      if (post) log('poste', `${shooter.p.name} acerta no poste!`, s, shooter.p.id);
      else if (kind !== 'jogada') log('remate_fora', `${shooter.p.name} remata ao lado${how[kind]}`, s, shooter.p.id);
      return;
    }
    tstats[s].onTarget++;
    pstats[shooter.p.id].onTarget++;
    if (r() < pGoal) {
      actions.push({ type: 'shot', side: s, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: 'goal' });
      goal(s, shooter, assist, how[kind]);
    } else if (gk) {
      // agarra ou defende para a frente/canto (melhores reflexos e colocação agarram mais)
      const caught = r() < 0.5 + (eff(gk, 'posicionamento') - 10) * 0.02;
      actions.push({ type: 'shot', side: s, kind: vk, shooter: shooter.p.id, assist: assist?.p.id, result: 'saved', other: gk.p.id, caught });
      if (caught) savedCaught = { side: (1 - s) as Side, gk };
      pstats[gk.p.id].saves++;
      if (kind !== 'jogada' || r() < 0.35) log('remate_defendido', `Defesa de ${gk.p.name} a remate de ${shooter.p.name}${kind === 'penalti' ? ' (penálti defendido!)' : kind === 'livre10' ? ' (livre dos 10 m)' : ''}`, s, shooter.p.id);
      if (!caught && (kind === 'jogada' || kind === 'contra') && r() < REBOUND) {
        // ressalto: a bola fica viva à frente da baliza; recarga de um atacante (às vezes o próprio rematador)
        const rs = r() < 0.3 ? shooter : pick(outfield(att), (l) => eff(l, 'antecipacao') + eff(l, 'finalizacao'));
        shot(s, 'recarga', rs);
      } else if (r() < 0.2) corner(s);
    }
  }

  // Marcador designado se estiver em campo; senão o melhor em campo
  function taker(t: TeamState, id: string | null | undefined, f: (l: Live) => number) {
    return outfield(t).find((l) => l.p.id === id) ?? best(outfield(t), f);
  }

  const CORNER = {
    primeiro_poste: { chance: 0.36, target: (l: Live) => eff(l, 'finalizacao') + eff(l, 'antecipacao'), q: 1, block: 0, counter: 0.06 },
    remate_fora: { chance: 0.4, target: (l: Live) => eff(l, 'remate') * 2, q: 0.92, block: 0.08, counter: 0.1 },
    bloqueio_pivo: { chance: 0.28, target: (l: Live) => eff(l, 'jogoCostas') + eff(l, 'finalizacao') + (l.p.position === 'PIV' ? 6 : 0), q: 1.18, block: -0.04, counter: 0.06 },
    curto: { chance: 0.24, target: (l: Live) => eff(l, 'finalizacao') + eff(l, 'remate'), q: 1, block: -0.06, counter: 0.01 },
  };

  function corner(s: Side) {
    const att = teams[s];
    tstats[s].corners++;
    const sp = att.setup.tactics.setPieces;
    const rt = sp?.cornerRoutine === 'personalizado' ? customRt(sp.customCorner) : CORNER[sp?.cornerRoutine ?? 'primeiro_poste'];
    const kicker = taker(att, sp?.corner, (l) => eff(l, 'bolasParadas') * 2 + eff(l, 'passe'));
    actions.push({ type: 'corner', side: s, shooter: kicker.p.id });
    log('canto', `Canto para o ${sideName(s)}, marcado por ${kicker.p.name}`, s);
    // a qualidade do marcador aumenta a hipótese de criar remate
    if (r() < rt.chance + (eff(kicker, 'bolasParadas') - 10) * 0.01) {
      const others = outfield(att).filter((l) => l !== kicker);
      // quem remata: o escolhido pelo treinador (função de rematador / 2.ª posição), se estiver em campo
      const chosen = others.find((l) => l.p.id === (sp?.cornerRoutine === 'personalizado' ? sp.customCorner?.slots.find((x) => x.role === 'rematador')?.player : sp?.cornerRoles?.[0]));
      const shooter = chosen ?? (others.length ? pick(others, rt.target) : kicker);
      setPiece = { q: rt.q, block: rt.block, assist: kicker };
      shot(s, 'canto', shooter);
      setPiece = null;
    } else if (r() < rt.counter) {
      // perda na bola parada: contra-ataque do adversário
      shot((1 - s) as Side, 'contra');
    }
  }

  // jogada desenhada: mais movimentos e um bloqueio criam melhores remates; sem equilíbrio, mais contra-ataques (estimativa)
  function customRt(cp?: CustomPlay) {
    const runs = Math.min(3, (cp?.paths ?? []).filter((x) => x.kind === 'run').length);
    const block = cp?.slots.some((x) => x.role === 'bloqueio');
    const bal = cp?.slots.some((x) => x.role === 'equilibrio');
    return { chance: 0.3 + runs * 0.03, target: (l: Live) => eff(l, 'finalizacao') + eff(l, 'remate'), q: 0.98 + runs * 0.03 + (block ? 0.05 : 0), block: block ? -0.03 : 0, counter: bal ? 0.04 : 0.11 };
  }

  const FREEKICK = {
    remate_direto: { chance: 0.75, q: 0.95 },
    jogada_ensaiada: { chance: 0.5, q: 1.12 },
    cruzamento: { chance: 0.42, q: 1.08 },
  };

  function freeKick(s: Side) {
    const att = teams[s];
    const sp = att.setup.tactics.setPieces;
    const kind = sp?.freeKickRoutine ?? 'remate_direto';
    const rt = kind === 'personalizado' ? { chance: customRt(sp?.customFk).chance + 0.15, q: customRt(sp?.customFk).q } : FREEKICK[kind];
    const kicker = taker(att, sp?.freeKick, (l) => eff(l, 'bolasParadas') * 2 + eff(l, 'remate'));
    if (r() > rt.chance + (eff(kicker, 'bolasParadas') - 10) * 0.012) return;
    let shooter = kicker;
    const others = outfield(att).filter((l) => l !== kicker);
    const chosenFk = others.find((l) => l.p.id === (kind === 'personalizado' ? sp?.customFk?.slots.find((x) => x.role === 'rematador')?.player : sp?.fkRoles?.[0]));
    if (chosenFk && kind !== 'remate_direto') shooter = chosenFk;
    else if (kind === 'personalizado' && others.length) shooter = pick(others, (l) => eff(l, 'finalizacao') + eff(l, 'remate'));
    else if (kind === 'cruzamento' && others.length) shooter = best(others, (l) => eff(l, 'finalizacao') + eff(l, 'jogoCostas'));
    else if (kind === 'jogada_ensaiada' && others.length) shooter = pick(others, (l) => eff(l, 'finalizacao') + eff(l, 'remate'));
    setPiece = { q: rt.q, block: 0, assist: shooter === kicker ? undefined : kicker };
    shot(s, 'canto', shooter);
    setPiece = null;
  }

  // ---- Confrontos entre jogadores depois de faltas ----
  // A tensão sobe com a importância do jogo (dérbis, finais, play-off, rivais próximos) e com um
  // resultado apertado perto do fim. Em jogos grandes juntam-se mais jogadores. A arbitragem castiga
  // conforme o temperamento da dupla (cartões e severidade).
  function tension() {
    let t = opts.importance ?? 0.15;
    const remaining = periodStart + periodLen - clock;
    const close = Math.abs(score[0] - score[1]) <= 1;
    if (close && period >= 2 && remaining < 600) t += 0.2;
    if (score[0] === score[1] && period >= 2 && remaining < 300) t += 0.15;
    return Math.min(1.2, t);
  }

  function maybeBrawl(s: Side, fouler: Live, victim: Live) {
    const ten = tension();
    if (r() > 0.0015 + 0.03 * ten * ten) return;
    const pool = [...outfield(teams[0]), ...outfield(teams[1])].filter((l) => l !== fouler && l !== victim && !l.sentOff);
    const extra = Math.min(pool.length, Math.floor(r() * (1 + 4 * ten)));
    const others = [...pool].sort((a, b) => eff(b, 'agressividade') - eff(a, 'agressividade') + (r() - 0.5) * 8).slice(0, extra);
    const who = [fouler, victim, ...others];
    const cards: { id: string; red: boolean }[] = [];
    log('confronto', `Confronto entre jogadores! ${fouler.p.name} e ${victim.p.name}${others.length ? ` (juntam-se ${others.map((l) => l.p.name).join(', ')})` : ''}`, s);
    for (const l of who) {
      const side = (teams[0].court.includes(l) || teams[0].gk === l ? 0 : 1) as Side;
      const main = l === fouler || l === victim;
      const hot = (eff(l, 'agressividade') - 10) * 0.02;
      if (r() < (main ? 0.07 : 0.03) * REF.harsh * (0.6 + ten) + hot * 0.3) {
        // ~30% dos vermelhos num confronto são agressão a sério (soco, cabeçada; estimativa); às vezes o agredido fica lesionado
        const target = l === fouler ? victim : l === victim ? fouler : null;
        const aggr = !!target && r() < 0.3 + hot;
        cards.push({ id: l.p.id, red: true });
        card(side, l, true, aggr ? 'agressao' : 'brawl');
        if (aggr && target) { pstats[l.p.id].victim = target.p.id; if (!target.sentOff && r() < 0.25) injure(teams[(1 - side) as Side], target); }
      }
      else if (r() < (main ? 0.55 : 0.28) * REF.cards + hot) { cards.push({ id: l.p.id, red: l.yellow >= 1 }); card(side, l, false); }
    }
    actions.push({ type: 'brawl', side: s, players: who.map((l) => l.p.id), cards });
  }

  function foul(s: Side) {
    // s = equipa que ataca e sofre a falta
    const def = teams[1 - s];
    const att = teams[s];
    const fouler = pick(outfield(def), (l) => eff(l, 'agressividade') + eff(l, 'desarme') * 0.5);
    const victim = pick(outfield(att), (l) => eff(l, 'drible') + eff(l, 'jogoCostas'));
    const fp = period >= 3 ? 2 : period; // prolongamento continua as faltas da 2.ª parte
    def.fouls[fp]++;
    tstats[1 - s].fouls++;
    tstats[1 - s].foulsByPeriod[period]++;
    pstats[fouler.p.id].fouls++;
    const n = def.fouls[fp];

    const dogso = r() < 0.004;
    // entrada violenta (raro, estimativa ~1 em cada 6 jogos de 25 faltas): vermelho direto e o atingido pode lesionar-se
    const violent = !dogso && r() < 0.0012 + Math.max(0, eff(fouler, 'agressividade') - 12) * 0.0004;
    if (dogso) card((1 - s) as Side, fouler, true);
    else if (violent) { card((1 - s) as Side, fouler, true, 'violento'); pstats[fouler.p.id].victim = victim.p.id; if (r() < 0.5) injure(att, victim); }
    else if (r() < (0.22 + (eff(fouler, 'agressividade') - 10) * 0.008) * REF.cards * (def.setup.cardK ?? 1) * (fouler.yellow ? 0.35 : 1)) card((1 - s) as Side, fouler, false);

    const sp = att.setup.tactics.setPieces;
    actions.push({ type: 'foul', side: s, shooter: victim.p.id, other: fouler.p.id, kind: n >= 6 ? 'free10' : 'play' });
    maybeBrawl(s, fouler, victim);
    if (r() < 0.03) {
      actions[actions.length - 1].kind = 'penalty';
      log('penalti', `Penálti! Falta de ${fouler.p.name} sobre ${victim.p.name}`, s);
      shot(s, 'penalti', taker(att, sp?.penalty, (l) => eff(l, 'finalizacao') + eff(l, 'compostura')));
    } else if (n >= 6) {
      log('livre_10m', `${n}.ª falta acumulada do ${sideName((1 - s) as Side)} (${fouler.p.name}): livre direto sem barreira`, s);
      shot(s, 'livre10', taker(att, sp?.free10, (l) => eff(l, 'finalizacao') + eff(l, 'remate') + eff(l, 'compostura')));
    } else {
      if (n === 5) log('falta', `5.ª falta acumulada do ${sideName((1 - s) as Side)}: a próxima dá livre de 10 metros`, (1 - s) as Side);
      else log('falta', `Falta de ${fouler.p.name} sobre ${victim.p.name}`, (1 - s) as Side, fouler.p.id);
      // livre perto da área: bola parada conforme a jogada escolhida
      if (r() < 0.3) freeKick(s);
    }
  }

  const TEMPO = {
    rapido: { dur: 0.8, lose: 0, quality: 0.98 },
    equilibrado: { dur: 1, lose: 0, quality: 1 },
    paciente: { dur: 1.2, lose: -0.01, quality: 1.02 },
  };
  const PRESS = {
    alta: { lose: 0.05, foul: 0.03, counter: -0.05 },
    media: { lose: 0, foul: 0, counter: 0 },
    baixa: { lose: -0.04, foul: -0.02, counter: 0.1 },
  };

  // Efeito do sistema e da marcação, conforme os jogadores em campo
  function tacticalMods(t: TeamState) {
    const tac = t.setup.tactics;
    const court = outfield(t);
    let att = 0;
    let def = 0;
    const bestBy = (pos: string[], k: keyof A) => court.filter((l) => pos.includes(l.p.position)).sort((a, b) => eff(b, k) - eff(a, k))[0];
    if (tac.system === '3-1') {
      const piv = bestBy(['PIV', 'ALA/PIV'], 'jogoCostas');
      att += piv ? (eff(piv, 'jogoCostas') - 11) * 0.18 : -0.6;
    } else if (tac.system === '4-0') {
      att += (avg(court, ['drible', 'decisoes', 'passe', 'aceleracao']) - 11) * 0.15 + 0.2;
      def -= 0.4;
    } else if (tac.system === '2-2') {
      def += 0.6;
      att -= 0.4;
    } else if (tac.system === '1-2-1') {
      const fix = bestBy(['FIX', 'FIX/ALA', 'UNI'], 'posicionamento');
      def += fix ? (eff(fix, 'posicionamento') - 11) * 0.12 + 0.15 : -0.4;
      att += 0.1;
    }
    // jogadores fora da sua função rendem menos (ordem dos quintetos = posições do sistema)
    const slots = SLOTS[tac.system];
    const fit = court.slice(0, 4).reduce((a, l, i) => a + roleFit(slots[i].role, l.p.position), 0) / Math.max(1, Math.min(4, court.length));
    att += (fit - 0.85) * 2.5;
    def += (fit - 0.85) * 2.5;
    if (tac.marking === 'individual') def += (avg(court, ['desarme', 'agressividade']) - 11) * 0.12;
    else if (tac.marking === 'zona') def += (avg(court, ['posicionamento', 'concentracao']) - 11) * 0.12;
    return { att, def };
  }

  // Marcação vs sistema do ataque: individual anula o pivô do 3-1 mas sofre com a mobilidade do 4-0 e no 5x4;
  // zona fecha o 4-0 e o 5x4 mas deixa o pivô receber; mista é intermédia e exige concentração e trabalho de equipa.
  const MARK_VS: Record<string, Record<string, number>> = {
    individual: { '3-1': 0.35, '4-0': -0.4, '2-2': 0, '1-2-1': 0.1, flying: -0.45 },
    zona: { '3-1': -0.3, '4-0': 0.3, '2-2': 0.1, '1-2-1': 0, flying: 0.3 },
    misto: { '3-1': 0.15, '4-0': -0.05, '2-2': 0.2, '1-2-1': 0.1, flying: 0 },
  };
  function markingVs(def: TeamState, att: TeamState) {
    const mk = def.setup.tactics.marking;
    let v = MARK_VS[mk]?.[att.flying ? 'flying' : att.setup.tactics.system] ?? 0;
    if (mk === 'misto') v += (avg(outfield(def), ['concentracao', 'trabalhoEquipa']) - 11) * 0.06;
    return v;
  }

  // Uma posse de bola
  function possession(s: Side, counter = false): { next: Side; counter: boolean } {
    const att = teams[s];
    const def = teams[1 - s];
    const attQ = avg(outfield(att), ['passe', 'rececao', 'drible', 'decisoes', 'visao']);
    const defQ = avg(outfield(def), ['desarme', 'posicionamento', 'antecipacao', 'concentracao']);
    const press = avg(outfield(def), ['aceleracao', 'resistencia', 'trabalhoEquipa', 'agressividade']);
    const numDiff = numbers(att) - numbers(def);
    let diff = attQ - defQ * 0.85 - press * 0.15 + numDiff * 2.2;
    if (att.flying) diff += 1.5;
    // táticas e treinadores
    diff += tacticalMods(att).att - tacticalMods(def).def;
    // marcação contra o sistema do adversário (estimativa, pedido do António): cada marcação tem bónus e penalizações
    diff -= markingVs(def, att);
    diff += (att.setup.coachTactical - 10) * 0.07 - (def.setup.coachTactical - 10) * 0.07;
    const tempo = TEMPO[att.setup.tactics.tempo];
    const dPress = def.setup.tactics.pressure;
    diff += s === 0 ? 3.0 : -0.8; // vantagem de jogar em casa
    // momento do jogo: quem perde arrisca e empurra; quem ganha gere (aproxima resultados e empates)
    const gd = score[s] - score[1 - s];
    diff += Math.min(3, Math.max(0, -gd)) * 0.55 - Math.min(3, Math.max(0, gd)) * 0.2;
    // estilo do GR: o construtor ajuda a sair da pressão; o atacante dá mais um jogador ao ataque
    const gs = att.setup.tactics.gkStyle ?? 'classico';
    if (att.gk && !att.flying && gs !== 'classico') diff += (eff(att.gk, 'jogoPes') - 10) * (gs === 'avancado' ? 0.08 : 0.06) + (gs === 'avancado' ? 0.15 : 0.05);

    const dur = ((counter ? 5 + r() * 8 : 12 + r() * 26) * (counter ? 1 : tempo.dur)) / pace;
    const periodEnd = periodStart + periodLen;
    const timeLeft = periodEnd - clock;
    const dt = Math.min(dur, timeLeft);
    tick(dt);
    tstats[s].possession += dt;

    const ended = clock >= periodEnd - 0.001;
    if (ended && dur > timeLeft) {
      // buzina: se o remate sair antes do fim, o lance conclui-se
      if (r() < 0.25) shot(s, 'jogada');
      return { next: (1 - s) as Side, counter: false };
    }

    const pFoul = (1 / REF.tolerance) * (0.15 + (avg(outfield(def), ['agressividade']) - 10) * 0.005 + PRESS[dPress].foul + (def.setup.tactics.marking === 'individual' ? 0.02 : 0));
    const pLose = Math.max(0.18, Math.min(0.66, 0.4 - diff * 0.03 - (counter ? 0.15 : 0) + PRESS[dPress].lose + tempo.lose));
    const roll = r();
    if (roll < pFoul) {
      foul(s);
      return { next: (1 - s) as Side, counter: false };
    }
    if (roll < pFoul + pLose) {
      const tackler = pick(outfield(def), (l) => eff(l, 'desarme') + eff(l, 'antecipacao'));
      pstats[tackler.p.id].tackles++;
      actions.push({ type: 'lost', side: s, other: tackler.p.id });
      // 4 segundos (guarda-redes ou reposição): raro
      if (r() < 0.02) log('quatro_segundos', `${sideName(s)} perde a bola por exceder os 4 segundos`, s);
      // perda com guarda-redes avançado: remate à baliza deserta
      if (att.flying && r() < 0.32) {
        shot((1 - s) as Side, 'baliza_aberta', tackler);
        return { next: s, counter: false };
      }
      // GR atacante apanhado fora da baliza
      if (!att.flying && (att.setup.tactics.gkStyle ?? 'classico') === 'avancado' && r() < 0.05) {
        shot((1 - s) as Side, 'baliza_aberta', tackler);
        return { next: s, counter: false };
      }
      // quem defende recuado sai mais vezes em contra-ataque
      return { next: (1 - s) as Side, counter: r() < 0.22 + PRESS[dPress].counter };
    }
    // bater a pressão alta deixa espaço nas costas
    const beatPress = dPress === 'alta' && r() < 0.09;
    // GR atacante: às vezes é ele que sai com a bola e remata (de longe)
    const gkStyle = att.setup.tactics.gkStyle ?? 'classico';
    // raro mesmo no GR atacante (estimativa: nos estudos de futsal de elite o GR remata sobretudo no 5x4)
    const gkShoots = !att.flying && att.gk && !counter && r() < (gkStyle === 'avancado' ? 0.025 : gkStyle === 'construtor' ? 0.005 : 0);
    savedCaught = null;
    if (gkShoots) {
      shot(s, 'jogada', att.gk!);
      const last = actions[actions.length - 1];
      if (last?.type === 'shot') last.gkRun = true;
    } else shot(s, counter || beatPress ? 'contra' : 'jogada');
    // defesa agarrada: reposição rápida à mão e contra-ataque (mais com GR de bom jogo de pés)
    const sc = savedCaught as { side: Side; gk: Live } | null;
    if (sc && sc.side === 1 - s) {
      const style = teams[sc.side].setup.tactics.gkStyle ?? 'classico';
      const pc = 0.09 + (eff(sc.gk, 'jogoPes') - 10) * 0.01 + (style === 'avancado' ? 0.05 : style === 'construtor' ? 0.02 : 0);
      return { next: (1 - s) as Side, counter: r() < pc };
    }
    return { next: (1 - s) as Side, counter: false };
  }

  // ---- Máquina de estados: o jogo avança uma posse de cada vez (permite o modo ao vivo) ----
  const first: Side = r() < 0.5 ? 0 : 1;
  const plan: { p: number; len: number; start: Side }[] = [
    { p: 1, len: HALF, start: first },
    { p: 2, len: HALF, start: (1 - first) as Side },
  ];
  let stage = -1;
  let side: Side = first;
  let counter = false;
  let extraTime = false;
  let penalties: [number, number] | undefined;
  let finished = false;
  let lastPossession: Possession | null = null;
  const timeoutRequest: [boolean, boolean] = [false, false];
  const flyingOverride: [boolean | null, boolean | null] = [null, null];

  function beginPeriod(i: number) {
    const pl = plan[i];
    period = pl.p;
    periodStart = clock;
    periodLen = pl.len;
    side = pl.start;
    counter = false;
    const label = pl.p === 1 ? 'Início da 1.ª parte' : pl.p === 2 ? 'Início da 2.ª parte' : `Início da ${pl.p - 2}.ª parte do prolongamento`;
    log(pl.p >= 3 ? 'prolongamento' : 'inicio', label);
  }

  function endPeriod() {
    log('fim_parte', `Fim do período. ${home.shortName} ${score[0]}-${score[1]} ${away.shortName}`);
    for (const s of [0, 1] as Side[]) {
      if (teams[s].flying) removeFlying(s);
      for (const l of teams[s].players) l.energy = Math.min(100, l.energy + (period === 1 ? 25 : 8));
    }
  }

  function manualTimeout(s: Side) {
    const t = teams[s];
    const idx = period <= 2 ? period : 2;
    if (period > 2 || t.timeoutUsed[idx]) return false;
    t.timeoutUsed[idx] = true;
    tstats[s].timeouts.push(clock);
    log('time_out', `Desconto de tempo pedido pelo ${sideName(s)}`, s);
    for (const l of t.court) l.energy = Math.min(100, l.energy + 6);
    return true;
  }

  function onePossession() {
    for (const s of [0, 1] as Side[]) {
      const t = teams[s];
      if (t.shortCount && clock >= t.shortUntil) {
        t.shortCount = 0;
        completeTeam(s);
      }
      flyingDecision(s);
      rotate(s);
      if (timeoutRequest[s]) {
        timeoutRequest[s] = false;
        manualTimeout(s);
      } else if (opts.manual !== s) maybeTimeout(s);
    }
    const before = score[0] + score[1];
    const evBefore = events.length;
    const start = clock;
    const att = side;
    const wasCounter = counter;
    actions = [];
    const holders = [teams[0], teams[1]].map((t) => [t.gk?.p.id ?? null, ...t.court.map((l) => l.p.id)]) as [(string | null)[], (string | null)[]];
    const res = possession(side, counter);
    side = res.next;
    counter = res.counter;
    if (score[0] + score[1] > before) {
      const last = events.filter((e) => e.type === 'golo').pop()!;
      side = (1 - (last.side as number)) as Side;
      counter = false;
    }
    lastPossession = { side: att, start, end: clock, counter: wasCounter, events: events.slice(evBefore), actions, onCourt: holders, flying: [teams[0].flying, teams[1].flying] };
  }

  function finish() {
    log('fim_jogo', `Fim do jogo: ${home.shortName} ${score[0]}-${score[1]} ${away.shortName}${penalties ? ` (${penalties[0]}-${penalties[1]} nos penáltis)` : ''}`);
    // Notas dos jogadores (1 a 10)
    for (const t of teams) {
      const sd = teams.indexOf(t) as Side;
      const won = score[sd] > score[1 - sd] ? 0.3 : score[sd] < score[1 - sd] ? -0.3 : 0;
      for (const l of t.players) {
        const st = pstats[l.p.id];
        if (st.minutes < 30) { st.rating = 0; continue; }
        let rt = 6.2 + won + st.goals * 0.9 + st.assists * 0.5 + st.tackles * 0.08 - st.fouls * 0.08 - st.yellow * 0.3 - (st.red ? 1.5 : 0);
        if (l.p.position === 'GR') rt += st.saves * 0.18 - conceded[l.p.id] * 0.35;
        rt += (r() - 0.5) * 0.6;
        st.rating = Math.round(Math.max(3, Math.min(10, rt)) * 10) / 10;
      }
    }
    finished = true;
  }

  /** Avança uma posse (ou uma mudança de período). Devolve false quando o jogo terminou. */
  function step(): boolean {
    if (finished) return false;
    lastPossession = null;
    if (stage < 0) {
      stage = 0;
      beginPeriod(0);
      return true;
    }
    if (clock < periodStart + periodLen - 0.001) {
      for (const sd of [0, 1] as const) if (teams[sd].setup.ai && opts.manual !== sd) aiTacticalAdjust(sd);
      onePossession();
      return true;
    }
    endPeriod();
    stage++;
    if (stage === 2 && opts.knockout && !opts.noExtraTime && score[0] === score[1]) {
      extraTime = true;
      plan.push({ p: 3, len: opts.extraTimeLen ?? ET, start: first }, { p: 4, len: opts.extraTimeLen ?? ET, start: (1 - first) as Side });
    }
    if (stage < plan.length) {
      beginPeriod(stage);
      return true;
    }
    if (opts.knockout && score[0] === score[1]) penalties = shootout();
    finish();
    return false;
  }

  function shootout(): [number, number] {
    period = 5;
    log('desempate', 'Desempate por pontapés da marca de grande penalidade');
    const pk: [number, number] = [0, 0];
    const takers = teams.map((t) =>
      t.players.filter((l) => !l.sentOff).sort((a, b) => eff(b, 'finalizacao') + eff(b, 'compostura') - eff(a, 'finalizacao') - eff(a, 'compostura'))
    );
    // equipas com o mesmo número de marcadores
    const n = Math.min(takers[0].length, takers[1].length);
    const keepers = teams.map((t) => t.players.filter((l) => l.p.position === 'GR' && !l.sentOff)[0]);
    let i = 0;
    const kick = (s: Side) => {
      const l = takers[s][i % n];
      const gk = keepers[1 - s];
      const gkQ = gk ? (gk.p.attrs.reflexos + gk.p.attrs.umParaUm) / 2 : 5;
      const p = Math.max(0.5, Math.min(0.92, 0.76 + (l.p.attrs.finalizacao + l.p.attrs.compostura) / 2 * 0.012 - gkQ * 0.01));
      const ok = r() < p;
      if (ok) pk[s]++;
      events.push({ t: clock, period: 5, side: s, type: 'desempate', playerId: l.p.id, text: `${l.p.name} (${sideName(s)}) ${ok ? 'marca' : 'falha'}. ${pk[0]}-${pk[1]}`, score: [score[0], score[1]] });
    };
    // 5 para cada lado
    for (i = 0; i < 5; i++) {
      kick(first);
      if (decided(i, true)) break;
      kick((1 - first) as Side);
      if (decided(i, false)) break;
    }
    // depois, aos pares, até uma equipa marcar mais com o mesmo número de pontapés
    while (pk[0] === pk[1]) {
      kick(first);
      kick((1 - first) as Side);
      i++;
    }
    return pk;

    function decided(round: number, afterFirst: boolean) {
      const taken = [round + 1, afterFirst ? round : round + 1] as number[];
      const takenBy: [number, number] = first === 0 ? [taken[0], taken[1]] : [taken[1], taken[0]];
      const left: [number, number] = [5 - takenBy[0], 5 - takenBy[1]];
      return pk[0] + left[0] < pk[1] || pk[1] + left[1] < pk[0];
    }
  }

  const result = (): MatchResult => ({ score, penalties, extraTime, events, team: tstats, players: pstats, names });

  // Fotografia do momento, para o modo ao vivo
  function snapshot(): LiveSnapshot {
    const fp = period >= 3 ? 2 : period;
    return {
      clock, period, periodStart, periodLen, score: [score[0], score[1]], finished,
      teams: teams.map((t) => ({
        gk: t.gk ? { id: t.gk.p.id, number: t.gk.p.number, name: t.gk.p.name, energy: t.gk.energy, position: t.gk.p.position } : null,
        court: t.court.map((l) => ({ id: l.p.id, number: l.p.number, name: l.p.name, energy: l.energy, position: l.p.position })),
        bench: t.players.filter((l) => !l.onCourt).map((l) => ({ id: l.p.id, number: l.p.number, name: l.p.name, energy: l.energy, position: l.p.position, sentOff: l.sentOff })),
        flying: t.flying,
        fouls: t.fouls[fp] ?? 0,
        timeoutAvailable: period <= 2 && !t.timeoutUsed[period],
        short: clock < t.shortUntil ? t.shortCount : 0,
      })) as [LiveTeam, LiveTeam],
      possession: lastPossession,
    };
  }

  return {
    step,
    result,
    snapshot,
    events,
    stats: tstats,
    players: pstats,
    names,
    /** Substituição manual (volante, ilimitada): sai `outId` (em campo) e entra `inId` (no banco). */
    substitute: (s: Side, outId: string, inId: string): string | null => {
      const t = teams[s];
      const out = t.players.find((l) => l.p.id === outId);
      const inn = t.players.find((l) => l.p.id === inId);
      if (!out || !inn) return 'Jogador não encontrado';
      if (!out.onCourt) return `${out.p.name} não está em campo`;
      if (inn.onCourt) return `${inn.p.name} já está em campo`;
      if (inn.sentOff) return `${inn.p.name} foi expulso`;
      if (t.gk === out) {
        // troca de guarda-redes: entra outro GR (ou um jogador de campo a fazer de GR, se não houver)
        out.onCourt = false;
        inn.onCourt = true;
        t.gk = inn;
      } else {
        if (inn.p.position === 'GR' && !t.flying) return 'Um guarda-redes só entra para o lugar do guarda-redes';
        out.onCourt = false;
        inn.onCourt = true;
        t.court = t.court.map((l) => (l === out ? inn : l));
      }
      t.lastRotation = clock; // a rotação automática (se ligada) espera antes de voltar a mexer
      log('substituicao', `${sideName(s)}: entra ${inn.p.name}, sai ${out.p.name}`, s, inn.p.id);
      return null;
    },
    requestTimeout: (s: Side) => {
      const t = teams[s];
      if (period > 2 || t.timeoutUsed[period]) return false;
      timeoutRequest[s] = true;
      return true;
    },
    /** Palestra: muda a moral de cada jogador durante o jogo (pontos de moral, como em morale.ts). */
    talk: (s: Side, deltas: Record<string, number>) => {
      for (const l of teams[s].players) if (deltas[l.p.id]) l.mor = Math.max(0.9, Math.min(1.1, l.mor + (deltas[l.p.id] / 100) * 0.12));
    },
    /** GR avançado pelo treinador: true = lança já, false = tira, null = volta à instrução tática. */
    setFlying: (s: Side, on: boolean | null) => {
      flyingOverride[s] = on;
      if (on === false) removeFlying(s);
    },
    flyingNow: (s: Side) => teams[s].flying,
  };
}

export interface Action {
  type: 'shot' | 'lost' | 'foul' | 'corner' | 'brawl';
  side: Side; // equipa que ataca nesta ação
  shooter?: string; // rematador / marcador do canto / vítima da falta
  assist?: string;
  other?: string; // quem bloqueia, defende, rouba ou faz a falta
  kind?: 'play' | 'counter' | 'free10' | 'penalty' | 'setpiece' | 'open' | 'rebound';
  caught?: boolean; // defesa: o GR ficou com a bola
  gkRun?: boolean; // remate do próprio GR, depois de sair a jogar
  players?: string[]; // confronto: quem se envolve (os dois primeiros começaram)
  cards?: { id: string; red: boolean }[]; // confronto: castigos da arbitragem
  result?: 'goal' | 'saved' | 'post' | 'wide' | 'blocked';
}

export interface Possession {
  side: Side;
  start: number;
  end: number;
  counter: boolean;
  events: MatchEvent[];
  actions: Action[];
  onCourt: [(string | null)[], (string | null)[]]; // [guarda-redes, jogadores de campo] no início da posse
  flying: [boolean, boolean];
}

export interface LivePlayer {
  id: string;
  number: number | null;
  name: string;
  energy: number;
  position?: string;
  sentOff?: boolean;
}

export interface LiveTeam {
  gk: LivePlayer | null;
  court: LivePlayer[];
  bench: LivePlayer[];
  flying: boolean;
  fouls: number;
  timeoutAvailable: boolean;
  short: number;
}

export interface LiveSnapshot {
  clock: number;
  period: number;
  periodStart: number;
  periodLen: number;
  score: [number, number];
  finished: boolean;
  teams: [LiveTeam, LiveTeam];
  possession: Possession | null;
}

export type LiveMatch = ReturnType<typeof createMatch>;

/** Simula o jogo inteiro de uma vez (jogos dos outros clubes e "saltar para o fim"). */
export function simulateMatch(home: TeamSetup, away: TeamSetup, opts: MatchOptions = {}): MatchResult {
  const m = createMatch(home, away, opts);
  while (m.step());
  return m.result();
}
