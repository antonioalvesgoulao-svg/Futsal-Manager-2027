// Tipos centrais do jogo. Vão crescer em cada etapa.

export interface Club {
  id: string;
  name: string;
  shortName: string;
  colors: [string, string]; // principal, secundária
  arena: string;
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
}

export const SAVE_VERSION = 1;
