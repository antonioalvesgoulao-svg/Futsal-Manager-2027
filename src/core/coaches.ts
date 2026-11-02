// Treinadores: atributos e estilo tático das equipas controladas pela IA
import { overall, rng } from './attributes';
import { suggestTactics, Tactics } from './tactics';
import { chooseSystem } from './tacticalAI';
import type { Club, Coach, Player } from './types';

// Estilo deduzido do plantel e do nível do clube (com alguma personalidade do treinador)
export function aiTactics(squad: Player[], club: Club, coach?: Coach, oppMarking?: Tactics['marking']): Tactics {
  const r = rng('estilo-' + (coach?.id ?? club.id));
  const out = squad.filter((p) => p.position !== 'GR').sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position)).slice(0, 8);
  void out;
  // sistema pela avaliação global do plantel (pivôs, fixos, alas, universais, mobilidade técnica, físico) e pela
  // personalidade do treinador; antes bastava um pivô com jogo de costas >= 15 para escolher sempre 3-1 (90% dos jogos)
  const system: Tactics['system'] = chooseSystem(squad, r, oppMarking);
  const pressure: Tactics['pressure'] = club.level >= 85 ? 'alta' : club.level >= 65 ? (r() < 0.3 ? 'alta' : 'media') : r() < 0.5 ? 'baixa' : 'media';
  const tempo: Tactics['tempo'] = club.level >= 85 ? 'paciente' : r() < 0.35 ? 'rapido' : 'equilibrado';
  const marking: Tactics['marking'] = r() < 0.6 ? 'zona' : r() < 0.5 ? 'individual' : 'misto';
  const flyingKeeper: Tactics['flyingKeeper'] = r() < 0.3 ? 'agressivo' : 'auto';
  // estilo do GR conforme o jogo de pés do titular
  const gkFeet = Math.max(0, ...squad.filter((p) => p.position === 'GR').map((p) => p.attrs.jogoPes));
  const gkStyle: Tactics['gkStyle'] = gkFeet >= 15 && r() < 0.45 ? 'avancado' : gkFeet >= 12 && r() < 0.5 ? 'construtor' : 'classico';
  return suggestTactics(squad, { system, pressure, tempo, marking, flyingKeeper, gkStyle, rotation: 'normal', ...(coach?.style ?? {}) });
}
