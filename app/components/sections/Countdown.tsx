"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { Badge } from "../ui/Badge";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(targetMs: number, nowMs: number): Remaining {
  const totalSeconds = Math.max(
    0,
    Math.floor((targetMs - nowMs) / 1000),
  );

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const units: Array<{ key: keyof Remaining; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function Countdown() {
  const targetMs = siteConfig.eventStartISO
    ? Date.parse(siteConfig.eventStartISO)
    : null;
  const hasTarget = targetMs !== null && !Number.isNaN(targetMs);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (targetMs === null || Number.isNaN(targetMs)) {
      return;
    }

    function tick() {
      setNow(Date.now());
    }

    const frame = window.requestAnimationFrame(tick);
    const interval = window.setInterval(tick, 1000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, [targetMs]);

  const dateLabel =
    targetMs !== null && !Number.isNaN(targetMs)
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        }).format(new Date(targetMs))
      : null;

  const remaining =
    hasTarget && now !== null ? getRemaining(targetMs, now) : null;
  const started = remaining
    ? remaining.days === 0 &&
      remaining.hours === 0 &&
      remaining.minutes === 0 &&
      remaining.seconds === 0
    : false;

  return (
    <div
      className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-glow"
      role="timer"
      aria-label="Countdown to Kakshya 2026 kickoff"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Kickoff countdown
        </p>
        <Badge tone="primary">T0</Badge>
      </div>

      {!hasTarget || !dateLabel ? (
        <>
          <div className="mt-6 rounded-xl border border-dashed border-border bg-background p-5">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              Date to be announced
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Kickoff is planned for 10:00 IST. The live countdown starts once
              the dates are confirmed.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-muted">
            <span>Clock starts at T0</span>
            <span>48 hours</span>
          </div>
        </>
      ) : started ? (
        <div className="mt-6 rounded-xl border border-primary bg-primary-soft p-5">
          <p className="text-2xl font-semibold tracking-tight text-primary">
            Kakshya 2026 has begun.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            The 48-hour clock is running. Problem statements are live on the
            portal.
          </p>
        </div>
      ) : remaining ? (
        <>
          <div
            className="mt-6 grid grid-cols-4 gap-2"
            aria-hidden="true"
          >
            {units.map((unit) => (
              <div
                key={unit.key}
                className="rounded-lg border border-border bg-background px-1 py-3 text-center"
              >
                <p className="font-mono text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">
                  {unit.key === "days"
                    ? remaining[unit.key]
                    : String(remaining[unit.key]).padStart(2, "0")}
                </p>
                <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
          <p className="sr-only">
            Kickoff is scheduled for {dateLabel} IST.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {dateLabel} IST
          </p>
        </>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden="true">
          {units.map((unit) => (
            <div
              key={unit.key}
              className="rounded-lg border border-border bg-background px-1 py-3 text-center"
            >
              <p className="font-mono text-xl font-semibold text-muted sm:text-2xl">
                --
              </p>
              <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
