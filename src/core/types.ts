// Tipos centrais do jogo. Vão crescer em cada etapa.

export interface Club {
  id: string;
  name: string;
  shortName: string;
  colors: [string, string]; // principal, secundária
  city: string;
  arena: string;
  reputation: number; // 1 a 100
}

import type { Attributes } from './attributes';

export type Position = 'GR' | 'FIX' | 'FIX/ALA' | 'ALA' | 'ALA/PIV' | 'PIV' | 'UNI';

export interface Player {
  id: string;
  clubId: string;
  name: string;
  position: Position;
  number: number | null;
  age: number;
  nationality: string;
  attrs: Attributes;
  potential: number;
}

export interface League {
  id: string;
  name: string;
  country: string;
  season: string;
  clubIds: string[];
}

export interface Manager {
  name: string;
  nationality: string;
}

export interface GameState {
  version: number;
  createdAt: string;
  manager: Manager;
  clubId: string;
  season: string; // ex.: "2026/27"
  date: string; // data atual do jogo (ISO)
  clubs: Club[];
  leagues: League[];
  players: Player[];
}

export const SAVE_VERSION = 4;
