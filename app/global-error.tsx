"use client";

import { useEffect } from "react";

const errorStyles = `
body { margin: 0; background: #05070c; color: #edf3fb; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
main { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 2rem; }
p { color: #9dacc2; max-width: 36rem; line-height: 1.6; }
button { font: inherit; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #ff9e45; background: #ff9e45; color: #160b02; padding: 0.8rem 1rem; cursor: pointer; }
button:hover { background: #ffb267; }
.status { color: #ffb267; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.15em; text-transform: uppercase; }
`;

export default function GlobalError({
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
    <html lang="en">
      <head>
        <style>{errorStyles}</style>
        <title>Something went wrong — Kosmodrome 2026</title>
      </head>
      <body>
        <main>
          <p className="status">Error 500 · Launch aborted</p>
          <h1>Launch aborted.</h1>
          <p>The page failed to load. Try again, or return to the gate.</p>
          <button type="button" onClick={retry}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
