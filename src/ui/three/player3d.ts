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
  fwd?: number; // velocidade para a frente no referencial do corpo (negativa = de costas)
  accel?: number; // aceleração ao longo da corrida (m/s²), para a inclinação
  turn?: number; // velocidade de rotação (rad/s), para a inclinação nas curvas
  stride?: number; // comprimento da passada próprio (altura)
  side?: number; // velocidade lateral (positiva = para a direita do jogador, lado +x)
  init: boolean;
}

export interface Kit { shirt: string; shorts: string; socks: string; number: number | null; name?: string; gk: boolean; pattern?: 'liso' | 'listas' | 'riscas' | 'metade'; alt?: string }

const HIP = 0.92;

// costas da camisola: nome (por cima) e número, como nas camisolas reais; fundo transparente para se ver o padrão
function numberTex(n: number | null, text: string, name = '') {
  return canvasTex(256, 256, (c) => {
    c.clearRect(0, 0, 256, 256);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round';
    const dark = text === '#111';
    const draw = (t: string, y: number, size: number, w: number) => {
      c.font = `bold ${size}px "Arial Narrow", Arial, sans-serif`;
      const sc = Math.min(1, w / Math.max(1, c.measureText(t).width));
      c.save(); c.translate(128, y); c.scale(sc, 1);
      c.lineWidth = size * 0.18; c.strokeStyle = dark ? 'rgba(255,255,255,.55)' : 'rgba(0,0,0,.45)';
      c.strokeText(t, 0, 0);
      c.fillStyle = text; c.fillText(t, 0, 0);
      c.restore();
    };
    if (name) draw(name.toUpperCase(), 36, 54, 240);
    draw(String(n ?? ''), name ? 150 : 128, 168, 230);
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
  // o perfil tem de ir de baixo para cima para as faces ficarem viradas para fora
  pts.reverse();
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
  return new THREE.MeshPhysicalMaterial({ color, metalness: 0, roughness: 0.55, sheen: 0.5, sheenRoughness: 0.45, sheenColor: new THREE.Color('#ff6b4a') });
}
// tecido: material simples (mais leve; 30 jogadores em ecrã inteiro)
const fabric = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.85 });

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
  if (kit.pattern && kit.pattern !== 'liso' && kit.alt) {
    // padrão da camisola: listas horizontais, riscas verticais ou metades (coordenadas do tecido: u à volta, v ao longo)
    shirtMat.map = canvasTex(256, 256, (c) => {
      c.fillStyle = kit.shirt; c.fillRect(0, 0, 256, 256);
      c.fillStyle = kit.alt!;
      if (kit.pattern === 'listas') for (let y = 0; y < 256; y += 64) c.fillRect(0, y, 256, 32);
      else if (kit.pattern === 'riscas') for (let x = 0; x < 256; x += 32) c.fillRect(x, 0, 16, 256);
      else c.fillRect(128, 0, 128, 256);
    });
    shirtMat.color.set('#ffffff');
  }
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
  const torsoGeo = segGeo(0.47, [0.165, 0.178, 0.168, 0.152, 0.148], 0.64, [true, true], 24, 0.45);
  torsoGeo.scale(1.25, 1, 0.66);
  const shirt: Part[] = [{ geo: torsoGeo, bone: body }];
  for (let i = 0; i < 2; i++) {
    if (kit.gk) {
      shirt.push({ geo: segGeo(0.3, [0.06, 0.055, 0.046, 0.042], 0.03), bone: arm[i], y0: 0.03, len: 0.3, parent: body, child: fore[i] });
      shirt.push({ geo: segGeo(0.25, [0.044, 0.045, 0.036, 0.03], 0.02), bone: fore[i], y0: 0.02, len: 0.25, parent: arm[i] });
    } else shirt.push({ geo: segGeo(0.14, [0.066, 0.063], 0.05, [true, true], 20, 0.35), bone: arm[i], y0: 0.02, len: 0.29, parent: body, child: fore[i], blend: 0.25 });
  }
  g.add(skinned(shirt, bones, shirtMat));

  // ---- calções ----
  const pelvis = segGeo(0.2, [0.128, 0.15, 0.155], 0.2, [true, true], 20, 0.5);
  pelvis.scale(1.2, 1, 0.8);
  const shortsParts: Part[] = [{ geo: pelvis, bone: body }];
  // as peças de roupa usam exatamente os mesmos pesos que a pele por baixo (não deixam a pele atravessar)
  for (let i = 0; i < 2; i++) shortsParts.push({ geo: segGeo(0.17, [0.104, 0.101], 0.03, [false, true], 20, 0.3), bone: thigh[i], y0: 0.02, len: 0.45, parent: body, child: shin[i], blend: 0.25 });
  g.add(skinned(shortsParts, bones, shortsMat));

  // ---- meias ----
  g.add(skinned([0, 1].map((i) => ({ geo: segGeo(0.31, [0.066, 0.061, 0.046, 0.042], -0.09, [false, false]), bone: shin[i], y0: 0.03, len: 0.44, parent: thigh[i], blend: 0.25 })), bones, sockMat));

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
  const txt = light ? '#111' : '#fff';
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.31), new THREE.MeshStandardMaterial({ map: numberTex(kit.number, txt, kit.name), transparent: true, roughness: 0.8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
  back.position.set(0, 0.4, -0.127);
  back.rotation.y = Math.PI;
  body.add(back);
  const numOnly = new THREE.MeshStandardMaterial({ map: numberTex(kit.number, txt), transparent: true, roughness: 0.8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const front = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.13), numOnly);
  front.position.set(0.075, 0.46, 0.124);
  body.add(front);
  // número pequeno nos calções (perna esquerda, à frente)
  const shortsLight = new THREE.Color(kit.shorts).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6;
  const sn = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.07), new THREE.MeshStandardMaterial({ map: numberTex(kit.number, shortsLight ? '#111' : '#fff'), transparent: true, roughness: 0.8, depthWrite: false }));
  sn.position.set(0.03, -0.1, 0.104);
  sn.rotation.y = 0.35;
  thigh[1].add(sn);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.007, 8, 24), fabric(kit.shorts));
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

