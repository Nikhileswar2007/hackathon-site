"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { programmeOptions, tracks } from "@/app/content/event-data";
import { siteConfig, TBA } from "@/app/content/site-config";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { cn } from "../ui/cn";

interface MemberForm {
  id: string;
  fullName: string;
  email: string;
  college: string;
  programme: string;
  collegeId: File | null;
}

interface RegistrationState {
  teamName: string;
  track: string;
  leaderEmail: string;
  members: MemberForm[];
  rulebookAccepted: boolean;
  declarationAccepted: boolean;
  seniorityConfirmed: boolean;
}

type FieldErrors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const advancedProgrammes = new Set([
  "UG year 3",
  "UG year 4+",
  "PG",
  "PhD",
  "Graduate within six months",
]);

const fieldBase =
  "mt-2 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors";

function fieldClass(hasError: boolean) {
  return cn(
    fieldBase,
    hasError
      ? "border-danger"
      : "border-border hover:border-border-strong",
  );
}

function createMember(id: string): MemberForm {
  return {
    id,
    fullName: "",
    email: "",
    college: "",
    programme: "",
    collegeId: null,
  };
}

function isAllowedCollegeId(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return (
    type.startsWith("image/") ||
    type === "application/pdf" ||
    /\.(png|jpe?g|gif|webp|pdf)$/.test(name)
  );
}

function validate(state: RegistrationState): FieldErrors {
  const errors: FieldErrors = {};

  if (!state.teamName.trim()) {
    errors.teamName = "Enter a team name.";
  }

  if (!state.track) {
    errors.track = "Select a track.";
  }

  if (!state.leaderEmail.trim()) {
    errors.leaderEmail = "Enter the team leader email.";
  } else if (!emailPattern.test(state.leaderEmail.trim())) {
    errors.leaderEmail = "Enter a valid email address.";
  }

  if (state.members.length < 2) {
    errors.form = "A team needs at least two members.";
  }

  const emailCounts = new Map<string, number>();

  for (const member of state.members) {
    const normalized = member.email.trim().toLowerCase();
    if (normalized) {
      emailCounts.set(normalized, (emailCounts.get(normalized) ?? 0) + 1);
    }
  }

  for (const member of state.members) {
    const prefix = `members.${member.id}`;

    if (!member.fullName.trim()) {
      errors[`${prefix}.fullName`] = "Enter the member's full name.";
    }

    if (!member.email.trim()) {
      errors[`${prefix}.email`] = "Enter an institutional email.";
    } else if (!emailPattern.test(member.email.trim())) {
      errors[`${prefix}.email`] = "Enter a valid email address.";
    } else if (
      (emailCounts.get(member.email.trim().toLowerCase()) ?? 0) > 1
    ) {
      errors[`${prefix}.email`] =
        "This email is already used by another member.";
    }

    if (!member.college.trim()) {
      errors[`${prefix}.college`] = "Enter the institution name.";
    }

    if (!member.programme) {
      errors[`${prefix}.programme`] = "Select a programme and year.";
    }

    if (!member.collegeId) {
      errors[`${prefix}.collegeId`] = "Select a college ID file.";
    } else if (!isAllowedCollegeId(member.collegeId)) {
      errors[`${prefix}.collegeId`] = "Use an image or PDF file.";
    }
  }

  if (!state.rulebookAccepted) {
    errors.rulebookAccepted = "Accept the draft rulebook to continue.";
  }

  if (!state.declarationAccepted) {
    errors.declarationAccepted =
      "Accept the Integrity Declaration to continue.";
  }

  if (!state.seniorityConfirmed) {
    errors.seniorityConfirmed =
      "Confirm the seniority and track declaration.";
  }

  return errors;
}

