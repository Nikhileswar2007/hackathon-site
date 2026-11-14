import type { ReactNode } from "react";
import { SplitHeading } from "../fx/SplitHeading";
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
        <p
          className={cn(
            "telemetry flex items-center gap-2 text-primary",
            align === "center" && "justify-center",
          )}
        >
          <span className="status-dot" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <SplitHeading
        as="h2"
        id={id}
        text={title}
        className="display-title text-h2 text-foreground"
      />
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
