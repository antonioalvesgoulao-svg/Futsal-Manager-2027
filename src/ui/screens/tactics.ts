// Quadro tático do teu clube: campo com os quintetos, como no Football Manager.
// Vistas: com bola, sem bola, 5x4, cantos e livres. A tática escolhida muda o desenho no campo.
import { overall, starsHtml } from '../../core/attributes';
import {
  arrangeForSystem, DESCRIPTIONS, GK_SLOT, LABELS, normalizeTactics, roleFit, SLOTS, suggestSetPieces, suggestTactics, System, Tactics,
} from '../../core/tactics';
import type { GameState, Player } from '../../core/types';

const POS_ORDER = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];
type Q = 'q1' | 'q2';
type View = 'ataque' | 'defesa' | '5x4' | 'cantos' | 'livres';
type Pt = { x: number; y: number };

// Estado do ecrã (não fica no jogo gravado)
let activeQ: Q = 'q1';
let view: View = 'ataque';
let selected: number | 'gk' | null = null;

const fitClass = (f: number) => (f >= 0.85 ? 'fit-g' : f >= 0.6 ? 'fit-y' : 'fit-r');
const ovr = (p: Player) => overall(p.attrs, p.position).toFixed(1).replace('.', ',');
const surname = (n: string) => (n.split(' ').length > 1 ? n.split(' ').slice(-1)[0] : n);
const clampP = (v: number) => Math.max(3, Math.min(97, v));

// Converte % do campo para coordenadas do desenho (400 x 200)
const X = (p: Pt) => p.x * 4;
const Y = (p: Pt) => p.y * 2;
const arrow = (a: Pt, b: Pt, cls = 'arr', curve = 0) => {
  if (!curve) return `<line x1="${X(a)}" y1="${Y(a)}" x2="${X(b)}" y2="${Y(b)}" class="${cls}" marker-end="url(#ah)"/>`;
  const mx = (X(a) + X(b)) / 2 - (Y(b) - Y(a)) * curve;
  const my = (Y(a) + Y(b)) / 2 + (X(b) - X(a)) * curve;
  return `<path d="M${X(a)},${Y(a)} Q${mx},${my} ${X(b)},${Y(b)}" class="${cls}" marker-end="url(#ah)"/>`;
};

// Posições de cada jogador de campo conforme a vista e a tática
function layout(t: Tactics, v: View): { pts: Pt[]; gk: Pt | null; extra: Pt | null; ball: Pt | null } {
  const slots = SLOTS[t.system];
  if (v === 'ataque') return { pts: slots.map((s) => ({ x: clampP(s.x + 10), y: s.y })), gk: { x: 10, y: 50 }, extra: null, ball: null };
  if (v === 'defesa') {
    // o bloco sobe ou desce conforme a pressão
    const k = { alta: { a: 38, b: 0.55, w: 0.85 }, media: { a: 16, b: 0.5, w: 0.78 }, baixa: { a: 8, b: 0.33, w: 0.7 } }[t.pressure];
    return { pts: slots.map((s) => ({ x: clampP(k.a + s.x * k.b), y: 50 + (s.y - 50) * k.w })), gk: GK_SLOT, extra: null, ball: null };
  }
  if (v === '5x4') {
    return { pts: [{ x: 58, y: 50 }, { x: 70, y: 14 }, { x: 70, y: 86 }, { x: 86, y: 34 }], gk: null, extra: { x: 86, y: 66 }, ball: { x: 58, y: 50 } };
  }
  if (v === 'cantos') {
    const r = t.setPieces.cornerRoutine;
    const pos: Record<string, Pt[]> = {
      primeiro_poste: [{ x: 96, y: 6 }, { x: 88, y: 36 }, { x: 80, y: 66 }, { x: 58, y: 50 }],
      remate_fora: [{ x: 96, y: 6 }, { x: 70, y: 42 }, { x: 87, y: 66 }, { x: 54, y: 74 }],
      bloqueio_pivo: [{ x: 96, y: 6 }, { x: 90, y: 64 }, { x: 80, y: 38 }, { x: 60, y: 54 }],
      curto: [{ x: 96, y: 6 }, { x: 85, y: 18 }, { x: 76, y: 52 }, { x: 58, y: 66 }],
    };
    return { pts: pos[r], gk: { x: 30, y: 50 }, extra: null, ball: { x: 99, y: 1 } };
  }
  const r = t.setPieces.freeKickRoutine;
  const pos: Record<string, Pt[]> = {
    remate_direto: [{ x: 68, y: 50 }, { x: 86, y: 28 }, { x: 86, y: 72 }, { x: 52, y: 50 }],
    jogada_ensaiada: [{ x: 68, y: 50 }, { x: 80, y: 30 }, { x: 76, y: 70 }, { x: 52, y: 50 }],
    cruzamento: [{ x: 68, y: 36 }, { x: 89, y: 66 }, { x: 80, y: 22 }, { x: 54, y: 52 }],
  };
  return { pts: pos[r], gk: { x: 22, y: 50 }, extra: null, ball: { x: 70, y: 46 } };
}

