# Kosmodrome 2026 — Frontend Handoff

For the backend developer. Covers everything about this repo from the frontend's
side: what it is, how to run it, where every constant lives, what is real vs.
placeholder, and what is still open.

---

## 1. Project overview and tech stack

**Kosmodrome 2026 — 48 Hours to Orbit**, the IIST National Space Hackathon: a
national-level, online, 48-hour event with two tracks (Beginner and Advanced).
This repository is the **public website only — there is no backend in it**. The
static content is maintained by the organisers (`app/content/`); the frontend
calls two backend endpoints for the registration and contact forms.

| Layer            | Choice |
| ---------------- | ------ |
| Framework        | Next.js **16** (App Router, Turbopack, Cache Components, partial prefetching) — note: it is *not* the Next.js in most training data; check `node_modules/next/dist/docs/` when in doubt |
| UI runtime       | React **19** |
| Styling          | Tailwind CSS **v4** (`@tailwindcss/turbopack` loader) + one hand-maintained `app/globals.css` (~4,900 lines; design system, no CSS framework beyond Tailwind) |
| 3D               | three.js + `@react-three/fiber` (spaceport hero, liftoff-on-scroll choreography) |
| Smooth scrolling | Lenis (`lenis`), dynamically imported, **Full mode only** |
| Fonts            | next/font/google, variable files, `latin` subset (Orbitron + Oxanium preloaded; Inter + JetBrains Mono lazy) |
| Animation        | hand-rolled rAF + CSS (no animation library; `motion` is not a dependency) |
| Type safety      | TypeScript strict |
| Lint             | eslint 9 + `eslint-config-next` |
| Package manager  | npm |

**Requirements:** Node **>= 20.9.0** (per `node_modules/next/package.json`).

---

## 2. How to run

```bash
npm install              # first time
cp .env.example .env.local   # adjust if needed (defaults are fine)
npm run dev              # dev server → http://localhost:3000
npm run build            # production build → .next/
npm start                # serve the production build (npm start -- --port 3001)
npm run lint             # eslint (must pass)
```

All routes are prerendered static (22 of 22); no server runtime is required for
the marketing pages. The two form endpoints (`/api/register`, `/api/contact`)
are **not in this repo** and will 404 until the backend ships them — the forms
detect that and show a graceful error toast.

There is no `test` script. Verification so far: `npm run lint`, `npm run build`,
and a smoke test of all 200s on the 11 main routes.

---

## 3. Folder structure and ownership

```text
app/
  layout.tsx              root layout: fonts, <Navbar/>, effects providers, chrome (frontend)
  globals.css             design system: tokens, utilities, effects, toasts, ticker… (frontend)
  icon.tsx, apple-icon.tsx, opengraph-image.tsx, twitter-image.tsx
                        code-generated brand icons / social images (frontend; placeholder logo)
  manifest.ts, sitemap.ts, robots.ts                            (frontend)
  <route>/page.tsx        about, contact, fair-play, faq, prizes, register,
                        rules, scoring, submission, timeline, tracks   (frontend)
  error.tsx, global-error.tsx, not-found.tsx, template.tsx             (frontend)
  content/
    site-config.ts        single source of truth: brand, organiser, URLs, nav, flags (frontend)
    event-data.ts         tracks, timeline, scoring, prizes, FAQs, registration copy (frontend)
  components/
    ui/                   primitives (Button3D, Badge, Card, Accordion, Wordmark…)  (frontend)
    fx/                   text/reveal effects (SplitText, ScrambleText, TypeLine…) (frontend)
    sections/             page sections: Hero, Countdown, RegisterForm, ContactForm,
                          CalendarDownload, SubmissionChecklist…                    (frontend)
    layout/               Navbar, Footer, ScrollHUD, MissionClock, BackToTop,
                          MobileActionBar, EffectsToggle, NavPreviewPanel           (frontend)
    effects/              EffectsProvider, ticker, pointer-store, cursor system,
                          Intro, CommandPalette(+Provider), Toast(+Provider+Viewport),
                          SmoothScroll, ClientChrome (lazy chrome gate), PerfPanel  (frontend)
    space/                SpaceCanvas (lazy), SpaceScene, Spaceport, Starfield,
                          Nebula, Globe, PadHud, shaders                            (frontend)
    services/             api.ts — the ONLY network client (frontend)
    types/                api.ts — request/response types (frontend)
  api/                    ← BACKEND OWNS (does not exist yet)
lib/                      ← BACKEND OWNS (does not exist yet; repo root)
public/                   static assets (currently create-next-app placeholder SVGs) (frontend)
docs/                     ← you are here (frontend wrote it; shared)
```

