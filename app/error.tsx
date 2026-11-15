"use client";

import { useEffect } from "react";
import { Button3D } from "@/app/components/ui/Button3D";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="hero-space relative overflow-hidden border-b border-border">
      <div
        className="bg-mission-grid pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-[calc(100svh-14rem)] w-full max-w-6xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <p className="telemetry flex items-center gap-2 text-danger">
          <span className="status-dot status-dot-danger" aria-hidden="true" />
          Error 500 · System fault
        </p>
        <h1 className="display-oxanium mt-5 max-w-3xl text-h1 text-foreground">
          This console went dark.
        </h1>
        <p className="mt-4 max-w-xl text-lead text-muted">
          The page failed to load. The mission control systems will retry the
          request when you try again.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button3D type="button" onClick={retry} data-cursor="LAUNCH">
            Try again
          </Button3D>
          <Button3D href="/" variant="secondary">
            Return to launch pad
          </Button3D>
        </div>
      </div>
    </section>
  );
}
