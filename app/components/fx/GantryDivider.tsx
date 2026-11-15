"use client";

import { useEffect, useRef } from "react";
import { cn } from "../ui/cn";

export function GantryDivider({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.drawn = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.dataset.drawn = "true";
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 480 72"
      fill="none"
      className={cn("gantry-divider", className)}
      data-drawn="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d="M2 68H108M156 68H268M318 68H478" className="gantry-divider-stroke" strokeWidth="2" />
      <path
        className="gantry-divider-glow"
        pathLength={1}
        d="M116 60V18M168 60V4M116 18l52-14M124 32l44-12M116 46l52-14M172 12v18M176 32v16"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        className="gantry-divider-glow"
        pathLength={1}
        d="M238 60V16M280 60V28M238 16l42 12M242 32h34M242 48h34M280 28v10"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="168" cy="4" r="3.2" fill="currentColor" />
    </svg>
  );
}
