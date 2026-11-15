"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  MathUtils,
  type Group,
} from "three";
import type { EffectsMode } from "../effects/effects-store";
import { getScrollState, subscribeScroll } from "../effects/scroll-store";
import { Nebula } from "./Nebula";
import { Starfield } from "./Starfield";
import { Spaceport } from "./Spaceport";
import { DistantHorizon } from "./DistantHorizon";
import { PadHud } from "./PadHud";
import { Globe } from "./Globe";

const REDUCED_FPS = 30;
const FULL_FPS = 60;
const PAST_HERO_PROGRESS = 0.65;

function ContextGuard({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;

    function handleLost(event: Event) {
      event.preventDefault();
      onLost();
    }

    canvas.addEventListener("webglcontextlost", handleLost);
    return () => canvas.removeEventListener("webglcontextlost", handleLost);
  }, [gl, onLost]);

  return null;
}

function ArrivalGlobe({
  lite,
}: {
  lite: boolean;
}) {
  const ref = useRef<Group>(null);

  useFrame(() => {
    const group = ref.current;

    if (!group) {
      return;
    }

    const progress = getScrollState().progress;
    const lift = MathUtils.clamp((progress - 0.34) / 0.4, 0, 1);
    const ease = 1 - Math.pow(1 - lift, 3);

    group.visible = ease > 0.02;
    group.position.y = -7.2 + ease * 4.6;
    group.rotation.y = ease * 0.6;
  });

  return (
    <group ref={ref} position={[2.4, -7.2, -6.2]} scale={1.7} visible={false}>
      <Globe lite={lite} />
    </group>
  );
}

function FrameDriver({
  lite,
  home,
  pastHero,
}: {
  lite: boolean;
  home: boolean;
  pastHero: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const cap = REDUCED_FPS;
    const fps = lite || !home || pastHero ? cap : FULL_FPS;
    const interval = Math.max(16, Math.floor(1000 / fps));

    function invalidateIfVisible() {
      if (!document.hidden) {
        invalidate();
      }
    }

    invalidate();
    const intervalId = window.setInterval(invalidateIfVisible, interval);
    document.addEventListener("visibilitychange", invalidateIfVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", invalidateIfVisible);
    };
  }, [invalidate, lite, home, pastHero]);

  return null;
}

export default function SpaceScene({ mode }: { mode: EffectsMode }) {
  const pathname = usePathname();
  const [lost, setLost] = useState(false);
  const [canvasOffscreen, setCanvasOffscreen] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);
  const subscribePastHero = useCallback(
    (onStoreChange: () => void) => subscribeScroll(() => onStoreChange()),
    [],
  );
  const getPastHero = useCallback(
    () => getScrollState().progress > PAST_HERO_PROGRESS,
    [],
  );
  const pastHero = useSyncExternalStore(
    subscribePastHero,
    getPastHero,
    () => false,
  );
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const lite = mode === "lite";
  const home = pathname === "/";
  const interactive = home && finePointer;
  const suspended = canvasOffscreen || lost;

  useEffect(() => {
    const node = sceneRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setCanvasOffscreen(!entry.isIntersecting);
        }
      },
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (lost) {
    return null;
  }

  return (
    <div ref={sceneRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        frameloop="demand"
        camera={{ position: [0, 1.55, 9.6], fov: 42, near: 0.1, far: 80 }}
        dpr={[1, lite ? 1 : 1.5]}
        gl={{
          alpha: true,
          antialias: !lite,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ContextGuard onLost={() => setLost(true)} />
        {!suspended ? (
          <FrameDriver lite={lite} home={home} pastHero={pastHero} />
        ) : null}
        <Nebula />
        <Starfield lite={lite} />
        {home ? (
          <Spaceport lite={lite} interactive={interactive} />
        ) : (
          <DistantHorizon />
        )}
        {home ? <ArrivalGlobe lite={lite} /> : null}
      </Canvas>
      {home ? <PadHud enabled={interactive} /> : null}
    </div>
  );
}
