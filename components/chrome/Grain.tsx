"use client";

/* ============ GRAIN — pre-rendered canvas tiles swapped at ~12fps ============
   No SVG filters, no per-frame noise generation. EI from the camera report
   sets the opacity. Reduced motion gets one static frame. */

import React, { useEffect, useRef } from "react";
import { useFilm } from "@/lib/film";

export default function Grain() {
  const film = useFilm();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const T = 180;
    const tiles: HTMLCanvasElement[] = [];
    for (let t = 0; t < 6; t++) {
      const c = document.createElement("canvas");
      c.width = c.height = T;
      const x = c.getContext("2d")!;
      const img = x.createImageData(T, T), d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = Math.random() < 0.55 ? 0 : (30 + Math.random() * 80) | 0;
      }
      x.putImageData(img, 0, 0);
      tiles.push(c);
    }
    let pats: CanvasPattern[] = [];
    let k = 0;
    const draw = () => {
      if (!pats.length) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.save();
      ctx.translate(-((Math.random() * T) | 0), -((Math.random() * T) | 0));
      ctx.fillStyle = pats[(k = (k + 1) % pats.length)];
      ctx.fillRect(0, 0, cv.width + T, cv.height + T);
      ctx.restore();
    };
    const size = () => {
      cv.width = Math.ceil(innerWidth / 2);
      cv.height = Math.ceil(innerHeight / 2);
      pats = tiles.map((t) => ctx.createPattern(t, "repeat")!);
      draw();
    };
    size();
    addEventListener("resize", size);
    let iv: ReturnType<typeof setInterval> | undefined;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) iv = setInterval(draw, 85);
    return () => { removeEventListener("resize", size); if (iv) clearInterval(iv); };
  }, []);

  return (
    <>
      <div
        id="exposure" aria-hidden="true"
        style={film.wash ? { background: film.wash[0], opacity: film.wash[1] } : { opacity: 0 }}
      />
      <canvas id="grain" ref={ref} aria-hidden="true" style={{ opacity: film.grainO }} />
    </>
  );
}
