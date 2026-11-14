"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

type RevealElement = "div" | "section" | "li" | "article";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealElement;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const armed = mode !== "off";

  useEffect(() => {
    if (!armed) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      node.dataset.visible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [armed]);

  return (
    <Component
      ref={ref as Ref<never>}
      className={cn("reveal", className)}
      data-armed={armed}
      data-visible={visible}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Component>
  );
}
