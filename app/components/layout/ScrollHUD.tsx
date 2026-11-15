"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useEffects } from "../effects/effects-provider";
import { getScrollState, subscribeScroll } from "../effects/scroll-store";

interface HudState {
  altitude: number;
  label: string;
}

const METER_HEIGHT = 260;
const MAX_ALTITUDE = 400;

const ticks = [
  { at: 400, label: "ORBIT" },
  { at: 270, label: "MAX-Q" },
  { at: 135, label: "LIFTOFF" },
  { at: 0, label: "PAD" },
] as const;

export function ScrollHUD() {
  const pathname = usePathname();
  const { mode } = useEffects();
  const [hud, setHud] = useState<HudState>({
    altitude: 0,
    label: "ORBIT",
  });

  useEffect(() => {
    let frame = 0;

    function readSections() {
      return Array.from(
        document.querySelectorAll<HTMLElement>("[data-hud]"),
      )
        .map((element) => ({
          element,
          label: element.dataset.hud ?? "ORBIT",
        }))
        .filter((section) => section.element.offsetParent !== null);
    }

    let sections = readSections();

    function update() {
      frame = 0;
      const state = getScrollState();
      const altitude = Math.round(state.progress * MAX_ALTITUDE);
      let label = sections[0]?.label ?? "ORBIT";
      const line = window.innerHeight * 0.45;

      for (const section of sections) {
        const rect = section.element.getBoundingClientRect();
        if (rect.top <= line) {
          label = section.label;
        } else {
          break;
        }
      }

      setHud((current) =>
        current.altitude === altitude && current.label === label
          ? current
          : { altitude, label },
      );
    }

    function schedule() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    }

    sections = readSections();
    update();

    const unsubscribe = subscribeScroll(schedule);
    const refresh = window.setTimeout(() => {
      sections = readSections();
      schedule();
    }, 350);

    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      unsubscribe();
      window.clearTimeout(refresh);
      window.removeEventListener("resize", schedule);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  const progress = hud.altitude / MAX_ALTITUDE;
  const markerOffset = (1 - progress) * (METER_HEIGHT - 8);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-border/60 lg:hidden"
        aria-hidden="true"
      >
        <span className="scroll-progress-bar block h-full origin-left bg-primary" />
      </div>

      <aside
        className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block xl:right-8"
        aria-hidden="true"
      >
        <div className="flex flex-col items-end gap-3">
          <div className="rounded-md border border-border/80 bg-surface/90 px-3 py-2 text-right">
            <p className="telemetry text-[0.5rem] tracking-[0.2em]">
              Altitude
            </p>
            <p className="mt-1 font-mono text-sm tabular-nums text-foreground">
              ALT {String(hud.altitude).padStart(3, "0")} KM
            </p>
          </div>

          <div className="flex items-stretch gap-3">
            <div className="relative w-10" style={{ height: METER_HEIGHT }}>
              <span className="absolute right-0 top-0 h-full w-px bg-border" />
              {ticks.map((tick) => (
                <span
                  key={tick.at}
                  className="absolute right-0 h-px w-2 bg-border-strong"
                  style={{ top: `${(1 - tick.at / MAX_ALTITUDE) * 100}%` }}
                />
              ))}
              <span
                className="absolute right-0 h-2 w-3 bg-primary shadow-[0_0_12px_var(--primary)]"
                style={{
                  top: 0,
                  transform: `translate3d(0, ${markerOffset}px, 0)`,
                  transition:
                    mode === "off"
                      ? undefined
                      : "transform 240ms linear",
                }}
              />
            </div>

            <div
              className="flex flex-col justify-between font-mono text-[0.5rem] tracking-[0.14em] text-muted"
              style={{ height: METER_HEIGHT }}
            >
              {ticks.map((tick) => (
                <span key={tick.at}>{tick.label}</span>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border/80 bg-surface/90 px-3 py-2 text-right">
            <p className="telemetry text-[0.5rem] tracking-[0.2em]">Stage</p>
            <p className="mt-1 font-mono text-[0.625rem] tracking-[0.16em] text-primary">
              {hud.label}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
