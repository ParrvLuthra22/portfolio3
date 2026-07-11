/* ============ THE SHEET — single source of truth for the lot ============
   One project = one entry. The reel, the hub, the stage pages, the film pages
   and the filmography all read from here. */

export type Project = {
  id: string;
  name: string;
  logline: string;
  still: string;        // /stills/...
  board?: boolean;      // storyboard panel (SVG) instead of a production still
  flag?: string;        // e.g. "NOW SHOOTING"
  stack: string;
  year: string;
  live?: string;
  liveLabel?: string;   // defaults to "Enter scene"
  src?: string;
};

export type Stage = {
  key: string;          // a..f
  unit: string;
  domain: string;
  projects: Project[];
};

export const STAGES: Stage[] = [
  {
    key: "a", unit: "Features", domain: "Fullstack",
    projects: [
      { id: "upsosh", name: "upSosh", logline: "Micro-event booking platform with payment integration and real-time dashboards.", still: "/stills/upsosh.jpg", stack: "TypeScript · Node · Postgres", year: "2026", live: "https://www.upsosh.app/", src: "https://github.com/ParrvLuthra22/upSosh" },
      { id: "creatorlyff", name: "CreatorLyff", logline: "Full-stack creator marketplace — brands discover and collaborate with creators.", still: "/stills/creatorlyff.jpg", stack: "TypeScript · Node · MongoDB", year: "2026", live: "https://creatormarketplace.vercel.app/", src: "https://github.com/ParrvLuthra22/creatormarketplace" },
      { id: "tunemate", name: "TuneMate", logline: "Music-based dating app that matches users via Spotify habits and suggests concert dates.", still: "/stills/tunemate.jpg", stack: "React · Socket.io · Spotify API", year: "2026", live: "https://music-match-bay.vercel.app/", src: "https://github.com/ParrvLuthra22/musicMatch" },
      { id: "garmentpos", name: "Garment POS", logline: "Barcode billing and inventory for garment shops — a phone camera scans, the desktop bills.", still: "/stills/garmentpos.jpg", stack: "JavaScript · Node", year: "2026", live: "https://garment-pos-theta.vercel.app", src: "https://github.com/ParrvLuthra22/garment-pos" },
      { id: "gst", name: "GST Invoice Generator", logline: "GST-compliant invoicing for Indian freelancers — no backend, no signup, no data collected.", still: "/stills/gst.jpg", stack: "JavaScript · in-browser", year: "2026", live: "https://gst-generator.vercel.app", src: "https://github.com/ParrvLuthra22/GST-Generator" },
    ],
  },
  {
    key: "b", unit: "Sci-Fi Unit", domain: "AI",
    projects: [
      { id: "mnemo", name: "Mnemo", logline: "Local, private recall for macOS — quietly indexes what you read and write, answers questions about your own past.", still: "/stills/board-mnemo.svg", board: true, stack: "Python · on-device", year: "2026", src: "https://github.com/ParrvLuthra22/FridayAdvanced-" },
      { id: "friday", name: "FRIDAY", logline: "Event-driven macOS voice assistant — wake word, screen OCR, automation tooling, HUD.", still: "/stills/board-friday.svg", board: true, stack: "Python · Whisper · Vosk", year: "2026", live: "https://drive.google.com/file/d/1564qxUsfhVg8FqBlUWC6ZuDhcQ7rRf7A/view", liveLabel: "Dailies", src: "https://github.com/ParrvLuthra22/aiassistantadvanced" },
      { id: "mmas", name: "MMAS", logline: "Multi-agent research system — search, extraction, synthesis and critical review, orchestrated by LLMs.", still: "/stills/mmas.jpg", stack: "Python · LangChain · Streamlit", year: "2026", live: "https://multimodelagentsystem.streamlit.app/", src: "https://github.com/ParrvLuthra22/MMAS" },
      { id: "ghreviewer", name: "GitHub Reviewer", logline: "Autonomous code-review agent for GitHub pull requests.", still: "/stills/board-ghreviewer.svg", board: true, stack: "Python", year: "2026", src: "https://github.com/ParrvLuthra22/github-reviewer" },
    ],
  },
  {
    key: "c", unit: "Documentary Unit", domain: "Data viz",
    projects: [
      { id: "uber", name: "Uber Data Analysis", logline: "Tableau deep-dive into ride patterns — demand, geography and time, on one dashboard.", still: "/stills/uber.jpg", stack: "Tableau", year: "2026", live: "https://public.tableau.com/app/profile/parrv.luthra/viz/UberDataAnalysis_17773725458420/Dashboard1" },
      { id: "netflix", name: "Netflix Analysis", logline: "Interactive dashboard mapping the Netflix catalogue by genre, country and year.", still: "/stills/netflix.jpg", stack: "Tableau", year: "2026", live: "https://public.tableau.com/views/NetflixAnalysis_17773211837080/Netflix" },
      { id: "vizun", name: "vizun", logline: "Interactive data-visualization playground on the web.", still: "/stills/vizun.jpg", stack: "TypeScript", year: "2026", live: "https://vizun.vercel.app", src: "https://github.com/ParrvLuthra22/vizun" },
    ],
  },
  {
    key: "d", unit: "Short Films", domain: "Mobile",
    projects: [
      { id: "upsoshmobile", name: "upSosh Mobile", logline: "The upSosh picture reshot for the small screen — native event booking on the go.", still: "/stills/board-upsoshmobile.svg", board: true, flag: "NOW SHOOTING", stack: "React Native · Expo", year: "2026", src: "https://github.com/ParrvLuthra22/upsosh-mobile-app" },
    ],
  },
  {
    key: "e", unit: "The Lab", domain: "Machine learning",
    projects: [
      { id: "churn", name: "Player Churn Prediction", logline: "Churn model with a RAG retention advisor — inference plus LangGraph-written recommendations.", still: "/stills/churn.jpg", stack: "Python · scikit-learn · LangGraph", year: "2026", live: "https://playerchurndataprediction-jtwb7gzafrrqvx6bm8g2cv.streamlit.app/", src: "https://github.com/ParrvLuthra22/playerchurndataPrediction" },
      { id: "nailart", name: "OpenCV Nail Art", logline: "Computer-vision nail-art designer — pipelines that paint designs onto detected nails.", still: "/stills/board-nailart.svg", board: true, stack: "Python · OpenCV", year: "2026", src: "https://github.com/ParrvLuthra22/opencv-nail-art" },
    ],
  },
  {
    key: "f", unit: "The Vault", domain: "Others",
    projects: [
      { id: "foodkhoj", name: "FoodKhoj", logline: "Responsive frontend for food delivery and real-time map-based order tracking.", still: "/stills/foodkhoj.jpg", stack: "React · Tailwind · Leaflet", year: "2025", live: "https://food-khoj.vercel.app/", src: "https://github.com/ParrvLuthra22/FoodKhoj" },
      { id: "coolcliq", name: "CoolCliq", logline: "Scan the QR, see who's at the venue, chat anonymously, reveal when ready.", still: "/stills/coolcliq.jpg", stack: "JavaScript", year: "2026", live: "https://coolcliq.netlify.app/", src: "https://github.com/ParrvLuthra22/coolcliq" },
      { id: "gtavi", name: "GTA VI Tribute", logline: "A scroll-animation study dressed as the GTA VI landing page.", still: "/stills/board-gtavi.svg", board: true, stack: "React · GSAP", year: "2025", live: "https://gtavi-eight.vercel.app", src: "https://github.com/ParrvLuthra22/GTAVI" },
      { id: "cracked", name: "Cracked.Social", logline: "Three.js 3D homepage experiment for a social platform.", still: "/stills/cracked.jpg", stack: "Next.js · Three.js", year: "2026", live: "https://cracked-social.vercel.app", src: "https://github.com/ParrvLuthra22/Cracked.Social" },
    ],
  },
];

