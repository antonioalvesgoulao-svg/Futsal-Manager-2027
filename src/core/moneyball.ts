// "Moneyball": nível real de cada jogador a partir do historial das últimas épocas.
// Fonte: zerozero (jogos e golos por época, todas as competições), em src/data/<país>/history.json
//
// Para cada época calcula-se um desempenho na escala mundial 1-100:
//   nível da equipa onde jogou
//   + confiança do treinador (jogos realizados face ao esperado nessa equipa)
//   + produtividade (golos por jogo face ao esperado para a posição, para o domínio da equipa na sua liga,
//     e descontada pela força da liga: marcar muito numa liga fraca vale pouco)
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
  productivity: number; // golos face ao esperado, já ajustado à força das ligas (1 = normal)
}

// Peso de cada época (a atual, ainda curta, pesa menos)
const SEASON_WEIGHT: Record<string, number> = { '26': 0.5, '25': 1, '24': 0.75, '23': 0.5, '22': 0.35, '21': 0.25 };

// Golos por jogo esperados para uma equipa a meio da sua liga
const EXPECTED_GPG: Record<Position, number> = { GR: 0.02, FIX: 0.18, 'FIX/ALA': 0.25, UNI: 0.32, ALA: 0.38, 'ALA/PIV': 0.45, PIV: 0.5 };

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
  // nomes como aparecem no futsalportugal.com (FPF)
  'Sporting CP': 94, 'SL Benfica': 95, 'Leões de Porto Salvo': 70, 'SC Ferreira do Zêzere/Zêzerovo': 60, 'Eléctrico FC': 66, 'Rio Ave FC': 64,
  'UP Venda Nova': 58, 'Portimonense SC': 63, 'SCU Torreense': 62,
  // Espanha: nomes como aparecem no futsalportugal.com (Liga Prime Futsal e ex-1.ª divisão; estimativa na escala mundial)
  'FC Barcelona': 97, 'Islas Baleares Palma Futsal': 95, 'Jimbee Cartagena FS': 94, 'ElPozo Murcia': 92, 'Inter FS': 91, 'Jaén Paraíso Interior': 84,
  'Viña Albali Valdepeñas': 80, 'Peñíscola FS': 78, 'Quesos El Higaldo Manzanares FS': 76, 'Industrias Santa Coloma': 74, 'Osasuna Magna Xota FS': 77,
  'Noia Portus Apostoli': 74, 'Córdoba Patrimonio': 77, 'Wanapix AD Sala 10 Zaragoza': 77, 'Real Betis Futsal': 76, 'O Parrulo Ferrol': 75,
  'Levante UD': 80, 'Ribera Navarra FS': 78, 'Sur Seeds El Ejido Futsal': 74, 'BeSoccer CD UMA Antequera': 74, 'Burela FS': 70, 'Alzira FS': 68,
  // Brasil (LNF), Cazaquistão e outros que aparecem no historial dos jogadores da Liga Prime
  'Kairat Almaty': 82, Joinville: 78, 'Jaraguá Futsal': 76, 'Pato Futsal': 76, 'Magnus Futsal': 80, 'São José Futsal': 72, 'Foz Cataratas Futsal': 72,
  'Cascavel Futsal': 76, 'Carlos Barbosa': 78, Corinthians: 76, 'Joaçaba Futsal': 72, 'Santo André': 70, Blumenau: 70, 'Atlântico': 72,
  'Royal Sporting Anderlecht Futsal': 82, 'Etoile Lavalloise': 70, 'Haladás VSE': 64, 'FK Chrudim': 68, 'Uragan Ivano-Frankivsk': 70, 'MNK Olmissum': 66, ACCS: 66,
  // Itália (Serie A): nomes canónicos de tools/ita/build_matchstats.py; clubes atuais com o nível do jogo, os outros estimativa
  'Meta Catania': 82, 'Napoli Futsal': 80, 'L84 Torino': 81, 'Feldi Eboli': 77, 'Sandro Abate': 74, 'Came Treviso': 73, 'Sporting Sala Consilina': 71, 'Roma 1927': 69, 'Benevento 5': 68, 'Active Network': 67, 'Giovinazzo C5': 64, 'Petrarca Padova': 64, 'Capurso': 63, 'Olimpus Roma': 76, 'Real San Giuseppe': 72, 'Futsal Pescara': 72, 'Ciampino Aniene': 68, 'Sporting Ciampino': 62, 'CMB Matera': 72, '360 GG Monastir': 64, 'Città di Melilli': 62, 'Futsal Polistena': 62, 'Nuova Comauto Pistoia': 62, 'Olimpia Verona': 60, 'Saviatesta Mantova': 64, 'Lido di Ostia': 66, 'Manfredonia C5': 62, 'Pirossigeno Cosenza': 64, 'CDM Futsal': 62,
  // Estrangeiro
  Barcelona: 96, 'ElPozo Murcia Costa Cálida': 90, 'Illes Balears Palma': 93,
  'Real Betis': 78, Levante: 82, 'Ribera Navarra': 80, 'ETB Calviá': 55, 'Wanapix AD Sala 10': 70,
  'HIT Kiev': 76, Tyumen: 78, Sibiryak: 74, Atyrau: 72, 'Kaspiy Aktau': 70, Ordabasy: 72, Anderlecht: 82, 'Riga FC': 62,
  'Al-Nassr': 60, 'Al-Qadisiyah': 60, 'Al-Tadhamon': 55, 'Al-Ula FC': 62, 'Al-Riyadh': 58, 'Ecocity Genzano': 72,
  'Fortitudo Pomezia': 74, 'Italservice Pesaro': 76, Canosa: 60, Magallanes: 50, 'Nyírbátori': 66, 'Haladás': 64,
  'MNK Osijek': 58, 'Futsal Pula': 60, 'Novo Vrijeme': 64, 'Panta Walon': 64, Omonia: 62, 'New Vision Georgians': 55,
  'United Galati': 66, 'Araz Naxçivan': 72, 'Piast Gliwice': 72, 'KS Constract Lubawa': 74, 'Svarog FC Teplice': 60,
};

