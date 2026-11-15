import type { ReactNode } from "react";
import { cn } from "../ui/cn";

export function TextRoll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-roll", className)}>
      <span className="text-roll-track">
        <span className="text-roll-line">{children}</span>
        <span className="text-roll-line" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
