"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { getPointer } from "../effects/pointer-store";
import { getScrollState } from "../effects/scroll-store";
import { Globe } from "./Globe";
import { OrbitRing } from "./OrbitRing";
import { SatelliteRings } from "./SatelliteRings";

export function SpaceSystem({ lite }: { lite: boolean }) {
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
    const drift = pointer.active ? pointer.nx * 0.07 : 0;
    const lift = pointer.active ? -pointer.ny * 0.05 : 0;

    const targetX = (desktop ? 1.42 : 0) + drift;
    const targetY = (compact ? 0.24 : 0.08) - scroll.progress * 2.4 + lift;
    const targetZ = -scroll.progress * 1.5;
    const targetScale = compact ? 0.6 : desktop ? 0.8 : 0.72;

    const settle = Math.min(1, delta * 2.4);

    group.position.x += (targetX - group.position.x) * settle;
    group.position.y += (targetY - group.position.y) * settle;
    group.position.z += (targetZ - group.position.z) * settle;

    const scale = group.scale.x + (targetScale - group.scale.x) * settle;
    group.scale.setScalar(scale);

    const tiltX = pointer.active ? pointer.ny * 0.05 : 0;
    const tiltZ = pointer.active ? -pointer.nx * 0.032 : 0;

    group.rotation.x += (tiltX - group.rotation.x) * settle;
    group.rotation.z += (tiltZ - group.rotation.z) * settle;
    group.rotation.y +=
      delta * 0.016 +
      THREE.MathUtils.clamp(velocity * 0.00045, -0.018, 0.018);
  });

  return (
    <group ref={groupRef}>
      <Globe lite={lite} />
      <OrbitRing lite={lite} />
      <SatelliteRings lite={lite} />
    </group>
  );
}
