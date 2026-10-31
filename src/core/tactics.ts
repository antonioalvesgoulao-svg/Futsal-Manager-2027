// Táticas de futsal: sistema, pressão, ritmo, marcação, guarda-redes avançado e quintetos
import { overall } from './attributes';
import type { Player } from './types';

export type System = '3-1' | '4-0' | '2-2' | '1-2-1';
export type Pressure = 'alta' | 'media' | 'baixa';
export type Tempo = 'rapido' | 'equilibrado' | 'paciente';
export type Marking = 'zona' | 'individual' | 'misto';
export type FlyingKeeper = 'nunca' | 'auto' | 'agressivo' | 'sempre';
export type GkStyle = 'classico' | 'construtor' | 'avancado';
export type Rotation = 'curta' | 'normal' | 'longa' | 'manual';
export type CornerRoutine = 'primeiro_poste' | 'remate_fora' | 'bloqueio_pivo' | 'curto';
export type FreeKickRoutine = 'remate_direto' | 'jogada_ensaiada' | 'cruzamento';

export interface SetPieces {
  penalty: string | null; // penáltis e livres de 10 m (se não estiver em campo, bate o melhor em campo)
  free10: string | null;
  corner: string | null;
  freeKick: string | null;
  kickIn: string | null; // pontapés de linha lateral
  cornerRoutine: CornerRoutine;
  freeKickRoutine: FreeKickRoutine;
}

export interface Tactics {
  system: System;
  pressure: Pressure;
  tempo: Tempo;
  marking: Marking;
  flyingKeeper: FlyingKeeper;
  gkStyle?: GkStyle; // estilo do guarda-redes (por omissão, clássico)
  rotation: Rotation;
  gk: string | null; // guarda-redes titular
  q1: string[]; // 1.º quinteto (4 jogadores de campo)
  q2: string[]; // 2.º quinteto
  setPieces: SetPieces;
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
  rotation: { curta: 'Curta (rodar muito)', normal: 'Normal', longa: 'Longa (titulares mais tempo)', manual: 'Manual (só eu substituo)' },
  gkStyle: { classico: 'Clássico (fica na baliza)', construtor: 'Construtor (joga com os pés)', avancado: 'Atacante (sai a jogar e remata)' },
  cornerRoutine: { primeiro_poste: 'Ao primeiro poste', remate_fora: 'Remate de fora', bloqueio_pivo: 'Bloqueio para o pivô', curto: 'Canto curto' },
  freeKickRoutine: { remate_direto: 'Remate direto', jogada_ensaiada: 'Jogada ensaiada', cruzamento: 'Cruzamento ao segundo poste' },
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
  primeiro_poste: 'Bola rasteira e tensa ao primeiro poste para um desvio. Remates frequentes, de qualidade média.',
  remate_fora: 'Passe atrasado para remate de primeira de fora da área. Depende do remate; mais bloqueios.',
  bloqueio_pivo: 'Bloqueio para libertar o pivô junto à baliza. Menos remates, mas muito perigosos com um bom pivô.',
  curto: 'Canto jogado curto para manter a posse. Poucos remates, quase nenhum risco de contra-ataque.',
  remate_direto: 'O especialista remata diretamente. Depende do remate e das bolas paradas.',
  manual: 'O motor não troca jogadores: as substituições são todas tuas (durante o jogo, em Substituições). Atenção ao cansaço.',
  classico: 'O GR fica na baliza e repõe para os colegas. Mais seguro.',
  construtor: 'O GR participa na saída de bola com os pés. Ajuda contra a pressão; depende do jogo de pés.',
  avancado: 'O GR sai com a bola, junta-se ao ataque e às vezes remata. Mais ataque e contra-ataques, mas arrisca a baliza deserta.',
  jogada_ensaiada: 'Combinação de passes para um remate desmarcado. Mais remates, de boa qualidade.',
  cruzamento: 'Bola ao segundo poste para o pivô finalizar. Depende do pivô.',
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
  const t: Tactics = {
    system: '3-1', pressure: 'media', tempo: 'equilibrado', marking: 'zona', flyingKeeper: 'auto', rotation: 'normal',
    ...base,
    gk: gks[0]?.id ?? null,
    q1: [],
    q2: [],
    setPieces: suggestSetPieces(squad),
  };
  t.q1 = arrangeForSystem(q1, t.system).map((p) => p?.id ?? '');
  t.q2 = arrangeForSystem(q2, t.system).map((p) => p?.id ?? '');
  return t;
}

