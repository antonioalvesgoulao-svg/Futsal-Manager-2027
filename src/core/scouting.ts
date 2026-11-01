// Observação (como no FM; pedido do António 3/11): os atributos, o nível e o potencial dos jogadores dos outros clubes
// ficam escondidos e só se descobrem observando-os. O olheiro (scout) do meu clube observa jogadores; o analista prepara
// relatórios das equipas adversárias. Quanto melhor o técnico, mais rápido e mais preciso.
// Conhecimento 0-100 por jogador: os meus = 100; da mesma liga começam a 30 (vêem-se nos jogos); resto 10.
// Valores todos estimados.
import { overall } from './attributes';
import { abilityOf, staffOf } from './staff';
import type { GameState, Player } from './types';

export interface ScoutState { known: Record<string, number>; queue: { id: string; since: string }[] }
export const scoutOf = (s: GameState): ScoutState => (s.scout ??= { known: {}, queue: [] });

function hash(x: string) {
  let h = 2166136261;
  for (let i = 0; i < x.length; i++) h = Math.imul(h ^ x.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

/** Quanto sei de um jogador (0-100). */
export function knowledge(s: GameState, p: Player): number {
  const owner = p.clubId.replace('@jun', '');
  if (owner === s.clubId || p.loan?.from === s.clubId) return 100;
  const sameLeague = s.leagues.find((l) => l.clubIds.includes(s.clubId))?.clubIds.includes(owner);
  return Math.max(sameLeague ? 30 : 10, scoutOf(s).known[p.id] ?? 0);
}

/** Capacidade de quem observa: o olheiro do clube; sem olheiro, observa o treinador (mais devagar). */
export const scoutAbility = (s: GameState) => (staffOf(s, s.clubId, 'scout') ? abilityOf(s, s.clubId, 'scout') : 6);
export const maxQueue = (s: GameState) => (staffOf(s, s.clubId, 'scout') ? 3 + Math.floor(abilityOf(s, s.clubId, 'scout') / 5) : 2);

export function observe(s: GameState, id: string): string {
  const sc = scoutOf(s);
  if (sc.queue.some((q) => q.id === id)) return 'Já está a ser observado.';
  if (sc.queue.length >= maxQueue(s)) return `O teu olheiro já tem ${sc.queue.length} jogadores para observar (máximo ${maxQueue(s)}).`;
  sc.queue.push({ id, since: s.date });
  return 'Jogador adicionado à lista de observação.';
}

/** Avança a observação: conhecimento por dia conforme a capacidade (sem olheiro ~3%/dia; olheiro 20 ~13%/dia). */
export function scoutDays(s: GameState, days: number): string[] {
  const sc = scoutOf(s);
  const out: string[] = [];
  const speed = staffOf(s, s.clubId, 'scout') ? 3 + scoutAbility(s) * 0.5 : 3;
  for (const q of [...sc.queue]) {
    const p = s.players.find((x) => x.id === q.id);
    if (!p) { sc.queue = sc.queue.filter((x) => x !== q); continue; }
    const k = Math.min(100, knowledge(s, p) + speed * days);
    sc.known[p.id] = k;
    if (k >= 100) { sc.queue = sc.queue.filter((x) => x !== q); out.push(`Relatório de observação pronto: ${p.name}. Vê na Observação.`); }
  }
  return out;
}

/** Meia-largura do intervalo mostrado para um valor 1-20 (0 = valor exato). Olheiros melhores erram menos. */
export function spread(s: GameState, p: Player): number {
  const k = knowledge(s, p);
  if (k >= 100) return Math.max(0, Math.round(1.2 - scoutAbility(s) * 0.06)); // mesmo observado: olheiro fraco ainda erra 1
  return Math.max(1, Math.round(((100 - k) / 100) * 6));
}

/** Atributo como o vejo: valor exato, intervalo ("12-15") ou "?" se ainda não sei nada. */
export function seenAttr(s: GameState, p: Player, key: string, v: number): string {
  const k = knowledge(s, p);
  if (k >= 100 && spread(s, p) === 0) return String(v);
  if (k < 20) return '?';
  const w = spread(s, p);
  const off = Math.round((hash(p.id + key) - 0.5) * w); // o intervalo não está centrado no valor real
  const lo = Math.max(1, v + off - w), hi = Math.min(20, v + off + w);
  return lo === hi ? String(lo) : `${lo}-${hi}`;
}

/** Nível e potencial vistos (escala 1-20), com intervalo. */
export function seenLevel(s: GameState, p: Player, pot = false): { lo: number; hi: number } {
  const v = pot ? p.potential : overall(p.attrs, p.position);
  const k = knowledge(s, p);
  const w = (k >= 100 ? 0.3 : ((100 - k) / 100) * 4) * (pot ? 1.5 : 1);
  const off = (hash(p.id + (pot ? 'pot' : 'lvl')) - 0.5) * w;
  return { lo: Math.max(1, v + off - w), hi: Math.min(20, v + off + w) };
}
/** Recomendação do olheiro (A a D), comparando com o meu plantel. */
export function recommendation(s: GameState, p: Player): string {
  const mine = s.players.filter((x) => x.clubId === s.clubId).map((x) => overall(x.attrs, x.position)).sort((a, b) => b - a);
  const lv = seenLevel(s, p), pt = seenLevel(s, p, true);
  const mid = (lv.lo + lv.hi) / 2, mp = (pt.lo + pt.hi) / 2;
  if (mid >= (mine[2] ?? 0)) return 'A · reforço imediato para o cinco inicial';
  if (mid >= (mine[7] ?? 0) || (p.age <= 21 && mp >= (mine[2] ?? 0))) return 'B · bom reforço / grande potencial';
  if (mid >= (mine[11] ?? 0)) return 'C · rotação';
  return 'D · não acrescenta ao plantel';
}
