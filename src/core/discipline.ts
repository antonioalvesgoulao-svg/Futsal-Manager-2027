// Castigos segundo o Regulamento Disciplinar da FPF 2025/26 (futsal)
// - Art. 169: expulsão por 2 amarelos no mesmo jogo = 1 jogo; esses amarelos não contam para a acumulação (170.3)
// - Art. 170: Liga Placard: 1 jogo ao 5.º, 9.º e 12.º amarelo e depois a cada 3 (15.º, 18.º…), na mesma época e competição.
//   Taça de Portugal, Taça da Liga e Supertaça não estão na lista do 170.6: sem acumulação
// - Art. 170.4: mudança de fase (Liga → play-off): recomeça a contagem se ainda não chegou ao 5.º; senão continua
// - Art. 168.1: impedir golo/oportunidade clara (falta ou mão) = 1 a 2 jogos
// - Art. 154: agressão a jogador = 2 a 12 jogos (1 a 8 sem lesão; metade se for resposta). Confronto: participação conforme o papel
// - Art. 40: cumpre-se na mesma competição e época; se não for possível, noutra competição oficial da equipa nessa época
//   (exceto os de acumulação de amarelos, 40.9); senão na época seguinte
import type { MatchResult } from './engine/types';
import type { CompId, Fixture } from './season/types';
import type { GameState } from './types';

// Espanha (Código Disciplinario RFEF, versão de 3/3/2026, Título do fútbol sala, Art. 140-145):
// - Art. 141.1: qualquer expulsão = 1 jogo, salvo infração mais grave (2 amarelos = 1 jogo; impedir golo = 1 jogo)
// - Art. 141.5: os amarelos NUNCA se acumulam (sem castigos por acumulação)
// - Art. 145.2: tentativa de agressão / jogo violento sem dano: até 3 jogos (confrontos); com dano: falta grave, 4-12 (o jogo não simula dano)
// - Art. 143.3: a suspensão cumpre-se nos jogos oficiais seguintes, seja qual for a competição
// Itália (FIGC, Codice di Giustizia Sportiva e comunicados da Divisione Calcio a 5; regra do futebol desde 2015 aplicada ao
// calcio a 5): Serie A (com play-off) 1 jogo ao 5.º amarelo (diffida ao 4.º), depois ao 10.º, 14.º, 17.º, 19.º e a cada amarelo;
// Coppa Italia: 1 jogo a cada 2 amarelos, só nessa competição. Vermelhos: 1 jogo (2 amarelos, impedir golo); confronto 1-3,
// agressão/conduta violenta 3+ (estimativa pelo CGS)
/** Liga e play-off são a mesma competição para efeitos de castigo. */
export type DComp = Exclude<CompId, 'playoff' | 'espPlayoff' | 'espAp' | 'espCl' | 'itaPlayoff' | 'fraPlayoff'>;
export const dcomp = (c: CompId): DComp => (c === 'playoff' ? 'liga' : c === 'itaPlayoff' ? 'ita' : c === 'fraPlayoff' ? 'fra' : ['esp', 'espPlayoff', 'espAp', 'espCl', 'copaEsp', 'superEsp', 'copaRey'].includes(c) ? 'esp' : (c as DComp));

export interface Suspension { comp: DComp; games: number; reason: string; yellowsOnly?: boolean }
export interface Discipline {
  yellows: Record<string, number>; // amarelos acumulados na Liga Placard (fase atual)
  sanctioned: Record<string, number>; // último amarelo castigado (5, 9, 12, 15…)
  phase: 'liga' | 'playoff';
  bans: Record<string, Suspension[]>;
}

export const emptyDiscipline = (): Discipline => ({ yellows: {}, sanctioned: {}, phase: 'liga', bans: {} });

const THRESH = (n: number) => n === 5 || n === 9 || (n >= 12 && (n - 12) % 3 === 0);
const THRESH_ITA = (n: number) => n === 5 || n === 10 || n === 14 || n === 17 || n >= 19;
// França (barème FFF, Annexe 2 dos Règlements Généraux, texto do António 4/11; sem regra própria do futsal): 3 amarelos = 1 jogo
// (art. 1.3; D1 e Coupe contam juntas, "même pratique"; a janela de 3 meses não é aplicada); um castigo firme anula os amarelos
// em registo e, se havia 2, +1 jogo (art. 1.4); anulados no fim da época (1.5). Duplo amarelo 1; anular ocasião de golo 2;
// falta grosseira 3; comportamento excessivo 1; agressão sem lesão 4, com lesão até 8 dias 9, mais de 8 dias 15 (art. 13)
const THRESH_FRA = (n: number) => n >= 3;
const isFra = (c: string) => c === 'fra' || c === 'coupeFra';

