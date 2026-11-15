import type { FaqGroup } from "@/app/content/event-data";
import { Accordion, type AccordionItem } from "../ui/Accordion";
import { cn } from "../ui/cn";

export function FaqList({
  groups,
  showGroupTitles = true,
  className,
}: {
  groups: FaqGroup[];
  showGroupTitles?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-10", className)}>
      {groups.map((group, groupIndex) => {
        const items: AccordionItem[] = group.items.map((item) => ({
          id: item.id,
          title: item.question,
          content: <p>{item.answer}</p>,
        }));
        const headingId = `${group.id}-faq-heading`;

        return (
          <section
            key={group.id}
            aria-labelledby={showGroupTitles ? headingId : undefined}
          >
            {showGroupTitles ? (
              <h2
                id={headingId}
                className="flex items-baseline gap-2.5 text-lg font-semibold tracking-tight text-foreground"
              >
                <span
                  className="font-mono text-[0.625rem] font-normal text-primary/70"
                  aria-hidden="true"
                >
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                {group.title}
              </h2>
            ) : null}
            <Accordion
              items={items}
              className={cn("faq-accordion", showGroupTitles ? "mt-4" : undefined)}
            />
          </section>
        );
      })}
    </div>
  );
}
