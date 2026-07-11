"use client";

/* ============ CURSOR — the focus puller ============
   A ring that racks to frame brackets over stills, opens over links.
   The label reads the print's stop. Pointer:fine only. */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useFilm } from "@/lib/film";

const LABEL: Record<string, string> = { frame: "f/1.8", link: "OPEN", scrub: "SCRUB" };

export default function Cursor() {
  const film = useFilm();
  const ref = useRef<HTMLDivElement>(null);
  const stopRef = useRef(film.print.stop);
  stopRef.current = film.print.stop;

  useEffect(() => {
    const cur = ref.current;
    if (!cur || !matchMedia("(pointer:fine)").matches) {
      document.body.classList.add("no-cursor");
      return;
    }
    document.body.classList.remove("no-cursor");
    const label = cur.querySelector<HTMLElement>(".c-label")!;
    const xTo = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3.out" });
    let live = false;
    const paint = () => {
      label.textContent = LABEL[cur.dataset.state || ""] || "f/" + stopRef.current;
    };
    const onMove = (e: MouseEvent) => {
      if (!live) { live = true; cur.classList.add("live"); gsap.set(cur, { x: e.clientX, y: e.clientY }); }
      xTo(e.clientX); yTo(e.clientY);
    };
    const onLeave = () => { live = false; cur.classList.remove("live"); };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      cur.dataset.state = t ? t.dataset.cursor! : "default";
      paint();
    };
    addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    paint();
    return () => {
      removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  /* the stop changed — repaint the idle label */
  useEffect(() => {
    const cur = ref.current;
    if (!cur) return;
    const label = cur.querySelector<HTMLElement>(".c-label");
    if (label && (!cur.dataset.state || cur.dataset.state === "default"))
      label.textContent = "f/" + film.print.stop;
  }, [film.print.stop]);

  return (
    <div id="cursor" ref={ref} data-state="default" aria-hidden="true">
      <div className="c-ring"></div>
      <div className="c-dot"></div>
      <span className="c-bk bk1"></span><span className="c-bk bk2"></span>
      <span className="c-bk bk3"></span><span className="c-bk bk4"></span>
      <span className="c-label">f/5.6</span>
    </div>
  );
}
