// Tipos da época: calendário, competições, séries de play-off, estatísticas e palmarés
export type CompId = 'liga' | 'playoff' | 'taca' | 'tacaLiga' | 'supertaca' | 'esp' | 'espPlayoff' | 'copaRey' | 'copaEsp' | 'superEsp' | 'espAp' | 'espCl' | 'ita' | 'itaPlayoff' | 'coppaIta' | 'superIta' | 'fra' | 'fraPlayoff' | 'coupeFra';

export const COMP_NAMES: Record<CompId, string> = {
  liga: 'Liga Placard',
  playoff: 'Liga Placard (play-off)',
  taca: 'Taça de Portugal',
  tacaLiga: 'Taça da Liga',
  supertaca: 'Supertaça',
  esp: 'Liga Prime Futsal',
  espPlayoff: 'Liga Prime Futsal (fase final)',
  espAp: 'Liga Prime Futsal (Apertura)',
  espCl: 'Liga Prime Futsal (Clausura)',
  copaRey: 'Copa del Rey',
  copaEsp: 'Copa de España',
  superEsp: 'Supercopa de España',
  ita: 'Serie A',
  itaPlayoff: 'Serie A (play-off)',
  coppaIta: 'Coppa Italia',
  superIta: 'Supercoppa Italiana',
  fra: 'D1 Futsal',
  fraPlayoff: 'D1 Futsal (play-off)',
  coupeFra: 'Coupe Nationale Futsal',
};

/** Tipo de cada competição, igual em todos os países: liga, play-off, taça (todos), taça da liga (final eight), supertaça. */
export type CompKind = 'league' | 'playoff' | 'cup' | 'leagueCup' | 'super';
export const COMP_KIND: Record<CompId, CompKind> = {
  liga: 'league', playoff: 'playoff', taca: 'cup', tacaLiga: 'leagueCup', supertaca: 'super',
  esp: 'league', espPlayoff: 'playoff', copaRey: 'cup', copaEsp: 'leagueCup', superEsp: 'super', espAp: 'leagueCup', espCl: 'leagueCup',
  ita: 'league', itaPlayoff: 'playoff', coppaIta: 'leagueCup', superIta: 'super',
  fra: 'league', fraPlayoff: 'playoff', coupeFra: 'cup',
};
export const kindOf = (c: CompId) => COMP_KIND[c];
/** Competições de cada país, pela ordem liga, play-off, taça, taça da liga, supertaça. */
export const COUNTRY_COMPS: Record<string, { league: CompId; playoff: CompId; cup: CompId; leagueCup: CompId; super: CompId }> = {
  por: { league: 'liga', playoff: 'playoff', cup: 'taca', leagueCup: 'tacaLiga', super: 'supertaca' },
  esp: { league: 'esp', playoff: 'espPlayoff', cup: 'copaEsp', leagueCup: 'copaEsp', super: 'superEsp' },
  ita: { league: 'ita', playoff: 'itaPlayoff', cup: 'coppaIta', leagueCup: 'coppaIta', super: 'superIta' },
  // França: sem supertaça nem taça da liga (dossiê do António, FFF); 'super' aponta para a Coupe só para preencher
  fra: { league: 'fra', playoff: 'fraPlayoff', cup: 'coupeFra', leagueCup: 'coupeFra', super: 'coupeFra' },
};
/** Competição de liga de cada liga do jogo (id da liga → CompId). */
export const leagueCompOf = (leagueId?: string): CompId => (leagueId === 'esp1' ? 'esp' : leagueId === 'ita1' ? 'ita' : leagueId === 'fra1' ? 'fra' : 'liga');
/** Nome do país de cada liga. */
export const leagueCountryName = (leagueId?: string) => (leagueId === 'esp1' ? 'Espanha' : leagueId === 'ita1' ? 'Itália' : leagueId === 'fra1' ? 'França' : 'Portugal');
export const countryOfComp = (c: CompId) => (Object.entries(COUNTRY_COMPS).find(([, v]) => Object.values(v).includes(c))?.[0] ?? 'por');

export interface Scorer {
  id: string;
  side: 0 | 1;
  min: number;
  kind?: string; // jogada, contra, canto, livre10, penalti, baliza deserta, recarga
}
export interface TacSum { sys: string; press: string; mark: string; fly: string }

export interface FixtureResult {
  score: [number, number];
  pens?: [number, number];
  et?: boolean;
  scorers: Scorer[];
  tac?: [TacSum, TacSum];
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
  arenaId?: string; // jogo rápido: pavilhão escolhido (id do clube em ARENAS ou nome de um campo neutro)
  knockout: boolean; // empate vai a prolongamento e penáltis
  agg?: [number, number]; // 2.ª mão (França): golos da 1.ª mão [casa deste jogo, fora]; o vencedor é decidido pelo agregado
  tieToHome?: boolean; // Itália (play-in): empate depois do prolongamento = passa a casa (melhor classificada), sem penáltis
  seriesId?: string;
  cancelled?: boolean; // jogo da série que deixou de ser preciso
  result?: FixtureResult;
}

export interface Series {
  id: string;
  stage: string;
  comp?: CompId; // play-off a que pertence (omisso = Liga Placard)
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
  esp?: { halfTable?: string[]; regularTable?: string[] }; // o mesmo para a Primera División
  ita?: { halfTable?: string[]; regularTable?: string[]; playIn?: boolean; playout?: boolean }; // Serie A italiana
  fra?: { regularTable?: string[]; seeds?: string[] }; // D1 Futsal francesa
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
