# PARRV — A Portfolio in 24 Seconds

A portfolio directed as a short film. One HTML file, no framework, no build step.

Eight scenes behind a living matte that re-letterboxes per scene (2.39:1 → 1.85:1 →
Academy 1.375:1 → a 4:1 slit at FIN). Scroll is the playhead — 576 frames, 24 seconds
at 24fps, with the timecode in the bottom bar. That bar is also an editing timeline:
click a scene notch to cut, or grab the track and scrub the reel.

The grammar is two verbs — **cut** and **pull focus** — and one house rule:
`filter` values never animate. Every focus pull is an opacity crossfade between a
sharp layer and a statically blurred clone. The grain is a canvas overlay of six
pre-rendered noise tiles swapped at ~12fps; no SVG filters at runtime.

Operable camera: SC 05 carries a working follow focus (drag or arrow keys), and the
CAMERA REPORT in the top bar lets a visitor set the T-stop and EI of their own print —
saved to that projector, held across visits.

## Run

```
python3 -m http.server 8126
# → http://localhost:8126
```

No dependencies. Fonts are local (League Gothic, Newsreader, Courier Prime — latin subsets).

Deterministic screenshots for review: `?shot=<sectionid>` isolates a scene,
plus `&focus=1` (rack focus), `&ff=1` (follow focus far), `&report=1` (camera report open).

Respects `prefers-reduced-motion`; degrades to a plain readable document without JavaScript.
