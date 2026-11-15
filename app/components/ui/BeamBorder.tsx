"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "./cn";

export function BeamBorder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
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

  return (
    <div
      ref={ref}
      className={cn("beam-border", className)}
      data-mode={mode}
      data-in-view="true"
    >
      {children}
    </div>
  );
}
