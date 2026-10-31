// Jogo ao vivo em 2D, ao estilo do Football Manager: marcador, quadra com os jogadores em bolinhas,
// relato, estatísticas, energia, velocidade, pausa, táticas e desconto de tempo durante o jogo.
import { createMatch, LiveSnapshot, Possession } from '../../core/engine/match';
import type { MatchEvent, MatchResult } from '../../core/engine/types';
import { matchOptions, setupFor } from '../../core/game';
import { COMP_NAMES, Fixture } from '../../core/season/types';
import { SLOTS, Tactics } from '../../core/tactics';
import type { Club, GameState, Settings } from '../../core/types';
import { scoreboardHtml } from '../broadcast';
import { resultHtml } from './friendly';
import { renderTactics } from './tactics';

export const DEFAULT_SETTINGS: Settings = { speed: 'medio', moments3d: 'importantes', scoreboard: 'auto' };
export const settingsOf = (s: GameState) => (s.settings ??= { ...DEFAULT_SETTINGS });

// Segundos de jogo por segundo real: lenta 15 s por minuto, média 7,5 s, rápida 3 s
const RATE = { lento: 4, medio: 8, rapido: 20 };

type P = { x: number; y: number };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const fmt = (t: number) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

function hexDist(a: string, b: string) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

// Posições base (em % do campo, a atacar para a direita)
function shape(t: Tactics, withBall: boolean): P[] {
  const slots = SLOTS[t.system];
  if (withBall) return slots.map((s) => ({ x: Math.min(92, s.x + 14), y: s.y }));
  const k = { alta: { a: 38, b: 0.55, w: 0.85 }, media: { a: 16, b: 0.5, w: 0.78 }, baixa: { a: 8, b: 0.33, w: 0.7 } }[t.pressure];
  return slots.map((s) => ({ x: k.a + s.x * k.b, y: 50 + (s.y - 50) * k.w }));
}