// Distribui 4 jogadores pelas posições do sistema com a melhor adequação possível
export function arrangeForSystem<T extends { position: string } | undefined>(players: T[], system: System): T[] {
  const slots = SLOTS[system];
  const list = [0, 1, 2, 3].map((i) => players[i]);
  let best = list;
  let bestScore = -1;
  const perm = (arr: T[], k: number) => {
    if (k === arr.length) {
      const sc = arr.reduce((a, p, i) => a + (p ? roleFit(slots[i].role, p.position) : 0), 0);
      if (sc > bestScore) { bestScore = sc; best = [...arr]; }
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      perm(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };
  perm(list, 0);
  return best;
}

// Posições no campo de cada sistema (x: 0 = baliza própria, 100 = baliza adversária; y: 0 = esquerda, 100 = direita)
export type Role = 'Fixo' | 'Ala' | 'Pivô' | 'Universal';
export interface Slot {
  label: string;
  role: Role;
  x: number;
  y: number;
}

export const GK_SLOT = { x: 5, y: 50 };

export const SLOTS: Record<System, Slot[]> = {
  '3-1': [
    { label: 'Fixo', role: 'Fixo', x: 30, y: 50 },
    { label: 'Ala E', role: 'Ala', x: 40, y: 18 },
    { label: 'Ala D', role: 'Ala', x: 40, y: 82 },
    { label: 'Pivô', role: 'Pivô', x: 78, y: 50 },
  ],
  '4-0': [
    { label: 'Universal E', role: 'Universal', x: 38, y: 36 },
    { label: 'Ala E', role: 'Ala', x: 48, y: 12 },
    { label: 'Ala D', role: 'Ala', x: 48, y: 88 },
    { label: 'Universal D', role: 'Universal', x: 38, y: 64 },
  ],
  '2-2': [
    { label: 'Fixo E', role: 'Fixo', x: 30, y: 30 },
    { label: 'Ala E', role: 'Ala', x: 64, y: 28 },
    { label: 'Ala D', role: 'Ala', x: 64, y: 72 },
    { label: 'Fixo D', role: 'Fixo', x: 30, y: 70 },
  ],
  '1-2-1': [
    { label: 'Fixo', role: 'Fixo', x: 24, y: 50 },
    { label: 'Ala E', role: 'Ala', x: 50, y: 20 },
    { label: 'Ala D', role: 'Ala', x: 50, y: 80 },
    { label: 'Pivô', role: 'Pivô', x: 76, y: 50 },
  ],
};

// Adequação de cada posição do jogador a cada função (1 = ideal)
const FIT: Record<Role, Record<string, number>> = {
  Fixo: { FIX: 1, 'FIX/ALA': 0.85, UNI: 0.8, ALA: 0.45, 'ALA/PIV': 0.3, PIV: 0.25, GR: 0 },
  Ala: { ALA: 1, UNI: 0.9, 'FIX/ALA': 0.8, 'ALA/PIV': 0.85, FIX: 0.5, PIV: 0.45, GR: 0 },
  Pivô: { PIV: 1, 'ALA/PIV': 0.9, UNI: 0.6, ALA: 0.5, 'FIX/ALA': 0.3, FIX: 0.25, GR: 0 },
  Universal: { UNI: 1, 'FIX/ALA': 0.9, ALA: 0.85, 'ALA/PIV': 0.75, FIX: 0.7, PIV: 0.5, GR: 0 },
};

export function roleFit(role: Role, position: string) {
  return FIT[role][position] ?? 0.3;
}

// Marcadores sugeridos: os melhores em cada especialidade
export function suggestSetPieces(squad: Player[], base?: Partial<SetPieces>): SetPieces {
  const out = squad.filter((p) => p.position !== 'GR');
  const best = (f: (p: Player) => number) => [...out].sort((a, b) => f(b) - f(a))[0]?.id ?? null;
  const a = (p: Player) => p.attrs;
  return {
    penalty: best((p) => a(p).finalizacao + a(p).compostura),
    free10: best((p) => a(p).remate + a(p).finalizacao + a(p).compostura),
    corner: best((p) => a(p).bolasParadas * 2 + a(p).passe),
    freeKick: best((p) => a(p).bolasParadas * 2 + a(p).remate),
    kickIn: best((p) => a(p).passe + a(p).visao + a(p).bolasParadas),
    cornerRoutine: 'primeiro_poste',
    freeKickRoutine: 'remate_direto',
    ...base,
  };
}

// Compatibilidade com jogos gravados antes das bolas paradas
export function normalizeTactics(t: Tactics, squad: Player[]): Tactics {
  if (!t.setPieces) t.setPieces = suggestSetPieces(squad);
  return t;
}
