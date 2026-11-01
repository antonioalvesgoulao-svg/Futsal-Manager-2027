// Carreira e mercado de staff (estimativas ao estilo FM; não há dados públicos sobre despedimentos no futsal):
// - objetivos da direção conforme o clube; confiança 0-100 que sobe e desce com os resultados; despedimento abaixo de 15
// - clubes do computador despedem o treinador quando ficam muito abaixo do esperado e vão buscar outro ao mercado
// - propostas de emprego ao treinador (tu) quando um clube maior fica sem treinador e a tua reputação chega
// - contratos do staff: acabam no fim da época; os clubes renovam ou não; técnicos de outros clubes podem ser contratados
import { rng } from './attributes';
import { leagueTable } from './season/season';
import { fmtEur, salaryBudget } from './contracts';
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
  vacancies?: Record<string, string>;
  interim?: Record<string, string>; // clube sem treinador -> adjunto que assume interinamente
  contract?: { clubId: string; wage: number; until: number }; // o meu contrato
  savings?: number; // indemnizações recebidas (pessoal) // clube sem treinador -> data até à qual espera candidatos
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
/** Títulos nacionais (Liga, Taça, Taça da Liga, Supertaça) antes do jogo começar: ordem de grandeza (estimativa). */
const PAST_TITLES: Record<string, number> = { scp: 60, slb: 35, scb: 4, fun: 1 };
/** Palmarés do clube: história + títulos ganhos no jogo. */
export const palmaresOf = (s: GameState, clubId: string) => (PAST_TITLES[clubId] ?? 0) + s.honours.filter((h) => h.winner === clubId).length;
/**
 * Exigência da direção (multiplica o efeito de cada ponto acima/abaixo do esperado), pedido do António:
 * reputação, riqueza, palmarés (cultura de vitória), objetivo da época e dinheiro gasto em transferências nesta época.
 */
export function demandOf(s: GameState, c: Club) {
  const palm = Math.min(1, palmaresOf(s, c.id) / 30);
  const obj = objectiveOf(s, c.id).pos;
  const spent = financeOf(s, c.id).spentSeason ?? 0;
  const spendK = Math.min(0.3, spent / Math.max(1, salaryBudget(c)) * 1.5); // gastar 20% do orçamento anual em reforços = +0,3
  return 0.6 + c.reputation / 100 * 0.35 + c.wealth / 100 * 0.2 + palm * 0.3 + (obj <= 2 ? 0.2 : obj <= 4 ? 0.1 : 0) + spendK;
}

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
    b.conf = Math.max(0, Math.min(100, b.conf + (pts - exp) * 1.8 * demandOf(s, club) * (1 + importance * 0.5) + (60 - b.conf) * 0.03));
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

const monthIdx = (d: string) => { const m = Number(d.slice(5, 7)); return m >= 7 ? m - 7 : m + 5; };

/** Salário de um treinador principal (€/mês brutos, estimativa): cresce com a reputação e a riqueza do clube. */
export const coachWage = (rep: number, club: Club) => Math.max(800, Math.round(600 * Math.exp(rep * 0.03) * (0.4 + club.wealth / 100) / 50) * 50);
/** O máximo que a direção paga ao treinador (estimativa). */
/** Garante o meu contrato (jogos novos e gravações antigas): 2 épocas ao salário de mercado. */
export function ensureMyContract(s: GameState) {
  const c = careerOf(s);
  const club = s.clubs.find((x) => x.id === s.clubId);
  if (club && (!c.contract || c.contract.clubId !== club.id)) c.contract = { clubId: club.id, wage: coachWage(c.reputation, club), until: s.season.year + 2 };
}
/** Salário mensal do treinador principal de um clube (o meu contrato, ou estimativa para a IA). */
export function headCoachWage(s: GameState, club: Club) {
  if (club.id === s.clubId) return careerOf(s).contract?.wage ?? 0;
  const co = s.coaches.find((x) => x.clubId === club.id);
  return co ? coachWage(co.tactical * 5, club) : 0;
}
export const coachMaxPay = (s: GameState, club: Club) => coachWage(Math.min(club.reputation, careerOf(s).reputation + 15), club);

