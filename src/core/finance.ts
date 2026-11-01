// Finanças do futsal de cada clube. O futsal em Portugal vive sobretudo da verba do clube (e do futebol, nos ecléticos):
// o orçamento anual (salaryBudget) é transferido em 12 prestações e paga os salários; somam-se bilheteira, prémios e transferências.
// Estimativas minhas: preço médio do bilhete, prémios por competição, verba inicial para transferências.
import { attendance } from './attendance';
import { salaryBudget, wageBill } from './contracts';
import type { Fixture } from './season/types';
import type { GameState } from './types';

export interface Ledger { date: string; text: string; amount: number }
export interface ClubFinance { balance: number; transferBudget: number; ledger: Ledger[]; month?: string }

/** Preço médio do bilhete (€, estimativa): jogos grandes e fases finais mais caros. */
export function ticketPrice(s: GameState, f: Fixture) {
  const h = s.clubs.find((c) => c.id === f.home)!;
  let p = h.reputation >= 90 ? 8 : h.reputation >= 70 ? 5 : 3;
  if (/Final/.test(f.stage)) p *= 2; else if (/Meias/.test(f.stage) || f.comp === 'playoff') p *= 1.4;
  return p;
}

/** Prémios por título (€, estimativa: a FPF não publica valores para o futsal). */
export const PRIZES: Record<string, number> = { liga: 60000, taca: 30000, tacaLiga: 20000, supertaca: 10000 };

export function financeOf(s: GameState, clubId: string): ClubFinance {
  const all = (s.finance ??= {});
  if (!all[clubId]) {
    const c = s.clubs.find((x) => x.id === clubId)!;
    // verba para transferências no início: ~10% do orçamento (estimativa)
    const tb = Math.round(salaryBudget(c) * 0.1 / 1000) * 1000;
    all[clubId] = { balance: tb, transferBudget: tb, ledger: [] };
  }
  return all[clubId];
}

export function book(s: GameState, clubId: string, text: string, amount: number, toTransfers = false) {
  const f = financeOf(s, clubId);
  f.balance += amount;
  if (toTransfers) f.transferBudget += amount;
  if (clubId === s.clubId) { f.ledger.unshift({ date: s.date, text, amount }); f.ledger = f.ledger.slice(0, 80); }
}

/** No 1.º dia de cada mês: verba do clube entra, salários saem. */
export function monthlyFinance(s: GameState, from: string, to: string) {
  for (const c of s.clubs) {
    const f = financeOf(s, c.id);
    let m = from.slice(0, 7);
    const end = to.slice(0, 7);
    while (m < end) {
      const [y, mo] = m.split('-').map(Number);
      m = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, '0')}`;
      if (f.month === m) continue;
      f.month = m;
      book(s, c.id, 'Verba do clube para o futsal', Math.round(salaryBudget(c) / 12));
      book(s, c.id, 'Salários do plantel', -wageBill(s, c.id));
    }
  }
}

/** Bilheteira do jogo (receita do clube da casa; em campo neutro dividida). */
export function matchRevenue(s: GameState, f: Fixture) {
  const crowd = attendance(s, f);
  const total = Math.round(crowd.total * ticketPrice(s, f));
  if (f.neutral) { book(s, f.home, `Bilheteira (${f.stage}, campo neutro)`, Math.round(total * 0.35)); book(s, f.away, `Bilheteira (${f.stage}, campo neutro)`, Math.round(total * 0.35)); }
  else book(s, f.home, `Bilheteira: ${crowd.total} espetadores`, total);
}
