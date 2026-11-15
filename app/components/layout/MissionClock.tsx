"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/app/content/site-config";

function formatRemaining(targetMs: number, nowMs: number) {
  const totalSeconds = Math.max(
    0,
    Math.floor((targetMs - nowMs) / 1000),
  );
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function MissionClock({ className }: { className?: string }) {
  const targetMs = siteConfig.eventStartISO
    ? Date.parse(siteConfig.eventStartISO)
    : null;
  const validTarget = targetMs !== null && !Number.isNaN(targetMs);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!validTarget) {
      return;
    }

    const kick = window.setTimeout(() => setNow(Date.now()), 0);
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(kick);
      window.clearInterval(interval);
    };
  }, [validTarget]);

  const value =
    validTarget && now !== null && targetMs !== null
      ? `T- ${formatRemaining(targetMs, now)}`
      : validTarget
        ? "T- --:--:--:--"
        : "T- TBA";

  return (
    <div
      className={`flex items-center gap-2 ${className ?? ""}`}
      role="timer"
      aria-label={
        validTarget
          ? "Countdown to Kosmodrome 2026 kickoff"
          : "Kickoff time to be announced"
      }
    >
      <span className="status-dot" aria-hidden="true" />
      <span className="telemetry hidden text-[0.5625rem] tracking-[0.22em] sm:inline">
        Mission clock
      </span>
      <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.08em] text-foreground">
        {value}
      </span>
    </div>
  );
}
