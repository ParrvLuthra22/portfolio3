"use client";

/* — SC 04 · EXT. THE BACKLOT — the studio plan. Six stages, four departments.
   Cards carry a sliver of their first still now; the plan draws itself in. — */

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useFilm, useScene } from "@/lib/film";
import { useGame, DEPT_GATE, DEPT_NAME } from "@/lib/game";
import { STAGES, DEPT_ROLES } from "@/data/projects";
import CutLink from "@/components/CutLink";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Backlot() {
  const ref = useRef<HTMLElement>(null);
  const film = useFilm();
  const game = useGame();
  useScene(ref, { slate: "SC 04 · EXT. THE BACKLOT", ratio: 2.39 }, { timeline: true, id: "backlot" });

  useGSAP(() => {
    if (film.reduced) return;
    gsap.fromTo(
      "#lot-map > *, #lot-map .dep",
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 62%", once: true },
      }
    );
  }, { scope: ref, dependencies: [film.reduced] });

  return (
    <section id="backlot" ref={ref}>
      <div className="safe"><div className="frame">
        <h2 className="vh">The backlot — six sound stages, four departments</h2>
        <div id="lot-map">
          <div className="plan-head">
            <span><b>Parrv Pictures</b> — studio plan</span>
            <span className="plan-north">Sheet 1 of 1 · N ↑</span>
          </div>
          {STAGES.map((s) => {
            const seen = s.projects.filter((p) => game.st.seen[p.id]).length;
            return (
              <CutLink
                key={s.key} href={"/stage/" + s.key}
                className={"stg" + (game.st.visited[s.key] ? " visited" : "") + (game.st.reels[s.key] ? " reeled" : "")}
                data-cursor="link"
                aria-label={`Enter Stage ${s.key.toUpperCase()} — ${s.unit} (${s.domain}), ${s.projects.length} scenes`}
              >
                <b className="stg-letter">{s.key.toUpperCase()}</b>
                <span className="stg-peek" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.projects[0].still} alt="" loading="lazy" />
                </span>
                <span className="stg-unit">{s.unit}</span>
                <i className="stg-domain">{s.domain}</i>
                <span className="stg-count">{seen} / {s.projects.length} shot</span>
                <span className="stg-reel" aria-hidden="true"></span>
              </CutLink>
            );
          })}
          <div className="dep-strip">
            {(["ad", "camera", "edit", "runner"] as const).map((d) => {
              const un = game.deptUnlocked(d);
              const m = game.st.medals[d];
              return (
                <CutLink
                  key={d} href={"/dept/" + d}
                  className={"dep" + (un ? "" : " locked")}
                  data-cursor="link"
                  aria-disabled={!un}
                  onClick={(e) => {
                    if (!un) {
                      e.preventDefault();
                      game.toast("STAGE DARK · STRIKE " + DEPT_GATE[d] + (DEPT_GATE[d] > 1 ? " REELS" : " REEL") + " TO POWER IT");
                      game.play("miss");
                    }
                  }}
                >
                  <span className="dep-name">{DEPT_NAME[d]}</span>
                  <span className="dep-role">{DEPT_ROLES[d]}</span>
                  <span className="dep-state">{un ? "OPEN" : "DARK · " + DEPT_GATE[d] + (DEPT_GATE[d] > 1 ? " REELS" : " REEL")}</span>
                  <span className="dep-medal">{m ? m.toUpperCase() : ""}</span>
                </CutLink>
              );
            })}
          </div>
          <div className="plan-foot">
            <span>You are here — main gate</span>
            <CutLink href="/filmography" data-cursor="link">Producer&rsquo;s cut — skip the tour →</CutLink>
          </div>
        </div>
      </div></div>
    </section>
  );
}
