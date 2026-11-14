"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { onTick } from "./ticker";
import { CURSOR } from "./OrbiterCursor";

export interface ExhaustMotion {
  x: number;
  y: number;
  heading: number;
  speed: number;
  flare: boolean;
  down: boolean;
  native: boolean;
}

function makeParticles(count: number) {
  return Array.from({ length: count }, () => ({
    alive: false,
    spark: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    age: 0,
    life: 1,
    size: 1,
    colorIndex: 0,
  }));
}

function makeStreaks(count: number) {
  return Array.from({ length: count }, () => ({
    alive: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    age: 0,
    life: 1,
    length: 1,
    width: 1,
    alpha: 0,
  }));
}

export function ExhaustCanvas({
  motionRef,
}: {
  motionRef: MutableRefObject<ExhaustMotion>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    const canvasElement = canvas;
    const canvasContext = context;
    const particles = makeParticles(CURSOR.particlePool);
    const streaks = makeStreaks(CURSOR.warpStreakCount);
    const palette = getComputedStyle(document.documentElement);
    const foreground =
      palette.getPropertyValue("--foreground").trim() || "#edf3fb";
    const cyan = palette.getPropertyValue("--accent").trim() || "#6fe3f2";
    const orange = palette.getPropertyValue("--primary").trim() || "#ff9e45";
    const colors = [foreground, cyan, orange];
    const exhaustColors = [foreground, cyan, cyan, orange];

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stopTicker: (() => void) | null = null;
    let emission = 0;
    let idleEmission = 0;
    let lastPointer = performance.now();

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvasElement.width = width;
      canvasElement.height = height;
    }

    function spawn(
      x: number,
      y: number,
      vx: number,
      vy: number,
      life: number,
      size: number,
      spark: boolean,
      colorIndex: number,
    ) {
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (particle.alive) {
          continue;
        }

        particle.alive = true;
        particle.spark = spark;
        particle.x = x;
        particle.y = y;
        particle.vx = vx;
        particle.vy = vy;
        particle.age = 0;
        particle.life = life;
        particle.size = size;
        particle.colorIndex = colorIndex;
        return;
      }
    }

    function spawnWarp(x: number, y: number, vx: number, vy: number, speed: number) {
      for (let index = 0; index < streaks.length; index += 1) {
        const streak = streaks[index];

        if (streak.alive) {
          continue;
        }

        const spread = (index - (CURSOR.warpStreakCount - 1) / 2) * 3.4;
        const side = index % 2 === 0 ? 1 : -1;
        streak.alive = true;
        streak.x = x - vx * 0.012;
        streak.y = y - vy * 0.012 + spread;
        streak.vx = -vx * (0.28 + index * 0.025);
        streak.vy = -vy * (0.28 + index * 0.025) + side * 0.18;
        streak.age = 0;
        streak.life = 180;
        streak.length = Math.min(86, 26 + speed / 55 + index * 5);
        streak.width = index === 2 ? 1.35 : 0.7;
        streak.alpha = Math.min(0.62, 0.23 + speed / 3600);
        return;
      }
    }

    function burst() {
      const motion = motionRef.current;

      if (motion.native) {
        return;
      }

      const count = motion.flare
        ? CURSOR.sparkBurstPrimary
        : CURSOR.sparkBurstNormal;

      for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2 + Math.random() * 0.24;
        const velocity = 1.6 + Math.random() * (motion.flare ? 4.6 : 3.2);
        spawn(
          motion.x,
          motion.y,
          Math.cos(angle) * velocity,
          Math.sin(angle) * velocity,
          260 + Math.random() * 240,
          0.8 + Math.random() * 1.4,
          true,
          index % 3,
        );
      }

      wake();
    }

    function wake() {
      lastPointer = performance.now();

      if (!stopTicker) {
        stopTicker = onTick(render);
      }
    }

    function emitFromMotion(delta: number) {
      const motion = motionRef.current;

      if (motion.native) {
        return;
      }

      const speed = motion.speed;

      if (speed > 80) {
        emission += (speed / 900) * delta;

        while (emission >= 1) {
          emission -= 1;
          const tailX = motion.x - Math.cos(motion.heading) * 13;
          const tailY = motion.y - Math.sin(motion.heading) * 13;
          const spread = (Math.random() - 0.5) * 0.62;
          const backAngle = motion.heading + Math.PI + spread;
          const force = 0.55 + Math.min(2.9, speed / 850) + Math.random() * 0.9;
          const colorIndex =
            speed > 1250 && Math.random() < 0.22
              ? 0
              : Math.random() < 0.4
                ? 1
                : Math.random() < 0.34
                  ? 2
                  : 1;
          spawn(
            tailX,
            tailY,
            Math.cos(backAngle) * force,
            Math.sin(backAngle) * force,
            CURSOR.particleLifeMin +
              Math.random() * (CURSOR.particleLifeMax - CURSOR.particleLifeMin),
            0.75 + Math.random() * (0.9 + Math.min(1.6, speed / 1500)),
            false,
            colorIndex,
          );
        }
      } else {
        idleEmission += delta;

        if (idleEmission > 185) {
          idleEmission = 0;
          const tailX = motion.x - Math.cos(motion.heading) * 12;
          const tailY = motion.y - Math.sin(motion.heading) * 12;
          spawn(
            tailX,
            tailY,
            (Math.random() - 0.5) * 0.28,
            (Math.random() - 0.5) * 0.28,
            260 + Math.random() * 160,
            0.55,
            false,
            1,
          );
        }
      }
    }

    function render(time: number, delta: number) {
      canvasContext.clearRect(0, 0, width, height);
      emitFromMotion(delta);

      const motion = motionRef.current;

      if (!motion.native && motion.speed > 1180 && Math.random() < 0.72) {
        spawnWarp(motion.x, motion.y, Math.cos(motion.heading) * motion.speed, Math.sin(motion.heading) * motion.speed, motion.speed);
      }

      canvasContext.globalCompositeOperation = "lighter";

      let liveParticles = 0;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (!particle.alive) {
          continue;
        }

        liveParticles += 1;
        particle.age += delta;

        if (particle.age >= particle.life) {
          particle.alive = false;
          continue;
        }

        const lifeRatio = 1 - particle.age / particle.life;
        const shrink = particle.spark ? lifeRatio * lifeRatio : lifeRatio;
        particle.x += (particle.vx * delta) / 16.67;
        particle.y += (particle.vy * delta) / 16.67;
        particle.vx *= particle.spark ? 0.985 : 0.955;
        particle.vy *= particle.spark ? 0.985 : 0.955;

        if (particle.spark) {
          particle.vy += 0.018;
        }

        const paletteIndex = particle.spark
          ? particle.colorIndex
          : particle.colorIndex === 0
            ? 0
            : particle.colorIndex === 1
              ? 1
              : 2;

        canvasContext.beginPath();
        canvasContext.globalAlpha = Math.min(1, lifeRatio * 0.9);
        canvasContext.fillStyle = particle.spark
          ? colors[paletteIndex]
          : exhaustColors[paletteIndex];
        canvasContext.arc(
          particle.x,
          particle.y,
          Math.max(0.18, particle.size * shrink),
          0,
          Math.PI * 2,
        );
        canvasContext.fill();
      }

      let liveStreaks = 0;

      for (let index = 0; index < streaks.length; index += 1) {
        const streak = streaks[index];

        if (!streak.alive) {
          continue;
        }

        liveStreaks += 1;
        streak.age += delta;

        if (streak.age >= streak.life) {
          streak.alive = false;
          continue;
        }

        const ratio = 1 - streak.age / streak.life;
        const endX = streak.x + streak.vx * 0.045 + streak.length * Math.sign(streak.vx || 1);
        const endY = streak.y + streak.vy * 0.045;
        canvasContext.beginPath();
        canvasContext.globalAlpha = streak.alpha * ratio * ratio;
        canvasContext.strokeStyle = cyan;
        canvasContext.lineWidth = streak.width;
        canvasContext.moveTo(streak.x, streak.y);
        canvasContext.lineTo(endX, endY);
        canvasContext.stroke();
        streak.x += (streak.vx * delta) / 16.67;
        streak.y += (streak.vy * delta) / 16.67;
      }

      canvasContext.globalAlpha = 1;
      canvasContext.globalCompositeOperation = "source-over";

      if (performance.now() - lastPointer > 260 && liveParticles === 0 && liveStreaks === 0) {
        canvasContext.clearRect(0, 0, width, height);
        stopTicker?.();
        stopTicker = null;
      }
    }

    function handlePointerMove() {
      wake();
    }

    function handlePointerDown() {
      burst();
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
      capture: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      stopTicker?.();
      canvasContext.clearRect(0, 0, width, height);
    };
  }, [motionRef]);

  return <canvas ref={canvasRef} className="orbiter-canvas" aria-hidden="true" />;
}
