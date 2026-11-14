export type TickHandler = (time: number, delta: number) => void;

const handlers = new Set<TickHandler>();
let frameId = 0;
let lastTime = 0;
let running = false;

function loop(time: number) {
  if (typeof document !== "undefined" && document.hidden) {
    running = false;
    frameId = 0;
    lastTime = 0;
    return;
  }

  if (!lastTime) {
    lastTime = time;
  }

  const delta = Math.min(64, time - lastTime);
  lastTime = time;

  for (const handler of handlers) {
    handler(time, delta);
  }

  if (handlers.size > 0) {
    frameId = window.requestAnimationFrame(loop);
  } else {
    running = false;
    frameId = 0;
    lastTime = 0;
  }
}

function start() {
  if (
    running ||
    typeof window === "undefined" ||
    handlers.size === 0
  ) {
    return;
  }

  running = true;
  lastTime = 0;
  frameId = window.requestAnimationFrame(loop);
}

function stop() {
  if (frameId) {
    window.cancelAnimationFrame(frameId);
  }
  frameId = 0;
  lastTime = 0;
  running = false;
}

export function onTick(handler: TickHandler) {
  handlers.add(handler);
  start();

  return () => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      stop();
    }
  };
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      start();
    }
  });
}
