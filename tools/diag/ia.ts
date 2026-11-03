// Testes da IA tática (pedido do António, 3/11): mede, nos jogos simulados com a coreografia que se vê no 2D/3D,
// as situações concretas que estavam mal: 1x0 (rematar ou passar), reação às transições, ocupação do espaço,
// acompanhamento de desmarcações e de atacantes perigosos, remates sem oposição (tipo golo do Kutchy), inferioridade.
// Uso: npx esbuild tools/diag/ia.ts --bundle --platform=node --format=esm --outfile=diagnostics/.ia.mjs && node diagnostics/.ia.mjs [--jogos 16] [--nome x]
import { writeFileSync } from 'node:fs';
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch, type Possession } from '../../src/core/engine/match';
import { Choreo, type StartState, type P2, type Frame } from '../../src/core/visual/choreo';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const nGames = Number(arg('jogos', '16'));
const name = arg('nome', 'ia');
const PAIRS: [string, string][] = [['slb', 'scp'], ['scb', 'fun'], ['lps', 'tor'], ['rav', 'uvn'], ['bar', 'epz'], ['jca', 'pal'], ['int', 'jae'], ['val', 'man'], ['nap', 'cat'], ['l84', 'ebo'], ['ave', 'cpr'], ['por', 'fam'], ['ele', 'fzz'], ['zar', 'pen'], ['rom', 'ben'], ['tre', 'gio']];
const d2 = (a: P2, b: P2) => Math.hypot(a.x - b.x, a.y - b.y);
const mean = (a: number[]) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 100) / 100 : null);
const pct = (a: number, b: number) => (b ? Math.round((1000 * a) / b) / 10 : null);
const sides = (p: Possession) => {
  const out = (sd: 0 | 1) => (p.flying[sd] ? p.onCourt[sd].filter((x): x is string => !!x) : p.onCourt[sd].slice(1).filter((x): x is string => !!x));
  return { att: out(p.side), def: out((1 - p.side) as 0 | 1) };
};
const R = {
  // 1. decisão no contra-ataque (motor)
  cont: { n: 0, solo1: 0, n1: 0, pass2x0: 0, n2x0: 0, pass2x1: 0, n2x1: 0, passBoa: 0, nBoa: 0, passMa: 0, nMa: 0, golos: 0 },
  // 2-4, 12. transições: distância do defensor mais próximo a quem conduz no último 1,5 s antes do remate; defensores parados
  transNear: [] as number[], transWithin3: 0, transN: 0, transStill: 0, transStillN: 0,
  // 5. ataque organizado: pares de colegas a <2,5 m e largura
  attPairs: [] as number[], width: [] as number[], defPairs: [] as number[],
  // 6-8, 10. atacantes na zona de finalização sem ninguém a <2,5 m; desmarcações (a >3 m/s) e distância do defensor
  dangerFree: 0, dangerN: 0, runnerGap: [] as number[],
  // 11. remates de jogo corrido (não contra-ataque): defensor mais próximo do rematador no instante do remate
  shotGap: [] as number[], shotFree3: 0, shotN: 0,
  // 9. inferioridade numérica (menos defensores de campo do que atacantes): atacantes livres na zona de finalização
  infFree: 0, infN: 0,
};
const s = newGame('Testes IA', 'Portugal', 'slb');
for (let g = 0; g < nGames; g++) {
  const [h, a] = PAIRS[g % PAIRS.length];
  const hs = setupFor(s, h), as = setupFor(s, a);
  const attrs = new Map([...hs.squad, ...as.squad].map((p) => [p.id, p.attrs]));
  const m = createMatch(hs, as, { seed: `ia-${g}` });
  let start: StartState | null = null;
  while (m.step()) {
    const sn = m.snapshot();
    if (!sn.possession) { start = null; continue; }
    const p = sn.possession;
    const c = new Choreo(p, [hs.tactics, as.tactics], sn.period, start, m.names);
    start = c.end;
    for (const ac of p.actions) if (ac.type === 'shot' && ac.counterNum) {
      const [na, nd] = ac.counterNum; R.cont.n++; if (ac.result === 'goal') R.cont.golos++;
      const passed = !!ac.assist;
      const carrier = ac.assist ?? ac.shooter!;
      if (na === 1) { R.cont.n1++; if (!passed) R.cont.solo1++; }
      if (na === 2 && nd === 0) { R.cont.n2x0++; if (passed) R.cont.pass2x0++; }
      if (na === 2 && nd === 1) { R.cont.n2x1++; if (passed) R.cont.pass2x1++; }
      if (na >= 2 && nd < na) { const dec = attrs.get(carrier)?.decisoes ?? 10; if (dec >= 13) { R.cont.nBoa++; if (passed) R.cont.passBoa++; } if (dec <= 9) { R.cont.nMa++; if (passed) R.cont.passMa++; } }
    }
    const { att, def } = sides(p);
    const dir = c.attackDirection, U = (q: P2) => dir * q.x + 20;
    const frames: { t: number; f: Frame }[] = [];
    for (let t = 0; t <= c.duration + 1e-6; t += 0.2) frames.push({ t, f: c.at(c.lead + t) });
    const live = frames.filter((x) => !x.f.stoppage);
    const isCounter = p.counter || p.actions.some((x) => x.type === 'shot' && x.kind === 'counter');
    const shotT = live.find((x) => Object.entries(x.f.acts).some(([id, ak]) => ak.kind === 'shoot' && att.includes(id)))?.t;
    for (let i = 0; i < live.length; i++) {
      const { t, f } = live[i];
      const P = (id: string) => f.pos[id];
      const A = att.filter((id) => P(id)), D = def.filter((id) => P(id));
      if (!A.length || !D.length) continue;
      const near = (q: P2) => Math.min(...D.map((x) => d2(q, P(x))));
      if (isCounter && shotT != null && t >= shotT - 1.5 && t <= shotT) {
        const hd = f.holder && A.includes(f.holder) ? f.holder : null;
        if (hd) { const dn = near(P(hd)); R.transNear.push(dn); R.transN++; if (dn < 3) R.transWithin3++; }
      }
      if (isCounter && i > 0) for (const x of D) { R.transStillN++; if (d2(P(x), live[i - 1].f.pos[x] ?? P(x)) / 0.2 < 0.8) R.transStill++; }
      if (!isCounter) {
        let pa = 0; for (let x = 0; x < A.length; x++) for (let y = x + 1; y < A.length; y++) if (d2(P(A[x]), P(A[y])) < 2.5) pa++;
        R.attPairs.push(pa);
        let pd = 0; for (let x = 0; x < D.length; x++) for (let y = x + 1; y < D.length; y++) if (d2(P(D[x]), P(D[y])) < 2) pd++;
        R.defPairs.push(pd);
        const ys = A.map((id) => P(id).y); R.width.push(Math.max(...ys) - Math.min(...ys));
        for (const id of A) {
          if (id === f.holder) continue;
          const q = P(id), u = U(q);
          if (u > 30 && Math.abs(q.y) < 7) {
            const free = near(q) > 2.5;
            if (D.length < A.length) { R.infN++; if (free) R.infFree++; } else { R.dangerN++; if (free) R.dangerFree++; }
          }
          if (i > 0 && u > 24) { const pv = live[i - 1].f.pos[id]; if (pv && d2(q, pv) / 0.2 > 3) R.runnerGap.push(near(q)); }
        }
        if (shotT != null && Math.abs(t - shotT) < 0.11) {
          const sh = Object.entries(f.acts).find(([id, ak]) => ak.kind === 'shoot' && A.includes(id))?.[0];
          if (sh) { const dn = near(P(sh)); R.shotGap.push(dn); R.shotN++; if (dn > 3) R.shotFree3++; }
        }
      }
    }
  }
}
const C = R.cont;
const out = {
  jogos: nGames,
  '1. 1x0: remata sozinho (%)': pct(C.solo1, C.n1), 'contra-ataques analisados': C.n,
  '1. 2x0: passa (%)': pct(C.pass2x0, C.n2x0), '1. 2x1: passa (%)': pct(C.pass2x1, C.n2x1),
  '1. superioridade, decisões ≥13: passa (%)': pct(C.passBoa, C.nBoa), '1. superioridade, decisões ≤9: passa (%)': pct(C.passMa, C.nMa),
  '1. golos por contra-ataque (%)': pct(C.golos, C.n),
  '2/3/4/12. transição: defensor mais próximo de quem conduz no último 1,5 s (m)': mean(R.transNear),
  '2/3/4/12. transição: instantes com defensor a <3 m de quem conduz (%)': pct(R.transWithin3, R.transN),
  '2/3/4/12. transição: defensores parados (<0,8 m/s) (%)': pct(R.transStill, R.transStillN),
  '5. ataque: pares de colegas a <2,5 m por instante': mean(R.attPairs), '5. ataque: largura (m)': mean(R.width),
  '3. defesa: pares de defensores a <2 m por instante': mean(R.defPairs),
  '6/7/8/10. atacante sem bola na zona de finalização sem defensor a <2,5 m (%)': pct(R.dangerFree, R.dangerN),
  '6/7. desmarcações (>3 m/s): distância ao defensor mais próximo (m)': mean(R.runnerGap),
  '11. remates em ataque organizado: defensor mais próximo do rematador (m)': mean(R.shotGap),
  '11. remates em ataque organizado sem defensor a <3 m (%)': pct(R.shotFree3, R.shotN),
  '9. inferioridade: atacantes livres na zona de finalização (%)': pct(R.infFree, R.infN),
};
writeFileSync(`diagnostics/ia-${name}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
