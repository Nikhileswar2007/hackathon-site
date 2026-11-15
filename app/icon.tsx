import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <svg
      viewBox="0 0 32 32"
      width="100%"
      height="100%"
      fill="none"
    >
      <rect width="32" height="32" rx="6" fill="#05070c" />
      <ellipse
        cx="16"
        cy="16"
        rx="13"
        ry="6.7"
        transform="rotate(-24 16 16)"
        stroke="#6fe3f2"
        strokeWidth="2"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="10"
        ry="4.7"
        transform="rotate(22 16 16)"
        stroke="#ff9e45"
        strokeWidth="1.5"
      />
      <circle cx="16" cy="16" r="3.8" fill="#edf3fb" />
      <circle cx="24.8" cy="10.3" r="1.5" fill="#ff9e45" />
    </svg>,
    {
      ...size,
    },
  );
}
