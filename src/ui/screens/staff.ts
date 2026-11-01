import { negotiateStaff, poachFee, poachStaff, staffDemand } from '../../core/career';
// Ecrãs do Staff e da Formação
import { overall, starsHtml } from '../../core/attributes';
import { fmtEur } from '../../core/contracts';
import { EXTRA_ROLES, realCoachOf, staffBill, staffBudget, staffWage, ROLES, ROLE_NAME, type StaffSeason, abilityOf, academyLevel, fireCost, hireStaff, juniorsOf, promote, scoutedPotential, staffOf, type Role } from '../../core/staff';
import { seniors } from '../../core/market';
import type { GameState } from '../../core/types';

const EFFECT: Record<Role, (a: number) => string> = {
  adjunto: (a) => `Evolução no treino ×${(0.85 + a * 0.015).toFixed(2)}`,
  fisico: (a) => `Lesões no treino ×${(1.3 - a * 0.03).toFixed(2)}`,
  gr: (a) => `Evolução dos GR ×${(0.75 + a * 0.025).toFixed(2)}`,
  fisio: (a) => `Tempo de recuperação ×${(1.25 - a * 0.025).toFixed(2)}`,
  formacao: (a) => `Juniores melhores; avalia o potencial com erro ±${((20 - a) / 20 * 2.5).toFixed(1)}`,
  analista: (a) => `Conhecimento tático no jogo +${(a * 0.075).toFixed(1)}`,
  scout: (a) => `Potencial de outros clubes com erro ±${(2.5 - a * 0.1).toFixed(1)}`,
  psicologo: (a) => `Quedas de moral ×${(1 - a * 0.015).toFixed(2)}`,
  nutricionista: (a) => `Lesões ×${(1 - a * 0.005).toFixed(2)}`,
  coordenador: () => 'Organização (sem efeito no jogo)',
  outro: () => 'Apoio (sem efeito no jogo)',
};
const bar = (a: number) => `<span style="display:inline-block;width:80px;height:8px;border-radius:4px;background:#333;vertical-align:middle"><span style="display:block;height:8px;border-radius:4px;width:${a * 5}%;background:${a >= 15 ? '#2e9e5b' : a >= 10 ? '#c9a227' : '#c0392b'}"></span></span> ${a}`;

/** Historial (zerozero) de um técnico, em tabela. */
export function historyHtml(h?: StaffSeason[]) {
  if (!h?.length) return '<p class="muted small">Sem historial (técnico fictício).</p>';
  const n = (x: string) => (x === '?' ? '' : x);
  return `<table class="tbl small" style="margin:6px 0 10px"><thead><tr><th>Época</th><th>Clube</th><th>Função</th><th>J</th><th>V</th><th>E</th><th>D</th><th>Títulos</th></tr></thead><tbody>${h.map((x) => `<tr><td>${x.ep}</td><td>${x.club}</td><td>${x.func}</td><td>${n(x.g)}</td><td>${n(x.w)}</td><td>${n(x.d)}</td><td>${n(x.l)}</td><td>${x.titles === '-' ? '' : x.titles}</td></tr>`).join('')}</tbody></table>`;
}

