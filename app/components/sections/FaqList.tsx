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
      {groups.map((group) => {
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
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                {group.title}
              </h2>
            ) : null}
            <Accordion
              items={items}
              className={showGroupTitles ? "mt-4" : undefined}
            />
          </section>
        );
      })}
    </div>
  );
}
