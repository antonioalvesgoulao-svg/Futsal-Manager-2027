// Ecrã de jogo amigável (teste do motor de jogo)
import { simulateMatch } from '../../core/engine/match';
import type { MatchResult, TeamSetup } from '../../core/engine/types';
import type { Club, GameState } from '../../core/types';
import { aiTactics } from '../../core/coaches';
import { tacticsSummary } from './tactics';

// O teu clube usa as tuas táticas; os outros usam o estilo do respetivo treinador
function setupFor(s: GameState, c: Club, myClubId: string): TeamSetup & { coachName: string } {
  const squad = s.players.filter((p) => p.clubId === c.id);
  if (c.id === myClubId) {
    return { clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics: s.tactics, coachTactical: 12, coachName: s.manager.name };
  }
  const coach = s.coaches.find((x) => x.clubId === c.id);
  return {
    clubId: c.id, name: c.name, shortName: c.shortName, squad, tactics: aiTactics(squad, c, coach),
    coachTactical: coach?.tactical ?? 11, coachName: coach?.name ?? 'Treinador interino',
  };
}

const ICON: Record<string, string> = {
  golo: '⚽', amarelo: '🟨', vermelho: '🟥', penalti: '❗', livre_10m: '❗', remate_defendido: '🧤', poste: '▮',
  time_out: '⏱', gr_avancado_on: '↗', gr_avancado_off: '↘', fim_parte: '■', fim_jogo: '■', inicio: '▶', prolongamento: '▶', desempate: '●',
};
const MAIN = new Set(['golo', 'amarelo', 'vermelho', 'penalti', 'livre_10m', 'time_out', 'gr_avancado_on', 'gr_avancado_off', 'fim_parte', 'fim_jogo', 'inicio', 'prolongamento', 'desempate', 'poste']);

export function renderFriendly(content: HTMLElement, s: GameState, myClubId: string) {
  const clubs = [...s.clubs].sort((a, b) => a.name.localeCompare(b.name));
  content.innerHTML = `
    <h2>Jogo amigável</h2>
    <div class="form-row">
      <label>Casa<select id="home">${clubs.map((c) => `<option value="${c.id}" ${c.id === myClubId ? 'selected' : ''}>${c.name}</option>`).join('')}</select></label>
      <label>Fora<select id="away">${clubs.map((c, i) => `<option value="${c.id}" ${c.id !== myClubId && i === (clubs[0].id === myClubId ? 1 : 0) ? 'selected' : ''}>${c.name}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" id="ko" /> Jogo a eliminar</label>
      <button class="btn primary" id="play">Jogar</button>
    </div>
    <div id="result"></div>`;

  content.querySelector('#play')!.addEventListener('click', () => {
    const h = s.clubs.find((c) => c.id === (content.querySelector('#home') as HTMLSelectElement).value)!;
    const a = s.clubs.find((c) => c.id === (content.querySelector('#away') as HTMLSelectElement).value)!;
    if (h === a) return alert('Escolhe duas equipas diferentes.');
    const ko = (content.querySelector('#ko') as HTMLInputElement).checked;
    const hs = setupFor(s, h, myClubId);
    const as = setupFor(s, a, myClubId);
    const m = simulateMatch(hs, as, { knockout: ko });
    content.querySelector('#result')!.innerHTML =
      `<div class="coaches small muted"><span>${hs.coachName} · ${tacticsSummary(hs.tactics)}</span><span>${as.coachName} · ${tacticsSummary(as.tactics)}</span></div>` +
      resultHtml(m, h, a);
    content.querySelector('#all')?.addEventListener('change', (e) => {
      content.querySelectorAll<HTMLElement>('.ev.minor').forEach((el) => (el.style.display = (e.target as HTMLInputElement).checked ? '' : 'none'));
    });
  });
}

function resultHtml(m: MatchResult, h: Club, a: Club) {
  const t = m.team;
  const total = t[0].possession + t[1].possession || 1;
  const row = (label: string, x: number | string, y: number | string) => `<tr><td class="r">${x}</td><th class="c">${label}</th><td>${y}</td></tr>`;
  const scorers = (side: 0 | 1) =>
    m.events.filter((e) => e.type === 'golo' && e.side === side).map((e) => `${m.names[e.playerId!]} ${Math.floor(e.t / 60) + 1}'`).join(', ');
  const ratings = (side: 0 | 1, club: Club) => {
    const ids = Object.keys(m.players).filter((id) => id.startsWith(club.id) && m.players[id].rating > 0).sort((x, y) => m.players[y].rating - m.players[x].rating);
    return `<table class="tbl small"><thead><tr><th>${club.shortName}</th><th>Min</th><th>G</th><th>A</th><th>Rem</th><th>Def</th><th>Nota</th></tr></thead><tbody>${ids
      .map((id) => {
        const p = m.players[id];
        return `<tr><td>${m.names[id]}${p.red ? ' 🟥' : p.yellow ? ' 🟨' : ''}</td><td>${Math.round(p.minutes / 60)}</td><td>${p.goals || ''}</td><td>${p.assists || ''}</td><td>${p.shots || ''}</td><td>${p.saves || ''}</td><td><b>${p.rating.toFixed(1).replace('.', ',')}</b></td></tr>`;
      })
      .join('')}</tbody></table>`;
  };
  return `
    <div class="scoreboard">
      <div class="team" style="--c1:${h.colors[0]}">${h.name}</div>
      <div class="score">${m.score[0]} - ${m.score[1]}${m.penalties ? `<div class="small muted">(${m.penalties[0]}-${m.penalties[1]} g.p.)</div>` : m.extraTime ? '<div class="small muted">(a.p.)</div>' : ''}</div>
      <div class="team" style="--c1:${a.colors[0]}">${a.name}</div>
    </div>
    <div class="scorers"><span>${scorers(0)}</span><span>${scorers(1)}</span></div>
    <div class="match-grid">
      <div>
        <h3>Estatísticas</h3>
        <table class="tbl stats">
          ${row('Posse de bola', Math.round((t[0].possession / total) * 100) + '%', Math.round((t[1].possession / total) * 100) + '%')}
          ${row('Remates', t[0].shots, t[1].shots)}
          ${row('Remates à baliza', t[0].onTarget, t[1].onTarget)}
          ${row('Cantos', t[0].corners, t[1].corners)}
          ${row('Faltas', t[0].fouls, t[1].fouls)}
          ${row('Faltas 1.ª parte', t[0].foulsByPeriod[1], t[1].foulsByPeriod[1])}
          ${row('Faltas 2.ª parte', t[0].foulsByPeriod[2] + t[0].foulsByPeriod[3] + t[0].foulsByPeriod[4], t[1].foulsByPeriod[2] + t[1].foulsByPeriod[3] + t[1].foulsByPeriod[4])}
          ${row('Amarelos', t[0].yellow, t[1].yellow)}
          ${row('Vermelhos', t[0].red, t[1].red)}
        </table>
        <h3>Notas</h3>
        ${ratings(0, h)}
        ${ratings(1, a)}
      </div>
      <div>
        <h3>Relato <label class="small muted check"><input type="checkbox" id="all" /> mostrar tudo</label></h3>
        <div class="feed">${m.events
          .map((e) => `<div class="ev ${MAIN.has(e.type) ? '' : 'minor'} ${e.type === 'golo' ? 'goal' : ''}" ${MAIN.has(e.type) ? '' : 'style="display:none"'}><span class="ic">${ICON[e.type] ?? '·'}</span>${e.text}</div>`)
          .join('')}</div>
      </div>
    </div>`;
}
