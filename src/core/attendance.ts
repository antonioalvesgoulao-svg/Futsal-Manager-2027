// Pavilhões e assistência, ao estilo do Football Manager: a procura depende da dimensão e
// reputação do clube, do momento (classificação e forma), do adversário, da importância do
// jogo e de um pouco de acaso; a lotação real do pavilhão é o limite.
import { leagueCompOf, type Fixture } from './season/types';
import { leagueTable } from './season/season';
import type { GameState } from './types';

export type ArenaStyle = 'moderno' | 'universitario' | 'municipal' | 'clube';

export interface ArenaProfile {
  name: string;
  capacity: number;
  capacityReal: boolean; // true = lotação de fonte pública; false = estimativa
  style: ArenaStyle;
  sides: ('N' | 'S' | 'E' | 'W')[]; // lados com bancada (N/S = laterais, E/W = topos)
  seat: string; // cor das cadeiras
  wall: string;
  roof: 'treliça' | 'abóbada' | 'laje';
  windows: boolean;
  // pormenores vistos em fotos do interior
  floor?: { court: string; surround: string; area?: string; wood?: boolean };
  truss?: string; // cor da estrutura metálica do teto
  ceilingDark?: boolean; // teto escuro com grelha de luz LED
  upperTier?: boolean; // segundo anel, com camarotes envidraçados
  benches?: boolean | ('N' | 'S' | 'E' | 'W')[]; // bancadas de cimento, sem cadeiras (todas ou só alguns lados)
  standing?: boolean; // adeptos em pé junto à grade
  skylights?: boolean; // claraboias no teto
  wallArt?: boolean | string[]; // desenhos de linhas na parede do topo (cores)
  fronts?: { bg: string; fg: string; text: string[] }; // frases nos muros das bancadas
  cube?: boolean; // ecrã suspenso ao centro
  seatMix?: string[]; // cadeiras de várias cores
  beams?: string; // vigas grossas no teto (madeira ou betão)
  pillars?: string; // pilares ao longo das paredes
  ceiling?: string; // cor do teto
  base?: number; // altura da primeira fila (bancada elevada)
  banners?: boolean; // grandes painéis publicitários nas paredes
  structure?: 'arcos' | 'malha' | 'cupula' | 'trelicas' | 'vigas' | 'led' | 'liso'; // estrutura do teto
  // forma das bancadas (vista nas fotos)
  corners?: boolean; // cantos fechados: as bancadas ligam-se em curva (bacia), sem espaços entre elas
  tierGap?: 'camarotes' | 'corredor'; // entre o 1.º e o 2.º anel: camarotes envidraçados ou só um corredor
  tierAds?: boolean; // placas LED de publicidade na frente do 2.º anel
  overhang?: boolean; // o 2.º anel avança por cima das últimas filas do 1.º (o 1.º anel "entra" debaixo do 2.º)
  tierSplit?: number; // fração das filas no 1.º anel (0,55 por omissão)
  lowerBenches?: boolean; // 1.º anel em degraus de cimento sem cadeiras, 2.º anel com cadeiras
  aisles?: number; // escadas: um corredor a cada N lugares
  rake?: number; // subida por fila (m), 0,42 por omissão; bancadas mais íngremes > 0,42
  seatText?: { side: 'N' | 'S' | 'E' | 'W'; text: string; color: string }; // letras desenhadas com cadeiras de outra cor
}

