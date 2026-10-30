// Motor de jogo de futsal: simulação posse a posse com regras oficiais.
import { gauss, overall, rng } from '../attributes';
import type { Player } from '../types';
import type { MatchEvent, MatchOptions, MatchResult, PlayerStats, Side, TeamSetup, TeamStats, EventType } from './types';

const HALF = 1200; // 20 minutos de tempo útil
const ET = 300; // prolongamento: 2 x 5 minutos
const MAX_SQUAD = 14;

type A = Player['attrs'];

interface Live {
  p: Player;
  energy: number; // 0 a 100
  onCourt: boolean;
  sentOff: boolean;
  yellow: number;
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
  fouls: number[]; // faltas acumuladas por período
  timeoutUsed: boolean[];
  conceded: number[]; // segundos dos golos sofridos (para pedir time-out)
}

const fmt = (t: number) => {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export function simulateMatch(home: TeamSetup, away: TeamSetup, opts: MatchOptions = {}): MatchResult {
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
    const called = [...gks.slice(0, 2), ...out.slice(0, MAX_SQUAD - Math.min(2, gks.length))];
    const players: Live[] = called.map((p) => ({ p, energy: 100, onCourt: false, sentOff: false, yellow: 0 }));
    for (const l of players) {
      names[l.p.id] = l.p.name;
      pstats[l.p.id] = { minutes: 0, goals: 0, assists: 0, shots: 0, onTarget: 0, saves: 0, fouls: 0, tackles: 0, yellow: 0, red: false, rating: 6 };
      conceded[l.p.id] = 0;
    }
    const t: TeamState = {
      setup, players, gk: null, court: [], flying: false, shortUntil: 0, shortCount: 0, lastRotation: 0,
      fouls: [0, 0, 0, 0, 0], timeoutUsed: [false, false, false], conceded: [],
    };
    t.gk = players.find((l) => l.p.position === 'GR') ?? null;
    if (t.gk) t.gk.onCourt = true;
    t.court = chooseFour(t);
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

  const eff = (l: Live, k: keyof A) => l.p.attrs[k] * (0.72 + 0.28 * (l.energy / 100));
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
          const drain = l.p.position === 'GR' ? 0.012 : 0.085 * (1.35 - l.p.attrs.resistencia / 25);
          l.energy = Math.max(20, l.energy - drain * dt);
        } else {
          l.energy = Math.min(100, l.energy + 0.11 * dt);
        }
      }
    }
    clock += dt;
  }

  function sideName(s: Side) {
    return teams[s].setup.shortName;
  }

  // Rotação de quintetos (substituições volantes, ilimitadas)
  function rotate(s: Side) {
    const t = teams[s];
    const avgEnergy = t.court.reduce((a, l) => a + l.energy, 0) / Math.max(1, t.court.length);
    const since = clock - t.lastRotation;
    if (since < 90) return;
    if (avgEnergy > 72 && since < 300) return;
    const target = 4 - (clock < t.shortUntil ? t.shortCount : 0) + (t.flying ? 1 : 0);
    const out = t.court;
    const fresh = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== 'GR' && l.energy > 70).length;
    const next = chooseFour(t, fresh >= 4 ? out : out.filter(() => r() < 0.6)).slice(0, Math.max(0, target));
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

  // Guarda-redes avançado
  function flyingDecision(s: Side) {
    const t = teams[s];
    const diff = score[s] - score[1 - s];
    const remaining = periodStart + periodLen - clock;
    let want = false;
    if (t.setup.flyingKeeper === 'sempre') want = true;
    else if (t.setup.flyingKeeper === 'auto') {
      const lastPeriod = period === 2 || period === 4;
      want = lastPeriod && diff < 0 && diff >= -3 && remaining <= (diff === -1 ? 180 : 300);
      // em eliminatórias, a perder no prolongamento: também
      if (opts.knockout && period === 4 && diff < 0 && remaining <= 150) want = true;
    }
    if (want && !t.flying && t.gk) {
      const sub = t.players.filter((l) => !l.onCourt && !l.sentOff && l.p.position !== 'GR').sort((a, b) => eff(b, 'passe') + eff(b, 'decisoes') - eff(a, 'passe') - eff(a, 'decisoes'))[0];
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

  function card(s: Side, l: Live, red: boolean) {
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

  function shot(s: Side, kind: 'jogada' | 'contra' | 'livre10' | 'penalti' | 'canto' | 'baliza_aberta', shooterIn?: Live): void {
    const att = teams[s];
    const def = teams[1 - s];
    const shooter = shooterIn ?? pick(outfield(att), shooterWeight);
    const others = outfield(att).filter((l) => l !== shooter);
    const assist = kind === 'jogada' || kind === 'contra' || kind === 'canto' ? (r() < 0.62 && others.length ? pick(others, (l) => eff(l, 'passe') + eff(l, 'visao')) : undefined) : undefined;
    tstats[s].shots++;
    pstats[shooter.p.id].shots++;

    const finish = kind === 'jogada' || kind === 'canto' ? (eff(shooter, 'finalizacao') * 0.6 + eff(shooter, 'remate') * 0.4) : eff(shooter, 'finalizacao');
    const compo = eff(shooter, 'compostura');
    const defQ = avg(outfield(def), ['desarme', 'posicionamento', 'antecipacao']);
    const gk = def.gk;
    const gkQ = gk ? (eff(gk, 'reflexos') + eff(gk, 'umParaUm') + eff(gk, 'posicionamento') + eff(gk, 'agilidade')) / 4 : 0;

    let pBlock = 0.24 + (defQ - finish) * 0.01;
    let pOn = 0.47 + (finish - 10) * 0.016 + (compo - 10) * 0.006;
    let pGoal = 0.258 + (finish - gkQ) * 0.022;
    if (kind === 'contra') { pBlock *= 0.5; pOn += 0.08; pGoal += 0.1; }
    if (kind === 'livre10') { pBlock = 0; pOn = 0.72 + (finish - 10) * 0.015; pGoal = 0.42 + (finish - gkQ) * 0.025; }
    if (kind === 'penalti') { pBlock = 0; pOn = 0.86 + (compo - 10) * 0.01; pGoal = 0.78 + (finish - gkQ) * 0.02; }
    if (kind === 'canto') { pBlock += 0.05; pOn -= 0.05; }
    if (!gk) { pGoal = kind === 'baliza_aberta' ? 0.85 : 0.75; }
    if (kind === 'baliza_aberta') { pBlock = 0.08; pOn = 0.5 + (eff(shooter, 'remate') - 10) * 0.02; }
    const cl = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
    if (kind === 'jogada' || kind === 'contra' || kind === 'canto') pGoal *= form[s] * pace;
    pBlock = cl(pBlock, 0, 0.45); pOn = cl(pOn, 0.2, 0.95); pGoal = cl(pGoal, 0.06, 0.92);

    const how: Record<string, string> = {
      jogada: '', contra: ' em contra-ataque', livre10: ' no livre direto dos 10 metros', penalti: ' de penálti', canto: ' na sequência de um canto', baliza_aberta: ' para a baliza deserta',
    };

    if (r() < pBlock) {
      const blocker = pick(outfield(def), (l) => eff(l, 'desarme') + eff(l, 'posicionamento'));
      pstats[blocker.p.id].tackles++;
      if (r() < 0.25) corner(s);
      else log('remate_bloqueado', `Remate de ${shooter.p.name} bloqueado por ${blocker.p.name}`, s, shooter.p.id);
      return;
    }
    if (r() > pOn) {
      if (r() < 0.07) log('poste', `${shooter.p.name} acerta no poste!`, s, shooter.p.id);
      else if (kind !== 'jogada') log('remate_fora', `${shooter.p.name} remata ao lado${how[kind]}`, s, shooter.p.id);
      return;
    }
    tstats[s].onTarget++;
    pstats[shooter.p.id].onTarget++;
    if (r() < pGoal) {
      goal(s, shooter, assist, how[kind]);
    } else if (gk) {
      pstats[gk.p.id].saves++;
      if (kind !== 'jogada' || r() < 0.35) log('remate_defendido', `Defesa de ${gk.p.name} a remate de ${shooter.p.name}${kind === 'penalti' ? ' (penálti defendido!)' : kind === 'livre10' ? ' (livre dos 10 m)' : ''}`, s, shooter.p.id);
      if (r() < 0.2) corner(s);
    }
  }

  function corner(s: Side) {
    tstats[s].corners++;
    log('canto', `Canto para o ${sideName(s)}`, s);
    if (r() < 0.32) shot(s, 'canto');
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

    const dogso = r() < 0.008;
    if (dogso) card((1 - s) as Side, fouler, true);
    else if (r() < 0.11 + (eff(fouler, 'agressividade') - 10) * 0.005) card((1 - s) as Side, fouler, false);

    if (r() < 0.03) {
      log('penalti', `Penálti! Falta de ${fouler.p.name} sobre ${victim.p.name}`, s);
      shot(s, 'penalti', best(outfield(att), (l) => eff(l, 'finalizacao') + eff(l, 'compostura')));
    } else if (n >= 6) {
      log('livre_10m', `${n}.ª falta acumulada do ${sideName((1 - s) as Side)} (${fouler.p.name}): livre direto sem barreira`, s);
      shot(s, 'livre10', best(outfield(att), (l) => eff(l, 'finalizacao') + eff(l, 'remate') + eff(l, 'compostura')));
    } else {
      if (n === 5) log('falta', `5.ª falta acumulada do ${sideName((1 - s) as Side)}: a próxima dá livre de 10 metros`, (1 - s) as Side);
      else log('falta', `Falta de ${fouler.p.name} sobre ${victim.p.name}`, (1 - s) as Side, fouler.p.id);
      // livre perto da área: hipótese de remate de bola parada
      if (r() < 0.3) shot(s, 'canto', best(outfield(att), (l) => eff(l, 'bolasParadas') + eff(l, 'remate')));
    }
  }

  // Uma posse de bola
  function possession(s: Side, counter = false): { next: Side; counter: boolean } {
    const att = teams[s];
    const def = teams[1 - s];
    const attQ = avg(outfield(att), ['passe', 'rececao', 'drible', 'decisoes', 'visao']);
    const defQ = avg(outfield(def), ['desarme', 'posicionamento', 'antecipacao', 'concentracao']);
    const press = avg(outfield(def), ['aceleracao', 'resistencia', 'trabalhoEquipa', 'agressividade']);
    const numDiff = numbers(att) - numbers(def) + (att.flying ? 0 : 0);
    let diff = attQ - defQ * 0.85 - press * 0.15 + numDiff * 2.2;
    if (att.flying) diff += 1.5;
    diff += s === 0 ? 2.2 : -0.7; // vantagem de jogar em casa

    const dur = (counter ? 5 + r() * 8 : 12 + r() * 26) / pace;
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

    const pFoul = 0.15 + (avg(outfield(def), ['agressividade']) - 10) * 0.005;
    const pLose = Math.max(0.18, Math.min(0.66, 0.4 - diff * 0.03 - (counter ? 0.15 : 0)));
    const roll = r();
    if (roll < pFoul) {
      foul(s);
      return { next: (1 - s) as Side, counter: false };
    }
    if (roll < pFoul + pLose) {
      const tackler = pick(outfield(def), (l) => eff(l, 'desarme') + eff(l, 'antecipacao'));
      pstats[tackler.p.id].tackles++;
      // 4 segundos (guarda-redes ou reposição): raro
      if (r() < 0.02) log('quatro_segundos', `${sideName(s)} perde a bola por exceder os 4 segundos`, s);
      // perda com guarda-redes avançado: remate à baliza deserta
      if (att.flying && r() < 0.32) {
        shot((1 - s) as Side, 'baliza_aberta', tackler);
        return { next: s, counter: false };
      }
      return { next: (1 - s) as Side, counter: r() < 0.22 };
    }
    shot(s, counter ? 'contra' : 'jogada');
    return { next: (1 - s) as Side, counter: false };
  }

  function playPeriod(p: number, len: number, startSide: Side) {
    period = p;
    periodStart = clock;
    periodLen = len;
    let side: Side = startSide;
    let counter = false;
    const label = p === 1 ? 'Início da 1.ª parte' : p === 2 ? 'Início da 2.ª parte' : `Início da ${p - 2}.ª parte do prolongamento`;
    log(p === 1 ? 'inicio' : p >= 3 ? 'prolongamento' : 'inicio', label);
    while (clock < periodStart + len - 0.001) {
      for (const s of [0, 1] as Side[]) {
        const t = teams[s];
        if (t.shortCount && clock >= t.shortUntil) {
          t.shortCount = 0;
          completeTeam(s);
        }
        flyingDecision(s);
        rotate(s);
        maybeTimeout(s);
      }
      const before = score[0] + score[1];
      const res = possession(side, counter);
      side = res.next;
      counter = res.counter;
      // após golo, reinicia quem sofreu
      if (score[0] + score[1] > before) {
        const last = events.filter((e) => e.type === 'golo').pop()!;
        side = (1 - (last.side as number)) as Side;
        counter = false;
      }
    }
    log('fim_parte', `Fim do período. ${home.shortName} ${score[0]}-${score[1]} ${away.shortName}`);
    for (const s of [0, 1] as Side[]) {
      if (teams[s].flying) removeFlying(s);
      // intervalo: recuperação
      for (const l of teams[s].players) l.energy = Math.min(100, l.energy + (p === 1 ? 25 : 8));
    }
  }

  // Jogo
  const first: Side = r() < 0.5 ? 0 : 1;
  playPeriod(1, HALF, first);
  playPeriod(2, HALF, (1 - first) as Side);
  let extraTime = false;
  let penalties: [number, number] | undefined;
  if (opts.knockout && score[0] === score[1]) {
    extraTime = true;
    playPeriod(3, ET, first);
    playPeriod(4, ET, (1 - first) as Side);
    if (score[0] === score[1]) penalties = shootout();
  }
  log('fim_jogo', `Fim do jogo: ${home.shortName} ${score[0]}-${score[1]} ${away.shortName}${penalties ? ` (${penalties[0]}-${penalties[1]} nos penáltis)` : ''}`);

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

  // Notas dos jogadores (1 a 10)
  for (const t of teams) {
    const side = teams.indexOf(t) as Side;
    const won = score[side] > score[1 - side] ? 0.3 : score[side] < score[1 - side] ? -0.3 : 0;
    for (const l of t.players) {
      const st = pstats[l.p.id];
      if (st.minutes < 30) { st.rating = 0; continue; }
      let rt = 6.2 + won + st.goals * 0.9 + st.assists * 0.5 + st.tackles * 0.08 - st.fouls * 0.08 - st.yellow * 0.3 - (st.red ? 1.5 : 0);
      if (l.p.position === 'GR') rt += st.saves * 0.18 - conceded[l.p.id] * 0.35;
      rt += (r() - 0.5) * 0.6;
      st.rating = Math.round(Math.max(3, Math.min(10, rt)) * 10) / 10;
    }
  }

  return { score, penalties, extraTime, events, team: tstats, players: pstats, names };
}
