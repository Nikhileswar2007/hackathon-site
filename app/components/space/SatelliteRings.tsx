"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Satellite({
  radius,
  color,
  speed,
  phase,
  size,
}: {
  radius: number;
  color: string;
  speed: number;
  phase: number;
  size: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const angle = state.clock.elapsedTime * speed + phase;
    groupRef.current.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    );
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

export function SatelliteRings({ lite }: { lite: boolean }) {
  return (
    <group>
      <group rotation={[0.82, 0.15, 0.32]}>
        <OrbitLine radius={1.96} color="#6fe3f2" lite={lite} />
        <Satellite
          radius={1.96}
          color="#9ef3ff"
          speed={0.12}
          phase={0.8}
          size={0.034}
        />
      </group>

      <group rotation={[-0.58, 0.35, 0.16]}>
        <OrbitLine radius={2.92} color="#ffb066" lite={lite} />
        <Satellite
          radius={2.92}
          color="#ffd1a1"
          speed={-0.075}
          phase={2.4}
          size={0.045}
        />
        <Satellite
          radius={2.92}
          color="#9ef3ff"
          speed={-0.075}
          phase={2.4 + Math.PI}
          size={0.03}
        />
      </group>
    </group>
  );
}