Ownership recap (also in `CONTRIBUTING.md`): **frontend** = everything above
marked (frontend). **backend** = `app/api/`, repo-root `lib/`, `.github/`,
`next.config.ts`. `docs/` and `CONTRIBUTING.md` are shared — edit carefully.

---

## 4. Brand and content constants — where to edit

All facts and organiser-controlled values live in two files:

**`app/content/site-config.ts`**

| Export | What it holds | Edit when |
| ------ | ------------- | --------- |
| `TBA` | the string `"To be announced"` | never (it *is* the placeholder) |
| `brand` | name, displayName (`KOSMODROME`), tagline, subtitle, organiser, Cyrillic watermark | brand changes only |
| `siteConfig.siteUrl` | canonical site URL (from `NEXT_PUBLIC_SITE_URL`) | set the prod URL in env |
| `siteConfig.eventStartISO` | kickoff ISO string or `null` | when date is announced |
| `siteConfig.registrationOpen` | boolean | flip to `true` when registration opens |
| `siteConfig.registrationFee` | string or `null` (e.g. `"₹999"`) | when fee is announced |
| `siteConfig.contactEmail` | organiser email or `null` | when announced |
| `siteConfig.portalUrl` / `announcementsUrl` / `clarificationsUrl` / `rulebookUrl` | official links or `null` | when announced |
| `siteConfig.navLinks`, `primaryNavLinks`, `moreNavLinks`, `footerGroups`, `registerCta` | navigation structure | nav changes |
| `siteConfig.factsLine`, `description`, `tagline` | meta/OG text | copy changes |

**`app/content/event-data.ts`** — `tracks`, `timeline` (`when` strings like
`D-14`, `T+2`, with `clock: "18:00"` local time), `scoringTabs`, `penalties`,
`prizeTracks`, `faqGroups`, `registrationSteps`, `registrationEligibility`,
`contactTopics`, `ocContactNotes`, `homeFaqIds`, `programmeOptions`, `submission`
and more (36 exports). This file is the single source for all factual copy on
the site; the JSON-LD `Event` schema in `app/page.tsx` is emitted only when
`eventStartISO` is set.

### "To be announced" values — fill each here

| Value | Where to set it | Shows up in |
| ----- | --------------- | ----------- |
| Event dates & kickoff | `siteConfig.eventStartISO` (`app/content/site-config.ts`) | hero "T-" chip, MissionClock, countdown (`app/components/sections/Countdown.tsx`), timeline page "Calendar dates", calendar export gating, JSON-LD |
| Event fee | `siteConfig.registrationFee` | Register page header + form footer, `/timeline`-adjacent FAQ answer, register CTA |
| Prize amounts | `event-data.ts` → `prizeTracks` (`amount: TBA`) | `/prizes`, home, nav previews, prize cards |
| Registration open/closed | `siteConfig.registrationOpen` | Hero badge, register page (title + badge + notice), footer CTA label (MobileActionBar) |
| Kickoff clock (10:00 IST line) | `Countdown.tsx` renders `"Kickoff · 10:00 IST"` only when no date set | hero countdown card |
| Mission clock label | same flag | navbar clock |
| Official channels (portal / announcements / clarifications / email) | `siteConfig.portalUrl`, `announcementsUrl`, `clarificationsUrl`, `contactEmail` | Contact page, footer, nav preview "COMMS GO/HOLD" pills |
| Rulebook link | `siteConfig.rulebookUrl` | Footer "Read the rulebook", Rules page, Register consent checkbox area |
| Calendar dates note | `timeline/page.tsx` header | timeline page |
| Sponsors | `event-data.ts` (sponsors strip data is `TBA` inline) | home + `/about` Sponsors strip |
| Ticket/stipend? | not in scope — organiser must add via content if wanted | — |
| Mission themes deadline | `trackThemesNote` | home themes marquee |
| Telemetry ticker items | `TelemetryTicker.tsx` `DEFAULT_ITEMS` (`KICKOFF TBA`) | home ticker |
| `T- TBA` chip | `Hero.tsx` | hero |
| "Registration closes D-5" etc. | `timeline` entries (`D-…` strings) | timeline, ICS export offsets |

Flip `registrationOpen` to `true` and set `eventStartISO` at the same time, or
the hero will show "Registration open" with a TBA countdown.

---

## 5. Effects modes and `?perf=1`

All motion in this app goes through the **Effects provider**
(`app/components/effects/`). Modes:

