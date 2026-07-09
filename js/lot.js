/* ============ THE LOT — studio plan, sound stages, producer's cut ============
   The static filmography in #lot-data is the single source of truth: this file
   reads it, raises the plan over it, and hands the sheet itself to the producer. */
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const FILM=window.FILM||{}, GAME=window.GAME;
if(!GAME) return;
const quiet=!!FILM.instant, reduced=!!FILM.reduced;
const shotTarget=FILM.shot||null;

/* ---------- read the sheet ---------- */
const STAGES=$$('#lot-data .unit').map(u=>({
  key:u.dataset.stage,
  letter:u.dataset.stage.toUpperCase(),
  unit:u.dataset.unit,
  domain:u.dataset.domain,
  projects:[...u.querySelectorAll('li')].map(li=>({
    id:li.dataset.id,
    name:li.querySelector('b').textContent,
    logline:(()=>{ let n=li.querySelector('b').nextSibling,t='';
      while(n&&n.nodeType===3){ t+=n.textContent; n=n.nextSibling; }
      return t.replace(/^\s*—\s*/,'').trim(); })(),
    still:li.dataset.still, board:!!li.dataset.board, flag:li.dataset.flag||'',
    stack:li.dataset.stack, year:li.dataset.year,
    live:li.dataset.live||'', liveLabel:li.dataset.liveLabel||'Enter scene',
    src:li.dataset.src||''
  }))
}));
const ALL_IDS=STAGES.flatMap(s=>s.projects.map(p=>p.id));
const byKey=Object.fromEntries(STAGES.map(s=>[s.key,s]));
GAME.st.visited=GAME.st.visited||{};

/* ---------- the studio plan (hub) ---------- */
const map=$('#lot-map');
function esc(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
function buildMap(){
  map.innerHTML='<div class="plan-head"><span><b>Parrv Pictures</b> — studio plan</span>'+
    '<span class="plan-north">Sheet 1 of 1 · N ↑</span></div>'+
    STAGES.map(s=>'<button type="button" class="stg" data-stage="'+s.key+'" data-cursor="link" '+
      'aria-label="Enter Stage '+s.letter+' — '+esc(s.unit)+' ('+esc(s.domain)+'), '+s.projects.length+' scenes">'+
      '<b class="stg-letter">'+s.letter+'</b>'+
      '<span class="stg-unit">'+esc(s.unit)+'</span>'+
      '<i class="stg-domain">'+esc(s.domain)+'</i>'+
      '<span class="stg-count">'+s.projects.length+(s.projects.length>1?' scenes':' scene')+'</span>'+
      '<span class="stg-reel" aria-hidden="true"></span></button>').join('')+
    '<div class="dep-strip">'+['ad','camera','edit','runner'].map(d=>
      '<button type="button" class="dep" data-dept="'+d+'" data-cursor="link">'+
      '<span class="dep-name">'+GAME.DEPT_NAME[d]+'</span>'+
      '<span class="dep-role">'+({ad:'the slate',camera:'the focus pull',edit:'the cut',runner:'the reel run'})[d]+'</span>'+
      '<span class="dep-state"></span><span class="dep-medal"></span></button>').join('')+'</div>'+
    '<div class="plan-foot"><span>You are here — main gate</span>'+
    '<a href="#producers-cut" id="gate-pcut" data-cursor="link">Producer’s cut — skip the tour →</a></div>';
  map.querySelectorAll('.stg').forEach(b=>b.addEventListener('click',()=>openStage(b.dataset.stage)));
  map.querySelectorAll('.dep').forEach(b=>b.addEventListener('click',()=>{
    const d=b.dataset.dept;
    if(!GAME.deptUnlocked(d)){ GAME.toast('STAGE DARK · STRIKE '+GAME.DEPT_GATE[d]+(GAME.DEPT_GATE[d]>1?' REELS':' REEL')+' TO POWER IT'); GAME.play('miss'); return; }
    if(window.DEPTS) window.DEPTS.open(d);
  }));
  $('#gate-pcut').addEventListener('click',e=>{ e.preventDefault(); openPcut(); });
  refresh();
}
function refresh(){
  const st=GAME.st;
  map.querySelectorAll('.stg').forEach(b=>{
    const s=byKey[b.dataset.stage];
    const seen=s.projects.filter(p=>st.seen[p.id]).length;
    b.classList.toggle('visited',!!st.visited[s.key]);
    b.classList.toggle('reeled',!!st.reels[s.key]);
    b.querySelector('.stg-count').textContent=seen+' / '+s.projects.length+' shot';
  });
  map.querySelectorAll('.dep').forEach(b=>{
    const d=b.dataset.dept, un=GAME.deptUnlocked(d);
    b.classList.toggle('locked',!un);
    b.setAttribute('aria-disabled',String(!un));
    b.querySelector('.dep-state').textContent=un?'OPEN':'DARK · '+GAME.DEPT_GATE[d]+(GAME.DEPT_GATE[d]>1?' REELS':' REEL');
    const m=st.medals[d];
    b.querySelector('.dep-medal').textContent=m?m.toUpperCase():'';
  });
  outtakesCheck();
}
GAME.onChange(refresh);

/* ---------- overlay plumbing shared by stages, departments, the cut ---------- */
let openSet=null, pushed=false;
function shell(id){
  let el=document.getElementById(id);
  if(el) return el;
  el=document.createElement('div');
  el.id=id; el.className='set'; el.hidden=true;
  el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  document.body.appendChild(el);
  return el;
}
function trap(el){
  el.addEventListener('keydown',e=>{
    if(e.key!=='Tab') return;
    const f=[...el.querySelectorAll('button,a[href],[tabindex="0"]')].filter(x=>!x.hidden&&x.offsetParent!==null);
    if(!f.length) return;
    const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){ last.focus(); e.preventDefault(); }
    else if(!e.shiftKey&&document.activeElement===last){ first.focus(); e.preventDefault(); }
  });
}
function lotHash(){ const h=location.hash.replace('#','');
  return h==='producers-cut'||(h.startsWith('stage-')&&byKey[h.slice(6)]); }
