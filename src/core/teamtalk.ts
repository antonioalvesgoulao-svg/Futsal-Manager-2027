// Palestras ao estilo do FM: antes do jogo, no intervalo, no desconto de tempo e no fim.
// Cada tom tem efeito conforme o momento (a ganhar, empatado, a perder; favorito ou não) e cada jogador reage
// à sua maneira (personalidade: liderança, compostura, trabalho de equipa, mais um pouco de acaso).
// Valores em pontos de moral (0-100, ver morale.ts). Tudo estimativa (não há dados públicos).
import type { Player } from './types';

export type TalkMoment = 'pre' | 'intervalo' | 'desconto' | 'fim';
export type Situation = 'ganhar' | 'empatar' | 'perder';

export interface TalkOption { id: string; label: string; text: string }

export const TALKS: Record<TalkMoment, TalkOption[]> = {
  pre: [
    { id: 'confianca', label: 'Confiança', text: 'Confio em vocês. Joguem o nosso jogo.' },
    { id: 'exigir', label: 'Exigir a vitória', text: 'Hoje só a vitória interessa.' },
    { id: 'motivar', label: 'Motivar', text: 'Mostrem a todos quem somos!' },
    { id: 'semPressao', label: 'Tirar pressão', text: 'Ninguém espera nada de nós. Divirtam-se.' },
    { id: 'cautela', label: 'Cautela', text: 'Respeito pelo adversário. Concentração do início ao fim.' },
  ],
  intervalo: [
    { id: 'elogiar', label: 'Elogiar', text: 'Excelente primeira parte, continuem assim.' },
    { id: 'calma', label: 'Manter a calma', text: 'Calma. Estamos no caminho certo.' },
    { id: 'exigir', label: 'Exigir mais', text: 'Isto não chega. Quero mais de todos.' },
    { id: 'desilusao', label: 'Mostrar desilusão', text: 'Estou desiludido com o que vi.' },
    { id: 'motivar', label: 'Ir à luta', text: 'Ainda há 20 minutos. Vamos à luta!' },
    { id: 'plano', label: 'Focar no plano', text: 'Esqueçam o resultado, cumpram o plano.' },
  ],
  desconto: [
    { id: 'calma', label: 'Acalmar', text: 'Respirem. Uma jogada de cada vez.' },
    { id: 'exigir', label: 'Exigir mais', text: 'Mais intensidade, já!' },
    { id: 'motivar', label: 'Ir à luta', text: 'Ainda dá. Acreditem!' },
    { id: 'plano', label: 'Focar no plano', text: 'Façam o que treinámos.' },
    { id: 'elogiar', label: 'Elogiar', text: 'Muito bem, mantenham isto.' },
  ],
  fim: [
    { id: 'elogiar', label: 'Elogiar', text: 'Grande jogo. Estou orgulhoso de vocês.' },
    { id: 'satisfeito', label: 'Satisfeito', text: 'Fizemos o nosso trabalho.' },
    { id: 'semPressao', label: 'Olhar em frente', text: 'Já passou. Pensem no próximo jogo.' },
    { id: 'desilusao', label: 'Desiludido', text: 'Esperava muito mais de vocês.' },
    { id: 'furioso', label: 'Furioso', text: 'Inaceitável. Isto não se pode repetir.' },
  ],
};

// efeito base por tom e situação (pontos de moral)
const BASE: Record<string, Record<Situation, number>> = {
  confianca: { ganhar: 3, empatar: 3, perder: 3 },
  exigir: { ganhar: -2, empatar: 2, perder: 3 },
  motivar: { ganhar: 1, empatar: 3, perder: 4 },
  semPressao: { ganhar: 1, empatar: 2, perder: 3 },
  cautela: { ganhar: 2, empatar: 1, perder: -1 },
  elogiar: { ganhar: 5, empatar: 1, perder: -4 },
  calma: { ganhar: 2, empatar: 3, perder: 1 },
  desilusao: { ganhar: -6, empatar: 0, perder: 2 },
  plano: { ganhar: 2, empatar: 2, perder: 1 },
  satisfeito: { ganhar: 4, empatar: 2, perder: -3 },
  furioso: { ganhar: -8, empatar: -2, perder: 1 },
};

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

export interface TalkReaction { id: string; delta: number; face: '😀' | '🙂' | '😐' | '😟' | '😠' }

/**
 * Efeito da palestra em cada jogador.
 * underdog: a equipa é mais fraca (exigir resultados pesa mais; tirar pressão ajuda mais).
 */
export function talkEffect(players: Player[], option: string, sit: Situation, underdog: boolean, seed: string): TalkReaction[] {
  const r = rng(seed + option);
  return players.map((p) => {
    let d = BASE[option]?.[sit] ?? 0;
    if (underdog && (option === 'exigir' || option === 'furioso')) d -= 2;
    if (underdog && option === 'semPressao') d += 2;
    if (!underdog && option === 'semPressao') d -= 2;
    // personalidade: líderes e jogadores compostos aceitam melhor críticas; os outros sentem-nas mais
    const thick = (p.attrs.lideranca + p.attrs.compostura) / 2;
    if (d < 0) d *= 1.4 - thick / 25;
    else d *= 0.8 + p.attrs.trabalhoEquipa / 50;
    d += (r() - 0.5) * 3;
    d = Math.round(d * 10) / 10;
    const face = d >= 4 ? '😀' : d >= 1.5 ? '🙂' : d > -1.5 ? '😐' : d > -4 ? '😟' : '😠';
    return { id: p.id, delta: d, face };
  });
}

export const situationOf = (mine: number, theirs: number): Situation => (mine > theirs ? 'ganhar' : mine < theirs ? 'perder' : 'empatar');
