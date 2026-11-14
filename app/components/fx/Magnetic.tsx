"use client";

import {
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { useMediaQuery } from "../effects/use-media-query";
import { cn } from "../ui/cn";

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const mode = useEffectsMode();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = mode !== "off" && finePointer;

  function handleMove(event: PointerEvent<HTMLSpanElement>) {
    const node = ref.current;

    if (!enabled || !node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);

    node.dataset.active = "true";
    node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }

  function handleLeave() {
    const node = ref.current;

    if (!node) {
      return;
    }

    node.dataset.active = "false";
    node.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <span
      ref={ref}
      className={cn("magnetic", className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      data-active="false"
    >
      {children}
    </span>
  );
}
