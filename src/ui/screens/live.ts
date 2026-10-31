// Jogo ao vivo em 2D, ao estilo do Football Manager: marcador, quadra com os jogadores em bolinhas,
// relato, estatísticas, energia, velocidade, pausa, táticas e desconto de tempo durante o jogo.
import { createMatch, LiveSnapshot, Possession } from '../../core/engine/match';
import type { MatchEvent, MatchResult } from '../../core/engine/types';
import { matchOptions, setupFor } from '../../core/game';
import { COMP_NAMES, Fixture } from '../../core/season/types';
import type { Club, GameState, Settings } from '../../core/types';
import { scoreboardHtml } from '../broadcast';
import { resultHtml } from './friendly';
import { renderTactics } from './tactics';
import type { Highlight3D, CameraId, ActorInfo } from '../three/highlight3d';
import { Choreo, StartState } from '../../core/visual/choreo';
import { attendance } from '../../core/attendance';
import { lookOf } from '../../core/appearance';

export const DEFAULT_SETTINGS: Settings = { speed: 'medio', moments3d: 'importantes', scoreboard: 'auto' };
export const settingsOf = (s: GameState) => (s.settings ??= { ...DEFAULT_SETTINGS });

// Segundos de jogo por segundo real. Os lances decisivos (finalização e bolas paradas) abrandam
// para se verem os movimentos: na lenta a 1,3x, na média a 2x.
const RATE = { lento: 2.2, medio: 4.5, rapido: 9 };
const KEY_RATE = { lento: 1.3, medio: 2, rapido: 9 };

type P = { x: number; y: number };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

function hexDist(a: string, b: string) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

const KEY_TYPES: Record<Settings['moments3d'], string[]> = {
  nenhum: [],
  golos: ['golo'],
  importantes: ['golo', 'penalti', 'livre_10m', 'vermelho', 'poste', 'remate_defendido', 'gr_avancado_on'],
  todos: ['golo', 'penalti', 'livre_10m', 'vermelho', 'poste', 'remate_defendido', 'gr_avancado_on', 'remate_fora', 'canto'],
};

