import type { ClubFinance } from './finance';
import type { Contract } from './contracts';
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
  wageScale?: number; // escala salarial (calculada para a folha bater com o orçamento)
}

import type { Attributes } from './attributes';
import type { Tactics } from './tactics';
import type { Discipline } from './discipline';
import type { Injury } from './injuries';
import type { TrainingPlan, TrainLog } from './training';
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
  contract?: Contract;
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
  scoreboard: 'auto' | 'liga' | 'taca' | 'tacaLiga' | 'supertaca';
  quality?: 'normal' | 'alta';
  sound?: 'off' | 'low' | 'mid' | 'high'; // volume do som do jogo
  chantWords?: boolean; // letra dos cânticos dita pela voz do sistema
  chantsRude?: boolean; // cânticos provocadores no dérbi Benfica-Sporting // gráficos 3D: alta = reflexos no piso, sombras mais finas
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
  discipline?: Discipline; // amarelos acumulados e castigos
  injuries?: Record<string, Injury>; // lesões em curso
  morale?: Record<string, number>; // moral 0-100 (65 = normal)
  training?: TrainingPlan; // plano de treino do meu clube
  trainLog?: TrainLog; // treino acumulado na época
  devFrac?: number; // fração da evolução anual já aplicada
  finance?: Record<string, ClubFinance>; // finanças do futsal de cada clube (etapa 10, em curso)
  devAttrs?: Record<string, Partial<Record<string, number>>>; // atributos no início da época (travões da evolução)
  devStart?: Record<string, number>; // nível no início da época (resumo do fim de época)
}

export const SAVE_VERSION = 6;
