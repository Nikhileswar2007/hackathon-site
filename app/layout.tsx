import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron, Oxanium } from "next/font/google";
import "./globals.css";
import { EffectsProvider } from "@/app/components/effects/effects-provider";
import { CommandPaletteProvider } from "@/app/components/effects/CommandPaletteProvider";
import { ToastProvider } from "@/app/components/effects/ToastProvider";
import { SmoothScroll } from "@/app/components/effects/SmoothScroll";
import { Footer } from "@/app/components/layout/Footer";
import { Navbar } from "@/app/components/layout/Navbar";
import { ScrollHUD } from "@/app/components/layout/ScrollHUD";
import { BackToTop } from "@/app/components/layout/BackToTop";
import { MobileActionBar } from "@/app/components/layout/MobileActionBar";
import { RouteAnnouncer } from "@/app/components/layout/RouteAnnouncer";
import { ClientChrome } from "@/app/components/effects/ClientChrome";
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
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

const hudFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono-src",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["SFMono-Regular", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
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
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.classList.add('js')",
        }}
      />
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ToastProvider>
          <EffectsProvider>
            <CommandPaletteProvider>
              <SmoothScroll />
              <div className="space-backdrop" aria-hidden="true" />
              <SpaceCanvas />
              <a href="#main-content" className="skip-link">
                Skip to content
              </a>
              <RouteAnnouncer />
              <ClientChrome />
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
            </CommandPaletteProvider>
          </EffectsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
