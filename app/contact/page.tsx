import type { Metadata } from "next";
import { ContactForm } from "@/app/components/sections/ContactForm";
import { SpotlightGroup } from "@/app/components/fx/SpotlightGroup";
import { SpotlightTile } from "@/app/components/fx/SpotlightTile";
import { TiltCard } from "@/app/components/fx/TiltCard";
import { Badge } from "@/app/components/ui/Badge";
import { Button3D } from "@/app/components/ui/Button3D";
import { Callout } from "@/app/components/ui/Callout";
import { Card } from "@/app/components/ui/Card";
import { Frame } from "@/app/components/ui/Frame";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { contactChannels, ocContactNotes } from "@/app/content/event-data";
import { TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Kosmodrome 2026 organising committee: official channels, accessibility requests, integrity reports, technical support and a message preview.",
  alternates: {
    canonical: "/contact",
  },
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function ContactPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Contact"
        title="Reach the organising committee"
        description="Official channels for registration questions, accessibility requests, technical support and conduct or integrity reports."
      >
        <Button3D href="/faq" variant="secondary">
          Check the FAQ first
        </Button3D>
      </PageHeader>

      <section
        className="mt-12"
        aria-labelledby="channels-heading"
        data-hud="CHANNELS"
      >
        <SectionHeading
          id="channels-heading"
          eyebrow="Official channels"
          title="Where to reach the OC"
          description={`Official channel links: ${TBA}.`}
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {contactChannels.map((channel, index) => (
            <li key={channel.id} className="h-full">
              <TiltCard spotlight className="h-full rounded-xl">
                <Card className="flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-medium text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Badge tone={channel.url ? "success" : "warning"}>
                      {channel.url ? "Available" : "TBA"}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                    {channel.label}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {channel.description}
                  </p>
                  <div className="mt-5 border-t border-border pt-4">
                    {channel.url ? (
                      <a
                        href={channel.url}
                        target={
                          channel.url.startsWith("mailto:")
                            ? undefined
                            : "_blank"
                        }
                        rel={
                          channel.url.startsWith("mailto:")
                            ? undefined
                            : "noopener noreferrer"
                        }
                        className="rounded-sm text-sm font-medium text-primary underline underline-offset-4"
                      >
                        Open {channel.label}
                      </a>
                    ) : (
                      <p className="text-sm text-muted">
                        Link:{" "}
                        <span className="font-medium text-foreground">
                          {TBA}
                        </span>
                      </p>
                    )}
                  </div>
                </Card>
              </TiltCard>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-16 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <section aria-labelledby="contact-notes-heading">
          <SectionHeading
            id="contact-notes-heading"
            eyebrow="Before you write"
            title="Requests with a deadline"
            description="Some requests need to reach the OC before D-3 or during the event."
          />
          <SpotlightGroup className="mt-6">
            <ul className="space-y-4">
              {ocContactNotes.map((note) => (
                <SpotlightTile
                  as="li"
                  key={note.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <h3 className="text-sm font-semibold text-foreground">
                    {note.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {note.body}
                  </p>
                </SpotlightTile>
              ))}
            </ul>
          </SpotlightGroup>
        </section>

        <section aria-labelledby="contact-form-heading" data-hud="MESSAGE">
          <SectionHeading
            id="contact-form-heading"
            eyebrow="Message preview"
            title="Send a message to the OC"
            description="This form validates locally. Nothing is sent or stored in this preview."
          />
          <Frame className="mt-6 rounded-xl border border-border bg-surface p-5 shadow-[var(--elev-2)] sm:p-6">
            <ContactForm />
          </Frame>
        </section>
      </div>

      <Frame className="mt-12 rounded-xl">
        <Callout title="Conduct and integrity reports" tone="warning">
          <p>
            Anyone can report a conduct or integrity concern confidentially, and
            retaliation is prohibited. The reporting channel is being finalised.
            Reporting link: {TBA}.
          </p>
        </Callout>
      </Frame>
    </div>
  );
}
