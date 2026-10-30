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
}

export const SAVE_VERSION = 2;
