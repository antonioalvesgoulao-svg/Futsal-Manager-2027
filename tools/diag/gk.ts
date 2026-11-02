// Medição do GR, remates e reposições (análise 3D, 1/11/2026). Uso: npx esbuild tools/diag/gk.ts --bundle --platform=node --format=esm --outfile=diagnostics/.gk.mjs && node diagnostics/.gk.mjs
import { newGame } from '../../src/core/state';
import { setupFor } from '../../src/core/game';
import { createMatch } from '../../src/core/engine/match';
import { Choreo } from '../../src/core/visual/choreo';
const PAIRS=[['slb','scp'],['scb','fun'],['lps','tor'],['bar','epz'],['int','jae'],['rav','uvn']];
const s=newGame('D','Portugal','slb');
const A:any={gkDepth:[],gkBisErr:[],gkSpd:[],gkAcc:[],gkStill:0,gkN:0,shotV:[],shotWin:[],dive:{goal:[0,0],saved:[0,0],wide:[0,0],post:[0,0]},preMove:0,shots:0,
 throwD:[],throwV:[],thrRecvFree:[],gkRestartDelay:[],caughtSpots:{} as any,passV:[],ballTeleport:0, gkBehindLine:0, gkOutsideArea:0};
const dist=(a:any,b:any)=>Math.hypot(a.x-b.x,a.y-b.y);
for(let g=0;g<6;g++){const [h,a]=PAIRS[g];const hs=setupFor(s,h),as=setupFor(s,a);
 const m=createMatch(hs,as,{seed:'gk'+g});let start:any=null;
 const pl=Object.fromEntries([...hs.squad,...as.squad].map(p=>[p.id,p]));
 while(m.step()){const sn=m.snapshot();if(!sn.possession){start=null;continue;}
  const P=sn.possession; const c:any=new Choreo(P,[hs.tactics,as.tactics],sn.period,start,m.names,pl); start=c.end;
  const gkD=c.gkD, dir=c.dirA; const goal={x:dir*20,y:0};
  // GR defensor durante o jogo corrido
  let prevP:any=null,prevV=0;
  for(let t=0;t<=c.duration;t+=0.1){const f=c.at(c.lead+t); if(!gkD||!f.pos[gkD]||f.stoppage) {prevP=null;continue;}
   const q=f.pos[gkD], b=f.ball; A.gkN++;
   A.gkDepth.push(Math.abs(goal.x-q.x));
   if(Math.abs(goal.x-q.x)<0) A.gkBehindLine++;
   if(Math.abs(goal.x-q.x)>6.2) A.gkOutsideArea++;
   // erro em relação à bissetriz (ângulo bola-poste esq / bola-poste dir): distância lateral da linha bola->centro
   const bx=b.x-goal.x, by=b.y; const L=Math.hypot(bx,by)||1; const qx=q.x-goal.x, qy=q.y;
   A.gkBisErr.push(Math.abs((qx*by-qy*bx)/L));
   if(prevP){const v=dist(q,prevP)/0.1; A.gkSpd.push(v); A.gkAcc.push(Math.abs(v-prevV)/0.1); prevV=v; if(v<0.3)A.gkStill++;}
   prevP=q;}
  // enquadramento do GR no instante do remate: distância ao ponto ideal (bissetriz) e primeiro poste aberto
  for(const x of c.acts) if(x.kind==='shoot'){ const sd=c.sideOf.get(x.id); const gk=c.p.onCourt[1-sd][0]; if(!gk||c.p.flying[1-sd]) continue;
    const fly=c.balls.find((b:any)=>b.k==='fly'&&b.from===x.id&&b.t0>x.t0&&b.t0<x.t1); if(!fly) continue; const T=fly.t0;
    const sp=c.tr.get(x.id).at(T), gp=c.tr.get(gk).at(T); const gx=Math.sign(fly.b.x)*20;
    const dl=Math.hypot(gx-sp.x,sp.y); const ideal=c.gkSpot(gx,sp,Math.abs(sp.y)>1.3&&Math.abs(gx-sp.x)<Math.abs(sp.y)*1.2?0.35:Math.min(2.2,0.45+dl*0.12));
    (A.frame ||= []).push(dist(gp,ideal)); if(dist(gp,ideal)>2){ const sh=c.p.actions.find((a:any)=>a.type==='shot'&&a.shooter===x.id); const ph=c.phases.filter((q:any)=>q.t<=T).pop()?.text; (A.bad ||= {}); const k=(sh?.kind||'?')+' / '+ph+' / fixo:'+c.isFixed(gk,T-0.5)+' / dist '+Math.round(dl); A.bad[k]=(A.bad[k]||0)+1;  }
    // poste mais próximo da bola: ângulo livre entre o poste e o GR (visto da bola), em graus
    const post={x:gx,y:Math.sign(sp.y||1)*1.5}; const aP=Math.atan2(post.y-sp.y,post.x-sp.x), aG=Math.atan2(gp.y-sp.y,gp.x-sp.x);
    let gap=Math.abs(aP-aG)*180/Math.PI; if(gap>180) gap=360-gap; (A.nearGap ||= []).push(gap);
    if (Math.abs(gx-gp.x) > Math.abs(gx-sp.x)) A.gkBeyond=(A.gkBeyond||0)+1; A.nShots2=(A.nShots2||0)+1; }
  // remates
  for(const b of c.balls) if(b.k==='fly' && typeof b.from==='string' && c.acts.some((x:any)=>x.kind==='shoot'&&x.id===b.from&&b.t0>x.t0&&b.t0<x.t1)){
    const fp=c.tr.get(b.from).at(b.t0); const d=Math.hypot(b.b.x-fp.x,b.b.y-fp.y); A.shotV.push(d/(b.t1-b.t0)); A.shots++;}
  for(const x of P.actions) if(x.type==='shot' && x.result && A.dive[x.result]) {A.dive[x.result][1]++;}
  for(const x of c.acts) if(['dive','splits','spread','catch'].includes(x.kind)){ /* ver início vs remate */
    const hit=c.balls.find((b:any)=>b.k==='fly'&&typeof b.from==='string'&&c.acts.some((y:any)=>y.kind==='shoot'&&y.id===b.from&&b.t0>y.t0&&b.t0<y.t1)&&b.t0<=x.t0+0.6&&b.t0>=x.t0-1.2); if(hit&&x.t0<=hit.t0+0.01&&!c.isFixed(x.id,hit.t0-0.85)) A.preMove++; }
  // reposições: lançamentos com a mão
  for(const x of c.acts) if(x.kind==='throw'){ const pb=c.balls.find((b:any)=>b.k==='pass'&&b.from===x.id&&b.t0>=x.t0-0.01&&b.t0<=x.t1+0.7);
    if(!pb) continue; const fp=c.tr.get(pb.from).at(pb.t0), tp=c.tr.get(pb.to).at(pb.t1); const d=dist(fp,tp); A.throwD.push(d); A.throwV.push(d/(pb.t1-pb.t0));
    const f=c.at(c.lead+pb.t1); const side=c.sideOf.get(pb.to); let md=99; for(const [id,q] of Object.entries(f.pos) as any) if(c.sideOf.get(id)===1-side) if(id!==c.p.onCourt[1-side][0]) md=Math.min(md,dist(q,tp)); A.thrRecvFree.push(md); (A.thrKind ||= {}); const kk=x.t0<0.2?'reposicao':'agarrou'; (A.thrKind[kk] ||= []).push(md);
    if(x.t0<0.5) A.gkRestartDelay.push(x.t1+c.lead); }
  for(const b of c.balls) if(b.k==='pass'){const fp=c.tr.get(b.from)?.at(b.t0), tp=c.tr.get(b.to)?.at(b.t1); if(fp&&tp) A.passV.push(dist(fp,tp)/(b.t1-b.t0));}
 }}
