import type { Metadata } from "next";
import { ScoringTables } from "@/app/components/sections/ScoringTables";
import { Badge, type BadgeTone } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { Card } from "@/app/components/ui/Card";
import { DataTable } from "@/app/components/ui/DataTable";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import {
  benchmark,
  disqualifications,
  finalScore,
  judgingProcess,
  penalties,
  scoringBands,
  tieBreakers,
} from "@/app/content/event-data";

export const metadata: Metadata = {
  title: "Scoring",
  description:
    "Kakshya 2026 scoring: Beginner, Advanced and Finals criteria, bands, benchmark formula, judging process, penalties and tie-breakers.",
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

const bandTones: Record<string, BadgeTone> = {
  Exceptional: "success",
  Strong: "primary",
  Adequate: "warning",
  Weak: "danger",
};

export default function ScoringPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Scoring"
        title="How the 100 points are built"
        description="Every judged criterion uses the same four bands. Stage 1 decides the top 8, and Stage 2 decides the final order inside that group."
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/fair-play" variant="secondary">
            How judging is protected
          </Button>
          <Button href="/submission" variant="secondary">
            Submission requirements
          </Button>
        </div>
      </PageHeader>

      <section className="mt-12" aria-labelledby="criteria-heading">
        <SectionHeading
          id="criteria-heading"
          eyebrow="Criteria"
          title="Beginner, Advanced and Finals"
          description="Each tab shows the weights and who scores each criterion. Bars show the share of 100."
        />
        <div className="mt-8">
          <ScoringTables />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="bands-heading">
        <SectionHeading
          id="bands-heading"
          eyebrow="Bands"
          title="The four scoring bands"
          description="Every judged criterion, on both tracks, uses this same scale."
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scoringBands.map((band) => (
            <Card as="li" key={band.name}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {band.name}
                </h3>
                <Badge tone={bandTones[band.name] ?? "neutral"}>
                  {band.range}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {band.description}
              </p>
            </Card>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="benchmark-heading">
        <SectionHeading
          id="benchmark-heading"
          eyebrow="Advanced track"
          title={benchmark.title}
          description="Benchmark performance is scored on the hidden private split."
        />
        <Card className="mt-8">
          <pre
            tabIndex={0}
            aria-label="Benchmark formula"
            className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-primary sm:text-sm"
          >
            <code>{benchmark.formula}</code>
          </pre>
          <ul className="mt-4 space-y-2">
            {benchmark.notes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-16" aria-labelledby="final-score-heading">
        <SectionHeading
          id="final-score-heading"
          eyebrow="Final ranking"
          title={finalScore.title}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              Top 8
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              {finalScore.top8}
            </p>
          </Card>
          <Card>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary">
              Ranked 9 and below
            </p>
            <p className="mt-3 text-base leading-relaxed text-foreground">
              {finalScore.rest}
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="judging-heading">
        <SectionHeading
          id="judging-heading"
          eyebrow="Process"
          title="How judging runs"
        />
        <ol className="mt-8 space-y-4">
          {judgingProcess.map((step, index) => (
            <li
              key={step}
              className="flex gap-4 rounded-xl border border-border bg-surface p-5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary bg-primary-soft font-mono text-sm text-primary">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16" aria-labelledby="penalties-heading">
        <SectionHeading
          id="penalties-heading"
          eyebrow="Penalties"
          title="Deductions from Stage 1"
          description="Penalties are cumulative and deducted from the Stage 1 score."
        />
        <div className="mt-8">
          <DataTable
            caption="Stage 1 penalties and deductions"
            columns={[
              { label: "Penalty" },
              { label: "Deduction", align: "right" },
            ]}
            rows={penalties.map((penalty) => [
              penalty.item,
              <span
                key={`${penalty.item}-deduction`}
                className="font-mono text-danger"
              >
                {penalty.deduction}
              </span>,
            ])}
            rowHeaders
            minWidth="34rem"
          />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="tie-breakers-heading">
        <SectionHeading
          id="tie-breakers-heading"
          eyebrow="Ties"
          title="Tie-breakers, in order"
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2">
          {tieBreakers.map((tieBreaker, index) => (
            <li
              key={tieBreaker}
              className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground"
            >
              <span className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{tieBreaker}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16" aria-labelledby="disqualification-heading">
        <SectionHeading
          id="disqualification-heading"
          eyebrow="Integrity"
          title="Disqualification grounds"
        />
        <Callout
          title="These apply immediately"
          tone="danger"
          className="mt-8"
        >
          <ul className="mt-1 space-y-2">
            {disqualifications.map((ground) => (
              <li key={ground} className="flex gap-3">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-danger"
                  aria-hidden="true"
                />
                <span>{ground}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </section>
    </div>
  );
}
