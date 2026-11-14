import { siteConfig, TBA } from "@/app/content/site-config";
import { Magnetic } from "../fx/Magnetic";
import { SplitHeading } from "../fx/SplitHeading";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ArrowRightIcon } from "../ui/icons";
import { Countdown } from "./Countdown";

export function Hero() {
  return (
    <section
      className="hero-space relative overflow-hidden border-b border-border"
      data-hud="LAUNCH PAD"
    >
      <div
        className="bg-mission-grid pointer-events-none absolute inset-0 opacity-25"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:min-h-[calc(100svh-7rem)] lg:justify-center lg:px-8 lg:pb-14 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{siteConfig.subtitle}</Badge>
              <Badge
                tone={siteConfig.registrationOpen ? "success" : "warning"}
              >
                {siteConfig.registrationOpen
                  ? "Registration open"
                  : "Registration not open yet"}
              </Badge>
            </div>

            <p className="telemetry mt-6 flex items-center gap-2 text-primary">
              <span className="status-dot" aria-hidden="true" />
              {siteConfig.name} · Mission brief 01
            </p>

            <SplitHeading
              as="h1"
              text={siteConfig.tagline}
              className="display-title text-hero mt-4 max-w-xl text-balance uppercase tracking-[-0.04em] text-foreground"
            />

            <p className="mt-5 max-w-xl text-lead text-muted">
              A national-level, online space hackathon. Beginner and Advanced
              teams get 48 hours to turn a sealed mission brief into a working
              submission.
            </p>

            <p className="mt-6 border-l border-primary/40 pl-4 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.16em] text-muted">
              {siteConfig.factsLine}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Button href={siteConfig.registerCta.href} size="lg">
                  {siteConfig.registerCta.label}
                  <ArrowRightIcon className="size-4" />
                </Button>
              </Magnetic>
              <Magnetic>
                <Button href="/rules" size="lg" variant="secondary">
                  Read the rules
                </Button>
              </Magnetic>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Rulebook draft. Event dates and fees: {TBA}.
            </p>
          </div>

          <div className="relative w-full max-w-md lg:justify-self-end">
            <div
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/5 blur-2xl"
              aria-hidden="true"
            />
            <Countdown />
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-border/60 pt-6 lg:mt-16">
          <span className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue-track" />
            Begin ascent
          </span>
          <div
            className="hidden items-center gap-4 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-muted sm:flex"
            aria-hidden="true"
          >
            <span>ALT 000 KM</span>
            <span className="h-px w-8 bg-border" />
            <span>T− TBA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