| Mode | What it is |
| ---- | ---------- |
| **Full** | Everything: 3D spaceport (liftoff on scroll), Orbiter cursor + exhaust particles, tilt/glitch/scramble reveals, smooth scroll (Lenis), backdrop blur on the navbar and mobile action bar, marquee. |
| **Lite** | The site still fully works and looks designed, but lighter: fewer starfield/plume particles, **no plume glow, no extrusion layers, no backdrop blur**, DPR capped to 1, no antialias, 30 fps cap, simpler reveals, cursor stays but with fewer exhaust particles. |
| **Off** | Static. No 3D, no cursor chrome, no smooth scroll, marquees/reveals static (CSS fallbacks), content is fully visible and readable. `prefers-reduced-motion: reduce` starts here. |

**Selection:** stored in `localStorage["kosmodrome:effects"]`; also auto-detected
(touch / `hardwareConcurrency ≤ 4` / `deviceMemory ≤ 4` / no WebGL → Lite;
reduced motion → Off). Manual choice in the footer "Effects" toggle always wins
(persists).

**Quality governor (automatic):** measures rolling FPS in Full/Lite. If the
frame rate averages **< 45 FPS for 3 consecutive seconds** (2 s grace after load,
including while scrolling), it steps down one level (Full → Lite, then
Lite → Off, i.e. Minimal: CSS horizon + SVG tower silhouette, no WebGL, no
exhaust, no smooth scroll), remembers the step for the session
(`sessionStorage["kosmodrome:governor"]`), never steps back up on its own,
respects manual overrides, and fires a toast. New visitors on touch devices,
≤ 4-core or ≤ 4 GB devices start in Lite.

**`?perf=1`** — dev-only perf panel (shows live FPS). Rendered **only in
development**; absent from production bundles entirely.

Implementation files: `effects-store.ts` (mode state, detection, governor),
`effects-provider.tsx` (context + governor loop + `html[data-effects]`),
`ticker.ts` (single shared rAF loop), `ClientChrome.tsx` (gates cursor/intro/
perf panel to idle time and fine pointers).

---

## 6. Environment variables

See `.env.example`.

| Variable | Default | Used by | Effect |
| -------- | ------- | ------- | ------ |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `site-config.ts` → metadata, Open Graph, `sitemap.ts`, `robots.ts`, `manifest.ts` | Canonical/OG URL base. Set the production URL in prod. No trailing slash needed (it is stripped). |
| `NEXT_PUBLIC_API_MODE` | `mock` | `app/services/api.ts` | `mock` — forms fake a success locally, zero network. `live` — forms POST JSON to `/api/register` and `/api/contact`. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | empty | **nothing in this repo** — backend-owned; do not reference from frontend code | Reserved for the backend. |

No secrets in this repo. `NEXT_PUBLIC_*` vars are inlined into the client
bundle at build time — never put private keys in them.

---

## 7. Where real data replaces static content

| Static today | Replace with | When |
| ------------ | ------------ | ---- |
| `eventStartISO: null` | real kickoff ISO | dates announced — flips on countdown, mission clock, ICS export, JSON-LD, timeline "Calendar dates" |
| `.ics` generation from timeline offsets | same code, driven by `eventStartISO` | automatic once dates land (no backend needed) |
| Registration form "preview" | `NEXT_PUBLIC_API_MODE=live` + shipped `/api/register` | backend ready |
| Contact form "preview" | `NEXT_PUBLIC_API_MODE=live` + `/api/contact` | backend ready |
| `registrationOpen: false` | `true` (one-line content edit + rebuild; no CMS) | registration opens |
| Sponsors strip (`TBA`) | real names/logos (add assets to `public/`) | sponsorships signed |
| Rulebook draft (`/rules`) + `rulebookUrl` | published rulebook + hash-verified link | rulebook published |
| Portal / announcements / clarifications / OC email links | real URLs in `siteConfig.*Url` | OC publishes them |
| Collegiate verification flow | OC verifies emails/IDs by D-3 against backend store | after backend ships |
| "TBA" prize amounts, fee | `event-data.ts` / `siteConfig.registrationFee` | as announced |

**Verification status of the switch:** changing `NEXT_PUBLIC_API_MODE` to
`live` is a build-time flip; without the backend endpoints the forms will
render the graceful "Could not reach the server" toast (verified behaviour of
the error path in absence of the API).

---

## 8. Accessibility and performance notes

**Accessibility**
- Semantic landmarks, one `h1` per page, `main#main-content` skip link.
- Focus-visible rings everywhere (design-system `:focus-visible` styles); route
  announcements via `aria-live` in `RouteAnnouncer`; command palette uses a
  listbox pattern with full keyboard navigation + Escape; nav popovers close on
  Escape/blur/pointer-leave with focus returned to the trigger.
