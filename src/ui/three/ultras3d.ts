// Claques (só em jogos grandes): bandeiras a abanar e faixas no topo, tifo gigante na entrada das equipas,
// tochas e fumo nas cores da equipa na entrada e nos golos. Grafismo próprio: riscas e o nome
// do clube, sem símbolos nem nomes reais das claques.
import * as THREE from 'three';

import { canvasTex } from './arena3d';

export interface UltrasZone {
  side: 'E' | 'W' | 'N' | 'S';
  out: number; // +1 / -1: para fora do campo
  front: number; // distância da primeira fila ao centro
  rows: number;
  rowD: number;
  rise: number;
  base: number;
  width: number; // comprimento da bancada
  colors: [string, string];
  name: string; // nome do clube (no tifo)
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export function buildUltras(scene: THREE.Scene, z: UltrasZone, seed: number) {
  let s = seed >>> 0 || 1;
  const r = () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)), ((s ^= s >>> 16) >>> 0) / 4294967296);
  const endSide = z.side === 'E' || z.side === 'W';
  // ponto na bancada: u ao longo da bancada, fila (0..rows)
  const at = (u: number, row: number, dy = 0) => {
    const d = z.out * (z.front + row * z.rowD + 0.3);
    const y = z.base + row * z.rise + dy;
    return endSide ? v(d, y, u) : v(u, y, d);
  };
  const [c1, c2] = z.colors;
  const light = new THREE.Color(c1).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6;
  const c2v = c2 === c1 || (light && new THREE.Color(c2).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6) ? '#111111' : c2;

  // ---- bandeiras em mastros ----
  const flagTex = [0, 1, 2].map((k) => canvasTex(128, 80, (c) => {
    if (k === 0) { c.fillStyle = c1; c.fillRect(0, 0, 128, 80); c.fillStyle = c2v; c.fillRect(0, 30, 128, 20); }
    else if (k === 1) { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? c1 : c2v; c.fillRect(i * 16, 0, 16, 80); } }
    else { c.fillStyle = c2v; c.fillRect(0, 0, 128, 80); c.fillStyle = c1; c.beginPath(); c.moveTo(0, 0); c.lineTo(128, 80); c.lineTo(0, 80); c.fill(); }
  }));
  const poleMat = new THREE.MeshStandardMaterial({ color: '#d1d5db', metalness: 0.5, roughness: 0.4 });
  const flags: { g: THREE.Group; ph: number }[] = [];
  const nFlags = Math.round(z.width / 2.4);
  for (let i = 0; i < nFlags; i++) {
    const u = (i / Math.max(1, nFlags - 1) - 0.5) * z.width * 0.85 + (r() - 0.5);
    const p = at(u, 1 + r() * (z.rows - 2), 0.9);
    const g = new THREE.Group();
    g.position.copy(p);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.6, 6), poleMat);
    pole.position.y = 1.3;
    g.add(pole);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.95, 8, 1), new THREE.MeshStandardMaterial({ map: flagTex[i % 3], side: THREE.DoubleSide, roughness: 0.8 }));
    fl.position.set(0.78, 2.1, 0);
    g.add(fl);
    g.rotation.y = endSide ? (z.out > 0 ? Math.PI / 2 : -Math.PI / 2) : z.out > 0 ? Math.PI : 0;
    scene.add(g);
    flags.push({ g, ph: r() * 6 });
  }

  // ---- faixas: uma comprida no muro da frente e outras penduradas nas grades a meio da bancada ----
  const phrases = [`${z.name.toUpperCase()} SEMPRE`, 'SEMPRE CONTIGO', `ORGULHO ${z.name.toUpperCase()}`, 'NUNCA DESISTIR', 'A NOSSA PAIXÃO'];
  const banner = (text: string, k: number, wpx = 1024) => canvasTex(wpx, 128, (c) => {
    c.fillStyle = k % 2 ? c2v : c1; c.fillRect(0, 0, wpx, 128);
    c.fillStyle = k % 2 ? c1 : c2v; c.fillRect(0, 0, wpx, 12); c.fillRect(0, 116, wpx, 12);
    c.fillStyle = (k % 2 ? c1 : c2v) === '#111111' && !light ? '#ffffff' : k % 2 ? c1 : c2v === '#111111' ? '#ffffff' : c2v;
    c.font = 'bold 76px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, wpx / 2, 68, wpx - 40);
  });
  const faceCourt = endSide ? (z.out > 0 ? -Math.PI / 2 : Math.PI / 2) : z.out > 0 ? Math.PI : 0;
  const addBanner = (text: string, k: number, u: number, row: number, w: number, dy: number, inward: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.95), new THREE.MeshStandardMaterial({ map: banner(text, k), side: THREE.DoubleSide, roughness: 0.85 }));
    const p = at(u, row, dy);
    // ligeiramente para o lado do campo, para ficar à frente das pessoas
    if (endSide) p.x -= z.out * inward; else p.z -= z.out * inward;
    m.position.copy(p);
    m.rotation.y = faceCourt;
    scene.add(m);
  };
  addBanner(phrases[0], 0, 0, 0, Math.min(16, z.width * 0.7), 0.35, 0.45);
  const nb = Math.max(2, Math.round(z.width / 9));
  for (let i = 0; i < nb; i++) addBanner(phrases[1 + (i % (phrases.length - 1))], i + 1, ((i + 0.5) / nb - 0.5) * z.width * 0.85, Math.max(2, Math.floor(z.rows * 0.55)), Math.min(7, z.width / nb - 0.8), 0.55, 0.45);

  // ---- tifo (pano gigante sobre a bancada, só na entrada das equipas) ----
  const tifoTex = canvasTex(1024, 512, (c) => {
    for (let i = 0; i < 16; i++) { c.fillStyle = i % 2 ? c1 : c2v; c.fillRect(i * 64, 0, 64, 512); }
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(0, 150, 1024, 212);
    c.fillStyle = c1; c.fillRect(0, 170, 1024, 172);
    c.fillStyle = c2v === '#111111' ? '#ffffff' : c2v;
    c.font = 'bold 120px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(z.name.toUpperCase(), 512, 262, 960);
  });
  const slope = Math.hypot(z.rows * z.rowD, z.rows * z.rise);
  const tifo = new THREE.Mesh(new THREE.PlaneGeometry(z.width * 0.9, slope, 24, 8), new THREE.MeshStandardMaterial({ map: tifoTex, side: THREE.DoubleSide, roughness: 0.9 }));
  const a0 = at(0, 0, 1.9), a1 = at(0, z.rows, 1.9);
  tifo.position.copy(a0.clone().add(a1).multiplyScalar(0.5));
  // virado para o campo, inclinado como a bancada
  const tilt = Math.atan2(z.rows * z.rise, z.rows * z.rowD);
  tifo.rotation.order = 'YXZ';
  tifo.rotation.y = endSide ? (z.out > 0 ? -Math.PI / 2 : Math.PI / 2) : z.out > 0 ? Math.PI : 0;
  tifo.rotation.x = -(Math.PI / 2 - tilt);
  tifo.visible = false;
  scene.add(tifo);

  // ---- tochas: adeptos de braço no ar, chama viva, faíscas, fumo que se acumula e luz ----
  const nTorch = 8;
  const fanMat = new THREE.MeshStandardMaterial({ color: c1, roughness: 0.8 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#d49a7a', roughness: 0.7 });
  const stickMat = new THREE.MeshStandardMaterial({ color: '#7a1f1f', roughness: 0.6 });
  const holders = Array.from({ length: nTorch }, (_, i) => {
    const base = at(((i + 0.5) / nTorch - 0.5) * z.width * 0.8 + (r() - 0.5), 1 + r() * Math.max(1, z.rows - 3), 0);
    const g = new THREE.Group();
    g.position.copy(base);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.5, 3, 8), fanMat);
    body.position.y = 0.95;
    body.scale.set(1.1, 1, 0.75);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), skinMat);
    head.position.y = 1.48;
    // braço erguido (roda no ombro) com a tocha na mão
    const shoulder = new THREE.Group();
    shoulder.position.set(0.2, 1.3, 0);
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.5, 3, 6), fanMat);
    arm.position.y = 0.3;
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.32, 6), stickMat);
    stick.position.y = 0.66;
    shoulder.add(arm, stick);
    g.add(body, head, shoulder);
    g.visible = false;
    scene.add(g);
    return { g, shoulder, ph: r() * 6, sp: 0.7 + r() * 0.8, tip: new THREE.Vector3() };
  });

  // partículas com tamanho, cor e transparência próprias (shader simples, pontos redondos e suaves)
  const pointsMat = (additive: boolean) => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexShader: `attribute float aSize; attribute float aAlpha; attribute vec3 aColor; varying float vA; varying vec3 vC;
      void main() { vA = aAlpha; vC = aColor; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = min(220.0, aSize * 300.0 / max(0.5, -mv.z)); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `varying float vA; varying vec3 vC;
      void main() { vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0; if (r > 1.0) discard; gl_FragColor = vec4(vC, vA * pow(1.0 - r, 1.6)); }`,
  });
  interface Pool { n: number; pos: Float32Array; size: Float32Array; alpha: Float32Array; color: Float32Array; vel: Float32Array; age: Float32Array; life: Float32Array; geo: THREE.BufferGeometry; next: number }
  const pool = (n: number, additive: boolean): Pool => {
    const geo = new THREE.BufferGeometry();
    const p: Pool = { n, pos: new Float32Array(n * 3), size: new Float32Array(n), alpha: new Float32Array(n), color: new Float32Array(n * 3), vel: new Float32Array(n * 3), age: new Float32Array(n).fill(99), life: new Float32Array(n).fill(1), geo, next: 0 };
    geo.setAttribute('position', new THREE.BufferAttribute(p.pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(p.size, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(p.alpha, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(p.color, 3));
    const pts = new THREE.Points(geo, pointsMat(additive));
    pts.frustumCulled = false;
    pts.renderOrder = additive ? 3 : 2;
    scene.add(pts);
    return p;
  };
  const flame = pool(nTorch * 40, true);
  const sparks = pool(nTorch * 25, true);
  const smoke = pool(170, false);
  const team = new THREE.Color(c1);
  if (team.getHSL({ h: 0, s: 0, l: 0 }).l < 0.25) team.offsetHSL(0, 0, 0.2);
  const smokeTint = team.clone().lerp(new THREE.Color('#c8c8c8'), 0.55);
  const emit = (p: Pool, x: number, y: number, zz: number, vx: number, vy: number, vz: number, life: number) => {
    const i = p.next;
    p.next = (p.next + 1) % p.n;
    p.pos.set([x, y, zz], i * 3);
    p.vel.set([vx, vy, vz], i * 3);
    p.age[i] = 0;
    p.life[i] = life;
  };
  const glow = new THREE.PointLight(team, 0, 22, 1.6);
  glow.position.copy(at(0, z.rows / 2, 3));
  scene.add(glow);
  let last = -1;
  let acc = 0;

  const tick = (now: number, flaresOn: boolean) => {
    const dt = last < 0 ? 0 : Math.min(0.1, Math.max(0, now - last));
    last = now;
    // adeptos com as tochas: braço no ar, a abanar devagar, cada um ao seu ritmo
    for (const h of holders) {
      h.g.visible = flaresOn;
      h.shoulder.rotation.z = -0.25 + Math.sin(now * h.sp + h.ph) * 0.45;
      h.shoulder.rotation.x = Math.sin(now * h.sp * 0.7 + h.ph * 2) * 0.25;
      h.g.updateMatrixWorld(true);
      h.tip.set(0, 0.84, 0).applyMatrix4(h.shoulder.matrixWorld);
    }
    // nascimento de partículas (só com as tochas acesas)
    if (flaresOn) {
      acc += dt;
      while (acc > 1 / 60) {
        acc -= 1 / 60;
        for (const h of holders) {
          const t = h.tip;
          for (let k = 0; k < 2; k++) emit(flame, t.x + (r() - 0.5) * 0.06, t.y, t.z + (r() - 0.5) * 0.06, (r() - 0.5) * 0.3, 0.9 + r() * 0.9, (r() - 0.5) * 0.3, 0.25 + r() * 0.3);
          if (r() < 0.35) emit(sparks, t.x, t.y + 0.05, t.z, (r() - 0.5) * 2.4, 1 + r() * 2.2, (r() - 0.5) * 2.4, 0.5 + r() * 0.5);
          if (r() < 0.12) emit(smoke, t.x, t.y + 0.25, t.z, (r() - 0.5) * 0.25, 0.45 + r() * 0.3, (r() - 0.5) * 0.25, 9 + r() * 5);
        }
      }
    }
    // chama: núcleo quase branco que passa à cor da equipa e se apaga, a tremeluzir
    for (let i = 0; i < flame.n; i++) {
      const a = (flame.age[i] += dt), k = a / flame.life[i];
      if (k >= 1) { flame.alpha[i] = 0; continue; }
      for (let j = 0; j < 3; j++) flame.pos[i * 3 + j] += flame.vel[i * 3 + j] * dt;
      const flick = 0.75 + 0.25 * Math.sin(now * 40 + i * 1.7);
      const w = Math.max(0, 1 - k * 2.2);
      flame.color[i * 3] = team.r + (1 - team.r) * w;
      flame.color[i * 3 + 1] = team.g + (0.95 - team.g) * w;
      flame.color[i * 3 + 2] = team.b + (0.85 - team.b) * w;
      flame.size[i] = (0.5 + (1 - k) * 0.45) * flick;
      flame.alpha[i] = (1 - k) * 0.9 * flick;
    }
    // faíscas: saltam e caem
    for (let i = 0; i < sparks.n; i++) {
      const a = (sparks.age[i] += dt), k = a / sparks.life[i];
      if (k >= 1) { sparks.alpha[i] = 0; continue; }
      sparks.vel[i * 3 + 1] -= 6 * dt;
      for (let j = 0; j < 3; j++) sparks.pos[i * 3 + j] += sparks.vel[i * 3 + j] * dt;
      sparks.color.set([1, 0.92, 0.7], i * 3);
      sparks.size[i] = 0.09;
      sparks.alpha[i] = 1 - k;
    }
    // fumo: sobe devagar, abranda, alarga-se e deriva; fica no ar depois de as tochas se apagarem
    for (let i = 0; i < smoke.n; i++) {
      const a = (smoke.age[i] += dt), k = a / smoke.life[i];
      if (k >= 1) { smoke.alpha[i] = 0; continue; }
      smoke.vel[i * 3 + 1] *= 1 - 0.18 * dt;
      smoke.vel[i * 3] += Math.sin(now * 0.3 + i) * 0.04 * dt;
      for (let j = 0; j < 3; j++) smoke.pos[i * 3 + j] += smoke.vel[i * 3 + j] * dt;
      smoke.color.set([smokeTint.r, smokeTint.g, smokeTint.b], i * 3);
      smoke.size[i] = 0.8 + k * 4.5;
      smoke.alpha[i] = Math.min(1, a * 2) * (1 - k) * 0.42;
    }
    for (const p of [flame, sparks, smoke]) for (const n of ['position', 'aSize', 'aAlpha', 'aColor']) p.geo.attributes[n].needsUpdate = true;
    // luz da chama, irregular
    glow.intensity = flaresOn ? 55 + 18 * Math.sin(now * 17) + 12 * Math.sin(now * 29 + 1) + 10 * (r() - 0.5) : 0;
  };

  return {
    update(now: number, tifoOn: boolean, flaresOn: boolean) {
      for (const f of flags) f.g.children[1].rotation.y = Math.sin(now * 3.2 + f.ph) * 0.55;
      tifo.visible = tifoOn;
      tick(now, flaresOn);
    },
  };
}
