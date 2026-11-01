// Ecrã da Carreira: confiança da direção, objetivo, reputação, propostas, centro de emprego (todos os clubes) e entrevista
import { INTERVIEW, boardOf, canApply, careerOf, expectedPos, interview, objectiveOf, securityOf, takeJob } from '../../core/career';
import { advance } from '../../core/game';
import { leagueTable } from '../../core/season/season';
import { saveToSlot } from '../../core/save';
import { suggestTactics } from '../../core/tactics';
import type { GameState } from '../../core/types';
import { crestSvg } from '../crest';
import { h } from '../router';

const meter = (v: number) => `<span style="display:inline-block;width:120px;height:10px;border-radius:5px;background:#333;vertical-align:middle"><span style="display:block;height:10px;border-radius:5px;width:${v}%;background:${v >= 55 ? '#2e9e5b' : v >= 40 ? '#c9a227' : '#c0392b'}"></span></span> ${Math.round(v)}`;
const fmtD = (d: string) => d.split('-').reverse().join('/');

export function renderCareer(content: HTMLElement, s: GameState, onJob: () => void) {
  const c = careerOf(s);
  const club = s.clubs.find((x) => x.id === s.clubId);
  const t = leagueTable(s.season, s.leagues[0].clubIds);
  let interviewing: string | null = null;
  let result = '';
  const draw = () => {
    const b = club ? boardOf(s, club.id) : null;
    const pos = club ? t.findIndex((r) => r.club === club.id) + 1 : 0;
    content.innerHTML = `
      <h2>Carreira</h2>
      ${c.unemployed ? '<div class="card" style="border-color:#c0392b;margin-bottom:12px"><b>Estás sem clube.</b> Candidata-te a um clube sem treinador ou com o treinador em risco, ou espera por propostas. O jogo continua a avançar.</div>' : ''}
      ${club && b ? `<div class="cards">
        <div class="card"><div class="muted small">Confiança da direção</div><div class="big">${meter(b.conf)}</div><div class="small muted">${securityOf(b.conf)} · ${b.pts} pontos em ${b.games} jogos (esperados ${b.exp.toFixed(1)})</div></div>
        <div class="card"><div class="muted small">Objetivo da época</div><div class="big">${objectiveOf(s, club.id).text}</div><div class="small muted">Esperado: ${expectedPos(s, club.id)}.º · Agora: ${t[pos - 1]?.p ? pos + '.º' : 'por começar'}</div></div>
        <div class="card"><div class="muted small">A tua reputação</div><div class="big">${meter(c.reputation)}</div><div class="small muted">Sobe com vitórias e títulos</div></div>
      </div>` : `<div class="cards"><div class="card"><div class="muted small">A tua reputação</div><div class="big">${meter(c.reputation)}</div></div></div>`}
      <p class="muted small">Como a direção avalia: em cada jogo compara os pontos conseguidos com os esperados (pela diferença de nível para o adversário e por jogar em casa ou fora), com mais exigência nos clubes grandes e ricos; títulos dão confiança extra; no fim da época conta a posição face ao objetivo. Abaixo de 24, com 10 ou mais jogos, o treinador é despedido. Valores estimados.</p>
      <h3>Propostas</h3>
      ${c.offers.length ? `<table class="tbl"><tbody>${c.offers.map((o) => { const k = s.clubs.find((x) => x.id === o.clubId)!; return `<tr><td>${crestSvg(k.id, 20)} <b>${k.name}</b></td><td class="small muted">${fmtD(o.date)} · reputação ${k.reputation} · ${objectiveOf(s, k.id).text}</td><td><button class="btn primary" data-job="${k.id}">Aceitar</button> <button class="btn ghost" data-no="${k.id}">Recusar</button></td></tr>`; }).join('')}</tbody></table>` : '<p class="muted">Sem propostas.</p>'}
      <h3>Clubes e treinadores</h3>
      <table class="tbl small"><thead><tr><th>Clube</th><th>Treinador</th><th>Confiança da direção</th><th>Segurança</th><th></th></tr></thead><tbody>
      ${s.clubs.map((k) => {
        const coach = k.id === s.clubId ? `${s.manager.name} (tu)` : s.coaches.find((x) => x.clubId === k.id)?.name ?? '<span style="color:#c0392b">vago</span>';
        const bb = boardOf(s, k.id); const ap = canApply(s, k.id);
        const vac = c.vacancies?.[k.id];
        return `<tr><td>${crestSvg(k.id, 18)} ${k.name}</td><td>${coach}</td><td>${vac ? '' : meter(bb.conf)}</td><td>${vac ? `Sem treinador até ${fmtD(vac)}` : securityOf(bb.conf)}</td><td>${ap.ok ? `<button class="btn" data-apply="${k.id}">Candidatar</button>` : ''}</td></tr>${interviewing === k.id ? `<tr><td colspan="5">${interviewHtml(s, k.id)}</td></tr>` : ''}`;
      }).join('')}
      </tbody></table>
      ${result}`;
    content.querySelectorAll<HTMLElement>('[data-job]').forEach((x) => (x.onclick = () => {
      const k = s.clubs.find((y) => y.id === x.dataset.job)!;
      if (!confirm(`Aceitar o convite do ${k.name}${club ? ` e deixar o ${club.name}` : ''}?`)) return;
      alert(takeJob(s, k.id, (cid) => suggestTactics(s.players.filter((p) => p.clubId === cid))));
      onJob();
    }));
    content.querySelectorAll<HTMLElement>('[data-no]').forEach((x) => (x.onclick = () => { c.offers = c.offers.filter((o) => o.clubId !== x.dataset.no); draw(); }));
    content.querySelectorAll<HTMLElement>('[data-apply]').forEach((x) => (x.onclick = () => {
      const last = c.applied?.[x.dataset.apply!];
      if (last && (Date.parse(s.date) - Date.parse(last)) / 864e5 < 30) { result = '<p class="muted">Já te candidataste a este clube há menos de um mês.</p>'; draw(); return; }
      interviewing = x.dataset.apply!; result = ''; draw();
    }));
    content.querySelector<HTMLElement>('#ivgo')?.addEventListener('click', () => {
      const answers = INTERVIEW.map((_, i) => Number((content.querySelector<HTMLInputElement>(`input[name="q${i}"]:checked`)?.value) ?? -1));
      if (answers.some((a) => a < 0)) { alert('Responde a todas as perguntas.'); return; }
      const k = s.clubs.find((y) => y.id === interviewing)!;
      (c.applied ??= {})[k.id] = s.date;
      const r = interview(s, k.id, answers);
      interviewing = null;
      if (r.ok) {
        result = `<div class="card" style="border-color:#2e9e5b"><b>O ${k.name} aceita-te como treinador!</b> (avaliação ${r.score}/100)<br><span class="small">${r.notes.join(' · ')}</span><br><button class="btn primary" data-sign="${k.id}" style="margin-top:8px">Assinar contrato</button></div>`;
      } else result = `<div class="card" style="border-color:#c0392b"><b>O ${k.name} escolheu outro caminho.</b> (avaliação ${r.score}/100; precisava de 55)<br><span class="small">${r.notes.join(' · ')}</span></div>`;
      draw();
      content.querySelector<HTMLElement>('[data-sign]')?.addEventListener('click', () => { alert(takeJob(s, k.id, (cid) => suggestTactics(s.players.filter((p) => p.clubId === cid)))); onJob(); });
    });
  };
  draw();
}

