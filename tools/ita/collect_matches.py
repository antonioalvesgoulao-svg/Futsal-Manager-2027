# Itália: fichas de jogo da Serie A (divisionecalcioa5.it) de 2021/22 a 2025/26: ficha (convocados), golos e cartões por jogador.
# 1 pedido a cada 3 s, cache; continua em caso de erro isolado (para após 5 erros seguidos).
# Uso: python3 tools/ita/collect_matches.py <pasta de trabalho>  -> <pasta>/matches.json
import re, html, os, sys, time, json, urllib.request
W = sys.argv[1]; os.makedirs(f'{W}/md', exist_ok=True); os.makedirs(f'{W}/match', exist_ok=True)
errs = 0
def get(url, path):
    global errs
    if os.path.exists(path) and os.path.getsize(path) > 1000: return open(path, errors='ignore').read()
    time.sleep(3)
    for k in range(3):
        try:
            t = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read().decode('utf8', 'ignore')
            open(path, 'w').write(t); errs = 0; return t
        except Exception as e:
            time.sleep(10 * (k + 1))
    errs += 1
    if errs >= 5: print('PARAR: 5 erros seguidos'); sys.exit(1)
    return ''
def lines(t): return [l.strip() for l in html.unescape(re.sub('<[^>]+>', '\n', re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S))).split('\n') if l.strip()]
out = json.load(open(f'{W}/matches.json')) if os.path.exists(f'{W}/matches.json') else {}
for s in ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26', '2026-27']:
    for comp in ['serie-a', 'serie-a-playoff']:
        for md in range(1, 31):
            t = get(f'https://divisionecalcioa5.it/{comp}/?md={md}&season={s}', f'{W}/md/{s}_{md}.html' if comp == 'serie-a' else f'{W}/md/po_{s}_{md}.html')
            L = lines(t); hd = [l for l in L if l.startswith('Giornata ') or l.startswith('Turno') or '—' in l and s in l]
            ids = sorted(set(m.group(1) for m in re.finditer(r'match_id=([0-9.]+_[A-Z0-9.]+)&(?:#038;|amp;)?season=' + s, t)))
            if not ids: break
            for mid in ids:
                key = f'{s}/{mid}'
                if key in out: continue
                ML = lines(get(f'https://divisionecalcioa5.it/partita/?match_id={mid}&season={s}', f'{W}/match/{s}_{mid}.html'))
                try:
                    i = next(k for k, l in enumerate(ML) if re.fullmatch(r'\d+ - \d+', l) and k + 2 < len(ML) and ML[k + 2] in ('TERMINATA',) or re.fullmatch(r'\d+ - \d+', l) and 'Partita' in ML[k - 2])
                except StopIteration: continue
                home, away, score = ML[i - 1], ML[i + 1], ML[i]
                # golos: depois da linha "Serie A · ..." pares (apelido, "7'45'', 19'02''") até "Timeline partita"
                j = next((k for k in range(i, i + 6) if '·' in ML[k]), i + 3) + 1
                goals = {}
                while j + 1 < len(ML) and ML[j] != 'Timeline partita':
                    if re.match(r"\d+'", ML[j + 1]): goals[ML[j]] = goals.get(ML[j], 0) + ML[j + 1].count(',') + 1; j += 2
                    else: j += 1
                # fichas: a partir da 2.ª ocorrência do nome da casa até "Allenatore:"
                teams = {}
                for side, name in (('h', home), ('a', away)):
                    tl = ML.index('Timeline partita') if 'Timeline partita' in ML else i
                    occ = [k for k, l in enumerate(ML) if l == name and k > tl]
                    k = occ[0] + 1 if occ else len(ML); pl = []
                    while k < len(ML) and not ML[k].startswith('Allenatore'):
                        m = re.fullmatch(r'(\d+) (.+)', ML[k])
                        if m: pl.append({'n': int(m.group(1)), 'name': m.group(2), 'y': 0, 'r': 0, 'sub': False})
                        elif pl and '🔁' in ML[k]: pl[-1]['sub'] = True
                        elif pl and '🟨' in ML[k]: pl[-1]['y'] += 1
                        elif pl and '🟥' in ML[k]: pl[-1]['r'] += 1
                        k += 1
                    for q, x in enumerate(pl): x['played'] = q < 5 or x['sub']  # 5 iniciais + quem entrou (🔁)
                    teams[side] = {'team': name, 'players': pl}
                out[key] = {'score': score, 'h': teams['h'], 'a': teams['a'], 'goals': goals, 'comp': comp}
            json.dump(out, open(f'{W}/matches.json', 'w'), ensure_ascii=False)
        print(s, comp, len([k for k in out if k.startswith(s)]), 'jogos', flush=True)
print('fim')
