// Duplas de arbitragem (Portugal) e tensão dos jogos.
// Árbitros reais de futsal (lista indicada pelo António). As duplas foram sorteadas e o temperamento de
// cada dupla foi sorteado à volta das médias da Liga Placard (estimativa: ~4 amarelos e ~0,3 vermelhos
// por jogo, a partir dos totais por equipa no zerozero/futsalportugal; faltas por jogo não publicadas).
//  - tolerance: aceita mais contacto (>1 = menos faltas assinaladas)
//  - cards: tendência para mostrar cartões (>1 = mais)
//  - harsh: severidade nos confrontos (>1 = mais vermelhos)
import { kindOf, type Fixture } from './season/types';
import { leagueTable } from './season/season';
import type { GameState } from './types';

export interface RefPair { id: string; names: [string, string]; tolerance: number; cards: number; harsh: number; real: boolean; top: boolean }

export const REF_PAIRS: RefPair[] = [
  { id: 'd1', names: ['Wilson Soares', 'Filipe Duarte'], tolerance: 1.11, cards: 1.26, harsh: 1.2, real: true, top: true },
  { id: 'd2', names: ['Francisco Costa', 'Rafael Silva'], tolerance: 0.8, cards: 0.88, harsh: 1.09, real: true, top: true },
  { id: 'd3', names: ['Eduardo Coelho', 'Renato Pereira'], tolerance: 1.08, cards: 0.88, harsh: 1.23, real: true, top: true },
  { id: 'd4', names: ['Miguel Castilho', 'Tiago Silva'], tolerance: 0.91, cards: 0.94, harsh: 0.95, real: true, top: true },
  { id: 'd5', names: ['André Franco', 'João Sinval'], tolerance: 1.04, cards: 0.92, harsh: 1.02, real: true, top: false },
  { id: 'd6', names: ['João Cunha', 'Dany Garcez'], tolerance: 0.91, cards: 1.0, harsh: 1.07, real: true, top: false },
  { id: 'd7', names: ['Rúben Santos', 'Gustavo Pereira'], tolerance: 1.17, cards: 0.98, harsh: 0.95, real: true, top: false },
  { id: 'd8', names: ['Maurício Couto', 'Nuno Matias'], tolerance: 1.03, cards: 1.09, harsh: 1.18, real: true, top: false },
  { id: 'd9', names: ['Pedro Costa', 'David Pereira'], tolerance: 1.13, cards: 1.1, harsh: 0.76, real: true, top: false },
  { id: 'd10', names: ['João Lobão', 'Jaime Martins'], tolerance: 0.94, cards: 0.85, harsh: 1.09, real: true, top: false },
  { id: 'd11', names: ['Alexandre Costa', 'Bruno Araújo'], tolerance: 1.01, cards: 1.07, harsh: 0.79, real: true, top: false },
  { id: 'd12', names: ['José Moreira', 'Cristiano Santos'], tolerance: 0.91, cards: 0.9, harsh: 0.84, real: true, top: false },
];

