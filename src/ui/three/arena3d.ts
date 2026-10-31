// Pavilhão em 3D: bancadas à medida da lotação real, cadeiras, adeptos (conforme a assistência,
// com as cores de cada equipa e a mexer-se), teto, iluminação, janelas, ecrã de resultado e
// placas LED de publicidade animadas (anúncios fictícios, competição, resultado, golo).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import type { ArenaProfile } from '../../core/attendance';
import { buildRoof } from './roof3d';
import { buildUltras } from './ultras3d';

export const W = 40; // comprimento do campo (m)
export const H = 20; // largura do campo (m)

export interface ArenaOpts {
  profile: ArenaProfile;
  crowd: number;
  shares: [number, number];
  comp: string; // nome da competição
  stage: string; // jornada / eliminatória
  teams: [{ short: string; colors: [string, string]; name?: string }, { short: string; colors: [string, string]; name?: string }];
  ultras?: [boolean, boolean]; // claque organizada de cada equipa (só em jogos grandes)
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
    for (const x of [-5, 5]) { c.beginPath(); c.moveTo(X(x), Z(H / 2)); c.lineTo(X(x), Z(H / 2 + 0.6)); c.stroke(); }
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
    t.repeat.set(lengthM / PANEL_M / PANELS, 1);
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
  setCeremony(on: boolean): void;
  standDepth: number;
  height: number;
}

