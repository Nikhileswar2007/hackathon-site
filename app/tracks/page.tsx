import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { Card } from "@/app/components/ui/Card";
import { DataTable } from "@/app/components/ui/DataTable";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { trackRules, tracks, trackThemesNote } from "@/app/content/event-data";

export const metadata: Metadata = {
  title: "Tracks",
  description:
    "Compare the Beginner and Advanced tracks at Kakshya 2026: eligibility, problem style, evaluation, submission pack, finalists and themes.",
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

const beginnerTrack = tracks[0];
const advancedTrack = tracks[1];

const comparisonRows = [
  {
    label: "Who it is for",
    beginner: beginnerTrack.audience,
    advanced: advancedTrack.audience,
  },
  {
    label: "Team size",
    beginner: beginnerTrack.teamSize,
    advanced: advancedTrack.teamSize,
  },
  {
    label: "Problem style",
    beginner: beginnerTrack.problemStyle.join(" "),
    advanced: advancedTrack.problemStyle.join(" "),
  },
  {
    label: "Evaluation",
    beginner: beginnerTrack.evaluation.join(" "),
    advanced: advancedTrack.evaluation.join(" "),
  },
  {
    label: "Submission pack",
    beginner: beginnerTrack.submissionPack.join(", "),
    advanced: advancedTrack.submissionPack.join(", "),
  },
  {
    label: "Finalists",
    beginner: beginnerTrack.finalists,
    advanced: advancedTrack.finalists,
  },
];

export default function TracksPage() {
  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Tracks"
        title="Two tracks. Separate problem sets."
        description="The most senior member sets the track. Opting up is allowed; moving down is never allowed. Tracks never compete against each other."
      >
        <Button href="/register">Register your team</Button>
      </PageHeader>

      <section className="mt-12" aria-labelledby="comparison-heading">
        <SectionHeading
          id="comparison-heading"
          eyebrow="Side by side"
          title="Beginner vs Advanced"
          description="Same 48-hour window, different starting points and submission packs."
        />
        <div className="mt-8">
          <DataTable
            caption="Comparison of the Beginner and Advanced tracks"
            columns={[
              { label: "Detail" },
              { label: "Beginner" },
              { label: "Advanced" },
            ]}
            rows={[
              ...comparisonRows.map((row) => [
                row.label,
                row.beginner,
                row.advanced,
              ]),
              [
                "Scoring",
                <Link
                  key="beginner-scoring"
                  href="/scoring"
                  className="text-primary underline underline-offset-4"
                >
                  Criteria and weights
                </Link>,
                <Link
                  key="advanced-scoring"
                  href="/scoring"
                  className="text-primary underline underline-offset-4"
                >
                  Criteria and weights
                </Link>,
              ],
            ]}
            rowHeaders
            minWidth="48rem"
          />
        </div>
      </section>

      <section className="mt-16" aria-labelledby="themes-heading">
        <SectionHeading
          id="themes-heading"
          eyebrow="Problem space"
          title="Indicative themes"
          description={trackThemesNote}
        />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {tracks.map((track) => (
            <Card
              key={track.id}
              id={track.id}
              className="h-full scroll-mt-24"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge
                  tone={track.id === "beginner" ? "primary" : "accent"}
                >
                  {track.name}
                </Badge>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  {track.finalists}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {track.name} themes
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {track.summary}
              </p>
              <ul className="mt-4 space-y-2.5">
                {track.themes.map((theme) => (
                  <li
                    key={theme}
                    className="flex gap-3 text-sm leading-relaxed text-foreground"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="track-rules-heading">
        <SectionHeading
          id="track-rules-heading"
          eyebrow="Boundaries"
          title="Track rules"
        />
        <Callout title="Track assignment is final at D-3" tone="primary">
          <ul className="mt-1 space-y-2">
            {trackRules.map((rule) => (
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

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/scoring" variant="secondary">
          See scoring
        </Button>
        <Button href="/submission" variant="secondary">
          Submission requirements
        </Button>
      </div>
    </div>
  );
}