/**
 * Força da liga onde cada equipa joga (escala mundial). Uma equipa muito acima da sua liga
 * domina os jogos e os seus jogadores marcam mais com facilidade.
 */
const LEAGUE_OF: Record<string, number> = {
  'FC Barcelona': 92, 'Islas Baleares Palma Futsal': 92, 'Jimbee Cartagena FS': 92, 'ElPozo Murcia': 92, 'Inter FS': 92, 'Peñíscola FS': 92,
  'Quesos El Higaldo Manzanares FS': 92, 'Industrias Santa Coloma': 92, 'Osasuna Magna Xota FS': 92, 'Noia Portus Apostoli': 92, 'Córdoba Patrimonio': 92,
  'Wanapix AD Sala 10 Zaragoza': 92, 'Real Betis Futsal': 92, 'O Parrulo Ferrol': 92, 'Levante UD': 92, 'Ribera Navarra FS': 92, 'Sur Seeds El Ejido Futsal': 92,
  'BeSoccer CD UMA Antequera': 92, 'Burela FS': 80, 'Alzira FS': 65,
  'Kairat Almaty': 70, Joinville: 75, 'Jaraguá Futsal': 75, 'Pato Futsal': 75, 'Magnus Futsal': 75, 'São José Futsal': 75, 'Foz Cataratas Futsal': 75,
  'Cascavel Futsal': 75, 'Carlos Barbosa': 75, Corinthians: 75, 'Joaçaba Futsal': 75, 'Santo André': 75, Blumenau: 75, 'Atlântico': 75,
  'Royal Sporting Anderlecht Futsal': 58, 'Etoile Lavalloise': 55, 'Haladás VSE': 55, 'FK Chrudim': 58, 'Uragan Ivano-Frankivsk': 62, 'MNK Olmissum': 55, ACCS: 55,
  // Espanha (a mais forte)
  Barcelona: 92, 'ElPozo Murcia Costa Cálida': 92, 'Illes Balears Palma': 92, 'Viña Albali Valdepeñas': 92, 'Jaén Paraíso Interior': 92,
  'Real Betis': 92, Levante: 92, 'Ribera Navarra': 92, 'Wanapix AD Sala 10': 72, 'ETB Calviá': 50,
  // Outras ligas europeias
  'HIT Kiev': 62, Tyumen: 76, Sibiryak: 76, Atyrau: 70, 'Kaspiy Aktau': 70, Ordabasy: 70, Anderlecht: 58, 'Riga FC': 42,
  'Ecocity Genzano': 72, 'Fortitudo Pomezia': 72, 'Italservice Pesaro': 72, Canosa: 60, 'Nyírbátori': 55, 'Haladás': 55,
  'MNK Osijek': 55, 'Futsal Pula': 55, 'Novo Vrijeme': 55, 'Panta Walon': 50, Omonia: 45, 'New Vision Georgians': 42,
  'United Galati': 52, 'Araz Naxçivan': 55, 'Piast Gliwice': 65, 'KS Constract Lubawa': 65, 'Svarog FC Teplice': 58,
  // Serie A italiana (estimativa: abaixo da Liga Placard e da Liga Prime)
  'Meta Catania': 70, 'Napoli Futsal': 70, 'L84 Torino': 70, 'Feldi Eboli': 70, 'Sandro Abate': 70, 'Came Treviso': 70, 'Sporting Sala Consilina': 70, 'Roma 1927': 70, 'Benevento 5': 70, 'Active Network': 70, 'Giovinazzo C5': 70, 'Petrarca Padova': 70, 'Capurso': 70, 'Olimpus Roma': 70, 'Real San Giuseppe': 70, 'Futsal Pescara': 70, 'Ciampino Aniene': 70, 'Sporting Ciampino': 70, 'CMB Matera': 70, '360 GG Monastir': 70, 'Città di Melilli': 70, 'Futsal Polistena': 70, 'Nuova Comauto Pistoia': 70, 'Olimpia Verona': 70, 'Saviatesta Mantova': 70, 'Lido di Ostia': 70, 'Manfredonia C5': 70, 'Pirossigeno Cosenza': 70, 'CDM Futsal': 70,
  // Médio Oriente e América do Sul
  'Al-Nassr': 48, 'Al-Qadisiyah': 48, 'Al-Ula FC': 48, 'Al-Riyadh': 48, 'Al-Tadhamon': 42, Magallanes: 38,
};
// Liga Placard (média da 1.ª divisão portuguesa); equipas portuguesas fora da lista estão em divisões inferiores
const PT_FIRST_DIVISION = 72;

