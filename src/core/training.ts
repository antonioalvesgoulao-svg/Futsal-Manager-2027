// Treino (estimativas: não há números públicos do efeito do treino no futsal).
// O plano da equipa (foco + intensidade) e o foco individual de cada jogador acumulam-se dia a dia;
// no fim da época a evolução de cada grupo de atributos é ajustada (developPlayer).
// Intensidade: alta = mais evolução e mais lesões em treino; baixa = menos das duas.
import type { GameState } from './types';

export type Focus = 'equilibrado' | 'tecnico' | 'tatico' | 'fisico' | 'finalizacao' | 'guardaRedes' | 'recuperacao';
export type Intensity = 'baixa' | 'normal' | 'alta';
export type Group = 'tecnicos' | 'mentais' | 'fisicos' | 'guardaRedes';

export interface TrainingPlan { focus: Focus; intensity: Intensity; individual: Record<string, Focus> }
/** dias acumulados por grupo de atributos (já multiplicados pela intensidade) */
export type TrainLog = Record<string, Partial<Record<Group, number>> & { days?: number }>;

export const FOCUS_LABEL: Record<Focus, string> = {
  equilibrado: 'Equilibrado', tecnico: 'Técnica (passe, receção, drible)', tatico: 'Tática (posicionamento, decisões)',
  fisico: 'Físico (resistência, velocidade, força)', finalizacao: 'Finalização e remate', guardaRedes: 'Guarda-redes', recuperacao: 'Recuperação',
};
export const INT_LABEL: Record<Intensity, string> = { baixa: 'Baixa', normal: 'Normal', alta: 'Alta' };
export const INT_MULT: Record<Intensity, number> = { baixa: 0.75, normal: 1, alta: 1.25 };
/** risco de lesão em treino */
export const INT_INJ: Record<Intensity, number> = { baixa: 0.7, normal: 1, alta: 1.4 };

// peso de cada grupo conforme o foco (equilibrado = 1/3 cada para jogadores de campo)
const SHARE: Record<Focus, Partial<Record<Group, number>>> = {
  equilibrado: { tecnicos: 1 / 3, mentais: 1 / 3, fisicos: 1 / 3 },
  tecnico: { tecnicos: 0.6, mentais: 0.2, fisicos: 0.2 },
  tatico: { tecnicos: 0.2, mentais: 0.6, fisicos: 0.2 },
  fisico: { tecnicos: 0.2, mentais: 0.2, fisicos: 0.6 },
  finalizacao: { tecnicos: 0.6, mentais: 0.2, fisicos: 0.2 },
  guardaRedes: { guardaRedes: 0.6, mentais: 0.2, fisicos: 0.2 },
  recuperacao: { tecnicos: 0.1, mentais: 0.1, fisicos: 0.1 },
};

export const defaultPlan = (): TrainingPlan => ({ focus: 'equilibrado', intensity: 'normal', individual: {} });
export const planOf = (s: GameState, clubId: string) => (clubId === s.clubId ? (s.training ??= defaultPlan()) : defaultPlan());

/** Foco efetivo de um jogador: individual > da equipa; os GR fazem sempre treino específico (metade) */
function focusOf(plan: TrainingPlan, id: string, gk: boolean): Partial<Record<Group, number>> {
  const f = plan.individual[id] ?? plan.focus;
  const sh = { ...SHARE[f] };
  if (gk && f !== 'guardaRedes' && f !== 'recuperacao') { for (const k of Object.keys(sh) as Group[]) sh[k]! *= 0.5; sh.guardaRedes = (sh.guardaRedes ?? 0) + 0.5; }
  return sh;
}

/** Acumula `days` dias de treino em todos os jogadores. */
export function accumulate(s: GameState, days: number) {
  const log = (s.trainLog ??= {});
  for (const p of s.players) {
    if (s.injuries?.[p.id]) continue;
    const plan = planOf(s, p.clubId);
    const sh = focusOf(plan, p.id, p.position === 'GR');
    const L = (log[p.id] ??= {});
    L.days = (L.days ?? 0) + days;
    for (const [g, w] of Object.entries(sh) as [Group, number][]) L[g] = (L[g] ?? 0) + w * days * INT_MULT[plan.intensity];
  }
}

/** Ajuste da evolução anual por grupo (em pontos de atributo): ~+0,5 com foco total, ~-0,2 nos outros (estimativa). */
export function trainingBonus(s: GameState, id: string, gk: boolean): Partial<Record<Group, number>> {
  const L = s.trainLog?.[id];
  if (!L?.days) return {};
  const base = focusOf(defaultPlan(), id, gk); // referência: equilibrado, normal
  const out: Partial<Record<Group, number>> = {};
  for (const g of ['tecnicos', 'mentais', 'fisicos', 'guardaRedes'] as Group[]) {
    const got = (L[g] ?? 0) / L.days, ref = base[g] ?? 0;
    if (!got && !ref) continue;
    out[g] = (got - ref) * 1.8;
  }
  return out;
}

/** Bónus de finalização: o foco "finalizacao" puxa mais remate e finalização dentro dos técnicos. */
export const shootingFocus = (s: GameState, id: string, clubId: string) => {
  const plan = planOf(s, clubId);
  return (plan.individual[id] ?? plan.focus) === 'finalizacao';
};
