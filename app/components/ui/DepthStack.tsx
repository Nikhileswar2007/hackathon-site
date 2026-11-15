"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "./cn";

export function DepthStack({
  children,
  className,
  layers = 3,
}: {
  children: ReactNode;
  className?: string;
  layers?: number;
}) {
  const mode = useEffectsMode();
  const count = Math.max(0, Math.min(layers, 4));

  return (
    <div className={cn("depth-stack", className)} data-mode={mode}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="depth-stack-layer"
          style={{ "--stack-index": index + 1 } as CSSProperties}
          aria-hidden="true"
        />
      ))}
      <div className="depth-stack-content">{children}</div>
    </div>
  );
}
