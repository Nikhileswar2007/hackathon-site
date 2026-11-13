"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "./cn";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({
  items,
  label,
  className,
}: {
  items: TabItem[];
  label: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const baseId = useId();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeItem =
    items.find((item) => item.id === activeId) ?? items[0];

  if (!activeItem) {
    return null;
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    setActiveId(items[nextIndex].id);
    buttonRefs.current[nextIndex]?.focus();
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1 sm:inline-flex"
      >
        {items.map((item, index) => {
          const selected = item.id === activeItem.id;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-${item.id}-tab`}
              aria-selected={selected}
              aria-controls={`${baseId}-${item.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-offset-[-2px] sm:flex-none",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-surface-raised hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const selected = item.id === activeItem.id;

        return (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-${item.id}-panel`}
            aria-labelledby={`${baseId}-${item.id}-tab`}
            tabIndex={selected ? 0 : -1}
            hidden={!selected}
            className="mt-6 focus-visible:outline-offset-4"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
