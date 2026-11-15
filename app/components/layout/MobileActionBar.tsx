"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { subscribeScroll } from "../effects/scroll-store";
import { useMediaQuery } from "../effects/use-media-query";
import { Button3D } from "../ui/Button3D";
import { MenuIcon } from "../ui/icons";

export function MobileActionBar() {
  const pathname = usePathname();
  const smallScreen = useMediaQuery("(max-width: 1023px)");
  const [pastHero, setPastHero] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(
    () =>
      subscribeScroll(() => {
        setPastHero(window.scrollY > window.innerHeight * 0.72);
      }),
    [],
  );

  useEffect(() => {
    function handleFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement | null;
      setEditing(
        Boolean(
          target?.closest(
            'input, textarea, select, [contenteditable="true"], [role="textbox"]',
          ),
        ),
      );
    }

    function handleFocusOut() {
      window.requestAnimationFrame(() => setEditing(false));
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  if (!smallScreen || pathname === "/register" || !pastHero || editing) {
    return null;
  }

  const open = siteConfig.registrationOpen;

  return (
    <div
      className="mobile-action-bar"
      role="region"
      aria-label="Quick actions"
    >
      <Button3D
        href={siteConfig.registerCta.href}
        size="lg"
        variant={open ? "primary" : "secondary"}
        className="mobile-action-register"
        data-cursor="LAUNCH"
      >
        {open ? siteConfig.registerCta.label : "Registration preview"}
      </Button3D>
      <button
        type="button"
        className="mobile-action-menu"
        aria-label="Open command deck menu"
        data-cursor="EXPAND"
        onClick={() => window.dispatchEvent(new CustomEvent("kosmodrome:open-navigation"))}
      >
        <MenuIcon className="size-5" />
        <span className="sr-only">Open navigation</span>
      </button>
    </div>
  );
}
