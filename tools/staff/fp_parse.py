# Lê as páginas de pessoas guardadas e produz fp_people.json: carreira por época (equipa, competições, J, golos, amarelos, vermelhos) e títulos
import re,html,json,glob,sys
def unw(x):
    if isinstance(x,list) and len(x)==2 and isinstance(x[1],dict) and 's' in x[1]: return unw(x[0])
    if isinstance(x,list): return [unw(i) for i in x]
    if isinstance(x,dict): return {k:unw(v) for k,v in x.items()}
    return x
out={}
for f in glob.glob('fpc/_en_playerpage_*.html'):
    pid=f.split('_')[-1][:-5]
    t=open(f).read()
    sn=re.findall(r'wire:snapshot="([^"]*)"',t)
    if not sn: continue
    d=unw(json.loads(html.unescape(sn[0]))['data'])
    seasons={str(x['id']):x['season'] for x in d['seasons']}
    per=d['person']; rows=[]
    car=d.get('career') or {}
    if isinstance(car,dict):
      for sid,byesc in car.items():
        if not isinstance(byesc,dict): continue
        for esc,blk in byesc.items():
            if not isinstance(blk,dict): continue
            for tb in blk.get('tables',[]):
                team=tb['team']['team']
                for typ,comps in (tb.get('types') or {}).items():
                    for cname,c in comps.items():
                        if cname=='zztt' or not isinstance(c,dict): continue
                        rows.append({'season':seasons.get(sid,sid),'esc':esc,'team':team,'comp':cname,'games':int(c.get('c') or 0),'goals':int(c.get('g') or 0),'yellow':int(c.get('y') or 0),'red':int(c.get('r') or 0)+int(c.get('dw') or 0)})
            staffroles=[x.get('staff') for x in blk.get('teams',[]) if x.get('staff')]
            for r in rows:
                pass
    roles={}
    if isinstance(car,dict):
      for sid,byesc in car.items():
        for esc,blk in (byesc.items() if isinstance(byesc,dict) else []):
            for tm in blk.get('teams',[]) if isinstance(blk,dict) else []:
                if tm.get('staff'): roles.setdefault(seasons.get(sid,sid),[]).append({'team':tm['team'],'role':tm['staff'],'esc':esc})
    pal=[{'name':p['name'],'seasons':p.get('seasons',[]),'count':p.get('count')} for p in (d.get('palmares') or []) if isinstance(p,dict)]
    palc=[{'name':p['name'],'seasons':p.get('seasons',[]),'count':p.get('count')} for p in (d.get('palmaresCoach') or []) if isinstance(p,dict)]
    rk={}
    ra=d.get('rankingsall') or {}
    if isinstance(ra,dict):
      for esc,bymc in ra.items():
        if esc!='1' or not isinstance(bymc,dict): continue
        for mc,bytype in bymc.items():
            for ty,x in (bytype.items() if isinstance(bytype,dict) else []):
                rk[mc]={'games':int(x.get('c1') or 0),'wins':int(x.get('v1') or 0),'goals':int(x.get('g1') or 0)}
    out[pid]={'rank':rk,'name':per['name'],'dob':(per.get('dob') or '')[:10],'country':(per.get('country') or {}).get('originname'),'role':per.get('role_name'),'rows':rows,'staffRoles':roles,'titles':pal,'titlesCoach':palc}
json.dump(out,open('fp_people.json','w'),ensure_ascii=False)
print(len(out))
