"use client";

/* ============ A STAGE INTERIOR — scenes plated left and right ============
   A scene is "shot" when it holds the frame for a beat (900ms). Shoot every
   scene on the stage and its reel is struck. */

import React, { useEffect, useRef } from "react";
import { useFilm, useSetScene } from "@/lib/film";
import { useGame } from "@/lib/game";
import { STAGES, stageByKey, ALL_IDS } from "@/data/projects";
import CutLink from "@/components/CutLink";

export default function StageSet({ stageKey }: { stageKey: string }) {
  const s = stageByKey[stageKey];
  const game = useGame();
  const film = useFilm();
  const ref = useRef<HTMLDivElement>(null);
  useSetScene({ slate: `STAGE ${s.key.toUpperCase()} · ${s.unit.toUpperCase()}`, ratio: 1.85 });

  /* first light */
  useEffect(() => {
    if (game.ready) game.markVisited(s.key, STAGES.map((x) => x.key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.ready]);

  /* a scene is shot when it holds the frame */
  useEffect(() => {
    if (!game.ready) return;
    const root = ref.current;
    if (!root) return;
    const timers = new Map<string, ReturnType<typeof setTimeout>>();
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const card = e.target as HTMLElement;
      const id = card.dataset.id!;
      if (e.isIntersecting && !game.st.seen[id]) {
        timers.set(id, setTimeout(() => {
          if (!game.see(id)) return;
          const p = s.projects.find((x) => x.id === id)!;
          game.xp(10, "SCENE SHOT — " + p.name.toUpperCase());
          game.play("blip");
          if (ALL_IDS.every((i) => game.st.seen[i])) game.ach("martini-shot");
          if (game.reelCheck(s.key, s.projects.map((x) => x.id))) {
            const dot = document.querySelector(".set-head .stg-reel");
            dot?.closest(".set-head")?.classList.add("reel-flash");
          }
        }, 900));
      } else {
        clearTimeout(timers.get(id));
        timers.delete(id);
      }
    }), { threshold: 0.45 });
    root.querySelectorAll(".scene").forEach((c) => io.observe(c));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.ready]);

  /* entrances: the stage's own observer staggers the scenes in */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (film.reduced) {
      root.querySelectorAll(".scene").forEach((c) => c.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    root.querySelectorAll(".scene").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [film.reduced]);

  const seen = s.projects.filter((p) => game.st.seen[p.id]).length;

  return (
    <main className="set-page" ref={ref} aria-label={`Stage ${s.key.toUpperCase()} — ${s.unit}`}>
      <div className={"set-head" + (game.st.reels[s.key] ? " reeled" : "")}>
        <span className="set-letter">{s.key.toUpperCase()}</span>
        <span className="set-title">{s.unit}</span>
        <span className="set-sub">{s.domain}</span>
        <span className="set-prog">REEL {s.key.toUpperCase()} · {seen} / {s.projects.length} SCENES</span>
        <span className={"stg-reel" + (game.st.reels[s.key] ? " struck" : "")} aria-hidden="true"></span>
        <CutLink className="set-back" href="/#backlot" back data-cursor="link">← Back to lot</CutLink>
      </div>
      {s.projects.map((p, i) => {
        const shot = !!game.st.seen[p.id];
        return (
          <article className={"scene" + (p.board ? " board" : "")} data-id={p.id} key={p.id}>
            <figure className="still rack" data-cursor="frame">
              <div className="cell">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.still} alt={p.name + " — " + p.logline} loading="lazy" />
                <div className="defocus" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.still} alt="" />
                </div>
              </div>
              <figcaption>{p.name}{p.board ? " — storyboard panel" : " — production still"}</figcaption>
            </figure>
            <div className="scene-info">
              <p className="take"><b>Take {String(i + 1).padStart(2, "0")}</b> · <span className="tk">{shot ? "scene shot" : "not yet shot"}</span></p>
              {p.flag && <span className="flag">{p.flag}</span>}
              <h3 className="scene-kicker">
                <CutLink href={"/film/" + p.id} data-cursor="link">{p.name} →</CutLink>
              </h3>
              <p className="logline">{p.logline}</p>
              <div className="meta-row"><span><b>Stack</b>{p.stack}</span><span><b>Year</b>{p.year}</span></div>
              <div className="scene-links">
                {p.live && <a className="scene-link" href={p.live} target="_blank" rel="noopener" data-cursor="link" aria-label={(p.liveLabel || "Enter scene") + " — " + p.name + " live"}>{p.liveLabel || "Enter scene"} →</a>}
                {p.src && <a className="scene-link" href={p.src} target="_blank" rel="noopener" data-cursor="link" aria-label={p.name + " source on GitHub"}>Source →</a>}
              </div>
            </div>
          </article>
        );
      })}
      <CutLink className="set-back" href="/#backlot" back data-cursor="link">← Back to lot</CutLink>
    </main>
  );
}
