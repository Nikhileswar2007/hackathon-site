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
import dynamic from "next/dynamic";

export interface ToastInput {
  title: string;
  description?: string;
  tone?: "primary" | "success" | "warning";
  /** Optional action rendered as a small button, e.g. “Retry”. */
  action?: {
    label: string;
    onAction: () => void;
  };
}

const ToastViewport = dynamic(
  () =>
    import("./ToastViewport").then((mod) => mod.ToastViewport),
  { ssr: false },
);

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
  const [viewportRequested, setViewportRequested] = useState(false);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current + 1;
      nextId.current = id;
      setViewportRequested(true);
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
      {viewportRequested ? (
        <ToastViewport toasts={toasts} onDismiss={dismiss} />
      ) : null}
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
