// Jogo rápido (pedido do António): qualquer equipa contra qualquer outra, em qualquer pavilhão, sem carreira.
// Cria um estado de jogo temporário (não é gravado) e abre o jogo ao vivo (2D/3D) como num jogo oficial.
import { go, h } from '../router';
import { newGame, DB_COACHES, DB_CLUBS, DB_LEAGUES } from '../../core/state';
import { ARENAS, NEUTRALS } from '../../core/attendance';
import { leagueCompOf, type Fixture } from '../../core/season/types';
import { renderLive } from './live';
import { resultHtml } from './friendly';
import { crestSvg } from '../crest';

const LEAGUE_NAME: Record<string, string> = { por1: '🇵🇹 Liga Placard', esp1: '🇪🇸 Liga Prime Futsal', ita1: '🇮🇹 Serie A', fra1: '🇫🇷 D1 Futsal' };

export function quickScreen(root: HTMLElement) {
  const base = { clubs: DB_CLUBS, leagues: DB_LEAGUES };
  const clubs = base.clubs;
  const byLeague = (sel?: string) => base.leagues.map((l) => `<optgroup label="${LEAGUE_NAME[l.id] ?? l.name}">${l.clubIds.map((id) => clubs.find((c) => c.id === id)!).sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.name}</option>`).join('')}</optgroup>`).join('');
  const arenaGroups = base.leagues.map((l) => `<optgroup label="${LEAGUE_NAME[l.id] ?? l.name}">${l.clubIds.filter((id) => ARENAS[id]).map((id) => `<option value="${id}">${ARENAS[id].name} (${clubs.find((c) => c.id === id)!.shortName})</option>`).join('')}</optgroup>`).join('')
    + `<optgroup label="Campos neutros">${NEUTRALS.map((n) => `<option value="${n.name}">${n.name}</option>`).join('')}</optgroup>`;
  const el = h(`
    <div class="center"><div class="panel menu quick">
      <h1>⚡ Jogo rápido</h1>
      <p class="muted small">Escolhe as equipas e o pavilhão. Não fica gravado: serve para experimentar.</p>
      <div class="qk-teams">
        <label>Casa<select id="qh">${byLeague('slb')}</select></label>
        <div id="qcrest" class="qk-crests"></div>
        <label>Fora<select id="qa">${byLeague('scp')}</select></label>
      </div>
      <label>Pavilhão<select id="qar"><option value="">Pavilhão da equipa da casa</option>${arenaGroups}</select></label>
      <label>Eu controlo<select id="qme"><option value="h">A equipa da casa</option><option value="a">A equipa de fora</option><option value="n">Nenhuma (só ver)</option></select></label>
      <label class="check"><input type="checkbox" id="qko" /> A eliminar (prolongamento e penáltis)</label>
      <div class="row"><button class="btn ghost" id="qback">◂ Menu</button><button class="btn primary" id="qgo">Jogar ▸</button></div>
    </div></div>`);
  root.append(el);
  const $ = <T extends HTMLElement>(q: string) => el.querySelector(q) as T;
  const crests = () => { $('#qcrest').innerHTML = `${crestSvg($<HTMLSelectElement>('#qh').value, 44)}<b>×</b>${crestSvg($<HTMLSelectElement>('#qa').value, 44)}`; };
  crests();
  $('#qh').addEventListener('change', crests); $('#qa').addEventListener('change', crests);
  $('#qback').addEventListener('click', () => go('menu'));
  $('#qgo').addEventListener('click', () => {
    const home = $<HTMLSelectElement>('#qh').value, away = $<HTMLSelectElement>('#qa').value;
    if (home === away) return alert('Escolhe duas equipas diferentes.');
    const me = $<HTMLSelectElement>('#qme').value;
    const mine = me === 'h' ? home : me === 'a' ? away : home;
    const s = newGame('Treinador', 'Portugal', mine);
    if (me === 'n') { s.clubId = '__nenhum__'; s.coaches = DB_COACHES.map((c) => structuredClone(c)); }
    const hc = s.clubs.find((c) => c.id === home)!;
    const arenaId = $<HTMLSelectElement>('#qar').value || undefined;
    const f: Fixture = { id: `rapido-${Date.now()}`, comp: leagueCompOf(hc.league), stage: 'Jogo rápido', date: s.date, home, away, knockout: $<HTMLInputElement>('#qko').checked, neutral: !!arenaId && arenaId !== home, arenaId };
    root.innerHTML = '<div class="content" id="qlive"></div>';
    const content = root.querySelector<HTMLElement>('#qlive')!;
    renderLive(content, s, f, (m) => {
      const a = s.clubs.find((c) => c.id === away)!;
      content.innerHTML = `<div class="row" style="margin-bottom:12px"><button class="btn primary" id="again">⚡ Outro jogo rápido</button><button class="btn" id="menu">Menu</button></div>` + resultHtml(m, hc, a);
      content.querySelector('#again')!.addEventListener('click', () => go('quick'));
      content.querySelector('#menu')!.addEventListener('click', () => go('menu'));
    }, () => undefined);
  });
}
