// Pavilhão em 3D: bancadas à medida da lotação real, cadeiras, adeptos (conforme a assistência,
// com as cores de cada equipa e a mexer-se), teto, iluminação, janelas, ecrã de resultado e
// placas LED de publicidade animadas (anúncios fictícios, competição, resultado, golo).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';

import type { ArenaProfile } from '../../core/attendance';
import type { KitDef } from '../../core/kits';
import { buildRoof } from './roof3d';
import { buildUltras } from './ultras3d';

export const W = 40; // comprimento do campo (m)
export const H = 20; // largura do campo (m)
// lado dos bancos (z negativo): mais espaço entre a quadra e a bancada para a mesa do cronometrista,
// à frente da boca do túnel (os jogadores contornam-na, uma equipa por cada lado)
export const FRONT_N = H / 2 + 5.0; // primeira fila da bancada do lado dos bancos
export const TUNNEL_GAP = 3.2; // largura da passagem do túnel pela bancada
export const TUNNEL_MOUTH = H / 2 + 3.4; // boca do túnel (sai por entre as placas LED)
export const TABLE_Z = H / 2 + 2.0; // mesa (mesma linha dos bancos)
// o corredor do túnel desce em rampa por baixo da bancada até aos balneários (abaixo do piso da quadra)
export const RAMP_DROP = 2.2; // profundidade final (m)
const RAMP_SLOPE = 0.6; // desce 0,6 m por metro
const HEADROOM = 2.5;
/** Altura do chão do corredor a uma distância dd (m) para lá da primeira fila. */
export const rampFloor = (dd: number) => -Math.min(RAMP_DROP, Math.max(0, dd) * RAMP_SLOPE);

export interface ArenaOpts {
  profile: ArenaProfile;
  crowd: number;
  shares: [number, number];
  comp: string; // nome da competição
  stage: string; // jornada / eliminatória
  teams: [{ short: string; colors: [string, string]; name?: string }, { short: string; colors: [string, string]; name?: string }];
  ultras?: [boolean, boolean]; // claque organizada de cada equipa (só em jogos grandes)
  kits?: [KitDef, KitDef]; // equipamentos do jogo
  gkKits?: [KitDef, KitDef]; // guarda-redes
  quality?: 'normal' | 'alta';
  refShirt?: string;
}

export function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)), ((s ^= s >>> 16) >>> 0) / 4294967296);
}

// ---------- piso ----------
function floorTexture(mainLine: string, fl: { court: string; surround: string; area?: string; wood?: boolean }) {
  const S = 40; // px por metro
  const pad = 4;
  return canvasTex((W + pad * 2) * S, (H + pad * 2) * S, (c) => {
    // zona exterior e campo (madeira, azul ou verde, conforme o pavilhão)
    c.fillStyle = fl.surround;
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    const X = (m: number) => (m + W / 2 + pad) * S;
    const Z = (m: number) => (m + H / 2 + pad) * S;
    c.fillStyle = fl.court;
    c.fillRect(X(-W / 2), Z(-H / 2), W * S, H * S);
    if (fl.wood) {
      for (let i = 0; i < c.canvas.width; i += 9) {
        c.fillStyle = i % 18 ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.03)';
        c.fillRect(i, 0, 4, c.canvas.height);
      }
    }
    // áreas de baliza (6 m): pintadas ou ligeiramente mais escuras
    c.fillStyle = fl.area ?? 'rgba(0,0,0,0.12)';
    for (const sg of [-1, 1]) {
      c.beginPath();
      c.moveTo(X(sg * W / 2), Z(-7.6));
      c.arc(X(sg * W / 2), Z(-1.58), 6 * S, sg < 0 ? -Math.PI / 2 : -Math.PI / 2, sg < 0 ? 0 : -Math.PI, sg > 0);
      c.lineTo(X(sg * (W / 2 - 6)), Z(1.58));
      c.arc(X(sg * W / 2), Z(1.58), 6 * S, sg < 0 ? 0 : Math.PI, Math.PI / 2, sg > 0);
      c.closePath();
      c.fill();
    }
    c.strokeStyle = mainLine;
    c.lineWidth = 0.08 * S;
    c.strokeRect(X(-W / 2), Z(-H / 2), W * S, H * S);
    c.beginPath(); c.moveTo(X(0), Z(-H / 2)); c.lineTo(X(0), Z(H / 2)); c.stroke();
    c.beginPath(); c.arc(X(0), Z(0), 3 * S, 0, Math.PI * 2); c.stroke();
    for (const sgn of [-1, 1]) {
      const gx = X((sgn * W) / 2);
      c.beginPath();
      c.arc(gx, Z(-1.58), 6 * S, sgn < 0 ? -Math.PI / 2 : Math.PI, sgn < 0 ? 0 : -Math.PI / 2, false);
      c.stroke();
      c.beginPath();
      c.arc(gx, Z(1.58), 6 * S, sgn < 0 ? 0 : Math.PI / 2, sgn < 0 ? Math.PI / 2 : Math.PI, false);
      c.stroke();
      c.beginPath(); c.moveTo(gx - sgn * 6 * S, Z(-1.58)); c.lineTo(gx - sgn * 6 * S, Z(1.58)); c.stroke();
      for (const d of [6, 10]) { c.fillStyle = mainLine; c.beginPath(); c.arc(gx - sgn * d * S, Z(0), 0.12 * S, 0, Math.PI * 2); c.fill(); }
    }
    // zonas de substituição, do lado dos bancos
    for (const x of [-5, 5]) { c.beginPath(); c.moveTo(X(x), Z(-H / 2)); c.lineTo(X(x), Z(-H / 2 - 0.6)); c.stroke(); }
    c.fillStyle = mainLine;
    c.beginPath(); c.arc(X(0), Z(0), 0.12 * S, 0, Math.PI * 2); c.fill();
  });
}

// ---------- publicidade ----------
interface Ad { name: string; tag: string; bg: string; fg: string; accent: string }
// marcas inventadas (não imitam marcas reais)
const ADS: Ad[] = [
  { name: 'BICA FORTE', tag: 'café de bairro', bg: '#3b1f12', fg: '#f5e6c8', accent: '#d97706' },
  { name: 'AZULEJO SEGUROS', tag: 'proteção de família', bg: '#1d4ed8', fg: '#ffffff', accent: '#93c5fd' },
  { name: 'ATLÂNTICO VIAGENS', tag: 'parta connosco', bg: '#0e7490', fg: '#ffffff', accent: '#fde047' },
  { name: 'SERRA PURA', tag: 'água de nascente', bg: '#e0f2fe', fg: '#075985', accent: '#38bdf8' },
  { name: 'CALÇADA TELECOM', tag: 'rede em todo o país', bg: '#111827', fg: '#facc15', accent: '#f43f5e' },
  { name: 'MOINHO', tag: 'pão quente todos os dias', bg: '#fef3c7', fg: '#92400e', accent: '#b45309' },
  { name: 'FAROL ENERGIA', tag: 'luz mais barata', bg: '#f97316', fg: '#ffffff', accent: '#fff7ed' },
  { name: 'DOURO ALTO', tag: 'vinhos de quinta', bg: '#581c87', fg: '#f5d0fe', accent: '#e9d5ff' },
  { name: 'SARDINHA & CIA', tag: 'conservas desde 1931', bg: '#0f766e', fg: '#ecfeff', accent: '#5eead4' },
  { name: 'GALO AUTO', tag: 'oficina e pneus', bg: '#b91c1c', fg: '#ffffff', accent: '#fecaca' },
  { name: 'PASTEL DE BELÉM', tag: 'doçaria tradicional', bg: '#fde68a', fg: '#7c2d12', accent: '#ea580c' },
  { name: 'RIBEIRA BANCO', tag: 'crédito à habitação', bg: '#14532d', fg: '#ffffff', accent: '#86efac' },
  { name: 'FUTSAL MANAGER 2027', tag: 'o jogo de gestão', bg: '#0b1220', fg: '#ffffff', accent: '#22c55e' },
  { name: 'DESPORTO E PAIXÃO', tag: 'pratique desporto', bg: '#be123c', fg: '#ffffff', accent: '#fecdd3' },
];

