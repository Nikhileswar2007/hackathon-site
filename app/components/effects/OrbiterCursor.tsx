"use client";

import { useEffect, useRef } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { getPointer } from "./pointer-store";
import { onTick } from "./ticker";

export const CURSOR = {
  craftSize: 28,
  hotspotSize: 3,
  ringBaseRadius: 16,
  satelliteSize: 3,
  orbitSpeed: 1.15,
  idleOrbitSpeed: 0.64,
  craftLerp: 0.35,
  headingLerp: 0.18,
  restHeading: (-3 * Math.PI) / 4,
  restDelayMs: 400,
  stretchMax: 0.4,
  bankMax: 0.42,
  idleDelayMs: 2500,
  dimDelayMs: 8000,
  dimOpacity: 0.55,
} as const;

const NATIVE_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), select, textarea, [contenteditable="true"], iframe, [data-cursor="native"]';

function shortestAngle(from: number, to: number) {
  let difference = to - from;

  while (difference > Math.PI) {
    difference -= Math.PI * 2;
  }

  while (difference < -Math.PI) {
    difference += Math.PI * 2;
  }

  return difference;
}

export function OrbiterCursor() {
  const { mode, ready } = useEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = ready && mode !== "off" && finePointer;
  const rootRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const craft = craftRef.current;
    const ring = ringRef.current;
    const orbit = orbitRef.current;
    const hotspot = hotspotRef.current;

    if (!enabled || !root || !craft || !ring || !orbit || !hotspot) {
      return;
    }

    const rootEl = root;

    let craftX = window.innerWidth / 2;
    let craftY = window.innerHeight / 2;
    let previousX = craftX;
    let previousY = craftY;
    let heading = CURSOR.restHeading;
    let bank = 0;
    let stretch = 1;
    let satelliteAngle = 0;
    let lateralVelocity = 0;
    let visible = false;
    let nativeTarget = false;
    let lastInteraction = 0;
    let lastMotion = 0;

    const setNative = (value: boolean) => {
      nativeTarget = value;
      rootEl.dataset.native = String(value);

      if (value) {
        document.documentElement.classList.remove("cursor-none");
      } else if (visible) {
        document.documentElement.classList.add("cursor-none");
      }
    };

    const setVisible = (value: boolean) => {
      if (visible === value) {
        return;
      }

      visible = value;
      rootEl.dataset.visible = String(value);

      if (value && !nativeTarget) {
        document.documentElement.classList.add("cursor-none");
      } else {
        document.documentElement.classList.remove("cursor-none");
      }
    };

    function handlePointerMove(event: PointerEvent) {
      lastInteraction = performance.now();
      const target = event.target instanceof Element ? event.target : null;
      setNative(Boolean(target?.closest(NATIVE_SELECTOR)));
    }

    function handleLeave() {
      setVisible(false);
      document.documentElement.classList.remove("cursor-none");
      rootEl.style.opacity = "1";
    }

    function handleBlur() {
      handleLeave();
    }

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mouseleave", handleLeave);

    const stopTicker = onTick((time, delta) => {
      const pointerState = getPointer();
      const now = performance.now();

      if (!pointerState.active) {
        setVisible(false);
        return;
      }

      if (!visible) {
        craftX = pointerState.x;
        craftY = pointerState.y;
        previousX = craftX;
        previousY = craftY;
        heading = CURSOR.restHeading;
        lastMotion = now;
        setVisible(true);
      }

      const settle = 1 - Math.pow(1 - CURSOR.craftLerp, delta / 16.67);
      const nextX = pointerState.x;
      const nextY = pointerState.y;
      const velocityX = nextX - previousX;
      const velocityY = nextY - previousY;
      const distance = Math.hypot(velocityX, velocityY);
      const speed = distance * (1000 / Math.max(1, delta));

      craftX += (nextX - craftX) * settle;
      craftY += (nextY - craftY) * settle;

      if (distance > 0.7) {
        const velocityHeading = Math.atan2(velocityY, velocityX);
        const turn = shortestAngle(heading, velocityHeading);
        heading += turn * CURSOR.headingLerp;
        lastMotion = now;
      } else if (now - lastMotion > CURSOR.restDelayMs) {
        heading += shortestAngle(heading, CURSOR.restHeading) * 0.08;
      }

      lateralVelocity =
        lateralVelocity * 0.78 +
        (velocityX * -Math.sin(heading) + velocityY * Math.cos(heading)) * 0.22;
      const bankTarget = Math.max(
        -CURSOR.bankMax,
        Math.min(CURSOR.bankMax, lateralVelocity / 34),
      );
      bank += (bankTarget - bank) * 0.16;

      const stretchTarget =
        1 + Math.min(CURSOR.stretchMax, Math.max(0, speed - 160) / 3200);
      stretch += (stretchTarget - stretch) * 0.18;
      const squash = 1 / Math.sqrt(stretch);

      const idleFor = now - (lastInteraction || now);
      const idle = idleFor > CURSOR.idleDelayMs;
      const dimmed = idleFor > CURSOR.dimDelayMs;
      const bob = idle ? Math.sin(time / 430) * 2 : 0;
      const displayX = craftX;
      const displayY = craftY + bob;

      rootEl.style.opacity = dimmed ? String(CURSOR.dimOpacity) : "1";

      const rotation = (heading * 180) / Math.PI;
      const bankDegrees = (bank * 180) / Math.PI;
      const craftTransform = `translate3d(${displayX}px, ${displayY}px, 0) rotate(${rotation}deg) skewY(${bankDegrees}deg) scale(${stretch}, ${squash})`;

      craft.style.transform = craftTransform;
      ring.style.transform = `translate3d(${displayX}px, ${displayY}px, 0)`;
      hotspot.style.transform = `translate3d(${displayX}px, ${displayY}px, 0)`;

      const orbitSpeed = idle ? CURSOR.idleOrbitSpeed : CURSOR.orbitSpeed;
      satelliteAngle += (orbitSpeed * delta) / 1000;
      orbit.style.transform = `rotate(${(satelliteAngle * 180) / Math.PI}deg)`;
      rootEl.dataset.idle = String(idle);

      previousX = nextX;
      previousY = nextY;
    });

    return () => {
      stopTicker();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("mouseleave", handleLeave);
      document.documentElement.classList.remove("cursor-none");
      rootEl.style.opacity = "1";
    };
  }, [enabled, mode]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="orbiter-cursor"
      data-visible="false"
      data-native="false"
      data-idle="false"
      data-state="idle"
      data-pressed="false"
      data-tone="orange"
      data-mode={mode}
      aria-hidden="true"
    >
      <div ref={craftRef} className="orbiter-craft">
        <svg
          width={CURSOR.craftSize}
          height={CURSOR.craftSize}
          viewBox="0 0 28 28"
          focusable="false"
        >
          <path
            className="orbiter-flame orbiter-flame-full"
            d="M 5.2 14 L 0.8 11.4 L 2.6 14 L 0.8 16.6 Z"
          />
          <path className="orbiter-flame orbiter-flame-lite" d="M 5.2 14 L 1.8 12.1 L 3.2 14 L 1.8 15.9 Z" />
          <path
            className="orbiter-body"
            d="M 25 14 L 9.2 5.8 L 12.6 14 L 9.2 22.2 Z"
          />
          <path className="orbiter-fin" d="M 10.6 8.4 L 5.8 3.8 L 12 10.8 Z" />
          <path
            className="orbiter-fin"
            d="M 10.6 19.6 L 5.8 24.2 L 12 17.2 Z"
          />
          <circle className="orbiter-canopy" cx="15.7" cy="14" r="2.15" />
          <circle className="orbiter-nozzle" cx="5.2" cy="14" r="1.7" />
        </svg>
      </div>
      <div ref={ringRef} className="orbiter-ring">
        <div ref={orbitRef} className="orbiter-orbit">
          <span className="orbiter-satellite" />
        </div>
      </div>
      <span ref={hotspotRef} className="orbiter-hotspot" />
      <span className="orbiter-label" />
    </div>
  );
}
