"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { getPointer } from "../effects/pointer-store";
import { getScrollState } from "../effects/scroll-store";
import { Globe } from "./Globe";
import { OrbitRing } from "./OrbitRing";
import { SatelliteRings } from "./SatelliteRings";

export function SpaceSystem({
  lite,
  home,
  interactive,
}: {
  lite: boolean;
  home: boolean;
  interactive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lastScroll = useRef(0);
  const size = useThree((state) => state.size);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const scroll = getScrollState();
    const pointer = getPointer();
    const velocity = scroll.y - lastScroll.current;
    lastScroll.current = scroll.y;

    const desktop = size.width >= 1024;
    const compact = size.width < 640;
    const heroWeight = interactive
      ? Math.max(0, 1 - scroll.progress / 0.55)
      : 0;
    const drift = pointer.active ? pointer.nx * 0.07 * heroWeight : 0;
    const lift = pointer.active ? -pointer.ny * 0.05 * heroWeight : 0;

    const targetX = home
      ? (desktop ? 1.42 : 0) + drift
      : desktop
        ? 2.15
        : 0.65;
    const targetY = home
      ? (compact ? 0.24 : 0.08) - scroll.progress * 2.4 + lift
      : -0.15 - scroll.progress * 0.7;
    const targetZ = home
      ? -scroll.progress * 1.5
      : -1.05 - scroll.progress * 0.4;
    const targetScale = home
      ? compact
        ? 0.6
        : desktop
          ? 0.8
          : 0.72
      : compact
        ? 0.42
        : desktop
          ? 0.56
          : 0.5;

    const settle = Math.min(1, delta * 2.4);

    group.position.x += (targetX - group.position.x) * settle;
    group.position.y += (targetY - group.position.y) * settle;
    group.position.z += (targetZ - group.position.z) * settle;

    const scale = group.scale.x + (targetScale - group.scale.x) * settle;
    group.scale.setScalar(scale);

    const tiltX = pointer.active ? pointer.ny * 0.05 * heroWeight : 0;
    const tiltZ = pointer.active ? -pointer.nx * 0.032 * heroWeight : 0;

    group.rotation.x += (tiltX - group.rotation.x) * settle;
    group.rotation.z += (tiltZ - group.rotation.z) * settle;
    group.rotation.y +=
      delta * (home ? 0.016 : 0.01) +
      THREE.MathUtils.clamp(velocity * 0.00045, -0.018, 0.018);
  });

  return (
    <group ref={groupRef}>
      <Globe lite={lite} />
      <OrbitRing lite={lite} />
      <SatelliteRings lite={lite} interactive={interactive} />
    </group>
  );
}
