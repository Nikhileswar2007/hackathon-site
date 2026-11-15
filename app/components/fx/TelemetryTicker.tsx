"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

const DEFAULT_ITEMS = [
  "TRACKS 02",
  "TEAM 2-4",
  "WINDOW 48 H",
  "KICKOFF TBA",
  "SPACEPORT 2026",
  "ALL SYSTEMS GO",
];

export function TelemetryTicker({
  items = DEFAULT_ITEMS,
  className,
}: {
  items?: string[];
  className?: string;
}) {
  const mode = useEffectsMode();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = rootRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  if (mode === "off") {
    return (
      <ul
        className={cn(
          "flex flex-wrap items-center gap-x-5 gap-y-1 border-y border-border bg-background/60 px-4 py-1.5",
          className,
        )}
      >
        {items.map((item) => (
          <li key={item} className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-muted">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn("marquee overflow-hidden border-y border-border bg-background/60", className)}
      data-in-view={inView}
    >
      <div
        className="marquee-track inline-flex w-max items-center gap-6 py-1.5"
        style={{ "--marquee-duration": "36s" } as CSSProperties}
      >
        {[...items, ...items].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-muted"
          >
            <span className="mr-2 text-primary">▸</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
