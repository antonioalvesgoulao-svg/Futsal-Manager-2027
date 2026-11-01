import { homeNation } from './names';
// Mercado de transferências.
// Regras reais: Regulamento da Liga Placard 2026/27, Art. 52.5 (máx. 20 seniores inscritos; depois do limite, até 5 substituições).
// Estimativas minhas: datas das janelas, comportamento dos clubes (quanto pedem, quando vendem), jogadores livres gerados.
import { generateAttributes, overall, rng } from './attributes';
import { fmtEur, makeContract, marketValue, marketWage, salaryBudget, wageBill } from './contracts';
import { book, financeOf } from './finance';
import type { Club, GameState, Player, Position } from './types';

export const FREE = ''; // clubId dos jogadores livres

export interface Offer { id: string; playerId: string; from: string; fee: number; date: string; kind?: 'venda' | 'emprestimo'; share?: number; years?: number }
export interface MarketState { offers: Offer[]; regs: Record<string, number>; seq: number; lastAi?: string; pool?: number; freeSince?: Record<string, number>; moved?: Record<string, number>; listed?: Record<string, 'venda' | 'emprestimo'>; signed?: Record<string, number> }

export const marketOf = (s: GameState): MarketState => (s.market ??= { offers: [], regs: {}, seq: 0 });

/** Janelas de transferências (estimativa: 1 jul–15 set e janeiro). Jogadores livres podem assinar a qualquer altura. */
export function windowOpen(date: string) {
  const md = date.slice(5);
  return (md >= '07-01' && md <= '09-15') || (md >= '01-01' && md <= '01-31');
}
export const windowLabel = (date: string) => (windowOpen(date) ? 'Janela aberta' : date.slice(5) < '01-01' || date.slice(5) > '09-15' ? 'Janela fechada (abre a 1 de janeiro)' : 'Janela fechada (abre a 1 de julho)');

/** Seniores contam para o limite de 20 (Sub-19 não contam: estimativa por idade). */
export const isSenior = (p: Player) => p.age >= 19;
export const seniors = (s: GameState, clubId: string) => s.players.filter((p) => p.clubId === clubId && isSenior(p)).length;

