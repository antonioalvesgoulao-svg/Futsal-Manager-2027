// Momentos importantes em 3D: a mesma jogada do 2D (coreografia), com pavilhão, jogadores, bola,
// várias câmaras e repetição. Movimento contínuo, sem cortes.
import * as THREE from 'three';

import type { Choreo } from '../../core/visual/choreo';

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
interface Actor {
  g: THREE.Group;
  legs: THREE.Object3D[];
  arms: THREE.Object3D[];
  prev: THREE.Vector3;
  heading: number;
}

function numberTex(n: number | null, color: string, text: string) {
  return canvasTex(128, 128, (c) => {
    c.fillStyle = color; c.fillRect(0, 0, 128, 128);
    c.fillStyle = text; c.font = 'bold 84px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(n ?? ''), 64, 70);
  });
}

function makePlayer(shirt: string, shorts: string, number: number | null, skin: string) {
  const g = new THREE.Group();
  const shirtMat = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.7 });
  const shortsMat = new THREE.MeshStandardMaterial({ color: shorts, roughness: 0.7 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.8 });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.6, 0.24), shirtMat);
  torso.position.y = 1.2;
  torso.castShadow = true;
  g.add(torso);
  const light = new THREE.Color(shirt).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6;
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ map: numberTex(number, shirt, light ? '#111' : '#fff') }));
  back.position.set(0, 1.25, -0.125);
  back.rotation.y = Math.PI;
  g.add(back);
  const front = back.clone();
  front.position.z = 0.125;
  front.rotation.y = 0;
  front.scale.set(0.5, 0.5, 1);
  front.position.set(0.1, 1.33, 0.125);
  g.add(front);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), skinMat);
  head.position.y = 1.65;
  head.castShadow = true;
  g.add(head);
  const hips = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.24), shortsMat);
  hips.position.y = 0.85;
  g.add(hips);
  const legs: THREE.Object3D[] = [];
  for (const x of [-0.1, 0.1]) {
    const pivot = new THREE.Object3D();
    pivot.position.set(x, 0.8, 0);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.78, 0.14), skinMat);
    leg.position.y = -0.39;
    leg.castShadow = true;
    const sock = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, 0.15), shortsMat);
    sock.position.y = -0.62;
    pivot.add(leg, sock);
    g.add(pivot);
    legs.push(pivot);
  }
  const arms: THREE.Object3D[] = [];
  for (const x of [-0.27, 0.27]) {
    const pivot = new THREE.Object3D();
    pivot.position.set(x, 1.45, 0);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 0.1), shirtMat);
    arm.position.y = -0.27;
    pivot.add(arm);
    g.add(pivot);
    arms.push(pivot);
  }
  return { g, legs, arms };
}

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
    let hsh = 0;
    for (const ch of id) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const pm = makePlayer(shirt, shorts, inf.number, skins[hsh % skins.length]);
    this.scene.add(pm.g);
    a = { g: pm.g, legs: pm.legs, arms: pm.arms, prev: new THREE.Vector3(), heading: 0 };
    this.actors.set(id, a);
    return a;
  }

  private frame = (now: number) => {
    if (!this.host.isConnected || !this.choreo) return;
    const dtReal = Math.max(0, Math.min(0.05, (now - this.last) / 1000));
    this.last = now;
    this.t = Math.min(this.to, this.t + dtReal * this.speed);
    const f = this.choreo.at(this.t);
    // bola: x do motor = x do 3D; y do motor = z do 3D
    this.ballMesh.position.set(f.ball.x, Math.max(0.11, f.ball.z), f.ball.y);
    this.ballMesh.rotation.x += dtReal * this.speed * 10;
    const seen = new Set<string>();
    for (const [id, p] of Object.entries(f.pos)) {
      seen.add(id);
      const a = this.actor(id);
      a.g.visible = true;
      const target = new THREE.Vector3(p.x, 0, p.y);
      if (a.prev.lengthSq() === 0) a.g.position.copy(target);
      const before = a.g.position.clone();
      a.g.position.lerp(target, 0.5);
      const vel = before.distanceTo(a.g.position) / Math.max(1e-4, dtReal * this.speed);
      // virar para a bola, suavemente
      const want = Math.atan2(f.ball.x - a.g.position.x, f.ball.y - a.g.position.z);
      let d = want - a.heading;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      a.heading += d * 0.2;
      a.g.rotation.set(0, a.heading, 0);
      const swing = Math.min(1, vel / 5) * Math.sin(this.t * 16) * 0.75;
      a.legs[0].rotation.x = swing;
      a.legs[1].rotation.x = -swing;
      a.arms[0].rotation.x = -swing * 0.8;
      a.arms[1].rotation.x = swing * 0.8;
      a.prev.copy(a.g.position);
    }
    for (const [id, a] of this.actors) if (!seen.has(id)) a.g.visible = false;
    if (f.holder) this.lastHolder = f.holder;
    this.updateCamera(f.ball);
    this.renderer.render(this.scene, this.camera);
    if (this.t >= this.to && !this.ended) {
      this.ended = true;
      this.onEnd?.();
    }
    if (!this.ended) this.raf = requestAnimationFrame(this.frame);
  };

  private updateCamera(b: { x: number; y: number; z: number }) {
    const cam = this.camera;
    const ball = new THREE.Vector3(b.x, 0, b.y);
    const dir = Math.sign(this.choreo?.attackDirection ?? 1) || 1;
    let pos: THREE.Vector3;
    let look: THREE.Vector3;
    if (this.cameraId === 'baliza') {
      pos = new THREE.Vector3(dir * (W / 2 + 1.7), 2.8, ball.z * 0.15);
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
