import { go, h } from '../router';
import { importSave, listSlots, loadFromSlot, deleteSlot } from '../../core/save';
import { setState } from '../../core/state';

export function menuScreen(root: HTMLElement) {
  const slots = listSlots();
  const el = h(`
    <div class="center">
      <div class="panel menu">
        <h1>Futsal Manager <span class="accent">2027</span></h1>
        <button class="btn primary" id="new">Novo jogo</button>
        <button class="btn" id="quick">⚡ Jogo rápido</button>
        <h3>Carregar jogo</h3>
        <div class="slots">
          ${slots
            .map(
              (s) => `
            <div class="slot">
              <span>${s.label ?? `Espaço ${s.slot} · vazio`}</span>
              ${s.label ? `<button class="btn" data-load="${s.slot}">Carregar</button><button class="btn ghost" data-del="${s.slot}">Apagar</button>` : ''}
            </div>`
            )
            .join('')}
        </div>
        <label class="btn">Importar ficheiro<input type="file" accept=".json" id="imp" hidden /></label>
        <p class="muted">Versão 0.1 · Etapa 1</p>
      </div>
    </div>`);
  root.append(el);

  el.querySelector('#new')!.addEventListener('click', () => go('newGame'));
  el.querySelector('#quick')!.addEventListener('click', () => go('quick'));
  el.querySelectorAll<HTMLButtonElement>('[data-load]').forEach((b) =>
    b.addEventListener('click', () => {
      const s = loadFromSlot(Number(b.dataset.load));
      if (s) {
        setState(s);
        go('home');
      } else alert('Não foi possível carregar este jogo.');
    })
  );
  el.querySelectorAll<HTMLButtonElement>('[data-del]').forEach((b) =>
    b.addEventListener('click', () => {
      if (confirm('Apagar este jogo gravado?')) {
        deleteSlot(Number(b.dataset.del));
        go('menu');
      }
    })
  );
  el.querySelector<HTMLInputElement>('#imp')!.addEventListener('change', async (e) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    try {
      setState(await importSave(f));
      go('home');
    } catch (err) {
      alert((err as Error).message);
    }
  });
}
