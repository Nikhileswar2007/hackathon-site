import type { Metadata } from "next";
import { SubmissionChecklist } from "@/app/components/sections/SubmissionChecklist";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { DataTable } from "@/app/components/ui/DataTable";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { submission } from "@/app/content/event-data";

export const metadata: Metadata = {
  title: "Submission",
  description:
    "Kakshya 2026 submission window, Beginner and Advanced submission packs, blind-judging rules and the pre-flight checklist.",
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function SubmissionPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Submission"
        title="Ship the right pack, before the hard close"
        description="The submission window and the exact pack for each track. The evaluated version is the repository snapshot at hard close."
      >
        <Button href="/timeline" variant="secondary">
          See the full schedule
        </Button>
      </PageHeader>

      <Callout title="Submission window: T+40 to T+48" tone="primary" className="mt-8">
        <p>{submission.window}</p>
      </Callout>

      <section className="mt-12" aria-labelledby="pack-heading">
        <SectionHeading
          id="pack-heading"
          eyebrow="Pack by track"
          title="What each track submits"
          description="Both tracks need a repository, README and signed Integrity Declaration. The report, demo and environment requirements differ."
        />
        <div className="mt-8">
          <DataTable
            caption="Beginner and Advanced submission requirements"
            columns={[
              { label: "Item" },
              { label: "Beginner" },
              { label: "Advanced" },
            ]}
            rows={submission.comparison.map((row) => [
              row.item,
              row.beginner,
              row.advanced,
            ])}
            rowHeaders
            minWidth="44rem"
          />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="submission-rules-heading">
        <SectionHeading
          id="submission-rules-heading"
          eyebrow="Integrity"
          title="Blind judging and penalties"
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Callout title="Blind judging" tone="warning">
            <p>{submission.blindJudging}</p>
          </Callout>
          <Callout title="Missing items and grace" tone="danger">
            <p>{submission.missingItem}</p>
            <p className="mt-2">{submission.grace}</p>
          </Callout>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="checklist-heading">
        <SectionHeading
          id="checklist-heading"
          eyebrow="Final checks"
          title="Before the hard close"
          description="Tick items as you verify them. This checklist uses local browser state only."
        />
        <div className="mt-8">
          <SubmissionChecklist />
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/fair-play" variant="secondary">
          Fair play
        </Button>
        <Button href="/register" variant="secondary">
          Register
        </Button>
      </div>
    </div>
  );
}
