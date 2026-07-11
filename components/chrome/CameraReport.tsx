"use client";

/* ============ CAMERA REPORT — the visitor's own print ============
   T-stop sets an exposure wash; EI sets the grain. Persists on this projector. */

import React, { useEffect, useRef, useState } from "react";
import { useFilm } from "@/lib/film";

const STOPS = ["2.8", "4", "5.6", "8"];
const EIS = ["250", "500", "800"];

export default function CameraReport() {
  const film = useFilm();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => { removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown); };
  }, [open]);

  return (
    <>
      <button
        type="button" id="report-btn" className="hud-btn" ref={btnRef}
        aria-expanded={open} aria-controls="report" data-cursor="link"
        onClick={() => setOpen((o) => !o)}
      >Report</button>
      {open && (
        <div id="report" className="paper" ref={panelRef} aria-label="Camera report — print settings">
          <div className="paper-head"><span>Camera report</span><span>Print settings</span></div>
          <fieldset className="rep-row">
            <legend>T-stop — exposure of the print</legend>
            <div className="rep-opts">
              {STOPS.map((s) => (
                <React.Fragment key={s}>
                  <input
                    className="vh" type="radio" name="stop" id={"stop-" + s.replace(".", "")}
                    checked={film.print.stop === s}
                    onChange={() => film.setPrint({ ...film.print, stop: s })}
                  />
                  <label htmlFor={"stop-" + s.replace(".", "")}>f/{s}</label>
                </React.Fragment>
              ))}
            </div>
          </fieldset>
          <fieldset className="rep-row">
            <legend>EI — grain of the stock</legend>
            <div className="rep-opts">
              {EIS.map((e) => (
                <React.Fragment key={e}>
                  <input
                    className="vh" type="radio" name="ei" id={"ei-" + e}
                    checked={film.print.ei === e}
                    onChange={() => film.setPrint({ ...film.print, ei: e })}
                  />
                  <label htmlFor={"ei-" + e}>{e}</label>
                </React.Fragment>
              ))}
            </div>
          </fieldset>
          <div className="rep-foot">
            <button type="button" id="rep-reset" onClick={() => film.setPrint({ stop: "5.6", ei: "500" })}>
              Reset to lab standard
            </button>
            <span>Follows this projector</span>
          </div>
        </div>
      )}
    </>
  );
}
