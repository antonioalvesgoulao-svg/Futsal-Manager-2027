// Ecrãs da época: início, calendário, competições e dia de jogo
import { clubName, myFixtures, nextMyFixture, playMyMatch, setupFor } from '../../core/game';
import { leagueTable } from '../../core/season/season';
import { ARENAS, arenaOf } from '../../core/attendance';
import { refBadgeHtml, refereesFor } from '../../core/referees';
import { COMP_NAMES, CompId, Fixture } from '../../core/season/types';
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
  const table = leagueTable(s.season, s.leagues[0].clubIds);
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
        ${next ? `<div class="big">${next.home === s.clubId ? 'vs' : '@'} ${clubName(s, next.home === s.clubId ? next.away : next.home)}</div>
        <div class="small muted">${COMP_NAMES[next.comp]} · ${next.stage} · ${fmtDate(next.date)}</div>` : '<div class="big">Sem jogos marcados</div>'}
      </div>
      <div class="card">
        <div class="muted small">Liga Placard</div>
        <div class="big">${row && row.p ? `${pos}.º lugar · ${row.pts} pts` : 'Ainda não começou'}</div>
        <div class="small">${form.join('') || '<span class="muted">Sem jogos</span>'}</div>
      </div>
      <div class="card">
        <div class="muted small">Clube</div>
        <div class="big">${club.name}</div>
        <div class="small muted">${ARENAS[club.id]?.name ?? club.arena} · reputação ${club.reputation} · poder financeiro ${club.wealth}</div>
      </div>
    </div>
    <h3>Notícias</h3>
    <div class="feed">${s.news.slice(0, 25).map((n) => `<div class="ev"><span class="ic small muted">${fmtDate(n.date)}</span>${n.text}</div>`).join('')}</div>`;
}

export function renderCalendar(content: HTMLElement, s: GameState) {
  const fx = myFixtures(s);
  content.innerHTML = `
    <h2>Calendário <span class="muted small">${s.season.label}</span></h2>
    <table class="tbl small">
      <thead><tr><th>Data</th><th>Competição</th><th>Fase</th><th></th><th>Adversário</th><th>Resultado</th></tr></thead>
      <tbody>${fx
        .map((f) => {
          const home = f.home === s.clubId;
          const opp = home ? f.away : f.home;
          let cls = '';
          if (f.result) {
            const [a, b] = f.result.pens ?? f.result.score;
            const x = home ? a - b : b - a;
            cls = x > 0 ? 'res-w' : x < 0 ? 'res-l' : 'res-d';
          }
          return `<tr class="${f.date === s.date && !f.result ? 'today' : ''}"><td>${fmtDate(f.date)}</td><td>${COMP_NAMES[f.comp]}</td><td>${f.stage}</td><td>${f.neutral ? 'N' : home ? 'C' : 'F'}</td><td>${clubName(s, opp)}</td><td class="${cls}">${scoreText(f)}</td></tr>`;
        })
        .join('')}</tbody>
    </table>
    <p class="small muted">C = casa, F = fora, N = campo neutro. Os jogos das rondas seguintes das taças e do play-off aparecem quando se apuram os adversários.</p>`;
}

export function renderCompetitions(content: HTMLElement, s: GameState, tab = 'liga', round?: number) {
  const tabs: [string, string][] = [['liga', 'Liga Placard'], ['playoff', 'Play-off'], ['taca', 'Taça de Portugal'], ['tacaLiga', 'Taça da Liga'], ['supertaca', 'Supertaça'], ['palmares', 'Palmarés'], ['marcadores', 'Marcadores']];
  let body = '';
  const sea = s.season;
  if (tab === 'liga') {
    const t = leagueTable(sea, s.leagues[0].clubIds);
    const rounds = Math.max(...sea.fixtures.filter((f) => f.comp === 'liga').map((f) => f.round ?? 0));
    const played = Math.max(0, ...sea.fixtures.filter((f) => f.comp === 'liga' && f.result).map((f) => f.round ?? 0));
    const rd = round ?? Math.max(1, played);
    const games = sea.fixtures.filter((f) => f.comp === 'liga' && f.round === rd);
    body = `
      <table class="tbl small table">
        <thead><tr><th>#</th><th>Clube</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GM</th><th>GS</th><th>DG</th><th>Pts</th></tr></thead>
        <tbody>${t
          .map((r, i) => `<tr class="${r.club === s.clubId ? 'mine' : ''} ${i < 8 ? 'zone-po' : ''}"><td>${i + 1}</td><td>${clubName(s, r.club)}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`)
          .join('')}</tbody>
      </table>
      <p class="small muted">Os 8 primeiros (a verde) seguem para o play-off. As descidas de divisão entram quando a II Divisão existir no jogo.</p>
      <h3>Jornada <select id="rd">${Array.from({ length: rounds }, (_, i) => `<option ${i + 1 === rd ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></h3>
      ${fixturesTable(s, games)}`;
  } else if (tab === 'playoff') {
    const stages = ['Quartos-de-final', 'Meias-finais', 'Final'];
    body = sea.series.length
      ? stages
          .map((st) => {
            const ser = sea.series.filter((x) => x.stage === st);
            if (!ser.length) return '';
            return `<h3>${st} <span class="muted small">(melhor de ${ser[0].bestOf})</span></h3>${ser
              .map((x) => `<div class="series ${x.winner ? 'done' : ''}"><b class="${x.winner === x.hi ? 'win' : ''}">${clubName(s, x.hi)}</b> ${x.wins[0]} - ${x.wins[1]} <b class="${x.winner === x.lo ? 'win' : ''}">${clubName(s, x.lo)}</b>
                <div class="small muted">${x.fixtureIds.map((id) => sea.fixtures.find((f) => f.id === id)!).filter((f) => !f.cancelled).map((f) => `${short(s, f.home)} ${scoreText(f)} ${short(s, f.away)}`).join(' · ')}</div></div>`)
              .join('')}`;
          })
          .join('')
      : '<div class="empty">O play-off começa no fim da fase regular.</div>';
  } else if (tab === 'taca' || tab === 'tacaLiga' || tab === 'supertaca') {
    const fx = sea.fixtures.filter((f) => f.comp === tab);
    const stages = [...new Set(fx.map((f) => f.stage))];
    const info: Record<string, string> = {
      taca: 'Eliminatória inicial entre os classificados de 5.º a 12.º; final eight em campo neutro (Gondomar) em abril.',
      tacaLiga: 'Final eight com os 8 primeiros no fim da 1.ª volta, em campo neutro, em janeiro.',
      supertaca: 'Campeão nacional contra o vencedor da Taça de Portugal (ou finalista vencido, se for o mesmo clube).',
    };
    body = `<p class="small muted">${info[tab]}</p>` + (stages.length ? stages.map((st) => `<h3>${st}</h3>${fixturesTable(s, fx.filter((f) => f.stage === st))}`).join('') : '<div class="empty">Ainda sem jogos definidos.</div>');
  } else if (tab === 'palmares') {
    body = s.honours.length
      ? `<table class="tbl small"><thead><tr><th>Época</th><th>Competição</th><th>Vencedor</th><th>Finalista</th></tr></thead><tbody>${[...s.honours]
          .reverse()
          .map((h) => `<tr class="${h.winner === s.clubId ? 'mine' : ''}"><td>${h.season}</td><td>${COMP_NAMES[h.comp as CompId].replace(' (play-off)', '')}</td><td>${clubName(s, h.winner)}</td><td>${h.runnerUp ? clubName(s, h.runnerUp) : '-'}</td></tr>`)
          .join('')}</tbody></table>`
      : '<div class="empty">O palmarés começa a ser preenchido no fim da primeira época.</div>';
  } else if (tab === 'marcadores') {
    const top = Object.entries(s.pstats).sort((a, b) => b[1].goals - a[1].goals || b[1].assists - a[1].assists).slice(0, 20);
    body = `<table class="tbl small"><thead><tr><th>#</th><th>Jogador</th><th>Clube</th><th>J</th><th>Golos</th><th>Assist.</th><th>Nota média</th></tr></thead><tbody>${top
      .map(([id, st], i) => {
        const p = s.players.find((x) => x.id === id);
        return p ? `<tr class="${p.clubId === s.clubId ? 'mine' : ''}"><td>${i + 1}</td><td>${p.name}</td><td>${short(s, p.clubId)}</td><td>${st.games}</td><td><b>${st.goals}</b></td><td>${st.assists}</td><td>${(st.ratingSum / Math.max(1, st.games)).toFixed(2).replace('.', ',')}</td></tr>` : '';
      })
      .join('')}</tbody></table><p class="small muted">Todas as competições oficiais da época.</p>`;
  }
  content.innerHTML = `<h2>Competições <span class="muted small">${sea.label}</span></h2>
    <div class="tabs">${tabs.map(([id, l]) => `<button class="tab ${id === tab ? 'on' : ''}" data-tab="${id}">${l}</button>`).join('')}</div>
    ${body}`;
  content.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => b.addEventListener('click', () => renderCompetitions(content, s, b.dataset.tab)));
  content.querySelector<HTMLSelectElement>('#rd')?.addEventListener('change', (e) => renderCompetitions(content, s, 'liga', Number((e.target as HTMLSelectElement).value)));
}

