import Link from "next/link";
import { brand, siteConfig, TBA } from "@/app/content/site-config";
import { SpotlightGroup } from "../fx/SpotlightGroup";
import { SpotlightTile } from "../fx/SpotlightTile";
import { TextRoll } from "../fx/TextRoll";
import { BrandMark } from "../ui/BrandMark";
import { Wordmark } from "../ui/Wordmark";
import { GantryDivider } from "../fx/GantryDivider";
import { EffectsToggle } from "./EffectsToggle";

export function Footer() {
  return (
    <footer className="site-footer border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div
          className="relative flex items-end justify-between overflow-hidden border-b border-border/70 py-8 sm:py-10"
          aria-hidden="true"
        >
          <Wordmark size="footer" />
          <p
            className="cyrillic-watermark pointer-events-none absolute -bottom-2 right-2 select-none text-[clamp(3rem,9vw,7.5rem)] leading-none text-primary/[0.06] sm:right-6"
            aria-hidden="true"
          >
            {brand.watermark}
          </p>
          <div className="mb-2 hidden shrink-0 flex-col items-end gap-2 sm:flex">
            <span className="telemetry text-[0.5rem]">LAUNCH COMPLEX</span>
            <span className="font-mono text-[0.625rem] text-primary">
              ALL SYSTEMS GO
            </span>
          </div>
        </div>

        <SpotlightGroup className="grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <SpotlightTile className="max-w-sm space-y-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span
                className="grid size-9 shrink-0 place-items-center text-primary"
                aria-hidden="true"
              >
                <BrandMark className="size-9" />
              </span>
              <div className="leading-tight">
                <Wordmark className="display-orbitron text-[0.78rem] uppercase" />
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
          </SpotlightTile>

          {siteConfig.footerGroups.map((group, groupIndex) => (
            <SpotlightTile
              as="nav"
              key={group.title}
              aria-label={`Footer: ${group.title}`}
              className="rounded-lg"
            >
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
                      <TextRoll>{link.label}</TextRoll>
                    </Link>
                  </li>
                ))}
              </ul>
            </SpotlightTile>
          ))}

          <SpotlightTile className="space-y-6 rounded-lg">
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
          </SpotlightTile>
        </SpotlightGroup>

        <GantryDivider className="my-2 text-border-strong" />
        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {brand.year} {brand.name}. A national space hackathon by{" "}
            {siteConfig.organiser}.
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
            T-minus · all systems go
          </p>
        </div>
      </div>
    </footer>
  );
}
