// Momentos importantes em 3D: a mesma jogada do 2D (coreografia), com pavilhão, jogadores, bola,
// várias câmaras e repetição. Movimento contínuo, sem cortes.
import * as THREE from 'three';

import type { Act, Choreo } from '../../core/visual/choreo';

export type CameraId = 'tv' | 'baliza' | 'aerea' | 'jogador';

export interface ActorInfo {
  side: 0 | 1;
  number: number | null;
  gk: boolean;
}

// ---------- utilidades ----------
const W = 40; // comprimento (m)
const H = 20; // largura (m)
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)), ((s ^= s >>> 16) >>> 0) / 4294967296);
}

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// ---------- pavilhão ----------
function floorTexture() {
  const S = 51.2; // px por metro
  const pad = 2; // margem à volta do campo
  return canvasTex((W + pad * 2) * S, (H + pad * 2) * S, (c) => {
    // madeira
    c.fillStyle = '#b97a3f';
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    for (let i = 0; i < c.canvas.height; i += 14) {
      c.fillStyle = i % 28 ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.03)';
      c.fillRect(0, i, c.canvas.width, 7);
    }
    // área exterior mais escura
    c.fillStyle = 'rgba(40,60,90,0.55)';
    c.fillRect(0, 0, c.canvas.width, pad * S);
    c.fillRect(0, (H + pad) * S, c.canvas.width, pad * S);
    c.fillRect(0, 0, pad * S, c.canvas.height);
    c.fillRect((W + pad) * S, 0, pad * S, c.canvas.height);
    const X = (m: number) => (m + W / 2 + pad) * S;
    const Z = (m: number) => (m + H / 2 + pad) * S;
    c.strokeStyle = '#fff';
    c.lineWidth = 0.08 * S;
    c.strokeRect(X(-W / 2), Z(-H / 2), W * S, H * S);
    c.beginPath(); c.moveTo(X(0), Z(-H / 2)); c.lineTo(X(0), Z(H / 2)); c.stroke();
    c.beginPath(); c.arc(X(0), Z(0), 3 * S, 0, Math.PI * 2); c.stroke();
    // áreas de grande penalidade (quartos de círculo de 6 m a partir dos postes + segmento)
    for (const sgn of [-1, 1]) {
      const gx = X((sgn * W) / 2);
      c.beginPath();
      c.arc(gx, Z(-1.58), 6 * S, sgn < 0 ? -Math.PI / 2 : Math.PI, sgn < 0 ? 0 : -Math.PI / 2, false);
      c.stroke();
      c.beginPath();
      c.arc(gx, Z(1.58), 6 * S, sgn < 0 ? 0 : Math.PI / 2, sgn < 0 ? Math.PI / 2 : Math.PI, false);
      c.stroke();
      c.beginPath(); c.moveTo(gx - sgn * 6 * S, Z(-1.58)); c.lineTo(gx - sgn * 6 * S, Z(1.58)); c.stroke();
      for (const d of [6, 10]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(gx - sgn * d * S, Z(0), 0.12 * S, 0, Math.PI * 2); c.fill(); }
    }
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(X(0), Z(0), 0.12 * S, 0, Math.PI * 2); c.fill();
  });
}

