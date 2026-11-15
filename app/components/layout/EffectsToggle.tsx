"use client";

import { useEffects, type EffectsMode } from "../effects/effects-provider";
import { useToast } from "../effects/ToastProvider";
import { cn } from "../ui/cn";

const options: Array<{ value: EffectsMode; label: string }> = [
  { value: "full", label: "Full" },
  { value: "lite", label: "Lite" },
  { value: "off", label: "Off" },
];

export function EffectsToggle() {
  const { toast } = useToast();
  const { mode, setMode, autoMode } = useEffects();
  const isAuto = autoMode === mode;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="telemetry text-[0.5625rem] tracking-[0.22em]">
          Effects
        </p>
        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted">
          {isAuto ? `Auto · ${mode}` : "Manual"}
        </span>
      </div>

      <div
        role="group"
        aria-label="Effects mode"
        className="inline-flex rounded-full border border-border bg-background/70 p-1"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={mode === option.value}
            onClick={() => {
              if (mode === option.value) {
                return;
              }

              setMode(option.value);
              toast({
                title: `Effects set to ${option.label}`,
                tone: "success",
              });
            }}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] transition-colors",
              mode === option.value
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="max-w-[16rem] text-xs leading-relaxed text-muted">
        Motion, cursor and 3D detail. Lite keeps the scene with fewer
        particles; Off falls back to static CSS.
      </p>
    </div>
  );
}
