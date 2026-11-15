"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { onTick } from "../effects/ticker";
import { cn } from "../ui/cn";

function parseValue(value: string) {
  const match = value.match(/\d+(?:\.\d+)?/);

  if (!match || match.index === undefined) {
    return null;
  }

  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + match[0].length),
    target: Number(match[0]),
    decimals: match[0].includes(".")
      ? (match[0].split(".")[1]?.length ?? 0)
      : 0,
  };
}

export function Odometer({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const mode = useEffectsMode();
  const parsed = useMemo(() => parseValue(value), [value]);
  const displayRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = displayRef.current;

    if (!node) {
      return;
    }

    if (!parsed || mode === "off") {
      node.textContent = value;
      return;
    }

    let frameStop: (() => void) | null = null;
    let started = false;
    let observer: IntersectionObserver | null = null;

    function format(amount: number) {
      return `${parsed!.prefix}${amount.toFixed(parsed!.decimals)}${parsed!.suffix}`;
    }

    function begin() {
      if (started) {
        return;
      }

      started = true;
      node!.textContent = format(0);
      const duration = mode === "lite" ? 700 : 1200;
      let start = 0;

      frameStop = onTick((time) => {
        if (!start) {
          start = time;
        }

        const progress = Math.min(1, (time - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        node!.textContent = format(parsed!.target * eased);

        if (progress >= 1) {
          node!.textContent = value;
          frameStop?.();
          frameStop = null;
        }
      });
    }

    if (typeof IntersectionObserver === "undefined") {
      begin();
      return () => frameStop?.();
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            begin();
            observer?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer?.disconnect();
      frameStop?.();
    };
  }, [mode, parsed, value]);

  return (
    <span
      className={cn("tabular-nums", className)}
      style={
        {
          minWidth: `${value.length}ch`,
          display: "inline-block",
        } as CSSProperties
      }
    >
      <span className="sr-only">{value}</span>
      <span ref={displayRef} aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
