// Grafismo de transmissão original do jogo: marcadores eletrónicos por competição e canais fictícios.
// Inspiração portuguesa (azulejo, calçada, verde e vermelho), desenhado de raiz.
import type { CompId } from '../core/season/types';

export interface Channel {
  id: string;
  name: string;
  bug: string; // HTML do logótipo no canto do ecrã
}

// Canais fictícios
export const CHANNELS: Channel[] = [
  {
    id: 'quinas',
    name: 'Quinas Desporto',
    bug: `<div class="ch ch-quinas"><span class="q-dots"><i></i><i></i><i></i><i></i><i></i></span><b>QUINAS</b><small>DESPORTO</small></div>`,
  },
  {
    id: 'azulejo',
    name: 'Azulejo TV',
    bug: `<div class="ch ch-azulejo"><span class="az-tile"></span><b>azulejo</b><small>tv</small></div>`,
  },
  {
    id: 'atlantico',
    name: 'Atlântico Sport',
    bug: `<div class="ch ch-atlantico"><span class="wave"></span><b>ATLÂNTICO</b><small>SPORT</small></div>`,
  },
  {
    id: 'calcada',
    name: 'Calçada 5',
    bug: `<div class="ch ch-calcada"><span class="cal"></span><b>CALÇADA</b><em>5</em></div>`,
  },
  { id: 'nenhum', name: 'Sem logótipo', bug: '' },
];

export const SCOREBOARD_NAMES: Record<Exclude<CompId, 'playoff'>, string> = {
  liga: 'Liga Placard',
  taca: 'Taça de Portugal',
  tacaLiga: 'Taça da Liga',
  supertaca: 'Supertaça',
};

// Emblema original de cada estilo de marcador (desenho abstrato, sem logótipos reais)
const EMBLEM: Record<string, string> = {
  liga: `<svg viewBox="0 0 40 40" class="emb"><circle cx="20" cy="20" r="17" fill="none" stroke="#00a651" stroke-width="4" stroke-dasharray="53 53"/><circle cx="20" cy="20" r="17" fill="none" stroke="#e30613" stroke-width="4" stroke-dasharray="53 53" stroke-dashoffset="53"/><g fill="#fff"><circle cx="20" cy="13" r="2.4"/><circle cx="14" cy="20" r="2.4"/><circle cx="20" cy="20" r="2.4"/><circle cx="26" cy="20" r="2.4"/><circle cx="20" cy="27" r="2.4"/></g></svg>`,
  taca: `<svg viewBox="0 0 40 40" class="emb"><path d="M11 8h18v6a9 9 0 0 1-18 0z" fill="#d4a017"/><path d="M8 9h4v4a3 3 0 0 1-4-1zM32 9h-4v4a3 3 0 0 0 4-1z" fill="#d4a017"/><rect x="18" y="22" width="4" height="7" fill="#d4a017"/><rect x="13" y="29" width="14" height="4" rx="1" fill="#d4a017"/></svg>`,
  tacaLiga: `<svg viewBox="0 0 40 40" class="emb"><rect x="6" y="6" width="28" height="28" rx="3" fill="#fff"/><path d="M20 8 L32 20 L20 32 L8 20 Z" fill="#1d4ed8"/><circle cx="20" cy="20" r="5" fill="#fff"/><circle cx="20" cy="20" r="2.4" fill="#1d4ed8"/></svg>`,
  supertaca: `<svg viewBox="0 0 40 40" class="emb"><path d="M20 4 L24 15 L36 15 L26 22 L30 34 L20 27 L10 34 L14 22 L4 15 L16 15 Z" fill="#d4a017"/></svg>`,
};

export interface ScoreboardData {
  style: Exclude<CompId, 'playoff'>;
  home: { short: string; color: string; score: number; fouls: number };
  away: { short: string; color: string; score: number; fouls: number };
  clock: string; // tempo decorrido na parte
  period: string; // "1.ª P", "2.ª P", "Prol."
  note?: string; // ex.: "5x4", "Desconto de tempo"
}

