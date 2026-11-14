import type { Stat } from "@/app/content/event-data";

export function StatCard({ value, label, detail }: Stat) {
  return (
    <div className="corner-frame rounded-xl border border-border bg-surface/70 p-5 backdrop-blur-sm">
      <p className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
    </div>
  );
}
