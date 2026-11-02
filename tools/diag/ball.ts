// Sincronização jogador–bola (auditoria 2026): em N jogos, mede saltos da bola (teletransporte), mudanças de posse
// sem contacto (novo dono longe da bola no instante em que fica com ela), bola longe do pé de quem a conduz e passes
// que atravessam o corpo de um adversário. Uso: ... ball.ts && node diagnostics/.ball.mjs [--jogos 12]
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo, type StartState } from '../../src/core/visual/choreo';
const ai = process.argv.indexOf('--jogos');
const G = ai > 0 ? Number(process.argv[ai + 1]) : 12;
const PAIRS = [['slb', 'scp'], ['scb', 'fun'], ['bar', 'epz'], ['int', 'jae'], ['lps', 'tor'], ['pal', 'jca']];
const s = newGame('T', 'PT', 'slb'); s.clubId = '__x__';
const d = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);
const N: Record<string, number> = {}; const add = (k: string) => (N[k] = (N[k] ?? 0) + 1);
const worst: Record<string, string> = {};
let frames = 0, poss = 0;
for (let g = 0; g < G; g++) {
  const [h, a] = PAIRS[g % PAIRS.length];
  const hs = setupFor(s, h), as = setupFor(s, a);
  const pl = Object.fromEntries([...hs.squad, ...as.squad].map((p) => [p.id, p]));
  const m = createMatch(hs, as, { seed: `bola${g}` }); let st: StartState | null = null; let pi = 0;
  while (m.step()) {
    const sn = m.snapshot(); if (!sn.possession) { st = null; continue; }
    const c: any = new Choreo(sn.possession, [hs.tactics, as.tactics], sn.period, st, m.names, pl); st = c.end; poss++; pi++;
    let pb: any = null, ph: string | null = null;
    for (let t = 0; t <= c.duration + c.extra; t += 1 / 30) {
      const f = c.at(c.lead + t); frames++;
      const b = f.ball;
      if (pb) {
        const v = Math.hypot(b.x - pb.x, b.y - pb.y) * 30;
        if (v > 40) { add('bolaTeletransporte'); worst.tele ??= `${h}-${a} posse ${pi} t=${t.toFixed(2)} v=${v.toFixed(0)}`; }
      }
      if (f.holder && f.holder !== ph && f.pos[f.holder]) {
        add('mudancasDePosse');
        if (d(f.pos[f.holder], b) > 1.2) { add('posseSemContacto'); worst.contacto ??= `${h}-${a} posse ${pi} t=${t.toFixed(2)} ${d(f.pos[f.holder], b).toFixed(1)} m`; }
      }
      if (f.holder && f.pos[f.holder] && !f.stoppage && b.z < 0.5) { add('framesConducao'); if (d(f.pos[f.holder], b) > 0.9) add('bolaLongeDoPe'); }
      pb = b; ph = f.holder;
    }
    for (const x of c.balls) if (x.k === 'pass') { const A = c.tr.get(x.from)?.at(x.t0), B = c.tr.get(x.to)?.at(x.t1); if (A && B) { const v = d(A, B) / Math.max(0.01, x.t1 - x.t0); add('passes'); if (v > 22) add('passesRapidos'); } }
  }
}
const r = (k: string, base: string) => `${N[k] ?? 0} (${(((N[k] ?? 0) / Math.max(1, N[base] ?? 1)) * 100).toFixed(2)}%)`;
console.log(JSON.stringify({ jogos: G, posses: poss, bolaTeletransporte: N.bolaTeletransporte ?? 0, mudancasDePosse: N.mudancasDePosse, posseSemContacto: r('posseSemContacto', 'mudancasDePosse'), passesAcima22ms: r('passesRapidos', 'passes'), bolaLongeDoPeAConduzir: r('bolaLongeDoPe', 'framesConducao'), exemplos: worst }, null, 1));
