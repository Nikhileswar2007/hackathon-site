interface LenisLike {
  stop: () => void;
  start: () => void;
  scrollTo?: (target: number, options?: { immediate?: boolean }) => void;
}

let instance: LenisLike | null = null;
let locks = 0;

export function setLenis(next: LenisLike | null) {
  instance = next;
}

export function lockPageScroll() {
  locks += 1;
  instance?.stop();
  document.documentElement.classList.add("lenis-stopped");
  document.body.style.overflow = "hidden";
}

export function unlockPageScroll() {
  locks = Math.max(0, locks - 1);

  if (locks === 0) {
    instance?.start();
    document.documentElement.classList.remove("lenis-stopped");
    document.body.style.overflow = "";
  }
}


export function scrollToTop() {
  if (instance?.scrollTo) {
    instance.scrollTo(0, { immediate: false });
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
