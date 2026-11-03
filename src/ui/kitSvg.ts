// Desenho de um equipamento (camisola, calções e meias) para escolher antes do jogo.
import type { KitDef } from '../core/kits';
import { kitFrontUrl } from './kitPattern';

let uid = 0;
export function kitSvg(k: KitDef, w = 92) {
  const id = `kp${uid++}`;
  // padrão igual ao do 3D (kitPattern.ts): a frente da textura (x 64-192) cobre o tronco
  const url = k.pattern && k.pattern !== 'liso' ? kitFrontUrl(k) : '';
  const pat = url ? `<pattern id="${id}" patternUnits="userSpaceOnUse" x="2" y="2" width="96" height="74"><image href="${url}" width="96" height="74" preserveAspectRatio="none"/></pattern>` : '';
  const fill = url ? `url(#${id})` : k.shirt;
  const sleeve = k.sleeves ? `<path d="M30 8 L6 26 L16 42 L26 34 Z M70 8 L94 26 L84 42 L74 34 Z" fill="${k.sleeves}" stroke="rgba(0,0,0,.45)" stroke-width="1.2" stroke-linejoin="round"/>` : '';
  const st = 'stroke="rgba(0,0,0,.45)" stroke-width="1.2" stroke-linejoin="round"';
  return `<svg viewBox="0 0 100 150" width="${w}" height="${(w * 1.5).toFixed(0)}" class="kitsvg"><defs>${pat}</defs>
    <path d="M30 8 L42 4 Q50 12 58 4 L70 8 L94 26 L84 42 L74 34 L74 70 L26 70 L26 34 L16 42 L6 26 Z" fill="${fill}" ${st}/>${sleeve}
    <path d="M42 4 Q50 12 58 4" fill="none" stroke="${k.collar ?? k.shorts}" stroke-width="3"/>
    <path d="M26 72 L74 72 L78 104 L54 104 L50 88 L46 104 L22 104 Z" fill="${k.shorts}" ${st}/>
    <path d="M27 110 L44 110 L43 140 L28 140 Z M56 110 L73 110 L72 140 L57 140 Z" fill="${k.socks}" ${st}/>
  </svg>`;
}
