/* ============ THE DEPARTMENTS — four working rooms on the lot ============
   AD (the slate) · Camera (the focus pull) · Editorial (the cut) · Transport (the reel run).
   All rooms obey the print: silver line art, transform/opacity motion, no animated filters. */
(function(){
'use strict';
const FILM=window.FILM||{}, GAME=window.GAME, LOT=window.LOT;
if(!GAME||!LOT) return;
const quiet=!!FILM.instant;
const $=(s,r)=>(r||document).querySelector(s);

const DEPT={
  ad:{title:'AD Dept — the slate',sub:'hit the sticks on the frame',hash:'dept-ad'},
  camera:{title:'Camera Dept — the focus pull',sub:'keep the subject sharp for thirty seconds',hash:'dept-camera'},
  edit:{title:'Editorial — the cut',sub:'rebuild the scene before the clock runs',hash:'dept-edit'},
  runner:{title:'Transport — the reel run',sub:'roll the can across the lot',hash:'dept-runner'}
};
const el=LOT.shell('set-dept'); LOT.trap(el);
let live=null; /* the running game's stop() — called on close or restart */
function stopLive(){ if(live){ try{live();}catch(_){} live=null; } }
addEventListener('keydown',e=>{ if(e.key==='Escape') stopLive(); });
addEventListener('popstate',stopLive);

function room(d,hudHTML,stageHTML,note,act){
  const m=DEPT[d];
  el.setAttribute('aria-label',m.title);
  el.innerHTML='<div class="set-safe">'+
    '<div class="set-head"><span class="set-title">'+m.title+'</span>'+
    '<span class="set-sub">'+m.sub+'</span><span class="set-prog"></span>'+
    '<button type="button" class="set-back" data-cursor="link">← Back to lot</button></div>'+
    '<div class="dept-room"><div class="dept-hud">'+hudHTML+'</div>'+
    '<div class="dept-stage">'+stageHTML+'</div>'+
    '<p class="dept-note">'+note+'</p>'+
    '<button type="button" class="dept-act" data-cursor="link">'+act+'</button></div></div>';
  el.querySelector('.set-back').addEventListener('click',()=>{ stopLive(); LOT.closeSet(); });
  paintBest(d);
  return el.querySelector('.dept-room');
}
function paintBest(d){
  const b=GAME.st.best[d],m=GAME.st.medals[d];
  el.querySelector('.set-prog').textContent=(m?m.toUpperCase()+' · ':'')+(b!==undefined?'BEST '+b:'NO TAKE YET');
}
function tier(score,cuts){ return score>=cuts[2]?'gold':score>=cuts[1]?'silver':score>=cuts[0]?'bronze':null; }
function finish(d,score,cuts,xpAmt,label){
  const t=tier(score,cuts);
  if(t) GAME.medal(d,t,score); else if(GAME.st.best[d]===undefined||score>GAME.st.best[d]){ GAME.st.best[d]=score; GAME.save(); }
  if(xpAmt>0) GAME.xp(xpAmt,label);
  paintBest(d);
  LOT.refresh();
}

/* ---------- AD DEPT · the slate ---------- */
function openAd(push){
  const r=room('ad',
    '<span>Take <b class="h-take">— / 10</b></span><span>Score <b class="h-score">0</b></span>'+
    '<span>Streak <b class="h-streak">0</b></span><span>Last <b class="h-last">—</b></span>',
    '<div class="clap"><div class="clap-arm"></div><div class="clap-board">'+
    '<div class="row"><span>Prod.</span><b>PARRV PICTURES</b></div>'+
    '<div class="row"><span>Scene</span><b>THE BACKLOT</b></div>'+
    '<div class="row"><span>Take</span><b class="b-take">—</b></div>'+
    '<div class="row"><span>Sound</span><b>'+(GAME.st.sound?'SYNC':'MOS')+'</b></div></div>'+
    '<div class="clap-mark" aria-live="polite"></div></div>',
    'Space, click or tap the moment the sticks meet. Perfect &lt;45ms · Good &lt;120ms.',
    'Roll camera');
  const arm=$('.clap-arm',el),mark=$('.clap-mark',el),act=$('.dept-act',el);
  const H={take:$('.h-take',el),score:$('.h-score',el),streak:$('.h-streak',el),last:$('.h-last',el),btake:$('.b-take',el)};
  arm.style.transform='rotate(-55deg)';
  let running=false;
  function run(){
    GAME.replay('ad');
    let take=0,score=0,streak=0,waiting=false,closeAt=0,raf=0,t0=0,dur=0,pressed=false;
    running=true; act.textContent='Cut — start over';
    function stamp(txt,perfect){
      mark.textContent=txt; mark.classList.add('show'); mark.classList.toggle('perfect',!!perfect);
      setTimeout(()=>mark.classList.remove('show'),620);
    }
    function next(){
      if(!running) return;
      take++;
      if(take>10) return wrap();
      H.take.textContent=take+' / 10'; H.btake.textContent=String(take).padStart(2,'0');
      arm.style.transform='rotate(-55deg)'; pressed=false; waiting=false;
      const delay=500+Math.random()*1100;
      dur=Math.max(430,940-take*48); /* the AD gets faster as the day runs */
      setTimeout(()=>{
        if(!running) return;
        GAME.play('tick');
        t0=performance.now(); closeAt=t0+dur; waiting=true;
        (function swing(){
          if(!running||pressed) return;
          const p=Math.min(1,(performance.now()-t0)/dur);
          arm.style.transform='rotate('+(-55*(1-p*p))+'deg)';
          if(p<1) raf=requestAnimationFrame(swing);
          else{ /* sticks met — a short grace still counts as a (late) slate */
            GAME.play('clack');
            setTimeout(()=>{ if(!pressed&&running) judge(1e9); },200);
          }
        })();
      },delay);
    }
    function judge(off){
      if(!running) return;
      waiting=false;
      let verdict='MISS',pts=0;
      if(off<45){ streak++; verdict='PERFECT'; pts=15+(streak>1?5:0); }
      else if(off<120){ streak=0; verdict='GOOD'; pts=5; }
      else streak=0;
      score+=pts;
      H.score.textContent=score; H.streak.textContent=streak;
      H.last.textContent=off>1e8?'NO SLATE':Math.round(off)+'ms';
      stamp(verdict,verdict==='PERFECT');
      GAME.play(verdict==='MISS'?'miss':'clack');
      setTimeout(next,780);
    }
    function press(){
      if(!running||pressed) return;
      if(!waiting){ /* jumped the slate */ pressed=true; judge(1e9); return; }
      pressed=true;
      arm.style.transform='rotate(0deg)';
      judge(Math.abs(performance.now()-closeAt));
    }
    const onKey=e=>{ if(e.code==='Space'){ e.preventDefault(); press(); } };
    const stage=$('.dept-stage',el);
    stage.addEventListener('pointerdown',press);
    addEventListener('keydown',onKey);
    function wrap(){
      running=false;
      act.textContent='Roll again';
      stamp('WRAP · '+score,false);
      finish('ad',score,[60,100,140],Math.round(score/10),'WRAP — AD DEPT');
      cleanup();
    }
    function cleanup(){
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerdown',press);
      removeEventListener('keydown',onKey);
    }
    live=()=>{ running=false; cleanup(); };
    next();
  }
  act.addEventListener('click',()=>{ stopLive(); run(); });
  FILM.setSlate&&FILM.setSlate('AD DEPT · THE SLATE','GAME');
  LOT.openShell(el,DEPT.ad.hash,push);
}

/* ---------- CAMERA DEPT · the focus pull ---------- */
function openCamera(push){
  const chart='<svg class="chart-face" viewBox="0 0 300 170" aria-hidden="true">'+
    '<rect x="1" y="1" width="298" height="168" fill="none" stroke="#8E958D" stroke-width="1"/>'+
    Array.from({length:24},(_,i)=>{ const a=i/24*Math.PI*2;
      return '<line x1="150" y1="85" x2="'+(150+Math.cos(a)*66).toFixed(1)+'" y2="'+(85+Math.sin(a)*66).toFixed(1)+'" stroke="'+(i%2?'#E5E3DA':'#2E332F')+'" stroke-width="3"/>'; }).join('')+
    '<circle cx="150" cy="85" r="12" fill="#0E0F0D" stroke="#E5E3DA"/>'+
    '<text x="150" y="160" fill="#8E958D" font-family="Courier Prime,monospace" font-size="10" text-anchor="middle" letter-spacing="3">FOCUS CHART · PARRV PICTURES</text></svg>';
  room('camera',
    '<span>Clock <b class="h-clock">30.0</b></span><span>In focus <b class="h-pct">—</b></span>'+
    '<span>Tolerance <b>±0.07</b></span>',
    '<div style="width:100%;display:flex;flex-direction:column;align-items:center;">'+
    '<div class="ff-chart">'+chart+'<div class="soft">'+chart+'</div></div>'+
    '<div class="ff" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-label="Follow focus — match the drifting subject" data-cursor="scrub">'+
    '<span class="ff-title"><span>Follow focus — drag · arrows</span><b class="ff-read">1.2 M</b></span>'+
    '<span class="ff-scale" aria-hidden="true"><span>0.6</span><span>1</span><span>2</span><span>5</span><span>∞</span></span>'+
    '<span class="ff-track"><i class="ff-subject"></i><i class="ff-thumb"></i></span></div></div>',
    'The subject drifts. Drag the ring — or use the arrow keys — to hold it inside the depth of field.',
    'Roll camera');
  const act=$('.dept-act',el),ff=$('.ff',el),track=$('.ff-track',el),
    thumb=$('.ff-thumb',el),subject=$('.ff-subject',el),read=$('.ff-read',el),
    soft=$('.soft',el),H={clock:$('.h-clock',el),pct:$('.h-pct',el)};
  let lens=.5;
  function paintLens(){
    thumb.style.left=(lens*100).toFixed(2)+'%';
    read.textContent=lens>.985?'∞':(1.2*Math.pow(5,lens)).toFixed(1)+' M';
    ff.setAttribute('aria-valuenow',String(Math.round(lens*100)));
  }
  paintLens();
  let dragging=false;
  const fromEvent=e=>{ const r=track.getBoundingClientRect();
    lens=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)); paintLens(); };
  ff.addEventListener('pointerdown',e=>{ dragging=true; fromEvent(e); try{ff.setPointerCapture(e.pointerId);}catch(_){} });
  ff.addEventListener('pointermove',e=>{ if(dragging) fromEvent(e); });
  ff.addEventListener('pointerup',()=>dragging=false);
  ff.addEventListener('pointercancel',()=>dragging=false);
  ff.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){ lens=Math.min(1,lens+.045); paintLens(); e.preventDefault(); }
    else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ lens=Math.max(0,lens-.045); paintLens(); e.preventDefault(); }
  });
  function run(){
    GAME.replay('camera');
    act.textContent='Cut — start over';
    const p1=Math.random()*7,p2=Math.random()*7,p3=Math.random()*7;
    const t0=performance.now(); let inMs=0,lastT=t0,raf=0,done=false;
    (function loop(){
      if(done) return;
      const now=performance.now(),t=(now-t0)/1000,dt=now-lastT; lastT=now;
      const subj=Math.min(1,Math.max(0,.5+.3*Math.sin(.5*t+p1)+.17*Math.sin(1.13*t+p2)+.08*Math.sin(2.09*t+p3)));
      subject.style.left=(subj*100).toFixed(2)+'%';
      const err=Math.abs(subj-lens);
      if(err<.07) inMs+=dt;
      soft.style.opacity=Math.min(1,err*4.5).toFixed(3);
      const left=Math.max(0,30-t);
      H.clock.textContent=left.toFixed(1);
      H.pct.textContent=Math.round(inMs/Math.max(1,now-t0)*100)+'%';
      if(left<=0){
        done=true;
        const pct=Math.round(inMs/(now-t0)*100);
        H.pct.textContent=pct+'%';
        act.textContent='Roll again';
        GAME.play(pct>=50?'chime':'miss');
        finish('camera',pct,[50,70,85],Math.round(pct/10),'WRAP — CAMERA DEPT');
        return;
      }
      raf=requestAnimationFrame(loop);
    })();
    live=()=>{ done=true; cancelAnimationFrame(raf); };
  }
  act.addEventListener('click',()=>{ stopLive(); run(); });
  FILM.setSlate&&FILM.setSlate('CAMERA DEPT · FOCUS PULL','GAME');
  LOT.openShell(el,DEPT.camera.hash,push);
}

