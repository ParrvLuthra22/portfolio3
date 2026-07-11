"use client";

/* ============ CALL SHEET — the visitor's crew record, and the wrap report ============ */

import React, { useEffect, useRef, useState } from "react";
import { useGame, ACH, DEPT_NAME } from "@/lib/game";

export default function CallSheet() {
  const game = useGame();
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

  const r = game.rank(), nx = game.nextRank(), st = game.st;

  function wrapReport() {
    const W = 1200, H = 630, cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const x = cv.getContext("2d")!;
    x.fillStyle = "#0E0F0D"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#060606"; x.fillRect(0, 0, W, 64); x.fillRect(0, H - 64, W, 64);
    x.strokeStyle = "rgba(142,149,141,.35)";
    x.beginPath(); x.moveTo(0, 64.5); x.lineTo(W, 64.5); x.moveTo(0, H - 64.5); x.lineTo(W, H - 64.5); x.stroke();
    x.fillStyle = "#8E958D"; x.font = '16px "Courier Prime",monospace'; x.textBaseline = "middle";
    x.fillText("PARRV PICTURES · THE BACKLOT", 36, 33);
    x.textAlign = "right";
    x.fillText(new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(), W - 36, 33);
    x.fillText(location.host.toUpperCase(), W - 36, H - 31);
    x.textAlign = "left"; x.fillText("WRAP REPORT", 36, H - 31);
    x.fillStyle = "rgba(229,227,218,.05)";
    for (let i = 0; i < 900; i++) x.fillRect(Math.random() * W, 64 + Math.random() * (H - 128), 1, 1);
    x.fillStyle = "#E5E3DA"; x.font = '120px "League Gothic","Arial Narrow",sans-serif';
    x.fillText(r[0], 36, 208);
    x.fillStyle = "#8E958D"; x.font = '18px "Courier Prime",monospace';
    x.fillText(st.xp + " XP · CREW RANK", 38, 286);
    "abcdef".split("").forEach((k, i) => {
      x.beginPath(); x.arc(48 + i * 44, 356, 12, 0, 7);
      if (st.reels[k]) { x.fillStyle = "#E5E3DA"; x.fill(); }
      x.strokeStyle = "#8E958D"; x.stroke();
    });
    x.fillStyle = "#8E958D"; x.fillText(game.reelCount() + " / 6 STAGE REELS", 312, 357);
    x.fillText(Object.keys(st.seen).length + " SCENES SHOT", 38, 420);
    ["ad", "camera", "edit", "runner"].forEach((d, i) => {
      x.fillStyle = st.medals[d] ? "#E5E3DA" : "rgba(142,149,141,.5)";
      x.fillText(DEPT_NAME[d] + " · " + (st.medals[d] || "—").toUpperCase(), 38, 470 + i * 30);
    });
    const a = document.createElement("a");
    a.download = "parrv-backlot-wrap-report.png";
    a.href = cv.toDataURL("image/png");
    a.click();
    game.play("wrap");
    game.toast("WRAP REPORT PRINTED");
  }

  return (
    <>
      <button
        type="button" id="sheet-btn" className="hud-btn" ref={btnRef}
        aria-expanded={open} aria-controls="sheet" data-cursor="link"
        onClick={() => setOpen((o) => !o)}
      >Call sheet</button>
      {open && (
        <div id="sheet" className="paper" ref={panelRef} aria-label="Call sheet — your crew record">
          <div className="paper-head">
            <span>Call sheet</span>
            <span>
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
              <button type="button" className="x" data-cursor="link" onClick={() => setOpen(false)}>Close</button>
            </span>
          </div>
          <div className="sh-row"><span>Crew rank</span><b>{r[0]}</b></div>
          <div className="xpbar"><i style={{ width: (nx ? Math.min(100, ((st.xp - r[1]) / (nx[1] - r[1])) * 100) : 100) + "%" }} /></div>
          <div className="xpnext">{st.xp} XP{nx ? " · " + (nx[1] - st.xp) + " to " + nx[0] : " · top of the crew list"}</div>
          <div className="sh-row" style={{ marginTop: 10 }}><span>Stage reels</span><b>{game.reelCount()} / 6</b></div>
          <div className="reelrow">
            {"abcdef".split("").map((k) => <i key={k} className={st.reels[k] ? "got" : ""} />)}
          </div>
          {["ad", "camera", "edit", "runner"].map((d) => (
            <div className="sh-row" key={d}>
              <span>{DEPT_NAME[d]}</span>
              <b>{st.medals[d] ? st.medals[d].toUpperCase() + (st.best[d] !== undefined ? " · " + st.best[d] : "") : "NO TAKE"}</b>
            </div>
          ))}
          {Object.keys(ACH).map((id) => (
            <div key={id} className={"ach" + (st.ach.includes(id) ? "" : " miss")}>
              {st.ach.includes(id) ? "▪" : "▫"} {ACH[id]}
            </div>
          ))}
          <button type="button" className="sh-act" data-cursor="link" onClick={wrapReport}>
            Print the wrap report
          </button>
        </div>
      )}
    </>
  );
}
