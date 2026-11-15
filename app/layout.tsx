import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron, Oxanium } from "next/font/google";
import "./globals.css";
import { OrbiterCursor } from "@/app/components/effects/OrbiterCursor";
import { CursorTrail } from "@/app/components/effects/CursorTrail";
import { EffectsProvider } from "@/app/components/effects/effects-provider";
import { CommandPaletteProvider } from "@/app/components/effects/CommandPaletteProvider";
import { ToastProvider } from "@/app/components/effects/ToastProvider";
import { Intro } from "@/app/components/effects/Intro";
import { SmoothScroll } from "@/app/components/effects/SmoothScroll";
import { Footer } from "@/app/components/layout/Footer";
import { Navbar } from "@/app/components/layout/Navbar";
import { ScrollHUD } from "@/app/components/layout/ScrollHUD";
import { BackToTop } from "@/app/components/layout/BackToTop";
import { MobileActionBar } from "@/app/components/layout/MobileActionBar";
import { RouteAnnouncer } from "@/app/components/layout/RouteAnnouncer";
import { SpaceCanvas } from "@/app/components/space/SpaceCanvas";
import { siteConfig } from "@/app/content/site-config";

const displayFont = Orbitron({
  variable: "--font-orbitron-src",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial Black", "Segoe UI", "sans-serif"],
});

const interfaceFont = Oxanium({
  variable: "--font-oxanium-src",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial Narrow", "Segoe UI", "sans-serif"],
});

const bodyFont = Inter({
  variable: "--font-inter-src",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const hudFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono-src",
  subsets: ["latin"],
  display: "swap",
  fallback: ["SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#05070c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${interfaceFont.variable} ${bodyFont.variable} ${hudFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ToastProvider>
          <EffectsProvider>
            <CommandPaletteProvider>
              <SmoothScroll />
              <div className="space-backdrop" aria-hidden="true" />
              <SpaceCanvas />
              <Intro />
              <a href="#main-content" className="skip-link">
                Skip to content
              </a>
              <RouteAnnouncer />
              <Navbar />
              <ScrollHUD />
              <main
                id="main-content"
                tabIndex={-1}
                className="site-main flex-1"
              >
                {children}
              </main>
              <Footer />
              <BackToTop />
              <MobileActionBar />
              <OrbiterCursor />
              <CursorTrail />
            </CommandPaletteProvider>
          </EffectsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
