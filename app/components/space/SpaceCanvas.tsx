"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useEffects } from "../effects/effects-provider";
import { supportsWebGL } from "../effects/effects-store";

const SpaceScene = dynamic(() => import("./SpaceScene"), {
  ssr: false,
  loading: () => null,
});

function subscribeNothing() {
  return () => {};
}

function getWebGL() {
  return supportsWebGL();
}

function getServerWebGL() {
  return false;
}

export function SpaceCanvas() {
  const { mode, ready } = useEffects();
  const webgl = useSyncExternalStore(
    subscribeNothing,
    getWebGL,
    getServerWebGL,
  );

  if (!ready || mode === "off" || !webgl) {
    return null;
  }

  return (
    <div className="space-canvas-fixed" aria-hidden="true">
      <SpaceScene mode={mode} />
    </div>
  );
}
