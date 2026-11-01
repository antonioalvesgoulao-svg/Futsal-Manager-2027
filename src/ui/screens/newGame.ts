import { go, h } from '../router';
import { DB_CLUBS, DB_LEAGUES, newGame, setState } from '../../core/state';
import { MANAGER_ATTRS, EXPERIENCE, type ManagerAttrs } from '../../core/manager';
import { crestSvg } from '../crest';

// Novo jogo: escolher a liga e só depois o clube; criar o treinador (experiência e atributos), como no FM
export function newGameScreen(root: HTMLElement) {
  let league = DB_LEAGUES[0].id;
  let club = '';
  let exp = 'profissional';
  const attrs: ManagerAttrs = Object.fromEntries(MANAGER_ATTRS.map((a) => [a.id, 10])) as unknown as ManagerAttrs;
  const el = h(`
    <div class="center">
      <form class="panel menu" id="f" style="width:min(760px,100%)">
        <h2>Novo jogo</h2>
        <div class="form-row"><label>Nome do treinador<input name="name" required maxlength="40" /></label>
        <label>Nacionalidade<input name="nat" value="Portugal" required /></label></div>
        <h3>1. Liga</h3><div class="seg" id="lg"></div>
        <h3>2. Clube</h3><div class="club-grid" id="cl"></div>
        <h3>3. O teu passado</h3><div class="seg" id="ex"></div><p class="small muted" id="exd"></p>
        <h3>4. Atributos do treinador <span class="small muted" id="pts"></span></h3>
        <div id="at"></div>
        <p class="muted small">Época 2026/27 · Liga Placard e Liga Prime Futsal</p>
        <div class="row">
          <button type="button" class="btn ghost" id="back">Voltar</button>
          <button class="btn primary">Começar</button>
        </div>
      </form>
    </div>`);
  root.append(el);
  const pool = () => EXPERIENCE.find((e) => e.id === exp)!.points;
  const used = () => Object.values(attrs).reduce((a, b) => a + b, 0);
  const draw = () => {
    el.querySelector('#lg')!.innerHTML = DB_LEAGUES.map((l) => `<button type="button" class="${l.id === league ? 'on' : ''}" data-lg="${l.id}">${l.name} (${l.country})</button>`).join('');
    const clubs = DB_CLUBS.filter((c) => DB_LEAGUES.find((l) => l.id === league)!.clubIds.includes(c.id)).sort((a, b) => b.reputation - a.reputation);
    el.querySelector('#cl')!.innerHTML = clubs.map((c) => `<button type="button" class="club-pick ${c.id === club ? 'on' : ''}" data-cl="${c.id}">${crestSvg(c.id, 30)}<span>${c.name}<br><span class="small muted">${c.city} · reputação ${c.reputation}</span></span></button>`).join('');
    el.querySelector('#ex')!.innerHTML = EXPERIENCE.map((e) => `<button type="button" class="${e.id === exp ? 'on' : ''}" data-ex="${e.id}">${e.label}</button>`).join('');
    el.querySelector('#exd')!.textContent = EXPERIENCE.find((e) => e.id === exp)!.desc;
    const left = pool() - used();
    el.querySelector('#pts')!.textContent = `(pontos por distribuir: ${left})`;
    el.querySelector('#at')!.innerHTML = MANAGER_ATTRS.map((a) => `<div class="attr-edit"><span title="${a.desc}">${a.label} <span class="small muted">· ${a.desc}</span></span>
      <span><button type="button" class="btn" data-dec="${a.id}">−</button> <b>${attrs[a.id]}</b> <button type="button" class="btn" data-inc="${a.id}">+</button></span></div>`).join('');
  };
  draw();
  el.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('button');
    if (!b) return;
    if (b.dataset.lg) { league = b.dataset.lg; club = ''; }
    else if (b.dataset.cl) club = b.dataset.cl;
    else if (b.dataset.ex) {
      exp = b.dataset.ex;
      // ajusta os pontos ao novo total
      while (used() > pool()) { const k = (Object.keys(attrs) as (keyof ManagerAttrs)[]).sort((x, y) => attrs[y] - attrs[x])[0]; attrs[k]--; }
    } else if (b.dataset.inc) { const k = b.dataset.inc as keyof ManagerAttrs; if (attrs[k] < 20 && used() < pool()) attrs[k]++; }
    else if (b.dataset.dec) { const k = b.dataset.dec as keyof ManagerAttrs; if (attrs[k] > 1) attrs[k]--; }
    else return;
    draw();
  });
  el.querySelector('#back')!.addEventListener('click', () => go('menu'));
  const form = el.querySelector<HTMLFormElement>('#f')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!club) { alert('Escolhe um clube.'); return; }
    const fd = new FormData(form);
    const s = newGame(String(fd.get('name')).trim(), String(fd.get('nat')).trim(), club);
    s.manager.attrs = { ...attrs };
    s.manager.experience = exp;
    const ex = EXPERIENCE.find((x) => x.id === exp)!;
    s.career = { ...(s.career ?? { offers: [], history: [] }), reputation: ex.reputation } as typeof s.career;
    setState(s);
    go('home');
  });
}
