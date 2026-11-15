import { type TimelineItem } from "@/app/content/event-data";
import { siteConfig } from "@/app/content/site-config";

const HOUR = 3_600_000;
const DAY = 86_400_000;

function parseClock(clock: string) {
  const match = clock.match(/(\d{1,2}):(\d{2})/);

  if (!match) {
    return null;
  }

  return {
    hour: (Number(match[1]) + 24 - 5) % 24,
    minute: Number(match[2]),
  };
}

function startOffsetMs(item: TimelineItem, t0: number) {
  const when = item.when;
  const dayMatch = when.match(/^D-(\d+)/);

  if (dayMatch) {
    const days = Number(dayMatch[1]);
    const t0Date = new Date(t0);

    if (item.clock) {
      const clock = parseClock(item.clock);

      if (clock) {
        return Date.UTC(
          t0Date.getUTCFullYear(),
          t0Date.getUTCMonth(),
          t0Date.getUTCDate() - days,
          clock.hour,
          clock.minute,
        );
      }
    }

    return t0 - days * DAY;
  }

  const match = when.match(/^T([+-])(\d+)/);

  if (!match) {
    return t0;
  }

  const sign = match[1] === "+" ? 1 : -1;
  return t0 + sign * Number(match[2]) * HOUR;
}

function endOffsetMs(item: TimelineItem, t0: number) {
  const end = item.when.match(/to\s+([DT][+-]?\d+h?|D-\d+)/i)?.[1];

  if (end) {
    const asItem = { ...item, when: end };
    return startOffsetMs(asItem, t0);
  }

  if (item.event.includes("30-minute")) {
    return startOffsetMs(item, t0) + 30 * 60_000;
  }

  return startOffsetMs(item, t0) + HOUR;
}

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function formatIcs(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function fold(line: string) {
  const chunks: string[] = [];
  let rest = line;

  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = ` ${rest.slice(75)}`;
  }

  chunks.push(rest);
  return chunks.join("\r\n");
}

function buildEvent(item: TimelineItem, t0: number) {
  const start = new Date(startOffsetMs(item, t0));
  const end = new Date(endOffsetMs(item, t0));
  const summary = `${siteConfig.name}: ${item.event}`;
  const description = [item.event, item.note].filter(Boolean).join(" ? ");

  return [
    "BEGIN:VEVENT",
    `UID:kosmodrome-${item.id}@kosmodrome2026.invalid`,
    `DTSTAMP:${formatIcs(new Date())}`,
    `DTSTART:${formatIcs(start)}`,
    `DTEND:${formatIcs(end)}`,
    fold(`SUMMARY:${escapeIcs(summary)}`),
    fold(`DESCRIPTION:${escapeIcs(description)}`),
    "END:VEVENT",
  ].join("\r\n");
}

export function buildCalendar(items: TimelineItem[], t0: number) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IIST//Kosmodrome 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...items.map((item) => buildEvent(item, t0)),
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadCalendar(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener noreferrer";
  anchor.click();
  URL.revokeObjectURL(url);
}
