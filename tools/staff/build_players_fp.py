# Estatísticas oficiais (futsalportugal.com / FPF) dos 212 jogadores: cartões e jogos/golos por época (seniores).
# Gera src/data/por/fpstats.json, usado para a agressividade (cartões por jogo) e para completar o historial em falta.
import json, unicodedata, re
FP = json.load(open('tools/staff/fp_people.json')); TEAMS = json.load(open('tools/staff/fp_teams.json'))
PL = json.load(open('src/data/por/players.json')); PL = PL.get('players', PL)
HIST = json.load(open('src/data/por/history.json'))['players']
TEAM2CLUB = {'Sporting CP': 'scp', 'SL Benfica': 'slb', 'SC Braga': 'scb', 'AD Fundão': 'fun', 'Leões de Porto Salvo': 'lps', 'SC Ferreira do Zêzere/Zêzerovo': 'fzz', 'Eléctrico FC': 'ele', 'Rio Ave FC': 'rav', 'UP Venda Nova': 'uvn', 'Portimonense SC': 'por', 'FC Famalicão': 'fam', 'SCU Torreense': 'tor'}
norm = lambda n: re.sub(r'[^a-z ]', '', unicodedata.normalize('NFD', n).encode('ascii', 'ignore').decode().lower()).split()
out = {}; unmatched = []
for t in TEAMS.values():
    club = TEAM2CLUB[t['name']]
    ours = [p for p in PL if p['clubId'] == club]
    for fp in t['players']:
        nm = fp['name']; nick = re.findall(r'"([^"]+)"', nm)
        cands = [norm(nick[0])] if nick else []
        cands.append(norm(re.sub(r'"[^"]*"', '', nm)))
        import difflib
        age = None
        if fp.get('dob'): age = 2026 - int(fp['dob'][:4]) - (1 if fp['dob'][5:] > '07-01' else 0)
        def score(p):
            a, b = norm(p['name']), cands[-1]
            best = 0
            for c in cands:
                if not c or not a: continue
                s = difflib.SequenceMatcher(None, ' '.join(a), ' '.join(c)).ratio()
                if set(a) <= set(c) or set(c) <= set(a): s = max(s, 0.9)
                if a[0] == c[0]: s += 0.1
                if any(x.startswith(y) or y.startswith(x) for x in a for y in c if len(x) > 3 and len(y) > 3): s += 0.1
                best = max(best, s)
            if age is not None and abs(p['age'] - age) > 1: best -= 0.5
            return best
        free = [p for p in ours if p['id'] not in out]
        m = max(free, key=score, default=None)
        if m and score(m) < 0.75: m = None
        if not m: unmatched.append(f"{club}: {nm}"); continue
        per = FP.get(str(fp['person_id']))
        if not per: continue
        rows = [r for r in per['rows'] if r['esc'] == '1' and r['team'] != 'Portugal' and not re.search(r'Sele|National', r['team'])]
        recent = [r for r in rows if r['season'] >= '2021/2022']
        g = sum(r['games'] for r in recent); y = sum(r['yellow'] for r in recent); rd = sum(r['red'] for r in recent)
        seasons = {}
        for r in rows:
            s = r['season'][2:4]
            if s < '21': continue
            k = (s, r['team']); x = seasons.setdefault(k, {'s': s, 'team': r['team'], 'games': 0, 'goals': 0})
            x['games'] += r['games']; x['goals'] += r['goals']
        out[m['id']] = {'fpId': fp['person_id'], 'games': g, 'yellow': y, 'red': rd, 'seasons': sorted(seasons.values(), key=lambda x: x['s'], reverse=True), 'titles': [f"{x['name']} ({', '.join(x['seasons'])})" for x in per['titles']]}
json.dump({'_info': 'Estatísticas oficiais (futsalportugal.com, dados FPF) dos jogadores, seniores, desde 2021/22: jogos, amarelos, vermelhos; jogos e golos por época; títulos. Recolha 1/11/2026.', 'players': out}, open('src/data/por/fpstats.json', 'w'), ensure_ascii=False, indent=0)
print('ligados', len(out), 'de', len(PL)); print('não ligados (estão no site mas não no jogo):', len(unmatched)); print('\n'.join(unmatched))
miss = [p['clubId'] + ': ' + p['name'] for p in PL if p['id'] not in out]; print('do jogo sem dados no site:', miss)
print('sem historial zerozero mas com dados FP:', sum(1 for k in out if not HIST.get(k)))
