"use client";

import type { CSSProperties } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";
import { SplitText } from "./SplitText";

export function ExtrudedTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const mode = useEffectsMode();
  const layers = mode === "full" ? [3, 2, 1] : [];

  return (
    <div
      className={cn("extruded-title", className)}
      data-mode={mode}
    >
      {layers.map((layer) => (
        <span
          key={layer}
          className="extruded-layer"
          style={{ "--layer": layer } as CSSProperties}
          aria-hidden="true"
        >
          {text}
        </span>
      ))}
      <SplitText
        as="h1"
        text={text}
        variant="letter"
        className="extruded-front"
      />
    </div>
  );
}
