import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <svg viewBox="0 0 180 180" width="100%" height="100%" fill="none">
      <rect width="180" height="180" rx="36" fill="#05070c" />
      <rect x="12" y="12" width="156" height="156" rx="28" stroke="#1c2a3d" strokeWidth="4" />
      <circle cx="90" cy="90" r="56" stroke="#6fe3f2" strokeWidth="9" />
      <path
        d="M62 124V70M80 124V57M80 74L100 63.5M80 97L100 86.5M80 120L100 109.5"
        stroke="#9dacc2"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d="M112 46c11 7 17 23 17 38 0 19-8 35-19 46-4.3 14-10 25-23 32-4-10-3.4-20.7 1.9-32.5-8.7-14.5-12.6-32-7.6-52.7 5.2-19.1 20.4-29.3 31.1-31.8Z"
        fill="#ff9e45"
      />
      <path d="M98 118 82 140l22-12.3" stroke="#05070c" strokeWidth="6" strokeLinejoin="round" />
      <circle cx="109" cy="79" r="6" fill="#05070c" />
    </svg>,
    {
      ...size,
    },
  );
}
