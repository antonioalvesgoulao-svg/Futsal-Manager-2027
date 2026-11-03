// Tipos do motor de jogo
import type { Player } from '../types';
import type { Tactics } from '../tactics';

export type Side = 0 | 1; // 0 = casa, 1 = fora

export interface TeamSetup {
  clubId: string;
  name: string;
  shortName: string;
  squad: Player[]; // plantel (a convocatória de 14 é feita pelo motor)
  tactics: Tactics;
  coachTactical: number; // conhecimento tático do treinador, 1 a 20
  fitness?: Record<string, number>; // condição física antes do jogo (fadiga do treino e dos jogos), 0-100
  cardK?: number; // disciplina do treinador: multiplica a probabilidade de cartão nas faltas (1 = normal)
  morale?: Record<string, number>; // moral dos jogadores (0-100)
  ai?: boolean; // equipa do computador: o treinador muda a tática durante o jogo conforme o resultado e o tempo
}

export type EventType =
  | 'inicio'
  | 'confronto'
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
  | 'lesao'
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
  injured?: boolean; // lesionou-se e saiu durante o jogo
  redKind?: 'dogso' | 'brawl' | 'twoYellows' | 'agressao' | 'violento'; // motivo da expulsão (castigo)
  victim?: string; // agressão / jogo violento: quem foi atingido (castigo maior se ficar lesionado)
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
  injuries?: boolean; // false = sem lesões (amigáveis de teste)
  momentum?: [number, number]; // momento do jogo por liga: [empurrão de quem perde, gestão de quem ganha] por golo (0,55/0,2 em Portugal e Espanha)
  tieCaution?: [number, number]; // [segundos finais da 2.ª parte, fator na eficácia] quando está empatado (só ligas com muitos empates)
  goalFactor?: number; // fator da liga sobre a eficácia dos remates em jogo corrido (1 = Portugal/Espanha; Itália calibrada pela média real)
  extraTimeLen?: number; // duração de cada parte do prolongamento (s): 300 em Portugal, 180 em Espanha (RFEF)
  noExtraTime?: boolean;
  noPenalties?: boolean; // Itália (play-in): empate depois do prolongamento sem penáltis (passa a melhor classificada) // a eliminar sem prolongamento: empate vai diretamente a penáltis
  needWin?: [boolean, boolean]; // equipa precisa de ganhar (ex.: eliminatória a duas mãos)
  manual?: Side; // equipa controlada pelo jogador no modo ao vivo (sem pedidos de tempo automáticos)
  seed?: string;
  referees?: { names: [string, string]; tolerance: number; cards: number; harsh: number };
  importance?: number; // tensão do jogo (0 a 1): dérbis, finais, rivais próximos
}