- All decorative layers `aria-hidden`; text effects server-render the real
  text (screen readers get it too) — animations are visual only.
- `prefers-reduced-motion: reduce` ⇒ Off mode.
- Colour contrast: dark theme (`#05070c` background, `#ff9e45` primary,
  `#6fe3f2` accent); muted text is `#9dacc2` on `#05070c` (~**8.2:1**).
- Smooth scrolling is opt-out via Off/Lite modes; anchor offset accounts for
  the floating navbar (88px).
- **Not yet done:** automated axe audit and a screen-reader pass (needs a
  browser). Recommended before launch.

**Performance**
- All 22 routes statically prerendered; HTML is fully server-rendered
  (text-first paint; effects hydrate without blocking content).
- Measured First Load JS (raw / gzip): `/` **675.5 / 208.4 kB**, every other
  route **658–678 / 204–209 kB**. The remaining bulk is the Next 16 framework
  (≈ 545 kB raw / 168 kB gzip: polyfill + runtime + router + react-dom) —
  not reducible from app code. A ~400 kB target is not feasible.
- Lazy/async chunks: 3D scene (~923 kB raw / 242 kB gzip, after first paint,
  only Full/Lite), command palette (~10 kB), toast viewport, BackToTop,
  calendar/ICS (~12 kB, on first click), Intro, cursor system.
- Fonts: 16 variable woff2 total ≈ 336 kB on disk; only `latin` subsets and
  preloaded Orbitron + Oxanium (~24 kB) — others lazy with `display: swap`.
- Single shared rAF loop; no per-frame React state; Lenis on demand; DPR
  capped; backdrop-blur on ≤ 2 small elements in Full, zero in Lite;
  `content-visibility: auto` on below-fold sections; infinite CSS animations
  run only in Full and while in view.
- Quality governor steps down to Lite/Minimal under sustained < 45 FPS.

---

## 9. Known limitations

1. **No backend in this repo.** Both forms work in a local "mock" mode only;
   nothing is stored anywhere. The calendar ".ics" export works client-side.
2. **Team-registration file upload does not exist.** The "College ID" picker is
   a UI stub; files never leave the browser. Backend to implement (suggest a
   signed upload URL or multipart; see `docs/api-contract.md` → Uploads).
3. **College email is not verified.** The UI accepts any well-formed email and
   labels it "institutional"; OC verification is manual (by D-3).
4. **Seniority/Graduate track rule is a warning, not a block** in the UI
   (opting up is always allowed); if the OC wants a hard stop, the backend must
   enforce it (`fieldErrors.track`).
