// Jogadores em 3D, ao estilo do Football Manager: corpo arredondado e articulado (ancas,
// joelhos, ombros, cotovelos), equipamento, e aspeto próprio de cada jogador (pele, cabelo,
// penteado, barba, altura, sapatilhas). Os guarda-redes jogam sem luvas. Animações: corrida, passe, remate, mergulho, defesa, carrinho,
// finta, bloqueio, proteção de bola, bloqueio de remate, queda e festejo.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import type { Look } from '../../core/appearance';
import type { Act } from '../../core/visual/choreo';
import { canvasTex } from './arena3d';

export interface Actor {
  g: THREE.Group; // posição e orientação no campo
  body: THREE.Object3D; // inclinações, mergulhos, carrinhos (pivô nas ancas)
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

export interface Kit { shirt: string; shorts: string; socks: string; number: number | null; gk: boolean }

const HIP = 0.92;

function numberTex(n: number | null, color: string, text: string) {
  return canvasTex(128, 128, (c) => {
    c.fillStyle = color; c.fillRect(0, 0, 128, 128);
    c.fillStyle = text; c.font = 'bold 84px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(n ?? ''), 64, 70);
  });
}

function hairFor(look: Look, hairMat: THREE.Material, head: THREE.Group) {
  const add = (g: THREE.BufferGeometry, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Mesh(g, hairMat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    head.add(m);
    return m;
  };
  const cap = (thetaLen: number, r = 0.123) => new THREE.SphereGeometry(r, 18, 10, 0, Math.PI * 2, 0, thetaLen);
  switch (look.style) {
    case 'careca':
      break;
    case 'rapado':
      add(cap(1.25, 0.121), 0, 0.005, -0.004).rotation.x = -0.35;
      break;
    case 'degrade': {
      add(cap(0.95, 0.126), 0, 0.012, -0.004).rotation.x = -0.2;
      add(cap(1.3, 0.12), 0, 0, -0.006).rotation.x = -0.35;
      break;
    }
    case 'curto':
      add(cap(1.15, 0.13), 0, 0.012, -0.006).rotation.x = -0.3;
      break;
    case 'encaracolado': {
      add(cap(1.2, 0.128), 0, 0.01, -0.006).rotation.x = -0.3;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        add(new THREE.SphereGeometry(0.045, 8, 6), Math.sin(a) * 0.075, 0.1 + (i % 2) * 0.012, Math.cos(a) * 0.07 - 0.01);
      }
      break;
    }
    case 'afro':
      add(new THREE.SphereGeometry(0.165, 16, 12), 0, 0.055, -0.02, 1, 0.9, 1);
      break;
    case 'comprido': {
      add(cap(1.3, 0.132), 0, 0.01, -0.006).rotation.x = -0.3;
      add(new THREE.BoxGeometry(0.22, 0.2, 0.06), 0, -0.07, -0.1);
      break;
    }
    case 'apanhado': {
      add(cap(1.2, 0.129), 0, 0.01, -0.006).rotation.x = -0.3;
      add(new THREE.SphereGeometry(0.05, 10, 8), 0, 0.1, -0.11);
      break;
    }
    case 'crista': {
      add(cap(1.3, 0.121), 0, 0, -0.004).rotation.x = -0.35;
      add(new THREE.BoxGeometry(0.04, 0.06, 0.2), 0, 0.12, -0.01);
      break;
    }
  }
  if (look.beard !== 'nenhuma') {
    const bm = new THREE.Mesh(new THREE.SphereGeometry(look.beard === 'cheia' ? 0.118 : 0.114, 16, 8, Math.PI * 0.15, Math.PI * 0.7, Math.PI * 0.55, Math.PI * 0.4), hairMat);
    bm.position.set(0, -0.004, 0.006);
    if (look.beard === 'bigode') bm.scale.set(0.6, 0.35, 1);
    head.add(bm);
  }
}

// ---- formas anatómicas ----
/** Perfil de um segmento do corpo (raio ao longo do comprimento, a descer a partir de y0), com as
 *  pontas arredondadas. */
function segGeo(len: number, radii: number[], y0 = 0, caps: [boolean, boolean] = [true, true], seg = 20, capH = 0.8) {
  const pts: THREE.Vector2[] = [];
  const n = radii.length - 1;
  const r0 = radii[0], rN = radii[n];
  if (caps[0]) for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.max(1e-4, r0 * Math.sin(a)), r0 * Math.cos(a) * capH)); }
  else pts.push(new THREE.Vector2(r0, 0));
  for (let i = 1; i <= 18; i++) {
    const k = i / 18;
    const f = k * n, j = Math.min(n - 1, Math.floor(f)), t = f - j;
    pts.push(new THREE.Vector2(radii[j] + (radii[j + 1] - radii[j]) * (t * t * (3 - 2 * t)), -k * len));
  }
  if (caps[1]) for (let i = 1; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.max(1e-4, rN * Math.cos(a)), -len - rN * Math.sin(a) * 0.8)); }
  const g = new THREE.LatheGeometry(pts, seg);
  g.translate(0, y0, 0);
  return g;
}

