// Retrato desenhado (SVG) de cada jogador a partir do aspeto (appearance.ts): pele, cabelo, barba, formato da cara e marcas.
// Desenho próprio, não usa fotos. Camisola na cor do clube.
import type { Look } from '../core/appearance';

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('')}`;
}

// formatos da cara: semilarguras (rx) e semialturas (ry) e queixo
const FACE: Record<NonNullable<Look['face']>, { rx: number; ry: number; jaw: number }> = {
  oval: { rx: 25, ry: 32, jaw: 0.72 },
  redonda: { rx: 28, ry: 30, jaw: 0.88 },
  comprida: { rx: 23, ry: 35, jaw: 0.66 },
  quadrada: { rx: 27, ry: 31, jaw: 0.95 },
};

let uid = 0;
export function portraitSvg(look: Look, shirt: [string, string] = ['#2a6', '#fff'], size = 120, number?: number | null) {
  const id = `pt${++uid}`;
  const f = FACE[look.face ?? 'oval'];
  const cx = 60, cy = 62; // centro da cara
  const top = cy - f.ry, chin = cy + f.ry;
  const skin = look.skin, skinD = shade(skin, 0.82), skinL = shade(skin, 1.08);
  const hair = look.hair, hairD = shade(hair, 0.7);
  const m = new Set(look.marks ?? []);
  const lightSkin = parseInt(skin.slice(1, 3), 16) > 200;

  // contorno da cara: maçãs largas, queixo conforme o formato
  const jw = f.rx * f.jaw;
  const facePath = `M${cx - f.rx} ${cy - 6} C${cx - f.rx} ${top - 4} ${cx + f.rx} ${top - 4} ${cx + f.rx} ${cy - 6}
    C${cx + f.rx} ${cy + 14} ${cx + jw} ${chin - 6} ${cx} ${chin} C${cx - jw} ${chin - 6} ${cx - f.rx} ${cy + 14} ${cx - f.rx} ${cy - 6} Z`;

  const parts: string[] = [];
  // fundo e ombros (camisola)
  parts.push(`<rect width="120" height="140" fill="url(#${id}bg)"/>`);
  parts.push(`<path d="M8 140 C10 112 30 104 46 100 L74 100 C90 104 110 112 112 140 Z" fill="${shirt[0]}"/>`);
  parts.push(`<path d="M46 100 L60 116 L74 100" fill="none" stroke="${shirt[1]}" stroke-width="4"/>`);
  if (number) parts.push(`<text x="92" y="132" font-size="14" font-weight="700" font-family="sans-serif" fill="${shirt[1]}" text-anchor="middle">${number}</text>`);
  // pescoço
  parts.push(`<path d="M${cx - 11} ${chin - 10} L${cx - 12} 104 Q${cx} 110 ${cx + 12} 104 L${cx + 11} ${chin - 10} Z" fill="${skinD}"/>`);
  if (m.has('tatuagem')) parts.push(`<path d="M${cx + 4} ${chin + 2} q4 4 0 8 q-4 4 0 8" fill="none" stroke="${shade(skin, 0.5)}" stroke-width="1.6" opacity=".7"/>`);
  // cabelo de trás (compridos, rastas, afro)
  if (look.style === 'afro') parts.push(`<ellipse cx="${cx}" cy="${top + 12}" rx="${f.rx + 13}" ry="${f.ry * 0.85}" fill="${hair}"/>`);
  if (look.style === 'comprido' || look.style === 'apanhado') {
    if (m.has('rastas') || m.has('trancas')) {
      for (let i = -4; i <= 4; i++) parts.push(`<path d="M${cx + i * 6.5} ${top + 4} Q${cx + i * 8} ${cy + 10} ${cx + i * 9.5} ${cy + (look.style === 'apanhado' ? 0 : 30)}" stroke="${hair}" stroke-width="5" stroke-linecap="round" fill="none"/>`);
    } else parts.push(`<path d="M${cx - f.rx - 4} ${cy - 4} Q${cx - f.rx - 6} ${cy + 26} ${cx - f.rx + 2} ${cy + 30} L${cx + f.rx - 2} ${cy + 30} Q${cx + f.rx + 6} ${cy + 26} ${cx + f.rx + 4} ${cy - 4} Z" fill="${hairD}"/>`);
  }
  // orelhas
  parts.push(`<ellipse cx="${cx - f.rx}" cy="${cy}" rx="4.5" ry="7" fill="${skinD}"/><ellipse cx="${cx + f.rx}" cy="${cy}" rx="4.5" ry="7" fill="${skinD}"/>`);
  if (m.has('brinco')) parts.push(`<circle cx="${cx - f.rx - 1}" cy="${cy + 6}" r="1.8" fill="#e5e7eb"/><circle cx="${cx + f.rx + 1}" cy="${cy + 6}" r="1.8" fill="#e5e7eb"/>`);
  // cara
  parts.push(`<path d="${facePath}" fill="url(#${id}sk)"/>`);
  // barba (por baixo da boca)
  const beardC = m.has('barbaGrisalha') ? '#8d8d8d' : m.has('barbaRuiva') ? '#9c4a22' : look.style === 'careca' && hair === '#8d8d8d' ? '#555' : hair;
  if (look.beard === 'cheia') parts.push(`<path d="M${cx - f.rx + 1} ${cy + 2} C${cx - f.rx + 2} ${cy + 22} ${cx - jw + 4} ${chin} ${cx} ${chin + 3} C${cx + jw - 4} ${chin} ${cx + f.rx - 2} ${cy + 22} ${cx + f.rx - 1} ${cy + 2} C${cx + 14} ${cy + 12} ${cx - 14} ${cy + 12} ${cx - f.rx + 1} ${cy + 2} Z" fill="${beardC}" opacity=".93"/>`);
  else if (look.beard === 'curta') parts.push(`<path d="M${cx - f.rx + 2} ${cy + 4} C${cx - f.rx + 3} ${cy + 20} ${cx - jw + 4} ${chin - 1} ${cx} ${chin + 1} C${cx + jw - 4} ${chin - 1} ${cx + f.rx - 3} ${cy + 20} ${cx + f.rx - 2} ${cy + 4} C${cx + 12} ${cy + 14} ${cx - 12} ${cy + 14} ${cx - f.rx + 2} ${cy + 4} Z" fill="${beardC}" opacity=".45"/>`);
  if (look.beard === 'bigode' || look.beard === 'cheia' || m.has('pera')) parts.push(`<path d="M${cx - 9} ${cy + 15} Q${cx} ${cy + 10} ${cx + 9} ${cy + 15} Q${cx} ${cy + 13} ${cx - 9} ${cy + 15} Z" fill="${beardC}" stroke="${beardC}" stroke-width="2"/>`);
  if (m.has('pera')) parts.push(`<path d="M${cx - 5} ${chin - 6} Q${cx} ${chin + 3} ${cx + 5} ${chin - 6} Z" fill="${beardC}" opacity=".9"/>`);
  // olhos, sobrancelhas, nariz, boca
  const ey = cy - 3, ex = f.rx * 0.42;
  const iris = m.has('olhosClaros') ? '#5b8fb0' : '#3b2a20';
  for (const s of [-1, 1]) {
    parts.push(`<ellipse cx="${cx + s * ex}" cy="${ey}" rx="4.6" ry="2.8" fill="#fff"/><circle cx="${cx + s * ex}" cy="${ey}" r="2.2" fill="${iris}"/><circle cx="${cx + s * ex}" cy="${ey}" r="1" fill="#111"/>`);
    const bw = m.has('sobrancelhas') ? 3.4 : 2.2;
    parts.push(`<path d="M${cx + s * (ex - 6)} ${ey - 6} Q${cx + s * ex} ${ey - 9} ${cx + s * (ex + 6)} ${ey - 6.5}" stroke="${look.style === 'careca' && !look.hair ? '#222' : hairD}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`);
  }
  parts.push(`<path d="M${cx} ${ey + 2} L${cx - 3.5} ${cy + 9} Q${cx} ${cy + 11} ${cx + 3.5} ${cy + 9}" fill="none" stroke="${shade(skin, 0.68)}" stroke-width="1.6" stroke-linecap="round"/>`);
  parts.push(`<path d="M${cx - 7} ${cy + 18} Q${cx} ${cy + 21} ${cx + 7} ${cy + 18}" fill="none" stroke="${lightSkin ? '#a5615a' : shade(skin, 0.55)}" stroke-width="2" stroke-linecap="round"/>`);

  // cabelo de cima
  const hairTop = (d: string, fill = hair) => parts.push(`<path d="${d}" fill="${fill}"/>`);
  const crown = `M${cx - f.rx - 1} ${cy - 4} C${cx - f.rx - 3} ${top - 14} ${cx + f.rx + 3} ${top - 14} ${cx + f.rx + 1} ${cy - 4}`;
  const hl = m.has('entradas') ? 10 : 4; // altura da linha do cabelo
  switch (look.style) {
    case 'careca': parts.push(`<ellipse cx="${cx - 8}" cy="${top + 6}" rx="8" ry="4" fill="#fff" opacity=".18"/>`); break;
    case 'rapado': hairTop(`${crown} C${cx + f.rx - 2} ${top + 6} ${cx - f.rx + 2} ${top + 6} ${cx - f.rx - 1} ${cy - 4} Z`, hair); parts.push(`<path d="${crown} C${cx + f.rx - 2} ${top + 6} ${cx - f.rx + 2} ${top + 6} ${cx - f.rx - 1} ${cy - 4} Z" fill="${skin}" opacity=".45"/>`); break;
    case 'degrade':
      hairTop(`M${cx - f.rx} ${cy - 2} C${cx - f.rx - 2} ${top - 18} ${cx + f.rx + 2} ${top - 18} ${cx + f.rx} ${cy - 2} L${cx + f.rx - 3} ${cy - 4} C${cx + f.rx - 6} ${top + hl} ${cx - f.rx + 6} ${top + hl} ${cx - f.rx + 3} ${cy - 4} Z`);
      if (m.has('trancas')) for (let i = -2; i <= 2; i++) parts.push(`<path d="M${cx + i * 6} ${top - 2} q2 -6 0 -10" stroke="${hairD}" stroke-width="4" stroke-linecap="round" fill="none"/>`);
      break;
    case 'encaracolado': case 'afro':
      for (let i = 0; i < 11; i++) { const a = Math.PI * (0.05 + 0.9 * i / 10); parts.push(`<circle cx="${cx - Math.cos(a) * (f.rx + 2)}" cy="${top + 12 - Math.sin(a) * 15}" r="${look.style === 'afro' ? 9 : 7}" fill="${hair}"/>`); }
      hairTop(`M${cx - f.rx} ${cy - 6} C${cx - f.rx} ${top - 4} ${cx + f.rx} ${top - 4} ${cx + f.rx} ${cy - 6} C${cx + 10} ${top + hl + 4} ${cx - 10} ${top + hl + 4} ${cx - f.rx} ${cy - 6} Z`);
      break;
    case 'crista': hairTop(`M${cx - 8} ${top + 6} Q${cx} ${top - 20} ${cx + 8} ${top + 6} Z`); break;
    case 'apanhado': case 'comprido':
      if (m.has('rastas') || m.has('trancas')) { for (let i = -3; i <= 3; i++) parts.push(`<path d="M${cx + i * 6} ${top + 10} Q${cx + i * 6.5} ${top - 6} ${cx + i * 3} ${top - 10}" stroke="${hair}" stroke-width="5.5" stroke-linecap="round" fill="none"/>`); hairTop(`${crown} C${cx + 14} ${top + 4} ${cx - 14} ${top + 4} ${cx - f.rx - 1} ${cy - 4} Z`); }
      else hairTop(`M${cx - f.rx - 3} ${cy + 2} C${cx - f.rx - 5} ${top - 16} ${cx + f.rx + 5} ${top - 16} ${cx + f.rx + 3} ${cy + 2} C${cx + f.rx - 4} ${top + 10} ${cx + 4} ${top + 6} ${cx - 4} ${top + 12} C${cx - 12} ${top + 6} ${cx - f.rx + 2} ${top + 12} ${cx - f.rx - 3} ${cy + 2} Z`);
      break;
    default: // curto
      if (m.has('franja')) hairTop(`M${cx - f.rx - 1} ${cy - 6} C${cx - f.rx - 3} ${top - 16} ${cx + f.rx + 3} ${top - 16} ${cx + f.rx + 1} ${cy - 6} C${cx + 10} ${top + 16} ${cx - 10} ${top + 10} ${cx - f.rx - 1} ${cy - 6} Z`);
      else if (m.has('paraTras')) hairTop(`M${cx - f.rx - 1} ${cy - 6} C${cx - f.rx - 3} ${top - 20} ${cx + f.rx + 3} ${top - 20} ${cx + f.rx + 1} ${cy - 6} C${cx + 14} ${top + hl} ${cx - 14} ${top + hl} ${cx - f.rx - 1} ${cy - 6} Z`);
      else hairTop(`M${cx - f.rx - 1} ${cy - 6} C${cx - f.rx - 3} ${top - (m.has('ondulado') ? 20 : 15)} ${cx + f.rx + 3} ${top - (m.has('ondulado') ? 20 : 15)} ${cx + f.rx + 1} ${cy - 6} C${cx + f.rx - 4} ${top + hl + 2} ${cx - f.rx + 4} ${top + hl + 2} ${cx - f.rx - 1} ${cy - 6} Z`);
      if (m.has('descolorado')) parts.push(`<path d="M${cx - f.rx + 4} ${top + 2} Q${cx} ${top - 10} ${cx + f.rx - 4} ${top + 2}" stroke="${hairD}" stroke-width="3" fill="none"/>`);
  }

  return `<svg class="portrait" viewBox="0 0 120 140" width="${size}" height="${Math.round(size * 140 / 120)}" aria-hidden="true">
    <defs>
      <radialGradient id="${id}sk" cx="45%" cy="38%" r="70%"><stop offset="0" stop-color="${skinL}"/><stop offset="1" stop-color="${skin}"/></radialGradient>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3340"/><stop offset="1" stop-color="#151a22"/></linearGradient>
    </defs>${parts.join('')}</svg>`;
}
