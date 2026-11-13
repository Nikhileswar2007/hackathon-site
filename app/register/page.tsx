import type { Metadata } from "next";
import { RegisterForm } from "@/app/components/sections/RegisterForm";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Callout } from "@/app/components/ui/Callout";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import {
  registrationEligibility,
  registrationSteps,
} from "@/app/content/event-data";
import { siteConfig, TBA } from "@/app/content/site-config";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Kakshya 2026 registration preview: eligibility, the five-step registration process, team details and the frontend-only registration form.",
};

const pageContainer =
  "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8";

export default function RegisterPage() {
  const isOpen = siteConfig.registrationOpen;
  const fee = siteConfig.registrationFee ?? TBA;

  return (
    <div className={pageContainer}>
      <PageHeader
        eyebrow="Register"
        title={isOpen ? "Register your team" : "Registration preview"}
        description="Check eligibility, prepare every member's details and see how the registration flow will work. Teams have two to four members."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={isOpen ? "success" : "warning"}>
            {isOpen ? "Registration open" : "Registration not open yet"}
          </Badge>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
            Fee: {fee}
          </span>
          <Button href="/rules" variant="secondary" size="sm">
            Read the draft rules
          </Button>
        </div>
      </PageHeader>

      {!isOpen ? (
        <Callout
          title="Preview: registration is not open yet"
          tone="warning"
          className="mt-8"
        >
          <p>
            This form validates locally and nothing is sent or stored.
            Registration dates, the fee and the official portal link are still
            to be announced.
          </p>
        </Callout>
      ) : null}

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="eligibility-heading">
          <SectionHeading
            id="eligibility-heading"
            eyebrow="Eligibility"
            title="Before you apply"
            description="Every member must meet these requirements before the team can be locked."
          />
          <ul className="mt-6 space-y-3">
            {registrationEligibility.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-foreground"
              >
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="process-heading">
          <SectionHeading
            id="process-heading"
            eyebrow="Process"
            title="Five steps to team lock"
            description="From eligibility checks to the mandatory briefing."
          />
          <ol className="mt-6 space-y-3">
            {registrationSteps.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary bg-primary-soft font-mono text-sm text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section
        className="mt-16 scroll-mt-24"
        id="registration-form"
        aria-labelledby="registration-form-heading"
      >
        <SectionHeading
          id="registration-form-heading"
          eyebrow="Form preview"
          title="Team registration"
          description="Team details, member details, college IDs and the required declarations. College ID files never leave this browser in the preview."
        />
        <div className="mt-8">
          <RegisterForm />
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/tracks" variant="secondary">
          Compare tracks
        </Button>
        <Button href="/faq" variant="secondary">
          Read the FAQ
        </Button>
        <Button href="/contact" variant="secondary">
          Ask the OC
        </Button>
      </div>
    </div>
  );
}
