const fs = require('fs'); const D = process.argv[2];
const CL = { 'Sporting CP': 'scp', 'SL Benfica': 'slb', 'SC Braga': 'scb', 'AD Fundão': 'fun', 'Leões de Porto Salvo': 'lps' };
const ROLE = (f) => /principal$/i.test(f) && /^Treinador principal/.test(f) ? 'principal' : /adjunto/i.test(f) ? 'adjunto' : /guarda-redes/i.test(f) ? 'gr' : /Preparador|Fisiolog/i.test(f) ? 'fisico' : /Fisioterap|Médico/i.test(f) ? 'fisio' : /Analista/i.test(f) ? 'analista' : /Scout/i.test(f) ? 'scout' : /Psic/i.test(f) ? 'psicologo' : /Nutri/i.test(f) ? 'nutricionista' : /Coordenador/i.test(f) ? 'coordenador' : 'outro';
const p1 = fs.readFileSync(D + '/p1.txt', 'utf8').trim().split('\n').map((l) => l.split('|').map((x) => x.trim()));
const p2 = fs.readFileSync(D + '/p2.txt', 'utf8').trim().split('\n').map((l) => l.split('|').map((x) => x.trim()));
const TOP = /^(Sporting|Benfica|SC Braga)( |$|\/)/;
const tpts = (t) => t === '-' ? 0 : t.split(',').reduce((a, x) => a + (/Campeões/.test(x) ? 4 : /^ ?I Divisão Futsal/.test(x) ? 3 : /Taça de Portugal/.test(x) ? 1.5 : /Taça da Liga/.test(x) ? 1 : /Supertaça|Supercopa/.test(x) ? 0.6 : /Liga Nacional|Taça Brasil/.test(x) ? 2 : /Juniores|Sub-1|regionais|AF |Catarinense|Paranaense|Recopa|III Divisão/.test(x) ? 0.25 : 0.5), 0);
const years = (ep) => { const m = ep.match(/(\d{4})(?:\/\d{2})?-(\d{4})/); return m ? +m[2] - +m[1] + 1 : 1; };
const people = []; const seen = new Set();
for (const [club, name, func, nat, birth] of p1) {
  const id = CL[club] + '-' + name.normalize('NFD').replace(/[^\w]/g, '').toLowerCase() + '-' + ROLE(func);
  if (seen.has(id)) continue; seen.add(id);
  const hist = p2.filter((h) => h[0] === name).map(([, ep, c, f, g, w, d, l, t]) => ({ ep, club: c, func: f, g, w, d, l, titles: t }));
  let yrs = 0, top = 0, tp = 0, G = 0, W = 0, D2 = 0, principal = 0;
  for (const h of hist) {
    const y = years(h.ep); const youth = /Jun\.|S1\d|S20|S23|formação|Feminino|jovens/.test(h.club);
    yrs += y * (youth ? 0.5 : 1); if (!youth && TOP.test(h.club)) top += y;
    tp += tpts(h.titles);
    if (/Treinador principal/.test(h.func) && !youth && /^\d+$/.test(h.g) && /^\d+$/.test(h.d)) { G += +h.g; W += +h.w; D2 += +h.d; principal += y; }
  }
  const role = ROLE(func);
  let ability = 6 + Math.min(6, yrs * 0.4) + Math.min(5, top * 0.45) + Math.min(3, tp * 0.12);
  const o = { id, club: CL[club], name, func, role, nat, birth, history: hist };
  if (role === 'principal') {
    const wr = G ? (W + D2 * 0.5) / G : 0.5;
    o.coach = { tactical: Math.round(Math.min(20, 6 + wr * 9 + Math.min(4, tp * 0.08) + Math.min(2, principal * 0.12))), motivation: Math.round(Math.min(20, 8 + wr * 7 + Math.min(3, tp * 0.06))), record: { G, W, D: D2, titlesPts: tp } };
  }
  o.ability = Math.round(Math.min(20, ability));
  people.push(o);
}
fs.writeFileSync('src/data/por/staff.json', JSON.stringify({ _info: 'Equipas técnicas reais 2026/27 (zerozero, recolha do António com Claude in Chrome, 2/11/2026). ability/coach calculados a partir do historial (estimativa). Clubes em falta: fzz, ele, rav, uvn, por, fam, tor.', people }, null, 1));
for (const p of people) console.log(p.club, p.name, p.role, p.ability, p.coach ? JSON.stringify(p.coach) : '');
