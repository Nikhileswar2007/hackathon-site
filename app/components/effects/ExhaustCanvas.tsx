"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { onTick } from "./ticker";
import { CURSOR, safeNumber } from "./cursor-utils";

export interface ExhaustMotion {
  x: number;
  y: number;
  heading: number;
  speed: number;
  flare: boolean;
  down: boolean;
  native: boolean;
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function parseCssColor(raw: string, fallback: RgbColor): RgbColor {
  const value = raw.trim();
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];

  if (hex) {
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((character) => character + character)
            .join("")
        : hex;
    const parsed = Number.parseInt(normalized, 16);

    if (Number.isFinite(parsed)) {
      return {
        r: (parsed >> 16) & 255,
        g: (parsed >> 8) & 255,
        b: parsed & 255,
      };
    }
  }

  const rgb = value.match(
    /^rgba?\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i,
  );

  if (rgb) {
    const red = Number.parseInt(rgb[1], 10);
    const green = Number.parseInt(rgb[2], 10);
    const blue = Number.parseInt(rgb[3], 10);

    if (
      Number.isFinite(red) &&
      Number.isFinite(green) &&
      Number.isFinite(blue) &&
      red <= 255 &&
      green <= 255 &&
      blue <= 255
    ) {
      return { r: red, g: green, b: blue };
    }
  }

  return fallback;
}

