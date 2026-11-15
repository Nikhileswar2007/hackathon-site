"use client";

import { useState } from "react";
import { submissionChecklist } from "@/app/content/event-data";
import { DepthStack } from "../ui/DepthStack";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { StatusLight } from "../ui/StatusLight";

export function SubmissionChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const total = submissionChecklist.length;
  const completed = submissionChecklist.filter(
    (item) => checked[item.id],
  ).length;
  const allComplete = completed === total;

  function toggle(id: string) {
    setChecked((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  return (
    <DepthStack className="rounded-xl" layers={2}>
      <div
        id="checklist"
        className="checklist-panel scroll-mt-24 rounded-xl border border-border bg-surface p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Pre-flight GO / NO-GO poll
          </h3>
          <Badge tone={allComplete ? "success" : "primary"}>
            {completed} of {total}
          </Badge>
        </div>

        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={completed}
          aria-label={`${completed} of ${total} poll items confirmed GO`}
          className="mt-4 h-2 overflow-hidden rounded-full bg-surface-strong shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)]"
        >
          <div
            className="h-full w-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{
              transform: `scaleX(${total === 0 ? 0 : completed / total})`,
            }}
          />
        </div>

        <ul className="mt-5 space-y-2">
          {submissionChecklist.map((item) => {
            const go = Boolean(checked[item.id]);

            return (
              <li key={item.id}>
                <label className="poll-row flex cursor-pointer items-center gap-3 rounded-lg border border-border/70 bg-background/40 p-2.5 text-sm leading-relaxed text-foreground transition-[background-color,border-color] hover:border-primary/40 hover:bg-surface-raised">
                  <StatusLight tone={go ? "go" : "no-go"}>
                    {go ? "GO" : "NO-GO"}
                  </StatusLight>
                  <span className="min-w-0 flex-1">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={go}
                    onChange={() => toggle(item.id)}
                    aria-label={`Mark "${item.label}" as GO`}
                    className="size-4 shrink-0 accent-primary"
                  />
                </label>
              </li>
            );
          })}
        </ul>

        {allComplete ? (
          <div
            className="all-systems-go mt-5 flex items-center justify-center gap-3 rounded-lg border border-success/60 bg-success-soft px-4 py-3"
            role="status"
          >
            <StatusLight tone="go">ALL SYSTEMS GO</StatusLight>
            <span className="text-xs uppercase tracking-[0.18em] text-success">
              Cleared for launch prep
            </span>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p
            className="text-xs leading-relaxed text-muted"
            role="status"
            aria-live="polite"
          >
            {allComplete
              ? "Every poll item is GO. Confirm the final upload before T+48."
              : "State stays in this browser. Nothing is sent."}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChecked({})}
            disabled={completed === 0}
          >
            Reset poll
          </Button>
        </div>
      </div>
    </DepthStack>
  );
}
