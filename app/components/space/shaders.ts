export const GLSL_NOISE = `
float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);

  return mix(nxy0, nxy1, f.z);
}

float fbm3(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int index = 0; index < 4; index++) {
    value += amplitude * noise3(p);
    p = p * 2.03 + vec3(13.7, 7.3, 3.1);
    amplitude *= 0.5;
  }
  return value;
}
`;

export const EARTH_VERTEX = `
varying vec3 vObjectPosition;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  vObjectPosition = position;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const EARTH_FRAGMENT = `
uniform float uTime;
uniform vec3 uOcean;
uniform vec3 uLand;
uniform vec3 uLight;

varying vec3 vObjectPosition;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

${GLSL_NOISE}

void main() {
  vec3 point = normalize(vObjectPosition);
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

  float warp = fbm3(point * 2.1 + vec3(4.2, 1.7, 8.4));
  float continents = fbm3(point * 1.55 + warp * 0.55 + vec3(2.0));
  float landMask = smoothstep(0.5, 0.615, continents);

  float detail = fbm3(point * 7.0 + 3.0);
  vec3 ocean = uOcean + vec3(0.012, 0.022, 0.035) * detail;
  vec3 land = uLand + vec3(0.018, 0.07, 0.055) * detail;
  vec3 color = mix(ocean, land, landMask);

  vec3 lightDirection = normalize(vec3(-0.55, 0.42, 0.78));
  float daylight = clamp(dot(normal, lightDirection), 0.0, 1.0);
  float horizon = smoothstep(0.0, 0.7, daylight);

  color *= 0.4 + horizon * 0.9;

  float cityNoise = smoothstep(0.55, 0.78, fbm3(point * 19.0 + 5.0));
  float cities = landMask * cityNoise * (1.0 - horizon * 0.55);
  color += uLight * cities * 0.58;
  color += vec3(0.3, 0.85, 1.0) * cities * 0.08;

  float rim = pow(1.0 - clamp(dot(normal, viewDirection), 0.0, 1.0), 2.6);
  color += vec3(0.16, 0.62, 0.78) * rim * 0.2;

  float shimmer = 0.94 + 0.06 * sin(uTime * 0.35 + point.y * 3.0);
  gl_FragColor = vec4(color * shimmer, 1.0);
  #include <colorspace_fragment>
}
`;

export const ATMOSPHERE_VERTEX = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ATMOSPHERE_FRAGMENT = `
uniform float uTime;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float rim = pow(1.0 - abs(dot(normal, viewDirection)), 2.2);
  float pulse = 0.88 + 0.12 * sin(uTime * 0.6);

  vec3 cyan = vec3(0.28, 0.85, 1.0);
  vec3 ember = vec3(1.0, 0.52, 0.16);
  vec3 color = mix(cyan, ember, 0.18);

  gl_FragColor = vec4(color, rim * 0.34 * pulse);
  #include <colorspace_fragment>
}
`;

export const DOT_VERTEX = `
uniform float uPixelRatio;

attribute float aSize;
attribute vec3 aColor;

varying vec3 vColor;

void main() {
  vColor = aColor;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio / max(0.6, -viewPosition.z);
  gl_Position = projectionMatrix * viewPosition;
}
`;

export const DOT_FRAGMENT = `
varying vec3 vColor;

void main() {
  float distanceToCenter = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.08, distanceToCenter);
  gl_FragColor = vec4(vColor, alpha * 0.95);
  #include <colorspace_fragment>
}
`;

export const STAR_VERTEX = `
uniform float uTime;
uniform float uPixelRatio;

attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;

varying vec3 vColor;
varying float vTwinkle;

void main() {
  vColor = aColor;
  vTwinkle = 0.58 + 0.42 * sin(uTime * (0.35 + aPhase * 0.06) + aPhase * 6.2831);

  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPixelRatio * (34.0 / max(2.0, -viewPosition.z));
  gl_Position = projectionMatrix * viewPosition;
}
`;

export const STAR_FRAGMENT = `
varying vec3 vColor;
varying float vTwinkle;

void main() {
  float distanceToCenter = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.04, distanceToCenter);
  vec3 color = vColor * (0.82 + vTwinkle * 0.38);
  gl_FragColor = vec4(color, alpha * vTwinkle);
  #include <colorspace_fragment>
}
`;

export const NEBULA_VERTEX = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const NEBULA_FRAGMENT = `
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 point = (vUv - 0.5) * vec2(1.8, 1.0);

  vec2 emberCenter = vec2(-0.34, 0.16);
  vec2 cyanCenter = vec2(0.32, -0.22);

  float emberGlow = exp(-5.4 * dot(point - emberCenter, point - emberCenter));
  float cyanGlow = exp(-6.8 * dot(point - cyanCenter, point - cyanCenter));

  float band = exp(-26.0 * pow(point.y + 0.12 * sin(point.x * 3.2 + uTime * 0.03), 2.0));
  float haze = 0.5 + 0.5 * sin(point.x * 2.4 + point.y * 1.7 + uTime * 0.02);

  vec3 color = vec3(0.008, 0.012, 0.024);
  color += vec3(1.0, 0.5, 0.15) * emberGlow * 0.14;
  color += vec3(0.18, 0.72, 0.9) * cyanGlow * 0.08;
  color += vec3(0.28, 0.55, 0.9) * band * 0.04;
  color += vec3(0.1, 0.16, 0.3) * haze * 0.025;

  float alpha = clamp(emberGlow * 0.5 + cyanGlow * 0.35 + band * 0.18 + 0.1, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha * 0.34);
  #include <colorspace_fragment>
}
`;
