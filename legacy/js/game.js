/* ============ THE GAME — crew record, ranks, reels, sound ============
   Everything the visitor earns lives in one can: localStorage 'parrv-lot'.
   The film never depends on this; strip the file and the reel still plays. */
(function(){
'use strict';
const $=s=>document.querySelector(s);
const FILM=window.FILM||{};
const quiet=!!FILM.instant; /* shot mode: states render, nothing performs */

/* ---------- the can ---------- */
const KEY='parrv-lot';
const blank={xp:0,seen:{},reels:{},medals:{},best:{},ach:[],sound:false,lastVisit:'',replays:{}};
let st=blank;
try{ st=Object.assign({},blank,JSON.parse(localStorage.getItem(KEY))||{}); }catch(_){}
function save(){ try{ localStorage.setItem(KEY,JSON.stringify(st)); }catch(_){} }

const RANKS=[['PA',0],['2ND AC',100],['1ST AC',250],['OPERATOR',500],['DP',850],['DIRECTOR',1200]];
const DEPT_GATE={ad:1,camera:2,edit:4,runner:6};
const DEPT_NAME={ad:'AD DEPT',camera:'CAMERA DEPT',edit:'EDITORIAL',runner:'TRANSPORT'};
const ACH={
  'first-slate':'First slate — a scene shot',
  'day-player':'Day player — first stage entered',
  'checking-the-gate':'Checking the gate — all six stages',
  'martini-shot':'Martini shot — every scene on the lot',
  'one-for-safety':'One for safety — a game replayed',
  'full-crew':'Full crew — a medal in every department',
  'turnaround':'Turnaround — came back another day',
  'final-cut':'Final cut — rank of director'
};

function rank(){ let r=RANKS[0]; for(const q of RANKS) if(st.xp>=q[1]) r=q; return r; }
function nextRank(){ for(const q of RANKS) if(st.xp<q[1]) return q; return null; }
function reelCount(){ return Object.values(st.reels).filter(Boolean).length; }
function deptUnlocked(d){ return reelCount()>=DEPT_GATE[d]; }

/* ---------- the tannoy: one toast at a time, queued ---------- */
const toastEl=$('#toast');
let tQ=[],tBusy=false;
function toast(msg){
  if(quiet||!toastEl) return;
  tQ.push(msg); if(!tBusy) tNext();
}
function tNext(){
  const m=tQ.shift();
  if(m===undefined){ tBusy=false; return; }
  tBusy=true;
  toastEl.textContent=m; toastEl.classList.add('show');
  setTimeout(()=>{ toastEl.classList.remove('show'); setTimeout(tNext,500); },2600);
}

/* ---------- projection sound: synthesized, MOS until asked ---------- */
let ac=null,master=null,whir=null;
function ctx(){
  if(ac) return ac;
  ac=new (window.AudioContext||window.webkitAudioContext)();
  master=ac.createGain(); master.gain.value=.5; master.connect(ac.destination);
  return ac;
}
function env(node,t0,a,peak,d){ node.gain.setValueAtTime(0,t0); node.gain.linearRampToValueAtTime(peak,t0+a); node.gain.exponentialRampToValueAtTime(.0001,t0+a+d); }
function tone(f,dur,peak,type){ const a=ctx(),o=a.createOscillator(),g=a.createGain();
  o.type=type||'sine'; o.frequency.value=f; o.connect(g); g.connect(master);
  env(g,a.currentTime,.008,peak,dur); o.start(); o.stop(a.currentTime+dur+.1); }
function noise(dur,peak,f0,q){ const a=ctx(),len=(a.sampleRate*dur)|0,b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++) d[i]=Math.random()*2-1;
  const src=a.createBufferSource(),bp=a.createBiquadFilter(),g=a.createGain();
  src.buffer=b; bp.type='bandpass'; bp.frequency.value=f0; bp.Q.value=q||1;
  src.connect(bp); bp.connect(g); g.connect(master);
  env(g,a.currentTime,.003,peak,dur); src.start(); }
const SFX={
  blip:()=>tone(660,.06,.12,'square'),
  tick:()=>tone(1180,.03,.06,'square'),
  clack:()=>{ noise(.08,.5,2400,.8); tone(180,.06,.2,'triangle'); },
  chime:()=>{ tone(659,.35,.14); setTimeout(()=>tone(988,.5,.12),110); },
  kachunk:()=>{ tone(82,.16,.3,'triangle'); setTimeout(()=>noise(.05,.3,1600,2),90); },
  miss:()=>tone(196,.18,.12,'triangle'),
  wrap:()=>{ tone(523,.3,.12); setTimeout(()=>tone(659,.3,.12),140); setTimeout(()=>tone(784,.6,.12),280); }
};
function whirOn(){
  if(whir||!st.sound) return;
  const a=ctx(),len=a.sampleRate*2,b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);
  let last=0; for(let i=0;i<len;i++){ last=(last+(Math.random()*2-1)*.02)*.995; d[i]=last*3; }
  const src=a.createBufferSource(),lp=a.createBiquadFilter(),g=a.createGain(),lfo=a.createOscillator(),lg=a.createGain();
  src.buffer=b; src.loop=true; lp.type='lowpass'; lp.frequency.value=520;
  g.gain.value=.045; lfo.frequency.value=11.5; lg.gain.value=.012;
  lfo.connect(lg); lg.connect(g.gain);
  src.connect(lp); lp.connect(g); g.connect(master);
  src.start(); lfo.start(); whir={src,lfo,g};
}
function whirOff(){ if(!whir) return; try{ whir.src.stop(); whir.lfo.stop(); }catch(_){} whir=null; }
function play(n){ if(!st.sound||quiet||!SFX[n]) return; try{ SFX[n](); }catch(_){} }