export function buildArena(scene: THREE.Scene, o: ArenaOpts): ArenaHandle {
  const pr = o.profile;
  const r = rng(pr.name.length * 131 + pr.capacity);
  const modern = pr.style === 'moderno';
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 8, H + 8), new THREE.MeshStandardMaterial({ map: floorTexture('#ffffff', pr.floor ?? { court: '#c08a4f', surround: '#c08a4f', wood: true }), roughness: 0.45, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // balizas 3 x 2 m
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xd61f26, roughness: 0.35 });
  const netMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.4 });
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
    const net = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3, 6, 10, 14), netMat);
    net.position.set(sgn * 0.5, 1, 0);
    g.add(net);
    g.position.x = (sgn * W) / 2;
    scene.add(g);
  }

  // bancos de suplentes e mesa do cronometrista (lado sul)
  const benchMat = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.6 });
  for (const [x, i] of [[-9, 0], [9, 1]] as const) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 0.8), new THREE.MeshStandardMaterial({ color: o.teams[i].colors[0], transparent: true, opacity: 0.55 }));
    b.position.set(x, 0.55, H / 2 + 1.9);
    scene.add(b);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.45, 0.6), benchMat);
    seat.position.set(x, 0.22, H / 2 + 1.9);
    scene.add(seat);
  }
  const table = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 0.8), new THREE.MeshStandardMaterial({ color: '#e5e7eb' }));
  table.position.set(0, 0.4, H / 2 + 1.9);
  scene.add(table);

  // ---- placas LED à volta do campo ----
  const led = new Led(o);
  const boardMat = (len: number, off: number) => {
    const t = led.texture(len, off);
    return new THREE.MeshStandardMaterial({ map: t, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: 0.55, roughness: 0.4 });
  };
  const bz = H / 2 + 3.1, bx = W / 2 + 2.6;
  const boards: [number, number, number, number, number][] = [
    [0, -bz, W + 4, 0, 0], [0, bz, W + 4, Math.PI, 3], [-bx, 0, H + 4, Math.PI / 2, 6], [bx, 0, H + 4, -Math.PI / 2, 8],
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
  const lenTot = pr.sides.reduce((a, s) => a + sideLen[s], 0);
  const seatW = 0.5, rowD = 0.85, rise = 0.42;
  const front = { N: H / 2 + 4.2, S: H / 2 + 4.2, E: W / 2 + 4.6, W: W / 2 + 4.6 };
  const base = pr.base ?? (modern ? 1.2 : 0.6); // altura da primeira fila
  const isBench = (sd: string) => pr.benches === true || (Array.isArray(pr.benches) && pr.benches.includes(sd as 'N'));
  const seats: { p: THREE.Vector3; ry: number; side: string; row: number; u: number }[] = [];
  let maxRows = 0;
  const concrete = new THREE.MeshStandardMaterial({ color: modern ? '#9aa3ad' : '#b5b0a6', roughness: 0.9 });
  const rowsBySide: Record<string, number> = {};
  for (const sd of pr.sides) {
    const perRow = Math.floor(sideLen[sd] / seatW);
    const cap = Math.round((pr.capacity * sideLen[sd]) / lenTot);
    const rows = Math.max(2, Math.ceil(cap / perRow));
    maxRows = Math.max(maxRows, rows);
    rowsBySide[sd] = rows;
    const ry = sd === 'N' ? 0 : sd === 'S' ? Math.PI : sd === 'E' ? -Math.PI / 2 : Math.PI / 2;
    const out = sd === 'N' || sd === 'W' ? -1 : 1; // para fora do campo
    let left = cap;
    const split = pr.upperTier ? Math.ceil(rows * 0.55) : 99;
    for (let rI = 0; rI < rows; rI++) {
      // segundo anel: recua e sobe, com camarotes envidraçados no intervalo
      const up = rI >= split;
      const d = front[sd] + rI * rowD + (up ? 1.4 : 0);
      const y = base + rI * rise + (up ? 2.2 : 0);
      if (rI === split) {
        const glass = new THREE.Mesh(new THREE.BoxGeometry(sideLen[sd], 1.7, 0.25), new THREE.MeshStandardMaterial({ color: '#9fc3d9', emissive: '#3b5568', roughness: 0.15, metalness: 0.3 }));
        const gy = base + split * rise + 0.9;
        if (sd === 'N' || sd === 'S') glass.position.set(0, gy, out * (front[sd] + split * rowD + 0.4));
        else { glass.rotation.y = Math.PI / 2; glass.position.set(out * (front[sd] + split * rowD + 0.4), gy, 0); }
        scene.add(glass);
      }
      // degrau
      const step = new THREE.Mesh(new THREE.BoxGeometry(sideLen[sd], y + 0.01, rowD), concrete);
      step.receiveShadow = true;
      if (sd === 'N' || sd === 'S') step.position.set(0, (y + 0.01) / 2, out * (d + rowD / 2));
      else { step.rotation.y = Math.PI / 2; step.position.set(out * (d + rowD / 2), (y + 0.01) / 2, 0); }
      scene.add(step);
      const n = Math.min(perRow, left);
      left -= n;
      for (let k = 0; k < n; k++) {
        const u = (k - (n - 1) / 2) * seatW;
        const p = sd === 'N' || sd === 'S' ? new THREE.Vector3(u, y, out * (d + 0.3)) : new THREE.Vector3(out * (d + 0.3), y, u);
        // sem cadeiras: sentados no degrau (cimento) ou de pé junto à grade
        if (isBench(sd)) p.y -= 0.3;
        if (pr.standing) p.y += 0.4;
        seats.push({ p, ry, side: sd, row: rI, u });
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
    scene.add(wallMesh);
  }
  const standDepth = maxRows * rowD + (pr.upperTier ? 1.4 : 0);

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
    if (isBench(s.side) || pr.standing) return;
    // as cadeiras viram-se para o campo (de costas para fora)
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.ry + Math.PI);
    m4.compose(s.p, q, one);
    seatMesh.setMatrixAt(ns, m4);
    if (pr.seatMix) seatMesh.setColorAt(ns, sc0.set(pr.seatMix[Math.floor(r() * pr.seatMix.length)]));
    ns++;
  });
  seatMesh.count = ns;
  if (pr.seatMix) (seatMesh.material as THREE.MeshStandardMaterial).color.set('#ffffff');
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
  const hallD = H + 2 * (H / 2 + 4.2 + standDepth + 3 - H / 2);
  const hallH = Math.max(11, base + maxRows * rise + (pr.upperTier ? 2.2 : 0) + 6);
  // chão do pavilhão à volta do campo e das bancadas
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(hallW, hallD), new THREE.MeshStandardMaterial({ color: '#3b4b5f', roughness: 0.9 }));
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
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 14, bottom: -14, near: 1, far: 60 });
  scene.add(sun);
  for (const x of [-14, 0, 14]) {
    const l = new THREE.PointLight(0xfff4e0, 70, 45);
    l.position.set(x, hallH - 2.5, 0);
    scene.add(l);
  }

  // claques: bandeiras, tifo e tochas
  const ultras: { sd: number; u: ReturnType<typeof buildUltras> }[] = [];
  const front0 = { N: H / 2 + 4.2, S: H / 2 + 4.2, E: W / 2 + 4.6, W: W / 2 + 4.6 };
  for (const [sd, side] of [[0, homeUltra], [1, awayUltra]] as const) {
    if (!side) continue;
    const t = o.teams[sd];
    ultras.push({ sd, u: buildUltras(scene, { side, out: side === 'N' || side === 'W' ? -1 : 1, front: front0[side], rows: rowsBySide[side] ?? 6, rowD, rise, base, width: side === 'E' || side === 'W' ? H + 4 : W + 8, colors: t.colors, name: t.name ?? t.short }, 99 + sd) });
  }
  let ceremony = false;
  const flareUntil = [-1, -1];

  return {
    standDepth,
    height: hallH,
    update(now: number, ex: [number, number]) {
      uniforms.uTime.value = now;
      const base0 = 0.08;
      const c = ceremony ? 0.7 : 0;
      uniforms.uEx.value.set(Math.max(base0, ex[0], c), Math.max(base0, ex[1], c), Math.max(base0 * 0.5, Math.max(ex[0], ex[1]) * 0.3));
      led.update(now);
      for (const x of ultras) x.u.update(now, ceremony, ceremony || now < flareUntil[x.sd]);
    },
    setCeremony(on: boolean) {
      ceremony = on;
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
