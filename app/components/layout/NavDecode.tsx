"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function NavDecode({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const mode = useEffectsMode();
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);

  useEffect(
    () => () => {
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
    },
    [],
  );

  function startDecode() {
    if (mode !== "full") {
      if (firstRef.current) {
        firstRef.current.textContent = text;
      }
      if (secondRef.current) {
        secondRef.current.textContent = text;
      }
      return;
    }

    if (frame.current) {
      window.cancelAnimationFrame(frame.current);
    }

    const first = firstRef.current;
    const second = secondRef.current;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%+";
    const duration = 420;
    const started = performance.now();

    function tick(time: number) {
      const progress = Math.min(1, (time - started) / duration);
      const revealed = Math.floor(progress * text.length);
      let value = "";

      for (let index = 0; index < text.length; index += 1) {
        if (index < revealed || text[index] === " ") {
          value += text[index];
        } else {
          value += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      if (first) {
        first.textContent = value;
      }
      if (second) {
        second.textContent = value;
      }

      if (progress < 1) {
        frame.current = window.requestAnimationFrame(tick);
      } else {
        frame.current = 0;
        if (first) {
          first.textContent = text;
        }
        if (second) {
          second.textContent = text;
        }
      }
    }

    frame.current = window.requestAnimationFrame(tick);
  }

  const sharedStyle = {
    minWidth: `${text.length}ch`,
  } as CSSProperties;

  return (
    <span
      className={cn("text-roll nav-link-label", className)}
      aria-hidden="true"
      onMouseEnter={startDecode}
      onPointerEnter={startDecode}
      onFocus={startDecode}
    >
      <span className="text-roll-track">
        <span className="text-roll-line">
          <span ref={firstRef} style={sharedStyle}>
            {text}
          </span>
        </span>
        <span className="text-roll-line">
          <span ref={secondRef} style={sharedStyle}>
            {text}
          </span>
        </span>
      </span>
    </span>
  );
}
