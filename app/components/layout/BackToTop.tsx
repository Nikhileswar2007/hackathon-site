"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { subscribeScroll } from "../effects/scroll-store";

const BackToTopButton = dynamic(
  () => import("./BackToTopButton").then((mod) => mod.BackToTopButton),
  { ssr: false },
);

export function BackToTop() {
  const [armed, setArmed] = useState(false);

  useEffect(
    () =>
      subscribeScroll(() => {
        if (window.scrollY > window.innerHeight * 1.5) {
          setArmed(true);
        }
      }),
    [],
  );

  if (!armed) {
    return null;
  }

  return <BackToTopButton />;
}
