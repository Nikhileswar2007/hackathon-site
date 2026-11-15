"use client";

export function DistantHorizon() {
  return (
    <mesh position={[0, 1.1, -10]}>
      <planeGeometry args={[60, 20]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          void main() {
            float ember = pow(1.0 - vUv.y, 6.0) * 0.32;
            float band = smoothstep(0.02, 0.12, vUv.y) * (1.0 - smoothstep(0.14, 0.3, vUv.y)) * 0.05;
            vec3 color = vec3(0.03, 0.04, 0.07) + vec3(0.8, 0.36, 0.12) * ember + vec3(0.36, 0.55, 0.7) * band;
            gl_FragColor = vec4(color, 1.0);
          }
        `}
        depthWrite={false}
      />
    </mesh>
  );
}
