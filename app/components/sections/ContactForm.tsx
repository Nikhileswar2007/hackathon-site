"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { isMockMode, sendContactMessage } from "@/app/services/api";
import { useToast } from "../effects/ToastProvider";
import { contactTopics } from "@/app/content/event-data";
import { Badge } from "../ui/Badge";
import { Button3D } from "../ui/Button3D";
import { cn } from "../ui/cn";

interface ContactState {
  name: string;
  email: string;
  topic: string;
  message: string;
}

type ContactErrors = Partial<Record<keyof ContactState, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function validate(state: ContactState): ContactErrors {
  const errors: ContactErrors = {};

  if (!state.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!state.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!emailPattern.test(state.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!state.topic) {
    errors.topic = "Select a topic.";
  }

  if (!state.message.trim()) {
    errors.message = "Enter a message.";
  }

  return errors;
}

export function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactState>({
    name: "",
    email: "",
    topic: "",
    message: "",
  });
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<ContactErrors>({});
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (submitted) {
      successHeadingRef.current?.focus();
    }
  }, [submitted]);

  const errors: ContactErrors = {
    ...(attempted ? validate(form) : {}),
    ...serverFieldErrors,
  };
  const errorCount = Object.keys(errors).length;

  async function submitMessage() {
    setSubmitting(true);
    setServerFieldErrors({});

    try {
      const result = await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        topic: form.topic,
        message: form.message.trim(),
      });

      if (result.ok) {
        setSubmitted(true);
        toast(
          isMockMode()
            ? {
                title: "Message preview complete",
                description: "This preview validates locally. Nothing is sent.",
                tone: "success",
              }
            : {
                title: "Message received",
                description:
                  "The organising committee will get back to you on the official channels.",
                tone: "success",
              },
        );
        return;
      }

      if (result.fieldErrors) {
        const mapped: ContactErrors = {};
        for (const [key, value] of Object.entries(result.fieldErrors)) {
          if (key in form) {
            mapped[key as keyof ContactState] = value;
          }
        }
        setServerFieldErrors(mapped);
        setAttempted(true);
      }

      toast({
        title: "Message not sent",
        description: result.message,
        tone: "warning",
        action: {
          label: "Retry",
          onAction: () => {
            void submitMessage();
          },
        },
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);

    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0 || submitting) {
      return;
    }

    void submitMessage();
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="success-panel rounded-xl border border-success bg-success-soft p-6 shadow-[var(--elev-2)]"
      >
        <Badge tone="success">
          {isMockMode() ? "Preview complete" : "Message received"}
        </Badge>
        <h3
          ref={successHeadingRef}
          tabIndex={-1}
          className="mt-4 text-xl font-semibold tracking-tight text-foreground"
        >
          {isMockMode() ? "Message ready." : "Message received."}
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          {isMockMode()
            ? "Nothing was sent. This is a frontend preview; the contact backend will be connected later."
            : "Your message was received by the organising committee. They reply on the official channels."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button3D type="button" onClick={() => setSubmitted(false)}>
            Write another message
          </Button3D>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-foreground"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name ? (
            <p
              id="contact-name-error"
              className="mt-1 text-xs leading-relaxed text-danger"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={fieldClass(Boolean(errors.email))}
          />
          {errors.email ? (
            <p
              id="contact-email-error"
              className="mt-1 text-xs leading-relaxed text-danger"
            >
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="contact-topic"
            className="block text-sm font-medium text-foreground"
          >
            Topic
          </label>
          <select
            id="contact-topic"
            name="topic"
            value={form.topic}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                topic: event.target.value,
              }))
            }
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={
              errors.topic ? "contact-topic-error" : undefined
            }
            className={fieldClass(Boolean(errors.topic))}
          >
            <option value="">Select a topic</option>
            {contactTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          {errors.topic ? (
            <p
              id="contact-topic-error"
              className="mt-1 text-xs leading-relaxed text-danger"
            >
              {errors.topic}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-foreground"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={form.message}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            className={fieldClass(Boolean(errors.message))}
          />
          {errors.message ? (
            <p
              id="contact-message-error"
              className="mt-1 text-xs leading-relaxed text-danger"
            >
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      {attempted && errorCount > 0 ? (
        <div
          role="alert"
          className="rounded-lg border border-danger bg-danger-soft p-4 text-sm leading-relaxed text-danger"
        >
          Please fix the highlighted fields before submitting.
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          {isMockMode()
            ? "This form validates locally. Nothing is sent in this preview."
            : "Messages go straight to the organiser."}
        </p>
        <Button3D type="submit" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Sending…" : "Send message"}
        </Button3D>
      </div>
    </form>
  );
}
