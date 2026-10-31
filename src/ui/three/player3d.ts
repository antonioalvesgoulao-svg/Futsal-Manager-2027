// Jogadores em 3D, ao estilo do Football Manager: corpo arredondado e articulado (ancas,
// joelhos, ombros, cotovelos), equipamento, e aspeto próprio de cada jogador (pele, cabelo,
// penteado, barba, altura, sapatilhas). Os guarda-redes jogam sem luvas. Animações: corrida, passe, remate, mergulho, defesa, carrinho,
// finta, bloqueio, proteção de bola, bloqueio de remate, queda e festejo.
import * as THREE from 'three';

import type { Look } from '../../core/appearance';
import type { Act } from '../../core/visual/choreo';
import { canvasTex } from './arena3d';

export interface Actor {
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

export interface Kit { shirt: string; shorts: string; socks: string; number: number | null; gk: boolean }

const HIP = 0.92;

function numberTex(n: number | null, color: string, text: string) {
  return canvasTex(128, 128, (c) => {
    c.fillStyle = color; c.fillRect(0, 0, 128, 128);
    c.fillStyle = text; c.font = 'bold 84px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(n ?? ''), 64, 70);
  });
}

const mat = (color: string, rough = 0.75) => new THREE.MeshStandardMaterial({ color, roughness: rough });

function capsule(r: number, len: number, m: THREE.Material, y: number) {
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), m);
  mesh.position.y = y;
  mesh.castShadow = true;
  return mesh;
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

export function makePlayer(kit: Kit, look: Look) {
  const g = new THREE.Group();
  const body = new THREE.Group();
  body.position.y = HIP;
  g.add(body);
  const shirtMat = mat(kit.shirt, 0.7);
  const shortsMat = mat(kit.shorts, 0.7);
  const sockMat = mat(kit.socks, 0.8);
  const skinMat = mat(look.skin, 0.65);
  const hairMat = mat(look.hair, 0.9);
  const bootMat = mat(look.boots?.[0] ?? '#111827', 0.45);
  const soleMat = mat(look.boots?.[1] ?? '#ffffff', 0.6);
  const light = new THREE.Color(kit.shirt).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6;

  // tronco (camisola) e ancas (calções)
  const torso = capsule(0.17, 0.3, shirtMat, 0.37);
  torso.scale.set(1.22, 1, 0.72);
  body.add(torso);
  const hips = capsule(0.15, 0.08, shortsMat, 0.02);
  hips.scale.set(1.3, 1, 0.85);
  body.add(hips);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshStandardMaterial({ map: numberTex(kit.number, kit.shirt, light ? '#111' : '#fff'), transparent: true }));
  back.position.set(0, 0.43, -0.128);
  back.rotation.y = Math.PI;
  body.add(back);
  const front = back.clone();
  front.rotation.y = 0;
  front.scale.set(0.42, 0.42, 1);
  front.position.set(0.08, 0.5, 0.128);
  body.add(front);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.1, 10), skinMat);
  neck.position.y = 0.68;
  body.add(neck);
  // cabeça: ligeiramente alongada, orelhas, nariz, cabelo e barba
  const head = new THREE.Group();
  head.position.y = 0.81;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.118, 20, 14), skinMat);
  skull.scale.set(0.92, 1.08, 0.98);
  skull.castShadow = true;
  head.add(skull);
  for (const x of [-0.11, 0.11]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), skinMat);
    ear.position.set(x, 0, -0.005);
    ear.scale.set(0.6, 1, 0.8);
    head.add(ear);
  }
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.045, 0.035), skinMat);
  nose.position.set(0, -0.01, 0.115);
  head.add(nose);
  hairFor(look, hairMat, head);
  body.add(head);

  const thigh: THREE.Object3D[] = [], shin: THREE.Object3D[] = [], arm: THREE.Object3D[] = [], fore: THREE.Object3D[] = [];
  for (const x of [-0.095, 0.095]) {
    const th = new THREE.Object3D();
    th.position.set(x, -0.02, 0);
    th.add(capsule(0.078, 0.12, shortsMat, -0.1)); // perna dos calções
    th.add(capsule(0.066, 0.2, skinMat, -0.3));
    const sh = new THREE.Object3D();
    sh.position.y = -0.44;
    sh.add(capsule(0.06, 0.07, skinMat, -0.03));
    sh.add(capsule(0.058, 0.26, sockMat, -0.23));
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.075, 0.25), bootMat);
    boot.position.set(0, -0.43, 0.05);
    boot.castShadow = true;
    sh.add(boot);
    // sola e risca lateral noutra cor
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.02, 0.255), soleMat);
    sole.position.set(0, -0.475, 0.05);
    sh.add(sole);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.104, 0.018, 0.14), soleMat);
    stripe.position.set(0, -0.42, 0.06);
    sh.add(stripe);
    th.add(sh);
    body.add(th);
    thigh.push(th);
    shin.push(sh);
  }
  for (const x of [-0.25, 0.25]) {
    const a = new THREE.Object3D();
    a.position.set(x, 0.58, 0);
    a.add(capsule(0.058, 0.18, shirtMat, -0.14)); // manga
    const fo = new THREE.Object3D();
    fo.position.y = -0.29;
    fo.add(capsule(0.048, 0.18, kit.gk ? shirtMat : skinMat, -0.12));
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.048, 10, 8), skinMat);
    hand.position.y = -0.28;
    hand.scale.set(0.8, 1.1, 0.6);
    fo.add(hand);
    a.add(fo);
    body.add(a);
    arm.push(a);
    fore.push(fo);
  }
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

