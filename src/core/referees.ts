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

/** Clássicos espanhóis (estimativa): dérbi de Múrcia (ElPozo x Cartagena) e jogos entre os 5 grandes. */
const ESP_BIG = ['bar', 'epz', 'pal', 'jca', 'int'];

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
  const all = f.comp === 'esp' || f.comp === 'espPlayoff' || f.comp === 'copaRey' || f.comp === 'copaEsp' || f.comp === 'superEsp' ? REF_PAIRS_ESP : REF_PAIRS;
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

const FLAG_ES = `<svg viewBox="0 0 30 20" width="21" height="14" style="vertical-align:-2px;border-radius:2px"><rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/></svg>`;

/** Dupla de arbitragem com a bandeira e uma barra de severidade (verde, pouco cheia → vermelha, cheia). */
export function refBadgeHtml(p: RefPair) {
  const sv = severity(p);
  const w = Math.round(12 + sv * 88);
  const col = `hsl(${Math.round(120 - sv * 120)}, 75%, 45%)`;
  const FL = p.id.startsWith('e') ? FLAG_ES : FLAG_PT;
  return `<span class="refb">${FL} ${p.names[0]} ${FL} ${p.names[1]}${p.real ? '' : ' <span class="small muted">(nomes fictícios)</span>'} <span class="refbar" title="Severidade: ${TEMPER_LABEL(p)}"><i style="width:${w}%;background:${col}"></i></span> <span class="small muted">${TEMPER_LABEL(p)}</span></span>`;
}
