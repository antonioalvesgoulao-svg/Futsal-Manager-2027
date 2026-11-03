// Desenho do padrão da camisola numa textura 256x256, comum ao 3D e às imagens dos equipamentos.
// Coordenadas: x à volta do corpo com a frente ao centro (x=128) e as costas nas pontas (x=0/256), lados em x=64 e x=192;
// y de cima (ombros) para baixo (bainha).
import type { KitDef } from '../core/kits';

export function drawKitPattern(c: CanvasRenderingContext2D, k: Pick<KitDef, 'shirt' | 'alt' | 'pattern'>) {
  const S = 256;
  c.fillStyle = k.shirt; c.fillRect(0, 0, S, S);
  c.fillStyle = k.alt; c.strokeStyle = k.alt;
  switch (k.pattern) {
    case 'listas': for (let y = 0; y < S; y += 64) c.fillRect(0, y, S, 32); break; // horizontais largas
    case 'riscas': for (let x = 0; x < S; x += 32) c.fillRect(x, 0, 16, S); break; // verticais
    case 'finas': for (let x = 4; x < S; x += 16) c.fillRect(x, 0, 3, S); break; // riscas finas
    case 'metade': c.fillRect(128, 0, 128, S); break; // metade (uma metade de cada cor, a divisão ao meio da frente) (frente e costas)
    case 'faixa': { // faixa diagonal do ombro à anca (frente e costas)
      c.lineWidth = 34;
      for (const [x0, x1] of [[88, 176], [216, 304], [-40, 48]]) { c.beginPath(); c.moveTo(x0, -10); c.lineTo(x1, S + 10); c.stroke(); }
      break;
    }
    case 'banda': c.fillRect(0, 68, S, 40); break; // banda horizontal no peito
    case 'ombros': c.fillRect(0, 0, S, 62); break; // parte de cima (ombros) noutra cor
    case 'laterais': c.fillRect(46, 0, 36, S); c.fillRect(174, 0, 36, S); break; // painéis dos lados
    case 'centro': c.fillRect(106, 0, 44, S); c.fillRect(0, 0, 22, S); c.fillRect(234, 0, 22, S); break; // risca larga ao centro (frente e costas)
    case 'xadrez': for (let y = 0; y < S; y += 32) for (let x = (y / 32) % 2 ? 32 : 0; x < S; x += 64) c.fillRect(x, y, 32, 32); break;
    case 'degrade': { const g = c.createLinearGradient(0, 0, 0, S); g.addColorStop(0.15, k.shirt); g.addColorStop(1, k.alt); c.fillStyle = g; c.fillRect(0, 0, S, S); break; }
    case 'chevron': { // riscas verticais que, no peito, sobem em diagonal para os ombros (V ao centro), frente e costas
      c.lineWidth = 9;
      for (const cx of [128, 0, 256]) {
        c.save(); c.beginPath(); c.rect(cx - 64, 0, 128, S); c.clip();
        for (let i = -7; i <= 7; i += 2) { c.beginPath(); c.moveTo(cx + i * 16, -10); c.lineTo(cx + i * 9, 130); c.lineTo(cx + i * 9, S + 10); c.stroke(); }
        c.restore();
      }
      break;
    }
    case 'salpicos': { // manchas de tinta na parte de baixo (sempre iguais: gerador fixo)
      let z = 7; const rnd = () => ((z = (z * 16807) % 2147483647) / 2147483647);
      for (let n = 0; n < 160; n++) { const y = 120 + Math.pow(rnd(), 0.6) * 136; c.globalAlpha = 0.55 + rnd() * 0.45; c.beginPath(); c.ellipse(rnd() * S, y, 3 + rnd() * 14, 2 + rnd() * 7, rnd() * 3, 0, 7); c.fill(); }
      c.globalAlpha = 1; break;
    }
    case 'diagonais': c.lineWidth = 3; for (let x = -S; x < S * 2; x += 12) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + S, S); c.stroke(); } break;
    default: break;
  }
}

/** Imagem (data URL) da frente da camisola, para as imagens SVG dos equipamentos. */
const cache = new Map<string, string>();
export function kitFrontUrl(k: Pick<KitDef, 'shirt' | 'alt' | 'pattern'>) {
  const key = `${k.shirt}|${k.alt}|${k.pattern}`;
  const hit = cache.get(key); if (hit) return hit;
  if (typeof document === 'undefined') return '';
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 256;
  drawKitPattern(cv.getContext('2d')!, k);
  const url = cv.toDataURL('image/png'); cache.set(key, url); return url;
}
