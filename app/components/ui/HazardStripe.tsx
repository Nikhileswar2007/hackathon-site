import { cn } from "./cn";

export function HazardStripe({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  if (label) {
    return (
      <div className="flex items-center gap-3" role="separator" aria-label={label}>
        <span className={cn("hazard-stripe flex-1", className)} aria-hidden="true" />
        <span className="tminus text-[0.5625rem]">{label}</span>
        <span className={cn("hazard-stripe flex-1", className)} aria-hidden="true" />
      </div>
    );
  }

  return <div className={cn("hazard-stripe", className)} role="separator" aria-hidden="true" />;
}
