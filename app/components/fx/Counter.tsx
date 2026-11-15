"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
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

export function Counter({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const mode = useEffectsMode();
  const parsed = useMemo(() => parseValue(value), [value]);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(parsed?.target ?? 0);
  const [visible, setVisible] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;

    if (!parsed || mode === "off" || !node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mode, parsed]);

  useEffect(() => {
    if (!parsed || !visible || mode === "off" || started.current) {
      return;
    }

    started.current = true;
    const duration = mode === "lite" ? 700 : 1300;
    let start = 0;
    let stopTicker: (() => void) | null = null;

    stopTicker = onTick((time) => {
      if (!start) {
        start = time;
      }

      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parsed.target * eased);

      if (progress >= 1) {
        setDisplay(parsed.target);
        stopTicker?.();
        stopTicker = null;
      }
    });

    return () => {
      stopTicker?.();
    };
  }, [parsed, visible, mode]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  const formatted = display.toFixed(parsed.decimals);

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      style={
        {
          minWidth: `${value.length}ch`,
          display: "inline-block",
        } as CSSProperties
      }
    >
      <span aria-hidden="true">
        {parsed.prefix}
        {formatted}
        {parsed.suffix}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