function interviewHtml(s: GameState, clubId: string) {
  const k = s.clubs.find((x) => x.id === clubId)!;
  return `<div class="card" style="margin:6px 0"><b>Entrevista com a direção do ${k.name}</b>
    <p class="small muted">A direção quer perceber se o teu projeto encaixa nos valores do clube.</p>
    ${INTERVIEW.map((q, i) => `<div style="margin:8px 0"><div><b>${q.q}</b></div>${q.options.map((o, j) => `<label class="small" style="display:block"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}</div>`).join('')}
    <button class="btn primary" id="ivgo">Terminar entrevista</button></div>`;
}

/** Ecrã de quem está sem clube: notícias, centro de emprego e Continuar (o mundo avança sem ti). */
export function unemployedScreen(root: HTMLElement, s: GameState, onJob: () => void, toMenu: () => void) {
  const el = h(`<div class="layout">
    <header class="top"><div><strong>${s.manager.name}</strong><div class="muted small">Sem clube · ${s.season.label}</div></div><div class="spacer"></div><div class="date" id="date"></div>
      <button class="btn" id="save">Gravar</button> <button class="btn ghost" id="menu">Menu</button> <button class="btn primary" id="next">Continuar ▸</button></header>
    <main class="content" id="content" style="margin-left:0"></main></div>`);
  root.innerHTML = ''; root.append(el);
  const content = el.querySelector<HTMLElement>('#content')!;
  const draw = () => {
    el.querySelector('#date')!.textContent = fmtD(s.date);
    renderCareer(content, s, onJob);
    content.insertAdjacentHTML('beforeend', `<h3>Notícias</h3><div class="feed">${s.news.slice(0, 15).map((n) => `<div class="ev"><span class="ic small muted">${fmtD(n.date)}</span>${n.text}</div>`).join('')}</div>`);
  };
  el.querySelector('#next')!.addEventListener('click', () => { advance(s); if (!careerOf(s).unemployed) onJob(); else draw(); });
  el.querySelector('#save')!.addEventListener('click', () => { const n = Number(prompt('Gravar em que espaço? (1, 2, 3)', '1')); if ([1, 2, 3].includes(n)) alert(saveToSlot(n, s) ? 'Jogo gravado.' : 'Erro ao gravar.'); });
  el.querySelector('#menu')!.addEventListener('click', toMenu);
  draw();
}
