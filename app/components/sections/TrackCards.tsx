import Link from "next/link";
import type { Track } from "@/app/content/event-data";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { ArrowRightIcon } from "../ui/icons";

export function TrackCards({ tracks }: { tracks: Track[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {tracks.map((track) => {
        const beginner = track.id === "beginner";
        return (
          <Card
            key={track.id}
            as="article"
            className="flex h-full flex-col gap-5"
          >
            <div className="flex items-center justify-between gap-3">
              <Badge tone={beginner ? "primary" : "accent"}>
                {track.name}
              </Badge>
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                {track.finalists}
              </span>
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {track.name} track
            </h3>

            <p className="text-sm leading-relaxed text-muted">
              {track.summary}
            </p>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  Who it is for
                </dt>
                <dd className="mt-1 leading-relaxed text-foreground">
                  {track.audience}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  Evaluation
                </dt>
                <dd className="mt-1 leading-relaxed text-foreground">
                  {track.evaluation.join(" ")}
                </dd>
              </div>
            </dl>

            <Link
              href={`/tracks#${track.id}`}
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-sm text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Learn more
              <ArrowRightIcon className="size-4" />
            </Link>
          </Card>
        );
      })}
    </div>
  );
}
