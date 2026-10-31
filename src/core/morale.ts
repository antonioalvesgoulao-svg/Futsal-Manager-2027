// Moral dos jogadores (0-100), ao estilo FM. Valores todos estimados (não há dados públicos para o futsal):
// sobe com vitórias, boas exibições, golos e minutos à medida do estatuto; desce com derrotas, banco, castigos e lesões;
// volta devagar ao normal (65). No jogo: atributos ×0,93 (moral 10) a ×1,04 (moral 100).
import { overall } from './attributes';
import type { MatchResult } from './engine/types';
import type { Fixture } from './season/types';
import type { GameState } from './types';

export const BASE = 65;
export const moraleOf = (s: GameState, id: string) => s.morale?.[id] ?? BASE;
export const moraleFactor = (m: number) => 1 + ((m - BASE) / 100) * 0.12;

export function moraleLabel(m: number) {
  return m >= 88 ? 'Excelente' : m >= 75 ? 'Muito boa' : m >= 60 ? 'Boa' : m >= 45 ? 'Razoável' : m >= 30 ? 'Fraca' : 'Muito fraca';
}
export function moraleHtml(m: number) {
  const c = m >= 75 ? '#2e9e5b' : m >= 60 ? '#7bb33a' : m >= 45 ? '#c9a227' : m >= 30 ? '#d9822b' : '#c0392b';
  return `<span style="color:${c};font-weight:600">${moraleLabel(m)}</span>`;
}

const clamp = (x: number) => Math.max(5, Math.min(100, x));

/** Depois de cada jogo oficial. Devolve as mudanças fortes dos jogadores do meu clube (para as notícias). */
export function applyMorale(s: GameState, f: Fixture, m: MatchResult, importance: number): string[] {
  const mor = (s.morale ??= {});
  const out: string[] = [];
  for (const [side, club] of [[0, f.home], [1, f.away]] as const) {
    const [gf, ga] = side === 0 ? m.score : [m.score[1], m.score[0]];
    let res = gf > ga ? 1 : gf < ga ? -1 : 0;
    if (m.penalties) res = (side === 0 ? m.penalties[0] > m.penalties[1] : m.penalties[1] > m.penalties[0]) ? 0.5 : -0.5;
    const big = 1 + importance; // finais e dérbis contam mais
    const squad = s.players.filter((p) => p.clubId === club);
    // estatuto: os 9 melhores do plantel esperam jogar
    const rank = [...squad].sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position)).map((p) => p.id);
    for (const p of squad) {
      const before = mor[p.id] ?? BASE;
      const st = m.players[p.id];
      const key = rank.indexOf(p.id) < 9 || (p.position === 'GR' && rank.filter((id) => squad.find((x) => x.id === id)!.position === 'GR').indexOf(p.id) === 0);
      let d = res * 2.2 * big + (res > 0 ? Math.min(1.5, (gf - ga) * 0.3) : 0);
      if (st && st.minutes >= 30) {
        d += (st.rating - 6.6) * 2 + st.goals * 0.8;
        if (st.red) d -= 3;
      } else if (st) d -= key ? 2 : 0.3; // convocado sem jogar
      else d -= key ? 1 : 0.4; // fora da convocatória
      d += (BASE - before) * 0.15; // regressa devagar ao normal
      const after = clamp(before + d);
      mor[p.id] = Math.round(after * 10) / 10;
      if (club === s.clubId && moraleLabel(after) !== moraleLabel(before)) {
        out.push(`${p.name}: moral ${after > before ? 'sobe' : 'desce'} para ${moraleLabel(after).toLowerCase()}.`);
      }
    }
  }
  return out;
}

/** Lesões e castigos tiram moral; títulos dão moral a todo o plantel. */
export function moraleEvent(s: GameState, ids: string[], delta: number) {
  const mor = (s.morale ??= {});
  for (const id of ids) mor[id] = clamp((mor[id] ?? BASE) + delta);
}
