// Aspeto de cada jogador para o 3D: tom de pele, cabelo, barba, altura e cor das sapatilhas.
// Sem fotos (não se usam fotos reais): é gerado de forma fixa a partir do jogador, com
// probabilidades conforme a nacionalidade e a idade, e é sempre o mesmo em todos os jogos.
// Jogadores reais: traços descritos a partir das fotos do zerozero (src/data/por/looks.json, recolha de 2/11/2026).
// Para acertar um jogador concreto basta acrescentá-lo a LOOKS.
import REAL from '../data/por/looks.json';

export type HairStyle = 'rapado' | 'curto' | 'degrade' | 'encaracolado' | 'afro' | 'comprido' | 'apanhado' | 'crista' | 'careca';
export type Beard = 'nenhuma' | 'curta' | 'cheia' | 'bigode';

export interface Look {
  skin: string;
  hair: string;
  style: HairStyle;
  beard: Beard;
  height: number; // metros
  boots: [string, string]; // cor das sapatilhas e dos pormenores (sola, risca)
  face?: 'redonda' | 'oval' | 'comprida' | 'quadrada';
  marks?: string[]; // rastas, tranças, pera, franja, entradas, brinco, olhosClaros, sobrancelhas, descolorado, tatuagem
}

interface RealLook { skin: number; hair?: keyof typeof HAIR; style: HairStyle; beard?: Beard; face?: Look['face']; notes?: string }
const REAL_LOOKS = REAL as Record<string, RealLook>;

function marksOf(notes = '', style: HairStyle) {
  const n = notes.toLowerCase(), m: string[] = [];
  const k: [RegExp, string][] = [[/rastas/, 'rastas'], [/tran[çc]as/, 'trancas'], [/pera/, 'pera'], [/franja/, 'franja'], [/entradas/, 'entradas'], [/brinco/, 'brinco'], [/olhos claros/, 'olhosClaros'], [/sobrancelhas/, 'sobrancelhas'], [/descolorad/, 'descolorado'], [/tatuage/, 'tatuagem'], [/brancos/, 'barbaGrisalha'], [/arruivad/, 'barbaRuiva'], [/para tr[áa]s/, 'paraTras'], [/ondulado/, 'ondulado']];
  for (const [re, v] of k) if (re.test(n)) m.push(v);
  if (style === 'comprido' && /rastas|tran/.test(n) && !m.includes('rastas')) m.push('rastas');
  return m;
}

const BOOTS: [string, string][] = [
  ['#111111', '#ffffff'], ['#ffffff', '#111111'], ['#ffffff', '#e11d48'], ['#d9f99d', '#111111'], ['#facc15', '#111111'],
  ['#f97316', '#ffffff'], ['#ec4899', '#ffffff'], ['#2563eb', '#ffffff'], ['#dc2626', '#ffffff'], ['#16a34a', '#ffffff'],
  ['#9ca3af', '#111111'], ['#22d3ee', '#1e3a8a'], ['#7c3aed', '#fde047'], ['#0f172a', '#f97316'], ['#f5f5f4', '#2563eb'],
];
// tons de pele com o vermelho natural da pele (sem ele parecem madeira)
const SKINS = ['#f3cbb4', '#e6b095', '#d49a7a', '#bf8160', '#a0644a', '#7d4a33', '#5c3524', '#432517'];
const HAIR = { preto: '#141414', castanhoEscuro: '#2e1e14', castanho: '#55361f', castanhoClaro: '#8a6240', loiro: '#c9a15a', ruivo: '#9c4a22', grisalho: '#8d8d8d' };

