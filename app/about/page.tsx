import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/app/components/fx/Reveal";
import { SpotlightGroup } from "@/app/components/fx/SpotlightGroup";
import { SpotlightTile } from "@/app/components/fx/SpotlightTile";
import { TiltCard } from "@/app/components/fx/TiltCard";
import { BeamBorder } from "@/app/components/ui/BeamBorder";
import { Button3D } from "@/app/components/ui/Button3D";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { about, guarantees } from "@/app/content/event-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Kosmodrome 2026, the IIST National Space Hackathon: a 48-hour national-level online event with Beginner and Advanced tracks.",
  alternates: {
    canonical: "/about",
  },
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function AboutPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="About"
        title="A national space hackathon, built for 48 hours"
        description="Kosmodrome 2026 is the IIST National Space Hackathon: national level, online, and built around a single 48-hour build window."
      />

      <div className="mt-12 space-y-16">
        <section
          className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start"
          aria-labelledby="story-heading"
        >
          <div>
            <SectionHeading
              id="story-heading"
              eyebrow="The event"
              title="What Kosmodrome is"
            />
            <div className="mt-5 space-y-4">
              {about.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <Reveal delay={120} className="lg:mt-16">
            <TiltCard spotlight className="h-full rounded-xl">
              <Card className="h-full">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Organiser
                </p>
                <p className="mt-3 text-lg font-medium leading-relaxed text-foreground">
                  {about.organiser}
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex rounded-sm text-sm font-medium text-primary underline underline-offset-4"
                >
                  Contact the OC
                </Link>
              </Card>
            </TiltCard>
          </Reveal>
        </section>

        <section aria-labelledby="about-guarantees-heading">
          <SectionHeading
            id="about-guarantees-heading"
            eyebrow="Fair by design"
            title="Three guarantees"
            description="These commitments apply to every team on both tracks."
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {guarantees.map((guarantee, index) => (
              <Reveal
                as="li"
                key={guarantee.title}
                delay={index * 70}
                className="h-full"
              >
                <TiltCard spotlight className="h-full rounded-xl">
                  <Card className="h-full hover:border-border-strong">
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
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </section>

        <section aria-labelledby="who-can-join-heading">
          <SectionHeading
            id="who-can-join-heading"
            eyebrow="Eligibility"
            title="Who can join"
            description="Kosmodrome 2026 is open to students at recognised Indian institutions, with a separate Advanced route for graduates."
          />
          <SpotlightGroup className="mt-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {about.whoCanJoin.map((item) => (
                <SpotlightTile
                  as="li"
                  key={item}
                  className="condition-row flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground"
                >
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </SpotlightTile>
              ))}
            </ul>
          </SpotlightGroup>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button3D href="/tracks" variant="secondary">
              Compare tracks
            </Button3D>
            <Button3D href="/register" data-cursor="LAUNCH">
              Register
            </Button3D>
          </div>
        </section>

        <section aria-labelledby="process-heading">
          <SectionHeading
            id="process-heading"
            eyebrow="The clock"
            title="How the 48 hours work"
            description="Four stages, from a sealed brief to a judged result."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.process.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 70}
                className="h-full"
              >
                <TiltCard spotlight className="h-full rounded-xl">
                  <Card className="h-full hover:border-border-strong">
                    <span className="font-mono text-xs font-medium text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </Card>
                </TiltCard>
              </Reveal>
            ))}
          </ol>
        </section>

        <Reveal>
          <BeamBorder className="rounded-2xl">
            <section
              className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-[var(--elev-2)] sm:p-8"
              aria-labelledby="about-contact-heading"
            >
              <div
                className="bg-mission-grid pointer-events-none absolute inset-0 opacity-20"
                aria-hidden="true"
              />
              <div className="relative">
                <h2
                  id="about-contact-heading"
                  className="text-2xl font-semibold tracking-tight text-foreground"
                >
                  Questions before you register?
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
                  Start with the rules, the track comparison and the FAQ. For
                  anything else, contact the organising committee.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button3D href="/contact" variant="secondary">
                    Contact
                  </Button3D>
                  <Button3D href="/rules" variant="secondary">
                    Read the rules
                  </Button3D>
                </div>
              </div>
            </section>
          </BeamBorder>
        </Reveal>
      </div>
    </div>
  );
}
