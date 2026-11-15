import type { Stat } from "@/app/content/event-data";
import { Odometer } from "../fx/Odometer";
import { SpotlightTile } from "../fx/SpotlightTile";
import { StatusLight } from "./StatusLight";

export function StatCard({ value, label, detail }: Stat) {
  return (
    <SpotlightTile className="corner-frame h-full rounded-xl border border-border bg-surface/90 p-5">
      <div className="flex items-center justify-between gap-3">
        <StatusLight tone="go">GO</StatusLight>
        <span className="index-numeral">STATUS</span>
      </div>
      <p className="numeric-display mt-4 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
        <Odometer value={value} />
      </p>
      <p className="ui-title mt-2 text-[0.75rem] text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
    </SpotlightTile>
  );
}
