"use client";

import { useEffect, useRef, useState } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function TechRule({
  className,
  align = "left",
}: {
  className?: string;
  align?: "left" | "center";
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);
  const armed = mode !== "off";
  const dataDrawn = !armed || drawn;

  useEffect(() => {
    if (!armed) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setDrawn(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.7 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [armed]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "heading-rule",
        align === "center" && "mx-auto",
        mode === "off" && "opacity-100 [transform:none]",
        className,
      )}
      data-drawn={dataDrawn}
      data-instant={mode === "off" ? "true" : "false"}
    />
  );
}
