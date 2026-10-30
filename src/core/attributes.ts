// Atributos de futsal (escala 1 a 20, como no FM) e respetiva geração.
import { Player, Position } from './types';

export const ATTR_GROUPS = {
  tecnicos: {
    label: 'Técnicos',
    attrs: {
      passe: 'Passe',
      rececao: 'Receção (sola)',
      drible: 'Drible / finta curta',
      finalizacao: 'Finalização',
      remate: 'Remate de meia distância',
      jogoCostas: 'Jogo de costas',
      desarme: 'Desarme',
      bolasParadas: 'Bolas paradas',
    },
  },
  mentais: {
    label: 'Mentais',
    attrs: {
      visao: 'Visão de jogo',
      decisoes: 'Decisões',
      posicionamento: 'Posicionamento',
      antecipacao: 'Antecipação',
      concentracao: 'Concentração',
      compostura: 'Compostura',
      trabalhoEquipa: 'Trabalho de equipa',
      agressividade: 'Agressividade',
      lideranca: 'Liderança',
    },
  },
  fisicos: {
    label: 'Físicos',
    attrs: {
      aceleracao: 'Aceleração',
      agilidade: 'Agilidade',
      resistencia: 'Resistência',
      forca: 'Força',
      equilibrio: 'Equilíbrio',
    },
  },
  guardaRedes: {
    label: 'Guarda-redes',
    attrs: {
      reflexos: 'Reflexos',
      umParaUm: 'Um para um',
      saidas: 'Saídas',
      jogoPes: 'Jogo com os pés',
    },
  },
} as const;

type Group = keyof typeof ATTR_GROUPS;
export type AttrKey = { [G in Group]: keyof (typeof ATTR_GROUPS)[G]['attrs'] }[Group];
export type Attributes = Record<AttrKey, number>;

export const ALL_ATTRS = Object.values(ATTR_GROUPS).flatMap((g) => Object.keys(g.attrs)) as AttrKey[];
const PHYSICAL = Object.keys(ATTR_GROUPS.fisicos.attrs) as AttrKey[];
const MENTAL = Object.keys(ATTR_GROUPS.mentais.attrs) as AttrKey[];
const GK = Object.keys(ATTR_GROUPS.guardaRedes.attrs) as AttrKey[];

// Perfil de cada posição: desvio em relação ao nível médio do jogador.
// Atributos não indicados ficam no nível médio. Os de GR ficam muito baixos nos jogadores de campo.
const PROFILES: Record<Position, Partial<Record<AttrKey, number>>> = {
  GR: {
    reflexos: 2, umParaUm: 2, saidas: 1, jogoPes: 0, posicionamento: 1, concentracao: 1, compostura: 0, agilidade: 1,
    passe: -1, drible: -6, finalizacao: -6, remate: -4, jogoCostas: -7, desarme: -4, bolasParadas: -5, aceleracao: -2,
  },
  FIX: {
    desarme: 3, posicionamento: 3, antecipacao: 2, passe: 1, concentracao: 2, forca: 2, lideranca: 1, agressividade: 1,
    drible: -2, finalizacao: -2, jogoCostas: -2, agilidade: -1,
  },
  'FIX/ALA': { desarme: 2, posicionamento: 1, passe: 1, resistencia: 1, trabalhoEquipa: 1, finalizacao: -1, jogoCostas: -2 },
  UNI: { passe: 1, decisoes: 1, trabalhoEquipa: 2, resistencia: 2, visao: 1, jogoCostas: -1 },
  ALA: {
    drible: 3, aceleracao: 2, agilidade: 2, rececao: 1, finalizacao: 1, remate: 1, resistencia: 1,
    desarme: -1, forca: -2, jogoCostas: -2,
  },
  'ALA/PIV': { finalizacao: 2, drible: 1, jogoCostas: 1, forca: 1, aceleracao: 1, desarme: -2 },
  PIV: {
    jogoCostas: 4, finalizacao: 3, forca: 3, equilibrio: 2, rececao: 2, compostura: 1,
    desarme: -2, aceleracao: -1, resistencia: -1, posicionamento: -1,
  },
};

