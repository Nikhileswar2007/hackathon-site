import type { ReactNode } from "react";
import { cn } from "./cn";

type CalloutTone = "info" | "primary" | "success" | "warning" | "danger";

const boxClasses: Record<CalloutTone, string> = {
  info: "border-border-strong bg-surface-raised",
  primary: "border-primary bg-primary-soft",
  success: "border-success bg-success-soft",
  warning: "border-warning bg-warning-soft",
  danger: "border-danger bg-danger-soft",
};

const titleClasses: Record<CalloutTone, string> = {
  info: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function Callout({
  title,
  tone = "info",
  children,
  className,
}: {
  title?: string;
  tone?: CalloutTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-xl border p-4 sm:p-5",
        boxClasses[tone],
        className,
      )}
    >
      {title ? (
        <p
          className={cn(
            "text-sm font-semibold",
            titleClasses[tone],
          )}
        >
          {title}
        </p>
      ) : null}
      <div
        className={cn(
          "text-sm leading-relaxed text-foreground",
          title && "mt-2",
        )}
      >
        {children}
      </div>
    </div>
  );
}
