# Itália: páginas oficiais dos jogadores (divisionecalcioa5.it/giocatore): nome completo, número, posição, data de
# nascimento, golos da época e carreira por época (clube e divisão). 1 pedido a cada 5 s, cache, para ao primeiro erro.
# Uso: python3 tools/ita/collect_players.py <pasta de trabalho>   (lê <pasta>/cache/<equipa>.html, escreve <pasta>/players_off.json)
import json, os, re, sys, time, html, urllib.request
W = sys.argv[1]
os.makedirs(f'{W}/cache/g', exist_ok=True)

def get(url, path):
    if os.path.exists(path) and os.path.getsize(path) > 0: return open(path, encoding='utf8', errors='ignore').read()
    time.sleep(5)
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30) as r: data = r.read().decode('utf8', 'ignore')
    except Exception as e:
        print('PARAR', url, e); sys.exit(1)
    open(path, 'w', encoding='utf8').write(data); return data

def lines(t):
    return [l.strip() for l in html.unescape(re.sub('<[^>]+>', '\n', re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S))).split('\n') if l.strip()]

out = {}
for f in sorted(os.listdir(f'{W}/cache')):
    if not f.endswith('.html') or f.startswith('fps_') or '_' in f.replace('-', ''): continue
    slug = f[:-5]
    t = open(f'{W}/cache/{f}', encoding='utf8', errors='ignore').read()
    links = []
    for m in re.finditer(r'href="(https://divisionecalcioa5\.it/giocatore/\?player_id=(\d+)[^"]*)"', t):
        u = html.unescape(m.group(1))
        if m.group(2) not in [x[0] for x in links]: links.append((m.group(2), u))
    team = []
    for pid, u in links:
        L = lines(get(u, f'{W}/cache/g/{pid}.html'))
        try:
            k = L.index('Giocatore', L.index('Giocatore') + 1)
        except ValueError:
            continue
        name = L[k + 1]
        num = L[k + 2].lstrip('#') if L[k + 2].startswith('#') else None
        role = L[L.index('Ruolo:') + 1] if 'Ruolo:' in L else None
        dob = L[L.index('Nato il:') + 1] if 'Nato il:' in L else None
        goals = L[L.index('Reti:') + 1] if 'Reti:' in L else None
        car = []
        if 'Carriera' in L:
            i = L.index('Carriera') + 4  # Stagione | Squadra | Competizione
            while i + 1 < len(L) and re.fullmatch(r'\d{4}-\d{2}', L[i]):
                comp = L[i + 2] if i + 2 < len(L) and not re.fullmatch(r'\d{4}-\d{2}', L[i + 2]) and L[i + 2] != 'Shop Online' else ''
                car.append({'season': L[i], 'team': L[i + 1], 'comp': comp})
                i += 3 if comp else 2
        team.append({'pid': pid, 'name': name, 'number': int(num) if num and num.isdigit() else None, 'role': role, 'dob': dob, 'goals': goals, 'career': car})
    out[slug] = team
    print(slug, len(team), 'jogadores')
    json.dump(out, open(f'{W}/players_off.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print('fim')
