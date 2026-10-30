// Táticas de futsal: sistema, pressão, ritmo, marcação, guarda-redes avançado e quintetos
import { overall } from './attributes';
import type { Player } from './types';

export type System = '3-1' | '4-0' | '2-2' | '1-2-1';
export type Pressure = 'alta' | 'media' | 'baixa';
export type Tempo = 'rapido' | 'equilibrado' | 'paciente';
export type Marking = 'zona' | 'individual' | 'misto';
export type FlyingKeeper = 'nunca' | 'auto' | 'agressivo' | 'sempre';
export type Rotation = 'curta' | 'normal' | 'longa';

export interface Tactics {
  system: System;
  pressure: Pressure;
  tempo: Tempo;
  marking: Marking;
  flyingKeeper: FlyingKeeper;
  rotation: Rotation;
  gk: string | null; // guarda-redes titular
  q1: string[]; // 1.º quinteto (4 jogadores de campo)
  q2: string[]; // 2.º quinteto
}

export const LABELS = {
  system: {
    '3-1': '3-1 (com pivô de referência)',
    '4-0': '4-0 (mobilidade, sem pivô fixo)',
    '2-2': '2-2 (equilibrado e seguro)',
    '1-2-1': '1-2-1 (losango)',
  },
  pressure: { alta: 'Alta (campo todo)', media: 'Média (meio-campo)', baixa: 'Baixa (zona recuada)' },
  tempo: { rapido: 'Rápido', equilibrado: 'Equilibrado', paciente: 'Paciente (posse)' },
  marking: { zona: 'À zona', individual: 'Individual', misto: 'Mista' },
  flyingKeeper: {
    nunca: 'Nunca',
    auto: 'Automático (a perder perto do fim)',
    agressivo: 'Agressivo (mais cedo, também empatado quando é preciso ganhar)',
    sempre: 'Sempre',
  },
  rotation: { curta: 'Curta (rodar muito)', normal: 'Normal', longa: 'Longa (titulares mais tempo)' },
} as const;

export const DESCRIPTIONS: Record<string, string> = {
  '3-1': 'Explora um pivô forte de costas para a baliza. Rende mais quanto melhor for o pivô em campo.',
  '4-0': 'Quatro jogadores em rotação constante. Rende com jogadores técnicos e rápidos; defensivamente mais exposto.',
  '2-2': 'Dois atrás, dois à frente. Mais segurança defensiva, menos criatividade.',
  '1-2-1': 'Fixo, dois alas e pivô. Equilibrado, precisa de um fixo de qualidade.',
  alta: 'Recupera mais bolas mas cansa mais, faz mais faltas e expõe-se a contra-ataques.',
  media: 'Equilíbrio entre recuperar a bola e manter a organização.',
  baixa: 'Concede a posse, cansa menos e procura sair em contra-ataque.',
  rapido: 'Posses curtas: mais remates, de menor qualidade.',
  equilibrado: 'Sem extremos.',
  paciente: 'Posses longas: menos remates, de melhor qualidade, menos perdas.',
  zona: 'Depende do posicionamento e concentração da equipa.',
  individual: 'Depende do desarme e agressividade; mais faltas.',
  misto: 'Sem bónus nem penalização.',
};

// Quintetos sugeridos: melhor guarda-redes e os 8 melhores jogadores de campo divididos em dois blocos equilibrados
export function suggestTactics(squad: Player[], base?: Partial<Tactics>): Tactics {
  const gks = squad.filter((p) => p.position === 'GR').sort((a, b) => overall(b.attrs, 'GR') - overall(a.attrs, 'GR'));
  const out = squad.filter((p) => p.position !== 'GR').sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position));
  const q1: Player[] = [];
  const q2: Player[] = [];
  const isDef = (p: Player) => ['FIX', 'FIX/ALA', 'UNI'].includes(p.position);
  const isPiv = (p: Player) => ['PIV', 'ALA/PIV'].includes(p.position);
  const take = (q: Player[], pred: (p: Player) => boolean) => {
    const p = out.find((x) => pred(x) && !q1.includes(x) && !q2.includes(x));
    if (p) q.push(p);
  };
  for (const q of [q1, q2]) take(q, isDef);
  for (const q of [q1, q2]) take(q, isPiv);
  while (q1.length < 4 || q2.length < 4) {
    const before = q1.length + q2.length;
    if (q1.length < 4) take(q1, () => true);
    if (q2.length < 4) take(q2, () => true);
    if (q1.length + q2.length === before) break;
  }
  return {
    system: '3-1', pressure: 'media', tempo: 'equilibrado', marking: 'zona', flyingKeeper: 'auto', rotation: 'normal',
    ...base,
    gk: gks[0]?.id ?? null,
    q1: q1.map((p) => p.id),
    q2: q2.map((p) => p.id),
  };
}