// ---------- jogadores livres ----------
const NAMES: Record<string, [string[], string[]]> = {
  Brasil: [['Lucas', 'Gabriel', 'Matheus', 'Rafael', 'Thiago', 'Guilherme', 'Felipe', 'Bruno', 'Vinícius', 'Leandro', 'Diego', 'Rodrigo', 'Caio', 'Igor', 'Wellington', 'Douglas', 'Anderson', 'Marcelo'], ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Ferreira', 'Costa', 'Rocha', 'Almeida', 'Nascimento', 'Carvalho', 'Ribeiro', 'Gomes', 'Barbosa', 'Moraes']],
  Espanha: [['Álvaro', 'Sergio', 'Pablo', 'Adrián', 'Javier', 'Daniel', 'Raúl', 'Iván', 'Rubén', 'Marcos', 'Carlos', 'Alberto'], ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'Gómez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Navarro', 'Ortega']],
  Portugal: [['João', 'Tiago', 'Rui', 'Hugo', 'Nuno', 'Ricardo', 'Fábio', 'Diogo', 'André', 'Luís', 'Gonçalo', 'Miguel'], ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Costa', 'Martins', 'Sousa', 'Lopes', 'Gomes', 'Marques', 'Mendes', 'Pinto']],
  Argentina: [['Matías', 'Nicolás', 'Facundo', 'Santiago', 'Lautaro', 'Agustín', 'Federico'], ['González', 'Rodríguez', 'Fernández', 'Romero', 'Acosta', 'Medina', 'Sosa']],
  Itália: [['Luca', 'Marco', 'Andrea', 'Davide', 'Simone', 'Matteo'], ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano']],
  'Cabo Verde': [['Edson', 'Ailton', 'Djô', 'Kevin', 'Stopira', 'Nelson'], ['Tavares', 'Fortes', 'Monteiro', 'Lopes', 'Semedo', 'Varela']],
  Ucrânia: [['Oleksandr', 'Andriy', 'Dmytro', 'Mykola', 'Yevhen'], ['Shevchenko', 'Bondarenko', 'Kovalenko', 'Tkachenko', 'Kravchenko']],
};
const NAT_W: [string, number][] = [['Brasil', 45], ['Portugal', 20], ['Espanha', 12], ['Argentina', 7], ['Cabo Verde', 6], ['Itália', 5], ['Ucrânia', 5]];
const POS_W: [Position, number][] = [['GR', 12], ['FIX', 18], ['FIX/ALA', 10], ['ALA', 30], ['ALA/PIV', 10], ['PIV', 15], ['UNI', 5]];
const pick = <T,>(r: () => number, xs: [T, number][]) => { let v = r() * xs.reduce((a, x) => a + x[1], 0); for (const [x, w] of xs) if ((v -= w) <= 0) return x; return xs[0][0]; };

/** Gera jogadores livres (estrangeiros e portugueses sem clube), níveis à volta dos da Liga. */
export function generateFreeAgents(s: GameState, n: number, seed: string, targetOverall?: number): Player[] {
  const r = rng(`fa-${seed}`);
  const out: Player[] = [];
  for (let i = 0; i < n; i++) {
    const nat = pick(r, NAT_W);
    const [F, L] = NAMES[nat];
    const pos = pick(r, POS_W);
    const age = 20 + Math.floor(r() * 13);
    const base: Player = { id: `fa${seed}${i}`, clubId: FREE, name: `${F[Math.floor(r() * F.length)]} ${L[Math.floor(r() * L.length)]}`, position: pos, number: null, age, nationality: nat, attrs: {} as Player['attrs'], potential: 0 };
    const level = targetOverall ? (targetOverall - 3.5) / 0.11 + (r() - 0.3) * 10 : 52 + r() * 30; // de reforço de equipa pequena a jogador de equipa média-alta
    const g = generateAttributes(base, level, 0);
    out.push({ ...base, attrs: g.attrs, potential: g.potential });
  }
  return out;
}

/** Garante uma bolsa de livres (no início e em cada verão). */
export function ensurePool(s: GameState) {
  const m = marketOf(s);
  if (m.pool === s.season.year) return;
  m.pool = s.season.year;
  // livres há duas épocas ou veteranos (≥33) sem clube deixam o futsal
  const since = (m.freeSince ??= {});
  for (const p of s.players) if (p.clubId === FREE) since[p.id] ??= s.season.year; else delete since[p.id];
  s.players = s.players.filter((p) => p.clubId !== FREE || (p.age < 33 && s.season.year - since[p.id] < 2));
  // no máximo 10 jogadores novos por época (pedido do António); os outros livres são os que acabam contrato
  s.players.push(...generateFreeAgents(s, 10, String(s.season.year)));
}

// ---------- negociação ----------
/** Rivais diretos: negoceiam, mas a preços muito mais altos (estimativa ×3). */
export const RIVALS: [string, string][] = [['scp', 'slb'], ['epz', 'jca']]; // Espanha: dérbi de Múrcia
export const areRivals = (a?: string, b?: string) => !!a && !!b && RIVALS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

/** Importância no plantel (0 = mais importante): minutos jogados, nota média, golos e assistências da época; no início da época conta mais o nível. */
export function importanceRank(s: GameState, p: Player) {
  const squad = s.players.filter((x) => x.clubId === p.clubId);
  const maxMin = Math.max(1, ...squad.map((x) => s.pstats[x.id]?.minutes ?? 0));
  const games = Math.max(0, ...squad.map((x) => s.pstats[x.id]?.games ?? 0));
  const w = Math.min(1, games / 8); // peso das estatísticas cresce com os jogos da época
  const score = (x: Player) => {
    const st = s.pstats[x.id];
    const lvl = overall(x.attrs, x.position) / 20;
    if (!st) return lvl * (1 - w);
    const stat = 0.55 * (st.minutes / maxMin) + 0.25 * Math.max(0, (st.ratingSum / Math.max(1, st.games) - 5.5) / 3) + 0.2 * Math.min(1, (st.goals + st.assists) / Math.max(1, st.games));
    return lvl * (1 - w) + stat * w;
  };
  return [...squad].sort((a, b) => score(b) - score(a)).indexOf(p);
}
export type Tier = 'fundamental' | 'importante' | 'rotação' | 'dispensável';
export const tierOf = (s: GameState, p: Player): Tier => { const r = importanceRank(s, p); return r < 5 ? 'fundamental' : r < 9 ? 'importante' : r < 13 ? 'rotação' : 'dispensável'; };
const TIER_K: Record<Tier, number> = { fundamental: 2.6, importante: 1.7, 'rotação': 1.1, 'dispensável': 0.8 };

/** Quanto o clube pede pelo jogador (estimativa): conforme a importância no plantel, o contrato e a rivalidade; listado para venda pede menos. A cláusula resolve sempre. */
export function askingPrice(s: GameState, p: Player, buyer?: string) {
  const club = s.clubs.find((c) => c.id === p.clubId);
  if (!club) return 0;
  let k = TIER_K[tierOf(s, p)];
  if (marketOf(s).listed?.[p.id] === 'venda') k = Math.min(k, 0.9);
  if (areRivals(club.id, buyer)) k *= 3;
  const yearsLeft = Math.max(0, (p.contract?.until ?? s.season.year) - s.season.year);
  const contractK = yearsLeft <= 0 ? 0.35 : yearsLeft === 1 ? 0.8 : 1;
  return Math.min(p.contract?.clause ?? Infinity, Math.round(marketValue(p, club) * k * contractK / 1000) * 1000);
}

/** Salário que o jogador pede para vir (estimativa): pelo menos o atual +10%; clubes menores que o dele pagam mais. */
export function wageDemand(s: GameState, p: Player, to: Club) {
  const from = s.clubs.find((c) => c.id === p.clubId);
  const base = Math.max(marketWage(p, to), (p.contract?.wage ?? 0) * 1.1);
  const step = from ? Math.max(0, (from.reputation - to.reputation) / 60) : 0;
  return Math.round(base * (1 + step) / 50) * 50;
}

export interface Bid { fee: number; wage: number; years: number }
export type Reply = { ok: boolean; msg: string; counter?: number };

/** O meu clube tenta contratar um jogador (fee 0 para livres). Tudo de uma vez: clube, jogador, direção. */
export function tryBuy(s: GameState, p: Player, bid: Bid): Reply {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  const fin = financeOf(s, my.id);
  const free = p.clubId === FREE;
  if (p.clubId === my.id) return { ok: false, msg: 'Já é teu jogador.' };
  if (p.loan) return { ok: false, msg: `${p.name} está emprestado pelo ${s.clubs.find((c) => c.id === p.loan!.from)?.name}. Só regressa no fim do empréstimo.` };
  if (!free && !windowOpen(s.date)) return { ok: false, msg: `A janela de transferências está fechada. Só podes contratar jogadores livres.` };
  // limite de inscritos (Art. 52.5)
  const m = marketOf(s);
  if (isSenior(p) && seniors(s, my.id) >= 20 && (m.regs[s.season.year] ?? 0) >= 5) return { ok: false, msg: 'Plantel no limite de 20 seniores e já usaste as 5 substituições da época (Art. 52.5). Liberta um jogador primeiro.' };
  if (isSenior(p) && seniors(s, my.id) >= 20) return { ok: false, msg: 'Tens 20 seniores inscritos (limite do Art. 52.5). Dispensa ou vende um jogador para abrir vaga.' };
  // clube vendedor
  if (!free) {
    const ask = askingPrice(s, p, my.id);
    if (bid.fee < (p.contract?.clause ?? Infinity) && bid.fee < ask) return { ok: false, counter: ask, msg: `O ${s.clubs.find((c) => c.id === p.clubId)!.name} recusa${tierOf(s, p) === 'fundamental' ? ` (${p.name} é fundamental para eles)` : ''}${areRivals(p.clubId, my.id) ? ' e não facilita a um rival' : ''}. Pede ${fmtEur(ask)} (cláusula: ${fmtEur(p.contract!.clause)}).` };
    if (bid.fee > fin.balance) return { ok: false, msg: `Não tens dinheiro: saldo ${fmtEur(fin.balance)}.` };
  }
  // jogador
  const want = wageDemand(s, p, my);
  if (bid.wage < want * 0.95) return { ok: false, counter: want, msg: `${p.name} quer pelo menos ${fmtEur(want)}/mês.` };
  if (bid.years > (p.age >= 33 ? 1 : p.age >= 30 ? 2 : 4)) return { ok: false, msg: `${p.name} não aceita contrato tão longo com ${p.age} anos.` };
  // direção: folha salarial até 10% acima do orçamento
  const limit = salaryBudget(my) * 1.1 / 12;
  if (wageBill(s, my.id) + bid.wage > limit) return { ok: false, msg: `A direção não aprova: a folha salarial passaria ${fmtEur(Math.round(limit))}/mês (orçamento + 10%).` };
  // feito
  const fromId = p.clubId;
  if (!free) { book(s, my.id, `Contratação de ${p.name}`, -bid.fee, true); book(s, fromId, `Venda de ${p.name}`, bid.fee, true); }
  if (isSenior(p) && seniors(s, my.id) >= 20) m.regs[s.season.year] = (m.regs[s.season.year] ?? 0) + 1;
  moveTo(s, p, my, bid.wage, bid.years);
  return { ok: true, msg: `${p.name} assinou até 30/06/${p.contract!.until} (${fmtEur(bid.wage)}/mês)${free ? ', a custo zero' : ` por ${fmtEur(bid.fee)}`}.` };
}

function moveTo(s: GameState, p: Player, club: Club, wage: number, years: number) {
  const used = new Set(s.players.filter((x) => x.clubId === club.id).map((x) => x.number));
  if (p.number === null || used.has(p.number)) { let n = 2; while (used.has(n)) n++; p.number = n; }
  p.clubId = club.id;
  p.contract = { ...makeContract(p, club, s.season.year, '-tr'), wage, until: s.season.year + years };
  if (s.tactics) { s.tactics.q1 = s.tactics.q1.filter((id) => id !== p.id); s.tactics.q2 = s.tactics.q2.filter((id) => id !== p.id); }
  delete s.morale?.[p.id];
}

/** Rescisão: o clube paga metade dos salários que faltam (estimativa) e o jogador fica livre. */
export function releaseCost(s: GameState, p: Player) {
  const months = Math.max(0, ((p.contract?.until ?? s.season.year) - s.season.year) * 12 + (12 - monthsInto(s.date)));
  return Math.round((p.contract?.wage ?? 0) * months * 0.5 / 100) * 100;
}
const monthsInto = (d: string) => { const m = Number(d.slice(5, 7)); return m >= 7 ? m - 7 : m + 5; };

export function release(s: GameState, p: Player): string {
  if (p.loan) return `${p.name} está emprestado: não podes rescindir.`;
  const cost = releaseCost(s, p);
  book(s, p.clubId, `Rescisão com ${p.name}`, -cost);
  p.clubId = FREE; p.contract = undefined;
  s.tactics.q1 = s.tactics.q1.filter((id) => id !== p.id); s.tactics.q2 = s.tactics.q2.filter((id) => id !== p.id);
  return `${p.name} rescindiu (custo ${fmtEur(cost)}) e fica livre.`;
}

// ---------- empréstimos ----------
/** Pedir um jogador emprestado (até ao fim da época). O clube só empresta quem não é dos seus 9 melhores. */
export function tryLoanIn(s: GameState, p: Player, share: number, years = 1): Reply {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  if (p.clubId === FREE || p.clubId === my.id || p.loan) return { ok: false, msg: 'Este jogador não pode ser emprestado.' };
  if (!windowOpen(s.date)) return { ok: false, msg: 'A janela de transferências está fechada.' };
  const owner = s.clubs.find((c) => c.id === p.clubId)!;
  const tier = tierOf(s, p);
  if (tier === 'fundamental' || tier === 'importante') return { ok: false, msg: `O ${owner.name} não empresta: ${p.name} é ${tier} para eles.` };
  if (areRivals(owner.id, my.id) && share < 1) return { ok: false, counter: 1, msg: 'Ao rival só emprestam se pagares 100% do salário.' };
  // mais de uma época: só jovens (≤23) ou dispensáveis, e nunca para lá do contrato
  const maxYears = Math.max(1, Math.min((p.contract?.until ?? s.season.year + 1) - s.season.year, p.age <= 23 || tier === 'dispensável' ? 3 : 1));
  if (years > maxYears) return { ok: false, msg: `O ${owner.name} só aceita ${maxYears} época${maxYears > 1 ? 's' : ''} de empréstimo.` };
  const minShare = my.reputation >= owner.reputation ? 0.75 : 0.5;
  if (share < minShare) return { ok: false, counter: minShare, msg: `Querem que pagues pelo menos ${Math.round(minShare * 100)}% do salário (${fmtEur(Math.round((p.contract?.wage ?? 0) * minShare))}/mês).` };
  if (isSenior(p) && seniors(s, my.id) >= 20) return { ok: false, msg: 'Tens 20 seniores inscritos (Art. 52.5).' };
  const limit = salaryBudget(my) * 1.1 / 12;
  if (wageBill(s, my.id) + (p.contract?.wage ?? 0) * share > limit) return { ok: false, msg: 'A direção não aprova: passa o orçamento salarial +10%.' };
  doLoan(s, p, my.id, share, years);
  return { ok: true, msg: `${p.name} chega por empréstimo até 30/06/${p.loan!.until} (pagas ${Math.round(share * 100)}% do salário).` };
}

function doLoan(s: GameState, p: Player, to: string, share: number, years: number) {
  p.loan = { from: p.clubId, until: s.season.year + years, share };
  p.clubId = to;
  delete marketOf(s).listed?.[p.id];
  const used = new Set(s.players.filter((x) => x.clubId === to && x !== p).map((x) => x.number));
  if (p.number === null || used.has(p.number)) { let n = 2; while (used.has(n)) n++; p.number = n; }
  s.tactics.q1 = s.tactics.q1.filter((id) => id !== p.id); s.tactics.q2 = s.tactics.q2.filter((id) => id !== p.id);
}

/** Pôr um jogador meu na lista de transferências ou de empréstimos (os clubes fazem propostas). */
export function setListed(s: GameState, p: Player, kind: 'venda' | 'emprestimo' | null) {
  const l = (marketOf(s).listed ??= {});
  if (kind) l[p.id] = kind; else delete l[p.id];
}

/** Fim da época: empréstimos acabam e os jogadores voltam ao clube dono. */
export function endLoans(s: GameState, endingYear: number): string[] {
  const out: string[] = [];
  for (const p of s.players) if (p.loan && p.loan.until <= endingYear) {
    if (p.loan.from === s.clubId || p.clubId === s.clubId) out.push(`${p.name} terminou o empréstimo e volta ao ${s.clubs.find((c) => c.id === p.loan!.from)!.name}.`);
    p.clubId = p.loan.from; delete p.loan;
  }
  s.tactics.q1 = s.tactics.q1.filter((id) => s.players.some((p) => p.id === id && p.clubId === s.clubId));
  s.tactics.q2 = s.tactics.q2.filter((id) => s.players.some((p) => p.id === id && p.clubId === s.clubId));
  return out;
}

// ---------- propostas recebidas ----------
export function acceptOffer(s: GameState, o: Offer): string {
  const m = marketOf(s);
  m.offers = m.offers.filter((x) => x.id !== o.id);
  const p = s.players.find((x) => x.id === o.playerId);
  const buyer = s.clubs.find((c) => c.id === o.from)!;
  if (!p || p.clubId !== s.clubId) return 'A proposta já não é válida.';
  if (o.kind === 'emprestimo') {
    doLoan(s, p, buyer.id, o.share ?? 0.5, o.years ?? 1);
    m.offers = m.offers.filter((x) => x.playerId !== p.id);
    return `${p.name} emprestado ao ${buyer.name} até 30/06/${p.loan!.until} (pagam ${Math.round((o.share ?? 0.5) * 100)}% do salário).`;
  }
  delete m.listed?.[p.id];
  book(s, s.clubId, `Venda de ${p.name} ao ${buyer.name}`, o.fee, true);
  book(s, buyer.id, `Contratação de ${p.name}`, -o.fee, true);
  moveTo(s, p, buyer, wageDemand(s, { ...p, clubId: s.clubId }, buyer), p.age >= 30 ? 2 : 3);
  return `${p.name} vendido ao ${buyer.name} por ${fmtEur(o.fee)}.`;
}
export function rejectOffer(s: GameState, o: Offer) { const m = marketOf(s); m.offers = m.offers.filter((x) => x.id !== o.id); }

// ---------- clubes do computador ----------
const ROLE: Record<string, Position[]> = { GR: ['GR'], FIX: ['FIX', 'FIX/ALA', 'UNI'], ALA: ['ALA', 'FIX/ALA', 'ALA/PIV', 'UNI'], PIV: ['PIV', 'ALA/PIV'] };
const ROLE_MIN: Record<string, number> = { GR: 2, FIX: 3, ALA: 4, PIV: 2 };
export interface Need { kind: 'posição' | 'qualidade' | 'oportunidade' | 'plantel'; role?: string; min: number }
const fitsNeed = (n: Need, p: Player) => !n.role || ROLE[n.role].includes(p.position);

/** De que precisa a equipa? null = está servida. */
export function teamNeed(s: GameState, clubId: string): Need | null {
  const squad = s.players.filter((p) => p.clubId === clubId && !(s.injuries?.[p.id] && s.injuries[p.id].days > 90));
  const ov = (p: Player) => overall(p.attrs, p.position);
  const lv = squad.map(ov).sort((a, b) => b - a);
  const starters = (lv[0] + lv[1] + lv[2] + lv[3] + lv[4]) / 5 || 10;
  for (const role of ['GR', 'PIV', 'FIX', 'ALA']) {
    const inRole = squad.filter((p) => ROLE[role].includes(p.position)).sort((a, b) => ov(b) - ov(a));
    if (inRole.length < ROLE_MIN[role]) return { kind: 'posição', role, min: starters - 3 };
    if (ov(inRole[0]) < starters - 2.5) return { kind: 'qualidade', role, min: ov(inRole[0]) + 1 };
  }
  if (squad.length < 15) return { kind: 'plantel', min: (lv[11] ?? lv[lv.length - 1] ?? 8) };
  // sucessão: titular veterano (≥32) sem alternativa à altura na mesma posição
  const top5 = [...squad].sort((a, b) => ov(b) - ov(a)).slice(0, 5);
  for (const v of top5.filter((p) => p.age >= 32)) {
    const role = Object.keys(ROLE).find((k) => ROLE[k].includes(v.position))!;
    if (!squad.some((p) => p !== v && p.age < 29 && ROLE[role].includes(p.position) && ov(p) >= ov(v) - 1.5)) return { kind: 'qualidade', role, min: ov(v) - 1.5 };
  }
  return { kind: 'oportunidade', min: (lv[4] ?? 10) + 0.3 };
}


/** Corre a cada avanço: clubes da IA contratam livres para tapar buracos e, na janela, fazem propostas pelos meus jogadores. */
export function aiMarket(s: GameState, from: string, to: string): string[] {
  const news: string[] = [];
  const m = marketOf(s);
  ensurePool(s);
  const r = rng(`ai-${from}-${to}`);
  const days = Math.max(1, Math.round((Date.parse(to) - Date.parse(from)) / 864e5));
  for (const c of s.clubs) {
    if (c.id === s.clubId) continue;
    const squad = s.players.filter((p) => p.clubId === c.id);
    const gks = squad.filter((p) => p.position === 'GR').length;
    // 1) plantel curto ou sem 2 GR: contrata o melhor livre que caiba no orçamento
    if (squad.length < 16 || gks < 2) {
      const pool = s.players.filter((p) => p.clubId === FREE && (gks < 2 ? p.position === 'GR' : true))
        .sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position));
      const room = salaryBudget(c) * 1.05 / 12 - wageBill(s, c.id);
      const p = pool.find((x) => marketWage(x, c) <= Math.max(room, 600));
      if (p) { moveTo(s, p, c, marketWage(p, c), p.age >= 30 ? 1 : 2); news.push(`Mercado: ${p.name} (livre) assina pelo ${c.name}.`); const sg = (m.signed ??= {}); sg[`${c.id}@${s.season.year}`] = (sg[`${c.id}@${s.season.year}`] ?? 0) + 1; }
    }
    // 2) na janela: reforços só quando a equipa precisa (pedido do António):
    //    - falta de jogadores numa posição (2 GR, 3 fixos, 4 alas, 2 pivôs) ou plantel curto
    //    - posição fraca: o melhor dessa posição bem abaixo do nível dos titulares
    //    - oportunidade clara: alguém pagável que entraria no 5 inicial
    //    Compra a qualquer clube (também mais prestigiados ou rivais) se pagar o preço pedido; senão livres ou estrangeiro.
    const signed = (m.signed ??= {});
    const key = `${c.id}@${s.season.year}`;
    // vários dias passam de uma vez (ex.: julho a setembro): uma tentativa por cada ~10 dias
    for (let attempt = 0; attempt < Math.ceil(days / 10); attempt++) {
    const squad = s.players.filter((p) => p.clubId === c.id);
    if (!windowOpen(to) || r() > 0.7) continue;
    const need = teamNeed(s, c.id);
    if (!need) continue;
    {
      const fin = financeOf(s, c.id);
      const levels = squad.map((p) => overall(p.attrs, p.position)).sort((a, b) => b - a);
      const bar = levels[Math.min(levels.length - 1, c.wealth >= 70 ? 7 : 9)] ?? 0; // tem de entrar nos 8 (grandes) ou 10 melhores
      const worst = [...squad].filter((p) => !p.loan).sort((a, b) => overall(a.attrs, a.position) - overall(b.attrs, b.position))[0];
      // espaço salarial: o pior do plantel pode sair para abrir vaga
      // espaço salarial: o que sobra do orçamento +10%; no mínimo, trocar o pior do plantel por alguém que ganhe até +500 €/mês
      const worst2 = [...squad].filter((p) => !p.loan).sort((a, b) => overall(a.attrs, a.position) - overall(b.attrs, b.position)).slice(0, 2);
      // os dois piores podem sair para abrir espaço (rescisão ou venda)
      const room = Math.max(salaryBudget(c) * 1.1 / 12 - wageBill(s, c.id) + (squad.length >= 15 ? worst2.reduce((a, p) => a + (p.contract?.wage ?? 0), 0) : 0), (worst?.contract?.wage ?? 0) + 500);
      const moved = (m.moved ??= {});
      const t = s.players.filter((p) => p.clubId !== c.id && p.clubId !== s.clubId && !p.clubId.includes('@') && !p.loan && moved[p.id] !== s.season.year && fitsNeed(need, p) && overall(p.attrs, p.position) > Math.max(bar, need.min))
        .map((p) => ({ p, ask: p.clubId === FREE ? 0 : askingPrice(s, p, c.id) }))
        .filter((x) => (x.ask === 0 || x.ask <= fin.balance) && wageDemand(s, x.p, c) <= room)
        .filter((x) => !areRivals(x.p.clubId, c.id) || rng(`riv-${c.id}-${s.season.year}`)() < 0.12) // negócio entre rivais: raro (≈1 em 8 épocas por clube), além de caro
        // melhor relação qualidade/preço, com algum acaso (cada clube tem os seus alvos)
        .sort((a, b) => overall(b.p.attrs, b.p.position) / Math.sqrt(b.ask + 8000) * (0.85 + r() * 0.3) - overall(a.p.attrs, a.p.position) / Math.sqrt(a.ask + 8000) * (0.85 + r() * 0.3))[0];
      if (t) {
        const seller = s.clubs.find((x) => x.id === t.p.clubId);
        if (seller) { book(s, c.id, `Contratação de ${t.p.name}`, -t.ask, true); book(s, seller.id, `Venda de ${t.p.name}`, t.ask, true); }
        moveTo(s, t.p, c, wageDemand(s, t.p, c), t.p.age >= 30 ? 2 : 3);
        moved[t.p.id] = s.season.year;
        signed[key] = (signed[key] ?? 0) + 1;
        news.push(seller ? `Mercado: ${t.p.name} troca o ${seller.name} pelo ${c.name} (${fmtEur(t.ask)})${areRivals(seller.id, c.id) ? ', transferência entre rivais' : ''}.` : `Mercado: ${t.p.name} (livre) assina pelo ${c.name}.`);
        // plantel cheio: o pior sai (fica livre, com acordo de rescisão)
        for (const w of worst2.slice(0, 1)) if ((s.players.filter((p) => p.clubId === c.id).length > 17 || wageBill(s, c.id) > salaryBudget(c) * 1.2 / 12) && w !== t.p) { book(s, c.id, `Rescisão com ${w.name}`, -Math.round(releaseCost(s, w) * 0.3)); w.clubId = FREE; w.contract = undefined; }
      } else if (r() < (need.kind === 'oportunidade' ? 0.06 : 0.75)) { // oportunidades no estrangeiro são raras; necessidades resolvem-se
        // sem alvo em Portugal: contrata no estrangeiro (Brasil, Espanha…), até haver ligas estrangeiras no jogo (etapa 12)
        const lvl = need.kind === 'oportunidade' ? need.min : (levels[Math.min(levels.length - 1, 8)] ?? 10);
        const cand = generateFreeAgents(s, 16, `ext-${c.id}-${to}-${attempt}`, Math.max(lvl, need.min + 0.5)).map((p) => ({ ...p, id: p.id.replace('fa', 'ex') }))
          .filter((p) => p.nationality !== homeNation(c) && fitsNeed(need, p) && overall(p.attrs, p.position) > Math.max(lvl - 1, need.min));
        const p = cand.sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position))[0];
        if (p) {
          // clubes pequenos trazem jogadores baratos (fim de contrato, divisões inferiores): custo baixo (estimativa)
          const fee = Math.round(marketValue(p, c) * (c.wealth >= 70 ? 0.8 : 0.25) / 1000) * 1000;
          if (fee <= fin.balance && wageDemand(s, p, c) <= room) {
            s.players.push(p);
            book(s, c.id, `Contratação de ${p.name} (estrangeiro)`, -fee, true);
            moveTo(s, p, c, wageDemand(s, p, c), 3);
            moved[p.id] = s.season.year;
            signed[key] = (signed[key] ?? 0) + 1;
            news.push(`Mercado: o ${c.name} contrata ${p.name} (${p.nationality}, ${p.position}, ${p.age} anos) por ${fmtEur(fee)}.`);
            for (const w of worst2.slice(0, 1)) if (s.players.filter((x) => x.clubId === c.id).length > 17 || wageBill(s, c.id) > salaryBudget(c) * 1.2 / 12) { book(s, c.id, `Rescisão com ${w.name}`, -Math.round(releaseCost(s, w) * 0.3)); w.clubId = FREE; w.contract = undefined; }
          }
        }
      }
    }
    }
    // 3) no início da época os grandes emprestam jovens que não jogariam (≤21 anos, fora dos 12 mais importantes) a clubes mais pequenos, 1 ou 2 épocas
    if (from.slice(5) >= '07-01' && from.slice(5) <= '08-31' && c.wealth >= 70) {
      for (const y of squad.filter((p) => p.age <= 21 && !p.loan && p.position !== 'GR' && importanceRank(s, p) >= 12)) {
        const dest = s.clubs.filter((x) => x.id !== c.id && x.id !== s.clubId && x.reputation < c.reputation && s.players.filter((p) => p.clubId === x.id).length < 19)
          .sort(() => r() - 0.5)[0];
        if (!dest || r() > 0.5) continue;
        doLoan(s, y, dest.id, 0.5, r() < 0.3 ? 2 : 1);
        news.push(`Mercado: ${y.name} emprestado pelo ${c.name} ao ${dest.name} até 30/06/${y.loan!.until}.`);
      }
    }
    // 4) propostas pelos meus jogadores
    if (windowOpen(to)) {
      const fin = financeOf(s, c.id);
      const my = s.clubs.find((x) => x.id === s.clubId)!;
      const ranked = squad.map((p) => overall(p.attrs, p.position)).sort((a, b) => b - a);
      const placeIn = (p: Player) => ranked.filter((v) => v > overall(p.attrs, p.position)).length; // lugar que teria no plantel deles
      const listed = m.listed ?? {};
      for (const p of s.players.filter((x) => x.clubId === s.clubId && !x.loan)) {
        if (m.offers.some((o) => o.playerId === p.id && o.from === c.id) || m.offers.filter((o) => o.playerId === p.id).length >= 3) continue;
        const kind = listed[p.id];
        if (kind === 'emprestimo') {
          // empréstimo: clubes onde ele jogaria (top 10) propõem; mais épocas para jovens
          if (placeIn(p) < 10 && r() < days / 70) {
            const share = [0.5, 0.75, 1][Math.floor(r() * 3)];
            const years = Math.min(p.age <= 23 && r() < 0.4 ? 2 : 1, Math.max(1, (p.contract?.until ?? s.season.year + 1) - s.season.year));
            m.offers.push({ id: `of${++m.seq}`, playerId: p.id, from: c.id, fee: 0, date: to, kind: 'emprestimo', share, years });
            news.push(`Proposta de empréstimo do ${c.name} por ${p.name} (${years} época${years > 1 ? 's' : ''}, pagam ${share * 100}% do salário). Responde no Mercado.`);
          }
          continue;
        }
        // venda: se estiver na lista, mais clubes interessados e preços normais; se não, só quem o quer como titular e paga para convencer
        const want = kind === 'venda' ? placeIn(p) < 12 && r() < days / 70 : placeIn(p) < 5 && r() < days / 25 * (c.wealth / 100) * 0.4 * (areRivals(c.id, s.clubId) ? 0.3 : 1);
        if (!want) continue;
        const base = kind === 'venda' ? marketValue(p, my) * (0.7 + r() * 0.5) : askingPrice(s, p, c.id) * (0.55 + r() * 0.55);
        const fee = Math.min(p.contract?.clause ?? Infinity, Math.round(base / 1000) * 1000);
        if (fee > fin.balance + salaryBudget(c) * 0.15) continue;
        m.offers.push({ id: `of${++m.seq}`, playerId: p.id, from: c.id, fee, date: to, kind: 'venda' });
        news.push(`Proposta do ${c.name} por ${p.name}: ${fmtEur(fee)}${areRivals(c.id, my.id) ? ' (do rival!)' : ''}. Responde no Mercado.`);
      }
    }
  }
  // propostas caducam ao fim de 14 dias ou quando a janela fecha
  m.offers = m.offers.filter((o) => windowOpen(to) && (Date.parse(to) - Date.parse(o.date)) / 864e5 <= 14);
  return news;
}
