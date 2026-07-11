"use client";

/* ============ THE GAME — crew record, ranks, reels, sound ============
   Everything the visitor earns lives in one can: localStorage 'parrv-lot'
   (same key as v2 — returning crew keep their record). The film never
   depends on this; the reel plays even if the record is blank. */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { sfx, resumeAudio, whirOn, whirOff, type SfxName } from "./sound";

export type GameState = {
  xp: number;
  seen: Record<string, boolean>;
  reels: Record<string, boolean>;
  medals: Record<string, string>;
  best: Record<string, number>;
  ach: string[];
  sound: boolean;
  lastVisit: string;
  replays: Record<string, number>;
  visited: Record<string, boolean>;
};

const KEY = "parrv-lot";
const blank: GameState = { xp: 0, seen: {}, reels: {}, medals: {}, best: {}, ach: [], sound: false, lastVisit: "", replays: {}, visited: {} };

export const RANKS: [string, number][] = [["PA", 0], ["2ND AC", 100], ["1ST AC", 250], ["OPERATOR", 500], ["DP", 850], ["DIRECTOR", 1200]];
export const DEPT_GATE: Record<string, number> = { ad: 1, camera: 2, edit: 4, runner: 6 };
export const DEPT_NAME: Record<string, string> = { ad: "AD DEPT", camera: "CAMERA DEPT", edit: "EDITORIAL", runner: "TRANSPORT" };
export const ACH: Record<string, string> = {
  "first-slate": "First slate — a scene shot",
  "day-player": "Day player — first stage entered",
  "checking-the-gate": "Checking the gate — all six stages",
  "martini-shot": "Martini shot — every scene on the lot",
  "one-for-safety": "One for safety — a game replayed",
  "full-crew": "Full crew — a medal in every department",
  "turnaround": "Turnaround — came back another day",
  "final-cut": "Final cut — rank of director",
};

export type GameApi = {
  st: GameState;
  version: number;
  ready: boolean;
  xp: (n: number, label?: string | null) => void;
  see: (id: string) => boolean;
  reelCheck: (stage: string, ids: string[]) => boolean;
  medal: (dept: string, tier: "bronze" | "silver" | "gold", score: number) => void;
  bestOnly: (dept: string, score: number) => void;
  replay: (dept: string) => void;
  ach: (id: string) => void;
  markVisited: (stageKey: string, allKeys: string[]) => void;
  toast: (msg: string) => void;
  play: (name: SfxName) => void;
  setSound: (on: boolean) => void;
  rank: () => [string, number];
  nextRank: () => [string, number] | null;
  reelCount: () => number;
  deptUnlocked: (d: string) => boolean;
  save: () => void;
};

