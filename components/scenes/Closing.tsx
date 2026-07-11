"use client";

/* — SC 05 · CHARACTER STUDY · SC 06 · CREDITS · REEL END · OUTTAKES —
   The back half of the reel: the screenplay page, a scroll-driven credit
   roll, FIN, and the sealed outtakes can. — */

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useFilm, useScene } from "@/lib/film";
import { useGame } from "@/lib/game";
import { SITE, TAKES } from "@/data/projects";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Script() {
  const ref = useRef<HTMLElement>(null);
  const film = useFilm();
  useScene(ref, { slate: "SC 05 · CHARACTER STUDY", ratio: 1.375 }, { timeline: true, id: "script" });

  useGSAP(() => {
    if (film.reduced) return;
    gsap.fromTo(".page", { opacity: 0, y: 60, rotate: -0.6 }, {
      opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 55%", once: true },
    });
  }, { scope: ref, dependencies: [film.reduced] });

  return (
    <section id="script" ref={ref}>
      <div className="safe"><div className="frame">
        <div className="page">
          <div className="page-head"><span>Parrv — &ldquo;Portfolio&rdquo; — shooting draft</span><span>p. 3</span></div>
          <p className="slug">INT. STUDIO — NEW DELHI — DAY</p>
          <p className="action">A desk lit by one monitor. PARRV works in silence, deleting more than he keeps. Every pixel has to serve a purpose; whatever fails to communicate clearly, or connect emotionally, gets cut.</p>
          <p className="cue">PARRV</p>
          <p className="paren">(without looking up)</p>
          <p className="dialogue">Excellence lives in the margins. You refine until the perfection becomes invisible.</p>
          <p className="action">He turns back to the screen. The cursor blinks. Underneath, the architecture is already built for tomorrow — scalable, adaptive, waiting to grow.</p>
        </div>
      </div></div>
    </section>
  );
}

export function Credits() {
  const ref = useRef<HTMLElement>(null);
  const film = useFilm();
  useScene(ref, { slate: "SC 06 · CREDITS", ratio: 2.39 }, { timeline: true, id: "credits" });

  useGSAP(() => {
    if (film.reduced) return;
    /* the roll actually rolls: the scroll drives it up through the gate */
    gsap.fromTo(".credit-roll", { y: "38vh" }, {
      y: 0, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 90%", end: "center center", scrub: 0.5 },
    });
    gsap.fromTo(".credit", { opacity: 0 }, {
      opacity: 1, stagger: 0.09, duration: 0.5, ease: "power1.out",
      scrollTrigger: { trigger: ref.current, start: "top 60%", once: true },
    });
  }, { scope: ref, dependencies: [film.reduced] });

  const rows: [string, React.ReactNode][] = [
    ["Directed by", <span className="name" key="d">Parrv</span>],
    ["Written by", <span className="name" key="w">Parrv</span>],
    ["Design & code", <span className="name" key="c">Parrv</span>],
    ["Email", <a className="name" key="e" href={"mailto:" + SITE.email} data-cursor="link">{SITE.email}</a>],
    ["GitHub", <a className="name" key="g" href={SITE.github} target="_blank" rel="noopener" data-cursor="link">ParrvLuthra22</a>],
    ["X", <a className="name" key="x" href={SITE.x} target="_blank" rel="noopener" data-cursor="link">@ParrvLuthra</a>],
    ["LinkedIn", <a className="name" key="l" href={SITE.linkedin} target="_blank" rel="noopener" data-cursor="link">Parrv Luthra</a>],
    ["Location", <span className="name" key="p">{SITE.location}</span>],
  ];

  return (
    <section id="credits" ref={ref}>
      <div className="safe"><div className="frame">
        <h2 className="vh">Credits and contact</h2>
        <div className="credit-roll">
          {rows.map(([role, name]) => (
            <div className="credit" key={role}><span className="role">{role}</span>{name}</div>
          ))}
        </div>
      </div></div>
    </section>
  );
}

export function Fin() {
  const ref = useRef<HTMLElement>(null);
  const film = useFilm();
  useScene(ref, { slate: "REEL END", ratio: 4 }, { timeline: true, id: "fin" });

  useGSAP(() => {
    if (film.reduced) return;
    gsap.fromTo("#fin h2", { letterSpacing: "0.6em", opacity: 0 }, {
      letterSpacing: "0.14em", opacity: 1, ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 70%", end: "center center", scrub: 0.5 },
    });
  }, { scope: ref, dependencies: [film.reduced] });

  return (
    <section id="fin" ref={ref}>
      <div className="safe"><div className="frame">
        <h2>FIN</h2>
        <p>A Parrv picture · MMXXVI</p>
      </div></div>
    </section>
  );
}

export function Outtakes() {
  const ref = useRef<HTMLElement>(null);
  const game = useGame();
  const announced = useRef(false);
  useScene(ref, { slate: "POST-CREDITS · OUTTAKES", ratio: 1.375 }, { timeline: true, id: "outtakes" });

  const open = game.reelCount() >= 6;

  useEffect(() => {
    if (open && !announced.current && game.ready) {
      announced.current = true;
      game.toast("OUTTAKES UNSEALED · AFTER THE CREDITS");
      game.play("kachunk");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, game.ready]);

  return (
    <section id="outtakes" ref={ref}>
      <div className="safe"><div className="frame">
        <h2 className="vh">Outtakes</h2>
        <div id="outtakes-body">
          {!open ? (
            <p className="ot-locked">OUTTAKES — SEALED CAN<br /><span>collect all six stage reels to open it</span></p>
          ) : (
            <div className="ot-roll">
              <p className="ot-head">Outtakes — the reels they don&rsquo;t screen · unlocked, all six cans struck</p>
              {TAKES.map((t) => (
                <div className="ot-take on" key={t[0]}>
                  <p className="ot-slate">{t[0]}</p>
                  <p dangerouslySetInnerHTML={{ __html: t[1] }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div></div>
    </section>
  );
}
