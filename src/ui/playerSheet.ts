// Folha rápida do jogador (janela por cima do ecrã): atributos, estado e estatísticas da época.
// Usada nas táticas (também durante o jogo), como no FM.
import { ATTR_GROUPS, overall } from '../core/attributes';
import { moraleHtml } from '../core/morale';
import { injuryOf } from '../core/injuries';
import type { GameState, Player } from '../core/types';

const cls = (v: number) => (v >= 16 ? 'a4' : v >= 13 ? 'a3' : v >= 10 ? 'a2' : 'a1');

export function openPlayerSheet(s: GameState, id: string, energy?: number) {
  const p = s.players.find((x) => x.id === id);
  if (!p) return;
  const st = s.pstats[p.id];
  const inj = injuryOf(s, p.id);
  const groups = Object.entries(ATTR_GROUPS).filter(([g]) => (p.position === 'GR' ? true : g !== 'guardaRedes'));
  const el = document.createElement('div');
  el.className = 'modal sheet-modal';
  el.innerHTML = `<div class="modal-box" style="width:min(820px,100%);max-height:88vh;overflow:auto">
    <div class="row"><b>${p.number ?? '-'} · ${p.name}</b><span class="small muted" style="margin-left:8px">${p.position} · ${p.age} anos · ${p.nationality}</span><span class="spacer"></span><button class="btn primary" data-close>Fechar</button></div>
    <p class="small">Nível ${overall(p.attrs, p.position).toFixed(1)} · Moral ${moraleHtml(s.morale?.[p.id] ?? 65)}${energy !== undefined ? ` · Energia ${Math.round(energy)}%` : ''}${inj ? ` · 🩹 ${inj.type}` : ''}</p>
    <p class="small">Época: ${st ? `${st.games} jogos · ${st.goals} golos · ${st.assists} assistências · nota média ${(st.ratingSum / Math.max(1, st.games)).toFixed(2).replace('.', ',')}` : 'ainda sem jogos'}</p>
    <div class="attr-grid">${groups.map(([, g]) => `<div class="attr-col"><h3>${g.label}</h3>${Object.entries(g.attrs).map(([k, label]) => { const v = p.attrs[k as keyof Player['attrs']]; return `<div class="attr"><span>${label}</span><b class="${cls(v)}">${v}</b></div>`; }).join('')}</div>`).join('')}</div>
  </div>`;
  el.addEventListener('click', (e) => { if (e.target === el || (e.target as HTMLElement).closest('[data-close]')) el.remove(); });
  document.body.append(el);
}
