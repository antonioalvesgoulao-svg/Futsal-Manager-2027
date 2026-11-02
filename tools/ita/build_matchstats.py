# Itália: estatísticas por época a partir das fichas de jogo oficiais (tools/ita/collect_matches.py), para o moneyball.
# Para cada jogador do plantel: jogos (5 iniciais + quem entrou), golos, amarelos e vermelhos por época e equipa (Serie A e play-off).
# Substitui em src/data/ita/fpstats.json as épocas italianas (o resto do historial do futsalportugal mantém-se).
# Uso: python3 tools/ita/build_matchstats.py <pasta de trabalho com matches.json e players_off.json>
import json, re, sys, unicodedata, collections
W = sys.argv[1]
M = json.load(open(f'{W}/matches.json'))
# nome oficial (com patrocinador) -> nome no moneyball (TEAM_LEVELS); níveis em src/core/moneyball.ts
CANON = [('Meta Catania', 'Meta Catania'), ('Napoli Futsal', 'Napoli Futsal'), ('Prezioso Casa Napoli', 'Napoli Futsal'), ('L84', 'L84 Torino'),
         ('Feldi Eboli', 'Feldi Eboli'), ('Sandro Abate', 'Sandro Abate'), ('Came', 'Came Treviso'), ('Sala Consilina', 'Sporting Sala Consilina'),
         ('Roma 1927', 'Roma 1927'), ('Benevento', 'Benevento 5'), ('Active Network', 'Active Network'), ('Fortitudo Pomezia', 'Fortitudo Pomezia'),
         ('Giovinazzo', 'Giovinazzo C5'), ('Petrarca', 'Petrarca Padova'), ('Capurso', 'Capurso'), ('Italservice Pesaro', 'Italservice Pesaro'),
         ('Genzano', 'Ecocity Genzano'), ('Olimpus Roma', 'Olimpus Roma'), ('Real San Giuseppe', 'Real San Giuseppe'), ('Pescara', 'Futsal Pescara'),
         ('Ciampino Aniene', 'Ciampino Aniene'), ('Sporting Ciampino', 'Sporting Ciampino'), ('CMB Matera', 'CMB Matera'), ('Monastir', '360 GG Monastir'),
         ('Melilli', 'Città di Melilli'), ('Polistena', 'Futsal Polistena'), ('Pistoia', 'Nuova Comauto Pistoia'), ('Olimpia Verona', 'Olimpia Verona'),
         ('Mantova', 'Saviatesta Mantova'), ('Lido di Ostia', 'Lido di Ostia'), ('Manfredonia', 'Manfredonia C5'), ('Cosenza', 'Pirossigeno Cosenza'),
         ('CDM Futsal', 'CDM Futsal')]
canon = lambda t: next((c for k, c in CANON if k in t), t)
def toks(s):
    s = re.sub(r'\(.*?\)', ' ', s)
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
    return [x for x in re.sub(r"[^a-z ]", ' ', s).split() if len(x) > 1]
def nick(s):
    m = re.search(r'\((.*?)\)', s); return toks(m.group(1)) if m else []
# estatísticas por (nome normalizado) e época
stats = collections.defaultdict(lambda: collections.defaultdict(lambda: {'games': 0, 'goals': 0, 'yellow': 0, 'red': 0, 'team': ''}))
names = {}
for key, m in M.items():
    s = key[:7]; sy = s[2:4]
    for side in ('h', 'a'):
        T = m[side]; team = canon(T['team'])
        for p in T['players']:
            k = ' '.join(toks(p['name'])); names[k] = p['name']
            x = stats[k][(sy, team)]; x['team'] = team
            if p.get('played'): x['games'] += 1
            x['yellow'] += p['y']; x['red'] += p['r']
    # golos: apelido como aparece no resumo -> jogador cujo nome termina nesse apelido (casa ou fora)
    for g, n in m['goals'].items():
        gt = toks(g)
        if not gt: continue
        cand = [(side, p) for side in ('h', 'a') for p in m[side]['players'] if toks(p['name'])[-len(gt):] == gt]
        if len(cand) >= 1:
            side, p = cand[0]; stats[' '.join(toks(p['name']))][(sy, canon(m[side]['team']))]['goals'] += n
P = json.load(open('src/data/ita/players.json'))['players']
F = json.load(open('src/data/ita/fpstats.json'))
FP = F['players']
CL = {c['id']: c['name'] for c in json.load(open('src/data/ita/clubs.json'))['clubs']}
found = 0
for p in P:
    want = [toks(p.get('fullName') or p['name']), toks(p['name'])]
    best = None
    for k in stats:
        kt = k.split()
        sc = max(len(set(w) & set(kt)) / max(1, len(set(w))) for w in want if w)
        # tem de ter jogado pelo clube atual em 2025/26 ou 2026/27, ou coincidir no nome todo
        cur = any(t == CL[p['clubId']] for (_, t) in stats[k])
        if sc >= 0.99 or (sc >= 0.6 and cur):
            if not best or sc + cur > best[0]: best = (sc + cur, k)
    if not best: continue
    found += 1
    rows = stats[best[1]]
    seasons_it = {sy for (sy, _) in rows}
    old = FP.get(p['id'], {'games': 0, 'yellow': 0, 'red': 0, 'seasons': [], 'titles': []})
    keep = [r for r in old.get('seasons', []) if r['s'] not in seasons_it]  # épocas fora de Itália (futsalportugal)
    new = [{'s': sy, 'team': t, 'games': v['games'], 'goals': v['goals']} for (sy, t), v in rows.items() if v['games'] > 0]
    old['seasons'] = sorted(keep + new, key=lambda r: r['s'], reverse=True)
    it = [v for v in rows.values()]
    old['games'] = sum(v['games'] for v in it) + sum(r['games'] for r in keep)
    old['yellow'] = sum(v['yellow'] for v in it) + (old.get('yellow', 0) if not new else 0)
    old['red'] = sum(v['red'] for v in it) + (old.get('red', 0) if not new else 0)
    old['src'] = 'fichas de jogo divisionecalcioa5.it (Serie A e play-off 2021/22-2026/27)' + (' + futsalportugal' if keep else '')
    FP[p['id']] = old
F['_info'] += ' Épocas italianas (jogos = 5 iniciais + quem entrou, golos, cartões) das fichas de jogo oficiais da Serie A 2021/22-2025/26 (tools/ita/build_matchstats.py).'
json.dump(F, open('src/data/ita/fpstats.json', 'w'), ensure_ascii=False, indent=0)
print(len(M), 'jogos;', found, 'de', len(P), 'jogadores ligados às fichas;', len(FP), 'com historial')
