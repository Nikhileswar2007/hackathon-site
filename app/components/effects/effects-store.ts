export type EffectsMode = "full" | "lite" | "off";

// Legacy key retained only for one-time migration of saved Effects mode.
// The old brand name appears here intentionally and nowhere else.
const LEGACY_STORAGE_KEY = "kakshya:effects";
const STORAGE_KEY = "kosmodrome:effects";
const MODES: EffectsMode[] = ["full", "lite", "off"];

let mode: EffectsMode | null = null;
let autoMode: EffectsMode | null = null;
let userOverride = false;
let motionBound = false;
let webglSupport: boolean | null = null;
const listeners = new Set<() => void>();

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

function detectMode(): EffectsMode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "off";
  }

  const navigatorWithMemory = navigator as Navigator & {
    deviceMemory?: number;
  };

  const lowCpu =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  const lowMemory =
    typeof navigatorWithMemory.deviceMemory === "number" &&
    navigatorWithMemory.deviceMemory <= 4;
  const smallCoarse =
    window.matchMedia("(pointer: coarse)").matches &&
    Math.min(window.innerWidth, window.innerHeight) <= 820;

  if (lowCpu || lowMemory || smallCoarse || !supportsWebGL()) {
    return "lite";
  }

  return "full";
}

export function supportsWebGL() {
  if (typeof window === "undefined") {
    return false;
  }

  if (webglSupport === null) {
    webglSupport = hasWebGL();
  }

  return webglSupport;
}

function readStoredMode(): EffectsMode | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const direct = MODES.find((entry) => entry === stored);

    if (direct) {
      return direct;
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const migrated = MODES.find((entry) => entry === legacy) ?? null;

    if (migrated) {
      window.localStorage.setItem(STORAGE_KEY, migrated);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    return migrated;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function initialize() {
  if (mode !== null) {
    return;
  }

  const stored = readStoredMode();
  autoMode = detectMode();
  userOverride = Boolean(stored);
  mode = stored ?? autoMode;

  if (!motionBound) {
    motionBound = true;
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    motionQuery.addEventListener("change", () => {
      if (userOverride) {
        return;
      }
      autoMode = detectMode();
      mode = autoMode;
      emit();
    });
  }
}

export function getModeSnapshot(): EffectsMode {
  if (typeof window === "undefined") {
    return "off";
  }
  initialize();
  return mode ?? "off";
}

export function getAutoModeSnapshot(): EffectsMode | null {
  if (typeof window === "undefined") {
    return null;
  }
  initialize();
  return autoMode;
}

export function subscribeEffects(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }
  initialize();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setEffectsMode(next: EffectsMode) {
  initialize();
  mode = next;
  userOverride = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  emit();
}