// Espanha: os 43 árbitros reais da 1.ª divisão (Guía RFEF 2025/26, futsal.rfef.es), em duplas sorteadas; as 6 duplas com mais
// épocas na Liga Prime são as de topo. Temperamento sorteado à volta das médias, como em Portugal (estimativa).
export const REF_PAIRS_ESP: RefPair[] = [
  { id: 'e1', names: ['Aitor Felipe', 'Alberto Sarabia'], tolerance: 1.13, cards: 1.13, harsh: 1.04, real: true, top: true }, // Vasco / Riojano, 24+6 épocas na 1.ª
  { id: 'e2', names: ['Fernando Faubell', 'Juan José Cordero'], tolerance: 0.81, cards: 1.13, harsh: 0.93, real: true, top: true }, // Aragonés / Andaluz, 4+23 épocas na 1.ª
  { id: 'e3', names: ['Héctor Mayo', 'Alejandro Martínez'], tolerance: 0.96, cards: 1.01, harsh: 1.04, real: true, top: true }, // Madrileño / Murciano, 7+19 épocas na 1.ª
  { id: 'e4', names: ['Pedro Antonio Carrillo', 'Javier Moreno'], tolerance: 0.99, cards: 0.9, harsh: 1.0, real: true, top: true }, // Andaluz / Andaluz, 8+17 épocas na 1.ª
  { id: 'e5', names: ['Fermin A. Sánchez-Molina', 'Cristian Cubero'], tolerance: 1.09, cards: 1.09, harsh: 1.0, real: true, top: true }, // Castellano - Manchego / Madrileño, 23+2 épocas na 1.ª
  { id: 'e6', names: ['Francesc García Donas', 'Antonio Pablo Navarro'], tolerance: 1.15, cards: 0.95, harsh: 0.96, real: true, top: true }, // Catalán / Castellano - Leonés, 18+6 épocas na 1.ª
  { id: 'e7', names: ['David Urdanoz', 'Eder Gómez De Salazar'], tolerance: 1.15, cards: 1.04, harsh: 1.01, real: true, top: false }, // Navarro / Vasco, 20+3 épocas na 1.ª
  { id: 'e8', names: ['Tomás Santander', 'Sergio Salomé'], tolerance: 0.81, cards: 0.94, harsh: 0.82, real: true, top: false }, // Aragonés / Extremeño, 13+6 épocas na 1.ª
  { id: 'e9', names: ['Pablo Delgado', 'Víctor Toca'], tolerance: 0.82, cards: 1.13, harsh: 1.19, real: true, top: false }, // Valenciano / Cántabro, 11+6 épocas na 1.ª
  { id: 'e10', names: ['Carlos Rodrigo', 'Javier Menendez'], tolerance: 0.84, cards: 1.1, harsh: 0.99, real: true, top: false }, // Castellano - Manchego / Gallego, 12+5 épocas na 1.ª
  { id: 'e11', names: ['Héctor Vilas', 'Diego Martínez'], tolerance: 0.98, cards: 0.94, harsh: 1.19, real: true, top: false }, // Gallego / Balear, 5+11 épocas na 1.ª
  { id: 'e12', names: ['Carlos Panadero', 'Rubén Ferrero'], tolerance: 1.04, cards: 1.03, harsh: 0.99, real: true, top: false }, // Madrileño / Gallego, 7+7 épocas na 1.ª
  { id: 'e13', names: ['Jorge González', 'Antonio Jesús García'], tolerance: 1.15, cards: 1.24, harsh: 1.02, real: true, top: false }, // Castellano - Leonés / Andaluz, 11+3 épocas na 1.ª
  { id: 'e14', names: ['Iván López', 'Luis M. Sánchez'], tolerance: 1.01, cards: 1.12, harsh: 0.91, real: true, top: false }, // Catalán / Castellano - Leonés, 3+11 épocas na 1.ª
  { id: 'e15', names: ['Carlos Enrique Bustos', 'Andrés Botella'], tolerance: 1.1, cards: 1.05, harsh: 0.99, real: true, top: false }, // Andaluz / Murciano, 8+5 épocas na 1.ª
  { id: 'e16', names: ['Sergio Sánchez', 'Samuel Gabaldón'], tolerance: 1.14, cards: 1.02, harsh: 0.9, real: true, top: false }, // Cántabro / Valenciano, 6+5 épocas na 1.ª
  { id: 'e17', names: ['Oscar Ropero', 'Jairo Leiva'], tolerance: 0.9, cards: 0.86, harsh: 1.07, real: true, top: false }, // Valenciano / Andaluz, 8+2 épocas na 1.ª
  { id: 'e18', names: ['Alberto Carrión', 'Manuel Jesús Barrilero'], tolerance: 1.03, cards: 1.03, harsh: 1.01, real: true, top: false }, // Castellano - Manchego / Andaluz, 4+5 épocas na 1.ª
  { id: 'e19', names: ['José Lázaro', 'Jesús Almeida'], tolerance: 0.99, cards: 1.22, harsh: 0.88, real: true, top: false }, // Aragonés / Tinerfeño, 4+3 épocas na 1.ª
  { id: 'e20', names: ['Franciso José Castillo', 'Sergio Toral'], tolerance: 0.98, cards: 1.05, harsh: 1.16, real: true, top: false }, // Murciano / Castellano - Leonés, 5+2 épocas na 1.ª
  { id: 'e21', names: ['Francisco J. Marazuela', 'David Pizarro'], tolerance: 1.11, cards: 1.07, harsh: 1.2, real: true, top: false }, // Castellano - Leonés / Andaluz, 2+2 épocas na 1.ª
];

