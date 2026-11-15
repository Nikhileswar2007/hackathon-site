"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/app/content/site-config";
import { lockPageScroll, unlockPageScroll } from "../effects/scroll-lock";
import { useEffectsMode } from "../effects/effects-provider";
import { useMediaQuery } from "../effects/use-media-query";
import { subscribeScroll } from "../effects/scroll-store";
import { Magnetic } from "../fx/Magnetic";
import { Button3D } from "../ui/Button3D";
import { CloseIcon, MenuIcon } from "../ui/icons";
import { Frame } from "../ui/Frame";
import { cn } from "../ui/cn";
import { MissionClock } from "./MissionClock";
import { NavDecode } from "./NavDecode";
import { NavPreviewPanel, type NavPreviewId } from "./NavPreviewPanel";

const OPEN_DELAY = 100;
const CLOSE_DELAY = 220;
const CLOSE_ANIMATION = 120;
const SCROLL_CLOSE_THRESHOLD = 14;

const previewIds = new Set([
  "/about",
  "/tracks",
  "/timeline",
  "/scoring",
  "/rules",
  "/submission",
  "/fair-play",
  "/prizes",
  "/faq",
  "/contact",
]);

function isPreviewId(href: string): href is NavPreviewId {
  return previewIds.has(href);
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function pageLabel(pathname: string) {
  const link = siteConfig.navLinks.find((entry) => isActivePath(pathname, entry.href));
  return link?.label.toUpperCase() ?? "MISSION";
}

export function Navbar() {
  const pathname = usePathname();
  const mode = useEffectsMode();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [openId, setOpenId] = useState<NavPreviewId | null>(null);
  const [closing, setClosing] = useState(false);
  const [anchor, setAnchor] = useState({ left: 0, top: 88, notch: 340 });
  const [lens, setLens] = useState({ x: 0, width: 1 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const openTimer = useRef(0);
  const closeTimer = useRef(0);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function onPopState() {
      setMenuOpen(false);
      setExpandedMobile(null);
      setOpenId(null);
      setClosing(false);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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

  useEffect(
    () =>
      subscribeScroll((state) => {
        const node = progressRef.current;
        if (node) {
          node.style.setProperty("--mission-progress", state.progress.toFixed(4));
        }
      }),
    [],
  );

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

  useEffect(() => {
    function close() {
      if (!openId) {
        return;
      }
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      setClosing(true);
      closeTimer.current = window.setTimeout(() => {
        setOpenId(null);
        setClosing(false);
      }, mode === "off" ? 0 : CLOSE_ANIMATION);
    }

    function onScroll() {
      if (window.scrollY > SCROLL_CLOSE_THRESHOLD) {
        close();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        navRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      close();
    }

    function onBlur() {
      close();
    }

    function onResize() {
      close();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("blur", onBlur);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", onResize);
    };
  }, [mode, openId]);

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  function measureAnchor(href: string, index: number) {
    const item = itemRefs.current[index];
    const rect = item?.getBoundingClientRect();
    const width = Math.min(680, Math.max(320, window.innerWidth - 24));

    if (!rect) {
      return { left: 12, top: 88, notch: 340 };
    }

    const center = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(12, center - width / 2),
      Math.max(12, window.innerWidth - width - 12),
    );

    return {
      left,
      top: rect.bottom + 10,
      notch: Math.max(24, Math.min(width - 24, center - left)),
    };
  }

  function measureLens(index: number) {
    const nav = navRef.current;
    const item = itemRefs.current[index];

    if (!nav || !item) {
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    setLens({ x: rect.left - navRect.left, width: rect.width });
  }

  function openPreview(href: string, index: number, keyboard = false) {
    if (!isPreviewId(href)) {
      return;
    }

    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    measureLens(index);

    if (mode === "off" || openId) {
      setClosing(false);
      setAnchor(measureAnchor(href, index));
      setOpenId(href);
      return;
    }

    const delay = keyboard ? OPEN_DELAY : finePointer ? OPEN_DELAY : 0;
    openTimer.current = window.setTimeout(() => {
      setAnchor(measureAnchor(href, index));
      setClosing(false);
      setOpenId(href);
    }, delay);
  }

  function scheduleClose() {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setClosing(true);
      closeTimer.current = window.setTimeout(() => {
        setOpenId(null);
        setClosing(false);
      }, mode === "off" ? 0 : CLOSE_ANIMATION);
    }, CLOSE_DELAY);
  }

  function focusPanel() {
    popoverRef.current
      ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
      ?.focus();
  }

  function handleNavKeyDown(
    event: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) {
    const count = siteConfig.navLinks.length;
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % count;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + count) % count;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = count - 1;
    } else if (event.key === "ArrowDown" || (event.key === "Tab" && openId)) {
      if (openId) {
        event.preventDefault();
        focusPanel();
      }
      return;
    } else if (event.key === "Escape" && openId) {
      event.preventDefault();
      setOpenId(null);
      setClosing(false);
      itemRefs.current[index]?.focus();
      return;
    } else {
      return;
    }

    event.preventDefault();
    itemRefs.current[nextIndex]?.focus();
  }

  function handlePopoverKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    const index = siteConfig.navLinks.findIndex((link) => link.href === openId);
    setOpenId(null);
    setClosing(false);
    window.requestAnimationFrame(() => {
      itemRefs.current[index]?.focus();
    });
  }

  function handleFocusOut(event: React.FocusEvent<HTMLElement>) {
    const related = event.relatedTarget as Node | null;

    if (
      related &&
      (navRef.current?.contains(related) || popoverRef.current?.contains(related))
    ) {
      return;
    }

    scheduleClose();
  }

  const activeLabel = pageLabel(pathname);

  return (
    <>
      <header
        className={cn(
          "command-deck sticky inset-x-3 top-3 z-50 transition-[transform] duration-300 ease-out sm:inset-x-4 sm:top-4",
          headerHidden && !menuOpen ? "-translate-y-[calc(100%+2rem)]" : "translate-y-0",
        )}
        data-scrolled={scrolled}
        data-menu-open={menuOpen}
        data-mode={mode}
      >
        <div className="command-deck-outer">
          <div className="command-deck-inner" data-private={mode === "full" ? "glass" : undefined}>
            <Link
              href="/"
              onClick={() => {
                setMenuOpen(false);
                setExpandedMobile(null);
              }}
              className="command-wordmark group"
              aria-label={`${siteConfig.name} home`}
              data-cursor="HOME"
            >
              <span className="command-logo" aria-hidden="true">LOGO</span>
              <span className="command-wordmark-text">
                <span
                  className="wordmark holo-sheen"
                  data-mode={mode}
                  data-text="KAKSHYA"
                >
                  KAKSHYA
                </span>
                <span className="wordmark-sub">2026 · IIST</span>
              </span>
            </Link>

            <nav
              ref={navRef}
              aria-label="Primary"
              className="command-nav hidden xl:flex"
              onBlurCapture={handleFocusOut}
            >
              <span
                className="nav-lens"
                style={{
                  transform: `translate3d(${lens.x}px, 0, 0) scaleX(${lens.width})`,
                }}
                aria-hidden="true"
              />
              {siteConfig.navLinks.map((link, index) => {
                const active = isActivePath(pathname, link.href);
                const activePreview = openId === link.href;
                return (
                  <Link
                    key={link.href}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    href={link.href}
                    onClick={() => {
                      setOpenId(null);
                      setClosing(false);
                    }}
                    aria-current={active ? "page" : undefined}
                    aria-expanded={activePreview}
                    aria-controls={activePreview ? "nav-preview" : undefined}
                    data-cursor="OPEN"
                    className="nav-item"
                    data-active={active}
                    data-popover-open={activePreview}
                    onPointerEnter={() => finePointer && openPreview(link.href, index)}
                    onFocus={() => openPreview(link.href, index, true)}
                    onKeyDown={(event) => handleNavKeyDown(event, index)}
                  >
                    <span className="nav-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <NavDecode text={link.label} />
                    <span className="nav-charge" data-active={active} aria-hidden="true" />
                    <span className="nav-brackets" aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>

            <div className="command-actions">
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
                className="command-menu-button xl:hidden"
              >
                {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
              </button>
            </div>
          </div>
          <div className="mission-progress" aria-hidden="true">
            <span className="mission-progress-track" />
            <span ref={progressRef} className="mission-progress-fill" />
            {Array.from({ length: 9 }, (_, index) => (
              <span key={index} className="mission-progress-tick" style={{ left: `${(index + 1) * 10}%` }} />
            ))}
            <span className="mission-progress-label">{activeLabel}</span>
          </div>
        </div>
      </header>

      {openId ? (
        <div
          ref={popoverRef}
          id="nav-preview"
          role="region"
          aria-label={`${siteConfig.navLinks.find((link) => link.href === openId)?.label ?? "Navigation"} preview`}
          className="nav-popover"
          data-state={closing ? "closing" : "open"}
          data-mode={mode}
          style={{
            transform: `translate3d(${anchor.left}px, ${anchor.top}px, 0)`,
            width: "min(680px, calc(100vw - 1.5rem))",
          }}
          onPointerEnter={() => window.clearTimeout(closeTimer.current)}
          onPointerLeave={scheduleClose}
          onBlurCapture={handleFocusOut}
          onKeyDown={handlePopoverKeyDown}
        >
          <span
            className="nav-popover-notch"
            style={{ left: `${anchor.notch}px` }}
            aria-hidden="true"
          />
          <span className="popover-bridge" aria-hidden="true" />
          <Frame className="nav-popover-frame">
            <div key={openId} className="nav-popover-content">
              <NavPreviewPanel id={openId} onNavigate={() => setOpenId(null)} />
            </div>
          </Frame>
        </div>
      ) : null}

      {menuOpen ? (
        <div
          id="mobile-navigation"
          ref={menuRef}
          data-lenis-prevent
          className="mobile-command-deck xl:hidden"
        >
          <div className="mobile-command-grid" aria-hidden="true" />
          <nav
            aria-label="Mobile primary"
            className="mobile-command-scroll"
          >
            <p className="telemetry mb-4">Mission index</p>
            <ul className="mobile-command-list">
              {siteConfig.navLinks.map((link, index) => {
                const active = isActivePath(pathname, link.href);
                const expanded = expandedMobile === link.href;
                const panelId = `mobile-preview-${link.href.slice(1) || "home"}`;
                return (
                  <li
                    key={link.href}
                    className="mobile-command-item"
                    style={{ animationDelay: `${70 + index * 38}ms` }}
                  >
                    <div className="mobile-command-row">
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "mobile-command-link",
                          active && "text-primary",
                        )}
                      >
                        <span className="mobile-command-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mobile-command-label">{link.label}</span>
                      </Link>
                      <button
                        type="button"
                        className="mobile-expand-button"
                        aria-expanded={expanded}
                        aria-controls={panelId}
                        aria-label={expanded ? `Collapse ${link.label} preview` : `Expand ${link.label} preview`}
                        data-cursor="EXPAND"
                        onClick={() => setExpandedMobile((current) => (current === link.href ? null : link.href))}
                      >
                        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                      </button>
                    </div>
                    {expanded ? (
                      <div id={panelId} className="mobile-preview">
                        <NavPreviewPanel
                          id={isPreviewId(link.href) ? link.href : "/about"}
                          onNavigate={() => setMenuOpen(false)}
                        />
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <div className="mobile-command-footer">
              <Button3D
                href={siteConfig.registerCta.href}
                size="lg"
                className="w-full"
                data-cursor="LAUNCH"
                onClick={() => setMenuOpen(false)}
              >
                {siteConfig.registerCta.label}
              </Button3D>
              <div className="mobile-clock-row">
                <MissionClock />
                <span className="telemetry text-[0.5625rem]">{siteConfig.subtitle}</span>
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
