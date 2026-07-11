import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STAGES, stageByKey } from "@/data/projects";
import StageSet from "@/components/StageSet";

export function generateStaticParams() {
  return STAGES.map((s) => ({ key: s.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const s = stageByKey[key];
  if (!s) return {};
  return {
    title: `Stage ${s.key.toUpperCase()} · ${s.unit} — PARRV PICTURES`,
    description: `${s.domain} — ${s.projects.length} pictures shot on Stage ${s.key.toUpperCase()} of the backlot.`,
  };
}

export default async function StagePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!stageByKey[key]) notFound();
  return <StageSet stageKey={key} />;
}
