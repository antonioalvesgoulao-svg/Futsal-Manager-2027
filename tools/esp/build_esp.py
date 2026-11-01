# Espanha (Primera División 2026/27) a partir do futsalportugal.com: planteis, historial por época, cartões, títulos e treinadores.
# Uso: python3 tools/esp/build_esp.py <pasta com teams.json e fpc/>
# Gera src/data/esp/players.json, fpstats.json, coaches.json e staff.json. Números de camisola: o site não os tem (estimativa).
import json, re, html, glob, sys, os
SRC = sys.argv[1]
def unw(x):
    if isinstance(x, list) and len(x) == 2 and isinstance(x[1], dict) and 's' in x[1]: return unw(x[0])
    if isinstance(x, list): return [unw(i) for i in x]
    if isinstance(x, dict): return {k: unw(v) for k, v in x.items()}
    return x
def person(pid):
    f = f'{SRC}/fpc/_en_playerpage_{pid}.html'
    if not os.path.exists(f): return None
    t = open(f).read(); sn = re.findall(r'wire:snapshot="([^"]*)"', t)
    if not sn: return None
    d = unw(json.loads(html.unescape(sn[0]))['data'])
    seasons = {str(x['id']): x['season'] for x in d['seasons']}
    rows = []; roles = {}
    car = d.get('career') or {}
    for sid, byesc in (car.items() if isinstance(car, dict) else []):
        for esc, blk in (byesc.items() if isinstance(byesc, dict) else []):
            if not isinstance(blk, dict): continue
            for tb in blk.get('tables', []):
                for typ, comps in (tb.get('types') or {}).items():
                    for cname, c in comps.items():
                        if cname == 'zztt' or not isinstance(c, dict): continue
                        rows.append({'season': seasons.get(sid, sid), 'esc': esc, 'team': tb['team']['team'], 'comp': cname, 'games': int(c.get('c') or 0), 'goals': int(c.get('g') or 0), 'yellow': int(c.get('y') or 0), 'red': int(c.get('r') or 0) + int(c.get('dw') or 0)})
            for tm in blk.get('teams', []):
                if tm.get('staff'): roles.setdefault(seasons.get(sid, sid), []).append({'team': tm['team'], 'role': tm['staff'], 'esc': esc})
    rk = {}
    ra = d.get('rankingsall') or {}
    for esc, bymc in (ra.items() if isinstance(ra, dict) else []):
        if esc != '1' or not isinstance(bymc, dict): continue
        for mc, bytype in bymc.items():
            for ty, x in (bytype.items() if isinstance(bytype, dict) else []):
                rk[mc] = {'games': int(x.get('c1') or 0), 'wins': int(x.get('v1') or 0)}
    per = d['person']
    return {'name': per['name'], 'dob': (per.get('dob') or '')[:10], 'country': (per.get('country') or {}).get('originname'), 'rows': rows, 'roles': roles, 'rank': rk,
            'titles': [{'name': p['name'], 'seasons': p.get('seasons', []), 'count': p.get('count')} for p in (d.get('palmares') or []) if isinstance(p, dict)],
            'titlesCoach': [{'name': p['name'], 'seasons': p.get('seasons', []), 'count': p.get('count')} for p in (d.get('palmaresCoach') or []) if isinstance(p, dict)]}

