import type { ReactNode } from "react";
import { cn } from "./cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {description ? (
        <div
          className={cn(
            "max-w-3xl text-base leading-relaxed text-muted",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </div>
      ) : null}
      {children}
    </div>
  );
}
