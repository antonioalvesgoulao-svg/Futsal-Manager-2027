import { Club, GameState, League, Player, SAVE_VERSION } from './types';

import porData from '../data/por/clubs.json';
import porPlayers from '../data/por/players.json';
import porOverrides from '../data/por/overrides.json';
import porFp from '../data/por/fpstats.json';
import { generateAttributes } from './attributes';
import porHistory from '../data/por/history.json';
import { computeMoneyball, SeasonRow } from './moneyball';
import porCoaches from '../data/por/coaches.json';
import { suggestTactics } from './tactics';
import type { Coach } from './types';
import { startFirstSeason } from './game';

// Base de dados: cada liga é um ficheiro em src/data/<país>/clubs.json
export const DB_CLUBS: Club[] = porData.clubs.map(({ check, ...c }) => ({ ...c, colors: c.colors as [string, string] }));
type RawPlayer = Omit<Player, 'attrs' | 'potential'>;
const BOOST = porOverrides.boost as Record<string, number>;
const HISTORY = porHistory.players as Record<string, SeasonRow[]>;
const ATTR_OVERRIDES = porOverrides.attrs as Record<string, Partial<Player['attrs']>>;
export const FP_STATS = porFp.players as Record<string, { games: number; yellow: number; red: number; seasons: { s: string; team: string; games: number; goals: number }[]; titles: string[] }>;

// Jogadores com atributos gerados (sempre iguais para o mesmo jogador)
function buildPlayers(): Player[] {
  return (porPlayers.players as RawPlayer[]).map((p) => {
    const club = DB_CLUBS.find((c) => c.id === p.clubId.replace('@jun', ''))!; // Sub-19 não inscritos como seniores ficam na formação
    const key = `${p.clubId}|${p.name}`;
    // historial: zerozero; quem não o tem (jogadores novos do site da FPF) usa as épocas oficiais do futsalportugal.com
    const mb = computeMoneyball((HISTORY[p.id] ?? FP_STATS[p.id]?.seasons ?? []) as SeasonRow[], p.position, p.age);
    const g = mb
      ? generateAttributes(p as Player, mb.level, BOOST[key] ?? 0, { productivity: mb.productivity, availability: mb.availability })
      : generateAttributes(p as Player, club.level, BOOST[key] ?? 0);
    // agressividade pelos cartões reais (FPF, desde 2021/22): média da Liga 0,21 cartões/jogo (amarelo=1, vermelho=2)
    const fp = FP_STATS[p.id];
    if (fp && fp.games >= 15) {
      const rate = (fp.yellow + 2 * fp.red) / fp.games;
      g.attrs.agressividade = Math.max(1, Math.min(20, Math.round(g.attrs.agressividade + Math.max(-4, Math.min(4, (rate / 0.21 - 1) * 3)))));
    }
    return { ...p, attrs: { ...g.attrs, ...(ATTR_OVERRIDES[key] ?? {}) }, potential: g.potential };
  });
}
export const DB_PLAYERS: Player[] = buildPlayers();
export const DB_COACHES: Coach[] = porCoaches.coaches as Coach[];
export const DB_LEAGUES: League[] = [
  { ...porData.league, clubIds: porData.clubs.map((c) => c.id) },
];

let current: GameState | null = null;
const listeners = new Set<() => void>();

export function getState(): GameState | null {
  return current;
}

export function setState(s: GameState | null) {
  current = s;
  listeners.forEach((l) => l());
}

export function onStateChange(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function newGame(managerName: string, nationality: string, clubId: string): GameState {
  const s: GameState = {
    version: SAVE_VERSION,
    createdAt: new Date().toISOString(),
    manager: { name: managerName, nationality },
    clubId,
    date: '2026-07-01',
    clubs: structuredClone(DB_CLUBS),
    leagues: structuredClone(DB_LEAGUES),
    players: structuredClone(DB_PLAYERS),
    // o treinador real do clube escolhido fica sem clube
    coaches: DB_COACHES.map((c) => ({ ...structuredClone(c), clubId: c.clubId === clubId ? null : c.clubId })),
    tactics: suggestTactics(DB_PLAYERS.filter((p) => p.clubId === clubId)),
    season: null as unknown as GameState['season'],
    pstats: {},
    news: [],
    honours: [],
  };
  startFirstSeason(s);
  s.news.unshift({ date: s.date, text: `${managerName} é o novo treinador do ${s.clubs.find((c) => c.id === clubId)!.name}.` });
  return s;
}

export function myClub(s: GameState): Club {
  return s.clubs.find((c) => c.id === s.clubId)!;
}

export function advanceDay(s: GameState) {
  const d = new Date(s.date);
  d.setDate(d.getDate() + 1);
  s.date = d.toISOString().slice(0, 10);
  setState(s);
}
