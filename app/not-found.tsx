import type { Metadata } from "next";
import Link from "next/link";
import { SplitHeading } from "@/app/components/fx/SplitHeading";
import { ArrowRightIcon } from "@/app/components/ui/icons";
import { Button } from "@/app/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you are looking for does not exist on the Kakshya 2026 website.",
};

const quickLinks = [
  {
    href: "/tracks",
    label: "Tracks",
    description: "Compare the Beginner and Advanced problem sets.",
  },
  {
    href: "/timeline",
    label: "Timeline",
    description: "Checkpoints, deadlines and the 48-hour window.",
  },
  {
    href: "/faq",
    label: "FAQ",
    description: "Search eligibility, tools, judging and appeals.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Reach the OC through the official channels.",
  },
];

export default function NotFound() {
  return (
    <section className="hero-space relative overflow-hidden border-b border-border">
      <div
        className="bg-mission-grid pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-32 top-1/2 hidden size-[30rem] -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <div className="absolute inset-0 rounded-full border border-border" />
        <div className="absolute inset-[18%] rounded-full border border-primary/25" />
        <div className="absolute inset-[38%] rounded-full border border-accent/20" />
        <div className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_24px_var(--primary)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100svh-14rem)] w-full max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="telemetry flex items-center gap-2 text-primary">
          <span className="status-dot" aria-hidden="true" />
          Error 404 · Signal lost
        </p>

        <p
          className="display-title mt-5 text-[clamp(5rem,16vw,10rem)] leading-[0.78] text-primary/15"
          aria-hidden="true"
        >
          404
        </p>

        <SplitHeading
          as="h1"
          text="This page drifted out of orbit."
          className="display-title mt-3 max-w-3xl text-h1 text-foreground"
        />

        <p className="mt-4 max-w-xl text-lead text-muted">
          The page you are looking for does not exist. It may have moved, or
          the link may be incomplete. Pick a known heading below to re-enter
          the mission.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" size="lg">
            Return to launch pad
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact the OC
          </Button>
        </div>

        <div className="mt-12">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">
            Known coordinates
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-border bg-surface/70 p-4 transition-colors hover:border-primary/50 hover:bg-surface-raised"
              >
                <span className="flex items-center justify-between gap-3 font-medium text-foreground">
                  {link.label}
                  <ArrowRightIcon className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
