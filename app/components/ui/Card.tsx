import type { ReactNode } from "react";
import { cn } from "./cn";

type CardElement = "div" | "article" | "section" | "li";

export function Card({
  children,
  className,
  as: Component = "div",
  id,
}: {
  children: ReactNode;
  className?: string;
  as?: CardElement;
  id?: string;
}) {
  return (
    <Component
      id={id}
      className={cn(
        "corner-frame rounded-xl border border-border bg-gradient-to-br from-surface-raised/80 to-surface p-6 transition-colors duration-300",
        className,
      )}
    >
      {children}
    </Component>
  );
}
