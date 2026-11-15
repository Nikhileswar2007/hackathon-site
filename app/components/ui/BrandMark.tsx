import type { SVGProps } from "react";

/**
 * Kosmodrome brand mark: a launch tower beside a rocket inside a thin circle.
 * Placeholder mark — replace this one component (or the slots marked below)
 * with the official logo asset when the organisers supply one.
 */
export function BrandMark({
  title,
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      {...props}
    >
      <circle cx="24" cy="24" r="21.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M11 40V14M15.5 40V11M15.5 15L21 11M15.5 24L21 20M15.5 33L21 29"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path
        d="M28.2 9.2c3 1.7 4.7 5.3 4.7 9.2 0 4.6-2.2 8.3-5.2 10.8-1.1 4-2.9 6.8-6.3 8.6-1.1-2.9-.9-5.7.5-8.9C18 26 17 21.6 18.4 17c1.4-4.3 4.8-6.8 9.8-7.8Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path d="M21.4 27.4 17.5 33l5.8-3.1" stroke="#05070c" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="26.2" cy="17.6" r="1.6" fill="#05070c" />
      <path d="M28.6 33.5h6M31.6 37h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
