"use client";

import { useEffect, useRef, useState } from "react";
import { scoringTabs } from "@/app/content/event-data";
import { useEffectsMode } from "../effects/effects-provider";
import { Badge } from "../ui/Badge";
import { DataTable } from "../ui/DataTable";
import { Tabs, type TabItem } from "../ui/Tabs";
import { cn } from "../ui/cn";

const barClasses: Record<string, string> = {
  beginner: "bg-primary",
  advanced: "bg-accent",
  finals: "bg-success",
};

const stageTones = {
  beginner: "primary",
  advanced: "accent",
  finals: "success",
} as const;

function WeightBar({
  points,
  barClassName,
  emphasised = false,
}: {
  points: number;
  barClassName: string;
  emphasised?: boolean;
}) {
  const mode = useEffectsMode();
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const ref = useRef<HTMLDivElement>(null);
  const clamped = Math.min(100, Math.max(0, points));
  const shown = visible || mode === "off";

  useEffect(() => {
    if (mode === "off" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [mode]);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={points}
      aria-label={`${points} out of 100`}
      className="flex min-w-[7rem] items-center gap-2"
    >
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-strong",
          emphasised ? "h-2.5" : "h-2",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full",
            barClassName,
            mode === "off"
              ? ""
              : "transition-[width] duration-700 ease-out motion-reduce:transition-none",
          )}
          style={{ width: shown ? `${clamped}%` : "0%" }}
        />
      </div>
      <span
        className={cn(
          "w-6 shrink-0 font-mono text-xs",
          emphasised ? "font-semibold text-foreground" : "text-muted",
        )}
      >
        {points}
      </span>
    </div>
  );
}

export function ScoringTables() {
  const tabs: TabItem[] = scoringTabs.map((tab) => {
    const barClassName = barClasses[tab.id] ?? "bg-primary";
    const tone = stageTones[tab.id as keyof typeof stageTones] ?? "primary";
    const note =
      tab.note ??
      "Criterion weights are out of 100. The stage score is the sum of criterion scores.";

    return {
      id: tab.id,
      label: tab.label,
      content: (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              {tab.title} · criterion weights
            </p>
            <Badge tone={tone}>100 points total</Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted">{note}</p>
          <DataTable
            caption={`${tab.title} scoring criteria`}
            columns={[
              { label: "Criterion" },
              { label: "Points", align: "right" },
              { label: "Scored by" },
              { label: "Share of 100" },
            ]}
            rows={[
              ...tab.criteria.map((criterion) => [
                <div key={criterion.name}>
                  <span className="font-medium text-foreground">
                    {criterion.name}
                  </span>
                  {criterion.detail ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {criterion.detail}
                    </p>
                  ) : null}
                </div>,
                <span
                  key={`${criterion.name}-points`}
                  className="font-mono text-foreground"
                >
                  {criterion.points}
                </span>,
                criterion.scoredBy,
                <WeightBar
                  key={`${criterion.name}-bar`}
                  points={criterion.points}
                  barClassName={barClassName}
                />,
              ]),
              [
                <span key="total" className="font-medium text-foreground">
                  Total
                </span>,
                <span key="total-points" className="font-mono text-foreground">
                  100
                </span>,
                "—",
                <WeightBar
                  key="total-bar"
                  points={100}
                  barClassName={barClassName}
                  emphasised
                />,
              ],
            ]}
            rowHeaders
            minWidth="44rem"
          />
        </div>
      ),
    };
  });

  return <Tabs items={tabs} label="Scoring stage" />;
}
