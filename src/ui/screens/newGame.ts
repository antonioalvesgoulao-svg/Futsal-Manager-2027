import { go, h } from '../router';
import { PLACEHOLDER_CLUBS, newGame, setState } from '../../core/state';

export function newGameScreen(root: HTMLElement) {
  const el = h(`
    <div class="center">
      <form class="panel menu" id="f">
        <h2>Novo jogo</h2>
        <label>Nome do treinador<input name="name" required maxlength="40" /></label>
        <label>Nacionalidade<input name="nat" value="Portugal" required /></label>
        <label>Clube
          <select name="club">
            ${PLACEHOLDER_CLUBS.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </label>
        <p class="muted">Clubes temporários. A Liga Placard real entra na etapa 2.</p>
        <div class="row">
          <button type="button" class="btn ghost" id="back">Voltar</button>
          <button class="btn primary">Começar</button>
        </div>
      </form>
    </div>`);
  root.append(el);

  el.querySelector('#back')!.addEventListener('click', () => go('menu'));
  el.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(el as HTMLFormElement);
    setState(newGame(String(fd.get('name')).trim(), String(fd.get('nat')).trim(), String(fd.get('club'))));
    go('home');
  });
}
