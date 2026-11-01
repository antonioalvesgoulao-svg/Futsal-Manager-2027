// Carreira e mercado de staff (estimativas ao estilo FM; não há dados públicos sobre despedimentos no futsal):
// - objetivos da direção conforme o clube; confiança 0-100 que sobe e desce com os resultados; despedimento abaixo de 15
// - clubes do computador despedem o treinador quando ficam muito abaixo do esperado e vão buscar outro ao mercado
// - propostas de emprego ao treinador (tu) quando um clube maior fica sem treinador e a tua reputação chega
// - contratos do staff: acabam no fim da época; os clubes renovam ou não; técnicos de outros clubes podem ser contratados
import { rng } from './attributes';
import { leagueTable } from './season/season';
import { fmtEur } from './contracts';
import { book, financeOf } from './finance';
import { staffBill, staffBudget, staffWage, type Staff } from './staff';
import type { Club, Coach, GameState } from './types';

/** clubId do treinador desempregado (diferente do '' dos jogadores livres) */
export const NO_CLUB = '_semclube';
export interface Board { conf: number; exp: number; pts: number; games: number; coachSince: string }
export interface Career {
  reputation: number; // reputação do treinador 1-100
  offers: { clubId: string; date: string }[];
  unemployed?: boolean; // sem clube: o jogo avança e podes candidatar-te
  applied?: Record<string, string>; // clube -> data da última candidatura (uma por mês)
  vacancies?: Record<string, string>; // clube sem treinador -> data até à qual espera candidatos
  sackedSeason?: Record<string, number>;
  history: { season: string; clubId: string; pos?: number; titles: string[] }[];
  confidence?: number; // (antigo)
}
export const careerOf = (s: GameState): Career => (s.career ??= { reputation: 35, offers: [], history: [] });
export const boardOf = (s: GameState, clubId: string): Board => ((s.boards ??= {})[clubId] ??= { conf: 60, exp: 0, pts: 0, games: 0, coachSince: s.date });

/** Posição esperada na Liga: ordem do nível dos clubes (estimativa da direção). */
export function expectedPos(s: GameState, clubId: string) {
  return [...s.clubs].sort((a, b) => b.level - a.level).findIndex((c) => c.id === clubId) + 1;
}
export function objectiveOf(s: GameState, clubId: string) {
  const e = expectedPos(s, clubId);
  return e <= 2 ? { text: 'Ser campeão e ganhar troféus', pos: 2 } : e <= 4 ? { text: 'Ficar nos 4 primeiros', pos: 4 } : e <= 8 ? { text: 'Chegar ao play-off (8 primeiros)', pos: 8 } : { text: 'Fazer uma época tranquila (fora dos 2 últimos)', pos: 10 };
}

/**
 * Pontos esperados num jogo (algoritmo da direção, estimativa): diferença de nível entre as equipas + vantagem de jogar em casa.
 * Assim, perder com quem é mais forte quase não tira confiança; perder com quem é mais fraco tira muito.
 */
export function expectedPoints(home: Club, away: Club, side: 0 | 1, neutral = false) {
  const d = ((side === 0 ? home.level - away.level : away.level - home.level) + (neutral ? 0 : side === 0 ? 3 : -3)) / 9;
  const pDraw = 0.135, pWin = (1 - pDraw) / (1 + Math.exp(-d));
  return 3 * pWin + pDraw;
}
/** Paciência da direção: clubes grandes e ricos exigem mais (reagem mais a cada ponto perdido). */
const demand = (c: Club) => 0.7 + c.reputation / 100 * 0.5 + c.wealth / 100 * 0.3;