const q=(a:number[],p:number)=>{const s=[...a].sort((x,y)=>x-y);return +(s[Math.floor(s.length*p)]??0).toFixed(2)};
const st=(a:number[])=>`med ${q(a,.5)} p10 ${q(a,.1)} p90 ${q(a,.9)} n ${a.length}`;
console.log('GR profundidade (m da linha):',st(A.gkDepth),' fora da área %',(100*A.gkOutsideArea/A.gkN).toFixed(1));
console.log('GR erro lateral à linha bola-centro da baliza (m):',st(A.gkBisErr));
console.log('GR velocidade m/s:',st(A.gkSpd),' parado %',(100*A.gkStill/A.gkN).toFixed(1));
console.log('GR aceleração m/s2:',st(A.gkAcc));
console.log('GR no remate: distância ao ponto certo (m):',st(A.frame),' ângulo livre ao 1.º poste (graus):',st(A.nearGap),' GR à frente do rematador:',A.gkBeyond||0,'de',A.nShots2);
console.log(JSON.stringify(A.bad,null,0));
console.log('Remates velocidade bola m/s:',st(A.shotV),' km/h med',(q(A.shotV,.5)*3.6).toFixed(0));
console.log('Gesto do GR começa antes/no remate (n):',A.preMove,'de',A.shots);
console.log('Lançamentos GR distância m:',st(A.throwD),' vel m/s:',st(A.throwV));
console.log('Recetor do lançamento: adversário mais próximo m:',st(A.thrRecvFree));
for (const k in A.thrKind) console.log('  livre ao receber,',k,st(A.thrKind[k]));
console.log('Passes velocidade m/s:',st(A.passV));
