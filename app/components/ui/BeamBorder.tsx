"use client";

import type { ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "./cn";

export function BeamBorder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mode = useEffectsMode();

  return (
    <div className={cn("beam-border", className)} data-mode={mode}>
      {children}
    </div>
  );
}
