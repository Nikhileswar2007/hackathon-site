"use client";

import {
  useEffect,
  useRef,
  type ElementType,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%+";

export function ScrambleText({
  text,
  className,
  as = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "h2" | "h3";
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLElement | null>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (mode !== "full") {
      node.textContent = text;
      return;
    }

    let frame = 0;
    let started = false;
    let start = 0;

    function scramble(progress: number) {
      const revealed = Math.floor(progress * text.length);
      let result = "";

      for (let index = 0; index < text.length; index += 1) {
        const character = text[index];

        if (character === " " || index < revealed) {
          result += character;
        } else {
          result += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      node!.textContent = result;
    }

    function tick(time: number) {
      if (!start) {
        start = time;
      }

      const progress = Math.min(1, (time - start) / 900);
      scramble(progress);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        node!.textContent = text;
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
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            begin();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [mode, text]);

  return (
    <Tag
      ref={ref}
      className={cn("scramble-text", className)}
      aria-label={text}
      data-mode={mode}
      style={{
        display: "inline-block",
        minWidth: `${text.length}ch`,
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </Tag>
  );
}
