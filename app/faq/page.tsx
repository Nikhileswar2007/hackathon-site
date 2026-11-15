import type { Metadata } from "next";
import Link from "next/link";
import { FaqExplorer } from "@/app/components/sections/FaqExplorer";
import { Button3D } from "@/app/components/ui/Button3D";
import { Callout } from "@/app/components/ui/Callout";
import { Frame } from "@/app/components/ui/Frame";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { faqGroups } from "@/app/content/event-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Kosmodrome 2026 eligibility, team size and tracks, fees, the 48-hour event, AI tools, code reuse, judging and appeals.",
  alternates: {
    canonical: "/faq",
  },
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
        <Button3D href="/contact" variant="secondary">
          Contact the OC
        </Button3D>
      </PageHeader>

      <section className="mt-12" aria-labelledby="faq-list-heading">
        <SectionHeading
          id="faq-list-heading"
          eyebrow="Search and filter"
          title="Questions from teams"
          description={`Search every answer, or filter across ${faqGroups.length} topic groups.`}
        />
        <div className="mt-8">
          <FaqExplorer groups={faqGroups} />
        </div>
      </section>

      <Frame className="mt-12 rounded-xl">
        <Callout title="Still need an answer?" tone="primary">
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
      </Frame>
    </div>
  );
}
