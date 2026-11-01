// Atributos do treinador (o jogador humano), como no FM: escolhidos ao criar o jogo, conforme a experiência anterior.
// Efeitos (estimativa): tático → qualidade tática no jogo; motivação → efeito das palestras; trabalho com jovens → evolução
// dos jovens até 21; treino técnico → evolução em treino; disciplina → menos cartões por protestos/faltas para cartão;
// gestão de pessoas → satisfação e moral dos jogadores (quedas menores).
import type { GameState } from './types';

export interface ManagerAttrs { tatico: number; motivacao: number; jovens: number; treino: number; disciplina: number; gestao: number }

export const MANAGER_ATTRS: { id: keyof ManagerAttrs; label: string; desc: string }[] = [
  { id: 'tatico', label: 'Conhecimento tático', desc: 'qualidade das decisões táticas no jogo' },
  { id: 'motivacao', label: 'Motivação', desc: 'efeito das palestras' },
  { id: 'gestao', label: 'Gestão de pessoas', desc: 'satisfação e moral do plantel' },
  { id: 'treino', label: 'Treino técnico', desc: 'evolução dos jogadores no treino' },
  { id: 'jovens', label: 'Trabalho com jovens', desc: 'evolução dos jogadores até aos 21 anos' },
  { id: 'disciplina', label: 'Disciplina', desc: 'menos cartões por faltas e protestos' },
];

export const EXPERIENCE = [
  { id: 'nenhuma', label: 'Sem experiência', points: 48, reputation: 20, desc: 'Nunca jogaste a sério nem treinaste. Começas de baixo.' },
  { id: 'amador', label: 'Ex-jogador amador', points: 56, reputation: 28, desc: 'Jogaste nas divisões distritais.' },
  { id: 'profissional', label: 'Ex-jogador profissional', points: 64, reputation: 38, desc: 'Fizeste carreira na 1.ª divisão.' },
  { id: 'internacional', label: 'Ex-internacional', points: 72, reputation: 48, desc: 'Foste internacional pela tua seleção.' },
];

const DEFAULT: ManagerAttrs = { tatico: 12, motivacao: 10, jovens: 10, treino: 10, disciplina: 10, gestao: 10 };
export const managerAttrs = (s: GameState): ManagerAttrs => ({ ...DEFAULT, ...(s.manager.attrs ?? {}) });
/** Fator 10 → 1,0 (cada ponto ±3%). */
export const mgrK = (s: GameState, k: keyof ManagerAttrs, per = 0.03) => 1 + (managerAttrs(s)[k] - 10) * per;
