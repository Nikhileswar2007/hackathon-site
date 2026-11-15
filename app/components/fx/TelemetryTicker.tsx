"use client";

import type { CSSProperties } from "react";
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
    <div aria-hidden="true" className={cn("overflow-hidden border-y border-border bg-background/60", className)}>
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
