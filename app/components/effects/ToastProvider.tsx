"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { cn } from "../ui/cn";

export interface ToastInput {
  title: string;
  description?: string;
  tone?: "primary" | "success" | "warning";
}

interface Toast extends ToastInput {
  id: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current + 1;
      nextId.current = id;
      setToasts((current) => [...current, { ...input, id }].slice(-MAX_VISIBLE));

      const timer = setTimeout(() => {
        timers.current.delete(timer);
        dismiss(id);
      }, 4200);

      timers.current.add(timer);
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      for (const timer of timers.current) {
        clearTimeout(timer);
      }
      timers.current.clear();
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite" aria-atomic="true">
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
              onClick={() => dismiss(entry.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