/** Depois de cada jogo, para os dois clubes: confiança = pontos conseguidos vs esperados, pesados pela exigência do clube. */
export function boardAfterMatch(s: GameState, home: Club, away: Club, score: [number, number], pens: [number, number] | undefined, importance: number, neutral = false) {
  for (const side of [0, 1] as const) {
    const club = side === 0 ? home : away;
    const b = boardOf(s, club.id);
    const [gf, ga] = side === 0 ? score : [score[1], score[0]];
    const won = gf > ga || (gf === ga && pens && (side === 0 ? pens[0] > pens[1] : pens[1] > pens[0]));
    const pts = won ? 3 : gf === ga && !pens ? 1 : 0;
    const exp = expectedPoints(home, away, side, neutral);
    b.pts += pts; b.exp += exp; b.games++;
    // cada ponto acima/abaixo do esperado vale ~3 de confiança (×exigência ×importância); volta devagar a 60
    b.conf = Math.max(0, Math.min(100, b.conf + (pts - exp) * 1.8 * demand(club) * (1 + importance * 0.5) + (60 - b.conf) * 0.03));
  }
}

/** Segurança no cargo, como no FM. */
export function securityOf(conf: number) {
  return conf >= 75 ? 'Muito seguro' : conf >= 55 ? 'Seguro' : conf >= 40 ? 'Estável' : conf >= 25 ? 'Em risco' : 'Muito em risco';
}
const SACK_AT = 24; // abaixo disto, e com pelo menos 10 jogos, a direção despede
const MIN_GAMES = 10;

export function onTitle(s: GameState, clubId: string, comp: string) {
  const w = comp === 'liga' ? 30 : comp === 'taca' ? 18 : comp === 'tacaLiga' ? 12 : 6;
  const b = boardOf(s, clubId); b.conf = Math.min(100, b.conf + w);
  if (clubId === s.clubId) { const c = careerOf(s); c.reputation = Math.min(100, c.reputation + w / 3); }
}

/** Reputação do treinador (tu) depois de cada jogo. */
export function afterMyMatch(s: GameState, won: boolean, lost: boolean) {
  const c = careerOf(s); const my = s.clubs.find((x) => x.id === s.clubId);
  if (!my) return [];
  c.reputation = Math.max(1, Math.min(100, c.reputation + (won ? 0.12 : lost ? -0.08 : 0) * (my.reputation / 70)));
  const b = boardOf(s, s.clubId);
  if (b.conf < SACK_AT && b.games >= MIN_GAMES) return sackMe(s);
  return [];
}

function sackMe(s: GameState): string[] {
  const c = careerOf(s);
  const old = s.clubs.find((x) => x.id === s.clubId)!;
  c.reputation = Math.max(1, c.reputation - 6);
  c.unemployed = true; c.offers = [];
  s.clubId = NO_CLUB;
  openVacancy(s, old.id);
  return [`A direção do ${old.name} despediu-te. Estás sem clube: vê as vagas na Carreira e candidata-te.`];
}

/** Clube sem treinador: espera 2-4 semanas por candidatos (podes candidatar-te), depois contrata do mercado. */
function openVacancy(s: GameState, clubId: string) {
  const c = careerOf(s);
  const days = 14 + Math.floor(rng(`vac-${clubId}-${s.date}`)() * 15);
  const d = new Date(s.date); d.setDate(d.getDate() + days);
  (c.vacancies ??= {})[clubId] = d.toISOString().slice(0, 10);
  const b = boardOf(s, clubId); b.conf = 60; b.exp = 0; b.pts = 0; b.games = 0; b.coachSince = s.date;
}

/** Treinadores livres: o real que saiu do meu clube + alguns fictícios. */
export function ensureCoachPool(s: GameState) {
  if (s.coaches.filter((x) => !x.clubId).length >= 6) return;
  const r = rng(`coachpool-${s.season.year}-${s.coaches.length}`);
  const F = ['Rui', 'Paulo', 'Jorge', 'Ricardo', 'Hugo', 'Sérgio', 'Pedro', 'Vítor', 'Marco', 'Luís'];
  const L = ['Pereira', 'Costa', 'Martins', 'Sousa', 'Fonseca', 'Rocha', 'Teixeira', 'Lopes', 'Matos', 'Gaspar'];
  for (let i = s.coaches.filter((x) => !x.clubId).length; i < 6; i++) {
    s.coaches.push({ id: `cf-${s.season.year}-${s.coaches.length}`, name: `${F[Math.floor(r() * F.length)]} ${L[Math.floor(r() * L.length)]}`, clubId: null, tactical: 9 + Math.round(r() * 6), motivation: 9 + Math.round(r() * 6), discipline: 10 + Math.round(r() * 5), youth: 8 + Math.round(r() * 8), style: {} });
  }
}

