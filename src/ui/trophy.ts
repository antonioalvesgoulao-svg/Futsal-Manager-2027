// Festa do título: troféu levantado, confetes nas cores do clube e o plantel campeão (por cima do ecrã)
import { COMP_NAMES, type CompId } from '../core/season/types';
import type { GameState } from '../core/types';
import { crestSvg } from './crest';

const CUP = `<svg viewBox="0 0 120 150" width="150" height="190" class="cup"><defs><linearGradient id="gd" x1="0" x2="1"><stop offset="0" stop-color="#b8860b"/><stop offset=".45" stop-color="#ffe08a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs>
<path d="M30 12h60v28a30 30 0 0 1-60 0z" fill="url(#gd)"/><path d="M30 18H14a14 16 0 0 0 18 22M90 18h16a14 16 0 0 1-18 22" fill="none" stroke="url(#gd)" stroke-width="6"/>
<rect x="54" y="68" width="12" height="30" fill="url(#gd)"/><path d="M38 98h44l6 18H32z" fill="url(#gd)"/><rect x="28" y="116" width="64" height="16" rx="3" fill="#3b2a12"/></svg>`;

export function showTrophy(s: GameState, comp: CompId, onClose?: () => void) {
  const club = s.clubs.find((c) => c.id === s.clubId)!;
  const squad = s.players.filter((p) => p.clubId === s.clubId).sort((a, b) => (a.number ?? 99) - (b.number ?? 99));
  const el = document.createElement('div');
  el.className = 'trophy-ov';
  const conf = Array.from({ length: 90 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${club.colors[i % 2]};animation-delay:${(i % 15) * 0.18}s;animation-duration:${2.6 + (i % 7) * 0.35}s"></i>`).join('');
  el.innerHTML = `<div class="confetti">${conf}</div>
    <div class="trophy-box">
      <div class="small muted">${s.season.label}</div>
      <h1>Campeões!</h1>
      <div class="trophy-row">${crestSvg(club.id, 90)}${CUP}${crestSvg(club.id, 90)}</div>
      <h2>${club.name} vence ${COMP_NAMES[comp].replace(' (play-off)', '').replace(' (fase final)', '')}</h2>
      <p class="small">${squad.map((p) => p.name).join(' · ')}<br>Treinador: <b>${s.manager.name}</b></p>
      <button class="btn primary" data-close>Continuar ▸</button>
    </div>`;
  el.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('[data-close]')) { el.remove(); onClose?.(); } });
  document.body.append(el);
}
