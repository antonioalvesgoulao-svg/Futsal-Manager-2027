import { LIFT_AT, PODIUM } from '../../core/visual/trophy';
const podiumHeight = (x: number, z: number) => (x >= PODIUM.x0 && x <= PODIUM.x1 && z >= PODIUM.y0 && z <= PODIUM.y1 ? PODIUM.h : 0);
// Momentos importantes em 3D: a mesma jogada do 2D (coreografia), no pavilhão do jogo (bancadas,
// adeptos, publicidade LED), com jogadores de aspeto próprio, várias câmaras e repetição.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { lookOf, type Look } from '../../core/appearance';
import type { Scene3D } from '../../core/visual/choreo';
import { ArenaHandle, ArenaOpts, buildArena, canvasTex, H, W } from './arena3d';
import { Actor, makePlayer, pose, sit } from './player3d';

export type CameraId = 'tv' | 'baliza' | 'aerea' | 'jogador';

export interface ActorInfo {
  side: 0 | 1;
  referee?: boolean; // equipa de arbitragem
  number: number | null;
  name?: string; // nome nas costas
  gk: boolean;
  look: Look;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const textOn = (hex: string) => (new THREE.Color(hex).getHSL({ h: 0, s: 0, l: 0 }).l > 0.6 ? '#111' : '#fff');

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
  onGoal: (() => void) | null = null;
  onFrame: ((f: ReturnType<Scene3D['at']>) => void) | null = null; // som // golo na imagem (para o gráfico de golo)
  private ended = false;

  private arena: ArenaHandle;
  private clock = 0;
  private excite: [number, number] = [0, 0];
  private goalShown = false;
  private netBusy = false;
  private scores: [[number, number], [number, number]] | null = null;

  constructor(private host: HTMLElement, private opts: ArenaOpts) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // resolução moderada: o 3D em ecrã inteiro tem de correr fluido em qualquer computador
    this.renderer.setPixelRatio(Math.min(opts.quality === 'alta' ? 1.75 : 1.25, window.devicePixelRatio));
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

