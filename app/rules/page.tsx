import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/app/components/ui/Accordion";
import { Button3D } from "@/app/components/ui/Button3D";
import { Callout } from "@/app/components/ui/Callout";
import { Frame } from "@/app/components/ui/Frame";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { ruleSections } from "@/app/content/event-data";
import { siteConfig, TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: "Rules",
  description:
    "A short summary of the Kosmodrome 2026 draft rulebook: eligibility, teams, development, platform conduct, grievances, IP and data.",
  alternates: {
    canonical: "/rules",
  },
};

const accordionItems = ruleSections.map((section) => ({
  id: section.id,
  title: section.title,
  content: (
    <ul className="space-y-2.5">
      {section.bullets.map((bullet) => (
        <li key={bullet} className="flex gap-3">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  ),
}));

export default function RulesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <PageHeader
        eyebrow="Rulebook summary"
        title="The rules, in short"
        description="A compact summary of the draft rulebook. Open a section for the short bullet version."
      >
        <div className="flex flex-wrap gap-3">
          <Button3D href="/fair-play" variant="secondary">
            Fair-play framework
          </Button3D>
          <Button3D href="/submission" variant="secondary">
            Submission rules
          </Button3D>
        </div>
      </PageHeader>

      <Frame className="mt-8 rounded-xl">
        <Callout title="Rulebook status" tone="warning">
          <p>
            The rulebook is a draft. Full rulebook:{" "}
            {siteConfig.rulebookUrl ? (
              <Link
                href={siteConfig.rulebookUrl}
                className="text-primary underline underline-offset-4"
              >
                Read the rulebook
              </Link>
            ) : (
              <span className="font-medium text-foreground">{TBA}</span>
            )}
            .
          </p>
        </Callout>
      </Frame>

      <section
        className="mt-12"
        aria-labelledby="rule-sections-heading"
        data-hud="RULEBOOK"
      >
        <SectionHeading
          id="rule-sections-heading"
          eyebrow="Sections"
          title="Rulebook sections"
          description="Eligibility, teams, development, platform conduct, grievances, and IP and data."
        />
        <Frame className="mt-8 rounded-xl">
          <Accordion
            items={accordionItems}
            defaultOpenIds={["eligibility"]}
            className="rulebook"
          />
        </Frame>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button3D href="/register" variant="secondary">
          Register
        </Button3D>
        <Button3D href="/contact" variant="secondary">
          Ask the OC
        </Button3D>
      </div>
    </div>
  );
}