/** Sentado (suplentes no banco): coxas para a frente, pernas para baixo, mãos nos joelhos. */
export function sit(a: Actor) {
  const { body, thigh, shin, arm, fore } = a;
  body.position.set(0, 0.58, 0);
  body.rotation.set(0.12, 0, 0);
  for (let i = 0; i < 2; i++) {
    thigh[i].rotation.set(-1.45, 0, i ? 0.08 : -0.08);
    shin[i].rotation.set(1.4, 0, 0);
    arm[i].rotation.set(-0.55, 0, i ? 0.12 : -0.12);
    fore[i].rotation.set(-0.75, 0, 0);
  }
}

// Convenção dos ângulos (rotação em x): coxa/braço negativo = para a frente; perna (joelho)
// positivo = dobra (o pé vai para trás); antebraço negativo = cotovelo dobrado. Rotação em z:
// braço/coxa do lado -x (índice 0) negativo = para fora; do lado +x (índice 1) positivo = para fora.
/** Pose do jogador conforme a corrida e a ação em curso. */
export function pose(a: Actor, act: Act | undefined, gk: boolean, near: boolean, dt: number) {
  const { body, thigh, shin, arm, fore } = a;
  body.position.set(0, HIP, 0);
  body.rotation.set(0, 0, 0);
  a.g.position.y = 0;
  for (const o of [...thigh, ...shin, ...arm, ...fore]) o.rotation.set(0, 0, 0);
  const sp = a.speed;
  // direção do passo em relação ao corpo: frente, costas ou lado (passo lateral do futsal)
  const fr = sp > 0.3 ? Math.max(-1, Math.min(1, (a.fwd ?? sp) / sp)) : 1;
  const sr = sp > 0.3 ? Math.max(-1, Math.min(1, (a.side ?? 0) / sp)) : 0;
  const lateral = Math.min(1, Math.abs(sr) * 1.3) * (1 - Math.max(0, fr)); // 1 = passo lateral puro
  const back = Math.max(0, -fr); // 1 = recuo de costas
  // cadência ligada à distância percorrida (os pés não deslizam): um ciclo (2 passos) mede ~1,3 m a andar e ~3,6 m a sprintar;
  // passos laterais e de costas são mais curtos. Cada jogador tem a sua passada (a.stride, pela altura)
  const cycle = (1.25 + 0.32 * sp) * (1 - 0.35 * lateral - 0.25 * back) * (a.stride ?? 1);
  a.phase += dt * (sp > 0.25 ? (Math.PI * 2 * sp) / cycle : 0);
  const amp = Math.min(1, sp / 7.5) * (1 - 0.45 * lateral) * (1 - 0.35 * back);
  const walk = Math.min(1, sp / 1.6);
  const stride = fr >= 0 ? 1 - lateral : -back; // sinal: de costas a passada inverte-se
  const swing = 0.16 + 0.78 * amp; // amplitude da anca (a sprintar ~0,95 rad: joelho alto à frente)
  const fwdOff = -0.14 * amp * Math.max(0, fr); // a corrida é feita "à frente" do corpo
  for (let i = 0; i < 2; i++) {
    const ph = a.phase + i * Math.PI;
    const sw = Math.sin(ph);
    const hip = fwdOff - swing * sw * walk * stride;
    thigh[i].rotation.x = hip - 0.25 * lateral * walk; // a deslizar de lado as coxas ficam fletidas
    // abre e fecha as pernas no passo lateral (a perna do lado para onde vai abre primeiro)
    const outSign = i ? 1 : -1;
    const lead = Math.sign(sr) === outSign ? 1 : 0.45;
    thigh[i].rotation.z = outSign * (0.05 + 0.3 * lateral * walk * lead * (0.5 + 0.5 * sw));
    // joelho: dobra muito na recuperação (a perna vem de trás para a frente) e um pouco no apoio (amortece)
    const c = Math.cos(ph);
    shin[i].rotation.x = ((0.18 + 1.75 * amp) * Math.pow(Math.max(0, c), 1.4) + (0.12 + 0.12 * amp) * Math.max(0, -c)) * walk + 0.06 + 0.45 * lateral * walk;
    // braços em oposição às pernas, cotovelos a ~90° a correr
    arm[i].rotation.x = -(hip - fwdOff) * (0.75 + 0.35 * amp) * (1 - lateral);
    arm[i].rotation.z = outSign * (0.1 + 0.35 * lateral * walk); // braços abertos a defender de lado
    fore[i].rotation.x = -(0.45 + 1.0 * amp);
  }
  // tronco: inclina para a frente com a velocidade e ao acelerar, roda em contra-fase das ancas, inclina-se nas curvas
  const lean = clamp01(((a.accel ?? 0) + 2) / 10) * 0.18;
  body.rotation.x = (0.05 + 0.2 * amp) * Math.max(0, fr) + lean * Math.max(0, fr) + 0.12 * (lateral + back) * walk;
  body.rotation.y = 0.14 * amp * Math.sin(a.phase) * Math.max(0, fr);
  body.rotation.z = -0.06 * sr * walk + Math.max(-0.28, Math.min(0.28, (a.turn ?? 0) * sp * 0.035));
  // dois apoios por ciclo: o corpo sobe na fase de voo e baixa ao amortecer
  body.position.y = HIP - 0.015 + (Math.abs(Math.sin(a.phase)) - 0.5) * 0.07 * amp - 0.07 * Math.max(lateral, back) * walk;
  if (gk && near && !act && sp < 2.5) {
    // guarda-redes em posição de espera: pernas fletidas, peso à frente, braços abertos
    thigh[0].rotation.set(-0.6, 0, -0.12);
    thigh[1].rotation.set(-0.6, 0, 0.12);
    shin[0].rotation.x = shin[1].rotation.x = 1.0;
    body.position.y = HIP - 0.17;
    body.rotation.x = 0.35;
    arm[0].rotation.set(-0.5, 0, -0.75);
    arm[1].rotation.set(-0.5, 0, 0.75);
    fore[0].rotation.x = fore[1].rotation.x = -0.5;
  }
  if (!act) return;
  const k = act.k;
  switch (act.kind) {
    case 'pass':
    case 'shoot': {
      // perna direita: recua (joelho dobrado), bate na bola e acompanha
      const big = act.kind === 'shoot' ? 1.3 : 0.85;
      const back = k < 0.5 ? ease(k / 0.5) : 0;
      const hit = k >= 0.5 ? ease(clamp01((k - 0.5) / 0.3)) : 0;
      thigh[1].rotation.x = k < 0.5 ? 0.6 * big * back : lerp(0.6 * big, -1.05 * big, hit);
      shin[1].rotation.x = k < 0.5 ? 1.5 * back : lerp(1.5, 0.08, hit);
      thigh[0].rotation.x = -0.12;
      shin[0].rotation.x = 0.3;
      arm[0].rotation.set(-0.3, 0, -0.9);
      arm[1].rotation.set(0.35, 0, 0.5);
      fore[0].rotation.x = fore[1].rotation.x = -0.4;
      body.rotation.x = act.kind === 'shoot' ? 0.05 + hit * 0.2 : 0.08;
      body.rotation.y = k < 0.5 ? -0.25 * back : lerp(-0.25, 0.2, hit);
      body.position.y = HIP - 0.05;
      break;
    }
    case 'throw': {
      const up = k < 0.6 ? ease(k / 0.6) : 1 - ease((k - 0.6) / 0.4);
      arm[1].rotation.x = -Math.PI * 0.9 * up - (k > 0.6 ? 0.6 : 0);
      arm[0].rotation.set(-0.4, 0, -0.6);
      thigh[0].rotation.x = -0.4;
      shin[0].rotation.x = 0.3;
      thigh[1].rotation.x = 0.25;
      body.rotation.x = -0.15 * up + 0.2 * (1 - up);
      break;
    }
    case 'dive': {
      // voo de GR (futsal): passo de impulso com a perna do lado da bola, o corpo roda para a horizontal com o peito virado
      // para o rematador, os dois braços juntos e esticados para a bola, a perna de cima arrasta ligeiramente fletida;
      // cai de lado, amortece com o braço e levanta-se (sem "saltar" de pé no fim)
      const local = act.side ?? 1;
      const load = k < 0.1 ? Math.sin((k / 0.1) * Math.PI) : 0;
      // o corpo inclina logo desde o impulso, em diagonal para o ângulo: bola alta ~55°, rasteira ~80° (quase deitado);
      // pouca elevação (é uma extensão lateral, não um salto para cima)
      const h = act.h ?? 0.6;
      const up = ease(clamp01((k - 0.02) * 5));
      const getUp = k > 0.8 ? ease((k - 0.8) / 0.2) : 0;
      const target = h > 1.3 ? 0.98 : h > 0.8 ? 1.15 : 1.38;
      const fall = k > 0.45 ? ease(clamp01((k - 0.45) / 0.3)) : 0; // depois de chegar à bola, cai de lado
      const roll = lerp(target * up, 1.42, fall) * (1 - getUp);
      const fly = k < 0.6 ? Math.sin(clamp01(k / 0.6) * Math.PI) : 0;
      const lift = fly * Math.max(0.05, Math.min(0.35, (h - 0.6) * 0.35));
      body.rotation.z = -local * roll;
      body.rotation.x = 0.12 + 0.25 * getUp;
      body.rotation.y = local * 0.18 * up * (1 - getUp); // peito para o rematador
      body.position.y = HIP * Math.cos(roll) + 0.24 * Math.sin(roll) + lift - 0.22 * load - 0.25 * getUp * (1 - getUp) * 4 * 0.5;
      body.position.x = local * (Math.sin(roll) * 0.8 + 0.25 * up * (1 - getUp)); // o corpo vai para o lado
      // braços juntos, por cima da cabeça no referencial do corpo (= apontam à bola); bola baixa: mãos mais à frente
      // os braços sobem juntos antes de o corpo rodar (no impulso já vão à bola)
      const ext = ease(clamp01((k - 0.05) * 10)) * (1 - getUp);
      // braços paralelos levantados pela frente (bola alta: por cima da cabeça; baixa: mais à frente), inclinados para a bola
      const raise = h > 1 ? 2.95 : 2.4;
      const land = k > 0.62 && k < 0.88 ? Math.sin(((k - 0.62) / 0.26) * Math.PI) : 0; // o braço de baixo amortece a queda
      const dnA = local > 0 ? 1 : 0; // braço do lado da bola (fica em baixo no voo)
      const tilt = (local > 0 ? 1 : -1) * 0.3;
      arm[dnA].rotation.set(-raise * ext + 1.3 * land - 0.3 * (1 - ext), 0, tilt * ext + (dnA ? 1 : -1) * 0.8 * land);
      arm[1 - dnA].rotation.set(-raise * ext - 0.3 * (1 - ext), 0, tilt * ext + ((1 - dnA) ? 1 : -1) * 0.15 * (1 - ext));
      fore[0].rotation.x = fore[1].rotation.x = -0.1 - 0.5 * land;
      // pernas: a de baixo (impulso) estica, a de cima vai fletida e ligeiramente atrás; no impulso fletem as duas
      const dn = local > 0 ? 1 : 0; // perna do lado da bola (a de baixo no voo)
      thigh[dn].rotation.set(-0.1 - 0.45 * load - 0.6 * getUp, 0, (dn ? 1 : -1) * 0.12 * up);
      thigh[1 - dn].rotation.set(0.25 * up - 0.45 * load - 0.6 * getUp, 0, (dn ? 1 : -1) * 0.05 * up);
      shin[dn].rotation.x = 0.2 + 0.8 * load + 1.1 * getUp;
      shin[1 - dn].rotation.x = 0.55 * up + 0.8 * load + 1.1 * getUp;
      break;
    }
    case 'splits': {
      // espargata lateral (futsal): uma perna estica rente ao chão para o lado da bola, a outra
      // fica dobrada; o corpo baixa e o braço do mesmo lado acompanha
      const local = act.side ?? 1;
      const e = ease(clamp01(k * 3.2)) * (k > 0.85 ? 1 - ease((k - 0.85) / 0.15) : 1);
      const out = local > 0 ? 1 : 0; // índice da perna que vai à bola (1 = lado +x)
      const sgn = out ? 1 : -1;
      body.position.y = HIP - 0.55 * e;
      body.position.x = sgn * 0.12 * e;
      body.rotation.z = -sgn * 0.25 * e;
      body.rotation.x = 0.2 * e;
      thigh[out].rotation.set(0, 0, sgn * 1.45 * e);
      shin[out].rotation.x = 0.05;
      thigh[1 - out].rotation.set(-0.55 * e, 0, -sgn * 0.25 * e);
      shin[1 - out].rotation.x = 1.9 * e;
      arm[out].rotation.set(-0.2, 0, sgn * 1.25 * e);
      arm[1 - out].rotation.set(-0.4, 0, -sgn * 0.5 * e);
      fore[0].rotation.x = fore[1].rotation.x = -0.2;
      break;
    }
    case 'spread': {
      // abertura em cruz: pernas muito abertas e fletidas, braços abertos, a tapar a baliza
      const e = ease(clamp01(k * 3.5)) * (k > 0.85 ? 1 - ease((k - 0.85) / 0.15) : 1);
      thigh[0].rotation.set(-0.25 * e, 0, -0.85 * e);
      thigh[1].rotation.set(-0.25 * e, 0, 0.85 * e);
      shin[0].rotation.x = shin[1].rotation.x = 0.45 * e;
      body.position.y = HIP - 0.3 * e;
      body.rotation.x = 0.15 * e;
      arm[0].rotation.set(-0.3, 0, -1.35 * e);
      arm[1].rotation.set(-0.3, 0, 1.35 * e);
      fore[0].rotation.x = fore[1].rotation.x = -0.1;
      break;
    }
    case 'shove': {
      // confronto: peito para a frente, braços a empurrar, de vez em quando um passo atrás
      const w = Math.sin(k * Math.PI * 6);
      arm[0].rotation.set(-1.35 - w * 0.2, 0, 0.15);
      arm[1].rotation.set(-1.35 + w * 0.2, 0, -0.15);
      fore[0].rotation.x = fore[1].rotation.x = -0.25;
      body.rotation.x = 0.22 + w * 0.08;
      thigh[0].rotation.x = -0.35;
      thigh[1].rotation.x = 0.25;
      shin[0].rotation.x = 0.3;
      break;
    }
    case 'whistle': {
      // árbitro: braço no ar e apito
      arm[1].rotation.set(-2.9, 0, 0.1);
      arm[0].rotation.set(-0.6, 0, -0.3);
      fore[0].rotation.x = -1.4;
      break;
    }
    case 'catch': {
      // agarra à altura da bola: rasteira = baixa-se e junta as mãos à frente das pernas; alta = braços acima da cabeça
      const h = act.h ?? 1;
      const low = clamp01((0.9 - h) / 0.7), high = clamp01((h - 1.2) / 0.6);
      thigh[0].rotation.x = thigh[1].rotation.x = -0.5 - 0.6 * low + 0.3 * high;
      shin[0].rotation.x = shin[1].rotation.x = 0.85 + 0.6 * low - 0.4 * high;
      body.position.y = HIP - 0.14 - 0.22 * low + 0.06 * high;
      body.rotation.x = 0.3 + 0.45 * low - 0.15 * high;
      const sh = -1.3 + 0.75 * low - 1.35 * high;
      arm[0].rotation.set(sh, 0, -0.15);
      arm[1].rotation.set(sh, 0, 0.15);
      fore[0].rotation.x = fore[1].rotation.x = -0.35 + 0.2 * low;
      break;
    }
    case 'tackle': {
      // carrinho / desarme: desliza com a perna esticada à frente
      const e = ease(clamp01(k * 2.5)) * (k > 0.8 ? 1 - ease((k - 0.8) / 0.2) : 1);
      body.rotation.x = -1.0 * e;
      body.position.y = HIP - 0.55 * e;
      thigh[1].rotation.x = -1.45 * e;
      shin[1].rotation.x = 0.05;
      thigh[0].rotation.x = -0.35 * e;
      shin[0].rotation.x = 1.4 * e;
      arm[0].rotation.set(0.6 * e, 0, -(0.9 * e));
      arm[1].rotation.set(0.6 * e, 0, 0.9 * e);
      break;
    }
    case 'feint': {
      // finta: o corpo vai para um lado e a bola sai para o outro
      const w = Math.sin(k * Math.PI * 2);
      body.rotation.z = w * 0.35;
      body.rotation.x = 0.25;
      thigh[w > 0 ? 0 : 1].rotation.z = w * 0.6;
      thigh[0].rotation.x = thigh[1].rotation.x = -0.35;
      shin[0].rotation.x = shin[1].rotation.x = 0.6;
      arm[0].rotation.z = -(0.5 + Math.max(0, w) * 0.6);
      arm[1].rotation.z = 0.5 + Math.max(0, -w) * 0.6;
      body.position.y = HIP - 0.1;
      break;
    }
    case 'screen': {
      // bloqueio: pernas abertas e fletidas, braços cruzados à frente do peito
      thigh[0].rotation.set(-0.2, 0, -0.22);
      thigh[1].rotation.set(-0.2, 0, 0.22);
      shin[0].rotation.x = shin[1].rotation.x = 0.35;
      body.position.y = HIP - 0.07;
      arm[0].rotation.set(-1.2, 0, 0.7);
      arm[1].rotation.set(-1.2, 0, -0.7);
      fore[0].rotation.x = fore[1].rotation.x = -0.9;
      break;
    }
    case 'shield': {
      // pivô de costas: protege a bola com o corpo e os braços
      thigh[0].rotation.set(-0.45, 0, -0.2);
      thigh[1].rotation.set(-0.45, 0, 0.2);
      shin[0].rotation.x = shin[1].rotation.x = 0.8;
      body.position.y = HIP - 0.13;
      body.rotation.x = 0.35;
      arm[0].rotation.set(0.3, 0, -0.95);
      arm[1].rotation.set(0.3, 0, 0.95);
      break;
    }
    case 'block': {
      // bloqueio de remate: abre as pernas, braços atrás das costas
      thigh[0].rotation.set(-0.15, 0, -0.42);
      thigh[1].rotation.set(-0.15, 0, 0.42);
      shin[0].rotation.x = shin[1].rotation.x = 0.25;
      body.position.y = HIP - 0.12;
      body.rotation.x = 0.2;
      arm[0].rotation.set(0.7, 0, -0.1);
      arm[1].rotation.set(0.7, 0, 0.1);
      fore[0].rotation.x = fore[1].rotation.x = -1.1;
      break;
    }
    case 'celebrate': {
      arm[0].rotation.set(0, 0, -(2.6 + Math.sin(k * 30) * 0.2));
      arm[1].rotation.set(0, 0, 2.6 + Math.sin(k * 30) * 0.2);
      fore[0].rotation.x = fore[1].rotation.x = 0;
      a.g.position.y = Math.abs(Math.sin(k * Math.PI * 5)) * 0.22 * (sp < 2 ? 1 : 0.3);
      break;
    }
    case 'fall': {
      const down = ease(clamp01(k / 0.25)) * (k > 0.75 ? 1 - ease((k - 0.75) / 0.25) : 1);
      body.rotation.x = 1.45 * down;
      body.position.y = HIP - 0.72 * down;
      arm[0].rotation.set(-1.4 * down, 0, -0.3);
      arm[1].rotation.set(-1.4 * down, 0, 0.3);
      thigh[0].rotation.x = 0.3 * down;
      shin[0].rotation.x = 0.6 * down;
      break;
    }
    default:
      break;
  }
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

