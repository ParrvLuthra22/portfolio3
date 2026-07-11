"use client";

/* ============ THE PROJECTOR — mattes, cuts, the print, the scroll ============
   The matte engine from v2, rebuilt as a provider: CSS vars --bar-y/--bar-x
   drive four fixed mattes; scenes declare a ratio + slate and the gate reframes.
   Route changes are cuts: the gate closes, the reel jumps, the gate reopens. */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const RATIO_LABEL: Record<string, string> = {
  "2.39": "2.39:1", "1.85": "1.85:1", "1.375": "1.375:1 · ACADEMY", "4": "REEL END",
};

export type SceneSpec = { slate: string; ratio: number };
export type Print = { stop: string; ei: string };
const PRINT_KEY = "parrv-print";
const WASH: Record<string, [string, number] | null> = {
  "2.8": ["#E5E3DA", 0.06], "4": ["#E5E3DA", 0.03], "5.6": null, "8": ["#000", 0.14],
};
const GRAIN: Record<string, number> = { "250": 0.07, "500": 0.11, "800": 0.17 };

export type TimelineEntry = { id: string; slate: string; el: HTMLElement };

type FilmApi = {
  reduced: boolean;
  slate: string;
  ratioLabel: string;
  print: Print;
  setPrint: (p: Print) => void;
  grainO: number;
  wash: [string, number] | null;
  gate: () => boolean;
  bars: (r: number) => { y: number; x: number };
  applyScene: (spec: SceneSpec) => void;
  cut: (spec: SceneSpec) => void;
  cutTo: (href: string, back?: boolean) => void;
  strike: () => void;
  lenis: () => Lenis | null;
  scrollToEl: (el: HTMLElement, immediate?: boolean) => void;
  registerTimeline: (e: TimelineEntry) => () => void;
  timelineRef: React.RefObject<TimelineEntry[]>;
  tlVersion: number;
  gateOpen: boolean;
  setGateOpen: (b: boolean) => void;
};

const FilmCtx = createContext<FilmApi | null>(null);
export const useFilm = () => {
  const f = useContext(FilmCtx);
  if (!f) throw new Error("useFilm outside FilmProvider");
  return f;
};