type LedMode = 'ads' | 'comp' | 'score' | 'goal';

const PANEL_PX = 320;
const PANELS = 10;
const PANEL_M = 5; // cada painel ocupa 5 m de placa

class Led {
  cv = document.createElement('canvas');
  ctx: CanvasRenderingContext2D;
  tex: THREE.CanvasTexture[] = [];
  private mode: LedMode | '' = '';
  private seq = 0;
  private r = rng(7);
  score: [number, number] = [0, 0];
  goalSide = 0;

  constructor(private o: ArenaOpts) {
    this.cv.width = PANEL_PX * PANELS;
    this.cv.height = 64;
    this.ctx = this.cv.getContext('2d')!;
    this.draw('ads');
  }

  texture(lengthM: number, offsetPanels: number) {
    const t = new THREE.CanvasTexture(this.cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    // número inteiro de painéis em cada placa (estica ligeiramente): nenhum anúncio fica cortado na ponta
    t.repeat.set(Math.max(1, Math.round(lengthM / PANEL_M)) / PANELS, 1);
    t.offset.x = offsetPanels / PANELS;
    t.userData.base = offsetPanels;
    this.tex.push(t);
    return t;
  }

  private panel(i: number, f: (c: CanvasRenderingContext2D, x: number) => void) {
    const c = this.ctx;
    c.save();
    c.beginPath();
    c.rect(i * PANEL_PX, 0, PANEL_PX, 64);
    c.clip();
    f(c, i * PANEL_PX);
    c.restore();
  }

  draw(mode: LedMode) {
    this.mode = mode;
    this.seq++;
    const c = this.ctx;
    const [h, a] = this.o.teams;
    for (let i = 0; i < PANELS; i++) {
      this.panel(i, (c, x) => {
        const cx = x + PANEL_PX / 2;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        if (mode === 'ads') {
          const ad = ADS[Math.floor(this.r() * ADS.length)];
          c.fillStyle = ad.bg; c.fillRect(x, 0, PANEL_PX, 64);
          c.fillStyle = ad.accent; c.fillRect(x, 54, PANEL_PX, 10);
          c.fillStyle = ad.fg; c.font = 'bold 26px sans-serif';
          c.fillText(ad.name, cx, 24, PANEL_PX - 20);
          c.font = '14px sans-serif';
          c.fillText(ad.tag, cx, 45, PANEL_PX - 20);
        } else if (mode === 'comp') {
          const alt = i % 2 === 0;
          c.fillStyle = alt ? '#0b3d2e' : '#7a0f1c'; c.fillRect(x, 0, PANEL_PX, 64);
          // padrão de azulejo
          c.strokeStyle = 'rgba(255,255,255,0.12)';
          for (let k = 0; k < PANEL_PX; k += 16) { c.beginPath(); c.moveTo(x + k, 0); c.lineTo(x + k + 32, 64); c.stroke(); }
          c.fillStyle = '#ffffff'; c.font = 'bold 28px sans-serif';
          c.fillText(alt ? this.o.comp.toUpperCase() : this.o.stage.toUpperCase(), cx, 33, PANEL_PX - 16);
        } else if (mode === 'score') {
          const alt = i % 2 === 0;
          c.fillStyle = '#0b1220'; c.fillRect(x, 0, PANEL_PX, 64);
          if (alt) {
            c.fillStyle = h.colors[0]; c.fillRect(x, 0, 12, 64);
            c.fillStyle = a.colors[0]; c.fillRect(x + PANEL_PX - 12, 0, 12, 64);
            c.fillStyle = '#ffffff'; c.font = 'bold 30px sans-serif';
            c.fillText(`${h.short}  ${this.score[0]} - ${this.score[1]}  ${a.short}`, cx, 34, PANEL_PX - 30);
          } else {
            c.fillStyle = '#facc15'; c.font = 'bold 22px sans-serif';
            c.fillText(this.o.profile.name.toUpperCase(), cx, 33, PANEL_PX - 16);
          }
        } else {
          const t = this.o.teams[this.goalSide];
          c.fillStyle = i % 2 ? t.colors[0] : '#0b1220'; c.fillRect(x, 0, PANEL_PX, 64);
          c.fillStyle = i % 2 ? (t.colors[1] === t.colors[0] ? '#fff' : t.colors[1]) : '#facc15';
          c.font = 'bold 40px sans-serif';
          c.fillText('GOLO!', cx, 35);
        }
      });
    }
    for (const t of this.tex) t.needsUpdate = true;
  }

  private lastSwitch = 0;
  private cycle = 0;
  private slide = 0;
  private goalUntil = -1;

  goal(side: number, now: number) {
    this.goalSide = side;
    this.goalUntil = now + 5;
    this.draw('goal');
  }

  update(now: number) {
    if (this.mode === 'goal') {
      // os painéis do golo correm rapidamente
      for (const t of this.tex) t.offset.x = ((t.userData.base as number) + now * 1.5) / PANELS;
      if (now > this.goalUntil) this.draw('score');
      return;
    }
    // de 6 em 6 s os painéis deslizam; de vez em quando muda o conteúdo
    if (now - this.lastSwitch > 6) {
      this.lastSwitch = now;
      this.slide++;
      if (this.slide % 3 === 0) {
        this.cycle++;
        const modes: LedMode[] = ['ads', 'comp', 'ads', 'score'];
        this.draw(modes[this.cycle % modes.length]);
      }
    }
    const k = Math.min(1, (now - this.lastSwitch) / 0.6);
    const e = k * k * (3 - 2 * k);
    for (const t of this.tex) t.offset.x = ((t.userData.base as number) + this.slide - 1 + e) / PANELS;
  }
}

// ---------- adeptos ----------
function crowdMaterial(color: THREE.Color | null, uniforms: { uTime: { value: number }; uEx: { value: THREE.Vector3 } }) {
  const m = new THREE.MeshLambertMaterial({ color: color ?? 0xffffff });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uniforms.uTime;
    sh.uniforms.uEx = uniforms.uEx;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aPhase;\nattribute float aTeam;\nuniform float uTime;\nuniform vec3 uEx;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float ex = aTeam < 0.5 ? uEx.x : (aTeam < 1.5 ? uEx.y : uEx.z);
        transformed.y += (0.02 + ex * 0.32) * max(0.0, sin(uTime * (2.0 + ex * 7.0) + aPhase));`
      );
  };
  return m;
}

export interface ArenaHandle {
  update(now: number, excite: [number, number]): void;
  setScore(s: [number, number]): void;
  goal(side: number): void;
  netHit(sgn: number, y: number, z: number, amp?: number): void; // bola na rede (sgn = baliza)
  setCeremony(on: boolean): void;
  standDepth: number;
  height: number;
  benchSeats: { x: number; z: number; y: number }[][];
  tableSeats: { x: number; z: number; y: number }[];
  groundAt(x: number, z: number): number; // altura do chão (rampa do túnel)
}

// cores da mesa e do túnel conforme a competição (as mesmas dos marcadores do jogo)
function compTheme(comp: string): { bg: string; a: string; b: string } {
  if (/Taça de Portugal/.test(comp)) return { bg: '#5b0a14', a: '#d4a017', b: '#d4a017' };
  if (/Taça da Liga/.test(comp)) return { bg: '#0b2a6f', a: '#ffffff', b: '#1d4ed8' };
  if (/Supertaça/.test(comp)) return { bg: '#0b0b0b', a: '#d4a017', b: '#d4a017' };
  return { bg: '#16202c', a: '#00a651', b: '#e30613' };
}

export function buildArena(scene: THREE.Scene, o: ArenaOpts): ArenaHandle {
  const ct = compTheme(o.comp);
  const pr = o.profile;
  const r = rng(pr.name.length * 131 + pr.capacity);
  const modern = pr.style === 'moderno';
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, H + 8), new THREE.MeshStandardMaterial({ map: floorTexture('#ffffff', pr.floor ?? { court: '#c08a4f', surround: '#c08a4f', wood: true }), roughness: 0.45, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  if (o.quality === 'alta') {
    // piso envernizado: reflexo verdadeiro (jogadores, bola, luzes) por baixo de um piso ligeiramente transparente
    const mirror = new Reflector(new THREE.PlaneGeometry(W + 8, H + 8), { textureWidth: 1024, textureHeight: 512, color: 0x8a8a8a });
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = -0.01;
    scene.add(mirror);
    const fm = floor.material as THREE.MeshStandardMaterial;
    fm.transparent = true;
    fm.opacity = 0.84;
    fm.roughness = 0.3;
  }

  // balizas 3 x 2 m
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xd61f26, roughness: 0.35 });
  // redes: malha de 10 cm em fio branco, com profundidade 1 m (fundo, teto e laterais); ondulam quando a bola entra
  const netMat = new THREE.LineBasicMaterial({ color: 0xf5f5f5, transparent: true, opacity: 0.8 });
  const nets: { pos: THREE.BufferAttribute; orig: Float32Array; sgn: number; hit: { t: number; y: number; z: number; amp: number } | null }[] = [];
  const makeNet = (sgn: number) => {
    const pts: number[] = [];
    const seg = (a: number[], b: number[]) => pts.push(...a, ...b);
    const S = 0.1;
    const nz = Math.round(3 / S), ny = Math.round(2 / S), nd = Math.round(1 / S);
    // ponto na rede: d = profundidade (0 na linha de golo, 1 no fundo), y altura, z largura; o fundo desce um pouco (rede caída)
    const P = (d: number, y: number, z: number) => [sgn * d * (y > 1.99 ? 0.85 : 1), y, z];
    for (let i = 0; i <= nz; i++) for (let j = 0; j <= ny; j++) {
      const z = -1.5 + i * S, y = j * S;
      if (i < nz) seg(P(1, y, z), P(1, y, z + S));
      if (j < ny) seg(P(1, y, z), P(1, y + S, z));
    }
    for (let i = 0; i <= nz; i++) for (let k = 0; k <= nd; k++) {
      const z = -1.5 + i * S, d = k * S;
      if (i < nz) seg(P(d, 2, z), P(d, 2, z + S));
      if (k < nd) seg(P(d, 2, z), P(d + S, 2, z));
    }
    for (const z of [-1.5, 1.5]) for (let k = 0; k <= nd; k++) for (let j = 0; j <= ny; j++) {
      const d = k * S, y = j * S;
      if (k < nd) seg(P(d, y, z), P(d + S, y, z));
      if (j < ny) seg(P(d, y, z), P(d, y + S, z));
    }
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(pts);
    const pos = new THREE.BufferAttribute(arr, 3);
    geo.setAttribute('position', pos);
    nets.push({ pos, orig: arr.slice(), sgn, hit: null });
    return new THREE.LineSegments(geo, netMat);
  };
  for (const sgn of [-1, 1]) {
    const g = new THREE.Group();
    const rr = 0.04;
    for (const z of [-1.5, 1.5]) {
      for (let k = 0; k < 4; k++) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.5, 12), k % 2 ? stripeMat : postMat);
        p.position.set(0, 0.25 + k * 0.5, z);
        p.castShadow = true;
        g.add(p);
      }
    }
    for (let k = 0; k < 6; k++) {
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, 0.5, 12), k % 2 ? stripeMat : postMat);
      bar.rotation.x = Math.PI / 2;
      bar.position.set(0, 2, -1.25 + k * 0.5);
      g.add(bar);
    }
    g.add(makeNet(sgn));
    g.position.x = (sgn * W) / 2;
    scene.add(g);
  }

  // bancos de suplentes (lado oposto à câmara principal, como nas transmissões): estrado,
  // cadeiras individuais nas cores da equipa e abrigo
  // de acrílico; os suplentes sentam-se nas cadeiras (posições exportadas para a vista 3D)
  const benchSeats: { x: number; z: number; y: number }[][] = [[], []];
  const platMat = new THREE.MeshStandardMaterial({ color: '#2b2f36', roughness: 0.8 });
  const acrylic = new THREE.MeshStandardMaterial({ color: '#cfe3f3', transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
  const frameMat = new THREE.MeshStandardMaterial({ color: '#9ca3af', metalness: 0.6, roughness: 0.35 });
  for (const [cx, i] of [[-9, 0], [9, 1]] as const) {
    const bz = -(H / 2 + 2.0);
    const plat = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.1, 1.4), platMat);
    plat.position.set(cx, 0.05, bz - 0.1);
    scene.add(plat);
    // as cadeiras dos dois bancos são do pavilhão: cor da equipa da casa
    const seatMat = new THREE.MeshStandardMaterial({ color: o.teams[0].colors[0], roughness: 0.5 });
    for (let k = 0; k < 10; k++) {
      const x = cx - 2.7 + k * 0.6;
      const pan = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.42), seatMat);
      pan.position.set(x, 0.46, bz);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.06), seatMat);
      back.position.set(x, 0.72, bz - 0.22);
      back.rotation.x = 0.12;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.06), frameMat);
      leg.position.set(x, 0.24, bz - 0.05);
      scene.add(pan, back, leg);
      benchSeats[i].push({ x, z: bz + 0.02, y: 0.49 });
    }
    // abrigo: costas e teto de acrílico com estrutura metálica
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.9), acrylic);
    wall.position.set(cx, 1.0, bz - 0.62);
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.3), acrylic);
    roof.rotation.x = Math.PI / 2 - 0.2;
    roof.position.set(cx, 1.95, bz - 0.05);
    scene.add(wall, roof);
    for (const x of [cx - 3.2, cx + 3.2]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.95, 0.05), frameMat);
      post.position.set(x, 0.98, bz - 0.62);
      scene.add(post);
    }
  }
  // mesa do cronometrista (dois árbitros auxiliares), ao centro, à frente da boca do túnel
  const tableSeats: { x: number; z: number; y: number }[] = [];
  {
    const tm = new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.6 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(3, 0.06, 0.8), new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.5 }));
    top.position.set(0, 0.78, -TABLE_Z);
    const front = new THREE.Mesh(new THREE.BoxGeometry(3, 0.74, 0.04), new THREE.MeshStandardMaterial({ map: canvasTex(512, 128, (c) => {
      c.fillStyle = ct.bg; c.fillRect(0, 0, 512, 128);
      c.fillStyle = ct.a; c.fillRect(0, 0, 256, 10); c.fillStyle = ct.b; c.fillRect(256, 0, 256, 10);
      c.fillStyle = '#fff'; c.font = 'bold 44px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.comp.toUpperCase(), 256, 70, 480);
    }), roughness: 0.6 }));
    front.position.set(0, 0.38, -TABLE_Z + 0.38);
    scene.add(top, front);
    for (const x of [-1.4, 1.4]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.75, 0.7), tm); leg.position.set(x, 0.38, -TABLE_Z); scene.add(leg); }
    for (const x of [-0.6, 0.6]) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.42), tm);
      seat.position.set(x, 0.46, -TABLE_Z - 0.75);
      const sb = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.5, 0.06), tm);
      sb.position.set(x, 0.72, -TABLE_Z - 0.97);
      scene.add(seat, sb);
      tableSeats.push({ x, z: -TABLE_Z - 0.72, y: 0.49 });
    }
  }

  // ---- placas LED à volta do campo ----
  const led = new Led(o);
  const boardMat = (len: number, off: number) => {
    const t = led.texture(len, off);
    return new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.55, roughness: 0.4 });
  };
  const bz = H / 2 + 3.1, bx = W / 2 + 2.6;
  const bzN = TUNNEL_MOUTH + 0.3;
  // do lado dos bancos as placas abrem ao centro para a passagem do túnel de entrada
  const gh = TUNNEL_GAP / 2 + 0.2;
  const half = (W + 4) / 2 - gh;
  const boards: [number, number, number, number, number][] = [
    [-(gh + half / 2), -bzN, half, 0, 0], [gh + half / 2, -bzN, half, 0, 2], [0, bz, W + 4, Math.PI, 3], [-bx, 0, H + 4, Math.PI / 2, 6], [bx, 0, H + 4, -Math.PI / 2, 8],
  ];
  for (const [x, z, len, ry, off] of boards) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.85, 0.12), [
      new THREE.MeshStandardMaterial({ color: '#111' }), new THREE.MeshStandardMaterial({ color: '#111' }),
      new THREE.MeshStandardMaterial({ color: '#111' }), new THREE.MeshStandardMaterial({ color: '#111' }),
      boardMat(len, off), new THREE.MeshStandardMaterial({ color: '#111' }),
    ]);
    m.position.set(x, 0.45, z);
    m.rotation.y = ry;
    scene.add(m);
  }

  // ---- bancadas: filas à medida da lotação ----
  const sideLen = { N: W + 8, S: W + 8, E: H + 4, W: H + 4 };
  // cantos fechados (bacia): cada canto entre duas bancadas leva um leque de lugares em curva
  const cornerList: [number, number][] = [];
  if (pr.corners) for (const sz of [-1, 1]) for (const sx of [-1, 1]) {
    const zs = sz < 0 ? 'N' : 'S', xs = sx < 0 ? 'W' : 'E';
    if (pr.sides.includes(zs) && pr.sides.includes(xs)) cornerList.push([sx, sz]);
  }
  const CORNER_LEN = 9; // comprimento médio de cada canto (m), para repartir a lotação
  const lenTot = pr.sides.reduce((a, s) => a + sideLen[s], 0) + cornerList.length * CORNER_LEN;
  const seatW = 0.5, rowD = 0.85, rise = pr.rake ?? 0.42;
  const front = { N: FRONT_N, S: H / 2 + 4.2, E: W / 2 + 4.6, W: W / 2 + 4.6 };
  const base = pr.base ?? (modern ? 1.2 : 0.6); // altura da primeira fila
  const isBench = (sd: string, row = 99) => pr.benches === true || (Array.isArray(pr.benches) && pr.benches.includes(sd as 'N')) || (!!pr.lowerBenches && row < splitAt(rowsBySide[sd] ?? 99));
  const splitAt = (rows: number) => (pr.upperTier ? Math.ceil(rows * (pr.tierSplit ?? 0.55)) : 99);
  const upD = pr.overhang ? -2.6 : pr.tierGap === 'corredor' ? 0.9 : 1.4, upY = pr.overhang ? 3.2 : pr.tierGap === 'corredor' ? 0.9 : 2.2; // recuo e subida do 2.º anel (em consola: avança por cima do 1.º)
  // letras nas cadeiras (ex.: FCB, FERROL): máscara desenhada num canvas pequeno
  let textMask: ((u: number, row: number, rows: number, len: number) => boolean) | null = null;
  if (pr.seatText) {
    const cw = 240, ch = 40;
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const cx = cv.getContext('2d')!; cx.fillStyle = '#000'; cx.font = `bold ${ch * 0.9}px sans-serif`; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillText(pr.seatText.text, cw / 2, ch / 2 + 2);
    const px = cx.getImageData(0, 0, cw, ch).data;
    textMask = (u, row, rows, len) => {
      const fx = 0.5 + u / (len * 0.75), fy = 1 - (row + 0.5) / rows; // texto em 75% do comprimento, de baixo para cima
      if (fx < 0 || fx >= 1) return false;
      const ix = Math.floor(fx * cw), iy = Math.floor(fy * ch);
      return px[(iy * cw + ix) * 4 + 3] > 120;
    };
  }
  const seats: { p: THREE.Vector3; ry: number; side: string; row: number; u: number; txt?: boolean }[] = [];
  let maxRows = 0;
  const concrete = new THREE.MeshStandardMaterial({ color: modern ? '#9aa3ad' : '#b5b0a6', roughness: 0.9 });
  const rowsBySide: Record<string, number> = {};
  for (const sd of pr.sides) {
    const gap = sd === 'N' ? TUNNEL_GAP : 0; // passagem do túnel pela bancada (sem lugares)
    const perRow = Math.floor((sideLen[sd] - gap) / seatW);
    const cap = Math.round((pr.capacity * sideLen[sd]) / lenTot);
    const rows = Math.max(2, Math.ceil(cap / perRow));
    maxRows = Math.max(maxRows, rows);
    rowsBySide[sd] = rows;
    const ry = sd === 'N' ? 0 : sd === 'S' ? Math.PI : sd === 'E' ? -Math.PI / 2 : Math.PI / 2;
    const out = sd === 'N' || sd === 'W' ? -1 : 1; // para fora do campo
    let left = cap;
    const split = splitAt(rows);
    for (let rI = 0; rI < rows; rI++) {
      // segundo anel: recua e sobe, com camarotes envidraçados (ou só um corredor) no intervalo
      const up = rI >= split;
      const d = front[sd] + rI * rowD + (up ? upD : 0);
      const y = base + rI * rise + (up ? upY : 0);
      if (rI === split && pr.tierGap === 'corredor') {
        // corredor entre anéis: só a frente do 2.º anel (parapeito), sem vidros
        const par = pr.tierAds
          ? new THREE.Mesh(new THREE.BoxGeometry(sideLen[sd], 0.9, 0.15), [concrete, concrete, concrete, concrete, boardMat(sideLen[sd], (sd.charCodeAt(0) * 5) % PANELS), concrete])
          : new THREE.Mesh(new THREE.BoxGeometry(sideLen[sd], 0.9, 0.15), concrete);
        const gy = y - 0.2;
        if (sd === 'N' || sd === 'S') par.position.set(0, gy, out * (d - 0.1));
        else par.position.set(out * (d - 0.1), gy, 0);
        par.rotation.y = sd === 'N' ? 0 : sd === 'S' ? Math.PI : sd === 'E' ? -Math.PI / 2 : Math.PI / 2; // placas viradas para o campo
        scene.add(par);
      } else if (rI === split) {
        const glass = new THREE.Mesh(new THREE.BoxGeometry(sideLen[sd], 1.7, 0.25), new THREE.MeshStandardMaterial({ color: '#9fc3d9', emissive: '#3b5568', roughness: 0.15, metalness: 0.3 }));
        const gy = base + split * rise + 0.9;
        if (sd === 'N' || sd === 'S') glass.position.set(0, gy, out * (front[sd] + split * rowD + 0.4));
        else { glass.rotation.y = Math.PI / 2; glass.position.set(out * (front[sd] + split * rowD + 0.4), gy, 0); }
        scene.add(glass);
      }
      // degrau (do lado dos bancos, em duas metades: a passagem do túnel fica ao meio)
      // por cima do corredor (acima da laje do túnel) a bancada continua inteira
      // o teto do corredor acompanha a rampa: a bancada continua por cima onde houver altura livre
      const ceil = rampFloor(d - FRONT_N) + HEADROOM;
      const overTunnel = gap > 0 && y > ceil + 0.12;
      if (overTunnel) {
        const fill = new THREE.Mesh(new THREE.BoxGeometry(gap + 0.4, y - ceil, rowD), concrete);
        fill.position.set(0, (y + ceil) / 2, out * (d + rowD / 2));
        scene.add(fill);
      }
      const pieces: [number, number][] = gap ? [[-(sideLen[sd] + gap) / 4, (sideLen[sd] - gap) / 2], [(sideLen[sd] + gap) / 4, (sideLen[sd] - gap) / 2]] : [[0, sideLen[sd]]];
      // 2.º anel em consola: os degraus são uma laje suspensa (por baixo continuam as filas do 1.º anel)
      const slab = up && pr.overhang;
      const sh = slab ? 0.6 : y + 0.01, sy = slab ? y - 0.29 : (y + 0.01) / 2;
      for (const [c0, len0] of pieces) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(len0, sh, rowD), concrete);
        step.receiveShadow = true;
        if (sd === 'N' || sd === 'S') step.position.set(c0, sy, out * (d + rowD / 2));
        else { step.rotation.y = Math.PI / 2; step.position.set(out * (d + rowD / 2), sy, c0); }
        scene.add(step);
      }
      const n = Math.min(perRow, left);
      left -= n;
      // lugares da fila, a começar pelo centro (sem os da passagem)
      const us: number[] = [];
      const tot = Math.floor(sideLen[sd] / seatW);
      for (let k = 0; k < tot; k++) {
        const u = (k - (tot - 1) / 2) * seatW;
        if (pr.aisles && Math.round(Math.abs(u) / seatW) % (pr.aisles + 1) === Math.floor(pr.aisles / 2)) continue; // escadas
        if (Math.abs(u) > gap / 2 + 0.2 || !gap || overTunnel) us.push(u);
      }
      us.sort((a, b) => Math.abs(a) - Math.abs(b));
      for (let k = 0; k < n && k < us.length; k++) {
        const u = us[k];
        const p = sd === 'N' || sd === 'S' ? new THREE.Vector3(u, y, out * (d + 0.3)) : new THREE.Vector3(out * (d + 0.3), y, u);
        // sem cadeiras: sentados no degrau (cimento) ou de pé junto à grade
        if (isBench(sd, rI)) p.y -= 0.3;
        if (pr.standing) p.y += 0.4;
        seats.push({ p, ry, side: sd, row: rI, u, txt: !!textMask && pr.seatText!.side === sd && textMask(u, rI, rows, sideLen[sd]) });
      }
    }
    // frente da bancada: LED nos modernos, muro pintado nos outros
    const fl = sideLen[sd];
    const frontsTex = pr.fronts ? canvasTex(2048, 64, (c) => {
      c.fillStyle = pr.fronts!.bg; c.fillRect(0, 0, 2048, 64);
      c.fillStyle = pr.fronts!.fg; c.font = 'bold 34px sans-serif'; c.textBaseline = 'middle';
      const txt = pr.fronts!.text;
      for (let k = 0, x = 30; x < 2048; k++) { c.fillText(txt[k % txt.length], x, 34); x += c.measureText(txt[k % txt.length]).width + 90; }
    }) : null;
    if (frontsTex) { frontsTex.wrapS = THREE.RepeatWrapping; frontsTex.repeat.set(sideLen[sd] / 28, 1); }
    const wallMesh = frontsTex
      ? new THREE.Mesh(new THREE.BoxGeometry(fl, 0.9, 0.12), [concrete, concrete, concrete, concrete, new THREE.MeshStandardMaterial({ map: frontsTex, roughness: 0.6 }), concrete])
      : modern
      ? new THREE.Mesh(new THREE.BoxGeometry(fl, 0.9, 0.1), [concrete, concrete, concrete, concrete, boardMat(fl, (sd.charCodeAt(0) * 3) % PANELS), concrete])
      : new THREE.Mesh(new THREE.BoxGeometry(fl, base + 0.2, 0.15), new THREE.MeshStandardMaterial({ color: o.teams[0].colors[0], roughness: 0.8 }));
    const fy = modern ? base - 0.35 : (base + 0.2) / 2;
    if (sd === 'N' || sd === 'S') wallMesh.position.set(0, fy, out * (front[sd] - 0.05));
    else { wallMesh.position.set(out * (front[sd] - 0.05), fy, 0); }
    wallMesh.rotation.y = sd === 'N' ? 0 : sd === 'S' ? Math.PI : sd === 'E' ? -Math.PI / 2 : Math.PI / 2;
    if (gap) {
      // o muro abre na passagem do túnel
      for (const sg of [-1, 1]) {
        const w2 = wallMesh.clone();
        w2.scale.x = (fl - gap) / 2 / fl;
        w2.position.x = (sg * (fl + gap)) / 4;
        scene.add(w2);
      }
    } else scene.add(wallMesh);
  }
  // cantos em curva (bacia): leque de filas entre as duas bancadas, à mesma altura das filas laterais
  if (cornerList.length) {
    const stepGeos: THREE.BufferGeometry[] = [];
    for (const [sx, sz] of cornerList) {
      const zs = sz < 0 ? 'N' : 'S', xs = sx < 0 ? 'W' : 'E';
      const rows = Math.min(rowsBySide[zs], rowsBySide[xs]);
      const P = new THREE.Vector2(sx * (W / 2 + 4), sz * (H / 2 + 2));
      const dX = front[xs] - (W / 2 + 4), dZ = front[zs] - (H / 2 + 2);
      const split = Math.min(splitAt(rowsBySide[zs]), splitAt(rowsBySide[xs]));
      for (let rI = 0; rI < rows; rI++) {
        const up = rI >= split;
        const y = base + rI * rise + (up ? upY : 0);
        const segs = 10;
        for (let k = 0; k < segs; k++) {
          const a0 = (k / segs) * Math.PI / 2, a1 = ((k + 1) / segs) * Math.PI / 2, am = (a0 + a1) / 2;
          const r0 = dX + (dZ - dX) * (am / (Math.PI / 2)) + rI * rowD + (up ? upD : 0);
          const rm = r0 + rowD / 2;
          const len = rm * (a1 - a0) + 0.05;
          const slab = up && pr.overhang;
          const g = new THREE.BoxGeometry(len, slab ? 0.6 : y + 0.01, rowD);
          const ox = Math.cos(am) * sx, oz = Math.sin(am) * sz; // direção para fora
          g.rotateY(Math.atan2(-ox, -oz));
          g.translate(P.x + ox * rm, slab ? y - 0.29 : (y + 0.01) / 2, P.y + oz * rm);
          stepGeos.push(g);
        }
        // lugares ao longo do arco
        const r0m = (dX + dZ) / 2 + rI * rowD + (up ? upD : 0) + 0.3;
        const nSeats = Math.floor((r0m * Math.PI / 2) / seatW);
        for (let k = 0; k < nSeats; k++) {
          const a = ((k + 0.5) / nSeats) * Math.PI / 2;
          if (pr.aisles && k % (pr.aisles + 1) === Math.floor(pr.aisles / 2)) continue;
          const rr = dX + (dZ - dX) * (a / (Math.PI / 2)) + rI * rowD + (up ? upD : 0) + 0.3;
          const ox = Math.cos(a) * sx, oz = Math.sin(a) * sz;
          const p = new THREE.Vector3(P.x + ox * rr, y, P.y + oz * rr);
          if (isBench(xs, rI)) p.y -= 0.3;
          seats.push({ p, ry: Math.atan2(-ox, -oz), side: a < Math.PI / 4 ? xs : zs, row: rI, u: (a < Math.PI / 4 ? sz * (H / 2 + 2) : sx * (W / 2 + 4)) });
        }
      }
    }
    const merged = mergeGeometries(stepGeos);
    if (merged) { const m = new THREE.Mesh(merged, concrete); m.receiveShadow = true; scene.add(m); }
  }
  const standDepth = maxRows * rowD + (pr.upperTier ? upD : 0);

  // cadeiras (instanciadas)
  const pan = new THREE.BoxGeometry(0.44, 0.08, 0.4);
  pan.translate(0, 0.42, 0);
  const back = new THREE.BoxGeometry(0.44, 0.42, 0.06);
  back.translate(0, 0.62, -0.2);
  const seatGeo = mergeGeometries([pan, back])!;
  const seatMesh = new THREE.InstancedMesh(seatGeo, new THREE.MeshStandardMaterial({ color: pr.seat, roughness: 0.6 }), seats.length);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  let ns = 0;
  const sc0 = new THREE.Color();
  seats.forEach((s) => {
    if (isBench(s.side, s.row) || pr.standing) return;
    // as cadeiras viram-se para o campo (de costas para fora)
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.ry + Math.PI);
    m4.compose(s.p, q, one);
    seatMesh.setMatrixAt(ns, m4);
    if (s.txt) seatMesh.setColorAt(ns, sc0.set(pr.seatText!.color));
    else if (pr.seatMix) seatMesh.setColorAt(ns, sc0.set(pr.seatMix[Math.floor(r() * pr.seatMix.length)]));
    else if (pr.seatText) seatMesh.setColorAt(ns, sc0.set(pr.seat));
    ns++;
  });
  seatMesh.count = ns;
  if (pr.seatMix || pr.seatText) (seatMesh.material as THREE.MeshStandardMaterial).color.set('#ffffff');
  if (ns) scene.add(seatMesh);

  // adeptos: ocupam primeiro os lugares centrais e mais baixos
  const uniforms = { uTime: { value: 0 }, uEx: { value: new THREE.Vector3(0, 0, 0) } };
  const n = Math.min(seats.length, o.crowd);
  // claques: a da casa num topo, a visitante no topo oposto (ou no bloco visitante)
  const ends = pr.sides.filter((x) => x === 'W' || x === 'E');
  const homeUltra = o.ultras?.[0] ? (ends.includes('W') ? 'W' : ends[0] ?? pr.sides[0]) : null;
  const awayUltra = o.ultras?.[1] ? (ends.find((x) => x !== homeUltra) ?? pr.sides.find((x) => x !== homeUltra) ?? null) : null;
  const awaySide = awayUltra ?? (pr.sides.includes('E') ? 'E' : pr.sides.includes('S') ? 'S' : pr.sides[0]);
  const scored = seats.map((s, i) => ({ i, w: s.row * 0.5 + Math.abs(s.u) * 0.08 + r() * 3 - (s.side === homeUltra || s.side === awayUltra ? 12 : 0) }));
  scored.sort((a, b) => a.w - b.w);
  const chosen = scored.slice(0, n).map((x) => seats[x.i]);
  // bloco visitante num dos lados
  const nAway = Math.round(n * o.shares[1]);
  const awayIdx = new Set<number>();
  const awayCands = chosen.map((s, i) => ({ s, i })).filter(({ s }) => s.side === awaySide).sort((a, b) => (a.s.u - b.s.u) * (awaySide === 'E' ? 0 : 1) + a.s.row - b.s.row);
  for (const c of awayCands.slice(0, nAway)) awayIdx.add(c.i);
  const body = new THREE.CapsuleGeometry(0.17, 0.34, 3, 8);
  body.scale(1.15, 1, 0.75);
  body.translate(0, 0.78, 0.02);
  const headG = new THREE.SphereGeometry(0.11, 10, 8);
  headG.translate(0, 1.18, 0.03);
  const bodies = new THREE.InstancedMesh(body, crowdMaterial(null, uniforms), Math.max(1, n));
  const heads = new THREE.InstancedMesh(headG, crowdMaterial(null, uniforms), Math.max(1, n));
  const phase = new Float32Array(Math.max(1, n));
  const team = new Float32Array(Math.max(1, n));
  const neutral = ['#1f2937', '#374151', '#4b5563', '#e5e7eb', '#1e3a8a', '#7c2d12', '#f5f5f4', '#0f172a', '#6b7280'];
  const skins = ['#f6d7c3', '#eac4a4', '#d9a77f', '#c68a5e', '#a86b43', '#7f4f2e', '#5b3820'];
  const col = new THREE.Color();
  chosen.forEach((s, i) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.ry + Math.PI);
    const sc = 0.9 + r() * 0.2;
    m4.compose(s.p, q, new THREE.Vector3(sc, sc, sc));
    bodies.setMatrixAt(i, m4);
    heads.setMatrixAt(i, m4);
    const away = awayIdx.has(i) || s.side === awayUltra;
    const ultra = s.side === homeUltra || s.side === awayUltra;
    const side = away ? 1 : s.side === homeUltra || r() < (o.shares[0] / Math.max(0.01, 1 - o.shares[1])) ? 0 : 2;
    team[i] = side;
    const t = side === 2 ? null : o.teams[side];
    const shirt = t ? (r() < (ultra ? 0.85 : 0.65) ? t.colors[0] : r() < 0.5 ? t.colors[1] : neutral[Math.floor(r() * neutral.length)]) : neutral[Math.floor(r() * neutral.length)];
    bodies.setColorAt(i, col.set(shirt));
    heads.setColorAt(i, col.set(skins[Math.floor(r() * skins.length)]));
    phase[i] = r() * Math.PI * 2;
  });
  for (const m of [bodies, heads]) {
    m.count = n;
    m.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1));
    m.geometry.setAttribute('aTeam', new THREE.InstancedBufferAttribute(team, 1));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.frustumCulled = false;
    scene.add(m);
  }

  // ---- edifício: paredes, janelas, teto e luzes ----
  const hallW = W + 2 * (W / 2 + 4.6 + standDepth + 3 - W / 2);
  const hallD = H + 2 * (FRONT_N + standDepth + 3 - H / 2);
  const hallH = Math.max(11, base + maxRows * rise + (pr.upperTier ? upY : 0) + 6);
  // chão do pavilhão à volta do campo e das bancadas
  // chão do pavilhão com a abertura da rampa do túnel
  const rampEnd = pr.sides.includes('N') ? FRONT_N + standDepth : FRONT_N;
  const floorShape = new THREE.Shape([new THREE.Vector2(-hallW / 2, -hallD / 2), new THREE.Vector2(hallW / 2, -hallD / 2), new THREE.Vector2(hallW / 2, hallD / 2), new THREE.Vector2(-hallW / 2, hallD / 2)]);
  if (rampEnd > FRONT_N) floorShape.holes.push(new THREE.Path([new THREE.Vector2(-TUNNEL_GAP / 2, FRONT_N), new THREE.Vector2(-TUNNEL_GAP / 2, rampEnd), new THREE.Vector2(TUNNEL_GAP / 2, rampEnd), new THREE.Vector2(TUNNEL_GAP / 2, FRONT_N)]));
  const outer = new THREE.Mesh(new THREE.ShapeGeometry(floorShape), new THREE.MeshStandardMaterial({ color: '#3b4b5f', roughness: 0.9 }));
  outer.rotation.x = -Math.PI / 2;
  outer.position.y = -0.005;
  outer.receiveShadow = true;
  scene.add(outer);
  const wallMat = new THREE.MeshStandardMaterial({ color: pr.wall, roughness: 0.95, side: THREE.BackSide });
  // paredes mais altas do que o teto (as coberturas curvas sobem acima delas)
  const hall = new THREE.Mesh(new THREE.BoxGeometry(hallW, hallH + 8, hallD), wallMat);
  hall.position.y = (hallH + 8) / 2 - 0.01;
  scene.add(hall);
  // faixa de cor do clube a meia altura
  const bandMat = new THREE.MeshStandardMaterial({ color: o.teams[0].colors[0], roughness: 0.8 });
  for (const [x, z, len, ry] of [[0, -hallD / 2 + 0.03, hallW, 0], [0, hallD / 2 - 0.03, hallW, Math.PI], [-hallW / 2 + 0.03, 0, hallD, Math.PI / 2], [hallW / 2 - 0.03, 0, hallD, -Math.PI / 2]] as const) {
    const band = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.2), bandMat);
    band.position.set(x, hallH * 0.5, z);
    band.rotation.y = ry;
    scene.add(band);
  }
  if (pr.windows) {
    const winMat = new THREE.MeshBasicMaterial({ color: '#cfe8ff' });
    for (const sg of [-1, 1]) {
      for (let x = -hallW / 2 + 3; x < hallW / 2 - 2; x += 4) {
        const wnd = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), winMat);
        wnd.position.set(x, hallH - 2.2, sg * (hallD / 2 - 0.03));
        wnd.rotation.y = sg > 0 ? Math.PI : 0;
        scene.add(wnd);
      }
    }
  }
  buildRoof(scene, pr, hallW, hallD, hallH);
  if (pr.pillars) {
    const pm = new THREE.MeshStandardMaterial({ color: pr.pillars, roughness: 0.85 });
    for (const sg of [-1, 1]) for (let x = -hallW / 2 + 3; x < hallW / 2; x += 5) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, hallH, 0.5), pm);
      p.position.set(x, hallH / 2, sg * (hallD / 2 - 0.3));
      scene.add(p);
    }
  }
  if (pr.banners) {
    // grandes painéis nas paredes, com anúncios fictícios
    const bt = canvasTex(1024, 256, (c) => {
      c.fillStyle = '#f8fafc'; c.fillRect(0, 0, 1024, 256);
      c.fillStyle = '#1d4ed8'; c.fillRect(0, 200, 1024, 56);
      c.fillStyle = '#111827'; c.font = 'bold 72px sans-serif'; c.fillText(o.profile.name.replace(/Pavilhão (Municipal )?(de |do |da |dos )?/, '').toUpperCase(), 40, 120, 940);
      c.fillStyle = '#fff'; c.font = 'bold 34px sans-serif'; c.fillText('DESPORTO PARA TODOS', 40, 240);
    });
    for (const sg of [-1, 1]) {
      const bn = new THREE.Mesh(new THREE.PlaneGeometry(24, 6), new THREE.MeshStandardMaterial({ map: bt }));
      bn.position.set(sg * 10, hallH * 0.55, sg * (hallD / 2 - 0.06));
      bn.rotation.y = sg > 0 ? Math.PI : 0;
      scene.add(bn);
    }
  }
  if (pr.wallArt) {
    // desenho de linhas (marcações de campo estilizadas) na parede do topo
    const art = canvasTex(1024, 512, (c) => {
      c.fillStyle = pr.wall; c.fillRect(0, 0, 1024, 512);
      c.lineWidth = 5;
      for (let k = 0; k < 26; k++) {
        const cols = Array.isArray(pr.wallArt) ? pr.wallArt : ['#c8102e', '#c8102e', '#111111'];
        c.strokeStyle = cols[k % cols.length];
        if (Array.isArray(pr.wallArt)) { c.fillStyle = cols[(k + 1) % cols.length]; c.globalAlpha = 0.35; c.fillRect(20 + r() * 900, 20 + r() * 400, 80 + r() * 200, 60 + r() * 140); c.globalAlpha = 1; }
        const x = 40 + r() * 900, y = 40 + r() * 400, w = 60 + r() * 220, h = 40 + r() * 160;
        if (k % 4 === 0) { c.beginPath(); c.arc(x, y, h / 2, 0, Math.PI * 2); c.stroke(); } else c.strokeRect(x, y, w, h);
      }
    });
    const wa = new THREE.Mesh(new THREE.PlaneGeometry(hallD * 0.8, hallH * 0.5), new THREE.MeshStandardMaterial({ map: art }));
    wa.position.set(hallW / 2 - 0.05, hallH * 0.42, 0);
    wa.rotation.y = -Math.PI / 2;
    scene.add(wa);
  }
  // ecrã de resultado: suspenso ao centro (pavilhões modernos) ou na parede do topo
  const scoreCv = document.createElement('canvas');
  scoreCv.width = 512; scoreCv.height = 256;
  const scoreTex = new THREE.CanvasTexture(scoreCv);
  scoreTex.colorSpace = THREE.SRGBColorSpace;
  const drawScore = (s: [number, number]) => {
    const c = scoreCv.getContext('2d')!;
    c.fillStyle = '#05080f'; c.fillRect(0, 0, 512, 256);
    c.fillStyle = '#facc15'; c.font = 'bold 26px sans-serif'; c.textAlign = 'center';
    c.fillText(o.comp.toUpperCase(), 256, 40, 480);
    o.teams.forEach((t, i) => {
      const x = i ? 384 : 128;
      c.fillStyle = t.colors[0]; c.fillRect(x - 100, 60, 200, 8);
      c.fillStyle = '#fff'; c.font = 'bold 44px sans-serif';
      c.fillText(t.short, x, 115);
      c.font = 'bold 110px sans-serif';
      c.fillText(String(s[i]), x, 230);
    });
    scoreTex.needsUpdate = true;
  };
  drawScore([0, 0]);
  const scoreMat = new THREE.MeshBasicMaterial({ map: scoreTex });
  if (pr.cube ?? modern) {
    const cube = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.4, 4.2), new THREE.MeshStandardMaterial({ color: '#111827' }));
    cube.add(frame);
    for (let k = 0; k < 4; k++) {
      const sc = new THREE.Mesh(new THREE.PlaneGeometry(4, 2), scoreMat);
      const a = (k * Math.PI) / 2;
      sc.position.set(Math.sin(a) * 2.11, 0, Math.cos(a) * 2.11);
      sc.rotation.y = a;
      cube.add(sc);
    }
    cube.position.y = Math.min(hallH - 3, 10);
    scene.add(cube);
  } else {
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.5), scoreMat);
    sc.position.set(-hallW / 2 + 0.05, hallH * 0.62, 0);
    sc.rotation.y = Math.PI / 2;
    scene.add(sc);
  }

  // iluminação de pavilhão
  scene.background = new THREE.Color(pr.wall);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6b7280, 0.75));
  const sun = new THREE.DirectionalLight(0xfff6ea, 2.1);
  sun.position.set(6, 22, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(o.quality === 'alta' ? 2048 : 1024, o.quality === 'alta' ? 2048 : 1024);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 14, bottom: -14, near: 1, far: 60 });
  scene.add(sun);
  for (const x of [-14, 0, 14]) {
    const l = new THREE.PointLight(0xfff4e0, 70, 45);
    l.position.set(x, hallH - 2.5, 0);
    scene.add(l);
  }

  // túnel de entrada: passagem pela bancada do lado dos bancos (corredor para os balneários) e,
  // na cerimónia, um túnel retrátil (estrutura metálica em tesoura com lona) que vai da bancada até às placas
  const tunnel = new THREE.Group();
  {
    const hasN = pr.sides.includes('N');
    const zBack = hasN ? FRONT_N + standDepth : hallD / 2 - 0.1; // fundo do corredor
    const wG = TUNNEL_GAP;
    // corredor fixo: chão, laje por cima e porta escura para os balneários ao fundo
    const dark = new THREE.MeshBasicMaterial({ color: '#06080b' });
    const corrLen = zBack - FRONT_N;
    const bot = hasN ? -RAMP_DROP : 0;
    if (corrLen > 0.2) {
      // chão: rampa a descer e depois plano até aos balneários
      const fm = new THREE.MeshStandardMaterial({ color: '#3a3f46', roughness: 0.9, side: THREE.DoubleSide });
      const rl = hasN ? Math.min(corrLen, RAMP_DROP / RAMP_SLOPE) : corrLen;
      const rampLen = Math.hypot(rl, rampFloor(rl));
      const ramp = new THREE.Mesh(new THREE.PlaneGeometry(wG, rampLen), fm);
      ramp.rotation.x = -Math.PI / 2 - Math.atan2(-rampFloor(rl), rl);
      ramp.position.set(0, rampFloor(rl) / 2 + 0.005, -(FRONT_N + rl / 2));
      scene.add(ramp);
      if (corrLen > rl) {
        const flat = new THREE.Mesh(new THREE.PlaneGeometry(wG, corrLen - rl), fm);
        flat.rotation.x = -Math.PI / 2;
        flat.position.set(0, bot + 0.005, -(FRONT_N + rl + (corrLen - rl) / 2));
        scene.add(flat);
      }
      // paredes do corredor (descem até ao fundo da rampa)
      for (const sg of [-1, 1]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.6 - bot, corrLen), concrete);
        wall.position.set(sg * (wG / 2 + 0.05), (2.6 + bot) / 2, -(FRONT_N + corrLen / 2));
        scene.add(wall);
      }
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(wG + 0.4, 0.4, 0.2), new THREE.MeshStandardMaterial({ color: ct.bg }));
      lintel.position.set(0, 2.75, -FRONT_N - 0.1);
      if (!hasN) scene.add(lintel);
    }
    const door = new THREE.Mesh(new THREE.PlaneGeometry(wG, HEADROOM), dark);
    door.position.set(0, bot + HEADROOM / 2, -(zBack - 0.02));
    scene.add(door);

    // túnel retrátil (só na cerimónia)
    const z0 = TUNNEL_MOUTH, z1 = FRONT_N;
    const len = z1 - z0;
    const tw = wG - 0.3, th = 2.4;
    const lona = canvasTex(1024, 256, (c) => {
      c.fillStyle = '#5b6f86'; c.fillRect(0, 0, 1024, 256);
      // estrutura em tesoura por trás da lona
      c.strokeStyle = 'rgba(230,235,240,.55)'; c.lineWidth = 6;
      for (let x = 0; x < 1024; x += 128) { c.beginPath(); c.moveTo(x, 40); c.lineTo(x + 128, 216); c.moveTo(x + 128, 40); c.lineTo(x, 216); c.stroke(); }
      c.fillStyle = ct.bg; c.fillRect(0, 0, 1024, 28);
      c.fillStyle = '#fff'; c.font = 'bold 22px sans-serif'; c.textBaseline = 'middle';
      for (let x = 20; x < 1024; x += 340) c.fillText(o.comp.toUpperCase(), x, 15);
    });
    const lonaMat = new THREE.MeshStandardMaterial({ map: lona, side: THREE.DoubleSide, roughness: 0.75 });
    const frame = new THREE.MeshStandardMaterial({ color: '#d1d5db', metalness: 0.6, roughness: 0.35 });
    for (const sg of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.PlaneGeometry(len, th), lonaMat);
      side.rotation.y = Math.PI / 2;
      side.position.set(sg * tw / 2, th / 2, -(z0 + len / 2));
      tunnel.add(side);
      // rodas da estrutura
      for (let k = 0; k <= 2; k++) {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 14), new THREE.MeshStandardMaterial({ color: '#111' }));
        wh.rotation.z = Math.PI / 2;
        wh.position.set(sg * (tw / 2 + 0.06), 0.14, -(z0 + 0.3 + (k * (len - 0.6)) / 2));
        tunnel.add(wh);
      }
    }
    // teto plano com cantos arredondados (como nos túneis retráteis reais)
    const roofMat = new THREE.MeshStandardMaterial({ color: '#5b6f86', roughness: 0.75 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(tw - 0.1, 0.06, len), roofMat);
    top.position.set(0, th + 0.12, -(z0 + len / 2));
    tunnel.add(top);
    for (const sg of [-1, 1]) {
      const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, len, 10, 1, false, sg > 0 ? 0 : Math.PI, Math.PI), roofMat);
      edge.rotation.x = Math.PI / 2;
      edge.position.set(sg * (tw / 2 - 0.06), th, -(z0 + len / 2));
      tunnel.add(edge);
    }
    // pórtico na boca, com o nome da competição
    const head = new THREE.Mesh(new THREE.BoxGeometry(tw + 0.2, 0.5, 0.12), new THREE.MeshStandardMaterial({ map: canvasTex(512, 96, (c) => {
      c.fillStyle = ct.bg; c.fillRect(0, 0, 512, 96);
      c.fillStyle = ct.a; c.fillRect(0, 84, 256, 12); c.fillStyle = ct.b; c.fillRect(256, 84, 256, 12);
      c.fillStyle = '#fff'; c.font = 'bold 42px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.comp.toUpperCase(), 256, 44, 490);
    }) }));
    head.position.set(0, th + 0.2, -z0 + 0.02);
    tunnel.add(head);
    for (const sg of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, th + 0.4, 0.1), frame);
      post.position.set(sg * (tw / 2 + 0.05), (th + 0.4) / 2, -z0);
      tunnel.add(post);
    }
    // relva sintética no chão do túnel (como nos túneis reais)
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(tw, len), new THREE.MeshStandardMaterial({ color: '#2f8f3a', roughness: 1 }));
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(0, 0.012, -(z0 + len / 2));
    tunnel.add(mat);
  }
  tunnel.visible = false;
  scene.add(tunnel);

  // claques: bandeiras, tifo e tochas
  const ultras: { sd: number; u: ReturnType<typeof buildUltras> }[] = [];
  const front0 = { N: FRONT_N, S: H / 2 + 4.2, E: W / 2 + 4.6, W: W / 2 + 4.6 };
  for (const [sd, side] of [[0, homeUltra], [1, awayUltra]] as const) {
    if (!side) continue;
    const t = o.teams[sd];
    ultras.push({ sd, u: buildUltras(scene, { side, out: side === 'N' || side === 'W' ? -1 : 1, front: front0[side], rows: rowsBySide[side] ?? 6, rowD, rise, base, width: side === 'E' || side === 'W' ? H + 4 : W + 8, colors: t.colors, name: t.name ?? t.short }, 99 + sd) });
  }
  let ceremony = false;
  let ceremonyStart = 0;
  const flareUntil = [-1, -1];

  return {
    standDepth,
    height: hallH,
    benchSeats,
    tableSeats,
    groundAt: (x: number, z: number) => (pr.sides.includes('N') && Math.abs(x) < TUNNEL_GAP / 2 && z < -FRONT_N ? rampFloor(-z - FRONT_N) : 0),
    netHit(sgn: number, y: number, z: number, amp = 0.35) {
      const n = nets.find((x) => x.sgn === sgn);
      if (n) n.hit = { t: uniforms.uTime.value, y, z, amp };
    },
    update(now: number, ex: [number, number]) {
      uniforms.uTime.value = now;
      // rede a ondular depois de a bola entrar (empurrada para trás junto ao ponto de impacto, depois oscila e assenta)
      for (const n of nets) {
        if (!n.hit) continue;
        const e = now - n.hit.t;
        const arr = n.pos.array as Float32Array;
        if (e > 2.5) { arr.set(n.orig); n.hit = null; n.pos.needsUpdate = true; continue; }
        const w = n.hit.amp * Math.exp(-e * 2.2) * Math.cos(e * 9) * Math.min(1, e * 12);
        for (let i = 0; i < arr.length; i += 3) {
          const d = Math.abs(n.orig[i]);
          const g2 = Math.exp(-((n.orig[i + 1] - n.hit.y) ** 2 + (n.orig[i + 2] - n.hit.z) ** 2) / 0.6);
          arr[i] = n.orig[i] + n.sgn * w * g2 * d;
          arr[i + 1] = n.orig[i + 1] - Math.abs(w) * g2 * d * 0.15;
        }
        n.pos.needsUpdate = true;
      }
      const base0 = 0.08;
      const c = ceremony ? 0.7 : 0;
      uniforms.uEx.value.set(Math.max(base0, ex[0], c), Math.max(base0, ex[1], c), Math.max(base0 * 0.5, Math.max(ex[0], ex[1]) * 0.3));
      led.update(now);
      // na entrada: primeiro o tifo, depois (quando o baixam) acendem-se as tochas
      const ce = ceremony ? now - ceremonyStart : -1;
      for (const x of ultras) x.u.update(now, ce >= 0 && ce < 12, ce >= 9 || now < flareUntil[x.sd]);
    },
    setCeremony(on: boolean) {
      if (on && !ceremony) ceremonyStart = uniforms.uTime.value;
      ceremony = on;
      tunnel.visible = on;
    },
    setScore(s: [number, number]) {
      led.score = s;
      drawScore(s);
    },
    goal(side: number) {
      led.goal(side, uniforms.uTime.value);
      flareUntil[side] = uniforms.uTime.value + 9; // tochas na claque de quem marcou
    },
  };
}