// Setas e desenhos que mostram o efeito da tática
function overlay(t: Tactics, v: View, pts: Pt[]): string {
  let o = '';
  if (v === 'ataque') {
    const [a, b, c, d] = pts;
    if (t.system === '3-1') o += arrow(a, d, 'arr pass') + arrow(b, { x: b.x + 22, y: b.y + 6 }, 'arr run', 0.15) + arrow(c, { x: c.x + 22, y: c.y - 6 }, 'arr run', -0.15) + `<circle cx="${X(d)}" cy="${Y(d)}" r="22" class="hold"/>`;
    if (t.system === '4-0') o += arrow(a, b, 'arr rot', 0.25) + arrow(b, { x: b.x + 14, y: 50 }, 'arr rot', 0.3) + arrow(c, d, 'arr rot', 0.25) + arrow(d, a, 'arr rot', 0.25);
    if (t.system === '2-2') o += arrow(b, { x: c.x + 10, y: c.y - 10 }, 'arr run', 0.2) + arrow(c, { x: b.x + 10, y: b.y + 10 }, 'arr run', 0.2) + arrow(a, b, 'arr pass') + arrow(d, c, 'arr pass');
    if (t.system === '1-2-1') o += arrow(a, b, 'arr pass') + arrow(a, c, 'arr pass') + arrow(b, { x: b.x + 18, y: b.y + 4 }, 'arr run', 0.15) + arrow(c, { x: c.x + 18, y: c.y - 4 }, 'arr run', -0.15) + `<circle cx="${X(d)}" cy="${Y(d)}" r="22" class="hold"/>`;
    // ritmo: passe vertical direto ou circulação curta
    if (t.tempo === 'rapido') o += arrow({ x: 12, y: 50 }, { x: 72, y: 40 }, 'arr fast', 0.08) + `<text x="${X({ x: 40, y: 0 })}" y="${Y({ x: 0, y: 34 })}" class="olabel">saída rápida</text>`;
    if (t.tempo === 'paciente') o += arrow(b, a, 'arr slow', 0.3) + arrow(a, c, 'arr slow', 0.3) + `<text x="${X({ x: 30, y: 0 })}" y="${Y({ x: 0, y: 50 }) + 34}" class="olabel">circulação paciente</text>`;
  }
  if (v === 'defesa') {
    const line = Math.min(...pts.map((p) => p.x)) * 4;
    o += `<line x1="${line}" y1="6" x2="${line}" y2="194" class="dline"/><text x="${line + 4}" y="14" class="olabel">linha defensiva</text>`;
    const front = Math.max(...pts.map((p) => p.x)) * 4;
    o += `<line x1="${front}" y1="6" x2="${front}" y2="194" class="pline"/><text x="${front + 4}" y="196" class="olabel">primeira pressão</text>`;
    if (t.marking === 'individual' || t.marking === 'misto') {
      const n = t.marking === 'misto' ? 2 : 4;
      pts.slice(-n).forEach((p) => {
        const opp = { x: Math.max(4, p.x - 9), y: p.y + (p.y < 50 ? 6 : -6) };
        o += `<line x1="${X(p)}" y1="${Y(p)}" x2="${X(opp)}" y2="${Y(opp)}" class="mark"/><circle cx="${X(opp)}" cy="${Y(opp)}" r="7" class="opp"/>`;
      });
    }
    if (t.marking === 'zona' || t.marking === 'misto') {
      const n = t.marking === 'misto' ? 2 : 4;
      pts.slice(0, n).forEach((p) => (o += `<ellipse cx="${X(p)}" cy="${Y(p)}" rx="34" ry="30" class="zone"/>`));
    }
  }
  if (v === '5x4') {
    const [a, b, c, d] = pts;
    o += arrow(a, b, 'arr pass') + arrow(b, d, 'arr pass') + arrow(a, c, 'arr pass') + `<rect x="0" y="80" width="10" height="40" class="empty-goal"/><text x="14" y="104" class="olabel">baliza deserta: risco</text>`;
  }
  if (v === 'cantos') {
    const r = t.setPieces.cornerRoutine;
    const [k, a, b, c] = pts;
    if (r === 'primeiro_poste') o += arrow(k, { x: a.x + 2, y: a.y - 2 }, 'arr pass', 0.1) + arrow(b, { x: 93, y: 50 }, 'arr run');
    if (r === 'remate_fora') o += arrow(k, a, 'arr pass', 0.1) + arrow(a, { x: 99, y: 50 }, 'arr shot');
    if (r === 'bloqueio_pivo') o += arrow(b, { x: a.x - 3, y: a.y - 6 }, 'arr run') + arrow(k, a, 'arr pass', 0.12) + arrow(a, { x: 99, y: 54 }, 'arr shot');
    if (r === 'curto') o += arrow(k, a, 'arr pass') + arrow(a, b, 'arr pass') + arrow(b, c, 'arr pass');
  }
  if (v === 'livres') {
    const r = t.setPieces.freeKickRoutine;
    const [k, a, b] = pts;
    if (r === 'remate_direto') o += arrow(k, { x: 99, y: 46 }, 'arr shot', 0.06);
    if (r === 'jogada_ensaiada') o += arrow(k, b, 'arr pass') + arrow(b, a, 'arr pass', 0.15) + arrow(a, { x: 99, y: 48 }, 'arr shot');
    if (r === 'cruzamento') o += arrow(k, a, 'arr pass', -0.2) + arrow(a, { x: 99, y: 54 }, 'arr shot');
  }
  return o;
}

