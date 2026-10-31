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

  // ---- tochas: chama (partículas aditivas), fumo e luz ----
  const nTorch = 8;
  const torches = Array.from({ length: nTorch }, (_, i) => at(((i + 0.5) / nTorch - 0.5) * z.width * 0.8, 1 + r() * Math.max(1, z.rows - 3), 1.5));
  const P = 26; // partículas por tocha
  const fireGeo = new THREE.BufferGeometry();
  const firePos = new Float32Array(nTorch * P * 3);
  fireGeo.setAttribute('position', new THREE.BufferAttribute(firePos, 3));
  const fireColor = new THREE.Color(c1).lerp(new THREE.Color('#ffffff'), 0.25);
  const fire = new THREE.Points(fireGeo, new THREE.PointsMaterial({ color: fireColor, size: 0.7, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
  fire.frustumCulled = false;
  fire.visible = false;
  scene.add(fire);
  const S = 18;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePos = new Float32Array(nTorch * S * 3);
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
  const smoke = new THREE.Points(smokeGeo, new THREE.PointsMaterial({ color: new THREE.Color(c1).lerp(new THREE.Color('#bbbbbb'), 0.6), size: 2.2, transparent: true, opacity: 0.22, depthWrite: false }));
  smoke.frustumCulled = false;
  smoke.visible = false;
  scene.add(smoke);
  const glow = new THREE.PointLight(c1, 0, 26);
  glow.position.copy(at(0, z.rows / 2, 3));
  scene.add(glow);
  const pr = Array.from({ length: nTorch * P }, () => r());
  const sr = Array.from({ length: nTorch * S }, () => r());

  return {
    update(now: number, tifoOn: boolean, flaresOn: boolean) {
      for (const f of flags) f.g.children[1].rotation.y = Math.sin(now * 3.2 + f.ph) * 0.55;
      tifo.visible = tifoOn;
      fire.visible = smoke.visible = flaresOn;
      glow.intensity = flaresOn ? 60 + Math.sin(now * 23) * 15 + Math.sin(now * 37) * 10 : 0;
      if (!flaresOn) return;
      for (let t = 0; t < nTorch; t++) {
        const o = torches[t];
        for (let i = 0; i < P; i++) {
          const k = t * P + i;
          const life = (now * 1.6 + pr[k]) % 1; // cada partícula sobe e renasce
          firePos[k * 3] = o.x + (pr[(k + 7) % pr.length] - 0.5) * 0.35 * (1 - life);
          firePos[k * 3 + 1] = o.y + life * 0.9;
          firePos[k * 3 + 2] = o.z + (pr[(k + 13) % pr.length] - 0.5) * 0.35 * (1 - life);
        }
        for (let i = 0; i < S; i++) {
          const k = t * S + i;
          const life = (now * 0.25 + sr[k]) % 1;
          smokePos[k * 3] = o.x + (sr[(k + 5) % sr.length] - 0.5) * 2.5 * life;
          smokePos[k * 3 + 1] = o.y + 0.8 + life * 5;
          smokePos[k * 3 + 2] = o.z + (sr[(k + 11) % sr.length] - 0.5) * 2.5 * life;
        }
      }
      fireGeo.attributes.position.needsUpdate = true;
      smokeGeo.attributes.position.needsUpdate = true;
    },
  };
}
