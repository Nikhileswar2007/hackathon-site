"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  about,
  contactChannels,
  fairPlayCards,
  faqGroups,
  guarantees,
  homeFaqIds,
  prizeTracks,
  ruleSections,
  scoringTabs,
  submission,
  timeline,
  tracks,
} from "@/app/content/event-data";
import { siteConfig, TBA } from "@/app/content/site-config";
import { useEffectsMode } from "../effects/effects-provider";
import { TiltCard } from "../fx/TiltCard";
import { ArrowRightIcon } from "../ui/icons";
import { cn } from "../ui/cn";

export type NavPreviewId =
  | "/about"
  | "/tracks"
  | "/timeline"
  | "/scoring"
  | "/rules"
  | "/submission"
  | "/fair-play"
  | "/prizes"
  | "/faq"
  | "/contact";

const indexByPath = new Map(
  siteConfig.navLinks.map((link, index) => [link.href, String(index + 1).padStart(2, "0")]),
);

const featuredByPath: Record<NavPreviewId, { title: string; description: string }> = {
  "/about": {
    title: "The mission",
    description: "Kakshya 2026: national, online and built around one 48-hour clock.",
  },
  "/tracks": {
    title: "Pick your orbit",
    description: "Two separate problem sets. Tracks never compete against each other.",
  },
  "/timeline": {
    title: "Flight plan",
    description: "Registration to final results, with checkpoints inside the window.",
  },
  "/scoring": {
    title: "How scores work",
    description: "Stage 1 is blind. Finals are weighted into the top 8 per track.",
  },
  "/rules": {
    title: "Rulebook shortlist",
    description: "The clauses teams most often need before lock and during the window.",
  },
  "/submission": {
    title: "Hard close",
    description: "The evaluated version is the repository snapshot at T+48.",
  },
  "/fair-play": {
    title: "Fair by design",
    description: "Sealed problems, visible integrity checks and auditable judging.",
  },
  "/prizes": {
    title: "Recognition",
    description: "Awards for both tracks. Amounts remain to be announced.",
  },
  "/faq": {
    title: "Open circuit",
    description: "Eligibility, teams, tools, judging and appeals — answered briefly.",
  },
  "/contact": {
    title: "Reach the OC",
    description: "Official channels for registration, access, conduct and support.",
  },
};

const timelinePreviewIds = [
  "registration-opens",
  "team-lock",
  "kickoff",
  "checkpoint-1",
  "checkpoint-2",
  "checkpoint-3",
  "hard-close",
  "final-results",
];

const timelinePreview = timeline.filter((item) => timelinePreviewIds.includes(item.id));

const homeFaqs = homeFaqIds.flatMap((id) =>
  faqGroups.flatMap((group) => group.items.filter((item) => item.id === id)),
);

const scorePalette = [
  "var(--primary)",
  "var(--accent)",
  "var(--warning)",
  "var(--success)",
  "var(--accent-strong)",
  "var(--primary-strong)",
  "var(--danger)",
];

function previewLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onNavigate}
      data-cursor="OPEN"
      className={cn("nav-preview-link", className)}
    >
      {children}
    </Link>
  );
}

function FeaturedBlock({
  id,
  onNavigate,
}: {
  id: NavPreviewId;
  onNavigate?: () => void;
}) {
  const navLink = siteConfig.navLinks.find((link) => link.href === id);

  if (!navLink) {
    return null;
  }

  const featured = featuredByPath[id];

  return (
    <div className="nav-preview-feature">
      <span className="index-numeral">{indexByPath.get(id)}</span>
      <p className="hud-prefix mt-2">Mission index</p>
      <h2 className="display-oxanium mt-2 text-[1.25rem] leading-[1.05] text-foreground">
        {featured.title}
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {featured.description}
      </p>
      {previewLink({
        href: id,
        onNavigate,
        className: "nav-preview-open mt-4",
        children: (
          <>
            Open page
            <ArrowRightIcon className="size-4" />
          </>
        ),
      })}
    </div>
  );
}

