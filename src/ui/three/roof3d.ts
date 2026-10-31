// Teto e estrutura dos pavilhões, conforme as fotos: arcos em treliça (Fidelidade, Torres Vedras),
// malha de triângulos plana (Vila do Conde) ou em cúpula (Gondomar), treliças com projetores
// pendurados (municipais), vigas de madeira ou betão (Ponte de Sor, Portimão) e teto escuro com
// grelha de luz LED (João Rocha). As barras de cada estrutura juntam-se numa só malha 3D.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import type { ArenaProfile } from '../../core/attendance';

export type RoofKind = 'arcos' | 'malha' | 'cupula' | 'trelicas' | 'vigas' | 'led' | 'liso';

export function roofKind(pr: ArenaProfile): RoofKind {
  return pr.structure ?? (pr.ceilingDark ? 'led' : pr.beams ? 'vigas' : pr.roof === 'treliça' ? 'trelicas' : 'liso');
}

/** Barras (tubos de secção quadrada) entre dois pontos, juntas numa só geometria. */
class Bars {
  private geos: THREE.BufferGeometry[] = [];
  private static Z = new THREE.Vector3(0, 0, 1);

  add(a: THREE.Vector3, b: THREE.Vector3, t: number) {
    const d = b.clone().sub(a);
    const len = d.length();
    if (len < 1e-3) return;
    const g = new THREE.BoxGeometry(t, t, len);
    const q = new THREE.Quaternion().setFromUnitVectors(Bars.Z, d.normalize());
    g.applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)));
    this.geos.push(g);
  }

  mesh(mat: THREE.Material) {
    if (!this.geos.length) return null;
    const m = new THREE.Mesh(mergeGeometries(this.geos)!, mat);
    for (const g of this.geos) g.dispose();
    this.geos = [];
    return m;
  }
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** Projetores pendurados (corpo escuro e face luminosa). */
function lamps(scene: THREE.Scene, pts: THREE.Vector3[]) {
  const body: THREE.BufferGeometry[] = [];
  const face: THREE.BufferGeometry[] = [];
  for (const p of pts) {
    const b = new THREE.CylinderGeometry(0.24, 0.3, 0.38, 10);
    b.translate(p.x, p.y, p.z);
    body.push(b);
    const f = new THREE.CircleGeometry(0.26, 12);
    f.rotateX(Math.PI / 2);
    f.translate(p.x, p.y - 0.2, p.z);
    face.push(f);
  }
  if (!pts.length) return;
  scene.add(new THREE.Mesh(mergeGeometries(body)!, new THREE.MeshStandardMaterial({ color: '#2b2f36', metalness: 0.5, roughness: 0.4 })));
  scene.add(new THREE.Mesh(mergeGeometries(face)!, new THREE.MeshBasicMaterial({ color: '#fffbe8', side: THREE.DoubleSide })));
}

