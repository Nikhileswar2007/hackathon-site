import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "./cn";

type SurfaceElement = "div" | "article" | "section" | "li";
type SurfaceTone = "flat" | "raised" | "inset";
type SurfaceDepth = 1 | 2 | 3 | 4;

type SurfaceProps = {
  children: ReactNode;
  className?: string;
  as?: SurfaceElement;
  tone?: SurfaceTone;
  depth?: SurfaceDepth;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

const toneClasses: Record<SurfaceTone, string> = {
  flat: "surface-flat",
  raised: "surface-raised",
  inset: "surface-inset",
};

export function Surface({
  children,
  className,
  as = "div",
  tone = "raised",
  depth = 2,
  ...rest
}: SurfaceProps) {
  const Component = as as ElementType;

  return (
    <Component
      className={cn("surface", toneClasses[tone], className)}
      data-depth={depth}
      {...rest}
    >
      <span className="surface-rim" aria-hidden="true" />
      <span className="surface-light" aria-hidden="true" />
      {children}
    </Component>
  );
}