const mosBtn=$('#mos-btn');
function mosPaint(){
  if(!mosBtn) return;
  mosBtn.textContent=st.sound?'SND':'MOS';
  mosBtn.setAttribute('aria-pressed',String(st.sound));
  mosBtn.setAttribute('aria-label',st.sound?'Sound — on':'Sound — currently muted (MOS)');
}
if(mosBtn) mosBtn.addEventListener('click',()=>{
  st.sound=!st.sound; save(); mosPaint();
  if(st.sound){ ctx().resume&&ctx().resume(); play('blip'); whirOn(); } else whirOff();
});

/* ---------- earnings ---------- */
const subs=[];
function onChange(cb){ subs.push(cb); }
function emit(){ subs.forEach(cb=>{ try{cb(st);}catch(_){}}); paintRank(); }

function paintRank(){
  const r=rank(),el=$('#rank-hud');
  if(!el) return;
  $('#rank-name').textContent=r[0];
  $('#rank-xp').textContent=st.xp+' XP';
}
function xp(n,label){
  const before=rank()[0];
  st.xp+=n; save();
  if(label) toast('+'+n+' XP · '+label);
  const after=rank()[0];
  if(after!==before){ toast('PROMOTED · '+after); play('wrap');
    if(after==='DIRECTOR') ach('final-cut'); }
  emit();
}
function ach(id){
  if(st.ach.includes(id)||!ACH[id]) return;
  st.ach.push(id); save();
  toast('ACHIEVEMENT · '+ACH[id].split(' — ')[0].toUpperCase());
  play('chime');
  xp(25,null); /* every achievement pays scale */
}
function see(id){
  if(st.seen[id]) return false;
  st.seen[id]=true; save();
  if(Object.keys(st.seen).length===1) ach('first-slate');
  return true;
}
function reelCheck(stage,ids){
  if(st.reels[stage]) return false;
  if(!ids.every(i=>st.seen[i])) return false;
  st.reels[stage]=true; save();
  const had=reelCount();
  toast('REEL STRUCK · STAGE '+stage.toUpperCase());
  play('chime');
  xp(50,null);
  Object.keys(DEPT_GATE).forEach(d=>{
    if(DEPT_GATE[d]===had){ toast('POWER ON · '+DEPT_NAME[d]); play('kachunk'); }
  });
  emit();
  return true;
}
function medal(dept,tier,score){
  /* tier: bronze|silver|gold; keep the best tier, always keep the best score */
  const order={none:0,bronze:1,silver:2,gold:3};
  const prev=st.medals[dept]||'none';
  if((st.best[dept]===undefined)||score>st.best[dept]) st.best[dept]=score;
  if(order[tier]>order[prev]){
    st.medals[dept]=tier; save();
    toast(tier.toUpperCase()+' · '+DEPT_NAME[dept]);
    xp({bronze:25,silver:50,gold:100}[tier],null);
    if(['ad','camera','edit','runner'].every(d=>st.medals[d])) ach('full-crew');
  } else save();
  emit();
}
function replay(dept){
  if(st.replays[dept]) ach('one-for-safety');
  st.replays[dept]=(st.replays[dept]||0)+1; save();
}