export function RegisterForm() {
  const [form, setForm] = useState<RegistrationState>({
    teamName: "",
    track: "",
    leaderEmail: "",
    members: [createMember("member-1"), createMember("member-2")],
    rulebookAccepted: false,
    declarationAccepted: false,
    seniorityConfirmed: false,
  });
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const nextMemberId = useRef(3);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitted) {
      successHeadingRef.current?.focus();
    }
  }, [submitted]);

  const errors: FieldErrors = attempted ? validate(form) : {};
  const errorCount = Object.keys(errors).length;

  const hasAdvancedProgramme = form.members.some((member) =>
    advancedProgrammes.has(member.programme),
  );
  const hasGraduate = form.members.some(
    (member) => member.programme === "Graduate within six months",
  );
  const showAdvancedHint = form.track === "Beginner" && hasAdvancedProgramme;

  function updateMember(id: string, patch: Partial<MemberForm>) {
    setForm((current) => ({
      ...current,
      members: current.members.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    }));
  }

  function addMember() {
    if (form.members.length >= 4) {
      return;
    }

    const id = `member-${nextMemberId.current}`;
    nextMemberId.current += 1;

    setForm((current) => ({
      ...current,
      members: [...current.members, createMember(id)],
    }));
  }

  function removeMember(id: string) {
    if (form.members.length <= 2) {
      return;
    }

    setForm((current) => ({
      ...current,
      members: current.members.filter((member) => member.id !== id),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // TODO: connect backend — POST the validated registration payload to the registration API.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-success bg-success-soft p-6"
      >
        <Badge tone="success">Preview complete</Badge>
        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-4 text-xl font-semibold tracking-tight text-foreground"
        >
          Registration preview ready.
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Nothing was sent and nothing was stored.{" "}
          {siteConfig.registrationOpen
            ? "The backend connection is still to be added."
            : "Registration is not open yet, so this was a preview only."}
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-3">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
              Team
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {form.teamName}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
              Track
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {form.track}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3">
            <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
              Members
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {form.members.length}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={() => setSubmitted(false)}>
            Back to edit
          </Button>
          <Button href="/rules" variant="secondary">
            Read the rules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <section
        className="rounded-xl border border-border bg-surface p-5 sm:p-6"
        aria-labelledby="team-details-heading"
      >
        <h3
          id="team-details-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Team details
        </h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-foreground"
            >
              Team name
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              autoComplete="organization"
              value={form.teamName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  teamName: event.target.value,
                }))
              }
              aria-invalid={Boolean(errors.teamName)}
              aria-describedby={
                errors.teamName ? "teamName-error" : undefined
              }
              className={fieldClass(Boolean(errors.teamName))}
              placeholder="e.g. Orbital Originals"
            />
            {errors.teamName ? (
              <p
                id="teamName-error"
                className="mt-1 text-xs leading-relaxed text-danger"
              >
                {errors.teamName}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="track"
              className="block text-sm font-medium text-foreground"
            >
              Track
            </label>
            <select
              id="track"
              name="track"
              value={form.track}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  track: event.target.value,
                }))
              }
              aria-invalid={Boolean(errors.track)}
              aria-describedby={
                errors.track ? "track-note track-error" : "track-note"
              }
              className={fieldClass(Boolean(errors.track))}
            >
              <option value="">Select a track</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.name}>
                  {track.name}
                </option>
              ))}
            </select>
            <p id="track-note" className="mt-2 text-xs leading-relaxed text-muted">
              Opting up to Advanced is allowed. Moving down is never allowed.
            </p>
            {errors.track ? (
              <p
                id="track-error"
                className="mt-1 text-xs leading-relaxed text-danger"
              >
                {errors.track}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="leaderEmail"
              className="block text-sm font-medium text-foreground"
            >
              Team leader email
            </label>
            <input
              id="leaderEmail"
              name="leaderEmail"
              type="email"
              autoComplete="email"
              value={form.leaderEmail}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  leaderEmail: event.target.value,
                }))
              }
              aria-invalid={Boolean(errors.leaderEmail)}
              aria-describedby={
                errors.leaderEmail ? "leaderEmail-error" : undefined
              }
              className={fieldClass(Boolean(errors.leaderEmail))}
              placeholder="leader@institution.ac.in"
            />
            {errors.leaderEmail ? (
              <p
                id="leaderEmail-error"
                className="mt-1 text-xs leading-relaxed text-danger"
              >
                {errors.leaderEmail}
              </p>
            ) : null}
          </div>
        </div>

        {showAdvancedHint ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 rounded-lg border border-warning bg-warning-soft p-4 text-sm leading-relaxed text-foreground"
          >
            <p className="font-medium text-warning">Track hint: Advanced</p>
            <p className="mt-1">
              {hasGraduate
                ? "A graduate within six months is Advanced only. Choose Advanced to match the rule."
                : "One or more members are UG year 3+, PG or PhD. The seniority rule points to Advanced."}{" "}
              This is a helper hint, not a hard block. Opting up is always
              allowed.
            </p>
          </div>
        ) : null}
      </section>

      <section
        className="rounded-xl border border-border bg-surface p-5 sm:p-6"
        aria-labelledby="members-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3
              id="members-heading"
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Members
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Teams need 2 to 4 members. At least two are required.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addMember}
            disabled={form.members.length >= 4}
          >
            Add member
          </Button>
        </div>

        <div className="mt-5 space-y-5">
          {form.members.map((member, index) => {
            const prefix = `members.${member.id}`;
            return (
              <div
                key={member.id}
                className="rounded-xl border border-border bg-background"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
                  <h4 className="text-sm font-semibold text-foreground">
                    Member {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                    disabled={form.members.length <= 2}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                  <div>
                    <label
                      htmlFor={`${member.id}-fullName`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Full name
                    </label>
                    <input
                      id={`${member.id}-fullName`}
                      name={`members[${index}].fullName`}
                      type="text"
                      autoComplete="name"
                      value={member.fullName}
                      onChange={(event) =>
                        updateMember(member.id, {
                          fullName: event.target.value,
                        })
                      }
                      aria-invalid={Boolean(errors[`${prefix}.fullName`])}
                      aria-describedby={
                        errors[`${prefix}.fullName`]
                          ? `${member.id}-fullName-error`
                          : undefined
                      }
                      className={fieldClass(
                        Boolean(errors[`${prefix}.fullName`]),
                      )}
                    />
                    {errors[`${prefix}.fullName`] ? (
                      <p
                        id={`${member.id}-fullName-error`}
                        className="mt-1 text-xs leading-relaxed text-danger"
                      >
                        {errors[`${prefix}.fullName`]}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor={`${member.id}-email`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Institutional email
                    </label>
                    <input
                      id={`${member.id}-email`}
                      name={`members[${index}].email`}
                      type="email"
                      autoComplete="email"
                      value={member.email}
                      onChange={(event) =>
                        updateMember(member.id, {
                          email: event.target.value,
                        })
                      }
                      aria-invalid={Boolean(errors[`${prefix}.email`])}
                      aria-describedby={
                        errors[`${prefix}.email`]
                          ? `${member.id}-email-error`
                          : undefined
                      }
                      className={fieldClass(
                        Boolean(errors[`${prefix}.email`]),
                      )}
                      placeholder="member@institution.ac.in"
                    />
                    {errors[`${prefix}.email`] ? (
                      <p
                        id={`${member.id}-email-error`}
                        className="mt-1 text-xs leading-relaxed text-danger"
                      >
                        {errors[`${prefix}.email`]}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`${member.id}-college`}
                      className="block text-sm font-medium text-foreground"
                    >
                      College or institution
                    </label>
                    <input
                      id={`${member.id}-college`}
                      name={`members[${index}].college`}
                      type="text"
                      autoComplete="organization"
                      value={member.college}
                      onChange={(event) =>
                        updateMember(member.id, {
                          college: event.target.value,
                        })
                      }
                      aria-invalid={Boolean(errors[`${prefix}.college`])}
                      aria-describedby={
                        errors[`${prefix}.college`]
                          ? `${member.id}-college-error`
                          : undefined
                      }
                      className={fieldClass(
                        Boolean(errors[`${prefix}.college`]),
                      )}
                    />
                    {errors[`${prefix}.college`] ? (
                      <p
                        id={`${member.id}-college-error`}
                        className="mt-1 text-xs leading-relaxed text-danger"
                      >
                        {errors[`${prefix}.college`]}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor={`${member.id}-programme`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Programme and year
                    </label>
                    <select
                      id={`${member.id}-programme`}
                      name={`members[${index}].programme`}
                      value={member.programme}
                      onChange={(event) =>
                        updateMember(member.id, {
                          programme: event.target.value,
                        })
                      }
                      aria-invalid={Boolean(
                        errors[`${prefix}.programme`],
                      )}
                      aria-describedby={
                        errors[`${prefix}.programme`]
                          ? `${member.id}-programme-error`
                          : undefined
                      }
                      className={fieldClass(
                        Boolean(errors[`${prefix}.programme`]),
                      )}
                    >
                      <option value="">Select programme and year</option>
                      {programmeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors[`${prefix}.programme`] ? (
                      <p
                        id={`${member.id}-programme-error`}
                        className="mt-1 text-xs leading-relaxed text-danger"
                      >
                        {errors[`${prefix}.programme`]}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor={`${member.id}-college-id`}
                      className="block text-sm font-medium text-foreground"
                    >
                      College ID (image or PDF)
                    </label>
                    <input
                      id={`${member.id}-college-id`}
                      name={`members[${index}].collegeId`}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(event) =>
                        updateMember(member.id, {
                          collegeId: event.target.files?.[0] ?? null,
                        })
                      }
                      aria-invalid={Boolean(
                        errors[`${prefix}.collegeId`],
                      )}
                      aria-describedby={
                        errors[`${prefix}.collegeId`]
                          ? `${member.id}-college-id-note ${member.id}-college-id-error`
                          : `${member.id}-college-id-note`
                      }
                      className={cn(
                        "mt-2 block w-full cursor-pointer rounded-md border bg-background text-sm text-muted file:mr-3 file:cursor-pointer file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary-hover",
                        errors[`${prefix}.collegeId`]
                          ? "border-danger"
                          : "border-border",
                      )}
                    />
                    <p
                      id={`${member.id}-college-id-note`}
                      className="mt-2 text-xs leading-relaxed text-muted"
                    >
                      UI only: the file stays in this browser and is not
                      uploaded.
                    </p>
                    {errors[`${prefix}.collegeId`] ? (
                      <p
                        id={`${member.id}-college-id-error`}
                        className="mt-1 text-xs leading-relaxed text-danger"
                      >
                        {errors[`${prefix}.collegeId`]}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="rounded-xl border border-border bg-surface p-5 sm:p-6"
        aria-labelledby="consent-heading"
      >
        <h3
          id="consent-heading"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Consent
        </h3>

        <div className="mt-5 space-y-4">
          <div>
            <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-foreground">
              <input
                type="checkbox"
                checked={form.rulebookAccepted}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    rulebookAccepted: event.target.checked,
                  }))
                }
                aria-invalid={Boolean(errors.rulebookAccepted)}
                aria-describedby={
                  errors.rulebookAccepted
                    ? "rulebookAccepted-error"
                    : undefined
                }
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span>
                We have read and accept the{" "}
                <Link
                  href="/rules"
                  className="text-primary underline underline-offset-4"
                >
                  draft rulebook
                </Link>
                .
              </span>
            </label>
            {errors.rulebookAccepted ? (
              <p
                id="rulebookAccepted-error"
                className="mt-1 pl-7 text-xs leading-relaxed text-danger"
              >
                {errors.rulebookAccepted}
              </p>
            ) : null}
          </div>

          <div>
            <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-foreground">
              <input
                type="checkbox"
                checked={form.declarationAccepted}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    declarationAccepted: event.target.checked,
                  }))
                }
                aria-invalid={Boolean(errors.declarationAccepted)}
                aria-describedby={
                  errors.declarationAccepted
                    ? "declarationAccepted-error"
                    : undefined
                }
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span>
                Every member accepts the{" "}
                <Link
                  href="/fair-play"
                  className="text-primary underline underline-offset-4"
                >
                  Integrity Declaration
                </Link>
                .
              </span>
            </label>
            {errors.declarationAccepted ? (
              <p
                id="declarationAccepted-error"
                className="mt-1 pl-7 text-xs leading-relaxed text-danger"
              >
                {errors.declarationAccepted}
              </p>
            ) : null}
          </div>

          <div>
            <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-foreground">
              <input
                type="checkbox"
                checked={form.seniorityConfirmed}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    seniorityConfirmed: event.target.checked,
                  }))
                }
                aria-invalid={Boolean(errors.seniorityConfirmed)}
                aria-describedby={
                  errors.seniorityConfirmed
                    ? "seniorityConfirmed-error"
                    : undefined
                }
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span>
                We declare that our programme, year and track details are
                accurate, and that the most senior member sets the track.
              </span>
            </label>
            {errors.seniorityConfirmed ? (
              <p
                id="seniorityConfirmed-error"
                className="mt-1 pl-7 text-xs leading-relaxed text-danger"
              >
                {errors.seniorityConfirmed}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {errors.form ? (
        <p className="text-sm leading-relaxed text-danger">{errors.form}</p>
      ) : null}

      {attempted && errorCount > 0 ? (
        <div
          role="alert"
          className="rounded-lg border border-danger bg-danger-soft p-4 text-sm leading-relaxed text-danger"
        >
          Please fix the highlighted fields before submitting.{" "}
          {errorCount === 1
            ? "One field needs attention."
            : `${errorCount} fields need attention.`}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          Fee: {siteConfig.registrationFee ?? TBA}. Nothing is sent in this
          preview.
        </p>
        <Button type="submit">Submit registration</Button>
      </div>
    </form>
  );
}