const foulBoxes = (n: number) =>
  `<span class="fouls">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''} ${i <= n && n >= 5 ? 'max' : ''}"></i>`).join('')}</span>`;

export function scoreboardHtml(d: ScoreboardData) {
  return `
  <div class="sb sb-${d.style}">
    <div class="sb-row">
      <div class="sb-team home"><span class="chip" style="background:${d.home.color}"></span><span class="nm">${d.home.short}</span></div>
      <div class="sb-score">${d.home.score}</div>
      <div class="sb-mid">${EMBLEM[d.style]}<span class="cn">${SCOREBOARD_NAMES[d.style]}</span></div>
      <div class="sb-score">${d.away.score}</div>
      <div class="sb-team away"><span class="nm">${d.away.short}</span><span class="chip" style="background:${d.away.color}"></span></div>
    </div>
    <div class="sb-sub">
      ${foulBoxes(d.home.fouls)}
      <span class="sb-clock">${d.clock}</span><span class="sb-period">${d.period}</span>
      ${foulBoxes(d.away.fouls)}
    </div>
    ${d.note ? `<div class="sb-note">${d.note}</div>` : ''}
  </div>`;
}

export const broadcastCss = `
.sb { display: inline-flex; flex-direction: column; min-width: 520px; font-family: 'Segoe UI', system-ui, sans-serif; filter: drop-shadow(0 4px 10px rgba(0,0,0,.45)); }
.sb-row { display: grid; grid-template-columns: 1fr 52px 132px 52px 1fr; align-items: stretch; height: 42px; }
.sb-team { display: flex; align-items: center; gap: 8px; padding: 0 12px; font-weight: 800; font-size: 17px; letter-spacing: .02em; text-transform: uppercase; color: #fff; }
.sb-team.away { justify-content: flex-end; }
.sb-team .chip { width: 6px; height: 26px; border-radius: 2px; }
.sb-score { display: grid; place-items: center; font-size: 26px; font-weight: 800; font-variant-numeric: tabular-nums; }
.sb-mid { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0; padding: 2px 4px; }
.sb-mid .emb { width: 22px; height: 22px; }
.sb-mid .cn { font-size: 9px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; line-height: 1.1; text-align: center; }
.sb-sub { display: flex; align-items: center; justify-content: center; gap: 10px; height: 26px; padding: 0 10px; }
.sb-clock { font-size: 16px; font-weight: 800; font-variant-numeric: tabular-nums; padding: 0 8px; }
.sb-period { font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 3px; }
.fouls { display: inline-flex; gap: 3px; }
.fouls i { width: 9px; height: 9px; border-radius: 2px; background: rgba(255,255,255,.25); }
.fouls i.on { background: #facc15; }
.fouls i.max { background: #ef4444; }
.sb-note { align-self: center; margin-top: 4px; font-size: 11px; font-weight: 800; padding: 2px 10px; border-radius: 3px; background: #facc15; color: #111; text-transform: uppercase; letter-spacing: .06em; }

/* Liga: ardósia com faixa de azulejo verde e vermelho */
.sb-liga .sb-row { background: #1c2229; color: #fff; border-bottom: 3px solid; border-image: linear-gradient(90deg, #00a651 50%, #e30613 50%) 1; }
.sb-liga .sb-score { background: #f5f5f0; color: #111; }
.sb-liga .sb-mid { background: repeating-conic-gradient(#0f5132 0 25%, #12633d 0 50%) 0 0 / 12px 12px; color: #fff; }
.sb-liga .sb-sub { background: #f5f5f0; color: #111; }
.sb-liga .sb-period { background: #00a651; color: #fff; }
.sb-liga .fouls i, .sb-tacaLiga .fouls i { background: rgba(0,0,0,.15); }
.sb-liga .fouls i.on, .sb-tacaLiga .fouls i.on { background: #eab308; }
.sb-liga .fouls i.max, .sb-tacaLiga .fouls i.max { background: #dc2626; }

/* Taça de Portugal: grená e dourado */
.sb-taca .sb-row { background: linear-gradient(90deg, #5b0a14, #8b1a24); color: #fff; border-bottom: 3px solid #d4a017; }
.sb-taca .sb-score { background: #fdf6e3; color: #5b0a14; }
.sb-taca .sb-mid { background: #2b0509; color: #d4a017; }
.sb-taca .sb-sub { background: #2b0509; color: #fdf6e3; }
.sb-taca .sb-period { background: #d4a017; color: #2b0509; }

/* Taça da Liga: azulejo azul e branco */
.sb-tacaLiga .sb-row { background: #0b2a6f; color: #fff; border-bottom: 3px solid #fff; }
.sb-tacaLiga .sb-score { background: #fff; color: #0b2a6f; }
.sb-tacaLiga .sb-mid { background: linear-gradient(45deg, #1d4ed8 25%, #2563eb 25% 50%, #1d4ed8 50% 75%, #2563eb 75%) 0 0 / 14px 14px; color: #fff; }
.sb-tacaLiga .sb-sub { background: #eef2ff; color: #0b2a6f; }
.sb-tacaLiga .sb-period { background: #1d4ed8; color: #fff; }

/* Supertaça: preto e dourado, padrão de calçada */
.sb-supertaca .sb-row { background: #0b0b0b; color: #fff; border-bottom: 3px solid #d4a017; }
.sb-supertaca .sb-score { background: #d4a017; color: #0b0b0b; }
.sb-supertaca .sb-mid { background: repeating-linear-gradient(45deg, #111 0 6px, #1e1e1e 6px 12px); color: #d4a017; }
.sb-supertaca .sb-sub { background: #1a1a1a; color: #f5f5f5; }
.sb-supertaca .sb-period { background: #d4a017; color: #0b0b0b; }

/* Canais fictícios */
.ch { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 4px; font-family: system-ui; color: #fff; opacity: .92; }
.ch b { font-size: 13px; letter-spacing: .06em; } .ch small { font-size: 9px; letter-spacing: .12em; opacity: .85; }
.ch-quinas { background: linear-gradient(90deg, #046a38 0 50%, #da291c 50%); }
.ch-quinas .q-dots { display: grid; grid-template-columns: repeat(3, 4px); gap: 1px; }
.ch-quinas .q-dots i { width: 4px; height: 4px; background: #fff; border-radius: 1px; }
.ch-quinas .q-dots i:nth-child(1) { grid-column: 2; } .ch-quinas .q-dots i:nth-child(5) { grid-column: 2; }
.ch-azulejo { background: #fff; color: #1d4ed8; border: 2px solid #1d4ed8; }
.ch-azulejo .az-tile { width: 14px; height: 14px; background: conic-gradient(#1d4ed8 0 25%, #fff 0 50%, #1d4ed8 0 75%, #fff 0); border: 1px solid #1d4ed8; }
.ch-azulejo b { font-family: Georgia, serif; font-style: italic; letter-spacing: 0; }
.ch-atlantico { background: linear-gradient(135deg, #0c4a6e, #0e7490); }
.ch-atlantico .wave { width: 16px; height: 10px; border-radius: 0 0 10px 10px; border: 2px solid #67e8f9; border-top: 0; }
.ch-calcada { background: #111; border: 1px solid #555; }
.ch-calcada .cal { width: 14px; height: 14px; background: repeating-linear-gradient(90deg, #fff 0 3px, #111 3px 6px), #fff; transform: skewX(-15deg); }
.ch-calcada em { font-style: normal; font-weight: 900; font-size: 15px; color: #facc15; }
`;