export function renderStaff(content: HTMLElement, s: GameState, refresh: () => void) {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  let role: Role | null = null;
  let open: string | null = null;
  let nego: string | null = null;
  const draw = () => {
    const free = (s.staff ?? []).filter((x) => x.clubId === null && (!role || x.role === role)).sort((a, b) => b.ability - a.ability);
    const mine = (s.staff ?? []).filter((x) => x.clubId === my.id).sort((a, b) => [...ROLES, ...EXTRA_ROLES].indexOf(a.role) - [...ROLES, ...EXTRA_ROLES].indexOf(b.role) || b.ability - a.ability);
    const vagos = ROLES.filter((r) => !mine.some((x) => x.role === r));
    const coaches = s.coaches.filter((c) => c.clubId).map((c) => ({ c, real: realCoachOf(c.clubId!) }));
    content.innerHTML = `
      <h2>Staff técnico <span class="muted small">${fmtEur(staffBill(s, my.id))}/mês de ${fmtEur(staffBudget(my))} (orçamento)</span></h2>
      <table class="tbl"><thead><tr><th>Função</th><th>Nome</th><th>Capacidade</th><th>Efeito</th><th>Idade</th><th>Salário</th><th></th></tr></thead><tbody>
      ${mine.map((st) => `<tr><td>${st.func ?? ROLE_NAME[st.role]}</td><td class="click" data-open="${st.id}"><b>${st.name}</b>${st.real ? '' : ' <span class="muted small">(fictício)</span>'}</td><td>${bar(st.ability)}</td><td class="small">${EFFECT[st.role](st.ability)}</td><td>${st.age}</td><td>${fmtEur(st.wage)}<br><span class="small ${st.until <= s.season.year + 1 ? '' : 'muted'}" style="${st.until <= s.season.year + 1 ? 'color:#d9822b' : ''}">até jun ${st.until}</span></td><td><button class="btn${st.until <= s.season.year + 1 ? '' : ' ghost'}" data-renew="${st.id}">${st.until <= s.season.year + 1 ? 'Renovar' : 'Contrato'}</button> <button class="btn ghost" data-find="${st.role}">Substituir</button></td></tr>${open === st.id ? `<tr><td colspan="7">${historyHtml(st.history)}</td></tr>` : ''}${nego === st.id ? `<tr><td colspan="7"><div class="card" style="padding:8px 12px"><b>Contrato de ${st.name}</b> · atual ${fmtEur(st.wage)}/mês até jun ${st.until}
        <div class="row" style="justify-content:flex-start;gap:8px;margin-top:6px;flex-wrap:wrap"><label class="small">Salário/mês (€) <input id="nw" type="number" step="50" value="${staffDemand(s, st).wage}" style="width:90px"></label>
        <label class="small">Anos <select id="ny">${[1, 2, 3].map((y) => `<option ${y === 2 ? 'selected' : ''}>${y}</option>`).join('')}</select></label><button class="btn primary" id="ngo">Propor</button>
        <span class="small muted" id="nmsg">Pede cerca de ${fmtEur(staffDemand(s, st).wage)}/mês (máx. ${staffDemand(s, st).maxYears} anos). Aceita um pouco menos em troca de mais anos de contrato.</span></div></div></td></tr>` : ''}`).join('')}
      ${vagos.map((r) => `<tr><td>${ROLE_NAME[r]}</td><td class="muted">vago</td><td>${bar(5)}</td><td class="small">${EFFECT[r](5)}</td><td></td><td></td><td><button class="btn ghost" data-find="${r}">Procurar</button></td></tr>`).join('')}
      </tbody></table>
      <p class="muted small">Clica no nome para ver o historial. Equipas técnicas reais dos 12 clubes (futsalportugal.com e zerozero); as funções em falta num clube têm técnicos fictícios. Capacidade calculada do historial (estimativa).</p>
      <h3>Técnicos de outros clubes ${role ? `· ${ROLE_NAME[role]}` : ''}</h3>
      <table class="tbl small"><tbody>${(s.staff ?? []).filter((x) => x.clubId && x.clubId !== my.id && !x.clubId.includes('@') && (!role || x.role === role)).sort((a, b) => b.ability - a.ability).slice(0, 12).map((x) => `<tr><td>${x.func ?? ROLE_NAME[x.role]}</td><td>${x.name}</td><td>${s.clubs.find((c) => c.id === x.clubId)?.shortName ?? ''}</td><td>${bar(x.ability)}</td><td>ganha ${fmtEur(x.wage)}</td><td>indemn. ${fmtEur(poachFee(s, x))}</td><td><input type="number" step="50" value="${Math.round(x.wage * 1.3 / 50) * 50}" data-pw="${x.id}" style="width:80px"> <button class="btn" data-poach="${x.id}">Propor</button></td></tr>`).join('')}</tbody></table>
      <h3>Técnicos sem clube ${role ? `· ${ROLE_NAME[role]}` : ''} <select id="frole"><option value="">Todas as funções</option>${[...ROLES, ...EXTRA_ROLES].map((r) => `<option value="${r}" ${role === r ? 'selected' : ''}>${ROLE_NAME[r]}</option>`).join('')}</select></h3>
      <table class="tbl small"><tbody>${free.slice(0, 15).map((x) => `<tr><td>${ROLE_NAME[x.role]}</td><td>${x.name}</td><td>${bar(x.ability)}</td><td>${x.age} anos</td><td>pede ${fmtEur(staffWage(x.ability, my))}</td><td><button class="btn" data-hire="${x.id}">Contratar</button></td></tr>`).join('') || '<tr><td class="muted">Ninguém disponível.</td></tr>'}</tbody></table>
      <h3>Treinadores principais da Liga</h3>
      <table class="tbl small"><thead><tr><th>Clube</th><th>Treinador</th><th>Tático</th><th>Motivação</th><th>Jogos</th><th>Vitórias</th><th></th></tr></thead><tbody>
      ${coaches.map(({ c, real }) => `<tr><td>${s.clubs.find((k) => k.id === c.clubId)!.name}</td><td class="click" data-coach="${c.id}"><b>${c.name}</b></td><td>${bar(c.tactical)}</td><td>${bar(c.motivation)}</td><td>${real?.fp?.games ?? ''}</td><td>${real?.fp ? `${real.fp.wins} (${Math.round(real.fp.wins / Math.max(1, real.fp.games) * 100)}%)` : ''}</td><td class="muted small">${real ? 'dados reais' : 'estimativa'}</td></tr>${open === c.id ? `<tr><td colspan="7">${real?.fp?.titles.length ? `<p class="small">Títulos como treinador: ${real.fp.titles.join(' · ')}</p>` : ''}${historyHtml(real?.history)}</td></tr>` : ''}`).join('')}
      </tbody></table>
      <p class="muted small">Os salários do staff são pagos pela verba do clube; trocar alguém custa metade do que faltava receber (estimativa). Efeitos estimados; 10 = média.</p>`;
    content.querySelectorAll<HTMLElement>('[data-open]').forEach((b) => (b.onclick = () => { open = open === b.dataset.open ? null : b.dataset.open!; draw(); }));
    content.querySelectorAll<HTMLElement>('[data-coach]').forEach((b) => (b.onclick = () => { open = open === b.dataset.coach ? null : b.dataset.coach!; draw(); }));
    content.querySelectorAll<HTMLElement>('[data-find]').forEach((b) => (b.onclick = () => { role = b.dataset.find as Role; draw(); }));
    content.querySelector<HTMLSelectElement>('#frole')!.onchange = (e) => { role = ((e.target as HTMLSelectElement).value || null) as Role | null; draw(); };
    content.querySelectorAll<HTMLElement>('[data-renew]').forEach((b) => (b.onclick = () => { nego = nego === b.dataset.renew ? null : b.dataset.renew!; draw(); }));
    content.querySelector<HTMLElement>('#ngo')?.addEventListener('click', () => {
      const st = s.staff!.find((x) => x.id === nego)!;
      const r = negotiateStaff(s, st, Number(content.querySelector<HTMLInputElement>('#nw')!.value), Number(content.querySelector<HTMLSelectElement>('#ny')!.value));
      if (r.ok) { nego = null; draw(); alert(r.msg); return; }
      content.querySelector('#nmsg')!.textContent = r.msg;
      if (r.counter) content.querySelector<HTMLInputElement>('#nw')!.value = String(r.counter);
    });
    content.querySelectorAll<HTMLElement>('[data-poach]').forEach((b) => (b.onclick = () => {
      const st = s.staff!.find((x) => x.id === b.dataset.poach)!;
      const w = Number(content.querySelector<HTMLInputElement>(`[data-pw="${st.id}"]`)!.value);
      alert(poachStaff(s, st, w)); draw();
    }));
    content.querySelectorAll<HTMLElement>('[data-hire]').forEach((b) => (b.onclick = () => {
      const st = s.staff!.find((x) => x.id === b.dataset.hire)!;
      const cur = staffOf(s, my.id, st.role);
      if (staffBill(s, my.id) - (cur?.wage ?? 0) + staffWage(st.ability, my) > staffBudget(my)) { alert(hireStaff(s, st)); return; }
      if (cur && !confirm(`Substituir ${cur.name}? Indemnização de ${fmtEur(fireCost(s, cur))}.`)) return;
      if (cur) { const fin = s.finance?.[my.id]; if (fin) { fin.balance -= fireCost(s, cur); fin.ledger.unshift({ date: s.date, text: `Indemnização a ${cur.name}`, amount: -fireCost(s, cur) }); } }
      alert(hireStaff(s, st)); refresh();
    }));
  };
  draw();
}

