import { seenPotential } from '../../core/staff';
// Ecrãs do Mercado e das Finanças
import { overall, starsHtml } from '../../core/attributes';
import { fmtEur, marketValue, salaryBudget, wageBill } from '../../core/contracts';
import { financeOf } from '../../core/finance';
import { FREE, setListed, tierOf, tryLoanIn, acceptOffer, askingPrice, isSenior, marketOf, rejectOffer, release, releaseCost, seniors, tryBuy, wageDemand, windowLabel, windowOpen } from '../../core/market';
import type { GameState, Player } from '../../core/types';
import { crestSvg } from '../crest';

const POS = ['GR', 'FIX', 'FIX/ALA', 'UNI', 'ALA', 'ALA/PIV', 'PIV'];
let filt = { pos: '', who: 'todos', maxAge: 40, q: '' };

export function renderMarket(content: HTMLElement, s: GameState, refresh: () => void, openPlayer: (id: string) => void) {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  const fin = financeOf(s, my.id);
  const m = marketOf(s);
  const clubName = (id: string) => (id === FREE ? 'Livre' : s.clubs.find((c) => c.id === id)?.shortName ?? id);
  const list = s.players
    .filter((p) => p.clubId !== my.id && !p.clubId.includes('@'))
    .filter((p) => (filt.who === 'livres' ? p.clubId === FREE : filt.who === 'clubes' ? p.clubId !== FREE : true))
    .filter((p) => (!filt.pos || p.position === filt.pos) && p.age <= filt.maxAge && (!filt.q || p.name.toLowerCase().includes(filt.q.toLowerCase())))
    .sort((a, b) => overall(b.attrs, b.position) - overall(a.attrs, a.position))
    .slice(0, 60);
  const valueOf = (p: Player) => marketValue(p, s.clubs.find((c) => c.id === p.clubId) ?? my);
  const mySquad = s.players.filter((p) => p.clubId === my.id);

  content.innerHTML = `
    <h2>Mercado</h2>
    <div class="cards">
      <div class="card"><div class="muted small">Janela de transferências</div><div class="big">${windowLabel(s.date)}</div><div class="small muted">1 jul–15 set e janeiro (estimativa). Livres assinam a qualquer altura.</div></div>
      <div class="card"><div class="muted small">Saldo para transferências</div><div class="big">${fmtEur(fin.balance)}</div><div class="small muted">Folha ${fmtEur(wageBill(s, my.id))}/mês de ${fmtEur(Math.round(salaryBudget(my) * 1.1 / 12))} permitidos</div></div>
      <div class="card"><div class="muted small">Inscritos (Art. 52.5)</div><div class="big">${seniors(s, my.id)}/20 seniores</div><div class="small muted">Substituições após o limite: ${m.regs[s.season.year] ?? 0}/5</div></div>
    </div>
    ${m.offers.length ? `<h3>Propostas recebidas</h3><table class="tbl"><tbody>${m.offers.map((o) => {
      const p = s.players.find((x) => x.id === o.playerId)!;
      return `<tr><td>${crestSvg(o.from, 18)} ${s.clubs.find((c) => c.id === o.from)!.name}</td><td><b>${p.name}</b></td><td>${o.kind === 'emprestimo' ? `Empréstimo ${o.years ?? 1} época(s), pagam ${Math.round((o.share ?? 0.5) * 100)}% do salário` : fmtEur(o.fee)}</td><td class="muted small">valor ${fmtEur(marketValue(p, my))}</td><td><button class="btn" data-acc="${o.id}">Aceitar</button> <button class="btn ghost" data-rej="${o.id}">Recusar</button></td></tr>`;
    }).join('')}</tbody></table>` : ''}
    <h3>Procurar jogadores</h3>
    <div class="form-row">
      <label>Quem<select id="fwho">${[['todos', 'Todos'], ['livres', 'Só livres'], ['clubes', 'Só com clube']].map(([v, l]) => `<option value="${v}" ${filt.who === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Posição<select id="fpos"><option value="">Todas</option>${POS.map((p) => `<option ${filt.pos === p ? 'selected' : ''}>${p}</option>`).join('')}</select></label>
      <label>Idade máx.<input id="fage" type="number" min="17" max="40" value="${filt.maxAge}" style="width:60px"></label>
      <label>Nome<input id="fq" value="${filt.q}" style="width:130px"></label>
    </div>
    <div id="neg"></div>
    <table class="tbl small"><thead><tr><th>Nome</th><th>Clube</th><th>Pos.</th><th>Idade</th><th>Nac.</th><th>Atual</th><th>Pot.</th><th>Valor</th><th>Salário</th><th>Contrato</th><th></th></tr></thead><tbody>
    ${list.map((p) => `<tr><td class="click" data-open="${p.id}"><b>${p.name}</b></td><td>${p.clubId === FREE ? '<span class="muted">Livre</span>' : `${crestSvg(p.clubId, 16)} ${clubName(p.clubId)}${p.loan ? ' <span class="muted small">(emp.)</span>' : ''}`}</td><td>${p.position}</td><td>${p.age}</td><td>${p.nationality}</td><td>${starsHtml(overall(p.attrs, p.position))}</td><td>${starsHtml(seenPotential(s, p, my.id))}</td><td>${fmtEur(valueOf(p))}</td><td>${p.contract ? fmtEur(p.contract.wage) : '-'}</td><td>${p.contract ? 'jun ' + p.contract.until : '-'}</td><td><button class="btn" data-neg="${p.id}">Negociar</button></td></tr>`).join('')}
    </tbody></table>
    <h3>O meu plantel</h3>
    <table class="tbl small"><tbody>${mySquad.map((p) => `<tr><td>${p.name}</td><td>${p.position}</td><td>${p.age}</td><td>${p.contract ? fmtEur(p.contract.wage) + '/mês' : ''}</td><td>${isSenior(p) ? 'Sénior' : 'Sub-19'}</td><td>${p.loan ? `<span class="muted">Emprestado pelo ${clubName(p.loan.from)} até jun ${p.loan.until}</span>` : `<span class="small muted">${tierOf(s, p)}</span> <select data-list="${p.id}">${[['', 'Não listado'], ['venda', 'Lista de transferências'], ['emprestimo', 'Lista de empréstimos']].map(([v, l]) => `<option value="${v}" ${(m.listed?.[p.id] ?? '') === v ? 'selected' : ''}>${l}</option>`).join('')}</select> <button class="btn ghost" data-rel="${p.id}">Rescindir (${fmtEur(releaseCost(s, p))})</button>`}</td></tr>`).join('')}</tbody></table>
    ${s.players.some((p) => p.loan?.from === my.id) ? `<h3>Emprestados por mim</h3><table class="tbl small"><tbody>${s.players.filter((p) => p.loan?.from === my.id).map((p) => `<tr><td>${p.name}</td><td>${crestSvg(p.clubId, 16)} ${clubName(p.clubId)}</td><td>até jun ${p.loan!.until}</td><td>pagam ${Math.round(p.loan!.share * 100)}% do salário</td></tr>`).join('')}</tbody></table>` : ''}
    <p class="muted small">Quanto os clubes pedem, os salários pedidos e a data das janelas são estimativas. A cláusula de rescisão é sempre aceite.</p>`;

  const $ = <T extends HTMLElement>(q: string) => content.querySelector<T>(q)!;
  const re = () => renderMarket(content, s, refresh, openPlayer);
  $<HTMLSelectElement>('#fwho').onchange = (e) => { filt.who = (e.target as HTMLSelectElement).value; re(); };
  $<HTMLSelectElement>('#fpos').onchange = (e) => { filt.pos = (e.target as HTMLSelectElement).value; re(); };
  $<HTMLInputElement>('#fage').onchange = (e) => { filt.maxAge = Number((e.target as HTMLInputElement).value) || 40; re(); };
  $<HTMLInputElement>('#fq').onchange = (e) => { filt.q = (e.target as HTMLInputElement).value; re(); };
  content.querySelectorAll<HTMLElement>('[data-open]').forEach((el) => (el.onclick = () => openPlayer(el.dataset.open!)));
  content.querySelectorAll<HTMLElement>('[data-acc]').forEach((el) => (el.onclick = () => { alert(acceptOffer(s, m.offers.find((o) => o.id === el.dataset.acc)!)); refresh(); }));
  content.querySelectorAll<HTMLElement>('[data-rej]').forEach((el) => (el.onclick = () => { rejectOffer(s, m.offers.find((o) => o.id === el.dataset.rej)!); re(); }));
  content.querySelectorAll<HTMLElement>('[data-rel]').forEach((el) => (el.onclick = () => {
    const p = s.players.find((x) => x.id === el.dataset.rel)!;
    if (confirm(`Rescindir com ${p.name}? Custa ${fmtEur(releaseCost(s, p))} e ele fica livre.`)) { alert(release(s, p)); refresh(); }
  }));
  content.querySelectorAll<HTMLSelectElement>('[data-list]').forEach((el) => (el.onchange = () => {
    setListed(s, s.players.find((x) => x.id === el.dataset.list)!, (el.value || null) as 'venda' | 'emprestimo' | null);
  }));
  content.querySelectorAll<HTMLElement>('[data-neg]').forEach((el) => (el.onclick = () => {
    const p = s.players.find((x) => x.id === el.dataset.neg)!;
    const free = p.clubId === FREE;
    const ask = free ? 0 : askingPrice(s, p, my.id);
    const want = wageDemand(s, p, my);
    $('#neg').innerHTML = `<div class="card" style="margin:8px 0;padding:10px 12px"><b>Negociar: ${p.name}</b> (${free ? 'livre' : clubName(p.clubId)})
      <div class="row" style="justify-content:flex-start;gap:8px;margin-top:6px;flex-wrap:wrap">
        ${free ? '' : `<label class="small">Valor da transferência (€) <input id="nfee" type="number" step="1000" value="${Math.round(ask * 0.8 / 1000) * 1000}" style="width:110px"></label>`}
        <label class="small">Salário/mês (€) <input id="nwage" type="number" step="50" value="${want}" style="width:90px"></label>
        <label class="small">Anos <select id="nyears">${[1, 2, 3, 4].map((y) => `<option ${y === 2 ? 'selected' : ''}>${y}</option>`).join('')}</select></label>
        <button class="btn primary" id="ngo">Enviar proposta</button>
        ${free || p.loan ? '' : `<label class="small">ou empréstimo: pago <select id="lshare">${[0.5, 0.75, 1].map((x) => `<option value="${x}">${x * 100}%</option>`).join('')}</select> do salário durante <select id="lyears"><option>1</option><option>2</option><option>3</option></select> época(s)</label><button class="btn" id="lgo">Pedir emprestado</button>`}
      </div>
      <div class="small muted" id="nmsg">${free ? '' : `${p.name} é ${tierOf(s, p)} no clube (minutos e estatísticas). O clube deve pedir cerca de ${fmtEur(ask)} · cláusula ${fmtEur(p.contract?.clause ?? 0)}. `}O jogador deve pedir ~${fmtEur(want)}/mês.${!free && !windowOpen(s.date) ? ' Janela fechada: só depois de abrir.' : ''}</div></div>`;
    content.querySelector<HTMLElement>('#lgo')?.addEventListener('click', () => {
      const res = tryLoanIn(s, p, Number($<HTMLSelectElement>('#lshare').value), Number($<HTMLSelectElement>('#lyears').value));
      if (res.ok) { alert(res.msg); refresh(); return; }
      $('#nmsg').textContent = res.msg;
    });
    $('#ngo').onclick = () => {
      const fee = free ? 0 : Number($<HTMLInputElement>('#nfee').value);
      const res = tryBuy(s, p, { fee, wage: Number($<HTMLInputElement>('#nwage').value), years: Number($<HTMLSelectElement>('#nyears').value) });
      if (res.ok) { alert(res.msg); refresh(); return; }
      $('#nmsg').textContent = res.msg;
      if (res.counter && !free && /recusa/.test(res.msg)) $<HTMLInputElement>('#nfee').value = String(res.counter);
      else if (res.counter) $<HTMLInputElement>('#nwage').value = String(res.counter);
    };
    $('#neg').scrollIntoView({ block: 'nearest' });
  }));
}

export function renderFinance(content: HTMLElement, s: GameState) {
  const my = s.clubs.find((c) => c.id === s.clubId)!;
  const fin = financeOf(s, my.id);
  const bill = wageBill(s, my.id);
  const sum = (re: RegExp) => fin.ledger.filter((l) => re.test(l.text)).reduce((a, l) => a + l.amount, 0);
  content.innerHTML = `
    <h2>Finanças do futsal</h2>
    <div class="cards">
      <div class="card"><div class="muted small">Saldo</div><div class="big">${fmtEur(fin.balance)}</div><div class="small muted">Disponível para transferências e rescisões</div></div>
      <div class="card"><div class="muted small">Orçamento anual (salários)</div><div class="big">${fmtEur(salaryBudget(my))}</div><div class="small muted">Folha atual ${fmtEur(bill)}/mês = ${fmtEur(bill * 12)}/ano</div></div>
      <div class="card"><div class="muted small">Recentes</div><div class="small">Bilheteira ${fmtEur(sum(/Bilheteira/))} · Prémios ${fmtEur(sum(/Prémio/))} · Transferências ${fmtEur(sum(/Venda|Contratação/))}</div></div>
    </div>
    <table class="tbl small" style="margin-top:12px"><thead><tr><th>Data</th><th>Movimento</th><th style="text-align:right">Valor</th></tr></thead><tbody>
    ${fin.ledger.map((l) => `<tr><td>${l.date.split('-').reverse().join('/')}</td><td>${l.text}</td><td style="text-align:right;color:${l.amount >= 0 ? '#2e9e5b' : '#c0392b'}">${l.amount >= 0 ? '+' : ''}${fmtEur(Math.abs(l.amount)).replace(/^/, l.amount < 0 ? '−' : '')}</td></tr>`).join('') || '<tr><td colspan="3" class="muted">Ainda sem movimentos.</td></tr>'}
    </tbody></table>
    <p class="muted small">O futsal vive da verba do clube: paga os salários até ao orçamento (Benfica 2,7 M€, Sporting 2 M€, Fundão 150 mil €: reais; restantes estimados) e dá 2% do orçamento por mês para reforços (estimativa). Bilheteira: preço médio efetivo 2–4 € (muitos sócios entram com lugar anual; estimativa). Prémios: estimativa (a FPF não publica).</p>`;
}
