import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <svg viewBox="0 0 48 48" width="100%" height="100%" fill="none">
      <rect width="48" height="48" rx="10" fill="#05070c" />
      <circle cx="24" cy="24" r="15" stroke="#6fe3f2" strokeWidth="2.4" />
      <path
        d="M15 34V18M19.5 34V15M19.5 19.5L24.5 16M19.5 26L24.5 22.5M19.5 32.5L24.5 29"
        stroke="#9dacc2"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M29 13.6c2.8 1.7 4.4 5.4 4.4 9.2 0 4.6-2 8.4-4.8 11.1-1.1 3.4-2.7 6.1-6 7.9-1.1-2.5-.9-5.1.5-8-2.1-3.5-3.1-8-1.8-12.8 1.3-4.5 5.4-7 7.7-7.4Z"
        fill="#ff9e45"
      />
      <path d="M24.5 31.2 20.8 36.6l5.7-3.2" stroke="#05070c" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="27.6" cy="22.3" r="1.5" fill="#05070c" />
    </svg>,
    {
      ...size,
    },
  );
}
