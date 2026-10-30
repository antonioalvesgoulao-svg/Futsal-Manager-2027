import { go, h } from '../router';
import { advanceDay, getState, myClub } from '../../core/state';
import { exportSave, saveToSlot, SLOTS } from '../../core/save';
import { ATTR_GROUPS, overall, starsHtml } from '../../core/attributes';
import type { Player } from '../../core/types';
import { renderFriendly } from './friendly';

const POS_NAME: Record<string, string> = {
  GR: 'Guarda-redes', FIX: 'Fixo', 'FIX/ALA': 'Fixo / Ala', UNI: 'Universal', ALA: 'Ala', 'ALA/PIV': 'Ala / Pivô', PIV: 'Pivô',
};

function attrClass(v: number) {
  return v >= 16 ? 'a4' : v >= 13 ? 'a3' : v >= 10 ? 'a2' : 'a1';
}

function playerProfile(p: Player) {
  const groups = Object.entries(ATTR_GROUPS).filter(([g]) => (p.position === 'GR' ? true : g !== 'guardaRedes'));
  return `
    <button class="btn ghost" data-back>◂ Plantel</button>
    <h2 style="margin-top:12px">${p.number ?? '-'} · ${p.name}</h2>
    <table class="tbl" style="margin-bottom:16px">
      <tr><th>Posição</th><td>${POS_NAME[p.position]}</td><th>Idade</th><td>${p.age}</td></tr>
      <tr><th>Nacionalidade</th><td>${p.nationality}</td><th>Valor atual</th><td>${starsHtml(overall(p.attrs, p.position))}</td></tr>
      <tr><th></th><td></td><th>Potencial</th><td>${starsHtml(p.potential)}</td></tr>
    </table>
    <div class="attr-grid">
      ${groups
        .map(
          ([, g]) => `<div class="attr-col"><h3>${g.label}</h3>${Object.entries(g.attrs)
            .map(([k, label]) => {
              const v = p.attrs[k as keyof Player['attrs']];
              return `<div class="attr"><span>${label}</span><b class="${attrClass(v)}">${v}</b></div>`;
            })
            .join('')}</div>`
        )
        .join('')}
    </div>`;
}

// Secções do jogo. As que ainda não existem mostram a etapa em que entram.
const SECTIONS: { id: string; label: string; stage: string }[] = [
  { id: 'inicio', label: 'Início', stage: '' },
  { id: 'plantel', label: 'Plantel', stage: '' },
  { id: 'amigavel', label: 'Jogo amigável', stage: '' },
  { id: 'taticas', label: 'Táticas', stage: 'Etapa 5' },
  { id: 'calendario', label: 'Calendário', stage: 'Etapa 6' },
  { id: 'competicoes', label: 'Competições', stage: 'Etapa 6' },
  { id: 'treino', label: 'Treino', stage: 'Etapa 9' },
  { id: 'mercado', label: 'Mercado', stage: 'Etapa 10' },
  { id: 'financas', label: 'Finanças', stage: 'Etapa 10' },
  { id: 'staff', label: 'Staff', stage: 'Etapa 11' },
  { id: 'formacao', label: 'Formação', stage: 'Etapa 11' },
];

