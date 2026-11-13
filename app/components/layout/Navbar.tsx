"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { Button } from "../ui/Button";
import { CloseIcon, MenuIcon, OrbitMark } from "../ui/icons";
import { cn } from "../ui/cn";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-overlay backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-3 rounded-md"
          aria-label={`${siteConfig.name} home`}
        >
          <OrbitMark className="size-8 text-primary" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-[0.08em] text-foreground">
              {siteConfig.name}
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 xl:flex"
        >
          {siteConfig.navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-raised text-primary"
                    : "text-muted hover:bg-surface-raised hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            href={siteConfig.registerCta.href}
            size="sm"
            className="ml-3"
          >
            {siteConfig.registerCta.label}
          </Button>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-surface-raised xl:hidden"
        >
          {open ? (
            <CloseIcon className="size-5" />
          ) : (
            <MenuIcon className="size-5" />
          )}
        </button>
      </div>

      <div
        id="mobile-navigation"
        hidden={!open}
        className="border-t border-border bg-background xl:hidden"
      >
        <nav
          aria-label="Mobile primary"
          className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
        >
          {siteConfig.navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-raised text-primary"
                    : "text-muted hover:bg-surface-raised hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            href={siteConfig.registerCta.href}
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            {siteConfig.registerCta.label}
          </Button>
        </nav>
      </div>
    </header>
  );
}
