"use client";

import { useEffect, useRef, useState } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { getPointer } from "./pointer-store";
import { onTick } from "./ticker";
import { ExhaustCanvas, type ExhaustMotion } from "./ExhaustCanvas";
import { CURSOR, safeNumber } from "./cursor-utils";

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

const NATIVE_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), select, textarea, [contenteditable="true"], iframe, [data-cursor="native"]';

function shortestAngle(from: number, to: number) {
  const difference = to - from;

  if (!Number.isFinite(difference)) {
    return 0;
  }

  let normalized = difference;

  while (normalized > Math.PI) {
    normalized -= Math.PI * 2;
  }

  while (normalized < -Math.PI) {
    normalized += Math.PI * 2;
  }

  return normalized;
}

function transformNumber(value: number, fallback = 0) {
  return safeNumber(
    value,
    fallback,
    -CURSOR.coordinateMax,
    CURSOR.coordinateMax,
    "transform",
  ).toFixed(3);
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
  return safeNumber(
    value,
    0,
    -CURSOR.magnetMax,
    CURSOR.magnetMax,
    "magneticPull",
  );
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
        const safePointerX = safeNumber(
          pointerState.x,
          0,
          0,
          Math.max(1, window.innerWidth),
          "pointerX",
        );
        const safePointerY = safeNumber(
          pointerState.y,
          0,
          0,
          Math.max(1, window.innerHeight),
          "pointerY",
        );
        updateTarget(
          document.elementFromPoint(safePointerX, safePointerY),
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

    function handleVisibilityChange() {
      if (document.hidden) {
        handleLeave();
      }
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
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mouseleave", handleLeave);

    const stopTicker = onTick((time, delta) => {
      const pointerState = getPointer();
      const now = safeNumber(performance.now(), 0, 0, Number.MAX_SAFE_INTEGER, "now");
      const frameDelta = safeNumber(delta, 16.67, 0, CURSOR.dtMax, "dt");
      const frameTime = safeNumber(time, now, 0, Number.MAX_SAFE_INTEGER, "time");

      if (
        scrollPending &&
        now - lastScrollCheck > CURSOR.scrollTargetThrottleMs
      ) {
        lastScrollCheck = now;
        scrollPending = false;

        if (pointerState.active) {
          const safePointerX = safeNumber(pointerState.x, 0, 0, Math.max(1, window.innerWidth), "pointerX");
          const safePointerY = safeNumber(pointerState.y, 0, 0, Math.max(1, window.innerHeight), "pointerY");
          updateTarget(
            document.elementFromPoint(safePointerX, safePointerY),
            true,
          );
        }
      }

      if (!pointerState.active) {
        setVisible(false);
        return;
      }

      if (!visible) {
        craftX = safeNumber(pointerState.x, window.innerWidth / 2, -CURSOR.coordinateMax, CURSOR.coordinateMax, "pointerX");
        craftY = safeNumber(pointerState.y, window.innerHeight / 2, -CURSOR.coordinateMax, CURSOR.coordinateMax, "pointerY");
        previousX = craftX;
        previousY = craftY;
        heading = CURSOR.restHeading;
        lastMotion = now;
        setVisible(true);
      }

      const settle = 1 - Math.pow(1 - CURSOR.craftLerp, frameDelta / 16.67);
      const nextX = safeNumber(pointerState.x, craftX, -CURSOR.coordinateMax, CURSOR.coordinateMax, "pointerX");
      const nextY = safeNumber(pointerState.y, craftY, -CURSOR.coordinateMax, CURSOR.coordinateMax, "pointerY");
      const rawVelocityX = nextX - previousX;
      const rawVelocityY = nextY - previousY;
      const distance = safeNumber(Math.hypot(rawVelocityX, rawVelocityY), 0, 0, CURSOR.coordinateMax, "distance");
      const velocityX = safeNumber(rawVelocityX, 0, -CURSOR.velocityMax, CURSOR.velocityMax, "velocityX");
      const velocityY = safeNumber(rawVelocityY, 0, -CURSOR.velocityMax, CURSOR.velocityMax, "velocityY");
      const speed = safeNumber(
        distance * (1000 / Math.max(1, frameDelta)),
        0,
        0,
        CURSOR.speedMax,
        "speed",
      );

      if (hoverKind === "hover-drag" && pressed) {
        dragAngle = safeNumber(
          dragAngle + velocityX * 0.012,
          dragAngle,
          -Math.PI * 4,
          Math.PI * 4,
          "dragAngle",
        );
      }

      craftX = safeNumber(craftX + (nextX - craftX) * settle, nextX, -CURSOR.coordinateMax, CURSOR.coordinateMax, "craftX");
      craftY = safeNumber(craftY + (nextY - craftY) * settle, nextY, -CURSOR.coordinateMax, CURSOR.coordinateMax, "craftY");

      if (distance > 0.7) {
        const velocityHeading = Math.atan2(velocityY, velocityX);
        const turn = shortestAngle(heading, velocityHeading);
        heading += turn * CURSOR.headingLerp;
        lastMotion = now;
      } else if (now - lastMotion > CURSOR.restDelayMs) {
        heading += shortestAngle(heading, CURSOR.restHeading) * 0.08;
      }

      lateralVelocity = safeNumber(
        lateralVelocity * 0.78 +
          (velocityX * -Math.sin(heading) + velocityY * Math.cos(heading)) * 0.22,
        0,
        -CURSOR.velocityMax,
        CURSOR.velocityMax,
        "lateralVelocity",
      );
      const bankTarget = safeNumber(
        Math.max(
          -CURSOR.bankMax,
          Math.min(CURSOR.bankMax, lateralVelocity / 34),
        ),
        0,
        -CURSOR.bankMax,
        CURSOR.bankMax,
        "bankTarget",
      );
      bank = safeNumber(bank + (bankTarget - bank) * 0.16, bankTarget, -CURSOR.bankMax, CURSOR.bankMax, "bank");

      const stretchTarget = safeNumber(
        1 + Math.min(CURSOR.stretchMax, Math.max(0, speed - 160) / 3200),
        1,
        1,
        1 + CURSOR.stretchMax,
        "stretchTarget",
      );
      stretch = safeNumber(
        stretch + (stretchTarget - stretch) * 0.18,
        stretchTarget,
        1,
        1 + CURSOR.stretchMax,
        "stretch",
      );
      const squash = safeNumber(1 / Math.sqrt(stretch), 1, 0.65, 1.1, "squash");
      heading = safeNumber(heading, CURSOR.restHeading, -1000, 1000, "heading");
      const framePadding = pressed ? CURSOR.lockPressedPadding : CURSOR.lockPadding;

      if (lockedElement && !lockedElement.isConnected) {
        lockedElement = null;
        lockVisible = false;
      }

      if (lockedElement) {
        const rect = lockedElement.getBoundingClientRect();
        const rectLeft = safeNumber(rect.left, 0, -CURSOR.elementBoundsMax, CURSOR.elementBoundsMax * 2, "rect.left");
        const rectTop = safeNumber(rect.top, 0, -CURSOR.elementBoundsMax, CURSOR.elementBoundsMax * 2, "rect.top");
        const rectWidth = safeNumber(rect.width, 0, 0, CURSOR.elementBoundsMax, "rect.width");
        const rectHeight = safeNumber(rect.height, 0, 0, CURSOR.elementBoundsMax, "rect.height");
        frameTargetX = rectLeft - framePadding;
        frameTargetY = rectTop - framePadding;
        frameTargetWidth = rectWidth + framePadding * 2;
        frameTargetHeight = rectHeight + framePadding * 2;
        lockCenterX = rectLeft + rectWidth / 2;
        lockCenterY = rectTop + rectHeight / 2;
        lockVisible = frameTargetWidth > 0 && frameTargetHeight > 0;
      } else {
        frameTargetX = craftX - 8;
        frameTargetY = craftY - 8;
        frameTargetWidth = 16;
        frameTargetHeight = 16;
        lockVisible = false;
      }

      const frameSettle = 1 - Math.pow(1 - CURSOR.lockLerp, frameDelta / 16.67);
      frameX = safeNumber(frameX + (frameTargetX - frameX) * frameSettle, frameTargetX, -CURSOR.elementBoundsMax, CURSOR.elementBoundsMax * 2, "frameX");
      frameY = safeNumber(frameY + (frameTargetY - frameY) * frameSettle, frameTargetY, -CURSOR.elementBoundsMax, CURSOR.elementBoundsMax * 2, "frameY");
      frameWidth = safeNumber(frameWidth + (frameTargetWidth - frameWidth) * frameSettle, frameTargetWidth, 0, CURSOR.elementBoundsMax, "frameWidth");
      frameHeight = safeNumber(frameHeight + (frameTargetHeight - frameHeight) * frameSettle, frameTargetHeight, 0, CURSOR.elementBoundsMax, "frameHeight");
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
          corner.style.transform = `translate3d(${transformNumber(cornerX)}px, ${transformNumber(cornerY)}px, 0)`;
        }
      }

      const magnetTargetX = lockedElement
        ? clampMagnet((lockCenterX - craftX) * CURSOR.magnetScale)
        : 0;
      const magnetTargetY = lockedElement
        ? clampMagnet((lockCenterY - craftY) * CURSOR.magnetScale)
        : 0;
      magnetX = safeNumber(magnetX + (magnetTargetX - magnetX) * CURSOR.magnetLerp, magnetTargetX, -CURSOR.magnetMax, CURSOR.magnetMax, "magnetX");
      magnetY = safeNumber(magnetY + (magnetTargetY - magnetY) * CURSOR.magnetLerp, magnetTargetY, -CURSOR.magnetMax, CURSOR.magnetMax, "magnetY");

      const interactionState = nativeTarget
        ? "native"
        : pressed
          ? hoverKind === "hover-drag"
            ? "hover-drag"
            : "pressed"
          : hoverKind ?? (speed > 140 ? "moving" : "idle");
      commitState(interactionState);

      const idleFor = safeNumber(
        now - (lastInteraction || now),
        0,
        0,
        Number.MAX_SAFE_INTEGER,
        "idleFor",
      );
      const idle = idleFor > CURSOR.idleDelayMs;
      const dimmed = idleFor > CURSOR.dimDelayMs;
      const bob = idle ? Math.sin(frameTime / 430) * 2 : 0;
      const displayX = safeNumber(craftX + magnetX, craftX, -CURSOR.coordinateMax, CURSOR.coordinateMax, "displayX");
      const displayY = safeNumber(craftY + bob + magnetY, craftY, -CURSOR.coordinateMax, CURSOR.coordinateMax, "displayY");
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
      ringScale = safeNumber(
        ringScale + (ringTarget - ringScale) * CURSOR.ringLerp,
        ringTarget,
        CURSOR.ringPressedScale,
        CURSOR.ringHoverScale,
        "ringScale",
      );

      rootEl.style.opacity = dimmed ? String(CURSOR.dimOpacity) : "1";

      const rotation = safeNumber((heading * 180) / Math.PI, 180, -1000, 1000, "rotation");
      const bankDegrees = safeNumber((bank * 180) / Math.PI, 0, -90, 90, "bankDegrees");
      const craftTransform = `translate3d(${transformNumber(displayX)}px, ${transformNumber(displayY)}px, 0) rotate(${rotation.toFixed(3)}deg) skewY(${bankDegrees.toFixed(3)}deg) scale(${stretch.toFixed(4)}, ${squash.toFixed(4)})`;

      craft.style.transform = craftTransform;
      ring.style.transform = `translate3d(${transformNumber(displayX)}px, ${transformNumber(displayY)}px, 0) scale(${ringScale.toFixed(4)})`;
      hotspot.style.transform = `translate3d(${transformNumber(displayX)}px, ${transformNumber(displayY)}px, 0)`;
      labelEl.style.transform = `translate3d(${transformNumber(displayX + 22)}px, ${transformNumber(displayY + 15)}px, 0)`;
      dragArcsEl.style.transform = `translate3d(${transformNumber(displayX)}px, ${transformNumber(displayY)}px, 0) rotate(${safeNumber((dragAngle * 180) / Math.PI, 0, -1000, 1000, "dragRotation").toFixed(3)}deg)`;

      for (let index = 0; index < pingStates.length; index += 1) {
        const ping = pingStates[index];
        const pingElement = pingRefs.current[index];

        if (!pingElement) {
          continue;
        }

        if (!ping.active) {
          pingElement.style.display = "none";
          pingElement.style.opacity = "0";
          continue;
        }

        const age = safeNumber(now - ping.start, CURSOR.pingDurationMs, 0, Number.MAX_SAFE_INTEGER, "pingAge");

        if (age <= 0) {
          pingElement.style.display = "block";
          pingElement.style.opacity = "0";
          continue;
        }

        const ratio = safeNumber(age / CURSOR.pingDurationMs, 1, 0, 1, "pingRatio");

        if (ratio >= 1) {
          ping.active = false;
          pingElement.style.display = "none";
          pingElement.style.opacity = "0";
          continue;
        }

        const eased = 1 - Math.pow(1 - ratio, 3);
        const scale = safeNumber(
          1 + (CURSOR.pingExpandTo - 1) * eased,
          1,
          1,
          CURSOR.pingExpandTo,
          "pingScale",
        );
        pingElement.style.display = "block";
        pingElement.style.opacity = String(safeNumber((1 - ratio) * 0.82, 0, 0, 1, "pingOpacity"));
        pingElement.style.transform = `translate3d(${transformNumber(ping.x)}px, ${transformNumber(ping.y)}px, 0) scale(${scale.toFixed(4)})`;
      }

      const orbitSpeed = !idle && hoverKind && !pressed
        ? CURSOR.hoverOrbitSpeed
        : idle
          ? CURSOR.idleOrbitSpeed
          : CURSOR.orbitSpeed;
      satelliteAngle = (satelliteAngle + (orbitSpeed * frameDelta) / 1000) % (Math.PI * 2);
      orbit.style.transform = `rotate(${(safeNumber(satelliteAngle, 0, -Math.PI * 2, Math.PI * 2, "satelliteAngle") * 180 / Math.PI).toFixed(3)}deg)`;
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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
        <svg
          viewBox="0 0 44 44"
          width={44}
          height={44}
          overflow="hidden"
          focusable="false"
        >
          <path
            className="orbiter-drag-arc"
            d="M 35.5 15.2 A 14 14 0 0 0 12.2 8.9"
            fill="none"
            stroke="var(--accent)"
          />
          <path
            className="orbiter-drag-head"
            d="M 12.2 8.9 L 16.8 9.4 L 14.7 13.5 Z"
            fill="var(--accent)"
            stroke="var(--accent)"
          />
          <path
            className="orbiter-drag-arc"
            d="M 8.5 28.8 A 14 14 0 0 0 31.8 35.1"
            fill="none"
            stroke="var(--accent)"
          />
          <path
            className="orbiter-drag-head"
            d="M 31.8 35.1 L 27.2 34.6 L 29.3 30.5 Z"
            fill="var(--accent)"
            stroke="var(--accent)"
          />
        </svg>
      </div>
      <div ref={craftRef} className="orbiter-craft">
        <svg
          width={CURSOR.craftSize}
          height={CURSOR.craftSize}
          viewBox="0 0 28 28"
          overflow="hidden"
          focusable="false"
        >
          <path
            className="orbiter-flame orbiter-flame-full"
            d="M 5.2 14 L 0.8 11.4 L 2.6 14 L 0.8 16.6 Z"
            fill="var(--primary)"
          />
          <path
            className="orbiter-flame orbiter-flame-lite"
            d="M 5.2 14 L 1.8 12.1 L 3.2 14 L 1.8 15.9 Z"
            fill="var(--primary)"
          />
          <path
            className="orbiter-body"
            d="M 25 14 L 9.2 5.8 L 12.6 14 L 9.2 22.2 Z"
            fill="var(--foreground)"
            fillOpacity="0.18"
            stroke="var(--foreground)"
          />
          <path
            className="orbiter-fin"
            d="M 10.6 8.4 L 5.8 3.8 L 12 10.8 Z"
            fill="var(--primary)"
            fillOpacity="0.22"
            stroke="var(--primary)"
          />
          <path
            className="orbiter-fin"
            d="M 10.6 19.6 L 5.8 24.2 L 12 17.2 Z"
            fill="var(--primary)"
            fillOpacity="0.22"
            stroke="var(--primary)"
          />
          <circle
            className="orbiter-canopy"
            cx="15.7"
            cy="14"
            r="2.15"
            fill="var(--accent)"
          />
          <circle
            className="orbiter-nozzle"
            cx="5.2"
            cy="14"
            r="1.7"
            fill="var(--primary)"
          />
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