// Peso dos atributos no valor global de cada posição
const KEY: Record<Position, AttrKey[]> = {
  GR: ['reflexos', 'umParaUm', 'saidas', 'jogoPes', 'posicionamento', 'concentracao', 'agilidade'],
  FIX: ['desarme', 'posicionamento', 'antecipacao', 'passe', 'concentracao', 'forca', 'decisoes'],
  'FIX/ALA': ['desarme', 'passe', 'posicionamento', 'drible', 'resistencia', 'decisoes', 'trabalhoEquipa'],
  UNI: ['passe', 'decisoes', 'trabalhoEquipa', 'resistencia', 'desarme', 'finalizacao', 'visao'],
  ALA: ['drible', 'aceleracao', 'agilidade', 'rececao', 'finalizacao', 'passe', 'decisoes'],
  'ALA/PIV': ['finalizacao', 'drible', 'jogoCostas', 'rececao', 'aceleracao', 'forca', 'compostura'],
  PIV: ['jogoCostas', 'finalizacao', 'forca', 'rececao', 'equilibrio', 'compostura', 'antecipacao'],
};

// Gerador aleatório com semente: o mesmo jogador tem sempre os mesmos atributos
export function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function gauss(r: () => number) {
  return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
}

// Efeito da idade no nível atual (pico entre os 24 e os 31)
function ageOffset(age: number) {
  if (age <= 17) return -3.5;
  if (age < 24) return -3.5 + (age - 17) * 0.5;
  if (age <= 32) return 0;
  return -Math.min(3, (age - 32) * 0.35);
}

const clamp = (v: number) => Math.max(1, Math.min(20, Math.round(v)));

export interface Generated {
  attrs: Attributes;
  potential: number; // valor global máximo esperado (1 a 20)
}

/**
 * Gera atributos a partir de:
 * - reputação do clube (nível médio do plantel)
 * - idade (jovens abaixo do pico, veteranos perdem físico mas ganham mental)
 * - posição (perfil)
 * - talento individual (aleatório, com semente)
 * - boost opcional (para estrelas conhecidas, editável em overrides.json)
 */
export interface DataHints {
  productivity: number; // golos por jogo / esperado (1 = normal)
  availability: number; // 0 a 1
}

export function generateAttributes(p: Player, level: number, boost = 0, hints?: DataHints): Generated {
  const r = rng(p.id + p.name);
  // Com dados reais o nível já reflete o rendimento: menos aleatoriedade e menos efeito da idade
  const talent = gauss(r) * (hints ? 0.5 : 1.3) + boost;
  const base = 3.5 + level * 0.11 + ageOffset(p.age) * (hints ? 0.35 : 1) + talent;
  const profile = PROFILES[p.position];
  const outfield = p.position !== 'GR';

  const attrs = {} as Attributes;
  for (const k of ALL_ATTRS) {
    let v = base + (profile[k] ?? 0) + gauss(r) * 1.4;
    if (outfield && GK.includes(k)) v = 1 + r() * 4;
    if (p.age > 31 && PHYSICAL.includes(k)) v -= (p.age - 31) * 0.3;
    if (p.age > 27 && MENTAL.includes(k)) v += Math.min(2, (p.age - 27) * 0.25);
    if (p.age < 21 && MENTAL.includes(k)) v -= 1;
    if (hints && (k === 'finalizacao' || k === 'remate')) v += Math.max(-2, Math.min(3, (hints.productivity - 1) * 2.2));
    if (hints && (k === 'resistencia' || k === 'trabalhoEquipa' || k === 'concentracao')) v += (hints.availability - 0.6) * 3;
    attrs[k] = clamp(v);
  }

  const current = overall(attrs, p.position);
  let potential = current;
  if (p.age < 24) potential += (24 - p.age) * (0.3 + r() * 0.6) + Math.max(0, talent) * 0.5;
  else if (p.age < 27) potential += r() * 1;
  return { attrs, potential: Math.min(20, Math.round(potential * 10) / 10) };
}

export function overall(a: Attributes, pos: Position) {
  const k = KEY[pos];
  return Math.round((k.reduce((s, x) => s + a[x], 0) / k.length) * 10) / 10;
}

// Estrelas de 0,5 a 5 a partir do valor global
export function stars(v: number) {
  return Math.max(0.5, Math.min(5, Math.round(((v - 5) / 2.8) * 2) / 2));
}

export function starsHtml(v: number) {
  const s = stars(v);
  const full = Math.floor(s);
  return `<span class="stars" title="${s.toString().replace('.', ',')} estrelas">${'★'.repeat(full)}${s % 1 ? '½' : ''}<span class="dim">${'★'.repeat(5 - Math.ceil(s))}</span></span>`;
}
