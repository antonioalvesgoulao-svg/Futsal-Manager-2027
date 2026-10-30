import { Club, GameState, League, Player, SAVE_VERSION } from './types';

import porData from '../data/por/clubs.json';
import porPlayers from '../data/por/players.json';
import porOverrides from '../data/por/overrides.json';
import { generateAttributes } from './attributes';

// Base de dados: cada liga é um ficheiro em src/data/<país>/clubs.json
export const DB_CLUBS: Club[] = porData.clubs.map(({ check, ...c }) => ({ ...c, colors: c.colors as [string, string] }));
type RawPlayer = Omit<Player, 'attrs' | 'potential'>;
const BOOST = porOverrides.boost as Record<string, number>;
const ATTR_OVERRIDES = porOverrides.attrs as Record<string, Partial<Player['attrs']>>;

// Jogadores com atributos gerados (sempre iguais para o mesmo jogador)
function buildPlayers(): Player[] {
  return (porPlayers.players as RawPlayer[]).map((p) => {
    const club = DB_CLUBS.find((c) => c.id === p.clubId)!;
    const key = `${p.clubId}|${p.name}`;
    const g = generateAttributes(p as Player, club.level, BOOST[key] ?? 0);
    return { ...p, attrs: { ...g.attrs, ...(ATTR_OVERRIDES[key] ?? {}) }, potential: g.potential };
  });
}
export const DB_PLAYERS: Player[] = buildPlayers();
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
  return {
    version: SAVE_VERSION,
    createdAt: new Date().toISOString(),
    manager: { name: managerName, nationality },
    clubId,
    season: '2026/27',
    date: '2026-07-01',
    clubs: structuredClone(DB_CLUBS),
    leagues: structuredClone(DB_LEAGUES),
    players: structuredClone(DB_PLAYERS),
  };
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