export const ALL_PROJECTS: Project[] = STAGES.flatMap((s) => s.projects);
export const ALL_IDS = ALL_PROJECTS.map((p) => p.id);
export const stageByKey = Object.fromEntries(STAGES.map((s) => [s.key, s]));
export const projectById = Object.fromEntries(ALL_PROJECTS.map((p) => [p.id, p]));
export const stageOfProject = (id: string) =>
  STAGES.find((s) => s.projects.some((p) => p.id === id));

/* the five pictures on tonight's programme — the dolly in SC 03 */
export const FEATURED: string[] = ["upsosh", "mmas", "tunemate", "churn", "cracked"];

/* the next-picture pre-roll order: featured loop first, then lot order */
export function nextProject(id: string): Project {
  const i = ALL_IDS.indexOf(id);
  return ALL_PROJECTS[(i + 1) % ALL_PROJECTS.length];
}

export const DEPT_ROLES: Record<string, string> = {
  ad: "the slate", camera: "the focus pull", edit: "the cut", runner: "the reel run",
};

/* post-credits outtakes — sealed until all six reels are struck */
export const TAKES: [string, string][] = [
  ["2024 · “CALCULATOR-PROJECT”", "The first picture ever shot on this lot: a calculator, in plain HTML. It still holds the record for fewest features per commit."],
  ["2024 · “C-”", "A repository named <i>c-</i>, described in its own words: “trying to make a shopping app.” It was written in Python. The shopping app is still trying."],
  ["2024 · “YTCLONE21”", "A shot-for-shot remake of YouTube, as every young studio attempts once. The recommendation algorithm was a hard-coded list."],
  ["2025 · “KHAAOPEEYOAISHKROMITARO”", "A restaurant site whose title card is one unbroken word. The director maintains this was a stylistic choice and not a missing spacebar."],
  ["2025 · “PRACTICE”", "A repository literally titled <i>practice</i>. Everything in the six stages you just walked was rehearsed here first."],
];

export const SITE = {
  name: "PARRV PICTURES — The Backlot",
  description: "Parrv — creative developer & designer. A portfolio shot on a studio backlot: six sound stages, four departments, one reel.",
  role: "Creative developer & designer — writing, shooting and cutting software in New Delhi.",
  email: "parrvcodes@gmail.com",
  github: "https://github.com/ParrvLuthra22",
  x: "https://x.com/ParrvLuthra",
  linkedin: "https://www.linkedin.com/in/parrv-luthra-73372b322/",
  location: "New Delhi, India",
};
