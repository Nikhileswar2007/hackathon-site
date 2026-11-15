"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RouteAnnouncer() {
  const pathname = usePathname();
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const live = liveRef.current;

    if (!live) {
      return;
    }

    let frame = 0;
    frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLHeadingElement>(
        "main h1, main [data-page-heading], main [tabindex='-1']",
      );

      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }

      const title = document.title;
      live.textContent = title ? `Page loaded: ${title}` : "Page loaded";
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      ref={liveRef}
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />
  );
}
