// Lesões. Base: Lopes et al. 2023 (futsal masculino de elite, Portugal): 25,9 lesões/1000 h de jogo, ~3/1000 h de treino,
// 4,5/1000 h no total; tempo médio de paragem ~9 dias; moderadas (8-28 dias) 44%, ligeiras (4-7) 24%;
// virilha 19%, joelho 19%, coxa 17%, tornozelo 15%; 65% sem contacto. Ruiz-Pérez et al. 2021 (meta-análise) confirma a ordem de grandeza.
// Estimativas minhas: horas de treino (~7,5 h/semana), distribuição dentro de cada gravidade, efeito da idade e do cansaço.
import { addDays } from './season/season';
import type { MatchResult } from './engine/types';
import type { GameState } from './types';

export interface Injury { type: string; until: string; days: number }

interface Kind { type: string; w: number; sev: [number, number][] } // [peso, dias]
// tipos por zona (pesos = % do estudo); cada um com gravidades possíveis
const KINDS: Kind[] = [
  { type: 'Pubalgia / lesão na virilha', w: 19, sev: [[3, 5], [4, 12], [2, 25]] },
  { type: 'Entorse do joelho', w: 13, sev: [[3, 4], [4, 14], [1, 35]] },
  { type: 'Lesão de ligamentos do joelho', w: 2, sev: [[2, 45], [1, 70]] },
  { type: 'Rotura do ligamento cruzado', w: 0.4, sev: [[1, 210]] },
  { type: 'Contusão no joelho', w: 2, sev: [[3, 3], [1, 8]] },
  { type: 'Rotura muscular na coxa', w: 11, sev: [[2, 6], [4, 16], [1, 32]] },
  { type: 'Contusão na coxa', w: 6, sev: [[3, 3], [2, 6]] },
  { type: 'Entorse do tornozelo', w: 15, sev: [[3, 4], [4, 12], [1, 30]] },
  { type: 'Lesão muscular na barriga da perna', w: 8, sev: [[2, 6], [3, 15]] },
  { type: 'Lesão no pé', w: 6, sev: [[3, 4], [2, 15], [1, 40]] },
  { type: 'Lombalgia', w: 5, sev: [[3, 4], [2, 10]] },
  { type: 'Lesão no ombro / mão', w: 6, sev: [[2, 4], [2, 12], [1, 35]] },
  { type: 'Pancada na cabeça', w: 5, sev: [[3, 2], [1, 8]] },
];
const MATCH_RATE = 25.9 / 1000; // por hora de jogo em campo
const TRAIN_RATE = 3 / 1000; // por hora de treino
const TRAIN_H_DAY = 7.5 / 7; // horas de treino por dia (estimativa)

function pick<T>(xs: [number, T][], r: number): T {
  let v = r * xs.reduce((a, x) => a + x[0], 0);
  for (const [w, x] of xs) if ((v -= w) <= 0) return x;
  return xs[xs.length - 1][1];
}

function draw(rnd: () => number, from: string): Injury {
  const k = pick(KINDS.map((x) => [x.w, x] as [number, Kind]), rnd());
  const base = pick(k.sev, rnd());
  const days = Math.max(1, Math.round(base * (base > 100 ? 1 : 0.7) * (0.6 + rnd() * 0.8)));
  return { type: k.type, days, until: addDays(from, days) };
}

/** Risco extra: mais velhos e com menos resistência (estimativa). */
const riskOf = (age: number, res: number) => (1 + Math.max(0, age - 28) * 0.03) * (1.25 - res / 40);

export const injuryOf = (s: GameState, id: string) => {
  const i = s.injuries?.[id];
  return i && i.until > s.date ? i : undefined;
};

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

/** Lesões no jogo (pelo tempo útil em campo de cada jogador). Devolve as novas. */
export function matchInjuries(s: GameState, m: MatchResult, seed: string): [string, Injury][] {
  const out: [string, Injury][] = [];
  const rnd = rng(seed + '-inj');
  for (const [id, st] of Object.entries(m.players)) {
    const p = s.players.find((x) => x.id === id);
    if (!p || injuryOf(s, id)) continue;
    if (st.injured) out.push([id, draw(rnd, s.date)]); // o motor decide quem se lesiona (taxa MATCH_RATE)
  }
  (s.injuries ??= {});
  for (const [id, i] of out) s.injuries[id] = i;
  return out;
}

/** Lesões em treino entre duas datas (todos os clubes). Limpa as lesões já curadas. Devolve [novas, recuperados]. */
export function trainingInjuries(s: GameState, from: string, to: string): { fresh: [string, Injury][]; healed: string[] } {
  const inj = (s.injuries ??= {});
  const healed: string[] = [];
  for (const [id, i] of Object.entries(inj)) if (i.until <= to) { healed.push(id); delete inj[id]; }
  const days = Math.round((Date.parse(to) - Date.parse(from)) / 864e5);
  const fresh: [string, Injury][] = [];
  if (days <= 0 || days > 60) return { fresh, healed }; // pausas longas (fim de época): sem treino contado
  const rnd = rng(`${from}-${to}-train`);
  for (const p of s.players) {
    if (inj[p.id]) continue;
    const pr = TRAIN_RATE * TRAIN_H_DAY * days * riskOf(p.age, p.attrs.resistencia);
    if (rnd() < pr) {
      const start = addDays(from, Math.floor(rnd() * days));
      const i = draw(rnd, start);
      if (i.until > to) { inj[p.id] = i; fresh.push([p.id, i]); }
    }
  }
  return { fresh, healed };
}

/** Explicação curta de cada lesão (o que é e como costuma acontecer no futsal). */
const INFO: Record<string, string> = {
  'Pubalgia / lesão na virilha': 'Dor na zona púbica e adutores, por sobrecarga de mudanças de direção e remates. A mais comum no futsal.',
  'Entorse do joelho': 'Torção do joelho numa travagem ou mudança de direção, com distensão dos ligamentos.',
  'Lesão de ligamentos do joelho': 'Rotura parcial do ligamento lateral interno (ou externo), normalmente numa torção ou choque.',
  'Rotura do ligamento cruzado': 'Rotura do ligamento cruzado anterior: precisa de cirurgia e cerca de 6 a 9 meses de recuperação.',
  'Contusão no joelho': 'Pancada direta no joelho (choque ou queda no piso).',
  'Rotura muscular na coxa': 'Lesão muscular nos isquiotibiais ou no quadricípite, num sprint ou num remate.',
  'Contusão na coxa': 'Pancada na coxa (\'paralítica\') num choque com adversário.',
  'Entorse do tornozelo': 'Torção do tornozelo, muitas vezes ao pisar o pé de outro jogador.',
  'Lesão muscular na barriga da perna': 'Distensão dos gémeos, típica em arranques e travagens.',
  'Lesão no pé': 'Contusão ou lesão óssea no pé (por exemplo, pisão ou sobrecarga do metatarso).',
  'Lombalgia': 'Dor na zona lombar por sobrecarga ou queda.',
  'Lesão no ombro / mão': 'Queda sobre o braço: entorse do ombro, dedo ou pulso.',
  'Pancada na cabeça': 'Choque de cabeças ou queda: protocolo de concussão antes de voltar.',
};
export const injuryInfo = (type: string) => INFO[type] ?? '';