// distribuição de tons de pele (índices de SKINS) por nacionalidade
const SKIN_BY: Record<string, number[]> = {
  Portugal: [0, 1, 1, 1, 2, 2, 2, 3, 4, 5],
  Brasil: [0, 1, 1, 2, 2, 3, 3, 4, 5, 6],
  'Cabo Verde': [3, 4, 4, 5, 5, 6, 6, 7],
  Angola: [5, 6, 6, 7, 7],
  'São Tomé e Príncipe': [5, 6, 6, 7],
  Ucrânia: [0, 0, 1],
  Rússia: [0, 0, 1],
  Itália: [1, 1, 2, 2],
  Espanha: [1, 1, 2, 2],
  Argentina: [0, 1, 1, 2, 2],
  Chile: [1, 2, 2, 3],
  Marrocos: [2, 3, 3, 4], Paraguai: [1, 2, 3, 3], Uruguai: [0, 1, 1, 2], Venezuela: [1, 2, 3, 4, 5], Colômbia: [1, 2, 3, 4, 5],
  Japão: [1, 1, 2], Irão: [1, 2, 2, 3], França: [0, 1, 2, 4, 6], Croácia: [0, 0, 1], Cazaquistão: [1, 2], Peru: [2, 3, 3], Equador: [2, 3, 4],
};

/** Correções manuais (jogador -> aspeto), quando se souber como é na realidade. */
export const LOOKS: Record<string, Partial<Look>> = {};

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let s = h >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)), ((s ^= s >>> 16) >>> 0) / 4294967296);
}

function pickW<T>(r: () => number, items: [T, number][]): T {
  let x = r() * items.reduce((a, i) => a + i[1], 0);
  for (const [v, w] of items) { x -= w; if (x <= 0) return v; }
  return items[0][0];
}

export function lookOf(p: { id: string; nationality?: string; age?: number; position?: string }): Look {
  const r = rng(p.id + 'aspeto');
  const nat = p.nationality ?? 'Portugal';
  const opts = SKIN_BY[nat] ?? SKIN_BY.Portugal;
  const si = opts[Math.floor(r() * opts.length)];
  const dark = si >= 5;
  const age = p.age ?? 26;
  let hair: string = dark
    ? pickW(r, [[HAIR.preto, 8], [HAIR.castanhoEscuro, 2]])
    : pickW(r, [[HAIR.preto, 3], [HAIR.castanhoEscuro, 5], [HAIR.castanho, 4], [HAIR.castanhoClaro, si <= 1 ? 2 : 0.6], [HAIR.loiro, si <= 1 ? 1.4 : 0.2], [HAIR.ruivo, si === 0 ? 0.4 : 0.05]]);
  if (age >= 33 && r() < (age - 31) * 0.08) hair = HAIR.grisalho;
  let style: HairStyle = dark
    ? pickW<HairStyle>(r, [['rapado', 4], ['degrade', 5], ['afro', 1.5], ['encaracolado', 2], ['crista', 0.6], ['careca', 0.8], ['apanhado', 0.4]])
    : pickW<HairStyle>(r, [['curto', 5], ['degrade', 4], ['rapado', 2], ['encaracolado', 1.2], ['comprido', 0.8], ['apanhado', 0.7], ['crista', 0.4], ['careca', 0.5]]);
  if (age >= 31 && r() < (age - 29) * 0.04) style = r() < 0.5 ? 'careca' : 'rapado';
  const beard = pickW<Beard>(r, [['nenhuma', age < 22 ? 6 : 3], ['curta', 3.5], ['cheia', age >= 25 ? 2.5 : 0.6], ['bigode', 0.3]]);
  // altura: os guarda-redes são em média mais altos
  const gk = p.position === 'GR';
  const height = Math.round((1.77 + (r() + r() + r() - 1.5) * 0.07 + (gk ? 0.06 : 0)) * 100) / 100;
  // sapatilhas: cada jogador tem as suas cores
  const boots = BOOTS[Math.floor(r() * BOOTS.length)];
  const real = REAL_LOOKS[p.id];
  if (real) {
    const rl: Partial<Look> = { skin: SKINS[Math.max(0, Math.min(7, real.skin - 1))], style: real.style, face: real.face, marks: marksOf(real.notes, real.style) };
    if (real.hair) rl.hair = HAIR[real.hair];
    if (real.beard) rl.beard = real.beard;
    return { skin: SKINS[si], hair, style, beard, height, boots, face: 'oval', marks: [], ...rl, ...LOOKS[p.id] };
  }
  return { skin: SKINS[si], hair, style, beard, height, boots, face: r() < 0.6 ? 'oval' : (['redonda', 'comprida', 'quadrada'] as const)[Math.floor(r() * 3)], marks: [], ...LOOKS[p.id] };
}
