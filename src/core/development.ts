import { homeNation, localYouth } from './names';
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
export function developPlayer(p: Player, st: PlayerSeason | undefined, seasonYear: number, train: Partial<Record<'tecnicos' | 'mentais' | 'fisicos' | 'guardaRedes', number>> = {}, shooting = false,
  // evolução ao longo da época: aplica uma fração da mudança anual (final = fecho da época: envelhece e revê o potencial)
  o: { frac: number; seed: string; final: boolean; preseason?: boolean; start?: Partial<Record<AttrKey, number>>; boost?: number } = { frac: 1, seed: '', final: true }): DevChange {
  const r = rng(`dev-${p.id}-${seasonYear}${o.seed}`);
  const before = overall(p.attrs, p.position);
  const minutesShare = Math.min(1, (st?.minutes ?? 0) / 60 / 600); // ~600 min = muito utilizado
  const playFactor = o.preseason ? 0.75 : 0.5 + 0.5 * minutesShare;
  const age = p.age;

  // Evolução dinâmica (estimativa, ao estilo FM/FIFA):
  // - quem tem mais margem até ao potencial cresce mais, sobretudo nos mais novos
  // - a qualidade da época (nota média) também conta: uma grande época faz crescer mesmo quem tem pouco potencial
  const games = st?.games ?? 0;
  const avgRating = games ? st!.ratingSum / games : 0;
  const perf = !o.preseason && games >= 4 ? Math.max(-1, Math.min(1.5, avgRating - 6.6)) : 0;
  const gap = Math.max(0, p.potential - before);
  const ageRate = age <= 19 ? 0.45 : age <= 21 ? 0.38 : age <= 23 ? 0.3 : age <= 25 ? 0.2 : age <= 27 ? 0.1 : 0;
  const perfGrowth = age <= 29 ? perf * 0.35 * (0.4 + 0.6 * minutesShare) : perf * 0.15;
  let growth = gap * ageRate * (0.8 + r() * 0.4) * playFactor + perfGrowth; // técnico e mental
  let physical = 0;
  if (age <= 23) physical = growth * 0.6;
  else if (age <= 29) { growth += (r() - 0.5) * 0.3; physical = (r() - 0.5) * 0.4; }
  else if (age <= 32) { growth += (r() - 0.5) * 0.4; physical = -(0.3 + r() * 0.5); }
  else { growth += -(0.1 + r() * 0.4); physical = -(0.6 + r() * 0.8 + (age - 33) * 0.15); }
  if (!o.preseason && age <= 23 && games < 2) growth -= 0.15; // jovem sem jogar estagna

  for (const k of ALL_ATTRS) {
    if (p.position !== 'GR' && GK.includes(k)) continue;
    let d = PHYSICAL.includes(k) ? physical : growth;
    if (MENTAL.includes(k) && age >= 27) d += 0.15; // experiência
    // treino (ver training.ts)
    d += train[PHYSICAL.includes(k) ? 'fisicos' : MENTAL.includes(k) ? 'mentais' : GK.includes(k) ? 'guardaRedes' : 'tecnicos'] ?? 0;
    if (shooting && (k === 'remate' || k === 'finalizacao')) d += 0.4;
    if (d > 0 && o.boost) d *= o.boost; // qualidade do staff (adjunto / treinador de GR)
    d = d * o.frac + gauss(r) * 0.35 * Math.sqrt(o.frac);
    // atributos guardados como inteiros: acumula a parte decimal de forma aleatória
    const v = p.attrs[k] + d;
    const base = Math.floor(v);
    let nv = Math.max(1, Math.min(20, base + (r() < v - base ? 1 : 0)));
    // travões (a evolução é diária): por época, cada atributo sobe no máximo +3 (até 21 anos), +2 (22-25) ou +1 (26+)
    const s0 = o.start?.[k];
    if (s0 !== undefined) nv = Math.min(nv, s0 + (age <= 21 ? 3 : age <= 25 ? 2 : 1));
    p.attrs[k] = nv;
  }
  // o nível não passa o potencial em mais de 1 durante a época (só uma grande época sobe o potencial, no fim)
  let after = overall(p.attrs, p.position);
  if (after > p.potential + 1 && after > before) {
    for (const k of ALL_ATTRS) if (o.start?.[k] !== undefined && p.attrs[k] > o.start[k]!) { p.attrs[k]--; after = overall(p.attrs, p.position); if (after <= p.potential + 1) break; }
  }
  if (!o.final) return { id: p.id, name: p.name, before, after };
  p.age++;
  // potencial dinâmico: grandes épocas dos jovens sobem-no; jovens que não jogam perdem margem
  if (age <= 24 && perf > 0.3 && minutesShare > 0.4) p.potential = Math.min(20, p.potential + perf * 0.6);
  if (age <= 23 && minutesShare < 0.1) p.potential = Math.max(after, p.potential - 0.3);
  if (age >= 26) p.potential = Math.max(after, Math.min(p.potential, after + 0.5));
  else p.potential = Math.max(p.potential, after);
  p.potential = Math.round(p.potential * 10) / 10;
  return { id: p.id, name: p.name, before, after };
}

/** Paragem longa por lesão (mais de 3 semanas): perde forma física por cada dia parado, ~0,25 por mês (estimativa); cruzado também perde técnica. */
export function injuryDecline(p: Player, injuryDays: number, months: number, seed: string) {
  if (injuryDays < 21) return;
  const r = rng(`inj-${p.id}-${seed}`);
  const phys = 0.25 * months * (p.age > 30 ? 1.5 : 1);
  for (const k of ALL_ATTRS) {
    if (p.position !== 'GR' && GK.includes(k)) continue;
    const d = PHYSICAL.includes(k) ? -phys : injuryDays > 120 ? -0.1 * months : 0;
    if (!d) continue;
    const v = p.attrs[k] + d, base = Math.floor(v);
    p.attrs[k] = Math.max(1, base + (r() < v - base ? 1 : 0));
  }
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
      name: localYouth(club, r)?.name ?? `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`,
      position: pos,
      number,
      age: 17 + Math.floor(r() * 2),
      nationality: homeNation(club),
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
