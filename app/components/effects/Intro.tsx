"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "./effects-provider";

const LEGACY_SESSION_KEY = "kakshya:intro-seen";
const SESSION_KEY = "kosmodrome:intro-seen";
const CLOSE_AT = 900;
const REMOVE_AT = 1150;

const LINES = [
  "RANGE: GO",
  "GROUND: GO",
  "FLIGHT: GO",
  "KOSMODROME READY",
] as const;

export function Intro() {
  const { mode, ready } = useEffects();
  const [state, setState] = useState<"hidden" | "shown" | "closing">(
    "hidden",
  );
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!ready || mode === "off") {
      return;
    }

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) {
        return;
      }

      if (window.sessionStorage.getItem(LEGACY_SESSION_KEY)) {
        window.sessionStorage.setItem(SESSION_KEY, "1");
        window.sessionStorage.removeItem(LEGACY_SESSION_KEY);
        return;
      }

      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* Session storage can be unavailable. */
    }

    timers.current.push(
      window.setTimeout(() => setState("shown"), 0),
      window.setTimeout(() => setState("closing"), CLOSE_AT),
      window.setTimeout(() => setState("hidden"), REMOVE_AT),
    );

    function dismiss() {
      setState("closing");
      timers.current.push(
        window.setTimeout(() => setState("hidden"), 280),
      );
    }

    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      for (const timer of timers.current) {
        window.clearTimeout(timer);
      }
      timers.current = [];
    };
  }, [ready, mode]);

  if (mode === "off" || state === "hidden") {
    return null;
  }

  return (
    <div
      className="mission-intro"
      data-closing={state === "closing"}
      aria-hidden="true"
    >
      <ol className="intro-poll">
        {LINES.map((line, index) => (
          <li
            key={line}
            className="intro-poll-line"
            style={{ animationDelay: `${120 + index * 170}ms` }}
          >
            <span className="status-light" data-tone="go" />
            {line}
          </li>
        ))}
      </ol>
    </div>
  );
}