// Itália: 86 árbitros reais da C.A.N. 5 Élite 2026/27 (AIA, aia-figc.it, lista colada pelo António; nomes corrigidos da tradução
// automática) em 43 duplas sorteadas; as duplas de topo e o temperamento são estimativa (sorteio, sem dados de experiência).
export const REF_PAIRS_ITA: RefPair[] = [
  { id: 'i1', names: ['Alberto Onesti', 'Ivano Pubblico'], tolerance: 1.02, cards: 1.06, harsh: 1.06, real: true, top: true }, // Pescara / Roma 1
  { id: 'i2', names: ['Dominic Di Donato', 'Gianluigi Squilletti'], tolerance: 1.09, cards: 1.04, harsh: 1.17, real: true, top: true }, // Merano / Campobasso
  { id: 'i3', names: ['Daniel Fior', 'Roberto Galasso'], tolerance: 0.93, cards: 0.92, harsh: 1.05, real: true, top: true }, // Castelfranco Veneto / Aprilia
  { id: 'i4', names: ['Luca Di Battista', 'Rosario Angelo Faiella'], tolerance: 0.88, cards: 0.86, harsh: 1.13, real: true, top: true }, // Avezzano / Castellammare di Stabia
  { id: 'i5', names: ['Luca Paverani', 'Stefano Lavanna'], tolerance: 0.89, cards: 1.11, harsh: 1.09, real: true, top: true }, // Roma 2 / Pesaro
  { id: 'i6', names: ['Giulio Colombo', 'Giovanni Zannola'], tolerance: 0.85, cards: 0.99, harsh: 1.11, real: true, top: true }, // Bassano del Grappa / Ostia Lido
  { id: 'i7', names: ['Amedeo Lacalamita', 'Alessandro Accomando'], tolerance: 0.88, cards: 1.16, harsh: 0.99, real: true, top: false }, // Bari / Olbia
  { id: 'i8', names: ['Michele Romeo', 'Matteo Ottaviani'], tolerance: 0.95, cards: 1.12, harsh: 1.04, real: true, top: false }, // Roma 2 / Trieste
  { id: 'i9', names: ['Andrea Saggese', 'Elio Simone'], tolerance: 1.14, cards: 1.24, harsh: 1.13, real: true, top: false }, // Rovereto / Napoli
  { id: 'i10', names: ['Simone Zagno', 'Antonella Manca'], tolerance: 0.95, cards: 1.23, harsh: 0.96, real: true, top: false }, // Agropoli / Sassari
  { id: 'i11', names: ['Gabriele Pette', 'Andrea Cini'], tolerance: 1.00, cards: 1.01, harsh: 1.11, real: true, top: false }, // Bologna / Perugia
  { id: 'i12', names: ['Giovanni Agosta', 'Lorenzo Zorzi'], tolerance: 1.10, cards: 1.15, harsh: 1.04, real: true, top: false }, // Rovigo / Reggio Emilia
  { id: 'i13', names: ['Giacomo Voltarel', 'Andrea Salanitro'], tolerance: 1.03, cards: 1.18, harsh: 1.18, real: true, top: false }, // Treviso / Catania
  { id: 'i14', names: ['Nicola Maria Manzione', 'Andrea Guadagnini'], tolerance: 0.85, cards: 1.09, harsh: 0.95, real: true, top: false }, // Salerno / Castelfranco Veneto
  { id: 'i15', names: ['Daniele Conti', 'Domenico Saccà'], tolerance: 0.93, cards: 1.08, harsh: 1.09, real: true, top: false }, // Ancona / Reggio Calabria
  { id: 'i16', names: ['Chiara Perona', 'Bartolomeo Santarpia'], tolerance: 0.89, cards: 0.97, harsh: 0.97, real: true, top: false }, // Biella / Castellammare di Stabia
  { id: 'i17', names: ['Angelo Bottini', 'Gianluca Rutolo'], tolerance: 1.09, cards: 0.89, harsh: 0.97, real: true, top: false }, // Roma 1 / Chieti
  { id: 'i18', names: ['Antonio Carnazza', 'Raffaele Buonocore'], tolerance: 0.83, cards: 1.04, harsh: 1.15, real: true, top: false }, // Taranto / Castellammare di Stabia
  { id: 'i19', names: ['Stefano Prisco', 'Alessandro Desogus'], tolerance: 0.85, cards: 1.01, harsh: 1.08, real: true, top: false }, // Lecce / Carbonia
  { id: 'i20', names: ['Ivo Colangeli', 'Vincenzo Buzzacchino'], tolerance: 0.91, cards: 1.20, harsh: 1.07, real: true, top: false }, // Aprilia / Taranto
  { id: 'i21', names: ['Carlotta Filippi', 'Francesco Coco'], tolerance: 0.84, cards: 0.88, harsh: 1.22, real: true, top: false }, // Bergamo / Parma
  { id: 'i22', names: ['Antonio Dimundo', 'Marco Lupo'], tolerance: 0.89, cards: 0.88, harsh: 0.95, real: true, top: false }, // Molfetta / Palermo
  { id: 'i23', names: ['Andrea Barillà', 'Andrea Cattaneo'], tolerance: 0.94, cards: 1.08, harsh: 1.11, real: true, top: false }, // Cinisello Balsamo / Civitavecchia
  { id: 'i24', names: ['Andrea Salvatore Calì', 'Pasquale Giaquinto'], tolerance: 0.85, cards: 1.10, harsh: 1.11, real: true, top: false }, // Caltanissetta / Ostia Lido
  { id: 'i25', names: ['Martina Piccolo', 'Giovanni Loprete'], tolerance: 1.14, cards: 1.19, harsh: 1.01, real: true, top: false }, // Padova / Catanzaro
  { id: 'i26', names: ['Alessandro Soligo', 'Marco Moro'], tolerance: 1.10, cards: 1.13, harsh: 0.94, real: true, top: false }, // Castelfranco Veneto / Latina
  { id: 'i27', names: ['Francesco Saverio Mancuso', 'Fortunato Zangara'], tolerance: 1.00, cards: 1.22, harsh: 1.06, real: true, top: false }, // Lamezia Terme / Catanzaro
  { id: 'i28', names: ['Antonio D\'Addato', 'Denis Prekaj'], tolerance: 0.87, cards: 1.16, harsh: 0.91, real: true, top: false }, // Barletta / Treviglio
  { id: 'i29', names: ['Domenico De Candia', 'Ugo Ciccarelli'], tolerance: 0.96, cards: 1.13, harsh: 0.91, real: true, top: false }, // Molfetta / Napoli
  { id: 'i30', names: ['Francesco Sgueglia', 'Alessandro Mella'], tolerance: 0.87, cards: 0.92, harsh: 1.08, real: true, top: false }, // Finale Emilia / Roma 1
  { id: 'i31', names: ['Christopher Corsini', 'Antonio Napo'], tolerance: 1.07, cards: 1.06, harsh: 1.05, real: true, top: false }, // Taranto / Ercolano
  { id: 'i32', names: ['Fabio Loni', 'Davide Copat'], tolerance: 0.94, cards: 1.22, harsh: 1.06, real: true, top: false }, // Cagliari / Pordenone
  { id: 'i33', names: ['Emmanuel Nazareno Di Gregorio', 'David Plutino'], tolerance: 0.99, cards: 0.87, harsh: 1.17, real: true, top: false }, // Catania / Reggio Emilia
  { id: 'i34', names: ['Pierluigi Minardi', 'Emilio Romano'], tolerance: 1.13, cards: 0.92, harsh: 1.05, real: true, top: false }, // Cosenza / Nola
  { id: 'i35', names: ['Daniele Filannino', 'Antonio Dan Campanella'], tolerance: 1.03, cards: 0.89, harsh: 1.13, real: true, top: false }, // Jesi / Venosa
  { id: 'i36', names: ['Jacopo Giannelli', 'Giuseppe Lamorges'], tolerance: 1.00, cards: 0.97, harsh: 1.06, real: true, top: false }, // Bari / Palermo
  { id: 'i37', names: ['Vincenzo Cannistrà', 'Paolo Lorenzo Galanti'], tolerance: 0.82, cards: 1.24, harsh: 1.08, real: true, top: false }, // Catanzaro / Pescara
  { id: 'i38', names: ['Andrea Frau', 'Andrea Crescenzio'], tolerance: 0.96, cards: 0.86, harsh: 0.94, real: true, top: false }, // Carbonia / Aprilia
  { id: 'i39', names: ['Gioacchino Lattanzio', 'Thomas Vallecaro'], tolerance: 1.06, cards: 1.08, harsh: 1.04, real: true, top: false }, // Collegno / Salerno
  { id: 'i40', names: ['Emilio Viviani', 'Ionut Cristea'], tolerance: 1.12, cards: 0.87, harsh: 0.95, real: true, top: false }, // Nocera Inferiore / Albano Laziale
  { id: 'i41', names: ['Giuseppe Mansueto', 'Kenan Kreso'], tolerance: 0.94, cards: 0.91, harsh: 1.08, real: true, top: false }, // Treviso / Trieste
  { id: 'i42', names: ['Roberto Acella', 'Alessandro Carella'], tolerance: 0.89, cards: 0.95, harsh: 1.03, real: true, top: false }, // Macerata / Matera
  { id: 'i43', names: ['Salvatore Pagano', 'Mario Certa'], tolerance: 1.10, cards: 1.09, harsh: 0.97, real: true, top: false }, // Catania / Marsala
];


