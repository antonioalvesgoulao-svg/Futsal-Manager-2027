import { Club, GameState, SAVE_VERSION } from './types';

// Clubes temporários. Na etapa 2 são substituídos pela base de dados real.
export const PLACEHOLDER_CLUBS: Club[] = [
  { id: 'c01', name: 'Clube Teste Norte', shortName: 'CTN', colors: ['#1d4ed8', '#ffffff'], arena: 'Pavilhão Norte' },
  { id: 'c02', name: 'Clube Teste Sul', shortName: 'CTS', colors: ['#16a34a', '#ffffff'], arena: 'Pavilhão Sul' },
  { id: 'c03', name: 'Clube Teste Centro', shortName: 'CTC', colors: ['#dc2626', '#ffffff'], arena: 'Pavilhão Centro' },
  { id: 'c04', name: 'Clube Teste Ilhas', shortName: 'CTI', colors: ['#f59e0b', '#111827'], arena: 'Pavilhão Ilhas' },
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
    clubs: structuredClone(PLACEHOLDER_CLUBS),
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