function leagueLevel(clean: string) {
  if (LEAGUE_OF[clean] != null) return LEAGUE_OF[clean];
  if (TEAM_LEVELS[clean] != null) return PT_FIRST_DIVISION;
  return UNKNOWN_LEVEL;
}

// Equipas desconhecidas: na maioria divisões inferiores portuguesas
const UNKNOWN_LEVEL = 42;
// Escalões de formação aparecem com o nome do clube; até aos 19 anos conta como nível de formação
const YOUTH_AGE = 19;
const YOUTH_LEVEL = 42;

export function teamLevel(name: string, ageAtSeason = 99) {
  const clean = name.replace(/\s*\[.*?\]/g, '').replace(/\s*\(E\)/g, '').trim();
  const lvl = TEAM_LEVELS[clean] ?? UNKNOWN_LEVEL;
  const league = leagueLevel(clean);
  if (ageAtSeason <= YOUTH_AGE) return { team: Math.min(lvl, YOUTH_LEVEL), league: YOUTH_LEVEL };
  return { team: lvl, league };
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function computeMoneyball(rows: SeasonRow[], pos: Position, ageNow: number): Moneyball | null {
  let wSum = 0;
  let lvl = 0;
  let gpgW = 0;
  let expW = 0;
  let availW = 0;
  let prodW = 0;
  for (const r of rows) {
    const base = SEASON_WEIGHT[r.s];
    if (!base || r.games <= 0) continue;
    const { team: tl, league: ll } = teamLevel(r.team, ageNow - (26 - Number(r.s)));
    // épocas com poucos jogos pesam menos
    const w = base * Math.min(1, r.games / 8);
    const expectedGames = tl >= 85 ? 42 : tl >= 70 ? 34 : 28;
    const avail = clamp(r.games / expectedGames, 0, 1.1);
    const gpg = r.goals / r.games;
    // equipa dominante na sua liga: espera-se mais golo de cada jogador
    const exp = EXPECTED_GPG[pos] * clamp(1 + (tl - ll) / 33, 0.6, 1.8);
    // a produtividade só vale tanto quanto a liga: numa liga fraca é descontada
    const leagueFactor = clamp(ll / 80, 0.3, 1.1);
    const ratio = gpg / Math.max(0.02, exp);
    // marcar pouco penaliza menos do que marcar muito beneficia (as assistências não estão nos dados)
    const prod = clamp((ratio - 1) * 8, -3, 10) * PROD_WEIGHT[pos] * leagueFactor;
    const perf = tl + 14 * (avail - 0.6) + prod;
    lvl += perf * w;
    gpgW += gpg * w;
    expW += exp * w;
    availW += avail * w;
    prodW += (1 + Math.max(-0.4, ratio - 1) * leagueFactor) * w;
    wSum += w;
  }
  if (wSum < 0.3) return null;
  return {
    level: clamp(lvl / wSum, 20, 105),
    seasons: rows.filter((r) => SEASON_WEIGHT[r.s] && r.games > 0).length,
    goalsPerGame: gpgW / wSum,
    expectedGpg: expW / wSum,
    availability: availW / wSum,
    productivity: prodW / wSum,
  };
}
