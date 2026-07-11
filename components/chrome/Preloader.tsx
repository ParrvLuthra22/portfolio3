"use client";

/* ============ THE LEADER — a countdown, a choice, the gate opens ============
   Film leaders cut to the feature at 2. So does this one: the count holds
   there and the visitor chooses how to enter. The choice is the sound
   gesture the projector needs. Once per session. */

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useFilm } from "@/lib/film";
import { useGame } from "@/lib/game";
import { sfx } from "@/lib/sound";

const SEEN = "parrv-gate";

export default function Preloader() {
  const film = useFilm();
  const game = useGame();
  const [show, setShow] = useState<boolean | null>(null);
  const [num, setNum] = useState(3);
  const [armed, setArmed] = useState(false);
  const [struck, setStruck] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem(SEEN); } catch { /* fine */ }
    setShow(!seen);
    if (seen) return;
    document.body.style.overflow = "hidden";
    if (film.reduced) { setNum(2); setArmed(true); return; }
    /* two sweeps: 3 → 2, then hold at 2 with the doors */
    const ring = ringRef.current;
    const C = 2 * Math.PI * 46;
    const tl = gsap.timeline();
    if (ring) {
      gsap.set(ring, { strokeDasharray: C, strokeDashoffset: C });
      tl.to(ring, { strokeDashoffset: 0, duration: 0.85, ease: "none" })
        .call(() => setNum(2))
        .set(ring, { strokeDashoffset: C })
        .to(ring, { strokeDashoffset: C * 0.25, duration: 0.7, ease: "none" })
        .call(() => setArmed(true));
    } else {
      setNum(2); setArmed(true);
    }
    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function enter(sound: boolean) {
    try { sessionStorage.setItem(SEEN, "1"); } catch { /* fine */ }
    if (sound) { game.setSound(true); sfx("beep"); }
    else if (game.st.sound) game.setSound(false);
    setStruck(true);
    document.body.style.overflow = "";
    film.strike();
    film.setGateOpen(true);
    setTimeout(() => setShow(false), 600);
    setTimeout(() => {
      game.toast("CLOCKED IN · RANK PA — SHOOT EVERY SCENE ON A STAGE TO STRIKE ITS REEL");
    }, 1600);
  }

  /* nothing yet decided (SSR) or already entered this session */
  useEffect(() => {
    if (show === false) film.setGateOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  return (
    <div id="leader-gate" className={struck ? "struck" : ""} role="dialog" aria-label="Enter the backlot">
      <p className="lg-head">Parrv Pictures — an answer print</p>
      <div className="lg-count" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <line x1="50" y1="2" x2="50" y2="22" stroke="rgba(142,149,141,.35)" strokeWidth="0.6" />
          <line x1="50" y1="78" x2="50" y2="98" stroke="rgba(142,149,141,.35)" strokeWidth="0.6" />
          <line x1="2" y1="50" x2="22" y2="50" stroke="rgba(142,149,141,.35)" strokeWidth="0.6" />
          <line x1="78" y1="50" x2="98" y2="50" stroke="rgba(142,149,141,.35)" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(142,149,141,.25)" strokeWidth="0.6" />
          <circle
            ref={ringRef} cx="50" cy="50" r="46" fill="none"
            stroke="#E5E3DA" strokeWidth="1.2" transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="num">{num}</span>
      </div>
      <div className={"lg-enter" + (armed ? " on" : "")}>
        <button type="button" data-cursor="link" onClick={() => enter(true)} disabled={!armed}>
          Enter with sound
        </button>
        <button type="button" data-cursor="link" onClick={() => enter(false)} disabled={!armed}>
          Enter MOS — silent
        </button>
      </div>
      <p className="lg-note">A portfolio shot on a studio backlot · 24s at 24fps</p>
    </div>
  );
}
