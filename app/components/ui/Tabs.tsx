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
        className="flex flex-wrap gap-1 border-b border-border"
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
              data-cursor="SWITCH"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative px-4 py-3 font-ui text-[0.6875rem] font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-offset-[-2px]",
                selected
                  ? "text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.label}
              <span
                className="tab-underline"
                data-active={selected}
                aria-hidden="true"
              />
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
