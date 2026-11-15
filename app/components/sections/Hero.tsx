import { siteConfig, TBA } from "@/app/content/site-config";
import { ExtrudedTitle } from "../fx/ExtrudedTitle";
import { TypeLine } from "../fx/TypeLine";
import { PowerOn } from "../fx/PowerOn";
import { Magnetic } from "../fx/Magnetic";
import { ScrambleText } from "../fx/ScrambleText";
import { Badge } from "../ui/Badge";
import { Button3D } from "../ui/Button3D";
import { DepthStack } from "../ui/DepthStack";
import { ArrowRightIcon } from "../ui/icons";
import { Countdown } from "./Countdown";
import { TelemetryTicker } from "../fx/TelemetryTicker";

export function Hero() {
  return (
    <section
      className="hero-space relative overflow-hidden border-b border-border"
      id="spaceport"
      data-hud="SPACEPORT GATE"
    >
      <div
        className="bg-mission-grid pointer-events-none absolute inset-0 opacity-25"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:min-h-[calc(100svh-4.5rem)] lg:justify-center lg:px-8 lg:pb-14 lg:pt-14">
        <TelemetryTicker className="pointer-events-none absolute left-0 right-0 top-0 z-10" />
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
          <div className="max-w-2xl pt-8 sm:pt-10">
            <div className="flex flex-wrap items-center gap-2">
              <PowerOn delay={40}>
                <Badge tone="primary">{siteConfig.subtitle}</Badge>
              </PowerOn>
              <PowerOn delay={110}>
                <Badge
                  tone={siteConfig.registrationOpen ? "success" : "warning"}
                >
                  {siteConfig.registrationOpen
                    ? "Registration open"
                    : "Registration not open yet"}
                </Badge>
              </PowerOn>
              <PowerOn delay={180}>
                <span className="telemetry index-numeral">2026</span>
              </PowerOn>
            </div>

            <p className="telemetry mt-6 flex items-center gap-2 text-primary">
              <span className="status-dot" aria-hidden="true" />
              <span className="bracket-label">
                <ScrambleText text="SPACEPORT GATE" />
              </span>
            </p>

            <ExtrudedTitle
              text="KOSMODROME"
              className="display-title text-hero scanline-text mt-3 max-w-xl text-balance uppercase leading-[1.02] tracking-[-0.02em] text-foreground"
            />

            <p className="display-oxanium mt-2 text-[clamp(1.15rem,3.4vw,1.9rem)] uppercase leading-none text-accent">
              48 Hours to Orbit
            </p>

            <div className="mt-5 min-h-[6.4rem] max-w-xl text-lead text-muted sm:min-h-[5.4rem] lg:min-h-[3.4rem]">
              <TypeLine
                as="p"
                text="A kosmodrome is a spaceport: the place every mission starts. Kosmodrome is where your idea leaves the pad."
                duration={1000}
              />
            </div>

            <p className="mt-6 border-l border-primary/40 pl-4 font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.16em] text-muted">
              {siteConfig.factsLine}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Button3D
                  href={siteConfig.registerCta.href}
                  size="lg"
                  data-cursor="LAUNCH"
                >
                  {siteConfig.registerCta.label}
                  <ArrowRightIcon className="size-4" />
                </Button3D>
              </Magnetic>
              <Magnetic>
                <Button3D href="/rules" size="lg" variant="secondary">
                  Read the rules
                </Button3D>
              </Magnetic>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              Rulebook draft. Event dates and fees: {TBA}.
            </p>
          </div>

          <div
            className="relative w-full max-w-md justify-self-end self-end lg:justify-self-end"
            data-cursor="DRAG"
          >
            <div
              className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/5 blur-2xl"
              aria-hidden="true"
            />
            <DepthStack layers={2} className="rounded-2xl">
              <Countdown />
            </DepthStack>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-border/60 pt-5 lg:mt-14">
          <span className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue-track" />
            Begin ascent
          </span>
          <div
            className="hidden items-center gap-4 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-muted sm:flex"
            aria-hidden="true"
          >
            <span>T- TBA</span>
            <span className="h-px w-8 bg-border" />
            <span>SPACEPORT 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
