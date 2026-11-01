import { portraitSvg } from '../portrait';
import { lookOf } from '../../core/appearance';
import { crestSvg } from '../crest';
import { fmtEur, marketValue, offerRenewal, renewalDemand, wageBill } from '../../core/contracts';
import { FOCUS_LABEL, INT_LABEL, planOf, type Focus, type Intensity } from '../../core/training';
import { moraleHtml, moraleOf } from '../../core/morale';
import { injuryInfo, injuryOf } from '../../core/injuries';
import { totalBan } from '../../core/discipline';
import { go, h } from '../router';
import { getState, myClub } from '../../core/state';
import { advance } from '../../core/game';
import type { Fixture } from '../../core/season/types';
import { renderCalendar, renderCompetitions, renderDashboard, renderMatchDay } from './season';
import { exportSave, saveToSlot, SLOTS } from '../../core/save';
import { ATTR_GROUPS, overall, starsHtml } from '../../core/attributes';
import type { Club, Player } from '../../core/types';
import { renderFriendly } from './friendly';
import { renderTactics } from './tactics';
import { renderSettings } from './settings';
import porHistory from '../../data/por/history.json';

const HIST = porHistory.players as Record<string, { s: string; team: string; games: number; goals: number }[]>;

const POS_NAME: Record<string, string> = {
  GR: 'Guarda-redes', FIX: 'Fixo', 'FIX/ALA': 'Fixo / Ala', UNI: 'Universal', ALA: 'Ala', 'ALA/PIV': 'Ala / Pivô', PIV: 'Pivô',
};

function attrClass(v: number) {
  return v >= 16 ? 'a4' : v >= 13 ? 'a3' : v >= 10 ? 'a2' : 'a1';
}

