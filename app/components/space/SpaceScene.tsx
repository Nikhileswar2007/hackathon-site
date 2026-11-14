"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { EffectsMode } from "../effects/effects-store";
import { Nebula } from "./Nebula";
import { SatelliteHud } from "./SatelliteHud";
import { resetSatelliteHud } from "./satellite-store";
import { SpaceSystem } from "./SpaceSystem";
import { Starfield } from "./Starfield";

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

export default function SpaceScene({ mode }: { mode: EffectsMode }) {
  const pathname = usePathname();
  const [lost, setLost] = useState(false);
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const lite = mode === "lite";
  const home = pathname === "/";
  const interactive = home && finePointer;

  useEffect(() => {
    resetSatelliteHud();
  }, [pathname]);

  if (lost) {
    return null;
  }

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 42, near: 0.1, far: 60 }}
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
        <Nebula />
        <Starfield lite={lite} />
        <SpaceSystem lite={lite} home={home} interactive={interactive} />
      </Canvas>
      <SatelliteHud enabled={interactive} />
    </>
  );
}
