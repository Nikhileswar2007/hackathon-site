"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  faqGroups,
  ruleSections,
  timeline,
} from "@/app/content/event-data";
import { siteConfig } from "@/app/content/site-config";
import { useEffects } from "../effects/effects-provider";
import { useToast } from "../effects/ToastProvider";
import { scrollToTop } from "../effects/scroll-lock";
import { ArrowRightIcon } from "../ui/icons";
import { ScrambleText } from "../fx/ScrambleText";

export interface CommandPaletteProps {
  onClose: () => void;
}

type Group = "Pages" | "Rules" | "FAQ" | "Timeline" | "Actions";
type ItemType = "route" | "rule" | "faq" | "timeline" | "action";
type ActionKind = "register" | "mode-full" | "mode-lite" | "mode-off" | "copy-link" | "top";

interface CommandItem {
  id: string;
  label: string;
  detail: string;
  href?: string;
  group: Group;
  type: ItemType;
  action?: ActionKind;
  keywords: string;
}

const pages: Array<{ label: string; href: string; description: string }> = [
  { label: "Home", href: "/", description: "Kosmodrome 2026 and the mission brief" },
  { label: "About", href: "/about", description: "The event, guarantees and who can join" },
  { label: "Tracks", href: "/tracks", description: "Beginner and Advanced problem sets" },
  { label: "Timeline", href: "/timeline", description: "Twenty moments from D-14 to T+144" },
  { label: "Scoring", href: "/scoring", description: "Weights, bands, penalties and finals" },
  { label: "Rules", href: "/rules", description: "Eligibility, teams, development and conduct" },
  { label: "Submission", href: "/submission", description: "What to ship before hard close" },
  { label: "Fair play", href: "/fair-play", description: "Sealed problems and integrity checks" },
  { label: "Prizes", href: "/prizes", description: "Awards, certificates and conditions" },
  { label: "FAQ", href: "/faq", description: "Eligibility, tools, judging and appeals" },
  { label: "Contact", href: "/contact", description: "Official channels for requests and reports" },
  { label: "Register", href: "/register", description: "Team details, members and declarations" },
];

const actions: Array<{ id: string; label: string; detail: string; action: ActionKind }> = [
  { id: "action-register", label: "Register", detail: "Open team registration", action: "register" },
  { id: "action-full", label: "Switch effects: Full", detail: "All motion and 3D detail", action: "mode-full" },
  { id: "action-lite", label: "Switch effects: Lite", detail: "Reduced motion and detail", action: "mode-lite" },
  { id: "action-off", label: "Switch effects: Off", detail: "Static fallback", action: "mode-off" },
  { id: "action-copy", label: "Copy page link", detail: "Copy the current URL to the clipboard", action: "copy-link" },
  { id: "action-top", label: "Back to launch pad", detail: "Return to the top of the page", action: "top" },
];

const allItems: CommandItem[] = [
  ...pages.map((page) => ({
    id: `page:${page.href}`,
    label: page.label,
    detail: page.description,
    href: page.href,
    group: "Pages" as const,
    type: "route" as const,
    keywords: `${page.label} ${page.href.slice(1)} ${page.description}`,
  })),
  ...ruleSections.map((section) => ({
    id: `rule:${section.id}`,
    label: section.title,
    detail: section.bullets[0] ?? "Rulebook section",
    href: `/rules#${section.id}`,
    group: "Rules" as const,
    type: "rule" as const,
    keywords: `${section.title} ${section.id} ${section.bullets.join(" ")}`,
  })),
  ...faqGroups.flatMap((group) =>
    group.items.map((item) => ({
      id: `faq:${item.id}`,
      label: item.question,
      detail: item.answer,
      href: `/faq#${item.id}`,
      group: "FAQ" as const,
      type: "faq" as const,
      keywords: `${item.question} ${item.answer} ${group.title}`,
    })),
  ),
  ...timeline.map((item) => ({
    id: `timeline:${item.id}`,
    label: item.event,
    detail: [item.when, item.clock, item.note].filter(Boolean).join(" · "),
    href: `/timeline#${item.id}`,
    group: "Timeline" as const,
    type: "timeline" as const,
    keywords: `${item.when} ${item.clock ?? ""} ${item.event} ${item.note ?? ""} ${item.type}`,
  })),
  ...actions.map((action) => ({
    id: `action:${action.id}`,
    label: action.label,
    detail: action.detail,
    group: "Actions" as const,
    type: "action" as const,
    action: action.action,
    keywords: `${action.label} ${action.detail} effects full lite off copy link top register`,
  })),
];

