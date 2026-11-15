import type { CSSProperties } from "react";
import { cn } from "./cn";
import { brand } from "@/app/content/site-config";

export type WordmarkSize = "compact" | "footer";

export function Wordmark({
  size = "compact",
  className,
  style,
  dataMode,
}: {
  size?: WordmarkSize;
  className?: string;
  style?: CSSProperties;
  dataMode?: "full" | "lite" | "off";
}) {
  if (size === "footer") {
    return (
      <span
        aria-hidden="true"
        className={cn("wordmark-footer", className)}
        style={style}
      >
        {brand.displayName}
      </span>
    );
  }

  return (
    <span
      className={cn("wordmark", className)}
      style={style}
      data-mode={dataMode}
      data-text={brand.displayName}
    >
      {brand.displayName}
    </span>
  );
}