export function renderLive(content: HTMLElement, s: GameState, f: Fixture, onDone: (m: MatchResult) => void) {
  const st = settingsOf(s);
  const hs = setupFor(s, f.home);
  const as = setupFor(s, f.away);
  const h = s.clubs.find((c) => c.id === f.home)!;
  const a = s.clubs.find((c) => c.id === f.away)!;
  const mySide = f.home === s.clubId ? 0 : 1;
  const m = createMatch(hs, as, matchOptions(s, f));
  const style = st.scoreboard === 'auto' ? (f.comp === 'playoff' ? 'liga' : f.comp) : st.scoreboard;
  const colors: [string, string] = [h.colors[0], hexDist(h.colors[0], a.colors[0]) < 120 ? (hexDist(h.colors[0], a.colors[1]) < 120 ? '#f5f5f5' : a.colors[1]) : a.colors[0]];
  const textCol = (c: string) => (hexDist(c, '#ffffff') < 200 ? '#111' : '#fff');
  const crowd = attendance(s, f);
  const fmtN = (n: number) => n.toLocaleString('pt-PT');

  content.innerHTML = `
    <div class="live">
      <div class="live-top">
        <div></div>
        <div id="sb"></div>
        <div class="live-comp small muted">${COMP_NAMES[f.comp]} · ${f.stage}<br>${crowd.arena.name} · ${fmtN(crowd.total)} espetadores${crowd.total >= crowd.arena.capacity ? ' (esgotado)' : ''}</div>
      </div>
      <div class="live-grid">
        <div>
          <div class="pitch2d">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none" id="pitch">
              <rect x="0" y="0" width="400" height="200" class="floor"/>
              <rect x="1" y="1" width="398" height="198" class="line"/>
              <line x1="200" y1="0" x2="200" y2="200" class="line"/>
              <circle cx="200" cy="100" r="30" class="line"/>
              <path d="M0,40 A60,60 0 0 1 60,85 L60,115 A60,60 0 0 1 0,160" class="line"/>
              <path d="M400,40 A60,60 0 0 0 340,85 L340,115 A60,60 0 0 0 400,160" class="line"/>
              <circle cx="60" cy="100" r="2" class="dot"/><circle cx="340" cy="100" r="2" class="dot"/>
              <circle cx="100" cy="100" r="2" class="dot"/><circle cx="300" cy="100" r="2" class="dot"/>
              <rect x="-6" y="85" width="6" height="30" class="goal"/><rect x="400" y="85" width="6" height="30" class="goal"/>
              <g id="dots"></g>
              <circle id="ball" r="4" class="ball2d"/>
            </svg>
            <div class="cap2d" id="cap2d"></div>
            <div class="flash" id="flash"></div>
            <div class="hl" id="hl" hidden>
              <div class="hl-view" id="hlv"></div>
              <div class="hl-cap" id="hlcap"></div>
              <div class="hl-bar">
                <div class="seg cams">${[['tv', 'TV'], ['baliza', 'Atrás da baliza'], ['aerea', 'Aérea'], ['jogador', 'Jogador']].map(([v, l]) => `<button data-cam="${v}" class="${v === 'tv' ? 'on' : ''}">${l}</button>`).join('')}</div>
                <span class="spacer"></span>
                <button class="btn" id="rep">Repetição</button>
                <button class="btn primary" id="hlc">Continuar</button>
              </div>
            </div>
          </div>
          <div class="live-controls">
            <button class="btn" id="pause">⏸ Pausa</button>
            <div class="seg speed">${(['lento', 'medio', 'rapido'] as const).map((v) => `<button data-speed="${v}" class="${st.speed === v ? 'on' : ''}">${{ lento: 'Lenta', medio: 'Média', rapido: 'Rápida' }[v]}</button>`).join('')}</div>
            <button class="btn" id="tac">Táticas</button>
            <button class="btn" id="to">Pedir desconto de tempo</button>
            <span class="spacer"></span>
            <button class="btn ghost" id="skip">Ver resultado final</button>
          </div>
        </div>
        <div class="live-side">
          <div class="tabs"><button class="tab on" data-lt="feed">Relato</button><button class="tab" data-lt="stats">Estatísticas</button><button class="tab" data-lt="team">A minha equipa</button></div>
          <div id="lt"></div>
        </div>
      </div>
      <div class="modal" id="modal" hidden><div class="modal-box"><div class="row"><b>Táticas (jogo em pausa)</b><span class="spacer"></span><button class="btn primary" id="close">Voltar ao jogo</button></div><div id="mtac"></div></div></div>
    </div>`;

  const $ = <T extends HTMLElement>(sel: string) => content.querySelector<T>(sel)!;
  const dotsG = $('#dots') as unknown as SVGGElement;
  const ballEl = $('#ball') as unknown as SVGCircleElement;

  // quem é quem (lado, número, guarda-redes)
  const info: Record<string, ActorInfo> = {};
  for (const [side, setup] of [[0, hs], [1, as]] as const) for (const p of setup.squad) info[p.id] = { side, number: p.number, gk: p.position === 'GR', look: lookOf(p) };
  const kit: [[string, string], [string, string]] = [[colors[0], h.colors[1]], [colors[1], colors[1] === a.colors[0] ? a.colors[1] : a.colors[0]]];

  let snap: LiveSnapshot = m.snapshot();
  let display = 0; // tempo de jogo mostrado (relógio)
  let choreo: Choreo | null = null;
  let poss: Possession | null = null;
  let ct = 0; // tempo dentro da coreografia (inclui bola parada)
  let startState: StartState | null = null;
  let paused = false;
  let hold = 0; // pausa curta após golo (segundos reais)
  let done = false;
  let tab = 'feed';
  const feed: MatchEvent[] = [];
  let revealed = 0;
  let banner = '';
  let shownScore: [number, number] = [0, 0];
  let label = '';

  // posições desenhadas (suavizadas) por jogador
  const drawn: Record<string, P> = {};
  let ballP: P = { x: 0, y: 0 };
  const toSvg = (p: P) => ({ x: (p.x + 20) * 10, y: (p.y + 10) * 10 });

  function drawFrame() {
    const fr = choreo ? choreo.at(ct) : null;
    const pos = fr?.pos ?? {};
    let html = '';
    let under = '';
    const ids = Object.keys(pos);
    // a coreografia já é contínua; só se suaviza um eventual salto (substituições, início de período)
    for (const id of ids) {
      const target = pos[id];
      const cur = drawn[id] ?? target;
      const jump = Math.hypot(cur.x - target.x, cur.y - target.y) > 2.5;
      drawn[id] = jump ? { x: lerp(cur.x, target.x, 0.3), y: lerp(cur.y, target.y, 0.3) } : target;
    }
    for (const id of Object.keys(drawn)) if (!pos[id]) delete drawn[id];
    for (const id of ids) {
      const inf = info[id];
      if (!inf) continue;
      const act = fr?.acts[id];
      let pp = drawn[id];
      if (act?.kind === 'feint') pp = { x: pp.x + Math.cos(act.ang) * Math.sin(act.k * Math.PI * 2) * 0.5, y: pp.y - Math.sin(act.ang) * Math.sin(act.k * Math.PI * 2) * 0.5 };
      const p = toSvg(pp);
      const fill = inf.gk ? (inf.side === 0 ? '#0f766e' : '#7c3aed') : colors[inf.side];
      const hasBall = fr?.holder === id;
      let extra = '';
      let body = `<circle r="8" fill="${fill}" stroke="${inf.side === mySide ? '#facc15' : '#111'}" stroke-width="1.5"/>`;
      if (act) {
        // direção do corpo no SVG (ang = atan2(dx, dy))
        const dx = Math.sin(act.ang), dy = Math.cos(act.ang);
        if (act.kind === 'run' && act.to) {
          const q = toSvg(act.to);
          under += `<line x1="${p.x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${q.x.toFixed(1)}" y2="${q.y.toFixed(1)}" class="run2d" stroke="${colors[inf.side]}"/><circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="2.5" fill="${colors[inf.side]}" opacity=".7"/>`;
        } else if (act.kind === 'pass' || act.kind === 'shoot' || act.kind === 'throw') {
          extra += `<circle r="${(9 + act.k * (act.kind === 'shoot' ? 9 : 5)).toFixed(1)}" fill="none" stroke="#fff" stroke-width="${act.kind === 'shoot' ? 2.5 : 1.5}" opacity="${(1 - act.k).toFixed(2)}"/>`;
        } else if (act.kind === 'screen' || act.kind === 'block') {
          // bloqueio: barra perpendicular à direção do corpo
          const px = -dy * 9, py = dx * 9;
          extra += `<line x1="${(dx * 9 - px).toFixed(1)}" y1="${(dy * 9 - py).toFixed(1)}" x2="${(dx * 9 + px).toFixed(1)}" y2="${(dy * 9 + py).toFixed(1)}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
        } else if (act.kind === 'dive' && act.to) {
          const q = toSvg(act.to);
          const a = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
          const st = Math.sin(Math.min(1, act.k * 2.2) * Math.PI / 2);
          body = `<ellipse rx="${(8 + st * 7).toFixed(1)}" ry="7" transform="rotate(${a.toFixed(0)}) translate(${(st * 4).toFixed(1)},0)" fill="${fill}" stroke="${inf.side === mySide ? '#facc15' : '#111'}" stroke-width="1.5"/>`;
        } else if (act.kind === 'tackle') {
          extra += `<circle r="11" fill="none" stroke="#fb923c" stroke-width="2" stroke-dasharray="3 2"/>`;
        } else if (act.kind === 'celebrate') {
          extra += `<circle r="${(10 + Math.sin(act.k * Math.PI * 6) * 2).toFixed(1)}" fill="none" stroke="#facc15" stroke-width="2"/>`;
        } else if (act.kind === 'fall') {
          body = body.replace('<circle', '<circle opacity=".55"');
        }
      }
      html += `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">${hasBall ? '<circle r="11" fill="none" stroke="#fff" stroke-width="2"/>' : ''}${body}${extra}<text y="3.5" text-anchor="middle" font-size="9" font-weight="700" fill="${inf.gk ? '#fff' : textCol(fill)}">${inf.number ?? ''}</text></g>`;
    }
    dotsG.innerHTML = under + html;
    if (fr) {
      ballP = { x: fr.ball.x, y: fr.ball.y };
      const b = toSvg(ballP);
      ballEl.setAttribute('cx', b.x.toFixed(1));
      ballEl.setAttribute('cy', b.y.toFixed(1));
      ballEl.setAttribute('r', String(3.5 + Math.min(3, fr.ball.z * 2)));
      const what = fr.label || (fr.holder ? `Com bola: ${m.names[fr.holder] ?? ''}` : '');
      label = fr.phase ? `${fr.phase}${what ? ' · ' + what : ''}` : what;
    }
    $('#cap2d').textContent = label;
  }

  function drawScoreboard() {
    const per = snap.period;
    const inPeriod = Math.max(0, Math.min(snap.periodLen, display - snap.periodStart));
    const note = snap.teams.some((t) => t.flying) ? '5x4' : snap.teams.some((t) => t.short) ? 'Inferioridade numérica' : banner;
    $('#sb').innerHTML = scoreboardHtml({
      style: style as 'liga',
      home: { short: h.shortName, color: h.colors[0], score: shownScore[0], fouls: snap.teams[0].fouls },
      away: { short: a.shortName, color: colors[1], score: shownScore[1], fouls: snap.teams[1].fouls },
      clock: fmt(inPeriod),
      period: per === 1 ? '1.ª P' : per === 2 ? '2.ª P' : per <= 4 ? 'Prol.' : 'Pen.',
      note,
    });
  }

  function drawSide() {
    const el = $('#lt');
    if (tab === 'feed') {
      el.innerHTML = `<div class="feed live-feed">${[...feed].reverse().map((e) => `<div class="ev ${e.type === 'golo' ? 'goal' : ''}">${e.text}</div>`).join('')}</div>`;
    } else if (tab === 'stats') {
      const t = m.stats;
      const tot = t[0].possession + t[1].possession || 1;
      const row = (l: string, x: number | string, y: number | string) => `<tr><td class="r">${x}</td><th class="c">${l}</th><td>${y}</td></tr>`;
      el.innerHTML = `<table class="tbl stats">${row('Posse', Math.round((t[0].possession / tot) * 100) + '%', Math.round((t[1].possession / tot) * 100) + '%')}${row('Remates', t[0].shots, t[1].shots)}${row('À baliza', t[0].onTarget, t[1].onTarget)}${row('Cantos', t[0].corners, t[1].corners)}${row('Faltas', t[0].fouls, t[1].fouls)}${row('Amarelos', t[0].yellow, t[1].yellow)}${row('Vermelhos', t[0].red, t[1].red)}</table>`;
    } else {
      const t = snap.teams[mySide];
      const bar = (e: number) => `<span class="ebar"><i style="width:${e}%;background:${e > 70 ? '#4ade80' : e > 50 ? '#facc15' : '#f87171'}"></i></span>`;
      const ps = m.players;
      el.innerHTML = `<table class="tbl small"><thead><tr><th></th><th>Jogador</th><th>Energia</th><th>G</th></tr></thead><tbody>
        ${[t.gk, ...t.court].filter(Boolean).map((p) => `<tr class="inq"><td>${p!.number ?? ''}</td><td>${p!.name}</td><td>${bar(p!.energy)}</td><td>${ps[p!.id]?.goals || ''}</td></tr>`).join('')}
        ${t.bench.map((p) => `<tr class="${p.sentOff ? 'muted' : ''}"><td>${p.number ?? ''}</td><td>${p.name}${p.sentOff ? ' 🟥' : ''}</td><td>${bar(p.energy)}</td><td>${ps[p.id]?.goals || ''}</td></tr>`).join('')}
      </tbody></table><p class="small muted">Em campo a amarelo. Energia baixa rende menos; muda os quintetos ou a rotação nas Táticas.</p>`;
    }
  }

  function flash(text: string, cls = '') {
    const el = $('#flash');
    el.className = `flash show ${cls}`;
    el.textContent = text;
    setTimeout(() => (el.className = 'flash'), 1400);
  }

  // ---- Momentos em 3D: a mesma jogada, em 3D ----
  let hl: Highlight3D | null = null;
  let in3d = false;
  let last3d = -999;
  let autoClose: ReturnType<typeof setTimeout> | null = null;

  function keyEventOf(p: Possession) {
    const types = KEY_TYPES[st.moments3d];
    const ev = p.events.find((e) => types.includes(e.type));
    if (!ev) return null;
    if (ev.type !== 'golo' && ev.t - last3d < 60 && !p.events.some((e) => e.type === 'golo')) return null;
    return p.events.find((e) => e.type === 'golo') ?? ev;
  }

  async function open3d(ev: MatchEvent) {
    if (!choreo) return;
    in3d = true;
    last3d = ev.t;
    $('#hl').hidden = false;
    $('#hlcap').textContent = ev.text.replace(/^\d+:\d+ /, '');
    if (!hl) {
      const mod = await import('../three/highlight3d');
      hl = new mod.Highlight3D($('#hlv'), {
        profile: crowd.arena,
        crowd: crowd.total,
        shares: crowd.shares,
        comp: COMP_NAMES[f.comp],
        stage: f.stage,
        teams: [{ short: h.shortName, colors: kit[0] }, { short: a.shortName, colors: kit[1] }],
      });
    }
    hl.onEnd = () => {
      autoClose = setTimeout(close3d, 2500);
    };
    const total = choreo.total;
    const after: [number, number] = ev.type === 'golo' ? [ev.score[0], ev.score[1]] : [shownScore[0], shownScore[1]];
    hl.play(choreo, info, kit, Math.max(0, total - Math.max(10, choreo.extra + 7)), total, [[shownScore[0], shownScore[1]], after]);
  }

  function close3d() {
    if (autoClose) clearTimeout(autoClose);
    autoClose = null;
    $('#hl').hidden = true;
    in3d = false;
    if (choreo) ct = choreo.total; // a jogada já foi vista em 3D
    if (poss) display = poss.end;
    reveal();
  }

  function reveal() {
    const evs = m.events;
    const playing = choreo ? ct < choreo.total - 0.001 : false;
    while (revealed < evs.length && evs[revealed].t <= display + 0.01) {
      const e = evs[revealed];
      // os eventos do fim da posse (remates, golos, bolas paradas) só aparecem quando a jogada lá chega
      if (poss && playing && e.t >= poss.end - 0.01) break;
      revealed++;
      feed.push(e);
      if (e.type === 'golo') {
        shownScore = [e.score[0], e.score[1]];
        flash(`GOLO! ${m.names[e.playerId!] ?? ''}`, e.side === mySide ? 'mine' : 'opp');
        hold = 1.6;
      } else if (KEY_TYPES[st.moments3d].includes(e.type)) {
        banner = { penalti: 'Penálti', livre_10m: 'Livre de 10 m', vermelho: 'Expulsão', poste: 'Ao poste!', gr_avancado_on: '5x4', remate_defendido: 'Grande defesa', remate_fora: 'Ocasião', canto: 'Canto' }[e.type as string] ?? '';
        setTimeout(() => (banner = ''), 2500);
      }
      if (e.type === 'fim_jogo') done = true;
      if (tab === 'feed') drawSide();
    }
  }

  function finishUi() {
    done = true;
    hl?.dispose();
    hl = null;
    const res = m.result();
    content.innerHTML = `<h2>Resultado final</h2>` + resultHtml(res, h, a) + `<div class="row" style="justify-content:flex-start;margin-top:16px"><button class="btn primary" id="cont">Continuar</button></div>`;
    content.querySelector('#all')?.addEventListener('change', (ev) => {
      content.querySelectorAll<HTMLElement>('.ev.minor').forEach((x) => (x.style.display = (ev.target as HTMLInputElement).checked ? '' : 'none'));
    });
    content.querySelector('#cont')!.addEventListener('click', () => onDone(res));
  }

  // avança o motor para a posse seguinte e prepara a coreografia
  function nextPossession(): boolean {
    const more = m.step();
    snap = m.snapshot();
    if (snap.possession) {
      poss = snap.possession;
      choreo = new Choreo(poss, [hs.tactics, as.tactics], snap.period, startState, m.names);
      startState = choreo.end;
      ct = 0;
      display = poss.start;
      const key = st.moments3d !== 'nenhum' ? keyEventOf(poss) : null;
      if (key) open3d(key);
    } else {
      // início/fim de período: bola ao centro
      display = snap.clock;
      startState = null;
      choreo = null;
      poss = null;
      reveal();
    }
    return more;
  }

  let last = performance.now();
  let sideTimer = 0;
  function frame(now: number) {
    if (!content.isConnected || !content.querySelector('#pitch')) return; // saiu do ecrã do jogo
    const dtReal = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused && !done && !in3d) {
      if (hold > 0) hold -= dtReal;
      else {
        let budget = dtReal;
        while (budget > 0 && !done && !in3d) {
          const total = choreo ? choreo.total : 0;
          if (!choreo || ct >= total - 0.0001) {
            if (choreo) reveal();
            if (hold > 0) break;
            const more = nextPossession();
            if (!more) {
              reveal();
              done = true;
              setTimeout(finishUi, 1200);
              break;
            }
            continue;
          }
          const rate = choreo.isKey(ct) ? KEY_RATE[st.speed] : RATE[st.speed];
          const stepT = Math.min(budget * rate, total - ct, 0.05);
          ct += stepT;
          budget -= stepT / rate;
          // o relógio só anda durante o jogo corrido (pára nas bolas paradas)
          if (poss) display = poss.start + choreo.clockAt(ct);
          reveal();
          if (hold > 0) break;
        }
      }
    }
    if (!in3d) drawFrame();
    drawScoreboard();
    sideTimer += dtReal;
    if (sideTimer > 0.5 && tab !== 'feed') { drawSide(); sideTimer = 0; }
    $('#to').toggleAttribute('disabled', !snap.teams[mySide].timeoutAvailable);
    requestAnimationFrame(frame);
  }

  // Controlos
  $('#pause').addEventListener('click', () => { paused = !paused; $('#pause').textContent = paused ? '▶ Retomar' : '⏸ Pausa'; });
  content.querySelectorAll<HTMLButtonElement>('[data-speed]').forEach((b) =>
    b.addEventListener('click', () => {
      st.speed = b.dataset.speed as Settings['speed'];
      content.querySelectorAll('[data-speed]').forEach((x) => x.classList.toggle('on', x === b));
    })
  );
  content.querySelectorAll<HTMLButtonElement>('[data-lt]').forEach((b) =>
    b.addEventListener('click', () => {
      tab = b.dataset.lt!;
      content.querySelectorAll('[data-lt]').forEach((x) => x.classList.toggle('on', x === b));
      drawSide();
    })
  );
  $('#tac').addEventListener('click', () => {
    paused = true;
    $('#modal').hidden = false;
    renderTactics($('#mtac'), s, s.clubId);
  });
  $('#close').addEventListener('click', () => {
    $('#modal').hidden = true;
    paused = false;
    $('#pause').textContent = '⏸ Pausa';
  });
  $('#to').addEventListener('click', () => {
    if (m.requestTimeout(mySide)) flash('Desconto de tempo pedido', 'mine');
  });
  content.querySelectorAll<HTMLButtonElement>('[data-cam]').forEach((b) =>
    b.addEventListener('click', () => {
      if (autoClose) { clearTimeout(autoClose); autoClose = null; }
      if (hl) hl.cameraId = b.dataset.cam as CameraId;
      content.querySelectorAll('[data-cam]').forEach((x) => x.classList.toggle('on', x === b));
    })
  );
  $('#rep').addEventListener('click', () => {
    if (autoClose) { clearTimeout(autoClose); autoClose = null; }
    hl?.replay(0.6);
  });
  $('#hlc').addEventListener('click', close3d);
  $('#skip').addEventListener('click', () => {
    if (in3d) close3d();
    while (m.step());
    finishUi();
  });

  drawSide();
  requestAnimationFrame(frame);
}