function openShell(el,hash,push){
  closeSet(true);
  openSet=el;
  document.body.classList.add('set-open');
  el.hidden=false;
  if(quiet||reduced) el.classList.add('on');
  else requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('on')));
  if(!quiet&&hash&&push!==false){ history.pushState({lot:hash},'','#'+hash); pushed=true; }
  const back=el.querySelector('.set-back,.x');
  if(back) back.focus({preventScroll:true});
}
function closeSet(silent){
  if(!openSet) return;
  const el=openSet; openSet=null;
  el.classList.remove('on');
  document.body.classList.remove('set-open');
  const hide=()=>{ el.hidden=true; };
  (quiet||reduced)?hide():setTimeout(hide,420);
  if(FILM.restoreSlate) FILM.restoreSlate();
  if(!silent){
    if(pushed){ pushed=false; history.back(); }
    else if(lotHash()) history.replaceState(null,'',location.pathname+location.search);
  }
}
addEventListener('keydown',e=>{ if(e.key==='Escape'&&openSet) closeSet(); });
addEventListener('popstate',()=>{ if(openSet){ pushed=false; closeSet(true); } route(); });

/* ---------- a stage interior ---------- */
const stageEl=shell('set-stage'); trap(stageEl);
let seenIO=null;
function openStage(key,push){
  const s=byKey[key]; if(!s) return;
  const st=GAME.st;
  stageEl.setAttribute('aria-label','Stage '+s.letter+' — '+s.unit);
  stageEl.innerHTML='<div class="set-safe">'+
    '<div class="set-head"><span class="set-letter">'+s.letter+'</span>'+
    '<span class="set-title">'+esc(s.unit)+'</span>'+
    '<span class="set-sub">'+esc(s.domain)+'</span>'+
    '<span class="set-prog"></span>'+
    '<button type="button" class="set-back" data-cursor="link">← Back to lot</button></div>'+
    s.projects.map((p,i)=>{
      const seen=!!st.seen[p.id];
      return '<article class="scene'+(p.board?' board':'')+'" data-id="'+p.id+'">'+
      '<figure class="still" data-cursor="frame"><div class="cell">'+
      '<img src="'+p.still+'" alt="'+esc(p.name)+' — '+esc(p.logline)+'" loading="lazy"></div>'+
      '<figcaption>'+esc(p.name)+(p.board?' — storyboard panel':' — production still')+'</figcaption></figure>'+
      '<div class="scene-info">'+
      '<p class="take"><b>Take '+String(i+1).padStart(2,'0')+'</b> · <span class="tk">'+(seen?'scene shot':'not yet shot')+'</span></p>'+
      (p.flag?'<span class="flag">'+esc(p.flag)+'</span>':'')+
      '<h3 class="scene-kicker">'+esc(p.name)+'</h3>'+
      '<p class="logline">'+esc(p.logline)+'</p>'+
      '<div class="meta-row"><span><b>Stack</b>'+esc(p.stack)+'</span><span><b>Year</b>'+p.year+'</span></div>'+
      '<div class="scene-links">'+
      (p.live?'<a class="scene-link" href="'+p.live+'" target="_blank" rel="noopener" data-cursor="link" aria-label="'+esc(p.liveLabel)+' — '+esc(p.name)+' live">'+esc(p.liveLabel)+' →</a>':'')+
      (p.src?'<a class="scene-link" href="'+p.src+'" target="_blank" rel="noopener" data-cursor="link" aria-label="'+esc(p.name)+' source on GitHub">Source →</a>':'')+
      '</div></div></article>';
    }).join('')+
    '<button type="button" class="set-back" data-cursor="link">← Back to lot</button></div>';
  stageEl.querySelectorAll('.set-back').forEach(b=>b.addEventListener('click',()=>closeSet()));
  const prog=()=>{ const n=s.projects.filter(p=>GAME.st.seen[p.id]).length;
    stageEl.querySelector('.set-prog').textContent='REEL '+s.letter+' · '+n+' / '+s.projects.length+' SCENES'; };
  prog();

  /* first light (never earned inside a screenshot) */
  if(!quiet&&!GAME.st.visited[key]){
    GAME.st.visited[key]=true; GAME.save();
    if(Object.keys(GAME.st.visited).length===1) GAME.ach('day-player');
    if(STAGES.every(x=>GAME.st.visited[x.key])) GAME.ach('checking-the-gate');
  }
  if(FILM.setSlate) FILM.setSlate('STAGE '+s.letter+' · '+s.unit.toUpperCase(),'INT. 1.85:1');
  openShell(stageEl,'stage-'+key,push);

  /* a scene is shot when it holds the frame for a beat */
  if(seenIO) seenIO.disconnect();
  const timers=new Map();
  if(!quiet){
  seenIO=new IntersectionObserver(es=>es.forEach(e=>{
    const id=e.target.dataset.id, card=e.target;
    if(e.isIntersecting&&!GAME.st.seen[id]){
      timers.set(id,setTimeout(()=>{
        if(!GAME.see(id)) return;
        card.querySelector('.tk').textContent='scene shot';
        const p=s.projects.find(x=>x.id===id);
        GAME.xp(10,'SCENE SHOT — '+p.name.toUpperCase());
        GAME.play('blip');
        if(ALL_IDS.every(i=>GAME.st.seen[i])) GAME.ach('martini-shot');
        GAME.reelCheck(key,s.projects.map(x=>x.id));
        if(GAME.st.reels[key]){ const t=map.querySelector('.stg[data-stage="'+key+'"]');
          if(t&&!quiet) t.classList.add('reel-flash'); }
        prog();
      },900));
    }else{ clearTimeout(timers.get(id)); timers.delete(id); }
  }),{root:stageEl,threshold:.45});
  stageEl.querySelectorAll('.scene').forEach(c=>seenIO.observe(c));
  }

  /* entrances: opacity only, staggered by the stage's own observer */
  if(quiet||reduced){ stageEl.querySelectorAll('.scene').forEach(c=>c.classList.add('on')); }
  else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
    }),{root:stageEl,threshold:.15});
    stageEl.querySelectorAll('.scene').forEach(c=>io.observe(c));
  }
}