function sphereGeo(r: number, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
  const g = new THREE.SphereGeometry(r, 20, 14);
  g.scale(sx, sy, sz);
  g.translate(x, y, z);
  return g;
}

interface Part {
  geo: THREE.BufferGeometry; // em coordenadas do osso
  bone: THREE.Bone;
  y0?: number; // topo do segmento (para as misturas nas articulações)
  len?: number;
  parent?: THREE.Bone; // mistura no topo com o osso pai
  child?: THREE.Bone; // mistura no fundo com o osso filho
  blend?: number;
}

/** Junta as peças numa só malha com esqueleto: nas articulações os vértices seguem dois ossos ao
 *  mesmo tempo, por isso a pele dobra de forma contínua (sem encaixes de boneco). */
function skinned(parts: Part[], skel: THREE.Skeleton, material: THREE.Material) {
  const bones = skel.bones;
  const geos = parts.map((p) => {
    const g = p.geo.index ? p.geo.toNonIndexed() : p.geo;
    g.deleteAttribute('uv');
    const pos = g.attributes.position;
    const n = pos.count;
    const si = new Uint16Array(n * 4), sw = new Float32Array(n * 4);
    const bi = bones.indexOf(p.bone), pi = p.parent ? bones.indexOf(p.parent) : bi, ci = p.child ? bones.indexOf(p.child) : bi;
    const bl = p.blend ?? 0.2;
    for (let v = 0; v < n; v++) {
      const t = p.len ? ((p.y0 ?? 0) - pos.getY(v)) / p.len : 0.5;
      const wP = p.parent ? Math.min(0.5, Math.max(0, (bl - t) / bl) * 0.5) : 0;
      const wC = p.child ? Math.min(0.5, Math.max(0, (t - (1 - bl)) / bl) * 0.5) : 0;
      si.set([bi, pi, ci, 0], v * 4);
      sw.set([1 - wP - wC, wP, wC, 0], v * 4);
    }
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(sw, 4));
    g.applyMatrix4(p.bone.matrixWorld);
    return g;
  });
  const m = new THREE.SkinnedMesh(mergeGeometries(geos)!, material);
  m.castShadow = true;
  m.frustumCulled = false;
  m.bind(skel, new THREE.Matrix4());
  return m;
}

/** Pele: brilho suave com reflexo avermelhado nas bordas (aspeto de pele, não de madeira). */
function skinMaterial(color: string) {
  return new THREE.MeshPhysicalMaterial({ color, metalness: 0, roughness: 0.55, sheen: 0.5, sheenRoughness: 0.45, sheenColor: new THREE.Color('#ff6b4a'), clearcoat: 0.12, clearcoatRoughness: 0.55 });
}
const fabric = (color: string) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.8, sheen: 0.5, sheenRoughness: 0.8, sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.4) });

