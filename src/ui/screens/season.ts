import { showTrophy } from '../trophy';
import { crestSvg } from '../crest';
import { injuryOf } from '../../core/injuries';
import { banFor } from '../../core/discipline';
// Ecrãs da época: início, calendário, competições e dia de jogo
import { clubName, myFixtures, nextMyFixture, playMyMatch, setupFor } from '../../core/game';
import { leagueTable, spainTable } from '../../core/season/season';
import { ARENAS, arenaOf } from '../../core/attendance';
import { refBadgeHtml, refereesFor } from '../../core/referees';
import { KitChoice, kitsOf, matchGkKits, matchKits, setPendingKit } from '../../core/kits';
import { kitSvg } from '../kitSvg';
import { COMP_NAMES, COUNTRY_COMPS, CompId, Fixture, leagueCompOf } from '../../core/season/types';
import { countryOf, leagueOf } from '../../core/state';
import type { GameState } from '../../core/types';
import { resultHtml } from './friendly';
import { tacticsSummary } from './tactics';
import { renderLive, settingsOf } from './live';

const fmtDate = (d: string) => new Date(d + 'T12:00:00Z').toLocaleDateString('pt-PT', { weekday: 'short', day: '2-digit', month: 'short' });
const short = (s: GameState, id: string) => s.clubs.find((c) => c.id === id)?.shortName ?? id;

function scoreText(f: Fixture) {
  if (!f.result) return f.cancelled ? 'não necessário' : '-';
  const [h, a] = f.result.score;
  return `${h}-${a}${f.result.pens ? ` (${f.result.pens[0]}-${f.result.pens[1]} g.p.)` : f.result.et ? ' a.p.' : ''}`;
}

export function renderDashboard(content: HTMLElement, s: GameState) {
  const club = s.clubs.find((c) => c.id === s.clubId)!;
  const next = nextMyFixture(s);
  const lg = leagueOf(s, s.clubId);
  const table = leagueTable(s.season, lg.clubIds, 99, leagueCompOf(lg.id));
  const pos = table.findIndex((r) => r.club === s.clubId) + 1;
  const row = table[pos - 1];
  const last = myFixtures(s).filter((f) => f.result).slice(-5);
  const form = last.map((f) => {
    const mine = f.home === s.clubId ? 0 : 1;
    const [a, b] = f.result!.pens ?? f.result!.score;
    const x = mine === 0 ? a - b : b - a;
    return `<span class="form ${x > 0 ? 'w' : x < 0 ? 'l' : 'd'}">${x > 0 ? 'V' : x < 0 ? 'D' : 'E'}</span>`;
  });
  content.innerHTML = `
    <h2>Início</h2>
    <div class="cards">
      <div class="card">
        <div class="muted small">Próximo jogo</div>
        ${next ? `<div class="big">${crestSvg(next.home === s.clubId ? next.away : next.home, 26)} ${next.home === s.clubId ? 'vs' : '@'} ${clubName(s, next.home === s.clubId ? next.away : next.home)}</div>
        <div class="small muted">${COMP_NAMES[next.comp]} · ${next.stage} · ${fmtDate(next.date)}</div>` : '<div class="big">Sem jogos marcados</div>'}
      </div>
      <div class="card">
        <div class="muted small">${lg.name}</div>
        <div class="big">${row && row.p ? `${pos}.º lugar · ${row.pts} pts` : 'Ainda não começou'}</div>
        <div class="small">${form.join('') || '<span class="muted">Sem jogos</span>'}</div>
      </div>
      <div class="card">
        <div class="muted small">Clube</div>
        <div class="big">${crestSvg(club.id, 26)} ${club.name}</div>
        <div class="small muted">${ARENAS[club.id]?.name ?? club.arena}${club.capacity ? ` (${club.capacity.toLocaleString('pt-PT')} lugares${club.capacityReal ? '' : ', estimativa'})` : ''} · reputação ${club.reputation} · poder financeiro ${club.wealth}</div>
      </div>
    </div>
    <h3>Notícias</h3>
    <div class="feed">${s.news.slice(0, 25).map((n) => `<div class="ev"><span class="dt small muted">${fmtDate(n.date)}</span>${n.text}</div>`).join('')}</div>`;
}

