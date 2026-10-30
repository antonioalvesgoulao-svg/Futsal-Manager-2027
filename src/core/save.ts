import { GameState, SAVE_VERSION } from './types';

const PREFIX = 'fm27_save_';
export const SLOTS = [1, 2, 3];

export interface SlotInfo {
  slot: number;
  label: string | null;
}

function key(slot: number) {
  return PREFIX + slot;
}

export function saveToSlot(slot: number, s: GameState) {
  try {
    localStorage.setItem(key(slot), JSON.stringify({ savedAt: new Date().toISOString(), state: s }));
    return true;
  } catch {
    return false;
  }
}

export function loadFromSlot(slot: number): GameState | null {
  try {
    const raw = localStorage.getItem(key(slot));
    if (!raw) return null;
    const data = JSON.parse(raw);
    return migrate(data.state);
  } catch {
    return null;
  }
}

export function deleteSlot(slot: number) {
  try {
    localStorage.removeItem(key(slot));
  } catch {
    /* ignorar */
  }
}

export function listSlots(): SlotInfo[] {
  return SLOTS.map((slot) => {
    try {
      const raw = localStorage.getItem(key(slot));
      if (!raw) return { slot, label: null };
      const d = JSON.parse(raw);
      const st: GameState = d.state;
      const club = st.clubs.find((c) => c.id === st.clubId)?.name ?? '?';
      const when = new Date(d.savedAt).toLocaleString('pt-PT');
      return { slot, label: `${st.manager.name} · ${club} · ${st.season.label} · gravado ${when}` };
    } catch {
      return { slot, label: null };
    }
  });
}

// Exportar para ficheiro (backup fora do browser)
export function exportSave(s: GameState) {
  const blob = new Blob([JSON.stringify(s, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `fm27_${s.manager.name.replace(/\s+/g, '_')}_${s.date}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importSave(file: File): Promise<GameState> {
  const text = await file.text();
  return migrate(JSON.parse(text));
}

// Garante compatibilidade com saves de versões anteriores
function migrate(s: GameState): GameState {
  if (!s || typeof s !== 'object' || !s.manager) throw new Error('Ficheiro inválido');
  if (s.version > SAVE_VERSION) throw new Error('Save de uma versão mais recente do jogo');
  if (s.version < 6) throw new Error('Save de uma etapa anterior. Começa um jogo novo.');
  s.version = SAVE_VERSION;
  return s;
}
