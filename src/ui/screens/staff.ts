// Ecrãs do Staff e da Formação
import { overall, starsHtml } from '../../core/attributes';
import { fmtEur } from '../../core/contracts';
import { staffBill, staffBudget, staffWage, ROLES, ROLE_NAME, abilityOf, academyLevel, fireCost, hireStaff, juniorsOf, promote, scoutedPotential, staffOf, type Role } from '../../core/staff';
import { seniors } from '../../core/market';
import type { GameState } from '../../core/types';

const EFFECT: Record<Role, (a: number) => string> = {
  adjunto: (a) => `Evolução no treino ×${(0.85 + a * 0.015).toFixed(2)}`,
  fisico: (a) => `Lesões no treino ×${(1.3 - a * 0.03).toFixed(2)}`,
  gr: (a) => `Evolução dos GR ×${(0.75 + a * 0.025).toFixed(2)}`,
  fisio: (a) => `Tempo de recuperação ×${(1.25 - a * 0.025).toFixed(2)}`,
  formacao: (a) => `Juniores melhores; avalia o potencial com erro ±${((20 - a) / 20 * 2.5).toFixed(1)}`,
};
const bar = (a: number) => `<span style="display:inline-block;width:80px;height:8px;border-radius:4px;background:#333;vertical-align:middle"><span style="display:block;height:8px;border-radius:4px;width:${a * 5}%;background:${a >= 15 ? '#2e9e5b' : a >= 10 ? '#c9a227' : '#c0392b'}"></span></span> ${a}`;

export function renderStaff(content: HTMLElement, s: GameState, refresh: () => void) {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  let role: Role | null = null;
  const draw = () => {
    const free = (s.staff ?? []).filter((x) => x.clubId === null && (!role || x.role === role)).sort((a, b) => b.ability - a.ability);
    content.innerHTML = `
      <h2>Staff técnico <span class="muted small">${fmtEur(staffBill(s, my.id))}/mês de ${fmtEur(staffBudget(my))} (orçamento)</span></h2>
      <table class="tbl"><thead><tr><th>Função</th><th>Nome</th><th>Capacidade</th><th>Efeito</th><th>Idade</th><th>Salário</th><th>Contrato</th><th></th></tr></thead><tbody>
      ${ROLES.map((r) => { const st = staffOf(s, my.id, r); return `<tr><td>${ROLE_NAME[r]}</td><td>${st?.name ?? '<span class="muted">vago</span>'}</td><td>${bar(abilityOf(s, my.id, r))}</td><td class="small">${EFFECT[r](abilityOf(s, my.id, r))}</td><td>${st?.age ?? ''}</td><td>${st ? fmtEur(st.wage) : ''}</td><td>${st ? 'jun ' + st.until : ''}</td><td><button class="btn ghost" data-find="${r}">Procurar</button></td></tr>`; }).join('')}
      </tbody></table>
      <h3>Técnicos sem clube ${role ? `· ${ROLE_NAME[role]}` : ''}</h3>
      <table class="tbl small"><tbody>${free.slice(0, 15).map((x) => `<tr><td>${ROLE_NAME[x.role]}</td><td>${x.name}</td><td>${bar(x.ability)}</td><td>${x.age} anos</td><td>pede ${fmtEur(staffWage(x.ability, my))}</td><td><button class="btn" data-hire="${x.id}">Contratar</button></td></tr>`).join('') || '<tr><td class="muted">Ninguém disponível.</td></tr>'}</tbody></table>
      <p class="muted small">Os salários do staff são pagos pela verba do clube; trocar alguém custa metade do que faltava receber (${'estimativa'}). Os efeitos de cada função são estimativas. 10 = média.</p>`;
    content.querySelectorAll<HTMLElement>('[data-find]').forEach((b) => (b.onclick = () => { role = b.dataset.find as Role; draw(); }));
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
