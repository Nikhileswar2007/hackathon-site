import { siteConfig, TBA } from "@/app/content/site-config";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Countdown } from "./Countdown";

export function Hero() {
  return (
    <section className="hero-space border-b border-border">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:px-8 lg:py-28">
        <div className="max-w-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">{siteConfig.subtitle}</Badge>
            <Badge tone={siteConfig.registrationOpen ? "success" : "warning"}>
              {siteConfig.registrationOpen
                ? "Registration open"
                : "Registration not open yet"}
            </Badge>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {siteConfig.name}
            <span className="mt-2 block text-primary">
              {siteConfig.tagline}
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted">
            A national-level, online space hackathon. Beginner and Advanced
            teams get 48 hours to turn a sealed mission brief into a working
            submission.
          </p>

          <p className="font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-muted">
            {siteConfig.factsLine}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button href={siteConfig.registerCta.href} size="lg">
              {siteConfig.registerCta.label}
            </Button>
            <Button href="/rules" size="lg" variant="secondary">
              Read the rules
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-muted">
            Rulebook draft. Event dates and fees: {TBA}.
          </p>
        </div>

        <div className="w-full max-w-md lg:justify-self-end">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
