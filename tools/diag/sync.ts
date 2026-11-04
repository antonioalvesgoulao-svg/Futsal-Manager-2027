// Sincronização motor ↔ coreografia (2D/3D): cada golo do motor tem de aparecer na coreografia (remate com golo, mesmo
// marcador), cada canto tem de vir de uma bola que saiu pela linha de fundo, cada penálti de uma falta dentro da área.
// Uso: npx esbuild tools/diag/sync.ts --bundle --platform=node --format=esm --outfile=diagnostics/.sync.mjs && node diagnostics/.sync.mjs [--jogos 20]
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo, type StartState } from '../../src/core/visual/choreo';
const arg = (k: string, d: string) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const N = Number(arg('jogos', '20'));
const PAIRS = [['slb', 'scp'], ['bar', 'epz'], ['nap', 'cat'], ['scb', 'fun'], ['jca', 'pal'], ['l84', 'ebo'], ['rav', 'uvn'], ['int', 'jae']];
const s = newGame('Sync', 'Portugal', 'slb');
const R = { golos: 0, golosVistos: 0, marcadorCerto: 0, semGolo: [] as string[], cantos: 0, cantosLinha: 0, cantosMal: [] as string[], pen: 0, penArea: 0, penMal: [] as string[], gkNoReact: 0, gkGoals: 0, earlyDive: 0, saves: 0, diveLead: [] as number[], goalGap: [] as number[], shieldMates: [] as number[], shieldN: 0 };
for (let g = 0; g < N; g++) {
  const [h, a] = PAIRS[g % PAIRS.length];
  const hs = setupFor(s, h), as = setupFor(s, a);
  const m = createMatch(hs, as, { seed: `sync-${g}` });
  let start: StartState | null = null;
  while (m.step()) {
    const sn = m.snapshot();
    if (!sn.possession) { start = null; continue; }
    const p = sn.possession;
    const c = new Choreo(p, [hs.tactics, as.tactics], sn.period, start, m.names);
    start = c.end;
    const goals = p.events.filter((e) => e.type === 'golo');
    for (const ge of goals) {
      R.golos++;
      if (c.goalShotCt != null) R.golosVistos++; else R.semGolo.push(`${h}-${a} ${ge.text} | ações: ${p.actions.map((x) => `${x.type}/${x.kind ?? ''}/${x.result ?? ''}`).join(', ')}`);
      // marcador: quem tem o gesto de remate no instante do golo
      if (c.goalShotCt != null) { const f = c.at(c.goalShotCt + 0.05); const sh = Object.entries(f.acts).find(([, k]) => k.kind === 'shoot')?.[0]; if (sh === ge.playerId) R.marcadorCerto++; else R.semGolo.push(`MARCADOR ${h}-${a} motor=${m.names[ge.playerId!]} 3D=${sh ? m.names[sh] : 'ninguém'} | ${p.actions.map((x) => `${x.type}/${x.kind ?? ''}/${x.result ?? ''}/${x.shooter ? m.names[x.shooter] : ''}`).join(', ')}`); }
    }
    // GR: nos golos, distância da bola (ao passar a linha) ao corpo do GR; nas defesas com gesto, antecedência do início do
    // gesto face à chegada da bola (s)
    {
      const dir = c.attackDirection;
      let prevDive: Record<string, number> = {};
      for (let t = 0; t < c.total; t += 0.05) {
        const f = c.at(t);
        for (const [id, ak] of Object.entries(f.acts)) if (['dive', 'splits', 'footsave', 'spread'].includes(ak.kind) && prevDive[id] == null) prevDive[id] = t;
        for (const id of Object.keys(prevDive)) if (!f.acts[id] || !['dive', 'splits', 'footsave', 'spread'].includes(f.acts[id].kind)) {
          // gesto acabou: quando a bola esteve mais perto do GR durante o gesto
          let best = 1e9, bt = prevDive[id];
          for (let u = prevDive[id]; u <= t; u += 0.02) { const q = c.at(u); const pp = q.pos[id]; if (!pp) continue; const dd = Math.hypot(q.ball.x - pp.x, q.ball.y - pp.y); if (dd < best) { best = dd; bt = u; } }
          R.diveLead.push(bt - prevDive[id]); delete prevDive[id];
        }
      }
      if (c.goalShotCt != null) {
        for (let t = c.goalShotCt; t < c.goalShotCt + 1.6; t += 0.02) {
          const f = c.at(t);
          if (Math.abs(f.ball.x) >= 19.95 && Math.sign(f.ball.x) === dir) {
            const gks = [p.onCourt[0][0], p.onCourt[1][0]].filter((x): x is string => !!x && !!f.pos[x]);
            const gk = gks.find((x) => Math.sign(f.pos[x].x) === dir);
            if (gk) R.goalGap.push(Math.abs(f.ball.y - f.pos[gk].y));
            break;
          }
        }
      }
      // pivô a proteger a bola (gesto 'shield' de quem tem a bola ≥0,6 s): velocidade média dos colegas sem bola
      const atk = (p.flying[p.side] ? p.onCourt[p.side] : p.onCourt[p.side].slice(1)).filter((x): x is string => !!x);
      let run = 0;
      for (let t = 0; t < c.total; t += 0.2) {
        const f = c.at(t); const h0 = f.holder;
        if (h0 && atk.includes(h0) && f.acts[h0]?.kind === 'shield') run += 0.2; else run = 0;
        if (run >= 0.6) { const g0 = c.at(t - 0.2); const sp = atk.filter((x) => x !== h0 && f.pos[x] && g0.pos[x]).map((x) => Math.hypot(f.pos[x].x - g0.pos[x].x, f.pos[x].y - g0.pos[x].y) / 0.2); if (sp.length) { R.shieldMates.push(sp.reduce((a1, b1) => a1 + b1, 0) / sp.length); R.shieldN++; } }
      }
    }
    // cantos: a bola tem de estar fora da linha de fundo (|x| > 20) antes de o marcador a apanhar
    p.actions.forEach((ac, i) => {
      if (ac.type !== 'corner') return;
      R.cantos++;
      const dir = c.attackDirection;
      let out = false;
      for (let t = 0; t < c.total; t += 0.1) { const b = c.at(t).ball; if (Math.abs(b.x) > 20.05 && Math.sign(b.x) === dir) { out = true; break; } }
      if (out) R.cantosLinha++; else R.cantosMal.push(`${h}-${a} antes: ${p.actions.slice(Math.max(0, i - 1), i).map((x) => `${x.type}/${x.result ?? ''}`).join(',')}`);
    });
    // penáltis: posição de quem sofre a falta no instante da queda, dentro da área (≤6 m da linha de fundo, ~|y|≤8 no arco)
    for (const ac of p.actions) if (ac.type === 'foul' && ac.kind === 'penalty') {
      R.pen++;
      const dir = c.attackDirection;
      let tf = -1;
      for (let t = 0; t < c.total; t += 0.05) { if (c.at(t).acts[ac.shooter!]?.kind === 'fall') { tf = t; break; } }
      if (tf < 0) { R.penMal.push(`${h}-${a} sem queda: vítima ${m.names[ac.shooter!]} em campo=${p.onCourt[p.side].includes(ac.shooter!)} 1.ª ação=${p.actions[0].type}/${p.actions[0].kind} quedas=${[...new Set(Array.from({ length: 200 }, (_, k) => Object.entries(c.at(k * c.total / 200).acts).filter(([, x]) => x.kind === 'fall').map(([id]) => m.names[id])).flat())].join('/')}`); continue; }
      const q = c.at(tf).pos[ac.shooter!];
      const dGoal = Math.hypot(dir * 20 - q.x, q.y);
      if (Math.abs(dir * 20 - q.x) <= 6.2 && dGoal <= 7.6) R.penArea++; else R.penMal.push(`${h}-${a} falta a ${Math.abs(dir * 20 - q.x).toFixed(1)} m da linha`);
    }
  }
}
const pct = (a: number, b: number) => (b ? Math.round((1000 * a) / b) / 10 : null);
console.log(JSON.stringify({ jogos: N, golos: R.golos, 'golos com remate visível (%)': pct(R.golosVistos, R.golos), 'marcador certo (%)': pct(R.marcadorCerto, R.golosVistos), cantos: R.cantos, 'cantos com a bola fora pela linha de fundo (%)': pct(R.cantosLinha, R.cantos), penaltis: R.pen, 'penáltis com a falta dentro da área (%)': pct(R.penArea, R.pen), 'GR: bola a entrar a <0,5 m do corpo do GR nos golos (%)': pct(R.goalGap.filter((x) => x < 0.5).length, R.goalGap.length), 'GR: gestos de defesa que começam >0,6 s antes da bola (%)': pct(R.diveLead.filter((x) => x > 0.6).length, R.diveLead.length), 'GR: antecedência média do gesto (s)': R.diveLead.length ? Math.round((R.diveLead.reduce((a1, b1) => a1 + b1, 0) / R.diveLead.length) * 100) / 100 : null, 'pivô a proteger: velocidade média dos colegas (m/s)': R.shieldMates.length ? Math.round((R.shieldMates.reduce((a1, b1) => a1 + b1, 0) / R.shieldMates.length) * 100) / 100 : null, 'pivô a proteger: instantes com colegas quase parados <0,8 m/s (%)': pct(R.shieldMates.filter((x) => x < 0.8).length, R.shieldMates.length), exemplosGolo: R.semGolo.slice(0, 6), exemplosCanto: R.cantosMal.slice(0, 5), exemplosPen: R.penMal.slice(0, 5) }, null, 1));
