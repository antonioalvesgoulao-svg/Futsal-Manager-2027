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
  topGallery?: string; // galeria envidraçada e iluminada à volta da sala, no topo das bancadas (cor da luz)
  oval?: number; // planta oval: cantos em arco largo (m a mais no raio; as bancadas retas encurtam 2× isto)
  corners?: boolean; // cantos fechados: as bancadas ligam-se em curva (bacia), sem espaços entre elas
  tierGap?: 'camarotes' | 'corredor'; // entre o 1.º e o 2.º anel: camarotes envidraçados ou só um corredor
  tierAds?: boolean; // placas LED de publicidade na frente do 2.º anel
  overhang?: boolean; // o 2.º anel avança por cima das últimas filas do 1.º (o 1.º anel "entra" debaixo do 2.º)
  tierSplit?: number; // fração das filas no 1.º anel (0,55 por omissão)
  lowerBenches?: boolean; // 1.º anel em degraus de cimento sem cadeiras, 2.º anel com cadeiras
  aisles?: number; // escadas: um corredor a cada N lugares
  rake?: number; // subida por fila (m), 0,42 por omissão; bancadas mais íngremes > 0,42
  seatText?: { side: 'N' | 'S' | 'E' | 'W'; text: string; color: string }; // letras desenhadas com cadeiras de outra cor
  vomitories?: number;
  vomZones?: { sides: ('N' | 'S' | 'E' | 'W')[]; n: number; ring?: 'lower' | 'upper'; at?: number }[]; // entradas de setor por lado e anel (no 1.º anel: nas últimas filas; no 2.º: logo acima do corredor)
  vomColor?: string; // cor das paredes das entradas de setor
  seatZones?: { sides?: ('N' | 'S' | 'E' | 'W' | 'C')[]; ring?: 'lower' | 'upper'; rows?: [number, number]; ends?: number; middle?: number; colors: string[] }[]; // ends = só as pontas (fração do comprimento); middle = só o meio
  stairColor?: string;
  stepZones?: { sides?: ('N' | 'S' | 'E' | 'W')[]; ring?: 'lower' | 'upper'; colors: string[] }[]; // cor dos degraus de cimento por lado/anel (alternadas a cada stepBand filas)
  stepBand?: number; // cor dos degraus das escadas // cores das cadeiras por lado/anel/filas (frações 0-1); C = cantos // entradas de setor (vomitórios) em cada lateral (metade nos topos)
  noBand?: boolean; // sem a faixa com a cor do clube a meia altura das paredes (não existe nas fotos)
  rails?: string; // corrimãos metálicos ao longo das escadas e na frente das bancadas (cor)
  roofGap?: number; // espaço (m) entre a última fila e o teto (6 por omissão; bancadas quase até ao teto: ~2)
  track?: number; // pista de atletismo à volta da quadra: largura (m) que afasta as bancadas
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

