"use client";

/* ============ EDITORIAL · THE CUT ============
   The neg came back shuffled. Tap two frames to swap; rebuild left to right.
   Faster is better: score = 200 − seconds. */

import React, { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/game";
import { useFinish } from "./DeptSet";
import { STAGES } from "@/data/projects";

export default function EditRoom() {
  const game = useGame();
  const finish = useFinish();
  const [pick] = useState(() => {
    const pool = STAGES.flatMap((s) => s.projects).filter((p) => !p.board);
    return pool[(Math.random() * pool.length) | 0];
  });
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [held, setHeld] = useState(-1);
  const [clock, setClock] = useState("00:00");
  const [actLabel, setActLabel] = useState("Deal the frames");
  const playing = useRef(false);
  const t0 = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  function deal() {
    game.replay("edit");
    let o = [0, 1, 2, 3, 4, 5];
    do {
      for (let i = 5; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [o[i], o[j]] = [o[j], o[i]];
      }
    } while (o.every((v, i) => v === i));
    setOrder(o); setHeld(-1);
    playing.current = true;
    t0.current = performance.now();
    setActLabel("Cut — reshuffle");
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      const s = ((performance.now() - t0.current) / 1000) | 0;
      setClock(String((s / 60) | 0).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"));
    }, 250);
  }

  function tap(i: number) {
    if (!playing.current) return;
    if (held < 0) { setHeld(i); game.play("tick"); return; }
    let next = order;
    if (held !== i) {
      next = [...order];
      [next[held], next[i]] = [next[i], next[held]];
      setOrder(next);
      game.play("clack");
    }
    setHeld(-1);
    if (next.every((v, x) => v === x)) locked();
  }

  function locked() {
    playing.current = false;
    if (timer.current) clearInterval(timer.current);
    const secs = Math.round((performance.now() - t0.current) / 1000);
    setClock("LOCKED · " + secs + "s");
    setActLabel("Cut another picture");
    game.play("wrap");
    const score = Math.max(0, 200 - secs);
    finish("edit", score, [110, 140, 165], 10, "CUT LOCKED — " + secs + "S");
  }

  return (
    <div className="dept-room">
      <div className="dept-hud">
        <span>Clock <b>{clock}</b></span>
        <span>Picture <b>{pick.name.toUpperCase()}</b></span>
        <span>Order <b>{order.filter((v, i) => v === i).length} / 6</b></span>
      </div>
      <div className="dept-stage">
        <div className="cutbench" role="group" aria-label="Six frames, out of order — swap any two">
          {order.map((v, i) => (
            <button
              type="button" key={i}
              className={"frame-cell" + (i === held ? " held" : "")}
              data-cursor="link"
              aria-label={"Slot " + (i + 1) + " — holds frame " + (v + 1)}
              style={{ "--i": v } as React.CSSProperties}
              onClick={() => tap(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pick.still} alt="" draggable={false} />
              <span className="no">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="dept-note">The neg came back shuffled. Tap two frames to swap them; rebuild the scene left to right.</p>
      <button type="button" className="dept-act" data-cursor="link" onClick={deal}>{actLabel}</button>
    </div>
  );
}
