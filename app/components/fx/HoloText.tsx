"use client";

import type { ElementType } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function HoloText({
  text,
  className,
  as = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p";
}) {
  const mode = useEffectsMode();
  const Tag = as as ElementType;

  return (
    <Tag
      className={cn("holo-sheen", className)}
      data-mode={mode}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
