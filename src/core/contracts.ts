// Contratos: salário mensal bruto, fim do contrato, cláusula de rescisão, valor de mercado.
// Referências reais (poucas, o futsal quase não publica salários):
// - média na Europa ~40 mil €/ano brutos por jogador (Flashscore: 60% de um orçamento médio de 1 M€ em salários)
// - topo: Pany Varela foi para o Al Nassr por ~300 mil €/ano (Record); proposta de 45 mil €/mês limpos a um jogador de elite (DN)
// - cláusulas pequenas fora do topo: Sporting pagou 50 mil € pela cláusula de Felipe Rufino (20 anos, Joinville)
// Tudo o resto (fórmula por nível, idade e riqueza do clube) é estimativa.
import { overall, rng } from './attributes';
import type { Club, GameState, Player } from './types';

export interface Contract { wage: number; until: number; clause: number } // until = ano em que acaba (30 de junho)

const round = (x: number, step: number) => Math.max(step, Math.round(x / step) * step);
const REAL_IDS = new Set(['slb12']);

/** Salário de mercado (€/mês brutos) para um jogador num clube. */
export function marketWage(p: Player, club: Club) {
  const ov = overall(p.attrs, p.position);
  const base = 850 * Math.exp((ov - 8) * 0.25); // diferença dentro do plantel; a escala do clube acerta o total
  // riqueza: escala do clube para a folha salarial bater com o orçamento (salaryBudget)
  const wealth = club.wageScale ?? 1.3 * Math.exp((club.wealth - 98) * 0.0296);
  const age = p.age <= 19 ? 0.55 : p.age <= 21 ? 0.75 : p.age >= 34 ? 0.8 : 1;
  return Math.max(400, round(base * wealth * age, 50));
}

/** Orçamento anual do futsal (€), todo para salários (pedido do António).
 *  Pontos reais: Benfica 2,7 M€ (2024, wealth 98), Sporting ~2 M€ (92), Fundão ~150 mil € (40).
 *  Os outros saem da curva exponencial que passa por estes três (estimativa): mais estrutura = mais orçamento. */
export const salaryBudget = (club: Club) => club.budget ?? Math.round(2.7e6 * Math.exp((club.wealth - 98) * 0.0498) / 1000) * 1000;

/** Calcula a escala salarial de cada clube para que os salários do plantel somem o orçamento. */
export function calibrateWages(s: GameState) {
  for (const c of s.clubs) {
    const squad = s.players.filter((p) => p.clubId === c.id);
    c.wageScale = 1;
    const raw = squad.reduce((a, p) => a + marketWage(p, c), 0) * 12;
    c.wageScale = raw ? salaryBudget(c) / raw : 1;
  }
}

/** Valor de mercado estimado (€). */
export function marketValue(p: Player, club: Club) {
  const ov = overall(p.attrs, p.position);
  const ageF = p.age <= 21 ? 1.6 : p.age <= 24 ? 1.3 : p.age <= 28 ? 1 : p.age <= 31 ? 0.6 : 0.25;
  const pot = 1 + Math.max(0, p.potential - ov) * 0.12;
  return round(850 * Math.exp((ov - 8) * 0.34) * 12 * 0.9 * ageF * pot * (0.7 + club.reputation / 200), 5000);
}

/** Cláusula de rescisão: os grandes protegem muito mais os seus jogadores. */
function clauseFor(value: number, club: Club, r: () => number) {
  const mult = club.wealth >= 90 ? 8 + r() * 6 : club.wealth >= 70 ? 4 + r() * 3 : 2 + r() * 2;
  return round(value * mult, 25000);
}

// Salários conhecidos pelas notícias (€/mês brutos, ×12)
// Pany Varela (Benfica): 156 mil € líquidos/ano (notícias da transferência) ≈ 300 mil € brutos/ano (estimativa com IRS + Seg. Social)
const REAL_WAGE: Record<string, number> = { slb12: 25000 };

