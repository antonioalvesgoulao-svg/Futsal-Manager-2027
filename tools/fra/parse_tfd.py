# França: lê as páginas do thefootdata guardadas pelo collect.py e escreve tools/fra/thefootdata.json com os planteis da equipa
# da D1 (1.ª tabela "Séniors M") por época (2024/25-2026/27: jogos, titularidades, golos, assistências, amarelos, vermelhos), os
# pavilhões declarados pelos clubes e os resultados. Uso: python3 tools/fra/parse_tfd.py <pasta de trabalho>
import json, os, re, sys, html, glob
W = sys.argv[1]
d = json.load(open(f'{W}/fra.json'))
squads = {}
for f in glob.glob(f'{W}/c/_clubs_*saison_effectif_*.html'):
    m = re.search(r'_clubs_(.+?)_onglet_effectif_saison_effectif_(\d+)', f)
    slug, y = m.group(1).replace('_', '-'), m.group(2)
    t = open(f, errors='ignore').read()
    if 'Séniors M' not in t: continue
    tb = t[t.index('Séniors M'):]
    if '<table' not in tb: continue
    tab = tb[tb.index('<table'):tb.index('</table>')]
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', tab, re.S)
    if not rows: continue
    cells = lambda r: [html.unescape(re.sub('<[^>]+>', ' ', c)).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.S)]
    head = cells(rows[0])
    out = []
    for r in rows[1:]:
        c = cells(r)
        if len(c) < 3: continue
        nm = re.sub(r'^[A-Z]{1,3}\s+', '', c[0]).split('  aussi')[0].split(' aussi :')[0].strip()
        row = {'nome': re.sub(r'\s+', ' ', nm)}
        for h, v in zip(head[1:], c[1:]):
            row[{'MJ': 'mj', 'Tit.': 'tit', 'Banc': 'banc', 'Buts': 'golos', 'Passes d.': 'assist', 'CJ': 'cj', 'CR': 'cr'}.get(h, h)] = int(v) if v.isdigit() else 0
        out.append(row)
    squads[f'{slug}|{y}'] = out
json.dump({'_info': 'thefootdata.com (dados FFF), recolha 4/11/2026: planteis da equipa sénior da D1 por época, pavilhões declarados e resultados 2021/22-2026/27', 'squads': squads, 'venues': d['venues'], 'matches': d['matches']}, open('tools/fra/thefootdata.json', 'w'), ensure_ascii=False)
for k in sorted(squads): print(k, len(squads[k]), squads[k][:1])
