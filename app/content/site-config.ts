export const TBA = "To be announced";

export const brand = {
  name: "Kosmodrome",
  displayName: "KOSMODROME",
  shortName: "Kosmodrome",
  year: 2026,
  tagline: "48 Hours to Orbit",
  subtitle: "IIST National Space Hackathon",
  conceptLine:
    "A kosmodrome is a spaceport: the place every mission starts. Kosmodrome is where your idea leaves the pad.",
  watermark: "КОСМОДРОМ",
  organiser: "Indian Institute of Space Science and Technology (IIST)",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const siteConfig = {
  name: `${brand.name} ${brand.year}`,
  displayName: brand.displayName,
  shortName: brand.shortName,
  year: brand.year,
  tagline: brand.tagline,
  subtitle: brand.subtitle,
  organiser: brand.organiser,
  factsLine:
    "National level | Online | 48 hours | Beginner and Advanced tracks",
  description:
    "Kosmodrome 2026: 48 Hours to Orbit is the IIST National Space Hackathon — a 48-hour, national-level, online event with Beginner and Advanced tracks.",

  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000",

  eventStartISO: null as string | null,
  registrationOpen: false,

  registrationFee: null as string | null,
  contactEmail: null as string | null,
  portalUrl: null as string | null,
  announcementsUrl: null as string | null,
  clarificationsUrl: null as string | null,
  rulebookUrl: null as string | null,

  navLinks: [
    { label: "About", href: "/about" },
    { label: "Tracks", href: "/tracks" },
    { label: "Timeline", href: "/timeline" },
    { label: "Scoring", href: "/scoring" },
    { label: "Rules", href: "/rules" },
    { label: "Submission", href: "/submission" },
    { label: "Fair play", href: "/fair-play" },
    { label: "Prizes", href: "/prizes" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],

  registerCta: { label: "Register", href: "/register" } satisfies NavLink,

  primaryNavLinks: [
    { label: "Tracks", href: "/tracks" },
    { label: "Timeline", href: "/timeline" },
    { label: "Scoring", href: "/scoring" },
    { label: "Rules", href: "/rules" },
    { label: "Prizes", href: "/prizes" },
    { label: "FAQ", href: "/faq" },
  ] satisfies NavLink[],

  moreNavLinks: [
    { label: "About", href: "/about" },
    { label: "Submission", href: "/submission" },
    { label: "Fair play", href: "/fair-play" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],

  footerGroups: [
    {
      title: "Explore",
      links: [
        { label: "About", href: "/about" },
        { label: "Tracks", href: "/tracks" },
        { label: "Timeline", href: "/timeline" },
        { label: "Scoring", href: "/scoring" },
      ],
    },
    {
      title: "Participate",
      links: [
        { label: "Rules", href: "/rules" },
        { label: "Submission", href: "/submission" },
        { label: "Fair play", href: "/fair-play" },
        { label: "Register", href: "/register" },
      ],
    },
    {
      title: "More",
      links: [
        { label: "Prizes", href: "/prizes" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ] satisfies NavGroup[],
};

export type SiteConfig = typeof siteConfig;
