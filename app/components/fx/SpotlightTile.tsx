import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "../ui/cn";

type TileElement = "div" | "article" | "section" | "li" | "nav";

export function SpotlightTile({
  children,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: TileElement;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">) {
  const Component = as as ElementType;

  return (
    <Component
      className={cn("spotlight-tile", className)}
      data-spotlight-tile="true"
      {...rest}
    >
      <span className="spotlight-tile-glow" aria-hidden="true" />
      {children}
    </Component>
  );
}
