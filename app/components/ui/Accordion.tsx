"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { useEffectsMode } from "../effects/effects-provider";
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
  const mode = useEffectsMode();

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
        "divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface/80",
        className,
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id} className="rulebook-row" data-open={isOpen}>
            <h3 className="text-base">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                data-cursor={isOpen ? "COLLAPSE" : "EXPAND"}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-offset-[-2px]"
              >
                <span className="flex items-center gap-3">
                  <span
                    className="font-mono text-[0.625rem] text-primary/70"
                    aria-hidden="true"
                  >
                    {isOpen ? "●" : "○"}
                  </span>
                  {item.title}
                </span>
                <ChevronDownIcon
                  className={cn(
                    "size-4 shrink-0 text-muted transition-transform duration-300",
                    isOpen && "rotate-180 text-primary",
                  )}
                />
              </button>
            </h3>
            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  "rulebook-panel",
                  mode === "off" && "rulebook-panel-instant",
                )}
              >
                <div className="px-5 pb-5 pl-11 text-sm leading-relaxed text-muted">
                  {item.content}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
