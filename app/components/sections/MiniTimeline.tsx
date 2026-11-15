"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { TimelineItem, TimelineType } from "@/app/content/event-data";
import { useEffectsMode } from "../effects/effects-provider";
import { subscribeScroll } from "../effects/scroll-store";
import { Reveal } from "../fx/Reveal";
import { Badge, type BadgeTone } from "../ui/Badge";

const typeStyles: Record<
  TimelineType,
  { label: string; tone: BadgeTone }
> = {
  milestone: { label: "Milestone", tone: "primary" },
  checkpoint: { label: "Checkpoint", tone: "warning" },
  deadline: { label: "Deadline", tone: "accent" },
  judging: { label: "Judging", tone: "success" },
};

const flavourTags: Record<string, string> = {
  "registration-opens": "Crew manifest",
  "team-lock": "Manifest locked",
  briefing: "Launch briefing",
  "sealed-draw": "Range draw",
  kickoff: "Liftoff",
  checkpoint: "Flight checkpoints",
  checkpoints: "Flight checkpoints",
  "hard-close": "Orbit insertion",
  "stage-0": "Range safety check",
  "stage-1": "Telemetry review",
  "stage-2": "Mission review board",
  "final-results": "Mission success",
};

export function MiniTimeline({ items }: { items: TimelineItem[] }) {
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
      const span = Math.max(viewport * 0.45, rect.height * 0.6);
      const progress = Math.min(
        1,
        Math.max(0, (viewport * 0.84 - rect.top) / span),
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
      className="mini-timeline relative"
      style={{ "--rail-progress": "0" } as CSSProperties}
    >
      <span className="mini-rail-v" aria-hidden="true">
        <span className="mini-rail-fill-v" />
      </span>
      <span className="mini-rail-glow-v" aria-hidden="true" />
      <span className="mini-rail-h" aria-hidden="true">
        <span className="mini-rail-fill-h" />
      </span>
      <span className="mini-rail-glow-h" aria-hidden="true" />

      <ol
        ref={listRef}
        className="relative grid gap-7 lg:grid-cols-5 lg:gap-5"
      >
        {items.map((item, index) => {
          const style = typeStyles[item.type];
          const flavour = flavourTags[item.id];

          return (
            <li
              key={item.id}
              className="relative pl-8 lg:pl-0 lg:pt-8"
            >
              <span className="mini-node" aria-hidden="true" />
              <Reveal delay={index * 70}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {item.when}
                  </span>
                  {item.clock ? (
                    <span className="font-mono text-[0.6875rem] text-muted">
                      {item.clock}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-medium leading-relaxed text-foreground">
                  {item.event}
                </p>
                {item.note ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {item.note}
                  </p>
                ) : null}
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone={style.tone}>{style.label}</Badge>
                  {flavour ? (
                    <span className="index-numeral text-accent">{flavour}</span>
                  ) : null}
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