function AboutPreview() {
  return (
    <div className="grid h-full gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="nav-preview-kicker">Three guarantees</p>
        {guarantees.map((guarantee, index) => (
          <div key={guarantee.title} className="nav-preview-row">
            <span className="index-numeral">{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className="block text-[0.6875rem] font-semibold uppercase leading-tight text-foreground">
                {guarantee.title}
              </span>
              <span className="mt-0.5 block text-[0.625rem] leading-snug text-muted">
                {guarantee.description}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="nav-preview-kicker">Four steps</p>
        {about.process.map((step, index) => (
          <div key={step.title} className="nav-preview-row">
            <span className="index-numeral">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-foreground">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackCardPreview({
  track,
  onNavigate,
}: {
  track: (typeof tracks)[number];
  onNavigate?: () => void;
}) {
  return (
    <TiltCard spotlight maxTilt={4} className="h-full rounded-xl">
      <div className="nav-preview-track h-full">
        <p className="index-numeral">{track.id === "beginner" ? "01" : "02"}</p>
        <h3 className="display-oxanium mt-1 text-sm text-foreground">
          {track.name}
        </h3>
        <p className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-primary">
          {track.id === "beginner" ? "Low Earth Orbit" : "Deep Space"}
        </p>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[0.625rem] leading-snug">
          <dt className="text-muted">For</dt>
          <dd className="text-foreground">{track.id === "beginner" ? "Diploma and 1st/2nd UG" : "3rd UG and above"}</dd>
          <dt className="text-muted">Team</dt>
          <dd className="text-foreground">{track.teamSize}</dd>
          <dt className="text-muted">Pack</dt>
          <dd className="text-foreground">{track.submissionPack.slice(0, 4).join(" · ")}</dd>
        </dl>
        {previewLink({
          href: "/tracks",
          onNavigate,
          className: "nav-preview-mini-link",
          children: <>Track brief <ArrowRightIcon className="size-3.5" /></>,
        })}
      </div>
    </TiltCard>
  );
}

function TracksPreview({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid h-full gap-2 sm:grid-cols-2">
      {tracks.map((track) => (
        <TrackCardPreview key={track.id} track={track} onNavigate={onNavigate} />
      ))}
    </div>
  );
}

function TimelinePreview({ onNavigate }: { onNavigate?: () => void }) {
  const [activeId, setActiveId] = useState("kickoff");
  const stripRef = useRef<HTMLDivElement>(null);
  const active = timelinePreview.find((item) => item.id === activeId) ?? timelinePreview[0];

  function updateProgress(clientX: number) {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    const rect = strip.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    strip.style.setProperty("--timeline-progress", progress.toFixed(4));

    const index = Math.min(
      timelinePreview.length - 1,
      Math.max(0, Math.round(progress * (timelinePreview.length - 1))),
    );
    setActiveId(timelinePreview[index].id);
  }

  return (
    <div className="flex h-full flex-col">
      <p className="nav-preview-kicker">Key moments</p>
      <div
        ref={stripRef}
        className="timeline-mini-strip"
        style={{ "--timeline-progress": "0.2857" } as CSSProperties}
        onPointerMove={(event) => updateProgress(event.clientX)}
        onPointerLeave={() => {
          setActiveId("kickoff");
          stripRef.current?.style.setProperty("--timeline-progress", "0.2857");
        }}
      >
        <span className="timeline-mini-line" aria-hidden="true" />
        <span className="timeline-mini-fill" aria-hidden="true" />
        <div className="timeline-mini-markers">
          {timelinePreview.map((item, index) => (
            <Link
              key={item.id}
              href={`/timeline#${item.id}`}
              prefetch={false}
              onClick={onNavigate}
              onFocus={() => {
                setActiveId(item.id);
                stripRef.current?.style.setProperty(
                  "--timeline-progress",
                  (index / Math.max(1, timelinePreview.length - 1)).toFixed(4),
                );
              }}
              onPointerEnter={() => {
                setActiveId(item.id);
                stripRef.current?.style.setProperty(
                  "--timeline-progress",
                  (index / Math.max(1, timelinePreview.length - 1)).toFixed(4),
                );
              }}
              aria-label={`${item.when}: ${item.event}`}
              data-cursor="OPEN"
              className="timeline-mini-marker"
              data-active={activeId === item.id}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 min-h-16 border-t border-border pt-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em]">
          <span className="text-primary">{active.when}</span>
          {active.clock ? <span className="text-muted">{active.clock}</span> : null}
        </div>
        <p className="mt-1 line-clamp-2 text-[0.6875rem] leading-snug text-foreground">
          {active.event}
        </p>
        {active.note ? (
          <p className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.08em] text-warning">
            {active.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function ScoreBar({ tab }: { tab: (typeof scoringTabs)[number] }) {
  const mode = useEffectsMode();
  const [filled, setFilled] = useState(false);
  const [hovered, setHovered] = useState(0);
  const criterion = tab.criteria[hovered] ?? tab.criteria[0];
  const ready = mode === "off" || filled;

  useEffect(() => {
    if (mode === "off") {
      return;
    }

    const frame = window.requestAnimationFrame(() => setFilled(true));
    return () => window.cancelAnimationFrame(frame);
  }, [mode, tab.id]);

  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full border border-border bg-surface-strong">
        {tab.criteria.map((criterion, index) => (
          <button
            key={criterion.name}
            type="button"
            aria-label={`${criterion.name}, ${criterion.points} points, scored by ${criterion.scoredBy}`}
            data-cursor="INSPECT"
            className="score-segment"
            style={{
              flexGrow: criterion.points,
              background: scorePalette[index % scorePalette.length],
              transform: ready ? "scaleX(1)" : "scaleX(0)",
              transitionDelay: `${index * 35}ms`,
            }}
            onFocus={() => setHovered(index)}
            onMouseEnter={() => setHovered(index)}
          />
        ))}
      </div>
      <div className="mt-2 flex min-h-10 items-start justify-between gap-3 text-[0.625rem]">
        <span>
          <span className="block font-semibold uppercase leading-tight text-foreground">
            {criterion.name}
          </span>
          <span className="mt-0.5 block text-muted">Scored by {criterion.scoredBy}</span>
        </span>
        <span className="numeric-display shrink-0 text-lg text-accent">{criterion.points}</span>
      </div>
    </div>
  );
}

function ScoringPreview() {
  const [activeTab, setActiveTab] = useState<(typeof scoringTabs)[number]["id"]>("beginner");
  const tab = scoringTabs.find((entry) => entry.id === activeTab) ?? scoringTabs[0];

  return (
    <div>
      <div className="flex gap-1" role="group" aria-label="Scoring stage">
        {scoringTabs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className="score-tab"
            data-active={activeTab === entry.id}
            data-cursor="SWITCH"
            onClick={() => setActiveTab(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3 border-b border-border pb-2">
        <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-primary">
          {tab.title}
        </p>
        <span className="numeric-display text-xl text-foreground">{tab.total}</span>
      </div>
      <div className="mt-2">
        <ScoreBar key={tab.id} tab={tab} />
      </div>
    </div>
  );
}

function RulesPreview({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-2">
      {ruleSections.map((section) => (
        previewLink({
          href: `/rules#${section.id}`,
          onNavigate,
          className: "nav-preview-row nav-preview-rule",
          children: (
            <>
              <ArrowRightIcon className="size-3.5 shrink-0" />
              <span className="text-[0.6875rem] font-semibold uppercase leading-snug">
                {section.title}
              </span>
            </>
          ),
        })
      ))}
    </div>
  );
}

function SubmissionPreview({ onNavigate }: { onNavigate?: () => void }) {
  const items = submission.comparison.slice(0, 6);

  return (
    <div>
      <div className="nav-preview-highlight">
        <span className="numeric-display text-lg text-primary">T+40</span>
        <span className="h-4 w-px bg-border-strong" aria-hidden="true" />
        <span className="numeric-display text-lg text-accent">T+48</span>
        <span className="ml-auto font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-muted">
          Window
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {items.map((item) => (
          <div key={item.item} className="nav-preview-row">
            <span className="text-[0.625rem] font-semibold uppercase leading-snug text-foreground">
              {item.item}
            </span>
          </div>
        ))}
      </div>
      {previewLink({
        href: "/submission#checklist",
        onNavigate,
        className: "nav-preview-mini-link mt-2",
        children: <>Open checklist <ArrowRightIcon className="size-3.5" /></>,
      })}
    </div>
  );
}

function FairPlayPreview() {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {fairPlayCards.slice(0, 5).map((card, index) => (
        <div
          key={card.id}
          className={cn("nav-preview-fair-tile", index === 4 && "col-span-2")}
        >
          <span className="index-numeral">{String(index + 1).padStart(2, "0")}</span>
          <p className="mt-1 text-[0.6875rem] font-semibold uppercase leading-tight text-foreground">
            {card.title}
          </p>
          <p className="mt-1 line-clamp-2 text-[0.5625rem] leading-snug text-muted">
            {card.points[0]}
          </p>
        </div>
      ))}
    </div>
  );
}

function PrizesPreview() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {prizeTracks.map((track) => (
        <div key={track.id} className="nav-preview-prize-column">
          <p className="nav-preview-kicker">{track.name}</p>
          <ul className="mt-1 space-y-1">
            {track.awards.map((award) => (
              <li key={award.name} className="nav-preview-prize">
                <span className="text-[0.5625rem] font-semibold uppercase leading-tight">
                  {award.name}
                </span>
                <span className="ml-auto font-mono text-[0.5rem] text-primary">
                  {award.amount === TBA ? "TBA" : award.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FaqPreview({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="space-y-1">
      {homeFaqs.map((item) => (
        previewLink({
          href: `/faq#${item.id}`,
          onNavigate,
          className: "nav-preview-question",
          children: (
            <>
              <ArrowRightIcon className="size-3.5 shrink-0" />
              <span className="text-[0.625rem] font-semibold uppercase leading-snug">
                {item.question}
              </span>
            </>
          ),
        })
      ))}
    </div>
  );
}

function ContactPreview() {
  return (
    <div className="space-y-1">
      {contactChannels.map((channel) => (
        <div key={channel.id} className="nav-preview-row nav-preview-contact">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase leading-tight text-foreground">
              {channel.label}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[0.5625rem] leading-snug text-muted">
              {channel.description}
            </p>
          </div>
          <span className="ml-auto shrink-0 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-warning">
            {channel.url ? "Live" : "TBA"}
          </span>
        </div>
      ))}
    </div>
  );
}

export function NavPreviewPanel({
  id,
  onNavigate,
}: {
  id: NavPreviewId;
  onNavigate?: () => void;
}) {
  const content = useMemo(() => {
    switch (id) {
      case "/about":
        return <AboutPreview />;
      case "/tracks":
        return <TracksPreview onNavigate={onNavigate} />;
      case "/timeline":
        return <TimelinePreview onNavigate={onNavigate} />;
      case "/scoring":
        return <ScoringPreview />;
      case "/rules":
        return <RulesPreview onNavigate={onNavigate} />;
      case "/submission":
        return <SubmissionPreview onNavigate={onNavigate} />;
      case "/fair-play":
        return <FairPlayPreview />;
      case "/prizes":
        return <PrizesPreview />;
      case "/faq":
        return <FaqPreview onNavigate={onNavigate} />;
      case "/contact":
        return <ContactPreview />;
    }
  }, [id, onNavigate]);

  return (
    <div
      className="nav-preview-shell"
      data-preview={id}
      data-cursor="INSPECT"
    >
      <div className="nav-preview-grid">
        <FeaturedBlock id={id} onNavigate={onNavigate} />
        <div className="nav-preview-body">{content}</div>
      </div>
    </div>
  );
}