export function FilmProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);
  const [slate, setSlate] = useState("PARRV PICTURES");
  const [ratioLabel, setRatioLabel] = useState("2.39:1");
  const [print, setPrintState] = useState<Print>({ stop: "5.6", ei: "500" });
  const [gateOpen, setGateOpen] = useState(false);
  const [tlVersion, setTlVersion] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const currentRef = useRef<SceneSpec | null>(null);
  const cutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timelineRef = useRef<TimelineEntry[]>([]);

  const gate = useCallback(
    () => window.innerWidth < 700 || window.innerWidth < window.innerHeight, []);

  const bars = useCallback((r: number) => {
    if (gate()) return { y: 44, x: 12 };
    const H = window.innerHeight, W = window.innerWidth, stageH = H - 88;
    const w = Math.min(W, stageH * r), h = w / r;
    return { y: Math.max(44, (H - h) / 2), x: Math.max(0, (W - w) / 2) };
  }, [gate]);

  const applyScene = useCallback((spec: SceneSpec) => {
    currentRef.current = spec;
    const b = bars(spec.ratio);
    const root = document.documentElement;
    document.body.classList.remove("cutting");
    root.style.setProperty("--bar-y", b.y.toFixed(1) + "px");
    root.style.setProperty("--bar-x", b.x.toFixed(1) + "px");
    setSlate(spec.slate);
    setRatioLabel(RATIO_LABEL[String(spec.ratio)] || spec.ratio + ":1");
  }, [bars]);

  const cut = useCallback((spec: SceneSpec) => {
    if (currentRef.current && currentRef.current.slate === spec.slate) return;
    if (reduced || document.body.classList.contains("scrubbing")) { applyScene(spec); return; }
    currentRef.current = spec;
    if (cutTimer.current) clearTimeout(cutTimer.current);
    document.body.classList.add("cutting");
    document.documentElement.style.setProperty("--bar-y", window.innerHeight / 2 + 2 + "px");
    cutTimer.current = setTimeout(() => applyScene(spec), 170);
  }, [reduced, applyScene]);

  /* a deliberate cut across routes: close the gate, jump the reel while it's shut */
  const cutTo = useCallback((href: string, back = false) => {
    const go = () => (back && history.length > 1 ? router.back() : router.push(href));
    if (reduced) { go(); return; }
    if (cutTimer.current) clearTimeout(cutTimer.current);
    document.body.classList.add("cutting");
    document.documentElement.style.setProperty("--bar-y", window.innerHeight / 2 + 2 + "px");
    setTimeout(go, 190);
  }, [reduced, router]);

  const strike = useCallback(() => {
    if (reduced) return;
    document.body.classList.add("flicker");
    setTimeout(() => document.body.classList.remove("flicker"), 1200);
  }, [reduced]);

  const setPrint = useCallback((p: Print) => {
    setPrintState(p);
    try { localStorage.setItem(PRINT_KEY, JSON.stringify(p)); } catch { /* fine */ }
  }, []);

  const scrollToEl = useCallback((el: HTMLElement, immediate = false) => {
    if (lenisRef.current) lenisRef.current.scrollTo(el, { immediate });
    else el.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
  }, []);

  const registerTimeline = useCallback((e: TimelineEntry) => {
    timelineRef.current = [...timelineRef.current, e].sort((a, b) => a.el.offsetTop - b.el.offsetTop);
    setTlVersion((v) => v + 1);
    return () => {
      timelineRef.current = timelineRef.current.filter((x) => x !== e);
      setTlVersion((v) => v + 1);
    };
  }, []);

  /* boot: reduced-motion, the print, the scroll */
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    try {
      const saved = JSON.parse(localStorage.getItem(PRINT_KEY) || "null");
      if (saved && saved.stop && saved.ei) setPrintState(saved);
    } catch { /* lab standard */ }
    if (!rm) {
      const lenis = new Lenis({ autoRaf: false });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
    }
  }, []);

  /* every route change: refresh triggers once the new set is dressed */
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  /* proximity snap: the reel never rests mid-frame — when scrolling stops near
     a scene boundary, settle onto the cut so no text hides under the mattes */
  useEffect(() => {
    if (reduced) return;
    const onEnd = () => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      const b = document.body.classList;
      if (b.contains("scrubbing") || b.contains("cutting")) return;
      const entries = timelineRef.current;
      if (!entries.length) return;
      const y = window.scrollY;
      let best: number | null = null;
      for (const e of entries) {
        /* pinned scenes park inside a pin-spacer — snap to the spacer's start */
        const wrap = (e.el.closest(".pin-spacer") as HTMLElement) || e.el;
        const top = wrap.getBoundingClientRect().top + y;
        if (Math.abs(top - y) < window.innerHeight * 0.22
          && (best === null || Math.abs(top - y) < Math.abs(best - y))) best = top;
      }
      if (best !== null && Math.abs(best - y) > 2) lenis.scrollTo(best, { duration: 0.85 });
    };
    ScrollTrigger.addEventListener("scrollEnd", onEnd);
    return () => { ScrollTrigger.removeEventListener("scrollEnd", onEnd); };
  }, [reduced]);

  const api: FilmApi = {
    reduced, slate, ratioLabel, print, setPrint,
    grainO: GRAIN[print.ei] ?? 0.11,
    wash: WASH[print.stop] ?? null,
    gate, bars, applyScene, cut, cutTo, strike,
    lenis: () => lenisRef.current,
    scrollToEl, registerTimeline, timelineRef, tlVersion, gateOpen, setGateOpen,
  };

  return <FilmCtx.Provider value={api}>{children}</FilmCtx.Provider>;
}

/* ---------- a scene on the reel: pads itself for its ratio, cuts when centered ---------- */
export function useScene(
  ref: React.RefObject<HTMLElement | null>,
  spec: SceneSpec,
  opts?: { timeline?: boolean; id?: string; padX?: boolean }
) {
  const film = useFilm();
  const specRef = useRef(spec);
  specRef.current = spec;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const layout = () => {
      const b = film.bars(specRef.current.ratio);
      const safe = el.querySelector<HTMLElement>(".safe");
      if (safe) safe.style.padding = b.y + 26 + "px " + (opts?.padX === false ? "0" : b.x + 30 + "px");
      el.style.setProperty("--fh", window.innerHeight - 2 * b.y + "px");
    };
    layout();
    addEventListener("resize", layout);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 55%",
      end: "bottom 45%",
      onToggle: (self) => { if (self.isActive) film.cut(specRef.current); },
    });
    let unreg: (() => void) | undefined;
    if (opts?.timeline) unreg = film.registerTimeline({ id: opts.id || specRef.current.slate, slate: specRef.current.slate, el });
    return () => { removeEventListener("resize", layout); st.kill(); unreg?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/* ---------- a set page (stage / film / dept): one scene, gate reframes on mount ---------- */
export function useSetScene(spec: SceneSpec) {
  const film = useFilm();
  useEffect(() => {
    film.applyScene(spec);
    const onR = () => film.applyScene(spec);
    addEventListener("resize", onR);
    return () => removeEventListener("resize", onR);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.slate]);
}
