# Junta as equipas técnicas do futsalportugal.com (12 clubes, jogos/vitórias por competição, títulos)
# com o historial do zerozero (5 clubes, com J/V/E/D por época) e gera src/data/por/staff.json.
# Capacidades são estimativas calculadas destes dados.
import json, unicodedata, re
FP = json.load(open('tools/staff/fp_people.json')); TEAMS = json.load(open('tools/staff/fp_teams.json'))
ZZ = {p['id']: p for p in json.load(open('src/data/por/staff.json'))['people'] if not p.get('src') == 'fp'}
TEAM2CLUB = {'Sporting CP': 'scp', 'SL Benfica': 'slb', 'SC Braga': 'scb', 'AD Fundão': 'fun', 'Leões de Porto Salvo': 'lps', 'SC Ferreira do Zêzere/Zêzerovo': 'fzz', 'Eléctrico FC': 'ele', 'Rio Ave FC': 'rav', 'UP Venda Nova': 'uvn', 'Portimonense SC': 'por', 'FC Famalicão': 'fam', 'SCU Torreense': 'tor'}
ROLE = {'Treinador': 'principal', 'Adjunto': 'adjunto', 'Treinador Guarda Redes': 'gr', 'Preparador Físico': 'fisico', 'Técnico': 'analista', 'Diretor': 'coordenador'}
FUNC = {'principal': 'Treinador principal', 'adjunto': 'Treinador-adjunto', 'gr': 'Treinador guarda-redes', 'fisico': 'Preparador físico', 'analista': 'Analista', 'coordenador': 'Diretor'}
TOPMC = {'26': 1, '57': 1.3, '45': 1, '43': 1, '40': 1, '30': 1, '1': 0.55, '3': 0.35}  # peso de cada competição
TITLE_W = lambda n: 4 if 'Champions' in n or 'Campeões' in n else 3 if 'Liga Placard' in n or 'Campeonato Nacional' == n else 1.5 if 'Taça de Portugal' in n else 1 if 'Taça da Liga' in n else 0.6 if 'Supertaça' in n else 0.4 if 'Divisão' in n else 0.2
def key(n): n = unicodedata.normalize('NFD', n).encode('ascii', 'ignore').decode().lower(); w = re.findall(r'[a-z]+', n); return (w[0], w[-1]) if w else ('', '')
TOPCLUB = re.compile(r'^(Sporting CP|SL Benfica|SC Braga)$')
people = []
for tname, t in TEAMS.items() if False else [(v['name'], v) for v in TEAMS.values()]:
    club = TEAM2CLUB.get(tname)
    for st in t['staff']:
        fp = FP.get(str(st['id'])); role = ROLE.get(st['rname'], 'outro')
        if not fp: continue
        # vitórias/jogos ponderados pelo peso da competição
        G = W = 0.0
        for mc, x in fp['rank'].items():
            w = TOPMC.get(mc, 0.3 if mc != '0' else 0)
            G += x['games'] * w; W += x['wins'] * w
        wr = W / G if G else None
        tp = sum(TITLE_W(x['name']) * (x.get('count') or 1) for x in fp['titlesCoach'])
        staffGames = sum(r['games'] for r in fp['rows'] if r['esc'] == '1')
        topYears = len({s for s, rs in fp['staffRoles'].items() for r in rs if TOPCLUB.match(r['team']) and r['esc'] == '1'})
        years = len(fp['staffRoles'])
        ability = 6 + min(6, years * 0.45) + min(4, topYears * 0.45) + min(3, tp * 0.15)
        o = {'id': f"{club}-fp{st['id']}-{role}", 'club': club, 'name': fp['name'], 'func': FUNC.get(role, st['rname']), 'role': role, 'nat': fp['country'] or '?', 'birth': fp['dob'] or '?', 'src': 'fp',
             'fp': {'games': int(G), 'wins': int(W), 'notWon': int(G - W), 'titles': [f"{x['name']} ({', '.join(x['seasons'])})" for x in fp['titlesCoach']]},
             'history': [{'ep': s, 'club': r['team'], 'func': r['role'], 'g': '?', 'w': '?', 'd': '?', 'l': '?', 'titles': '-'} for s, rs in sorted(fp['staffRoles'].items(), reverse=True) for r in rs if r['esc'] == '1']}
        if role == 'principal':
            wr2 = wr if wr is not None else 0.45
            o['coach'] = {'tactical': round(min(20, 6 + wr2 * 9 + min(4, tp * 0.08) + min(2, years * 0.12))), 'motivation': round(min(20, 8 + wr2 * 7 + min(3, tp * 0.06))), 'record': {'games': int(G), 'wins': int(W), 'winRate': round(wr2, 3), 'titlesPts': tp}}
        # quem também está no zerozero: guarda o historial época a época com V/E/D desse lado
        z = next((p for p in ZZ.values() if p['club'] == club and key(p['name']) == key(fp['name'])), None)
        if z:
            o['history'] = z['history']; o['func'] = z['func']; o['nat'] = z['nat']; o['birth'] = z['birth']
            # o zerozero tem a carreira completa (também fora de Portugal e como adjunto): fica o melhor dos dois
            o['ability'] = round(min(20, max(ability, z['ability'])))
            if z.get('coach') and o.get('coach'): o['coach'] = {**o['coach'], 'tactical': max(o['coach']['tactical'], z['coach']['tactical']), 'motivation': max(o['coach']['motivation'], z['coach']['motivation'])}
            z['_used'] = True
        else:
            o['ability'] = round(min(20, ability))
        people.append(o)
# pessoas só do zerozero (ex.: médico, psicóloga do Benfica) continuam
for z in ZZ.values():
    if not z.get('_used') and z['role'] != 'principal': people.append(z)
    elif not z.get('_used'): people.append(z)
for p in people: p.pop('_used', None)
# treinadores principais: coaches.json com os valores calculados
cj = json.load(open('src/data/por/coaches.json'))
for p in people:
    if p['role'] == 'principal' and p.get('coach'):
        for c in cj['coaches']:
            if c['clubId'] == p['club']:
                c['name'] = p['name']; c['tactical'] = p['coach']['tactical']; c['motivation'] = p['coach']['motivation']
cj['_info'] = 'Treinadores atuais. tactical/motivation calculados do historial real (futsalportugal.com: % de vitórias por competição e títulos; zerozero nos 5 clubes com historial completo). discipline/youth: estimativa. style vazio = estilo deduzido do plantel.'
json.dump(cj, open('src/data/por/coaches.json', 'w'), ensure_ascii=False, indent=2)
json.dump({'_info': 'Equipas técnicas reais 2026/27: futsalportugal.com (12 clubes: jogos e vitórias por competição, títulos; recolha 1/11/2026) + zerozero (5 clubes, historial com V/E/D; recolha do António 2/11). ability e coach são estimativas calculadas destes dados.', 'people': people}, open('src/data/por/staff.json', 'w'), ensure_ascii=False, indent=1)
for p in people:
    print(p['club'], p['name'], p['role'], p['ability'], p.get('coach', ''), p.get('fp', {}).get('games', ''), p.get('fp', {}).get('wins', ''))