// Itália: interiores a partir das fotos enviadas pelo António (3/11/2026); lotações em src/data/ita/clubs.json.
// Onde a foto não mostra um lado, esse lado repete o lado oposto (pedido do António). Palazzetto Guazzaroni (Active Network): sem fotos, estimativa.
const IT_BLUE = { court: '#1f5fd0', surround: '#3fc0a8' }; // piso azul das transmissões da Serie A
export const ARENAS_ITA: Record<string, ArenaProfile> = {
  // PalaCatania: 4 lados e cantos em blocos; 1.º anel amarelo, 2.º anel azul, escadas brancas, grades vermelhas; teto verde ondulado com pilares amarelos; à volta da quadra vermelho-escuro
  cat: { name: 'PalaCatania', capacity: 5000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], corners: true, upperTier: true, tierGap: 'corredor', seat: '#f2c21b',
    seatZones: [{ ring: 'lower', colors: ['#f2c21b'] }, { ring: 'upper', colors: ['#2a55a8'] }], rails: '#d32f2f', stairColor: '#eef0f2',
    wall: '#cfdcc6', roof: 'treliça', windows: true, truss: '#e0b21a', pillars: '#e0b21a', structure: 'vigas', ceiling: '#2f6b3f', aisles: 14, rake: 0.46, floor: { court: '#1f5fd0', surround: '#9c3b2f' } },
  // PalaVesuvio: pista de atletismo à volta; bancadas de lugares claros com escadas vermelhas nos 4 lados; treliça escura; quadra azul com faixa verde-água
  nap: { name: 'PalaVesuvio', capacity: 3711, capacityReal: true, track: 7, style: 'municipal', sides: ['N', 'S', 'E', 'W'], corners: true, seat: '#e8eaed', seatMix: ['#e8eaed', '#e8eaed', '#cfd8e3'], stairColor: '#c62828',
    wall: '#d6d8db', roof: 'treliça', windows: true, truss: '#3b4350', structure: 'trelicas', ceiling: '#2b2f36', aisles: 12, floor: IT_BLUE },
  // Pala Maggiore (L84): bancada de cadeiras vermelhas; asnas de madeira; paredes creme (lado sem foto = igual ao oposto)
  l84: { name: 'Pala Maggiore', capacity: 1000, capacityReal: false, style: 'municipal', sides: ['N', 'S'], seat: '#b03a2e', wall: '#efe9dc', roof: 'treliça', windows: true, beams: '#7a4a2a', structure: 'vigas', ceiling: '#e9e2d4', aisles: 12, floor: { court: '#d9b27a', surround: '#d9b27a', wood: true } },
  // PalaSele: bacia oval de degraus de cimento com muitas entradas de setor; cadeiras azuis só nos blocos de baixo das laterais; cúpula de madeira; grades cor de laranja
  ebo: { name: 'PalaSele', capacity: 8000, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], corners: true, oval: 6, benches: true, seat: '#1f4fb0',
    seatZones: [{ sides: ['N', 'S'], rows: [0, 0.35], middle: 0.75, colors: ['#1f4fb0'] }], stepZones: [{ colors: ['#b9b4aa'] }], rails: '#d9772b', vomZones: [{ sides: ['N', 'S'], n: 6, at: 0.45 }, { sides: ['E', 'W'], n: 3, at: 0.45 }],
    wall: '#8a5a30', roof: 'abóbada', windows: false, beams: '#a0622f', structure: 'cupula', ceiling: '#8a5a30', truss: '#c9ced4', aisles: 14, rake: 0.5, floor: { court: '#1f5fd0', surround: '#7fe0c0', wood: true } },
  // Pala Del Mauro (3 fotos): laterais com 1.º anel verde ao meio e vermelho nas pontas, 2.º anel vermelho (e cadeiras pretas no lateral da câmara),
  // 2 entradas de setor em cima do 1.º anel de cada lateral; topos todos verdes com escadas amarelas e mais entradas no 2.º anel (pelo António);
  // cantos fechados, corrimãos, bancadas quase até ao teto claro com faixas verdes
  ave: { name: 'Pala Del Mauro', capacity: 5300, capacityReal: true, rails: '#e5e7eb', stairColor: '#e3b81f', roofGap: 1.8, style: 'moderno', sides: ['N', 'S', 'E', 'W'], corners: true, seat: '#c62828',
    seatZones: [{ sides: ['N', 'S'], ring: 'upper', colors: ['#c62828'] }, { sides: ['S'], ring: 'upper', colors: ['#c62828', '#c62828', '#2b2b2b'] }, { sides: ['N', 'S'], ring: 'lower', colors: ['#1f7a4a'] }, { sides: ['N', 'S'], ring: 'lower', ends: 0.3, colors: ['#c62828'] }, { sides: ['E', 'W'], colors: ['#1f7a4a'] }],
    vomZones: [{ sides: ['N', 'S'], n: 2, ring: 'lower' }, { sides: ['E', 'W'], n: 4, ring: 'upper' }],
    wall: '#1f3a2e', roof: 'laje', windows: true, ceiling: '#e8e0c8', structure: 'liso', upperTier: true, tierGap: 'corredor', aisles: 12, rake: 0.5, floor: { court: '#d9b27a', surround: '#1f7a4a', wood: true } },
  // PalaCicogna: asnas de madeira inclinadas, paredes amarelas em baixo e brancas em cima, janelas altas com caixilhos verdes
  tre: { name: 'PalaCicogna', capacity: 1500, capacityReal: false, style: 'municipal', sides: ['N', 'S'], seat: '#9aa1a8', wall: '#e8c547', roof: 'treliça', windows: true, beams: '#b0753a', structure: 'vigas', ceiling: '#c98e52', aisles: 12, floor: { court: '#d9b27a', surround: '#d9b27a', wood: true } },
  // Centro Sportivo Meridionale: degraus de cimento nas laterais, vigas amarelas, grades amarelas
  sal: { name: 'Centro Sportivo Meridionale', capacity: 800, capacityReal: false, style: 'clube', sides: ['N', 'S'], benches: true, seat: '#a8a29e', rails: '#e3b81f', wall: '#f2f2ef', roof: 'laje', windows: true, beams: '#e3b81f', pillars: '#c9a227', ceiling: '#f2f2ef', floor: { court: '#d6a066', surround: '#d6a066', wood: true } },
  // PalaCesaroni: arcos de madeira; um lateral com cadeiras vermelhas e o outro azuis; topo com parede e faixas; madeira com áreas azuis e faixa vermelha
  rom: { name: 'PalaCesaroni', capacity: 2000, capacityReal: true, style: 'municipal', sides: ['N', 'S'], seat: '#c62828', seatZones: [{ sides: ['N'], colors: ['#2a55a8'] }, { sides: ['S'], colors: ['#d23a3a'] }], rails: '#2a3f9a',
    wall: '#2b3a8a', roof: 'abóbada', windows: false, beams: '#9a5a2a', structure: 'arcos', ceiling: '#a8683a', aisles: 12, rake: 0.46, floor: { court: '#d9b27a', surround: '#c62828', area: '#3a6fd1', wood: true } },
  // PalaTedeschi: 1.º anel com cadeiras (vermelhas nos topos, laranja nas laterais), 2.º anel em degraus de cimento; teto de madeira, pilares azul-escuros, vidros em cima; parede branca com faixa azul-clara
  ben: { name: 'PalaTedeschi', capacity: 4000, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E', 'W'], upperTier: true, tierGap: 'corredor', seat: '#c8461e',
    seatZones: [{ sides: ['N', 'S'], ring: 'lower', colors: ['#e8641e'] }, { sides: ['E', 'W'], ring: 'lower', colors: ['#c62828'] }, { ring: 'upper', colors: ['cimento'] }], rails: '#e3b81f', stairColor: '#8a8f96',
    wall: '#f2f2ef', roof: 'treliça', windows: true, truss: '#1f2a44', pillars: '#1f2a44', structure: 'vigas', ceiling: '#b07a45', aisles: 14, floor: { court: '#ddc08e', surround: '#ddc08e', wood: true } },
  // PalaLavinium: arcos de madeira com cobertura branca, topos verde-escuros, poucas filas de cadeiras azuis nas laterais
  pom: { name: 'PalaLavinium', capacity: 900, capacityReal: false, style: 'municipal', sides: ['N', 'S'], seat: '#1f4fb0', rails: '#2a3f9a', wall: '#0f3d2e', roof: 'abóbada', windows: false, beams: '#9a5a2a', structure: 'arcos', ceiling: '#f2f2ee', aisles: 10, floor: { court: '#d9b27a', surround: '#1e4fb0', area: '#1e4fb0', wood: true } },
  // PalaPansini: 4 lados de degraus de cimento pintados às faixas verdes e brancas, grades verdes, treliça metálica, janelas em fita
  gio: { name: 'PalaPansini', capacity: 3350, capacityReal: true, style: 'municipal', sides: ['N', 'S', 'E', 'W'], benches: true, seat: '#1f9a4a', stepZones: [{ colors: ['#2fa84f', '#eef0f0'] }], stepBand: 2, rails: '#2f8a4f',
    wall: '#9aa1a8', roof: 'treliça', windows: true, truss: '#4b5563', structure: 'trelicas', ceiling: '#d5d9dd', aisles: 14, floor: { court: '#c98e52', surround: '#c98e52', wood: true } },
  // Palestra Gozzano: ginásio com uma bancada de cimento, janelas grandes
  pad: { name: 'Palestra Gozzano', capacity: 500, capacityReal: false, style: 'clube', sides: ['N'], benches: true, seat: '#9ca3af', rails: '#e8641e', wall: '#d6d3cc', roof: 'treliça', windows: true, truss: '#6b7280', ceiling: '#9aa1a8', floor: { court: '#d6a066', surround: '#d6a066', wood: true } },
  // sem fotos: pavilhão municipal típico (estimativa)
  act: { name: 'Palazzetto dello Sport Claudio Guazzaroni', capacity: 700, capacityReal: false, style: 'municipal', sides: ['N', 'S'], seat: '#cc0000', seatMix: ['#cc0000', '#9aa1a8'], wall: '#eeeeec', roof: 'treliça', windows: true, truss: '#9aa1a8', ceiling: '#d5d9dd', aisles: 10, floor: { court: '#d6a066', surround: '#d6a066', wood: true } },
  // Pala Pinto: laterais com 2 anéis de degraus pintados (vermelho em baixo, só ao meio; azul em cima com escadas vermelhas), grades azuis, estrutura azul, janelas; quadra azul da Supercoppa
  cpr: { name: 'Pala Pinto', capacity: 2500, capacityReal: true, style: 'municipal', sides: ['N', 'S'], benches: true, upperTier: true, tierGap: 'corredor', seat: '#c62828',
    stepZones: [{ ring: 'lower', colors: ['#c0392b'] }, { ring: 'upper', colors: ['#4a6fa5'] }], seatZones: [{ ring: 'lower', ends: 0.55, colors: ['cimento'] }], stairColor: '#c0392b', rails: '#2a6fd1',
    wall: '#e3dcc6', roof: 'laje', windows: true, beams: '#1e4f9a', pillars: '#1e4f9a', ceiling: '#e5e7eb', aisles: 12, floor: IT_BLUE },
};
for (const a of Object.values(ARENAS_ITA)) a.noBand = true; // feitos a partir das fotos: nenhum tem a faixa
Object.assign(ARENAS, ARENAS_ITA);

