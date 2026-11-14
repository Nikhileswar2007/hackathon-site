"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "../ui/Badge";
import { cn } from "../ui/cn";

export interface TrackCompareRow {
  label: string;
  beginner: string;
  advanced: string;
}

const focusOptions = [
  { id: "both", label: "Both tracks" },
  { id: "beginner", label: "Beginner" },
  { id: "advanced", label: "Advanced" },
] as const;

type Focus = (typeof focusOptions)[number]["id"];

export function TrackCompare({ rows }: { rows: TrackCompareRow[] }) {
  const [focus, setFocus] = useState<Focus>("both");
  const [differencesOnly, setDifferencesOnly] = useState(false);

  const shownRows = differencesOnly
    ? rows.filter((row) => row.beginner !== row.advanced)
    : rows;
  const dimBeginner = focus === "advanced";
  const dimAdvanced = focus === "beginner";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Focus a track"
          className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1"
        >
          {focusOptions.map((option) => {
            const selected = focus === option.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFocus(option.id)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors",
                  selected
                    ? option.id === "advanced"
                      ? "bg-accent text-accent-foreground"
                      : option.id === "beginner"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-strong text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 text-xs leading-relaxed text-muted">
          <input
            type="checkbox"
            checked={differencesOnly}
            onChange={(event) => setDifferencesOnly(event.target.checked)}
            className="size-4 accent-primary"
          />
          Differences only
        </label>
      </div>

      <div
        role="region"
        aria-label="Beginner and Advanced track comparison"
        tabIndex={0}
        data-lenis-prevent
        className="mt-4 w-full overflow-auto overscroll-contain rounded-xl border border-border bg-surface/80"
      >
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <caption className="sr-only">
            Comparison of the Beginner and Advanced tracks
          </caption>
          <thead className="sticky top-0 z-10 bg-surface-strong/95 backdrop-blur">
            <tr>
              <th
                scope="col"
                className="border-b border-border px-4 py-3 text-left font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted"
              >
                Detail
              </th>
              <th
                scope="col"
                className={cn(
                  "border-b border-border px-4 py-3 text-left transition-opacity",
                  dimBeginner && "opacity-35",
                )}
              >
                <Badge tone="primary">Beginner</Badge>
              </th>
              <th
                scope="col"
                className={cn(
                  "border-b border-border px-4 py-3 text-left transition-opacity",
                  dimAdvanced && "opacity-35",
                )}
              >
                <Badge tone="accent">Advanced</Badge>
              </th>
            </tr>
          </thead>
          <tbody>
            {shownRows.map((row) => (
              <tr
                key={row.label}
                className="border-t border-border align-top transition-colors hover:bg-surface-raised/70"
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-mono text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted"
                >
                  {row.label}
                </th>
                <td
                  className={cn(
                    "px-4 py-3 leading-relaxed text-foreground transition-opacity",
                    dimBeginner && "opacity-35",
                  )}
                >
                  {row.beginner}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 leading-relaxed text-foreground transition-opacity",
                    dimAdvanced && "opacity-35",
                  )}
                >
                  {row.advanced}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className="text-xs leading-relaxed text-muted"
        >
          {shownRows.length} of {rows.length} details shown.
        </p>
        <p className="text-xs leading-relaxed text-muted">
          Scoring for both tracks:{" "}
          <Link
            href="/scoring"
            className="text-primary underline underline-offset-4"
          >
            criteria and weights
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
