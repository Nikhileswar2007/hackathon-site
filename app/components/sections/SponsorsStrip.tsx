import { TBA } from "@/app/content/site-config";
import { SectionHeading } from "../ui/SectionHeading";

export function SponsorsStrip() {
  return (
    <section
      aria-labelledby="sponsors-heading"
      className="border-y border-border bg-surface"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          id="sponsors-heading"
          eyebrow="Support"
          title="Sponsors"
          description={`Sponsors: ${TBA}.`}
        />
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Partner", "Partner", "Partner", "Partner"].map(
            (label, index) => (
              <li
                key={index}
                className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-background px-3 py-4 text-center"
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">
                  {label}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {TBA}
                </span>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
