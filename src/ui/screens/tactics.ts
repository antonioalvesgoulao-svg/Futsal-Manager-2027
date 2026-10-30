// Quadro tático do teu clube: campo com os quintetos, como no Football Manager
import { overall, starsHtml } from '../../core/attributes';
import { arrangeForSystem, DESCRIPTIONS, GK_SLOT, LABELS, roleFit, SLOTS, suggestTactics, System, Tactics } from '../../core/tactics';
import type { GameState, Player } from '../../core/types';

const POS_ORDER = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];
type Q = 'q1' | 'q2';

// Estado do ecrã (fora do jogo gravado)
let activeQ: Q = 'q1';
let selected: number | 'gk' | null = null; // posição escolhida no campo

const fitClass = (f: number) => (f >= 0.85 ? 'fit-g' : f >= 0.6 ? 'fit-y' : 'fit-r');
const ovr = (p: Player) => overall(p.attrs, p.position).toFixed(1).replace('.', ',');
const surname = (n: string) => (n.split(' ').length > 1 ? n.split(' ').slice(-1)[0] : n);

function courtSvg(t: Tactics) {
  // Campo 40 x 20 m desenhado a 10 px por metro
  const press = { alta: [240, 400], media: [170, 300], baixa: [120, 220] }[t.pressure];
  return `
  <svg class="court" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
    <rect x="0" y="0" width="400" height="200" class="floor"/>
    <rect x="${press[0]}" y="0" width="${press[1] - press[0]}" height="200" class="press"/>
    <rect x="1" y="1" width="398" height="198" class="line"/>
    <line x1="200" y1="0" x2="200" y2="200" class="line"/>
    <circle cx="200" cy="100" r="30" class="line"/>
    <circle cx="200" cy="100" r="2" class="dot"/>
    <path d="M0,40 A60,60 0 0 1 60,85 L60,115 A60,60 0 0 1 0,160" class="line"/>
    <path d="M400,40 A60,60 0 0 0 340,85 L340,115 A60,60 0 0 0 400,160" class="line"/>
    <circle cx="60" cy="100" r="2" class="dot"/><circle cx="340" cy="100" r="2" class="dot"/>
    <circle cx="100" cy="100" r="2" class="dot"/><circle cx="300" cy="100" r="2" class="dot"/>
    <rect x="-6" y="85" width="6" height="30" class="goal"/><rect x="400" y="85" width="6" height="30" class="goal"/>
    <text x="${(press[0] + press[1]) / 2}" y="194" class="press-label">pressão ${t.pressure === 'media' ? 'média' : t.pressure}</text>
  </svg>`;
}

