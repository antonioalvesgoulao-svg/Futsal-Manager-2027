// Equipamentos de cada clube: principal e alternativo (camisola, calções, meias, padrão).
// confirmed=false: cores por confirmar com o António (não encontradas em fontes públicas acessíveis).
// listas = horizontais; riscas = verticais; finas = riscas finas; faixa = diagonal do ombro à anca; banda = horizontal no peito;
// ombros = parte de cima noutra cor; laterais = painéis dos lados; centro = risca larga ao meio; xadrez; degrade = cor que muda para baixo
// chevron = riscas que fecham em V ao centro do peito; salpicos = manchas de tinta na parte de baixo; diagonais = riscas finas em diagonal
export type KitPattern = 'liso' | 'listas' | 'riscas' | 'metade' | 'finas' | 'faixa' | 'banda' | 'ombros' | 'laterais' | 'centro' | 'xadrez' | 'degrade' | 'chevron' | 'salpicos' | 'diagonais';
export const KIT_PATTERNS: KitPattern[] = ['liso', 'listas', 'riscas', 'finas', 'metade', 'faixa', 'banda', 'ombros', 'laterais', 'centro', 'xadrez', 'degrade', 'chevron', 'salpicos', 'diagonais'];
/** alt = 2.ª cor do padrão; sleeves = cor das mangas (opcional, senão como a camisola); collar = cor da gola (opcional, senão a dos calções) */
/** cuffs = cor dos punhos; shortsStripe = risca lateral dos calções */
export interface KitDef { shirt: string; shorts: string; socks: string; pattern: KitPattern; alt: string; sleeves?: string; collar?: string; cuffs?: string; shortsStripe?: string }
/** goalkeeper = equipamento real do GR (camisola, calções, meias), quando conhecido */
export interface ClubKits { home: KitDef; away: KitDef; confirmed: boolean; goalkeeper?: KitDef }