function rgba(color: RgbColor, alpha: number) {
  const safeAlpha = safeNumber(alpha, 0, 0, 1, "colorAlpha");
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${safeAlpha.toFixed(3)})`;
}

function isFiniteNumber(value: number) {
  return Number.isFinite(value);
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
    const foregroundColor = parseCssColor(
      palette.getPropertyValue("--foreground"),
      { r: 237, g: 243, b: 251 },
    );
    const cyanColor = parseCssColor(palette.getPropertyValue("--accent"), {
      r: 111,
      g: 227,
      b: 242,
    });
    const orangeColor = parseCssColor(palette.getPropertyValue("--primary"), {
      r: 255,
      g: 158,
      b: 69,
    });
    const colors = [foregroundColor, cyanColor, orangeColor];
    const exhaustColors = [foregroundColor, cyanColor, cyanColor, orangeColor];

    let width = Math.max(1, Math.floor(canvasElement.clientWidth || window.innerWidth));
    let height = Math.max(1, Math.floor(canvasElement.clientHeight || window.innerHeight));
    let stopTicker: (() => void) | null = null;
    let emission = 0;
    let idleEmission = 0;
    let lastPointer = performance.now();

    function resize() {
      width = Math.max(
        1,
        Math.floor(canvasElement.clientWidth || window.innerWidth),
      );
      height = Math.max(
        1,
        Math.floor(canvasElement.clientHeight || window.innerHeight),
      );
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
      if (
        ![x, y, vx, vy, life, size].every(isFiniteNumber) ||
        life <= 0 ||
        size <= 0
      ) {
        return;
      }

      const safeX = safeNumber(x, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "particleX");
      const safeY = safeNumber(y, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "particleY");
      const safeVx = safeNumber(vx, 0, -CURSOR.velocityMax, CURSOR.velocityMax, "particleVx");
      const safeVy = safeNumber(vy, 0, -CURSOR.velocityMax, CURSOR.velocityMax, "particleVy");
      const safeLife = safeNumber(life, 1, 1, CURSOR.particleLifeMax, "particleLife");
      const safeSize = safeNumber(size, 0.18, 0.18, CURSOR.particleRadiusMax, "particleSize");
      const safeColorIndex = Number.isInteger(colorIndex)
        ? Math.max(0, Math.min(2, colorIndex))
        : 1;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (particle.alive) {
          continue;
        }

        particle.alive = true;
        particle.spark = spark;
        particle.x = safeX;
        particle.y = safeY;
        particle.vx = safeVx;
        particle.vy = safeVy;
        particle.age = 0;
        particle.life = safeLife;
        particle.size = safeSize;
        particle.colorIndex = safeColorIndex;
        return;
      }
    }

    function spawnWarp(x: number, y: number, vx: number, vy: number, speed: number) {
      if (![x, y, vx, vy, speed].every(isFiniteNumber)) {
        return;
      }

      const safeX = safeNumber(x, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "warpX");
      const safeY = safeNumber(y, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "warpY");
      const safeVx = safeNumber(vx, 0, -CURSOR.velocityMax, CURSOR.velocityMax, "warpVx");
      const safeVy = safeNumber(vy, 0, -CURSOR.velocityMax, CURSOR.velocityMax, "warpVy");
      const safeSpeed = safeNumber(speed, 0, 0, CURSOR.speedMax, "warpSpeed");

      for (let index = 0; index < streaks.length; index += 1) {
        const streak = streaks[index];

        if (streak.alive) {
          continue;
        }

        const spread = (index - (CURSOR.warpStreakCount - 1) / 2) * 3.4;
        const side = index % 2 === 0 ? 1 : -1;
        streak.alive = true;
        streak.x = safeX - safeVx * 0.012;
        streak.y = safeY - safeVy * 0.012 + spread;
        streak.vx = -safeVx * (0.28 + index * 0.025);
        streak.vy = -safeVy * (0.28 + index * 0.025) + side * 0.18;
        streak.age = 0;
        streak.life = 180;
        streak.length = safeNumber(26 + safeSpeed / 55 + index * 5, 1, 1, CURSOR.streakLengthMax, "warpLength");
        streak.width = safeNumber(index === 2 ? 1.35 : 0.7, 0.7, 0.5, 2, "warpWidth");
        streak.alpha = safeNumber(Math.min(0.62, 0.23 + safeSpeed / 3600), 0.23, 0, 1, "warpAlpha");
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
      const frameDelta = safeNumber(delta, 16.67, 0, CURSOR.dtMax, "dt");
      const motion = motionRef.current;

      if (motion.native) {
        return;
      }

      const speed = safeNumber(motion.speed, 0, 0, CURSOR.speedMax, "exhaustSpeed");
      const motionX = safeNumber(motion.x, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "exhaustX");
      const motionY = safeNumber(motion.y, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "exhaustY");
      const heading = safeNumber(motion.heading, Math.PI, -Math.PI * 2, Math.PI * 2, "exhaustHeading");

      if (speed > 80) {
        emission += (speed / 900) * frameDelta;

        while (emission >= 1) {
          emission -= 1;
          const tailX = motionX - Math.cos(heading) * 13;
          const tailY = motionY - Math.sin(heading) * 13;
          const spread = (Math.random() - 0.5) * 0.62;
          const backAngle = heading + Math.PI + spread;
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
        idleEmission += frameDelta;

        if (idleEmission > 185) {
          idleEmission = 0;
          const tailX = motionX - Math.cos(heading) * 12;
          const tailY = motionY - Math.sin(heading) * 12;
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

    function render(_time: number, delta: number) {
      const frameDelta = safeNumber(delta, 16.67, 0, CURSOR.dtMax, "dt");
      let liveParticles = 0;
      let liveStreaks = 0;

      canvasContext.save();

      try {
        canvasContext.globalAlpha = 1;
        canvasContext.globalCompositeOperation = "lighter";
        canvasContext.filter = "none";
        canvasContext.shadowBlur = 0;
        canvasContext.shadowColor = "transparent";
        canvasContext.lineCap = "round";
        canvasContext.lineJoin = "round";
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
        emitFromMotion(frameDelta);

        const motion = motionRef.current;
        const exhaustX = safeNumber(motion.x, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "exhaustX");
        const exhaustY = safeNumber(motion.y, 0, -CURSOR.coordinateMax, CURSOR.coordinateMax, "exhaustY");
        const exhaustHeading = safeNumber(motion.heading, Math.PI, -Math.PI * 2, Math.PI * 2, "exhaustHeading");
        const exhaustSpeed = safeNumber(motion.speed, 0, 0, CURSOR.speedMax, "exhaustSpeed");

        if (!motion.native && exhaustSpeed > 1180 && Math.random() < 0.72) {
          spawnWarp(
            exhaustX,
            exhaustY,
            Math.cos(exhaustHeading) * exhaustSpeed,
            Math.sin(exhaustHeading) * exhaustSpeed,
            exhaustSpeed,
          );
        }

        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];

          if (!particle.alive) {
            continue;
          }

          if (
            ![particle.x, particle.y, particle.vx, particle.vy, particle.age, particle.life, particle.size].every(
              isFiniteNumber,
            )
          ) {
            particle.alive = false;
            continue;
          }

          particle.age = safeNumber(
            particle.age + frameDelta,
            particle.life,
            0,
            CURSOR.particleLifeMax,
            "particleAge",
          );

          if (particle.age >= particle.life) {
            particle.alive = false;
            continue;
          }

          liveParticles += 1;
          const lifeRatio = safeNumber(1 - particle.age / particle.life, 0, 0, 1, "lifeRatio");
          const shrink = particle.spark ? lifeRatio * lifeRatio : lifeRatio;
          particle.x = safeNumber(
            particle.x + (particle.vx * frameDelta) / 16.67,
            exhaustX,
            -CURSOR.coordinateMax,
            CURSOR.coordinateMax,
            "particleX",
          );
          particle.y = safeNumber(
            particle.y + (particle.vy * frameDelta) / 16.67,
            exhaustY,
            -CURSOR.coordinateMax,
            CURSOR.coordinateMax,
            "particleY",
          );
          particle.vx = safeNumber(
            particle.vx * (particle.spark ? 0.985 : 0.955),
            0,
            -CURSOR.velocityMax,
            CURSOR.velocityMax,
            "particleVx",
          );
          particle.vy = safeNumber(
            particle.vy * (particle.spark ? 0.985 : 0.955),
            0,
            -CURSOR.velocityMax,
            CURSOR.velocityMax,
            "particleVy",
          );

          if (particle.spark) {
            particle.vy = safeNumber(
              particle.vy + 0.018,
              particle.vy,
              -CURSOR.velocityMax,
              CURSOR.velocityMax,
              "sparkGravity",
            );
          }

          const paletteIndex = particle.spark
            ? Math.max(0, Math.min(2, particle.colorIndex))
            : particle.colorIndex === 1
              ? 1
              : particle.colorIndex === 2
                ? 2
                : 0;
          const particleColor = particle.spark
            ? colors[paletteIndex] ?? cyanColor
            : exhaustColors[
                particle.colorIndex === 0
                  ? 0
                  : particle.colorIndex === 1
                    ? 1
                    : 3
              ] ?? cyanColor;
          const radius = safeNumber(
            particle.size * shrink,
            0.18,
            0.18,
            CURSOR.particleRadiusMax,
            "particleRadius",
          );
          const alpha = safeNumber(lifeRatio * 0.9, 0, 0, 1, "particleAlpha");

          canvasContext.beginPath();
          canvasContext.globalAlpha = alpha;
          canvasContext.fillStyle = rgba(particleColor, alpha);
          canvasContext.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
          canvasContext.fill();
        }

        for (let index = 0; index < streaks.length; index += 1) {
          const streak = streaks[index];

          if (!streak.alive) {
            continue;
          }

          if (
            ![streak.x, streak.y, streak.vx, streak.vy, streak.age, streak.life, streak.length, streak.width, streak.alpha].every(
              isFiniteNumber,
            )
          ) {
            streak.alive = false;
            continue;
          }

          streak.age = safeNumber(
            streak.age + frameDelta,
            streak.life,
            0,
            streak.life,
            "streakAge",
          );

          if (streak.age >= streak.life) {
            streak.alive = false;
            continue;
          }

          liveStreaks += 1;
          const ratio = safeNumber(1 - streak.age / streak.life, 0, 0, 1, "streakRatio");
          const direction = streak.vx === 0 ? 1 : Math.sign(streak.vx);
          const startX = streak.x;
          const startY = streak.y;
          const endX = safeNumber(
            streak.x + streak.vx * 0.045 + streak.length * direction,
            startX,
            -CURSOR.coordinateMax,
            CURSOR.coordinateMax,
            "streakEndX",
          );
          const endY = safeNumber(
            streak.y + streak.vy * 0.045,
            startY,
            -CURSOR.coordinateMax,
            CURSOR.coordinateMax,
            "streakEndY",
          );
          const alpha = safeNumber(streak.alpha * ratio * ratio, 0, 0, 1, "streakAlpha");

          canvasContext.beginPath();
          canvasContext.globalAlpha = alpha;
          canvasContext.strokeStyle = rgba(cyanColor, alpha);
          canvasContext.lineWidth = safeNumber(streak.width, 1, 0.5, 2, "streakWidth");
          canvasContext.moveTo(streak.x, streak.y);
          canvasContext.lineTo(endX, endY);
          canvasContext.stroke();
          streak.x = safeNumber(
            streak.x + (streak.vx * frameDelta) / 16.67,
            startX,
            -CURSOR.coordinateMax,
            CURSOR.coordinateMax,
            "streakX",
          );
          streak.y = safeNumber(
            streak.y + (streak.vy * frameDelta) / 16.67,
            startY,
            -CURSOR.coordinateMax,
            CURSOR.coordinateMax,
            "streakY",
          );
        }
      } finally {
        canvasContext.globalAlpha = 1;
        canvasContext.globalCompositeOperation = "source-over";
        canvasContext.filter = "none";
        canvasContext.shadowBlur = 0;
        canvasContext.shadowColor = "transparent";
        canvasContext.restore();
      }

      const idleFor = safeNumber(
        performance.now() - safeNumber(lastPointer, performance.now(), 0, Number.MAX_SAFE_INTEGER, "lastPointer"),
        0,
        0,
        Number.MAX_SAFE_INTEGER,
        "exhaustIdle",
      );

      if (idleFor > 260 && liveParticles === 0 && liveStreaks === 0) {
        canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
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
      canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    };
  }, [motionRef]);

  return <canvas ref={canvasRef} className="orbiter-canvas" aria-hidden="true" />;
}