function buildArena(scene: THREE.Scene, arenaName: string) {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W + 4, H + 4), new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.55, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // balizas 3 x 2 m
  const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const netMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.35 });
  for (const sgn of [-1, 1]) {
    const g = new THREE.Group();
    const r = 0.04;
    for (const z of [-1.5, 1.5]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2, 12), postMat);
      p.position.set(0, 1, z);
      p.castShadow = true;
      g.add(p);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 3, 12), postMat);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(0, 2, 0);
    g.add(bar);
    const net = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 3, 6, 10, 14), netMat);
    net.position.set(sgn * 0.5, 1, 0);
    g.add(net);
    g.position.x = (sgn * W) / 2;
    scene.add(g);
  }

  // placas de publicidade (originais do jogo)
  const adTex = canvasTex(1024, 64, (c) => {
    const items = ['FUTSAL MANAGER 2027', arenaName.toUpperCase(), 'FUTSAL MANAGER 2027', 'DESPORTO E PAIXÃO'];
    c.fillStyle = '#0b1220'; c.fillRect(0, 0, 1024, 64);
    items.forEach((t, i) => {
      c.fillStyle = i % 2 ? '#00a651' : '#e30613';
      c.fillRect(i * 256, 0, 256, 64);
      c.fillStyle = '#fff'; c.font = 'bold 19px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(t.length > 20 ? t.slice(0, 19) + '…' : t, i * 256 + 128, 33);
    });
  });
  adTex.wrapS = THREE.RepeatWrapping;
  const adMat = new THREE.MeshStandardMaterial({ map: adTex, emissive: 0x222222, emissiveMap: adTex });
  const boards: [number, number, number, number][] = [[0, H / 2 + 2.2, W + 4, 0], [0, -H / 2 - 2.2, W + 4, Math.PI], [W / 2 + 2.2, 0, H + 4, -Math.PI / 2], [-W / 2 - 2.2, 0, H + 4, Math.PI / 2]];
  for (const [x, z, len, ry] of boards) {
    const t = adTex.clone();
    t.needsUpdate = true;
    t.repeat.set(len / 16, 1);
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.9, 0.15), new THREE.MeshStandardMaterial({ map: t, emissive: 0x333333, emissiveMap: t }));
    m.position.set(x, 0.45, z);
    m.rotation.y = ry;
    scene.add(m);
  }
  void adMat;

  // bancadas com público
  const crowd = canvasTex(512, 256, (c) => {
    c.fillStyle = '#1f2937'; c.fillRect(0, 0, 512, 256);
    const cols = ['#e30613', '#00a651', '#f5f5f5', '#1d4ed8', '#facc15', '#111827', '#9ca3af', '#7f1d1d'];
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = cols[(i * 7) % cols.length];
      const x = (i * 37) % 512, y = ((i * 91) % 256);
      c.fillRect(x, y, 5, 7);
      c.fillStyle = '#e8c39e'; c.fillRect(x + 1, y - 3, 3, 3);
    }
  });
  crowd.wrapS = crowd.wrapT = THREE.RepeatWrapping;
  const standMat = new THREE.MeshStandardMaterial({ map: crowd, roughness: 0.9 });
  const mkStand = (len: number, depth: number, x: number, z: number, ry: number) => {
    const g = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const t = crowd.clone(); t.needsUpdate = true; t.repeat.set(len / 6, 0.3);
      const step = new THREE.Mesh(new THREE.BoxGeometry(len, 0.45, depth / 8), new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }));
      step.position.set(0, 1.4 + i * 0.55, i * (depth / 8));
      g.add(step);
    }
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    scene.add(g);
  };
  void standMat;
  mkStand(W + 10, 10, 0, H / 2 + 3.5, 0);
  mkStand(W + 10, 10, 0, -H / 2 - 3.5, Math.PI);
  mkStand(H + 6, 8, W / 2 + 4, 0, Math.PI / 2);
  mkStand(H + 6, 8, -W / 2 - 4, 0, -Math.PI / 2);

  // paredes e teto
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x111827, side: THREE.BackSide });
  const hall = new THREE.Mesh(new THREE.BoxGeometry(W + 40, 22, H + 40), wallMat);
  hall.position.y = 10;
  scene.add(hall);

  // iluminação de pavilhão
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 0.9));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(6, 22, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 14, bottom: -14, near: 1, far: 60 });
  scene.add(sun);
  for (const x of [-14, 0, 14]) {
    const l = new THREE.PointLight(0xfff4e0, 60, 40);
    l.position.set(x, 12, 0);
    scene.add(l);
  }
}

// ---------- jogadores ----------
// Corpo articulado: ancas, coxas e canelas (joelhos), braços e antebraços (cotovelos), tronco e cabeça.
interface Actor {
  g: THREE.Group; // posição e orientação no campo
  body: THREE.Group; // inclinações, mergulhos, carrinhos (pivô nas ancas)
  thigh: THREE.Object3D[];
  shin: THREE.Object3D[];
  arm: THREE.Object3D[];
  fore: THREE.Object3D[];
  prev: THREE.Vector3;
  heading: number;
  phase: number; // ciclo da corrida
  speed: number;
  init: boolean;
}

const HIP = 0.92;