const x = (base: KitDef, extra: Partial<KitDef>): KitDef => ({ ...base, ...extra });
const k = (shirt: string, shorts: string, socks: string, pattern: KitPattern = 'liso', alt = '#ffffff', sleeves?: string, collar?: string): KitDef => ({ shirt, shorts, socks, pattern, alt, ...(sleeves ? { sleeves } : {}), ...(collar ? { collar } : {}) });

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
  // França: fotos dos equipamentos 2026/27 enviadas pelo António (4/11); Sporting Club Paris = Sporting CP (indicação do António)
  lav: { home: x(k('#ffffff', '#ffffff', '#ffffff', 'centro', '#f07b1a', undefined, '#111111'), { cuffs: '#f07b1a', shortsStripe: '#f07b1a' }), away: x(k('#f07b1a', '#f07b1a', '#ffffff', 'finas', '#111111', undefined, '#111111'), { cuffs: '#111111', shortsStripe: '#ffffff' }), confirmed: true },
  spa: { home: k('#00804a', '#111111', '#00804a', 'listas', '#ffffff'), away: k('#ccaa6b', '#ccab6a', '#ccab6a', 'liso', '#ffffff'), confirmed: true },
  mon: { home: x(k('#c41e2e', '#c41e2e', '#c41e2e', 'liso', '#ffffff', undefined, '#ffffff'), { cuffs: '#ffffff', shortsStripe: '#ffffff' }), away: x(k('#075ba1', '#075ba1', '#075ba1', 'liso', '#ffffff', undefined, '#ffffff'), { cuffs: '#ffffff', shortsStripe: '#ffffff' }), confirmed: true },
  goa: { home: x(k('#161616', '#161616', '#161616', 'diagonais', '#4a3d22', undefined, '#c9a86a'), { cuffs: '#c9a86a' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'centro', '#1a1a1a', undefined, '#ffffff'), { cuffs: '#ffffff' }), confirmed: true },
  tln: { home: x(k('#161616', '#161616', '#161616', 'liso', '#c8102e', '#2a2a2a', '#161616'), { cuffs: '#c8102e' }), away: x(k('#f2f0ec', '#161616', '#f2f0ec', 'liso', '#c8102e', undefined, '#c8102e'), { cuffs: '#161616' }), confirmed: true },
  nan: { home: x(k('#1f3050', '#1f3050', '#161616', 'diagonais', '#2a4068', undefined, '#c9a54a'), { cuffs: '#c9a54a' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'diagonais', '#ecebe6', undefined, '#c9a54a'), { cuffs: '#c9a54a' }), confirmed: true },
  aca: { home: x(k('#0b7a52', '#0b7a52', '#0b7a52', 'liso', '#ffffff', undefined, '#0b7a52'), { cuffs: '#0b7a52' }), away: x(k('#d8c48c', '#ffffff', '#ffffff', 'degrade', '#f4ecd2', '#ffffff', '#ffffff'), { shortsStripe: '#161616' }), confirmed: true },
  avi: { home: x(k('#161616', '#161616', '#161616', 'liso', '#ffffff', '#ffffff', '#161616'), { shortsStripe: '#ffffff' }), away: k('#a8e6cf', '#161616', '#161616', 'liso', '#ffffff', '#ffffff', '#161616'), confirmed: true },
  ujs: { home: x(k('#d81e2a', '#d81e2a', '#d81e2a', 'diagonais', '#c81624', undefined, '#d81e2a'), { shortsStripe: '#ffffff' }), away: k('#ffffff', '#ffffff', '#ffffff', 'diagonais', '#d9d9d9', undefined, '#ffffff'), confirmed: true },
  nic: { home: x(k('#141414', '#141414', '#141414', 'centro', '#262626', undefined, '#141414'), { cuffs: '#c9a54a', shortsStripe: '#c9a54a' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'liso', '#c9a54a', undefined, '#ffffff'), { cuffs: '#c9a54a', shortsStripe: '#c9a54a' }), confirmed: true },
  gar: { home: x(k('#f21a23', '#f21a23', '#f21a23', 'riscas', '#ffffff'), { shortsStripe: '#ffffff' }), away: k('#161616', '#0a0a0a', '#0a0a0a', 'salpicos', '#2c2c2c', undefined, '#161616'), confirmed: true },
  art: { home: x(k('#3b4fd8', '#3b4fd8', '#3b4fd8', 'liso', '#ffffff', undefined, '#ffffff'), { cuffs: '#ffffff', shortsStripe: '#ffffff' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'liso', '#161616', '#ffffff', '#161616'), { cuffs: '#161616', shortsStripe: '#161616' }), confirmed: true },
  // Espanha: camisola principal tirada das fotos oficiais dos jogadores na RFEF (2026/27); calções, meias e alternativos
  // são estimativa até o António confirmar (confirmed: false)
  bar: { home: k('#a50044', '#004d98', '#004d98', 'riscas', '#004d98'), away: k('#f5e04c', '#f5e04c', '#f5e04c'), confirmed: false },
  epz: { home: k('#ffffff', '#ffffff', '#ffffff', 'liso', '#d50000'), away: k('#d50000', '#111111', '#d50000'), confirmed: false },
  pal: { home: k('#9acd32', '#6b21a8', '#9acd32', 'liso', '#6b21a8'), away: k('#6b21a8', '#6b21a8', '#6b21a8'), confirmed: false },
  jca: { home: k('#d32f2f', '#ffffff', '#d32f2f', 'liso', '#ffffff'), away: k('#111111', '#111111', '#111111'), confirmed: false },
  int: { home: k('#1f7a4a', '#1f7a4a', '#1f7a4a', 'liso', '#ffffff'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  jae: { home: k('#ffd400', '#15803d', '#ffd400', 'liso', '#15803d'), away: k('#111111', '#111111', '#111111'), confirmed: false },
  val: { home: k('#1e6fd9', '#1e6fd9', '#1e6fd9', 'liso', '#ffffff'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  man: { home: k('#8ecae6', '#1e3a8a', '#8ecae6', 'liso', '#ec4899'), away: k('#111111', '#111111', '#111111'), confirmed: false },
  zar: { home: k('#ffffff', '#ffffff', '#ffffff', 'listas', '#4fb3e8'), away: k('#d50000', '#d50000', '#d50000'), confirmed: false },
  pen: { home: k('#1e40af', '#1e40af', '#1e40af'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  par: { home: k('#1e4fd0', '#1e4fd0', '#1e4fd0'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  osa: { home: k('#15803d', '#15803d', '#15803d'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  cor: { home: k('#00843d', '#ffffff', '#00843d', 'riscas', '#ffffff'), away: k('#111111', '#111111', '#111111'), confirmed: false },
  eji: { home: k('#7cc4ec', '#1e3a8a', '#7cc4ec', 'liso', '#1e3a8a'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: false },
  noi: { home: k('#ffffff', '#ffffff', '#ffffff', 'liso', '#c9a227'), away: k('#1e3a8a', '#1e3a8a', '#1e3a8a'), confirmed: false },
  stc: { home: k('#9fd3f0', '#1e3a8a', '#9fd3f0', 'liso', '#1e3a8a'), away: k('#e30613', '#e30613', '#e30613'), confirmed: false },
  // Itália: equipamentos 2025/26 a partir das fotos e notas do António (3/11/2026); Petrarca Padova pela descrição do António (sem foto)
  cat: { home: x(k('#2f7fd0', '#2f7fd0', '#d8262d', 'riscas', '#d8262d', undefined, '#1e2a5c'), {}), away: x(k('#efe6d5', '#ffffff', '#ffffff', 'liso', '#ffffff', undefined, '#3b2a6b'), { cuffs: '#3b2a6b' }), confirmed: true },
  nap: { home: k('#1f6fd1', '#1f6fd1', '#1f6fd1', 'liso', '#ffffff', undefined, '#ffffff'), away: x(k('#ffffff', '#ffffff', '#ffffff', 'finas', '#e4e8f0', undefined, '#1d4fbf'), { shortsStripe: '#1d4fbf' }), confirmed: true },
  l84: { home: x(k('#1e9a3c', '#111111', '#111111', 'chevron', '#111111', undefined, '#111111'), { shortsStripe: '#1e9a3c' }), away: x(k('#eee9e4', '#ffffff', '#ffffff', 'liso', '#ffffff', undefined, '#7d1f2a'), { cuffs: '#7d1f2a', shortsStripe: '#7d1f2a' }), confirmed: true },
  ebo: { home: x(k('#c8102e', '#1f2a5c', '#1f2a5c', 'riscas', '#1f2a5c', '#1f2a5c', '#1f2a5c'), { cuffs: '#c8102e' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'liso', '#ffffff', undefined, '#1f2a5c'), { cuffs: '#c8102e' }), confirmed: true },
  ave: { home: k('#ffffff', '#1e7a3c', '#ffffff', 'ombros', '#1e7a3c', '#1e7a3c', '#1e7a3c'), away: k('#4fb3e3', '#ffffff', '#ffffff', 'liso', '#ffffff', '#ffffff', '#ffffff'), confirmed: true },
  tre: { home: k('#3aa6d8', '#3aa6d8', '#3aa6d8'), away: k('#1a1a1a', '#1a1a1a', '#1a1a1a'), confirmed: true },
  sal: { home: x(k('#f2e01a', '#1e8a3c', '#1e8a3c', 'diagonais', '#e6cf10', undefined, '#1e8a3c'), { cuffs: '#1e8a3c' }), away: k('#141414', '#141414', '#141414', 'liso', '#ffffff', undefined, '#ffffff'), confirmed: true },
  rom: { home: x(k('#b5121b', '#b5121b', '#b5121b', 'liso', '#f5b800', undefined, '#f5b800'), { shortsStripe: '#f5b800' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'liso', '#ffffff', '#f5b800', '#c8102e'), { shortsStripe: '#c8102e' }), confirmed: true },
  ben: { home: k('#d81e2a', '#d81e2a', '#d81e2a', 'riscas', '#f5c400'), away: k('#8fe3d0', '#8fe3d0', '#8fe3d0'), confirmed: true },
  act: { home: x(k('#141414', '#141414', '#141414', 'salpicos', '#f07b1a', undefined, '#f07b1a'), { cuffs: '#f07b1a', shortsStripe: '#f07b1a' }), away: x(k('#ffffff', '#ffffff', '#ffffff', 'salpicos', '#f07b1a', undefined, '#141414'), { cuffs: '#f07b1a', shortsStripe: '#f07b1a' }), confirmed: true },
  pom: { home: x(k('#f04a2a', '#f04a2a', '#f04a2a', 'finas', '#1f2a5c', '#1f2a5c', '#1f2a5c'), { cuffs: '#f04a2a' }), away: k('#d62a2a', '#d62a2a', '#d62a2a', 'finas', '#ffffff'), confirmed: true, goalkeeper: k('#f5d90a', '#1f2a5c', '#1f2a5c') },
  gio: { home: k('#1a8a4a', '#1a8a4a', '#1a8a4a'), away: k('#f4f1ea', '#f4f1ea', '#ffffff'), confirmed: true },
  pad: { home: k('#111111', '#111111', '#111111'), away: k('#ffffff', '#ffffff', '#ffffff'), confirmed: true },
  cpr: { home: x(k('#d7192a', '#d7192a', '#d7192a'), { cuffs: '#ffffff', shortsStripe: '#ffffff' }), away: x(k('#ffffff', '#ffffff', '#ffffff'), { cuffs: '#1f2a5c' }), confirmed: true },
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
  // se nenhum equipamento de árbitro ficar distinto das duas equipas, o visitante muda de equipamento (se puder)
  if (refGap([hk, ak]) < 160 && !(mine === 1 && choice !== 'auto')) {
    const alt = ak === A.home ? A.away : A.home;
    if (hexDist(hk.shirt, alt.shirt) >= 130 && refGap([hk, alt]) > refGap([hk, ak])) ak = alt;
  }
  // ainda sem solução: a casa muda (raro, ex.: Palma de verde-lima contra o Jaén de preto)
  if (refGap([hk, ak]) < 160 && !(mine === 0 && choice !== 'auto')) {
    const alt = hk === H.home ? H.away : H.home;
    if (hexDist(alt.shirt, ak.shirt) >= 130 && refGap([alt, ak]) > refGap([hk, ak])) hk = alt;
  }
  return [hk, ak];
}

// Equipamentos dos guarda-redes: não há dados certos por clube; cada clube tem uma cor fixa (sorteada
// a partir do clube) entre as cores habituais no futsal (indicadas pelo António).
export const GK_KITS: KitDef[] = [
  k('#f97316', '#111111', '#f97316'), // laranja, calções pretos
  k('#7dd3fc', '#7dd3fc', '#7dd3fc'), // todo azul-claro
  k('#facc15', '#facc15', '#facc15'), // todo amarelo
  k('#a3e635', '#a3e635', '#a3e635'), // todo verde fluorescente
  k('#ff6b1a', '#ff6b1a', '#ff6b1a'), // todo laranja fluorescente
];

function gkPref(id: string) {
  let h = 7;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % GK_KITS.length;
}

/** Guarda-redes do jogo: a cor do clube, mudando se chocar com as camisolas de campo ou com o outro GR. */
export function matchGkKits(homeId: string, awayId: string, kits: [KitDef, KitDef]): [KitDef, KitDef] {
  const field = [kits[0].shirt, kits[1].shirt];
  const ok = (g: KitDef, other?: KitDef) => field.every((f) => hexDist(f, g.shirt) > 110) && (!other || hexDist(other.shirt, g.shirt) > 110);
  const choose = (id: string, other?: KitDef) => {
    const real = KITS[id]?.goalkeeper; // equipamento real do GR, se não chocar
    if (real && ok(real, other)) return real;
    const p = gkPref(id);
    for (let i = 0; i < GK_KITS.length; i++) { const g = GK_KITS[(p + i) % GK_KITS.length]; if (ok(g, other)) return g; }
    for (let i = 0; i < GK_KITS.length; i++) { const g = GK_KITS[(p + i) % GK_KITS.length]; if (!other || hexDist(other.shirt, g.shirt) > 110) return g; }
    return GK_KITS[p];
  };
  const hg = choose(homeId);
  return [hg, choose(awayId, hg)];
}

/** Equipamentos dos árbitros (indicados pelo António): camisola amarela, verde fluorescente, amarela fluorescente ou
 *  toda preta, sempre com calção preto. */
export const REF_KITS = [
  { name: 'amarelo', shirt: '#facc15' },
  { name: 'verde fluorescente', shirt: '#39ff14' },
  { name: 'amarelo fluorescente', shirt: '#e6ff00' },
  { name: 'preto', shirt: '#111111' },
] as const;

/** Escolhe o equipamento dos árbitros que nunca coincide com as camisolas (e a 2.ª cor do padrão) dos jogadores de
 *  campo das duas equipas; evita também, se possível, a cor dos guarda-redes. Pela ordem da lista, o primeiro que
 *  fique bem afastado; se nenhum ficar, o mais afastado de todos. */
/** Maior distância de cor que se consegue entre os árbitros e os jogadores de campo. */
function refGap(kits: [KitDef, KitDef]) {
  const field = kits.flatMap((kd) => (kd.pattern === 'liso' ? [kd.shirt] : [kd.shirt, kd.alt]));
  return Math.max(...REF_KITS.map((r) => Math.min(999, ...field.map((x) => hexDist(r.shirt, x)))));
}

export function refKitFor(kits: [KitDef, KitDef], gkKits?: KitDef[]) {
  const field = kits.flatMap((kd) => (kd.pattern === 'liso' ? [kd.shirt] : [kd.shirt, kd.alt]));
  const gks = (gkKits ?? []).map((g) => g.shirt);
  const minD = (c: string, list: string[]) => Math.min(999, ...list.map((x) => hexDist(c, x)));
  const ok = REF_KITS.find((r) => minD(r.shirt, field) >= 160 && minD(r.shirt, gks) >= 60)
    ?? REF_KITS.find((r) => minD(r.shirt, field) >= 160)
    ?? [...REF_KITS].sort((a, b) => minD(b.shirt, field) - minD(a.shirt, field))[0];
  return { shirt: ok.shirt, shorts: '#111111', name: ok.name };
}
