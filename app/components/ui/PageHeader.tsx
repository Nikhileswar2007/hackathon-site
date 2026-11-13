import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="space-y-4 border-b border-border pb-10">
      {eyebrow ? (
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description ? (
        <div className="max-w-3xl text-lg leading-relaxed text-muted">
          {description}
        </div>
      ) : null}
      {children ? <div className="pt-2">{children}</div> : null}
    </header>
  );
}
