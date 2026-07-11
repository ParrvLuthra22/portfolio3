"use client";

/* ============ A PICTURE — one project, full-bleed, A24 style ============
   The still is the set; the title stands on it. Holding the page shoots
   the scene, same as holding it in the stage. */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useFilm, useSetScene } from "@/lib/film";
import { useGame } from "@/lib/game";
import { projectById, stageOfProject, nextProject, ALL_IDS } from "@/data/projects";
import CutLink from "@/components/CutLink";

if (typeof window !== "undefined") gsap.registerPlugin(useGSAP);

export default function FilmSet({ id }: { id: string }) {
  const p = projectById[id];
  const stg = stageOfProject(id)!;
  const next = nextProject(id);
  const game = useGame();
  const film = useFilm();
  const ref = useRef<HTMLElement>(null);
  useSetScene({ slate: `STAGE ${stg.key.toUpperCase()} · ${p.name.toUpperCase()}`, ratio: 2.39 });

  /* holding the picture for a beat shoots the scene */
  useEffect(() => {
    if (!game.ready || game.st.seen[id]) return;
    const t = setTimeout(() => {
      if (!game.see(id)) return;
      game.xp(10, "SCENE SHOT — " + p.name.toUpperCase());
      game.play("blip");
      if (ALL_IDS.every((i) => game.st.seen[i])) game.ach("martini-shot");
      game.reelCheck(stg.key, stg.projects.map((x) => x.id));
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.ready]);

  useGSAP(() => {
    if (film.reduced) {
      gsap.set(".film-title .lt i", { yPercent: 0, y: 0 });
      return;
    }
    /* y:0 in both states — the CSS translateY fallback must not survive as a baked offset */
    gsap.fromTo(".film-title .lt i", { yPercent: 110, y: 0 }, { yPercent: 0, y: 0, stagger: 0.04, duration: 0.8, ease: "power3.out", delay: 0.25 });
    gsap.fromTo(".film-log, .film-kicker", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power2.out", delay: 0.5 });
    gsap.fromTo(".backdrop img", { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "power2.out" });
  }, { scope: ref, dependencies: [film.reduced] });

  return (
    <main ref={ref}>
      <div className={"film-hero" + (p.board ? " board" : "")}>
        <div className="backdrop" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.still} alt="" />
        </div>
        <p className="film-kicker">
          <b>Stage {stg.key.toUpperCase()} · {stg.unit}</b> · {stg.domain}{p.flag ? " · " + p.flag : ""}
        </p>
        <h1 className="film-title" aria-label={p.name}>
          {p.name.split("").map((c, i) => (
            <span className="lt" key={i} aria-hidden="true"><i>{c === " " ? " " : c}</i></span>
          ))}
        </h1>
        <p className="film-log">{p.logline}</p>
      </div>
      <div className="film-body">
        <div className="film-meta">
          <span><b>Stack</b><i>{p.stack}</i></span>
          <span><b>Year</b><i>{p.year}</i></span>
          <span><b>Unit</b><i>{stg.unit}</i></span>
          <span><b>Print</b><i>{p.board ? "Storyboard panel" : "Production still"}</i></span>
        </div>
        <div className="scene-links" style={{ marginTop: 0 }}>
          {p.live && <a className="scene-link" href={p.live} target="_blank" rel="noopener" data-cursor="link" style={{ marginTop: 0 }}>{p.liveLabel || "Enter scene"} →</a>}
          {p.src && <a className="scene-link" href={p.src} target="_blank" rel="noopener" data-cursor="link" style={{ marginTop: 0 }}>Source →</a>}
          <CutLink className="scene-link" href={"/stage/" + stg.key} style={{ marginTop: 0 }} data-cursor="link">Back to Stage {stg.key.toUpperCase()} →</CutLink>
        </div>
      </div>
      <CutLink className="preroll" href={"/film/" + next.id} data-cursor="frame">
        <span className="pr-k">Coming attractions · next picture</span>
        <span className="pr-t">{next.name}</span>
      </CutLink>
    </main>
  );
}
