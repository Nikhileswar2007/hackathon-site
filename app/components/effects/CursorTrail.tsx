"use client";

import { useEffect, useRef } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { onTick } from "./ticker";
import { safeNumber } from "./cursor-utils";

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
    let width = Math.max(1, Math.floor(canvasEl.clientWidth || window.innerWidth));
    let height = Math.max(1, Math.floor(canvasEl.clientHeight || window.innerHeight));
    let lastMove = 0;
    let stopTicker: (() => void) | null = null;

    const styles = getComputedStyle(document.documentElement);
    const primaryToken = styles.getPropertyValue("--primary").trim();
    const accentToken = styles.getPropertyValue("--accent").trim();
    const validColor = (value: string, fallback: string) =>
      value &&
      typeof CSS !== "undefined" &&
      CSS.supports("color", value)
        ? value
        : fallback;
    const primary = validColor(primaryToken, "#ff9e45");
    const accent = validColor(accentToken, "#6fe3f2");

    function resize() {
      width = Math.max(1, Math.floor(canvasEl.clientWidth || window.innerWidth));
      height = Math.max(1, Math.floor(canvasEl.clientHeight || window.innerHeight));
      canvasEl.width = width;
      canvasEl.height = height;
    }

    function clear() {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }

    function resetPointerState() {
      points.length = 0;
      lastMove = 0;
      clear();
    }

    function render(time: number) {
      const frameTime = safeNumber(time, 0, 0, Number.MAX_SAFE_INTEGER, "trailTime");

      if (lastMove === 0 || frameTime - lastMove > 1000) {
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

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.filter = "none";
      ctx.shadowBlur = mode === "lite" ? 0 : 12;
      ctx.shadowColor = mode === "lite" ? "transparent" : primary;

      for (let index = 1; index < points.length; index += 1) {
        const from = points[index - 1];
        const to = points[index];

        if (
          !Number.isFinite(from.x) ||
          !Number.isFinite(from.y) ||
          !Number.isFinite(to.x) ||
          !Number.isFinite(to.y)
        ) {
          points.splice(index - 1, 2);
          index = Math.max(0, index - 2);
          continue;
        }

        const ratio = safeNumber(index / points.length, 0, 0, 1, "trailRatio");

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.lineWidth = safeNumber(
          0.5 + ratio * (mode === "lite" ? 2.2 : 3.4),
          0.5,
          0.5,
          4,
          "trailWidth",
        );
        ctx.strokeStyle = index % 4 === 0 ? accent : primary;
        ctx.globalAlpha = safeNumber(ratio * ratio * 0.32, 0, 0, 0.32, "trailAlpha");
        ctx.shadowColor = index % 4 === 0 ? accent : primary;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    }

    function startLoop() {
      if (!stopTicker) {
        stopTicker = onTick(render);
      }
    }

    function handleMove(event: PointerEvent) {
      const x = safeNumber(event.clientX, 0, -5000, 5000, "trailX");
      const y = safeNumber(event.clientY, 0, -5000, 5000, "trailY");

      if (lastMove === 0) {
        points.length = 0;
      }

      points.push({ x, y });
      if (points.length > maxPoints) {
        points.shift();
      }
      lastMove = performance.now();
      startLoop();
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        resetPointerState();
      }
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("blur", resetPointerState);
    document.addEventListener("mouseleave", resetPointerState);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("blur", resetPointerState);
      document.removeEventListener("mouseleave", resetPointerState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
