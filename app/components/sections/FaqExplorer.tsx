"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { FaqGroup } from "@/app/content/event-data";
import { Accordion, type AccordionItem } from "../ui/Accordion";
import { Frame } from "../ui/Frame";
import { cn } from "../ui/cn";

const allTopicsId = "all";

export function FaqExplorer({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState(allTopicsId);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const totalQuestions = useMemo(
    () => groups.reduce((sum, group) => sum + group.items.length, 0),
    [groups],
  );

  const filteredGroups = useMemo(() => {
    const byTopic =
      activeTopic === allTopicsId
        ? groups
        : groups.filter((group) => group.id === activeTopic);

    if (!normalizedQuery) {
      return byTopic;
    }

    return byTopic
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          `${item.question} ${item.answer}`
            .toLowerCase()
            .includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, activeTopic, normalizedQuery]);

  const resultCount = filteredGroups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );
  const isFiltered = Boolean(normalizedQuery) || activeTopic !== allTopicsId;

  const topics = [
    { id: allTopicsId, title: "All topics", count: totalQuestions },
    ...groups.map((group) => ({
      id: group.id,
      title: group.title,
      count: group.items.length,
    })),
  ];

  function resetFilters() {
    setQuery("");
    setActiveTopic(allTopicsId);
  }

  return (
    <div>
      <Frame className="faq-console rounded-xl border border-border bg-surface/80 p-4 shadow-[var(--elev-2)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="faq-search"
            className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted"
          >
            Search the FAQ
          </label>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary/70">
            Query console
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-controls="faq-results"
            autoComplete="off"
            placeholder="Try “fees”, “AI tools” or “appeal”"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] transition-colors placeholder:text-muted hover:border-border-strong focus-visible:border-primary"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear the FAQ search"
              data-cursor="SWITCH"
              className="shrink-0 rounded-md border border-border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted transition-[color,border-color,transform] hover:border-border-strong hover:text-foreground active:translate-y-px"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Filter by topic"
          className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1"
        >
          {topics.map((topic) => {
            const selected = activeTopic === topic.id;

            return (
              <button
                key={topic.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveTopic(topic.id)}
                data-cursor="SWITCH"
                className={cn(
                  "faq-chip shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-[color,background-color,border-color,transform] active:translate-y-px",
                  selected
                    ? "border-primary/50 bg-primary-soft text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {topic.title}
                <span
                  className={cn(
                    "ml-1.5 font-mono text-[0.625rem]",
                    selected ? "text-primary/70" : "text-muted",
                  )}
                >
                  {topic.count}
                </span>
              </button>
            );
          })}
        </div>
      </Frame>

      <div id="faq-results">
        <p
          role="status"
          aria-live="polite"
          className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted"
        >
          {isFiltered
            ? `${resultCount} of ${totalQuestions} questions`
            : `${totalQuestions} questions across ${groups.length} topics`}
        </p>

        {filteredGroups.length > 0 ? (
          <div className="mt-5 space-y-8">
            {filteredGroups.map((group, groupIndex) => {
              const items: AccordionItem[] = group.items.map((item) => ({
                id: item.id,
                title: item.question,
                content: <p>{item.answer}</p>,
              }));
              const headingId = `${group.id}-filtered-heading`;

              return (
                <section key={group.id} aria-labelledby={headingId}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
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
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "question" : "questions"}
                    </span>
                  </div>
                  <Accordion items={items} className="faq-accordion mt-3" />
                </section>
              );
            })}
          </div>
        ) : (
          <Frame className="faq-empty mt-5 rounded-xl border border-border bg-surface p-8 text-center shadow-[var(--elev-2)]">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-primary">
              No signal
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
              No questions match that filter.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Try a broader phrase, or reset the topic filter to scan every
              answer.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              data-cursor="SWITCH"
              className="mt-5 rounded-full border border-primary/50 bg-primary-soft px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary transition-[background-color,transform] hover:bg-primary/15 active:translate-y-px"
            >
              Reset filters
            </button>
          </Frame>
        )}
      </div>
    </div>
  );
}