export function renderTactics(content: HTMLElement, s: GameState, clubId: string) {
  const squad = s.players.filter((p) => p.clubId === clubId).sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position) || overall(b.attrs, b.position) - overall(a.attrs, a.position));
  const byId = (id?: string | null) => squad.find((p) => p.id === id);
  const t = s.tactics;
  const slots = SLOTS[t.system];
  const q = t[activeQ];
  const otherQ = t[activeQ === 'q1' ? 'q2' : 'q1'];

  const token = (p: Player | undefined, label: string, x: number, y: number, key: string, fit: number | null) => `
    <div class="token ${selected === (key === 'gk' ? 'gk' : Number(key)) ? 'sel' : ''} ${p ? '' : 'empty'}" style="left:${x}%;top:${y}%" data-slot="${key}" draggable="${p ? 'true' : 'false'}">
      <div class="disc ${p && fit !== null ? fitClass(fit) : ''} ${key === 'gk' ? 'gkdisc' : ''}">${p?.number ?? '+'}</div>
      <div class="tname">${p ? surname(p.name) : 'Vazio'}</div>
      <div class="trole">${label}</div>
    </div>`;

  const segs = <K extends keyof typeof LABELS>(key: K, title: string) => `
    <div class="seg-group">
      <div class="seg-title">${title}</div>
      <div class="seg">${Object.entries(LABELS[key])
        .map(([v, l]) => `<button class="${(t as unknown as Record<string, string>)[key] === v ? 'on' : ''}" data-k="${key}" data-v="${v}" title="${l}">${l.split(' (')[0]}</button>`)
        .join('')}</div>
      <div class="small muted seg-desc">${DESCRIPTIONS[(t as unknown as Record<string, string>)[key]] ?? (LABELS[key] as Record<string, string>)[(t as unknown as Record<string, string>)[key]]}</div>
    </div>`;

  const selRole = selected === 'gk' ? null : selected !== null ? slots[selected].role : null;
  const listRow = (p: Player) => {
    const inQ = q.includes(p.id) || t.gk === p.id;
    const inOther = otherQ.includes(p.id);
    const fit = selected === 'gk' ? (p.position === 'GR' ? 1 : 0) : selRole ? roleFit(selRole, p.position) : null;
    return `<tr class="pl ${inQ ? 'inq' : ''}" data-pid="${p.id}" draggable="true">
      <td>${p.number ?? '-'}</td><td>${p.name}</td><td>${p.position}</td><td>${ovr(p)}</td><td>${starsHtml(overall(p.attrs, p.position))}</td>
      <td>${fit !== null ? `<span class="fitdot ${fitClass(fit)}"></span>` : ''}</td>
      <td class="small muted">${inQ ? (t.gk === p.id ? 'GR' : activeQ === 'q1' ? '1.º' : '2.º') : inOther ? (activeQ === 'q1' ? '2.º' : '1.º') : ''}</td></tr>`;
  };

  content.innerHTML = `
    <h2>Táticas</h2>
    <div class="tboard">
      <div>
        <div class="tabs">
          <button class="tab ${activeQ === 'q1' ? 'on' : ''}" data-q="q1">1.º quinteto</button>
          <button class="tab ${activeQ === 'q2' ? 'on' : ''}" data-q="q2">2.º quinteto</button>
          <span class="spacer"></span>
          <button class="tab" id="suggest">Sugerir quintetos</button>
        </div>
        <div class="court-wrap">
          ${courtSvg(t)}
          ${token(byId(t.gk), 'Guarda-redes', GK_SLOT.x, GK_SLOT.y, 'gk', 1)}
          ${slots.map((sl, i) => { const p = byId(q[i]); return token(p, sl.label, sl.x, sl.y, String(i), p ? roleFit(sl.role, p.position) : null); }).join('')}
          <div class="attack-arrow">ataque ▸</div>
        </div>
        <p class="small muted">${selected !== null ? `A escolher: <b>${selected === 'gk' ? 'Guarda-redes' : slots[selected].label}</b>. Clica num jogador da lista (ou arrasta-o) para o colocar aqui.` : 'Clica numa posição no campo e depois num jogador da lista, ou arrasta jogadores para o campo. Arrasta entre posições para trocar.'}
        <span class="fitdot fit-g"></span> função ideal <span class="fitdot fit-y"></span> adaptado <span class="fitdot fit-r"></span> fora de posição</p>
        <div class="seg-grid">
          ${segs('system', 'Sistema')}
          ${segs('pressure', 'Pressão')}
          ${segs('tempo', 'Ritmo')}
          ${segs('marking', 'Marcação')}
          ${segs('flyingKeeper', 'Guarda-redes avançado')}
          ${segs('rotation', 'Rotação de quintetos')}
        </div>
      </div>
      <div class="tlist">
        <table class="tbl small"><thead><tr><th>Nº</th><th>Jogador</th><th>Pos</th><th>Val</th><th></th><th>Função</th><th>Quint.</th></tr></thead>
        <tbody>${squad.map(listRow).join('')}</tbody></table>
        <p class="small muted">Os jogadores fora dos quintetos entram quando alguém está cansado ou é expulso. As alterações gravam sozinhas.</p>
      </div>
    </div>`;

  const rerender = () => renderTactics(content, s, clubId);

  // Colocar um jogador numa posição (troca se já estiver noutra posição deste quinteto)
  const place = (slot: number | 'gk', pid: string) => {
    const p = byId(pid);
    if (!p) return;
    if (slot === 'gk') {
      if (p.position !== 'GR') return alert('Só guarda-redes podem ocupar esta posição.');
      t.gk = pid;
    } else {
      if (p.position === 'GR') return alert('Os guarda-redes ficam na baliza.');
      const arr = [0, 1, 2, 3].map((i) => q[i] ?? '');
      const from = arr.indexOf(pid);
      if (from >= 0) arr[from] = arr[slot];
      arr[slot] = pid;
      t[activeQ] = arr.filter((x, i) => x || i < 4).map((x) => x) as string[];
      t[activeQ] = arr;
    }
    selected = null;
    rerender();
  };

  content.querySelectorAll<HTMLElement>('[data-q]').forEach((b) => b.addEventListener('click', () => { activeQ = b.dataset.q as Q; selected = null; rerender(); }));
  content.querySelector('#suggest')!.addEventListener('click', () => {
    const sug = suggestTactics(squad, { system: t.system });
    t.gk = sug.gk; t.q1 = sug.q1; t.q2 = sug.q2; selected = null; rerender();
  });
  content.querySelectorAll<HTMLButtonElement>('[data-k]').forEach((b) =>
    b.addEventListener('click', () => {
      (t as unknown as Record<string, string>)[b.dataset.k!] = b.dataset.v!;
      // ao mudar de sistema, reorganiza os quintetos pelas novas posições
      if (b.dataset.k === 'system') {
        for (const k of ['q1', 'q2'] as Q[]) t[k] = arrangeForSystem(t[k].map((id) => byId(id)), t.system as System).map((p) => p?.id ?? '');
      }
      rerender();
    })
  );
  content.querySelectorAll<HTMLElement>('[data-slot]').forEach((el) => {
    const key = el.dataset.slot!;
    const slot: number | 'gk' = key === 'gk' ? 'gk' : Number(key);
    el.addEventListener('click', () => { selected = selected === slot ? null : slot; rerender(); });
    el.addEventListener('dragstart', (e) => e.dataTransfer!.setData('text/slot', key));
    el.addEventListener('dragover', (e) => e.preventDefault());
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      const pid = e.dataTransfer!.getData('text/pid');
      const from = e.dataTransfer!.getData('text/slot');
      if (pid) place(slot, pid);
      else if (from && from !== 'gk' && slot !== 'gk') {
        const arr = [0, 1, 2, 3].map((i) => q[i] ?? '');
        [arr[Number(from)], arr[slot]] = [arr[slot], arr[Number(from)]];
        t[activeQ] = arr;
        rerender();
      }
    });
  });
  content.querySelectorAll<HTMLElement>('[data-pid]').forEach((row) => {
    row.addEventListener('click', () => { if (selected !== null) place(selected, row.dataset.pid!); });
    row.addEventListener('dragstart', (e) => e.dataTransfer!.setData('text/pid', row.dataset.pid!));
  });
}

export function tacticsSummary(t: Tactics) {
  return `${t.system} · pressão ${t.pressure === 'media' ? 'média' : t.pressure} · ritmo ${t.tempo === 'rapido' ? 'rápido' : t.tempo} · marcação ${t.marking === 'misto' ? 'mista' : t.marking}`;
}
