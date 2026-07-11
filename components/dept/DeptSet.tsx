"use client";

/* ============ A DEPARTMENT — one working room on the lot ============ */

import React from "react";
import { useSetScene } from "@/lib/film";
import { useGame, DEPT_GATE, DEPT_NAME } from "@/lib/game";
import CutLink from "@/components/CutLink";
import { DEPT_META } from "./meta";
import AdRoom from "./AdRoom";
import CameraRoom from "./CameraRoom";
import EditRoom from "./EditRoom";
import RunnerRoom from "./RunnerRoom";

/* medals: bronze | silver | gold against per-game cuts */
export function useFinish() {
  const game = useGame();
  return (dept: string, score: number, cuts: [number, number, number], xpAmt: number, label: string) => {
    const t = score >= cuts[2] ? "gold" : score >= cuts[1] ? "silver" : score >= cuts[0] ? "bronze" : null;
    if (t) game.medal(dept, t, score);
    else game.bestOnly(dept, score);
    if (xpAmt > 0) game.xp(xpAmt, label);
  };
}

export default function DeptSet({ dept }: { dept: string }) {
  const meta = DEPT_META[dept];
  const game = useGame();
  useSetScene({ slate: meta.slate, ratio: 1.85 });
  const unlocked = game.deptUnlocked(dept);
  const best = game.st.best[dept];
  const medal = game.st.medals[dept];

  return (
    <main className="set-page" aria-label={meta.title}>
      <div className="set-head">
        <span className="set-title">{meta.title}</span>
        <span className="set-sub">{meta.sub}</span>
        <span className="set-prog">
          {(medal ? medal.toUpperCase() + " · " : "") + (best !== undefined ? "BEST " + best : "NO TAKE YET")}
        </span>
        <CutLink className="set-back" href="/#backlot" back data-cursor="link">← Back to lot</CutLink>
      </div>
      {!unlocked ? (
        <div className="dept-room">
          <div className="dept-dark">
            STAGE DARK<br />
            <span>strike {DEPT_GATE[dept]} {DEPT_GATE[dept] > 1 ? "reels" : "reel"} to power {DEPT_NAME[dept]} · you have {game.reelCount()}</span>
          </div>
        </div>
      ) : dept === "ad" ? <AdRoom />
        : dept === "camera" ? <CameraRoom />
        : dept === "edit" ? <EditRoom />
        : <RunnerRoom />}
    </main>
  );
}
