import { openPlayerSheet } from '../playerSheet';
import { TALKS, talkEffect, situationOf, type TalkMoment, type TalkReaction } from '../../core/teamtalk';
import { moraleHtml } from '../../core/morale';
import { overall } from '../../core/attributes';
// Jogo ao vivo em 2D, ao estilo do Football Manager: marcador, quadra com os jogadores em bolinhas,
// relato, estatísticas, energia, velocidade, pausa, táticas e desconto de tempo durante o jogo.
import { createMatch, LiveSnapshot, Possession } from '../../core/engine/match';
import type { MatchEvent, MatchResult } from '../../core/engine/types';
import { matchOptions, setupFor } from '../../core/game';
import { COMP_NAMES, Fixture, countryOfComp, type CompId } from '../../core/season/types';
import { TrophyScene } from '../../core/visual/trophy';
import type { Club, GameState, Settings } from '../../core/types';
import { goalBarHtml, lineupHtml, scoreboardHtml , styleOf } from '../broadcast';
import { sound } from '../audio';
import type { Frame } from '../../core/visual/choreo';
import { resultHtml } from './friendly';
import { renderTactics } from './tactics';
import { arrangeForSystem } from '../../core/tactics';
import type { Highlight3D, CameraId, ActorInfo } from '../three/highlight3d';
import { Choreo, StartState } from '../../core/visual/choreo';
import { IntroScene } from '../../core/visual/intro';
import { attendance } from '../../core/attendance';
import { lookOf } from '../../core/appearance';
import { matchGkKits, matchKits, pendingKit, refKitFor, setPendingKit } from '../../core/kits';
import { refBadgeHtml } from '../../core/referees';

export const DEFAULT_SETTINGS: Settings = { speed: 'medio', moments3d: 'importantes', scoreboard: 'auto', quality: 'normal' };
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
  golos: ['golo', 'confronto'],
  importantes: ['golo', 'penalti', 'livre_10m', 'vermelho', 'poste', 'remate_defendido', 'gr_avancado_on', 'confronto'],
  todos: ['golo', 'penalti', 'livre_10m', 'vermelho', 'poste', 'remate_defendido', 'gr_avancado_on', 'remate_fora', 'canto', 'confronto'],
};

