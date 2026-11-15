export const CURSOR = {
  craftSize: 28,
  hotspotSize: 3,
  ringBaseRadius: 16,
  satelliteSize: 3,
  orbitSpeed: 1.15,
  idleOrbitSpeed: 0.64,
  craftLerp: 0.35,
  headingLerp: 0.18,
  restHeading: (-3 * Math.PI) / 4,
  restDelayMs: 400,
  stretchMax: 0.4,
  bankMax: 0.42,
  idleDelayMs: 2500,
  dimDelayMs: 8000,
  dimOpacity: 0.55,
  hoverOrbitSpeed: 2.875,
  ringHoverScale: 22 / 16,
  ringPressedScale: 12 / 16,
  ringLerp: 0.18,
  pingPool: 3,
  pingPerClick: 2,
  pingLitePerClick: 1,
  pingExpandTo: 3,
  pingDurationMs: 450,
  pingStaggerMs: 80,
  particlePool: 80,
  particleLifeMin: 300,
  particleLifeMax: 500,
  warpStreakCount: 5,
  sparkBurstNormal: 8,
  sparkBurstPrimary: 16,
  magnetMax: 8,
  magnetScale: 0.08,
  magnetLerp: 0.12,
  lockPadding: 6,
  lockPressedPadding: 3,
  lockLerp: 0.18,
  lockAreaRatio: 0.35,
  lockBracketSize: 12,
  scrollTargetThrottleMs: 80,
  dtMax: 50,
  coordinateMax: 5000,
  velocityMax: 5000,
  speedMax: 5000,
  elementBoundsMax: 5000,
  particleRadiusMax: 6,
  streakLengthMax: 120,
} as const;

let lastClampWarning = 0;

function warnClamped(name: string, value: number, fallback: number) {
  if (process.env.NODE_ENV === "production" || typeof performance === "undefined") {
    return;
  }

  const now = performance.now();

  if (now - lastClampWarning < 1000) {
    return;
  }

  lastClampWarning = now;
  console.warn(
    `[Orbiter] Clamped ${name}: ${String(value)} -> ${fallback}`,
  );
}

export function safeNumber(
  value: number,
  fallback: number,
  min: number,
  max: number,
  name = "value",
) {
  if (!Number.isFinite(value)) {
    warnClamped(name, value, fallback);
    return fallback;
  }

  const clamped = Math.min(max, Math.max(min, value));

  if (clamped !== value) {
    warnClamped(name, value, clamped);
  }

  return clamped;
}
