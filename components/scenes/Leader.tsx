"use client";

/* — SC 01 · THE COLD OPEN — a slate types itself once the gate is struck — */

import React, { useEffect, useRef } from "react";
import { useFilm, useScene } from "@/lib/film";

const LINE = "SC 01 · INT. BLACK · NIGHT — PARRV, A PORTFOLIO IN 24 SECONDS";
const HINT = "( SCROLL TO ROLL )";

function typeOn(el: HTMLElement, text: string, delay: number, done?: () => void) {
  el.textContent = "";
  let i = 0;
  const timers: ReturnType<typeof setTimeout>[] = [];
  const tick = () => {
    i++;
    el.textContent = text.slice(0, i) + (i < text.length ? "_" : "");
    if (i < text.length) timers.push(setTimeout(tick, 26 + Math.random() * 22));
    else { el.innerHTML = text.replace(/^(SC \d+)/, "<b>$1</b>"); done?.(); }
  };
  timers.push(setTimeout(tick, delay));
  return () => timers.forEach(clearTimeout);
}

export default function Leader() {
  const ref = useRef<HTMLElement>(null);
  const film = useFilm();
  const typed = useRef(false);
  useScene(ref, { slate: "SC 01 · INT. BLACK · NIGHT", ratio: 2.39 }, { timeline: true, id: "leader" });

  useEffect(() => {
    if (!film.gateOpen || typed.current) return;
    typed.current = true;
    const line = ref.current?.querySelector<HTMLElement>("#slate-line");
    const hint = ref.current?.querySelector<HTMLElement>("#roll-hint");
    if (!line || !hint) return;
    if (film.reduced) {
      line.innerHTML = LINE.replace(/^(SC \d+)/, "<b>$1</b>");
      hint.textContent = HINT;
      return;
    }
    let c2: (() => void) | undefined;
    const c1 = typeOn(line, LINE, 700, () => { c2 = typeOn(hint, HINT, 400); });
    return () => { c1(); c2?.(); };
  }, [film.gateOpen, film.reduced]);

  return (
    <section id="leader" ref={ref}>
      <div className="safe"><div className="frame">
        <h2 className="vh">Cold open</h2>
        <p className="slate-line" id="slate-line"><b>SC 01</b> · INT. BLACK · NIGHT — PARRV, A PORTFOLIO IN 24 SECONDS</p>
        <p className="roll-hint" id="roll-hint">( SCROLL TO ROLL )</p>
      </div></div>
    </section>
  );
}
