# Kosmodrome 2026 — API Contract

**Status:** proposed. The frontend is implemented against this contract. The
backend owns its final shape; keep the frontend client
(`app/services/api.ts`) and this file in sync.

**Scope:** the two endpoints the UI calls today. There is no other network
traffic. The calendar ".ics" export is generated in the browser and needs no
endpoint.

| Method | Path            | Purpose                            |
| ------ | --------------- | ---------------------------------- |
| POST   | `/api/register` | Register a team for the hackathon. |
| POST   | `/api/contact`  | Send a message to the OC.          |

**Content type:** `application/json; charset=utf-8`, `Accept: application/json`.
**Timeout:** the frontend aborts after **15 s**.
**Size:** keep request bodies under 32 kB (they are ~1–2 kB in practice).

---

## Shared envelopes

### Success

HTTP `200` or `201` with a JSON body that contains a `data` object:

```json
{
  "data": { "id": "a1b2c3d4", "receivedAt": "2026-11-16T09:30:00.000Z" }
}
```

The frontend also accepts a bare object (no `data` wrapper) and passes it
through. Extra top-level fields are ignored.

**Register response**

```json
{
  "data": {
    "id": "reg_01J…",
    "teamName": "Orbital Originals",
    "track": "Beginner",
    "memberCount": 3,
    "receivedAt": "2026-11-16T09:30:00.000Z"
  }
}
```

**Contact response**

```json
{
  "data": { "id": "msg_01J…", "receivedAt": "2026-11-16T09:30:00.000Z" }
}
```

### Failure

HTTP non-2xx with a JSON body. Preferred shape:

```json
{
  "error": {
    "message": "Please fix the highlighted fields and try again.",
    "fieldErrors": {
      "teamName": "Enter a team name.",
      "members.1.email": "This email is already used by another member."
    }
  }
}
```

The frontend also understands `{ "message": "…" }`, `{ "error": "…" }`,
`{ "fieldErrors": { … } }` and `{ "errors": { … } }` (per-field value may be a
string, an array of strings, or `{ "message": "…" }`). If nothing machine-usable
is found, a status-based fallback message is shown.

`fieldErrors` keys, matching what the frontend sends and understands:

| Key                        | Meaning                                  |
| -------------------------- | ---------------------------------------- |
| `teamName`                 | Team name field.                         |
| `track`                    | Track select.                            |
| `leaderEmail`              | Team leader email.                       |
| `members.<index>.fullName` | Member name (0-based index).             |
| `members.<index>.email`    | Member institutional email.               |
| `members.<index>.college`  | Member institution.                      |
| `members.<index>.programme`| Member programme and year.               |
| `members.<index>.collegeId`| ID file slot (see "Uploads" below).      |
| `form`                     | Team-level error (e.g. fewer than 2 members). |
| `rulebookAccepted`         | Rulebook consent checkbox.               |
| `declarationAccepted`      | Integrity Declaration consent.           |
| `seniorityConfirmed`       | Seniority/track declaration consent.     |

`members.<index>.…` uses the 0-based order of the `members` array in the
request; the frontend re-maps them onto the member cards.

---

## POST /api/register

Register a team. One team, one track, one submission.

### Request

```json
{
  "teamName": "Orbital Originals",
  "track": "Beginner",
  "leaderEmail": "leader@iist.ac.in",
  "members": [
    {
      "fullName": "Asha Rao",
      "email": "asha.rao@iist.ac.in",
      "college": "IIST",
      "programme": "UG year 2"
    },
    {
      "fullName": "Vihaan Mehta",
      "email": "vihaan.me@iist.ac.in",
      "college": "IIT Madras",
      "programme": "UG year 1"
    }
  ],
  "rulebookAccepted": true,
  "declarationAccepted": true,
  "seniorityConfirmed": true
}
```

### Validation the frontend already enforces

The frontend validates all of the following **before** calling this endpoint
(and will additionally render `fieldErrors` returned by the server):

| Rule                       | Detail |
| -------------------------- | ------ |
| `teamName`                 | Required, non-empty after trim. |
| `track`                    | Required. One of `"Beginner"`, `"Advanced"`. |
| `leaderEmail`              | Required, matches `^[^\s@]+@[^\s@]+\.[^\s@]+$`. |
| `members`                  | **2 to 4 members**. |
| `members[].fullName`       | Required. |
| `members[].email`          | Required, same pattern; **unique across the team, case-insensitive**. |
| `members[].college`        | Required. |
| `members[].programme`      | Required; one of `Diploma`, `UG year 1`, `UG year 2`, `UG year 3`, `UG year 4+`, `PG`, `PhD`, `Graduate within six months`. |
| Consent flags              | All three must be `true`. |
| Track seniority rule       | *Hint only* in the UI: members in `{UG year 3, UG year 4+, PG, PhD, Graduate within six months}` on the Beginner track trigger a warning banner (opting **up** is always allowed). **Not a hard block in the UI.** |
| Graduate rule              | Eligibility copy says *"Graduates within six months of their final exam join Advanced only."* Enforced by the UI only as a warning; see below. |

