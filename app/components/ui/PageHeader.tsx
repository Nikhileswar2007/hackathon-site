import type { ReactNode } from "react";
import { LetterWave } from "../fx/LetterWave";
import { SplitHeading } from "../fx/SplitHeading";
import { TechRule } from "../fx/TechRule";
import { ShareButton } from "./ShareButton";
import { cn } from "./cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      data-hud={eyebrow ? eyebrow.toUpperCase() : "MISSION"}
      className={cn(
        "relative space-y-4 border-b border-border pb-10",
        className,
      )}
    >
      <span
        className="absolute right-0 top-0 hidden h-px w-24 bg-gradient-to-r from-transparent to-border-strong sm:block"
        aria-hidden="true"
      />
      {eyebrow ? (
        <p className="telemetry flex items-center gap-2 text-primary">
          <span className="status-dot" aria-hidden="true" />
          <LetterWave text={eyebrow} />
        </p>
      ) : null}
      <SplitHeading
        as="h1"
        text={title}
        className="display-oxanium text-h1 text-foreground"
      />
      <TechRule />
      {description ? (
        <div className="max-w-3xl text-lead text-muted">{description}</div>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          {children}
        </div>
        <ShareButton />
      </div>
    </header>
  );
}