/* ---------- EDITORIAL · the cut ---------- */
function openEdit(push){
  const pool=LOT.STAGES.flatMap(s=>s.projects).filter(p=>!p.board);
  const pick=pool[Math.random()*pool.length|0];
  room('edit',
    '<span>Clock <b class="h-clock">00:00</b></span><span>Picture <b>'+pick.name.toUpperCase()+'</b></span>'+
    '<span>Order <b class="h-ok">—</b></span>',
    '<div class="cutbench" role="group" aria-label="Six frames, out of order — swap any two"></div>',
    'The neg came back shuffled. Tap two frames to swap them; rebuild the scene left to right.',
    'Deal the frames');
  const bench=$('.cutbench',el),act=$('.dept-act',el),
    H={clock:$('.h-clock',el),ok:$('.h-ok',el)};
  let order=[],held=-1,t0=0,timer=0,playing=false;
  function deal(){
    GAME.replay('edit');
    order=[0,1,2,3,4,5];
    do{ for(let i=5;i>0;i--){ const j=Math.random()*(i+1)|0; [order[i],order[j]]=[order[j],order[i]]; } }
    while(order.every((v,i)=>v===i));
    held=-1; playing=true; t0=performance.now();
    act.textContent='Cut — reshuffle';
    clearInterval(timer);
    timer=setInterval(()=>{ const s=(performance.now()-t0)/1000|0;
      H.clock.textContent=String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); },250);
    paint();
  }
  function paint(){
    bench.innerHTML=order.map((v,i)=>'<button type="button" class="frame-cell'+(i===held?' held':'')+'" data-cursor="link" '+
      'data-frame="'+v+'" aria-label="Slot '+(i+1)+' — holds frame '+(v+1)+'" style="--i:'+v+'">'+
      '<img src="'+pick.still+'" alt="" draggable="false"><span class="no">'+(i+1)+'</span></button>').join('');
    H.ok.textContent=order.filter((v,i)=>v===i).length+' / 6';
    [...bench.children].forEach((c,i)=>c.addEventListener('click',()=>tap(i)));
  }
  function tap(i){
    if(!playing) return;
    if(held<0){ held=i; paint(); GAME.play('tick'); return; }
    if(held!==i){ [order[held],order[i]]=[order[i],order[held]]; GAME.play('clack'); }
    held=-1; paint();
    if(order.every((v,x)=>v===x)) locked();
  }
  function locked(){
    playing=false; clearInterval(timer);
    const secs=Math.round((performance.now()-t0)/1000);
    H.clock.textContent='LOCKED · '+secs+'s';
    act.textContent='Cut another picture';
    GAME.play('wrap');
    /* faster is better: invert to a score so 'best' stays a max */
    const score=Math.max(0,200-secs);
    finish('edit',score,[110,140,165],10,'CUT LOCKED — '+secs+'S');
    live=null;
  }
  act.addEventListener('click',()=>{ stopLive(); deal(); });
  live=()=>{ playing=false; clearInterval(timer); };
  FILM.setSlate&&FILM.setSlate('EDITORIAL · THE CUT','GAME');
  LOT.openShell(el,DEPT.edit.hash,push);
}