The same rules **must be re-enforced server-side** (the client can be bypassed).
In particular, the backend is the right place for:

- rejecting a `Graduate within six months` member on `Beginner` with a
  `fieldErrors.track` error;
- rejecting a member whose `programme` the seniority rule maps to Advanced
  while `track: "Beginner"`, if the OC wants that as a hard rule;
- normalising/verifying institutional emails (the frontend treats any email
  matching the pattern as institutional; OC verification by D-3 is manual);
- enforcing team size 2–4 and email uniqueness case-insensitively;
- duplicate-team detection → `409`.

### Uploads (college IDs)

The registration form includes a "College ID (image or PDF)" file input per
member. **No file is sent or stored by the frontend.** File upload to be
implemented by the backend (suggest a signed upload URL flow, e.g.
`POST /api/register` → `{ id, uploadUrl }` → client `PUT`s the file, or a
`multipart/form-data` variant of this endpoint). The frontend is ready to:

- keep the file locally and upload it after `POST /api/register` once an
  `uploadUrl` (or equivalent) exists, or
- submit it as part of a multipart registration request.

Until then the button stays a UI stub (see "Open items" in
`docs/FRONTEND_HANDOFF.md`). Decide the flow; the contract above changes only
by adding fields.

---

## POST /api/contact

Send a message to the Organising Committee.

### Request

```json
{
  "name": "Asha Rao",
  "email": "asha.rao@iist.ac.in",
  "topic": "Technical support",
  "message": "My team locked the wrong track by mistake."
}
```

`topic` is one of:

```text
Registration | Eligibility and tracks | Accessibility request |
Conduct or integrity report | Technical support | General question
```

### Validation the frontend enforces

| Rule      | Detail |
| --------- | ------ |
| `name`    | Required, non-empty. |
| `email`   | Required, pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`. |
| `topic`   | Required; one of the six values above. |
| `message` | Required, non-empty (the frontend does not cap length; a server cap is recommended). |

Re-enforce server-side, including length caps (e.g. 4 kB message) and control
character sanitisation before storing/sending.

---

## Status codes and what the UI shows

| Status          | Frontend behaviour |
| --------------- | ------------------ |
| `200` / `201`   | Success panel (`Cleared for launch prep.` / `Message received.`) and a success toast. |
| `400` / `422`   | If `fieldErrors` present: fields are marked inline, the first invalid step is opened, an inline banner lists how many fields need attention, and the toast offers **Retry**. If absent: the extracted `message` is shown in a toast with **Retry** (no inline errors). |
| `403`           | Toast: "This action is not allowed right now." No inline errors. |
| `404`           | Toast: "This service is not available yet. Please try again later." |
| `405`           | Treated as a generic failure (status fallback message) with **Retry**. |
| `409`           | Toast: "A registration already exists for this team." If `fieldErrors` are returned, they are shown inline as for 400/422. |
| `429`           | Toast: "Too many attempts. Please wait a moment and try again." No automatic retry. |
| `5xx`           | Toast: "Something went wrong on our side. Please try again." with **Retry**. |
| Network failure | Toast: "Could not reach the server. Please check your connection and try again." with **Retry**. |
| Timeout (15 s)  | Toast: "The request timed out. Please check your connection and try again." with **Retry**. |

In every failure case the submit button is re-enabled and nothing is written
to local storage; the user may fix fields or press **Retry**.

Never throw raw errors to the UI: the frontend maps everything onto
`ApiResult<T>`. If the backend returns HTML (proxy error page), the frontend
falls back to the status-based message.

---

## Operational notes for the backend

- **Same origin:** the frontend calls relative paths (`/api/…`). Serve the
  API from the same origin, or change the frontend to an absolute base URL
  (would need a new `NEXT_PUBLIC_API_BASE_URL` decision — not currently set).
- **Rate limiting (suggested):** e.g. 10 registrations / IP / hour,
  20 contact messages / IP / hour, burst-safe. Respond `429` with retry
  guidance in `message`.
- **Idempotency (decision needed):** the frontend may resubmit the same
  payload (user pressed Retry). Decide whether `POST /api/register` upserts
  by `teamName` (or another natural key) or rejects duplicates with `409`.
  If the backend needs a client-generated key, say so and the frontend will
  add an optional `clientRequestId` field — the contract above tolerates
  extra fields either way.
- **Verification:** OC verification of institutional emails and college IDs
  by D-3 is a manual process; the frontend expects registration to land in a
  "pending verification" state. Suggested field on the backend side:
  `verificationStatus: "pending" | "verified" | "rejected"` (not part of the
  API contract above).
- **Notifications:** the OC may want to send a confirmation email after
  registration; the frontend does not require it.
- **Cookies/sessions:** none required. Cross-site POSTs would need CORS and
  SameSite handling — avoid by serving the API on the same origin.