// França: 40 árbitros federais de futsal (D1 e D2) de documentos FFF citados no dossiê do António; lista por validar para 2026/27.
// 20 duplas sorteadas; duplas de topo e temperamento são estimativa
export const REF_PAIRS_FRA: RefPair[] = [
  { id: 'f1', names: ['Nebyl Rahal', 'Jordan Feltesse'], tolerance: 1.01, cards: 0.90, harsh: 1.18, real: true, top: true },
  { id: 'f2', names: ['Pierre Bouriez', 'Tarik El Ghourraf'], tolerance: 0.87, cards: 1.16, harsh: 0.99, real: true, top: true },
  { id: 'f3', names: ['Hachim Abdallah', 'Tristan Daniele'], tolerance: 0.89, cards: 0.89, harsh: 1.22, real: true, top: true },
  { id: 'f4', names: ['Mostapha Hallou', 'Simon Veissiere'], tolerance: 1.07, cards: 1.00, harsh: 0.91, real: true, top: true },
  { id: 'f5', names: ['Julien Lang', 'Benoit Chandelier'], tolerance: 0.86, cards: 1.09, harsh: 0.91, real: true, top: true },
  { id: 'f6', names: ['Samuel Le Tennier', 'El Houcine Maataoui'], tolerance: 1.03, cards: 1.07, harsh: 1.15, real: true, top: false },
  { id: 'f7', names: ['Nizar Ayadi', 'Karim Amejal'], tolerance: 0.95, cards: 1.05, harsh: 0.96, real: true, top: false },
  { id: 'f8', names: ['Yacine Oualaouch', 'Bryan François'], tolerance: 0.84, cards: 1.09, harsh: 1.15, real: true, top: false },
  { id: 'f9', names: ['Aurélien Uzan', 'Gerald Kieffer'], tolerance: 1.03, cards: 1.07, harsh: 1.08, real: true, top: false },
  { id: 'f10', names: ['Ala Eddine Diani', 'Joel Fernandes'], tolerance: 0.84, cards: 0.90, harsh: 1.04, real: true, top: false },
  { id: 'f11', names: ['Jérémy Deidda', 'Cristian Morar'], tolerance: 0.85, cards: 0.85, harsh: 1.00, real: true, top: false },
  { id: 'f12', names: ['Jonathan Presse', 'Toufik Ait Hammou'], tolerance: 0.93, cards: 0.96, harsh: 1.01, real: true, top: false },
  { id: 'f13', names: ['Damien Vasseur', 'Laurent Chabot'], tolerance: 0.97, cards: 0.93, harsh: 1.17, real: true, top: false },
  { id: 'f14', names: ['Thomas David', 'Fadil Darraz'], tolerance: 0.96, cards: 1.21, harsh: 0.97, real: true, top: false },
  { id: 'f15', names: ['Benjamin Sorbet', 'Benjamin Barbier'], tolerance: 1.01, cards: 1.04, harsh: 1.15, real: true, top: false },
  { id: 'f16', names: ['Mael Messaoudi', 'Océane Ordonez Gomez'], tolerance: 1.14, cards: 1.12, harsh: 1.08, real: true, top: false },
  { id: 'f17', names: ['Sofian Ouramdane', 'Rémi Fabre'], tolerance: 0.87, cards: 1.15, harsh: 1.11, real: true, top: false },
  { id: 'f18', names: ['Hatem Fekrane', 'Ahtman Belhadj'], tolerance: 0.83, cards: 0.89, harsh: 1.05, real: true, top: false },
  { id: 'f19', names: ['Marouane Abbad El Andaloussi', 'Victor Chaix'], tolerance: 0.85, cards: 0.95, harsh: 1.14, real: true, top: false },
  { id: 'f20', names: ['Clement Loire', 'Adrien Crumois'], tolerance: 0.85, cards: 0.95, harsh: 1.09, real: true, top: false },
];

