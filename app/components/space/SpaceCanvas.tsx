"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
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
  const [idle, setIdle] = useState(false);
  const webgl = useSyncExternalStore(
    subscribeNothing,
    getWebGL,
    getServerWebGL,
  );

  useEffect(() => {
    if (!ready || mode === "off" || !webgl) {
      return;
    }

    let cancelled = false;
    const requestIdle =
      typeof window.requestIdleCallback === "function"
        ? (callback: () => void) =>
            window.requestIdleCallback(callback, { timeout: 2000 })
        : (callback: () => void) => window.setTimeout(callback, 1200);

    const handle = requestIdle(() => {
      if (!cancelled) {
        setIdle(true);
      }
    });

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(handle as number);
      } else {
        window.clearTimeout(handle as number);
      }
    };
  }, [ready, mode, webgl]);

  if (!ready) {
    return null;
  }

  if (mode === "off" || !webgl) {
    return (
      <div className="space-canvas-fixed space-horizon-off" aria-hidden="true">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice">
          <path d="M0 220H1440V140H0z" fill="#05070c" />
          <path d="M180 220V110M212 220V64M212 96L288 64M212 128l68-28M212 160l68-28M212 64v56" stroke="#2a3442" strokeWidth="10" strokeLinejoin="round" />
          <path d="M1120 220V130M1160 220V92M1160 118l62-22M1160 152l62-22" stroke="#2a3442" strokeWidth="10" strokeLinejoin="round" />
          <path d="M560 220V190M560 190c-34 12-50 62-50 30M560 190c34 12 50 62 50 30" stroke="#33415a" strokeWidth="9" />
          <circle cx="720" cy="120" r="4" fill="#ff9e45" />
        </svg>
      </div>
    );
  }

  if (!idle) {
    return null;
  }

  return (
    <div className="space-canvas-fixed" aria-hidden="true">
      <SpaceScene mode={mode} />
    </div>
  );
}
