# Itália (Serie A 2026/27): junta as fontes reais nos ficheiros do jogo.
#  - divisionecalcioa5.it: plantel (nome, número, posição), nome completo, data de nascimento, carreira em Itália,
#    equipa técnica completa (treinador, adjunto, GR, físico, fisioterapeuta, analista…)
#  - futsalportugal.com (quando o jogador lá existe): nacionalidade, jogos/golos/cartões por época, títulos, treinadores
# Uso: python3 tools/ita/build_ita.py <pasta de trabalho com ita.json, players_off.json e fpc/>
# Gera src/data/ita/players.json, fpstats.json, coaches.json e staff.json.
import json, re, sys, os, html, unicodedata, difflib
W = sys.argv[1]
sys.argv = [sys.argv[0], W]
# reutiliza a leitura das páginas de pessoa do futsalportugal (mesmo formato de Espanha)
src = open('tools/esp/build_esp.py').read()
exec(src[:src.index('CLUBS = json.load')])  # define unw() e person() com SRC = W

CLUBS = json.load(open('src/data/ita/clubs.json'))['clubs']
SLUG = {c['slug']: c['id'] for c in CLUBS}
TEAMS = json.load(open(f'{W}/ita.json'))
OFF = json.load(open(f'{W}/players_off.json'))
NATS = {'Italy': 'Itália', 'Brazil': 'Brasil', 'Argentina': 'Argentina', 'Spain': 'Espanha', 'Portugal': 'Portugal', 'Paraguay': 'Paraguai',
        'Uruguay': 'Uruguai', 'Venezuela': 'Venezuela', 'Colombia': 'Colômbia', 'Croatia': 'Croácia', 'Serbia': 'Sérvia', 'Ukraine': 'Ucrânia',
        'Russia': 'Rússia', 'Morocco': 'Marrocos', 'France': 'França', 'Slovenia': 'Eslovénia', 'Norway': 'Noruega', 'Albania': 'Albânia',
        'Kazakhstan': 'Cazaquistão', 'Japan': 'Japão', 'Iran': 'Irão', 'Belgium': 'Bélgica', 'Netherlands': 'Países Baixos', 'Romania': 'Roménia',
        'Peru': 'Peru', 'Chile': 'Chile', 'Ecuador': 'Equador', 'Cape Verde': 'Cabo Verde', 'Angola': 'Angola', 'Poland': 'Polónia', 'Tunisia': 'Tunísia',
        'Algeria': 'Argélia', 'Libya': 'Líbia', 'Panama': 'Panamá', 'Costa Rica': 'Costa Rica', 'Guatemala': 'Guatemala', 'Cuba': 'Cuba'}
nrm = lambda s: re.sub(r'[^a-z ]', '', unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()).split()

def age_of(dob):  # 'dd-mm-aaaa' (oficial) ou 'aaaa-mm-dd' (futsalportugal)
    if not dob: return None
    m = re.fullmatch(r'(\d{2})-(\d{2})-(\d{4})', dob)
    y, md = (int(m.group(3)), f'{m.group(2)}-{m.group(1)}') if m else (int(dob[:4]), dob[5:10]) if dob[:4].isdigit() else (None, None)
    if not y: return None
    return 2026 - y - (1 if md > '07-01' else 0)

players, stats, coaches, staff = [], {}, [], []
nomatch = []
ROLE = {'Vice Allenatore': ('adjunto', 'Treinador-adjunto'), 'Allenatore in seconda': ('adjunto', 'Treinador-adjunto'), 'Preparatore Portieri': ('gr', 'Treinador guarda-redes'),
        'Preparatore Atletico': ('fisico', 'Preparador físico'), 'Fisioterapista': ('fisio', 'Fisioterapeuta'), 'Medico': ('fisio', 'Médico'), 'Massaggiatore': ('fisio', 'Massagista'),
        'Match Analyst': ('analista', 'Analista'), 'Video Analyst': ('analista', 'Analista'), 'Osservatore': ('scout', 'Scout'), 'Nutrizionista': ('nutricionista', 'Nutricionista'),
        'Psicologo': ('psicologo', 'Psicólogo'), 'Responsabile Settore Giovanile': ('formacao', 'Coordenador da formação'), 'Allenatore Under 19': ('formacao', 'Treinador sub-19'),
        'Direttore Sportivo': ('coordenador', 'Diretor desportivo'), 'Direttore Generale': ('coordenador', 'Diretor-geral'), 'Team Manager': ('outro', 'Team manager'),
        'Magazziniere': ('outro', 'Técnico de equipamentos')}