// França: pavilhões feitos a partir das fotos do António (ZIP Liga_Francesa, 4/11); lotações reais só onde capacityReal.
// Lado sem foto = igual ao oposto (pedido do António). Avion, Garges e GOAL sem fotos: ginásio municipal típico (estimativa)
const FR_WOOD = { court: '#dcc292', surround: '#dcc292', wood: true };
export const ARENAS_FRA: Record<string, ArenaProfile> = {
  // Espace Mayenne: bacia de 4 lados com cantos fechados, cadeiras pretas, 2.º anel recuado nas laterais; paredes de ripas de madeira clara;
  // teto escuro com painéis acústicos suspensos; quadra de madeira com contorno escuro; grades escuras
  lav: { name: 'Espace Mayenne', capacity: 3500, capacityReal: false, style: 'moderno', sides: ['N', 'S', 'E', 'W'], corners: true, oval: 3, upperTier: true, tierGap: 'corredor', tierSplit: 0.65,
    seat: '#262626', rails: '#1f1f1f', stairColor: '#3a3a3a', wall: '#d8c7a4', roof: 'laje', windows: false, ceiling: '#2e2a26', ceilingDark: true, structure: 'led', aisles: 14, rake: 0.48,
    floor: { court: '#e2cb9a', surround: '#2b2b2b', wood: true } },
  // Halle Georges Carpentier: 4 lados de bancadas telescópicas sem cantos, cadeiras azuis e vermelhas (blocos), topo de cadeiras bege;
  // teto escuro com condutas, janelas altas nos topos
  spa: { name: 'Halle Georges Carpentier', capacity: 1500, capacityReal: false, style: 'moderno', sides: ['N', 'S', 'E', 'W'], seat: '#1f3f9a',
    seatZones: [{ sides: ['N'], colors: ['#1f3f9a', '#c62828'] }, { sides: ['S'], colors: ['#c62828', '#1f3f9a'] }, { sides: ['E', 'W'], colors: ['#c62828'] }],
    rails: '#2b2b2b', wall: '#e3e6ea', roof: 'laje', windows: true, ceiling: '#1c1f24', ceilingDark: true, structure: 'vigas', beams: '#2a2d33', aisles: 14,
    floor: { court: '#1f63c8', surround: '#e8641e' } },
  // Palais des Sports Pierre de Coubertin (renovado): bancadas de cadeiras azuis num lateral e num topo, paredes de madeira clara,
  // treliça metálica cinzenta com teto de madeira e fitas de LED
  mon: { name: 'Palais des Sports Pierre de Coubertin', capacity: 800, capacityReal: false, style: 'municipal', sides: ['N', 'E'], seat: '#2a55c8', stairColor: '#1f3f9a', rails: '#3a3f47',
    wall: '#e3cfa6', roof: 'treliça', windows: true, truss: '#8a929c', structure: 'trelicas', ceiling: '#c9a46c', aisles: 10, floor: FR_WOOD },
  // GOAL (Rosa Parks): sem fotos
  goa: { name: 'Salle du Lycée Rosa Parks', capacity: 800, capacityReal: false, style: 'municipal', sides: ['N', 'S'], seat: '#3a3f47', wall: '#eceae4', roof: 'treliça', windows: true, truss: '#9aa1a8', ceiling: '#d5d9dd', aisles: 10, floor: FR_WOOD },
  // Palais des Sports de Toulon: planta oval (cantos em arco largo), 2 anéis, cadeiras azul-acinzentadas, treliça escura, quadra de madeira com contorno azul-claro
  tln: { name: 'Palais des Sports de Toulon', capacity: 4200, capacityReal: true, style: 'moderno', sides: ['N', 'S', 'E', 'W'], corners: true, oval: 6, upperTier: true, tierGap: 'corredor', tierSplit: 0.6, seat: '#5a6f90',
    seatZones: [{ ring: 'lower', colors: ['#5a6f90'] }, { ring: 'upper', colors: ['#3f5d9a', '#3f5d9a', '#a3393a'] }], rails: '#3a3f47', stairColor: '#b9c2cc', topGallery: '#f3e3b8',
    wall: '#1c2a48', roof: 'treliça', windows: false, truss: '#1f242b', structure: 'trelicas', ceiling: '#1f242b', ceilingDark: true, aisles: 14, rake: 0.5,
    floor: { court: '#dcc292', surround: '#3d8fd6', wood: true } },
  // Salle Mangin Beaulieu: laterais e topo de cadeiras verdes em degraus de cimento claro, treliça metálica clara, contorno da quadra verde
  nan: { name: 'Salle Mangin Beaulieu', capacity: 1200, capacityReal: false, style: 'municipal', sides: ['N', 'S', 'E'], seat: '#1f8a4a', stairColor: '#d6d8da', rails: '#e5e7eb',
    wall: '#d8dcdf', roof: 'treliça', windows: false, truss: '#c9ced4', structure: 'trelicas', ceiling: '#9aa1a8', aisles: 12, floor: { court: '#1f63c8', surround: '#1f9a4a' } },
  // Adidas Arena, ginásio 2: um lateral de degraus de madeira (sem cadeiras), galeria de madeira em cima, asnas de madeira, paredes de betão claro;
  // piso cinzento com contorno azul
  aca: { name: 'Adidas Arena – gymnase 2', capacity: 1000, capacityReal: false, style: 'clube', sides: ['N'], benches: true, stepZones: [{ colors: ['#c99a5e'] }], seat: '#c99a5e', rails: '#d6d8da',
    wall: '#d9d5cc', roof: 'treliça', windows: true, beams: '#c9894a', structure: 'vigas', ceiling: '#b9bec4', floor: { court: '#9aa1a8', surround: '#2a6fd1' } },
  // Avion (Roger Blezel): sem fotos
  avi: { name: 'Salle Roger Blezel', capacity: 600, capacityReal: false, style: 'municipal', sides: ['N'], seat: '#c62828', wall: '#eceae4', roof: 'treliça', windows: true, truss: '#9aa1a8', ceiling: '#d5d9dd', aisles: 10, floor: FR_WOOD },
  // Petit Palais des Sports (Toulouse): 4 lados, cadeiras verdes com blocos brancos ao centro de cada lado, treliça verde, claraboias, quadra de madeira com contorno preto
  ujs: { name: 'Petit Palais des Sports', capacity: 1000, capacityReal: false, style: 'municipal', sides: ['N', 'S', 'E', 'W'], seat: '#1f7a4a',
    seatZones: [{ middle: 0.3, colors: ['#e8eaed'] }], rails: '#d6d8da', stairColor: '#2b2b2b', wall: '#3a3f47', roof: 'treliça', windows: false, truss: '#2f7a5a', structure: 'vigas', skylights: true, ceiling: '#5a6068', aisles: 12,
    floor: { court: '#d9b27a', surround: '#1f1f1f', wood: true } },
  // Nice: pista de atletismo à volta da quadra; um lateral de cadeiras azuis em degraus azuis com corrimãos brancos; claraboias; paredes brancas e lilases
  nic: { name: 'Gymnase Parc Charles Ehrmann', capacity: 600, capacityReal: false, track: 5, style: 'municipal', sides: ['N'], seat: '#1f3fb0', stairColor: '#5a8ad8', rails: '#f2f2f2',
    wall: '#e8e6f0', roof: 'treliça', windows: true, truss: '#4b5a52', structure: 'trelicas', skylights: true, ceiling: '#6b5a48', aisles: 8, floor: FR_WOOD },
  // Garges (Allende Neruda): sem fotos
  gar: { name: 'Gymnase Allende Neruda', capacity: 500, capacityReal: false, style: 'clube', sides: ['N'], benches: true, seat: '#9ca3af', rails: '#c62828', wall: '#e6e3dc', roof: 'treliça', windows: true, truss: '#6b7280', ceiling: '#9aa1a8', floor: FR_WOOD },
  // Artistes: as fotos do António são as mesmas do ginásio da Adidas Arena
  art: { name: 'Gymnase Lamberdière', capacity: 500, capacityReal: false, style: 'clube', sides: ['N'], benches: true, stepZones: [{ colors: ['#c99a5e'] }], seat: '#c99a5e', rails: '#d6d8da',
    wall: '#d9d5cc', roof: 'treliça', windows: true, beams: '#c9894a', structure: 'vigas', ceiling: '#b9bec4', floor: { court: '#9aa1a8', surround: '#2a6fd1' } },
};
for (const a of Object.values(ARENAS_FRA)) a.noBand = true;
Object.assign(ARENAS, ARENAS_FRA);

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
  if (f.arenaId) { const a = ARENAS[f.arenaId] ?? NEUTRALS.find((n) => n.name === f.arenaId); if (a) return a; }
  const c = s.clubs.find((x) => x.id === f.home);
  if (c?.league === 'esp1' || c?.league === 'ita1' || c?.league === 'fra1') {
    if (!f.neutral) return ARENAS[c.id] ?? spanishArena(c);
    // campo neutro em Espanha/Itália: um dos grandes pavilhões, que não seja de quem joga, rodando por época (estimativa)
    const big = c.league === 'esp1' ? 4500 : 2500;
    const hosts = s.clubs.filter((x) => x.league === c.league && (x.capacity ?? 0) >= big && x.id !== f.home && x.id !== f.away);
    const comps = ['superEsp', 'copaEsp', 'copaRey', 'superIta', 'coppaIta', 'fraPlayoff', 'coupeFra'];
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
  const country = h.league === 'esp1' ? 1.5 : h.league === 'ita1' ? 1.2 : h.league === 'fra1' ? 0.9 : 1; // Itália e França: estimativa (França: recorde da D1 3 200 em Laval)
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
