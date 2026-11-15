"use client";

import { useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { useToast } from "../effects/ToastProvider";
import { ArrowRightIcon } from "./icons";
import { cn } from "./cn";

export function ShareButton({ className }: { className?: string }) {
  const { toast } = useToast();
  const [sharing, setSharing] = useState(false);

  async function share() {
    if (sharing) {
      return;
    }

    setSharing(true);
    const url = window.location.href;
    const title = document.title || siteConfig.name;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: siteConfig.description,
          url,
        });
        toast({ title: "Shared", tone: "success" });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", tone: "success" });
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", tone: "success" });
      } catch {
        toast({ title: "Clipboard unavailable", tone: "warning" });
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <button
      type="button"
      className={cn("share-button", className)}
      onClick={share}
      aria-label="Share this page"
      aria-busy={sharing}
      data-cursor="OPEN"
    >
      Share
      <ArrowRightIcon className="size-4 rotate-[-45deg]" />
    </button>
  );
}
