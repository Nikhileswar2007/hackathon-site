"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { getPointer } from "./pointer-store";
import { onTick } from "./ticker";
import { ExhaustCanvas, type ExhaustMotion } from "./ExhaustCanvas";

type CursorState =
  | "hidden"
  | "idle"
  | "moving"
  | "hover-target"
  | "hover-primary"
  | "hover-drag"
  | "pressed"
  | "native";

const TARGET_SELECTOR =
  'a, button, [role="button"], [role="tab"], summary, label[for], input[type="checkbox"], input[type="radio"], input[type="range"], [aria-expanded], [data-cursor]';

const TONE_SELECTOR = "[data-cursor-tone]";
const FRAME_OFF_SELECTOR = '[data-cursor-frame="off"], [data-cursor="INSPECT"]';

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
  hoverOrbitSpeed: 2.875,
  ringHoverScale: 22 / 16,
  ringPressedScale: 12 / 16,
  ringLerp: 0.18,
  pingPool: 3,
  pingPerClick: 2,
  pingLitePerClick: 1,
  pingExpandTo: 3,
  pingDurationMs: 450,
  pingStaggerMs: 80,
  particlePool: 80,
  particleLifeMin: 300,
  particleLifeMax: 500,
  warpStreakCount: 5,
  sparkBurstNormal: 8,
  sparkBurstPrimary: 16,
  magnetMax: 8,
  magnetScale: 0.08,
  magnetLerp: 0.12,
  lockPadding: 6,
  lockPressedPadding: 3,
  lockLerp: 0.18,
  lockAreaRatio: 0.35,
  lockBracketSize: 12,
  scrollTargetThrottleMs: 80,
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

function cleanLabel(value: string | undefined) {
  return value?.trim().toUpperCase().replace(/[^A-Z0-9 ]/g, "") ?? "";
}

function isExternalLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("#") || href.startsWith("/")) {
    return false;
  }

  if (anchor.target === "_blank" || /^(mailto|tel):/i.test(href)) {
    return true;
  }

  try {
    return new URL(href, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function expandedLabel(element: Element) {
  const expanded = element.getAttribute("aria-expanded");

  if (expanded !== null) {
    return expanded === "true" ? "COLLAPSE" : "EXPAND";
  }

  const details = element.closest("details");
  return details?.open ? "COLLAPSE" : "EXPAND";
}

function autoLabel(element: Element) {
  const anchor = element.closest<HTMLAnchorElement>("a[href]");

  if (anchor && anchor.contains(element)) {
    return isExternalLink(anchor) ? "EXIT" : "OPEN";
  }

  const roleTab = element.closest('[role="tab"]');

  if (roleTab) {
    return "SWITCH";
  }

  const toggle = element.closest(
    'input[type="checkbox"], input[type="radio"]',
  );

  if (toggle) {
    return "TOGGLE";
  }

  const range = element.closest('input[type="range"]');

  if (range) {
    return "SLIDE";
  }

  const expandable = element.closest("summary, [aria-expanded]");

  if (expandable) {
    return expandedLabel(expandable);
  }

  const button = element.closest("button, [role='button']");

  if (button) {
    return "PRESS";
  }

  const label = element.closest("label[for]");

  if (label) {
    return "FOCUS";
  }

  return "PRESS";
}

function targetTone(element: Element | null) {
  const source = element?.closest<HTMLElement>(TONE_SELECTOR);
  const tone = source?.dataset.cursorTone;

  return tone === "cyan" || tone === "white" ? tone : "orange";
}

function frameElementFor(element: Element | null) {
  if (!element) {
    return null;
  }

  if (element.closest(FRAME_OFF_SELECTOR)) {
    return null;
  }

  const candidate = element.closest<HTMLElement>(TARGET_SELECTOR);

  if (!candidate) {
    return null;
  }

  const rect = candidate.getBoundingClientRect();
  const viewportArea = window.innerWidth * window.innerHeight;
  const tooLarge =
    viewportArea > 0 &&
    rect.width * rect.height > viewportArea * CURSOR.lockAreaRatio;

  return tooLarge
    ? null
    : {
        element: candidate,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
      };
}

function clampMagnet(value: number) {
  return Math.max(-CURSOR.magnetMax, Math.min(CURSOR.magnetMax, value));
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
  const labelRef = useRef<HTMLSpanElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const dragArcsRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pingRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [uiState, setUiState] = useState<CursorState>("hidden");
  const [uiLabel, setUiLabel] = useState("");
  const stateRef = useRef<CursorState>("hidden");
  const labelStateRef = useRef("");
  const motionRef = useRef<ExhaustMotion>({
    x: 0,
    y: 0,
    heading: CURSOR.restHeading,
    speed: 0,
    flare: false,
    down: false,
    native: false,
  });

  useEffect(() => {
    const root = rootRef.current;
    const craft = craftRef.current;
    const ring = ringRef.current;
    const orbit = orbitRef.current;
    const hotspot = hotspotRef.current;
    const label = labelRef.current;
    const brackets = bracketsRef.current;
    const dragArcs = dragArcsRef.current;

    if (
      !enabled ||
      !root ||
      !craft ||
      !ring ||
      !orbit ||
      !hotspot ||
      !label ||
      !brackets ||
      !dragArcs
    ) {
      return;
    }

    const rootEl = root;
    const labelEl = label;
    const bracketsEl = brackets;
    const dragArcsEl = dragArcs;
    rootEl.dataset.tone = "orange";
    rootEl.dataset.launch = "false";

    const commitState = (next: CursorState) => {
      if (stateRef.current === next) {
        return;
      }

      stateRef.current = next;
      setUiState(next);
    };

    const commitLabel = (next: string) => {
      if (labelStateRef.current === next) {
        return;
      }

      labelStateRef.current = next;
      setUiLabel(next);
    };

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
    let pressed = false;
    let ringScale = 1;
    let lastDisplayX = craftX;
    let lastDisplayY = craftY;
    let resolvedTarget: Element | null = null;
    let hoverKind: CursorState | null = null;
    let hoverLabel = "";
    let launchHover = false;
    let lockedElement: HTMLElement | null = null;
    let magnetX = 0;
    let magnetY = 0;
    let frameX = craftX - 8;
    let frameY = craftY - 8;
    let frameWidth = 16;
    let frameHeight = 16;
    let lockCenterX = craftX;
    let lockCenterY = craftY;
    let lockVisible = false;
    let dragAngle = 0;
    let scrollPending = false;
    let lastScrollCheck = 0;
    let refreshTimer = 0;
    let frameTargetX = 0;
    let frameTargetY = 0;
    let frameTargetWidth = 0;
    let frameTargetHeight = 0;
    const motion = motionRef.current;
    const pingStates = Array.from({ length: CURSOR.pingPool }, () => ({
      active: false,
      start: 0,
      x: 0,
      y: 0,
    }));

    const desiredState = (kind: CursorState | null): CursorState => {
      if (nativeTarget) {
        return "native";
      }

      if (pressed) {
        return kind === "hover-drag" ? "hover-drag" : "pressed";
      }

      return kind ?? "idle";
    };

    const setNative = (value: boolean) => {
      nativeTarget = value;
      motion.native = value;
      rootEl.dataset.native = String(value);

      if (value) {
        document.documentElement.classList.remove("cursor-none");
      } else if (visible) {
        document.documentElement.classList.add("cursor-none");
      }
    };

    const updateTarget = (element: Element | null, force = false) => {
      lastInteraction = performance.now();
      const connection = element?.isConnected ? element : null;
      const native = Boolean(connection?.closest(NATIVE_SELECTOR));

      if (!force && connection === resolvedTarget) {
        return;
      }

      setNative(native);
      rootEl.dataset.tone = targetTone(connection);

      if (native) {
        resolvedTarget = connection;
        hoverKind = null;
        hoverLabel = "";
        launchHover = false;
        lockedElement = null;
        lockVisible = false;
        rootEl.dataset.launch = "false";
        commitLabel("");
        commitState("native");
        return;
      }

      const explicitElement =
        connection?.closest<HTMLElement>("[data-cursor]") ?? null;
      const explicit = cleanLabel(explicitElement?.dataset.cursor);
      const interactive = connection?.closest(TARGET_SELECTOR) ?? null;
      const label =
        explicit || (interactive ? autoLabel(interactive) : "");

      if (explicit === "DRAG") {
        hoverKind = "hover-drag";
        hoverLabel = "DRAG";
        launchHover = false;
        lockedElement = null;
        lockVisible = false;
      } else if (explicit === "LAUNCH") {
        hoverKind = "hover-primary";
        hoverLabel = "LAUNCH";
        launchHover = true;
        const frameTarget = frameElementFor(connection);
        lockedElement = frameTarget?.element ?? null;
        if (frameTarget) {
          lockCenterX = frameTarget.centerX;
          lockCenterY = frameTarget.centerY;
        }
        lockVisible = Boolean(frameTarget);
      } else if (interactive || explicit) {
        hoverKind = "hover-target";
        hoverLabel = label;
        launchHover = false;
        const frameTarget = frameElementFor(connection);
        lockedElement = frameTarget?.element ?? null;
        if (frameTarget) {
          lockCenterX = frameTarget.centerX;
          lockCenterY = frameTarget.centerY;
        }
        lockVisible = Boolean(frameTarget);
      } else {
        hoverKind = null;
        hoverLabel = "";
        launchHover = false;
        lockedElement = null;
        lockVisible = false;
      }

      rootEl.dataset.launch = String(launchHover);
      motion.flare = launchHover;
      resolvedTarget = connection;
      commitLabel(hoverKind ? hoverLabel : "");
      commitState(desiredState(hoverKind));
    };

    const setVisible = (value: boolean) => {
      if (visible === value) {
        return;
      }

      visible = value;
      rootEl.dataset.visible = String(value);

      if (!value) {
        pressed = false;
        rootEl.dataset.pressed = "false";
        motion.down = false;
        lockedElement = null;
        lockVisible = false;
        resolvedTarget = null;
        commitLabel("");
        commitState("hidden");
      }

      if (value && !nativeTarget) {
        document.documentElement.classList.add("cursor-none");
      } else {
        document.documentElement.classList.remove("cursor-none");
      }
    };

    function triggerPings() {
      lastInteraction = performance.now();
      const count = mode === "lite" ? CURSOR.pingLitePerClick : CURSOR.pingPerClick;
      let queued = 0;

      for (let index = 0; index < pingStates.length && queued < count; index += 1) {
        const ping = pingStates[index];

        if (ping.active) {
          continue;
        }

        ping.active = true;
        ping.start = lastInteraction + queued * CURSOR.pingStaggerMs;
        ping.x = lastDisplayX;
        ping.y = lastDisplayY;
        queued += 1;
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (event.button !== 0 || nativeTarget) {
        return;
      }

      lastInteraction = performance.now();
      pressed = true;
      motion.down = true;
      rootEl.dataset.pressed = "true";
      updateTarget(
        event.target instanceof Element ? event.target : null,
        true,
      );
      triggerPings();
    }

    function handlePointerUp(event: PointerEvent) {
      pressed = false;
      motion.down = false;
      rootEl.dataset.pressed = "false";
      updateTarget(
        event.target instanceof Element ? event.target : null,
        true,
      );
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => {
        const pointerState = getPointer();
        updateTarget(
          document.elementFromPoint(pointerState.x, pointerState.y),
          true,
        );
      }, 60);
    }

    function handlePointerMove(event: PointerEvent) {
      lastInteraction = performance.now();
      updateTarget(event.target instanceof Element ? event.target : null);
    }

    function handlePointerOver(event: PointerEvent) {
      updateTarget(event.target instanceof Element ? event.target : null);
    }

    function handleScroll() {
      scrollPending = true;
    }

    function handleLeave() {
      pressed = false;
      motion.down = false;
      rootEl.dataset.pressed = "false";
      setVisible(false);
      document.documentElement.classList.remove("cursor-none");
      rootEl.style.opacity = "1";
    }

    function handleBlur() {
      handleLeave();
    }

    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("blur", handleBlur);
    document.addEventListener("mouseleave", handleLeave);

    const stopTicker = onTick((time, delta) => {
      const pointerState = getPointer();
      const now = performance.now();

      if (
        scrollPending &&
        now - lastScrollCheck > CURSOR.scrollTargetThrottleMs
      ) {
        lastScrollCheck = now;
        scrollPending = false;

        if (pointerState.active) {
          updateTarget(
            document.elementFromPoint(pointerState.x, pointerState.y),
            true,
          );
        }
      }

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

      if (hoverKind === "hover-drag" && pressed) {
        dragAngle += velocityX * 0.012;
      }

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
      const framePadding = pressed ? CURSOR.lockPressedPadding : CURSOR.lockPadding;

      if (lockedElement && !lockedElement.isConnected) {
        lockedElement = null;
        lockVisible = false;
      }

      if (lockedElement) {
        const rect = lockedElement.getBoundingClientRect();
        frameTargetX = rect.left - framePadding;
        frameTargetY = rect.top - framePadding;
        frameTargetWidth = rect.width + framePadding * 2;
        frameTargetHeight = rect.height + framePadding * 2;
        lockCenterX = rect.left + rect.width / 2;
        lockCenterY = rect.top + rect.height / 2;
        lockVisible = frameTargetWidth > 0 && frameTargetHeight > 0;
      } else {
        frameTargetX = craftX - 8;
        frameTargetY = craftY - 8;
        frameTargetWidth = 16;
        frameTargetHeight = 16;
        lockVisible = false;
      }

      const frameSettle = 1 - Math.pow(1 - CURSOR.lockLerp, delta / 16.67);
      frameX += (frameTargetX - frameX) * frameSettle;
      frameY += (frameTargetY - frameY) * frameSettle;
      frameWidth += (frameTargetWidth - frameWidth) * frameSettle;
      frameHeight += (frameTargetHeight - frameHeight) * frameSettle;
      bracketsEl.dataset.frame = lockVisible ? "visible" : "retract";

      const cornerPositions = [
        [frameX, frameY],
        [frameX + frameWidth - CURSOR.lockBracketSize, frameY],
        [frameX, frameY + frameHeight - CURSOR.lockBracketSize],
        [
          frameX + frameWidth - CURSOR.lockBracketSize,
          frameY + frameHeight - CURSOR.lockBracketSize,
        ],
      ];

      for (let index = 0; index < cornerPositions.length; index += 1) {
        const corner = cornerRefs.current[index];
        const [cornerX, cornerY] = cornerPositions[index];

        if (corner) {
          corner.style.transform = `translate3d(${cornerX}px, ${cornerY}px, 0)`;
        }
      }

      const magnetTargetX = lockedElement
        ? clampMagnet((lockCenterX - craftX) * CURSOR.magnetScale)
        : 0;
      const magnetTargetY = lockedElement
        ? clampMagnet((lockCenterY - craftY) * CURSOR.magnetScale)
        : 0;
      magnetX += (magnetTargetX - magnetX) * CURSOR.magnetLerp;
      magnetY += (magnetTargetY - magnetY) * CURSOR.magnetLerp;

      const interactionState = nativeTarget
        ? "native"
        : pressed
          ? hoverKind === "hover-drag"
            ? "hover-drag"
            : "pressed"
          : hoverKind ?? (speed > 140 ? "moving" : "idle");
      commitState(interactionState);

      const idleFor = now - (lastInteraction || now);
      const idle = idleFor > CURSOR.idleDelayMs;
      const dimmed = idleFor > CURSOR.dimDelayMs;
      const bob = idle ? Math.sin(time / 430) * 2 : 0;
      const displayX = craftX + magnetX;
      const displayY = craftY + bob + magnetY;
      lastDisplayX = displayX;
      lastDisplayY = displayY;
      motion.x = displayX;
      motion.y = displayY;
      motion.heading = heading;
      motion.speed = speed;
      motion.down = pressed;
      motion.flare = launchHover;

      const ringTarget = pressed
        ? CURSOR.ringPressedScale
        : hoverKind
          ? CURSOR.ringHoverScale
          : 1;
      ringScale += (ringTarget - ringScale) * CURSOR.ringLerp;

      rootEl.style.opacity = dimmed ? String(CURSOR.dimOpacity) : "1";

      const rotation = (heading * 180) / Math.PI;
      const bankDegrees = (bank * 180) / Math.PI;
      const craftTransform = `translate3d(${displayX}px, ${displayY}px, 0) rotate(${rotation}deg) skewY(${bankDegrees}deg) scale(${stretch}, ${squash})`;

      craft.style.transform = craftTransform;
      ring.style.transform = `translate3d(${displayX}px, ${displayY}px, 0) scale(${ringScale})`;
      hotspot.style.transform = `translate3d(${displayX}px, ${displayY}px, 0)`;
      labelEl.style.transform = `translate3d(${displayX + 22}px, ${displayY + 15}px, 0)`;
      dragArcsEl.style.transform = `translate3d(${displayX}px, ${displayY}px, 0) rotate(${(dragAngle * 180) / Math.PI}deg)`;

      for (let index = 0; index < pingStates.length; index += 1) {
        const ping = pingStates[index];
        const pingElement = pingRefs.current[index];

        if (!pingElement) {
          continue;
        }

        if (!ping.active) {
          pingElement.style.opacity = "0";
          continue;
        }

        const age = now - ping.start;

        if (age < 0) {
          pingElement.style.opacity = "0";
          continue;
        }

        const ratio = age / CURSOR.pingDurationMs;

        if (ratio >= 1) {
          ping.active = false;
          pingElement.style.opacity = "0";
          continue;
        }

        const eased = 1 - Math.pow(1 - ratio, 3);
        const scale = 1 + (CURSOR.pingExpandTo - 1) * eased;
        pingElement.style.opacity = String((1 - ratio) * 0.82);
        pingElement.style.transform = `translate3d(${ping.x}px, ${ping.y}px, 0) scale(${scale})`;
      }

      const orbitSpeed = !idle && hoverKind && !pressed
        ? CURSOR.hoverOrbitSpeed
        : idle
          ? CURSOR.idleOrbitSpeed
          : CURSOR.orbitSpeed;
      satelliteAngle += (orbitSpeed * delta) / 1000;
      orbit.style.transform = `rotate(${(satelliteAngle * 180) / Math.PI}deg)`;
      rootEl.dataset.idle = String(idle);

      previousX = nextX;
      previousY = nextY;
    });

    return () => {
      stopTicker();
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("scroll", handleScroll, true);
      window.clearTimeout(refreshTimer);
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
    <>
      {mode === "full" ? (
        <ExhaustCanvas motionRef={motionRef} />
      ) : null}
      <div
        ref={rootRef}
      className="orbiter-cursor"
        data-visible="false"
        data-native="false"
        data-idle="false"
        data-state={uiState}
        data-label={uiLabel ? "true" : "false"}
        data-pressed="false"
        data-mode={mode}
        aria-hidden="true"
      >
      <div className="orbiter-pings">
        {Array.from({ length: CURSOR.pingPool }, (_, index) => (
          <span
            key={index}
            ref={(node) => {
              pingRefs.current[index] = node;
            }}
            className={`orbiter-ping orbiter-ping-${index + 1}`}
          />
        ))}
      </div>
      <div ref={bracketsRef} className="orbiter-brackets" data-frame="retract">
        {["tl", "tr", "bl", "br"].map((corner, index) => (
          <span
            key={corner}
            ref={(node) => {
              cornerRefs.current[index] = node;
            }}
            className={`orbiter-corner orbiter-corner-${corner}`}
          />
        ))}
      </div>
      <div ref={dragArcsRef} className="orbiter-drag-arcs" aria-hidden="true">
        <svg viewBox="0 0 44 44" focusable="false">
          <path d="M 35.5 15.2 A 14 14 0 0 0 12.2 8.9" />
          <path d="M 12.2 8.9 L 16.8 9.4 L 14.7 13.5 Z" />
          <path d="M 8.5 28.8 A 14 14 0 0 0 31.8 35.1" />
          <path d="M 31.8 35.1 L 27.2 34.6 L 29.3 30.5 Z" />
        </svg>
      </div>
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
      <span ref={labelRef} className="orbiter-label">
        {uiLabel}
      </span>
      </div>
    </>
  );
}
