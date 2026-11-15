"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { lockPageScroll, unlockPageScroll } from "../effects/scroll-lock";
import { Magnetic } from "../fx/Magnetic";
import { Button3D } from "../ui/Button3D";
import { CloseIcon, MenuIcon } from "../ui/icons";
import { cn } from "../ui/cn";
import { MissionClock } from "./MissionClock";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 14);

      if (!menuOpen) {
        if (y > 240 && y > lastY + 8) {
          setHeaderHidden(true);
        } else if (y < lastY - 8 || y < 96) {
          setHeaderHidden(false);
        }
      }

      lastY = y;
    }

    function handleScroll() {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    lockPageScroll();

    const focusTimer = window.setTimeout(() => {
      menuRef.current
        ?.querySelector<HTMLElement>("a, button")
        ?.focus();
    }, 40);

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) {
        return;
      }

      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const menuToggle = menuButtonRef.current;
      const elements = menuToggle ? [menuToggle, ...focusable] : focusable;

      if (elements.length === 0) {
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      unlockPageScroll();
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "site-header sticky top-0 z-50 border-b transition-[background-color,border-color,transform] duration-300 ease-out",
        scrolled
          ? "border-border bg-overlay backdrop-blur-xl"
          : "border-transparent bg-transparent",
        headerHidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
      )}
      data-scrolled={scrolled}
      data-menu-open={menuOpen}
    >
      <div className="mx-auto flex h-16 w-full max-w-[88rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-3 rounded-md"
          aria-label={`${siteConfig.name} home`}
          data-cursor="HOME"
        >
          <span
            className="hidden size-9 shrink-0 place-items-center rounded-md border border-dashed border-border-strong text-[0.5rem] tracking-[0.12em] text-muted transition-colors group-hover:border-primary sm:grid"
            aria-hidden="true"
          >
            LOGO
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold tracking-[0.22em] text-foreground">
              KAKSHYA
            </span>
            <span className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-muted">
              2026 · IIST
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
                data-cursor="OPEN"
                className={cn(
                  "relative rounded-md px-2.5 py-2 text-[0.8125rem] font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                <span className="link-underline">{link.label}</span>
                <span
                  className="nav-indicator"
                  data-active={active}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <MissionClock className="hidden lg:flex" />
          <Magnetic className="hidden sm:inline-block">
            <Button3D
              href={siteConfig.registerCta.href}
              size="sm"
              data-cursor="LAUNCH"
            >
              {siteConfig.registerCta.label}
            </Button3D>
          </Magnetic>
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-primary hover:text-primary xl:hidden"
          >
            {menuOpen ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          ref={menuRef}
          data-lenis-prevent
          className="fixed inset-0 top-16 z-40 overflow-y-auto overscroll-contain border-t border-border bg-background-deep/95 xl:hidden"
        >
          <div className="absolute inset-0 bg-mission-grid opacity-40" aria-hidden="true" />
          <nav
            aria-label="Mobile primary"
            className="relative mx-auto flex min-h-full w-full max-w-[88rem] flex-col px-4 pb-10 pt-6 sm:px-6"
          >
            <p className="telemetry mb-4">Mission index</p>
            <ul className="flex flex-col">
              {siteConfig.navLinks.map((link, index) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <li
                    key={link.href}
                    className="mobile-link-enter border-b border-border/60"
                    style={{ animationDelay: `${90 + index * 32}ms` }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-4 py-3.5 text-lg font-medium tracking-tight transition-colors",
                        active
                          ? "text-primary"
                          : "text-foreground hover:text-primary",
                      )}
                    >
                      <span>{link.label}</span>
                      <span className="font-mono text-[0.625rem] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col gap-4">
              <Button3D
                href={siteConfig.registerCta.href}
                size="lg"
                className="w-full"
                data-cursor="LAUNCH"
                onClick={() => setMenuOpen(false)}
              >
                {siteConfig.registerCta.label}
              </Button3D>
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface/70 px-4 py-3">
                <MissionClock />
                <span className="telemetry text-[0.5625rem]">
                  {siteConfig.subtitle}
                </span>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