/* ---------- the call sheet ---------- */
const sheetBtn=$('#sheet-btn');
let sheet=null;
function buildSheet(){
  if(sheet) return sheet;
  sheet=document.createElement('div');
  sheet.id='sheet'; sheet.className='paper'; sheet.hidden=true;
  sheet.setAttribute('aria-label','Call sheet — your crew record');
  document.body.appendChild(sheet);
  return sheet;
}
function paintSheet(){
  const s=buildSheet(),r=rank(),nx=nextRank();
  const reels='abcdef'.split('').map(k=>'<i class="'+(st.reels[k]?'got':'')+'"></i>').join('');
  const meds=['ad','camera','edit','runner'].map(d=>{
    const m=st.medals[d]||'—',b=st.best[d];
    return '<div class="sh-row"><span>'+DEPT_NAME[d]+'</span><b>'+(m==='—'?'NO TAKE':m.toUpperCase()+(b!==undefined?' · '+b:''))+'</b></div>';
  }).join('');
  const achs=Object.keys(ACH).map(id=>'<div class="ach'+(st.ach.includes(id)?'':' miss')+'">'+(st.ach.includes(id)?'▪':'▫')+' '+ACH[id]+'</div>').join('');
  s.innerHTML='<div class="paper-head"><span>Call sheet</span><span>'+
    new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase()+
    '<button type="button" class="x" data-cursor="link">Close</button></span></div>'+
    '<div class="sh-row"><span>Crew rank</span><b>'+r[0]+'</b></div>'+
    '<div class="xpbar"><i style="width:'+(nx?Math.min(100,(st.xp-r[1])/(nx[1]-r[1])*100):100)+'%"></i></div>'+
    '<div class="xpnext">'+st.xp+' XP'+(nx?' · '+(nx[1]-st.xp)+' to '+nx[0]:' · top of the crew list')+'</div>'+
    '<div class="sh-row" style="margin-top:10px"><span>Stage reels</span><b>'+reelCount()+' / 6</b></div>'+
    '<div class="reelrow">'+reels+'</div>'+meds+achs+
    '<button type="button" class="sh-act" id="wrap-btn" data-cursor="link">Print the wrap report</button>';
  s.querySelector('.x').addEventListener('click',()=>sheetToggle(false));
  s.querySelector('#wrap-btn').addEventListener('click',wrapReport);
}
function sheetToggle(open){
  const s=buildSheet();
  const o=open===undefined?s.hidden:open;
  if(o) paintSheet();
  s.hidden=!o;
  if(sheetBtn) sheetBtn.setAttribute('aria-expanded',String(o));
}
if(sheetBtn){
  sheetBtn.addEventListener('click',()=>sheetToggle());
  addEventListener('keydown',e=>{ if(e.key==='Escape'&&sheet&&!sheet.hidden){ sheetToggle(false); sheetBtn.focus(); } });
  document.addEventListener('pointerdown',e=>{
    if(sheet&&!sheet.hidden&&!sheet.contains(e.target)&&!sheetBtn.contains(e.target)) sheetToggle(false);
  });
}

