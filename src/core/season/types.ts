// Tipos da época: calendário, competições, séries de play-off, estatísticas e palmarés
export type CompId = 'liga' | 'playoff' | 'taca' | 'tacaLiga' | 'supertaca';

export const COMP_NAMES: Record<CompId, string> = {
  liga: 'Liga Placard',
  playoff: 'Liga Placard (play-off)',
  taca: 'Taça de Portugal',
  tacaLiga: 'Taça da Liga',
  supertaca: 'Supertaça',
};

export interface Scorer {
  id: string;
  side: 0 | 1;
  min: number;
}

export interface FixtureResult {
  score: [number, number];
  pens?: [number, number];
  et?: boolean;
  scorers: Scorer[];
}

export interface Fixture {
  id: string;
  comp: CompId;
  stage: string; // "Jornada 5", "Quartos-de-final", "Final - jogo 2"
  round?: number; // jornada da liga
  date: string; // AAAA-MM-DD
  home: string;
  away: string;
  neutral?: boolean;
  knockout: boolean; // empate vai a prolongamento e penáltis
  seriesId?: string;
  cancelled?: boolean; // jogo da série que deixou de ser preciso
  result?: FixtureResult;
}

export interface Series {
  id: string;
  stage: string;
  hi: string; // melhor classificado (fator casa)
  lo: string;
  bestOf: number;
  wins: [number, number]; // [hi, lo]
  winner?: string;
  fixtureIds: string[];
}

export interface SeasonState {
  year: number; // 2026 = época 2026/27
  label: string; // "2026/27"
  fixtures: Fixture[];
  series: Series[];
  halfTable?: string[]; // classificação no fim da 1.ª volta (Taça da Liga)
  regularTable?: string[]; // classificação final da fase regular
  winners: Partial<Record<CompId, string>>;
  finished: boolean;
}

export interface PlayerSeason {
  games: number;
  goals: number;
  assists: number;
  minutes: number; // segundos
  ratingSum: number;
}

export interface NewsItem {
  date: string;
  text: string;
}

export interface Honour {
  season: string;
  comp: CompId;
  winner: string;
  runnerUp?: string;
}
