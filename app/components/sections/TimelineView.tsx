import type { TimelineItem, TimelineType } from "@/app/content/event-data";
import { Badge, type BadgeTone } from "../ui/Badge";
import { cn } from "../ui/cn";

const typeStyles: Record<
  TimelineType,
  { label: string; tone: BadgeTone; dot: string }
> = {
  milestone: { label: "Milestone", tone: "primary", dot: "bg-primary" },
  checkpoint: {
    label: "Checkpoint",
    tone: "warning",
    dot: "bg-warning",
  },
  deadline: { label: "Deadline", tone: "accent", dot: "bg-accent" },
  judging: { label: "Judging", tone: "success", dot: "bg-success" },
};

export function TimelineView({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => {
        const style = typeStyles[item.type];
        const checkpoint = item.type === "checkpoint";
        const isLast = index === items.length - 1;

        return (
          <li key={item.id} className="flex gap-4 sm:gap-5">
            <div
              className="flex flex-col items-center pt-5"
              aria-hidden="true"
            >
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  style.dot,
                )}
              />
              {!isLast ? (
                <span className="mt-2 w-px flex-1 bg-border" />
              ) : null}
            </div>

            <div
              className={cn(
                "flex-1 rounded-xl border p-4 sm:p-5",
                checkpoint
                  ? "border-warning bg-warning-soft"
                  : "border-border bg-surface",
              )}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-mono text-xs font-semibold text-primary">
                  {item.when}
                </span>
                {item.clock ? (
                  <span className="font-mono text-xs text-muted">
                    {item.clock}
                  </span>
                ) : null}
                <Badge tone={style.tone}>{style.label}</Badge>
              </div>
              <p className="mt-2 font-medium leading-relaxed text-foreground">
                {item.event}
              </p>
              {item.note ? (
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {item.note}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
