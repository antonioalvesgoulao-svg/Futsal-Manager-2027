// Equipamentos de cada clube: principal e alternativo (camisola, calções, meias, padrão).
// confirmed=false: cores por confirmar com o António (não encontradas em fontes públicas acessíveis).
export type KitPattern = 'liso' | 'listas' | 'riscas' | 'metade'; // listas = horizontais; riscas = verticais
export interface KitDef { shirt: string; shorts: string; socks: string; pattern: KitPattern; alt: string } // alt = 2.ª cor do padrão
export interface ClubKits { home: KitDef; away: KitDef; confirmed: boolean }

const k = (shirt: string, shorts: string, socks: string, pattern: KitPattern = 'liso', alt = '#ffffff'): KitDef => ({ shirt, shorts, socks, pattern, alt });

export const KITS: Record<string, ClubKits> = {
  scp: { home: k('#00804a', '#111111', '#00804a', 'listas', '#ffffff'), away: k('#111111', '#111111', '#111111'), confirmed: false },
  slb: { home: k('#e30613', '#ffffff', '#e30613'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  scb: { home: k('#d71920', '#ffffff', '#d71920'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  fun: { home: k('#1f3c88', '#ffffff', '#1f3c88'), away: k('#ffffff', '#1f3c88', '#ffffff'), confirmed: false },
  lps: { home: k('#0b7a3b', '#ffffff', '#0b7a3b'), away: k('#ffffff', '#0b7a3b', '#ffffff'), confirmed: false },
  fzz: { home: k('#1d4ed8', '#ffffff', '#1d4ed8'), away: k('#ffffff', '#1d4ed8', '#ffffff'), confirmed: false },
  ele: { home: k('#c8102e', '#ffffff', '#c8102e'), away: k('#ffffff', '#c8102e', '#ffffff'), confirmed: false },
  rav: { home: k('#00843d', '#ffffff', '#00843d', 'riscas', '#ffffff'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  uvn: { home: k('#1e3a8a', '#1e3a8a', '#facc15', 'liso'), away: k('#facc15', '#1e3a8a', '#facc15'), confirmed: false },
  por: { home: k('#111111', '#111111', '#111111', 'riscas', '#ffffff'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  fam: { home: k('#1c3f94', '#ffffff', '#1c3f94'), away: k('#ffffff', '#1c3f94', '#ffffff'), confirmed: false },
  tor: { home: k('#1f4e9c', '#ffffff', '#1f4e9c'), away: k('#ffffff', '#1f4e9c', '#ffffff'), confirmed: false },
};

export type KitChoice = 'auto' | 'home' | 'away';

/** Escolha do equipamento da equipa do jogador para o próximo jogo (definida no dia de jogo). */
export let pendingKit: KitChoice = 'auto';
export function setPendingKit(c: KitChoice) { pendingKit = c; }

function hexDist(a: string, b: string) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

export function kitsOf(id: string, fallback: [string, string]): ClubKits {
  return KITS[id] ?? { home: k(fallback[0], fallback[1], fallback[0]), away: k(fallback[1], fallback[0], fallback[1]), confirmed: false };
}

/** Equipamentos do jogo: a casa joga com o principal (salvo escolha); o visitante muda para o alternativo se as camisolas chocarem. */
export function matchKits(home: { id: string; colors: [string, string] }, away: { id: string; colors: [string, string] }, mine: 0 | 1 | null, choice: KitChoice = 'auto'): [KitDef, KitDef] {
  const H = kitsOf(home.id, home.colors), A = kitsOf(away.id, away.colors);
  let hk = mine === 0 && choice === 'away' ? H.away : H.home;
  let ak = mine === 1 && choice !== 'auto' ? (choice === 'home' ? A.home : A.away) : A.home;
  if (mine !== 1 || choice === 'auto') if (hexDist(hk.shirt, ak.shirt) < 130) ak = A.away;
  if (hexDist(hk.shirt, ak.shirt) < 130) hk = hk === H.home ? H.away : H.home; // escolha manual em choque: a casa cede
  return [hk, ak];
}
