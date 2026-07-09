# PARRV PICTURES — The Backlot

A portfolio shot on a studio backlot. No framework, no build step — one HTML file,
one stylesheet, three scripts.

The film opens cold (2.39:1, scroll is the playhead), rolls a title, and arrives at
**the backlot**: a studio plan with six sound stages, one per domain —

- **Stage A · Features** — fullstack
- **Stage B · Sci-Fi Unit** — AI
- **Stage C · Documentary Unit** — data viz
- **Stage D · Short Films** — mobile
- **Stage E · The Lab** — machine learning
- **Stage F · The Vault** — everything else

Walk a stage and its scenes roll: production stills captured from the live deploys,
storyboard panels for the pictures without one. Hold a scene in frame and it counts
as **shot**; shoot everything on a stage and you strike its **reel**.

## The game

Reels power the four **departments** — each a playable room, unlocked at 1/2/4/6 reels:

1. **AD Dept — the slate**: hit the sticks on the exact frame; streaks pay double
2. **Camera Dept — the focus pull**: keep a drifting subject inside the depth of field for 30s
3. **Editorial — the cut**: rebuild a shuffled scene against the clock
4. **Transport — the reel run**: roll the can past sandbags and C-stands; mind the boom

XP promotes you up the crew ladder (PA → 2ND AC → 1ST AC → OPERATOR → DP → DIRECTOR),
the **call sheet** tracks reels, medals and achievements, and a **wrap report** prints
your run as a shareable poster. All six reels unseal the **outtakes** after the credits.
Everything lives in `localStorage` — your projector, your print.

In a hurry? **Producer's cut** (bottom bar, or the main gate on the plan) is the whole
filmography as one plain sheet — live links, source links, no tour.

House rules unchanged from the film: `filter` values never animate, grain is a canvas
tile overlay, and the safelight red is budgeted — exactly five uses on the whole lot.
Sound is synthesized WebAudio, MOS (muted) until you flip it.

## Run

```
python3 -m http.server 8126
# → http://localhost:8126
```

No dependencies. Fonts are local (League Gothic, Newsreader, Courier Prime — latin subsets).

Deterministic screenshots for review: `?shot=<sectionid>` isolates a scene
(`leader`, `title`, `backlot`, `script`, `credits`, `fin`, `outtakes`), and
`?shot=stage-a`…`stage-f`, `?shot=dept-ad|camera|edit|runner`, `?shot=pcut`
open the overlay sets. `&report=1` opens the camera report.

Respects `prefers-reduced-motion`; degrades to a plain readable filmography without JavaScript.
