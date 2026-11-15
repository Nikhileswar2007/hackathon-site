"use client";

import dynamic from "next/dynamic";
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
import { lockPageScroll, unlockPageScroll } from "./scroll-lock";

const CommandPalette = dynamic(
  () => import("./CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false },
);

interface CommandPaletteContextValue {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"], [role="textbox"]',
    ),
  );
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const openPalette = useCallback(() => {
    trigger.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setRequested(true);
    setOpen(true);
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => {
      if (current) {
        return false;
      }
      trigger.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      setRequested(true);
      return true;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isK = event.key.toLowerCase() === "k";
      const isShortcut = isK && (event.metaKey || event.ctrlKey);

      if (isShortcut) {
        event.preventDefault();
        toggle();
        return;
      }

      if (event.key === "/" && !isEditableTarget(event.target)) {
        event.preventDefault();
        openPalette();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openPalette, toggle]);

  useEffect(() => {
    if (!open) {
      const activeTrigger = trigger.current;

      if (activeTrigger?.isConnected) {
        activeTrigger.focus({ preventScroll: true });
      }
      return;
    }

    lockPageScroll();

    const inertTargets: Element[] = [];
    for (const element of Array.from(document.body.children)) {
      if (element.hasAttribute("data-command-palette-root")) {
        continue;
      }

      if (!element.hasAttribute("inert")) {
        element.setAttribute("inert", "");
        inertTargets.push(element);
      }
    }

    return () => {
      unlockPageScroll();
      for (const element of inertTargets) {
        element.removeAttribute("inert");
      }
    };
  }, [open]);

  const value = useMemo(
    () => ({ open: openPalette, close, toggle }),
    [close, openPalette, toggle],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {requested && open ? (
        <div data-command-palette-root>
          <CommandPalette onClose={close} />
        </div>
      ) : null}
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  }

  return context;
}