export function renderLive(content: HTMLElement, s: GameState, f: Fixture, onDone: (m: MatchResult) => void, onRecord?: (m: MatchResult, silent?: boolean) => unknown) {
  const st = settingsOf(s);
  const hs = setupFor(s, f.home, f.comp);
  const as = setupFor(s, f.away, f.comp);
  const h = s.clubs.find((c) => c.id === f.home)!;
  const a = s.clubs.find((c) => c.id === f.away)!;
  const mySide = f.home === s.clubId ? 0 : 1;
  const mopts = matchOptions(s, f);
  const m = createMatch(hs, as, mopts);
  const style = st.scoreboard === 'auto' ? styleOf(f.comp) : st.scoreboard;
  const kits = matchKits(h, a, mySide, pendingKit);
  setPendingKit('auto');
  const gkKits = matchGkKits(h.id, a.id, kits);
  // árbitros: amarelo, verde fluorescente, amarelo fluorescente ou preto, nunca igual às cores dos jogadores de campo
  const refShirt = refKitFor(kits as [typeof kits[0], typeof kits[1]], gkKits).shirt;
  const colors: [string, string] = [kits[0].shirt, kits[1].shirt];
  /** nome nas costas: o apelido (último nome), ou o nome inteiro se for só um */
const shirtName = (n: string) => n.split(' ').filter(Boolean).pop() ?? n;
  const textCol = (c: string) => (hexDist(c, '#ffffff') < 200 ? '#111' : '#fff');
  const crowd = attendance(s, f);
  // claques organizadas (bandeiras, tifo, tochas): Benfica e Sporting, só em jogos grandes
  // (dérbi entre os dois ou finais das competições)
  const BIG = ['slb', 'scp'];
  const derby = BIG.includes(f.home) && BIG.includes(f.away);
  const finalGame = f.comp !== 'liga' && f.comp !== 'esp' && /Final/.test(f.stage) && !/Meias|Quartos/.test(f.stage);
  const bigGame = derby || finalGame;
  // som: o clique em "Jogar ao vivo" permite ao browser tocar som
  sound.setVolume(st.sound ?? 'mid');
  // nome cantado de cada clube (como as bancadas o gritam)
  const CHANT_NAME: Record<string, string> = { slb: 'Benfica', scp: 'Sporting', scb: 'Braga', fun: 'Fundão', lps: 'Leões', fzz: 'Ferreira', ele: 'Eléctrico', rav: 'Rio Ave', uvn: 'Venda Nova', por: 'Portimonense', fam: 'Famalicão', tor: 'Torreense' };
  const cname = (c: { id: string; name: string }) => CHANT_NAME[c.id] ?? c.name.split(' ').pop()!;
  const flag = (v: unknown, d: boolean) => (v === undefined ? d : v === true || v === 'true');
  sound.setMatch({ home: { id: h.id, short: cname(h) }, away: { id: a.id, short: cname(a) }, big: bigGame, derby, rude: flag(st.chantsRude, true), words: flag(st.chantWords, true) });
  // barulho do público: conta o número real de pessoas (300 pessoas não fazem o barulho de 3 000) e a ocupação
  const occ = crowd.total / Math.max(1, crowd.arena.capacity);
  const people = Math.max(0, Math.min(1, (Math.log10(Math.max(50, crowd.total)) - 1.7) / (3.7 - 1.7))); // 50 -> 0, 5 000 -> 1
  sound.start(Math.max(0.04, people * (0.45 + 0.55 * occ)));
  const ultras: [boolean, boolean] = [bigGame && BIG.includes(f.home), bigGame && BIG.includes(f.away)];
  const fmtN = (n: number) => n.toLocaleString('pt-PT');

  content.innerHTML = `
    <div class="live">
      <div class="live-top">
        <div class="live-comp small muted">${COMP_NAMES[f.comp]} · ${f.stage}<br>${crowd.arena.name} · ${fmtN(crowd.total)} espetadores${crowd.total >= crowd.arena.capacity ? ' (esgotado)' : ''}<br>${refBadgeHtml(mopts.referees)}</div>
      </div>
      <div class="live-grid">
        <div>
          <div class="sb-center" id="sb"></div>
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
            <div class="gbar-host" id="gbar"></div>
            <div class="hl" id="hl" hidden>
              <div class="hl-view" id="hlv"></div>
              <div class="hl-sb" id="hlsb"></div>
              <div class="hl-cap" id="hlcap"></div>
              <div class="hl-lu" id="hllu"></div>
              <div class="hl-bar">
                <div class="seg cams">${[['tv', 'TV'], ['baliza', 'Atrás da baliza'], ['aerea', 'Aérea'], ['jogador', 'Jogador']].map(([v, l]) => `<button data-cam="${v}" class="${v === 'tv' ? 'on' : ''}">${l}</button>`).join('')}</div>
                <span class="spacer"></span>
                <button class="btn on" id="tags" title="Mostrar ou esconder o número e o nome por cima dos jogadores">Nomes</button>
                <button class="btn" id="rep">Repetição</button>
                <button class="btn primary" id="hlc">Continuar</button>
              </div>
            </div>
          </div>
          <div class="comm" id="comm"><div class="comm-prev" id="commPrev"></div><div class="comm-now" id="commNow">Início do jogo</div></div>
          <div class="live-controls">
            <button class="btn" id="pause">⏸ Pausa</button>
            <div class="seg speed">${(['lento', 'medio', 'rapido'] as const).map((v) => `<button data-speed="${v}" class="${st.speed === v ? 'on' : ''}">${{ lento: 'Lenta', medio: 'Média', rapido: 'Rápida' }[v]}</button>`).join('')}</div>
            <button class="btn" id="snd" title="Som: desligado / baixo / médio / alto">🔊</button>
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
      <div class="modal" id="mtalk" hidden><div class="modal-box talk-box"><div id="talkbody"></div></div></div>
      <div class="modal" id="modal" hidden><div class="modal-box subs-box"><div class="row"><b>Táticas e substituições (jogo em pausa)</b><span class="spacer"></span><button class="btn primary" id="close">Voltar ao jogo</button></div><div id="subsbody"></div><div id="mtac"></div></div></div>
    </div>`;

  const $ = <T extends HTMLElement>(sel: string) => content.querySelector<T>(sel)!;
  const dotsG = $('#dots') as unknown as SVGGElement;
  const ballEl = $('#ball') as unknown as SVGCircleElement;

  // quem é quem (lado, número, guarda-redes)
  const info: Record<string, ActorInfo> = {};
  for (const [side, setup] of [[0, hs], [1, as]] as const) for (const p of setup.squad) info[p.id] = { side, number: p.number, name: shirtName(p.name), gk: p.position === 'GR', look: lookOf(p) };
  for (const id of ['arbitro1', 'arbitro2']) info[id] = { side: 0, number: null, gk: false, referee: true, look: lookOf({ id }) };
  const kit: [[string, string], [string, string]] = [[kits[0].shirt, kits[0].shorts], [kits[1].shirt, kits[1].shorts]];

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

  // ---- som: toques na bola, chiar das sapatilhas e excitação do público, a partir da jogada (2D e 3D) ----
  const heard = new Set<string>();
  function soundFrame(fr: Frame, dir: number) {
    let ex = 0.05;
    const bu = Math.abs(fr.ball.x);
    if (bu > 12 && !fr.stoppage) ex = 0.25 + (bu - 12) * 0.05;
    for (const [id, a] of Object.entries(fr.acts)) {
      if (a.kind === 'shoot' || a.kind === 'dive' || a.kind === 'splits' || a.kind === 'spread') ex = Math.max(ex, 0.9);
      if ((a.kind === 'pass' || a.kind === 'shoot' || a.kind === 'throw') && a.k > 0.35 && a.k < 0.75) {
        const key = `${id}:${a.kind}:${Math.round(fr.ball.x)}:${Math.round(fr.ball.y)}`;
        if (!heard.has(key)) { heard.add(key); if (heard.size > 300) heard.clear(); }
      }
    }
    if (fr.acts && Object.values(fr.acts).some((a) => a.kind === 'celebrate')) ex = 1;
    void dir;
    sound.update(ex);
  }

  function drawFrame() {
    const fr = choreo ? choreo.at(ct) : null;
    if (fr && !in3d) soundFrame(fr, choreo!.attackDirection);
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
      const fill = inf.referee ? refShirt : inf.gk ? gkKits[inf.side].shirt : colors[inf.side];
      const hasBall = fr?.holder === id;
      let extra = '';
      let body = `<circle r="${inf.referee ? 5 : 8}" fill="${fill}" stroke="${inf.side === mySide ? '#facc15' : '#111'}" stroke-width="1.5"/>`;
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
        } else if (act.kind === 'shove') {
          extra += `<circle r="10" fill="none" stroke="#ef4444" stroke-width="2.5" opacity="${(0.5 + 0.5 * Math.abs(Math.sin(act.k * 18))).toFixed(2)}"/>`;
        } else if (act.kind === 'tackle') {
          extra += `<circle r="11" fill="none" stroke="#fb923c" stroke-width="2" stroke-dasharray="3 2"/>`;
        } else if (act.kind === 'celebrate') {
          extra += `<circle r="${(10 + Math.sin(act.k * Math.PI * 6) * 2).toFixed(1)}" fill="none" stroke="#facc15" stroke-width="2"/>`;
        } else if (act.kind === 'fall') {
          body = body.replace('<circle', '<circle opacity=".55"');
        }
      }
      html += `<g transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})">${hasBall ? '<circle r="11" fill="none" stroke="#fff" stroke-width="2"/>' : ''}${body}${extra}<text y="3.5" text-anchor="middle" font-size="9" font-weight="700" fill="${textCol(fill)}">${inf.number ?? ''}</text>${inf.name ? `<text y="17" text-anchor="middle" font-size="6.5" font-weight="700" fill="#fff" stroke="rgba(0,0,0,.65)" stroke-width="1.6" paint-order="stroke">${inf.name}</text>` : ''}</g>`;
    }
    dotsG.innerHTML = under + html;
    if (fr) {
      ballP = { x: fr.ball.x, y: fr.ball.y };
      const b = toSvg(ballP);
      ballEl.setAttribute('cx', b.x.toFixed(1));
      ballEl.setAttribute('cy', b.y.toFixed(1));
      ballEl.setAttribute('r', String(3.5 + Math.min(3, fr.ball.z * 2)));
      fr0Label = fr.label;
      const what = fr.label || (fr.holder ? `Com bola: ${m.names[fr.holder] ?? ''}` : '');
      label = fr.phase ? `${fr.phase}${what ? ' · ' + what : ''}` : what;
    }
    $('#cap2d').textContent = '';
    // comentário em tempo real: só os lances importantes da jogada (remates, defesas, cantos, livres…)
    const lb = fr0Label;
    if (lb && lb !== lastLabel && IMPORTANT.test(lb) && !(st.moments3d !== 'nenhum' && /^GOLO|Confronto/.test(lb))) comment(lb);
    lastLabel = lb;
    void label;
  }

  // ---- comentário ao estilo FM: barra grande por baixo da quadra, só o essencial ----
  const IMPORTANT = /^(Remate|GOLO|Voo|Defesa|Ao poste|Canto para|Livre|Penálti|Barreira|Cruzamento|Contra-ataque|.* isolado|.* agarra a bola|.* defende|.* fecha o ângulo|.* sai ao encontro|.* vai à recarga|.* desarma e a bola sai|Pontapé de linha lateral)/;
  let lastLabel = '';
  let fr0Label = '';
  let commTimer = 0;
  function comment(text: string, kind = '') {
    const now = performance.now();
    const el = $('#commNow');
    if (el.textContent === text) return;
    // não troca mais depressa do que ~1,2 s, a não ser num golo/cartão
    if (now - commTimer < 1200 && !kind) return;
    commTimer = now;
    $('#commPrev').textContent = el.textContent ?? '';
    el.textContent = text;
    el.className = `comm-now ${kind}`;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  }

  function drawScoreboard() {
    const per = snap.period;
    const inPeriod = Math.max(0, Math.min(snap.periodLen, display - snap.periodStart));
    const note = snap.teams.some((t) => t.flying) ? '5x4' : snap.teams.some((t) => t.short) ? 'Inferioridade numérica' : banner;
    const sbHtml = scoreboardHtml({
      style,
      home: { id: h.id, short: h.shortName, color: colors[0], score: shownScore[0], fouls: snap.teams[0].fouls },
      away: { id: a.id, short: a.shortName, color: colors[1], score: shownScore[1], fouls: snap.teams[1].fouls },
      clock: fmt(inPeriod),
      period: per === 1 ? '1.ª P' : per === 2 ? '2.ª P' : per <= 4 ? 'Prol.' : 'Pen.',
      note,
    });
    if (sbHtml !== lastSb) {
      lastSb = sbHtml;
      $('#sb').innerHTML = sbHtml;
      $('#hlsb').innerHTML = sbHtml; // o 3D em ecrã inteiro também mostra o marcador
    }
  }
  let lastSb = '';

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
        ${t.bench.map((p) => `<tr class="${p.sentOff ? 'muted' : ''}"><td>${p.number ?? ''}</td><td>${p.name}${p.sentOff ? ' 🟥' : ''} <span data-sheet="${p.id}" data-en="${p.energy}" title="Ver atributos" style="cursor:pointer">ℹ️</span></td><td>${bar(p.energy)}</td><td>${ps[p.id]?.goals || ''}</td></tr>`).join('')}
      </tbody></table><p class="small muted">Em campo a amarelo. Energia baixa rende menos; muda os quintetos ou a rotação nas Táticas.</p>`;
    }
  }

  // gráfico de golo no terço inferior (2D e 3D), uma vez por golo
  const goalsShown = new Set<string>();
  let gbarTimer: ReturnType<typeof setTimeout> | null = null;
  function goalBar(e: MatchEvent) {
    const key = `${e.t}-${e.score[0]}-${e.score[1]}`;
    if (goalsShown.has(key)) return;
    goalsShown.add(key);
    sound.goal(e.side === 0);
    const sd = e.side ?? 0;
    const sq = (sd === 0 ? hs : as).squad.find((p) => p.id === e.playerId);
    const how = / (de penálti|no livre direto dos 10 metros|em contra-ataque|na recarga|na sequência de um canto|para a baliza deserta)/.exec(e.text)?.[1];
    const per = e.period === 1 ? '1.ª parte' : e.period === 2 ? '2.ª parte' : 'Prolongamento';
    const el = $('#gbar');
    el.innerHTML = goalBarHtml({
      style,
      team: { short: sd === 0 ? h.shortName : a.shortName, color: colors[sd] },
      scorer: { number: sq?.number ?? null, name: m.names[e.playerId!] ?? '' },
      assist: e.assistId ? m.names[e.assistId] : undefined,
      time: `${e.text.slice(0, 5)} · ${per}`,
      score: `${h.shortName} ${e.score[0]}-${e.score[1]} ${a.shortName}`,
      note: how,
    });
    if (gbarTimer) clearTimeout(gbarTimer);
    gbarTimer = setTimeout(() => {
      el.firstElementChild?.classList.add('out');
      gbarTimer = setTimeout(() => (el.innerHTML = ''), 450);
    }, 6500);
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
    // remate à baliza deserta (5x4 perdido): lance perigosíssimo, mostra-se sempre que o 3D vai além dos golos
    const open = st.moments3d !== 'golos' && p.actions.some((x) => x.type === 'shot' && x.kind === 'open');
    const ev = p.events.find((e) => types.includes(e.type)) ?? (open ? p.events.find((e) => /^remate|poste|golo/.test(e.type)) : undefined);
    if (!ev) return null;
    // golos, confrontos, penáltis, livres de 10 m, expulsões e baliza deserta mostram-se sempre (sem o intervalo mínimo entre lances 3D)
    const MUST = ['golo', 'confronto', 'penalti', 'livre_10m', 'vermelho'];
    const must = p.events.find((e) => MUST.includes(e.type) && (types.includes(e.type) || e.type === 'golo' || e.type === 'confronto')) ?? (open ? ev : undefined);
    if (!must && ev.t - last3d < 60) return null;
    return p.events.find((e) => e.type === 'golo') ?? must ?? ev;
  }

  const benchIds = (): [string[], string[]] => [0, 1].map((sd) => snap.teams[sd].bench.filter((p) => !p.sentOff).map((p) => p.id)) as [string[], string[]];
  async function ensure3d() {
    if (hl) return;
    const mod = await import('../three/highlight3d');
    hl = new mod.Highlight3D($('#hlv'), {
      kits,
      quality: st.quality ?? 'normal',
      lang: countryOfComp(f.comp) === 'esp' ? 'es' : 'pt', // anúncios e cores do túnel conforme o país da liga
      gkKits,
      refShirt,
      profile: crowd.arena,
      crowd: crowd.total,
      shares: crowd.shares,
      comp: COMP_NAMES[f.comp],
      stage: f.stage,
      teams: [{ short: h.shortName, colors: kit[0], name: h.name }, { short: a.shortName, colors: kit[1], name: a.name }],
      ultras,
    });
    hl.onFrame = (fr) => soundFrame(fr, 1);
    hl.onGoal = () => { const g = poss?.events.find((e) => e.type === 'golo'); if (g) goalBar(g); };
  }

  // ---- Antes do jogo: entrada das equipas, alinhamento e cinco iniciais (3D) ----
  let introTimers: ReturnType<typeof setTimeout>[] = [];
  let introStage = -1; // 0 entrada, 1 cinco iniciais, 2 suplentes
  let introStep: (step: number) => void = () => {};
  async function openIntro() {
    in3d = true;
    $('#hl').hidden = false;
    $('#hlcap').textContent = ''; // só o marcador (pedido do António): sem etiqueta com clubes e pavilhão
    await ensure3d();
    if (!hl) return;
    introStage = 0;
    const lineup = (sd: 0 | 1) => {
      const t = snap.teams[sd];
      return [t.gk, ...t.court, ...t.bench].filter((p): p is NonNullable<typeof p> => !!p).map((p) => p.id);
    };
    const refs = ['arbitro1', 'arbitro2'];
    for (const id of refs) info[id] = { side: 0, number: null, gk: false, referee: true, look: lookOf({ id }) };
    const intro = new IntroScene([lineup(0), lineup(1)], refs);
    // gráfico dos cinco iniciais de cada equipa, no estilo do marcador
    const pos = (id: string, sd: 0 | 1) => ([hs, as][sd].squad.find((p) => p.id === id)?.position ?? '');
    const card = (sd: 0 | 1, subs: boolean) => {
      const t = snap.teams[sd];
      const club = sd ? a : h;
      const setup = sd ? as : hs;
      const list = subs ? t.bench : [t.gk, ...t.court];
      return lineupHtml({
        style,
        team: { name: club.name, short: club.shortName, color: kit[sd][0] },
        title: subs ? 'Suplentes' : 'Cinco inicial',
        compact: subs,
        players: list.filter((p): p is NonNullable<typeof p> => !!p).map((p) => ({ number: p.number, name: p.name, pos: pos(p.id, sd) })),
        coach: setup.coachName,
        system: setup.tactics.system,
      });
    };
    // momentos da apresentação: entrada -> cinco iniciais (10 s) -> suplentes (5 s) -> jogo;
    // um clique no ecrã passa ao momento seguinte
    introStep = (step: number) => {
      for (const t of introTimers) clearTimeout(t);
      introTimers = [];
      const box = $('#hllu');
      introStage = step;
      if (step === 1) {
        hl?.seek(intro.total);
        box.innerHTML = card(0, false) + card(1, false);
        introTimers.push(setTimeout(() => introStep(2), 10000));
      } else if (step === 2) {
        box.innerHTML = card(0, true) + card(1, true);
        introTimers.push(setTimeout(() => introStep(3), 5000));
      } else closeIntro();
    };
    hl.onEnd = () => {
      if (!introDone && introStage === 0) introStep(1);
    };
    hl.setBench(benchIds());
    hl.play(intro, info, kit, 0, intro.total, [[0, 0], [0, 0]]);
  }

  let introDone = false;
  function closeIntro() {
    introDone = true;
    introStage = -1;
    if (hl) hl.onEnd = null;
    for (const t of introTimers) clearTimeout(t);
    introTimers = [];
    $('#hllu').innerHTML = '';
    $('#hl').hidden = true;
    in3d = false;
    last = performance.now();
  }

  async function open3d(ev: MatchEvent) {
    if (!choreo) return;
    in3d = true;
    last3d = ev.t;
    $('#hl').hidden = false;
    $('#hlcap').textContent = ''; // sem descrição do lance: não se sabe o que vai acontecer
    await ensure3d();
    if (!hl) return;
    chain = 0;
    shown3d = choreo;
    hl.onEnd = end3d;
    hl.setBench(benchIds());
    const total = choreo.total;
    const after: [number, number] = ev.type === 'golo' ? [ev.score[0], ev.score[1]] : [shownScore[0], shownScore[1]];
    hl.play(choreo, info, kit, Math.max(0, total - Math.max(10, choreo.extra + 7)), total, [[shownScore[0], shownScore[1]], after]);
  }

  // fim da imagem 3D: depois de um golo, repetição automática em câmara lenta noutro ângulo
  let userCam: CameraId = 'tv';
  const replayed = new Set<Choreo>();
  function end3d() {
    if (!hl) return;
    const c = shown3d;
    const g = c?.goalShotCt;
    if (c && g != null && !replayed.has(c)) {
      replayed.add(c);
      $('#hlcap').textContent = 'Repetição';
      sound.muffle(true);
      hl.replayWindow(Math.max(0, g - 2.6), Math.min(c.total, g + 1.4), 0.4, userCam === 'baliza' ? 'tv' : 'baliza');
      return;
    }
    // grande defesa: repetição em câmara lenta, vista de trás da baliza (como numa transmissão)
    const sv = c?.bigSaveCt;
    if (c && sv != null && g == null && !replayed.has(c)) {
      replayed.add(c);
      $('#hlcap').textContent = 'Repetição · grande defesa';
      sound.muffle(true);
      hl.replayWindow(Math.max(0, sv - 1.8), Math.min(c.total, sv + 1.6), 0.45, userCam === 'baliza' ? 'tv' : 'baliza');
      return;
    }
    hl.cameraId = userCam;
    sound.muffle(false);
    if (tryContinue()) return;
    autoClose = setTimeout(close3d, 2500);
  }

  // depois de um lance perigoso: se quem defendeu sai em contra-ataque, o 3D continua sem cortes
  let chain = 0;
  let shown3d: Choreo | null = null;
  function tryContinue(): boolean {
    if (!hl || !choreo || done || chain >= 3) return false;
    ct = choreo.total;
    if (poss) display = poss.end;
    reveal();
    const more = nextPossession(false);
    if (!more || !poss || !choreo) return false;
    const counter = poss.counter || poss.actions.some((x) => x.kind === 'counter');
    // golo na posse seguinte: tem sempre de ser visto em 3D (continua sem cortes); o resto segue no 2D
    const goalNext = poss.events.some((e) => e.type === 'golo' || e.type === 'confronto') && st.moments3d !== 'nenhum';
    if (!counter && !goalNext) return false;
    chain++;
    shown3d = choreo;
    $('#hlcap').textContent = '';
    const g = poss.events.find((e) => e.type === 'golo');
    const after: [number, number] = g ? [g.score[0], g.score[1]] : [shownScore[0], shownScore[1]];
    hl.setBench(benchIds());
    hl.continueWith(choreo, 0, choreo.total, [[shownScore[0], shownScore[1]], after]);
    return true;
  }

  function close3d() {
    sound.muffle(false);
    if (autoClose) clearTimeout(autoClose);
    autoClose = null;
    $('#hl').hidden = true;
    in3d = false;
    // a jogada mostrada em 3D já foi vista (se o 3D avançou para a posse seguinte sem contra-ataque, o 2D mostra-a)
    if (choreo && choreo === shown3d) {
      ct = choreo.total;
      if (poss) display = poss.end;
    }
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
      // som dos acontecimentos: apito, buzina, "uuuh", poste, assobios
      if (e.type === 'inicio' || e.type === 'prolongamento') sound.whistle('long');
      else if (e.type === 'fim_parte') { sound.horn(); sound.whistle('long'); }
      else if (e.type === 'fim_jogo') { sound.horn(1.8); sound.whistle('triple'); }
      else if (e.type === 'falta' || e.type === 'livre_10m' || e.type === 'penalti' || e.type === 'amarelo') sound.whistle('short');
      else if (e.type === 'vermelho' || e.type === 'confronto') { sound.whistle('short'); sound.boo(); }
      else if (e.type === 'poste') sound.ooh(0.9);
      else if (e.type === 'remate_defendido' || e.type === 'remate_fora') sound.ooh(e.type === 'remate_defendido' ? 1 : 0.7);
      else if (e.type === 'time_out') sound.horn(0.9);
      // comentário: golos, cartões, faltas importantes, confrontos, descontos de tempo, 5x4, fim das partes
      const COMM: Record<string, string> = { lesao: 'card', golo: 'goal', amarelo: 'card', vermelho: 'red', confronto: 'red', livre_10m: '', penalti: '', time_out: '', gr_avancado_on: '', fim_parte: '', prolongamento: '', poste: '', canto: '', remate_defendido: '', remate_fora: '', remate_bloqueado: '' };
      // golos e confrontos vêem-se em 3D: não vão para o comentário (só se o 3D estiver desligado)
      const in3dOnly = (e.type === 'golo' || e.type === 'confronto') && st.moments3d !== 'nenhum';
      if (in3dOnly) { /* mostrado em 3D */ } else if (e.type in COMM || (e.type === 'falta' && /acumulada/.test(e.text))) comment(e.text.replace(/^\d+:\d+ /, ''), COMM[e.type] ?? 'card');
      if (e.type === 'golo') {
        shownScore = [e.score[0], e.score[1]];
        goalBar(e);
        hold = 1.6;
      } else if (KEY_TYPES[st.moments3d].includes(e.type)) {
        banner = { penalti: 'Penálti', livre_10m: 'Livre de 10 m', vermelho: 'Expulsão', poste: 'Ao poste!', gr_avancado_on: '5x4', remate_defendido: 'Grande defesa', remate_fora: 'Ocasião', canto: 'Canto', confronto: 'Confronto!' }[e.type as string] ?? '';
        setTimeout(() => (banner = ''), 2500);
      }
      if (e.type === 'fim_jogo') done = true;
      // palestras: intervalo e desconto de tempo pedido por mim
      if (e.type === 'fim_parte' && e.period === 1) openTalk('intervalo');
      if (e.type === 'time_out' && e.side === mySide) openTalk('desconto');
      if (tab === 'feed') drawSide();
    }
  }

  // ---- Palestras (antes, intervalo, desconto de tempo, fim), como no FM: pode-se passar à frente ----
  let endTalkDone = false;
  function openTalk(moment: TalkMoment, after?: () => void) {
    const wasPaused = paused;
    paused = true;
    const sc = m.snapshot().score;
    const sit = situationOf(sc[mySide], sc[1 - mySide]);
    const me = mySide === 0 ? hs : as, them = mySide === 0 ? as : hs;
    const lvl = (x: typeof hs) => x.squad.reduce((a, p) => a + overall(p.attrs, p.position), 0) / Math.max(1, x.squad.length);
    const underdog = lvl(me) < lvl(them) - 0.4;
    const players = me.squad;
    const title = { pre: 'Palestra antes do jogo', intervalo: 'Intervalo', desconto: 'Desconto de tempo (1 minuto)', fim: 'Palestra no fim do jogo' }[moment];
    const close = () => {
      $('#mtalk').hidden = true;
      paused = moment === 'fim' ? paused : wasPaused;
      after?.();
    };
    const draw = (reactions?: TalkReaction[], chosen?: string) => {
      const rx = (id: string) => reactions?.find((x) => x.id === id);
      $('#talkbody').innerHTML = `
        <div class="row"><b>${title}</b><span class="small muted" style="margin-left:8px">${hs.shortName} ${sc[0]}-${sc[1]} ${as.shortName}</span><span class="spacer"></span>
        ${reactions ? `<button class="btn primary" id="talkok">Continuar ▸</button>` : `<button class="btn ghost" id="talkskip">Passar à frente</button>`}</div>
        ${reactions ? `<p class="small">Disseste: <i>"${TALKS[moment].find((o) => o.id === chosen)!.text}"</i></p>` : `<div class="talk-opts">${TALKS[moment].map((o) => `<button class="btn" data-talk="${o.id}" title="${o.text}">${o.label}</button>`).join('')}</div><p class="small muted">Passa o rato por cima de cada tom para ver o que dizes. As palavras podem subir ou baixar a moral.</p>`}
        <table class="tbl small"><thead><tr><th>#</th><th>Jogador</th><th>Moral</th><th>${reactions ? 'Reação' : ''}</th></tr></thead><tbody>
        ${players.map((p) => { const r0 = rx(p.id); const mo = (s.morale?.[p.id] ?? 65); return `<tr><td>${p.number ?? ''}</td><td>${p.name}</td><td>${moraleHtml(mo)}</td><td>${r0 ? `${r0.face} <span class="small ${r0.delta >= 0 ? 'res-w' : 'res-l'}">${r0.delta >= 0 ? 'motivado' : 'abalado'}</span>` : ''}</td></tr>`; }).join('')}
        </tbody></table>`;
      $('#talkbody').querySelector('#talkskip')?.addEventListener('click', close);
      $('#talkbody').querySelector('#talkok')?.addEventListener('click', close);
      $('#talkbody').querySelectorAll<HTMLElement>('[data-talk]').forEach((b) => b.addEventListener('click', () => {
        const rs = talkEffect(players, b.dataset.talk!, moment === 'pre' ? (underdog ? 'perder' : 'empatar') : sit, underdog, `${f.id}-${moment}-${s.season.year}`);
        // motivação do treinador: palestras mais (ou menos) eficazes
        const mk = 1 + ((s.manager.attrs?.motivacao ?? 10) - 10) * 0.04;
        for (const x of rs) x.delta = Math.round(x.delta * (x.delta > 0 ? mk : 2 - mk) * 10) / 10;
        const deltas = Object.fromEntries(rs.map((x) => [x.id, x.delta]));
        // no jogo: efeito imediato; fica também uma parte na moral do jogador (toda, no fim do jogo)
        if (moment !== 'fim') m.talk(mySide as 0 | 1, deltas);
        const keep = moment === 'fim' ? 1 : moment === 'pre' ? 0.4 : 0.25;
        s.morale ??= {};
        for (const x of rs) s.morale[x.id] = Math.max(0, Math.min(100, (s.morale[x.id] ?? 65) + x.delta * keep));
        draw(rs, b.dataset.talk);
      }));
    };
    $('#mtalk').hidden = false;
    draw();
  }

  // ---- Festa do título em 3D: palanque com o nome da competição, taça, confetes ----
  let trophyDone = false, inTrophy = false;
  async function openTrophy3d(comp: CompId) {
    in3d = true; inTrophy = true;
    $('#hl').hidden = false;
    $('#hlcap').textContent = `${s.clubs.find((c) => c.id === s.clubId)!.name}: campeões!`;
    await ensure3d();
    if (!hl) return finishUi();
    const t = snap.teams[mySide], o = snap.teams[1 - mySide];
    const ids = (x: typeof t) => [x.gk, ...x.court, ...x.bench].filter((p): p is NonNullable<typeof p> => !!p).map((p) => p.id);
    const win = ids(t);
    // capitão: o jogador de campo com mais liderança
    const capId = [...win].sort((x, y) => (s.players.find((p) => p.id === y)?.attrs.lideranca ?? 0) - (s.players.find((p) => p.id === x)?.attrs.lideranca ?? 0))[0];
    const refs = ['arbitro1', 'arbitro2'];
    for (const id of refs) info[id] ??= { side: 0, number: null, gk: false, referee: true, look: lookOf({ id }) };
    const start = choreo ? choreo.at(choreo.total).pos : {};
    const scene = new TrophyScene(start, [capId, ...win.filter((x) => x !== capId)], ids(o), refs);
    hl.onEnd = null;
    hl.setBench([[], []]);
    hl.play(scene, info, kit, 0, scene.total, [[shownScore[0], shownScore[1]], [shownScore[0], shownScore[1]]]);
    hl.setTags(false); // sem etiquetas por cima dos campeões
    hl.trophyCeremony(COMP_NAMES[comp].replace(/ \((play-off|fase final)\)/, ''), capId, kit[mySide], countryOfComp(f.comp) === 'esp' ? 'es' : 'pt');
    $('#hlc').textContent = 'Continuar ▸';
  }

  function finishUi() {
    done = true;
    sound.stop();
    hl?.dispose();
    hl = null;
    const res = m.result();
    const before = { ...s.season.winners };
    onRecord?.(res, st.moments3d !== 'nenhum'); // grava já o resultado (com 3D, a festa do título é em 3D)
    const won = (Object.keys(s.season.winners) as CompId[]).find((c) => s.season.winners[c] === s.clubId && before[c] !== s.clubId);
    if (won && st.moments3d !== 'nenhum' && !trophyDone) { trophyDone = true; void openTrophy3d(won); return; }
    if (!endTalkDone) { endTalkDone = true; openTalk('fim', () => finishUi()); return; }
    content.innerHTML = `<h2>Resultado final</h2><div class="row" style="justify-content:flex-start;margin-bottom:12px"><button class="btn primary" id="cont">Continuar ▸</button></div>` + resultHtml(res, h, a);
    content.querySelector('#all')?.addEventListener('change', (ev) => {
      content.querySelectorAll<HTMLElement>('.ev.minor').forEach((x) => (x.style.display = (ev.target as HTMLInputElement).checked ? '' : 'none'));
    });
    content.querySelector('#cont')!.addEventListener('click', () => onDone(res));
  }

  // avança o motor para a posse seguinte e prepara a coreografia
  function nextPossession(allow3d = true): boolean {
    const more = m.step();
    snap = m.snapshot();
    if (snap.possession) {
      poss = snap.possession;
      const playersById = Object.fromEntries([...hs.squad, ...as.squad].map((player) => [player.id, player]));
      const energy = Object.fromEntries(snap.teams.flatMap((t) => [...t.court, ...(t.gk ? [t.gk] : [])].map((x) => [x.id, x.energy])));
      choreo = new Choreo(poss, [hs.tactics, as.tactics], snap.period, startState, m.names, playersById, energy);
      startState = choreo.end;
      ct = 0;
      display = poss.start;
      const key = allow3d && st.moments3d !== 'nenhum' ? keyEventOf(poss) : null;
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
  // ---- Substituições manuais e sistema, como no FM: pausa, escolhe quem sai e quem entra ----
  // ℹ️ ao lado de cada jogador (painel lateral e substituições): folha com atributos e energia
  content.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-sheet]');
    if (!el) return;
    e.stopPropagation();
    openPlayerSheet(s, el.dataset.sheet!, Number(el.dataset.en));
  }, true);
  let subOut: string | null = null;
  let flyMode: boolean | null = null;
  function drawSubs(msg = '') {
    const t = m.snapshot().teams[mySide];
    const bar = (e: number) => `<span class="ebar"><i style="width:${e}%;background:${e > 70 ? '#4ade80' : e > 50 ? '#facc15' : '#f87171'}"></i></span>`;
    const row = (p: { id: string; number: number | null; name: string; energy: number; position?: string; sentOff?: boolean }, where: 'out' | 'in') =>
      `<tr class="${where === 'out' && subOut === p.id ? 'sel' : ''} ${p.sentOff ? 'muted' : 'pick'}" data-${where}="${p.id}"><td>${p.number ?? ''}</td><td>${p.name}${p.sentOff ? ' 🟥' : ''} <span data-sheet="${p.id}" data-en="${p.energy}" title="Ver atributos" style="cursor:pointer">ℹ️</span></td><td>${p.position ?? ''}</td><td>${bar(Math.round(p.energy))} ${Math.round(p.energy)}%</td></tr>`;
    const tac = s.tactics;
    const segBtns = (key: 'system' | 'rotation', opts: Record<string, string>) => Object.entries(opts).map(([v, l]) => `<button class="${(tac as unknown as Record<string, string>)[key] === v ? 'on' : ''}" data-tk="${key}" data-tv="${v}">${l.split(' (')[0]}</button>`).join('');
    $('#subsbody').innerHTML = `
      <div class="subs-top">
        <div><div class="seg-title">Sistema</div><div class="seg">${segBtns('system', { '3-1': '3-1', '4-0': '4-0', '2-2': '2-2', '1-2-1': '1-2-1' })}</div></div>
        <div><div class="seg-title">Rotação automática</div><div class="seg">${segBtns('rotation', { curta: 'Curta', normal: 'Normal', longa: 'Longa', manual: 'Manual (só eu substituo)' })}</div></div>
        <div><div class="seg-title">Guarda-redes avançado ${m.flyingNow(mySide) ? '(em campo)' : ''}</div><div class="seg"><button data-fly="on" class="${flyMode === true ? 'on' : ''}">Lançar já</button><button data-fly="off" class="${flyMode === false ? 'on' : ''}">Tirar</button><button data-fly="auto" class="${flyMode === null ? 'on' : ''}">Pela tática</button></div></div>
      </div>
      <p class="small muted">1) Clica em quem <b>sai</b> (em campo). 2) Clica em quem <b>entra</b> (banco). As substituições são volantes e ilimitadas; a troca faz-se na jogada seguinte. ${tac.rotation === 'manual' ? 'Rotação manual: o motor não troca ninguém.' : 'Com rotação automática o motor também vai trocando quintetos; escolhe Manual para mandares sozinho.'}</p>
      ${msg ? `<div class="flash-msg">${msg}</div>` : ''}
      <div class="subs-cols">
        <div><b>Em campo</b><table class="tbl small"><tbody>${[t.gk, ...t.court].filter((p): p is NonNullable<typeof p> => !!p).map((p) => row(p, 'out')).join('')}</tbody></table></div>
        <div><b>Banco</b><table class="tbl small"><tbody>${t.bench.map((p) => row(p, 'in')).join('')}</tbody></table></div>
      </div>`;
    $('#subsbody').querySelectorAll<HTMLElement>('[data-out]').forEach((el) => el.addEventListener('click', () => { subOut = el.dataset.out!; drawSubs(); }));
    $('#subsbody').querySelectorAll<HTMLElement>('[data-in]').forEach((el) => el.addEventListener('click', () => {
      if (!subOut) return drawSubs('Escolhe primeiro quem sai (em campo).');
      const err = m.substitute(mySide, subOut, el.dataset.in!);
      subOut = null;
      snap = m.snapshot();
      drawSubs(err ?? 'Substituição feita.');
    }));
    $('#subsbody').querySelectorAll<HTMLButtonElement>('[data-fly]').forEach((b) => b.addEventListener('click', () => {
      flyMode = b.dataset.fly === 'on' ? true : b.dataset.fly === 'off' ? false : null;
      m.setFlying(mySide as 0 | 1, flyMode);
      drawSubs(flyMode === true ? 'O guarda-redes avançado entra na próxima jogada.' : flyMode === false ? 'Volta o guarda-redes à baliza.' : 'O 5x4 segue a instrução tática.');
    }));
    $('#subsbody').querySelectorAll<HTMLButtonElement>('[data-tk]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.tk as 'system' | 'rotation';
      (tac as unknown as Record<string, string>)[k] = b.dataset.tv!;
      if (k === 'system') for (const q of ['q1', 'q2'] as const) tac[q] = arrangeForSystem(tac[q].map((id) => s.players.find((p) => p.id === id)), tac.system).map((p) => p?.id ?? '');
      drawSubs(k === 'system' ? `Sistema ${tac.system} a partir da próxima jogada.` : '');
    }));
  }
  $('#tac').addEventListener('click', () => {
    paused = true;
    subOut = null;
    $('#modal').hidden = false;
    drawSubs();
    renderTactics($('#mtac'), s, s.clubId);
  });
  $('#close').addEventListener('click', () => {
    $('#modal').hidden = true;
    paused = false;
    $('#pause').textContent = '⏸ Pausa';
  });
  const SND = ['off', 'low', 'mid', 'high'] as const;
  const sndIcon = () => ($('#snd').textContent = sound.volume === 'off' ? '🔇' : sound.volume === 'low' ? '🔈' : sound.volume === 'mid' ? '🔉' : '🔊');
  sndIcon();
  $('#snd').addEventListener('click', () => {
    const v = SND[(SND.indexOf(sound.volume) + 1) % SND.length];
    sound.setVolume(v);
    st.sound = v;
    sndIcon();
  });
  $('#to').addEventListener('click', () => {
    if (m.requestTimeout(mySide)) flash('Desconto de tempo pedido', 'mine');
  });
  content.querySelectorAll<HTMLButtonElement>('[data-cam]').forEach((b) =>
    b.addEventListener('click', () => {
      if (autoClose) { clearTimeout(autoClose); autoClose = null; }
      userCam = b.dataset.cam as CameraId;
      if (hl) hl.cameraId = userCam;
      content.querySelectorAll('[data-cam]').forEach((x) => x.classList.toggle('on', x === b));
    })
  );
  let tagsOn = true;
  $('#tags').addEventListener('click', () => {
    tagsOn = !tagsOn;
    $('#tags').classList.toggle('on', tagsOn);
    hl?.setTags(tagsOn);
  });
  $('#rep').addEventListener('click', () => {
    if (autoClose) { clearTimeout(autoClose); autoClose = null; }
    sound.muffle(true);
    hl?.replay(0.6);
  });
  $('#hlc').addEventListener('click', () => {
    if (inTrophy) { inTrophy = false; $('#hl').hidden = true; in3d = false; finishUi(); return; }
    return introStage >= 0 ? closeIntro() : close3d();
  });
  // clique no ecrã 3D durante a apresentação: passa ao momento seguinte
  $('#hl').addEventListener('click', (e) => {
    if (introStage < 0 || (e.target as HTMLElement).closest('button')) return;
    introStep(introStage + 1);
  });
  $('#skip').addEventListener('click', () => {
    if (in3d) close3d();
    while (m.step());
    finishUi();
  });

  drawSide();
  requestAnimationFrame(frame);
  // palestra antes do jogo; depois a cerimónia 3D (se estiver ligada)
  openTalk('pre', () => { if (st.moments3d !== 'nenhum') openIntro(); });
}
