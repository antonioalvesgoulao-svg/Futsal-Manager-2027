import type { Player } from '../types';

/**
 * Qualidade individual do movimento sem bola no futsal.
 *
 * Este módulo não escolhe a tática nem altera resultados: traduz atributos
 * existentes em limites e qualidade de execução para a futura camada de
 * comportamento. Os fatores são deliberadamente moderados para evitar que
 * um único atributo transforme jogadores em super-heróis.
 */

export type MovementIntent =
  | 'support'
  | 'rotation'
  | 'attackSpace'
  | 'press'
  | 'cover'
  | 'recover'
  | 'receive';

export interface MovementProfile {
  /** Multiplicador de aceleração: 0.82–1.16. */
  accelerationFactor: number;
  /** Multiplicador de resposta nas mudanças de direção: 0.82–1.16. */
  agilityFactor: number;
  /** Qualidade de leitura e escolha do movimento: 0.55–1. */
  decisionFactor: number;
  /** Capacidade de sincronizar o movimento com os colegas: 0.55–1. */
  teamworkFactor: number;
  /** Capacidade para repetir esforços ao longo do jogo: 0.75–1.05. */
  enduranceFactor: number;
}

type WeightedAttribute = keyof Player['attrs'];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const unit = (v: number) => clamp((v - 1) / 19, 0, 1);

function score(player: Player, weights: Partial<Record<WeightedAttribute, number>>): number {
  let total = 0;
  let weight = 0;
  for (const [key, w] of Object.entries(weights) as [WeightedAttribute, number][]) {
    total += unit(player.attrs[key]) * w;
    weight += w;
  }
  return weight ? total / weight : 0.5;
}

const INTENT_WEIGHTS: Record<MovementIntent, Partial<Record<WeightedAttribute, number>>> = {
  support: { visao: 2, decisoes: 2, posicionamento: 2, trabalhoEquipa: 2, antecipacao: 1 },
  rotation: { decisoes: 2, posicionamento: 2, trabalhoEquipa: 2, visao: 1, resistencia: 1 },
  attackSpace: { aceleracao: 2, agilidade: 2, antecipacao: 2, decisoes: 1, visao: 1 },
  press: { aceleracao: 2, resistencia: 2, agressividade: 1, antecipacao: 1, trabalhoEquipa: 1 },
  cover: { posicionamento: 3, antecipacao: 2, decisoes: 2, trabalhoEquipa: 1 },
  recover: { aceleracao: 2, resistencia: 2, antecipacao: 1, posicionamento: 1 },
  receive: { rececao: 2, visao: 2, decisoes: 2, agilidade: 1, posicionamento: 1 },
};

/** Converte atributos de 1–20 em capacidades físicas e cognitivas moderadas. */
export function movementProfile(player: Player): MovementProfile {
  const a = player.attrs;
  const decision = score(player, { decisoes: 3, posicionamento: 2, antecipacao: 2, visao: 1 });
  const teamwork = score(player, { trabalhoEquipa: 3, decisoes: 1, posicionamento: 1 });

  return {
    accelerationFactor: 0.82 + unit(a.aceleracao) * 0.34,
    agilityFactor: 0.82 + unit(a.agilidade) * 0.34,
    decisionFactor: 0.55 + decision * 0.45,
    teamworkFactor: 0.55 + teamwork * 0.45,
    enduranceFactor: 0.75 + unit(a.resistencia) * 0.30,
  };
}

/**
 * Fiabilidade da execução de uma intenção tática (0.55–1).
 * Não é probabilidade de sucesso de um passe/remate; mede apenas a qualidade
 * com que o jogador lê e sincroniza o movimento pedido.
 */
export function movementExecutionQuality(player: Player, intent: MovementIntent): number {
  const reading = score(player, INTENT_WEIGHTS[intent]);
  const teamwork = score(player, { trabalhoEquipa: 2, decisoes: 1 });
  return clamp(0.55 + reading * 0.30 + teamwork * 0.15, 0.55, 1);
}

/** Adequação posicional simples, útil para ponderar quem assume cada movimento. */
export function movementRoleFit(player: Player, intent: MovementIntent): number {
  const position = player.position;
  const fit: Record<MovementIntent, Partial<Record<typeof position, number>>> = {
    support: { UNI: 1, 'FIX/ALA': 0.95, ALA: 0.9, FIX: 0.85, 'ALA/PIV': 0.85, PIV: 0.8, GR: 0.25 },
    rotation: { UNI: 1, 'FIX/ALA': 0.95, ALA: 0.9, 'ALA/PIV': 0.85, FIX: 0.8, PIV: 0.8, GR: 0.2 },
    attackSpace: { ALA: 1, 'ALA/PIV': 0.95, PIV: 0.9, UNI: 0.85, 'FIX/ALA': 0.8, FIX: 0.65, GR: 0.2 },
    press: { FIX: 1, 'FIX/ALA': 0.95, UNI: 0.9, ALA: 0.85, 'ALA/PIV': 0.75, PIV: 0.7, GR: 0.25 },
    cover: { FIX: 1, 'FIX/ALA': 0.95, UNI: 0.9, ALA: 0.8, 'ALA/PIV': 0.7, PIV: 0.65, GR: 0.2 },
    recover: { FIX: 0.95, 'FIX/ALA': 0.95, UNI: 0.95, ALA: 0.9, 'ALA/PIV': 0.8, PIV: 0.75, GR: 0.2 },
    receive: { PIV: 1, 'ALA/PIV': 0.95, ALA: 0.9, UNI: 0.9, 'FIX/ALA': 0.85, FIX: 0.75, GR: 0.3 },
  };
  return fit[intent][position] ?? 0.5;
}
