// Ecrã da Carreira: confiança da direção, objetivo, reputação e propostas de emprego
import { careerOf, expectedPos, objectiveOf, takeJob } from '../../core/career';
import { leagueTable } from '../../core/season/season';
import { suggestTactics } from '../../core/tactics';
import type { GameState } from '../../core/types';
import { crestSvg } from '../crest';

const meter = (v: number) => `<span style="display:inline-block;width:160px;height:10px;border-radius:5px;background:#333;vertical-align:middle"><span style="display:block;height:10px;border-radius:5px;width:${v}%;background:${v >= 60 ? '#2e9e5b' : v >= 35 ? '#c9a227' : '#c0392b'}"></span></span> ${Math.round(v)}`;
const conf = (v: number) => (v >= 75 ? 'A direção está muito satisfeita' : v >= 50 ? 'A direção está satisfeita' : v >= 30 ? 'A direção está preocupada' : v >= 15 ? 'O teu lugar está em risco' : 'Despedido');

export function renderCareer(content: HTMLElement, s: GameState, onJob: () => void) {
  const c = careerOf(s);
  const club = s.clubs.find((x) => x.id === s.clubId)!;
  const t = leagueTable(s.season, s.leagues[0].clubIds);
  const pos = t.findIndex((r) => r.club === s.clubId) + 1;
  const obj = objectiveOf(s, s.clubId);
  content.innerHTML = `
    <h2>Carreira</h2>
    ${c.sacked ? '<div class="card" style="border-color:#c0392b;margin-bottom:12px"><b>Foste despedido.</b> Escolhe uma das propostas abaixo para continuar a carreira.</div>' : ''}
    <div class="cards">
      <div class="card"><div class="muted small">Confiança da direção</div><div class="big">${meter(c.confidence)}</div><div class="small muted">${conf(c.confidence)}</div></div>
      <div class="card"><div class="muted small">Objetivo da época</div><div class="big">${obj.text}</div><div class="small muted">Esperado: ${expectedPos(s, s.clubId)}.º · Agora: ${t[pos - 1]?.p ? pos + '.º' : 'por começar'}</div></div>
      <div class="card"><div class="muted small">A tua reputação</div><div class="big">${meter(c.reputation)}</div><div class="small muted">Sobe com vitórias e títulos; os clubes maiores só te convidam com reputação suficiente</div></div>
    </div>
    <h3>Propostas</h3>
    ${c.offers.length ? `<table class="tbl"><tbody>${c.offers.map((o) => { const k = s.clubs.find((x) => x.id === o.clubId)!; return `<tr><td>${crestSvg(k.id, 20)} <b>${k.name}</b></td><td class="small muted">reputação ${k.reputation} · ${objectiveOf(s, k.id).text}</td><td><button class="btn primary" data-job="${k.id}">Aceitar</button></td></tr>`; }).join('')}</tbody></table>` : '<p class="muted">Sem propostas. Surgem quando um clube maior despede o treinador e a tua reputação chega.</p>'}
    <p class="muted small">Ao aceitar mudas de clube: o plantel, o staff e as finanças passam a ser os do novo clube; o teu antigo clube contrata outro treinador. Valores de confiança e reputação são estimativas ao estilo FM.</p>`;
  content.querySelectorAll<HTMLElement>('[data-job]').forEach((b) => (b.onclick = () => {
    const k = s.clubs.find((x) => x.id === b.dataset.job)!;
    if (!confirm(`Aceitar o convite do ${k.name}${c.sacked ? '' : ` e deixar o ${club.name}`}?`)) return;
    alert(takeJob(s, k.id, (cid) => suggestTactics(s.players.filter((p) => p.clubId === cid))));
    onJob();
  }));
}
