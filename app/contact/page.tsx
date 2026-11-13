import type { Metadata } from "next";
import { ContactForm } from "@/app/components/sections/ContactForm";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { Card } from "@/app/components/ui/Card";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { contactChannels, ocContactNotes } from "@/app/content/event-data";
import { TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the Kakshya 2026 organising committee: official channels, accessibility requests, integrity reports, technical support and a message preview.",
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
        <Button href="/faq" variant="secondary">
          Check the FAQ first
        </Button>
      </PageHeader>

      <section className="mt-12" aria-labelledby="channels-heading">
        <SectionHeading
          id="channels-heading"
          eyebrow="Official channels"
          title="Where to reach the OC"
          description={`Channel links are ${TBA}. Each channel will use the same official source for every team.`}
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {contactChannels.map((channel, index) => (
            <Card as="li" key={channel.id} className="flex h-full flex-col">
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
                      channel.url.startsWith("mailto:") ? undefined : "_blank"
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
                    <span className="font-medium text-foreground">{TBA}</span>
                  </p>
                )}
              </div>
            </Card>
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
          <ul className="mt-6 space-y-4">
            {ocContactNotes.map((note) => (
              <li
                key={note.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {note.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {note.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="contact-form-heading">
          <SectionHeading
            id="contact-form-heading"
            eyebrow="Message preview"
            title="Send a message to the OC"
            description="This form validates locally. Nothing is sent or stored in this preview."
          />
          <Card className="mt-6">
            <ContactForm />
          </Card>
        </section>
      </div>

      <Callout
        title="Conduct and integrity reports"
        tone="warning"
        className="mt-12"
      >
        <p>
          Anyone can report a conduct or integrity concern confidentially, and
          retaliation is prohibited. The reporting channel is being finalised;
          its link is {TBA}.
        </p>
      </Callout>
    </div>
  );
}