export function makePlayer(kit: Kit, look: Look) {
  const g = new THREE.Group();
  // esqueleto (os mesmos pontos de rotação que as animações usam)
  const body = new THREE.Bone();
  body.position.y = HIP;
  g.add(body);
  const head = new THREE.Bone();
  head.position.y = 0.81;
  body.add(head);
  const thigh: THREE.Bone[] = [], shin: THREE.Bone[] = [], arm: THREE.Bone[] = [], fore: THREE.Bone[] = [];
  for (const x of [-0.092, 0.092]) {
    const th = new THREE.Bone(); th.position.set(x, -0.02, 0); body.add(th);
    const sh = new THREE.Bone(); sh.position.y = -0.44; th.add(sh);
    thigh.push(th); shin.push(sh);
  }
  for (const x of [-0.205, 0.205]) {
    const a = new THREE.Bone(); a.position.set(x, 0.56, 0); a.rotation.z = 0; body.add(a);
    const fo = new THREE.Bone(); fo.position.y = -0.285; a.add(fo);
    arm.push(a); fore.push(fo);
  }
  g.updateMatrixWorld(true);
  const bones = new THREE.Skeleton([body, head, ...thigh, ...shin, ...arm, ...fore]);

  const skinMat = skinMaterial(look.skin);
  const shirtMat = fabric(kit.shirt);
  const shortsMat = fabric(kit.shorts);
  const sockMat = fabric(kit.socks);
  const hairMat = new THREE.MeshStandardMaterial({ color: look.hair, roughness: 0.75 });
  const bootMat = new THREE.MeshStandardMaterial({ color: look.boots?.[0] ?? '#111827', roughness: 0.4 });
  const soleMat = new THREE.MeshStandardMaterial({ color: look.boots?.[1] ?? '#ffffff', roughness: 0.6 });
  const light = new THREE.Color(kit.shirt).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6;

  // ---- pele ----
  const skin: Part[] = [
    { geo: segGeo(0.13, [0.048, 0.046, 0.052], 0.84), bone: body }, // pescoço
    { geo: sphereGeo(0.112, 0, 0.012, -0.005, 0.95, 1.05, 1.02), bone: head }, // crânio
    { geo: sphereGeo(0.085, 0, -0.045, 0.02, 1, 0.95, 1), bone: head }, // maxilar
    { geo: sphereGeo(0.035, 0, -0.095, 0.06, 1.2, 0.8, 1), bone: head }, // queixo
    { geo: sphereGeo(0.024, -0.106, 0, -0.005, 0.55, 1, 0.8), bone: head },
    { geo: sphereGeo(0.024, 0.106, 0, -0.005, 0.55, 1, 0.8), bone: head },
    { geo: sphereGeo(0.022, 0, -0.012, 0.112, 0.8, 1.3, 1), bone: head }, // nariz
  ];
  for (let i = 0; i < 2; i++) {
    skin.push({ geo: segGeo(0.45, [0.086, 0.08, 0.068, 0.054], 0.02, [true, false]), bone: thigh[i], y0: 0.02, len: 0.45, parent: body, child: shin[i], blend: 0.25 });
    skin.push({ geo: segGeo(0.44, [0.054, 0.062, 0.054, 0.04, 0.035], 0.03), bone: shin[i], y0: 0.03, len: 0.44, parent: thigh[i], blend: 0.25 });
    if (!kit.gk) {
      skin.push({ geo: segGeo(0.29, [0.052, 0.049, 0.041, 0.036], 0.02, [true, false]), bone: arm[i], y0: 0.02, len: 0.29, parent: body, child: fore[i], blend: 0.25 });
      skin.push({ geo: segGeo(0.27, [0.037, 0.04, 0.032, 0.026], 0.025), bone: fore[i], y0: 0.025, len: 0.27, parent: arm[i], blend: 0.25 });
    }
    skin.push({ geo: sphereGeo(0.04, 0, -0.29, 0.005, 0.75, 1.25, 0.5), bone: fore[i] }); // mão
    skin.push({ geo: sphereGeo(0.016, i ? -0.025 : 0.025, -0.27, 0.025, 0.8, 1.6, 0.8), bone: fore[i] }); // polegar
  }
  g.add(skinned(skin, bones, skinMat));

  // ---- camisola (tronco, ombros e mangas; o GR tem manga comprida) ----
  // tronco: ombros largos e arredondados, peito, cintura mais estreita
  const torsoGeo = segGeo(0.48, [0.165, 0.178, 0.168, 0.15, 0.14], 0.64, [true, false], 24, 0.45);
  torsoGeo.scale(1.25, 1, 0.66);
  const shirt: Part[] = [{ geo: torsoGeo, bone: body }];
  for (let i = 0; i < 2; i++) {
    if (kit.gk) {
      shirt.push({ geo: segGeo(0.3, [0.06, 0.055, 0.046, 0.042], 0.03), bone: arm[i], y0: 0.03, len: 0.3, parent: body, child: fore[i] });
      shirt.push({ geo: segGeo(0.25, [0.044, 0.045, 0.036, 0.03], 0.02), bone: fore[i], y0: 0.02, len: 0.25, parent: arm[i] });
    } else shirt.push({ geo: segGeo(0.15, [0.063, 0.059], 0.04, [true, false]), bone: arm[i], y0: 0.04, len: 0.15, parent: body, blend: 0.45 });
  }
  g.add(skinned(shirt, bones, shirtMat));

  // ---- calções ----
  const pelvis = segGeo(0.19, [0.142, 0.152, 0.156], 0.2, [true, false]);
  pelvis.scale(1.2, 1, 0.8);
  const shortsParts: Part[] = [{ geo: pelvis, bone: body }];
  for (let i = 0; i < 2; i++) shortsParts.push({ geo: segGeo(0.2, [0.1, 0.097], 0.05, [false, false]), bone: thigh[i], y0: 0.05, len: 0.2, parent: body, blend: 0.4 });
  g.add(skinned(shortsParts, bones, shortsMat));

  // ---- meias ----
  g.add(skinned([0, 1].map((i) => ({ geo: segGeo(0.31, [0.064, 0.059, 0.044, 0.04], -0.09, [false, false]), bone: shin[i] })), bones, sockMat));

  // ---- sapatilhas, números, gola, olhos, cabelo (peças rígidas presas aos ossos) ----
  for (const sh of shin) {
    const boot = new THREE.Mesh(new THREE.CapsuleGeometry(0.046, 0.15, 4, 10), bootMat);
    boot.rotation.x = Math.PI / 2;
    boot.scale.set(1.05, 1, 0.75);
    boot.position.set(0, -0.43, 0.045);
    boot.castShadow = true;
    sh.add(boot);
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.022, 0.25), soleMat);
    sole.position.set(0, -0.468, 0.045);
    sh.add(sole);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.016, 0.12), soleMat);
    stripe.position.set(0, -0.43, 0.06);
    sh.add(stripe);
  }
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), new THREE.MeshStandardMaterial({ map: numberTex(kit.number, kit.shirt, light ? '#111' : '#fff'), transparent: true, roughness: 0.8 }));
  back.position.set(0, 0.37, -0.122);
  back.rotation.y = Math.PI;
  body.add(back);
  const front = back.clone();
  front.rotation.y = 0;
  front.scale.set(0.4, 0.4, 1);
  front.position.set(0.075, 0.45, 0.121);
  body.add(front);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.012, 8, 20), fabric(kit.shorts));
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 0.665, 0.005);
  body.add(collar);
  const white = new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.3 });
  const iris = new THREE.MeshStandardMaterial({ color: '#2a1a10', roughness: 0.2 });
  for (const x of [-0.037, 0.037]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 8), white);
    e.scale.set(1.2, 0.8, 0.6); e.position.set(x, 0.018, 0.094); head.add(e);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.008, 10, 8), iris);
    p.position.set(x, 0.018, 0.104); head.add(p);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.008, 0.01), hairMat);
    brow.position.set(x, 0.042, 0.1);
    brow.rotation.z = x > 0 ? -0.12 : 0.12;
    head.add(brow);
  }
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.006, 0.008), new THREE.MeshStandardMaterial({ color: '#7a3b33' }));
  mouth.position.set(0, -0.058, 0.098);
  head.add(mouth);
  const hairG = new THREE.Group();
  hairFor(look, hairMat, hairG);
  head.add(hairG);

  g.scale.setScalar(look.height / 1.8);
  return { g, body, thigh, shin, arm, fore };
}

const ease = (k: number) => k * k * (3 - 2 * k);
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));

/** Pose do jogador conforme a corrida e a ação em curso. */
export function pose(a: Actor, act: Act | undefined, gk: boolean, near: boolean, dt: number) {
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

