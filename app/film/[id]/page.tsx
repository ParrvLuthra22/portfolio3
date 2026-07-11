import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_PROJECTS, projectById } from "@/data/projects";
import FilmSet from "@/components/FilmSet";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = projectById[id];
  if (!p) return {};
  return {
    title: `${p.name} — PARRV PICTURES`,
    description: p.logline,
    openGraph: { title: `${p.name} — PARRV PICTURES`, description: p.logline, images: [p.still] },
  };
}

export default async function FilmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!projectById[id]) notFound();
  return <FilmSet id={id} />;
}
