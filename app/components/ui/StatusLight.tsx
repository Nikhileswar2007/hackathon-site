import { cn } from "./cn";

export type StatusTone = "go" | "hold" | "no-go";

export function StatusLight({
  tone = "go",
  className,
  children,
}: {
  tone?: StatusTone;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className={cn("status-light", className)} data-tone={tone}>
      {children}
    </span>
  );
}

export function TMinus({ className }: { className?: string }) {
  return <span className={cn("tminus", className)}>T-minus</span>;
}
