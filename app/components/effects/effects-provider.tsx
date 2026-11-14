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
  setEffectsMode,
  subscribeEffects,
  type EffectsMode,
} from "./effects-store";
import { startPointerTracking } from "./pointer-store";

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

export function EffectsProvider({ children }: { children: ReactNode }) {
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
    if (!ready || mode === "off") {
      return;
    }

    return startPointerTracking();
  }, [ready, mode]);

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
