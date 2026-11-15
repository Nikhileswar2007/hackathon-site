export interface ScrollState {
  y: number;
  max: number;
  progress: number;
}

const state: ScrollState = { y: 0, max: 1, progress: 0 };
const listeners = new Set<(next: ScrollState) => void>();

export function setScrollState(y: number, max: number) {
  const safeMax = Math.max(1, max);
  const progress = Math.min(1, Math.max(0, y / safeMax));

  if (
    Math.abs(state.y - y) < 0.5 &&
    Math.abs(state.max - max) < 0.5 &&
    Math.abs(state.progress - progress) < 0.0005
  ) {
    return;
  }

  state.y = y;
  state.max = safeMax;
  state.progress = progress;

  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty(
      "--scroll-progress",
      progress.toFixed(4),
    );
  }

  for (const listener of listeners) {
    listener(state);
  }
}

export function getScrollState(): Readonly<ScrollState> {
  return state;
}

export function subscribeScroll(listener: (next: ScrollState) => void) {
  listeners.add(listener);
  listener(state);

  return () => {
    listeners.delete(listener);
  };
}

export function readNativeScroll() {
  if (typeof window === "undefined") {
    return;
  }

  const max =
    document.documentElement.scrollHeight - window.innerHeight;
  setScrollState(window.scrollY, max);
}
