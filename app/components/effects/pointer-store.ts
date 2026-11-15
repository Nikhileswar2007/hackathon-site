export interface PointerState {
  x: number;
  y: number;
  nx: number;
  ny: number;
  active: boolean;
  down: boolean;
}

const state: PointerState = {
  x: 0,
  y: 0,
  nx: 0,
  ny: 0,
  active: false,
  down: false,
};

let consumers = 0;
let detach: (() => void) | null = null;

function handleMove(event: PointerEvent) {
  state.x = event.clientX;
  state.y = event.clientY;
  state.nx = (event.clientX / window.innerWidth) * 2 - 1;
  state.ny = (event.clientY / window.innerHeight) * 2 - 1;
  state.active = true;
}

function handleDown() {
  state.down = true;
}

function handleUp() {
  state.down = false;
}

function handleLeave() {
  state.active = false;
}

function handleBlur() {
  state.down = false;
  state.active = false;
}

export function getPointer(): Readonly<PointerState> {
  return state;
}

export function startPointerTracking() {
  if (typeof window === "undefined") {
    return () => {};
  }

  consumers += 1;

  if (consumers === 1) {
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("pointercancel", handleUp, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleBlur);

    detach = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleBlur);
    };
  }

  return () => {
    consumers = Math.max(0, consumers - 1);
    if (consumers === 0 && detach) {
      detach();
      detach = null;
    }
  };
}
