import type { Stat } from "@/app/content/event-data";
import { Counter } from "../fx/Counter";

export function StatCard({ value, label, detail }: Stat) {
  return (
    <div className="corner-frame h-full rounded-xl border border-border bg-surface/70 p-5 backdrop-blur-sm">
      <p className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        <Counter value={value} />
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
    </div>
  );
}
