"use client";

import type { ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "./cn";

export function Frame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mode = useEffectsMode();

  return (
    <div className={cn("frame", className)} data-mode={mode}>
      <svg
        className="frame-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 10V2H10M90 2H98V10M98 90V98H90M10 98H2V90"
        />
      </svg>
      {children}
    </div>
  );
}
