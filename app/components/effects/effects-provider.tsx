"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  getAutoModeSnapshot,
  getModeSnapshot,
  isEffectsUserOverride,
  setEffectsMode,
  stepDownEffectsMode,
  subscribeEffects,
  type EffectsMode,
} from "./effects-store";
import { startPointerTracking } from "./pointer-store";
import { onTick } from "./ticker";
import { useToast } from "./ToastProvider";

export type { EffectsMode } from "./effects-store";

interface EffectsContextValue {
  mode: EffectsMode;
  ready: boolean;
  autoMode: EffectsMode | null;
  setMode: (mode: EffectsMode) => void;
}

const EffectsContext = createContext<EffectsContextValue | null>(null);

function subscribeMounted() {
  return () => {};
}

function getMountedSnapshot() {
  return true;
}

function getServerMountedSnapshot() {
  return false;
}

function getServerModeSnapshot(): EffectsMode {
  return "off";
}

function getServerAutoModeSnapshot(): EffectsMode | null {
  return null;
}

const GOVERNOR_GRACE_MS = 2000;
const GOVERNOR_WINDOW_MS = 1000;
const GOVERNOR_FPS_FLOOR = 45;
const GOVERNOR_STREAK = 3;
const GOVERNOR_MAX_FRAME_GAP_MS = 250;

export function EffectsProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const mode = useSyncExternalStore(
    subscribeEffects,
    getModeSnapshot,
    getServerModeSnapshot,
  );
  const autoMode = useSyncExternalStore(
    subscribeEffects,
    getAutoModeSnapshot,
    getServerAutoModeSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeMounted,
    getMountedSnapshot,
    getServerMountedSnapshot,
  );

  useEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.effects = mode;
    return () => {
      delete document.documentElement.dataset.effects;
    };
  }, [mode]);

  useEffect(() => {
    if (!ready || mode === "off") {
      return;
    }

    return startPointerTracking();
  }, [ready, mode]);

  useEffect(() => {
    if (!ready || mode === "off" || isEffectsUserOverride()) {
      return;
    }

    let started = -1;
    let windowStart = -1;
    let frames = 0;
    let lowStreak = 0;
    let windowHadBigGap = false;

    return onTick((time, delta) => {
      if (started === -1) {
        started = time;
        windowStart = time;
        return;
      }

      if (delta > GOVERNOR_MAX_FRAME_GAP_MS) {
        windowHadBigGap = true;
      }

      if (time - started < GOVERNOR_GRACE_MS) {
        return;
      }

      frames += 1;

      const elapsed = time - windowStart;

      if (elapsed < GOVERNOR_WINDOW_MS) {
        return;
      }

      const fps = (frames * 1000) / elapsed;
      frames = 0;
      windowStart = time;

      if (windowHadBigGap) {
        windowHadBigGap = false;
        lowStreak = 0;
        return;
      }

      if (fps < GOVERNOR_FPS_FLOOR) {
        lowStreak += 1;
      } else {
        lowStreak = 0;
        return;
      }

      if (lowStreak < GOVERNOR_STREAK) {
        return;
      }

      lowStreak = 0;
      const next = stepDownEffectsMode();

      if (next) {
        toast({
          title:
            next === "lite"
              ? "Effects lowered to Lite to keep things smooth"
              : "Effects set to Minimal to keep things smooth",
          tone: "warning",
        });
      }
    });
  }, [ready, mode, toast]);

  const value = useMemo(
    () => ({ mode, ready, autoMode, setMode: setEffectsMode }),
    [mode, ready, autoMode],
  );

  return (
    <EffectsContext.Provider value={value}>
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);

  if (!context) {
    throw new Error("useEffects must be used inside EffectsProvider");
  }

  return context;
}

export function useEffectsMode() {
  return useEffects().mode;
}
