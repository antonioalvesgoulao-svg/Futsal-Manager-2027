"""França D1 Futsal 2026/27: players.json, fpstats.json, coaches.json a partir dos CSV recolhidos pelo
Claude in Chrome do António (planteis zerozero + FFF, historial FFF 2023/24-2026/27) e de tools/fra/thefootdata.json.
Uso: python3 tools/fra/build_fra.py <planteis.csv> <historial.csv>"""
import csv, json, sys, re, unicodedata
from datetime import date

CLUB = {'Étoile Lavalloise': 'lav', 'Sporting Club Paris': 'spa', 'Montpellier Méditerranée Futsal': 'mon', 'GOAL Futsal Club': 'goa',
        'Toulon Métropole Futsal': 'tln', 'Nantes Métropole Futsal': 'nan', 'Paris ACASA': 'aca', 'AS Avion Futsal': 'avi',
        'UJS Toulouse': 'ujs', 'Nice Futsal Club': 'nic', 'Garges Djibson': 'gar', 'Artistes Futsal': 'art'}
POS = {'Guarda-Redes': 'GR', 'Fixo': 'FIX', 'Universal': 'UNI', 'Médio': 'UNI', 'Ala': 'ALA', 'Pivot': 'PIV', 'Avançado': 'PIV',
       'Fixo / Ala': 'FIX/ALA', 'Ala / Pivot': 'ALA/PIV'}
NAT = {'Ilhas Comores': 'Comores', 'Chéquia': 'Chéquia', 'Letónia': 'Letónia'}
TODAY = date(2026, 7, 1)

def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z ]', '', s).strip()

def rows(p):
    with open(p, encoding='utf-8-sig') as f:
        return list(csv.DictReader(f, delimiter=';'))

squad, hist = rows(sys.argv[1]), rows(sys.argv[2])
H = {}
for h in hist:
    if not h.get('nome'): continue
    H.setdefault(norm(h['nome']), []).append(h)

players, fp, used = [], {}, {}
counts = {}
for r in squad:
    cid = CLUB.get(r['clube'])
    if not cid or not r['nome'].strip(): continue
    full = r['nome'].strip()
    counts[cid] = counts.get(cid, 0) + 1
    pid = f'{cid}{counts[cid]:02d}'
    est = []
    hs = H.get(norm(full), [])
    # posição: real quando existe; senão estimada pelos golos por jogo no historial (estimativa)
    pos = POS.get(r['posição'].strip())
    if not pos:
        g = sum(int(h['jogos'] or 0) for h in hs); gl = sum(int(h['golos'] or 0) for h in hs)
        pos = 'UNI' if g < 3 else 'PIV' if gl / g > 0.45 else 'ALA' if gl / g > 0.12 else 'FIX'
        est.append('posição')
    dob = r['data de nascimento'].strip()
    if dob:
        y, m, d = map(int, dob[:10].split('-'))
        age = TODAY.year - y - ((TODAY.month, TODAY.day) < (m, d))
    else:
        age = 25; est.append('idade')
    nat = r['nacionalidade'].strip()
    nat = NAT.get(nat, nat) if nat else ''
    if not nat: nat = 'França'; est.append('nacionalidade')
    num = r['número'].strip()
    num = int(num) if num.isdigit() else None
    taken = used.setdefault(cid, set())
    if num is None or num in taken:
        num = next(n for n in range(2, 99) if n not in taken); est.append('número')
    taken.add(num)
    parts = full.split()
    p = {'id': pid, 'clubId': cid, 'name': parts[-1] if len(parts) > 1 else full, 'position': pos, 'number': num, 'age': age,
         'nationality': nat, 'fullName': full}
    if est: p['estimated'] = est
    players.append(p)
    seasons = {}
    for h in hs:
        s = h['época'][-2:]
        k = (s, h['clube'])
        a = seasons.setdefault(k, {'s': s, 'team': h['clube'], 'games': 0, 'goals': 0})
        a['games'] += int(h['jogos'] or 0); a['goals'] += int(h['golos'] or 0)
    if hs:
        fp[pid] = {'games': sum(int(h['jogos'] or 0) for h in hs), 'yellow': sum(int(h['amarelos'] or 0) for h in hs),
                   'red': sum(int(h['vermelhos'] or 0) for h in hs),
                   'seasons': sorted(seasons.values(), key=lambda x: x['s'], reverse=True), 'titles': [],
                   'src': 'FFF (D1 e play-off 2023/24-2026/27, recolha do António)'}

# GR: pelo menos 2 por clube (se faltar, o jogador de campo sem golos com mais jogos passa a GR estimado)
for cid in CLUB.values():
    ps = [p for p in players if p['clubId'] == cid]
    while sum(p['position'] == 'GR' for p in ps) < 2:
        cand = [p for p in ps if p['position'] != 'GR' and 'posição' in p.get('estimated', [])]
        cand.sort(key=lambda p: (sum(s['goals'] for s in fp.get(p['id'], {}).get('seasons', [])), -fp.get(p['id'], {}).get('games', 0)))
        if not cand: break
        cand[0]['position'] = 'GR'

info = 'D1 Futsal 2026/27: planteis do zerozero + fichas de jogo FFF (recolha do António via Claude in Chrome, 4/11/2026). ' \
       'estimated = campos estimados (posição pelos golos/jogo, idade 25, nacionalidade França, número livre).'
json.dump({'_info': info, 'players': players}, open('src/data/fra/players.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'_info': 'Historial FFF por época (D1 e play-off) 2023/24-2026/27; títulos não recolhidos.', 'players': fp},
          open('src/data/fra/fpstats.json', 'w'), ensure_ascii=False, indent=1)
print(len(players), 'jogadores;', len(fp), 'com historial;', sum(1 for p in players if p.get('estimated')), 'com estimativas')
for cid in CLUB.values():
    ps = [p for p in players if p['clubId'] == cid]
    print(cid, len(ps), {k: sum(p['position'] == k for p in ps) for k in ['GR', 'FIX', 'UNI', 'ALA', 'PIV']})