/* ---------- the wrap report: a printable answer card ---------- */
function wrapReport(){
  const W=1200,H=630,cv=document.createElement('canvas');
  cv.width=W; cv.height=H;
  const x=cv.getContext('2d'),r=rank();
  x.fillStyle='#0E0F0D'; x.fillRect(0,0,W,H);
  /* matte bars */
  x.fillStyle='#060606'; x.fillRect(0,0,W,64); x.fillRect(0,H-64,W,64);
  x.strokeStyle='rgba(142,149,141,.35)';
  x.beginPath(); x.moveTo(0,64.5); x.lineTo(W,64.5); x.moveTo(0,H-64.5); x.lineTo(W,H-64.5); x.stroke();
  x.fillStyle='#8E958D'; x.font='16px "Courier Prime",monospace'; x.textBaseline='middle';
  x.fillText('PARRV PICTURES · THE BACKLOT',36,33);
  x.textAlign='right'; x.fillText(new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase(),W-36,33);
  x.fillText('PARRVLUTHRA22.GITHUB.IO/PORTFOLIO3',W-36,H-31);
  x.textAlign='left'; x.fillText('WRAP REPORT',36,H-31);
  /* grain flecks */
  x.fillStyle='rgba(229,227,218,.05)';
  for(let i=0;i<900;i++) x.fillRect(Math.random()*W,64+Math.random()*(H-128),1,1);
  /* the card */
  x.fillStyle='#E5E3DA'; x.font='120px "League Gothic","Arial Narrow",sans-serif';
  x.fillText(r[0],36,208);
  x.fillStyle='#8E958D'; x.font='18px "Courier Prime",monospace';
  x.fillText(st.xp+' XP · CREW RANK',38,286);
  /* reels */
  'abcdef'.split('').forEach((k,i)=>{
    x.beginPath(); x.arc(48+i*44,356,12,0,7);
    if(st.reels[k]){ x.fillStyle='#E5E3DA'; x.fill(); }
    x.strokeStyle='#8E958D'; x.stroke();
  });
  x.fillStyle='#8E958D'; x.fillText(reelCount()+' / 6 STAGE REELS',312,357);
  /* medals */
  const seen=Object.keys(st.seen).length;
  x.fillText(seen+' SCENES SHOT',38,420);
  ['ad','camera','edit','runner'].forEach((d,i)=>{
    const m=(st.medals[d]||'—').toUpperCase();
    x.fillStyle=st.medals[d]?'#E5E3DA':'rgba(142,149,141,.5)';
    x.fillText(DEPT_NAME[d]+' · '+m,38,470+i*30);
  });
  const a=document.createElement('a');
  a.download='parrv-backlot-wrap-report.png';
  a.href=cv.toDataURL('image/png');
  a.click();
  play('wrap');
  toast('WRAP REPORT PRINTED');
}

/* ---------- boot ---------- */
document.body.classList.add('game-on');
['#rank-hud','#sheet-btn','#mos-btn','#pcut-btn'].forEach(s=>{ const el=$(s); if(el) el.hidden=false; });
mosPaint(); paintRank();
const today=new Date().toISOString().slice(0,10);
if(st.lastVisit&&st.lastVisit!==today) ach('turnaround');
st.lastVisit=today; save();
if(st.sound&&!quiet){ /* the projector can only speak after a gesture */
  const arm=()=>{ whirOn(); removeEventListener('pointerdown',arm); removeEventListener('keydown',arm); };
  addEventListener('pointerdown',arm); addEventListener('keydown',arm);
}

window.GAME={st,save,xp,see,reelCheck,medal,replay,ach,toast,play,
  rank,reelCount,deptUnlocked,onChange,sheetToggle,DEPT_GATE,DEPT_NAME};
})();
