export const TBA = "To be announced";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const siteConfig = {
  name: "Kakshya 2026",
  tagline: "48 Hours to Orbit",
  subtitle: "IIST National Space Hackathon",
  organiser: "Indian Institute of Space Science and Technology (IIST)",
  factsLine:
    "National level | Online | 48 hours | Beginner and Advanced tracks",
  description:
    "Kakshya 2026: 48 Hours to Orbit is the IIST National Space Hackathon — a 48-hour, national-level, online event with Beginner and Advanced tracks.",

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