export function buildRoof(scene: THREE.Scene, pr: ArenaProfile, hallW: number, hallD: number, hallH: number) {
  const kind = roofKind(pr);
  const ceilColor = pr.ceiling ?? (kind === 'led' ? '#17191d' : pr.roof === 'laje' ? '#e7e5e4' : '#cbd5e1');
  const roofMat = new THREE.MeshStandardMaterial({ color: ceilColor, roughness: 0.9, side: THREE.DoubleSide });
  const steel = new THREE.MeshStandardMaterial({ color: pr.truss ?? '#e2e8f0', metalness: 0.35, roughness: 0.5 });
  const bars = new Bars();
  const R = hallD / 2;
  const skyMat = new THREE.MeshBasicMaterial({ color: '#eef6ff', side: THREE.DoubleSide });

  if (kind === 'arcos') {
    // arcos em treliça de lado a lado, sob uma cobertura curva
    const ys = hallH - 1.2;
    const rise = pr.roof === 'abóbada' ? 3.6 : 4.6;
    const yOut = (z: number) => ys + rise * Math.sqrt(Math.max(0, 1 - (z / R) ** 2));
    const vault = new THREE.Mesh(new THREE.CylinderGeometry(R, R, hallW, 40, 1, true, 0, Math.PI), roofMat);
    vault.rotation.z = Math.PI / 2;
    vault.scale.set((rise + 0.25) / R, 1, 1);
    vault.position.y = ys;
    scene.add(vault);
    const N = 30;
    const depth = 1.1;
    const xs: number[] = [];
    for (let x = -hallW / 2 + 2.5; x < hallW / 2 - 1; x += 5) xs.push(x);
    const node = (x: number, i: number, inner: boolean) => {
      const z = -R * 0.98 + (1.96 * R * i) / N;
      return v(x, yOut(z) - 0.2 - (inner ? depth : 0), z);
    };
    // abóbada de betão (Torres Vedras): arcos maciços, sem treliça
    const solid = pr.roof === 'abóbada';
    for (const x of xs) {
      for (let i = 0; i < N && solid; i++) {
        const a0 = node(x, i, false), a1 = node(x, i + 1, false);
        for (const dy of [0, -0.3, -0.6]) bars.add(v(a0.x, a0.y + dy, a0.z), v(a1.x, a1.y + dy, a1.z), 0.5);
      }
      for (let i = 0; i < N && !solid; i++) {
        bars.add(node(x, i, false), node(x, i + 1, false), 0.2);
        bars.add(node(x, i, true), node(x, i + 1, true), 0.2);
        bars.add(node(x, i, true), node(x, i, false), 0.09);
        bars.add(node(x, i, true), node(x, i + 1, false), 0.09);
      }
    }
    // madres e contraventamento em cruz entre arcos
    for (let k = 0; k < xs.length - 1 && !solid; k++) {
      for (let i = 0; i <= N; i += 3) bars.add(node(xs[k], i, false), node(xs[k + 1], i, false), 0.1);
      for (let i = 0; i + 6 <= N; i += 6) {
        bars.add(node(xs[k], i, false), node(xs[k + 1], i + 6, false), 0.12);
        bars.add(node(xs[k], i + 6, false), node(xs[k + 1], i, false), 0.12);
      }
    }
    if (pr.skylights) {
      for (let k = 0; k < xs.length - 1; k += 2) {
        for (const zz of [-R * 0.45, R * 0.45]) {
          const sk = new THREE.Mesh(new THREE.PlaneGeometry(3, 3.2), skyMat);
          const slope = Math.atan2(yOut(zz + 0.1) - yOut(zz - 0.1), 0.2);
          sk.rotation.set(Math.PI / 2 + slope, 0, 0);
          sk.position.set((xs[k] + xs[k + 1]) / 2, yOut(zz) - 0.05, zz);
          scene.add(sk);
        }
      }
    }
    const lp: THREE.Vector3[] = [];
    for (let k = 0; k < xs.length - 1; k++) for (const zz of [-R * 0.55, -R * 0.2, R * 0.2, R * 0.55]) lp.push(v((xs[k] + xs[k + 1]) / 2, yOut(zz) - (solid ? 1.2 : depth + 0.6), zz));
    lamps(scene, lp);
  } else if (kind === 'malha' || kind === 'cupula') {
    // malha espacial: duas camadas de barras ligadas por diagonais (triângulos)
    const A = hallW / 2, B = hallD / 2;
    const rise = kind === 'cupula' ? 6 : 0;
    const h = (x: number, z: number) => rise * Math.sqrt(Math.max(0, 1 - (x * x) / (2 * A * A) - (z * z) / (2 * B * B)));
    const s = 2.6;
    const nx = Math.floor((2 * A) / s), nz = Math.floor((2 * B) / s);
    const top = (i: number, j: number) => { const x = -A + i * s, z = -B + j * s; return v(x, hallH - 0.3 + h(x, z), z); };
    const bot = (i: number, j: number) => { const x = -A + (i + 0.5) * s, z = -B + (j + 0.5) * s; return v(x, hallH - 1.9 + h(x, z), z); };
    for (let i = 0; i <= nx; i++) for (let j = 0; j <= nz; j++) {
      if (i < nx) bars.add(top(i, j), top(i + 1, j), 0.08);
      if (j < nz) bars.add(top(i, j), top(i, j + 1), 0.08);
      if (i < nx && j < nz) {
        if (i < nx - 1) bars.add(bot(i, j), bot(i + 1, j), 0.07);
        if (j < nz - 1) bars.add(bot(i, j), bot(i, j + 1), 0.07);
        for (const [di, dj] of [[0, 0], [1, 0], [0, 1], [1, 1]]) bars.add(bot(i, j), top(i + di, j + dj), 0.05);
      }
    }
    if (kind === 'cupula') {
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), roofMat);
      dome.scale.set(A * Math.SQRT2, rise + 0.4, B * Math.SQRT2);
      dome.position.y = hallH - 0.05;
      scene.add(dome);
    } else {
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(hallW, hallD), roofMat);
      ceil.rotation.x = Math.PI / 2;
      ceil.position.y = hallH;
      scene.add(ceil);
    }
    if (pr.skylights) {
      // claraboias redondas espalhadas pela cobertura
      for (let i = 1; i < nx; i += 3) for (let j = 1; j < nz; j += 3) {
        const p = top(i, j);
        const c = new THREE.Mesh(new THREE.CircleGeometry(0.75, 16), skyMat);
        c.rotation.x = Math.PI / 2;
        c.position.set(p.x + s / 2, p.y + 0.12, p.z + s / 2);
        scene.add(c);
      }
    }
    const lp: THREE.Vector3[] = [];
    for (let i = 2; i < nx - 1; i += 3) for (let j = 2; j < nz - 1; j += 3) { const p = bot(i, j); lp.push(v(p.x, p.y - 0.5, p.z)); }
    lamps(scene, lp);
  } else if (kind === 'trelicas') {
    // asnas metálicas de lado a lado (banzo superior inclinado, inferior direito), madres e projetores
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(hallW, hallD), roofMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = hallH + 0.6;
    scene.add(ceil);
    const yTop = (z: number) => hallH + 0.4 - (Math.abs(z) / R) * 1.2;
    const yBot = hallH - 2.0;
    const step = 1.6;
    const xs: number[] = [];
    for (let x = -hallW / 2 + 3; x < hallW / 2 - 1; x += 6) xs.push(x);
    for (const x of xs) {
      for (let z = -R; z < R - 0.01; z += step) {
        const z2 = Math.min(R, z + step);
        bars.add(v(x, yTop(z), z), v(x, yTop(z2), z2), 0.2);
        bars.add(v(x, yBot, z), v(x, yBot, z2), 0.16);
        bars.add(v(x, yBot, z), v(x, yTop(z), z), 0.08);
        // diagonais viradas para o centro
        if (z < 0) bars.add(v(x, yBot, z2), v(x, yTop(z), z), 0.08);
        else bars.add(v(x, yBot, z), v(x, yTop(z2), z2), 0.08);
      }
    }
    for (let z = -R + 1; z < R; z += 3.2) bars.add(v(-hallW / 2, yTop(z) + 0.1, z), v(hallW / 2, yTop(z) + 0.1, z), 0.1);
    for (let z = -R + 2; z < R; z += 6) bars.add(v(-hallW / 2, yBot, z), v(hallW / 2, yBot, z), 0.07);
    if (pr.skylights) {
      for (let k = 0; k < xs.length - 1; k += 2) for (const zz of [-R * 0.45, R * 0.45]) {
        const sk = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4), skyMat);
        sk.rotation.x = Math.PI / 2;
        sk.position.set((xs[k] + xs[k + 1]) / 2, yTop(zz) + 0.15, zz);
        scene.add(sk);
      }
    }
    const lp: THREE.Vector3[] = [];
    for (let k = 0; k < xs.length - 1; k++) for (let zz = -R * 0.6; zz <= R * 0.61; zz += R * 0.3) lp.push(v((xs[k] + xs[k + 1]) / 2, yBot - 0.5, zz));
    lamps(scene, lp);
  } else {
    // teto plano: liso, com vigas, ou escuro com grelha LED
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(hallW, hallD), roofMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = hallH;
    scene.add(ceil);
    if (kind === 'led') {
      const ledMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
      for (let x = -24; x <= 24; x += 6) bars.add(v(x, hallH - 0.6, -15), v(x, hallH - 0.6, 15), 0.1);
      for (let z = -15; z <= 15; z += 5) bars.add(v(-24, hallH - 0.6, z), v(24, hallH - 0.6, z), 0.1);
      const m = bars.mesh(ledMat);
      if (m) scene.add(m);
    } else {
      if (kind === 'vigas') {
        const bm = new THREE.MeshStandardMaterial({ color: pr.beams ?? '#d5d8db', roughness: 0.7 });
        for (let x = -hallW / 2 + 3; x < hallW / 2; x += 5) {
          const b = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.0, hallD), bm);
          b.position.set(x, hallH - 0.5, 0);
          scene.add(b);
        }
      }
      const lampMat = new THREE.MeshBasicMaterial({ color: '#fffbe8' });
      for (let x = -18; x <= 18; x += 6) for (const z of [-7, 0, 7]) {
        const l = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.7), lampMat);
        l.position.set(x, hallH - (kind === 'vigas' ? 1.1 : 0.4), z);
        scene.add(l);
      }
      if (pr.skylights) for (let x = -hallW / 2 + 7; x < hallW / 2 - 4; x += 12) for (const z of [-hallD / 4, hallD / 4]) {
        const sk = new THREE.Mesh(new THREE.PlaneGeometry(3, 5), skyMat);
        sk.rotation.x = Math.PI / 2;
        sk.position.set(x, hallH - 0.02, z);
        scene.add(sk);
      }
    }
  }
  const m = bars.mesh(steel);
  if (m) { m.castShadow = false; scene.add(m); }
}
