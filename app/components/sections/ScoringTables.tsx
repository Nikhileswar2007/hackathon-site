"use client";

import { scoringTabs } from "@/app/content/event-data";
import { DataTable } from "../ui/DataTable";
import { Tabs, type TabItem } from "../ui/Tabs";
import { cn } from "../ui/cn";

const barClasses: Record<string, string> = {
  beginner: "bg-primary",
  advanced: "bg-accent",
  finals: "bg-success",
};

function WeightBar({
  points,
  barClassName,
}: {
  points: number;
  barClassName: string;
}) {
  const clamped = Math.min(100, Math.max(0, points));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={points}
      aria-label={`${points} out of 100`}
      className="flex min-w-[7rem] items-center gap-2"
    >
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
        <div
          className={cn("h-full rounded-full", barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="w-6 shrink-0 font-mono text-xs text-muted">
        {points}
      </span>
    </div>
  );
}

export function ScoringTables() {
  const tabs: TabItem[] = scoringTabs.map((tab) => {
    const barClassName = barClasses[tab.id] ?? "bg-primary";
    const note =
      tab.note ??
      "Criterion weights are out of 100. The stage score is the sum of criterion scores.";

    return {
      id: tab.id,
      label: tab.label,
      content: (
        <div className="space-y-4">
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
