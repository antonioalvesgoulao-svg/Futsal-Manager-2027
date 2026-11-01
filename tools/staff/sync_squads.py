# Sincroniza os planteis do jogo com os do futsalportugal.com (FPF): liga alcunhas, junta quem falta,
# passa para a formação os Sub-19 que não estão inscritos como seniores, retira adultos que já não estão no clube.
import json, re, unicodedata
PLJ = json.load(open('src/data/por/players.json')); PL = PLJ['players']
T = json.load(open('tools/staff/fp_teams.json')); FS = json.load(open('src/data/por/fpstats.json'))['players']
FP = json.load(open('tools/staff/fp_people.json'))
M = {'Sporting CP': 'scp', 'SL Benfica': 'slb', 'SC Braga': 'scb', 'AD Fundão': 'fun', 'Leões de Porto Salvo': 'lps', 'SC Ferreira do Zêzere/Zêzerovo': 'fzz', 'Eléctrico FC': 'ele', 'Rio Ave FC': 'rav', 'UP Venda Nova': 'uvn', 'Portimonense SC': 'por', 'FC Famalicão': 'fam', 'SCU Torreense': 'tor'}
POS = {'Guarda Redes': 'GR', 'Fixo': 'FIX', 'Fixo / Ala': 'FIX/ALA', 'Ala': 'ALA', 'Ala / Pivot': 'ALA/PIV', 'Pivot': 'PIV', 'Universal': 'UNI'}
NAT = {'PT': 'Portugal', 'BR': 'Brasil', 'CV': 'Cabo Verde', 'AO': 'Angola', 'ES': 'Espanha', 'AR': 'Argentina', 'IT': 'Itália', 'UA': 'Ucrânia', 'RU': 'Rússia', 'GW': 'Guiné-Bissau', 'ST': 'São Tomé e Príncipe', 'FR': 'França', 'CL': 'Chile', 'PY': 'Paraguai', 'UY': 'Uruguai', 'NG': 'Nigéria', 'MZ': 'Moçambique', 'VE': 'Venezuela'}
norm = lambda n: re.sub(r'[^a-z ]', '', unicodedata.normalize('NFD', n).encode('ascii', 'ignore').decode().lower()).split()
def age(dob): return None if not dob or dob[:4] == '2026' else 2026 - int(dob[:4]) - (1 if dob[5:] > '07-01' else 0)
linked = {x['fpId']: pid for pid, x in FS.items()}
links = {}; added = []; to_jun = []; removed = []; skipped = []
for t in T.values():
    c = M[t['name']]
    site = [p for p in t['players'] if p['person_id'] not in linked]
    ours = [p for p in PL if p['clubId'] == c and p['id'] not in FS]
    # 1) pares por alcunha/idade/posição
    for o in list(ours):
        def sc(sp):
            on, sn = norm(o['name']), norm(sp['name'].replace('"', ' '))
            if on == sn or (len(on) > 1 and on[0] == sn[0] and on[-1] == sn[-1]): return 10  # mesmo nome (mesmo sem data de nascimento)
            a = age(sp['dob'])
            if a is None or abs(a - o['age']) > 1: return -1
            gk = o['position'] == 'GR'
            if gk != (POS.get(sp['rname']) == 'GR'): return -1
            hint = any(x[:4] in y or y[:4] in x for x in on for y in sn if len(x) >= 3 and len(y) >= 3)
            # alcunha de uma palavra (Guga, Vitinho, Gui, Santi): mesmas duas primeiras letras de um dos nomes
            if not hint and len(on) == 1: hint = any(y[:2] == on[0][:2] for y in sn)
            if not hint and not gk: return -1
            return (3 if hint else 2) + (1 if a == o['age'] else 0)
        best = max(site, key=sc, default=None)
        if best and sc(best) >= 2:
            links[o['id']] = best['person_id']; site.remove(best); ours.remove(o)
    # 2) site sem par: entram (exceto inscrições sem jogos com 35+ anos)
    for sp in site:
        a = age(sp['dob'])
        if a is None and any(norm(x['name']) == norm(sp['name']) for x in PL if x['clubId'] == c): continue  # registo duplicado no site (sem data de nascimento)
        if not sp.get('jg') and a is not None and a >= 35: skipped.append(f"{c}: {sp['name']} ({a} anos, 0 jogos)"); continue
        nick = re.findall(r'"([^"]+)"', sp['name'])
        nm = nick[0] if nick else ' '.join([w for w in sp['name'].split()][:1] + [sp['name'].split()[-1]]) if len(sp['name'].split()) > 2 else sp['name']
        added.append({'id': f"{c}f{sp['person_id']}", 'clubId': c, 'name': nm, 'position': POS.get(sp['rname'], 'UNI'), 'number': None, 'age': a or 22, 'nationality': NAT.get(sp.get('code'), 'Portugal'), 'fpId': sp['person_id']})
    # 3) do jogo sem par: Sub-19 → formação; adultos → saem
    for o in ours:
        if o['age'] <= 19: to_jun.append(o['id'])
        else: removed.append(o)
# números livres para os novos
for a in added:
    used = {p['number'] for p in PL if p['clubId'] == a['clubId']} | {x['number'] for x in added if x['clubId'] == a['clubId']}
    n = 2
    while n in used: n += 1
    a['number'] = n
for p in PL:
    if p['id'] in to_jun: p['clubId'] = p['clubId'] + '@jun'
PL = [p for p in PL if p not in removed] + [{k: v for k, v in a.items() if k != 'fpId'} for a in added]
PLJ['players'] = PL
json.dump(PLJ, open('src/data/por/players.json', 'w'), ensure_ascii=False, indent=1)
json.dump({**{k: v for k, v in links.items()}, **{a['id']: a['fpId'] for a in added}}, open('tools/staff/manual_links.json', 'w'), ensure_ascii=False, indent=1)
names = {p['person_id']: p['name'] for t in T.values() for p in t['players']}
print('ligados por alcunha:', [(next(p['name'] for p in json.load(open('src/data/por/players.json'))['players'] if p['id'] == k), names[v]) for k, v in links.items()])
print('novos:', len(added), [f"{a['clubId']} {a['name']} ({a['position']}, {a['age']})" for a in added])
print('para a formação:', to_jun); print('saem:', [f"{p['clubId']} {p['name']}" for p in removed]); print('fora (35+, 0 jogos):', len(skipped), skipped)
print('total no jogo (seniores do plantel):', sum(1 for p in PL if '@' not in p['clubId']))
