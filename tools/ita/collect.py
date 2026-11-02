# Itália (Serie A 2026/27): recolha cuidadosa das fontes reais.
#  1) divisionecalcioa5.it (site oficial da liga): plantel (nome, posição, número), equipa técnica, cores, calendário
#  2) futsalportugal.com: para cada jogador/treinador, pesquisa pelo nome e página de pessoa (data de nascimento,
#     país, historial época a época), igual a Espanha
# Pedidos com pausa (5 s no site da liga, 7 s no futsalportugal), cache local, para ao primeiro erro de servidor.
# Uso: python3 tools/ita/collect.py <pasta de trabalho>   (escreve <pasta>/ita.json; cache em <pasta>/cache e <pasta>/fpc)
import json, os, re, sys, time, html, unicodedata, urllib.request

W = sys.argv[1]
os.makedirs(f'{W}/cache', exist_ok=True); os.makedirs(f'{W}/fpc', exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0'}
TEAMS = ['active-network', 'bulldog-capurso', 'came-treviso', 'feldi-eboli', 'fortitudo-pomezia', 'gg-teamwear-benevento', 'giovinazzo-c5',
         'l84-torino', 'meta-catania', 'napoli-futsal', 'roma-1927', 'sandro-abate-avellino', 'sporting-sala-consilina', 'vinumitaly-petrarca']

def get(url, path, pause):
    if os.path.exists(path) and os.path.getsize(path) > 0: return open(path, encoding='utf8', errors='ignore').read()
    time.sleep(pause)
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r: data = r.read().decode('utf8', 'ignore')
    except Exception as e:
        print('PARAR', url, e); sys.exit(1)
    open(path, 'w', encoding='utf8').write(data)
    return data

def lines(t):
    t = html.unescape(re.sub('<[^>]+>', '\n', re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)))
    return [l.strip() for l in t.split('\n') if l.strip()]

def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z ]', ' ', s).split()

POS = {'POR': 'GR', 'CET': 'FIX', 'DIF': 'FIX', 'INT': 'UNI', 'LAT': 'ALA', 'PIV': 'PIV', 'UNI': 'UNI'}
out = {}
for slug in TEAMS:
    L = lines(get(f'https://divisionecalcioa5.it/team/{slug}/', f'{W}/cache/{slug}.html', 5))
    # nome oficial: o título da página antes de "• Stagione"
    st = next(k for k, l in enumerate(L) if l.startswith('• Stagione'))
    team = {'slug': slug, 'name': L[st - 1] if L[st - 1] != '—' else L[st - 2], 'colors': L[L.index('Colori') + 1] if 'Colori' in L else '', 'players': [], 'staff': []}
    i = L.index('Rosa giocatori') + 4  # Nome | Ruolo | #
    while i + 2 < len(L) and L[i + 1] in POS:
        nm = L[i].title() if L[i].isupper() else L[i]  # alguns clubes publicam só o apelido em maiúsculas
        team['players'].append({'name': nm, 'role': POS[L[i + 1]], 'number': int(L[i + 2]) if L[i + 2].isdigit() else None}); i += 3
    if 'Staff squadra' in L:
        j = L.index('Staff squadra') + 3
        while j + 1 < len(L) and L[j] not in ('Ultime partite', 'Prossime partite'):
            team['staff'].append({'role': L[j], 'name': L[j + 1]}); j += 2
    out[slug] = team
    print(slug, team['name'], len(team['players']), 'jogadores', len(team['staff']), 'staff')

# futsalportugal: pesquisa por nome e página de pessoa
def fp_search(q):
    t = get(f'https://futsalportugal.com/en/search?q={urllib.parse.quote(q)}', f'{W}/cache/fps_{re.sub("[^a-z0-9]", "_", q.lower())}.html', 7)
    return [(m.group(1), ' '.join(re.sub('<[^>]+>', ' ', html.unescape(m.group(2))).split())) for m in re.finditer(r'href="[^"]*/en/playerpage/(\d+)"[^>]*>(.*?)</a>', t, re.S)]

import urllib.parse
def match(name):
    toks = norm(name)
    for q in [name, ' '.join(name.split()[:2]), name.split()[-1]]:
        if len(q) < 3: continue
        res = fp_search(q)
        best = None
        for pid, nm in res:
            nt = norm(nm)
            score = len(set(nt) & set(toks)) / max(1, len(set(nt) | set(toks)))
            if nt == toks: score = 2
            if score >= 0.5 and (not best or score > best[1]): best = (pid, score)
        if best: return best[0]
    return None

for slug, team in out.items():
    for p in team['players'] + [s for s in team['staff'] if s['role'] in ('Allenatore', 'Vice Allenatore', 'Preparatore Portieri', 'Preparatore Atletico')]:
        pid = match(p['name'])
        p['fp'] = pid
        if pid: get(f'https://futsalportugal.com/en/playerpage/{pid}', f'{W}/fpc/_en_playerpage_{pid}.html', 7)
        print(slug, p['name'], '->', pid)
    json.dump(out, open(f'{W}/ita.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('fim')