5. **First Load JS can't reach ~400 kB** (framework floor ≈ 545 kB raw).
6. **three.js can't be tree-shaken further** (single-module build); the 3D chunk
   is lazy but ~923 kB raw. Dropping R3F for vanilla three would save ~76 kB
   gzip but was rejected (can't verify pixel-identical without a browser).
7. **No `size-adjust` fallbacks** for the variable Google fonts (Next 16 emits
   none; `adjustFontFallback` is a no-op for variable fonts here).
8. **Registration/opening flow is manual** — flipping `siteConfig.registrationOpen`
   requires a rebuild (no CMS, no env flip without a rebuild).
9. Preloaded font hint syntax differs per Next version; preload list verified
   in the built Flight payload (Orbitron + Oxanium only).
10. `before.jsonl` (≈14 MB build artifact) and `export-err.txt` sit untracked
    in the repo root; `dev-server.log` is now `.gitignore`d (`*.log`).

---

## 10. Open items (TODO audit)

Search performed: `TODO`, `FIXME`, `HACK`, placeholder comments, and encoding
losses across `app/**`. There are **no remaining TODO/FIXME markers in the
source** (the two former `TODO: connect backend …` comments were replaced by
the `app/services/api.ts` layer). What remains, grouped:

### Frontend

| Where | Item |
| ----- | ---- |
| `app/components/sections/RegisterForm.tsx:1129` | U+FFFD replacement char in the footer step line (`A□ Fee:` renders as "A□ Fee") — needs the organiser to retype the separator (e.g. `Step {n} of {3} · Fee:`). |
| `app/components/sections/ics.ts:99` | `join(" ? ")` — pre-existing encoding loss; the ICS `DESCRIPTION` will contain " ? " instead of a dash. One-byte fix, left untouched (copy rule). |
| `app/components/ui/Accordion.tsx:65` | Expand/collapse glyphs are `●` / `○` — functional but probably not the intended icon; wants a design pass (chevron SVG). |
| `app/components/ui/FlipCard.tsx` | Unused component (nothing imports it). Delete or wire up. |
| `app/components/sections/CalendarDownload.tsx` | ICS calendar export works but is unreachable until `eventStartISO` is set (organiser blocker, tracked under Content). |
| `app/components/layout/EffectsToggle.tsx:25` | Renders `Auto · <mode>` / `Manual` — no way to reset to automatic after a manual choice except clearing localStorage (`kosmodrome:effects`); UX decision, not a bug. |
| `app/globals.css` | `.perf-panel` styles remain for the dev-only panel (intentional); a handful of utility classes (`.cv-auto`, `.marquee-chip`) are unused — trivial cleanup. |
| `README.md` | Removed the stray "practice test" line (fixed). |
| Whole repo | No automated tests, no CI test step, no browser-based verification of visuals (Full mode, cursor, governor behaviour under real GPU load) — see Limitations. |

### Backend

| Where | Item |
| ----- | ---- |
| `app/api/` (missing) | `POST /api/register` and `POST /api/contact` — see `docs/api-contract.md`. |
| College ID upload | Implement signed upload URL or multipart flow; frontend stub in `RegisterForm.tsx` (file input note) uploads nothing. |
| Idempotency | Decide: upsert vs `409` for duplicate registrations. |
| OC verification workflow | email/ID verification by D-3; status tracking; rejection path surfaced to teams. |
| Confirmation emails to teams/OC | not required by contract; open question. |
| Rate limiting & payload size caps | suggested in `docs/api-contract.md` → Operational notes. |
| Spam protection for `/api/contact` | honeypot/captcha decision is the backend's call. |
| `app/api/` owns ICS hosting (if any) | the ICS file is client-generated today; a server-side endpoint is fine to add, but unnecessary. |

### Content (organisers)

| Where | Item |
| ----- | ---- |
| `app/content/site-config.ts` | `eventStartISO`, `registrationOpen`, `registrationFee`, `contactEmail`, `portalUrl`, `announcementsUrl`, `clarificationsUrl`, `rulebookUrl` — all `null` today ⇒ "TBA" everywhere. |
| `app/content/event-data.ts` → `prizeTracks` | prize amounts are `TBA` (2 tracks × 3 places + special awards). |
| `app/content/event-data.ts` → `faqGroups` | fee answer says "The fee is TBA" until announced. |
| `app/components/fx/TelemetryTicker.tsx` | `KICKOFF TBA` in the default ticker items. |
| `app/components/sections/Hero.tsx` | `T- TBA` chip and "Rulebook draft. Event dates and fees: TBA." |
| `app/timeline/page.tsx` | "Calendar dates: TBA." header note. |
| `app/components/sections/SponsorsStrip.tsx` | "Sponsors: TBA." |
| `app/components/sections/Countdown.tsx` | `Kickoff · 10:00 IST` placeholder line shows until dates land. |
| `site-config.ts` → `description` / JSON-LD | stays valid once `eventStartISO` is set (Event schema emitted then). |

### Design (real logo)

| Where | Item |
| ----- | ---- |
| `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx` | Kosmodrome mark is **code-drawn placeholder** (SVG rocket-in-ring); no designer/official logo asset delivered yet. Replace with the real logo when it exists. |
| `app/components/ui/BrandMark.tsx` | same placeholder mark, drawn inline (used in navbar + footer). |
| `public/*.svg` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) | create-next-app leftovers; unused by the site. Delete when the real logo lands (keep `favicon.ico` / icon.tsx pipeline). |
| `app/content/site-config.ts` → `brand.watermark` | `"КОСМОДРОМ"` Cyrillic — intentional brand motif; confirm with brand owner it stays. |
| `docs/` logos referenced in emails | none exist yet (backend will need them if confirmation emails ship). |

---

## 11. Verification status and what I could not verify

- `npm run lint` — clean.
- `npm run build` — clean (22 static routes, 0 errors/warnings).
- `next start` smoke — all 11 main routes return `200` with full content.
- Verified in built output: 3D chunk is not in First Load or in Off mode;
  perf panel is absent from production chunks; only Orbitron + Oxanium are
  preloaded; inline `js` gate present; forms render correctly server-side.
- **Not verified (no browser in this environment):** visual fidelity of Full
  mode (cursor, exhaust, spaceport liftoff), governor behaviour under real GPU
  load, hover/focus states, the toast action button's interaction, and live
  end-to-end form submission (requires the backend).

## 12. Commit and branch etiquette

`dev-nikhil` is the working branch; commits land there and are pushed. `main`
is protected by convention — nothing is merged from this work without a PR
review by the maintainer. `git add` is always by explicit path; build output and
logs are never committed.
