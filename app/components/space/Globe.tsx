"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { createRandom } from "./random";
import {
  ATMOSPHERE_FRAGMENT,
  ATMOSPHERE_VERTEX,
  DOT_FRAGMENT,
  DOT_VERTEX,
  EARTH_FRAGMENT,
  EARTH_VERTEX,
} from "./shaders";

const AXIAL_TILT = THREE.MathUtils.degToRad(23.4);

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const random = createRandom(0x6f726269 + count);

  const palette = [
    new THREE.Color("#d9e8ff"),
    new THREE.Color("#8fe8f4"),
    new THREE.Color("#ffb066"),
    new THREE.Color("#7fa8d8"),
  ];

  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * index;
    const radiusJitter = radius + random() * 0.012;

    positions[index * 3] = Math.cos(theta) * radial * radiusJitter;
    positions[index * 3 + 1] = y * radiusJitter;
    positions[index * 3 + 2] = Math.sin(theta) * radial * radiusJitter;

    const roll = random();
    const color =
      roll < 0.68
        ? palette[0]
        : roll < 0.86
          ? palette[1]
          : roll < 0.96
            ? palette[2]
            : palette[3];

    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;

    const accent = roll >= 0.86 ? 1.65 : 1;
    sizes[index] = (6.5 + random() * 5.5) * accent;
  }

  return { positions, colors, sizes };
}

function DottedShell({ lite }: { lite: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((state) => state.viewport.dpr);
  const data = useMemo(
    () => fibonacciSphere(lite ? 360 : 920, 1.672),
    [lite],
  );
  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: dpr },
    }),
    [dpr],
  );

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uPixelRatio.value = dpr;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
        <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={DOT_VERTEX}
        fragmentShader={DOT_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

export function Globe({ lite }: { lite: boolean }) {
  const spinRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.ShaderMaterial>(null);
  const atmosphereRef = useRef<THREE.ShaderMaterial>(null);

  const earthUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOcean: { value: new THREE.Color("#050b16") },
      uLand: { value: new THREE.Color("#0b2024") },
      uLight: { value: new THREE.Color("#ff9e45") },
    }),
    [],
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y +=
        delta * (lite ? 0.032 : 0.052);
    }

    if (surfaceRef.current) {
      surfaceRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group rotation={[0, 0, AXIAL_TILT]}>
      <group ref={spinRef}>
        <mesh>
          <sphereGeometry
            args={[1.65, lite ? 40 : 72, lite ? 40 : 72]}
          />
          <shaderMaterial
            ref={surfaceRef}
            uniforms={earthUniforms}
            vertexShader={EARTH_VERTEX}
            fragmentShader={EARTH_FRAGMENT}
            toneMapped={false}
          />
        </mesh>
        <DottedShell lite={lite} />
      </group>

      <mesh>
        <sphereGeometry args={[1.78, 48, 48]} />
        <shaderMaterial
          ref={atmosphereRef}
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
