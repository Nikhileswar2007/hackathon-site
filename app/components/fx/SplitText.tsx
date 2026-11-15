"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
} from "react";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

type SplitTextTag = "h1" | "h2" | "h3" | "p" | "span";

export function SplitText({
  as: Tag = "h2",
  text,
  className,
  id,
  variant = "letter",
}: {
  as?: SplitTextTag;
  text: string;
  className?: string;
  id?: string;
  variant?: "word" | "letter";
}) {
  const mode = useEffectsMode();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const armed = mode !== "off";
  const effectiveVariant = mode === "lite" ? "word" : variant;
  const isVisible = visible || !armed;
  const words = text.split(" ");
  const Component = Tag as ElementType;
  let characterIndex = 0;

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
    <Component
      ref={ref}
      id={id}
      className={cn("split-text", className)}
      aria-label={text}
      data-armed={armed}
      data-visible={isVisible}
      data-mode={mode}
      data-variant={effectiveVariant}
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          if (effectiveVariant === "word") {
            return (
              <Fragment key={`${word}-${wordIndex}`}>
                <span
                  className="split-word"
                  style={
                    { "--word-index": wordIndex } as CSSProperties
                  }
                >
                  {word}
                </span>
                {wordIndex < words.length - 1 ? " " : null}
              </Fragment>
            );
          }

          return (
            <Fragment key={`${word}-${wordIndex}`}>
              <span className="split-word split-word-letters">
                {Array.from(word).map((character, index) => {
                  const charIndex = characterIndex;
                  characterIndex += 1;

                  return (
                    <span
                      key={`${character}-${index}`}
                      className="split-char"
                      style={
                        { "--char-index": charIndex } as CSSProperties
                      }
                    >
                      {character}
                    </span>
                  );
                })}
              </span>
              {wordIndex < words.length - 1 ? " " : null}
            </Fragment>
          );
        })}
      </span>
    </Component>
  );
}
