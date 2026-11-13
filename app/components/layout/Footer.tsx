import Link from "next/link";
import { siteConfig, TBA } from "@/app/content/site-config";
import { OrbitMark } from "../ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <OrbitMark className="size-8 text-primary" />
              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-[0.08em] text-foreground">
                  {siteConfig.name}
                </p>
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              {siteConfig.subtitle}. Organised by {siteConfig.organiser}.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {siteConfig.factsLine}
            </p>
          </div>

          {siteConfig.footerGroups.map((group) => (
            <nav key={group.title} aria-label={`Footer: ${group.title}`}>
              <h2 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs leading-relaxed text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {siteConfig.name}. A national space hackathon by{" "}
            {siteConfig.organiser}.
          </p>
          <p>
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
      </div>
    </footer>
  );
}