const KEY_TYPES: Record<Settings['moments3d'], string[]> = {
  nenhum: [],
  golos: ['golo'],
  importantes: ['golo', 'penalti', 'livre_10m', 'vermelho', 'poste', 'gr_avancado_on'],
  todos: ['golo', 'penalti', 'livre_10m', 'vermelho', 'poste', 'gr_avancado_on', 'remate_defendido', 'remate_fora', 'canto'],
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

  content.innerHTML = `
    <div class="live">
      <div class="live-top">
        <div></div>
        <div id="sb"></div>
        <div class="live-comp small muted">${COMP_NAMES[f.comp]} · ${f.stage}</div>
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
            <div class="flash" id="flash"></div>
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
  const ball = $('#ball') as unknown as SVGCircleElement;

  let snap: LiveSnapshot = m.snapshot();
  let display = 0; // tempo de jogo mostrado
  let poss: Possession | null = null;
  let paused = false;
  let hold = 0; // pausa curta após golo (segundos reais)
  let done = false;
  let tab = 'feed';
  const feed: MatchEvent[] = [];
  let revealed = 0;
  let banner = '';

  // Posições animadas dos jogadores: [lado][índice] (0 = guarda-redes)
  const pos: P[][] = [[], []];

  const attackRight = (side: number, period: number) => (period % 2 === 1 ? side === 0 : side === 1);

  function targets(): { pts: P[][]; ball: P } {
    const per = snap.period;
    const pr = poss && poss.end > poss.start ? Math.max(0, Math.min(1, (display - poss.start) / (poss.end - poss.start))) : 0;
    const attSide = poss ? poss.side : 0;
    const right = attackRight(attSide, per);
    const outcome = poss?.events.find((e) => ['golo', 'remate_defendido', 'remate_fora', 'remate_bloqueado', 'poste', 'falta', 'livre_10m', 'penalti', 'canto'].includes(e.type))?.type;
    const endX = outcome === 'golo' || outcome === 'remate_defendido' || outcome === 'poste' || outcome === 'penalti' || outcome === 'livre_10m' ? 92 : outcome ? 76 : 55 + ((poss?.start ?? 0) % 7) * 3;
    const fx = 22 + (endX - 22) * pr; // progressão da bola no sentido do ataque
    const by = 50 + Math.sin(display / 3) * 22 * (1 - pr * 0.6);
    const ballP = { x: right ? fx : 100 - fx, y: by };
    const pts: P[][] = [0, 1].map((side) => {
      const tac = side === 0 ? hs.tactics : as.tactics;
      const withBall = poss ? side === attSide : false;
      const base = shape(tac, withBall);
      const r = attackRight(side, per);
      const out: P[] = [];
      const t = snap.teams[side];
      out.push(t.gk ? { x: r ? 4 : 96, y: 50 + (ballP.y - 50) * 0.15 } : { x: -10, y: -10 });
      base.forEach((b, i) => {
        const shiftX = (r ? ballP.x : 100 - ballP.x) - 50;
        const x = Math.max(3, Math.min(97, b.x + shiftX * 0.25 + Math.sin(display / 2 + i * 1.7) * 2));
        const y = Math.max(4, Math.min(96, b.y + (ballP.y - 50) * 0.25 + Math.cos(display / 2.3 + i) * 3));
        out.push({ x: r ? x : 100 - x, y });
      });
      if (t.flying) out.push({ x: r ? 70 : 30, y: 50 });
      return out;
    });
    return { pts, ball: ballP };
  }

  function drawDots() {
    let html = '';
    for (const side of [0, 1]) {
      const t = snap.teams[side];
      const list = [t.gk, ...t.court];
      pos[side].forEach((p, i) => {
        const pl = list[i];
        if (!pl || p.x < 0) return;
        const isGk = i === 0 && t.gk;
        const fill = isGk ? (side === 0 ? '#0f766e' : '#7c3aed') : colors[side];
        html += `<g transform="translate(${p.x * 4},${p.y * 2})"><circle r="8" fill="${fill}" stroke="${side === mySide ? '#facc15' : '#111'}" stroke-width="1.5"/><text y="3.5" text-anchor="middle" font-size="9" font-weight="700" fill="${isGk ? '#fff' : textCol(fill)}">${pl.number ?? ''}</text></g>`;
      });
    }
    dotsG.innerHTML = html;
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

  let shownScore: [number, number] = [0, 0];

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
      el.innerHTML = `<table class="tbl small"><thead><tr><th></th><th>Jogador</th><th>Energia</th><th>Nota</th></tr></thead><tbody>
        ${[t.gk, ...t.court].filter(Boolean).map((p) => `<tr class="inq"><td>${p!.number ?? ''}</td><td>${p!.name}</td><td>${bar(p!.energy)}</td><td>${ps[p!.id] ? (6 + ps[p!.id].goals * 0.9 + ps[p!.id].assists * 0.5).toFixed(1).replace('.', ',') : ''}</td></tr>`).join('')}
        ${t.bench.map((p) => `<tr class="${p.sentOff ? 'muted' : ''}"><td>${p.number ?? ''}</td><td>${p.name}${p.sentOff ? ' 🟥' : ''}</td><td>${bar(p.energy)}</td><td></td></tr>`).join('')}
      </tbody></table><p class="small muted">Em campo a amarelo. Energia baixa rende menos; muda os quintetos ou a rotação nas Táticas.</p>`;
    }
  }

  function flash(text: string, cls = '') {
    const el = $('#flash');
    el.className = `flash show ${cls}`;
    el.textContent = text;
    setTimeout(() => (el.className = 'flash'), 1400);
  }

  function reveal() {
    const evs = m.events;
    while (revealed < evs.length && evs[revealed].t <= display + 0.01) {
      const e = evs[revealed++];
      feed.push(e);
      if (e.type === 'golo') {
        shownScore = [e.score[0], e.score[1]];
        flash(`GOLO! ${m.names[e.playerId!] ?? ''}`, e.side === mySide ? 'mine' : 'opp');
        hold = 1.6;
      } else if (KEY_TYPES[st.moments3d].includes(e.type)) {
        banner = { penalti: 'Penálti', livre_10m: 'Livre de 10 m', vermelho: 'Expulsão', poste: 'Ao poste!', gr_avancado_on: '5x4', remate_defendido: 'Defesa', remate_fora: 'Ocasião', canto: 'Canto' }[e.type as string] ?? '';
        setTimeout(() => (banner = ''), 2500);
        hold = Math.max(hold, 0.6);
      }
      if (e.type === 'fim_jogo') done = true;
      if (tab === 'feed') drawSide();
    }
  }

  function finishUi() {
    done = true;
    const res = m.result();
    content.innerHTML = `<h2>Resultado final</h2>` + resultHtml(res, h, a) + `<div class="row" style="justify-content:flex-start;margin-top:16px"><button class="btn primary" id="cont">Continuar</button></div>`;
    content.querySelector('#all')?.addEventListener('change', (ev) => {
      content.querySelectorAll<HTMLElement>('.ev.minor').forEach((x) => (x.style.display = (ev.target as HTMLInputElement).checked ? '' : 'none'));
    });
    content.querySelector('#cont')!.addEventListener('click', () => onDone(res));
  }

  let last = performance.now();
  let sideTimer = 0;
  function frame(now: number) {
    if (!content.isConnected || !content.querySelector('#pitch')) return; // saiu do ecrã do jogo
    const dtReal = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused && !done) {
      if (hold > 0) hold -= dtReal;
      else {
        let budget = dtReal * RATE[st.speed];
        while (budget > 0 && !done) {
          if (display >= snap.clock - 0.001) {
            const more = m.step();
            snap = m.snapshot();
            if (snap.possession) poss = snap.possession;
            else display = snap.clock; // mudança de período ou fim
            if (!more) {
              display = snap.clock;
              reveal();
              setTimeout(finishUi, 1200);
              done = true;
              break;
            }
            continue;
          }
          const stepT = Math.min(budget, snap.clock - display);
          display += stepT;
          budget -= stepT;
          reveal();
          if (hold > 0) break;
        }
      }
    }
    const tg = targets();
    for (const side of [0, 1]) {
      tg.pts[side].forEach((p, i) => {
        const cur = pos[side][i] ?? p;
        pos[side][i] = { x: lerp(cur.x, p.x, 0.12), y: lerp(cur.y, p.y, 0.12) };
      });
      pos[side].length = tg.pts[side].length;
    }
    const bx = Number(ball.getAttribute('cx') || 200);
    const byy = Number(ball.getAttribute('cy') || 100);
    ball.setAttribute('cx', String(lerp(bx, tg.ball.x * 4, 0.2)));
    ball.setAttribute('cy', String(lerp(byy, tg.ball.y * 2, 0.2)));
    drawDots();
    drawScoreboard();
    sideTimer += dtReal;
    if (sideTimer > 0.5 && tab !== 'feed') { drawSide(); sideTimer = 0; }
    $('#to').toggleAttribute('disabled', !snap.teams[mySide].timeoutAvailable);
    if (!done || content.querySelector('#pitch')) requestAnimationFrame(frame);
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
  $('#skip').addEventListener('click', () => {
    while (m.step());
    finishUi();
  });

  drawSide();
  requestAnimationFrame(frame);
}
