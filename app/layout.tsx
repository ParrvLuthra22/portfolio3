import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FilmProvider } from "@/lib/film";
import { GameProvider } from "@/lib/game";
import Mattes from "@/components/chrome/Mattes";
import Grain from "@/components/chrome/Grain";
import Cursor from "@/components/chrome/Cursor";
import Preloader from "@/components/chrome/Preloader";
import { SITE } from "@/data/projects";

const disp = localFont({
  src: "../public/fonts/league-gothic-400.woff2",
  weight: "400",
  variable: "--disp",
  display: "block",
  fallback: ["Arial Narrow", "sans-serif"],
});
const body = localFont({
  src: [
    { path: "../public/fonts/newsreader-300-800.woff2", weight: "300 800", style: "normal" },
    { path: "../public/fonts/newsreader-300-800-italic.woff2", weight: "300 800", style: "italic" },
  ],
  variable: "--body",
  display: "block",
  fallback: ["Georgia", "serif"],
});
const mono = localFont({
  src: [
    { path: "../public/fonts/courier-prime-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/courier-prime-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/courier-prime-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--mono",
  display: "block",
  fallback: ["Courier New", "monospace"],
});

const site = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: SITE.name,
  description: SITE.description,
  openGraph: {
    type: "website",
    title: SITE.name,
    description: SITE.description,
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0E0F0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${disp.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <GameProvider>
          <FilmProvider>
            <a className="skip" href="#credits">Skip to credits &amp; contact</a>
            <div className="grade" aria-hidden="true"></div>
            <div id="stage">{children}</div>
            <Mattes />
            <Grain />
            <Cursor />
            <Preloader />
          </FilmProvider>
        </GameProvider>
        <noscript>
          <style>{`
            .matte,#grain,#cursor,#exposure,#leader-gate{display:none!important}
            .scene{opacity:1!important;transform:none!important}
            #name .lt i{transform:none!important}
            .role-line{opacity:1!important}
            .lg-enter{opacity:1!important}
          `}</style>
        </noscript>
      </body>
    </html>
  );
}
