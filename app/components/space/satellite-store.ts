export interface SatelliteHover {
  id: string;
  name: string;
  orbit: string;
  x: number;
  y: number;
}

export interface SatelliteHudState {
  hovered: SatelliteHover | null;
  tracked: SatelliteHover | null;
}

const EMPTY: SatelliteHudState = { hovered: null, tracked: null };

let hovered: SatelliteHover | null = null;
let tracked: SatelliteHover | null = null;
let snapshot: SatelliteHudState = EMPTY;

const listeners = new Set<() => void>();

function emit() {
  snapshot = { hovered, tracked };
  for (const listener of listeners) {
    listener();
  }
}

export function getSatelliteHudSnapshot() {
  return snapshot;
}

export function getServerSatelliteHudSnapshot() {
  return EMPTY;
}

export function subscribeSatelliteHud(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setSatelliteHover(next: SatelliteHover) {
  if (
    hovered &&
    hovered.id === next.id &&
    Math.abs(hovered.x - next.x) < 2 &&
    Math.abs(hovered.y - next.y) < 2
  ) {
    return;
  }

  hovered = next;
  emit();
}

export function clearSatelliteHover(id: string) {
  if (hovered?.id !== id) {
    return;
  }

  hovered = null;
  emit();
}

export function toggleSatelliteTracking() {
  if (!hovered) {
    return;
  }

  tracked = tracked?.id === hovered.id ? null : hovered;
  emit();
}

export function releaseSatelliteTracking() {
  if (!tracked) {
    return;
  }

  tracked = null;
  emit();
}

export function resetSatelliteHud() {
  if (!hovered && !tracked) {
    return;
  }

  hovered = null;
  tracked = null;
  emit();
}
