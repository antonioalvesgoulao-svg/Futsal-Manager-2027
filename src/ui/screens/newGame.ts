import { go, h } from '../router';
import { DB_CLUBS, DB_LEAGUES, newGame, setState } from '../../core/state';

export function newGameScreen(root: HTMLElement) {
  const el = h(`
    <div class="center">
      <form class="panel menu" id="f">
        <h2>Novo jogo</h2>
        <label>Nome do treinador<input name="name" required maxlength="40" /></label>
        <label>Nacionalidade<input name="nat" value="Portugal" required /></label>
        <label>Clube
          <select name="club">
            ${DB_LEAGUES.map((l) => `<optgroup label="${l.name} (${l.country})">${DB_CLUBS.filter((c) => l.clubIds.includes(c.id)).sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option value="${c.id}">${c.name} (${c.city})</option>`).join('')}</optgroup>`).join('')}
          </select>
        </label>
        <p class="muted">Época 2026/27 · Liga Placard e Primera División</p>
        <div class="row">
          <button type="button" class="btn ghost" id="back">Voltar</button>
          <button class="btn primary">Começar</button>
        </div>
      </form>
    </div>`);
  root.append(el);

  el.querySelector('#back')!.addEventListener('click', () => go('menu'));
  const form = el.querySelector<HTMLFormElement>('#f')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    setState(newGame(String(fd.get('name')).trim(), String(fd.get('nat')).trim(), String(fd.get('club'))));
    go('home');
  });
}
