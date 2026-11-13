import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/app/components/sections/FaqList";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { faqGroups } from "@/app/content/event-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Kakshya 2026 eligibility, team size and tracks, fees, the 48-hour event, AI tools, code reuse, judging and appeals.",
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function FaqPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="FAQ"
        title="Answers before you build"
        description="Eligibility, teams, tools, integrity, judging and appeals. Open a question to read the short answer."
      >
        <Button href="/contact" variant="secondary">
          Contact the OC
        </Button>
      </PageHeader>

      <section className="mt-12" aria-labelledby="faq-list-heading">
        <SectionHeading
          id="faq-list-heading"
          eyebrow="Browse by topic"
          title="Questions from teams"
          description="Four topic groups covering the details teams ask about most."
        />
        <FaqList
          groups={faqGroups}
          showGroupTitles
          className="mt-8"
        />
      </section>

      <Callout title="Still need an answer?" tone="primary" className="mt-12">
        <p>
          Use the official{" "}
          <Link
            href="/contact"
            className="text-primary underline underline-offset-4"
          >
            contact channels
          </Link>{" "}
          for registration questions, accessibility requests, technical support
          and integrity reports.
        </p>
      </Callout>
    </div>
  );
}