/** Jogos de castigo de um jogador numa competição. */
export function banFor(s: GameState, pid: string, comp: CompId) {
  const d = s.discipline;
  return (d?.bans[pid] ?? []).filter((b) => b.comp === dcomp(comp)).reduce((a, b) => a + b.games, 0);
}
export function totalBan(s: GameState, pid: string) {
  return (s.discipline?.bans[pid] ?? []).reduce((a, b) => a + b.games, 0);
}

function rand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

/** Depois de cada jogo oficial: cumpre castigos de quem estava castigado e aplica os novos. Devolve notícias. */
export function applyDiscipline(s: GameState, f: Fixture, m: MatchResult, name: (id: string) => string): string[] {
  const d = (s.discipline ??= emptyDiscipline());
  const comp = dcomp(f.comp);
  const out: string[] = [];
  // mudança de fase (Art. 170.4)
  if (f.comp === 'playoff' && d.phase === 'liga') {
    d.phase = 'playoff';
    for (const id of Object.keys(d.yellows)) if (!d.sanctioned[id]) delete d.yellows[id];
  }
  // 1) quem estava castigado cumpre um jogo
  for (const club of [f.home, f.away]) {
    for (const p of s.players.filter((x) => x.clubId === club)) {
      const list = d.bans[p.id];
      if (!list) continue;
      const b = list.find((x) => x.comp === comp);
      if (b && !m.players[p.id]) { b.games--; if (b.games <= 0) list.splice(list.indexOf(b), 1); }
      if (!list.length) delete d.bans[p.id];
    }
  }
  // 2) novos castigos
  const rnd = rand(`${f.id}-${s.season.year}-disc`);
  const add = (id: string, games: number, reason: string, yellowsOnly = false) => {
    (d.bans[id] ??= []).push({ comp, games, reason, yellowsOnly });
    out.push(`${name(id)}: ${games} jogo${games > 1 ? 's' : ''} de castigo (${reason}).`);
  };
  for (const [id, st] of Object.entries(m.players)) {
    if (st.red) {
      const k = st.redKind ?? 'twoYellows';
      if (k === 'twoYellows') add(id, 1, 'expulso por 2 amarelos');
      else if (k === 'agressao' || k === 'violento') {
        // agressão / jogo violento: castigo conforme o dano (dias de paragem do atingido)
        const injDays = st.victim ? s.injuries?.[st.victim]?.days ?? 0 : 0;
        let g: number;
        if (isFra(comp)) {
          // FFF art. 13 (agressão) e 3 (falta grosseira); dias parados do atingido como aproximação da ITT
          g = k === 'agressao' ? (injDays > 8 ? 15 : injDays > 0 ? 9 : 4) : injDays > 8 ? 9 : 3;
        } else if (comp === 'ita' || comp === 'coppaIta' || comp === 'superIta') {
          // FIGC (CGS, conduta violenta): 3 jogos ou mais, conforme o dano (estimativa)
          g = 3 + Math.floor(rnd() * rnd() * 4) + Math.floor(injDays / 15);
        } else if (comp === 'esp') {
          // RFEF Art. 145: agressão a jogador = grave, 4-12; jogo violento com baixa >2 semanas 4-12, >2 meses 13-24; sem dano até 3
          if (k === 'violento' && injDays > 60) g = 13 + Math.floor(rnd() * 12);
          else if (k === 'agressao' || injDays > 14) g = 4 + Math.floor(rnd() * rnd() * 9) + (injDays > 14 ? 2 : 0);
          else g = 1 + Math.floor(rnd() * 3);
        } else {
          // FPF Art. 154: agressão a jogador 2 a 12 jogos (1 a 8 sem lesão); escala com a lesão causada
          g = injDays > 0 ? Math.min(12, 2 + Math.floor(rnd() * 3) + Math.floor(injDays / 15)) : 1 + Math.floor(rnd() * rnd() * 8);
        }
        add(id, Math.min(24, g), k === 'agressao' ? `agressão a adversário${injDays ? `, que ficou ${injDays} dias parado` : ''}` : `entrada violenta${injDays ? `, adversário ${injDays} dias parado` : ''}`);
      }
      else if (k === 'dogso' && isFra(comp)) add(id, 2, 'vermelho direto: anulou ocasião de golo');
      else if (isFra(comp)) add(id, 1, 'vermelho direto em confronto (comportamento excessivo)');
      else if (k === 'dogso') add(id, comp === 'esp' || comp === 'ita' || comp === 'coppaIta' ? 1 : rnd() < 0.75 ? 1 : 2, 'vermelho direto: impediu oportunidade de golo');
      else if (comp === 'esp' || comp === 'ita' || comp === 'coppaIta' || comp === 'superIta') add(id, 1 + Math.floor(rnd() * rnd() * 3), 'vermelho direto em confronto'); // RFEF 145.2 até 3; Itália 1-3 (estimativa)
      else {
        // confronto: agressão sem lesão (Art. 154, 1 a 8; na prática quase sempre perto do mínimo)
        const g = 1 + Math.floor(rnd() * rnd() * 5);
        add(id, g, 'vermelho direto em confronto');
      }
    }
    // acumulação de amarelos (só Liga Placard; os 2 amarelos da expulsão não contam)
    // Itália: Serie A (5.º, 10.º, 14.º, 17.º, 19.º…) e Coppa Italia (a cada 2), contagens separadas por competição
    if ((comp === 'ita' || comp === 'coppaIta') && st.yellow > 0 && !(st.red && (st.redKind ?? 'twoYellows') === 'twoYellows')) {
      const key = `${id}@${comp}`;
      const n = (d.yellows[key] = (d.yellows[key] ?? 0) + st.yellow);
      if (comp === 'ita' ? THRESH_ITA(n) && d.sanctioned[key] !== n : n % 2 === 0) { d.sanctioned[key] = n; add(id, 1, `${n}.º amarelo${comp === 'coppaIta' ? ' na Coppa Italia' : ''}`, true); }
    }
    if (isFra(comp)) {
      const key = `${id}@fra`;
      if (st.red) {
        // art. 1.4: castigo firme anula as advertências em registo; com 2 por anular, +1 jogo
        if ((d.yellows[key] ?? 0) >= 2) add(id, 1, 'advertências anuladas pelo castigo (2 em registo)');
        d.yellows[key] = 0;
      } else if (st.yellow > 0) {
        const n = (d.yellows[key] = (d.yellows[key] ?? 0) + st.yellow);
        if (THRESH_FRA(n)) { d.yellows[key] = 0; add(id, 1, '3 advertências', true); }
      }
    }
    if (comp === 'liga' && st.yellow > 0 && !(st.red && (st.redKind ?? 'twoYellows') === 'twoYellows')) {
      const n = (d.yellows[id] = (d.yellows[id] ?? 0) + st.yellow);
      if (THRESH(n)) { d.sanctioned[id] = n; add(id, 1, `${n}.º amarelo`, true); }
    }
  }
  // 3) Art. 40.2: castigo por vermelho numa competição onde a equipa já não joga → passa para outra competição dessa época
  for (const [id, list] of Object.entries(d.bans)) {
    const club = s.players.find((p) => p.id === id)?.clubId;
    if (!club) continue;
    for (const b of list) {
      if (b.yellowsOnly) continue;
      const left = s.season.fixtures.some((x) => !x.result && !x.cancelled && dcomp(x.comp) === b.comp && (x.home === club || x.away === club));
      if (left) continue;
      const other = s.season.fixtures.find((x) => !x.result && !x.cancelled && (x.home === club || x.away === club));
      if (other) b.comp = dcomp(other.comp);
    }
  }
  return out;
}

/** Fim de época: amarelos limpos; castigos de acumulação caducam (40.9); os outros passam para a época seguinte (40.3). */
export function seasonEndDiscipline(s: GameState) {
  const d = (s.discipline ??= emptyDiscipline());
  d.yellows = {}; d.sanctioned = {}; d.phase = 'liga';
  for (const [id, list] of Object.entries(d.bans)) {
    d.bans[id] = list.filter((b) => !b.yellowsOnly);
    if (!d.bans[id].length) delete d.bans[id];
  }
}
