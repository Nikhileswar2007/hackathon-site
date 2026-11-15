import type { MetadataRoute } from "next";
import { siteConfig } from "./content/site-config";

const routes = [
  "/",
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
  "/register",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (route: string) => `${siteConfig.siteUrl}${route}`;

  return routes.map((route) => ({
    url: url(route),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/register" ? 0.9 : 0.7,
  }));
}