/* ---------- TRANSPORT · the reel run ---------- */
function openRunner(push){
  room('runner',
    '<span>Distance <b class="h-ft">0 FT</b></span><span>Best <b class="h-best">'+(GAME.st.best.runner||0)+' FT</b></span>'+
    '<span>Speed <b class="h-spd">1.0×</b></span>',
    '<div class="runner-wrap"><canvas width="1440" height="440" aria-label="The reel run — jump the sandbags, stay under the boom"></canvas></div>',
    'Space or tap to jump the sandbags and C-stands. A boom pole means stay low — do not jump.',
    'Roll it');
  const act=$('.dept-act',el),cv=$('canvas',el),x=cv.getContext('2d');
  const W=1440,H=440,GROUND=360,R=52;
  const SILVER='#8E958D',BONE='#E5E3DA',DIM='rgba(142,149,141,.4)';
  function drawIdle(){
    x.clearRect(0,0,W,H);
    x.strokeStyle=DIM; x.beginPath(); x.moveTo(0,GROUND+.5); x.lineTo(W,GROUND+.5); x.stroke();
    reel(200,GROUND-R,0);
    x.fillStyle=SILVER; x.font='22px "Courier Prime",monospace'; x.textAlign='center';
    x.fillText('TRANSPORT — ROLL IT',W/2,H/2-10);
  }
  function reel(cx,cy,rot){
    x.strokeStyle=BONE; x.lineWidth=3;
    x.beginPath(); x.arc(cx,cy,R,0,7); x.stroke();
    x.beginPath(); x.arc(cx,cy,10,0,7); x.stroke();
    for(let i=0;i<4;i++){ const a=rot+i*Math.PI/2;
      x.beginPath(); x.moveTo(cx+Math.cos(a)*12,cy+Math.sin(a)*12);
      x.lineTo(cx+Math.cos(a)*(R-4),cy+Math.sin(a)*(R-4)); x.stroke(); }
    x.lineWidth=1;
  }
  function run(){
    GAME.replay('runner');
    act.textContent='Cut — start over';
    let t=0,dist=0,speed=7,y=GROUND-R,vy=0,air=false,rot=0,over=false,raf=0;
    let obs=[]; /* {kind:'bag'|'stand'|'boom', x} */
    let nextAt=900;
    function spawn(){
      const roll=Math.random();
      obs.push({kind:roll<.42?'bag':roll<.75?'stand':'boom',x:W+80});
      nextAt=520+Math.random()*720;
    }
    function jump(){ if(!air&&!over){ vy=-21; air=true; GAME.play('blip'); } }
    function drop(){ if(air) vy=Math.max(vy,14); }
    const onKey=e=>{
      if(e.code==='Space'){ e.preventDefault(); jump(); }
      if(e.code==='ArrowDown'){ e.preventDefault(); drop(); }
    };
    const onTap=e=>{ e.preventDefault(); jump(); };
    addEventListener('keydown',onKey);
    cv.addEventListener('pointerdown',onTap);
    (function loop(){
      if(over) return;
      t++; dist+=speed/8; speed=7+Math.min(9,dist/280);
      nextAt-=speed; if(nextAt<=0) spawn();
      /* physics */
      if(air){ y+=vy; vy+=1.6; if(y>=GROUND-R){ y=GROUND-R; air=false; vy=0; } }
      rot+=speed/R;
      obs.forEach(o=>o.x-=speed);
      obs=obs.filter(o=>o.x>-160);
      /* draw */
      x.clearRect(0,0,W,H);
      x.strokeStyle=DIM; x.beginPath(); x.moveTo(0,GROUND+.5); x.lineTo(W,GROUND+.5); x.stroke();
      /* distance posts */
      const off=(dist*8)%560;
      for(let px=-off;px<W;px+=560){ x.strokeStyle='rgba(142,149,141,.18)';
        x.beginPath(); x.moveTo(px,GROUND); x.lineTo(px,GROUND-16); x.stroke(); }
      x.strokeStyle=SILVER; x.lineWidth=2;
      obs.forEach(o=>{
        if(o.kind==='bag'){ /* sandbag: low lump — jump it */
          x.beginPath(); x.moveTo(o.x-34,GROUND); x.quadraticCurveTo(o.x,GROUND-58,o.x+34,GROUND); x.stroke();
        }else if(o.kind==='stand'){ /* c-stand: tall — jump it (tight) */
          x.beginPath(); x.moveTo(o.x,GROUND); x.lineTo(o.x,GROUND-108);
          x.moveTo(o.x-26,GROUND); x.lineTo(o.x,GROUND-34); x.moveTo(o.x+26,GROUND); x.lineTo(o.x,GROUND-34);
          x.moveTo(o.x-30,GROUND-108); x.lineTo(o.x+30,GROUND-108); x.stroke();
        }else{ /* boom: hangs low — stay grounded */
          x.beginPath(); x.moveTo(o.x-120,0); x.lineTo(o.x,GROUND-150); x.stroke();
          x.fillStyle=SILVER; x.fillRect(o.x-7,GROUND-150,14,26);
        }
      });
      reel(200,y,rot);
      x.lineWidth=1;
      /* collide */
      const rx=200,ry=y;
      for(const o of obs){
        if(o.kind==='bag'&&Math.abs(o.x-rx)<R+18&&ry>GROUND-R-46){ return crash(); }
        if(o.kind==='stand'&&Math.abs(o.x-rx)<R+6&&ry>GROUND-R-96){ return crash(); }
        if(o.kind==='boom'&&Math.abs(o.x-rx)<R+10&&ry<GROUND-R-22){ return crash(); }
      }
      /* hud */
      $('.h-ft',el).textContent=Math.round(dist)+' FT';
      $('.h-spd',el).textContent=(speed/7).toFixed(1)+'×';
      raf=requestAnimationFrame(loop);
    })();
    function crash(){
      over=true;
      GAME.play('miss');
      x.fillStyle=BONE; x.font='26px "Courier Prime",monospace'; x.textAlign='center';
      x.fillText('THE CAN CAME OPEN — '+Math.round(dist)+' FT',W/2,150);
      act.textContent='Roll again';
      const ft=Math.round(dist);
      $('.h-best',el).textContent=Math.max(ft,GAME.st.best.runner||0)+' FT';
      finish('runner',ft,[500,1500,3000],Math.round(ft/100),'REEL RUN — '+ft+' FT');
      cleanup();
    }
    function cleanup(){
      cancelAnimationFrame(raf);
      removeEventListener('keydown',onKey);
      cv.removeEventListener('pointerdown',onTap);
    }
    live=()=>{ over=true; cleanup(); };
  }
  drawIdle();
  act.addEventListener('click',()=>{ stopLive(); run(); });
  FILM.setSlate&&FILM.setSlate('TRANSPORT · REEL RUN','GAME');
  LOT.openShell(el,DEPT.runner.hash,push);
}

/* ---------- routes ---------- */
const OPEN={ad:openAd,camera:openCamera,edit:openEdit,runner:openRunner};
function open(d,push){ stopLive(); if(OPEN[d]) OPEN[d](push); }
window.DEPTS={open};

/* deep links & shot isolation for the rooms */
const h=location.hash.replace('#','');
if(FILM.shot&&FILM.shot.startsWith('dept-')) open(FILM.shot.slice(5));
else if(!quiet&&h.startsWith('dept-')&&OPEN[h.slice(5)]) open(h.slice(5),false);
addEventListener('popstate',()=>{
  const h2=location.hash.replace('#','');
  if(h2.startsWith('dept-')&&OPEN[h2.slice(5)]) open(h2.slice(5),false);
});
})();
