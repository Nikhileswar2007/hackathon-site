import { prizeTracks } from "@/app/content/event-data";
import { TBA } from "@/app/content/site-config";
import { TiltCard } from "../fx/TiltCard";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export function PrizeGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {prizeTracks.map((track) => (
        <TiltCard key={track.id} spotlight className="h-full rounded-xl">
          <Card className="h-full">
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
            <ul className="mt-4 overflow-hidden rounded-lg border border-border">
              {track.awards.map((award, index) => (
                <li
                  key={award.name}
                  data-tier={index < 3 ? String(index + 1) : "special"}
                  className="award-row flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3.5 last:border-b-0"
                >
                  <div className="flex min-w-0 gap-3">
                    <span
                      className="award-index mt-0.5 font-mono text-[0.625rem] text-primary/70"
                      aria-hidden="true"
                    >
                      {index < 3 ? `PAD 0${index + 1}` : String(index + 1).padStart(2, "0")}
                    </span>
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
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
                    {award.amount}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </TiltCard>
      ))}
    </div>
  );
}
