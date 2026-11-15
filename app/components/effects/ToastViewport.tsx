"use client";

import { cn } from "../ui/cn";
import type { ToastInput } from "./ToastProvider";

export interface ToastRecord extends ToastInput {
  id: number;
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastRecord[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className="toast-region"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((entry) => (
        <div
          key={entry.id}
          role="status"
          className={cn(
            "toast",
            entry.tone === "success" && "toast-success",
            entry.tone === "warning" && "toast-warning",
          )}
          data-cursor="INSPECT"
        >
          <div className="toast-body">
            <p className="toast-title">{entry.title}</p>
            {entry.description ? (
              <p className="toast-description">{entry.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="toast-close"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(entry.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
