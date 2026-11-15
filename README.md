# Kosmodrome 2026 — Frontend

Marketing and registration site for **Kosmodrome 2026 — 48 Hours to Orbit**, the
IIST National Space Hackathon: a national-level, online, 48-hour event with two
tracks (Beginner and Advanced). Next.js 16 (App Router + Turbopack), React 19,
Tailwind CSS v4, three.js / @react-three/fiber for the spaceport scene, Lenis
for smooth scrolling, and a Motion-style effects system (Full / Lite / Off)
with an automatic quality governor.

All content is currently static (`app/content/`) and there is no backend in this
repo yet. The frontend expects two endpoints — `POST /api/register` and
`POST /api/contact` — via a thin client layer in `app/services/api.ts`,
controlled by `NEXT_PUBLIC_API_MODE` (`mock` by default).

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes are static)
npm start       # serve the production build
npm run lint    # eslint
```

Copy `.env.example` to `.env.local` and adjust the two values there
(`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_MODE`). No secrets are needed for
local development.

## Documentation

- **[docs/api-contract.md](docs/api-contract.md)** — the API the frontend expects:
  endpoints, request/response JSON, validation rules, error format and status
  codes, and what the UI shows for each.
- **[docs/FRONTEND_HANDOFF.md](docs/FRONTEND_HANDOFF.md)** — the full handoff:
  stack, how to run, folder ownership, content constants, the list of
  "To be announced" values, effects modes, environment variables, accessibility
  and performance notes, known limitations, and open items.

## Branch workflow

See [CONTRIBUTING.md](CONTRIBUTING.md). Short version: work on your own
`dev-yourname` branch, open a PR against `main`, the maintainer reviews and
merges.
