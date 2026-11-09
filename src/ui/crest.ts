// Emblemas originais (não licenciados): cores reais dos clubes + um símbolo associado (animal, rio, cidade),
// desenhados de raiz em SVG. Não copiam o desenho nem os textos dos emblemas oficiais.

type Shape = 'escudo' | 'redondo' | 'frances' | 'losango';
type Pattern = 'liso' | 'riscas' | 'faixa' | 'metade' | 'banda';
type Sym = 'leaoOld' | 'leao' | 'aguia' | 'torre' | 'cereja' | 'ondas' | 'raio' | 'estrela' | 'ancora' | 'bola' | 'castelo';
interface Crest { shape: Shape; c1: string; c2: string; edge: string; pat: Pattern; sym: Sym; symC: string }

const CRESTS: Record<string, Crest> = {
  scp: { shape: 'escudo', c1: '#00804a', c2: '#ffffff', edge: '#d4af37', pat: 'faixa', sym: 'leao', symC: '#ffffff' },
  slb: { shape: 'redondo', c1: '#e30613', c2: '#ffffff', edge: '#d4af37', pat: 'liso', sym: 'aguia', symC: '#ffffff' },
  scb: { shape: 'frances', c1: '#e30613', c2: '#ffffff', edge: '#ffffff', pat: 'metade', sym: 'castelo', symC: '#d4af37' },
  fun: { shape: 'escudo', c1: '#582321', c2: '#000000', edge: '#e8d9b0', pat: 'banda', sym: 'cereja', symC: '#e30613' },
  lps: { shape: 'redondo', c1: '#1b4937', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'leao', symC: '#ffffff' },
  fzz: { shape: 'escudo', c1: '#f2e44f', c2: '#000000', edge: '#000000', pat: 'faixa', sym: 'ondas', symC: '#000000' },
  ele: { shape: 'losango', c1: '#0b8a3e', c2: '#000000', edge: '#ffffff', pat: 'liso', sym: 'raio', symC: '#f2e44f' },
  rav: { shape: 'escudo', c1: '#024b3a', c2: '#ffffff', edge: '#ffffff', pat: 'riscas', sym: 'ondas', symC: '#ffffff' },
  uvn: { shape: 'frances', c1: '#facc15', c2: '#000000', edge: '#000000', pat: 'banda', sym: 'estrela', symC: '#000000' },
  por: { shape: 'escudo', c1: '#111111', c2: '#ffffff', edge: '#ffffff', pat: 'riscas', sym: 'ancora', symC: '#d4af37' },
  fam: { shape: 'redondo', c1: '#18214e', c2: '#ffffff', edge: '#ffffff', pat: 'metade', sym: 'bola', symC: '#ffffff' },
  tor: { shape: 'escudo', c1: '#881732', c2: '#34497e', edge: '#ffffff', pat: 'metade', sym: 'torre', symC: '#ffffff' },
  // Espanha: cores dos clubes + símbolo ligado à terra (porto, castelo, rio, leão de Saragoça…), desenho próprio
  bar: { shape: 'redondo', c1: '#a50044', c2: '#004d98', edge: '#edbb00', pat: 'riscas', sym: 'estrela', symC: '#edbb00' },
  epz: { shape: 'losango', c1: '#d50000', c2: '#ffffff', edge: '#ffffff', pat: 'metade', sym: 'estrela', symC: '#111111' },
  pal: { shape: 'frances', c1: '#ffd200', c2: '#000000', edge: '#000000', pat: 'banda', sym: 'ondas', symC: '#000000' },
  jca: { shape: 'escudo', c1: '#000000', c2: '#ffffff', edge: '#ffffff', pat: 'riscas', sym: 'ancora', symC: '#d4af37' },
  int: { shape: 'redondo', c1: '#0b3d91', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'estrela', symC: '#ffffff' },
  jae: { shape: 'escudo', c1: '#ffd100', c2: '#111111', edge: '#111111', pat: 'faixa', sym: 'castelo', symC: '#111111' },
  val: { shape: 'frances', c1: '#7a1f3d', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'estrela', symC: '#ffffff' },
  man: { shape: 'escudo', c1: '#e30613', c2: '#ffffff', edge: '#ffffff', pat: 'banda', sym: 'torre', symC: '#ffffff' },
  zar: { shape: 'escudo', c1: '#d50000', c2: '#ffffff', edge: '#d4af37', pat: 'liso', sym: 'leao', symC: '#ffffff' },
  pen: { shape: 'redondo', c1: '#1565c0', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'castelo', symC: '#ffffff' },
  par: { shape: 'escudo', c1: '#111111', c2: '#ffffff', edge: '#ffffff', pat: 'faixa', sym: 'ancora', symC: '#ffffff' },
  osa: { shape: 'frances', c1: '#c8102e', c2: '#0a2240', edge: '#ffffff', pat: 'banda', sym: 'bola', symC: '#ffffff' },
  cor: { shape: 'escudo', c1: '#00843d', c2: '#ffffff', edge: '#ffffff', pat: 'riscas', sym: 'torre', symC: '#ffffff' },
  eji: { shape: 'losango', c1: '#00843d', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'raio', symC: '#ffffff' },
  noi: { shape: 'redondo', c1: '#1e88e5', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'ondas', symC: '#ffffff' },
  stc: { shape: 'escudo', c1: '#0d47a1', c2: '#ffffff', edge: '#ffffff', pat: 'metade', sym: 'bola', symC: '#d4af37' },
  // Itália: cores dos clubes (site da Divisione) + símbolo ligado à terra (Etna/raio em Catânia, golfo e ondas em Nápoles,
  // touro de Turim, torre de Pádua…), desenho próprio
  cat: { shape: 'escudo', c1: '#d50000', c2: '#4aa3df', edge: '#ffffff', pat: 'riscas', sym: 'raio', symC: '#ffffff' },
  nap: { shape: 'redondo', c1: '#4aa3df', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'ondas', symC: '#ffffff' },
  l84: { shape: 'frances', c1: '#15803d', c2: '#111111', edge: '#ffffff', pat: 'banda', sym: 'leao', symC: '#ffffff' },
  ebo: { shape: 'escudo', c1: '#d50000', c2: '#1e3a8a', edge: '#ffffff', pat: 'metade', sym: 'castelo', symC: '#ffffff' },
  ave: { shape: 'redondo', c1: '#15803d', c2: '#ffffff', edge: '#ffffff', pat: 'faixa', sym: 'estrela', symC: '#ffffff' },
  tre: { shape: 'escudo', c1: '#4aa3df', c2: '#ffffff', edge: '#1e3a8a', pat: 'riscas', sym: 'torre', symC: '#1e3a8a' },
  sal: { shape: 'losango', c1: '#facc15', c2: '#15803d', edge: '#15803d', pat: 'metade', sym: 'bola', symC: '#15803d' },
  rom: { shape: 'escudo', c1: '#facc15', c2: '#b91c1c', edge: '#b91c1c', pat: 'banda', sym: 'aguia', symC: '#b91c1c' },
  ben: { shape: 'frances', c1: '#facc15', c2: '#d50000', edge: '#111111', pat: 'riscas', sym: 'castelo', symC: '#111111' },
  act: { shape: 'losango', c1: '#f97316', c2: '#111111', edge: '#ffffff', pat: 'faixa', sym: 'raio', symC: '#ffffff' },
  pom: { shape: 'escudo', c1: '#d50000', c2: '#1e3a8a', edge: '#facc15', pat: 'riscas', sym: 'estrela', symC: '#facc15' },
  gio: { shape: 'redondo', c1: '#15803d', c2: '#ffffff', edge: '#ffffff', pat: 'metade', sym: 'ancora', symC: '#ffffff' },
  pad: { shape: 'escudo', c1: '#111111', c2: '#ffffff', edge: '#ffffff', pat: 'riscas', sym: 'torre', symC: '#d4af37' },
  cpr: { shape: 'frances', c1: '#ffffff', c2: '#d50000', edge: '#d50000', pat: 'faixa', sym: 'bola', symC: '#d50000' },
  // França (originais, cores reais)
  lav: { shape: 'escudo', c1: '#f07b1a', c2: '#111111', edge: '#ffffff', pat: 'banda', sym: 'estrela', symC: '#ffffff' },
  spa: { shape: 'redondo', c1: '#00804a', c2: '#ffffff', edge: '#ffffff', pat: 'banda', sym: 'torre', symC: '#ffffff' },
  mon: { shape: 'frances', c1: '#c8102e', c2: '#075ba1', edge: '#ffffff', pat: 'faixa', sym: 'ondas', symC: '#ffffff' },
  goa: { shape: 'losango', c1: '#141414', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'bola', symC: '#ffffff' },
  tln: { shape: 'escudo', c1: '#141414', c2: '#d7192a', edge: '#d7192a', pat: 'banda', sym: 'ancora', symC: '#ffffff' },
  nan: { shape: 'frances', c1: '#1c2a44', c2: '#c9a54a', edge: '#c9a54a', pat: 'liso', sym: 'leao', symC: '#c9a54a' },
  aca: { shape: 'redondo', c1: '#0e7a4f', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'torre', symC: '#ffffff' },
  avi: { shape: 'escudo', c1: '#141414', c2: '#a8e6cf', edge: '#ffffff', pat: 'faixa', sym: 'raio', symC: '#ffffff' },
  ujs: { shape: 'frances', c1: '#d7192a', c2: '#ffffff', edge: '#ffffff', pat: 'metade', sym: 'castelo', symC: '#111111' },
  nic: { shape: 'redondo', c1: '#141414', c2: '#c9a54a', edge: '#c9a54a', pat: 'liso', sym: 'aguia', symC: '#c9a54a' },
  gar: { shape: 'escudo', c1: '#f21a23', c2: '#ffffff', edge: '#111111', pat: 'riscas', sym: 'estrela', symC: '#111111' },
  art: { shape: 'losango', c1: '#2f4fd8', c2: '#ffffff', edge: '#ffffff', pat: 'liso', sym: 'estrela', symC: '#ffffff' },
};