  /** Continua para a jogada seguinte sem cortes (mesmos jogadores, câmara contínua): transições e contra-ataques. */
  continueWith(choreo: Scene3D, from: number, to: number, scores?: [[number, number], [number, number]]) {
    this.choreo = choreo;
    this.from = from;
    this.to = to;
    if (scores) { this.scores = scores; this.arena.setScore(scores[0]); }
    this.goalShown = false;
    this.t = from;
    this.speed = 1;
    this.ended = false;
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Repetição de um trecho (câmara lenta, outro ângulo); o marcador fica com o resultado depois do golo. */
  replayWindow(from: number, to: number, speed: number, cam: CameraId) {
    if (!this.choreo) return;
    this.from = from;
    this.to = to;
    this.cameraId = cam;
    this.goalShown = true; // na repetição não se repete a festa do pavilhão nem o gráfico
    this.start(speed);
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
    a = this.createActor(id);
    this.actors.set(id, a);
    return a;
  }

  // suplentes sentados no banco (escondidos quando estão em campo ou a entrar)
  private bench = new Map<string, Actor>();
  private officials: Actor[] = [];
  setBench(ids: [string[], string[]]) {
    // os dois árbitros auxiliares sentados à mesa (equipados de árbitro)
    if (!this.officials.length) for (const [k, seat] of this.arena.tableSeats.entries()) {
      const id = `auxiliar${k + 1}`;
      this.info[id] = { side: 0, number: null, gk: false, referee: true, look: lookOf({ id }) };
      const a = this.createActor(id);
      a.g.position.set(seat.x, 0, seat.z);
      a.g.rotation.y = 0;
      sit(a);
      this.officials.push(a);
    }
    for (const a of this.bench.values()) this.scene.remove(a.g);
    this.bench.clear();
    ids.forEach((list, sd) => list.slice(0, 10).forEach((id, k) => {
      const seat = this.arena.benchSeats[sd]?.[k];
      if (!seat) return;
      const a = this.createActor(id);
      a.g.position.set(seat.x, 0, seat.z);
      a.g.rotation.y = 0; // virados para o campo
      sit(a);
      const tg = a.g.getObjectByName('tag'); if (tg) tg.removeFromParent();
      this.bench.set(id, a);
    }));
  }

  /** Mostrar ou esconder os nomes por cima dos jogadores. */
  showTags = true;
  setTags(on: boolean) {
    this.showTags = on;
    for (const a of this.actors.values()) { const t = a.g.getObjectByName('tag'); if (t) t.visible = on; }
  }

  private tagTex(n: number | null, name: string, col: string, txt: string) {
    return canvasTex(256, 64, (c) => {
      c.clearRect(0, 0, 256, 64);
      c.fillStyle = 'rgba(10,14,20,.72)';
      c.beginPath(); c.roundRect(4, 8, 248, 48, 10); c.fill();
      c.fillStyle = col;
      c.beginPath(); c.roundRect(4, 8, 56, 48, [10, 0, 0, 10]); c.fill();
      c.textBaseline = 'middle'; c.textAlign = 'center';
      c.font = 'bold 30px Arial, sans-serif'; c.fillStyle = txt;
      c.fillText(String(n ?? ''), 32, 33);
      c.textAlign = 'left'; c.fillStyle = '#fff'; c.font = 'bold 26px "Arial Narrow", Arial, sans-serif';
      c.fillText(name.toUpperCase(), 70, 33, 176);
    });
  }

  private createActor(id: string): Actor {
    let a: Actor;
    const inf = this.info[id] ?? { side: 0, number: null, gk: false, look: undefined as unknown as Look };
    const cols: [string, string] = inf.referee ? [this.opts.refShirt ?? '#facc15', '#111111'] : this.colors[inf.side];
    const kd = inf.referee ? undefined : inf.gk ? this.opts.gkKits?.[inf.side] ?? { shirt: inf.side === 0 ? '#0f766e' : '#7c3aed', shorts: '#111827', socks: '#111827', pattern: 'liso' as const, alt: '#ffffff' } : this.opts.kits?.[inf.side];
    const shirt = kd?.shirt ?? cols[0];
    const shorts = kd?.shorts ?? cols[1];
    let hsh = 0;
    for (const ch of id) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    const look: Look = inf.look ?? { skin: '#d9a77f', hair: '#2e1e14', style: 'curto', beard: 'nenhuma', height: 1.78, boots: ['#111111', '#ffffff'] };
    const pm = makePlayer({ shirt, shorts, socks: kd?.socks ?? cols[0], number: inf.number, name: inf.name, gk: inf.gk, pattern: kd?.pattern, alt: kd?.alt }, look);
    this.scene.add(pm.g);
    // identificação discreta por cima da cabeça: número e apelido, com a cor da equipa
    if (!inf.referee && inf.look) {
      const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.tagTex(inf.number, inf.name ?? '', shirt, textOn(shirt)), transparent: true, opacity: 0.88, depthWrite: false }));
      tag.scale.set(0.95, 0.24, 1);
      tag.position.y = (look.height ?? 1.78) + 0.38;
      tag.name = 'tag';
      tag.visible = this.showTags;
      pm.g.add(tag);
    }
    a = { ...pm, prev: new THREE.Vector3(), heading: 0, phase: (hsh % 10) / 3, speed: 0, stride: 0.93 + (hsh % 15) / 100, init: false };
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
    if (render) this.onFrame?.(f);
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
      this.onGoal?.();
      if (this.scores) this.arena.setScore(this.scores[1]);
    }
    for (const i of [0, 1]) this.excite[i] = lerp(this.excite[i], target[i], Math.min(1, dt * 3));
    this.arena.setCeremony(f.phase === 'Entrada das equipas' || f.phase === 'Alinhamento');
    this.arena.update(this.clock, this.excite);
    // bola: x do motor = x do 3D; y do motor = z do 3D
    this.ballMesh.position.set(f.ball.x, Math.max(0.11, f.ball.z), f.ball.y);
    this.ballMesh.visible = !f.hideBall;
    // bola dentro da baliza (ou na rede lateral por fora): a rede abana
    const bx = Math.abs(f.ball.x), inGoal = bx > W / 2 + 0.05 && bx < W / 2 + 1.1 && Math.abs(f.ball.y) < 1.55 && f.ball.z < 2.05;
    if (inGoal && !this.netBusy && !f.hideBall) { this.netBusy = true; this.arena.netHit(Math.sign(f.ball.x), Math.max(0.2, f.ball.z), f.ball.y); }
    if (!inGoal && bx < W / 2 - 1) this.netBusy = false;
    this.ballMesh.rotation.x += dt * 10;
    const seen = new Set<string>();
    for (const [id, p] of Object.entries(f.pos)) {
      seen.add(id);
      const a = this.actor(id);
      a.g.visible = true;
      const before = a.g.position.clone();
      const podH = this.cer ? podiumHeight(p.x, p.y) : 0;
      a.g.position.set(p.x, this.arena.groundAt(p.x, p.y) + podH, p.y);
      if (!a.init) { before.copy(a.g.position); a.init = true; }
      const vx = (a.g.position.x - before.x) / dt, vz = (a.g.position.z - before.z) / dt;
      const sp0 = a.speed;
      a.speed = lerp(a.speed, Math.min(9, Math.hypot(vx, vz)), Math.min(1, dt * 9));
      a.accel = lerp(a.accel ?? 0, (a.speed - sp0) / Math.max(1e-3, dt), Math.min(1, dt * 4));
      const act = f.acts[id];
      // para onde olha: a ação em curso, a direção da corrida ou a bola
      // no futsal quem não sprinta continua virado para o jogo: recua de costas ou desloca-se de lado (sem rodar o corpo)
      let want = Math.atan2(f.ball.x - p.x, f.ball.y - p.y);
      if (act && (act.kind !== 'run' && act.kind !== 'celebrate' && act.kind !== 'fall')) want = act.ang;
      else if (a.speed > 3.2) {
        const run = Math.atan2(vx, vz);
        let off = run - want;
        while (off > Math.PI) off -= Math.PI * 2;
        while (off < -Math.PI) off += Math.PI * 2;
        // a sprintar (ou a correr para a frente) olha para onde corre; abaixo de ~5,5 m/s em recuo/lado mantém o olhar no jogo
        if (a.speed > 5.5 || Math.abs(off) < 1.75 || act?.kind === 'run' || f.holder === id) want = run;
      }
      let d = want - a.heading;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      const gkAct = act && (act.kind === 'dive' || act.kind === 'splits' || act.kind === 'spread' || act.kind === 'catch');
      const turn = d * Math.min(1, dt * (gkAct ? 20 : 9));
      a.heading += turn;
      a.turn = lerp(a.turn ?? 0, turn / Math.max(1e-3, dt), Math.min(1, dt * 6));
      a.g.rotation.set(0, a.heading, 0);
      // velocidade no referencial do corpo (frente/lado), para as pernas fazerem o passo certo
      const sh = Math.sin(a.heading), ch = Math.cos(a.heading);
      a.fwd = lerp(a.fwd ?? 0, Math.max(-9, Math.min(9, vx * sh + vz * ch)), Math.min(1, dt * 9));
      a.side = lerp(a.side ?? 0, Math.max(-9, Math.min(9, vx * ch - vz * sh)), Math.min(1, dt * 9));
      let act2 = act;
      if ((act?.kind === 'dive' || act?.kind === 'splits') && act.to) {
        // lado do mergulho, visto pelo guarda-redes
        const rx = Math.cos(act.ang), rz = -Math.sin(act.ang); // lado pela direção do rematador (estável, não troca a meio do voo)
        const side = (act.to.x - p.x) * rx + (act.to.y - p.y) * rz >= 0 ? 1 : -1;
        act2 = { ...act, side };
      }
      const inf = this.info[id];
      const near = Math.hypot(f.ball.x - p.x, f.ball.y - p.y) < 16;
      pose(a, act2, !!inf?.gk, near, dt);
      if (act2?.kind === 'celebrate' && podH) a.g.position.y += podH; // os saltos no palanque partem do palanque
      a.prev.copy(a.g.position);
    }
    for (const [id, a] of this.actors) if (!seen.has(id)) a.g.visible = false;
    const ceremony = f.phase === 'Entrada das equipas' || f.phase === 'Alinhamento';
    for (const [id, a] of this.bench) a.g.visible = !ceremony && !f.pos[id];
    if (f.holder) this.lastHolder = f.holder;
    this.updateCamera(f.focus ? { x: f.focus.x, y: f.focus.y, z: 0 } : f.ball, dt, !!f.focus);
    // etiquetas: tamanho legível a qualquer distância, sem tapar o jogo de perto
    if (this.showTags) for (const ac of this.actors.values()) {
      const tg = ac.g.getObjectByName('tag');
      if (!tg || !ac.g.visible) continue;
      const k = Math.min(3.2, Math.max(0.8, ac.g.position.distanceTo(this.camera.position) * 0.1));
      tg.scale.set(0.95 * k, 0.24 * k, 1);
    }
    if (this.cer) this.updateCeremony(dt);
    if (render) this.renderer.render(this.scene, this.camera);
  }

  // ---------- festa do título (palanque, taça, confetes) ----------
  private cer: { g: THREE.Group; cup: THREE.Group; conf: THREE.Points; vel: Float32Array; captain: string } | null = null;
  trophyCeremony(comp: string, captain: string, colors: [string, string], lang: 'pt' | 'es' = 'pt') {
    this.cer?.g.removeFromParent();
    const g = new THREE.Group();
    const P = PODIUM;
    const w = P.x1 - P.x0, d = P.y1 - P.y0;
    const front = canvasTex(1024, 128, (c) => {
      c.fillStyle = '#111827'; c.fillRect(0, 0, 1024, 128);
      c.fillStyle = '#d4a017'; c.fillRect(0, 0, 1024, 8); c.fillRect(0, 120, 1024, 8);
      c.fillStyle = '#ffe08a'; c.font = 'bold 64px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(comp.toUpperCase(), 512, 66, 980);
    });
    const dark = new THREE.MeshStandardMaterial({ color: '#1f2937', roughness: 0.6 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, P.h, d), [dark, dark, dark, dark, new THREE.MeshStandardMaterial({ map: front, roughness: 0.5 }), dark]);
    box.position.set((P.x0 + P.x1) / 2, P.h / 2, (P.y0 + P.y1) / 2);
    box.receiveShadow = true; box.castShadow = true;
    g.add(box);
    // painel atrás do palanque: campeões + nome da competição
    const back = canvasTex(1024, 256, (c) => {
      const gr = c.createLinearGradient(0, 0, 1024, 0); gr.addColorStop(0, colors[0]); gr.addColorStop(1, colors[1] === '#ffffff' ? '#111827' : colors[1]);
      c.fillStyle = gr; c.fillRect(0, 0, 1024, 256);
      c.fillStyle = '#ffe08a'; c.font = 'bold 96px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(lang === 'es' ? 'CAMPEONES' : 'CAMPEÕES', 512, 92, 980);
      c.fillStyle = '#ffffff'; c.font = 'bold 46px sans-serif'; c.fillText(comp.toUpperCase(), 512, 190, 980);
    });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(w + 1.5, 3.2), new THREE.MeshStandardMaterial({ map: back, roughness: 0.7, side: THREE.DoubleSide }));
    wall.position.set((P.x0 + P.x1) / 2, 2.0, P.y0 - 0.3);
    g.add(wall);
    // taça (torneada em dourado) com asas
    const gold = new THREE.MeshStandardMaterial({ color: '#d4a017', metalness: 0.9, roughness: 0.25 });
    const prof = [[0, 0], [0.12, 0], [0.12, 0.04], [0.05, 0.06], [0.04, 0.2], [0.08, 0.24], [0.17, 0.32], [0.19, 0.45], [0.17, 0.5], [0, 0.5]].map(([x, y]) => new THREE.Vector2(x, y));
    const cup = new THREE.Group();
    cup.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 28), gold));
    for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.015, 8, 16, Math.PI), gold); h.position.set(s * 0.19, 0.4, 0); h.rotation.z = s * -Math.PI / 2; cup.add(h); }
    cup.scale.setScalar(1.7); // bem visível na mão do capitão
    g.add(cup);
    // confetes nas cores do clube e dourado
    const N = 1400;
    const posA = new Float32Array(N * 3), colA = new Float32Array(N * 3), vel = new Float32Array(N);
    const cs = [new THREE.Color(colors[0]), new THREE.Color(colors[1]), new THREE.Color('#ffd76a')];
    for (let i = 0; i < N; i++) {
      posA[i * 3] = (Math.random() - 0.5) * 22; posA[i * 3 + 1] = Math.random() * 12; posA[i * 3 + 2] = -4 + (Math.random() - 0.5) * 12;
      const c = cs[i % 3]; colA[i * 3] = c.r; colA[i * 3 + 1] = c.g; colA[i * 3 + 2] = c.b; vel[i] = 0.8 + Math.random() * 1.2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posA, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colA, 3));
    const conf = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.09, vertexColors: true }));
    conf.visible = false;
    g.add(conf);
    this.scene.add(g);
    this.cer = { g, cup, conf, vel, captain };
    this.goalShown = true; // os saltos da festa não são um golo (sem "GOLO!" nas placas)
  }
  private updateCeremony(dt: number) {
    const c = this.cer!;
    const cap = this.actors.get(c.captain);
    const lifted = this.t >= LIFT_AT;
    if (cap) {
      // antes: segura a taça ao peito; depois: ergue-a acima da cabeça (a balançar)
      const up = lifted ? 2.15 + Math.sin(this.t * 3) * 0.08 : 1.1;
      c.cup.position.set(cap.g.position.x, (lifted ? podiumHeight(cap.g.position.x, cap.g.position.z) : cap.g.position.y) + up, cap.g.position.z + 0.18);
    }
    c.conf.visible = lifted;
    if (lifted) {
      const p = c.conf.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < c.vel.length; i++) {
        let y = p.getY(i) - c.vel[i] * dt;
        if (y < 0) y = 10 + Math.random() * 2;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(this.t * 2 + i) * dt * 0.3);
      }
      p.needsUpdate = true;
    }
  }

  /** Câmara fixa num ponto (para ver o pavilhão como numa fotografia); null volta às câmaras normais. */
  viewFrom(pos: [number, number, number] | null, look: [number, number, number] = [0, 2, 0], fov = 40) {
    this.fixedView = pos ? { pos: new THREE.Vector3(...pos), look: new THREE.Vector3(...look) } : null;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    this.snapCamera = true;
  }
  private fixedView: { pos: THREE.Vector3; look: THREE.Vector3 } | null = null;

  private tvBallPrev: { x: number; y: number } | null = null;
  private tvVel = { x: 0, y: 0 };
  private tvSpan = 22;
  private tvX = 0;

  private updateCamera(b: { x: number; y: number; z: number }, dt = 1 / 60, focus = false) {
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
      // televisão: realização como numa transmissão. A câmara principal fica numa plataforma por cima da bancada
      // lateral; segue o JOGO (bola + jogadores perto dela), antecipa para onde a bola vai e abre/fecha o plano:
      // plano largo nas transições e com o jogo espalhado, mais fechado quando o lance se concentra perto da área
      const k = (rate: number) => 1 - Math.exp(-Math.max(0.001, dt) * rate);
      const bv = this.tvBallPrev ? { x: (b.x - this.tvBallPrev.x) / Math.max(1e-3, dt), y: (b.y - this.tvBallPrev.y) / Math.max(1e-3, dt) } : { x: 0, y: 0 };
      this.tvBallPrev = { x: b.x, y: b.y };
      this.tvVel.x = lerp(this.tvVel.x, Math.max(-25, Math.min(25, bv.x)), k(3));
      this.tvVel.y = lerp(this.tvVel.y, Math.max(-25, Math.min(25, bv.y)), k(3));
      // centro do lance: bola + jogadores a menos de 10 m (pesos menores), com antecipação de ~0,5 s do movimento da bola
      let cx = b.x * 2, cz = b.y * 2, wsum = 2, minX = b.x, maxX = b.x;
      for (const [id, a] of this.actors) {
        if (!a.g.visible || this.info[id]?.referee) continue;
        const px = a.g.position.x, pz = a.g.position.z;
        const d = Math.hypot(px - b.x, pz - b.y);
        if (d > 10) continue;
        const w = 0.35 * (1 - d / 10);
        cx += px * w; cz += pz * w; wsum += w;
        minX = Math.min(minX, px); maxX = Math.max(maxX, px);
      }
      cx = cx / wsum + this.tvVel.x * 0.5; cz = cz / wsum;
      // largura do plano: o lance todo + margem; transições (bola rápida no comprimento) abrem mais
      const fast = Math.min(1, Math.abs(this.tvVel.x) / 9);
      const span = Math.max(15, Math.min(34, (maxX - minX) + 9 + fast * 8 + (focus ? 6 : 0)));
      this.tvSpan = this.snapCamera ? span : lerp(this.tvSpan, span, k(0.9));
      const fx = Math.max(-W / 2 + 5, Math.min(W / 2 - 5, cx));
      this.tvX = this.snapCamera ? fx : lerp(this.tvX, fx, k(1.8));
      pos = new THREE.Vector3(this.tvX * 0.85, Math.min(7.6, this.arena.height - 1.5), H / 2 + 11);
      look = new THREE.Vector3(this.tvX, 0.3, cz * 0.6); // o lance fica a meio da imagem também no lado de lá
      // campo de visão que mostra a largura do plano à distância a que a câmara está
      const dist = pos.distanceTo(look);
      const hfov = 2 * Math.atan(this.tvSpan / 2 / dist);
      const vfov = (2 * Math.atan(Math.tan(hfov / 2) / Math.max(0.5, cam.aspect)) * 180) / Math.PI;
      const fov = Math.max(20, Math.min(44, vfov));
      if (Math.abs(cam.fov - fov) > 0.05) { cam.fov = fov; cam.updateProjectionMatrix(); }
      cam.position.copy(pos);
      this.camLook.copy(look);
      this.snapCamera = false;
      cam.lookAt(this.camLook);
      return;
    }
    if (cam.fov !== 40) { cam.fov = 40; cam.updateProjectionMatrix(); }
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
