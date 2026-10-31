// Equipamentos de cada clube: principal e alternativo (camisola, calções, meias, padrão).
// confirmed=false: cores por confirmar com o António (não encontradas em fontes públicas acessíveis).
export type KitPattern = 'liso' | 'listas' | 'riscas' | 'metade'; // listas = horizontais; riscas = verticais
export interface KitDef { shirt: string; shorts: string; socks: string; pattern: KitPattern; alt: string } // alt = 2.ª cor do padrão
export interface ClubKits { home: KitDef; away: KitDef; confirmed: boolean }

const k = (shirt: string, shorts: string, socks: string, pattern: KitPattern = 'liso', alt = '#ffffff'): KitDef => ({ shirt, shorts, socks, pattern, alt });

export const KITS: Record<string, ClubKits> = {
  scp: { home: k('#00804a', '#111111', '#00804a', 'listas', '#ffffff'), away: k('#ccaa6b', '#ccab6a', '#ccab6a', 'liso', '#ffffff'), confirmed: true },
  slb: { home: k('#e30613', '#ffffff', '#e30613', 'liso', '#ffffff'), away: k('#ffffff', '#ff0000', '#ffffff', 'liso', '#ffffff'), confirmed: true },
  scb: { home: k('#e30613', '#ffffff', '#e30613', 'liso', '#ffffff'), away: k('#782d3b', '#792b3a', '#9e8a70', 'liso', '#ffffff'), confirmed: true },
  fun: { home: k('#582321', '#000000', '#582321', 'liso', '#ffffff'), away: k('#ffffff', '#000000', '#ffffff', 'liso', '#ffffff'), confirmed: true },
  lps: { home: k('#1b4937', '#1b4937', '#1b4937', 'liso', '#ffffff'), away: k('#ffffff', '#ffffff', '#ffffff', 'liso', '#ffffff'), confirmed: true },
  fzz: { home: k('#f2e44f', '#000000', '#000000', 'liso', '#ffffff'), away: k('#f01c35', '#f01c35', '#ffffff', 'liso', '#ffffff'), confirmed: true },
  ele: { home: k('#0b8a3e', '#000000', '#0b8a3e', 'riscas', '#ffffff'), away: k('#000000', '#000000', '#000000', 'liso', '#ffffff'), confirmed: true },
  rav: { home: k('#024b3a', '#ffffff', '#ffffff', 'riscas', '#ffffff'), away: k('#73b4d2', '#1c1f2e', '#1c1f2e', 'listas', '#1c1f2e'), confirmed: true },
  uvn: { home: k('#facc15', '#000000', '#facc15', 'liso', '#ffffff'), away: k('#facc15', '#facc15', '#facc15', 'liso', '#ffffff'), confirmed: true },
  por: { home: k('#111111', '#111111', '#ffffff', 'riscas', '#ffffff'), away: k('#facc15', '#facc15', '#facc15', 'liso', '#ffffff'), confirmed: true },
  fam: { home: k('#ffffff', '#ffffff', '#ffffff', 'metade', '#18214e'), away: k('#cee5d4', '#cee5d4', '#cee5d4', 'liso', '#ffffff'), confirmed: true },
  tor: { home: k('#881732', '#34497e', '#881732', 'metade', '#34497e'), away: k('#cbd9e6', '#cbd9e6', '#cbd9e6', 'riscas', '#d6e0ea'), confirmed: true },
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