/* ---------- the producer's cut: the sheet itself, handed over ---------- */
let pcut=null;
function openPcut(push){
  if(!pcut){
    pcut=document.createElement('div');
    pcut.id='pcut'; pcut.className='paper'; pcut.hidden=true;
    pcut.setAttribute('role','dialog'); pcut.setAttribute('aria-modal','true');
    pcut.setAttribute('aria-label','Producer’s cut — the plain filmography');
    pcut.innerHTML='<div class="paper-head"><span>Producer’s cut — the filmography, no tour</span>'+
      '<span><button type="button" class="x set-back" data-cursor="link">Close</button></span></div>'+
      '<p class="pcut-note">Every picture on the lot, grouped by unit. Live links open the deployed work; '+
      'source opens GitHub. For the full experience, walk the backlot instead.</p>';
    const d=$('#lot-data'); d.hidden=false; pcut.appendChild(d);
    document.body.appendChild(pcut);
    trap(pcut);
    pcut.querySelector('.x').addEventListener('click',()=>closeSet());
  }
  if(FILM.setSlate) FILM.setSlate('PRODUCER’S CUT','PAPER');
  openShell(pcut,'producers-cut',push);
}
const pcutBtn=$('#pcut-btn');
if(pcutBtn) pcutBtn.addEventListener('click',e=>{ e.preventDefault(); openPcut(); });