// contornos no espaço 100 x 120
const SHAPES: Record<Shape, string> = {
  escudo: 'M8 8 H92 V58 C92 88 70 104 50 114 C30 104 8 88 8 58 Z',
  frances: 'M8 8 H92 V80 Q92 100 70 100 H58 L50 114 L42 100 H30 Q8 100 8 80 Z',
  redondo: 'M50 10 A48 48 0 1 1 49.9 10 Z',
  losango: 'M50 6 L94 60 L50 114 L6 60 Z',
};

const SYMS: Record<Sym, string> = {
  // leão: cabeça de frente com juba (desenho próprio)
  leao: 'M50 36 A24 26 0 1 1 49.9 36 Z',
  leaoOld: 'M34 86 L36 66 C30 62 28 54 32 47 C30 40 35 33 42 33 C45 27 54 27 57 32 C64 31 69 38 66 45 L72 48 L68 52 L62 51 C62 56 60 60 58 62 L62 86 L55 86 L52 70 L45 70 L42 86 Z M66 70 C74 70 76 62 72 58 C76 60 80 66 76 72 C73 76 68 76 64 74 Z',
  // águia de asas abertas
  aguia: 'M50 34 C54 34 56 38 55 42 L60 44 C68 36 80 34 88 36 C82 40 78 44 76 48 C72 50 66 52 60 54 L58 66 L66 80 L56 76 L50 86 L44 76 L34 80 L42 66 L40 54 C34 52 28 50 24 48 C22 44 18 40 12 36 C20 34 32 36 40 44 L45 42 C44 38 46 34 50 34 Z',
  torre: 'M36 90 V48 H32 V36 H38 V42 H44 V36 H56 V42 H62 V36 H68 V48 H64 V90 Z M46 90 V74 A4 4 0 0 1 54 74 V90 Z',
  castelo: 'M24 88 V54 H20 V44 H26 V49 H31 V44 H37 V54 H33 V62 H67 V54 H63 V44 H69 V49 H74 V44 H80 V54 H76 V88 Z M42 62 V40 H38 V30 H44 V35 H48 V30 H52 V35 H56 V30 H62 V40 H58 V62 Z M45 88 V76 A5 5 0 0 1 55 76 V88 Z',
  cereja: 'M38 80 A11 11 0 1 1 38.1 80 Z M62 84 A11 11 0 1 1 62.1 84 Z M38 69 C40 52 46 42 58 34 L60 36 C50 44 44 54 40 69 Z M62 73 C60 56 60 46 58 36 L61 36 C63 46 64 58 65 73 Z M58 34 C66 28 76 30 80 36 C72 38 64 38 58 34 Z',
  ondas: '',
  raio: 'M58 22 L32 64 H48 L40 98 L70 52 H54 Z',
  estrela: 'M50 26 L58 50 H84 L63 65 L71 90 L50 75 L29 90 L37 65 L16 50 H42 Z',
  ancora: 'M47 30 A6 6 0 1 1 53 30 V40 H64 V46 H53 V84 C62 82 70 76 72 66 L66 66 L76 56 L84 66 H78 C76 82 64 92 50 92 C36 92 24 82 22 66 H16 L24 56 L34 66 H28 C30 76 38 82 47 84 V46 H36 V40 H47 Z',
  bola: 'M50 30 A28 28 0 1 1 49.9 30 Z M50 44 L60 51 L56 63 H44 L40 51 Z',
};

