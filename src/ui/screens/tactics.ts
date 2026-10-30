// Ecrã de táticas do teu clube
import { overall } from '../../core/attributes';
import { DESCRIPTIONS, LABELS, suggestTactics, Tactics } from '../../core/tactics';
import type { GameState, Player } from '../../core/types';

const POS_ORDER = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];

export function renderTactics(content: HTMLElement, s: GameState, clubId: string) {
  const squad = s.players.filter((p) => p.clubId === clubId).sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position));
  const gks = squad.filter((p) => p.position === 'GR');
  const outfield = squad.filter((p) => p.position !== 'GR');
  const t = s.tactics;

  const opt = (p: Player, sel: string | null) =>
    `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${p.name} (${p.position}, ${overall(p.attrs, p.position).toFixed(1).replace('.', ',')})</option>`;
  const select = <K extends keyof typeof LABELS>(key: K) => `
    <label>${{ system: 'Sistema', pressure: 'Pressão', tempo: 'Ritmo', marking: 'Marcação', flyingKeeper: 'Guarda-redes avançado', rotation: 'Rotação de quintetos' }[key]}
      <select data-k="${key}">${Object.entries(LABELS[key])
        .map(([v, l]) => `<option value="${v}" ${(t as unknown as Record<string, string>)[key] === v ? 'selected' : ''}>${l}</option>`)
        .join('')}</select>
      <span class="small muted" data-d="${key}">${DESCRIPTIONS[(t as unknown as Record<string, string>)[key]] ?? ''}</span>
    </label>`;
  const qRow = (q: 'q1' | 'q2', label: string) => `
    <div class="qrow"><b>${label}</b>${[0, 1, 2, 3]
      .map((i) => `<select data-q="${q}" data-i="${i}"><option value="">-</option>${outfield.map((p) => opt(p, t[q][i] ?? null)).join('')}</select>`)
      .join('')}</div>`;

  content.innerHTML = `
    <h2>Táticas</h2>
    <div class="tac-grid">
      ${select('system')}
      ${select('pressure')}
      ${select('tempo')}
      ${select('marking')}
      ${select('flyingKeeper')}
      ${select('rotation')}
    </div>
    <h3>Quintetos</h3>
    <div class="qrow"><b>Guarda-redes</b><select data-gk>${gks.map((p) => opt(p, t.gk)).join('')}</select></div>
    ${qRow('q1', '1.º quinteto')}
    ${qRow('q2', '2.º quinteto')}
    <p class="small muted" id="qwarn"></p>
    <div class="row" style="justify-content:flex-start">
      <button class="btn" id="suggest">Sugerir quintetos</button>
      <span class="small muted" id="saved"></span>
    </div>
    <p class="small muted">As alterações ficam guardadas automaticamente e aplicam-se no próximo jogo. Os jogadores fora dos quintetos entram quando alguém está cansado ou expulso.</p>`;

  const flash = () => {
    const el = content.querySelector('#saved')!;
    el.textContent = 'Guardado';
    setTimeout(() => (el.textContent = ''), 1200);
  };
  const warn = () => {
    const all = [...t.q1, ...t.q2].filter(Boolean);
    const dup = all.length !== new Set(all).size;
    content.querySelector('#qwarn')!.textContent = dup ? 'Atenção: há jogadores repetidos nos dois quintetos.' : '';
  };

  content.querySelectorAll<HTMLSelectElement>('[data-k]').forEach((el) =>
    el.addEventListener('change', () => {
      (t as unknown as Record<string, string>)[el.dataset.k!] = el.value;
      content.querySelector(`[data-d="${el.dataset.k}"]`)!.textContent = DESCRIPTIONS[el.value] ?? '';
      flash();
    })
  );
  content.querySelectorAll<HTMLSelectElement>('[data-q]').forEach((el) =>
    el.addEventListener('change', () => {
      const q = el.dataset.q as 'q1' | 'q2';
      const arr = [...t[q]];
      arr[Number(el.dataset.i)] = el.value;
      t[q] = arr.filter((x) => x !== undefined) as string[];
      t[q] = [0, 1, 2, 3].map((i) => arr[i] ?? '').filter(Boolean);
      warn();
      flash();
    })
  );
  content.querySelector<HTMLSelectElement>('[data-gk]')!.addEventListener('change', (e) => {
    t.gk = (e.target as HTMLSelectElement).value;
    flash();
  });
  content.querySelector('#suggest')!.addEventListener('click', () => {
    const sug = suggestTactics(squad);
    t.gk = sug.gk;
    t.q1 = sug.q1;
    t.q2 = sug.q2;
    renderTactics(content, s, clubId);
  });
  warn();
}

export function tacticsSummary(t: Tactics) {
  return `${t.system} · pressão ${t.pressure === 'media' ? 'média' : t.pressure} · ritmo ${t.tempo === 'rapido' ? 'rápido' : t.tempo} · marcação ${t.marking === 'misto' ? 'mista' : t.marking}`;
}
