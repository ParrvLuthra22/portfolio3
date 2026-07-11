"use client";

/* ============ AD DEPT · THE SLATE — hit the sticks on the frame ============
   Ten takes. The arm swings faster as the day runs. Perfect <45ms, good <120ms. */

import React, { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/game";
import { useFinish } from "./DeptSet";

export default function AdRoom() {
  const game = useGame();
  const finish = useFinish();
  const [hud, setHud] = useState({ take: "— / 10", score: 0, streak: 0, last: "—", btake: "—" });
  const [actLabel, setActLabel] = useState("Roll camera");
  const armRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<(() => void) | null>(null);

  useEffect(() => () => { liveRef.current?.(); }, []);

  function run() {
    liveRef.current?.();
    game.replay("ad");
    const arm = armRef.current!, mark = markRef.current!, stage = stageRef.current!;
    let take = 0, score = 0, streak = 0, waiting = false, closeAt = 0, raf = 0, t0 = 0, dur = 0, pressed = false, running = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    setActLabel("Cut — start over");
    const stamp = (txt: string, perfect: boolean) => {
      mark.textContent = txt;
      mark.classList.add("show");
      mark.classList.toggle("perfect", perfect);
      timers.push(setTimeout(() => mark.classList.remove("show"), 620));
    };
    const next = () => {
      if (!running) return;
      take++;
      if (take > 10) return wrap();
      setHud((h) => ({ ...h, take: take + " / 10", btake: String(take).padStart(2, "0") }));
      arm.style.transform = "rotate(-55deg)";
      pressed = false; waiting = false;
      const delay = 500 + Math.random() * 1100;
      dur = Math.max(430, 940 - take * 48); /* the AD gets faster as the day runs */
      timers.push(setTimeout(() => {
        if (!running) return;
        game.play("tick");
        t0 = performance.now(); closeAt = t0 + dur; waiting = true;
        const swing = () => {
          if (!running || pressed) return;
          const p = Math.min(1, (performance.now() - t0) / dur);
          arm.style.transform = "rotate(" + -55 * (1 - p * p) + "deg)";
          if (p < 1) raf = requestAnimationFrame(swing);
          else { /* sticks met — a short grace still counts as a (late) slate */
            game.play("clack");
            timers.push(setTimeout(() => { if (!pressed && running) judge(1e9); }, 200));
          }
        };
        swing();
      }, delay));
    };
    const judge = (off: number) => {
      if (!running) return;
      waiting = false;
      let verdict = "MISS", pts = 0;
      if (off < 45) { streak++; verdict = "PERFECT"; pts = 15 + (streak > 1 ? 5 : 0); }
      else if (off < 120) { streak = 0; verdict = "GOOD"; pts = 5; }
      else streak = 0;
      score += pts;
      setHud((h) => ({ ...h, score, streak, last: off > 1e8 ? "NO SLATE" : Math.round(off) + "ms" }));
      stamp(verdict, verdict === "PERFECT");
      game.play(verdict === "MISS" ? "miss" : "clack");
      timers.push(setTimeout(next, 780));
    };
    const press = () => {
      if (!running || pressed) return;
      if (!waiting) { pressed = true; judge(1e9); return; } /* jumped the slate */
      pressed = true;
      arm.style.transform = "rotate(0deg)";
      judge(Math.abs(performance.now() - closeAt));
    };
    const onKey = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); press(); } };
    stage.addEventListener("pointerdown", press);
    addEventListener("keydown", onKey);
    const cleanup = () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      stage.removeEventListener("pointerdown", press);
      removeEventListener("keydown", onKey);
    };
    const wrap = () => {
      running = false;
      setActLabel("Roll again");
      stamp("WRAP · " + score, false);
      finish("ad", score, [60, 100, 140], Math.round(score / 10), "WRAP — AD DEPT");
      cleanup();
      liveRef.current = null;
    };
    liveRef.current = () => { running = false; cleanup(); };
    next();
  }

  return (
    <div className="dept-room">
      <div className="dept-hud">
        <span>Take <b>{hud.take}</b></span>
        <span>Score <b>{hud.score}</b></span>
        <span>Streak <b>{hud.streak}</b></span>
        <span>Last <b>{hud.last}</b></span>
      </div>
      <div className="dept-stage" ref={stageRef}>
        <div className="clap">
          <div className="clap-arm" ref={armRef} style={{ transform: "rotate(-55deg)" }}></div>
          <div className="clap-board">
            <div className="row"><span>Prod.</span><b>PARRV PICTURES</b></div>
            <div className="row"><span>Scene</span><b>THE BACKLOT</b></div>
            <div className="row"><span>Take</span><b>{hud.btake}</b></div>
            <div className="row"><span>Sound</span><b>{game.st.sound ? "SYNC" : "MOS"}</b></div>
          </div>
          <div className="clap-mark" ref={markRef} aria-live="polite"></div>
        </div>
      </div>
      <p className="dept-note">Space, click or tap the moment the sticks meet. Perfect &lt;45ms · Good &lt;120ms.</p>
      <button type="button" className="dept-act" data-cursor="link" onClick={run}>{actLabel}</button>
    </div>
  );
}
