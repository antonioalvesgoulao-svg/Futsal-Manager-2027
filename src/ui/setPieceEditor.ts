// Editor de jogadas de bola parada (pedido do António): dispor 3 jogadores na meia-quadra de ataque, escolher a função
// (rematador, apoio, bloqueio, equilíbrio) e quem a faz, e desenhar setas (movimentos) e tracejados (passes) com o rato.
import { defaultCustom, SP_ROLE_LABEL, type CustomPlay, type SpRole } from '../core/tactics';
import type { Player } from '../core/types';

type Tool = 'mover' | 'seta' | 'passe' | 'apagar';
let tool: Tool = 'mover';

// quadra: x 18..40 (metros desde a minha baliza), y -10..10; SVG 440 x 400 (x para cima: a baliza adversária em cima)
const W = 440, H = 400;
const toSvg = (q: { x: number; y: number }) => ({ X: ((q.y + 10) / 20) * W, Y: ((40 - q.x) / 22) * H });
const fromSvg = (X: number, Y: number) => ({ x: Math.max(18, Math.min(40, 40 - (Y / H) * 22)), y: Math.max(-10, Math.min(10, (X / W) * 20 - 10)) });
const r1 = (v: number) => Math.round(v * 10) / 10;

export function setPieceEditor(host: HTMLElement, kind: 'canto' | 'livre', cp0: CustomPlay | undefined, squad: Player[], takerName: string, save: (cp: CustomPlay) => void) {
  const cp: CustomPlay = cp0 ? JSON.parse(JSON.stringify(cp0)) : defaultCustom(kind);
  const taker = kind === 'canto' ? { x: 39.3, y: 9.3 } : { x: 29, y: 6 }; // marcador (no canto, um pouco para dentro para se ver e agarrar)
  const out = squad.filter((p) => p.position !== 'GR');
  const draw = () => {
    const arrow = (a: { x: number; y: number }, b: { x: number; y: number }, pass: boolean, i: number) => {
      const A = toSvg(a), B = toSvg(b);
      return `<line x1="${A.X}" y1="${A.Y}" x2="${B.X}" y2="${B.Y}" stroke="${pass ? '#facc15' : '#fff'}" stroke-width="3" ${pass ? 'stroke-dasharray="8 6"' : ''} marker-end="url(#ah${pass ? 'p' : 'r'})" data-path="${i}" style="cursor:${tool === 'apagar' ? 'pointer' : 'default'}"/>`;
    };
    const posOf = (from: number) => (from === -1 ? taker : cp.slots[from]);
    host.innerHTML = `
      <div class="sp-editor">
        <div class="seg">${(['mover', 'seta', 'passe', 'apagar'] as Tool[]).map((t) => `<button class="${tool === t ? 'on' : ''}" data-tool="${t}">${{ mover: '✋ Mover jogadores', seta: '➜ Seta (movimento)', passe: '┄ Tracejado (passe)', apagar: '✖ Apagar traço' }[t]}</button>`).join('')}</div>
        <div class="row" style="align-items:flex-start;gap:14px;flex-wrap:wrap">
          <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="sp-court" id="spc">
            <defs>
              <marker id="ahr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#fff"/></marker>
              <marker id="ahp" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#facc15"/></marker>
            </defs>
            <rect width="${W}" height="${H}" fill="#2f64b0"/>
            <rect x="2" y="2" width="${W - 4}" height="${H - 4}" fill="none" stroke="#fff" stroke-width="2"/>
            <path d="M ${toSvg({ x: 40, y: -7.6 }).X} 2 A 120 120 0 0 0 ${toSvg({ x: 40, y: 7.6 }).X} 2" fill="none" stroke="#fff" stroke-width="2" transform="translate(0,0)"/>
            <path d="M ${toSvg({ x: 40, y: -6 }).X} 2 Q ${W / 2} ${toSvg({ x: 32, y: 0 }).Y} ${toSvg({ x: 40, y: 6 }).X} 2" fill="none" stroke="#fff" stroke-width="2"/>
            <rect x="${toSvg({ x: 40, y: -1.5 }).X}" y="0" width="${toSvg({ x: 40, y: 1.5 }).X - toSvg({ x: 40, y: -1.5 }).X}" height="6" fill="#fff"/>
            <circle cx="${toSvg({ x: 34, y: 0 }).X}" cy="${toSvg({ x: 34, y: 0 }).Y}" r="3" fill="#fff"/>
            <circle cx="${toSvg({ x: 30, y: 0 }).X}" cy="${toSvg({ x: 30, y: 0 }).Y}" r="3" fill="#fff"/>
            ${cp.paths.map((p, i) => arrow(posOf(p.from), p.to, p.kind === 'pass', i)).join('')}
            <g data-tok="-1"><circle cx="${toSvg(taker).X}" cy="${toSvg(taker).Y}" r="13" fill="#111" stroke="#facc15" stroke-width="3"/><text x="${toSvg(taker).X}" y="${toSvg(taker).Y + 4}" fill="#fff" font-size="11" text-anchor="middle">M</text></g>
            ${cp.slots.map((sl, i) => `<g data-tok="${i}" style="cursor:pointer"><circle cx="${toSvg(sl).X}" cy="${toSvg(sl).Y}" r="13" fill="${sl.role === 'rematador' ? '#e11d48' : sl.role === 'bloqueio' ? '#7c3aed' : sl.role === 'apoio' ? '#16a34a' : '#64748b'}" stroke="#fff" stroke-width="2"/><text x="${toSvg(sl).X}" y="${toSvg(sl).Y + 4}" fill="#fff" font-size="12" text-anchor="middle">${i + 1}</text></g>`).join('')}
          </svg>
          <div style="min-width:240px">
            <p class="small"><b>M</b> = marcador (${takerName}). ${kind === 'canto' ? 'O canto é marcado do lado direito; do outro lado a jogada é espelhada.' : 'O livre é desenhado do lado direito; do outro lado é espelhado.'}</p>
            ${cp.slots.map((sl, i) => `<div class="attr-edit"><span><b>${i + 1}</b> <select data-role="${i}">${(Object.keys(SP_ROLE_LABEL) as SpRole[]).map((r) => `<option value="${r}" ${sl.role === r ? 'selected' : ''}>${SP_ROLE_LABEL[r]}</option>`).join('')}</select></span>
              <select data-pl="${i}"><option value="">Automático</option>${out.map((p) => `<option value="${p.id}" ${sl.player === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></div>`).join('')}
            <p class="small muted">Setas brancas: movimentos. Tracejado amarelo: passes (o do marcador vai para quem acabar mais perto do fim do traço; um segundo passe pode sair de quem recebe). Mais movimentos e um bloqueio criam melhores remates; sem equilíbrio sofres mais contra-ataques.</p>
            <button class="btn" data-clear>Limpar traços</button> <button class="btn primary" data-save>Guardar jogada</button> <span class="small" data-msg></span>
          </div>
        </div>
      </div>`;
  };
  draw();
  let drag: { from: number; start: { x: number; y: number } } | null = null;
  const pt = (e: MouseEvent) => { const svg = host.querySelector('#spc') as SVGSVGElement; const r = svg.getBoundingClientRect(); return fromSvg(((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H); };
  host.onmousedown = (e) => {
    const tok = (e.target as Element).closest('[data-tok]') as HTMLElement | null;
    if (tok && tool !== 'apagar') { drag = { from: Number(tok.dataset.tok), start: pt(e) }; e.preventDefault(); }
  };
  host.onmousemove = (e) => {
    if (!drag || tool !== 'mover' || drag.from < 0) return;
    const q = pt(e); cp.slots[drag.from].x = r1(q.x); cp.slots[drag.from].y = r1(q.y); draw();
  };
  host.onmouseup = (e) => {
    if (!drag) return;
    const q = pt(e);
    if (tool === 'seta' && drag.from >= 0) { cp.paths = cp.paths.filter((p) => !(p.from === drag!.from && p.kind === 'run')); cp.paths.push({ from: drag.from, to: { x: r1(q.x), y: r1(q.y) }, kind: 'run' }); }
    if (tool === 'passe') { cp.paths = cp.paths.filter((p) => !(p.from === drag!.from && p.kind === 'pass')); cp.paths.push({ from: drag.from, to: { x: r1(q.x), y: r1(q.y) }, kind: 'pass' }); }
    drag = null; draw();
  };
  host.onclick = (e) => {
    const el = e.target as HTMLElement;
    const b = el.closest<HTMLElement>('[data-tool]');
    if (b) { tool = b.dataset.tool as Tool; draw(); return; }
    const path = (e.target as Element).closest('[data-path]') as HTMLElement | null;
    if (path && tool === 'apagar') { cp.paths.splice(Number(path.dataset.path), 1); draw(); return; }
    if (el.closest('[data-clear]')) { cp.paths = []; draw(); return; }
    if (el.closest('[data-save]')) { save(JSON.parse(JSON.stringify(cp))); host.querySelector('[data-msg]')!.textContent = 'Jogada guardada.'; }
  };
  host.onchange = (e) => {
    const el = e.target as HTMLSelectElement;
    if (el.dataset.role) cp.slots[Number(el.dataset.role)].role = el.value as SpRole;
    if (el.dataset.pl) cp.slots[Number(el.dataset.pl)].player = el.value || undefined;
    draw();
  };
}