/** Todos os dias de jogo: a direção de cada clube da IA decide; vagas fechadas contratam do mercado. */
export function aiCoachChanges(s: GameState): string[] {
  const out: string[] = [];
  const c = careerOf(s);
  c.offers = c.offers.filter((o) => (Date.parse(s.date) - Date.parse(o.date)) / 864e5 <= 21);
  ensureCoachPool(s);
  // vagas que já esperaram o suficiente
  for (const [cid, until] of Object.entries(c.vacancies ?? {})) {
    if (s.date < until || cid === s.clubId) continue;
    delete c.vacancies![cid];
    const club = s.clubs.find((x) => x.id === cid)!;
    if (s.coaches.some((x) => x.clubId === cid)) continue;
    // candidatos: livres e treinadores de clubes mais pequenos (que aceitam subir); estes deixam vaga no clube de onde saem
    const r = rng(`hire-${cid}-${s.date}`);
    // treinadores de outros clubes: aceitam mais facilmente subir de clube; vir de um clube maior é raro; quem está seguro no cargo resiste mais
    const employed = s.coaches.filter((x) => x.clubId && x.clubId !== s.clubId && !x.clubId.includes('@') && !careerOf(s).vacancies?.[x.clubId]);
    const freeBest = s.coaches.filter((x) => !x.clubId && x.id !== ((s as any).lastSacked ?? {})[cid]).sort((a, b) => b.tactical - a.tactical)[0];
    const target = [...employed].filter((x) => x.tactical > (freeBest?.tactical ?? 0) + 1).sort((a, b) => b.tactical - a.tactical)[0];
    const fromC = target ? s.clubs.find((k) => k.id === target.clubId)! : undefined;
    const accept = fromC ? (fromC.reputation <= club.reputation - 5 ? 0.6 : fromC.reputation < club.reputation + 5 ? 0.3 : 0.12) * (boardOf(s, fromC.id).conf >= 75 ? 0.5 : 1) : 0;
    if (target && fromC && r() < accept) {
      const from = fromC;
      const best = target;
      best.clubId = cid;
      out.push(`${best.name} deixa o ${from.name} e é o novo treinador do ${club.name}.`);
      openVacancy(s, from.id);
      out.push(`O ${from.name} fica sem treinador.`);
    } else { const n = hireCoachFor(s, club); if (n) out.push(`${n.name} é o novo treinador do ${club.name}.`); }
  }
  // propostas para mim: clubes sem treinador ou fartos do treinador atual (confiança < 25)
  const myRep = c.reputation;
  for (const club of s.clubs) {
    if (club.id === s.clubId || c.offers.some((o) => o.clubId === club.id)) continue;
    const vacant = !!c.vacancies?.[club.id];
    const fedUp = boardOf(s, club.id).conf < 32 && boardOf(s, club.id).games >= 6;
    if (!vacant && !fedUp) continue;
    const my = s.clubs.find((x) => x.id === s.clubId);
    if (my && club.reputation <= my.reputation) continue; // empregado: só interessam clubes maiores
    if (myRep + 25 < club.reputation) continue; // reputação curta para este clube
    if (rng(`myoffer-${club.id}-${s.date}`)() < (c.unemployed ? 0.25 : 0.1)) {
      c.offers.push({ clubId: club.id, date: s.date });
      out.push(`Proposta: o ${club.name} quer-te como treinador${vacant ? '' : ' (a direção está farta do treinador atual)'}. Vê na Carreira.`);
    }
  }
  for (const club of s.clubs) {
    if (club.id === s.clubId || c.vacancies?.[club.id]) continue;
    const b = boardOf(s, club.id);
    if (b.games < MIN_GAMES || b.conf >= SACK_AT) continue;
    const old = s.coaches.find((x) => x.clubId === club.id);
    if (old) old.clubId = null;
    if (old) (s as GameState & { lastSacked?: Record<string, string> }).lastSacked = { ...((s as any).lastSacked ?? {}), [club.id]: old.id };
    out.push(`O ${club.name} despediu ${old?.name ?? 'o treinador'} (confiança da direção ${Math.round(b.conf)}: ${b.pts} pontos em ${b.games} jogos, esperados ${b.exp.toFixed(0)}). O lugar está vago.`);
    openVacancy(s, club.id);
  }
  return out;
}

