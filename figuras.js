/* Figuras animadas de cada ejercicio.
   Cada ejercicio tiene dos posturas (a = inicio, b = final). Se interpolan
   la cadera, el ángulo del torso y los puntos de manos y pies; rodillas y codos
   salen por cinemática inversa, así los huesos nunca cambian de largo.
   Lienzo lógico 240 × 150, piso en y = 140. Ángulos en grados con y hacia abajo. */
(function(){
const LEN={torso:46,thigh:34,shin:34,upper:26,fore:24,head:15};
const P={
 prensa:{a:{hip:[90,105],tr:-135,ft:[121,79],hd:[100,108]},b:{ft:[142,61]},
  props:[['line',98,114,50,66,6],['line',98,114,116,114,6],['seg','ft',50,30,0,0,5],['line',118,98,186,40,2]]},
 banca:{a:{hip:[140,94],tr:180,ft:[176,140],hd:[100,80]},b:{hd:[96,46]},
  props:[['line',60,101,165,101,6],['line',72,101,72,140,3],['line',152,101,152,140,3],['db','hd']]},
 remo_apoyado:{kb:1,a:{hip:[92,112],tr:-40,ft:[74,140],hd:[130,128]},b:{hd:[118,100]},
  props:[['line',96,122,142,84,6],['line',118,104,118,140,3],['db','hd']]},
 hombro:{a:{hip:[115,108],tr:-92,ft:[146,140],hd:[124,50]},b:{hd:[118,14]},
  props:[['line',100,113,132,113,6],['line',104,113,103,48,6],['line',116,113,116,140,3],['db','hd']]},
 femoral:{a:{hip:[110,100],tr:-95,ft:[178,102],hd:[118,104]},b:{ft:[132,130]},
  props:[['line',90,107,142,107,6],['line',94,107,86,52,6],['seg','ft',90,14,0,0,6],['line',116,107,116,140,3]]},
 plancha:{a:{hip:[100,124],tr:-13,ft:[30,140],hd:[169,140]},b:{hip:[100,121]},props:[]},
 goblet:{a:{hip:[120,72],tr:-88,ft:[122,140],hd:[129,42]},b:{hip:[102,112],tr:-62,hd:[132,78]},
  props:[['db','hd',8]]},
 jalon:{a:{hip:[120,110],tr:-95,ft:[150,140],hd:[128,16]},b:{hd:[124,66]},
  props:[['line',100,116,140,116,6],['line',134,94,152,94,6],['line',120,116,120,140,3],['cable',128,0,'hd'],['seg','hd',0,22,0,0,4]]},
 inclinado:{a:{hip:[130,110],tr:210,ft:[170,140],hd:[96,72]},b:{hd:[92,40]},
  props:[['line',72,96,138,124,6],['line',128,120,128,140,3],['db','hd']]},
 hipthrust:{a:{hip:[118,126],tr:-152,ft:[150,140],hd:[118,120]},b:{hip:[128,102],tr:-180,hd:[128,96]},
  props:[['line',58,108,90,108,6],['line',74,108,74,140,3],['bar','hd']]},
 laterales:{a:{hip:[120,72],tr:-90,sw:22,hw:12,ft:[128,140],ft2:[112,140],hd:[133,78],hd2:[107,78]},b:{hd:[178,30],hd2:[62,30]},
  eb2:-1,kb2:1,props:[['db','hd'],['db','hd2']]},
 biceps:{a:{hip:[120,72],tr:-90,ft:[122,140],hd:[123,76]},b:{hd:[129,31]},props:[['db','hd']]},
 triceps:{a:{hip:[115,72],tr:-82,ft:[118,140],hd:[140,44]},b:{hd:[128,74]},
  props:[['cable',152,0,'hd'],['seg','hd',90,10,0,0,4]]},
 lateral_plank:{a:{hip:[98,124],tr:-18,ft:[30,140],hd:[163,139],hd2:[104,116]},b:{hip:[98,116],hd2:[104,108]},props:[]},
 split:{a:{hip:[118,82],tr:-90,ft:[150,140],ft2:[84,140],hd:[120,84]},b:{hip:[116,112],hd:[118,114]},
  props:[['db','hd']]},
 remo_polea:{a:{hip:[90,118],tr:-90,ft:[156,118],hd:[138,82]},b:{hd:[104,96]},
  props:[['line',70,124,110,124,6],['line',162,96,162,136,6],['cable',166,104,'hd'],['seg','hd',90,10,0,0,4]]},
 press_maquina:{a:{hip:[100,112],tr:-95,ft:[134,140],hd:[116,72]},b:{hd:[144,70]},
  props:[['line',86,118,126,118,6],['line',90,118,84,54,6],['line',104,118,104,140,3],['seg','hd',90,12,0,0,5]]},
 cuadriceps:{a:{hip:[110,104],tr:-95,ft:[136,136],hd:[118,108]},b:{ft:[176,96]},
  props:[['line',90,111,142,111,6],['line',94,111,86,56,6],['line',112,111,112,140,3],['seg','ft',90,12,0,4,6]]},
 facepull:{a:{hip:[110,72],tr:-92,ft:[104,140],ft2:[122,140],hd:[156,30]},b:{hd:[126,15]},eb:-1,
  props:[['cable',204,24,'hd'],['seg','hd',90,10,0,0,4]]},
 gemelos:{a:{hip:[100,104],tr:-92,ft:[134,140],hd:[128,100]},b:{ft:[134,131]},
  props:[['line',80,111,124,111,6],['line',96,111,96,140,3],['seg','kn',0,18,4,-6,6],['line',128,141,152,141,5]]},
 deadbug:{a:{hip:[130,126],tr:180,ft:[164,92],hd:[86,78]},b:{hd:[40,116],ft2:[196,122]},
  props:[]}
};
P.deadbug.a.hd2=[86,78];P.deadbug.a.ft2=[164,92];

const lerp=(a,b,t)=>a+(b-a)*t;
const L2=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
const dir=(deg,len)=>[Math.cos(deg*Math.PI/180)*len,Math.sin(deg*Math.PI/180)*len];
const add=(p,v)=>[p[0]+v[0],p[1]+v[1]];
function ik(root,target,l1,l2,s){
  let dx=target[0]-root[0],dy=target[1]-root[1],d=Math.hypot(dx,dy);
  d=Math.min(l1+l2-.01,Math.max(Math.abs(l1-l2)+.01,d));
  const base=Math.atan2(dy,dx),a=Math.acos((l1*l1+d*d-l2*l2)/(2*l1*d));
  const j=[root[0]+Math.cos(base+s*a)*l1,root[1]+Math.sin(base+s*a)*l1];
  const end=[root[0]+Math.cos(base)*d,root[1]+Math.sin(base)*d];
  return [j,end];
}
function full(spec,k){
  const a=spec.a,p=Object.assign({},a,spec[k]||{});
  p.ft2=(spec[k]&&spec[k].ft2)||(k==='b'&&spec.b&&spec.b.ft&&!a.ft2?spec.b.ft:null)||a.ft2||p.ft;
  p.hd2=(spec[k]&&spec[k].hd2)||(k==='b'&&spec.b&&spec.b.hd&&!a.hd2?spec.b.hd:null)||a.hd2||p.hd;
  return p;
}
function pose(spec,t){
  const A=full(spec,'a'),B=full(spec,'b');
  const hip=L2(A.hip,B.hip,t),tr=lerp(A.tr,B.tr,t),sw=A.sw||0,hw=A.hw||0;
  const sh=add(hip,dir(tr,LEN.torso)),head=add(sh,dir(tr,LEN.head));
  const perp=dir(tr+90,1);
  const sh1=[sh[0]+perp[0]*sw/2,sh[1]+perp[1]*sw/2],sh2=[sh[0]-perp[0]*sw/2,sh[1]-perp[1]*sw/2];
  const hp1=[hip[0]+perp[0]*hw/2,hip[1]+perp[1]*hw/2],hp2=[hip[0]-perp[0]*hw/2,hip[1]-perp[1]*hw/2];
  const kb=spec.kb||-1,kb2=spec.kb2||kb,eb=spec.eb||1,eb2=spec.eb2||eb;
  const [kn,ft]=ik(hp1,L2(A.ft,B.ft,t),LEN.thigh,LEN.shin,kb);
  const [kn2,ft2]=ik(hp2,L2(A.ft2,B.ft2,t),LEN.thigh,LEN.shin,kb2);
  const [el,hd]=ik(sh1,L2(A.hd,B.hd,t),LEN.upper,LEN.fore,eb);
  const [el2,hd2]=ik(sh2,L2(A.hd2,B.hd2,t),LEN.upper,LEN.fore,eb2);
  return {hip,hp1,hp2,sh,sh1,sh2,head,kn,ft,kn2,ft2,el,hd,el2,hd2};
}
function css(name,fb){const v=getComputedStyle(document.documentElement).getPropertyValue(name).trim();return v||fb}
function draw(cv,id,t){
  const spec=P[id];if(!spec)return;
  const dpr=window.devicePixelRatio||1,w=cv.clientWidth,h=cv.clientHeight;
  if(!w||!h)return;
  if(cv.width!==Math.round(w*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
  const c=cv.getContext('2d'),sc=Math.min(w/240,h/150);
  c.setTransform(dpr*sc,0,0,dpr*sc,dpr*(w-240*sc)/2,dpr*(h-150*sc)/2);
  c.clearRect(-400,-400,1200,1200);
  const ink=css('--ink','#15181B'),muted=css('--muted','#5B636B'),line=css('--line','#D3D7D1'),plate=css('--plate','#F2B705');
  const j=pose(spec,t);
  c.lineCap='round';c.lineJoin='round';
  const seg=(pts,col,wd)=>{c.strokeStyle=col;c.lineWidth=wd;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.stroke()};
  seg([[4,141],[236,141]],line,2);
  spec.props.forEach(p=>{
    if(p[0]==='line')seg([[p[1],p[2]],[p[3],p[4]]],muted,p[5]||3);
    if(p[0]==='cable'){const e=j[p[3]];seg([[p[1],p[2]],e],muted,1.5);c.fillStyle=muted;c.beginPath();c.arc(p[1],p[2],5,0,7);c.fill()}
    if(p[0]==='seg'){const o=j[p[1]],cx=o[0]+(p[4]||0),cy=o[1]+(p[5]||0),v=dir(p[2],p[3]/2);seg([[cx-v[0],cy-v[1]],[cx+v[0],cy+v[1]]],muted,p[6]||4)}
  });
  // miembros del fondo, más claros
  seg([j.hp2,j.kn2,j.ft2],muted,5);seg([j.sh2,j.el2,j.hd2],muted,5);
  // cuerpo
  seg([j.hip,j.sh],ink,6);
  if(j.hp1[0]!==j.hip[0]||j.hp1[1]!==j.hip[1])seg([j.hp1,j.hp2],ink,6);
  if(j.sh1[0]!==j.sh[0]||j.sh1[1]!==j.sh[1])seg([j.sh1,j.sh2],ink,6);
  seg([j.hp1,j.kn,j.ft],ink,5.5);seg([j.sh1,j.el,j.hd],ink,5.5);
  c.fillStyle=ink;c.beginPath();c.arc(j.head[0],j.head[1],9,0,7);c.fill();
  spec.props.forEach(p=>{
    if(p[0]==='db'){const o=j[p[1]],r=p[2]||6;c.fillStyle=plate;c.strokeStyle=ink;c.lineWidth=1.5;c.beginPath();c.arc(o[0],o[1],r,0,7);c.fill();c.stroke()}
    if(p[0]==='bar'){const o=j[p[1]];c.fillStyle=plate;c.strokeStyle=ink;c.lineWidth=1.5;c.beginPath();c.arc(o[0],o[1]-4,11,0,7);c.fill();c.stroke()}
  });
}
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function phase(now){
  if(reduce)return 1;
  const p=(now%3000)/3000; // 3 s por repetición: sube, pausa, baja, pausa
  const tri=p<.4?p/.4:p<.5?1:p<.9?1-(p-.5)/.4:0;
  return tri*tri*(3-2*tri);
}
function loop(now){
  const t=phase(now);
  document.querySelectorAll('canvas[data-fig]').forEach(cv=>{
    const r=cv.getBoundingClientRect();
    if(r.bottom<0||r.top>innerHeight)return;
    draw(cv,cv.dataset.fig,t);
  });
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.FIG={P,draw,pose};
})();
