import { ImageResponse } from "next/og";
import { SocialImageMarkup } from "./social-image-markup";

export const alt = "Kosmodrome 2026 — 48 Hours to Orbit";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<SocialImageMarkup />, {
    ...size,
  });
}
