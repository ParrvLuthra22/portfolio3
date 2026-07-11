"use client";

/* a silent client helper: dresses the slate + gate for a server-rendered page */

import { useSetScene } from "@/lib/film";

export default function SetSlate({ slate, ratio }: { slate: string; ratio: number }) {
  useSetScene({ slate, ratio });
  return null;
}
