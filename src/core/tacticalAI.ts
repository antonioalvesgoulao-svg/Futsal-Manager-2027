// Inteligência tática das equipas da IA (auditoria 2026): o sistema sai de uma avaliação global do plantel, não de um
// único atributo. Cada sistema tem as suas exigências reais no futsal:
//  - 3-1: um pivô de referência (jogo de costas, força, finalização) e um fixo seguro; alas rápidos
//  - 4-0: quatro jogadores móveis e técnicos (drible, passe, decisões, agilidade), muitos universais; rotação contínua
//  - 2-2: dois jogadores fortes na frente (dois pivôs/alas-pivô) e dois atrás; jogo mais físico e direto
//  - 1-2-1 (losango): um fixo, dois alas desequilibradores (drible, aceleração, remate) e um pivô razoável
// Usado antes do jogo (escolha do sistema) e durante o jogo (mudanças conforme o resultado e o tempo).
import { overall } from './attributes';
import type { Tactics } from './tactics';
import type { Player } from './types';

export type SystemScores = Record<Tactics['system'], number>;

const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

/** Nota de adequação (escala ~10-18) de cada sistema aos 8 melhores jogadores de campo do plantel. */
export function systemScores(squad: Player[]): SystemScores {
  const out = squad.filter((p) => p.position !== 'GR').sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position)).slice(0, 8);
  if (!out.length) return { '3-1': 12, '4-0': 12, '2-2': 12, '1-2-1': 12 };
  const A = (p: Player) => p.attrs;
  const pivQ = (p: Player) => 0.4 * A(p).jogoCostas + 0.25 * A(p).forca + 0.25 * A(p).finalizacao + 0.1 * A(p).rececao;
  const fixQ = (p: Player) => 0.35 * A(p).desarme + 0.25 * A(p).posicionamento + 0.2 * A(p).passe + 0.2 * A(p).visao;
  const wingQ = (p: Player) => (A(p).drible + A(p).aceleracao + A(p).remate + A(p).agilidade) / 4;
  const mobQ = (p: Player) => (A(p).drible + A(p).passe + A(p).decisoes + A(p).agilidade + A(p).aceleracao + A(p).trabalhoEquipa) / 6;
  const pivots = out.filter((p) => ['PIV', 'ALA/PIV'].includes(p.position)).map(pivQ).sort((a, b) => b - a);
  const fixos = out.filter((p) => ['FIX', 'FIX/ALA', 'UNI'].includes(p.position)).map(fixQ).sort((a, b) => b - a);
  const alas = out.filter((p) => ['ALA', 'ALA/PIV', 'FIX/ALA', 'UNI'].includes(p.position)).map(wingQ).sort((a, b) => b - a);
  const univ = out.filter((p) => ['UNI', 'FIX/ALA', 'ALA/PIV'].includes(p.position)).length;
  const piv1 = pivots[0] ?? 8, piv2 = pivots[1] ?? 7, fix1 = fixos[0] ?? 9;
  const mob = avg(out.slice(0, 6).map(mobQ));
  const wing2 = avg(alas.slice(0, 2).length ? alas.slice(0, 2) : [9]);
  const phys = avg(out.slice(0, 6).map((p) => (A(p).forca + A(p).resistencia) / 2));
  return {
    '3-1': piv1 * 0.75 + fix1 * 0.25,
    '4-0': mob * 0.95 + univ * 0.35 + 2.4 - Math.max(0, piv1 - mob - 2.5) * 0.3,
    '2-2': (piv1 + piv2) / 2 * 0.7 + phys * 0.3 + 0.6,
    '1-2-1': wing2 * 0.6 + fix1 * 0.2 + piv1 * 0.2 - 0.45,
  };
}

/** Sistema escolhido: o mais adequado ao plantel, com a personalidade do treinador (pequena preferência) e,
 *  se se souber, ajustado ao adversário (contra marcação individual valem mais a mobilidade e o 4-0; contra zona,
 *  o pivô e o 1-2-1). */
export function chooseSystem(squad: Player[], r: () => number, oppMarking?: Tactics['marking']): Tactics['system'] {
  const sc = systemScores(squad);
  const pers: SystemScores = { '3-1': (r() - 0.5) * 1.2, '4-0': (r() - 0.5) * 1.2, '2-2': (r() - 0.5) * 1.2, '1-2-1': (r() - 0.5) * 1.2 };
  if (oppMarking === 'individual') { sc['4-0'] += 0.5; sc['2-2'] += 0.2; }
  if (oppMarking === 'zona') { sc['3-1'] += 0.3; sc['1-2-1'] += 0.3; }
  return (Object.keys(sc) as Tactics['system'][]).sort((a, b) => sc[b] + pers[b] - (sc[a] + pers[a]))[0];
}
