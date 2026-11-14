"use client";

import { useEffect, useRef } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { onTick } from "./ticker";

interface TrailPoint {
  x: number;
  y: number;
}

export function CursorTrail() {
  const { mode, ready } = useEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enabled = ready && mode !== "off" && finePointer;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!enabled || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const canvasEl = canvas;
    const ctx = context;

    const maxPoints = mode === "lite" ? 16 : 24;
    const points: TrailPoint[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let lastMove = 0;
    let stopTicker: (() => void) | null = null;

    const styles = getComputedStyle(document.documentElement);
    const primary =
      styles.getPropertyValue("--primary").trim() || "#ff9e45";
    const accent =
      styles.getPropertyValue("--accent").trim() || "#6fe3f2";

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasEl.width = width;
      canvasEl.height = height;
    }

    function clear() {
      ctx.clearRect(0, 0, width, height);
    }

    function render(time: number) {
      if (time - lastMove > 1000) {
        clear();
        stopTicker?.();
        stopTicker = null;
        points.length = 0;
        return;
      }

      clear();

      if (points.length < 2) {
        return;
      }

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let index = 1; index < points.length; index += 1) {
        const from = points[index - 1];
        const to = points[index];
        const ratio = index / points.length;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.lineWidth = 0.5 + ratio * (mode === "lite" ? 2.2 : 3.4);
        ctx.strokeStyle = index % 4 === 0 ? accent : primary;
        ctx.globalAlpha = ratio * ratio * 0.32;
        ctx.shadowBlur = mode === "lite" ? 0 : 12;
        ctx.shadowColor = index % 4 === 0 ? accent : primary;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    }

    function startLoop() {
      if (!stopTicker) {
        stopTicker = onTick(render);
      }
    }

    function handleMove(event: PointerEvent) {
      points.push({ x: event.clientX, y: event.clientY });
      if (points.length > maxPoints) {
        points.shift();
      }
      lastMove = performance.now();
      startLoop();
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      stopTicker?.();
      clear();
    };
  }, [enabled, mode]);

  if (!enabled) {
    return null;
  }

  return (
    <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
  );
}