const GameCtx = createContext<GameApi | null>(null);
export const useGame = () => {
  const g = useContext(GameCtx);
  if (!g) throw new Error("useGame outside GameProvider");
  return g;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  /* mutable record + version bump — game loops mutate synchronously, React repaints after */
  const stRef = useRef<GameState>(blank);
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const tQ = useRef<string[]>([]);
  const tBusy = useRef(false);

  const save = useCallback(() => {
    try { localStorage.setItem(KEY, JSON.stringify(stRef.current)); } catch { /* private mode */ }
  }, []);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const play = useCallback((name: SfxName) => {
    if (stRef.current.sound) sfx(name);
  }, []);

  const toast = useCallback((msg: string) => {
    tQ.current.push(msg);
    if (tBusy.current) return;
    tBusy.current = true;
    const next = () => {
      const m = tQ.current.shift();
      if (m === undefined) { tBusy.current = false; return; }
      setToastMsg(m);
      setTimeout(() => { setToastMsg(""); setTimeout(next, 500); }, 2600);
    };
    next();
  }, []);

  const rank = useCallback((): [string, number] => {
    let r = RANKS[0];
    for (const q of RANKS) if (stRef.current.xp >= q[1]) r = q;
    return r;
  }, []);
  const nextRank = useCallback((): [string, number] | null => {
    for (const q of RANKS) if (stRef.current.xp < q[1]) return q;
    return null;
  }, []);
  const reelCount = useCallback(() => Object.values(stRef.current.reels).filter(Boolean).length, []);
  const deptUnlocked = useCallback((d: string) => reelCount() >= DEPT_GATE[d], [reelCount]);

  const achRef = useRef<(id: string) => void>(() => {});
  const xp = useCallback((n: number, label?: string | null) => {
    const st = stRef.current;
    const before = rank()[0];
    st.xp += n; save();
    if (label) toast("+" + n + " XP · " + label);
    const after = rank()[0];
    if (after !== before) {
      toast("PROMOTED · " + after);
      play("wrap");
      if (after === "DIRECTOR") achRef.current("final-cut");
    }
    bump();
  }, [rank, save, toast, play, bump]);

  const ach = useCallback((id: string) => {
    const st = stRef.current;
    if (st.ach.includes(id) || !ACH[id]) return;
    st.ach.push(id); save();
    toast("ACHIEVEMENT · " + ACH[id].split(" — ")[0].toUpperCase());
    play("chime");
    xp(25, null); /* every achievement pays scale */
  }, [save, toast, play, xp]);
  achRef.current = ach;

  const see = useCallback((id: string) => {
    const st = stRef.current;
    if (st.seen[id]) return false;
    st.seen[id] = true; save();
    if (Object.keys(st.seen).length === 1) ach("first-slate");
    bump();
    return true;
  }, [save, ach, bump]);

  const reelCheck = useCallback((stage: string, ids: string[]) => {
    const st = stRef.current;
    if (st.reels[stage]) return false;
    if (!ids.every((i) => st.seen[i])) return false;
    st.reels[stage] = true; save();
    const had = reelCount();
    toast("REEL STRUCK · STAGE " + stage.toUpperCase());
    play("chime");
    xp(50, null);
    Object.keys(DEPT_GATE).forEach((d) => {
      if (DEPT_GATE[d] === had) { toast("POWER ON · " + DEPT_NAME[d]); play("kachunk"); }
    });
    bump();
    return true;
  }, [reelCount, save, toast, play, xp, bump]);

  const medal = useCallback((dept: string, tier: "bronze" | "silver" | "gold", score: number) => {
    const st = stRef.current;
    const order: Record<string, number> = { none: 0, bronze: 1, silver: 2, gold: 3 };
    const prev = st.medals[dept] || "none";
    if (st.best[dept] === undefined || score > st.best[dept]) st.best[dept] = score;
    if (order[tier] > order[prev]) {
      st.medals[dept] = tier; save();
      toast(tier.toUpperCase() + " · " + DEPT_NAME[dept]);
      xp({ bronze: 25, silver: 50, gold: 100 }[tier], null);
      if (["ad", "camera", "edit", "runner"].every((d) => st.medals[d])) ach("full-crew");
    } else save();
    bump();
  }, [save, toast, xp, ach, bump]);

  const bestOnly = useCallback((dept: string, score: number) => {
    const st = stRef.current;
    if (st.best[dept] === undefined || score > st.best[dept]) { st.best[dept] = score; save(); bump(); }
  }, [save, bump]);

  const replay = useCallback((dept: string) => {
    const st = stRef.current;
    if (st.replays[dept]) ach("one-for-safety");
    st.replays[dept] = (st.replays[dept] || 0) + 1; save();
  }, [ach, save]);

  const markVisited = useCallback((stageKey: string, allKeys: string[]) => {
    const st = stRef.current;
    if (st.visited[stageKey]) return;
    st.visited[stageKey] = true; save();
    if (Object.keys(st.visited).length === 1) ach("day-player");
    if (allKeys.every((k) => st.visited[k])) ach("checking-the-gate");
    bump();
  }, [save, ach, bump]);

  const setSound = useCallback((on: boolean) => {
    stRef.current.sound = on; save(); bump();
    if (on) { resumeAudio(); sfx("blip"); whirOn(); } else whirOff();
  }, [save, bump]);

  /* boot: read the can (client only), clock in */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) stRef.current = { ...blank, ...JSON.parse(raw) };
    } catch { /* fresh can */ }
    const st = stRef.current;
    const today = new Date().toISOString().slice(0, 10);
    const returning = !!st.lastVisit && st.lastVisit !== today;
    st.lastVisit = today;
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* private mode */ }
    setReady(true);
    bump();
    if (returning) setTimeout(() => ach("turnaround"), 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const api: GameApi = {
    st: stRef.current, version, ready,
    xp, see, reelCheck, medal, bestOnly, replay, ach, markVisited,
    toast, play, setSound, rank, nextRank, reelCount, deptUnlocked, save,
  };

  return (
    <GameCtx.Provider value={api}>
      {children}
      <ToastBridge msg={toastMsg} />
    </GameCtx.Provider>
  );
}

/* the tannoy renders into the top matte via a fixed slot */
function ToastBridge({ msg }: { msg: string }) {
  useEffect(() => {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("show", !!msg);
  }, [msg]);
  return null;
}
