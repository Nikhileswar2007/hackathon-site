"use client";

import { useId, useState, type ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "./cn";

export function FlipCard({
  front,
  back,
  label = "Reveal details",
  className,
}: {
  front: ReactNode;
  back: ReactNode;
  label?: string;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const mode = useEffectsMode();
  const id = useId();

  return (
    <div className={cn("flip-card", className)} data-mode={mode}>
      <div className="flip-card-inner">
        <div className="flip-face" aria-hidden={flipped}>
          {front}
        </div>
        <div
          className="flip-face flip-back"
          id={id}
          aria-hidden={!flipped}
        >
          {back}
        </div>
      </div>
      <button
        type="button"
        className="flip-card-control"
        aria-expanded={flipped}
        aria-controls={id}
        data-cursor="FLIP"
        onClick={() => setFlipped((value) => !value)}
      >
        {flipped ? "Show summary" : label}
      </button>
    </div>
  );
}
