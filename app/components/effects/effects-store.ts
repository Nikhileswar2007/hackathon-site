export type EffectsMode = "full" | "lite" | "off";

// Legacy key retained only for one-time migration of saved Effects mode.
// The old brand name appears here intentionally and nowhere else.
const LEGACY_STORAGE_KEY = "kakshya:effects";
const STORAGE_KEY = "kosmodrome:effects";
const GOVERNOR_SESSION_KEY = "kosmodrome:governor";
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
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (lowCpu || lowMemory || coarsePointer || !supportsWebGL()) {
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

function readGovernorStep(): EffectsMode | null {
  try {
    const stored = window.sessionStorage.getItem(GOVERNOR_SESSION_KEY);
    return stored === "lite" || stored === "off" ? stored : null;
  } catch {
    return null;
  }
}

function writeGovernorStep(step: EffectsMode) {
  try {
    window.sessionStorage.setItem(GOVERNOR_SESSION_KEY, step);
  } catch {
    /* Session storage can be unavailable. */
  }
}

function clearGovernorStep() {
  try {
    window.sessionStorage.removeItem(GOVERNOR_SESSION_KEY);
  } catch {
    /* Session storage can be unavailable. */
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

  const governorStep = readGovernorStep();

  if (governorStep && !userOverride) {
    const forced = governorStep;
    const currentRank = MODES.indexOf(mode);
    const forcedRank = MODES.indexOf(forced);

    if (forcedRank > currentRank) {
      mode = forced;
    }
  }

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

      const governorStep = readGovernorStep();

      if (governorStep && MODES.indexOf(governorStep) > MODES.indexOf(mode)) {
        mode = governorStep;
      }

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
  clearGovernorStep();
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  emit();
}

export function isEffectsUserOverride() {
  initialize();
  return userOverride;
}

export function stepDownEffectsMode(): EffectsMode | null {
  initialize();

  if (userOverride) {
    return null;
  }

  const current = mode;
  const next = current === "full" ? "lite" : current === "lite" ? "off" : null;

  if (!next) {
    return null;
  }

  mode = next;
  writeGovernorStep(next);
  emit();
  return next;
}