function numberTex(n: number | null, color: string, text: string) {
  return canvasTex(128, 128, (c) => {
    c.fillStyle = color; c.fillRect(0, 0, 128, 128);
    c.fillStyle = text; c.font = 'bold 84px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(n ?? ''), 64, 70);
  });
}

function limb(len: number, w: number, mat: THREE.Material) {
  const pivot = new THREE.Object3D();
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, w), mat);
  m.position.y = -len / 2;
  m.castShadow = true;
  pivot.add(m);
  return pivot;
}

function makePlayer(shirt: string, shorts: string, number: number | null, skin: string, hair: string, gk: boolean) {
  const g = new THREE.Group();
  const body = new THREE.Group();
  body.position.y = HIP;
  g.add(body);
  const shirtMat = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.7 });
  const shortsMat = new THREE.MeshStandardMaterial({ color: shorts, roughness: 0.7 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.8 });
  const sockMat = new THREE.MeshStandardMaterial({ color: gk ? shorts : shirt, roughness: 0.8 });
  const bootMat = new THREE.MeshStandardMaterial({ color: '#111827', roughness: 0.5 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hair, roughness: 0.9 });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.23), shirtMat);
  torso.position.y = 0.36;
  torso.castShadow = true;
  body.add(torso);
  const light = new THREE.Color(shirt).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ map: numberTex(number, shirt, light ? '#111' : '#fff') }));
  back.position.set(0, 0.4, -0.118);
  back.rotation.y = Math.PI;
  body.add(back);
  const front = back.clone();
  front.rotation.y = 0;
  front.scale.set(0.45, 0.45, 1);
  front.position.set(0.1, 0.5, 0.118);
  body.add(front);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), skinMat);
  neck.position.y = 0.7;
  body.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), skinMat);
  head.position.y = 0.83;
  head.castShadow = true;
  body.add(head);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
  cap.position.y = 0.845;
  cap.rotation.x = -0.25;
  body.add(cap);
  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.24), shortsMat);
  hips.position.y = 0.0;
  body.add(hips);
  const thigh: THREE.Object3D[] = [], shin: THREE.Object3D[] = [], arm: THREE.Object3D[] = [], fore: THREE.Object3D[] = [];
  for (const x of [-0.1, 0.1]) {
    const th = limb(0.44, 0.15, shortsMat);
    th.position.set(x, -0.02, 0);
    // pele por baixo dos calções
    const skinT = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.22, 0.13), skinMat);
    skinT.position.y = -0.33;
    th.add(skinT);
    const sh = limb(0.44, 0.12, sockMat);
    sh.position.y = -0.44;
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.08, 0.24), bootMat);
    boot.position.set(0, -0.44, 0.05);
    boot.castShadow = true;
    sh.add(boot);
    th.add(sh);
    body.add(th);
    thigh.push(th);
    shin.push(sh);
  }
  for (const x of [-0.26, 0.26]) {
    const a = limb(0.3, 0.1, shirtMat);
    a.position.set(x, 0.6, 0);
    const fo = limb(0.28, 0.085, gk ? shirtMat : skinMat);
    fo.position.y = -0.3;
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.05), gk ? new THREE.MeshStandardMaterial({ color: '#f5f5f5' }) : skinMat);
    hand.position.y = -0.31;
    fo.add(hand);
    a.add(fo);
    body.add(a);
    arm.push(a);
    fore.push(fo);
  }
  return { g, body, thigh, shin, arm, fore };
}

const ease = (k: number) => k * k * (3 - 2 * k);
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));

