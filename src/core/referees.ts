// Duplas de arbitragem (Portugal) e tensão dos jogos.
// Árbitros reais de futsal (lista indicada pelo António). As duplas foram sorteadas e o temperamento de
// cada dupla foi sorteado à volta das médias da Liga Placard (estimativa: ~4 amarelos e ~0,3 vermelhos
// por jogo, a partir dos totais por equipa no zerozero/futsalportugal; faltas por jogo não publicadas).
//  - tolerance: aceita mais contacto (>1 = menos faltas assinaladas)
//  - cards: tendência para mostrar cartões (>1 = mais)
//  - harsh: severidade nos confrontos (>1 = mais vermelhos)
import type { Fixture } from './season/types';
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
  if (/Final/.test(f.stage) && !/Meias|Quartos/.test(f.stage)) imp += 0.45;
  else if (f.comp === 'playoff') imp += 0.25;
  else if (f.knockout) imp += 0.15;
  if (f.comp === 'liga') {
    const t = leagueTable(s.season, s.clubs.map((c) => c.id));
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
  const pool = imp >= 0.5 ? REF_PAIRS.filter((p) => p.top) : REF_PAIRS;
  return pool[Math.floor(hash(f.id + s.season.year) * pool.length)];
}