export function renderCalendar(content: HTMLElement, s: GameState, month?: string) {
  // calendário mensal (como no FM): escolher o mês; em cada dia de jogo o emblema do adversário, a competição,
  // casa 🏠 / fora ✈️ / campo neutro 🏟️ e, depois do jogo, um ponto verde/amarelo/vermelho com o resultado
  const fx = myFixtures(s);
  const ym = month ?? s.date.slice(0, 7);
  const months: string[] = [];
  for (let d = new Date(`${s.season.year}-07-01T12:00:00Z`); months.length < 12; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 7));
  const [Y, M] = ym.split('-').map(Number);
  const first = new Date(Date.UTC(Y, M - 1, 1, 12));
  const days = new Date(Date.UTC(Y, M, 0, 12)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7; // segunda-feira primeiro
  const mName = (x: string) => new Date(x + '-15T12:00:00Z').toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  const SHORT: Record<string, string> = { liga: 'Liga Placard', playoff: 'Play-off', taca: 'Taça de Portugal', tacaLiga: 'Taça da Liga', supertaca: 'Supertaça', esp: 'Liga Prime', espPlayoff: 'Fase final', copaEsp: 'Copa de España', superEsp: 'Supercopa', copaRey: 'Copa del Rey' };
  const cells: string[] = [];
  for (let i = 0; i < lead; i++) cells.push('<div class="cal-day empty"></div>');
  for (let d = 1; d <= days; d++) {
    const date = `${ym}-${String(d).padStart(2, '0')}`;
    const f = fx.find((x) => x.date === date);
    let inner = '';
    if (f) {
      const home = f.home === s.clubId;
      const opp = home ? f.away : f.home;
      let dot = '';
      if (f.result) {
        const [x, y] = f.result.pens ?? f.result.score;
        const r = home ? x - y : y - x;
        const [a, b] = home ? f.result.score : [f.result.score[1], f.result.score[0]];
        dot = `<span class="cal-dot ${r > 0 ? 'w' : r < 0 ? 'l' : 'd'}" title="${clubName(s, f.home)} ${scoreText(f)} ${clubName(s, f.away)}">${a}-${b}</span>`;
      }
      inner = `<div class="cal-match" title="${COMP_NAMES[f.comp]} · ${f.stage}">${crestSvg(opp, 30)}<div class="small">${SHORT[f.comp] ?? COMP_NAMES[f.comp]}</div><div>${f.neutral ? '🏟️' : home ? '🏠' : '✈️'} ${dot}</div></div>`;
    }
    cells.push(`<div class="cal-day ${date === s.date ? 'today' : ''} ${f ? 'has' : ''}"><span class="cal-n">${d}</span>${inner}</div>`);
  }
  content.innerHTML = `
    <h2>Calendário <span class="muted small">${s.season.label}</span></h2>
    <div class="row" style="justify-content:flex-start;gap:8px;margin-bottom:10px">
      <button class="btn" id="mprev">◂</button>
      <select id="msel">${months.map((x) => `<option value="${x}" ${x === ym ? 'selected' : ''}>${mName(x)}</option>`).join('')}</select>
      <button class="btn" id="mnext">▸</button>
    </div>
    <div class="cal">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((x) => `<div class="cal-h">${x}</div>`).join('')}${cells.join('')}</div>
    <p class="small muted">🏠 casa · ✈️ fora · 🏟️ campo neutro · ponto verde vitória, amarelo empate, vermelho derrota (passa o rato para ver o resultado). Os jogos das rondas seguintes aparecem quando se apuram os adversários.</p>`;
  const i = months.indexOf(ym);
  content.querySelector('#msel')!.addEventListener('change', (e) => renderCalendar(content, s, (e.target as HTMLSelectElement).value));
  content.querySelector('#mprev')!.addEventListener('click', () => renderCalendar(content, s, months[Math.max(0, i - 1)] ?? ym));
  content.querySelector('#mnext')!.addEventListener('click', () => renderCalendar(content, s, months[Math.min(months.length - 1, i + 1)] ?? ym));
}

