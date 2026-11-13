import { siteConfig, TBA } from "./site-config";

export type TimelineType = "milestone" | "checkpoint" | "deadline" | "judging";

export interface TimelineItem {
  id: string;
  when: string;
  clock: string | null;
  event: string;
  note: string | null;
  type: TimelineType;
}

export interface Stat {
  value: string;
  label: string;
  detail: string;
}

export interface Guarantee {
  title: string;
  description: string;
}

export interface Track {
  id: "beginner" | "advanced";
  name: string;
  summary: string;
  audience: string;
  teamSize: string;
  problemStyle: string[];
  evaluation: string[];
  submissionPack: string[];
  finalists: string;
  themes: string[];
}

export interface ScoringCriterion {
  name: string;
  points: number;
  scoredBy: string;
  detail?: string;
}

export interface ScoringTab {
  id: string;
  label: string;
  title: string;
  total: number;
  note?: string;
  criteria: ScoringCriterion[];
}

export interface ScoringBand {
  name: string;
  range: string;
  description: string;
}

export interface Penalty {
  item: string;
  deduction: string;
}

export interface RuleSection {
  id: string;
  title: string;
  bullets: string[];
}

export interface SubmissionRequirement {
  item: string;
  beginner: string;
  advanced: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

export interface PrizeAward {
  name: string;
  amount: string;
  note?: string;
}

export interface PrizeTrack {
  id: "beginner" | "advanced";
  name: string;
  awards: PrizeAward[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface RegistrationStep {
  title: string;
  description: string;
}

export interface ContactChannel {
  id: string;
  label: string;
  description: string;
  url: string | null;
}

export interface FairPlayCard {
  id: string;
  title: string;
  points: string[];
}

export interface ThreatControl {
  threat: string;
  control: string;
}

export const stats: Stat[] = [
  {
    value: "48 hours",
    label: "Hackathon window",
    detail: "One continuous build sprint",
  },
  { value: "2", label: "Tracks", detail: "Beginner and Advanced" },
  {
    value: "2 to 4",
    label: "Members per team",
    detail: "No solo teams",
  },
  {
    value: "Top 8",
    label: "Finalists per track",
    detail: "Announced at T+80",
  },
];

export const guarantees: Guarantee[] = [
  {
    title: "Sealed until kickoff",
    description: "Problem statements stay sealed until kickoff.",
  },
  {
    title: "Traceable to the window",
    description:
      "Every submission is traceable to work done inside the 48-hour window.",
  },
  {
    title: "Every score can be audited",
    description: "Every score can be audited.",
  },
];

export const tracks: Track[] = [
  {
    id: "beginner",
    name: "Beginner",
    summary:
      "Guided problems with clear specifications, starter code, curated data and a must-have feature list.",
    audience:
      "For Diploma and 1st/2nd-year UG students with no top-3 finish at a national-level hackathon.",
    teamSize: "2 to 4 members per team",
    problemStyle: [
      "Clear specification.",
      "Starter code.",
      "Curated dataset.",
      "Must-have feature list.",
    ],
    evaluation: [
      "Requirements checklist (part of Technical Implementation).",
    ],
    submissionPack: [
      "Repository",
      "README",
      "4-page report",
      "5-minute demo",
      "Declaration",
    ],
    finalists: "Top 8 finalists.",
    themes: [
      "Telemetry visualisation dashboard",
      "Orbit and ground-track visualiser",
      "CubeSat power-budget calculator",
      "Sensor anomaly detection on a supplied dataset",
      "Basic launch-ascent simulator",
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    summary:
      "Open-ended mission problems with realistic constraints, noisy data and a hidden private test set.",
    audience:
      "For 3rd-year UG and above, PG, PhD, recent graduates (within six months of final exam) or anyone opting up.",
    teamSize: "2 to 4 members per team",
    problemStyle: [
      "Open-ended problems with realistic mission constraints.",
      "Noisy data.",
      "A hidden private test set.",
    ],
    evaluation: [
      "Script-scored benchmark on a hidden private split (20 points).",
    ],
    submissionPack: [
      "Repository",
      "README",
      "8-page report",
      "6-minute demo",
      "Predictions file",
      "Dockerfile",
      "Declaration",
    ],
    finalists: "Top 8 finalists.",
    themes: [
      "Onboard attitude estimation from noisy sensors",
      "Earth-observation change detection on a hidden test set",
      "Conjunction and debris-risk screening",
      "Low-thrust or multi-body trajectory optimisation",
      "Resource-constrained onboard inference",
    ],
  },
];

export const trackRules: string[] = [
  "The track is set by the most senior member of the team.",
  "Opting up is allowed; moving down is never allowed.",
  "No track change after team lock (D-3).",
  "Each track gets separate problem sets.",
  "Tracks never compete against each other.",
];

export const trackThemesNote =
  "Indicative themes. Live problem statements are released only at T0.";

export const timeline: TimelineItem[] = [
  {
    id: "registration-opens",
    when: "D-14",
    clock: null,
    event:
      "Registration opens; rulebook published with its SHA-256 hash",
    note: null,
    type: "milestone",
  },
  {
    id: "hash-commitments",
    when: "D-7",
    clock: null,
    event: "Hash commitments of the sealed problem archives published",
    note: "Publicly verifiable",
    type: "milestone",
  },
  {
    id: "registration-closes",
    when: "D-5",
    clock: null,
    event: "Registration closes",
    note: "No late registrations",
    type: "deadline",
  },
  {
    id: "team-lock",
    when: "D-3",
    clock: null,
    event: "Teams locked, IDs verified, track assignment final",
    note: "No changes after lock",
    type: "deadline",
  },
  {
    id: "briefing",
    when: "D-1",
    clock: "18:00",
    event:
      "Mandatory 30-minute briefing and platform dry run; integrity pledges signed",
    note: "No pledge, no access at T0",
    type: "milestone",
  },
  {
    id: "sealed-draw",
    when: "T-2h",
    clock: "08:00 Day 1",
    event:
      "Witnessed sealed draw of the live problem set for each track",
    note: "Recorded by OC",
    type: "milestone",
  },
  {
    id: "kickoff",
    when: "T0",
    clock: "10:00 Day 1",
    event:
      "Kickoff: statements and datasets released; private team repositories activated",
    note: "Clock starts",
    type: "milestone",
  },
  {
    id: "clarification-window",
    when: "T+0 to T+2",
    clock: "10:00-12:00",
    event: "Open clarification window; every answer posted to all teams",
    note: "Public Q&A only",
    type: "milestone",
  },
  {
    id: "checkpoint-1",
    when: "T+12",
    clock: "22:00 Day 1",
    event:
      "Checkpoint 1: 200-word progress note and repository snapshot",
    note: "Missed: -3 points",
    type: "checkpoint",
  },
  {
    id: "checkpoint-2",
    when: "T+24",
    clock: "10:00 Day 2",
    event:
      "Checkpoint 2: 5-minute live video check-in, all members present",
    note: "Missed: -3 points",
    type: "checkpoint",
  },
  {
    id: "checkpoint-3",
    when: "T+36",
    clock: "22:00 Day 2",
    event:
      "Checkpoint 3: 200-word readiness note; scope freeze advised",
    note: "Missed: -3 points",
    type: "checkpoint",
  },
  {
    id: "submission-window-opens",
    when: "T+40",
    clock: "02:00 Day 3",
    event: "Submission window opens; dry-run uploads allowed",
    note: null,
    type: "deadline",
  },
  {
    id: "hard-close",
    when: "T+48",
    clock: "10:00 Day 3",
    event:
      "Hard close; portal snapshots every repository at its latest commit",
    note: "10-minute technical grace at -5 points",
    type: "deadline",
  },
  {
    id: "stage-0",
    when: "T+48 to T+54",
    clock: "10:00-16:00 Day 3",
    event: "Stage 0: integrity and completeness screening",
    note: "Pass or fail",
    type: "judging",
  },
  {
    id: "stage-1",
    when: "T+54 to T+78",
    clock: "16:00 Day 3 to 16:00 Day 4",
    event:
      "Stage 1: blind judging, two independent judges per submission",
    note: "Scores locked on submit",
    type: "judging",
  },
  {
    id: "finalists-announced",
    when: "T+80",
    clock: "18:00 Day 4",
    event: "Top 8 teams per track announced",
    note: null,
    type: "judging",
  },
  {
    id: "stage-2",
    when: "T+96",
    clock: "10:00 Day 5",
    event:
      "Stage 2: finals with live pitch and viva before the Grand Jury",
    note: "Identity and ID check",
    type: "judging",
  },
  {
    id: "provisional-results",
    when: "T+102",
    clock: "16:00 Day 5",
    event:
      "Provisional results published; 24-hour appeal window opens",
    note: "Appeals via portal only",
    type: "milestone",
  },
  {
    id: "appeals-close",
    when: "T+126",
    clock: "16:00 Day 6",
    event: "Appeal window closes; winner code audit complete",
    note: "Prizes held until audit passes",
    type: "milestone",
  },
  {
    id: "final-results",
    when: "T+144",
    clock: "10:00 Day 7",
    event: "Final results and closing ceremony",
    note: "Prizes released",
    type: "milestone",
  },
];

function getTimelineItem(id: string): TimelineItem {
  const item = timeline.find((entry) => entry.id === id);
  if (!item) {
    throw new Error(`Unknown timeline item: ${id}`);
  }
  return item;
}

export const homeTimeline: TimelineItem[] = [
  getTimelineItem("registration-opens"),
  getTimelineItem("kickoff"),
  {
    id: "checkpoints",
    when: "T+12 / T+24 / T+36",
    clock: "22:00 / 10:00 / 22:00",
    event:
      "Checkpoints 1-3: progress and readiness notes, repository snapshots and a live video check-in with all members present",
    note: "Each missed checkpoint: -3 points",
    type: "checkpoint",
  },
  getTimelineItem("hard-close"),
  getTimelineItem("final-results"),
];

export const scoringTabs: ScoringTab[] = [
  {
    id: "beginner",
    label: "Beginner",
    title: "Beginner — Stage 1",
    total: 100,
    criteria: [
      {
        name: "Problem understanding and approach",
        points: 15,
        scoredBy: "Judges",
      },
      {
        name: "Technical implementation",
        points: 25,
        scoredBy: "Checklist script + judges",
        detail:
          "Requirements coverage (15, checklist script); correctness and robustness (10, judges).",
      },
      {
        name: "Space-domain accuracy",
        points: 15,
        scoredBy: "Judges",
      },
      {
        name: "Innovation and creativity",
        points: 10,
        scoredBy: "Judges",
      },
      {
        name: "Code quality and documentation",
        points: 10,
        scoredBy: "Judges",
      },
      {
        name: "Demo and communication",
        points: 15,
        scoredBy: "Judges",
      },
      {
        name: "Process and learning",
        points: 10,
        scoredBy: "Judges",
        detail: "Commit history, checkpoint notes and iteration.",
      },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Advanced — Stage 1",
    total: 100,
    criteria: [
      {
        name: "Technical depth and engineering rigour",
        points: 25,
        scoredBy: "Judges",
      },
      {
        name: "Benchmark performance",
        points: 20,
        scoredBy: "Evaluation script",
        detail: "Hidden private split.",
      },
      {
        name: "Innovation and novelty",
        points: 15,
        scoredBy: "Judges",
      },
      {
        name: "Domain correctness and mission relevance",
        points: 15,
        scoredBy: "Judges",
      },
      {
        name: "System design and feasibility",
        points: 10,
        scoredBy: "Judges",
      },
      {
        name: "Reproducibility and code quality",
        points: 5,
        scoredBy: "Judges",
      },
      {
        name: "Report and demo",
        points: 10,
        scoredBy: "Judges",
      },
    ],
  },
  {
    id: "finals",
    label: "Finals",
    title: "Finals — Stage 2",
    total: 100,
    note: "7-minute live pitch and demo, then a 5-minute viva. All members present with cameras on.",
    criteria: [
      {
        name: "Technical defence and viva",
        points: 40,
        scoredBy: "Grand Jury",
      },
      {
        name: "Pitch and live demo",
        points: 30,
        scoredBy: "Grand Jury",
      },
      {
        name: "Impact and feasibility",
        points: 20,
        scoredBy: "Grand Jury",
      },
      {
        name: "Individual understanding",
        points: 10,
        scoredBy: "Grand Jury",
      },
    ],
  },
];

export const scoringBands: ScoringBand[] = [
  {
    name: "Exceptional",
    range: "90-100%",
    description: "Complete, correct, clearly beyond expectations.",
  },
  {
    name: "Strong",
    range: "70-89%",
    description: "Complete and correct with minor gaps.",
  },
  {
    name: "Adequate",
    range: "40-69%",
    description: "Partly complete or correct; notable gaps.",
  },
  {
    name: "Weak",
    range: "0-39%",
    description: "Largely missing, incorrect or not demonstrated.",
  },
];

export const benchmark = {
  title: "Benchmark formula",
  formula:
    "P_bench = 20 x min(1, max(0, (s_team - s_base) / (s_ref - s_base)))",
  notes: [
    "Public leaderboard uses 30% of test inputs; final ranking uses the private 70%.",
    "Max 5 prediction uploads per rolling 12 hours; one final file selected before T+48.",
  ],
};

export const finalScore = {
  title: "Final score",
  top8: "Final score for the top 8 = 0.6 x Stage 1 + 0.4 x Stage 2.",
  rest: "Teams ranked 9 and below are ranked by Stage 1 alone.",
};

export const judgingProcess: string[] = [
  "Stage 0: automated screening (pass/fail).",
  "Stage 1: blind scoring by two independent judges identified only by Team ID. A third judge is added if totals differ by more than 15 points or any criterion by more than 40% of its max; the score is the mean of the two closest.",
  "Stage 2: finals before the Grand Jury (3 to 5 senior experts).",
];

export const penalties: Penalty[] = [
  { item: "Technical grace window", deduction: "-5" },
  { item: "Each missed checkpoint", deduction: "-3" },
  { item: "Each missing submission item", deduction: "-5" },
  {
    item: "Identity details visible in submitted files",
    deduction: "-3",
  },
  {
    item: "Undeclared third-party code, model or data",
    deduction: "-5 to -15",
  },
  {
    item: "Undeclared AI use materially affecting the work",
    deduction: "-5 to -10",
  },
  {
    item: "Repeated minor conduct breach after a written warning",
    deduction: "-10",
  },
];

export const tieBreakers: string[] = [
  "Higher Technical criterion score.",
  "Higher domain accuracy/correctness.",
  "Higher Stage 2 viva score.",
  "Grand Jury majority vote.",
];

export const disqualifications: string[] = [
  "Sharing problem material or hidden evaluation information.",
  "Pre-built solution (commits before T0).",
  "Confirmed plagiarism or collusion.",
  "Tampering with history, manifests, logs or scores.",
  "Attacking event systems.",
  "Identity fraud, false declaration or ghost member.",
  "Inability to explain core components in the viva.",
  "Harassment, threats or bribery.",
];

export const ruleSections: RuleSection[] = [
  {
    id: "eligibility",
    title: "Eligibility",
    bullets: [
      "Students at recognised Indian institutions.",
      "Graduates within six months of their final exam join Advanced only.",
      "OC, setters, validators, custodians, mentors, judges and their teammates and family are ineligible.",
    ],
  },
  {
    id: "teams",
    title: "Teams",
    bullets: [
      "Teams have 2 to 4 members. No solo teams.",
      "Members may be from different institutions.",
      "One person, one team, one track.",
      "Institutional email plus college ID verified by D-3.",
      "Teams are locked at D-3. Replacement is allowed only for a documented emergency with OC approval before T0.",
      "One team leader is the point of contact.",
      "The fee is announced before registration opens and is non-refundable after lock.",
      "Accessibility requests must be made before D-3.",
    ],
  },
  {
    id: "development",
    title: "Development",
    bullets: [
      "All project-specific work must be created after T0. The first commit timestamp must be after T0 in the organiser-provisioned repository.",
      "Open-source libraries, public pre-trained models and documentation are allowed.",
      "Earlier generic utilities are allowed only if public before D-7 and declared.",
      "Prohibited: earlier solutions, hackathon code, purchased or commissioned work, non-member work, leaked material and help from other teams.",
      "AI tools are allowed if every use is logged in the README AI-use log, every member can explain any component, and Restricted datasets are never uploaded to external services.",
      "Label probing is prohibited.",
      "The solution must run from the README on the reference environment (Linux x86_64, 4 vCPU, 16 GB RAM, no GPU unless stated) within 30 minutes, with pinned dependencies and fixed seeds.",
      "No connecting to live satellites, ground stations or telemetry.",
    ],
  },
  {
    id: "platform-and-conduct",
    title: "Platform and conduct",
    bullets: [
      "All activity happens on the official portal, chat and video platform.",
      "Clarifications only in the public channel.",
      "Mentors guide concepts but never write solution code; up to 4 slots of 15 minutes per team.",
      "No code, data or ideas exchanged between teams.",
      "No attacks on event systems.",
      "Raise a ticket within 15 minutes of a technical problem.",
      "Personal connectivity failures do not justify extensions.",
      "Harassment and discrimination are prohibited.",
      "No 48-hour surveillance. Teams are encouraged to sleep.",
    ],
  },
  {
    id: "grievances",
    title: "Grievances",
    bullets: [
      "One appeal per team via the portal from T+102 to T+126.",
      "Valid grounds: arithmetic or data-entry error, misapplied rule, undeclared conflict of interest, or procedural irregularity. Disagreeing with a judge's subjective view is not valid.",
      "The three-member Grievance Committee decides by T+138.",
    ],
  },
  {
    id: "ip-and-data",
    title: "IP and data",
    bullets: [
      "Teams keep ownership of their work.",
      "IIST gets a non-exclusive licence to display and publish summaries, not source code unless agreed.",
      "Personal data is kept for 180 days and is not sold.",
    ],
  },
];

export const submission = {
  window:
    "The submission window runs from T+40 to T+48 via the portal. The evaluated version is the repository snapshot at hard close; a SHA-256 manifest is recorded.",
  blindJudging:
    "No team, member or institute names in any file. A leak costs -3 points.",
  missingItem: "Each missing submission item costs -5 points.",
  grace:
    "A 10-minute grace period applies only to portal-side failures with a ticket, at -5 points.",
  comparison: [
    {
      item: "Repository",
      beginner: "Required",
      advanced: "Required",
    },
    {
      item: "README",
      beginner:
        "Run steps, architecture, AI-use log and pre-existing components declaration",
      advanced:
        "Run steps, architecture, AI-use log and pre-existing components declaration",
    },
    {
      item: "Technical report (PDF)",
      beginner: "4 pages",
      advanced: "8 pages",
    },
    {
      item: "Demo video",
      beginner: "Single take with a live clock visible, 5 minutes",
      advanced: "Single take with a live clock visible, 6 minutes",
    },
    {
      item: "Predictions file",
      beginner: "Not required",
      advanced: "Required",
    },
    {
      item: "Pinned environment",
      beginner: "Environment file",
      advanced: "Dockerfile plus environment file",
    },
    {
      item: "Integrity Declaration",
      beginner: "Signed by every member",
      advanced: "Signed by every member",
    },
    {
      item: "Finals slide deck",
      beginner: "Finalists only; due T+94",
      advanced: "Finalists only; due T+94",
    },
  ] satisfies SubmissionRequirement[],
};

export const submissionChecklist: ChecklistItem[] = [
  {
    id: "provisioned-repo",
    label: "Work only in the provisioned repository, with no names inside.",
  },
  { id: "readme", label: "README complete." },
  {
    id: "report",
    label: "Report within the page limit, on the template.",
  },
  {
    id: "demo",
    label: "Demo within the time limit, single take, live clock visible.",
  },
  {
    id: "environment",
    label: "Pinned environment tested on a clean machine.",
  },
  {
    id: "predictions",
    label:
      "Predictions file uploaded and final file selected (Advanced only).",
  },
  {
    id: "checkpoints",
    label: "All three checkpoints completed on time.",
  },
  {
    id: "declaration",
    label: "Integrity Declaration signed by every member.",
  },
  {
    id: "final-upload",
    label:
      "Final upload confirmed before T+48 and manifest noted.",
  },
];

export const prizeTracks: PrizeTrack[] = [
  {
    id: "beginner",
    name: "Beginner",
    awards: [
      { name: "1st place", amount: TBA },
      { name: "2nd place", amount: TBA },
      { name: "3rd place", amount: TBA },
      {
        name: "Best Newcomer Team",
        amount: TBA,
        note: "All members in their first year.",
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    awards: [
      { name: "1st place", amount: TBA },
      { name: "2nd place", amount: TBA },
      { name: "3rd place", amount: TBA },
      {
        name: "Best Innovation",
        amount: TBA,
        note: "Chosen by the Grand Jury from finalists.",
      },
      {
        name: "Best Domain Application",
        amount: TBA,
        note: "Chosen by the Grand Jury from finalists.",
      },
    ],
  },
];

export const prizeCertificates = [
  {
    name: "Participation",
    description: "Every valid submission.",
  },
  {
    name: "Merit",
    description: "Top 8 per track.",
  },
  {
    name: "Achievement",
    description: "Winners.",
  },
];

export const prizeConditions: string[] = [
  "Passed the integrity screen and winner audit.",
  "Verified identity for every member.",
  "No open disciplinary case.",
];

export const prizeRules: string[] = [
  "Prize money is split equally among team members.",
  "Prize money is paid within 30 days of the final results.",
  "The OC may leave an award vacant if no team reaches Stage 1 score 50 in that track.",
];

export const faqGroups: FaqGroup[] = [
  {
    id: "eligibility-and-teams",
    title: "Eligibility and teams",
    items: [
      {
        id: "who-can-participate",
        question: "Who can participate?",
        answer:
          "Students at recognised Indian institutions. Graduates within six months of their final exam may join the Advanced track only.",
      },
      {
        id: "team-size",
        question: "How big can a team be?",
        answer:
          "Teams have 2 to 4 members. There are no solo teams. Members may come from different institutions.",
      },
      {
        id: "two-teams",
        question: "Can one person join two teams?",
        answer: "No. One person, one team, one track.",
      },
      {
        id: "which-track",
        question: "Which track am I in?",
        answer:
          "Your most senior member sets the track. Opting up to Advanced is allowed; moving down is never allowed. Graduates are Advanced only.",
      },
      {
        id: "fee",
        question: "Is there a fee?",
        answer: `The fee is ${TBA}. It will be announced before registration opens and is non-refundable after team lock.`,
      },
      {
        id: "change-members",
        question: "Can we change team members?",
        answer:
          "Teams are locked at D-3. Replacement is allowed only for a documented emergency with OC approval before T0.",
      },
    ],
  },
  {
    id: "during-the-event",
    title: "During the event",
    items: [
      {
        id: "problems-released",
        question: "When are the problems released?",
        answer:
          "At T0 (kickoff), to every team at the same time through the portal.",
      },
      {
        id: "online-48-hours",
        question: "Do we need to be online for all 48 hours?",
        answer:
          "No. Only Checkpoint 2 (the live video check-in) and the finals require all members present. Teams are encouraged to sleep.",
      },
      {
        id: "internet-fails",
        question: "What if my internet fails?",
        answer:
          "Raise a ticket within 15 minutes. Personal connectivity failures do not justify extensions.",
      },
    ],
  },
  {
    id: "tools-and-integrity",
    title: "Tools and integrity",
    items: [
      {
        id: "ai-tools",
        question: "Can we use AI tools?",
        answer:
          "Yes, if every use is logged in the README AI-use log, every member can explain any component, and Restricted datasets are never uploaded to external services.",
      },
      {
        id: "reuse-code",
        question: "Can we reuse old code?",
        answer:
          "Only generic public utilities published before D-7 and declared. All project-specific work must be created after T0.",
      },
    ],
  },
  {
    id: "judging-and-appeals",
    title: "Judging and appeals",
    items: [
      {
        id: "winners",
        question: "How are winners chosen?",
        answer:
          "Top 8 teams per track are ranked by blind Stage 1 scores weighted 60% and Stage 2 finals weighted 40%. Teams ranked 9 and below are ranked by Stage 1 alone.",
      },
      {
        id: "appeal",
        question: "How do I appeal?",
        answer:
          "One appeal per team via the portal from T+102 to T+126. Valid grounds are arithmetic or data-entry error, a misapplied rule, an undeclared conflict of interest, or procedural irregularity. The Grievance Committee decides by T+138.",
      },
    ],
  },
];

export const homeFaqIds: string[] = [
  "who-can-participate",
  "which-track",
  "ai-tools",
  "winners",
];

export const registrationSteps: RegistrationStep[] = [
  {
    title: "Check eligibility",
    description: "Review the eligibility rules and choose your track.",
  },
  {
    title: "Fill the form and upload IDs",
    description:
      "Submit team details, institutional email addresses and college IDs.",
  },
  {
    title: "OC verification by D-3",
    description:
      "The organising committee verifies institutional emails and college IDs by D-3.",
  },
  {
    title: "Team lock",
    description: "Teams are locked at D-3. No changes after lock.",
  },
  {
    title: "Briefing and integrity pledge",
    description:
      "Attend the mandatory 30-minute briefing on D-1 at 18:00 and sign the integrity pledges.",
  },
];

export const registrationEligibility: string[] = [
  "Open to students at recognised Indian institutions.",
  "Teams of 2 to 4 members; no solo teams.",
  "Members may be from different institutions.",
  "Graduates within six months of their final exam join Advanced only.",
  "One person, one team, one track.",
  "Institutional email and college ID verified by D-3.",
];

export const programmeOptions: string[] = [
  "Diploma",
  "UG year 1",
  "UG year 2",
  "UG year 3",
  "UG year 4+",
  "PG",
  "PhD",
  "Graduate within six months",
];

export const about = {
  intro: [
    "Kakshya 2026 is the IIST National Space Hackathon. It is a national-level, online event with 48 hours on the clock and two tracks: Beginner and Advanced.",
    "Teams of two to four work on space-domain problems under sealed conditions. Problem statements stay sealed until kickoff, every submission is traceable to work done inside the 48-hour window, and every score can be audited.",
    "Beginner teams get guided problems with clear specifications, starter code, curated data and a must-have feature list. Advanced teams work on open-ended mission problems with realistic constraints, noisy data and a hidden private test set.",
  ],
  organiser:
    "Kakshya 2026 is organised by the Indian Institute of Space Science and Technology (IIST).",
  whoCanJoin: [
    "Students at recognised Indian institutions.",
    "Beginner: Diploma and 1st/2nd-year UG students with no top-3 finish at a national-level hackathon.",
    "Advanced: 3rd-year UG and above, PG, PhD, recent graduates within six months of their final exam, or anyone opting up.",
    "Teams of 2 to 4 members. No solo teams.",
    "Members may come from different institutions; one person can join one team and one track.",
  ],
  process: [
    {
      title: "Kickoff",
      description:
        "At T0 (10:00 IST on Day 1), the sealed live problem set is released to every team at once and the clock starts.",
    },
    {
      title: "Build",
      description:
        "Teams have 48 hours to design, build and test inside their track rules. Three checkpoints keep progress visible.",
    },
    {
      title: "Submit",
      description:
        "The submission window opens at T+40 and closes at T+48. The evaluated version is the repository snapshot at hard close.",
    },
    {
      title: "Judge",
      description:
        "Stage 0 screens for integrity and completeness. Stage 1 is blind scoring by two independent judges. Stage 2 is the finals before the Grand Jury.",
    },
  ] satisfies ProcessStep[],
};

export const fairPlayCards: FairPlayCard[] = [
  {
    id: "sealed-problems",
    title: "Sealed problems",
    points: [
      "Statements are encrypted with AES-256.",
      "The key is split among five Problem Custodians so any three are needed (Shamir secret sharing).",
      "SHA-256 hashes of the sealed archives are published at D-7.",
      "A witnessed sealed draw takes place at T-2h.",
      "Only about 12 vetted people under NDA see anything before T0.",
      "Statements are released to all teams simultaneously through the portal.",
      "If a leak is found, a reserve set plan applies; kickoff may slip by up to 2 hours.",
    ],
  },
  {
    id: "leak-tracing",
    title: "Leak tracing",
    points: [
      "Per-team watermarks.",
      "Download logs.",
      "Canary records.",
      "Team-specific dataset variants of equal difficulty.",
    ],
  },
  {
    id: "integrity",
    title: "Integrity",
    points: [
      "The first commit must be after T0.",
      "Commit-history audit.",
      "Force-push is blocked.",
      "Cross-team similarity scan: 40% or more triggers review; confirmed above 70% disqualifies both teams unless one proves independent origin. Teams get 24 hours to respond.",
      "Hidden private test split.",
      "Label probing is prohibited.",
    ],
  },
  {
    id: "fair-judging",
    title: "Fair judging",
    points: [
      "Blind Stage 1.",
      "Conflict-of-interest declarations.",
      "Two independent judges plus moderation.",
      "Locked score sheets in an append-only ledger.",
      "Results are computed by script and checked by two OC members.",
    ],
  },
  {
    id: "winner-audit",
    title: "Winner audit",
    points: [
      "Top 3 per track are re-run in a clean environment.",
      "Tolerance default ±2%.",
      "Prizes are held until the audit passes.",
    ],
  },
  {
    id: "records-and-reporting",
    title: "Records and reporting",
    points: [
      "Records are kept for 180 days.",
      "Anyone can report an integrity concern confidentially.",
      "Retaliation is prohibited.",
    ],
  },
];

export const fairPlayThreats: ThreatControl[] = [
  {
    threat: "Problem material leaks before T0",
    control:
      "Sealed AES-256 archives; five custodians with Shamir secret sharing (any three needed); D-7 hash commitments; witnessed draw at T-2h; reserve set with a possible kickoff delay of up to 2 hours.",
  },
  {
    threat: "Pre-built solutions or rewritten history",
    control:
      "First commit after T0; commit-history audit; force-push blocked; disqualification.",
  },
  {
    threat: "Copying between teams",
    control:
      "Cross-team similarity scan; 40% or more triggers review; confirmed above 70% disqualifies both teams unless one proves independent origin; teams get 24 hours to respond.",
  },
  {
    threat: "Gaming the hidden test set",
    control:
      "Hidden private split; label probing prohibited; team-specific dataset variants of equal difficulty; per-team watermarks, download logs and canary records.",
  },
  {
    threat: "Biased or conflicted judging",
    control:
      "Blind Stage 1; conflict-of-interest declarations; two independent judges plus moderation; score sheets locked in an append-only ledger; script-computed results checked by two OC members.",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    id: "portal",
    label: "Event portal",
    description:
      "Registration, submissions, clarifications and appeals.",
    url: siteConfig.portalUrl,
  },
  {
    id: "announcements",
    label: "Announcements channel",
    description: "Official updates from the organising committee.",
    url: siteConfig.announcementsUrl,
  },
  {
    id: "clarifications",
    label: "Clarifications channel",
    description:
      "Public Q&A. Every answer is posted to all teams.",
    url: siteConfig.clarificationsUrl,
  },
  {
    id: "registered-email",
    label: "Registered email",
    description: "Official email for registered teams.",
    url: siteConfig.contactEmail
      ? `mailto:${siteConfig.contactEmail}`
      : null,
  },
];

export const contactTopics: string[] = [
  "Registration",
  "Eligibility and tracks",
  "Accessibility request",
  "Conduct or integrity report",
  "Technical support",
  "General question",
];

export const ocContactNotes = [
  {
    title: "Accessibility requests",
    body: "Submit accessibility requests before D-3 through the official channels.",
  },
  {
    title: "Conduct and integrity reports",
    body: "Anyone can report a conduct or integrity concern confidentially. Retaliation is prohibited.",
  },
  {
    title: "Technical problems during the event",
    body: "Raise a ticket within 15 minutes of a technical problem. Personal connectivity failures do not justify extensions.",
  },
];
