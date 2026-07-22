"use client";

import { useEffect, useRef } from "react";

/**
 * A quiet, premium touch: a soft radial highlight in the hero that
 * follows the pointer. Deliberately subtle — this is restraint, not
 * a spotlight effect. No-ops on touch devices and honors
 * prefers-reduced-motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const parent = el.parentElement;
    if (!parent) return;

    function handleMove(e: MouseEvent) {
      const rect = parent!.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el!.style.setProperty("--x", `${x}%`);
      el!.style.setProperty("--y", `${y}%`);
    }

    parent.addEventListener("mousemove", handleMove);
    return () => parent.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
      style={
        {
          "--x": "50%",
          "--y": "20%",
          background:
            "radial-gradient(600px circle at var(--x) var(--y), rgba(168,85,247,0.12), transparent 70%)",
        } as React.CSSProperties
      }
    />
  );
}