/** Clássicos espanhóis (estimativa): dérbi de Múrcia (ElPozo x Cartagena) e jogos entre os 5 grandes. */
const ESP_BIG = ['bar', 'epz', 'pal', 'jca', 'int'];
/** Itália: os 4 mais fortes (estimativa) e o dérbi da Campânia (Napoli x Feldi Eboli). */
const ITA_BIG = ['cat', 'nap', 'l84', 'ebo'];
/** França: os mais fortes (estimativa) e o dérbi de Paris (Sporting Paris x Paris ACASA). */
const FRA_BIG = ['lav', 'spa', 'goa', 'mon'];

export const TEMPER_LABEL = (p: RefPair) =>
  `${p.tolerance >= 1.1 ? 'deixa jogar' : p.tolerance <= 0.9 ? 'apita muito' : 'critério médio'}, ${p.cards >= 1.15 ? 'cartões fáceis' : p.cards <= 0.9 ? 'poucos cartões' : 'cartões normais'}`;

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

/** Importância/tensão do jogo (0 a 1): dérbi, finais, play-off, eliminatórias, rivais próximos na tabela. */
export function importanceOf(s: GameState, f: Fixture): number {
  let imp = 0.15;
  const big = ['slb', 'scp'];
  if (big.includes(f.home) && big.includes(f.away)) imp += 0.5;
  else if ([f.home, f.away].sort().join('-') === 'epz-jca') imp += 0.45;
  else if (ESP_BIG.includes(f.home) && ESP_BIG.includes(f.away)) imp += 0.3;
  else if ([f.home, f.away].sort().join('-') === 'ebo-nap') imp += 0.35;
  else if (ITA_BIG.includes(f.home) && ITA_BIG.includes(f.away)) imp += 0.25;
  else if ([f.home, f.away].sort().join('-') === 'aca-spa') imp += 0.35;
  else if (FRA_BIG.includes(f.home) && FRA_BIG.includes(f.away)) imp += 0.25;
  if (/Final/.test(f.stage) && !/Meias|Quartos/.test(f.stage)) imp += 0.45;
  else if (kindOf(f.comp) === 'playoff') imp += 0.25;
  else if (f.knockout) imp += 0.15;
  if (kindOf(f.comp) === 'league') {
    const lg = s.leagues.find((l) => l.clubIds.includes(f.home));
    const t = leagueTable(s.season, lg?.clubIds ?? [], 99, f.comp);
    const ph = t.findIndex((r) => r.club === f.home), pa = t.findIndex((r) => r.club === f.away);
    if (ph >= 0 && pa >= 0 && t[0].p > 2) {
      const gap = Math.abs(t[ph].pts - t[pa].pts);
      if (gap <= 3) imp += 0.2; // o jogo pode trocar posições
      if (ph < 2 && pa < 2) imp += 0.2; // líderes
    }
  }
  return Math.min(1, imp);
}

