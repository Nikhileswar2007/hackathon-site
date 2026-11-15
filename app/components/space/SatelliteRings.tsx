"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { getPointer } from "../effects/pointer-store";
import { clearSatelliteHover, setSatelliteHover } from "./satellite-store";

const HOVER_RADIUS = 26;

function Satellite({
  id,
  name,
  orbit,
  radius,
  color,
  speed,
  phase,
  size,
  interactive,
}: {
  id: string;
  name: string;
  orbit: string;
  radius: number;
  color: string;
  speed: number;
  phase: number;
  size: number;
  interactive: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.MeshBasicMaterial>(null);
  const nearRef = useRef(false);
  const lastReportRef = useRef(0);
  const worldRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const angle = state.clock.elapsedTime * speed + phase;
    group.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    );

    let near = false;

    if (interactive) {
      const pointer = getPointer();

      if (pointer.active) {
        group.updateWorldMatrix(true, false);
        const world = worldRef.current;
        group.getWorldPosition(world);
        world.project(state.camera);

        const width = state.size.width;
        const height = state.size.height;
        const x = (world.x * 0.5 + 0.5) * width;
        const y = (-world.y * 0.5 + 0.5) * height;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const onScreen = Math.abs(world.z) < 1;

        near = onScreen && dx * dx + dy * dy <= HOVER_RADIUS * HOVER_RADIUS;

        if (near) {
          const now = performance.now();

          if (!nearRef.current || now - lastReportRef.current > 80) {
            setSatelliteHover({
              id,
              name,
              orbit,
              x: THREE.MathUtils.clamp(x, 96, Math.max(96, width - 96)),
              y: THREE.MathUtils.clamp(y, 72, Math.max(72, height - 72)),
            });
            lastReportRef.current = now;
          }
        }
      }
    }

    if (!near && nearRef.current) {
      clearSatelliteHover(id);
    }

    nearRef.current = near;

    if (haloRef.current) {
      haloRef.current.opacity = THREE.MathUtils.damp(
        haloRef.current.opacity,
        near ? 0.3 : 0.1,
        7,
        delta,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[size, 14, 14]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[size * 2.2, 12, 12]} />
        <meshBasicMaterial
          ref={haloRef}
          color={color}
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function OrbitLine({
  radius,
  color,
  lite,
}: {
  radius: number;
  color: string;
  lite: boolean;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius, radius + 0.006, lite ? 80 : 150]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export function SatelliteRings({
  lite,
  interactive,
}: {
  lite: boolean;
  interactive: boolean;
}) {
  return (
    <group>
      <group rotation={[0.82, 0.15, 0.32]}>
        <OrbitLine radius={1.96} color="#6fe3f2" lite={lite} />
        <Satellite
          id="Kosmodrome-01"
          name="Kosmodrome-01"
          orbit="Scout orbit"
          radius={1.96}
          color="#9ef3ff"
          speed={0.12}
          phase={0.8}
          size={0.034}
          interactive={interactive}
        />
      </group>

      <group rotation={[-0.58, 0.35, 0.16]}>
        <OrbitLine radius={2.92} color="#ffb066" lite={lite} />
        <Satellite
          id="Kosmodrome-02"
          name="Kosmodrome-02"
          orbit="Relay orbit"
          radius={2.92}
          color="#ffd1a1"
          speed={-0.075}
          phase={2.4}
          size={0.045}
          interactive={interactive}
        />
        <Satellite
          id="Kosmodrome-03"
          name="Kosmodrome-03"
          orbit="Beacon orbit"
          radius={2.92}
          color="#9ef3ff"
          speed={-0.075}
          phase={2.4 + Math.PI}
          size={0.03}
          interactive={interactive}
        />
      </group>
    </group>
  );
}
