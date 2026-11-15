"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function PowerOn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const armed = mode !== "off";
  const dataVisible = !armed || visible;

  useEffect(() => {
    if (!armed) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [armed]);

  return (
    <span
      ref={ref}
      className={cn("power-on inline-flex", className)}
      data-armed={armed}
      data-visible={dataVisible}
      style={
        {
          "--power-delay": `${delay}ms`,
          animationDelay: `${delay}ms`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}