/** Dupla nomeada: os jogos grandes vão para as duplas de topo. */
export function refereesFor(s: GameState, f: Fixture): RefPair {
  const imp = importanceOf(s, f);
  const all = f.comp === 'esp' || f.comp === 'espPlayoff' || f.comp === 'copaRey' || f.comp === 'copaEsp' || f.comp === 'superEsp' ? REF_PAIRS_ESP
    : f.comp === 'ita' || f.comp === 'itaPlayoff' || f.comp === 'coppaIta' || f.comp === 'superIta' ? REF_PAIRS_ITA : f.comp === 'fra' || f.comp === 'fraPlayoff' || f.comp === 'coupeFra' ? REF_PAIRS_FRA : REF_PAIRS;
  const pool = imp >= 0.5 ? all.filter((p) => p.top) : all;
  return pool[Math.floor(hash(f.id + s.season.year) * pool.length)];
}

/** Severidade da dupla (0 = deixa jogar, poucos cartões; 1 = apita muito, cartões fáceis, dura nos confrontos). */
export function severity(p: RefPair) {
  const v = ((2 - p.tolerance) + p.cards + p.harsh) / 3; // ~0,75 a ~1,3
  return Math.max(0, Math.min(1, (v - 0.75) / 0.55));
}

// bandeira de Portugal (desenho simples: verde, vermelho e esfera amarela)
const FLAG_PT = `<svg viewBox="0 0 30 20" width="21" height="14" style="vertical-align:-2px;border-radius:2px"><rect width="12" height="20" fill="#046a38"/><rect x="12" width="18" height="20" fill="#da291c"/><circle cx="12" cy="10" r="4.2" fill="#ffe900"/><circle cx="12" cy="10" r="2.4" fill="#da291c"/></svg>`;

const FLAG_IT = `<svg viewBox="0 0 30 20" width="21" height="14" style="vertical-align:-2px;border-radius:2px"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce2b37"/></svg>`;

const FLAG_ES = `<svg viewBox="0 0 30 20" width="21" height="14" style="vertical-align:-2px;border-radius:2px"><rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/></svg>`;

/** Dupla de arbitragem com a bandeira e uma barra de severidade (verde, pouco cheia → vermelha, cheia). */
export function refBadgeHtml(p: RefPair) {
  const sv = severity(p);
  const w = Math.round(12 + sv * 88);
  const col = `hsl(${Math.round(120 - sv * 120)}, 75%, 45%)`;
  const FL = p.id.startsWith('e') ? FLAG_ES : p.id.startsWith('i') ? FLAG_IT : FLAG_PT;
  return `<span class="refb">${FL} ${p.names[0]} ${FL} ${p.names[1]}${p.real ? '' : ' <span class="small muted">(nomes fictícios)</span>'} <span class="refbar" title="Severidade: ${TEMPER_LABEL(p)}"><i style="width:${w}%;background:${col}"></i></span> <span class="small muted">${TEMPER_LABEL(p)}</span></span>`;
}