function patternSvg(c: Crest, clip: string) {
  const { c1, c2 } = c;
  let inner = `<rect width="100" height="120" fill="${c1}"/>`;
  if (c.pat === 'riscas') inner += [22, 46, 70].map((x) => `<rect x="${x}" width="10" height="120" fill="${c2}" opacity=".9"/>`).join('');
  if (c.pat === 'faixa') inner += `<rect y="94" width="100" height="10" fill="${c2}"/><rect y="16" width="100" height="5" fill="${c2}" opacity=".85"/>`;
  if (c.pat === 'metade') inner += `<rect x="50" width="50" height="120" fill="${c2}" opacity=".95"/>`;
  if (c.pat === 'banda') inner += `<path d="M0 30 L100 100 V120 H80 L0 50 Z" fill="${c2}" opacity=".9"/>`;
  return `<g clip-path="url(#${clip})">${inner}</g>`;
}

function symbolSvg(c: Crest, outline: string) {
  const f = c.symC;
  if (c.sym === 'ondas') return [42, 60, 78].map((y) => `<path d="M16 ${y} q9 -9 18 0 t18 0 t18 0 t18 0" fill="none" stroke="${f}" stroke-width="6" stroke-linecap="round"/>`).join('');
  let extra = '';
  if (c.sym === 'leao') {
    // cara: olhos, focinho e boca na cor do fundo
    const bg = c.c1;
    extra = `<circle cx="50.0" cy="34.0" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="63.0" cy="38.1" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="71.8" cy="49.2" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="73.8" cy="63.7" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="68.1" cy="77.0" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="56.8" cy="84.9" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="43.2" cy="84.9" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="31.9" cy="77.0" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="26.2" cy="63.7" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="28.2" cy="49.2" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><circle cx="37.0" cy="38.1" r="10" fill="#d4af37" stroke="#000" stroke-opacity=".3"/><path d="M50 36 A24 26 0 1 1 49.9 36 Z" fill="#d4af37"/><path d="M50 42 C61 42 67 50 67 59 C67 70 61 80 50 82 C39 80 33 70 33 59 C33 50 39 42 50 42 Z" fill="${f}"/>
      <path d="M37 50 Q43 47 47 52 M63 50 Q57 47 53 52" fill="none" stroke="${bg}" stroke-width="1.6"/>
      <ellipse cx="43" cy="57" rx="2.4" ry="3" fill="${bg}"/><ellipse cx="57" cy="57" rx="2.4" ry="3" fill="${bg}"/>
      <path d="M50 58 V66" stroke="${bg}" stroke-width="1.4"/>
      <ellipse cx="50" cy="71" rx="9" ry="6" fill="${f}" stroke="${bg}" stroke-width="1"/>
      <path d="M45 65 H55 L50 70 Z" fill="${bg}"/><path d="M50 70 V73 M45 75 Q50 78 55 75" fill="none" stroke="${bg}" stroke-width="1.8" stroke-linecap="round"/>`;
  }
  const symFill = c.sym === 'leao' ? '#d4af37' : f; // juba dourada
  return `<path d="${SYMS[c.sym]}" fill="${symFill}" stroke="${outline}" stroke-opacity=".35" stroke-width="1.5" fill-rule="${c.sym === 'leao' ? 'nonzero' : 'evenodd'}"/>${extra}`;
}

let uid = 0;
/** Emblema do clube em SVG (tamanho em px de altura). */
export function crestSvg(clubId: string, h = 40, fallback?: { c1: string; c2: string }) {
  const c = CRESTS[clubId] ?? { shape: 'escudo', c1: fallback?.c1 ?? '#444', c2: fallback?.c2 ?? '#fff', edge: '#fff', pat: 'metade', sym: 'estrela', symC: '#fff' } as Crest;
  const id = `cr${++uid}`;
  const shape = SHAPES[c.shape];
  // símbolo com contorno na cor oposta para se ler sobre qualquer padrão
  const outline = c.symC.toLowerCase() === '#000000' ? '#ffffff' : '#000000';
  return `<svg class="crest-svg" viewBox="0 0 100 120" height="${h}" width="${Math.round(h * 100 / 120)}" aria-hidden="true">
    <defs><clipPath id="${id}"><path d="${shape}"/></clipPath></defs>
    ${patternSvg(c, id)}
    ${symbolSvg(c, outline)}
    <path d="${shape}" fill="none" stroke="${c.edge}" stroke-width="5"/>
    <path d="${shape}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.2"/>
  </svg>`;
}