/* ---------- outtakes: sealed until all six reels hang on the wall ---------- */
let otDone=false;
const TAKES=[
  ['2024 · “CALCULATOR-PROJECT”','The first picture ever shot on this lot: a calculator, in plain HTML. It still holds the record for fewest features per commit.'],
  ['2024 · “C-”','A repository named <i>c-</i>, described in its own words: “trying to make a shopping app.” It was written in Python. The shopping app is still trying.'],
  ['2024 · “YTCLONE21”','A shot-for-shot remake of YouTube, as every young studio attempts once. The recommendation algorithm was a hard-coded list.'],
  ['2025 · “KHAAOPEEYOAISHKROMITARO”','A restaurant site whose title card is one unbroken word. The director maintains this was a stylistic choice and not a missing spacebar.'],
  ['2025 · “PRACTICE”','A repository literally titled <i>practice</i>. Everything in the six stages you just walked was rehearsed here first.']
];
function outtakesCheck(){
  if(otDone||GAME.reelCount()<6) return;
  otDone=true;
  const body=$('#outtakes-body'); if(!body) return;
  body.innerHTML='<div class="ot-roll"><p class="ot-head">Outtakes — the reels they don’t screen · unlocked, all six cans struck</p>'+
    TAKES.map(t=>'<div class="ot-take"><p class="ot-slate">'+t[0]+'</p><p>'+t[1]+'</p></div>').join('')+'</div>';
  if(quiet||reduced){ body.querySelectorAll('.ot-take').forEach(x=>x.classList.add('on')); }
  else{
    const io=new IntersectionObserver(es=>es.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
    }),{threshold:.3});
    body.querySelectorAll('.ot-take').forEach(x=>io.observe(x));
  }
  GAME.toast('OUTTAKES UNSEALED · AFTER THE CREDITS');
  GAME.play('kachunk');
}

/* ---------- routes: hashes and shot isolation ---------- */
function route(){
  const h=location.hash.replace('#','');
  if(h.startsWith('stage-')&&byKey[h.slice(6)]) openStage(h.slice(6),false);
  else if(h==='producers-cut') openPcut(false);
}
function boot(){
  buildMap();
  map.hidden=false;
  /* the static sheet leaves the stage; the producer keeps it */
  const d=$('#lot-data'); if(d) d.hidden=true;
  if(shotTarget&&shotTarget.startsWith('stage-')) openStage(shotTarget.slice(6));
  else if(shotTarget==='pcut') openPcut();
  else if(!quiet) route();
}
boot();

window.LOT={STAGES,openStage,openPcut,shell,trap,openShell,closeSet,refresh};
})();
