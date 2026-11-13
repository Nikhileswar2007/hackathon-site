import type { Stat } from "@/app/content/event-data";

export function StatCard({ value, label, detail }: Stat) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="font-mono text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
    </div>
  );
}
