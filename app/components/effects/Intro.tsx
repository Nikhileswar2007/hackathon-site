"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "./effects-provider";

const SESSION_KEY = "kakshya:intro-seen";
const CLOSE_AT = 620;
const REMOVE_AT = 940;

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
        window.setTimeout(() => setState("hidden"), 320),
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
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <span className="intro-orbit" />
        <p className="telemetry telemetry-accent">
          Initialising mission control
        </p>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted">
          T-03 · 02 · 01
        </p>
      </div>
    </div>
  );
}