CLUBS = json.load(open('src/data/esp/clubs.json'))['clubs']
FP2 = {str(c['fp']): c['id'] for c in CLUBS}
TEAMS = json.load(open(f'{SRC}/esp/teams.json'))
POS = {'Guarda Redes': 'GR', 'Fixo': 'FIX', 'Ala': 'ALA', 'Pivot': 'PIV', 'Universal': 'UNI'}
NAT = {'ES': 'Espanha', 'BR': 'Brasil', 'AR': 'Argentina', 'PT': 'Portugal', 'IT': 'Itália', 'UA': 'Ucrânia', 'RU': 'Rússia', 'MA': 'Marrocos', 'FR': 'França', 'PY': 'Paraguai', 'UY': 'Uruguai', 'VE': 'Venezuela', 'CO': 'Colômbia', 'JP': 'Japão', 'IR': 'Irão', 'HR': 'Croácia', 'SI': 'Eslovénia', 'KZ': 'Cazaquistão', 'GE': 'Geórgia', 'CV': 'Cabo Verde', 'AO': 'Angola', 'PE': 'Peru', 'EC': 'Equador', 'CR': 'Costa Rica', 'PA': 'Panamá', 'GT': 'Guatemala', 'CL': 'Chile', 'BE': 'Bélgica', 'NL': 'Países Baixos', 'RS': 'Sérvia', 'AZ': 'Azerbaijão', 'LY': 'Líbia', 'DZ': 'Argélia', 'TN': 'Tunísia', 'BY': 'Bielorrússia', 'PL': 'Polónia', 'CZ': 'Chéquia', 'FI': 'Finlândia', 'GB': 'Inglaterra', 'MX': 'México', 'US': 'Estados Unidos', 'DO': 'República Dominicana', 'CU': 'Cuba', 'BO': 'Bolívia', 'SN': 'Senegal', 'TH': 'Tailândia', 'VN': 'Vietname', 'KW': 'Kuwait', 'SA': 'Arábia Saudita', 'BA': 'Bósnia', 'MK': 'Macedónia do Norte', 'ME': 'Montenegro', 'AL': 'Albânia', 'RO': 'Roménia', 'HU': 'Hungria', 'SK': 'Eslováquia', 'LT': 'Lituânia', 'LV': 'Letónia', 'MD': 'Moldávia', 'AM': 'Arménia'}
players = []; stats = {}; coaches = []; staff = []; teamnames = {}
for tid, t in TEAMS.items():
    club = FP2[tid]
    used = set(); n = 0
    plist = sorted(t['players'], key=lambda p: (POS.get(p['rname'], 'UNI') != 'GR', -int(p.get('jg') or 0)))
    for fp in plist:
        dob = fp.get('dob') or ''
        age = 2026 - int(dob[:4]) - (1 if dob[5:] > '07-01' else 0) if dob[:4].isdigit() else 25
        pos = POS.get(fp['rname'], 'UNI')
        # número: o site não tem; GR 1/13/25, restantes pela ordem de jogos (estimativa, alterável no perfil)
        num = next(x for x in ([1, 13, 25, 31, 33, 99] if pos == 'GR' else list(range(2, 13)) + list(range(14, 25)) + list(range(26, 99))) if x not in used); used.add(num)
        n += 1
        pid = f'{club}{n:02d}'
        junior = age <= 18 and int(fp.get('jg') or 0) == 0
        name = re.sub(r'\s+', ' ', fp['name']).strip()
        players.append({'id': pid, 'clubId': club + ('@jun' if junior else ''), 'name': name, 'position': pos, 'number': None if junior else num, 'age': age, 'nationality': NAT.get(fp.get('code') or '', fp.get('code') or 'Espanha')})
        per = person(fp['person_id'])
        if not per: continue
        rows = [r for r in per['rows'] if r['esc'] == '1' and not re.search(r'Sele|National|^España$|^Spain$|^Brasil$|^Brazil$|^Portugal$|^Argentina$', r['team'])]
        recent = [r for r in rows if r['season'] >= '2021/2022']
        seasons = {}
        for r in rows:
            s = r['season'][2:4]
            if s < '21': continue
            x = seasons.setdefault((s, r['team']), {'s': s, 'team': r['team'], 'games': 0, 'goals': 0})
            x['games'] += r['games']; x['goals'] += r['goals']
            teamnames[r['team']] = teamnames.get(r['team'], 0) + 1
        stats[pid] = {'fpId': fp['person_id'], 'games': sum(r['games'] for r in recent), 'yellow': sum(r['yellow'] for r in recent), 'red': sum(r['red'] for r in recent),
                      'seasons': sorted(seasons.values(), key=lambda x: x['s'], reverse=True), 'titles': [f"{x['name']} ({', '.join(x['seasons'])})" for x in per['titles']]}
    # liga espanhola mais forte: +2 no tático face à fórmula portuguesa (a mesma % de vitórias vale mais); títulos pesam mais (estimativa)
    # treinador principal (o primeiro listado; se houver dois, o que tem mais jogos no site é o principal)
    cands = []
    for g in t['coaches'].values():
        for c in g:
            per = person(c['id'])
            if per: cands.append((c, per))
    TOPMC = {'33': 1, '15': 1, '37': 1, '57': 1.3, '26': 0.9, '30': 1}
    TW = lambda n: 4 if 'Champions' in n else 3 if 'Primera' in n or 'Liga' in n or 'Campeonato' in n else 1.5 if 'Copa' in n or 'Taça' in n else 0.6 if 'Super' in n else 0.2
    best = None
    for c, per in cands:
        G = W = 0.0
        for mc, x in per['rank'].items():
            w = TOPMC.get(mc, 0.3 if mc != '0' else 0); G += x['games'] * w; W += x['wins'] * w
        tp = sum(TW(x['name']) * (x.get('count') or 1) for x in per['titlesCoach'])
        years = len(per['roles'])
        wr = W / G if G else 0.45
        o = {'c': c, 'per': per, 'G': G, 'W': W, 'wr': wr, 'tp': tp, 'years': years}
        if not best or G > best['G']: best = o
        staff.append({'id': f"{club}-fp{c['id']}-{'principal' if best is o else 'adjunto'}", 'club': club, 'name': per['name'], 'func': 'Treinador principal', 'role': 'principal', 'nat': per['country'] or '?', 'birth': per['dob'] or '?', 'src': 'fp',
                      'ability': round(min(20, 6 + min(6, years * 0.45) + min(3, tp * 0.15) + (2 if club in ('bar', 'epz', 'pal', 'jca', 'int') else 0))),
                      'fp': {'games': int(G), 'wins': int(W), 'notWon': int(G - W), 'titles': [f"{x['name']} ({', '.join(x['seasons'])})" for x in per['titlesCoach']]},
                      'history': [{'ep': s, 'club': r['team'], 'func': r['role'], 'g': '?', 'w': '?', 'd': '?', 'l': '?', 'titles': '-'} for s, rs in sorted(per['roles'].items(), reverse=True) for r in rs if r['esc'] == '1'],
                      'coach': {'tactical': round(min(20, 8 + wr * 9 + min(5, tp * 0.4) + min(2, years * 0.12))), 'motivation': round(min(20, 9 + wr * 7 + min(4, tp * 0.3))), 'record': {'games': int(G), 'wins': int(W), 'winRate': round(wr, 3), 'titlesPts': tp}}})
    # só o principal fica com a função de principal; os outros listados como treinador passam a adjuntos
    for x in staff:
        if x['club'] == club and best and x['name'] != best['per']['name'] and x['role'] == 'principal': x['role'] = 'adjunto'; x['func'] = 'Treinador-adjunto'; x.pop('coach', None); x['id'] = x['id'].replace('-principal', '-adjunto')
    if best:
        cc = next(x for x in staff if x['club'] == club and x['role'] == 'principal')
        coaches.append({'id': f'c_{club}', 'name': best['per']['name'], 'clubId': club, 'tactical': cc['coach']['tactical'], 'motivation': cc['coach']['motivation'], 'discipline': 14, 'youth': 12, 'style': {}})
info = 'Primera División 2026/27, futsalportugal.com (recolha 2/11/2026, 1 página a cada 7 s).'
json.dump({'_info': info + ' Números de camisola: estimativa (o site não os tem).', 'players': players}, open('src/data/esp/players.json', 'w'), ensure_ascii=False, indent=0)
json.dump({'_info': info + ' Jogos, cartões e golos por época desde 2021/22; títulos.', 'players': stats}, open('src/data/esp/fpstats.json', 'w'), ensure_ascii=False, indent=0)
json.dump({'_info': info + ' tactical/motivation calculados do historial (vitórias por competição, títulos); discipline/youth estimativa.', 'coaches': coaches}, open('src/data/esp/coaches.json', 'w'), ensure_ascii=False, indent=2)
json.dump({'_info': info + ' Só os treinadores principais (o site não lista o resto da equipa técnica em Espanha); ability é estimativa.', 'people': staff}, open('src/data/esp/staff.json', 'w'), ensure_ascii=False, indent=1)
print(len(players), 'jogadores', len(stats), 'com historial', len(coaches), 'treinadores')
json.dump(teamnames, open(f'{SRC}/esp/teamnames.json', 'w'), ensure_ascii=False, indent=0)
