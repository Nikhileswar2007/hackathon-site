import type { Metadata } from "next";
import Link from "next/link";
import { TiltCard } from "@/app/components/fx/TiltCard";
import { Button3D } from "@/app/components/ui/Button3D";
import { Callout } from "@/app/components/ui/Callout";
import { Card } from "@/app/components/ui/Card";
import { DataTable } from "@/app/components/ui/DataTable";
import { Frame } from "@/app/components/ui/Frame";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { fairPlayCards, fairPlayThreats } from "@/app/content/event-data";
import { StatusLight } from "@/app/components/ui/StatusLight";

export const metadata: Metadata = {
  title: "Fair play",
  description:
    "Kosmodrome 2026 fair play: sealed problems, leak tracing, integrity checks, blind judging, winner audits and the threat-control framework.",
  alternates: {
    canonical: "/fair-play",
  },
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function FairPlayPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Range safety"
        title="Sealed problems, traceable work, auditable scores"
        description="The framework behind the three guarantees. Every control is designed to be verifiable, not just promised."
      >
        <Button3D href="/scoring" variant="secondary">
          See scoring
        </Button3D>
      </PageHeader>

      <section
        className="mt-12"
        aria-labelledby="controls-heading"
        data-hud="CONTROLS"
      >
        <SectionHeading
          id="controls-heading"
          eyebrow="Controls"
          title="How the framework works"
          description="From key custody before kickoff to the winner audit after the results."
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {fairPlayCards.map((card) => (
            <TiltCard key={card.id} spotlight className="h-full rounded-xl">
              <Card className="h-full">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {card.title}
                  </h3>
                  <StatusLight tone="go">GO</StatusLight>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </TiltCard>
          ))}
        </div>
      </section>

      <section
        className="mt-16"
        aria-labelledby="threats-heading"
        data-hud="THREAT MODEL"
      >
        <SectionHeading
          id="threats-heading"
          eyebrow="Threat and control"
          title="What could go wrong, and the answer"
          description="A short threat model for the event."
        />
        <div className="mt-8">
          <DataTable
            caption="Fair-play threats and their controls"
            columns={[{ label: "Threat" }, { label: "Control" }]}
            rows={fairPlayThreats.map((row) => [
              row.threat,
              row.control,
            ])}
            rowHeaders
            minWidth="44rem"
          />
        </div>
      </section>

      <Frame className="mt-12 rounded-xl">
        <Callout title="Report an integrity concern" tone="primary">
          <p>
            Anyone can report an integrity concern confidentially, and
            retaliation is prohibited. Records are kept for 180 days. Use the{" "}
            <Link
              href="/contact"
              className="text-primary underline underline-offset-4"
            >
              contact channels
            </Link>{" "}
            to reach the OC.
          </p>
        </Callout>
      </Frame>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button3D href="/rules" variant="secondary">
          Read the rules
        </Button3D>
        <Button3D href="/submission" variant="secondary">
          Submission requirements
        </Button3D>
      </div>
    </div>
  );
}
