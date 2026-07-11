import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeptSet from "@/components/dept/DeptSet";
import { DEPT_META } from "@/components/dept/meta";

export function generateStaticParams() {
  return Object.keys(DEPT_META).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const m = DEPT_META[id];
  if (!m) return {};
  return { title: `${m.title} — PARRV PICTURES`, description: m.sub };
}

export default async function DeptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!DEPT_META[id]) notFound();
  return <DeptSet dept={id} />;
}
