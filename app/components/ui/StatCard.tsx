import type { Stat } from "@/app/content/event-data";
import { Odometer } from "../fx/Odometer";
import { SpotlightTile } from "../fx/SpotlightTile";

export function StatCard({ value, label, detail }: Stat) {
  return (
    <SpotlightTile className="corner-frame h-full rounded-xl border border-border bg-surface/90 p-5">
      <p className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        <Odometer value={value} />
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
    </SpotlightTile>
  );
}