export function renderCompetitions(content: HTMLElement, s: GameState, tab = 'liga', round?: number, country?: string, part: 'apertura' | 'clausura' | 'total' = 'total') {
  const ctry = country ?? countryOf(s, s.clubId);
  const C = COUNTRY_COMPS[ctry];
  const lg = s.leagues.find((l) => l.id === (ctry === 'esp' ? 'esp1' : ctry === 'ita' ? 'ita1' : 'por1')) ?? s.leagues[0];
  // separadores por tipo (os ids antigos 'liga', 'taca'… continuam a funcionar)
  const kindTab: Record<string, string> = { liga: 'league', playoff: 'playoff', taca: 'cup', tacaLiga: 'leagueCup', supertaca: 'super' };
  tab = kindTab[tab] ?? tab;
  const tabs: [string, string][] = [['league', COMP_NAMES[C.league]], ['playoff', ctry === 'esp' ? 'Fase final e permanência' : ctry === 'ita' ? 'Play-in, play-off e play-out' : 'Play-off'], ['cup', COMP_NAMES[C.cup]], ...(C.leagueCup !== C.cup ? [['leagueCup', COMP_NAMES[C.leagueCup]] as [string, string]] : []), ['super', COMP_NAMES[C.super]], ['palmares', 'Palmarés'], ['marcadores', 'Marcadores']];
  let body = '';
  const sea = s.season;
  if (tab === 'league') {
    const t = ctry === 'esp' ? spainTable(sea, lg.clubIds, part) : leagueTable(sea, lg.clubIds, 99, C.league);
    const rounds = Math.max(...sea.fixtures.filter((f) => f.comp === C.league).map((f) => f.round ?? 0));
    const played = Math.max(0, ...sea.fixtures.filter((f) => f.comp === C.league && f.result).map((f) => f.round ?? 0));
    const rd = round ?? Math.max(1, played);
    const games = sea.fixtures.filter((f) => f.comp === C.league && f.round === rd);
    body = `
      ${ctry === 'esp' ? `<div class="tabs">${([['apertura', 'Apertura'], ['clausura', 'Clausura'], ['total', 'Acumulada']] as const).map(([id, l]) => `<button class="tab ${id === part ? 'on' : ''}" data-part="${id}">${l}</button>`).join('')}</div>` : ''}
      <table class="tbl small table">
        <thead><tr><th>#</th><th>Clube</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GM</th><th>GS</th><th>DG</th><th>Pts</th></tr></thead>
        <tbody>${t
          .map((r, i) => `<tr class="${r.club === s.clubId ? 'mine' : ''} ${(ctry === 'esp' ? (part === 'total' ? i < 4 : i < 2) : ctry === 'ita' ? i < 6 : i < 8) ? 'zone-po' : ''} ${ctry === 'ita' && i >= 6 && i < 10 ? 'zone-pi' : ''} ${ctry === 'ita' && i >= t.length - 4 ? 'zone-rel' : ''}"><td>${i + 1}</td><td>${crestSvg(r.club, 18)} ${clubName(s, r.club)}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`)
          .join('')}</tbody>
      </table>
      <p class="small muted">${ctry === 'esp' ? 'Apertura (jornadas 1-15) e Clausura (16-30) têm campeão cada. Fase final do Supercampeão: 1.º e 2.º de cada torneio + os melhores da classificação acumulada até 8. Na acumulada, o último desce e o 14.º e o 15.º jogam a permanência (descidas efetivas quando a Segunda existir no jogo). Os 6 primeiros do Apertura vão à fase final da Copa de España.' : ctry === 'ita' ? 'Do 1.º ao 6.º (a verde) vão diretos ao play-off; do 7.º ao 10.º jogam o play-in (2 vagas). Os 2 últimos descem e o 11.º e o 12.º jogam o play-out (descidas efetivas quando a Serie A2 existir no jogo). Os 8 primeiros no fim da 1.ª volta vão à Final Eight da Coppa Italia. (Divisione Calcio a 5, Comunicati 028 e 029.)' : 'Os 8 primeiros (a verde) seguem para o play-off. As descidas de divisão entram quando a II Divisão existir no jogo.'}</p>
      <h3>Jornada <select id="rd">${Array.from({ length: rounds }, (_, i) => `<option ${i + 1 === rd ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></h3>
      ${fixturesTable(s, games)}`;
  } else if (tab === 'playoff') {
    const stages = ['Quartos-de-final', 'Meias-finais', 'Final', 'Permanência'];
    const mine = sea.series.filter((x) => (x.comp ?? 'playoff') === C.playoff);
    // Itália: play-in (jogo único) e play-out (ida e volta) não são séries
    const singles = sea.fixtures.filter((f) => f.comp === C.playoff && !f.seriesId);
    const singlesHtml = singles.length ? [...new Set(singles.map((f) => f.stage))].map((st) => `<h3>${st}</h3>${fixturesTable(s, singles.filter((f) => f.stage === st))}`).join('') : '';
    body = singlesHtml + (mine.length
      ? stages
          .map((st) => {
            const ser = mine.filter((x) => x.stage === st);
            if (!ser.length) return '';
            return `<h3>${st} <span class="muted small">(melhor de ${ser[0].bestOf})</span></h3>${ser
              .map((x) => `<div class="series ${x.winner ? 'done' : ''}"><b class="${x.winner === x.hi ? 'win' : ''}">${clubName(s, x.hi)}</b> ${x.wins[0]} - ${x.wins[1]} <b class="${x.winner === x.lo ? 'win' : ''}">${clubName(s, x.lo)}</b>
                <div class="small muted">${x.fixtureIds.map((id) => sea.fixtures.find((f) => f.id === id)!).filter((f) => !f.cancelled).map((f) => `${short(s, f.home)} ${scoreText(f)} ${short(s, f.away)}`).join(' · ')}</div></div>`)
              .join('')}`;
          })
          .join('')
      : singlesHtml ? '' : '<div class="empty">O play-off começa no fim da fase regular.</div>');
  } else if (tab === 'cup' || tab === 'leagueCup' || tab === 'super') {
    const comp = C[tab as 'cup'];
    const fx = sea.fixtures.filter((f) => f.comp === comp);
    const stages = [...new Set(fx.map((f) => f.stage))];
    const info: Record<string, string> = {
      taca: 'Eliminatória inicial entre os classificados de 5.º a 12.º; final eight em campo neutro (Gondomar) em abril.',
      tacaLiga: 'Final eight com os 8 primeiros no fim da 1.ª volta, em campo neutro, em janeiro.',
      supertaca: 'Campeão nacional contra o vencedor da Taça de Portugal (ou finalista vencido, se for o mesmo clube).',
      copaRey: 'Eliminatórias a uma mão (o pior classificado na época anterior joga em casa), final em campo neutro. No real entram equipas das divisões inferiores: por agora só os 16 da Primera. Datas estimadas.',
      copaEsp: 'Copa de España S.M. el Rey (normas RFEF 2026/27): fase final de 8 em campo neutro (11-14 de março) com os 6 primeiros do Apertura e 2 vindos das eliminatórias (7.º ao 16.º do Apertura; no real também equipas das divisões inferiores, que entram quando existirem no jogo). Quartos e meias vão diretos a penáltis; a final tem prolongamento de 2x3 min.',
      coppaIta: 'Final Eight com os 8 primeiros no fim da 1.ª volta da Serie A (Comunicato 028). Quartos 1.º-8.º, 4.º-5.º, 3.º-6.º, 2.º-7.º em campo neutro; datas e local por definir pela Divisione (estimativa: início de março).',
      superIta: 'Final Four (Comunicato 027). 2026/27: L84 (campeão), Meta Catania (Coppa Italia), Napoli (1.º da fase regular) e Feldi Eboli (finalista da Coppa). Depois: campeão, Coppa Italia, 1.º da fase regular e finalista da Coppa (a Coppa della Divisione ainda não existe no jogo). Datas estimadas.',
      superEsp: 'Final four a jogo único (normas RFEF): Supercampeão, campeões do Apertura e do Clausura e vencedor da Copa (repetidos: melhores da acumulada). Meias com penáltis diretos. Na 1.ª época, os 4 mais fortes (estimativa). Data estimada.',
    };
    body = `<p class="small muted">${info[comp]}</p>` + (stages.length ? stages.map((st) => `<h3>${st}</h3>${fixturesTable(s, fx.filter((f) => f.stage === st))}`).join('') : '<div class="empty">Ainda sem jogos definidos.</div>');
  } else if (tab === 'palmares') {
    const hon = s.honours.filter((h) => Object.values(C).includes(h.comp) || (ctry === 'esp' && (h.comp === 'espAp' || h.comp === 'espCl')));
    body = hon.length
      ? `<table class="tbl small"><thead><tr><th>Época</th><th>Competição</th><th>Vencedor</th><th>Finalista</th></tr></thead><tbody>${[...hon]
          .reverse()
          .map((h) => `<tr class="${h.winner === s.clubId ? 'mine' : ''}"><td>${h.season}</td><td>${COMP_NAMES[h.comp as CompId].replace(' (play-off)', '')}</td><td>${clubName(s, h.winner)}</td><td>${h.runnerUp ? clubName(s, h.runnerUp) : '-'}</td></tr>`)
          .join('')}</tbody></table>`
      : '<div class="empty">O palmarés começa a ser preenchido no fim da primeira época.</div>';
  } else if (tab === 'marcadores') {
    const top = Object.entries(s.pstats).filter(([id]) => { const p = s.players.find((x) => x.id === id); return p && lg.clubIds.includes(p.clubId); }).sort((a, b) => b[1].goals - a[1].goals || b[1].assists - a[1].assists).slice(0, 20);
    body = `<table class="tbl small"><thead><tr><th>#</th><th>Jogador</th><th>Clube</th><th>J</th><th>Golos</th><th>Assist.</th><th>Nota média</th></tr></thead><tbody>${top
      .map(([id, st], i) => {
        const p = s.players.find((x) => x.id === id);
        return p ? `<tr class="${p.clubId === s.clubId ? 'mine' : ''}"><td>${i + 1}</td><td>${p.name}</td><td>${short(s, p.clubId)}</td><td>${st.games}</td><td><b>${st.goals}</b></td><td>${st.assists}</td><td>${(st.ratingSum / Math.max(1, st.games)).toFixed(2).replace('.', ',')}</td></tr>` : '';
      })
      .join('')}</tbody></table><p class="small muted">Todas as competições oficiais da época.</p>`;
  }
  const countries = s.leagues.length > 1 ? `<div class="tabs">${[['por', 'Portugal'], ['esp', 'Espanha'], ['ita', 'Itália']].filter(([id]) => s.leagues.some((l) => l.id === `${id}1`)).map(([id, l]) => `<button class="tab ${id === ctry ? 'on' : ''}" data-ctry="${id}">${l}</button>`).join('')}</div>` : '';
  content.innerHTML = `<h2>Competições <span class="muted small">${sea.label}</span></h2>
    ${countries}
    <div class="tabs">${tabs.map(([id, l]) => `<button class="tab ${id === tab ? 'on' : ''}" data-tab="${id}">${l}</button>`).join('')}</div>
    ${body}`;
  content.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => renderCompetitions(content, s, b.dataset.tab, undefined, ctry)));
  content.querySelectorAll<HTMLButtonElement>('[data-ctry]').forEach((b) => b.addEventListener('click', () => renderCompetitions(content, s, tab, undefined, b.dataset.ctry)));
  content.querySelector<HTMLSelectElement>('#rd')?.addEventListener('change', (e) => renderCompetitions(content, s, 'league', Number((e.target as HTMLSelectElement).value), ctry, part));
  content.querySelectorAll<HTMLButtonElement>('[data-part]').forEach((b) => b.addEventListener('click', () => renderCompetitions(content, s, 'league', undefined, ctry, b.dataset.part as 'apertura')));
}

function fixturesTable(s: GameState, fx: Fixture[]) {
  return `<table class="tbl small fixtures"><tbody>${fx
    .map((f) => `<tr class="${f.home === s.clubId || f.away === s.clubId ? 'mine' : ''}"><td class="small muted">${fmtDate(f.date)}</td><td class="r">${clubName(s, f.home)}</td><td class="c"><b>${scoreText(f)}</b></td><td>${clubName(s, f.away)}</td></tr>`)
    .join('')}</tbody></table>`;
}

// Castigados para este jogo (Regulamento Disciplinar da FPF)
function banLine(s: GameState, f: Fixture) {
  const out = s.players.filter((p) => (p.clubId === f.home || p.clubId === f.away) && banFor(s, p.id, f.comp) > 0);
  const inj = s.players.filter((p) => (p.clubId === f.home || p.clubId === f.away) && injuryOf(s, p.id));
  const injHtml = inj.length ? `<p class="small" style="margin-top:6px">🩹 Lesionados: ${inj.map((p) => `<b>${p.name}</b> (${clubName(s, p.clubId)}, ${injuryOf(s, p.id)!.type.toLowerCase()}, volta a ${fmtDate(injuryOf(s, p.id)!.until)})`).join(' · ')}</p>` : '';
  if (!out.length) return injHtml;
  const r = (p: (typeof out)[0]) => (s.discipline?.bans[p.id] ?? []).map((b) => b.reason).join(', ');
  return `<p class="small" style="margin-top:8px">🟥 Castigados: ${out.map((p) => `<b>${p.name}</b> (${clubName(s, p.clubId)}, ${r(p)})`).join(' · ')}</p>${injHtml}`;
}

// Dia de jogo: antevisão e resultado
export function renderMatchDay(content: HTMLElement, s: GameState, f: Fixture, onDone: () => void, goTactics: () => void) {
  const hs = setupFor(s, f.home, f.comp);
  const as = setupFor(s, f.away, f.comp);
  const h = s.clubs.find((c) => c.id === f.home)!;
  const a = s.clubs.find((c) => c.id === f.away)!;
  content.innerHTML = `
    <h2>Dia de jogo</h2>
    <p class="muted">${COMP_NAMES[f.comp]} · ${f.stage} · ${f.neutral ? `${arenaOf(s, f).name} (campo neutro)` : arenaOf(s, f).name}${f.knockout ? ' · Jogo a eliminar' : ''}<br>Árbitros: ${refBadgeHtml(refereesFor(s, f))}</p>
    <div class="scoreboard">
      <div class="team" style="--c1:${h.colors[0]}">${crestSvg(h.id, 34)} ${h.name}</div>
      <div class="score">vs</div>
      <div class="team" style="--c1:${a.colors[0]}">${a.name} ${crestSvg(a.id, 34)}</div>
    </div>
    <div class="coaches small muted" style="margin-top:8px"><span>${hs.coachName} · ${tacticsSummary(hs.tactics)}</span><span>${as.coachName} · ${tacticsSummary(as.tactics)}</span></div>
    ${banLine(s, f)}
    <div class="form-row" style="margin-top:16px">
      <label>Marcador<select id="sbs">${[['auto', 'Da competição'], ['liga', 'Liga Placard'], ['taca', 'Taça de Portugal'], ['tacaLiga', 'Taça da Liga'], ['supertaca', 'Supertaça'], ['esp', 'Primera División'], ['copaRey', 'Copa del Rey'], ['copaEsp', 'Copa de España'], ['superEsp', 'Supercopa de España']].map(([v, l]) => `<option value="${v}" ${settingsOf(s).scoreboard === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Velocidade<select id="spd">${[['lento', 'Lenta'], ['medio', 'Média'], ['rapido', 'Rápida']].map(([v, l]) => `<option value="${v}" ${settingsOf(s).speed === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    </div>
    <h3 style="margin-top:14px">Equipamentos</h3>
    <div id="kits"></div>
    <div class="row" style="justify-content:flex-start;margin-top:4px">
      <button class="btn" id="tac">Rever táticas</button>
      <button class="btn primary" id="live">Jogar ao vivo</button>
      <button class="btn" id="play">Resultado imediato</button>
    </div>
    <div id="result"></div>`;
  content.querySelector('#tac')!.addEventListener('click', goTactics);
  const st = settingsOf(s);
  content.querySelector<HTMLSelectElement>('#sbs')!.addEventListener('change', (e) => (st.scoreboard = (e.target as HTMLSelectElement).value as typeof st.scoreboard));
  // escolha gráfica: os meus dois equipamentos e como vão jogar as duas equipas (com os guarda-redes)
  const mySide: 0 | 1 | null = f.home === s.clubId ? 0 : f.away === s.clubId ? 1 : null;
  let choice: KitChoice = 'auto';
  const drawKits = () => {
    const ks = matchKits(h, a, mySide, choice);
    const gks = matchGkKits(h.id, a.id, ks);
    const mine = mySide === null ? null : kitsOf(mySide === 0 ? h.id : a.id, (mySide === 0 ? h : a).colors);
    const opt = (c: KitChoice, label: string, svg: string) => `<button class="kitopt ${choice === c ? 'on' : ''}" data-kit="${c}">${svg}<span>${label}</span></button>`;
    const team = (sd: 0 | 1) => `<div class="kitteam"><b>${(sd === 0 ? h : a).name}</b><div class="kitpair">${kitSvg(ks[sd], 86)}${kitSvg(gks[sd], 62)}</div><span class="small muted">Jogadores · Guarda-redes</span></div>`;
    content.querySelector('#kits')!.innerHTML = `<div class="kitbox">
      ${mine ? `<div class="kitpick"><span class="small muted">A minha equipa</span><div class="kitopts">${opt('home', 'Principal', kitSvg(mine.home, 70))}${opt('away', 'Alternativo', kitSvg(mine.away, 70))}${opt('auto', 'Automático', '<span class="kitauto">A</span>')}</div><span class="small muted">Automático: o visitante muda se as cores chocarem.</span></div>` : ''}
      <div class="kitmatch"><span class="small muted">Como vão jogar</span><div class="kitvs">${team(0)}<span class="kitx">vs</span>${team(1)}</div></div>
    </div>`;
    setPendingKit(choice);
  };
  content.querySelector('#kits')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-kit]');
    if (!b) return;
    choice = b.dataset.kit as KitChoice;
    drawKits();
  });
  drawKits();
  content.querySelector<HTMLSelectElement>('#spd')!.addEventListener('change', (e) => (st.speed = (e.target as HTMLSelectElement).value as typeof st.speed));
  // o resultado grava-se uma única vez, logo no fim do jogo (não se pode repetir o jogo)
  const record = (res?: Parameters<typeof playMyMatch>[2], silent = false) => {
    if (f.result) return null;
    const before = { ...s.season.winners };
    const m = playMyMatch(s, f, res);
    // título conquistado: festa com o troféu
    const won = (Object.keys(s.season.winners) as CompId[]).find((c) => s.season.winners[c] === s.clubId && before[c] !== s.clubId);
    if (won && !silent) setTimeout(() => showTrophy(s, won), 300); // com 3D, a festa é no 3D do jogo ao vivo
    return m;
  };
  content.querySelector('#live')!.addEventListener('click', () => {
    renderLive(content, s, f, (res) => {
      record(res);
      onDone();
    }, record);
  });
  content.querySelector('#play')!.addEventListener('click', () => {
    const m = record();
    if (!m) return;
    content.querySelectorAll('.row, .form-row, .scoreboard').forEach((x) => x.remove());
    content.querySelector('#result')!.innerHTML = `<div class="row" style="justify-content:flex-start;margin-bottom:12px"><button class="btn primary" id="cont">Continuar ▸</button></div>` + resultHtml(m, h, a);
    content.querySelector('#all')?.addEventListener('change', (e) => {
      content.querySelectorAll<HTMLElement>('.ev.minor').forEach((el) => (el.style.display = (e.target as HTMLInputElement).checked ? '' : 'none'));
    });
    content.querySelector('#cont')!.addEventListener('click', onDone);
  });
}
