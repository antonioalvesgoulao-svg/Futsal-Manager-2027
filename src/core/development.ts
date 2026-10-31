// Fim de época: envelhecimento, evolução e declínio, reformas e novos jovens da formação
import { ALL_ATTRS, ATTR_GROUPS, AttrKey, gauss, overall, rng, generateAttributes } from './attributes';
import type { Club, Player, Position } from './types';
import type { PlayerSeason } from './season/types';

const PHYSICAL = Object.keys(ATTR_GROUPS.fisicos.attrs) as AttrKey[];
const MENTAL = Object.keys(ATTR_GROUPS.mentais.attrs) as AttrKey[];
const GK = Object.keys(ATTR_GROUPS.guardaRedes.attrs) as AttrKey[];

export interface DevChange {
  id: string;
  name: string;
  before: number;
  after: number;
}

/**
 * Evolução anual de um jogador.
 * - Até aos 23: aproxima-se do potencial; mais rápido com muitos minutos
 * - 24 a 29: estável, pequenas subidas com minutos
 * - 30 a 32: começa o declínio físico (o mental ainda pode subir)
 * - 33 ou mais: declínio físico mais acentuado
 */
export function developPlayer(p: Player, st: PlayerSeason | undefined, seasonYear: number, train: Partial<Record<'tecnicos' | 'mentais' | 'fisicos' | 'guardaRedes', number>> = {}, shooting = false): DevChange {
  const r = rng(`dev-${p.id}-${seasonYear}`);
  const before = overall(p.attrs, p.position);
  const minutesShare = Math.min(1, (st?.minutes ?? 0) / 60 / 600); // ~600 min = muito utilizado
  const playFactor = 0.5 + 0.5 * minutesShare;
  const age = p.age;

  let growth = 0; // técnico e mental
  let physical = 0;
  if (age <= 23) {
    const gap = Math.max(0, p.potential - before);
    growth = gap * (0.25 + r() * 0.25) * playFactor;
    physical = growth * 0.6;
  } else if (age <= 29) {
    growth = (r() - 0.4) * 0.6 + minutesShare * 0.2;
    physical = (r() - 0.5) * 0.4;
  } else if (age <= 32) {
    growth = (r() - 0.5) * 0.4;
    physical = -(0.3 + r() * 0.5);
  } else {
    growth = -(0.1 + r() * 0.4);
    physical = -(0.6 + r() * 0.8 + (age - 33) * 0.15);
  }

  for (const k of ALL_ATTRS) {
    if (p.position !== 'GR' && GK.includes(k)) continue;
    let d = PHYSICAL.includes(k) ? physical : growth;
    if (MENTAL.includes(k) && age >= 27) d += 0.15; // experiência
    // treino (ver training.ts)
    d += train[PHYSICAL.includes(k) ? 'fisicos' : MENTAL.includes(k) ? 'mentais' : GK.includes(k) ? 'guardaRedes' : 'tecnicos'] ?? 0;
    if (shooting && (k === 'remate' || k === 'finalizacao')) d += 0.4;
    d += gauss(r) * 0.35;
    // atributos guardados como inteiros: acumula a parte decimal de forma aleatória
    const v = p.attrs[k] + d;
    const base = Math.floor(v);
    p.attrs[k] = Math.max(1, Math.min(20, base + (r() < v - base ? 1 : 0)));
  }
  p.age++;
  const after = overall(p.attrs, p.position);
  if (age >= 26) p.potential = Math.max(after, Math.min(p.potential, after + 0.5));
  else p.potential = Math.max(p.potential, after);
  return { id: p.id, name: p.name, before, after };
}

export function retires(p: Player, seasonYear: number) {
  const r = rng(`ret-${p.id}-${seasonYear}`);
  if (p.age < 35) return false;
  const chance = Math.min(0.95, (p.age - 34) * 0.18 + (overall(p.attrs, p.position) < 10 ? 0.15 : 0));
  return r() < chance;
}

// Nomes para os jovens da formação (portugueses mais comuns)
const FIRST = ['João', 'Rodrigo', 'Martim', 'Tomás', 'Afonso', 'Diogo', 'Gonçalo', 'Duarte', 'Francisco', 'Rafael', 'Miguel', 'Guilherme', 'Gabriel', 'Lourenço', 'Santiago', 'Vicente', 'Simão', 'Henrique', 'Salvador', 'Pedro', 'Tiago', 'André', 'Bernardo', 'Leonardo', 'Dinis'];
const LAST = ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Jesus', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Almeida', 'Ribeiro', 'Pinto', 'Carvalho', 'Teixeira', 'Moreira', 'Correia', 'Mendes', 'Nunes'];

/** Jovens promovidos da formação para manter o plantel completo (a formação completa entra na etapa 11). */
export function youthIntake(club: Club, squad: Player[], seasonYear: number): Player[] {
  const r = rng(`youth-${club.id}-${seasonYear}`);
  const out: Player[] = [];
  const gks = squad.filter((p) => p.position === 'GR').length;
  // mantém o plantel entre 16 e 20 (sem mercado ainda, a formação repõe as saídas)
  const need = squad.length >= 20 ? 0 : Math.max(1, 16 - squad.length);
  const used = new Set(squad.map((p) => p.number));
  for (let i = 0; i < need; i++) {
    const pos: Position = gks + out.filter((p) => p.position === 'GR').length < 3 && i === 0 ? 'GR' : (['FIX', 'ALA', 'ALA', 'PIV', 'UNI', 'FIX/ALA'] as Position[])[Math.floor(r() * 6)];
    let number = 2 + Math.floor(r() * 97);
    while (used.has(number)) number = 2 + Math.floor(r() * 97);
    used.add(number);
    const base: Player = {
      id: `${club.id}y${seasonYear}${i}`,
      clubId: club.id,
      name: `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`,
      position: pos,
      number,
      age: 17 + Math.floor(r() * 2),
      nationality: 'Portugal',
      attrs: {} as Player['attrs'],
      potential: 0,
    };
    // jovens com nível de formação do próprio clube; alguns com muito potencial
    const g = generateAttributes(base, Math.max(40, club.level - 8), 0);
    const star = r() < 0.12 ? 3 + r() * 3 : 0;
    out.push({ ...base, attrs: g.attrs, potential: Math.min(20, g.potential + star) });
  }
  return out;
}
