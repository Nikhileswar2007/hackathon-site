import { prizeTracks } from "@/app/content/event-data";
import { TBA } from "@/app/content/site-config";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function PrizeGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {prizeTracks.map((track) => (
        <Card key={track.id} className="h-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone={track.id === "beginner" ? "primary" : "accent"}>
              {track.name}
            </Badge>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              Amounts: {TBA}
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            {track.name} awards
          </h3>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {track.awards.map((award) => (
              <li
                key={award.name}
                className="flex flex-wrap items-start justify-between gap-3 bg-surface-raised px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {award.name}
                  </p>
                  {award.note ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {award.note}
                    </p>
                  ) : null}
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
                  {award.amount}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
