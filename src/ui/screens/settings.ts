import { getApiKey, setApiKey } from '../interviewAi';
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
    <div class="card" style="margin-bottom:12px"><b>Entrevistas com IA (opcional)</b>
      <p class="small muted">Com a tua chave da API Anthropic, as respostas que escreves nas entrevistas de emprego são avaliadas pelo Claude, como uma direção a sério. A chave fica só neste browser (não vai para as gravações nem para o GitHub) e cada entrevista gasta uma pequena quantia da tua conta Anthropic. Sem chave, as respostas escritas são avaliadas por palavras-chave.</p>
      <input id="apikey" type="password" placeholder="sk-ant-..." value="${getApiKey() ? '••••••••' : ''}" style="width:260px"> <button class="btn" id="apisave">Guardar</button> <button class="btn ghost" id="apiclear">Apagar</button> <span class="small muted" id="apimsg">${getApiKey() ? 'Chave guardada.' : 'Sem chave.'}</span>
    </div>
    <div class="tac-grid">
      <label>Velocidade do jogo ao vivo
        <select data-k="speed">${opt('speed', 'lento', 'Lenta (cerca de 23 min por jogo)')}${opt('speed', 'medio', 'Média (cerca de 11 min por jogo) · recomendada')}${opt('speed', 'rapido', 'Rápida (cerca de 5 min por jogo)')}</select>
      </label>
      <label>Momentos importantes em 3D
        <select data-k="moments3d">${opt('moments3d', 'nenhum', 'Nenhum (só 2D)')}${opt('moments3d', 'golos', 'Só golos')}${opt('moments3d', 'importantes', 'Golos, grandes defesas, bolas aos postes, penáltis, livres de 10 m, expulsões')}${opt('moments3d', 'todos', 'Todas as ocasiões (inclui remates ao lado e cantos)')}</select>
        <span class="small muted">O jogo para e mostra o lance em 3D, com 4 câmaras e repetição. Fora os golos, há pelo menos 1 minuto de jogo entre momentos 3D.</span>
      </label>
      <label>Som do jogo
        <select data-k="sound">${opt('sound', 'off', 'Desligado')}${opt('sound', 'low', 'Baixo')}${opt('sound', 'mid', 'Médio')}${opt('sound', 'high', 'Alto')}</select>
        <span class="small muted">Ambiente do pavilhão, apito, buzina e bola. Sons gerados pelo jogo (sem gravações com direitos).</span>
      </label>
      <label>Qualidade gráfica do 3D
        <select data-k="quality">${opt('quality', 'normal', 'Normal (mais fluido) · recomendada')}${opt('quality', 'alta', 'Alta (reflexos no piso, sombras mais finas; precisa de um computador mais rápido)')}</select>
      </label>
      <label>Marcador eletrónico
        <select data-k="scoreboard">${opt('scoreboard', 'auto', 'O da competição do jogo')}${opt('scoreboard', 'liga', 'Liga Placard')}${opt('scoreboard', 'taca', 'Taça de Portugal')}${opt('scoreboard', 'tacaLiga', 'Taça da Liga')}${opt('scoreboard', 'supertaca', 'Supertaça')}</select>
      </label>
    </div>
    <h3>Marcadores</h3>
    <div class="sb-demo">${demo('liga')}${demo('taca')}${demo('tacaLiga')}${demo('supertaca')}</div>
    <p class="small muted">Grafismo original do jogo, de inspiração portuguesa. As definições ficam guardadas com o jogo.</p>`;
  content.querySelector('#apisave')!.addEventListener('click', () => { const v = content.querySelector<HTMLInputElement>('#apikey')!.value.trim(); if (v && !v.startsWith('•')) { setApiKey(v); content.querySelector('#apimsg')!.textContent = 'Chave guardada.'; } });
  content.querySelector('#apiclear')!.addEventListener('click', () => { setApiKey(''); content.querySelector<HTMLInputElement>('#apikey')!.value = ''; content.querySelector('#apimsg')!.textContent = 'Sem chave.'; });
  content.querySelectorAll<HTMLSelectElement>('[data-k]').forEach((el) =>
    el.addEventListener('change', () => {
      (st as unknown as Record<string, string>)[el.dataset.k!] = el.value;
    })
  );
}
