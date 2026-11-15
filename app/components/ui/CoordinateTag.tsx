import { cn } from "./cn";

export function CoordinateTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("coordinate-tag", className)}>
      {children}
    </span>
  );
}
