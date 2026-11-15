"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { TimelineItem, TimelineType } from "@/app/content/event-data";
import { useEffectsMode } from "../effects/effects-provider";
import { subscribeScroll } from "../effects/scroll-store";
import { Reveal } from "../fx/Reveal";
import { SpotlightGroup } from "../fx/SpotlightGroup";
import { SpotlightTile } from "../fx/SpotlightTile";
import { Badge, type BadgeTone } from "../ui/Badge";
import { cn } from "../ui/cn";

const flavourTags: Record<string, string> = {
  "registration-opens": "Crew manifest",
  "hash-commitments": "Range draw",
  "registration-closes": "Manifest closed",
  "team-lock": "Manifest locked",
  briefing: "Launch briefing",
  "sealed-draw": "Range draw",
  kickoff: "Liftoff",
  "clarification-window": "Range call",
  "checkpoint-1": "Flight checkpoint",
  "checkpoint-2": "Flight checkpoint",
  "checkpoint-3": "Flight checkpoint",
  "submission-window-opens": "Insertion window",
  "hard-close": "Orbit insertion",
  "stage-0": "Range safety check",
  "stage-1": "Telemetry review",
  "finalists-announced": "Mission review board",
  "stage-2": "Mission review board",
  "provisional-results": "Mission review board",
  "appeals-close": "Winner audit",
  "final-results": "Mission success",
};

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
  const mode = useEffectsMode();
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;

    if (!wrap) {
      return;
    }

    if (mode === "off") {
      wrap.style.setProperty("--rail-progress", "1");
      return;
    }

    let frame = 0;

    function update() {
      frame = 0;
      const list = listRef.current;

      if (!list) {
        return;
      }

      const rect = list.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.85;
      const travel = Math.max(1, rect.height + viewport * 0.4);
      const progress = Math.min(
        1,
        Math.max(0, (start - rect.top) / travel),
      );

      wrap?.style.setProperty("--rail-progress", progress.toFixed(4));
    }

    function schedule() {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    }

    update();
    const unsubscribe = subscribeScroll(schedule);
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", schedule);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [mode]);

  return (
    <div
      ref={wrapRef}
      className="timeline-rail relative"
      style={{ "--rail-progress": "0" } as CSSProperties}
    >
      <span className="timeline-rail-line" aria-hidden="true">
        <span className="timeline-rail-fill" />
      </span>
      <span className="timeline-rail-glow" aria-hidden="true" />

      <SpotlightGroup>
        <ol ref={listRef} className="space-y-4">
          {items.map((item, index) => {
            const style = typeStyles[item.type];
            const checkpoint = item.type === "checkpoint";
            const flavour = flavourTags[item.id];

            return (
              <li
                key={item.id}
                id={item.id}
                className="relative pl-8 sm:pl-10"
              >
                <span
                  className={cn(
                    "timeline-node",
                    checkpoint && "timeline-node-checkpoint",
                  )}
                  aria-hidden="true"
                >
                  <span className={cn("size-1.5 rounded-full", style.dot)} />
                </span>

                <Reveal delay={Math.min(index * 35, 240)}>
                  <SpotlightTile
                    className={cn(
                      "timeline-card relative rounded-xl border p-4 transition-colors sm:p-5",
                      checkpoint
                        ? "hold-point border-warning/80 bg-warning-soft"
                        : "border-border bg-surface/80 hover:border-border-strong",
                    )}
                    data-timeline-type={item.type}
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
                      {flavour ? (
                        <span className="index-numeral text-accent">{flavour}</span>
                      ) : null}
                      <span
                        className="ml-auto hidden font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-muted sm:inline"
                        aria-hidden="true"
                      >
                        SEQ {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-2 font-ui text-[0.75rem] font-semibold leading-snug tracking-[0.025em] text-foreground">
                      {item.event}
                    </p>
                    {item.note ? (
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {item.note}
                      </p>
                    ) : null}
                  </SpotlightTile>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </SpotlightGroup>
    </div>
  );
}