export function makeContract(p: Player, club: Club, year: number, seed = ''): Contract {
  const r = rng(`ct-${p.id}-${year}${seed}`);
  const years = p.age >= 33 ? 1 : p.age <= 23 ? 2 + Math.floor(r() * 3) : 1 + Math.floor(r() * 3);
  const wage = REAL_WAGE[p.id] && seed === '-ini' ? REAL_WAGE[p.id] : round(marketWage(p, club) * (0.85 + r() * 0.3), 50);
  return { wage, until: year + years, clause: clauseFor(marketValue(p, club), club, r) };
}

/** Garante que todos os jogadores têm contrato (jogos novos e gravações antigas). */
export function ensureContracts(s: GameState) {
  if (s.clubs.some((c) => c.wageScale === undefined)) calibrateWages(s);
  for (const p of s.players) {
    if (p.contract) continue;
    const c = s.clubs.find((x) => x.id === p.clubId);
    if (c) p.contract = makeContract(p, c, s.season.year, '-ini');
  }
}

/** Pedido do jogador para renovar: salário de mercado, mais alto se estiver insatisfeito ou se o clube for pequeno para ele. */
export function renewalDemand(s: GameState, p: Player) {
  const club = s.clubs.find((c) => c.id === p.clubId)!;
  const mor = s.morale?.[p.id] ?? 65;
  const wage = marketWage(p, club) * (1 + (65 - mor) / 200) * Math.max(1, (p.contract?.wage ?? 0) / marketWage(p, club));
  return { wage: round(wage, 50), maxYears: p.age >= 33 ? 1 : p.age >= 30 ? 2 : 4 };
}

/** Proposta de renovação do treinador. Devolve a resposta do jogador. */
export function offerRenewal(s: GameState, p: Player, wage: number, years: number): { ok: boolean; msg: string } {
  const d = renewalDemand(s, p);
  if (years > d.maxYears) return { ok: false, msg: `${p.name} só aceita contrato até ${d.maxYears} ano${d.maxYears > 1 ? 's' : ''}.` };
  if (wage < d.wage * 0.95) return { ok: false, msg: `${p.name} recusa: quer pelo menos ${fmtEur(d.wage)}/mês.` };
  const club = s.clubs.find((c) => c.id === p.clubId)!;
  const r = rng(`ren-${p.id}-${s.date}`);
  p.contract = { wage, until: s.season.year + years, clause: clauseFor(marketValue(p, club), club, r) };
  (s.morale ??= {})[p.id] = Math.min(100, (s.morale[p.id] ?? 65) + 5);
  return { ok: true, msg: `${p.name} renovou até ${p.contract.until} (${fmtEur(wage)}/mês).` };
}

/** Fim da época: clubes da IA renovam quem querem; no meu clube, quem não renovou sai (fica livre). Devolve notícias. */
export function contractsSeasonEnd(s: GameState, endingYear: number): string[] {
  const out: string[] = [];
  const gone: Player[] = [];
  for (const p of s.players) {
    if (!p.contract || p.contract.until > endingYear || p.loan) continue;
    const club = s.clubs.find((c) => c.id === p.clubId)!;
    if (p.clubId === s.clubId) { gone.push(p); out.push(`${p.name} terminou contrato e deixou o clube.`); continue; }
    // IA: renova quem tem nível para o plantel (os 12 melhores) e não é muito velho
    const squad = s.players.filter((x) => x.clubId === p.clubId).sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position));
    if (squad.indexOf(p) < 12 && p.age < 36) p.contract = makeContract(p, club, endingYear, '-ren');
    else gone.push(p);
  }
  for (const p of gone) { p.clubId = ''; p.contract = undefined; } // ficam livres no mercado
  return out;
}

export const fmtEur = (x: number) => (x >= 1e6 ? `${(x / 1e6).toFixed(1).replace('.', ',')} M€` : x >= 1e4 ? `${Math.round(x / 1000)} mil €` : `${x.toLocaleString('pt-PT')} €`);

export const wageBill = (s: GameState, clubId: string) => s.players.reduce((a, p) => {
  const w = p.contract?.wage ?? 0;
  if (p.loan) return a + (p.clubId === clubId ? w * p.loan.share : p.loan.from === clubId ? w * (1 - p.loan.share) : 0);
  return a + (p.clubId === clubId ? w : 0);
}, 0);
