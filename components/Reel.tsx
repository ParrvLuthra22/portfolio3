"use client";

/* ============ THE REEL — the film itself, top to tail ============ */

import React, { useEffect } from "react";
import { useFilm } from "@/lib/film";
import Leader from "@/components/scenes/Leader";
import TitleCard from "@/components/scenes/TitleCard";
import Screening from "@/components/scenes/Screening";
import Backlot from "@/components/scenes/Backlot";
import { Script, Credits, Fin, Outtakes } from "@/components/scenes/Closing";

export default function Reel() {
  const film = useFilm();

  /* deep links back onto the reel (e.g. ← back to lot lands on #backlot) */
  useEffect(() => {
    const h = location.hash.slice(1);
    if (!h) return;
    const el = document.getElementById(h);
    if (el) setTimeout(() => film.scrollToEl(el, true), 60);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <Leader />
      <TitleCard />
      <Screening />
      <Backlot />
      <Script />
      <Credits />
      <Fin />
      <Outtakes />
    </main>
  );
}
