"use client";

import { useEffect, useRef } from "react";

export function PerfPanel() {
  const outputRef = useRef<HTMLOutputElement>(null);
  const enabled =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("perf") === "1";

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frame = 0;
    let samples = 0;
    let previous = performance.now();
    let accumulated = 0;

    function tick(time: number) {
      accumulated += time - previous;
      previous = time;
      samples += 1;

      if (accumulated >= 500) {
        const fps = (samples * 1000) / accumulated;
        const node = outputRef.current;

        if (node) {
          node.textContent = `FPS ${fps.toFixed(0)}`;
        }

        accumulated = 0;
        samples = 0;
      }

      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <output
      ref={outputRef}
      className="perf-panel"
      aria-label="Performance metrics"
      data-cursor="INSPECT"
    >
      FPS —
    </output>
  );
}
