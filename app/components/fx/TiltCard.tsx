"use client";

import {
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function TiltCard({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLDivElement>(null);
  const enabled = mode !== "off";

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const node = ref.current;

    if (!enabled || !node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    node.dataset.tilting = "true";
    node.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    node.style.setProperty(
      "--glare-x",
      `${((x + 0.5) * 100).toFixed(1)}%`,
    );
    node.style.setProperty(
      "--glare-y",
      `${((y + 0.5) * 100).toFixed(1)}%`,
    );
  }

  function handleLeave() {
    const node = ref.current;

    if (!node) {
      return;
    }

    node.dataset.tilting = "false";
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <div
      ref={ref}
      id={id}
      className={cn("tilt-card relative", className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      data-tilting="false"
      style={
        {
          "--tilt-x": "0deg",
          "--tilt-y": "0deg",
        } as CSSProperties
      }
    >
      <span className="tilt-glare" aria-hidden="true" />
      {children}
    </div>
  );
}
