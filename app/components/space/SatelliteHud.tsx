"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  getSatelliteHudSnapshot,
  getServerSatelliteHudSnapshot,
  releaseSatelliteTracking,
  subscribeSatelliteHud,
  toggleSatelliteTracking,
} from "./satellite-store";

const interactiveSelector =
  "a, button, input, select, textarea, label, summary, [role='button'], [contenteditable='true']";

export function SatelliteHud({ enabled }: { enabled: boolean }) {
  const hud = useSyncExternalStore(
    subscribeSatelliteHud,
    getSatelliteHudSnapshot,
    getServerSatelliteHudSnapshot,
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 || event.pointerType !== "mouse") {
        return;
      }

      const target = event.target;

      if (
        target instanceof Element &&
        target.closest(interactiveSelector)
      ) {
        return;
      }

      toggleSatelliteTracking();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        releaseSatelliteTracking();
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  if (
    !enabled ||
    typeof document === "undefined" ||
    (!hud.hovered && !hud.tracked)
  ) {
    return null;
  }

  const hoverLabel =
    hud.hovered && hud.hovered.id !== hud.tracked?.id ? hud.hovered : null;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    >
      {hoverLabel ? (
        <div
          className="fixed z-20 -translate-x-1/2 -translate-y-[145%] rounded-md border border-primary/40 bg-background/90 px-3 py-2 text-left shadow-[0_0_28px_rgba(111,227,242,0.16)]"
          style={{ left: hoverLabel.x, top: hoverLabel.y }}
        >
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
            {hoverLabel.name}
          </p>
          <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted">
            {hoverLabel.orbit} · click to track
          </p>
        </div>
      ) : null}

      {hud.tracked ? (
        <div className="fixed bottom-6 left-5 z-20 hidden w-60 rounded-lg border border-primary/40 bg-background/85 p-3 shadow-[0_0_32px_rgba(111,227,242,0.12)] md:block">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-primary">
              Signal locked
            </p>
            <span className="status-dot" />
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {hud.tracked.name}
          </p>
          <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted">
            {hud.tracked.orbit} · click satellite to release
          </p>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
