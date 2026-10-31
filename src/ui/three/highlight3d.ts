// Momentos importantes em 3D: pavilhão, jogadores, bola, várias câmaras e repetição.
// O lance é reconstruído a partir do evento do motor (golo, poste, defesa, penálti, livre de 10 m, etc.).
import * as THREE from 'three';

export type MomentType = 'golo' | 'poste' | 'remate_defendido' | 'remate_fora' | 'penalti' | 'livre_10m' | 'vermelho' | 'gr_avancado_on' | 'canto';
export type CameraId = 'tv' | 'baliza' | 'aerea' | 'jogador';

export interface MomentPlayer {
  number: number | null;
  name: string;
}

export interface Moment {
  type: MomentType;
  // o lance termina com golo? (penálti/livre/canto podem ou não dar golo)
  goal: boolean;
  saved?: boolean;
  post?: boolean;
  attackers: MomentPlayer[]; // 4 ou 5 jogadores de campo; o primeiro é quem finaliza
  defenders: MomentPlayer[];
  attColors: [string, string];
  defColors: [string, string];
  caption: string;
  arena: string;
  seed: number;
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
  path: { t: number; p: THREE.Vector3 }[];
  fall?: number; // instante em que cai (falta)
  dive?: { t: number; dir: number }; // mergulho do guarda-redes
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

function samplePath(path: { t: number; p: THREE.Vector3 }[], t: number) {
  if (t <= path[0].t) return path[0].p.clone();
  for (let i = 1; i < path.length; i++) {
    if (t <= path[i].t) {
      const a = path[i - 1], b = path[i];
      const k = (t - a.t) / (b.t - a.t);
      const s = k * k * (3 - 2 * k);
      return a.p.clone().lerp(b.p, s);
    }
  }
  return path[path.length - 1].p.clone();
}

// ---------- guião do lance ----------
interface Script {
  duration: number;
  ball: { t: number; p: THREE.Vector3 }[];
  actors: { side: 'att' | 'def'; idx: number; gk: boolean; path: { t: number; p: THREE.Vector3 }[]; fall?: number; dive?: { t: number; dir: number } }[];
  shooterIdx: number;
  shotT: number;
}

function buildScript(m: Moment): Script {
  const r = rng(m.seed);
  const GX = W / 2; // atacam para +x
  const att = Math.min(5, Math.max(4, m.attackers.length));
  const actors: Script['actors'] = [];
  const ball: Script['ball'] = [];
  const p = (x: number, z: number, y = 0.11) => v3(x, y, z);
  let shotFrom = p(13, -1.5);
  let shotT = 4.2;
  let duration = 7;
  const target = m.goal
    ? p(GX + 0.4, -1.2 + r() * 2.4, 0.3 + r() * 1.3)
    : m.post
      ? p(GX, 1.5, 0.9)
      : m.saved
        ? p(GX - 0.4, -0.6 + r() * 1.2, 0.5 + r() * 0.8)
        : p(GX + 0.3, (r() < 0.5 ? -1 : 1) * (1.9 + r() * 0.8), 0.4 + r());

  if (m.type === 'penalti' || m.type === 'livre_10m') {
    const d = m.type === 'penalti' ? 6 : 10;
    shotFrom = p(GX - d, 0);
    shotT = 2.4;
    duration = 5.5;
    ball.push({ t: 0, p: shotFrom.clone() }, { t: shotT, p: shotFrom.clone() });
    actors.push({ side: 'att', idx: 0, gk: false, path: [{ t: 0, p: p(GX - d - 3, -0.5, 0) }, { t: 1.6, p: p(GX - d - 2.2, -0.4, 0) }, { t: shotT, p: p(GX - d - 0.3, -0.2, 0) }, { t: duration, p: p(GX - d + 1, 0, 0) }] });
    for (let i = 1; i < att; i++) actors.push({ side: 'att', idx: i, gk: false, path: [{ t: 0, p: p(GX - d - 4 - i, -6 + i * 3, 0) }] });
    for (let i = 0; i < 4; i++) actors.push({ side: 'def', idx: i, gk: false, path: [{ t: 0, p: p(GX - d - 4.5 - i * 0.6, 5 - i * 3.4, 0) }] });
  } else if (m.type === 'canto') {
    const corner = p(GX - 0.2, H / 2 - 0.2);
    shotFrom = p(GX - 4.5, -0.8);
    shotT = 3.2;
    ball.push({ t: 0, p: corner.clone() }, { t: 1.6, p: corner.clone() }, { t: shotT, p: shotFrom.clone() });
    actors.push({ side: 'att', idx: 0, gk: false, path: [{ t: 0, p: p(GX - 9, -2, 0) }, { t: shotT - 0.1, p: p(GX - 4.8, -0.9, 0) }, { t: duration, p: p(GX - 3.5, -0.5, 0) }] });
    actors.push({ side: 'att', idx: 1, gk: false, path: [{ t: 0, p: p(GX - 0.6, H / 2 + 0.3, 0) }] });
    for (let i = 2; i < att; i++) actors.push({ side: 'att', idx: i, gk: false, path: [{ t: 0, p: p(GX - 7 - i, 3 - i * 2, 0) }, { t: 3, p: p(GX - 5 - i, 2 - i * 2, 0) }] });
    for (let i = 0; i < 4; i++) actors.push({ side: 'def', idx: i, gk: false, path: [{ t: 0, p: p(GX - 3 - (i % 2) * 2.5, -2.5 + i * 1.6, 0) }, { t: 3, p: p(GX - 3.6 - (i % 2) * 2, -1.8 + i * 1.2, 0) }] });
  } else if (m.type === 'vermelho') {
    // falta para expulsão em situação de golo iminente
    duration = 5;
    shotT = 99;
    const foulAt = p(GX - 9, 0.5);
    ball.push({ t: 0, p: p(GX - 22, 2) }, { t: 2.6, p: foulAt.clone() }, { t: 3.4, p: p(GX - 7, 1.2) }, { t: duration, p: p(GX - 6.5, 1.4) });
    actors.push({ side: 'att', idx: 0, gk: false, path: [{ t: 0, p: p(GX - 22.5, 2, 0) }, { t: 2.7, p: p(GX - 9.4, 0.5, 0) }, { t: duration, p: p(GX - 8.8, 0.7, 0) }], fall: 2.75 });
    actors.push({ side: 'def', idx: 0, gk: false, path: [{ t: 0, p: p(GX - 16, -4, 0) }, { t: 2.7, p: p(GX - 9.2, 0.1, 0) }, { t: duration, p: p(GX - 8.6, 0.4, 0) }] });
    for (let i = 1; i < att; i++) actors.push({ side: 'att', idx: i, gk: false, path: [{ t: 0, p: p(GX - 24 - i * 2, -6 + i * 3, 0) }, { t: duration, p: p(GX - 14 - i * 2, -6 + i * 3, 0) }] });
    for (let i = 1; i < 4; i++) actors.push({ side: 'def', idx: i, gk: false, path: [{ t: 0, p: p(GX - 14 + i, -6 + i * 3.5, 0) }, { t: duration, p: p(GX - 10 + i, -5 + i * 3, 0) }] });
  } else {
    // jogada corrida: 3 passes até ao remate
    const counter = r() < 0.3;
    const chain = [p(GX - 21 + r() * 3, -2 + r() * 4), p(GX - 14, -5 + r() * 2), p(GX - 10, 4 - r() * 2), (shotFrom = p(GX - 6.5 - r() * 3, -2 + r() * 4))];
    const times = counter ? [0, 1.0, 2.0, 3.0] : [0, 1.4, 2.7, 3.8];
    shotT = times[3] + 0.35;
    chain.forEach((c, i) => ball.push({ t: times[i], p: c.clone() }));
    ball.push({ t: shotT, p: shotFrom.clone() });
    // quem participa na jogada: idx 3,2,1 passam, idx 0 finaliza
    const order = [3 % att, 2, 1, 0];
    order.forEach((idx, i) => {
      const at = chain[i];
      actors.push({ side: 'att', idx, gk: false, path: [{ t: 0, p: at.clone().add(v3(-3 + i, -0.11, i % 2 ? 1.5 : -1.5)) }, { t: times[i], p: at.clone().setY(0) }, { t: duration, p: at.clone().setY(0).add(v3(3, 0, i % 2 ? -2 : 2)) }] });
    });
    if (att === 5) actors.push({ side: 'att', idx: 4, gk: false, path: [{ t: 0, p: p(GX - 16, 6, 0) }, { t: duration, p: p(GX - 9, 5, 0) }] });
    for (let i = 0; i < 4; i++) {
      const base = p(GX - 15 + i * 2.6, -5 + i * 3.2, 0);
      const mark = chain[Math.min(3, i + 1)].clone().setY(0).add(v3(1.8, 0, i % 2 ? 0.9 : -0.9));
      actors.push({ side: 'def', idx: i, gk: false, path: [{ t: 0, p: base }, { t: times[Math.min(3, i + 1)] + 0.3, p: mark }, { t: duration, p: mark.clone().add(v3(0.6, 0, 0)) }] });
    }
  }

  // remate e destino da bola
  if (shotT < 50) {
    const flight = m.type === 'penalti' ? 0.45 : 0.55;
    ball.push({ t: shotT + flight, p: target.clone() });
    if (m.goal) ball.push({ t: shotT + flight + 0.25, p: target.clone().add(v3(0.6, -0.2, 0)) }, { t: duration, p: p(GX + 0.8, target.z, 0.11) });
    else if (m.post) ball.push({ t: shotT + flight + 0.8, p: p(GX - 5, 4, 0.5) }, { t: duration, p: p(GX - 7, 6, 0.11) });
    else if (m.saved) ball.push({ t: shotT + flight + 0.7, p: p(GX - 3, target.z < 0 ? -5 : 5, 0.6) }, { t: duration, p: p(GX - 2, target.z < 0 ? -8 : 8, 0.11) });
    else ball.push({ t: shotT + flight + 0.6, p: p(GX + 3, target.z * 1.4, 0.3) }, { t: duration, p: p(GX + 3.5, target.z * 1.5, 0.11) });
  }

  // guarda-redes
  const gkDiveDir = target.z >= 0 ? 1 : -1;
  actors.push({
    side: 'def', idx: -1, gk: true,
    path: [{ t: 0, p: p(GX - 1.2, 0, 0) }, { t: Math.max(0.1, shotT - 0.3), p: p(GX - 1.6, shotFrom.z * 0.25, 0) }, { t: shotT + 0.5, p: p(GX - 1.4, m.saved ? target.z * 0.8 : shotFrom.z * 0.3 + gkDiveDir * 0.6, 0) }, { t: duration, p: p(GX - 1.4, m.saved ? target.z * 0.8 : gkDiveDir * 0.8, 0) }],
    dive: shotT < 50 ? { t: shotT + 0.15, dir: gkDiveDir } : undefined,
  });
  if (m.type !== 'gr_avancado_on') actors.push({ side: 'att', idx: -1, gk: true, path: [{ t: 0, p: p(-GX + 3, 0, 0) }, { t: duration, p: p(-GX + 6, 0, 0) }] });

  return { duration, ball, actors, shooterIdx: 0, shotT };
}

// ---------- vista ----------
export class Highlight3D {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 200);
  private ballMesh: THREE.Mesh;
  private actors: Actor[] = [];
  private script: Script | null = null;
  private t = 0;
  private speed = 1;
  private raf = 0;
  private last = 0;
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
    const h = Math.round(w * 9 / 16);
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  play(m: Moment, speed = 1) {
    for (const a of this.actors) this.scene.remove(a.g);
    this.actors = [];
    this.script = buildScript(m);
    this.t = 0;
    this.speed = speed;
    this.ended = false;
    const skins = ['#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#ffdbac'];
    for (const a of this.script.actors) {
      const att = a.side === 'att';
      const cols = att ? m.attColors : m.defColors;
      const pl = a.gk ? { number: 1, name: '' } : (att ? m.attackers : m.defenders)[a.idx] ?? { number: null, name: '' };
      const shirt = a.gk ? (att ? '#0f766e' : '#7c3aed') : cols[0];
      const shorts = a.gk ? '#111827' : cols[1];
      const pm = makePlayer(shirt, shorts, pl.number, skins[(a.idx + 7 + (att ? 0 : 3)) % skins.length]);
      this.scene.add(pm.g);
      this.actors.push({ g: pm.g, legs: pm.legs, arms: pm.arms, path: a.path, fall: a.fall, dive: a.dive });
    }
    this.snapCamera = true;
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private snapCamera = false;

  replay(speed = 0.6) {
    if (!this.script) return;
    this.t = 0;
    this.speed = speed;
    this.ended = false;
    this.snapCamera = true;
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    if (!this.host.isConnected || !this.script) return;
    const dt = Math.max(0, Math.min(0.05, (now - this.last) / 1000)) * this.speed;
    this.last = now;
    this.t += dt;
    const s = this.script;
    const t = this.t;
    // bola
    const b = samplePath(s.ball, t);
    // arco no ar entre passes
    for (let i = 1; i < s.ball.length; i++) {
      if (t > s.ball[i - 1].t && t < s.ball[i].t) {
        const k = (t - s.ball[i - 1].t) / (s.ball[i].t - s.ball[i - 1].t);
        const dist = s.ball[i - 1].p.distanceTo(s.ball[i].p);
        b.y += Math.sin(k * Math.PI) * Math.min(0.6, dist * 0.03);
      }
    }
    this.ballMesh.position.copy(b);
    this.ballMesh.rotation.x += dt * 12;
    // jogadores
    this.actors.forEach((a) => {
      const prev = a.g.position.clone();
      const p = samplePath(a.path, t);
      a.g.position.set(p.x, 0, p.z);
      const vel = a.g.position.distanceTo(prev) / Math.max(1e-4, dt);
      // virar para a bola
      a.g.lookAt(b.x, 0, b.z);
      const swing = Math.min(1, vel / 4) * Math.sin(t * 14) * 0.7;
      a.legs[0].rotation.x = swing;
      a.legs[1].rotation.x = -swing;
      a.arms[0].rotation.x = -swing * 0.8;
      a.arms[1].rotation.x = swing * 0.8;
      a.g.rotation.z = 0;
      if (a.fall !== undefined && t > a.fall) a.g.rotateZ(Math.min(Math.PI / 2.2, (t - a.fall) * 4));
      if (a.dive && t > a.dive.t) {
        const k = Math.min(1, (t - a.dive.t) * 3.5);
        a.g.rotation.set(0, Math.PI / 2, 0);
        a.g.rotateZ(-a.dive.dir * k * 1.3);
        a.g.position.y = Math.sin(Math.min(1, k) * Math.PI) * 0.35;
        a.arms.forEach((x) => (x.rotation.x = -Math.PI * 0.9));
      }
    });
    this.updateCamera(b);
    this.renderer.render(this.scene, this.camera);
    if (t >= s.duration && !this.ended) {
      this.ended = true;
      this.onEnd?.();
    }
    if (t < s.duration + 2) this.raf = requestAnimationFrame(this.frame);
  };

  private updateCamera(b: THREE.Vector3) {
    const s = this.script!;
    const cam = this.camera;
    let pos: THREE.Vector3;
    let look: THREE.Vector3;
    if (this.cameraId === 'baliza') {
      pos = v3(W / 2 + 1.7, 2.7, b.z * 0.15);
      look = v3(Math.min(b.x, W / 2 - 4), 0.7, b.z * 0.6);
    } else if (this.cameraId === 'aerea') {
      pos = v3(b.x - 2, 24, b.z + 8);
      look = v3(b.x + 1, 0, b.z);
    } else if (this.cameraId === 'jogador') {
      const sh = this.actors[0]?.g.position ?? b;
      pos = v3(sh.x - 4.5, 1.9, sh.z * 1.1 - 0.5);
      look = v3(W / 2, 1, 0);
    } else {
      // televisão: lateral elevada que acompanha a bola, um pouco à frente do lance
      const fx = Math.min(W / 2 - 5, b.x + 3);
      pos = v3(fx * 0.85, 6.5, H / 2 + 8.5);
      look = v3(fx, 0.4, b.z * 0.35);
    }
    void s;
    if (this.snapCamera) { cam.position.copy(pos); this.snapCamera = false; }
    else cam.position.lerp(pos, 0.12);
    const cur = new THREE.Vector3();
    cam.getWorldDirection(cur);
    cam.lookAt(look);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
