// Treinadores: atributos e estilo tático das equipas controladas pela IA
import { overall, rng } from './attributes';
import { suggestTactics, Tactics } from './tactics';
import type { Club, Coach, Player } from './types';

// Estilo deduzido do plantel e do nível do clube (com alguma personalidade do treinador)
export function aiTactics(squad: Player[], club: Club, coach?: Coach): Tactics {
  const r = rng('estilo-' + (coach?.id ?? club.id));
  const out = squad.filter((p) => p.position !== 'GR').sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position)).slice(0, 8);
  const bestPivot = Math.max(0, ...out.filter((p) => ['PIV', 'ALA/PIV'].includes(p.position)).map((p) => p.attrs.jogoCostas));
  const tech = out.reduce((s, p) => s + (p.attrs.drible + p.attrs.decisoes + p.attrs.passe) / 3, 0) / Math.max(1, out.length);

  const system: Tactics['system'] =
    bestPivot >= 15 ? '3-1' : tech >= 13.5 ? '4-0' : club.level < 62 ? (r() < 0.6 ? '2-2' : '1-2-1') : r() < 0.5 ? '1-2-1' : '3-1';
  const pressure: Tactics['pressure'] = club.level >= 85 ? 'alta' : club.level >= 65 ? (r() < 0.3 ? 'alta' : 'media') : r() < 0.5 ? 'baixa' : 'media';
  const tempo: Tactics['tempo'] = club.level >= 85 ? 'paciente' : r() < 0.35 ? 'rapido' : 'equilibrado';
  const marking: Tactics['marking'] = r() < 0.6 ? 'zona' : r() < 0.5 ? 'individual' : 'misto';
  const flyingKeeper: Tactics['flyingKeeper'] = r() < 0.3 ? 'agressivo' : 'auto';
  return suggestTactics(squad, { system, pressure, tempo, marking, flyingKeeper, rotation: 'normal', ...(coach?.style ?? {}) });
}
