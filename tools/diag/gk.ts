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
  // remates
  for(const b of c.balls) if(b.k==='fly' && typeof b.from==='string' && c.acts.some((x:any)=>x.kind==='shoot'&&x.id===b.from&&Math.abs(x.t0+0.28-b.t0)<0.01)){
    const fp=c.tr.get(b.from).at(b.t0); const d=Math.hypot(b.b.x-fp.x,b.b.y-fp.y); A.shotV.push(d/(b.t1-b.t0)); A.shots++;}
  for(const x of P.actions) if(x.type==='shot' && x.result && A.dive[x.result]) {A.dive[x.result][1]++;}
  for(const x of c.acts) if(['dive','splits','spread','catch'].includes(x.kind)){ /* ver início vs remate */
    const sh=c.acts.find((y:any)=>y.kind==='shoot'&&Math.abs(y.t0+0.28-(x.t0+0.05))<0.02); if(sh) A.preMove++; }
  // reposições: lançamentos com a mão
  for(const x of c.acts) if(x.kind==='throw'){ const pb=c.balls.find((b:any)=>b.k==='pass'&&b.from===x.id&&b.t0>=x.t0-0.01&&b.t0<=x.t1+0.7);
    if(!pb) continue; const fp=c.tr.get(pb.from).at(pb.t0), tp=c.tr.get(pb.to).at(pb.t1); const d=dist(fp,tp); A.throwD.push(d); A.throwV.push(d/(pb.t1-pb.t0));
    const f=c.at(c.lead+pb.t1); const side=c.sideOf.get(pb.to); let md=99; for(const [id,q] of Object.entries(f.pos) as any) if(c.sideOf.get(id)===1-side) if(id!==c.p.onCourt[1-side][0]) md=Math.min(md,dist(q,tp)); A.thrRecvFree.push(md);
    if(x.t0<0.5) A.gkRestartDelay.push(x.t1+c.lead); }
  for(const b of c.balls) if(b.k==='pass'){const fp=c.tr.get(b.from)?.at(b.t0), tp=c.tr.get(b.to)?.at(b.t1); if(fp&&tp) A.passV.push(dist(fp,tp)/(b.t1-b.t0));}
 }}
const q=(a:number[],p:number)=>{const s=[...a].sort((x,y)=>x-y);return +(s[Math.floor(s.length*p)]??0).toFixed(2)};
const st=(a:number[])=>`med ${q(a,.5)} p10 ${q(a,.1)} p90 ${q(a,.9)} n ${a.length}`;
console.log('GR profundidade (m da linha):',st(A.gkDepth),' fora da área %',(100*A.gkOutsideArea/A.gkN).toFixed(1));
console.log('GR erro lateral à linha bola-centro da baliza (m):',st(A.gkBisErr));
console.log('GR velocidade m/s:',st(A.gkSpd),' parado %',(100*A.gkStill/A.gkN).toFixed(1));
console.log('GR aceleração m/s2:',st(A.gkAcc));
console.log('Remates velocidade bola m/s:',st(A.shotV),' km/h med',(q(A.shotV,.5)*3.6).toFixed(0));
console.log('Gesto do GR começa antes/no remate (n):',A.preMove,'de',A.shots);
console.log('Lançamentos GR distância m:',st(A.throwD),' vel m/s:',st(A.throwV));
console.log('Recetor do lançamento: adversário mais próximo m:',st(A.thrRecvFree));
console.log('Reposição: tempo até lançar (s):',st(A.gkRestartDelay));
console.log('Passes velocidade m/s:',st(A.passV));
