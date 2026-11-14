"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { useEffects } from "./effects-provider";
import { onTick } from "./ticker";
import { readNativeScroll } from "./scroll-store";
import { setLenis } from "./scroll-lock";

export function SmoothScroll() {
  const { mode, ready } = useEffects();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (!ready) {
      return;
    }

    readNativeScroll();
    let frame = 0;

    function scheduleRead() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        readNativeScroll();
      });
    }

    window.addEventListener("scroll", scheduleRead, { passive: true });
    window.addEventListener("resize", scheduleRead, { passive: true });

    const observer = new ResizeObserver(scheduleRead);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", scheduleRead);
      window.removeEventListener("resize", scheduleRead);
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [ready]);

  useEffect(() => {
    if (!ready || mode !== "full") {
      setLenis(null);
      return;
    }

    let cancelled = false;
    let instance: Lenis | null = null;
    let stopTicker: (() => void) | null = null;

    import("lenis")
      .then(({ default: LenisClass }) => {
        if (cancelled) {
          return;
        }

        instance = new LenisClass({
          autoRaf: false,
          duration: 1.05,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.95,
          anchors: false,
          respectReducedMotion: true,
          autoResize: true,
        });

        lenisRef.current = instance;
        setLenis(instance);
        stopTicker = onTick((time) => instance?.raf(time));
      })
      .catch(() => {
        /* Native scrolling stays available if the chunk fails. */
      });

    return () => {
      cancelled = true;
      stopTicker?.();
      instance?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [ready, mode]);

  useEffect(() => {
    if (previousPath.current === pathname) {
      return;
    }

    previousPath.current = pathname;
    const instance = lenisRef.current;

    if (instance) {
      instance.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    readNativeScroll();
  }, [pathname]);

  useEffect(() => {
    if (mode !== "full") {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const element = event.target as Element | null;
      const anchor = element?.closest<HTMLAnchorElement>('a[href^="#"]');

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.getElementById(
        decodeURIComponent(href.slice(1)),
      );

      if (!target) {
        return;
      }

      event.preventDefault();
      const instance = lenisRef.current;

      if (instance) {
        instance.scrollTo(target, { offset: -88 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      if (target.hasAttribute("tabindex")) {
        target.focus({ preventScroll: true });
      }

      window.history.pushState(null, "", href);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [mode]);

  return null;
}
