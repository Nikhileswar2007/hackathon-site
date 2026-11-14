"use client";

import { useFrame } from "@react-three/fiber";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

const TICK_COUNT = 48;

export function OrbitRing({ lite }: { lite: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ticksRef = useRef<THREE.InstancedMesh>(null);

  const tickGeometry = useMemo(
    () => new THREE.BoxGeometry(0.14, 0.013, 0.022),
    [],
  );
  const tickMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffb066"),
        transparent: true,
        opacity: 0.38,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      tickGeometry.dispose();
      tickMaterial.dispose();
    },
    [tickGeometry, tickMaterial],
  );

  useLayoutEffect(() => {
    const ticks = ticksRef.current;
    if (!ticks) {
      return;
    }

    const dummy = new THREE.Object3D();

    for (let index = 0; index < TICK_COUNT; index += 1) {
      const angle = (index / TICK_COUNT) * Math.PI * 2;
      const major = index % 6 === 0;

      dummy.position.set(
        Math.cos(angle) * 2.32,
        0,
        Math.sin(angle) * 2.32,
      );
      dummy.rotation.set(0, -angle, 0);
      dummy.scale.set(major ? 1.75 : 1, 1, major ? 1.4 : 1);
      dummy.updateMatrix();
      ticks.setMatrixAt(index, dummy.matrix);
    }

    ticks.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.018;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.44, 0, 0.1]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.305, lite ? 96 : 180]} />
        <meshBasicMaterial
          color="#ff9e45"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <instancedMesh
        ref={ticksRef}
        args={[tickGeometry, tickMaterial, TICK_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
}