function fuzzyScore(value: string, query: string) {
  if (!query) {
    return 1;
  }

  const haystack = value.toLowerCase();
  const needle = query.toLowerCase().trim().toLowerCase();

  if (!needle) {
    return 1;
  }

  if (haystack.includes(needle)) {
    return 100 - haystack.indexOf(needle);
  }

  const tokens = needle.split(/\s+/).filter(Boolean);

  if (tokens.length > 1 && tokens.every((token) => haystack.includes(token))) {
    return 70 - Math.min(30, tokens.length);
  }

  let cursor = 0;
  let score = 0;

  for (const character of needle) {
    const found = haystack.indexOf(character, cursor);

    if (found === -1) {
      return 0;
    }

    score += Math.max(1, 12 - (found - cursor));
    cursor = found + 1;
  }

  return score;
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return <>{text}</>;
  }

  const index = text.toLowerCase().indexOf(needle);

  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <mark className="command-mark">{text.slice(index, index + needle.length)}</mark>
      {text.slice(index + needle.length)}
    </>
  );
}

function nextTypeAction(
  action: ActionKind,
  router: ReturnType<typeof useRouter>,
  toast: ReturnType<typeof useToast>["toast"],
  setMode: ReturnType<typeof useEffects>["setMode"],
) {
  if (action === "register") {
    router.push("/register");
    return;
  }

  if (action === "mode-full") {
    setMode("full");
    toast({ title: "Effects set to Full", tone: "success" });
    return;
  }

  if (action === "mode-lite") {
    setMode("lite");
    toast({ title: "Effects set to Lite", tone: "success" });
    return;
  }

  if (action === "mode-off") {
    setMode("off");
    toast({ title: "Effects set to Off", tone: "success" });
    return;
  }

  if (action === "copy-link") {
    const href = typeof window === "undefined" ? siteConfig.name : window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(href)
        .then(() => toast({ title: "Link copied", tone: "success" }))
        .catch(() => toast({ title: "Clipboard unavailable", tone: "warning" }));
    } else {
      toast({ title: "Clipboard unavailable", tone: "warning" });
    }
    return;
  }

  if (action === "top") {
    scrollToTop();
    toast({ title: "Back to launch pad", tone: "success" });
  }
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { setMode } = useEffects();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>(["action-copy"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();

  const results = useMemo(() => {
    if (!trimmedQuery) {
      const recentIds = new Set(recent);
      const recentItems = allItems.filter((item) => recentIds.has(item.id.replace(/^action:/, "")));
      const suggested = [
        allItems.find((item) => item.id === "action:action-register")!,
        allItems.find((item) => item.id === "page:/timeline")!,
        allItems.find((item) => item.id === "page:/scoring")!,
        allItems.find((item) => item.id === "page:/register")!,
        allItems.find((item) => item.id === "page:/faq")!,
      ];

      return [...recentItems, ...suggested].filter(
        (item, index, list) => list.findIndex((entry) => entry.id === item.id) === index,
      );
    }

    return allItems
      .map((item) => ({ item, score: fuzzyScore(
        `${item.label} ${item.detail} ${item.keywords}`,
        trimmedQuery,
      ) }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((entry) => entry.item);
  }, [recent, trimmedQuery]);

  const groupedResults = useMemo(() => {
    const groups: Array<{ title: Group; items: CommandItem[] }> = [];

    for (const item of results) {
      const group = groups.find((entry) => entry.title === item.group);

      if (group) {
        group.items.push(item);
      } else {
        groups.push({ title: item.group, items: [item] });
      }
    }

    return groups;
  }, [results]);

  const flatResults = useMemo(
    () => groupedResults.flatMap((group) => group.items),
    [groupedResults],
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const active = flatResults[activeIndex];

    if (active) {
      document.getElementById(active.id)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, flatResults]);

  const activate = useCallback(
    (item: CommandItem) => {
      if (item.type === "route" && item.href) {
        router.push(item.href);
        onClose();
        return;
      }

      if (item.type === "rule" || item.type === "faq" || item.type === "timeline") {
        if (item.href) {
          router.push(item.href);
          onClose();
        }
        return;
      }

      if (item.action) {
        nextTypeAction(item.action, router, toast, setMode);
        setRecent((current) => [item.id.replace(/^action:/, ""), ...current].slice(0, 5));
        onClose();
      }
    },
    [onClose, router, setMode, toast],
  );

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % Math.max(1, flatResults.length));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + Math.max(1, flatResults.length)) % Math.max(1, flatResults.length));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const item = flatResults[activeIndex];

      if (item) {
        activate(item);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  function handleTab(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="command-backdrop"
      onPointerDown={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
        className="command-panel"
        data-cursor="INSPECT"
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={handleTab}
      >
        <div className="command-header">
          <p id="command-palette-title" className="hud-prompt">
            Command deck
          </p>
          <button
            type="button"
            className="command-close"
            aria-label="Close command palette"
            onClick={onClose}
          >
            Esc
          </button>
        </div>
        <label htmlFor="command-input" className="sr-only">
          Search pages, rules, FAQs, timeline and actions
        </label>
        <input
          ref={inputRef}
          id="command-input"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleInputKeyDown}
          className="command-input"
          placeholder="Search pages, rules, FAQs or actions..."
          autoComplete="off"
          spellCheck="false"
          aria-controls="command-results"
          aria-activedescendant={flatResults[activeIndex]?.id}
        />
        <div id="command-results" ref={listRef} className="command-results" role="listbox" aria-label="Command results">
          {groupedResults.length > 0 ? groupedResults.map((group) => (
            <section key={group.title} className="command-group" aria-label={group.title}>
              <div className="command-group-heading">
                <ScrambleText text={group.title} as="h2" />
                <span className="index-numeral">{String(group.items.length).padStart(2, "0")}</span>
              </div>
              {group.items.map((item) => {
                const flatIndex = flatResults.findIndex((entry) => entry.id === item.id);
                const selected = flatIndex === activeIndex;
                const content = (
                  <>
                    <span className="command-result-copy">
                      <span className="command-result-label">
                        <Highlighted text={item.label} query={trimmedQuery} />
                      </span>
                      <span className="command-result-detail">{item.detail}</span>
                    </span>
                    <ArrowRightIcon className="command-result-icon" />
                  </>
                );

                return item.href ? (
                  <Link
                    key={item.id}
                    id={item.id}
                    href={item.href}
                    prefetch={false}
                    className="command-result"
                    role="option"
                    aria-selected={selected}
                    data-active={selected}
                    onClick={onClose}
                    onFocus={() => setActiveIndex(flatIndex)}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    id={item.id}
                    type="button"
                    className="command-result"
                    role="option"
                    aria-selected={selected}
                    data-active={selected}
                    onClick={() => activate(item)}
                    onFocus={() => setActiveIndex(flatIndex)}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                  >
                    {content}
                  </button>
                );
              })}
            </section>
          )) : (
            <div className="command-empty">
              <p className="hud-prompt">No signal</p>
              <p className="mt-2 text-sm text-muted">Try a broader phrase, or pick one of these.</p>
              <div className="mt-3 grid gap-1.5">
                {[pages[0], pages[11], pages[5], pages[6]].map((page) => (
                  <button
                    key={page.href}
                    type="button"
                    className="command-empty-link"
                    onClick={() => {
                      router.push(page.href);
                      onClose();
                    }}
                  >
                    <Highlighted text={page.label} query="" />
                    <ArrowRightIcon className="size-4" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
