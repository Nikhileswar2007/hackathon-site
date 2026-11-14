import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { OrbiterCursor } from "@/app/components/effects/OrbiterCursor";
import { CursorTrail } from "@/app/components/effects/CursorTrail";
import { EffectsProvider } from "@/app/components/effects/effects-provider";
import { Intro } from "@/app/components/effects/Intro";
import { SmoothScroll } from "@/app/components/effects/SmoothScroll";
import { Footer } from "@/app/components/layout/Footer";
import { Navbar } from "@/app/components/layout/Navbar";
import { ScrollHUD } from "@/app/components/layout/ScrollHUD";
import { SpaceCanvas } from "@/app/components/space/SpaceCanvas";
import { siteConfig } from "@/app/content/site-config";

const displayFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const hudFont = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${displayFont.variable} ${bodyFont.variable} ${hudFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <EffectsProvider>
          <SmoothScroll />
          <div className="space-backdrop" aria-hidden="true" />
          <SpaceCanvas />
          <Intro />
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
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
          <OrbiterCursor />
          <CursorTrail />
        </EffectsProvider>
      </body>
    </html>
  );
}