function courtSvg(t: Tactics, v: View, pts: Pt[]) {
  const press = { alta: [240, 400], media: [170, 300], baixa: [120, 220] }[t.pressure];
  return `
  <svg class="court" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahead"/></marker></defs>
    <rect x="0" y="0" width="400" height="200" class="floor"/>
    ${v === 'defesa' ? `<rect x="${press[0]}" y="0" width="${press[1] - press[0]}" height="200" class="press"/>` : ''}
    <rect x="1" y="1" width="398" height="198" class="line"/>
    <line x1="200" y1="0" x2="200" y2="200" class="line"/>
    <circle cx="200" cy="100" r="30" class="line"/>
    <path d="M0,40 A60,60 0 0 1 60,85 L60,115 A60,60 0 0 1 0,160" class="line"/>
    <path d="M400,40 A60,60 0 0 0 340,85 L340,115 A60,60 0 0 0 400,160" class="line"/>
    <circle cx="60" cy="100" r="2" class="dot"/><circle cx="340" cy="100" r="2" class="dot"/>
    <circle cx="100" cy="100" r="2" class="dot"/><circle cx="300" cy="100" r="2" class="dot"/>
    <rect x="-6" y="85" width="6" height="30" class="goal"/><rect x="400" y="85" width="6" height="30" class="goal"/>
    ${overlay(t, v, pts)}
  </svg>`;
}

