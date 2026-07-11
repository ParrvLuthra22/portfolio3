# PARRV PICTURES — The Backlot (v3)

A portfolio shot on a studio backlot: six sound stages, four departments, one reel.
v3 rebuilds the film as a **Next.js 15** production — App Router, GSAP ScrollTrigger,
Lenis smooth scroll — while keeping the design law of the answer print: silver mids
on halide, mono chrome, 1px lines, a red budget of exactly five, `filter` values
never animate.

## Run it

```bash
npm install
npm run dev      # develop on :3000
npm run build    # production build (35 static pages)
npm start        # serve the answer print
```

## The reel

| Route | Scene |
| --- | --- |
| `/` | The film: leader countdown → title card (pinned letter-rise) → NOW SCREENING dolly → the backlot plan → character study → credits → FIN → outtakes |
| `/stage/a`…`/stage/f` | A sound stage: hold a scene in frame to shoot it; shoot them all to strike the reel |
| `/film/[id]` | One picture, full-bleed, with a COMING ATTRACTIONS pre-roll |
| `/dept/ad·camera·edit·runner` | The four department games — unlocked at 1/2/4/6 reels |
| `/filmography` | The producer's cut: every picture on one sheet, no tour |

## The game

Everything the visitor earns lives in one can: `localStorage["parrv-lot"]`
(unchanged from v2 — returning crew keep their record). XP promotes you up the
crew ladder (PA → 2ND AC → 1ST AC → OPERATOR → DP → DIRECTOR), stage reels power
the departments, medals and achievements print on the wrap report, and all six
reels unseal the outtakes after the credits.

## Structure

- `data/projects.ts` — the sheet: single source of truth for all 19 pictures
- `lib/film.tsx` — the projector: mattes, cuts, Lenis, the print settings
- `lib/game.tsx` / `lib/sound.ts` — the crew record and the WebAudio synth
- `components/scenes/` — the reel, scene by scene
- `components/dept/` — the four working rooms
- `legacy/` — the v2 static site (no framework, no build), kept for reference

Sound is synthesized, MOS until asked — the leader gate is the gesture.
Respects `prefers-reduced-motion`; degrades to readable content without JavaScript.
