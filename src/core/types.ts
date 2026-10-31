// Tipos centrais do jogo. Vão crescer em cada etapa.

export interface Club {
  id: string;
  name: string;
  shortName: string;
  colors: [string, string]; // principal, secundária
  city: string;
  arena: string;
  reputation: number; // prestígio, 1 a 100 (escala mundial)
  level: number; // qualidade atual do plantel, 1 a 100 (escala mundial)
  wealth: number; // poder financeiro e dimensão do clube, 1 a 100 (escala mundial)
}

import type { Attributes } from './attributes';
import type { Tactics } from './tactics';
import type { Honour, NewsItem, PlayerSeason, SeasonState } from './season/types';

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

export interface Coach {
  id: string;
  name: string;
  clubId: string | null; // null = sem clube
  tactical: number; // 1 a 20
  motivation: number;
  discipline: number;
  youth: number;
  style: Partial<Tactics>;
}

export interface Settings {
  speed: 'lento' | 'medio' | 'rapido';
  moments3d: 'nenhum' | 'golos' | 'importantes' | 'todos';
  channel: string; // canal fictício
  scoreboard: 'auto' | 'liga' | 'taca' | 'tacaLiga' | 'supertaca';
}

export interface GameState {
  version: number;
  createdAt: string;
  manager: Manager;
  clubId: string;
  date: string; // data atual do jogo (ISO)
  clubs: Club[];
  leagues: League[];
  players: Player[];
  coaches: Coach[];
  tactics: Tactics; // táticas do teu clube
  season: SeasonState;
  pstats: Record<string, PlayerSeason>; // estatísticas da época em curso
  news: NewsItem[];
  honours: Honour[];
  settings?: Settings;
}

export const SAVE_VERSION = 6;
