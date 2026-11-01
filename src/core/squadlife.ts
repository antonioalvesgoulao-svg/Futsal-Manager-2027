// Papel no plantel e satisfação dos jogadores (como no FM, adaptado ao futsal). Pedido do António, 3/11.
// - Papel: o treinador define-o no plantel (e nas contratações/renovações); a IA usa a importância de cada um.
// - Satisfação 0-100 (65 = normal): sobe a quem joga pelo menos o que o papel promete e desce a quem joga menos;
//   resultados da equipa também contam. Só se vê nos jogadores do meu clube (todos a têm).
// - Efeitos: moral (logo, rendimento em campo), pedido de renovação (insatisfeitos pedem muito mais ou recusam),
//   preço de venda (insatisfeito força a saída e sai barato; muito satisfeito custa mais), valor de mercado.
// Valores todos estimados.
import { overall } from './attributes';
import { importanceRank } from './market';
import type { GameState, Player } from './types';

export type Role = 'estrela' | 'titular' | 'rotacao' | 'suplente' | 'promessa' | 'dispensavel';
export const ROLE_LABEL: Record<Role, string> = {
  estrela: 'Jogador-chave',
  titular: 'Titular (cinco inicial)',
  rotacao: 'Rotação (2.º quinteto)',
  suplente: 'Suplente utilizado',
  promessa: 'Jovem promessa',
  dispensavel: 'Dispensável',
};
/** Parte dos minutos do jogador mais utilizado que cada papel espera ter. */
const EXPECT: Record<Role, number> = { estrela: 0.8, titular: 0.62, rotacao: 0.42, suplente: 0.22, promessa: 0.1, dispensavel: 0 };
/** Quanto cada papel pesa no salário pedido (prometer mais faz o jogador aceitar menos). */
export const ROLE_WAGE: Record<Role, number> = { estrela: 1.12, titular: 1.0, rotacao: 0.95, suplente: 0.92, promessa: 0.9, dispensavel: 0.85 };

export function autoRole(s: GameState, p: Player): Role {
  const r = importanceRank(s, p);
  if (r < 2) return 'estrela';
  if (r < 5) return 'titular';
  if (r < 9) return 'rotacao';
  if (p.age <= 20) return 'promessa';
  return r < 13 ? 'suplente' : 'dispensavel';
}
export const roleOf = (s: GameState, p: Player): Role => p.role ?? autoRole(s, p);

export const satOf = (s: GameState, id: string) => s.happy?.[id] ?? 65;
export function satLabel(v: number) {
  return v >= 85 ? 'Muito satisfeito' : v >= 70 ? 'Satisfeito' : v >= 50 ? 'Razoável' : v >= 35 ? 'Insatisfeito' : 'Quer sair';
}
export function satHtml(v: number) {
  const c = v >= 70 ? '#4ade80' : v >= 50 ? '#facc15' : v >= 35 ? '#fb923c' : '#f87171';
  return `<span style="color:${c};font-weight:600">${satLabel(v)}</span>`;
}

/** Depois de cada jogo, para os jogadores dos dois clubes: minutos face ao papel, resultado, gestão do treinador. */
export function afterMatchSatisfaction(s: GameState, clubIds: string[], result: Record<string, number>): string[] {
  const out: string[] = [];
  const happy = (s.happy ??= {});
  for (const club of clubIds) {
    const squad = s.players.filter((p) => p.clubId === club);
    // guarda-redes comparam-se com guarda-redes (o titular joga o jogo todo); jogadores de campo com jogadores de campo
    const maxOf = (gk: boolean) => Math.max(1, ...squad.filter((p) => (p.position === 'GR') === gk).map((p) => s.pstats[p.id]?.minutes ?? 0));
    const maxMin = { gk: maxOf(true), out: maxOf(false) };
    const games = Math.max(0, ...squad.map((p) => s.pstats[p.id]?.games ?? 0));
    if (games < 3) continue; // no início da época ninguém se queixa
    const gestao = club === s.clubId ? (s.manager.attrs?.gestao ?? 10) : 11;
    for (const p of squad) {
      if (s.injuries?.[p.id] && s.injuries[p.id].until > s.date) continue; // lesionado não se queixa de não jogar
      const share = (s.pstats[p.id]?.minutes ?? 0) / (p.position === 'GR' ? maxMin.gk : maxMin.out);
      const diff = share - EXPECT[roleOf(s, p)];
      let d = diff >= 0 ? Math.min(2, diff * 8) : Math.max(-4, diff * 14);
      d += result[club] ?? 0;
      if (d < 0) d *= 1.3 - gestao * 0.03; // boa gestão de pessoas: quedas menores
      const before = happy[p.id] ?? 65;
      const v = Math.max(0, Math.min(100, before + d + (65 - before) * 0.02));
      happy[p.id] = Math.round(v * 10) / 10;
      if (club === s.clubId && before >= 35 && v < 35) out.push(`${p.name} está insatisfeito com o papel que tem (${ROLE_LABEL[roleOf(s, p)].toLowerCase()}) e pensa em sair.`);
      // satisfação puxa a moral (e, assim, o rendimento em campo)
      (s.morale ??= {})[p.id] = Math.max(0, Math.min(100, (s.morale[p.id] ?? 65) + (v - 65) * 0.03));
      // valor de mercado dinâmico: forma da época (nota média) e satisfação
      const st = s.pstats[p.id];
      const form = st && st.games >= 5 ? Math.max(-0.3, Math.min(0.3, (st.ratingSum / st.games - 6.6) * 0.25)) : 0;
      p.valueK = Math.round((1 + form + (v < 35 ? -0.15 : v > 85 ? 0.05 : 0)) * 100) / 100;
    }
  }
  return out;
}

/** Multiplicador do salário pedido na renovação, conforme a satisfação; null = recusa renovar. */
export function renewalSatK(s: GameState, p: Player): number | null {
  const v = satOf(s, p.id);
  if (v < 25) return null;
  return v < 40 ? 1.25 + (40 - v) * 0.02 : v > 80 ? 0.92 : 1;
}
/** Multiplicador do preço de venda conforme a satisfação. */
export const priceSatK = (s: GameState, p: Player) => { const v = satOf(s, p.id); return v < 35 ? 0.65 : v > 85 ? 1.25 : 1; };
export const levelOf = (p: Player) => overall(p.attrs, p.position);
