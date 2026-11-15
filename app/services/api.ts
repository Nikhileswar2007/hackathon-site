/**
 * Frontend API client layer.
 *
 * All network access from the UI goes through this module — components never
 * call `fetch` directly. Behaviour is controlled by NEXT_PUBLIC_API_MODE:
 *
 *   "mock" (default) — no network. Functions wait a short time and resolve
 *                      with a successful, obviously-fake response.
 *   "live"           — functions POST JSON to the backend endpoints described
 *                      in docs/api-contract.md. Network errors, non-2xx
 *                      responses and timeouts are caught and mapped onto
 *                      ApiResult; raw errors never reach the UI.
 *
 * The college ID upload used by the registration form is intentionally not
 * part of this layer: file upload to be implemented by the backend
 * (suggest a signed upload URL or multipart). See docs/api-contract.md.
 */

import type {
  ApiFailure,
  ApiFieldErrors,
  ApiResult,
  ContactPayload,
  ContactResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/app/types/api";

export type { ApiResult } from "@/app/types/api";

const API_MODE =
  (process.env.NEXT_PUBLIC_API_MODE ?? "mock").trim().toLowerCase() ===
  "live"
    ? "live"
    : "mock";

export function isMockMode() {
  return API_MODE === "mock";
}

const ENDPOINTS = {
  register: "/api/register",
  contact: "/api/contact",
} as const;

const REQUEST_TIMEOUT_MS = 15_000;
const MOCK_DELAY_MS = 900;

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function mockId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.floor(Math.random() * 1e8).toString(16);
  return `mock-${prefix}-${random}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Pull a machine-usable field error map out of whatever the server sent. */
function extractFieldErrors(body: unknown): ApiFieldErrors | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const candidates = [body, body.error, body.errors, body.fieldErrors];

  for (const candidate of candidates) {
    if (!isRecord(candidate)) {
      continue;
    }

    const out: ApiFieldErrors = {};

    for (const [key, value] of Object.entries(candidate)) {
      if (typeof value === "string") {
        out[key] = value;
      } else if (Array.isArray(value) && typeof value[0] === "string") {
        out[key] = value[0];
      } else if (isRecord(value) && typeof value.message === "string") {
        out[key] = value.message;
      }
    }

    if (Object.keys(out).length > 0) {
      return out;
    }
  }

  return undefined;
}

/** Pull a human-readable message out of whatever the server sent. */
function extractMessage(body: unknown, fallback: string): string {
  if (!isRecord(body)) {
    return fallback;
  }

  if (typeof body.message === "string" && body.message.trim()) {
    return body.message;
  }

  if (isRecord(body.error)) {
    const nested = body.error.message;
    if (typeof nested === "string" && nested.trim()) {
      return nested;
    }
  }

  if (typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }

  return fallback;
}

function messageForStatus(status: number): string {
  if (status === 400 || status === 422) {
    return "Please fix the highlighted fields and try again.";
  }

  if (status === 403) {
    return "This action is not allowed right now.";
  }

  if (status === 404) {
    return "This service is not available yet. Please try again later.";
  }

  if (status === 409) {
    return "A registration already exists for this team.";
  }

  if (status === 429) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  return "The request could not be completed. Please try again.";
}

function failure(
  message: string,
  status: number | null,
  fieldErrors?: ApiFieldErrors,
): ApiFailure {
  return { ok: false, message, status, ...(fieldErrors ? { fieldErrors } : {}) };
}

async function parseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

async function post<TResponse, TPayload>(
  path: string,
  payload: TPayload,
): Promise<ApiResult<TResponse>> {
  if (API_MODE === "mock") {
    await delay(MOCK_DELAY_MS);
    return { ok: true, data: mockResponseFor<TResponse, TPayload>(path, payload) };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = await parseBody(response);

    if (response.ok) {
      const data = isRecord(body) && isRecord(body.data)
        ? (body.data as unknown as TResponse)
        : (body as TResponse);
      return { ok: true, data };
    }

    const fieldErrors = extractFieldErrors(body);
    const fallback = messageForStatus(response.status);

    if (response.status === 400 || response.status === 422) {
      return failure(
        fieldErrors
          ? "Please fix the highlighted fields and try again."
          : extractMessage(body, fallback),
        response.status,
        fieldErrors,
      );
    }

    return failure(extractMessage(body, fallback), response.status, fieldErrors);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return failure(
        "The request timed out. Please check your connection and try again.",
        null,
      );
    }

    return failure(
      "Could not reach the server. Please check your connection and try again.",
      null,
    );
  } finally {
    clearTimeout(timer);
  }
}

function mockResponseFor<TResponse, TPayload>(
  path: string,
  payload: TPayload,
): TResponse {
  if (path === ENDPOINTS.register) {
    const registerPayload = payload as RegisterPayload;
    return {
      id: mockId("register"),
      teamName: registerPayload.teamName,
      track: registerPayload.track,
      memberCount: registerPayload.members.length,
      receivedAt: new Date().toISOString(),
    } as unknown as TResponse;
  }

  if (path === ENDPOINTS.contact) {
    return {
      id: mockId("contact"),
      receivedAt: new Date().toISOString(),
    } as unknown as TResponse;
  }

  return {
    id: mockId("mock"),
    receivedAt: new Date().toISOString(),
  } as unknown as TResponse;
}

/**
 * Register a team. The payload deliberately excludes college ID files —
 * file upload to be implemented by the backend (suggest signed upload URL
 * or multipart).
 */
export function registerTeam(
  payload: RegisterPayload,
): Promise<ApiResult<RegisterResponse>> {
  return post<RegisterResponse, RegisterPayload>(ENDPOINTS.register, payload);
}

/** Send a contact/OC message. */
export function sendContactMessage(
  payload: ContactPayload,
): Promise<ApiResult<ContactResponse>> {
  return post<ContactResponse, ContactPayload>(ENDPOINTS.contact, payload);
}
