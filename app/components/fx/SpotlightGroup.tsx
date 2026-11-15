"use client";

import {
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { useMediaQuery } from "../effects/use-media-query";
import { cn } from "../ui/cn";

export function SpotlightGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mode = useEffectsMode();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const ref = useRef<HTMLDivElement>(null);
  const lastTile = useRef<HTMLElement | null>(null);
  const enabled = mode !== "off" && finePointer;

  function clearTile() {
    lastTile.current?.removeAttribute("data-spotlight-active");
    lastTile.current = null;
  }

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) {
      return;
    }

    const target = (event.target as Element).closest<HTMLElement>(
      "[data-spotlight-tile]",
    );

    if (!target || !ref.current.contains(target)) {
      clearTile();
      return;
    }

    if (lastTile.current !== target) {
      clearTile();
      lastTile.current = target;
      target.setAttribute("data-spotlight-active", "true");
    }

    const rect = target.getBoundingClientRect();
    target.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      className={cn("spotlight-group", className)}
      data-mode={mode}
      onPointerMove={handleMove}
      onPointerLeave={clearTile}
    >
      {children}
    </div>
  );
}