function fixturesTable(s: GameState, fx: Fixture[]) {
  return `<table class="tbl small fixtures"><tbody>${fx
    .map((f) => `<tr class="${f.home === s.clubId || f.away === s.clubId ? 'mine' : ''}"><td class="small muted">${fmtDate(f.date)}</td><td class="r">${clubName(s, f.home)}</td><td class="c"><b>${scoreText(f)}</b></td><td>${clubName(s, f.away)}</td></tr>`)
    .join('')}</tbody></table>`;
}

// Dia de jogo: antevisão e resultado
export function renderMatchDay(content: HTMLElement, s: GameState, f: Fixture, onDone: () => void, goTactics: () => void) {
  const hs = setupFor(s, f.home);
  const as = setupFor(s, f.away);
  const h = s.clubs.find((c) => c.id === f.home)!;
  const a = s.clubs.find((c) => c.id === f.away)!;
  content.innerHTML = `
    <h2>Dia de jogo</h2>
    <p class="muted">${COMP_NAMES[f.comp]} · ${f.stage} · ${f.neutral ? `${arenaOf(s, f).name} (campo neutro)` : arenaOf(s, f).name}${f.knockout ? ' · Jogo a eliminar' : ''}<br>Árbitros: ${refBadgeHtml(refereesFor(s, f))}</p>
    <div class="scoreboard">
      <div class="team" style="--c1:${h.colors[0]}">${h.name}</div>
      <div class="score">vs</div>
      <div class="team" style="--c1:${a.colors[0]}">${a.name}</div>
    </div>
    <div class="coaches small muted" style="margin-top:8px"><span>${hs.coachName} · ${tacticsSummary(hs.tactics)}</span><span>${as.coachName} · ${tacticsSummary(as.tactics)}</span></div>
    <div class="form-row" style="margin-top:16px">
      <label>Marcador<select id="sbs">${[['auto', 'Da competição'], ['liga', 'Liga Placard'], ['taca', 'Taça de Portugal'], ['tacaLiga', 'Taça da Liga'], ['supertaca', 'Supertaça']].map(([v, l]) => `<option value="${v}" ${settingsOf(s).scoreboard === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Velocidade<select id="spd">${[['lento', 'Lenta'], ['medio', 'Média'], ['rapido', 'Rápida']].map(([v, l]) => `<option value="${v}" ${settingsOf(s).speed === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    </div>
    <div class="row" style="justify-content:flex-start;margin-top:4px">
      <button class="btn" id="tac">Rever táticas</button>
      <button class="btn primary" id="live">Jogar ao vivo</button>
      <button class="btn" id="play">Resultado imediato</button>
    </div>
    <div id="result"></div>`;
  content.querySelector('#tac')!.addEventListener('click', goTactics);
  const st = settingsOf(s);
  content.querySelector<HTMLSelectElement>('#sbs')!.addEventListener('change', (e) => (st.scoreboard = (e.target as HTMLSelectElement).value as typeof st.scoreboard));
  content.querySelector<HTMLSelectElement>('#spd')!.addEventListener('change', (e) => (st.speed = (e.target as HTMLSelectElement).value as typeof st.speed));
  content.querySelector('#live')!.addEventListener('click', () => {
    renderLive(content, s, f, (res) => {
      playMyMatch(s, f, res);
      onDone();
    });
  });
  content.querySelector('#play')!.addEventListener('click', () => {
    const m = playMyMatch(s, f);
    content.querySelectorAll('.row, .form-row, .scoreboard').forEach((x) => x.remove());
    content.querySelector('#result')!.innerHTML = resultHtml(m, h, a) + `<div class="row" style="justify-content:flex-start;margin-top:16px"><button class="btn primary" id="cont">Continuar</button></div>`;
    content.querySelector('#all')?.addEventListener('change', (e) => {
      content.querySelectorAll<HTMLElement>('.ev.minor').forEach((el) => (el.style.display = (e.target as HTMLInputElement).checked ? '' : 'none'));
    });
    content.querySelector('#cont')!.addEventListener('click', onDone);
  });
}
