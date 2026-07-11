"use client";

/* ============ A CUT — internal navigation closes the gate first ============ */

import React from "react";
import { useFilm } from "@/lib/film";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; back?: boolean };

export default function CutLink({ href, back, onClick, children, ...rest }: Props) {
  const film = useFilm();
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        film.cutTo(href, back);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