// Lotações: Wikipédia (listas de pavilhões da Liga Placard 2016/17 e 2025/26); AMCO Arena (SC Braga,
// inaugurada em 2023): 1 400, Correio do Minho; Multiusos de Famalicão 1 200, Venda Nova 1 800 e
// Ferreira do Zêzere 700 (indicadas pelo António). Interiores: João Rocha
// (Wikimedia Commons); Fidelidade, Braga, Fundão, Porto Salvo, Ferreira do Zêzere, Ponte de Sor, Vila do
// Conde, Venda Nova, Portimão, Famalicão, Torres Vedras, Gondomar e Odivelas (fotos enviadas pelo António). Os restantes são uma aproximação proporcional à lotação.
export const ARENAS: Record<string, ArenaProfile> = {
  scp: { name: 'Pavilhão João Rocha', capacity: 3000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#0a7a46', wall: '#45484d', roof: 'laje', windows: false, ceilingDark: true, upperTier: true, cube: true, floor: { court: '#1f63b5', surround: '#d3542c' } , corners: true, rake: 0.5 },
  slb: { name: 'Pavilhão Fidelidade', capacity: 2400, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#c8102e', wall: '#d6d8db', roof: 'treliça', windows: false, truss: '#c8102e', structure: 'arcos', ceiling: '#b9bec4', skylights: true, cube: true, floor: { court: '#d9c39a', surround: '#c8102e', wood: true }, fronts: { bg: '#f5f5f5', fg: '#c8102e', text: ['E PLURIBUS UNUM', 'SPORT LISBOA E BENFICA', 'FIDELIDADE'] } , aisles: 14, rake: 0.46 },
  scb: { name: 'AMCO Arena', capacity: 1400, capacityReal: true, style: 'moderno', sides: ['N', 'S'], seat: '#b3122a', wall: '#eef0f2', roof: 'treliça', windows: true, truss: '#8f979f', wallArt: true, cube: false, floor: { court: '#d2a565', surround: '#d2a565', wood: true } , aisles: 20 },
  fun: { name: 'Pavilhão Municipal do Fundão', capacity: 1056, capacityReal: true, style: 'municipal', sides: ['N', 'E'], seat: '#e4572e', wall: '#eceae4', roof: 'treliça', windows: true, truss: '#c9ced4', floor: { court: '#2f7d4f', surround: '#3a8a5c' } },
  lps: { name: 'Pavilhão dos Leões de Porto Salvo', capacity: 660, capacityReal: true, style: 'clube', sides: ['N', 'S'], seat: '#a8a29e', wall: '#f4f4f2', roof: 'treliça', windows: true, truss: '#b8bec6', benches: true, floor: { court: '#c99a5e', surround: '#c99a5e', wood: true } },
  fzz: { name: 'Pavilhão Municipal de Ferreira do Zêzere', capacity: 700, capacityReal: true, style: 'municipal', sides: ['N'], seat: '#9ca3af', wall: '#f2f0ea', roof: 'treliça', windows: true, truss: '#e3b81f', standing: true, floor: { court: '#c99a5e', surround: '#d9a520', wood: true } },
  ele: { name: 'Pavilhão Gimnodesportivo de Ponte de Sor', capacity: 720, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#1f4d3a', wall: '#ece4d6', roof: 'laje', windows: true, beams: '#c98a4a', pillars: '#b5583a', ceiling: '#f3efe7', floor: { court: '#d49a5c', surround: '#2f6db5', wood: true } , aisles: 12 },
  rav: { name: 'Pavilhão Municipal de Vila do Conde', capacity: 800, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'W'], seat: '#1f2a44', wall: '#eef0f2', roof: 'treliça', windows: true, truss: '#8a9099', structure: 'malha', ceiling: '#d5d9dd', cube: false, wallArt: ['#2f6b4f', '#1f4d3a', '#e5e7eb'], floor: { court: '#d9b27a', surround: '#d9b27a', wood: true } , aisles: 12, corners: true },
  uvn: { name: 'Pavilhão da Venda Nova', capacity: 1800, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E'], seat: '#2b4fa8', seatMix: ['#2b4fa8', '#f5f5f5'], wall: '#f1f1ef', roof: 'treliça', windows: true, truss: '#2a3a55', skylights: true, benches: ['N'], floor: { court: '#8a4b2a', surround: '#7a3f22', wood: true } , aisles: 14 },
  por: { name: 'Pavilhão Gimnodesportivo de Portimão', capacity: 235, capacityReal: true, style: 'municipal', sides: ['N'], seat: '#f2f2f2', wall: '#f3f4f5', roof: 'laje', windows: true, beams: '#d5d8db', pillars: '#9aa1a8', ceiling: '#c9cdd1', base: 1.6, floor: { court: '#7a3f22', surround: '#7a3f22', wood: true } , aisles: 10 },
  fam: { name: 'Pavilhão Multiusos de Famalicão', capacity: 1200, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#eab308', seatMix: ['#eab308', '#dc2626', '#16a34a', '#2563eb', '#f97316'], wall: '#4f7f5a', roof: 'treliça', windows: false, truss: '#2b2f36', ceiling: '#2b2f36', banners: true, floor: { court: '#b5763e', surround: '#b5763e', wood: true } , aisles: 12 },
  tor: { name: 'Pavilhão Física de Torres Vedras', capacity: 1000, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#c8202e', wall: '#eeeeec', roof: 'abóbada', windows: true, truss: '#f5f5f4', structure: 'arcos', ceiling: '#f2f2f0', base: 1.6, fronts: { bg: '#f5f5f5', fg: '#c8202e', text: ['SCU TORREENSE', 'FÍSICA', 'TORRES VEDRAS'] }, floor: { court: '#d6a066', surround: '#c0392b', wood: true } , aisles: 12 },
};

// Espanha: lotações oficiais da RFEF (futsal.rfef.es, ficha de cada clube, 2/11/2026) e interiores a partir das fotos da RFEF.
const ES_COURT = { court: '#2f8fd6', surround: '#1d3f8f' }; // piso azul das transmissões da Liga Prime
export const ARENAS_ESP: Record<string, ArenaProfile> = {
  bar: { name: 'Palau Blaugrana', capacity: 7585, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#1d4fb8', wall: '#1b2633', roof: 'treliça', windows: false, ceilingDark: true, upperTier: true, cube: true, structure: 'malha', truss: '#28485e', ceiling: '#1d3a4d', floor: ES_COURT, fronts: { bg: '#a50044', fg: '#ffffff', text: ['FCB', 'PALAU BLAUGRANA'] } , corners: true, tierGap: 'corredor', tierAds: true, overhang: true, tierSplit: 0.5, rake: 0.48, aisles: 16, seatText: { side: 'N', text: 'F C B', color: '#f2c21b' } },
  epz: { name: 'Palacio de Deportes de Murcia', capacity: 7500, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#b9161d', seatMix: ['#b9161d', '#d1d5db'], wall: '#7a4a3a', roof: 'treliça', windows: false, upperTier: true, cube: true, truss: '#c9ced4', ceiling: '#3b3f45', floor: { court: '#2563d6', surround: '#2563d6' }, banners: true , corners: true, rake: 0.5, aisles: 16 },
  pal: { name: "Palau Municipal d'Esports de Son Moix", capacity: 3800, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#1e4f8c', seatMix: ['#1e4f8c', '#f5f5f5'], wall: '#3a4048', roof: 'laje', windows: false, beams: '#6b4a32', ceiling: '#2a2e33', upperTier: true, skylights: true, cube: true, floor: { court: '#3aa6dd', surround: '#1d3f8f' } , corners: true, aisles: 12, rake: 0.46 },
  jca: { name: 'Palacio de los Deportes de Cartagena', capacity: 4817, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#d32f2f', seatMix: ['#d32f2f', '#c9a36b'], wall: '#e9e6e1', roof: 'abóbada', windows: true, structure: 'arcos', truss: '#7a5a3a', beams: '#7a5a3a', ceiling: '#5c5f63', floor: ES_COURT, wallArt: ['#c62828', '#1e2b3a'] , corners: true, aisles: 14 },
  int: { name: 'Pabellón Jorge Garbajosa', capacity: 3200, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E', 'W'], seat: '#9aa1a8', wall: '#b5654a', roof: 'treliça', windows: false, truss: '#c62828', structure: 'trelicas', ceiling: '#e5e7eb', benches: true, floor: ES_COURT , aisles: 10, rake: 0.45 },
  jae: { name: 'Olivo Arena', capacity: 6589, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#8a9096', seatMix: ['#8a9096', '#d4b106', '#2e7d32', '#1f2329'], wall: '#2b2f36', roof: 'treliça', windows: false, ceilingDark: true, truss: '#1f2329', upperTier: true, cube: true, floor: ES_COURT , corners: true, tierGap: 'corredor', tierSplit: 0.5, aisles: 14, rake: 0.46 },
  val: { name: 'Pabellón Virgen de la Cabeza', capacity: 2000, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E', 'W'], seat: '#1e4fb0', wall: '#eef0f2', roof: 'treliça', windows: true, truss: '#d9dde2', structure: 'trelicas', ceiling: '#f3f4f6', skylights: true, floor: { court: '#3aa6dd', surround: '#e2513a' } , aisles: 12 },
  man: { name: 'Manzanares Arena', capacity: 1800, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#e53935', seatMix: ['#e53935', '#fbc02d', '#2e7d32', '#1e4fb0', '#f5f5f5'], wall: '#f2f2f0', roof: 'treliça', windows: true, truss: '#e5e7eb', structure: 'trelicas', ceiling: '#f5f5f4', floor: { court: '#9a5a35', surround: '#9a5a35', wood: true } , aisles: 20 },
  zar: { name: 'CDM Siglo XXI', capacity: 2900, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E'], seat: '#9aa1a8', wall: '#d8c6a6', roof: 'treliça', windows: false, truss: '#8f979f', ceiling: '#6b6f75', benches: true, banners: true, floor: { court: '#2245a8', surround: '#d84a2a' } , rake: 0.5, aisles: 14 },
  pen: { name: 'Pabellón Juan Vizcarro', capacity: 1000, capacityReal: true, style: 'municipal', sides: ['N'], seat: '#9ca3af', wall: '#cfd8e6', roof: 'treliça', windows: true, truss: '#e5e7eb', ceiling: '#eceae4', standing: true, benches: true, floor: { court: '#d9a066', surround: '#d9a066', wood: true } },
  par: { name: 'Polideportivo de A Malata', capacity: 4200, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E', 'W'], seat: '#2f7fd1', wall: '#e5e2da', roof: 'laje', windows: true, ceiling: '#5a6f8f', floor: { court: '#8e9599', surround: '#c62828' }, fronts: { bg: '#2f7fd1', fg: '#ffffff', text: ['FERROL'] } , corners: true, upperTier: true, tierGap: 'corredor', lowerBenches: true, tierSplit: 0.35, seatText: { side: 'N', text: 'FERROL', color: '#ffffff' } },
  osa: { name: 'Pabellón Anaitasuna', capacity: 3000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#1e88c8', seatMix: ['#1e88c8', '#f59e0b'], wall: '#2b3a4a', roof: 'treliça', windows: false, truss: '#2b3a4a', ceilingDark: true, floor: { court: '#f2f4f7', surround: '#2e7d32' } , corners: true, rake: 0.5, aisles: 12 },
  cor: { name: 'Palacio Municipal de Deportes Vista Alegre', capacity: 3500, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E', 'W'], seat: '#9aa1a8', wall: '#e6e3dc', roof: 'treliça', windows: true, truss: '#d9dde2', structure: 'trelicas', ceiling: '#f2f2f0', floor: { court: '#2f6fd1', surround: '#d84a2a' }, banners: true , corners: true, aisles: 14 },
  eji: { name: 'Pabellón Municipal de Deportes de El Ejido', capacity: 2000, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#4b5563', wall: '#e8c547', roof: 'treliça', windows: true, beams: '#b5763e', truss: '#b5763e', ceiling: '#e7dcc6', floor: { court: '#d6aa74', surround: '#d6aa74', wood: true } },
  noi: { name: 'Pabellón Municipal Agustín Mourís', capacity: 776, capacityReal: true, style: 'clube', sides: ['N', 'S'], seat: '#e5e7eb', seatMix: ['#e5e7eb', '#1e4fb0'], wall: '#f1f1ef', roof: 'treliça', windows: true, truss: '#9aa1a8', banners: true, floor: { court: '#d9a85e', surround: '#d9a85e', wood: true } },
  stc: { name: 'Pabellón Nuevo de Santa Coloma', capacity: 1500, capacityReal: true, style: 'moderno', sides: ['N', 'S'], seat: '#d1d5db', seatMix: ['#d1d5db', '#c62828'], wall: '#2b2f36', roof: 'treliça', windows: true, truss: '#e5e7eb', structure: 'trelicas', ceiling: '#f5f5f4', floor: { court: '#dcb27c', surround: '#dcb27c', area: '#e53935', wood: true } },
};
Object.assign(ARENAS, ARENAS_ESP);

/** Campos neutros (final eight, finais, Supertaça), indicados pelo António. Gondomar: 3 005 lugares
 *  sentados com a bancada retrátil (apresentação da Câmara de Gondomar, 2018); Vila do Conde: 800
 *  (Wikipédia); Odivelas: 2 000 (indicada pelo António). */
export const NEUTRALS: ArenaProfile[] = [
  { name: 'Pavilhão Multiusos de Gondomar', capacity: 3005, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], aisles: 14, seat: '#d9dde2', wall: '#8f959c', roof: 'treliça', windows: false, truss: '#f1f3f5', structure: 'cupula', ceiling: '#c3c8ce', skylights: true, cube: true, floor: { court: '#c99a5e', surround: '#b9bdc2', wood: true } },
  { name: 'Pavilhão Multiusos de Odivelas', capacity: 2000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], corners: true, tierGap: 'corredor', tierSplit: 0.6, aisles: 12, seat: '#3a3f47', wall: '#eef0ea', roof: 'treliça', windows: false, truss: '#9aa1a8', upperTier: true, cube: false, fronts: { bg: '#c6d93a', fg: '#2d3a0a', text: ['MULTIUSOS DE ODIVELAS', 'FUTSAL'] }, floor: { court: '#ddc08e', surround: '#3b3f45', wood: true } },
  { name: 'Pavilhão Municipal de Desportos de Vila do Conde', capacity: 800, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#16a34a', wall: '#e9e5dc', roof: 'abóbada', windows: true },
];

/** Cada competição joga num dos campos neutros, rodando de época para época. */
/** Pavilhão espanhol ou italiano a partir dos dados do clube (aproximação: sem fotos do interior ainda). */
function spanishArena(c: { arena: string; capacity?: number; capacityReal?: boolean; colors: [string, string] }): ArenaProfile {
  const cap = c.capacity ?? 1500;
  const big = cap >= 3000;
  return { name: c.arena, capacity: cap, capacityReal: !!c.capacityReal, style: big ? 'moderno' : 'municipal', sides: cap >= 2500 ? ['N', 'S', 'E', 'W'] : cap >= 1300 ? ['N', 'S'] : ['N'], seat: c.colors[0] === '#ffffff' ? c.colors[1] : c.colors[0], wall: big ? '#3f444b' : '#eeeeec', roof: 'treliça', windows: !big, truss: '#9aa1a8', upperTier: cap >= 6000, cube: big, floor: { court: '#2f64b0', surround: '#d9d9d9' } };
}

export function neutralFor(comp: string, year: number): ArenaProfile {
  const k = { tacaLiga: 1, taca: 0, supertaca: 2, playoff: 0, liga: 0 }[comp] ?? 0;
  return NEUTRALS[(k + year) % NEUTRALS.length];
}

export function arenaOf(s: GameState, f: Fixture): ArenaProfile {
  const c = s.clubs.find((x) => x.id === f.home);
  if (c?.league === 'esp1' || c?.league === 'ita1') {
    if (!f.neutral) return ARENAS[c.id] ?? spanishArena(c);
    // campo neutro em Espanha/Itália: um dos grandes pavilhões, que não seja de quem joga, rodando por época (estimativa)
    const big = c.league === 'esp1' ? 4500 : 2500;
    const hosts = s.clubs.filter((x) => x.league === c.league && (x.capacity ?? 0) >= big && x.id !== f.home && x.id !== f.away);
    const comps = ['superEsp', 'copaEsp', 'copaRey', 'superIta', 'coppaIta'];
    const host = hosts[(comps.indexOf(f.comp) + s.season.year) % hosts.length] ?? c;
    return ARENAS[host.id] ?? spanishArena(host);
  }
  if (f.neutral) return neutralFor(f.comp, s.season.year);
  return ARENAS[f.home] ?? { ...ARENAS.fun, name: c?.arena ?? 'Pavilhão', capacity: 800, capacityReal: false };
}

export interface Crowd {
  arena: ArenaProfile;
  total: number;
  shares: [number, number]; // fração de adeptos de cada equipa (o resto é neutro)
}

function hash(s: string) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}

/** Forma recente (últimos 5 jogos): +1 vitória, -1 derrota. */
function form(s: GameState, club: string) {
  const played = s.season.fixtures.filter((f) => f.result && (f.home === club || f.away === club)).slice(-5);
  let v = 0;
  for (const f of played) {
    const [h, a] = f.result!.pens ?? f.result!.score;
    const mine = f.home === club ? h - a : a - h;
    v += mine > 0 ? 1 : mine < 0 ? -1 : 0;
  }
  return v;
}

/** Procura base (espetadores num jogo normal) a partir da reputação: estimativa calibrada para a Liga Placard. */
const demand = (rep: number) => 120 + Math.pow(Math.max(0, rep - 50) / 46, 2) * 1700;

export function attendance(s: GameState, f: Fixture): Crowd {
  const arena = arenaOf(s, f);
  const h = s.clubs.find((c) => c.id === f.home)!;
  const a = s.clubs.find((c) => c.id === f.away)!;
  // Espanha enche mais os pavilhões do que Portugal (estimativa ×1,5 na procura)
  const country = h.league === 'esp1' ? 1.5 : h.league === 'ita1' ? 1.2 : 1; // Itália: estimativa
  let people: number;
  if (f.neutral) people = (demand(h.reputation) + demand(a.reputation)) * 0.75;
  else {
    people = demand(h.reputation);
    // o adversário também atrai público (os grandes enchem pavilhões fora)
    people *= 1 + Math.max(-0.1, (a.reputation - 70) / 90);
    // momento: classificação e forma
    const lg = s.leagues.find((l) => l.clubIds.includes(h.id));
    const table = leagueTable(s.season, lg?.clubIds ?? [], 99, leagueCompOf(h.league));
    const pos = table.findIndex((r) => r.club === h.id);
    if (table[0]?.p > 2 && pos >= 0) people *= pos < 3 ? 1.12 : pos >= table.length - 3 ? 0.88 : 1;
    people *= 1 + form(s, h.id) * 0.035;
  }
  // importância do jogo
  people *= country;
  if (f.comp === 'playoff' || f.comp === 'espPlayoff' || f.comp === 'itaPlayoff') people *= /Final/.test(f.stage) ? 1.6 : /Meias/.test(f.stage) ? 1.35 : 1.2;
  else if (f.comp === 'taca' || f.comp === 'tacaLiga' || f.comp === 'copaRey' || f.comp === 'copaEsp' || f.comp === 'coppaIta') people *= /Final/.test(f.stage) ? 1.7 : /Meias/.test(f.stage) ? 1.35 : 0.9;
  else if (f.comp === 'supertaca' || f.comp === 'superEsp' || f.comp === 'superIta') people *= 1.3;
  const derby = [f.home, f.away].sort().join('-') === 'scp-slb';
  if (derby) people *= 1.7;
  people *= 0.88 + hash(f.id) * 0.24;
  const total = Math.round(Math.min(arena.capacity, Math.max(60, people)));
  // adeptos visitantes: mais quanto maior o clube
  const away = Math.min(0.3, 0.04 + Math.max(0, a.reputation - 58) / 160);
  const shares: [number, number] = f.neutral ? [0.45, 0.4] : [Math.max(0.5, 0.85 - away), away];
  return { arena, total, shares };
}
