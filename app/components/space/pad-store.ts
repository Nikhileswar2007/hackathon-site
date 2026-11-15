export interface PadHover {
  id: "beginner" | "advanced";
  pad: string;
  x: number;
  y: number;
}

const EMPTY: PadHover | null = null;

let hovered: PadHover | null = null;
const listeners = new Set<() => void>();
let snapshot: PadHover | null = EMPTY;

function emit() {
  snapshot = hovered;
  for (const listener of listeners) {
    listener();
  }
}

export function getPadHoverSnapshot() {
  return snapshot;
}

export function getServerPadHoverSnapshot() {
  return EMPTY;
}

export function subscribePadHover(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setPadHover(next: PadHover) {
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

export function clearPadHover(id: PadHover["id"]) {
  if (hovered?.id !== id) {
    return;
  }

  hovered = null;
  emit();
}

export function resetPadHover() {
  if (!hovered) {
    return;
  }

  hovered = null;
  emit();
}