function hireCoachFor(s: GameState, club: Club): Coach | undefined {
  const last = ((s as any).lastSacked ?? {})[club.id];
  const free = s.coaches.filter((x) => !x.clubId && x.id !== last).sort((a, b) => b.tactical + b.motivation - a.tactical - a.motivation);
  const pick = free.find((x) => x.tactical <= 10 + club.reputation / 10) ?? free[free.length - 1];
  if (pick) pick.clubId = club.id;
  return pick;
}

// ---------- candidaturas e entrevista ----------
/** Posso candidatar-me? Clube sem treinador, ou cujo treinador está em risco (confiança < 40). */
export function canApply(s: GameState, clubId: string) {
  if (clubId === s.clubId) return { ok: false, why: 'É o teu clube.' };
  const c = careerOf(s);
  if (c.vacancies?.[clubId]) return { ok: true, why: 'Sem treinador' };
  const conf = boardOf(s, clubId).conf;
  if (conf < 40) return { ok: true, why: `Treinador ${securityOf(conf).toLowerCase()}` };
  return { ok: false, why: 'O treinador está seguro no cargo' };
}

export interface Question { q: string; options: string[] }
/** Perguntas da entrevista (iguais para todos os clubes; o que conta é o que cada clube valoriza). */
export const INTERVIEW: Question[] = [
  { q: 'Que objetivo acha realista para esta época?', options: ['Ser campeão', 'Ficar nos 4 primeiros', 'Chegar ao play-off', 'Uma época tranquila'] },
  { q: 'Como quer que a equipa jogue?', options: ['Posse de bola e controlo do jogo', 'Pressão alta e muita intensidade', 'Bloco organizado e contra-ataque'] },
  { q: 'Qual o papel da formação no seu projeto?', options: ['Aposta forte: lançar jovens do clube', 'Equilíbrio entre jovens e experientes', 'A prioridade é ganhar já'] },
  { q: 'O orçamento atual chega para os objetivos?', options: ['Sim, trabalho com o que há', 'Preciso de reforços (mais orçamento)', 'Consigo fazer mais com menos'] },
];

/** Valores do clube (estimativa a partir dos dados: reputação, riqueza, qualidade da formação). */
export function clubValues(s: GameState, clubId: string) {
  const club = s.clubs.find((x) => x.id === clubId)!;
  const obj = objectiveOf(s, clubId).pos;
  return {
    objective: obj <= 2 ? 0 : obj <= 4 ? 1 : obj <= 8 ? 2 : 3,
    style: club.reputation >= 85 ? [0, 1] : club.reputation >= 70 ? [0, 1, 2] : [2, 1],
    youth: club.id === 'scp' || club.wealth >= 70 ? 1 : club.reputation < 65 ? 0 : 1, // grandes querem equilíbrio; pequenos vivem da formação
    budget: club.wealth >= 85 ? 1 : 0, // ricos aceitam pedidos de reforço; pequenos querem contas certas
  };
}

