"use client";

import type { ReactNode } from "react";
import { useEffects } from "./effects-provider";

export function PageTransition({ children }: { children: ReactNode }) {
  const { mode, ready } = useEffects();
  const animate = ready && mode !== "off";

  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
