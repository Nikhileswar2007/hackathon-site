"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useEffects } from "./effects-provider";
import { useMediaQuery } from "./use-media-query";
import { getModeSnapshot } from "./effects-store";

const OrbiterCursor = dynamic(
  () => import("./OrbiterCursor").then((mod) => mod.OrbiterCursor),
  { ssr: false },
);

const CursorTrail = dynamic(
  () => import("./CursorTrail").then((mod) => mod.CursorTrail),
  { ssr: false },
);

const Intro = dynamic(() => import("./Intro").then((mod) => mod.Intro), {
  ssr: false,
});

const PerfPanel =
  process.env.NODE_ENV === "production"
    ? null
    : dynamic(
        () => import("./PerfPanel").then((mod) => mod.PerfPanel),
        { ssr: false },
      );

const LEGACY_INTRO_SESSION_KEY = "kakshya:intro-seen";
const INTRO_SESSION_KEY = "kosmodrome:intro-seen";

function subscribeNothing() {
  return () => {};
}

function getIntroEligibleSnapshot() {
  if (getModeSnapshot() === "off") {
    return false;
  }

  try {
    return (
      !window.sessionStorage.getItem(INTRO_SESSION_KEY) &&
      !window.sessionStorage.getItem(LEGACY_INTRO_SESSION_KEY)
    );
  } catch {
    return true;
  }
}

function getServerIntroEligibleSnapshot() {
  return false;
}

export function ClientChrome() {
  const { mode } = useEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const introEligible = useSyncExternalStore(
    subscribeNothing,
    getIntroEligibleSnapshot,
    getServerIntroEligibleSnapshot,
  );

  const fxOn = mode !== "off";

  return (
    <>
      {fxOn ? <OrbiterCursor /> : null}
      {fxOn && finePointer ? <CursorTrail /> : null}
      {introEligible ? <Intro /> : null}
      {PerfPanel ? <PerfPanel /> : null}
    </>
  );
}
