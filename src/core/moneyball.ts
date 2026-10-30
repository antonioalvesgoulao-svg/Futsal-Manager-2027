// "Moneyball": nível real de cada jogador a partir do historial das últimas épocas.
// Fonte: zerozero (jogos e golos por época, todas as competições), em src/data/<país>/history.json
//
// Para cada época calcula-se um desempenho na escala mundial 1-100:
//   nível da equipa onde jogou
//   + confiança do treinador (jogos realizados face ao esperado nessa equipa)
//   + produtividade (golos por jogo face ao esperado para a posição e para a equipa)
// As épocas mais recentes pesam mais. O resultado substitui o nível do clube atual
// na geração de atributos, e a produtividade ajusta atributos concretos.
import type { Position } from './types';

export interface SeasonRow {
  s: string; // "25" = 2025/26
  team: string;
  games: number;
  goals: number;
}

export interface Moneyball {
  level: number; // nível estimado, escala mundial 1-100
  seasons: number; // épocas com dados usadas
  goalsPerGame: number; // ponderado
  expectedGpg: number; // esperado para a posição
  availability: number; // 0 a 1
}

// Peso de cada época (a atual, ainda curta, pesa menos)
const SEASON_WEIGHT: Record<string, number> = { '26': 0.5, '25': 1, '24': 0.75, '23': 0.5, '22': 0.35, '21': 0.25 };

// Golos por jogo esperados numa equipa de nível 70
const EXPECTED_GPG: Record<Position, number> = { GR: 0.02, FIX: 0.25, 'FIX/ALA': 0.35, UNI: 0.45, ALA: 0.55, 'ALA/PIV': 0.65, PIV: 0.75 };

// Peso da produtividade por posição (aos fixos e guarda-redes pede-se menos golo)
const PROD_WEIGHT: Record<Position, number> = { GR: 0, FIX: 0.4, 'FIX/ALA': 0.6, UNI: 0.8, ALA: 1, 'ALA/PIV': 1, PIV: 1 };

/**
 * Nível de equipas pelo nome, na escala mundial.
 * Clubes da base de dados usam o seu nível; os restantes vêm desta lista; desconhecidos ficam em 55.
 * Equipas B e de divisões inferiores ficam mais baixas.
 */
export const TEAM_LEVELS: Record<string, number> = {
  // Portugal: nomes como aparecem no zerozero (clubes atuais e que passaram pela Liga Placard)
  Sporting: 94, Benfica: 95, 'SC Braga': 82, 'AD Fundão': 72, 'Leões Porto Salvo': 70, 'Ferreira do Zêzere': 60,
  'Ferreira do Zêzere by Zêzerovo': 60, 'Eléctrico': 66, 'Eléctrico FC/ A MatosCar': 66, 'Rio Ave': 64, UPVN: 58,
  Portimonense: 63, 'FC Famalicão': 60, 'SCC/FC Famalicão': 58, Torreense: 62,
  'Quinta dos Lombos': 60, 'Modicus Bruval': 60, Modicus: 60, 'CR Candoso/Natcal': 58, 'Nun´Álvares': 58, 'Viseu 2001': 56,
  'Futsal Azeméis': 57, 'ADCR Caxinas Poça Barca': 55, 'AD Jorge Antunes': 52, Burinhosa: 52, Belenenses: 50, AMSAC: 50,
  'CF Sassoeiros': 50, 'Paços de Ferreira Redifogo Futsal': 52, 'Dínamo Sanjoanense': 48, 'CS São João': 48, Marítimo: 50,
  // Estrangeiro
  Barcelona: 96, 'ElPozo Murcia Costa Cálida': 90, 'Illes Balears Palma': 93, 'Viña Albali Valdepeñas': 84,
  'Jaén Paraíso Interior': 84, 'Real Betis': 78, Levante: 82, 'Ribera Navarra': 80, 'ETB Calviá': 55, 'Wanapix AD Sala 10': 70,
  'HIT Kiev': 76, Tyumen: 78, Sibiryak: 74, Atyrau: 72, 'Kaspiy Aktau': 70, Ordabasy: 72, Anderlecht: 82, 'Riga FC': 72,
  'Al-Nassr': 60, 'Al-Qadisiyah': 60, 'Al-Tadhamon': 55, 'Al-Ula FC': 62, 'Al-Riyadh': 58, 'Ecocity Genzano': 72,
  'Fortitudo Pomezia': 74, 'Italservice Pesaro': 76, Canosa: 60, Magallanes: 50, 'Nyírbátori': 66, 'Haladás': 64,
  'MNK Osijek': 58, 'Futsal Pula': 60, 'Novo Vrijeme': 64, 'Panta Walon': 64, Omonia: 62, 'New Vision Georgians': 55,
  'United Galati': 66, 'Araz Naxçivan': 72, 'Piast Gliwice': 72, 'KS Constract Lubawa': 74, 'Svarog FC Teplice': 60,
};

// Equipas desconhecidas: na maioria divisões inferiores portuguesas
const UNKNOWN_LEVEL = 42;
// Escalões de formação aparecem com o nome do clube; até aos 19 anos conta como nível de formação
const YOUTH_AGE = 19;
const YOUTH_LEVEL = 42;

export function teamLevel(name: string, ageAtSeason = 99) {
  const clean = name.replace(/\s*\[.*?\]/g, '').replace(/\s*\(E\)/g, '').trim();
  const lvl = TEAM_LEVELS[clean] ?? UNKNOWN_LEVEL;
  return ageAtSeason <= YOUTH_AGE ? Math.min(lvl, YOUTH_LEVEL) : lvl;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function computeMoneyball(rows: SeasonRow[], pos: Position, ageNow: number): Moneyball | null {
  let wSum = 0;
  let lvl = 0;
  let gpgW = 0;
  let expW = 0;
  let availW = 0;
  for (const r of rows) {
    const base = SEASON_WEIGHT[r.s];
    if (!base || r.games <= 0) continue;
    const tl = teamLevel(r.team, ageNow - (26 - Number(r.s)));
    // épocas com poucos jogos pesam menos
    const w = base * Math.min(1, r.games / 8);
    const expectedGames = tl >= 85 ? 42 : tl >= 70 ? 34 : 28;
    const avail = clamp(r.games / expectedGames, 0, 1.1);
    const gpg = r.goals / r.games;
    const exp = EXPECTED_GPG[pos] * (0.55 + 0.45 * (tl / 70));
    const prod = clamp((gpg / Math.max(0.02, exp) - 1) * 8, -6, 10) * PROD_WEIGHT[pos];
    const perf = tl + 14 * (avail - 0.6) + prod;
    lvl += perf * w;
    gpgW += gpg * w;
    expW += exp * w;
    availW += avail * w;
    wSum += w;
  }
  if (wSum < 0.3) return null;
  return {
    level: clamp(lvl / wSum, 20, 105),
    seasons: rows.filter((r) => SEASON_WEIGHT[r.s] && r.games > 0).length,
    goalsPerGame: gpgW / wSum,
    expectedGpg: expW / wSum,
    availability: availW / wSum,
  };
}
