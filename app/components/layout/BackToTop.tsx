"use client";

import { useEffect, useRef, useState } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { subscribeScroll } from "../effects/scroll-store";
import { scrollToTop } from "../effects/scroll-lock";
import { OrbitMark } from "../ui/icons";
import { cn } from "../ui/cn";

export function BackToTop() {
  const mode = useEffectsMode();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [visible, setVisible] = useState(false);
  const [launching, setLaunching] = useState(false);
  const launchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () =>
      subscribeScroll((state) => {
        const threshold = window.innerHeight * 1.5;
        setVisible(window.scrollY > threshold);
        ringRef.current?.style.setProperty(
          "stroke-dashoffset",
          String(1 - Math.min(1, Math.max(0, state.progress))),
        );
      }),
    [],
  );

  useEffect(
    () => () => {
      if (launchTimer.current) {
        clearTimeout(launchTimer.current);
      }
    },
    [],
  );

  function launch() {
    if (mode === "full") {
      setLaunching(true);
      if (launchTimer.current) {
        clearTimeout(launchTimer.current);
      }
      launchTimer.current = setTimeout(() => {
        setLaunching(false);
        launchTimer.current = null;
      }, 650);
    }

    scrollToTop();
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        "back-to-top",
        visible && "is-visible",
        launching && "is-launching",
      )}
      aria-label="Back to launch pad"
      data-cursor="LAUNCH"
      onClick={launch}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg
        className="back-to-top-ring"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle className="back-to-top-track" cx="24" cy="24" r="19" pathLength={1} />
        <circle
          ref={ringRef}
          className="back-to-top-progress"
          cx="24"
          cy="24"
          r="19"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </svg>
      <OrbitMark className="back-to-top-icon" />
      <span className="sr-only">Back to launch pad</span>
    </button>
  );
}
