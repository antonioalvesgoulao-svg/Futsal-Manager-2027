// Pavilhões e assistência, ao estilo do Football Manager: a procura depende da dimensão e
// reputação do clube, do momento (classificação e forma), do adversário, da importância do
// jogo e de um pouco de acaso; a lotação real do pavilhão é o limite.
import type { Fixture } from './season/types';
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
}

// Lotações: Wikipédia (listas de pavilhões da Liga Placard 2016/17 e 2025/26); AMCO Arena (SC Braga,
// inaugurada em 2023): 1 400, Correio do Minho; Multiusos de Famalicão: 1 200 (indicada pelo António). Interiores: João Rocha
// (Wikimedia Commons); Fidelidade, Braga, Fundão, Porto Salvo, Ferreira do Zêzere, Ponte de Sor, Vila do
// Conde, Venda Nova, Portimão, Famalicão, Torres Vedras, Gondomar e Odivelas (fotos enviadas pelo António). Os restantes são uma aproximação proporcional à lotação.
export const ARENAS: Record<string, ArenaProfile> = {
  scp: { name: 'Pavilhão João Rocha', capacity: 3000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#0a7a46', wall: '#45484d', roof: 'laje', windows: false, ceilingDark: true, upperTier: true, cube: true, floor: { court: '#1f63b5', surround: '#d3542c' } },
  slb: { name: 'Pavilhão Fidelidade', capacity: 2400, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#c8102e', wall: '#d6d8db', roof: 'treliça', windows: false, truss: '#c8102e', skylights: true, cube: true, floor: { court: '#d9c39a', surround: '#c8102e', wood: true }, fronts: { bg: '#f5f5f5', fg: '#c8102e', text: ['E PLURIBUS UNUM', 'SPORT LISBOA E BENFICA', 'FIDELIDADE'] } },
  scb: { name: 'AMCO Arena', capacity: 1400, capacityReal: true, style: 'moderno', sides: ['N', 'S'], seat: '#b3122a', wall: '#eef0f2', roof: 'treliça', windows: true, truss: '#8f979f', wallArt: true, cube: false, floor: { court: '#d2a565', surround: '#d2a565', wood: true } },
  fun: { name: 'Pavilhão Municipal do Fundão', capacity: 1056, capacityReal: true, style: 'municipal', sides: ['N', 'E'], seat: '#e4572e', wall: '#eceae4', roof: 'treliça', windows: true, truss: '#c9ced4', floor: { court: '#2f7d4f', surround: '#3a8a5c' } },
  lps: { name: 'Pavilhão dos Leões de Porto Salvo', capacity: 660, capacityReal: true, style: 'clube', sides: ['N', 'S'], seat: '#a8a29e', wall: '#f4f4f2', roof: 'treliça', windows: true, truss: '#b8bec6', benches: true, floor: { court: '#c99a5e', surround: '#c99a5e', wood: true } },
  fzz: { name: 'Pavilhão Municipal de Ferreira do Zêzere', capacity: 600, capacityReal: false, style: 'municipal', sides: ['N'], seat: '#9ca3af', wall: '#f2f0ea', roof: 'treliça', windows: true, truss: '#e3b81f', standing: true, floor: { court: '#c99a5e', surround: '#d9a520', wood: true } },
  ele: { name: 'Pavilhão Gimnodesportivo de Ponte de Sor', capacity: 720, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#1f4d3a', wall: '#ece4d6', roof: 'laje', windows: true, beams: '#c98a4a', pillars: '#b5583a', ceiling: '#f3efe7', floor: { court: '#d49a5c', surround: '#2f6db5', wood: true } },
  rav: { name: 'Pavilhão Municipal de Vila do Conde', capacity: 800, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'W'], seat: '#1f2a44', wall: '#eef0f2', roof: 'treliça', windows: true, truss: '#8a9099', cube: false, wallArt: ['#2f6b4f', '#1f4d3a', '#e5e7eb'], floor: { court: '#d9b27a', surround: '#d9b27a', wood: true } },
  uvn: { name: 'Pavilhão da Venda Nova', capacity: 500, capacityReal: false, style: 'municipal', sides: ['N', 'S', 'E'], seat: '#2b4fa8', seatMix: ['#2b4fa8', '#f5f5f5'], wall: '#f1f1ef', roof: 'treliça', windows: true, truss: '#2a3a55', skylights: true, benches: ['N'], floor: { court: '#8a4b2a', surround: '#7a3f22', wood: true } },
  por: { name: 'Pavilhão Gimnodesportivo de Portimão', capacity: 235, capacityReal: true, style: 'municipal', sides: ['N'], seat: '#f2f2f2', wall: '#f3f4f5', roof: 'laje', windows: true, beams: '#d5d8db', pillars: '#9aa1a8', ceiling: '#c9cdd1', base: 1.6, floor: { court: '#7a3f22', surround: '#7a3f22', wood: true } },
  fam: { name: 'Pavilhão Multiusos de Famalicão', capacity: 1200, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#eab308', seatMix: ['#eab308', '#dc2626', '#16a34a', '#2563eb', '#f97316'], wall: '#4f7f5a', roof: 'treliça', windows: false, truss: '#2b2f36', ceiling: '#2b2f36', banners: true, floor: { court: '#b5763e', surround: '#b5763e', wood: true } },
  tor: { name: 'Pavilhão Física de Torres Vedras', capacity: 1000, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#c8202e', wall: '#eeeeec', roof: 'abóbada', windows: true, beams: '#f5f5f4', ceiling: '#f2f2f0', base: 1.6, fronts: { bg: '#f5f5f5', fg: '#c8202e', text: ['SCU TORREENSE', 'FÍSICA', 'TORRES VEDRAS'] }, floor: { court: '#d6a066', surround: '#c0392b', wood: true } },
};

/** Campos neutros (final eight, finais, Supertaça), indicados pelo António. Gondomar: 3 005 lugares
 *  sentados com a bancada retrátil (apresentação da Câmara de Gondomar, 2018); Vila do Conde: 800
 *  (Wikipédia); Odivelas: 2 000 (indicada pelo António). */
export const NEUTRALS: ArenaProfile[] = [
  { name: 'Pavilhão Multiusos de Gondomar', capacity: 3005, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#d9dde2', wall: '#8f959c', roof: 'treliça', windows: false, truss: '#f1f3f5', skylights: true, cube: true, floor: { court: '#c99a5e', surround: '#b9bdc2', wood: true } },
  { name: 'Pavilhão Multiusos de Odivelas', capacity: 2000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#3a3f47', wall: '#eef0ea', roof: 'treliça', windows: false, truss: '#9aa1a8', upperTier: true, cube: false, fronts: { bg: '#c6d93a', fg: '#2d3a0a', text: ['MULTIUSOS DE ODIVELAS', 'FUTSAL'] }, floor: { court: '#ddc08e', surround: '#3b3f45', wood: true } },
  { name: 'Pavilhão Municipal de Desportos de Vila do Conde', capacity: 800, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#16a34a', wall: '#e9e5dc', roof: 'abóbada', windows: true },
];

/** Cada competição joga num dos campos neutros, rodando de época para época. */
export function neutralFor(comp: string, year: number): ArenaProfile {
  const k = { tacaLiga: 1, taca: 0, supertaca: 2, playoff: 0, liga: 0 }[comp] ?? 0;
  return NEUTRALS[(k + year) % NEUTRALS.length];
}

export function arenaOf(s: GameState, f: Fixture): ArenaProfile {
  if (f.neutral) return neutralFor(f.comp, s.season.year);
  const c = s.clubs.find((x) => x.id === f.home);
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
  let people: number;
  if (f.neutral) people = (demand(h.reputation) + demand(a.reputation)) * 0.75;
  else {
    people = demand(h.reputation);
    // o adversário também atrai público (os grandes enchem pavilhões fora)
    people *= 1 + Math.max(-0.1, (a.reputation - 70) / 90);
    // momento: classificação e forma
    const table = leagueTable(s.season, s.clubs.map((c) => c.id));
    const pos = table.findIndex((r) => r.club === h.id);
    if (table[0]?.p > 2 && pos >= 0) people *= pos < 3 ? 1.12 : pos >= table.length - 3 ? 0.88 : 1;
    people *= 1 + form(s, h.id) * 0.035;
  }
  // importância do jogo
  if (f.comp === 'playoff') people *= /Final/.test(f.stage) ? 1.6 : /Meias/.test(f.stage) ? 1.35 : 1.2;
  else if (f.comp === 'taca' || f.comp === 'tacaLiga') people *= /Final/.test(f.stage) ? 1.7 : /Meias/.test(f.stage) ? 1.35 : 0.9;
  else if (f.comp === 'supertaca') people *= 1.3;
  const derby = [f.home, f.away].sort().join('-') === 'scp-slb';
  if (derby) people *= 1.7;
  people *= 0.88 + hash(f.id) * 0.24;
  const total = Math.round(Math.min(arena.capacity, Math.max(60, people)));
  // adeptos visitantes: mais quanto maior o clube
  const away = Math.min(0.3, 0.04 + Math.max(0, a.reputation - 58) / 160);
  const shares: [number, number] = f.neutral ? [0.45, 0.4] : [Math.max(0.5, 0.85 - away), away];
  return { arena, total, shares };
}