function sackMe(s: GameState): string[] {
  const c = careerOf(s);
  const old = s.clubs.find((x) => x.id === s.clubId)!;
  c.reputation = Math.max(1, c.reputation - 6);
  c.unemployed = true; c.offers = [];
  // indemnização: metade dos salários que faltavam do contrato (estimativa), paga pelo clube
  const k = c.contract;
  const months = k ? Math.max(0, (k.until - s.season.year) * 12 + (12 - monthIdx(s.date))) : 0;
  const comp = k ? Math.round(k.wage * months * 0.5 / 100) * 100 : 0;
  if (comp) { book(s, old.id, 'Indemnização ao treinador despedido', -comp); c.savings = (c.savings ?? 0) + comp; }
  c.contract = undefined;
  s.clubId = NO_CLUB;
  openVacancy(s, old.id);
  return [`A direção do ${old.name} despediu-te${comp ? ` (indemnização ${fmtEur(comp)})` : ''}. ${interimOf(s, old.id)!.name.replace(' (interino)', '')} assume a equipa interinamente. Estás sem clube: vê as vagas na Carreira e candidata-te.`];
}

/** Clube sem treinador: espera 2-4 semanas por candidatos (podes candidatar-te), depois contrata do mercado. */
function openVacancy(s: GameState, clubId: string) {
  const c = careerOf(s);
  const days = 14 + Math.floor(rng(`vac-${clubId}-${s.date}`)() * 15);
  const d = new Date(s.date); d.setDate(d.getDate() + days);
  (c.vacancies ??= {})[clubId] = d.toISOString().slice(0, 10);
  const b = boardOf(s, clubId); b.conf = 60; b.exp = 0; b.pts = 0; b.games = 0; b.coachSince = s.date;
  // treinador interino: o melhor adjunto que ficou no clube (se não houver, fica "interino" sem dados)
  const adj = (s.staff ?? []).filter((x) => x.clubId === clubId && x.role === 'adjunto').sort((a, b) => b.ability - a.ability)[0];
  (c.interim ??= {})[clubId] = adj?.id ?? '';
}
/** Interino de um clube sem treinador: nome e conhecimento tático (adjunto: 0,6×capacidade+4; sem adjunto: 10). */
export function interimOf(s: GameState, clubId: string) {
  const c = careerOf(s);
  if (!c.vacancies?.[clubId]) return null;
  const st = (s.staff ?? []).find((x) => x.id === c.interim?.[clubId] && x.clubId === clubId);
  return st ? { name: `${st.name} (interino)`, tactical: Math.round(st.ability * 0.6 + 4) } : { name: 'Treinador interino', tactical: 10 };
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
      // leva a equipa técnica (70% de cada um aceitar), se couber no orçamento do staff do novo clube (substitui quem lá está na mesma função)
      const went: string[] = [];
      for (const st of (s.staff ?? []).filter((x) => x.clubId === from.id && x.role !== 'formacao')) {
        if (r() > 0.7) continue;
        const cur = (s.staff ?? []).filter((x) => x.clubId === cid && x.role === st.role).sort((a, b) => a.ability - b.ability)[0];
        if (staffBill(s, cid) - (cur?.wage ?? 0) + st.wage > staffBudget(club)) continue;
        if (cur) cur.clubId = null;
        st.clubId = cid; went.push(st.name);
      }
      if (went.length) out.push(`${best.name} leva consigo: ${went.join(', ')}.`);
      fillVacantRoles(s, from);
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
    const msg = `O ${club.name} despediu ${old?.name ?? 'o treinador'} (confiança da direção ${Math.round(b.conf)}: ${b.pts} pontos em ${b.games} jogos, esperados ${b.exp.toFixed(0)}).`;
    openVacancy(s, club.id);
    out.push(`${msg} ${interimOf(s, club.id)!.name.replace(' (interino)', '')} assume a equipa interinamente; o lugar está vago.`);
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

export interface Question { id: string; q: string; options: string[]; score: number[] } // pontuação 0-10 de cada resposta, conforme o clube

/** Perfil do clube para a entrevista (calculado dos dados: plantel, palmarés, reputação, riqueza, formação). */
export function clubProfile(s: GameState, clubId: string) {
  const club = s.clubs.find((x) => x.id === clubId)!;
  const sq = s.players.filter((p) => p.clubId === clubId);
  const n = Math.max(1, sq.length);
  const avgAge = sq.reduce((a, p) => a + p.age, 0) / n;
  const youth = sq.filter((p) => p.age <= 23).length / n;
  const foreign = sq.filter((p) => p.nationality !== 'Portugal').length / n;
  const palm = palmaresOf(s, clubId);
  const winning = palm >= 10 || club.reputation >= 88; // cultura de vitória
  const youthPolicy = youth >= 0.35 || clubId === 'scp'; // aposta em jovens (Sporting: formação reconhecida)
  const spender = (foreign >= 0.3 && club.wealth >= 60) || club.wealth >= 85; // gasta em jogadores feitos, de fora
  const modest = club.wealth < 50;
  return { club, avgAge, youth, foreign, palm, winning, youthPolicy, spender, modest, objective: objectiveOf(s, clubId).pos };
}

/** Perguntas da entrevista: umas fixas, outras conforme a cultura, a filosofia e o plantel do clube. */
export function interviewFor(s: GameState, clubId: string): Question[] {
  const P = clubProfile(s, clubId);
  const objIdx = P.objective <= 2 ? 0 : P.objective <= 4 ? 1 : P.objective <= 8 ? 2 : 3;
  const qs: Question[] = [
    { id: 'obj', q: 'Que objetivo acha realista para esta época?', options: ['Ser campeão', 'Ficar nos 4 primeiros', 'Chegar ao play-off', 'Uma época tranquila'],
      score: [0, 1, 2, 3].map((i) => (i === objIdx ? 10 : i === objIdx - 1 ? 8 : i < objIdx ? 3 : 2)) },
    { id: 'estilo', q: 'Como quer que a equipa jogue?', options: ['Posse de bola e controlo do jogo', 'Pressão alta e muita intensidade', 'Bloco organizado e contra-ataque'],
      score: P.club.reputation >= 85 ? [10, 9, 3] : P.club.reputation >= 70 ? [8, 9, 7] : [5, 7, 10] },
    { id: 'formacao', q: 'Qual o papel dos jovens no seu projeto?', options: ['Aposta forte: lançar jovens do clube', 'Equilíbrio entre jovens e experientes', 'A prioridade é ganhar já'],
      score: P.youthPolicy ? [10, 7, 2] : P.winning ? [4, 9, 8] : [6, 10, 5] },
    { id: 'reforcos', q: 'Que tipo de reforços procura?', options: ['Jogadores experientes e de nome, de ligas fortes', 'Jovens de alta qualidade, com margem', 'Jogadores acessíveis que encaixem na ideia', 'Nenhum: confio no plantel'],
      score: P.spender ? [10, 7, 4, 3] : P.youthPolicy ? [4, 10, 7, 6] : P.modest ? [1, 5, 10, 8] : [6, 8, 8, 5] },
    { id: 'orcamento', q: 'O orçamento atual chega para os objetivos?', options: ['Sim, trabalho com o que há', 'Preciso de mais orçamento para reforços', 'Consigo fazer mais com menos'],
      score: P.spender ? [8, 8, 6] : P.modest ? [9, 1, 10] : [9, 4, 8] },
    { id: 'balneario', q: 'Como gere o balneário?', options: ['Disciplina rígida e regras claras', 'Diálogo e proximidade com os jogadores', 'Dou liberdade e responsabilidade'],
      score: P.winning ? [9, 8, 4] : [7, 9, 6] },
  ];
  if (P.winning) qs.push({ id: 'pressao', q: `O ${P.club.name} vive de títulos (${P.palm} conquistados). Como lida com essa pressão?`, options: ['Aqui ganhar é a única opção', 'Construir um projeto; os títulos virão', 'Prefiro trabalhar sem pressão'], score: [10, 6, 1] });
  if (P.modest) qs.push({ id: 'competir', q: 'Com um orçamento curto, como mantém a equipa competitiva?', options: ['Organização, trabalho e união do grupo', 'Valorizar jovens e vendê-los bem', 'Pedindo reforços à direção'], score: [10, 9, 2] });
  if (P.avgAge >= 28) qs.push({ id: 'veteranos', q: `O plantel é experiente (média de ${P.avgAge.toFixed(1)} anos). Que papel dá aos veteranos?`, options: ['São a base da equipa', 'Renovação gradual, com eles a ajudar os novos', 'Renovar já o plantel'], score: P.winning ? [9, 9, 3] : [6, 10, 5] });
  if (P.youth >= 0.35) qs.push({ id: 'jovensPlantel', q: `O plantel tem muitos jovens (${Math.round(P.youth * 100)}% com 23 anos ou menos). Como os vai gerir?`, options: ['Dar-lhes minutos e paciência', 'Juntar-lhes jogadores experientes', 'Emprestar os que não jogam'], score: [10, 8, 5] });
  if (P.foreign >= 0.35) qs.push({ id: 'estrangeiros', q: `Há muitos jogadores estrangeiros no plantel (${Math.round(P.foreign * 100)}%). O que pensa disso?`, options: ['Contratar os melhores, venham de onde vierem', 'Equilíbrio com jogadores portugueses', 'Dar prioridade aos portugueses'], score: P.spender ? [10, 7, 3] : [6, 9, 7] });
  if (P.club.reputation >= 70) qs.push({ id: 'adeptos', q: 'Os adeptos exigem um futsal atrativo. Concorda?', options: ['Sim: ganhar e jogar bem', 'O resultado vem primeiro', 'O espetáculo é o mais importante'], score: [10, 6, 5] });
  return qs;
}

/** Decisão a partir das notas de cada pergunta (0-10): encaixe 55% + reputação 45%; aceita com ≥55. */
export function interviewDecision(s: GameState, clubId: string, scores: number[]) {
  const club = s.clubs.find((x) => x.id === clubId)!; const c = careerOf(s);
  const fit = scores.reduce((a, b) => a + b, 0) / (scores.length * 10);
  const rep = Math.max(0, Math.min(1, (c.reputation - club.reputation + 30) / 40));
  const total = Math.round(fit * 55 + rep * 45);
  return { ok: total >= 55, score: total, fit: Math.round(fit * 100), note: `Reputação ${Math.round(c.reputation)} (clube ${club.reputation})` };
}

/** Avalia as respostas e decide (avaliação 0-100 ≥ 55). A reputação do treinador face à do clube pesa 45%. */
export function interview(s: GameState, clubId: string, answers: number[]): { ok: boolean; score: number; notes: string[] } {
  const qs = interviewFor(s, clubId); const club = s.clubs.find((x) => x.id === clubId)!; const c = careerOf(s);
  const notes: string[] = []; let sc = 0;
  qs.forEach((q, i) => {
    const v = q.score[answers[i]] ?? 0; sc += v;
    if (v >= 9) notes.push(`✔ ${q.options[answers[i]]}`); else if (v <= 3) notes.push(`✘ ${q.options[answers[i]]}`);
  });
  const fit = sc / (qs.length * 10);
  const rep = Math.max(0, Math.min(1, (c.reputation - club.reputation + 30) / 40));
  const total = fit * 55 + rep * 45;
  notes.push(`Respostas: ${Math.round(fit * 100)}% alinhadas com o clube · Reputação ${Math.round(c.reputation)} (clube ${club.reputation})`);
  return { ok: total >= 55, score: Math.round(total), notes };
}

/** Plano de transição da equipa técnica ao mudar de clube. */
export interface StaffPlan { bring: { id: string; wage: number }[]; keep: string[]; boardFills: boolean; wage?: number; years?: number }

/** Quanto aceita ganhar um técnico para seguir o treinador (até 20% menos; estimativa). */
export const followMin = (st: Staff) => Math.round(st.wage * 0.8 / 50) * 50;

/** Verifica um plano: salários aceites e total dentro do orçamento do staff do novo clube. */
export function checkPlan(s: GameState, clubId: string, plan: StaffPlan) {
  const club = s.clubs.find((x) => x.id === clubId)!;
  const errs: string[] = [];
  let total = 0;
  for (const b of plan.bring) { const st = s.staff!.find((x) => x.id === b.id)!; if (b.wage < followMin(st)) errs.push(`${st.name} não aceita menos de ${fmtEur(followMin(st))}/mês.`); total += b.wage; }
  for (const id of plan.keep) total += s.staff!.find((x) => x.id === id)!.wage;
  const budget = staffBudget(club);
  if (total > budget) errs.push(`Total ${fmtEur(total)}/mês passa o orçamento do staff do ${club.name} (${fmtEur(budget)}/mês).`);
  if (plan.wage !== undefined && plan.wage > coachMaxPay(s, club)) errs.push(`A direção só paga até ${fmtEur(coachMaxPay(s, club))}/mês ao treinador.`);
  return { ok: errs.length === 0, total, budget, errs };
}

/** Assinar por um clube com o plano da equipa técnica. */
export function takeJob(s: GameState, clubId: string, suggest: (squadClub: string) => GameState['tactics'], plan: StaffPlan = { bring: [], keep: (s.staff ?? []).filter((x) => x.clubId === clubId).map((x) => x.id), boardFills: true }): string {
  const c = careerOf(s);
  const old = s.clubs.find((x) => x.id === s.clubId);
  const club = s.clubs.find((x) => x.id === clubId)!;
  const theirs = s.coaches.find((x) => x.clubId === clubId);
  if (theirs) theirs.clubId = null;
  delete c.vacancies?.[clubId];
  const msgs: string[] = [`És o novo treinador do ${club.name}.`];
  // equipa técnica do novo clube que não fica: dispensada (o clube paga metade do que faltava)
  for (const st of (s.staff ?? []).filter((x) => x.clubId === clubId && !plan.keep.includes(x.id))) {
    const fee = Math.round(st.wage * Math.max(1, (st.until - s.season.year) * 12) * 0.5 / 100) * 100;
    book(s, clubId, `Rescisão com ${st.name} (staff)`, -fee); st.clubId = null;
    msgs.push(`${st.name} sai (indemnização ${fmtEur(fee)}).`);
  }
  // a minha equipa técnica que vem comigo
  for (const b of plan.bring) {
    const st = s.staff!.find((x) => x.id === b.id)!;
    st.clubId = clubId; st.wage = b.wage; st.until = Math.max(st.until, s.season.year + 2);
    msgs.push(`${st.name} vem contigo (${fmtEur(b.wage)}/mês).`);
  }
  if (old) {
    openVacancy(s, old.id);
    // o antigo clube preenche as vagas que deixei com técnicos livres
    fillVacantRoles(s, old);
  }
  if (plan.boardFills) { const n = fillVacantRoles(s, club); if (n.length) msgs.push(`A direção contratou: ${n.join(', ')}.`); }
  s.clubId = clubId;
  s.tactics = suggest(clubId);
  s.training = undefined;
  c.offers = []; c.unemployed = false;
  c.contract = { clubId, wage: plan.wage ?? coachWage(c.reputation, club), until: s.season.year + (plan.years ?? 2) };
  msgs.push(`Contrato até 30/06/${c.contract.until}, ${fmtEur(c.contract.wage)}/mês.`);
  const b = boardOf(s, clubId); b.conf = 60; b.exp = 0; b.pts = 0; b.games = 0; b.coachSince = s.date;
  return msgs.join(' ');
}

/** A direção preenche as funções base vagas com técnicos livres, dentro do orçamento do staff. */
export function fillVacantRoles(s: GameState, club: Club): string[] {
  const out: string[] = [];
  for (const role of ['adjunto', 'fisico', 'gr', 'fisio', 'formacao'] as const) {
    if ((s.staff ?? []).some((x) => x.clubId === club.id && x.role === role)) continue;
    const room = staffBudget(club) - staffBill(s, club.id);
    const f = (s.staff ?? []).filter((x) => !x.clubId && x.role === role && staffWage(x.ability, club) <= room).sort((a, b) => b.ability - a.ability)[0];
    if (f) { f.clubId = club.id; f.wage = staffWage(f.ability, club); f.until = s.season.year + 2; out.push(`${f.name} (${f.role})`); }
  }
  return out;
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
  const table = leagueTable(s.season, s.leagues[0].clubIds);
  // treinadores da IA evoluem com o sucesso: pontos acima do esperado, títulos, posição face ao objetivo (estimativa)
  const titles: Record<string, number> = {};
  for (const w of Object.values(s.season.winners)) if (w) titles[w] = (titles[w] ?? 0) + 1;
  for (const co of s.coaches.filter((x) => x.clubId && !x.clubId.includes('@'))) {
    const b = boardOf(s, co.clubId!);
    const pos = table.findIndex((r) => r.club === co.clubId) + 1;
    const perf = b.games ? (b.pts - b.exp) / b.games : 0; // pontos por jogo acima do esperado
    const d = Math.max(-0.8, Math.min(0.8, perf * 1.5 + (titles[co.clubId!] ?? 0) * 0.3 + (objectiveOf(s, co.clubId!).pos - pos) * 0.05 + (r() - 0.5) * 0.3));
    co.tactical = Math.max(5, Math.min(20, Math.round((co.tactical + d) * 10) / 10));
    co.motivation = Math.max(5, Math.min(20, Math.round((co.motivation + d * 0.7) * 10) / 10));
  }
  // o meu contrato: no último ano, a direção renova (2 épocas, +10%) se estiver satisfeita; senão saio
  const k = careerOf(s).contract;
  if (k && k.clubId === s.clubId && k.until <= endingYear) {
    const my = s.clubs.find((x) => x.id === s.clubId)!;
    if (boardOf(s, s.clubId).conf >= 40) { k.until = endingYear + 2; k.wage = Math.min(coachMaxPay(s, my), Math.round(k.wage * 1.1 / 50) * 50); out.push(`A direção renovou o teu contrato até 30/06/${k.until} (${fmtEur(k.wage)}/mês).`); }
    else { out.push('O teu contrato terminou e a direção não renovou. Estás sem clube.'); careerOf(s).unemployed = true; careerOf(s).contract = undefined; const old = s.clubId; s.clubId = NO_CLUB; openVacancy(s, old); }
  }
  for (const cl of s.clubs) financeOf(s, cl.id).spentSeason = 0;
  // direções: balanço da época (posição final face ao objetivo); contagem recomeça
  for (const club of s.clubs) {
    const b = boardOf(s, club.id);
    const pos = table.findIndex((r) => r.club === club.id) + 1;
    b.conf = Math.max(0, Math.min(100, b.conf + (objectiveOf(s, club.id).pos - pos) * 3));
    b.exp = 0; b.pts = 0; b.games = 0;
    if (club.id === s.clubId) { const c = careerOf(s); c.reputation = Math.max(1, Math.min(100, c.reputation + (objectiveOf(s, club.id).pos - pos) * 0.8)); }
  }
  return out;
}
