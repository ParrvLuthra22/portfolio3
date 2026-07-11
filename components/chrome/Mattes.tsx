"use client";

/* ============ THE GATE — four mattes and everything printed on them ============ */

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useFilm } from "@/lib/film";
import { useGame } from "@/lib/game";
import CutLink from "@/components/CutLink";
import CameraReport from "./CameraReport";
import CallSheet from "@/components/game/CallSheet";

export default function Mattes() {
  const film = useFilm();
  const game = useGame();
  const pathname = usePathname();
  const tcRef = useRef<HTMLSpanElement>(null);
  const playheadRef = useRef<HTMLElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const onReel = pathname === "/";

  /* timecode: scroll is the playhead — 24s @ 24fps across the current page */
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    let queued = false;
    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      const f = Math.round(p * 576);
      if (tcRef.current) tcRef.current.textContent = "00:00:" + pad(Math.floor(f / 24)) + ":" + pad(f % 24);
      if (playheadRef.current) playheadRef.current.style.left = p * 100 + "%";
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    addEventListener("scroll", onScroll, { passive: true });
    paint();
    return () => removeEventListener("scroll", onScroll);
  }, [pathname]);

  /* the reel timeline: notches cut, dragging scrubs */
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl || !onReel) return;
    let scrubbing = false;
    const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
    const scrub = (e: PointerEvent) => {
      const r = tl.getBoundingClientRect();
      const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const lenis = film.lenis();
      if (lenis) lenis.scrollTo(f * maxScroll(), { immediate: true });
      else scrollTo({ top: f * maxScroll(), behavior: "instant" });
    };
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest(".notch")) return;
      scrubbing = true;
      document.body.classList.add("scrubbing");
      scrub(e);
      try { tl.setPointerCapture(e.pointerId); } catch { /* fine */ }
    };
    const move = (e: PointerEvent) => { if (scrubbing) scrub(e); };
    const up = () => { if (scrubbing) { scrubbing = false; document.body.classList.remove("scrubbing"); } };
    tl.addEventListener("pointerdown", down);
    tl.addEventListener("pointermove", move);
    tl.addEventListener("pointerup", up);
    tl.addEventListener("pointercancel", up);
    return () => {
      tl.removeEventListener("pointerdown", down);
      tl.removeEventListener("pointermove", move);
      tl.removeEventListener("pointerup", up);
      tl.removeEventListener("pointercancel", up);
    };
  }, [onReel, film]);

  const notches = onReel ? film.timelineRef.current : [];
  const max = typeof document !== "undefined" ? document.documentElement.scrollHeight - innerHeight : 1;

  return (
    <>
      <div id="matte-top" className="matte">
        <span className="hud" id="slate">{film.slate}</span>
        <span className="hud" id="rank-hud" aria-live="off">
          <b>{game.rank()[0]}</b><span>{game.st.xp} XP</span>
        </span>
        <CallSheet />
        <CameraReport />
        <span id="toast" className="hud" role="status" aria-live="polite"></span>
      </div>
      <div id="matte-bottom" className="matte">
        <span className="hud" id="tc" ref={tcRef}>00:00:00:00</span>
        <button
          type="button" id="mos-btn" className="hud-btn" data-cursor="link"
          aria-pressed={game.st.sound}
          aria-label={game.st.sound ? "Sound — on" : "Sound — currently muted (MOS)"}
          onClick={() => game.setSound(!game.st.sound)}
        >{game.st.sound ? "SND" : "MOS"}</button>
        <CutLink className="hud" id="pcut-btn" href="/filmography" data-cursor="link">Producer&rsquo;s cut</CutLink>
        {onReel && (
          <div id="timeline" ref={tlRef} data-cursor="scrub" aria-label="Reel timeline — drag to scrub">
            <div className="track"></div>
            {notches.map((n) => (
              <button
                key={n.id} type="button" className="notch"
                style={{ left: (max > 0 ? Math.min(1, n.el.offsetTop / max) : 0) * 100 + "%" }}
                aria-label={"Cut to " + n.slate}
                onClick={() => film.scrollToEl(n.el)}
              />
            ))}
            <i id="playhead" ref={playheadRef} aria-hidden="true" />
          </div>
        )}
        <span className="hud" id="ratio-hud">{film.ratioLabel}</span>
        <span className="hud" id="rec"><i></i>REC</span>
      </div>
      <div id="matte-left" className="matte"></div>
      <div id="matte-right" className="matte"></div>
    </>
  );
}
