// Definições do jogo ao vivo e da transmissão
import type { GameState, Settings } from '../../core/types';
import { scoreboardHtml } from '../broadcast';
import { settingsOf } from './live';

export function renderSettings(content: HTMLElement, s: GameState) {
  const st = settingsOf(s);
  const opt = <K extends keyof Settings>(k: K, v: string, l: string) => `<option value="${v}" ${st[k] === v ? 'selected' : ''}>${l}</option>`;
  const demo = (style: 'liga' | 'taca' | 'tacaLiga' | 'supertaca') =>
    scoreboardHtml({ style, home: { short: 'SLB', color: '#e30613', score: 3, fouls: 2 }, away: { short: 'SCP', color: '#00804a', score: 3, fouls: 5 }, clock: '09:03', period: '2.ª P' });
  content.innerHTML = `
    <h2>Definições</h2>
    <div class="tac-grid">
      <label>Velocidade do jogo ao vivo
        <select data-k="speed">${opt('speed', 'lento', 'Lenta (15 s por minuto de jogo, cerca de 10 min por jogo)')}${opt('speed', 'medio', 'Média (7,5 s por minuto, cerca de 5 min) · recomendada')}${opt('speed', 'rapido', 'Rápida (3 s por minuto, cerca de 2 min)')}</select>
      </label>
      <label>Momentos importantes em 3D
        <select data-k="moments3d">${opt('moments3d', 'nenhum', 'Nenhum (só 2D)')}${opt('moments3d', 'golos', 'Só golos')}${opt('moments3d', 'importantes', 'Golos, grandes defesas, bolas aos postes, penáltis, livres de 10 m, expulsões')}${opt('moments3d', 'todos', 'Todas as ocasiões (inclui remates ao lado e cantos)')}</select>
        <span class="small muted">O jogo para e mostra o lance em 3D, com 4 câmaras e repetição. Fora os golos, há pelo menos 1 minuto de jogo entre momentos 3D.</span>
      </label>
      <label>Marcador eletrónico
        <select data-k="scoreboard">${opt('scoreboard', 'auto', 'O da competição do jogo')}${opt('scoreboard', 'liga', 'Liga Placard')}${opt('scoreboard', 'taca', 'Taça de Portugal')}${opt('scoreboard', 'tacaLiga', 'Taça da Liga')}${opt('scoreboard', 'supertaca', 'Supertaça')}</select>
      </label>
    </div>
    <h3>Marcadores</h3>
    <div class="sb-demo">${demo('liga')}${demo('taca')}${demo('tacaLiga')}${demo('supertaca')}</div>
    <p class="small muted">Grafismo original do jogo, de inspiração portuguesa. As definições ficam guardadas com o jogo.</p>`;
  content.querySelectorAll<HTMLSelectElement>('[data-k]').forEach((el) =>
    el.addEventListener('change', () => {
      (st as unknown as Record<string, string>)[el.dataset.k!] = el.value;
    })
  );
}