export function homeScreen(root: HTMLElement) {
  const s = getState();
  if (!s) return go('menu');
  const club = myClub(s);
  let section = 'inicio';
  let playerId: string | null = null;

  const el = h(`
    <div class="layout">
      <header class="top" style="--c1:${club.colors[0]};--c2:${club.colors[1]}">
        <div class="crest">${club.shortName}</div>
        <div><strong>${club.name}</strong><div class="muted small">${s.manager.name} · ${s.season}</div></div>
        <div class="spacer"></div>
        <div class="date" id="date"></div>
        <button class="btn primary" id="next">Continuar ▸</button>
      </header>
      <nav class="side" id="nav"></nav>
      <main class="content" id="content"></main>
    </div>`);
  root.append(el);

  const nav = el.querySelector('#nav')!;
  const content = el.querySelector<HTMLElement>('#content')!;
  const dateEl = el.querySelector('#date')!;

  function renderDate() {
    dateEl.textContent = new Date(s!.date).toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }

  function renderNav() {
    nav.innerHTML =
      SECTIONS.map((x) => `<button class="nav ${x.id === section ? 'on' : ''}" data-s="${x.id}">${x.label}</button>`).join('') +
      `<div class="spacer"></div>
       <button class="nav" data-a="save">Gravar</button>
       <button class="nav" data-a="export">Exportar ficheiro</button>
       <button class="nav" data-a="menu">Menu principal</button>`;
  }

  function renderContent() {
    const sec = SECTIONS.find((x) => x.id === section)!;
    if (section === 'inicio') {
      content.innerHTML = `
        <h2>Início</h2>
        <table class="tbl">
          <tr><th>Clube</th><td>${club.name}</td></tr>
          <tr><th>Cidade</th><td>${club.city}</td></tr>
          <tr><th>Pavilhão</th><td>${club.arena}</td></tr>
          <tr><th>Reputação no futsal</th><td>${club.reputation}/100</td></tr>
          <tr><th>Poder financeiro</th><td>${club.wealth}/100</td></tr>
          <tr><th>Nível do plantel</th><td>${club.level}/100</td></tr>
          <tr><th>Treinador</th><td>${s!.manager.name} (${s!.manager.nationality})</td></tr>
          <tr><th>Época</th><td>${s!.season}</td></tr>
        </table>
        <p class="muted">Usa "Continuar" para avançar no calendário.</p>`;
    } else if (section === 'amigavel') {
      renderFriendly(content, s!, club.id);
    } else if (section === 'plantel' && playerId) {
      content.innerHTML = playerProfile(s!.players.find((p) => p.id === playerId)!);
    } else if (section === 'plantel') {
      const order = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];
      const squad = s!.players
        .filter((p) => p.clubId === club.id)
        .sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position) || (a.number ?? 99) - (b.number ?? 99));
      content.innerHTML = `
        <h2>Plantel <span class="muted small">${squad.length} jogadores</span></h2>
        <table class="tbl">
          <thead><tr><th>Nº</th><th>Nome</th><th>Posição</th><th>Idade</th><th>Nacionalidade</th><th>Atual</th><th>Potencial</th></tr></thead>
          <tbody>${squad
            .map((p) => `<tr class="click" data-p="${p.id}"><td>${p.number ?? '-'}</td><td>${p.name}</td><td>${p.position}</td><td>${p.age}</td><td>${p.nationality}</td><td>${starsHtml(overall(p.attrs, p.position))}</td><td>${starsHtml(p.potential)}</td></tr>`)
            .join('')}</tbody>
        </table>
        <p class="muted small">Clica num jogador para ver os atributos.</p>`;
    } else {
      content.innerHTML = `<h2>${sec.label}</h2><div class="empty">Disponível na ${sec.stage}.</div>`;
    }
  }

  nav.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    if (b.dataset.s) {
      section = b.dataset.s;
      playerId = null;
      renderNav();
      renderContent();
    } else if (b.dataset.a === 'save') {
      const slot = prompt(`Gravar em que espaço? (${SLOTS.join(', ')})`, '1');
      const n = Number(slot);
      if (SLOTS.includes(n)) alert(saveToSlot(n, s!) ? 'Jogo gravado.' : 'Erro ao gravar.');
    } else if (b.dataset.a === 'export') {
      exportSave(s!);
    } else if (b.dataset.a === 'menu') {
      if (confirm('Voltar ao menu? O progresso não gravado perde-se.')) go('menu');
    }
  });

  content.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const row = t.closest<HTMLElement>('[data-p]');
    if (row) {
      playerId = row.dataset.p!;
      renderContent();
    } else if (t.closest('[data-back]')) {
      playerId = null;
      renderContent();
    }
  });

  el.querySelector('#next')!.addEventListener('click', () => {
    advanceDay(s!);
    renderDate();
  });

  renderDate();
  renderNav();
  renderContent();
}
