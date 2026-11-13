import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you are looking for does not exist on the Kakshya 2026 website.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-start px-4 py-24 sm:px-6 lg:px-8">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-primary">
        Error 404
      </p>
      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        This page drifted out of orbit.
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
        The page you are looking for does not exist. It may have moved, or the
        link may be incomplete.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Return home</Button>
        <Button href="/contact" variant="secondary">
          Contact the OC
        </Button>
      </div>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        Looking for rules or schedules? Start with the{" "}
        <Link
          href="/faq"
          className="text-primary underline underline-offset-4"
        >
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}
