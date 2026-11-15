"use client";

import { useSyncExternalStore } from "react";
import {
  getPadHoverSnapshot,
  getServerPadHoverSnapshot,
  subscribePadHover,
} from "./pad-store";

export function PadHud({ enabled }: { enabled: boolean }) {
  const hud = useSyncExternalStore(
    subscribePadHover,
    getPadHoverSnapshot,
    getServerPadHoverSnapshot,
  );

  if (!enabled || !hud) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pad-hud"
      style={{ left: hud.x, top: hud.y }}
    >
      <p className="pad-hud-title">{hud.pad}</p>
      <p className="pad-hud-sub">Go for launch</p>
    </div>
  );
}
