"use client";

import { useEffect, useRef } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { onTick } from "./ticker";

const INTERACTIVE_SELECTOR =
  "a, button, summary, [role='button'], [data-cursor]";
const NATIVE_SELECTOR = "input, textarea, select, option, [contenteditable='true']";

export function CustomCursor() {
  const { mode, ready } = useEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const enabled = ready && mode !== "off" && finePointer;

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    if (!enabled || !root || !dot || !ring || !label) {
      return;
    }
    const labelEl = label;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = targetX;
    let dotY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    let visible = false;

    const setFlag = (name: string, value: boolean) => {
      root.dataset[name] = String(value);
    };

    function handleMove(event: PointerEvent) {
      targetX = event.clientX;
      targetY = event.clientY;

      if (!visible) {
        visible = true;
        setFlag("visible", true);
      }

      const element = event.target as Element | null;
      const nativeField = Boolean(element?.closest(NATIVE_SELECTOR));
      const interactive = Boolean(element?.closest(INTERACTIVE_SELECTOR));
      const labelSource = element?.closest<HTMLElement>("[data-cursor]");
      const cursorLabel = labelSource?.dataset.cursor?.trim() ?? "";

      setFlag("native", nativeField);
      setFlag("hover", interactive && !nativeField);
      setFlag("label", Boolean(cursorLabel) && !nativeField);

      if (labelEl.textContent !== cursorLabel) {
        labelEl.textContent = cursorLabel;
      }

      if (!nativeField) {
        document.documentElement.classList.add("cursor-none");
      } else {
        document.documentElement.classList.remove("cursor-none");
      }
    }

    function handleDown() {
      setFlag("pressed", true);
    }

    function handleUp() {
      setFlag("pressed", false);
    }

    function handleKeyDown() {
      document.documentElement.classList.remove("cursor-none");
    }

    function handleLeave() {
      visible = false;
      setFlag("visible", false);
      document.documentElement.classList.remove("cursor-none");
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("pointercancel", handleUp, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleLeave);
    document.addEventListener("mouseleave", handleLeave);

    const stopTicker = onTick(() => {
      dotX += (targetX - dotX) * 0.62;
      dotY += (targetY - dotY) * 0.62;
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    });

    return () => {
      stopTicker();
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleLeave);
      document.removeEventListener("mouseleave", handleLeave);
      document.documentElement.classList.remove("cursor-none");
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="custom-cursor"
      data-visible="false"
      aria-hidden="true"
    >
      <span ref={dotRef} className="cursor-dot" />
      <span ref={ringRef} className="cursor-ring">
        <span className="cursor-ring-shape" />
        <span ref={labelRef} className="cursor-label" />
      </span>
    </div>
  );
}
