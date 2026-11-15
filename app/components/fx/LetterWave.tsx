import {
  Fragment,
  type CSSProperties,
} from "react";
import { cn } from "../ui/cn";

type LetterWaveTag = "span" | "p" | "h2" | "h3";

export function LetterWave({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: LetterWaveTag;
}) {
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <Tag className={cn("letter-wave", className)} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((character, index) => {
                const indexValue = letterIndex;
                letterIndex += 1;

                return (
                  <span
                    key={`${character}-${index}`}
                    className="letter-wave-char"
                    style={
                      { "--letter-index": indexValue } as CSSProperties
                    }
                  >
                    {character}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
