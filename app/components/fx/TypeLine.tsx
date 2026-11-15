"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType } from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function TypeLine({
  text,
  className,
  as = "span",
  caret = true,
  duration = 1000,
}: {
  text: string;
  className?: string;
  as?: "span" | "p";
  caret?: boolean;
  duration?: number;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as ElementType;
  const [animatedText, setAnimatedText] = useState("");
  const visibleText = mode === "full" ? animatedText : text;

  useEffect(() => {
    if (mode !== "full") {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    let frame = 0;
    let started = false;
    let start = 0;

    function tick(time: number) {
      if (!start) {
        start = time;
      }

      const progress = Math.min(1, (time - start) / duration);
      const count = Math.max(1, Math.ceil(text.length * progress));
      setAnimatedText(text.slice(0, count));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setAnimatedText(text);
      }
    }

    function begin() {
      if (started) {
        return;
      }

      started = true;
      frame = window.requestAnimationFrame(tick);
    }

    if (typeof IntersectionObserver === "undefined") {
      begin();
      return () => {
        if (frame) {
          window.cancelAnimationFrame(frame);
        }
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            begin();
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [duration, mode, text]);

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={cn(
        "type-line",
        caret && mode === "full" && visibleText !== text && "typing-caret",
        className,
      )}
      style={
        {
          minWidth: `min(100%, ${text.length}ch)`,
        } as CSSProperties
      }
    >
      <span aria-hidden="true">{visibleText}</span>
    </Tag>
  );
}
