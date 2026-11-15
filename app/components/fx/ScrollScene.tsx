"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { subscribeScroll } from "../effects/scroll-store";
import { cn } from "../ui/cn";

export function ScrollScene({
  children,
  className,
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;

    if (!node || mode === "off") {
      node?.style.setProperty("--scene-progress", "0");
      return;
    }

    function update() {
      frame.current = 0;

      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const height = window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, (height - rect.top) / (height + rect.height)),
      );
      node.style.setProperty("--scene-progress", progress.toFixed(4));
    }

    function schedule() {
      if (!frame.current) {
        frame.current = window.requestAnimationFrame(update);
      }
    }

    const unsubscribe = subscribeScroll(schedule);
    update();

    return () => {
      unsubscribe();

      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, [mode]);

  return (
    <div
      ref={ref}
      className={cn("scroll-scene", className)}
      data-mode={mode}
      style={{ "--scene-intensity": intensity } as CSSProperties}
    >
      {children}
    </div>
  );
}
