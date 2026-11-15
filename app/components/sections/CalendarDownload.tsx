"use client";

import { timeline } from "@/app/content/event-data";
import { siteConfig } from "@/app/content/site-config";
import { Button3D } from "../ui/Button3D";
import { useToast } from "../effects/ToastProvider";
import { useEffectsMode } from "../effects/effects-provider";
import { cn } from "../ui/cn";

export function CalendarDownload() {
  const { toast } = useToast();
  const mode = useEffectsMode();
  const iso = siteConfig.eventStartISO;
  const t0 = iso ? Date.parse(iso) : null;
  const disabled = !iso || t0 === null || Number.isNaN(t0);

  if (disabled) {
    return (
      <div className="calendar-tba" role="note" aria-label="Calendar date to be announced">
        <Button3D
          type="button"
          disabled
          variant="secondary"
          size="sm"
          title="The add-to-calendar action activates once the official date is announced."
          aria-label="Add to calendar unavailable because the date is to be announced"
        >
          Date TBA
        </Button3D>
        <p id="calendar-tba-note" className="calendar-tba-note">
          Add-to-calendar activates once the official kickoff is confirmed.
        </p>
      </div>
    );
  }

  return (
    <details className="calendar-download">
      <summary
        className={cn("calendar-summary", mode !== "off" && "calendar-summary-live")}
        data-cursor="OPEN"
      >
        Add to calendar
      </summary>
      <div className="calendar-download-body">
        <button
          type="button"
          className="calendar-add-all"
          data-cursor="OPEN"
          onClick={async () => {
            const { buildCalendar, downloadCalendar } = await import("./ics");
            downloadCalendar("kosmodrome-2026-all.ics", buildCalendar(timeline, t0));
            toast({ title: "Calendar downloaded", tone: "success" });
          }}
        >
          Add all {timeline.length} moments
        </button>
        <ul className="calendar-list">
          {timeline.map((item) => (
            <li key={item.id} className="calendar-list-item">
              <span className="calendar-list-when">{item.when}</span>
              <span className="calendar-list-event">{item.event}</span>
              <button
                type="button"
                className="calendar-item-download"
                data-cursor="OPEN"
                onClick={async () => {
                  const { buildCalendar, downloadCalendar } = await import("./ics");
                  downloadCalendar(`kosmodrome-${item.id}.ics`, buildCalendar([item], t0));
                  toast({ title: "Milestone downloaded", tone: "success" });
                }}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
