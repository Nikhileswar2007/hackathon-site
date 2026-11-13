import type { ReactNode } from "react";
import { cn } from "./cn";

type CardElement = "div" | "article" | "section" | "li";

export function Card({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: CardElement;
}) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-border bg-surface p-6",
        className,
      )}
    >
      {children}
    </Component>
  );
}