export function renderAcademy(content: HTMLElement, s: GameState, refresh: () => void) {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  const jun = juniorsOf(s, my.id).sort((a, b) => scoutedPotential(s, b, my.id) - scoutedPotential(s, a, my.id));
  content.innerHTML = `
    <h2>Formação</h2>
    <div class="cards">
      <div class="card"><div class="muted small">Qualidade da formação</div><div class="big">${bar(Math.round(academyLevel(s, my)))}</div><div class="small muted">Estrutura do clube + coordenador + treinador</div></div>
      <div class="card"><div class="muted small">Coordenador</div><div class="big">${staffOf(s, my.id, 'formacao')?.name ?? 'vago'}</div><div class="small muted">Com um coordenador fraco o potencial que vês tem mais erro</div></div>
      <div class="card"><div class="muted small">Plantel principal</div><div class="big">${seniors(s, my.id)}/20 seniores</div><div class="small muted">Sub-19 não contam para o limite (Art. 52.5)</div></div>
    </div>
    <table class="tbl" style="margin-top:12px"><thead><tr><th>Nome</th><th>Pos.</th><th>Idade</th><th>Atual</th><th>Potencial (avaliado)</th><th></th></tr></thead><tbody>
    ${jun.map((p) => `<tr><td>${p.name}</td><td>${p.position}</td><td>${p.age}</td><td>${starsHtml(overall(p.attrs, p.position))}</td><td>${starsHtml(scoutedPotential(s, p, my.id))}</td><td><button class="btn" data-up="${p.id}">Subir ao plantel</button> <button class="btn ghost" data-out="${p.id}">Dispensar</button></td></tr>`).join('') || '<tr><td colspan="6" class="muted">Sem juniores.</td></tr>'}
    </tbody></table>
    <p class="muted small">Todos os verões chegam 2 a 5 juniores (16-17 anos), mais e melhores com melhor formação. Evoluem a jogar nos campeonatos de formação. Aos 19 anos acabam a formação: sobe-os antes ou saem do clube. Valores estimados.</p>`;
  content.querySelectorAll<HTMLElement>('[data-up]').forEach((b) => (b.onclick = () => { const p = s.players.find((x) => x.id === b.dataset.up)!; promote(s, p, my.id, s.season.year); alert(`${p.name} sobe ao plantel principal (contrato de formação até ${p.contract!.until}).`); refresh(); }));
  content.querySelectorAll<HTMLElement>('[data-out]').forEach((b) => (b.onclick = () => { const p = s.players.find((x) => x.id === b.dataset.out)!; if (confirm(`Dispensar ${p.name}?`)) { p.clubId = ''; refresh(); } }));
}
