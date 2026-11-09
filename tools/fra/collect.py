# França (D1 Futsal): recolha no thefootdata.com (dados FFF): resultados jornada a jornada (2021/22-2026/27), pavilhão
# declarado por cada clube (ficha de um jogo em casa) e planteis com jogos/titularidades/golos/assistências/cartões
# (2024/25-2026/27). 1 pedido a cada 3 s, cache em disco, para após 5 erros seguidos.
# Uso: python3 tools/fra/collect.py <pasta de trabalho>  -> <pasta>/fra.json
import json, os, re, sys, time, html, urllib.request
W = sys.argv[1]; os.makedirs(f'{W}/c', exist_ok=True)
B = 'https://thefootdata.com'
errs = 0
def get(path):
    global errs
    f = f'{W}/c/' + re.sub(r'[^a-zA-Z0-9]+', '_', path)[:180] + '.html'
    if os.path.exists(f) and os.path.getsize(f) > 2000: return open(f, errors='ignore').read()
    time.sleep(3)
    for k in range(3):
        try:
            t = urllib.request.urlopen(urllib.request.Request(B + path, headers={'User-Agent': 'Mozilla/5.0'}), timeout=40).read().decode('utf8', 'ignore')
            open(f, 'w').write(t); errs = 0; return t
        except Exception as e:
            time.sleep(8 * (k + 1))
    errs += 1
    if errs >= 5: print('PARAR'); sys.exit(1)
    return ''
def lines(t): return [l.strip() for l in html.unescape(re.sub('<[^>]+>', '\n', re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S))).split('\n') if l.strip()]
out = json.load(open(f'{W}/fra.json')) if os.path.exists(f'{W}/fra.json') else {'matches': {}, 'venues': {}, 'squads': {}}
# 1. resultados por época e jornada (poule 1-1 = fase regular)
for y in range(2021, 2027):
    for j in range(1, 23):
        t = get(f'/competitions/futsal-d1?saison={y}&organisme=federation-francaise&poule=1-1&journee={j}')
        L = lines(t)
        hd = [i for i, l in enumerate(L) if l == f'Journée {j}']
        if not hd: break
        i = hd[0]; ms = []
        links = re.findall(r'href="/matchs/(\d+)-([^"]+)"', t)
        k = i + 7
        while k < len(L) and not L[k].startswith('Les classements'):
            if re.match(r'^(lun|mar|mer|jeu|ven|sam|dim) ', L[k]):
                h = L[k + 1]
                if k + 4 < len(L) and L[k + 3] == '–' and L[k + 2].isdigit():
                    ms.append({'h': h, 'a': L[k + 5], 'hs': int(L[k + 2]), 'as': int(L[k + 4])}); k += 6
                else:
                    ms.append({'h': h, 'a': L[k + 3]}); k += 4
            else: k += 1
        for m, (mid, slug) in zip(ms, links): m['id'] = mid
        out['matches'][f'{y}-{j}'] = ms
    print('época', y, sum(len(v) for k, v in out['matches'].items() if k.startswith(str(y))), 'jogos', flush=True)
    json.dump(out, open(f'{W}/fra.json', 'w'), ensure_ascii=False)
# 2. clubes da época 2026/27 e pavilhão (ficha de um jogo em casa)
t = get('/competitions/futsal-d1?saison=2026&organisme=federation-francaise&poule=1-1')
slugs = sorted(set(re.findall(r'href="/clubs/([a-z0-9-]+)', t)))
for y in [2026, 2025]:
    for j in range(1, 23):
        for mid, slug in re.findall(r'href="/matchs/(\d+)-([^"]+)"', get(f'/competitions/futsal-d1?saison={y}&organisme=federation-francaise&poule=1-1&journee={j}')):
            L = lines(get(f'/matchs/{mid}-{slug}'))
            if 'Terrain' not in L: continue
            i = L.index('Terrain')
            home = L[L.index('D1 Futsal') + 3] if 'D1 Futsal' in L else ''
            try: nm = L[L.index('Nom', i) + 1]; ad = L[L.index('Adresse', i) + 1]; sf = L[L.index('Surface', i) + 1] if 'Surface' in L else ''
            except ValueError: continue
            dec = L[L.index('Terrain déclaré par', i) + 1] if 'Terrain déclaré par' in L else home
            out['venues'].setdefault(dec, {'nome': nm, 'morada': ad, 'piso': sf, 'jogo': mid})
        if len(out['venues']) >= 12: break
    if len(out['venues']) >= 12: break
print('pavilhões', len(out['venues']), flush=True)
json.dump(out, open(f'{W}/fra.json', 'w'), ensure_ascii=False)
# 3. planteis (equipa sénior masculina de futsal, a da D1) por época
for s in slugs:
    for y in [2026, 2025, 2024]:
        L = lines(get(f'/clubs/{s}?onglet=effectif&saison_effectif={y}'))
        try: i = L.index('Joueur'); assert L[i + 1] == 'MJ'
        except Exception: continue
        rows = []; k = i + 9
        while k < len(L) - 8:
            if re.fullmatch(r'[A-Z]{1,3}', L[k]) and not L[k + 1].isdigit():
                nm = L[k + 1]; k += 2
                if k < len(L) and L[k].startswith('aussi'): k += 1
                nums = []
                while k < len(L) and re.fullmatch(r'\d+', L[k]) and len(nums) < 7: nums.append(int(L[k])); k += 1
                if len(nums) >= 6: rows.append({'nome': nm, 'mj': nums[0], 'tit': nums[1], 'banc': nums[2], 'golos': nums[3], 'assist': nums[4], 'cj': nums[5], 'cr': nums[6] if len(nums) > 6 else 0})
            elif L[k] in ('Séniors M',) and rows: break
            else: k += 1
        out['squads'][f'{s}|{y}'] = rows
    print('plantel', s, [len(out['squads'].get(f'{s}|{y}', [])) for y in [2026, 2025, 2024]], flush=True)
    json.dump(out, open(f'{W}/fra.json', 'w'), ensure_ascii=False)
print('fim')
