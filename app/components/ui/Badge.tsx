import type { ReactNode } from "react";
import { cn } from "./cn";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  accent: "badge-accent",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span className={cn("badge", toneClasses[tone], className)}>
      <span className="badge-inner">{children}</span>
    </span>
  );
}
