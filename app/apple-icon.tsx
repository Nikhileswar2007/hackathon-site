import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <svg
      viewBox="0 0 180 180"
      width="100%"
      height="100%"
      fill="none"
    >
      <rect width="180" height="180" rx="36" fill="#05070c" />
      <rect x="14" y="14" width="152" height="152" rx="28" stroke="#1c2a3d" strokeWidth="4" />
      <ellipse
        cx="90"
        cy="90"
        rx="62"
        ry="31"
        transform="rotate(-24 90 90)"
        stroke="#6fe3f2"
        strokeWidth="9"
      />
      <ellipse
        cx="90"
        cy="90"
        rx="48"
        ry="22"
        transform="rotate(23 90 90)"
        stroke="#ff9e45"
        strokeWidth="7"
      />
      <circle cx="90" cy="90" r="17" fill="#edf3fb" />
      <circle cx="129" cy="52" r="8" fill="#ff9e45" />
    </svg>,
    {
      ...size,
    },
  );
}