for slug, team in TEAMS.items():
    club = SLUG[slug]
    off = OFF.get(slug, [])
    for i, rp in enumerate(team['players']):
        o = next((x for x in off if x['number'] is not None and x['number'] == rp['number']), None)
        if not o:
            o = max(off, key=lambda x: difflib.SequenceMatcher(None, ' '.join(nrm(x['name'])), ' '.join(nrm(rp['name']))).ratio(), default=None)
            if o and difflib.SequenceMatcher(None, ' '.join(nrm(o['name'])), ' '.join(nrm(rp['name']))).ratio() < 0.5: o = None
        per = person(rp['fp']) if rp.get('fp') else None
        age = age_of(o and o.get('dob')) or age_of(per and per.get('dob'))
        nat = NATS.get((per or {}).get('country') or '', (per or {}).get('country')) if per else None
        pid = f'{club}{i + 1:02d}'
        p = {'id': pid, 'clubId': club, 'name': rp['name'], 'position': rp['role'], 'number': rp['number'], 'age': age or 25, 'nationality': nat or 'Itália'}
        if o and o['name'] != rp['name']: p['fullName'] = o['name']
        # épocas na Serie A desde 2021/22 (carreira oficial): usadas para o nível de quem não tem historial completo (estimativa)
        p['serieA'] = len({c['season'] for c in (o or {}).get('career', []) if c['season'] >= '2021-22' and c['comp'] == 'Serie A'})
        if not age: p['ageEstimated'] = True
        if not nat: p['nationalityEstimated'] = True
        players.append(p)
        if not per: nomatch.append(f'{club}: {rp["name"]}'); continue
        rows = [r for r in per['rows'] if r['esc'] == '1' and not re.search(r'Sele|National', r['team'])]
        recent = [r for r in rows if r['season'] >= '2021/2022']
        seasons = {}
        for r in rows:
            sy = r['season'][2:4]
            if sy < '21': continue
            x = seasons.setdefault((sy, r['team']), {'s': sy, 'team': r['team'], 'games': 0, 'goals': 0})
            x['games'] += r['games']; x['goals'] += r['goals']
        stats[pid] = {'fpId': rp['fp'], 'games': sum(r['games'] for r in recent), 'yellow': sum(r['yellow'] for r in recent), 'red': sum(r['red'] for r in recent),
                      'seasons': sorted(seasons.values(), key=lambda x: x['s'], reverse=True), 'titles': [f"{x['name']} ({', '.join(x['seasons'])})" for x in per['titles']],
                      'italy': [f"{c['season']} {c['team']} ({c['comp']})" for c in (o or {}).get('career', [])[:6]]}
    # equipa técnica real do site da liga; o treinador principal com o historial do futsalportugal quando existe
    for st in team['staff']:
        if st['role'] == 'Allenatore':
            per = person(st['fp']) if st.get('fp') else None
            G = W_ = 0.0; tp = 0; years = 0
            if per:
                for mc, x in per['rank'].items():
                    w = 1 if mc in ('34', '18', '39', '57') else 0.4
                    G += x['games'] * w; W_ += x['wins'] * w
                tp = sum((4 if 'Champions' in t['name'] else 3 if 'Serie A' in t['name'] or 'Liga' in t['name'] else 1.5) * (t.get('count') or 1) for t in per['titlesCoach'])
                years = len(per['roles'])
            wr = W_ / G if G else 0.45
            lvl = next(c['level'] for c in CLUBS if c['id'] == club)
            tac = round(min(20, (8 + wr * 9 + min(5, tp * 0.4) + min(2, years * 0.12)) if per else 8 + (lvl - 60) * 0.2))
            mot = round(min(20, (9 + wr * 7 + min(4, tp * 0.3)) if per else 9 + (lvl - 60) * 0.15))
            staff.append({'id': f'{club}-principal', 'club': club, 'name': st['name'], 'func': 'Treinador principal', 'role': 'principal', 'nat': (NATS.get(per['country'], per['country']) if per and per.get('country') else 'Itália'),
                          'birth': (per or {}).get('dob') or '?', 'src': 'divisionecalcioa5' + ('+fp' if per else ''), 'ability': max(8, min(20, tac)),
                          'history': [{'ep': s2, 'club': r['team'], 'func': r['role'], 'g': '?', 'w': '?', 'd': '?', 'l': '?', 'titles': '-'} for s2, rs in sorted((per or {}).get('roles', {}).items(), reverse=True) for r in rs if r['esc'] == '1'],
                          'coach': {'tactical': tac, 'motivation': mot}})
            coaches.append({'id': f'c_{club}', 'name': st['name'], 'clubId': club, 'tactical': tac, 'motivation': mot, 'discipline': 14, 'youth': 12, 'style': {}})
        elif st['role'] in ROLE:
            role, func = ROLE[st['role']]
            lvl = next(c['level'] for c in CLUBS if c['id'] == club)
            staff.append({'id': f"{club}-{role}-{len([x for x in staff if x['club'] == club and x['role'] == role]) + 1}", 'club': club, 'name': st['name'], 'func': func, 'role': role,
                          'nat': 'Itália', 'birth': '?', 'src': 'divisionecalcioa5', 'ability': max(6, min(16, round(6 + (lvl - 55) * 0.25))), 'history': []})

info = 'Serie A 2026/27: planteis, números, posições, datas de nascimento e equipas técnicas da Divisione Calcio a 5 (divisionecalcioa5.it) + historial do futsalportugal.com (recolha 2/11/2026, pedidos espaçados).'
json.dump({'_info': info + ' ageEstimated = sem data de nascimento (25 anos); nationalityEstimated = sem nacionalidade nas fontes (Itália, estimativa).', 'players': players}, open('src/data/ita/players.json', 'w'), ensure_ascii=False, indent=0)
json.dump({'_info': info + ' Jogos, golos e cartões por época desde 2021/22 e títulos (futsalportugal.com); carreira em Itália do site oficial.', 'players': stats}, open('src/data/ita/fpstats.json', 'w'), ensure_ascii=False, indent=0)
json.dump({'_info': info + ' tactical/motivation pelo historial quando existe, senão pelo nível do clube (estimativa); discipline/youth estimativa.', 'coaches': coaches}, open('src/data/ita/coaches.json', 'w'), ensure_ascii=False, indent=2)
json.dump({'_info': info + ' Equipa técnica completa do site oficial; ability é estimativa.', 'people': staff}, open('src/data/ita/staff.json', 'w'), ensure_ascii=False, indent=1)
print(len(players), 'jogadores;', len(stats), 'com historial do futsalportugal;', sum(1 for p in players if p.get('ageEstimated')), 'sem idade;',
      sum(1 for p in players if p.get('nationalityEstimated')), 'sem nacionalidade;', len(coaches), 'treinadores;', len(staff), 'pessoas na equipa técnica')
