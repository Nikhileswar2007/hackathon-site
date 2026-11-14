import Link from "next/link";
import type { Track } from "@/app/content/event-data";
import { Reveal } from "../fx/Reveal";
import { TiltCard } from "../fx/TiltCard";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { ArrowRightIcon } from "../ui/icons";

export function TrackCards({ tracks }: { tracks: Track[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {tracks.map((track, index) => {
        const beginner = track.id === "beginner";
        const extraThemes = track.themes.length - 3;

        return (
          <Reveal key={track.id} delay={index * 90} className="h-full">
            <TiltCard id={track.id} className="h-full rounded-xl">
              <Card
                as="article"
                className="group flex h-full flex-col gap-5 hover:border-border-strong"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={beginner ? "primary" : "accent"}>
                    {track.name}
                  </Badge>
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                    TRK-{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {track.name} track
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {track.summary}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border/70 bg-background/40 p-3">
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                      Team
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-foreground">
                      {track.teamSize}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                      Finalists
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-foreground">
                      {track.finalists}
                    </dd>
                  </div>
                </dl>

                <div>
                  <p className="telemetry">Indicative themes</p>
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
                    {track.themes.slice(0, 3).map((theme) => (
                      <li key={theme} className="flex gap-2.5">
                        <span
                          className="mt-2 size-1 shrink-0 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        {theme}
                      </li>
                    ))}
                    {extraThemes > 0 ? (
                      <li className="font-mono text-xs uppercase tracking-[0.1em] text-muted">
                        +{extraThemes} more on the tracks page
                      </li>
                    ) : null}
                  </ul>
                </div>

                <Link
                  href={`/tracks#${track.id}`}
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-primary transition-colors hover:text-primary-hover"
                >
                  Open track brief
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Card>
            </TiltCard>
          </Reveal>
        );
      })}
    </div>
  );
}
