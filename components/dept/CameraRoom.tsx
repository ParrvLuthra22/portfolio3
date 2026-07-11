"use client";

/* ============ CAMERA DEPT · THE FOCUS PULL ============
   The subject drifts on three sines. Hold it inside ±0.07 for thirty seconds.
   The chart blurs by crossfading a statically-filtered layer — opacity only. */

import React, { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/game";
import { useFinish } from "./DeptSet";

function Chart() {
  return (
    <svg className="chart-face" viewBox="0 0 300 170" aria-hidden="true">
      <rect x="1" y="1" width="298" height="168" fill="none" stroke="#8E958D" strokeWidth="1" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i} x1="150" y1="85"
            x2={(150 + Math.cos(a) * 66).toFixed(1)} y2={(85 + Math.sin(a) * 66).toFixed(1)}
            stroke={i % 2 ? "#E5E3DA" : "#2E332F"} strokeWidth="3"
          />
        );
      })}
      <circle cx="150" cy="85" r="12" fill="#0E0F0D" stroke="#E5E3DA" />
      <text x="150" y="160" fill="#8E958D" fontFamily="Courier Prime,monospace" fontSize="10" textAnchor="middle" letterSpacing="3">
        FOCUS CHART · PARRV PICTURES
      </text>
    </svg>
  );
}

export default function CameraRoom() {
  const game = useGame();
  const finish = useFinish();
  const [actLabel, setActLabel] = useState("Roll camera");
  const ffRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLElement>(null);
  const subjectRef = useRef<HTMLElement>(null);
  const readRef = useRef<HTMLElement>(null);
  const softRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLElement>(null);
  const pctRef = useRef<HTMLElement>(null);
  const lens = useRef(0.5);
  const liveRef = useRef<(() => void) | null>(null);

  const paintLens = () => {
    const l = lens.current;
    if (thumbRef.current) thumbRef.current.style.left = (l * 100).toFixed(2) + "%";
    if (readRef.current) readRef.current.textContent = l > 0.985 ? "∞" : (1.2 * Math.pow(5, l)).toFixed(1) + " M";
    ffRef.current?.setAttribute("aria-valuenow", String(Math.round(l * 100)));
  };

  useEffect(() => {
    paintLens();
    const ff = ffRef.current!, track = trackRef.current!;
    let dragging = false;
    const fromEvent = (e: PointerEvent) => {
      const r = track.getBoundingClientRect();
      lens.current = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      paintLens();
    };
    const down = (e: PointerEvent) => { dragging = true; fromEvent(e); try { ff.setPointerCapture(e.pointerId); } catch { /* fine */ } };
    const move = (e: PointerEvent) => { if (dragging) fromEvent(e); };
    const up = () => { dragging = false; };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") { lens.current = Math.min(1, lens.current + 0.045); paintLens(); e.preventDefault(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { lens.current = Math.max(0, lens.current - 0.045); paintLens(); e.preventDefault(); }
    };
    ff.addEventListener("pointerdown", down);
    ff.addEventListener("pointermove", move);
    ff.addEventListener("pointerup", up);
    ff.addEventListener("pointercancel", up);
    ff.addEventListener("keydown", key);
    return () => {
      liveRef.current?.();
      ff.removeEventListener("pointerdown", down);
      ff.removeEventListener("pointermove", move);
      ff.removeEventListener("pointerup", up);
      ff.removeEventListener("pointercancel", up);
      ff.removeEventListener("keydown", key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    liveRef.current?.();
    game.replay("camera");
    setActLabel("Cut — start over");
    const p1 = Math.random() * 7, p2 = Math.random() * 7, p3 = Math.random() * 7;
    const t0 = performance.now();
    let inMs = 0, lastT = t0, raf = 0, done = false;
    const loop = () => {
      if (done) return;
      const now = performance.now(), t = (now - t0) / 1000, dt = now - lastT;
      lastT = now;
      const subj = Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(0.5 * t + p1) + 0.17 * Math.sin(1.13 * t + p2) + 0.08 * Math.sin(2.09 * t + p3)));
      if (subjectRef.current) subjectRef.current.style.left = (subj * 100).toFixed(2) + "%";
      const err = Math.abs(subj - lens.current);
      if (err < 0.07) inMs += dt;
      if (softRef.current) softRef.current.style.opacity = Math.min(1, err * 4.5).toFixed(3);
      const left = Math.max(0, 30 - t);
      if (clockRef.current) clockRef.current.textContent = left.toFixed(1);
      if (pctRef.current) pctRef.current.textContent = Math.round((inMs / Math.max(1, now - t0)) * 100) + "%";
      if (left <= 0) {
        done = true;
        const pct = Math.round((inMs / (now - t0)) * 100);
        if (pctRef.current) pctRef.current.textContent = pct + "%";
        setActLabel("Roll again");
        game.play(pct >= 50 ? "chime" : "miss");
        finish("camera", pct, [50, 70, 85], Math.round(pct / 10), "WRAP — CAMERA DEPT");
        liveRef.current = null;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    liveRef.current = () => { done = true; cancelAnimationFrame(raf); };
  }

  return (
    <div className="dept-room">
      <div className="dept-hud">
        <span>Clock <b ref={clockRef}>30.0</b></span>
        <span>In focus <b ref={pctRef}>—</b></span>
        <span>Tolerance <b>±0.07</b></span>
      </div>
      <div className="dept-stage">
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="ff-chart">
            <Chart />
            <div className="soft" ref={softRef}><Chart /></div>
          </div>
          <div
            className="ff" ref={ffRef} role="slider" tabIndex={0}
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={50}
            aria-label="Follow focus — match the drifting subject" data-cursor="scrub"
          >
            <span className="ff-title"><span>Follow focus — drag · arrows</span><b ref={readRef}>1.2 M</b></span>
            <span className="ff-scale" aria-hidden="true"><span>0.6</span><span>1</span><span>2</span><span>5</span><span>∞</span></span>
            <span className="ff-track" ref={trackRef}>
              <i className="ff-subject" ref={subjectRef}></i>
              <i className="ff-thumb" ref={thumbRef}></i>
            </span>
          </div>
        </div>
      </div>
      <p className="dept-note">The subject drifts. Drag the ring — or use the arrow keys — to hold it inside the depth of field.</p>
      <button type="button" className="dept-act" data-cursor="link" onClick={run}>{actLabel}</button>
    </div>
  );
}
