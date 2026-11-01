# Lê as páginas da RFEF (futsal.rfef.es) guardadas: pavilhão, lotação, cidade e plantel oficial 2026/27 (dorsal, nome, alcunha, nacionalidade, posição, estatísticas)
# Uso: python3 tools/esp/parse_rfef.py <pasta rfef>  → <pasta>/rfef.json
import re, json, sys, glob, html, hashlib
D = sys.argv[1]
urls = [u.strip() for u in open(f'{D}/urls.txt') if u.strip()]
out = {}
def cells(row): return [html.unescape(re.sub(r'<[^>]+>', ' ', c)).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S)]
for u in urls:
    rid = re.search(r'/(\d+)/2027/info', u).group(1)
    f = lambda kind: glob.glob(f"{D}/p_{hashlib.md5((u[:-5] + '/' + kind + chr(10)).encode()).hexdigest()[:10]}_{kind}.html")
    info, pl = f('info'), f('plantilla')
    if not info or not pl: print('falta', u); continue
    t = html.unescape(open(info[0], errors='ignore').read())
    x = ' | '.join(re.sub(r'<[^>]+>', ' | ', re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)).split(' | '))
    x = re.sub(r'\s+', ' ', x); x = re.sub(r'(\| ?)+', '| ', x)
    g = lambda k: (re.search(k + r' \| ([^|]+?) \|', x) or [None, None])[1]
    name = html.unescape(re.search(r'<title>([^<|]+)', t).group(1)).strip()
    p = open(pl[0], errors='ignore').read()
    body = p[p.find('<tbody'):p.find('</tbody>')]
    players = []; coach = []
    for row in re.findall(r'<tr>(.*?)</tr>', body, re.S):
        c = cells(row)
        nm = re.findall(r'<p[^>]*>(.*?)</p>', row, re.S)
        nm = [html.unescape(re.sub(r'<[^>]+>', '', n)).strip() for n in nm]
        if 'Entrenador' in row or 'Delegado' in row or 'Auxiliar' in row:
            role = re.search(r'ml10">([^<]+)<', row); coach.append({'name': nm[0] if nm else '', 'nick': nm[1] if len(nm) > 1 else '', 'role': role.group(1).strip() if role else ''}); continue
        iso = re.search(r'ISO Country Code - ([A-Z]{2})', row)
        num = c[0] if c and c[0].isdigit() else None
        nums = [int(v) for v in c if re.fullmatch(r'\d+', v)]
        pos = next((v for v in c if v in ('Portero', 'Cierre', 'Ala', 'Pivot', 'Ala/Pivot', 'Ala/Cierre', 'Universal')), '')
        st = nums[1:] if num else nums
        players.append({'num': int(num) if num else None, 'name': nm[0] if nm else '', 'nick': nm[1] if len(nm) > 1 else '', 'nat': iso.group(1) if iso else '', 'pos': pos,
                        'goals': st[0] if st else 0, 'red': (st[2] if len(st) > 2 else 0) + (st[3] if len(st) > 3 else 0), 'yellow': st[4] if len(st) > 4 else 0, 'games': (st[5] if len(st) > 5 else 0) + (st[6] if len(st) > 6 else 0)})
    out[rid] = {'name': name, 'arena': g('Pabellón'), 'capacity': g('Capacidad'), 'city': g('Ciudad'), 'players': players, 'staff': coach}
json.dump(out, open(f'{D}/rfef.json', 'w'), ensure_ascii=False, indent=1)
for k, v in out.items(): print(k, v['name'], '|', v['arena'], v['capacity'], v['city'], len(v['players']), [s['name'] + ':' + s['role'] for s in v['staff']][:4])
