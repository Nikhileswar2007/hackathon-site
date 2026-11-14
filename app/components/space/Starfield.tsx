"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getPointer } from "../effects/pointer-store";
import { createRandom } from "./random";
import { STAR_FRAGMENT, STAR_VERTEX } from "./shaders";

function starColor(random: number) {
  if (random < 0.6) {
    return new THREE.Color("#cfe0ff");
  }
  if (random < 0.79) {
    return new THREE.Color("#9db9d9");
  }
  if (random < 0.91) {
    return new THREE.Color("#8fe8f4");
  }
  if (random < 0.97) {
    return new THREE.Color("#ffb066");
  }
  return new THREE.Color("#ffffff");
}

export function Starfield({ lite }: { lite: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((state) => state.viewport.dpr);
  const count = lite ? 760 : 2800;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    }),
    [dpr],
  );

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const random = createRandom(0x6b617368 + count);

    for (let index = 0; index < count; index += 1) {
      const radius = 9.5 + random() * 13;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const sinPhi = Math.sin(phi);

      positions[index * 3] = Math.cos(theta) * sinPhi * radius;
      positions[index * 3 + 1] = Math.cos(phi) * radius;
      positions[index * 3 + 2] = Math.sin(theta) * sinPhi * radius;

      const color = starColor(random());
      color.multiplyScalar(0.65 + random() * 0.45);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;

      sizes[index] = 0.45 + Math.pow(random(), 2.4) * 1.65;
      phases[index] = random() * 10;
    }

    return { positions, colors, sizes, phases };
  }, [count]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    const pointer = getPointer();
    const step = Math.min(1, delta * 1.6);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uPixelRatio.value = dpr;
    }

    if (!points) {
      return;
    }

    const targetX = pointer.active ? pointer.nx * 0.55 : 0;
    const targetY = pointer.active ? -pointer.ny * 0.35 : 0;

    points.position.x += (targetX - points.position.x) * step;
    points.position.y += (targetY - points.position.y) * step;
    points.rotation.y += delta * (lite ? 0.0014 : 0.0022);
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={STAR_VERTEX}
        fragmentShader={STAR_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
