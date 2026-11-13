import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/app/components/sections/Hero";
import { FaqList } from "@/app/components/sections/FaqList";
import { SponsorsStrip } from "@/app/components/sections/SponsorsStrip";
import { TimelineView } from "@/app/components/sections/TimelineView";
import { TrackCards } from "@/app/components/sections/TrackCards";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { StatCard } from "@/app/components/ui/StatCard";
import {
  faqGroups,
  guarantees,
  homeFaqIds,
  homeTimeline,
  prizeCertificates,
  prizeTracks,
  stats,
  tracks,
  type FaqGroup,
} from "@/app/content/event-data";
import { siteConfig, TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description: siteConfig.description,
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

const faqById = new Map(
  faqGroups.flatMap((group) =>
    group.items.map((item) => [item.id, item] as const),
  ),
);

const homeFaqItems = homeFaqIds.flatMap((id) => {
  const item = faqById.get(id);
  return item ? [item] : [];
});

const homeFaqGroup: FaqGroup = {
  id: "home-faq",
  title: "FAQ preview",
  items: homeFaqItems,
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className={pageContainer} aria-labelledby="stats-heading">
        <SectionHeading
          id="stats-heading"
          eyebrow="At a glance"
          title="The shape of the challenge"
          description="Two tracks, 48 hours and a final field of eight teams per track."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section
        className="border-y border-border bg-surface"
        aria-labelledby="guarantees-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            id="guarantees-heading"
            eyebrow="Fair by design"
            title="Built on three guarantees"
            description="The event is designed to keep problems sealed, work traceable and scores open to audit."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {guarantees.map((guarantee, index) => (
              <Card as="li" key={guarantee.title} className="h-full">
                <span className="font-mono text-xs font-medium text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                  {guarantee.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {guarantee.description}
                </p>
              </Card>
            ))}
          </ul>
        </div>
      </section>

      <section className={pageContainer} aria-labelledby="tracks-heading">
        <SectionHeading
          id="tracks-heading"
          eyebrow="Choose a lane"
          title="Two tracks, separate problem sets"
          description="Beginner teams get a guided build. Advanced teams get open-ended mission problems. Tracks never compete against each other."
        />
        <div className="mt-8">
          <TrackCards tracks={tracks} />
        </div>
      </section>

      <section
        className="border-y border-border bg-surface"
        aria-labelledby="timeline-preview-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="timeline-preview-heading"
              eyebrow="The arc"
              title="From registration to orbit"
              description="Five key moments from the full event schedule."
            />
            <Button href="/timeline" variant="secondary" size="sm">
              View full timeline
            </Button>
          </div>
          <div className="mt-8">
            <TimelineView items={homeTimeline} />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            All times IST. Clock times assume a 10:00 IST kickoff.
          </p>
        </div>
      </section>

      <section className={pageContainer} aria-labelledby="prizes-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="prizes-heading"
            eyebrow="Recognition"
            title="Prizes and certificates"
            description="Awards for both tracks, chosen from the finalists. Amounts are to be announced."
          />
          <Button href="/prizes" variant="secondary" size="sm">
            See all prizes
          </Button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {prizeTracks.map((track) => (
            <Card key={track.id}>
              <div className="flex items-center justify-between gap-3">
                <Badge
                  tone={track.id === "beginner" ? "primary" : "accent"}
                >
                  {track.name}
                </Badge>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  Amounts: {TBA}
                </span>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {track.awards.map((award) => (
                  <li
                    key={award.name}
                    className="rounded-full border border-border bg-surface-raised px-3 py-1 text-sm text-foreground"
                  >
                    {award.name}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {prizeCertificates.map((certificate, index) => (
            <span key={certificate.name}>
              {index > 0 ? " · " : ""}
              <span className="text-foreground">{certificate.name}</span> —{" "}
              {certificate.description}
            </span>
          ))}
        </p>
      </section>

      <section
        className="border-y border-border bg-surface"
        aria-labelledby="faq-preview-heading"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              id="faq-preview-heading"
              eyebrow="Questions"
              title="A few things teams ask"
            />
            <Button href="/faq" variant="secondary" size="sm">
              Read all FAQs
            </Button>
          </div>
          <FaqList
            groups={[homeFaqGroup]}
            showGroupTitles={false}
            className="mt-8"
          />
        </div>
      </section>

      <SponsorsStrip />

      <section className="pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="hero-space rounded-2xl border border-border px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Register
            </p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ready for 48 hours to orbit?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
              Registration opens at D-14. Event dates and fees: {TBA}. The
              rulebook is a draft.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/register" size="lg">
                Register
              </Button>
              <Button href="/rules" size="lg" variant="secondary">
                Read the rules
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted">
              Already exploring?{" "}
              <Link
                href="/tracks"
                className="text-primary underline underline-offset-4"
              >
                Compare the tracks
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
