"use client";

/* ============ TRANSPORT · THE REEL RUN ============
   Jump the sandbags and C-stands; a boom pole means stay low. Line art
   on canvas, same print as the lot. */

import React, { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/game";
import { useFinish } from "./DeptSet";

const W = 1440, H = 440, GROUND = 360, R = 52;
const SILVER = "#8E958D", BONE = "#E5E3DA", DIM = "rgba(142,149,141,.4)";

export default function RunnerRoom() {
  const game = useGame();
  const finish = useFinish();
  const [actLabel, setActLabel] = useState("Roll it");
  const cvRef = useRef<HTMLCanvasElement>(null);
  const ftRef = useRef<HTMLElement>(null);
  const bestRef = useRef<HTMLElement>(null);
  const spdRef = useRef<HTMLElement>(null);
  const liveRef = useRef<(() => void) | null>(null);

  function reel(x: CanvasRenderingContext2D, cx: number, cy: number, rot: number) {
    x.strokeStyle = BONE; x.lineWidth = 3;
    x.beginPath(); x.arc(cx, cy, R, 0, 7); x.stroke();
    x.beginPath(); x.arc(cx, cy, 10, 0, 7); x.stroke();
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      x.beginPath();
      x.moveTo(cx + Math.cos(a) * 12, cy + Math.sin(a) * 12);
      x.lineTo(cx + Math.cos(a) * (R - 4), cy + Math.sin(a) * (R - 4));
      x.stroke();
    }
    x.lineWidth = 1;
  }

  useEffect(() => {
    const cv = cvRef.current!;
    const x = cv.getContext("2d")!;
    x.clearRect(0, 0, W, H);
    x.strokeStyle = DIM; x.beginPath(); x.moveTo(0, GROUND + 0.5); x.lineTo(W, GROUND + 0.5); x.stroke();
    reel(x, 200, GROUND - R, 0);
    x.fillStyle = SILVER; x.font = '22px "Courier Prime",monospace'; x.textAlign = "center";
    x.fillText("TRANSPORT — ROLL IT", W / 2, H / 2 - 10);
    return () => { liveRef.current?.(); };
  }, []);

  function run() {
    liveRef.current?.();
    game.replay("runner");
    setActLabel("Cut — start over");
    const cv = cvRef.current!;
    const x = cv.getContext("2d")!;
    let dist = 0, speed = 7, y = GROUND - R, vy = 0, air = false, rot = 0, over = false, raf = 0;
    let obs: { kind: "bag" | "stand" | "boom"; x: number }[] = [];
    let nextAt = 900;
    const spawn = () => {
      const roll = Math.random();
      obs.push({ kind: roll < 0.42 ? "bag" : roll < 0.75 ? "stand" : "boom", x: W + 80 });
      nextAt = 520 + Math.random() * 720;
    };
    const jump = () => { if (!air && !over) { vy = -21; air = true; game.play("blip"); } };
    const drop = () => { if (air) vy = Math.max(vy, 14); };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); jump(); }
      if (e.code === "ArrowDown") { e.preventDefault(); drop(); }
    };
    const onTap = (e: PointerEvent) => { e.preventDefault(); jump(); };
    addEventListener("keydown", onKey);
    cv.addEventListener("pointerdown", onTap);
    const cleanup = () => {
      cancelAnimationFrame(raf);
      removeEventListener("keydown", onKey);
      cv.removeEventListener("pointerdown", onTap);
    };
    const crash = () => {
      over = true;
      game.play("miss");
      x.fillStyle = BONE; x.font = '26px "Courier Prime",monospace'; x.textAlign = "center";
      x.fillText("THE CAN CAME OPEN — " + Math.round(dist) + " FT", W / 2, 150);
      setActLabel("Roll again");
      const ft = Math.round(dist);
      if (bestRef.current) bestRef.current.textContent = Math.max(ft, game.st.best.runner || 0) + " FT";
      finish("runner", ft, [500, 1500, 3000], Math.round(ft / 100), "REEL RUN — " + ft + " FT");
      cleanup();
      liveRef.current = null;
    };
    const loop = () => {
      if (over) return;
      dist += speed / 8; speed = 7 + Math.min(9, dist / 280);
      nextAt -= speed; if (nextAt <= 0) spawn();
      if (air) { y += vy; vy += 1.6; if (y >= GROUND - R) { y = GROUND - R; air = false; vy = 0; } }
      rot += speed / R;
      obs.forEach((o) => (o.x -= speed));
      obs = obs.filter((o) => o.x > -160);
      x.clearRect(0, 0, W, H);
      x.strokeStyle = DIM; x.beginPath(); x.moveTo(0, GROUND + 0.5); x.lineTo(W, GROUND + 0.5); x.stroke();
      const off = (dist * 8) % 560;
      for (let px = -off; px < W; px += 560) {
        x.strokeStyle = "rgba(142,149,141,.18)";
        x.beginPath(); x.moveTo(px, GROUND); x.lineTo(px, GROUND - 16); x.stroke();
      }
      x.strokeStyle = SILVER; x.lineWidth = 2;
      obs.forEach((o) => {
        if (o.kind === "bag") { /* sandbag: low lump — jump it */
          x.beginPath(); x.moveTo(o.x - 34, GROUND); x.quadraticCurveTo(o.x, GROUND - 58, o.x + 34, GROUND); x.stroke();
        } else if (o.kind === "stand") { /* c-stand: tall — jump it (tight) */
          x.beginPath(); x.moveTo(o.x, GROUND); x.lineTo(o.x, GROUND - 108);
          x.moveTo(o.x - 26, GROUND); x.lineTo(o.x, GROUND - 34);
          x.moveTo(o.x + 26, GROUND); x.lineTo(o.x, GROUND - 34);
          x.moveTo(o.x - 30, GROUND - 108); x.lineTo(o.x + 30, GROUND - 108); x.stroke();
        } else { /* boom: hangs low — stay grounded */
          x.beginPath(); x.moveTo(o.x - 120, 0); x.lineTo(o.x, GROUND - 150); x.stroke();
          x.fillStyle = SILVER; x.fillRect(o.x - 7, GROUND - 150, 14, 26);
        }
      });
      reel(x, 200, y, rot);
      x.lineWidth = 1;
      const rx = 200, ry = y;
      for (const o of obs) {
        if (o.kind === "bag" && Math.abs(o.x - rx) < R + 18 && ry > GROUND - R - 46) return crash();
        if (o.kind === "stand" && Math.abs(o.x - rx) < R + 6 && ry > GROUND - R - 96) return crash();
        if (o.kind === "boom" && Math.abs(o.x - rx) < R + 10 && ry < GROUND - R - 22) return crash();
      }
      if (ftRef.current) ftRef.current.textContent = Math.round(dist) + " FT";
      if (spdRef.current) spdRef.current.textContent = (speed / 7).toFixed(1) + "×";
      raf = requestAnimationFrame(loop);
    };
    loop();
    liveRef.current = () => { over = true; cleanup(); };
  }

  return (
    <div className="dept-room">
      <div className="dept-hud">
        <span>Distance <b ref={ftRef}>0 FT</b></span>
        <span>Best <b ref={bestRef}>{(game.st.best.runner || 0) + " FT"}</b></span>
        <span>Speed <b ref={spdRef}>1.0×</b></span>
      </div>
      <div className="dept-stage">
        <div className="runner-wrap">
          <canvas ref={cvRef} width={W} height={H} aria-label="The reel run — jump the sandbags, stay under the boom" />
        </div>
      </div>
      <p className="dept-note">Space or tap to jump the sandbags and C-stands. A boom pole means stay low — do not jump.</p>
      <button type="button" className="dept-act" data-cursor="link" onClick={run}>{actLabel}</button>
    </div>
  );
}
