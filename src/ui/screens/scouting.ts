// Observação: jogadores (olheiro, para contratações) e equipas (analista, para preparar os jogos), como no FM
import { ATTR_GROUPS, overall } from '../../core/attributes';
import { clubName, nextMyFixture } from '../../core/game';
import { knowledge, maxQueue, observe, recommendation, scoutAbility, scoutOf, seenLevel } from '../../core/scouting';
import { abilityOf, staffOf } from '../../core/staff';
import { LABELS } from '../../core/tactics';
import type { GameState, Player } from '../../core/types';
import { crestSvg } from '../crest';
import { openPlayerSheet } from '../playerSheet';

let sub: 'jogadores' | 'equipas' = 'jogadores';
let teamSel = '';
const rng = (l: { lo: number; hi: number }) => (l.hi - l.lo < 0.8 ? ((l.lo + l.hi) / 2).toFixed(1) : `${l.lo.toFixed(0)}-${l.hi.toFixed(0)}`);

export function renderScouting(content: HTMLElement, s: GameState) {
  const sc = scoutOf(s);
  const scout = staffOf(s, s.clubId, 'scout');
  const analyst = staffOf(s, s.clubId, 'analista');
  let body = '';
  if (sub === 'jogadores') {
    const queue = sc.queue.map((q) => s.players.find((p) => p.id === q.id)).filter((p): p is Player => !!p);
    const reports = s.players.filter((p) => p.clubId !== s.clubId && (sc.known[p.id] ?? 0) >= 100).sort((a, b) => (seenLevel(s, b).hi - seenLevel(s, a).hi));
    const row = (p: Player, prog: boolean) => `<tr><td class="click" data-sheet="${p.id}"><b>${p.name}</b></td><td>${p.clubId ? `${crestSvg(p.clubId.replace('@jun', ''), 16)} ${clubName(s, p.clubId.replace('@jun', ''))}` : 'Livre'}</td><td>${p.position}</td><td>${p.age}</td><td>${p.nationality}</td><td>${rng(seenLevel(s, p))}</td><td>${rng(seenLevel(s, p, true))}</td><td>${prog ? `<span class="ebar"><i style="width:${knowledge(s, p)}%;background:#4ade80"></i></span> ${Math.round(knowledge(s, p))}%` : recommendation(s, p)}</td>${prog ? `<td><button class="btn ghost" data-stop="${p.id}">Parar</button></td>` : ''}</tr>`;
    body = `
      <div class="cards"><div class="card"><div class="muted small">Olheiro</div><div class="big">${scout ? `${scout.name} (${scout.ability}/20)` : 'Sem olheiro: observa o treinador'}</div><div class="small muted">Observa até ${maxQueue(s)} jogadores ao mesmo tempo; quanto melhor, mais rápido e mais certo (intervalos mais estreitos).</div></div></div>
      <div class="form-row"><label>Observar jogador<input id="obsq" placeholder="nome" style="width:180px"></label><div id="obsres" class="small"></div></div>
      <h3>Em observação</h3>
      ${queue.length ? `<table class="tbl small"><thead><tr><th>Jogador</th><th>Clube</th><th>Pos.</th><th>Idade</th><th>Nac.</th><th>Nível</th><th>Potencial</th><th>Conhecimento</th><th></th></tr></thead><tbody>${queue.map((p) => row(p, true)).join('')}</tbody></table>` : '<p class="muted">Ninguém. Escolhe jogadores aqui ou no Mercado (botão Observar).</p>'}
      <h3>Relatórios</h3>
      ${reports.length ? `<table class="tbl small"><thead><tr><th>Jogador</th><th>Clube</th><th>Pos.</th><th>Idade</th><th>Nac.</th><th>Nível</th><th>Potencial</th><th>Recomendação</th></tr></thead><tbody>${reports.map((p) => row(p, false)).join('')}</tbody></table>` : '<p class="muted">Ainda sem relatórios completos.</p>'}
      <p class="small muted">Sem observação só se conhece um intervalo largo (jogadores da tua liga um pouco melhor, porque se vêem nos jogos). Nível e potencial na escala 1-20.</p>`;
  } else {
    const next = nextMyFixture(s);
    const opp = teamSel || (next ? (next.home === s.clubId ? next.away : next.home) : s.clubs.find((c) => c.id !== s.clubId)!.id);
    body = `<div class="cards"><div class="card"><div class="muted small">Analista</div><div class="big">${analyst ? `${analyst.name} (${analyst.ability}/20)` : 'Sem analista: relatório básico'}</div><div class="small muted">Um analista melhor dá relatórios mais completos e certos.</div></div></div>
      <label>Equipa <select id="teamsel">${s.clubs.filter((c) => c.id !== s.clubId).sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option value="${c.id}" ${c.id === opp ? 'selected' : ''}>${c.name}${next && (next.home === c.id || next.away === c.id) ? ' (próximo adversário)' : ''}</option>`).join('')}</select></label>
      ${teamReport(s, opp)}`;
  }
  content.innerHTML = `<h2>Observação</h2>
    <div class="tabs"><button class="tab ${sub === 'jogadores' ? 'on' : ''}" data-sub="jogadores">Observação de jogadores</button><button class="tab ${sub === 'equipas' ? 'on' : ''}" data-sub="equipas">Observação de equipas</button></div>
    ${body}`;
  const re = () => renderScouting(content, s);
  content.querySelectorAll<HTMLElement>('[data-sub]').forEach((b) => (b.onclick = () => { sub = b.dataset.sub as typeof sub; re(); }));
  content.querySelectorAll<HTMLElement>('[data-sheet]').forEach((b) => (b.onclick = () => openPlayerSheet(s, b.dataset.sheet!)));
  content.querySelectorAll<HTMLElement>('[data-stop]').forEach((b) => (b.onclick = () => { sc.queue = sc.queue.filter((q) => q.id !== b.dataset.stop); re(); }));
  content.querySelector<HTMLSelectElement>('#teamsel')?.addEventListener('change', (e) => { teamSel = (e.target as HTMLSelectElement).value; re(); });
  const q = content.querySelector<HTMLInputElement>('#obsq');
  q?.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    const found = v.length < 3 ? [] : s.players.filter((p) => p.clubId !== s.clubId && p.name.toLowerCase().includes(v)).slice(0, 8);
    content.querySelector('#obsres')!.innerHTML = found.map((p) => `<button class="btn" data-obs="${p.id}">${p.name} (${p.position}, ${clubName(s, p.clubId.replace('@jun', '')) || 'livre'})</button>`).join(' ');
    content.querySelectorAll<HTMLElement>('[data-obs]').forEach((b) => (b.onclick = () => { alert(observe(s, b.dataset.obs!)); re(); }));
  });
}

/** Relatório de uma equipa: resultados, sistemas, pontos fortes e fracos, como marcam golos (qualidade conforme o analista). */
function teamReport(s: GameState, clubId: string) {
  const a = staffOf(s, s.clubId, 'analista') ? abilityOf(s, s.clubId, 'analista') : 4;
  const games = s.season.fixtures.filter((f) => f.result && (f.home === clubId || f.away === clubId)).slice(-8);
  const last5 = games.slice(-5).map((f) => {
    const home = f.home === clubId;
    const [x, y] = f.result!.pens ?? f.result!.score;
    const r = home ? x - y : y - x;
    return `<span class="form ${r > 0 ? 'w' : r < 0 ? 'l' : 'd'}" title="${clubName(s, f.home)} ${f.result!.score[0]}-${f.result!.score[1]} ${clubName(s, f.away)}">${r > 0 ? 'V' : r < 0 ? 'D' : 'E'}</span>`;
  }).join('');
  const tacs = games.map((f) => f.result!.tac?.[f.home === clubId ? 0 : 1]).filter((x): x is NonNullable<typeof x> => !!x);
  const count = (k: 'sys' | 'press' | 'mark' | 'fly') => Object.entries(tacs.reduce((m, t) => ((m[t[k]] = (m[t[k]] ?? 0) + 1), m), {} as Record<string, number>)).sort((x, y) => y[1] - x[1]);
  const lab = (k: keyof typeof LABELS, v: string) => ((LABELS[k] as Record<string, string>)[v] ?? v).split(' (')[0];
  const goals = games.flatMap((f) => f.result!.scorers.filter((g) => (g.side === 0) === (f.home === clubId)));
  const conceded = games.flatMap((f) => f.result!.scorers.filter((g) => (g.side === 0) !== (f.home === clubId)));
  const byKind = (gs: typeof goals) => Object.entries(gs.reduce((m, g) => ((m[g.kind ?? 'jogada'] = (m[g.kind ?? 'jogada'] ?? 0) + 1), m), {} as Record<string, number>)).sort((x, y) => y[1] - x[1]);
  // pontos fortes e fracos: atributos médios dos 8 mais utilizados contra a média da liga
  const squad = s.players.filter((p) => p.clubId === clubId).sort((x, y) => (s.pstats[y.id]?.minutes ?? overall(y.attrs, y.position)) - (s.pstats[x.id]?.minutes ?? overall(x.attrs, x.position))).slice(0, 8);
  const lg = s.leagues.find((l) => l.clubIds.includes(clubId))?.clubIds ?? [];
  const pool = s.players.filter((p) => lg.includes(p.clubId) && p.position !== 'GR');
  const keys = ['finalizacao', 'remate', 'passe', 'drible', 'desarme', 'posicionamento', 'velocidade', 'aceleracao', 'resistencia', 'forca', 'jogoCostas', 'bolasParadas', 'decisoes', 'concentracao'] as const;
  const avg = (ps: Player[], k: string) => ps.reduce((m, p) => m + ((p.attrs as unknown as Record<string, number>)[k] ?? 10), 0) / Math.max(1, ps.length);
  const out = squad.filter((p) => p.position !== 'GR');
  const labelOf = (k: string) => Object.values(ATTR_GROUPS).map((g) => (g.attrs as Record<string, string>)[k]).find(Boolean) ?? k;
  const noise = (k: string) => (a >= 14 ? 0 : ((k.length * 7 + clubId.length * 3) % 5 - 2) * (14 - a) * 0.05); // analista fraco engana-se
  const diffs = keys.map((k) => ({ k, d: avg(out, k) - avg(pool, k) + noise(k) })).sort((x, y) => y.d - x.d);
  const nShow = a >= 14 ? 4 : a >= 9 ? 3 : 2;
  const gk = squad.find((p) => p.position === 'GR') ?? s.players.find((p) => p.clubId === clubId && p.position === 'GR');
  const top = Object.entries(games.flatMap((f) => f.result!.scorers.filter((g) => (g.side === 0) === (f.home === clubId))).reduce((m, g) => ((m[g.id] = (m[g.id] ?? 0) + 1), m), {} as Record<string, number>)).sort((x, y) => y[1] - x[1]).slice(0, 3);
  const pct = (n: number, t: number) => `${Math.round((n / Math.max(1, t)) * 100)}%`;
  return `
    <div class="cards" style="margin-top:10px">
      <div class="card"><div class="muted small">Últimos jogos</div><div class="big">${crestSvg(clubId, 24)} ${last5 || '<span class="muted">sem jogos</span>'}</div></div>
      <div class="card"><div class="muted small">Sistema mais usado</div><div class="big">${count('sys').map(([v, n]) => `${v} <span class="small muted">(${n})</span>`).join(' · ') || '?'}</div>${a >= 7 ? `<div class="small muted">Pressão: ${count('press').map(([v, n]) => `${lab('pressure', v)} (${n})`).join(', ')} · Marcação: ${count('mark').map(([v, n]) => `${lab('marking', v)} (${n})`).join(', ')}</div>` : ''}${a >= 10 ? `<div class="small muted">GR avançado: ${count('fly').map(([v, n]) => `${lab('flyingKeeper', v)} (${n})`).join(', ')}</div>` : ''}</div>
    </div>
    ${a >= 6 ? `<div class="cards">
      <div class="card"><div class="muted small">Pontos fortes</div><div>${diffs.slice(0, nShow).map((x) => `✅ ${labelOf(x.k)}`).join('<br>')}</div></div>
      <div class="card"><div class="muted small">Pontos fracos</div><div>${diffs.slice(-nShow).reverse().map((x) => `⚠️ ${labelOf(x.k)}`).join('<br>')}</div></div>
      ${gk && a >= 8 ? `<div class="card"><div class="muted small">Guarda-redes</div><div>${gk.name}: ${gk.attrs.reflexos >= 14 ? 'reflexos muito bons' : 'reflexos normais'}, ${gk.attrs.umParaUm >= 14 ? 'forte no 1x1' : 'vulnerável no 1x1'}${gk.attrs.jogoPes >= 13 ? ', joga bem com os pés' : ''}</div></div>` : ''}
    </div>` : '<p class="muted">Sem analista não há relatório de pontos fortes e fracos.</p>'}
    ${games.length ? `<h3>Como marcam e como sofrem (${games.length} jogos)</h3>
    <table class="tbl small"><thead><tr><th>Lance</th><th>Golos marcados</th><th>Golos sofridos</th></tr></thead><tbody>
    ${['jogada', 'contra', 'canto', 'livre10', 'penalti', 'baliza deserta', 'recarga'].map((k) => { const g = byKind(goals).find((x) => x[0] === k)?.[1] ?? 0, c = byKind(conceded).find((x) => x[0] === k)?.[1] ?? 0; return g || c ? `<tr><td>${{ jogada: 'Jogada', contra: 'Contra-ataque', canto: 'Canto', livre10: 'Livre de 10 m', penalti: 'Penálti', 'baliza deserta': 'Baliza deserta (5x4)', recarga: 'Recarga' }[k]}</td><td>${g} (${pct(g, goals.length)})</td><td>${c} (${pct(c, conceded.length)})</td></tr>` : ''; }).join('')}
    </tbody></table>
    ${a >= 8 && top.length ? `<p>Mais perigosos: ${top.map(([id, n]) => `<b>${s.players.find((p) => p.id === id)?.name ?? '?'}</b> (${n} golos)`).join(', ')}</p>` : ''}` : ''}
    <p class="small muted">${a >= 14 ? 'Relatório completo.' : a >= 8 ? 'Relatório razoável: alguns pormenores podem falhar.' : 'Relatório pobre: contrata um analista melhor para saberes mais.'} Usa-o para escolher a marcação: individual anula o pivô do 3-1 mas sofre com o 4-0 e com o 5x4; à zona fecha o 4-0 e o 5x4 mas deixa o pivô receber; mista fica no meio e depende da concentração.</p>`;
}