function playerProfile(p: Player, mine = false, status = '', club?: Club, renew = '') {
  const groups = Object.entries(ATTR_GROUPS).filter(([g]) => (p.position === 'GR' ? true : g !== 'guardaRedes'));
  return `
    <button class="btn ghost" data-back>◂ Plantel</button>
    <div class="row" style="justify-content:flex-start;gap:16px;align-items:flex-start;margin-top:12px">
      <div class="portrait-box">${portraitSvg(lookOf(p), club ? [club.colors[0], club.colors[1]] : ['#2a6', '#fff'], 130, p.number)}</div>
      <div><h2 style="margin:0">${p.number ?? '-'} · ${p.name}</h2>${status}</div>
    </div>
    ${mine ? `<div class="row" style="justify-content:flex-start;gap:8px;margin-bottom:12px"><label class="small">Número da camisola <input id="pnum" type="number" min="1" max="99" value="${p.number ?? ''}" style="width:64px"></label><span class="muted small" id="pnummsg">Se o número já estiver ocupado, os dois jogadores trocam.</span></div>` : ''}
    ${renew}
    <table class="tbl" style="margin-bottom:16px">
      <tr><th>Posição</th><td>${POS_NAME[p.position]}</td><th>Idade</th><td>${p.age}</td></tr>
      <tr><th>Nacionalidade</th><td>${p.nationality}</td><th>Valor atual</th><td>${starsHtml(overall(p.attrs, p.position))}</td></tr>
      <tr><th></th><td></td><th>Potencial</th><td>${starsHtml(p.potential)}</td></tr>
      ${p.contract ? `<tr><th>Salário</th><td>${fmtEur(p.contract.wage)}/mês</td><th>Contrato até</th><td>30/06/${p.contract.until}</td></tr>
      <tr><th>Cláusula</th><td>${fmtEur(p.contract.clause)}</td><th>Valor de mercado</th><td>${fmtEur(marketValue(p, club ?? ({ reputation: 60 } as Club)))}</td></tr>` : ''}
    </table>
    ${(HIST[p.id] ?? []).length ? `<h3>Historial (zerozero)</h3>
    <table class="tbl small" style="max-width:520px;margin-bottom:16px">
      <thead><tr><th>Época</th><th>Equipa</th><th>Jogos</th><th>Golos</th></tr></thead>
      <tbody>${HIST[p.id].map((r) => `<tr><td>20${r.s}/${Number(r.s) + 1}</td><td>${r.team}</td><td>${r.games}</td><td>${r.goals}</td></tr>`).join('')}</tbody>
    </table>` : ''}
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

function statCells(st?: { games: number; goals: number; assists: number; ratingSum: number }) {
  if (!st || !st.games) return '<td>-</td><td>-</td><td>-</td><td>-</td>';
  return `<td>${st.games}</td><td>${st.goals}</td><td>${st.assists}</td><td>${(st.ratingSum / st.games).toFixed(1).replace('.', ',')}</td>`;
}

// Secções do jogo. As que ainda não existem mostram a etapa em que entram.
const SECTIONS: { id: string; label: string; stage: string }[] = [
  { id: 'inicio', label: 'Início', stage: '' },
  { id: 'plantel', label: 'Plantel', stage: '' },
  { id: 'amigavel', label: 'Jogo amigável', stage: '' },
  { id: 'taticas', label: 'Táticas', stage: '' },
  { id: 'calendario', label: 'Calendário', stage: '' },
  { id: 'competicoes', label: 'Competições', stage: '' },
  { id: 'treino', label: 'Treino', stage: '' },
  { id: 'mercado', label: 'Mercado', stage: 'Etapa 10' },
  { id: 'financas', label: 'Finanças', stage: 'Etapa 10' },
  { id: 'staff', label: 'Staff', stage: 'Etapa 11' },
  { id: 'formacao', label: 'Formação', stage: 'Etapa 11' },
  { id: 'definicoes', label: 'Definições', stage: '' },
];

export function homeScreen(root: HTMLElement) {
  const s = getState();
  if (!s) return go('menu');
  const club = myClub(s);
  let section = 'inicio';
  let playerId: string | null = null;
  let pending: Fixture | null = null; // jogo do teu clube por jogar

  const el = h(`
    <div class="layout">
      <header class="top" style="--c1:${club.colors[0]};--c2:${club.colors[1]}">
        <div class="crest-wrap">${crestSvg(club.id, 44, { c1: club.colors[0], c2: club.colors[1] })}</div>
        <div><strong>${club.name}</strong><div class="muted small">${s.manager.name} · ${s.season.label}</div></div>
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
    if (pending) {
      renderMatchDay(
        content, s!, pending,
        () => { pending = null; section = 'inicio'; renderNav(); renderContent(); },
        () => { section = 'taticas'; renderNav(); renderContent(); }
      );
      return;
    }
    if (section === 'inicio') {
      renderDashboard(content, s!);
    } else if (section === 'definicoes') {
      renderSettings(content, s!);
    } else if (section === 'calendario') {
      renderCalendar(content, s!);
    } else if (section === 'competicoes') {
      renderCompetitions(content, s!);
    } else if (section === 'taticas') {
      renderTactics(content, s!, club.id);
    } else if (section === 'amigavel') {
      renderFriendly(content, s!, club.id);
    } else if (section === 'plantel' && playerId) {
      const pl = s!.players.find((p) => p.id === playerId)!;
      const inj = injuryOf(s!, pl.id);
      const bans = s!.discipline?.bans[pl.id] ?? [];
      const status = (inj ? `<div class="card" style="margin:8px 0;padding:8px 12px">🩹 <b>${inj.type}</b> · ${inj.days} dias de paragem · volta a ${inj.until.split('-').reverse().join('/')}<br><span class="small muted">${injuryInfo(inj.type)}</span></div>` : '')
        + bans.map((b) => `<div class="card" style="margin:8px 0;padding:8px 12px">🟥 Castigado: ${b.games} jogo(s) (${b.reason})</div>`).join('');
      const pclub = s!.clubs.find((c) => c.id === pl.clubId)!;
      const dem = renewalDemand(s!, pl);
      const renew = pl.clubId === club.id ? `<div class="card" style="margin:8px 0 12px;padding:8px 12px"><b>Renovar contrato</b>
        <div class="row" style="justify-content:flex-start;gap:8px;margin-top:6px;flex-wrap:wrap">
          <label class="small">Salário/mês (€) <input id="rwage" type="number" step="50" min="0" value="${dem.wage}" style="width:90px"></label>
          <label class="small">Anos <select id="ryears">${[1, 2, 3, 4].map((y) => `<option ${y === Math.min(2, dem.maxYears) ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
          <button class="btn" id="rgo">Propor</button><span class="small muted" id="rmsg">Pede cerca de ${fmtEur(dem.wage)}/mês, até ${dem.maxYears} ano(s).</span>
        </div></div>` : '';
      content.innerHTML = playerProfile(pl, pl.clubId === club.id, `<p>Moral: ${moraleHtml(moraleOf(s!, pl.id))}</p>` + status, pclub, renew);
      content.querySelector('#rgo')?.addEventListener('click', () => {
        const w = Number(content.querySelector<HTMLInputElement>('#rwage')!.value), y = Number(content.querySelector<HTMLSelectElement>('#ryears')!.value);
        const res = offerRenewal(s!, pl, w, y);
        if (res.ok) { renderContent(); }
        const m = content.querySelector('#rmsg'); if (m) m.textContent = res.msg;
      });
      content.querySelector<HTMLInputElement>('#pnum')?.addEventListener('change', (e) => {
        const v = Math.round(Number((e.target as HTMLInputElement).value));
        if (!(v >= 1 && v <= 99)) { content.querySelector('#pnummsg')!.textContent = 'Escolhe um número de 1 a 99.'; return; }
        // número já usado no plantel: troca com esse jogador
        const other = s!.players.find((p) => p.clubId === club.id && p.number === v && p !== pl);
        if (other) other.number = pl.number;
        pl.number = v;
        renderContent();
        content.querySelector('#pnummsg')!.textContent = other ? `Número alterado (troca com ${other.name}, que fica com o ${other.number ?? '-'}).` : 'Número alterado.';
      });
    } else if (section === 'plantel') {
      const order = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];
      const squad = s!.players
        .filter((p) => p.clubId === club.id)
        .sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position) || (a.number ?? 99) - (b.number ?? 99));
      content.innerHTML = `
        <h2>Plantel <span class="muted small">${squad.length} jogadores · folha salarial ${fmtEur(wageBill(s!, club.id))}/mês (estimativa)</span></h2>
        <table class="tbl">
          <thead><tr><th>Nº</th><th>Nome</th><th>Posição</th><th>Idade</th><th>Nacionalidade</th><th>Atual</th><th>Potencial</th><th>Moral</th><th>Salário/mês</th><th>Contrato</th><th>J</th><th>G</th><th>A</th><th>Nota</th></tr></thead>
          <tbody>${squad
            .map((p) => `<tr class="click" data-p="${p.id}"><td>${p.number ?? '-'}</td><td>${p.name}${injuryOf(s!, p.id) ? ` <span title="${injuryOf(s!, p.id)!.type} (até ${injuryOf(s!, p.id)!.until})">🩹</span>` : ''}${totalBan(s!, p.id) ? ` <span title="Castigado: ${totalBan(s!, p.id)} jogo(s)">🟥${totalBan(s!, p.id)}</span>` : ''}${(s!.discipline?.yellows[p.id] ?? 0) ? ` <span class="muted small" title="Amarelos na Liga">🟨${s!.discipline!.yellows[p.id]}</span>` : ''}</td><td>${p.position}</td><td>${p.age}</td><td>${p.nationality}</td><td>${starsHtml(overall(p.attrs, p.position))}</td><td>${starsHtml(p.potential)}</td><td>${moraleHtml(moraleOf(s!, p.id))}</td><td>${p.contract ? fmtEur(p.contract.wage) : '-'}</td><td${p.contract && p.contract.until <= s!.season.year + 1 ? ' style="color:#d9822b;font-weight:600"' : ''}>${p.contract ? 'jun ' + p.contract.until : '-'}</td>${statCells(s!.pstats[p.id])}</tr>`)
            .join('')}</tbody>
        </table>
        <p class="muted small">Clica num jogador para ver os atributos.</p>`;
    } else if (section === 'treino') {
      const plan = planOf(s!, club.id);
      const order = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];
      const squad = s!.players.filter((p) => p.clubId === club.id).sort((a, b) => order.indexOf(a.position) - order.indexOf(b.position));
      const opts = (cur: string, list: Record<string, string>, extra = '') => extra + Object.entries(list).map(([v, l]) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`).join('');
      content.innerHTML = `
        <h2>Treino</h2>
        <div class="form-row">
          <label>Foco da equipa<select id="tfocus">${opts(plan.focus, FOCUS_LABEL)}</select></label>
          <label>Intensidade<select id="tint">${opts(plan.intensity, INT_LABEL)}</select></label>
        </div>
        <table class="tbl small" style="margin:10px 0 16px"><tbody>
          <tr><td>Foco</td><td>Esses atributos evoluem mais no fim da época (até ~+0,5 por atributo com foco total); os outros um pouco menos</td></tr>
          <tr><td>Intensidade alta</td><td>+25% de evolução, +40% de lesões no treino</td></tr>
          <tr><td>Intensidade baixa</td><td>-25% de evolução, -30% de lesões no treino</td></tr>
          <tr><td>Recuperação</td><td>Quase não evolui, metade das lesões no treino</td></tr>
          <tr><td>Guarda-redes</td><td>Fazem sempre metade do treino específico de GR</td></tr>
        </tbody></table>
        <p class="muted small">Valores estimados (não há estudos públicos com números do efeito do treino no futsal). Os mais novos evoluem mais; o treino junta-se aos minutos jogados.</p>
        <h3>Treino individual</h3>
        <table class="tbl"><thead><tr><th>Nº</th><th>Nome</th><th>Posição</th><th>Idade</th><th>Foco individual</th></tr></thead><tbody>
        ${squad.map((p) => `<tr><td>${p.number ?? '-'}</td><td>${p.name}${injuryOf(s!, p.id) ? ' 🩹' : ''}</td><td>${p.position}</td><td>${p.age}</td><td><select data-ind="${p.id}">${opts(plan.individual[p.id] ?? '', FOCUS_LABEL, '<option value="">Como a equipa</option>')}</select></td></tr>`).join('')}
        </tbody></table>`;
      content.querySelector<HTMLSelectElement>('#tfocus')!.onchange = (e) => (plan.focus = (e.target as HTMLSelectElement).value as Focus);
      content.querySelector<HTMLSelectElement>('#tint')!.onchange = (e) => (plan.intensity = (e.target as HTMLSelectElement).value as Intensity);
      content.querySelectorAll<HTMLSelectElement>('[data-ind]').forEach((sel) => (sel.onchange = () => {
        if (sel.value) plan.individual[sel.dataset.ind!] = sel.value as Focus; else delete plan.individual[sel.dataset.ind!];
      }));
    } else {
      content.innerHTML = `<h2>${sec.label}</h2><div class="empty">Disponível na ${sec.stage}.</div>`;
    }
  }

  nav.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    if (b.dataset.s) {
      if (pending && b.dataset.s !== 'taticas' && b.dataset.s !== 'plantel') return;
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
    if (pending) {
      section = 'inicio';
      renderContent();
      return; // tens de jogar o jogo primeiro
    }
    const res = advance(s!);
    renderDate();
    if (res.kind === 'match') {
      pending = res.fixture;
      renderContent();
    } else if (res.kind === 'seasonEnd') {
      go('home'); // nova época: refaz o ecrã
    } else {
      renderContent();
    }
  });

  renderDate();
  renderNav();
  renderContent();
}
