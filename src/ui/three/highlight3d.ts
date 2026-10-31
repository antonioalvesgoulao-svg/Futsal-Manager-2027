// Momentos importantes em 3D: a mesma jogada do 2D (coreografia), no pavilhão do jogo (bancadas,
// adeptos, publicidade LED), com jogadores de aspeto próprio, várias câmaras e repetição.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import type { Look } from '../../core/appearance';
import type { Scene3D } from '../../core/visual/choreo';
import { ArenaHandle, ArenaOpts, buildArena, canvasTex, H, W } from './arena3d';
import { Actor, makePlayer, pose } from './player3d';

export type CameraId = 'tv' | 'baliza' | 'aerea' | 'jogador';

export interface ActorInfo {
  side: 0 | 1;
  referee?: boolean; // equipa de arbitragem
  number: number | null;
  gk: boolean;
  look: Look;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- vista ----------
export class Highlight3D {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 200);
  private ballMesh: THREE.Mesh;
  private actors = new Map<string, Actor>();
  private choreo: Scene3D | null = null;
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

  private arena: ArenaHandle;
  private clock = 0;
  private excite: [number, number] = [0, 0];
  private goalShown = false;
  private scores: [[number, number], [number, number]] | null = null;

  constructor(private host: HTMLElement, opts: ArenaOpts) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // reflexos de ambiente suaves (pele, tecidos e piso deixam de parecer baços)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.45;
    host.appendChild(this.renderer.domElement);
    this.arena = buildArena(this.scene, opts);
    this.colors = [opts.teams[0].colors, opts.teams[1].colors];
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
  play(choreo: Scene3D, info: Record<string, ActorInfo>, colors: [[string, string], [string, string]], from: number, to: number, scores?: [[number, number], [number, number]]) {
    this.choreo = choreo;
    this.scores = scores ?? null;
    this.goalShown = false;
    if (scores) this.arena.setScore(scores[0]);
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
    const inf = this.info[id] ?? { side: 0, number: null, gk: false, look: undefined as unknown as Look };
    const cols: [string, string] = inf.referee ? ['#facc15', '#111111'] : this.colors[inf.side];
    const shirt = inf.gk ? (inf.side === 0 ? '#0f766e' : '#7c3aed') : cols[0];
    const shorts = inf.gk ? '#111827' : cols[1];
    let hsh = 0;
    for (const ch of id) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const look: Look = inf.look ?? { skin: '#d9a77f', hair: '#2e1e14', style: 'curto', beard: 'nenhuma', height: 1.78, boots: ['#111111', '#ffffff'] };
    const pm = makePlayer({ shirt, shorts, socks: inf.gk ? shorts : cols[0], number: inf.number, gk: inf.gk }, look);
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
    // adeptos: festejam o golo da sua equipa, vibram nas ocasiões
    this.clock += dt;
    const cel = Object.entries(f.acts).find(([, a]) => a.kind === 'celebrate');
    const target: [number, number] = [0.08, 0.08];
    if (cel && !this.info[cel[0]]?.referee) target[this.info[cel[0]]?.side ?? 0] = 1;
    else if (Object.values(f.acts).some((a) => a.kind === 'shoot' || a.kind === 'dive')) { target[0] = 0.4; target[1] = 0.4; }
    else if (f.phase === 'Entrada das equipas') { target[0] = 0.75; target[1] = 0.6; }
    if (cel && !this.goalShown) {
      this.goalShown = true;
      this.arena.goal(this.info[cel[0]]?.side ?? 0);
      if (this.scores) this.arena.setScore(this.scores[1]);
    }
    for (const i of [0, 1]) this.excite[i] = lerp(this.excite[i], target[i], Math.min(1, dt * 3));
    this.arena.update(this.clock, this.excite);
    // bola: x do motor = x do 3D; y do motor = z do 3D
    this.ballMesh.position.set(f.ball.x, Math.max(0.11, f.ball.z), f.ball.y);
    this.ballMesh.visible = !f.hideBall;
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
    this.updateCamera(f.focus ? { x: f.focus.x, y: f.focus.y, z: 0 } : f.ball);
    if (render) this.renderer.render(this.scene, this.camera);
  }

  /** Câmara fixa num ponto (para ver o pavilhão como numa fotografia); null volta às câmaras normais. */
  viewFrom(pos: [number, number, number] | null, look: [number, number, number] = [0, 2, 0], fov = 40) {
    this.fixedView = pos ? { pos: new THREE.Vector3(...pos), look: new THREE.Vector3(...look) } : null;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    this.snapCamera = true;
  }
  private fixedView: { pos: THREE.Vector3; look: THREE.Vector3 } | null = null;

  private updateCamera(b: { x: number; y: number; z: number }) {
    const cam = this.camera;
    if (this.fixedView) {
      cam.position.copy(this.fixedView.pos);
      cam.lookAt(this.fixedView.look);
      return;
    }
    const ball = new THREE.Vector3(b.x, 0, b.y);
    const dir = Math.sign(this.choreo?.attackDirection ?? 1) || 1;
    let pos: THREE.Vector3;
    let look: THREE.Vector3;
    if (this.cameraId === 'baliza') {
      pos = new THREE.Vector3(dir * (W / 2 + 3.4), 3.9, ball.z * 0.15);
      look = new THREE.Vector3(ball.x - dir * 2, 0.6, ball.z * 0.7);
    } else if (this.cameraId === 'aerea') {
      pos = new THREE.Vector3(ball.x - dir * 3, Math.min(22, this.arena.height - 1.2), ball.z + 9);
      look = new THREE.Vector3(ball.x + dir * 2, 0, ball.z);
    } else if (this.cameraId === 'jogador') {
      const h = this.lastHolder ? this.actors.get(this.lastHolder)?.g.position : undefined;
      const sh = h ?? ball;
      pos = new THREE.Vector3(sh.x - dir * 5, 2.1, sh.z * 1.05);
      look = new THREE.Vector3(dir * W / 2, 0.8, 0);
    } else {
      // televisão: lateral elevada, acompanha a bola com suavidade (como uma realização real)
      const fx = Math.max(-W / 2 + 6, Math.min(W / 2 - 6, ball.x + dir * 2));
      // câmara principal numa plataforma por cima da primeira fila da bancada lateral
      pos = new THREE.Vector3(fx * 0.85, Math.min(7.5, this.arena.height - 1.5), H / 2 + 8);
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

  setScore(s: [number, number]) {
    this.arena.setScore(s);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
