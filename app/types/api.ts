/**
 * Shared API types for the Kosmodrome frontend.
 *
 * These describe the payloads the UI sends to the backend and the envelope it
 * expects back. The backend developer owns `app/api/` and should keep the two
 * in sync; see `docs/api-contract.md` for the full contract.
 */

/** Tracks the frontend can register a team for. */
export type RegisterTrack = "Beginner" | "Advanced";

/** One team member as sent by the registration form. */
export interface RegisterMemberPayload {
  fullName: string;
  /** Institutional email. */
  email: string;
  /** College or institution name. */
  college: string;
  /** Programme and year, e.g. "UG year 2", "PG", "Graduate within six months". */
  programme: string;
  /** College ID file. NOT sent — uploads are handled by the backend. */
  // collegeId is intentionally absent: file upload to be implemented by the
  // backend (suggest signed upload URL or multipart). The UI keeps the file
  // locally and flags it as required.
}

/** Payload for POST /api/register. */
export interface RegisterPayload {
  teamName: string;
  /** Either "Beginner" or "Advanced". */
  track: string;
  /** Leader contact for OC updates. */
  leaderEmail: string;
  /** 2 to 4 members. */
  members: RegisterMemberPayload[];
  rulebookAccepted: boolean;
  declarationAccepted: boolean;
  seniorityConfirmed: boolean;
}

/** What the backend acknowledges with after a successful registration. */
export interface RegisterResponse {
  id: string;
  teamName: string;
  track: string;
  memberCount: number;
  receivedAt: string;
}

/** Payload for POST /api/contact. */
export interface ContactPayload {
  name: string;
  email: string;
  topic: string;
  message: string;
}

/** What the backend acknowledges with after a contact message is stored. */
export interface ContactResponse {
  id: string;
  receivedAt: string;
}

/** Field-level validation errors, keyed like the form does:
 *  "teamName" | "track" | "leaderEmail" | "members.<index>.email" | "…"
 *  or top-level form keys such as "rulebookAccepted". */
export type ApiFieldErrors = Record<string, string>;

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  /** User-friendly message, safe to render in the UI. */
  message: string;
  /** HTTP status, or null for network/timeout/client-side failures. */
  status: number | null;
  /** Optional per-field errors returned by the server (400/422). */
  fieldErrors?: ApiFieldErrors;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
