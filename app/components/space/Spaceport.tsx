"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  Color,
  MathUtils,
  Object3D,
  Vector3,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
  type Points,
  type ShaderMaterial,
} from "three";
import { useRouter } from "next/navigation";
import { getPointer } from "../effects/pointer-store";
import { getScrollState } from "../effects/scroll-store";
import { setPadHover, clearPadHover } from "./pad-store";
import { createRandom } from "./random";

const HOVER_RADIUS = 64;

function HorizonGlow() {
  const materialRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 } }),
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 2.4, -9.2]} renderOrder={-10}>
      <planeGeometry args={[30, 11]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float horizon = 1.0 - clamp(vUv.y * 1.25, 0.0, 1.0);
            float ember = pow(horizon, 3.2);
            vec3 emberColor = mix(vec3(0.05, 0.06, 0.1), vec3(1.0, 0.52, 0.22), ember);
            float glow = smoothstep(0.0, 0.85, vUv.y) * (1.0 - vUv.y) * 0.6;
            vec3 color = emberColor + vec3(0.35, 0.12, 0.03) * glow;
            float alpha = clamp(horizon * 0.92 + glow, 0.0, 1.0);
            gl_FragColor = vec4(color, alpha);
          }
        `}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function GroundGrid() {
  const points = useMemo(() => {
    const extent = 24;
    const lines: number[] = [];
    const step = 1.6;

    for (let x = -extent; x <= extent; x += step) {
      lines.push(x, 0, -extent, x, 0, extent);
    }
    for (let z = -extent; z <= extent; z += step) {
      lines.push(-extent, 0, z, extent, 0, z);
    }

    return new Float32Array(lines);
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial color="#060a12" />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1b2736" transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

function GroundRing() {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const colors = useMemo(
    () => Array.from({ length: 48 }, () => new Color("#223349")),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    for (let index = 0; index < 48; index += 1) {
      const angle = (index / 48) * Math.PI * 2;
      const radius = 4.35;
      dummy.position.set(
        Math.cos(angle) * radius,
        0.02,
        Math.sin(angle) * radius * 0.62,
      );
      dummy.rotation.set(0, -angle, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const lit = Math.floor((clock.elapsedTime * 6) % 48);

    for (let index = 0; index < 48; index += 1) {
      const active = index === lit || index === (lit + 1) % 48;
      const color = colors[index];
      color.set(active ? "#ffb066" : "#223349");
      mesh.setColorAt(index, color);
    }

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 48]}>
      <boxGeometry args={[0.16, 0.035, 0.04]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function RocketPlume({
  lift,
  lite,
  offset,
}: {
  lift: React.MutableRefObject<number>;
  lite: boolean;
  offset?: number;
}) {
  const pointsRef = useRef<Points>(null);
  const count = lite ? 110 : 260;
  const velocities = useMemo(() => {
    const random = createRandom(0x726f636b + count);

    return Array.from({ length: count }, () => ({
      x: (random() - 0.5) * 0.9,
      y: -(1.4 + random() * 1.6),
      z: (random() - 0.5) * 0.9,
      phase: random() * Math.PI * 2,
    }));
  }, [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    const points = pointsRef.current;

    if (!points) {
      return;
    }

    const currentLift = lift.current;
    points.visible = currentLift > 0.015;

    if (!points.visible) {
      return;
    }

    const time = state.clock.elapsedTime;
    const attribute = points.geometry.getAttribute("position") as BufferAttribute;

    for (let index = 0; index < count; index += 1) {
      const velocity = velocities[index];
      const life = 0.9 + Math.sin(time * 6 + velocity.phase) * 0.18;
      const drift = ((time * 1.4 + velocity.phase) % 1) * life;
      attribute.setXYZ(
        index,
        velocity.x * drift,
        velocity.y * drift * (1.35 - currentLift),
        velocity.z * drift,
      );
    }

    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false} position={[0, offset ?? 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={lite ? 0.085 : 0.11}
        color="#ffb066"
        transparent
        opacity={lite ? 0.7 : 0.95}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function GantryTower({
  position,
  height,
}: {
  position: [number, number, number];
  height: number;
}) {
  const levels = Math.max(3, Math.floor(height / 0.34));

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.055, height, 0.055]} />
        <meshStandardMaterial color="#202b3a" roughness={0.85} metalness={0.2} />
      </mesh>
      {Array.from({ length: levels }, (_, index) => {
        const y = 0.18 + index * 0.34;
        return (
          <mesh key={index} position={[0, y, 0]} rotation={[0, 0, index % 2 ? 0.28 : -0.28]}>
            <boxGeometry args={[0.34, 0.016, 0.016]} />
            <meshStandardMaterial color="#2c3a4e" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function Rocket({
  lite,
  scale,
  accent,
}: {
  lite: boolean;
  scale: number;
  accent: string;
}) {
  const bodyRadius = 0.19 * scale;
  const bodyHeight = 1.05 * scale;
  const noseHeight = 0.34 * scale;

  return (
    <group>
      <mesh position={[0, bodyHeight / 2 + 0.08, 0]}>
        <cylinderGeometry args={[bodyRadius, bodyRadius * 1.08, bodyHeight, lite ? 12 : 20]} />
        <meshStandardMaterial color="#dde5ef" roughness={0.42} metalness={0.18} />
      </mesh>
      <mesh position={[0, bodyHeight + noseHeight / 2 + 0.08, 0]}>
        <coneGeometry args={[bodyRadius, noseHeight, lite ? 12 : 20]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * bodyRadius * 0.95, 0.16, 0]} rotation={[0, 0, side * 0.5]}>
          <boxGeometry args={[0.05 * scale, 0.24 * scale, 0.05 * scale]} />
          <meshStandardMaterial color="#aab4c4" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export function Spaceport({
  lite,
  interactive,
}: {
  lite: boolean;
  interactive: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const router = useRouter();
  const launchLift = useRef(0);
  const hovered = useRef<"beginner" | "advanced" | null>(null);
  const rocketA = useRef<Group>(null);
  const rocketB = useRef<Group>(null);
  const armA = useRef<Group>(null);
  const armB = useRef<Group>(null);
  const lightA = useRef<MeshBasicMaterial>(null);
  const lightB = useRef<MeshBasicMaterial>(null);
  const screenA = useMemo(() => new Vector3(), []);
  const screenB = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const scroll = getScrollState();
    const progress = scroll.progress;
    const lift = MathUtils.clamp((progress - 0.05) / 0.5, 0, 1);
    const ease = 1 - Math.pow(1 - lift, 3);
    launchLift.current += (ease - launchLift.current) * Math.min(1, delta * 5);
    const rocket = launchLift.current;

    const pointer = getPointer();
    const driftX = pointer.active ? pointer.nx * 0.32 : 0;
    const driftY = pointer.active ? -pointer.ny * 0.22 : 0;

    camera.position.set(driftX * 0.6, 1.55 + rocket * 6.6 + driftY * 0.3, 9.6 - rocket * 1.9);
    camera.lookAt(0, 1.05 + rocket * 3.6, -4.6);

    if (rocketA.current) {
      rocketA.current.position.y = 0.12 + rocket * 3.4;
    }
    if (rocketB.current) {
      rocketB.current.position.y = 0.13 + rocket * 5.1;
    }

    if (armA.current) {
      const swing = hovered.current === "beginner" ? -0.42 : rocket > 0.02 ? -0.9 : 0;
      armA.current.rotation.z += (swing - armA.current.rotation.z) * Math.min(1, delta * 7);
    }
    if (armB.current) {
      const swing = hovered.current === "advanced" ? -0.42 : rocket > 0.02 ? -0.9 : 0;
      armB.current.rotation.z += (swing - armB.current.rotation.z) * Math.min(1, delta * 7);
    }

    if (lightA.current) {
      lightA.current.color.set(hovered.current === "beginner" || rocket > 0.05 ? "#58d68d" : "#ff5a5a");
    }
    if (lightB.current) {
      lightB.current.color.set(hovered.current === "advanced" || rocket > 0.05 ? "#58d68d" : "#ff5a5a");
    }

    if (!interactive && hovered.current) {
      clearPadHover(hovered.current);
      hovered.current = null;
      return;
    }

    if (interactive && rocketA.current && rocketB.current) {
      rocketA.current.getWorldPosition(screenA);
      rocketB.current.getWorldPosition(screenB);
      screenA.project(state.camera);
      screenB.project(state.camera);

      const width = state.size.width;
      const height = state.size.height;
      const ax = (screenA.x * 0.5 + 0.5) * width;
      const ay = (-screenA.y * 0.5 + 0.5) * height;
      const bx = (screenB.x * 0.5 + 0.5) * width;
      const by = (-screenB.y * 0.5 + 0.5) * height;
      const dx = pointer.x - ax;
      const dy = pointer.y - ay;
      const ex = pointer.x - bx;
      const ey = pointer.y - by;

      let hit: "beginner" | "advanced" | null = null;
      let hitX = 0;
      let hitY = 0;

      if (dx * dx + dy * dy <= HOVER_RADIUS * HOVER_RADIUS) {
        hit = "beginner";
        hitX = ax;
        hitY = ay;
      } else if (ex * ex + ey * ey <= HOVER_RADIUS * HOVER_RADIUS) {
        hit = "advanced";
        hitX = bx;
        hitY = by;
      }

      if (hit) {
        hovered.current = hit;
        setPadHover({
          id: hit,
          pad: hit === "beginner" ? "PAD 01 / BEGINNER" : "PAD 02 / ADVANCED",
          x: MathUtils.clamp(hitX, 96, Math.max(96, width - 96)),
          y: MathUtils.clamp(hitY, 72, Math.max(72, height - 72)),
        });
      } else if (hovered.current) {
        clearPadHover(hovered.current);
        hovered.current = null;
      }
    }
  });

  return (
    <group>
      <GroundGrid />
      <HorizonGlow />
      <GroundRing />

      <group position={[-1.9, 0, -0.7]} scale={0.76}>
        <GantryTower position={[-0.42, 0.04, -0.12]} height={1.55} />
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 0.09, 22]} />
          <meshStandardMaterial color="#171f2c" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.012, 0]}>
          <boxGeometry args={[1.32, 0.032, 1.32]} />
          <meshStandardMaterial color="#101722" roughness={0.95} />
        </mesh>
        <group ref={armA} position={[-0.42, 1.18, -0.12]}>
          <mesh position={[0.28, 0, 0]}>
            <boxGeometry args={[0.56, 0.024, 0.024]} />
            <meshStandardMaterial color="#33415a" roughness={0.75} />
          </mesh>
        </group>
        <mesh position={[-0.62, 1.4, -0.12]}>
          <sphereGeometry args={[0.026, 10, 10]} />
          <meshBasicMaterial ref={lightA} color="#ff5a5a" toneMapped={false} />
        </mesh>
        <group ref={rocketA} position={[0, 0.12, 0]}>
          <Rocket lite={lite} scale={0.88} accent="#6fe3f2" />
          <RocketPlume lift={launchLift} lite={lite} offset={-0.1} />
        </group>
        <mesh visible={false} position={[0, 0.9, 0]} onClick={() => router.push("/tracks#beginner")}>
          <boxGeometry args={[1.5, 2, 1.5]} />
        </mesh>
      </group>

      <group position={[2.15, 0, -1.25]} scale={1.22}>
        <GantryTower position={[-0.48, 0.04, -0.14]} height={2.15} />
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.72, 0.84, 0.11, 26]} />
          <meshStandardMaterial color="#171f2c" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.014, 0]}>
          <boxGeometry args={[1.62, 0.036, 1.62]} />
          <meshStandardMaterial color="#101722" roughness={0.95} />
        </mesh>
        <group ref={armB} position={[-0.48, 1.62, -0.14]}>
          <mesh position={[0.33, 0, 0]}>
            <boxGeometry args={[0.68, 0.026, 0.026]} />
            <meshStandardMaterial color="#33415a" roughness={0.75} />
          </mesh>
        </group>
        <mesh position={[-0.7, 1.9, -0.14]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshBasicMaterial ref={lightB} color="#ff5a5a" toneMapped={false} />
        </mesh>
        <group ref={rocketB} position={[0, 0.13, 0]}>
          <Rocket lite={lite} scale={1.28} accent="#ff8a3d" />
          <RocketPlume lift={launchLift} lite={lite} offset={-0.12} />
        </group>
        <mesh visible={false} position={[0, 1.15, 0]} onClick={() => router.push("/tracks#advanced")}>
          <boxGeometry args={[1.7, 2.5, 1.7]} />
        </mesh>
      </group>
    </group>
  );
}
