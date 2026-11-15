import type { ReactNode } from "react";
import { cn } from "./cn";
import { Surface } from "./Surface";

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
    <Surface
      as={Component}
      id={id}
      depth={2}
      className={cn(
        "corner-frame p-6 transition-colors duration-300",
        className,
      )}
    >
      {children}
    </Surface>
  );
}
