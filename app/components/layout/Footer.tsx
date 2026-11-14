import Link from "next/link";
import { siteConfig, TBA } from "@/app/content/site-config";
import { EffectsToggle } from "./EffectsToggle";

export function Footer() {
  return (
    <footer className="site-footer border-t border-border bg-surface/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div
          className="relative flex items-end justify-between overflow-hidden border-b border-border/70 py-8 sm:py-10"
          aria-hidden="true"
        >
          <p className="wordmark-outline text-[clamp(2.6rem,10vw,8.5rem)] leading-none">
            KAKSHYA
          </p>
          <p className="devanagari pointer-events-none absolute -bottom-2 right-2 select-none text-[clamp(3rem,9vw,7.5rem)] leading-none text-primary/[0.06] sm:right-6">
            कक्षा
          </p>
          <div className="mb-2 hidden shrink-0 flex-col items-end gap-2 sm:flex">
            <span className="telemetry text-[0.5rem]">Escape velocity</span>
            <span className="font-mono text-[0.625rem] text-primary">
              ALT 400 KM
            </span>
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-md border border-dashed border-border-strong text-[0.5rem] tracking-[0.12em] text-muted"
                aria-hidden="true"
              >
                LOGO
              </span>
              <div className="leading-tight">
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-foreground">
                  KAKSHYA
                </p>
                <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.24em] text-muted">
                  2026 · IIST
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {siteConfig.subtitle}. Organised by {siteConfig.organiser}.
            </p>
            <p className="font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.12em] text-muted">
              {siteConfig.factsLine}
            </p>
            <p className="text-xs leading-relaxed text-muted">
              Rulebook (draft):{" "}
              {siteConfig.rulebookUrl ? (
                <Link
                  href={siteConfig.rulebookUrl}
                  className="text-primary underline underline-offset-4"
                >
                  Read the rulebook
                </Link>
              ) : (
                <span className="text-foreground">{TBA}</span>
              )}
            </p>
          </div>

          {siteConfig.footerGroups.map((group, groupIndex) => (
            <nav key={group.title} aria-label={`Footer: ${group.title}`}>
              <h2 className="flex items-center gap-2 font-mono text-[0.625rem] font-medium uppercase tracking-[0.22em] text-muted">
                <span className="text-primary/70">
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-foreground transition-colors hover:text-primary"
                      data-cursor="OPEN"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="space-y-6">
            <EffectsToggle />
            <div className="rounded-lg border border-dashed border-border p-3">
              <p className="telemetry text-[0.5rem] tracking-[0.2em]">
                Sponsors
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Partner slots:{" "}
                <span className="text-foreground">{TBA}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {siteConfig.name}. A national space hackathon by{" "}
            {siteConfig.organiser}.
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
            Saffron orbit · cyan telemetry · built to fly
          </p>
        </div>
      </div>
    </footer>
  );
}