/** Avalia as respostas (0-100) e decide. A reputação do treinador face à do clube conta tanto como a entrevista. */
export function interview(s: GameState, clubId: string, answers: number[]): { ok: boolean; score: number; notes: string[] } {
  const v = clubValues(s, clubId); const club = s.clubs.find((x) => x.id === clubId)!; const c = careerOf(s);
  const notes: string[] = []; let sc = 0;
  const dObj = answers[0] - v.objective;
  if (dObj === 0) { sc += 30; notes.push('Objetivo alinhado com o da direção.'); }
  else if (dObj === -1) { sc += 22; notes.push('Ambicioso: a direção gostou.'); }
  else if (dObj < -1) { sc += 8; notes.push('Objetivo pouco realista para o plantel.'); }
  else { sc += 5; notes.push('A direção esperava mais ambição.'); }
  if (v.style.includes(answers[1])) { sc += 25; notes.push('O estilo de jogo encaixa na identidade do clube.'); } else { sc += 8; notes.push('O estilo de jogo não é o que o clube procura.'); }
  const dy = Math.abs(answers[2] - v.youth);
  sc += dy === 0 ? 25 : dy === 1 ? 14 : 3; notes.push(dy === 0 ? 'Visão da formação igual à do clube.' : dy === 1 ? 'Visão da formação aceitável.' : 'Visão da formação contrária à do clube.');
  if (answers[3] === 0 || answers[3] === 2) { sc += v.budget === 0 ? 20 : 15; notes.push('Aceita as condições financeiras.'); }
  else { sc += v.budget === 1 ? 14 : 2; notes.push(v.budget === 1 ? 'Pedido de reforços compreensível.' : 'O clube não pode aumentar o orçamento.'); }
  // reputação: até 25 pontos abaixo da do clube ainda é possível com uma boa entrevista
  const rep = Math.max(0, Math.min(1, (c.reputation - club.reputation + 30) / 40));
  const total = sc * 0.55 + rep * 45;
  notes.push(`Reputação: ${Math.round(c.reputation)} (o clube tem ${club.reputation}).`);
  return { ok: total >= 55, score: Math.round(total), notes };
}

/** Assinar por um clube (proposta aceite, entrevista bem sucedida ou depois de despedido). */
export function takeJob(s: GameState, clubId: string, suggest: (squadClub: string) => GameState['tactics']): string {
  const c = careerOf(s);
  const old = s.clubs.find((x) => x.id === s.clubId);
  const club = s.clubs.find((x) => x.id === clubId)!;
  const theirs = s.coaches.find((x) => x.clubId === clubId);
  if (theirs) theirs.clubId = null;
  delete c.vacancies?.[clubId];
  if (old) openVacancy(s, old.id);
  s.clubId = clubId;
  s.tactics = suggest(clubId);
  s.training = undefined;
  c.offers = []; c.unemployed = false;
  const b = boardOf(s, clubId); b.conf = 60; b.exp = 0; b.pts = 0; b.games = 0; b.coachSince = s.date;
  return `És o novo treinador do ${club.name}.`;
}

// ---------- mercado de staff ----------
/** Indemnização para tirar um técnico a outro clube: metade do que falta do contrato (mín. 3 meses). */
export const poachFee = (s: GameState, st: Staff) => Math.round(st.wage * Math.max(3, (st.until - s.season.year) * 12) * 0.5 / 100) * 100;

/** Contratar um técnico de outro clube (paga indemnização; ele aceita se o clube não for muito menor ou se ganhar mais). */
export function poachStaff(s: GameState, st: Staff, wage: number): string {
  const my = s.clubs.find((x) => x.id === s.clubId)!;
  const from = s.clubs.find((x) => x.id === st.clubId);
  if (!from) return 'Este técnico não tem clube: contrata-o na lista de livres.';
  const want = Math.round(st.wage * (1.1 + Math.max(0, (from.reputation - my.reputation) / 100)) / 50) * 50;
  if (wage < want) return `${st.name} pede pelo menos ${fmtEur(want)}/mês para sair do ${from.name}.`;
  const fee = poachFee(s, st);
  if (financeOf(s, my.id).balance < fee) return `Não tens saldo para a indemnização de ${fmtEur(fee)}.`;
  if (staffBill(s, my.id) + wage > staffBudget(my)) return `A direção não aprova: o staff passaria o orçamento de ${fmtEur(staffBudget(my))}/mês.`;
  book(s, my.id, `Indemnização ao ${from.name} por ${st.name}`, -fee); book(s, from.id, `Saída de ${st.name}`, fee);
  st.clubId = my.id; st.wage = wage; st.until = s.season.year + 2;
  // o clube de origem vai buscar alguém ao mercado
  const repl = s.staff!.filter((x) => !x.clubId && x.role === st.role).sort((a, b) => b.ability - a.ability)[0];
  if (repl) { repl.clubId = from.id; repl.wage = staffWage(repl.ability, from); repl.until = s.season.year + 2; }
  return `${st.name} deixa o ${from.name} e junta-se ao teu staff (${fmtEur(wage)}/mês; indemnização ${fmtEur(fee)}).`;
}

