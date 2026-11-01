// Mercado de transferências.
// Regras reais: Regulamento da Liga Placard 2026/27, Art. 52.5 (máx. 20 seniores inscritos; depois do limite, até 5 substituições).
// Estimativas minhas: datas das janelas, comportamento dos clubes (quanto pedem, quando vendem), jogadores livres gerados.
import { generateAttributes, overall, rng } from './attributes';
import { fmtEur, makeContract, marketValue, marketWage, salaryBudget, wageBill } from './contracts';
import { book, financeOf } from './finance';
import type { Club, GameState, Player, Position } from './types';

export const FREE = ''; // clubId dos jogadores livres

export interface Offer { id: string; playerId: string; from: string; fee: number; date: string }
export interface MarketState { offers: Offer[]; regs: Record<string, number>; seq: number; lastAi?: string; pool?: number }

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
export function generateFreeAgents(s: GameState, n: number, seed: string): Player[] {
  const r = rng(`fa-${seed}`);
  const out: Player[] = [];
  for (let i = 0; i < n; i++) {
    const nat = pick(r, NAT_W);
    const [F, L] = NAMES[nat];
    const pos = pick(r, POS_W);
    const age = 20 + Math.floor(r() * 13);
    const base: Player = { id: `fa${seed}${i}`, clubId: FREE, name: `${F[Math.floor(r() * F.length)]} ${L[Math.floor(r() * L.length)]}`, position: pos, number: null, age, nationality: nat, attrs: {} as Player['attrs'], potential: 0 };
    const level = 52 + r() * 30; // de reforço de equipa pequena a jogador de equipa média-alta
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
  // livres há mais de uma época e veteranos sem clube saem do futsal
  s.players = s.players.filter((p) => p.clubId !== FREE || p.age < 34);
  const have = s.players.filter((p) => p.clubId === FREE).length;
  if (have < 40) s.players.push(...generateFreeAgents(s, 40 - have, String(s.season.year)));
}

// ---------- negociação ----------
const rankIn = (s: GameState, p: Player) => s.players.filter((x) => x.clubId === p.clubId).sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position)).indexOf(p);

/** Quanto o clube pede pelo jogador (estimativa): titulares e clubes grandes pedem mais; a cláusula resolve sempre. */
export function askingPrice(s: GameState, p: Player) {
  const club = s.clubs.find((c) => c.id === p.clubId);
  if (!club) return 0;
  const rank = rankIn(s, p);
  const k = rank < 5 ? 2.2 : rank < 9 ? 1.6 : 1.15;
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
  if (!free && !windowOpen(s.date)) return { ok: false, msg: `A janela de transferências está fechada. Só podes contratar jogadores livres.` };
  // limite de inscritos (Art. 52.5)
  const m = marketOf(s);
  if (isSenior(p) && seniors(s, my.id) >= 20 && (m.regs[s.season.year] ?? 0) >= 5) return { ok: false, msg: 'Plantel no limite de 20 seniores e já usaste as 5 substituições da época (Art. 52.5). Liberta um jogador primeiro.' };
  if (isSenior(p) && seniors(s, my.id) >= 20) return { ok: false, msg: 'Tens 20 seniores inscritos (limite do Art. 52.5). Dispensa ou vende um jogador para abrir vaga.' };
  // clube vendedor
  if (!free) {
    const ask = askingPrice(s, p);
    if (bid.fee < (p.contract?.clause ?? Infinity) && bid.fee < ask) return { ok: false, counter: ask, msg: `O ${s.clubs.find((c) => c.id === p.clubId)!.name} recusa. Pede ${fmtEur(ask)} (cláusula: ${fmtEur(p.contract!.clause)}).` };
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
  const cost = releaseCost(s, p);
  book(s, p.clubId, `Rescisão com ${p.name}`, -cost);
  p.clubId = FREE; p.contract = undefined;
  s.tactics.q1 = s.tactics.q1.filter((id) => id !== p.id); s.tactics.q2 = s.tactics.q2.filter((id) => id !== p.id);
  return `${p.name} rescindiu (custo ${fmtEur(cost)}) e fica livre.`;
}

// ---------- propostas recebidas ----------
export function acceptOffer(s: GameState, o: Offer): string {
  const m = marketOf(s);
  m.offers = m.offers.filter((x) => x.id !== o.id);
  const p = s.players.find((x) => x.id === o.playerId);
  const buyer = s.clubs.find((c) => c.id === o.from)!;
  if (!p || p.clubId !== s.clubId) return 'A proposta já não é válida.';
  book(s, s.clubId, `Venda de ${p.name} ao ${buyer.name}`, o.fee, true);
  book(s, buyer.id, `Contratação de ${p.name}`, -o.fee, true);
  moveTo(s, p, buyer, wageDemand(s, { ...p, clubId: s.clubId }, buyer), p.age >= 30 ? 2 : 3);
  return `${p.name} vendido ao ${buyer.name} por ${fmtEur(o.fee)}.`;
}
export function rejectOffer(s: GameState, o: Offer) { const m = marketOf(s); m.offers = m.offers.filter((x) => x.id !== o.id); }

// ---------- clubes do computador ----------
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
      if (p) { moveTo(s, p, c, marketWage(p, c), p.age >= 30 ? 1 : 2); if (r() < 0.5) news.push(`Mercado: ${p.name} (livre) assina pelo ${c.name}.`); }
    }
    // 2) na janela: proposta por um jogador meu que seria titular lá (≈ 1 por clube a cada ~2 meses)
    if (windowOpen(to) && r() < days / 25 * (c.wealth / 100)) {
      const worstStarter = squad.map((p) => overall(p.attrs, p.position)).sort((a, b) => b - a)[4] ?? 0;
      const fin = financeOf(s, c.id);
      const target = s.players.filter((p) => p.clubId === s.clubId && overall(p.attrs, p.position) > worstStarter + 0.5)
        .sort(() => r() - 0.5).find((p) => askingPrice(s, p) * 0.8 <= fin.balance + salaryBudget(c) * 0.15);
      if (target && !m.offers.some((o) => o.playerId === target.id && o.from === c.id)) {
        const my = s.clubs.find((x) => x.id === s.clubId)!;
        const fee = Math.min(target.contract?.clause ?? Infinity, Math.round(marketValue(target, my) * (0.9 + r() * 0.8) / 1000) * 1000);
        m.offers.push({ id: `of${++m.seq}`, playerId: target.id, from: c.id, fee, date: to });
        news.push(`Proposta do ${c.name} por ${target.name}: ${fmtEur(fee)}. Responde no Mercado.`);
      }
    }
  }
  // propostas caducam ao fim de 14 dias ou quando a janela fecha
  m.offers = m.offers.filter((o) => windowOpen(to) && (Date.parse(to) - Date.parse(o.date)) / 864e5 <= 14);
  return news;
}
