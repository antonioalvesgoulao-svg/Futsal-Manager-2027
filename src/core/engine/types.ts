// Tipos do motor de jogo
import type { Player } from '../types';

export type Side = 0 | 1; // 0 = casa, 1 = fora

export interface TeamSetup {
  clubId: string;
  name: string;
  shortName: string;
  squad: Player[]; // até 14 convocados
  // Instruções (as escolhas táticas completas entram na etapa 5)
  flyingKeeper: 'nunca' | 'auto' | 'sempre';
}

export type EventType =
  | 'inicio'
  | 'golo'
  | 'remate_defendido'
  | 'remate_fora'
  | 'remate_bloqueado'
  | 'poste'
  | 'falta'
  | 'livre_10m'
  | 'penalti'
  | 'amarelo'
  | 'vermelho'
  | 'canto'
  | 'quatro_segundos'
  | 'substituicao'
  | 'time_out'
  | 'gr_avancado_on'
  | 'gr_avancado_off'
  | 'fim_parte'
  | 'fim_jogo'
  | 'prolongamento'
  | 'desempate';

export interface MatchEvent {
  t: number; // segundos de jogo
  period: number; // 1, 2, 3 (prol. 1), 4 (prol. 2), 5 (penáltis)
  side?: Side;
  type: EventType;
  playerId?: string;
  assistId?: string;
  text: string;
  score: [number, number];
}

export interface PlayerStats {
  minutes: number; // segundos em campo
  goals: number;
  assists: number;
  shots: number;
  onTarget: number;
  saves: number;
  fouls: number;
  tackles: number;
  yellow: number;
  red: boolean;
  rating: number;
}

export interface TeamStats {
  possession: number; // segundos com bola
  shots: number;
  onTarget: number;
  corners: number;
  fouls: number;
  foulsByPeriod: number[];
  yellow: number;
  red: number;
  timeouts: number[];
}

export interface MatchResult {
  score: [number, number];
  penalties?: [number, number];
  extraTime: boolean;
  events: MatchEvent[];
  team: [TeamStats, TeamStats];
  players: Record<string, PlayerStats>;
  names: Record<string, string>;
}

export interface MatchOptions {
  knockout?: boolean; // prolongamento e penáltis em caso de empate
  seed?: string;
}
