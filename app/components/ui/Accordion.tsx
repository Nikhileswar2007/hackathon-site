"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDownIcon } from "./icons";
import { cn } from "./cn";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export function Accordion({
  items,
  defaultOpenIds = [],
  className,
}: {
  items: AccordionItem[];
  defaultOpenIds?: string[];
  className?: string;
}) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const baseId = useId();

  function toggle(id: string) {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  }

  return (
    <div
      className={cn(
        "divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3 className="text-base">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-offset-[-2px]"
              >
                <span>{item.title}</span>
                <ChevronDownIcon
                  className={cn(
                    "size-4 shrink-0 text-muted transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-relaxed text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
