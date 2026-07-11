"use client";

/* — SC 03 · NOW SCREENING — a dolly move through tonight's programme.
   The scroll pushes the camera along five featured pictures. — */

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useFilm, useScene } from "@/lib/film";
import { FEATURED, projectById, stageOfProject } from "@/data/projects";
import CutLink from "@/components/CutLink";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Screening() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const film = useFilm();
  useScene(ref, { slate: "SC 03 · NOW SCREENING", ratio: 2.39 }, { timeline: true, id: "screening", padX: false });

  useGSAP(() => {
    if (film.reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 701px) and (orientation: landscape)", () => {
      const track = trackRef.current!;
      const dist = () => track.scrollWidth - window.innerWidth;
      const dolly = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => "+=" + dist(),
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      /* each plate's still drifts against the dolly — a whisper of parallax */
      gsap.utils.toArray<HTMLElement>(".plate .cell img").forEach((img) => {
        gsap.fromTo(img, { xPercent: -4 }, {
          xPercent: 4, ease: "none",
          scrollTrigger: {
            trigger: img.closest(".plate") as Element,
            containerAnimation: dolly,
            start: "left right", end: "right left", scrub: true,
          },
        });
      });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [film.reduced] });

  return (
    <section id="screening" ref={ref}>
      <div className="safe"><div className="frame" style={{ justifyContent: "center" }}>
        <h2 className="vh">Now screening — five featured pictures</h2>
        <div className="dolly-head">
          <span><b>Now screening</b> — tonight&rsquo;s programme</span>
          <span className="hover-hint">Dolly shot · {FEATURED.length} pictures</span>
        </div>
        <div className="dolly" ref={trackRef}>
          {FEATURED.map((id, i) => {
            const p = projectById[id];
            const stg = stageOfProject(id);
            return (
              <CutLink key={id} href={"/film/" + id} className={"plate" + (p.board ? " board" : "")} data-cursor="frame">
                <span className="pl-no">
                  {String(i + 1).padStart(2, "0")} / {String(FEATURED.length).padStart(2, "0")}
                  {stg ? " · STAGE " + stg.key.toUpperCase() : ""}
                </span>
                <div className="cell">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.still} alt={p.name + " — " + p.logline} loading={i === 0 ? "eager" : "lazy"} />
                </div>
                <span className="pl-title">{p.name}</span>
                <div className="pl-meta"><b>{p.stack}</b><span>{p.year}</span></div>
              </CutLink>
            );
          })}
        </div>
      </div></div>
    </section>
  );
}
