"use client";

import { SplitText } from "./SplitText";

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
  return (
    <SplitText
      as={Tag}
      text={text}
      className={className}
      id={id}
      variant="word"
    />
  );
}
