"use client";

import { useState } from "react";
import { submissionChecklist } from "@/app/content/event-data";
import { DepthStack } from "../ui/DepthStack";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

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
      <div className="checklist-panel rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Pre-flight checklist
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
          aria-label={`${completed} of ${total} checklist items complete`}
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
          {submissionChecklist.map((item) => (
            <li key={item.id}>
              <label className="checklist-row flex cursor-pointer gap-3 rounded-lg border border-transparent p-2.5 text-sm leading-relaxed text-foreground transition-[background-color,border-color] hover:bg-surface-raised has-[:checked]:border-primary/35 has-[:checked]:bg-primary-soft/70">
                <input
                  type="checkbox"
                  checked={Boolean(checked[item.id])}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                />
                <span>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p
            className="text-xs leading-relaxed text-muted"
            role="status"
            aria-live="polite"
          >
            {allComplete
              ? "All items checked. Confirm the final upload before T+48."
              : "State stays in this browser. Nothing is sent."}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChecked({})}
            disabled={completed === 0}
          >
            Reset checklist
          </Button>
        </div>
      </div>
    </DepthStack>
  );
}
