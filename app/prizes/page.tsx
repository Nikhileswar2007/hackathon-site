import type { Metadata } from "next";
import { PrizeGrid } from "@/app/components/sections/PrizeGrid";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import {
  prizeCertificates,
  prizeConditions,
  prizeRules,
} from "@/app/content/event-data";
import { TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: "Prizes",
  description:
    "Kakshya 2026 prizes: Beginner and Advanced track awards, participation, merit and achievement certificates, prize conditions and payment rules.",
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function PrizesPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Prizes"
        title="Recognition for work that holds up"
        description={`Awards for both tracks, certificates for valid submissions and clear conditions for every winner. Prize amounts: ${TBA}.`}
      >
        <Button href="/register">Register your team</Button>
      </PageHeader>

      <section className="mt-12" aria-labelledby="track-awards-heading">
        <SectionHeading
          id="track-awards-heading"
          eyebrow="Track awards"
          title="Awards inside each track"
          description="Beginner and Advanced teams compete only within their own track. The tracks never compete against each other."
        />
        <div className="mt-8">
          <PrizeGrid />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="certificates-heading">
        <SectionHeading
          id="certificates-heading"
          eyebrow="Certificates"
          title="Recognition at every stage"
          description="Certificates follow valid submissions, finalist status and eventual results."
        />
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {prizeCertificates.map((certificate, index) => (
            <Card as="li" key={certificate.name} className="h-full">
              <span className="font-mono text-xs font-medium text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                {certificate.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {certificate.description}
              </p>
            </Card>
          ))}
        </ul>
      </section>

      <div className="mt-16 grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="prize-conditions-heading">
          <SectionHeading
            id="prize-conditions-heading"
            eyebrow="Conditions"
            title="Who can receive a prize"
            description="Every award is subject to the same checks."
          />
          <ul className="mt-8 space-y-3">
            {prizeConditions.map((condition) => (
              <li
                key={condition}
                className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="payment-rules-heading">
          <SectionHeading
            id="payment-rules-heading"
            eyebrow="Payment and vacancy"
            title="How awards are handled"
          />
          <Callout title="Prize rules" tone="primary" className="mt-8">
            <ul className="mt-1 space-y-2">
              {prizeRules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </Callout>
        </section>
      </div>

      <section
        className="mt-16 rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10"
        aria-labelledby="prizes-cta-heading"
      >
        <h2
          id="prizes-cta-heading"
          className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Build for the final field
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted">
          Registration opens at D-14. Event dates and the registration fee are{" "}
          {TBA}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/register">Register your team</Button>
          <Button href="/scoring" variant="secondary">
            See how teams are ranked
          </Button>
        </div>
      </section>
    </div>
  );
}
