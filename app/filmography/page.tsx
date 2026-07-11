import type { Metadata } from "next";
import { STAGES } from "@/data/projects";
import SetSlate from "@/components/SetSlate";
import CutLink from "@/components/CutLink";

export const metadata: Metadata = {
  title: "Filmography — PARRV PICTURES",
  description: "Every picture on the lot, grouped by unit — the producer's cut, no tour.",
};

export default function Filmography() {
  return (
    <main className="pcut-page">
      <SetSlate slate="PRODUCER’S CUT" ratio={1.375} />
      <div className="paper-head">
        <span>Producer&rsquo;s cut — the filmography, no tour</span>
        <span><CutLink className="x" href="/" data-cursor="link">Close</CutLink></span>
      </div>
      <p className="pcut-note">
        Every picture on the lot, grouped by unit. Live links open the deployed work;
        source opens GitHub. For the full experience, <CutLink href="/" style={{ textDecoration: "underline" }}>walk the backlot</CutLink> instead.
      </p>
      {STAGES.map((s) => (
        <section className="unit" key={s.key}>
          <h2><b>Stage {s.key.toUpperCase()} · {s.unit}</b><span>{s.domain}</span></h2>
          <ol>
            {s.projects.map((p) => (
              <li key={p.id}>
                <b><CutLink href={"/film/" + p.id} data-cursor="link">{p.name}</CutLink></b> — {p.logline}
                <span className="pmeta">{p.stack} · {p.year}</span>
                {p.live && <a className="pl" href={p.live} target="_blank" rel="noopener" data-cursor="link">{p.liveLabel === "Dailies" ? "Dailies" : "Live"} →</a>}
                {p.src && <a className="pl" href={p.src} target="_blank" rel="noopener" data-cursor="link">Source →</a>}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