/** O que o técnico pede para renovar/rever o contrato (estimativa): o valor de mercado para o clube, mais se for muito bom. */
export function staffDemand(s: GameState, st: Staff) {
  const my = s.clubs.find((x) => x.id === s.clubId)!;
  const market = staffWage(st.ability, my);
  return { wage: Math.round(Math.max(market, st.wage * (st.until <= s.season.year + 1 ? 1.05 : 0.9)) / 50) * 50, maxYears: st.age >= 60 ? 1 : st.age >= 55 ? 2 : 3 };
}
/** Proposta de contrato a um técnico meu (renovar, subir ou baixar o salário). Baixar só é aceite com mais anos de contrato. */
export function negotiateStaff(s: GameState, st: Staff, wage: number, years: number): { ok: boolean; msg: string; counter?: number } {
  const my = s.clubs.find((x) => x.id === s.clubId)!;
  const d = staffDemand(s, st);
  if (years > d.maxYears) return { ok: false, msg: `${st.name} só aceita até ${d.maxYears} ano(s).` };
  // aceitar menos do que pede: só trocando por segurança (mais anos), até -15%
  const floor = d.wage * (years >= 3 ? 0.85 : years === 2 ? 0.92 : 1);
  if (wage < floor) return { ok: false, counter: Math.ceil(floor / 50) * 50, msg: `${st.name} recusa. Pede pelo menos ${fmtEur(Math.ceil(floor / 50) * 50)}/mês por ${years} ano(s).` };
  if (staffBill(s, my.id) - st.wage + wage > staffBudget(my)) return { ok: false, msg: `A direção não aprova: o staff passaria o orçamento de ${fmtEur(staffBudget(my))}/mês.` };
  st.wage = wage; st.until = s.season.year + years;
  return { ok: true, msg: `${st.name}: contrato até 30/06/${st.until}, ${fmtEur(wage)}/mês.` };
}

/** Fim da época: contratos do staff que acabam. Os clubes da IA renovam os melhores (70%); os meus saem se não renovei. Livres envelhecem e alguns reformam-se. */
export function staffSeasonEnd(s: GameState, endingYear: number): string[] {
  const out: string[] = [];
  const r = rng(`staffend-${endingYear}`);
  for (const st of s.staff ?? []) {
    st.age++;
    if (!st.clubId || st.until > endingYear) continue;
    if (st.clubId === s.clubId) { out.push(`${st.name} (${st.role}) terminou contrato e saiu.`); st.clubId = null; continue; }
    if (r() < 0.7) st.until = endingYear + 1 + Math.floor(r() * 2);
    else st.clubId = null;
  }
  s.staff = (s.staff ?? []).filter((x) => x.clubId || x.age < 67);
  // as vagas dos clubes da IA preenchem-se com livres
  for (const c of s.clubs) {
    if (c.id === s.clubId) continue;
    for (const role of ['adjunto', 'fisico', 'gr', 'fisio', 'formacao'] as const) {
      if (s.staff.some((x) => x.clubId === c.id && x.role === role)) continue;
      const f = s.staff.filter((x) => !x.clubId && x.role === role).sort((a, b) => b.ability - a.ability).find((x) => staffWage(x.ability, c) <= staffBudget(c) / 4);
      if (f) { f.clubId = c.id; f.wage = staffWage(f.ability, c); f.until = endingYear + 2; }
    }
  }
  // direções: balanço da época (posição final face ao objetivo); contagem recomeça
  const table = leagueTable(s.season, s.leagues[0].clubIds);
  for (const club of s.clubs) {
    const b = boardOf(s, club.id);
    const pos = table.findIndex((r) => r.club === club.id) + 1;
    b.conf = Math.max(0, Math.min(100, b.conf + (objectiveOf(s, club.id).pos - pos) * 3));
    b.exp = 0; b.pts = 0; b.games = 0;
    if (club.id === s.clubId) { const c = careerOf(s); c.reputation = Math.max(1, Math.min(100, c.reputation + (objectiveOf(s, club.id).pos - pos) * 0.8)); }
  }
  return out;
}
