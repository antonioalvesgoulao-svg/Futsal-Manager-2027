import { go, h } from '../router';
import { advanceDay, getState, myClub } from '../../core/state';
import { exportSave, saveToSlot, SLOTS } from '../../core/save';

// Secções do jogo. As que ainda não existem mostram a etapa em que entram.
const SECTIONS: { id: string; label: string; stage: string }[] = [
  { id: 'inicio', label: 'Início', stage: '' },
  { id: 'plantel', label: 'Plantel', stage: 'Etapa 3' },
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
          <tr><th>Pavilhão</th><td>${club.arena}</td></tr>
          <tr><th>Treinador</th><td>${s!.manager.name} (${s!.manager.nationality})</td></tr>
          <tr><th>Época</th><td>${s!.season}</td></tr>
        </table>
        <p class="muted">Usa "Continuar" para avançar no calendário.</p>`;
    } else {
      content.innerHTML = `<h2>${sec.label}</h2><div class="empty">Disponível na ${sec.stage}.</div>`;
    }
  }

  nav.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    if (b.dataset.s) {
      section = b.dataset.s;
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

  el.querySelector('#next')!.addEventListener('click', () => {
    advanceDay(s!);
    renderDate();
  });

  renderDate();
  renderNav();
  renderContent();
}