/** Pose do jogador conforme a corrida e a ação em curso. */
function pose(a: Actor, act: Act | undefined, gk: boolean, near: boolean, dt: number) {
  const { body, thigh, shin, arm, fore } = a;
  // reinicia
  body.position.set(0, HIP, 0);
  body.rotation.set(0, 0, 0);
  a.g.position.y = 0;
  for (const o of [...thigh, ...shin, ...arm, ...fore]) o.rotation.set(0, 0, 0);
  const sp = a.speed;
  a.phase += dt * (4 + sp * 1.35);
  const amp = Math.min(1, sp / 6.5);
  const s = Math.sin(a.phase);
  // corrida (ou postura de espera)
  thigh[0].rotation.x = s * 0.9 * amp;
  thigh[1].rotation.x = -s * 0.9 * amp;
  shin[0].rotation.x = -Math.max(0, -Math.cos(a.phase)) * 1.4 * amp - 0.08;
  shin[1].rotation.x = -Math.max(0, Math.cos(a.phase)) * 1.4 * amp - 0.08;
  arm[0].rotation.x = -s * 0.8 * amp;
  arm[1].rotation.x = s * 0.8 * amp;
  fore[0].rotation.x = -0.4 - amp * 0.9;
  fore[1].rotation.x = -0.4 - amp * 0.9;
  arm[0].rotation.z = 0.08;
  arm[1].rotation.z = -0.08;
  body.rotation.x = amp * 0.22;
  body.position.y = HIP - Math.abs(Math.cos(a.phase)) * 0.04 * amp;
  if (gk && near && !act && sp < 2.5) {
    // guarda-redes em posição de espera: pernas fletidas, braços abertos
    thigh[0].rotation.x = thigh[1].rotation.x = 0.55;
    shin[0].rotation.x = shin[1].rotation.x = -0.95;
    thigh[0].rotation.z = -0.15; thigh[1].rotation.z = 0.15;
    body.position.y = HIP - 0.17;
    body.rotation.x = 0.3;
    arm[0].rotation.set(-0.5, 0, 0.7);
    arm[1].rotation.set(-0.5, 0, -0.7);
    fore[0].rotation.x = fore[1].rotation.x = -0.5;
  }
  if (!act) return;
  const k = act.k;
  switch (act.kind) {
    case 'pass':
    case 'shoot': {
      // perna direita: recua, bate na bola e acompanha
      const big = act.kind === 'shoot' ? 1.35 : 0.85;
      const back = k < 0.5 ? ease(k / 0.5) : 0;
      const hit = k >= 0.5 ? ease(clamp01((k - 0.5) / 0.3)) : 0;
      thigh[1].rotation.x = k < 0.5 ? -0.75 * big * back : lerp(-0.75 * big, 1.1 * big, hit);
      shin[1].rotation.x = k < 0.5 ? -1.5 * back : lerp(-1.5, -0.05, hit);
      thigh[0].rotation.x = -0.15;
      shin[0].rotation.x = -0.25;
      arm[0].rotation.set(-0.3, 0, 0.9);
      arm[1].rotation.set(0.4, 0, -0.5);
      body.rotation.x = act.kind === 'shoot' ? -0.15 + hit * 0.3 : 0.05;
      body.rotation.y = (k < 0.5 ? -0.25 * back : lerp(-0.25, 0.2, hit));
      break;
    }
    case 'throw': {
      const up = k < 0.6 ? ease(k / 0.6) : 1 - ease((k - 0.6) / 0.4);
      arm[1].rotation.x = -Math.PI * 0.9 * up - (k > 0.6 ? 0.6 : 0);
      arm[0].rotation.set(-0.4, 0, 0.6);
      thigh[0].rotation.x = 0.35;
      body.rotation.x = -0.2 * up + 0.2 * (1 - up);
      break;
    }
    case 'dive': {
      // mergulho para o lado da bola: voa, estica os braços e cai
      const local = act.side ?? 1;
      const up = ease(clamp01(k * 2.4));
      const roll = (Math.PI / 2) * up * 0.95;
      body.rotation.z = -local * roll;
      const h = (act.h ?? 0.5) * 0.8;
      const air = Math.sin(clamp01(k * 1.6) * Math.PI) * h;
      body.position.y = HIP * Math.cos(roll) + 0.15 * Math.sin(roll) + air * (k < 0.6 ? 1 : 0);
      body.position.x = local * Math.sin(roll) * 0.7;
      arm[0].rotation.set(0, 0, 2.7);
      arm[1].rotation.set(0, 0, -2.7);
      fore[0].rotation.x = fore[1].rotation.x = 0;
      thigh[0].rotation.set(0.2, 0, -0.25 * local);
      thigh[1].rotation.set(-0.2, 0, -0.1 * local);
      shin[0].rotation.x = -0.6;
      shin[1].rotation.x = -0.3;
      break;
    }
    case 'catch': {
      thigh[0].rotation.x = thigh[1].rotation.x = 0.45;
      shin[0].rotation.x = shin[1].rotation.x = -0.8;
      body.position.y = HIP - 0.14;
      body.rotation.x = 0.25;
      arm[0].rotation.set(-1.3, 0, 0.15);
      arm[1].rotation.set(-1.3, 0, -0.15);
      fore[0].rotation.x = fore[1].rotation.x = -0.6;
      break;
    }
    case 'tackle': {
      // carrinho / desarme: desliza com a perna esticada
      const e = ease(clamp01(k * 2.5)) * (k > 0.8 ? 1 - ease((k - 0.8) / 0.2) : 1);
      body.rotation.x = -1.0 * e;
      body.position.y = HIP - 0.55 * e;
      thigh[1].rotation.x = 1.5 * e;
      shin[1].rotation.x = -0.05;
      thigh[0].rotation.x = 0.4 * e;
      shin[0].rotation.x = -1.4 * e;
      arm[0].rotation.set(0.6 * e, 0, 0.9 * e);
      arm[1].rotation.set(0.6 * e, 0, -0.9 * e);
      break;
    }
    case 'feint': {
      // finta: o corpo vai para um lado e a bola sai para o outro
      const w = Math.sin(k * Math.PI * 2);
      body.rotation.z = w * 0.38;
      body.rotation.x = 0.25;
      thigh[w > 0 ? 0 : 1].rotation.z = w * 0.7;
      thigh[w > 0 ? 0 : 1].rotation.x = 0.5;
      shin[0].rotation.x = shin[1].rotation.x = -0.6;
      arm[0].rotation.z = 0.5 + Math.max(0, w) * 0.6;
      arm[1].rotation.z = -0.5 - Math.max(0, -w) * 0.6;
      body.position.y = HIP - 0.1;
      break;
    }
    case 'screen': {
      // bloqueio: pernas abertas, braços cruzados à frente do peito
      thigh[0].rotation.set(0.15, 0, -0.22);
      thigh[1].rotation.set(0.15, 0, 0.22);
      shin[0].rotation.x = shin[1].rotation.x = -0.3;
      body.position.y = HIP - 0.07;
      arm[0].rotation.set(-1.2, 0, -0.7);
      arm[1].rotation.set(-1.2, 0, 0.7);
      fore[0].rotation.x = fore[1].rotation.x = -0.9;
      break;
    }
    case 'shield': {
      // pivô de costas: protege a bola com o corpo e os braços
      thigh[0].rotation.set(0.45, 0, -0.2);
      thigh[1].rotation.set(0.45, 0, 0.2);
      shin[0].rotation.x = shin[1].rotation.x = -0.8;
      body.position.y = HIP - 0.13;
      body.rotation.x = 0.35;
      arm[0].rotation.set(0.3, 0, 0.95);
      arm[1].rotation.set(0.3, 0, -0.95);
      break;
    }
    case 'block': {
      // bloqueio de remate: abre as pernas, braços atrás das costas
      thigh[0].rotation.set(0.1, 0, -0.42);
      thigh[1].rotation.set(0.1, 0, 0.42);
      shin[0].rotation.x = shin[1].rotation.x = -0.2;
      body.position.y = HIP - 0.12;
      body.rotation.x = 0.2;
      arm[0].rotation.set(0.7, 0, 0.1);
      arm[1].rotation.set(0.7, 0, -0.1);
      fore[0].rotation.x = fore[1].rotation.x = -1.1;
      break;
    }
    case 'celebrate': {
      arm[0].rotation.set(0, 0, 2.6 + Math.sin(k * 30) * 0.2);
      arm[1].rotation.set(0, 0, -2.6 - Math.sin(k * 30) * 0.2);
      fore[0].rotation.x = fore[1].rotation.x = 0;
      a.g.position.y = Math.abs(Math.sin(k * Math.PI * 5)) * 0.22 * (sp < 2 ? 1 : 0.3);
      break;
    }
    case 'fall': {
      const down = ease(clamp01(k / 0.25)) * (k > 0.75 ? 1 - ease((k - 0.75) / 0.25) : 1);
      body.rotation.x = 1.45 * down;
      body.position.y = HIP - 0.72 * down;
      arm[0].rotation.set(-1.4 * down, 0, 0.3);
      arm[1].rotation.set(-1.4 * down, 0, -0.3);
      thigh[0].rotation.x = -0.3 * down;
      shin[0].rotation.x = -0.6 * down;
      break;
    }
    default:
      break;
  }
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- vista ----------
export class Highlight3D {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 200);
  private ballMesh: THREE.Mesh;
  private actors = new Map<string, Actor>();
  private choreo: Choreo | null = null;
  private info: Record<string, ActorInfo> = {};
  private colors: [[string, string], [string, string]] = [['#e30613', '#ffffff'], ['#00804a', '#ffffff']];
  private t = 0;
  private from = 0;
  private to = 0;
  private speed = 1;
  private raf = 0;
  private last = 0;
  private camLook = new THREE.Vector3();
  private snapCamera = true;
  private lastHolder: string | null = null;
  cameraId: CameraId = 'tv';
  onEnd: (() => void) | null = null;
  private ended = false;

  constructor(private host: HTMLElement, arena: string) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color(0x0b1020);
    buildArena(this.scene, arena);
    const ballTex = canvasTex(256, 128, (c) => {
      c.fillStyle = '#fafafa'; c.fillRect(0, 0, 256, 128);
      c.fillStyle = '#1f2937';
      for (let i = 0; i < 10; i++) { c.beginPath(); c.arc((i * 53) % 256, ((i * 37) % 128), 12, 0, Math.PI * 2); c.fill(); }
    });
    this.ballMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.4 }));
    this.ballMesh.castShadow = true;
    this.scene.add(this.ballMesh);
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private resize = () => {
    const w = this.host.clientWidth || 960;
    const h = this.host.clientHeight || Math.round(w * 9 / 16);
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  /** Mostra a jogada entre os instantes `from` e `to` da coreografia (segundos de jogo). */
  play(choreo: Choreo, info: Record<string, ActorInfo>, colors: [[string, string], [string, string]], from: number, to: number) {
    this.choreo = choreo;
    this.info = info;
    this.colors = colors;
    this.from = from;
    this.to = to;
    for (const a of this.actors.values()) this.scene.remove(a.g);
    this.actors.clear();
    this.resize();
    this.start(1);
  }

  replay(speed = 0.6) {
    if (this.choreo) this.start(speed);
  }

  private start(speed: number) {
    this.t = this.from;
    this.speed = speed;
    this.ended = false;
    this.snapCamera = true;
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private actor(id: string): Actor {
    let a = this.actors.get(id);
    if (a) return a;
    const inf = this.info[id] ?? { side: 0, number: null, gk: false };
    const cols = this.colors[inf.side];
    const shirt = inf.gk ? (inf.side === 0 ? '#0f766e' : '#7c3aed') : cols[0];
    const shorts = inf.gk ? '#111827' : cols[1];
    const skins = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'];
    const hairs = ['#1f1300', '#2d1b0e', '#4a3121', '#0d0d0d', '#6b4423', '#a67b5b'];
    let hsh = 0;
    for (const ch of id) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const pm = makePlayer(shirt, shorts, inf.number, skins[hsh % skins.length], hairs[(hsh >> 3) % hairs.length], inf.gk);
    this.scene.add(pm.g);
    a = { ...pm, prev: new THREE.Vector3(), heading: 0, phase: (hsh % 10) / 3, speed: 0, init: false };
    this.actors.set(id, a);
    return a;
  }

  private frame = (now: number) => {
    if (!this.host.isConnected || !this.choreo) return;
    const dtReal = Math.max(0, Math.min(0.05, (now - this.last) / 1000));
    this.last = now;
    this.t = Math.min(this.to, this.t + dtReal * this.speed);
    this.draw(Math.max(1e-4, dtReal * this.speed), true);
    if (this.t >= this.to && !this.ended) {
      this.ended = true;
      this.onEnd?.();
    }
    if (!this.ended) this.raf = requestAnimationFrame(this.frame);
  };

  /** Mostra um instante exato da jogada (para pausar num momento ou para testes). */
  seek(t: number) {
    if (!this.choreo) return;
    cancelAnimationFrame(this.raf);
    this.ended = true;
    this.snapCamera = true;
    for (let x = Math.max(0, t - 0.8); x <= t + 1e-6; x += 1 / 30) {
      this.t = x;
      this.draw(1 / 30, t - x < 1 / 30);
    }
  }

  private draw(dt: number, render: boolean) {
    const f = this.choreo!.at(this.t);
    // bola: x do motor = x do 3D; y do motor = z do 3D
    this.ballMesh.position.set(f.ball.x, Math.max(0.11, f.ball.z), f.ball.y);
    this.ballMesh.rotation.x += dt * 10;
    const seen = new Set<string>();
    for (const [id, p] of Object.entries(f.pos)) {
      seen.add(id);
      const a = this.actor(id);
      a.g.visible = true;
      const before = a.g.position.clone();
      a.g.position.set(p.x, 0, p.y);
      if (!a.init) { before.copy(a.g.position); a.init = true; }
      const vx = (a.g.position.x - before.x) / dt, vz = (a.g.position.z - before.z) / dt;
      a.speed = lerp(a.speed, Math.min(9, Math.hypot(vx, vz)), 0.25);
      const act = f.acts[id];
      // para onde olha: a ação em curso, a direção da corrida ou a bola
      let want = Math.atan2(f.ball.x - p.x, f.ball.y - p.y);
      if (act && (act.kind !== 'run' && act.kind !== 'celebrate' && act.kind !== 'fall')) want = act.ang;
      else if (a.speed > 3.2) want = Math.atan2(vx, vz);
      let d = want - a.heading;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      a.heading += d * Math.min(1, dt * 9);
      a.g.rotation.set(0, a.heading, 0);
      let act2 = act;
      if (act?.kind === 'dive' && act.to) {
        // lado do mergulho, visto pelo guarda-redes
        const rx = Math.cos(a.heading), rz = -Math.sin(a.heading);
        const side = (act.to.x - p.x) * rx + (act.to.y - p.y) * rz >= 0 ? 1 : -1;
        act2 = { ...act, side };
      }
      const inf = this.info[id];
      const near = Math.hypot(f.ball.x - p.x, f.ball.y - p.y) < 16;
      pose(a, act2, !!inf?.gk, near, dt);
      a.prev.copy(a.g.position);
    }
    for (const [id, a] of this.actors) if (!seen.has(id)) a.g.visible = false;
    if (f.holder) this.lastHolder = f.holder;
    this.updateCamera(f.ball);
    if (render) this.renderer.render(this.scene, this.camera);
  }

  private updateCamera(b: { x: number; y: number; z: number }) {
    const cam = this.camera;
    const ball = new THREE.Vector3(b.x, 0, b.y);
    const dir = Math.sign(this.choreo?.attackDirection ?? 1) || 1;
    let pos: THREE.Vector3;
    let look: THREE.Vector3;
    if (this.cameraId === 'baliza') {
      pos = new THREE.Vector3(dir * (W / 2 + 3.4), 3.9, ball.z * 0.15);
      look = new THREE.Vector3(ball.x - dir * 2, 0.6, ball.z * 0.7);
    } else if (this.cameraId === 'aerea') {
      pos = new THREE.Vector3(ball.x - dir * 3, 22, ball.z + 9);
      look = new THREE.Vector3(ball.x + dir * 2, 0, ball.z);
    } else if (this.cameraId === 'jogador') {
      const h = this.lastHolder ? this.actors.get(this.lastHolder)?.g.position : undefined;
      const sh = h ?? ball;
      pos = new THREE.Vector3(sh.x - dir * 5, 2.1, sh.z * 1.05);
      look = new THREE.Vector3(dir * W / 2, 0.8, 0);
    } else {
      // televisão: lateral elevada, acompanha a bola com suavidade (como uma realização real)
      const fx = Math.max(-W / 2 + 6, Math.min(W / 2 - 6, ball.x + dir * 2));
      pos = new THREE.Vector3(fx * 0.85, 7, H / 2 + 9);
      look = new THREE.Vector3(fx, 0.3, ball.z * 0.35);
    }
    if (this.snapCamera) {
      cam.position.copy(pos);
      this.camLook.copy(look);
      this.snapCamera = false;
    } else {
      cam.position.lerp(pos, 0.06);
      this.camLook.lerp(look, 0.08);
    }
    cam.lookAt(this.camLook);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
