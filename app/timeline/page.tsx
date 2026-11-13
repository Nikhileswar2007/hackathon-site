import type { Metadata } from "next";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { TimelineView } from "@/app/components/sections/TimelineView";
import { timeline } from "@/app/content/event-data";
import { siteConfig, TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "The full Kakshya 2026 schedule: registration, kickoff, three checkpoints, hard close, blind judging, finals and results.",
};

export default function TimelinePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeader
        eyebrow="Schedule"
        title="From registration to the final result"
        description="Twenty moments across registration, the 48-hour build, judging and the closing ceremony. Checkpoints are highlighted."
      >
        <Button href="/rules" variant="secondary">
          Read the rules
        </Button>
      </PageHeader>

      <Callout title="Time base" tone="primary" className="mt-8">
        <p>All times IST. Clock times assume a 10:00 IST kickoff.</p>
        {siteConfig.eventStartISO ? null : (
          <p className="mt-2 text-muted">Calendar dates: {TBA}.</p>
        )}
      </Callout>

      <section className="mt-12" aria-labelledby="full-timeline-heading">
        <SectionHeading
          id="full-timeline-heading"
          eyebrow="Full schedule"
          title="Every milestone and deadline"
        />
        <div className="mt-8">
          <TimelineView items={timeline} />
        </div>
      </section>
    </div>
  );
}
