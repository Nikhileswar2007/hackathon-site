"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

type HeadingTag = "h1" | "h2" | "h3";

export function SplitHeading({
  as: Tag = "h2",
  text,
  className,
  id,
}: {
  as?: HeadingTag;
  text: string;
  className?: string;
  id?: string;
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLHeadingElement | null>(null);
  const [visible, setVisible] = useState(false);
  const armed = mode !== "off";
  const words = text.split(" ");

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
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [armed]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("split-heading", className)}
      data-armed={armed}
      data-visible={visible}
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span
            className="split-word"
            style={{ "--word-index": index } as CSSProperties}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
