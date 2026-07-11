"use client";

/* — SC 02 · TITLE CARD — pinned; the scroll racks the letters up from
   behind the matte line, sweeps the streak, resolves the role. — */

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useFilm, useScene } from "@/lib/film";
import { SITE } from "@/data/projects";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TitleCard() {
  const ref = useRef<HTMLElement>(null);
  const film = useFilm();
  useScene(ref, { slate: "SC 02 · TITLE CARD", ratio: 2.39 }, { timeline: true, id: "title" });

  useGSAP(() => {
    if (film.reduced) {
      gsap.set("#name .lt i", { yPercent: 0, y: 0 });
      gsap.set(".role-line", { opacity: 1 });
      return;
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: 0.6,
      },
    });
    /* y:0 in both states — the CSS translateY fallback must not survive as a baked offset */
    tl.fromTo("#name .lt i", { yPercent: 115, y: 0 }, { yPercent: 0, y: 0, stagger: 0.09, ease: "power3.out", duration: 0.9 })
      .fromTo(".streak", { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 0.9, ease: "power1.in", duration: 0.35 }, ">-0.2")
      .to(".streak", { xPercent: 40, opacity: 0, ease: "power1.out", duration: 0.35 })
      .fromTo(".role-line", { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 }, "<0.1")
      .to({}, { duration: 0.3 }); /* a beat of hold before the cut */
  }, { scope: ref, dependencies: [film.reduced] });

  return (
    <section id="title" ref={ref}>
      <div className="safe"><div className="frame">
        <div className="title-block">
          <h1 id="name" aria-label="Parrv">
            {"PARRV".split("").map((c, i) => (
              <span className="lt" key={i} aria-hidden="true"><i>{c}</i></span>
            ))}
          </h1>
          <div className="streak" aria-hidden="true"></div>
        </div>
        <p className="role-line">{SITE.role}</p>
      </div></div>
    </section>
  );
}
