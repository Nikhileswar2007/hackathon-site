"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function Marquee({
  items,
  className,
  duration = 44,
}: {
  items: string[];
  className?: string;
  duration?: number;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node || mode === "off") {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.inView = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.setAttribute(
            "data-in-view",
            entry.isIntersecting ? "true" : "false",
          );
        }
      },
      { rootMargin: "80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  if (mode === "off") {
    return (
      <ul
        className={cn(
          "flex flex-wrap gap-2.5",
          className,
        )}
      >
        {items.map((item) => (
          <li key={item} className="marquee-chip">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("marquee", className)}
      aria-label="Indicative themes"
      data-in-view="true"
    >
      <ul
        className="marquee-track gap-2.5 py-1 pr-2.5"
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {items.map((item) => (
          <li key={item} className="marquee-chip">
            {item}
          </li>
        ))}
        {items.map((item) => (
          <li
            key={`${item}-duplicate`}
            className="marquee-chip"
            aria-hidden="true"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
