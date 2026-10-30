// Navegação simples entre ecrãs
export type Screen = (root: HTMLElement) => void;

const routes = new Map<string, Screen>();
let root: HTMLElement;

export function initRouter(el: HTMLElement) {
  root = el;
}

export function register(name: string, screen: Screen) {
  routes.set(name, screen);
}

export function go(name: string) {
  const screen = routes.get(name);
  if (!screen) throw new Error(`Ecrã inexistente: ${name}`);
  root.innerHTML = '';
  screen(root);
}

// Pequeno ajudante para criar HTML
export function h(html: string): HTMLElement {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild as HTMLElement;
}