export function renderTactics(content: HTMLElement, s: GameState, clubId: string) {
  const squad = s.players.filter((p) => p.clubId === clubId).sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position) || overall(b.attrs, b.position) - overall(a.attrs, a.position));
  const byId = (id?: string | null) => squad.find((p) => p.id === id);
  const t = normalizeTactics(s.tactics, squad);
  const slots = SLOTS[t.system];
  const q = t[activeQ];
  const otherQ = t[activeQ === 'q1' ? 'q2' : 'q1'];
  const L = layout(t, view);
  const editable = view === 'ataque' || view === 'defesa';

  // nas bolas paradas, o marcador aparece na primeira posição
  let shown = [0, 1, 2, 3].map((i) => byId(q[i]));
  if (view === 'cantos' || view === 'livres') {
    const kid = view === 'cantos' ? t.setPieces.corner : t.setPieces.freeKick;
    const k = byId(kid);
    if (k) {
      // o alvo da jogada é o mais indicado para a função
      const rest = shown.filter((p): p is Player => !!p && p.id !== k.id);
      const routine = view === 'cantos' ? t.setPieces.cornerRoutine : t.setPieces.freeKickRoutine;
      const score = (p: Player) =>
        routine === 'remate_fora' || routine === 'remate_direto' ? p.attrs.remate : routine === 'bloqueio_pivo' || routine === 'cruzamento' ? p.attrs.jogoCostas + p.attrs.finalizacao + (p.position === 'PIV' ? 6 : 0) : p.attrs.finalizacao + p.attrs.antecipacao;
      rest.sort((a, b) => score(b) - score(a));
      shown = [k, ...rest].slice(0, 4);
    }
  }

  const token = (p: Player | undefined, label: string, pt: Pt, key: string, fit: number | null) => `
    <div class="token ${selected === (key === 'gk' ? 'gk' : Number(key)) ? 'sel' : ''} ${p ? '' : 'empty'} ${editable ? '' : 'static'}" style="left:${pt.x}%;top:${pt.y}%" data-slot="${editable ? key : ''}" draggable="${p && editable ? 'true' : 'false'}">
      <div class="disc ${p && fit !== null ? fitClass(fit) : ''} ${key === 'gk' ? 'gkdisc' : ''}">${p?.number ?? (key === 'x' ? '+1' : '+')}</div>
      <div class="tname">${p ? surname(p.name) : key === 'x' ? 'Jogador extra' : 'Vazio'}</div>
      <div class="trole">${label}</div>
    </div>`;

  const segs = (key: string, title: string, val: string, opts: Record<string, string>, group = '') => `
    <div class="seg-group">
      <div class="seg-title">${title}</div>
      <div class="seg">${Object.entries(opts)
        .map(([v, l]) => `<button class="${val === v ? 'on' : ''}" data-k="${key}" data-v="${v}" data-g="${group}" title="${l}">${l.split(' (')[0]}</button>`)
        .join('')}</div>
      <div class="small muted seg-desc">${DESCRIPTIONS[val] ?? opts[val]}</div>
    </div>`;
  const tv = t as unknown as Record<string, string>;

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

  const out = squad.filter((p) => p.position !== 'GR');
  const takerSel = (key: string, label: string, hint: string) => `
    <label class="taker">${label}
      <select data-sp="${key}">${out.map((p) => `<option value="${p.id}" ${(t.setPieces as unknown as Record<string, string>)[key] === p.id ? 'selected' : ''}>${p.name} (BP ${p.attrs.bolasParadas}, ${hint === 'rem' ? `rem ${p.attrs.remate}` : hint === 'fin' ? `fin ${p.attrs.finalizacao}` : `pas ${p.attrs.passe}`})</option>`).join('')}</select>
    </label>`;

  const cornerLabels: Record<string, string[]> = {
    primeiro_poste: ['Marcador', 'Desvio', 'Segundo poste', 'Equilíbrio'],
    remate_fora: ['Marcador', 'Rematador', 'Recarga', 'Equilíbrio'],
    bloqueio_pivo: ['Marcador', 'Pivô', 'Bloqueio', 'Equilíbrio'],
    curto: ['Marcador', 'Apoio curto', 'Apoio', 'Equilíbrio'],
  };
  const fkLabels: Record<string, string[]> = {
    remate_direto: ['Marcador', 'Recarga', 'Recarga', 'Equilíbrio'],
    jogada_ensaiada: ['Marcador', 'Rematador', 'Apoio', 'Equilíbrio'],
    cruzamento: ['Marcador', 'Finalizador', 'Apoio', 'Equilíbrio'],
  };
  const labels = view === 'cantos' ? cornerLabels[t.setPieces.cornerRoutine] : view === 'livres' ? fkLabels[t.setPieces.freeKickRoutine] : view === '5x4' ? ['Organizador', 'Ala E', 'Ala D', 'Pivô'] : slots.map((x) => x.label);

  const viewHelp: Record<View, string> = {
    ataque: 'Com bola: posicionamento a atacar, movimentos do sistema e ritmo de jogo.',
    defesa: `Sem bola: o bloco ${t.pressure === 'alta' ? 'sobe para pressionar alto' : t.pressure === 'baixa' ? 'recua para a sua meia-campo' : 'fica a meio-campo'} e a marcação ${t.marking === 'zona' ? 'é à zona' : t.marking === 'individual' ? 'é individual' : 'é mista'}.`,
    '5x4': `Guarda-redes avançado: ${LABELS.flyingKeeper[t.flyingKeeper]}. Superioridade numérica no ataque, baliza deserta em caso de perda.`,
    cantos: 'Jogada de canto ensaiada e quem a marca.',
    livres: 'Livres diretos antes da 6.ª falta: jogada e quem marca.',
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
        <div class="tabs views">
          ${(['ataque', 'defesa', '5x4', 'cantos', 'livres'] as View[]).map((v) => `<button class="tab ${view === v ? 'on' : ''}" data-view="${v}">${{ ataque: 'Com bola', defesa: 'Sem bola', '5x4': '5x4', cantos: 'Cantos', livres: 'Livres' }[v]}</button>`).join('')}
        </div>
        <div class="court-wrap">
          ${courtSvg(t, view, L.pts)}
          ${L.gk ? token(byId(t.gk), 'Guarda-redes', L.gk, 'gk', 1) : ''}
          ${L.pts.map((pt, i) => { const p = shown[i]; return token(p, labels[i], pt, String(i), p && editable ? roleFit(slots[i].role, p.position) : null); }).join('')}
          ${L.extra ? token(undefined, 'GR avançado', L.extra, 'x', null) : ''}
          ${L.ball ? `<div class="ball" style="left:${L.ball.x}%;top:${L.ball.y}%"></div>` : ''}
          <div class="attack-arrow">ataque ▸</div>
        </div>
        <p class="small muted">${viewHelp[view]} ${editable ? (selected !== null ? `A escolher: <b>${selected === 'gk' ? 'Guarda-redes' : slots[selected].label}</b>. Clica num jogador da lista (ou arrasta-o).` : 'Clica numa posição e depois num jogador, ou arrasta. Arrasta entre posições para trocar.') : ''}
        ${editable ? '<span class="fitdot fit-g"></span> ideal <span class="fitdot fit-y"></span> adaptado <span class="fitdot fit-r"></span> fora de posição' : ''}</p>
        ${view === 'cantos' || view === 'livres' ? `
        <div class="seg-grid">
          ${view === 'cantos' ? segs('cornerRoutine', 'Jogada de canto', t.setPieces.cornerRoutine, LABELS.cornerRoutine, 'sp') : segs('freeKickRoutine', 'Jogada de livre', t.setPieces.freeKickRoutine, LABELS.freeKickRoutine, 'sp')}
        </div>
        <h3>Marcadores de bolas paradas</h3>
        <div class="takers">
          ${takerSel('penalty', 'Penáltis', 'fin')}
          ${takerSel('free10', 'Livres de 10 m (6.ª falta)', 'rem')}
          ${takerSel('corner', 'Cantos', 'pas')}
          ${takerSel('freeKick', 'Livres', 'rem')}
          ${takerSel('kickIn', 'Pontapés de linha lateral', 'pas')}
        </div>
        <button class="btn" id="sugsp">Sugerir marcadores</button>
        <p class="small muted">Se o marcador escolhido não estiver em campo, bate o melhor que estiver.</p>` : `
        <div class="seg-grid">
          ${segs('system', 'Sistema', tv.system, LABELS.system)}
          ${segs('pressure', 'Pressão', tv.pressure, LABELS.pressure)}
          ${segs('tempo', 'Ritmo', tv.tempo, LABELS.tempo)}
          ${segs('marking', 'Marcação', tv.marking, LABELS.marking)}
          ${segs('flyingKeeper', 'Guarda-redes avançado', tv.flyingKeeper, LABELS.flyingKeeper)}
          ${segs('rotation', 'Rotação de quintetos', tv.rotation, LABELS.rotation)}
        </div>`}
      </div>
      <div class="tlist">
        <table class="tbl small"><thead><tr><th>Nº</th><th>Jogador</th><th>Pos</th><th>Val</th><th></th><th>Função</th><th>Quint.</th></tr></thead>
        <tbody>${squad.map(listRow).join('')}</tbody></table>
        <p class="small muted">Os jogadores fora dos quintetos entram quando alguém está cansado ou é expulso. As alterações gravam sozinhas.</p>
      </div>
    </div>`;

  const rerender = () => renderTactics(content, s, clubId);

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
      t[activeQ] = arr;
    }
    selected = null;
    rerender();
  };

  content.querySelectorAll<HTMLElement>('[data-q]').forEach((b) => b.addEventListener('click', () => { activeQ = b.dataset.q as Q; selected = null; rerender(); }));
  content.querySelectorAll<HTMLElement>('[data-view]').forEach((b) => b.addEventListener('click', () => { view = b.dataset.view as View; selected = null; rerender(); }));
  content.querySelector('#suggest')!.addEventListener('click', () => {
    const sug = suggestTactics(squad, { system: t.system });
    t.gk = sug.gk; t.q1 = sug.q1; t.q2 = sug.q2; selected = null; rerender();
  });
  content.querySelector('#sugsp')?.addEventListener('click', () => {
    t.setPieces = suggestSetPieces(squad, { cornerRoutine: t.setPieces.cornerRoutine, freeKickRoutine: t.setPieces.freeKickRoutine });
    rerender();
  });
  content.querySelectorAll<HTMLSelectElement>('[data-sp]').forEach((el) =>
    el.addEventListener('change', () => { (t.setPieces as unknown as Record<string, string>)[el.dataset.sp!] = el.value; rerender(); })
  );
  content.querySelectorAll<HTMLButtonElement>('[data-k]').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.g === 'sp') (t.setPieces as unknown as Record<string, string>)[b.dataset.k!] = b.dataset.v!;
      else (t as unknown as Record<string, string>)[b.dataset.k!] = b.dataset.v!;
      if (b.dataset.k === 'system') {
        for (const k of ['q1', 'q2'] as Q[]) t[k] = arrangeForSystem(t[k].map((id) => byId(id)), t.system as System).map((p) => p?.id ?? '');
      }
      rerender();
    })
  );
  content.querySelectorAll<HTMLElement>('[data-slot]').forEach((el) => {
    const key = el.dataset.slot!;
    if (!key || key === 'x') return;
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
