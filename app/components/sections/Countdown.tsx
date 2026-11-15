"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { useEffectsMode } from "../effects/effects-provider";
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

function formatUnit(key: keyof Remaining, value: number) {
  return key === "days" ? String(value) : String(value).padStart(2, "0");
}

export function Countdown() {
  const mode = useEffectsMode();
  const animate = mode !== "off";
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
      className="corner-frame w-full max-w-md rounded-2xl border border-border/80 bg-surface/90 p-5 shadow-glow sm:p-6"
      role="timer"
      aria-label="T-minus countdown to Kosmodrome 2026 liftoff"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="telemetry flex items-center gap-2 text-primary">
          <span className="status-dot" aria-hidden="true" />
          T-minus to liftoff
        </p>
        <Badge tone="primary">T0</Badge>
      </div>

      {!hasTarget || !dateLabel ? (
        <>
          <div className="mt-5 grid grid-cols-4 gap-2" aria-hidden="true">
            {units.map((unit) => (
              <div
                key={unit.key}
                className="rounded-lg border border-border/80 bg-background/60 px-1 py-3 text-center"
              >
                <p className="numeric-display text-xl font-extrabold tracking-tight text-muted sm:text-2xl">
                  --
                </p>
                <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-border bg-background/40 px-4 py-3">
            <p className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
              Date to be announced
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Kickoff is planned for 10:00 IST. The live countdown starts once
              the dates are confirmed.
            </p>
          </div>
        </>
      ) : started ? (
        <div className="mt-5 rounded-xl border border-primary bg-primary-soft/80 p-5">
          <p className="text-2xl font-semibold tracking-tight text-primary">
            Kosmodrome 2026 has begun.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            The 48-hour clock is running. Problem statements are live on the
            portal.
          </p>
        </div>
      ) : remaining ? (
        <>
          <div
            className="mt-5 grid grid-cols-4 gap-2"
            aria-hidden="true"
          >
            {units.map((unit) => {
              const value = formatUnit(unit.key, remaining[unit.key]);

              return (
                <div
                  key={unit.key}
                  className="overflow-hidden rounded-lg border border-border/80 bg-background/60 px-1 py-3 text-center"
                >
                  <p className="numeric-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                    <span
                      key={value}
                      className={animate ? "countdown-value" : undefined}
                    >
                      {value}
                    </span>
                  </p>
                  <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                    {unit.label}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="sr-only">
            Kickoff is scheduled for {dateLabel} IST.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {dateLabel} IST
          </p>
        </>
      ) : (
        <div className="mt-5 grid grid-cols-4 gap-2" aria-hidden="true">
          {units.map((unit) => (
            <div
              key={unit.key}
              className="rounded-lg border border-border/80 bg-background/60 px-1 py-3 text-center"
            >
              <p className="numeric-display text-xl font-extrabold text-muted sm:text-2xl">
                --
              </p>
              <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/60 pt-3 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted">
        <span>Window · 48 hours</span>
        <span>{hasTarget ? "All times IST" : "Kickoff · 10:00 IST"}</span>
      </div>
    </div>
  );
}
