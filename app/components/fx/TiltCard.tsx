"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { useMediaQuery } from "../effects/use-media-query";
import { cn } from "../ui/cn";

export function TiltCard({
  children,
  className,
  id,
  glare = true,
  spotlight = false,
  maxTilt,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  glare?: boolean;
  spotlight?: boolean;
  maxTilt?: number;
}) {
  const mode = useEffectsMode();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const active = useRef(false);
  const point = useRef({ x: 0.5, y: 0.5 });
  const limit =
    mode === "off"
      ? 0
      : mode === "lite"
        ? Math.min(maxTilt ?? 4, 4)
        : (maxTilt ?? 8);
  const enabled = finePointer && limit > 0;

  function apply() {
    frame.current = 0;
    const node = ref.current;

    if (!node || !active.current) {
      return;
    }

    const x = point.current.x;
    const y = point.current.y;

    node.dataset.tilting = "true";
    node.style.setProperty("--tilt-x", `${(-y * limit).toFixed(2)}deg`);
    node.style.setProperty("--tilt-y", `${(x * limit).toFixed(2)}deg`);
    node.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    node.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const node = ref.current;

    if (!enabled || !node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    point.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
    active.current = true;

    if (!frame.current) {
      frame.current = window.requestAnimationFrame(apply);
    }
  }

  function handleLeave() {
    const node = ref.current;
    active.current = false;

    if (frame.current) {
      window.cancelAnimationFrame(frame.current);
      frame.current = 0;
    }

    if (!node) {
      return;
    }

    node.dataset.tilting = "false";
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }

  useEffect(() => {
    return () => {
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={cn("tilt-card relative", className)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      data-tilting="false"
      data-tilt={enabled ? "on" : "off"}
      data-spotlight={spotlight ? "true" : "false"}
      data-cursor="INSPECT"
      style={
        {
          "--tilt-x": "0deg",
          "--tilt-y": "0deg",
        } as CSSProperties
      }
    >
      {glare ? <span className="tilt-glare" aria-hidden="true" /> : null}
      {spotlight ? <span className="tilt-spotlight" aria-hidden="true" /> : null}
      {children}
    </div>
  );
}
