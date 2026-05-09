/**
 * Cenovus intranet sample content for disconnected/demo mode.
 */

/**
 * Default-on full-page shell (muted canvas, full-height stack). Opt out with
 * `NEXT_PUBLIC_CENOVUS_SHOWCASE=false` when you want a minimal wrapper.
 */
export function isCenovusShowcaseShellEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CENOVUS_SHOWCASE !== 'false';
}

/**
 * Whether bundled demo sections (hero, spotlights, news, key dates) should render.
 * Always on in Page Builder / edit mode so the showcase fake content stays visible for demos.
 * Outside the editor, demo follows `NEXT_PUBLIC_CENOVUS_SHOWCASE` (default on unless set to `false`).
 */
export function shouldShowCenovusDemo(isEditing: boolean): boolean {
  if (isEditing) {
    return true;
  }
  return process.env.NEXT_PUBLIC_CENOVUS_SHOWCASE !== 'false';
}

/** Home link label on the header/footer logo (CMS image or default below). */
export const demoIntranetBrand = {
  homeAriaLabel: 'Cenovus intranet home',
} as const;

/**
 * Default logo when no CMS datasource / logo field is used (header/footer demo chrome).
 * Served from Sitecore media; layout uses `object-contain` so intrinsic size is a hint only.
 */
export const defaultBrandLogo = {
  src: 'https://cenovus.sitecoresandbox.cloud/api/public/content/22f7e5f5540241c1994e1fcfb1ea98b0?v=fc87473d',
  width: 320,
  height: 80,
  alt: 'Cenovus Energy Logo',
} as const;

/** Grouped regions for the header picker (US / Canada). */
export const demoRegionGroups = [
  { label: 'US', regions: ['Lima', 'Superior'] as const },
  { label: 'Canada', regions: ['Calgary', 'Atlantic Canada', 'Western Canada'] as const },
] as const;

export type DemoRegion = (typeof demoRegionGroups)[number]['regions'][number];

export const demoRegions: DemoRegion[] = demoRegionGroups.flatMap((g) => [...g.regions]);

export const demoRegionDefault: DemoRegion = 'Calgary';

export const demoNav = [
  {
    label: 'My work',
    href: '#',
    children: [
      { label: 'Timesheets & charge codes', href: '#' },
      { label: 'Project controls dashboard', href: '#' },
      { label: 'Drawing transmittals', href: '#' },
    ],
  },
  {
    label: 'People & HR',
    href: '#',
    children: [
      { label: 'Workday', href: '#' },
      { label: 'Benefits & wellbeing', href: '#' },
      { label: 'Learning @ Cenovus', href: '#' },
    ],
  },
  {
    label: 'Digital workplace',
    href: '#',
    children: [
      { label: 'ServiceNow IT', href: '#' },
      { label: 'Teams & collaboration', href: '#' },
      { label: 'Cybersecurity alerts', href: '#' },
    ],
  },
  {
    label: 'Travel & expenses',
    href: '#',
    children: [],
  },
  {
    label: 'News & leadership',
    href: '#',
    children: [
      { label: 'Town hall replays', href: '#' },
      { label: 'Executive messages', href: '#' },
    ],
  },
] as const;

export type DemoStockTicker = {
  label: string;
  trend: 'up' | 'down';
  display: string;
};

export const demoHeaderUtility = {
  welcomeText: 'Welcome, John Q. Employee',
  regionPrefix: 'Choose your region:',
  searchPlaceholder: 'Search directory, projects, policies…',
  stocks: [
    { label: 'CVE', trend: 'up', display: 'CVE $28.40' },
    { label: 'SPX', trend: 'down', display: 'S&P 500 $7,398.92' },
  ] satisfies DemoStockTicker[],
  utilityLinks: [
    { label: 'Ethics helpline', href: '#' },
    { label: 'Workday', href: '#' },
    { label: 'ServiceNow', href: '#' },
    { label: 'cenovus.com', href: '#', external: true },
  ],
};

export const demoHeroSection = {
  title: 'Building a better world',
  description:
    'Your hub for projects, people, and policies—aligned with Cenovus standards for safety, quality, and delivery.',
};

export const demoHeroSlides = [
  {
    id: 'intranet-hero-1',
    title: 'Global town hall — strategy & outlook',
    description:
      '<p>Replay available for all regions. Q&amp;A summary posted to leadership channels.</p>',
    date: '2026-06-04',
    cta: 'Watch replay',
    imageSrc: 'https://picsum.photos/id/48/1600/1000',
    imageAlt: 'Conference room presentation and teamwork',
  },
  {
    id: 'intranet-hero-2',
    title: 'Scheduled maintenance: SAP & VPN',
    description:
      '<p>Saturday 1:00–5:00 AM CT. Remote access may cycle briefly during the window.</p>',
    date: '2026-06-14',
    cta: 'Read IT bulletin',
    imageSrc: 'https://picsum.photos/id/180/1600/1000',
    imageAlt: 'Server room and network infrastructure',
  },
];

export const demoKeyDates = [
  { id: 'kd1', title: 'Annual compliance attestation due', date: 'June 20, 2026' },
  { id: 'kd2', title: 'Greenville office safety stand-down', date: 'July 9, 2026' },
  { id: 'kd3', title: 'Mid-year performance conversations', date: 'July 21 — Aug 8, 2026' },
  { id: 'kd4', title: 'Enterprise engineering summit (virtual)', date: 'September 3, 2026' },
];

export const demoCompanyNews = {
  title: 'News and announcements',
  seeAllLabel: 'View all',
  items: [
    {
      id: 'n1',
      date: 'June 3, 2026',
      location: 'Calgary',
      headline: 'Cenovus operational update: disciplined capital and safety performance',
      summary:
        '<p>Multi-office execution with shared engineering centers in Houston and Manila.</p>',
      author: 'Corporate Communications',
      imageSrc: 'https://picsum.photos/id/316/640/400',
      imageAlt: 'Industrial facility at dusk',
    },
    {
      id: 'n2',
      date: 'May 29, 2026',
      location: 'Lima',
      headline: 'Zero recordables milestone recognized at packaging facility project',
      summary: '<p>Joint venture teams highlighted for field leadership and pre-job briefings.</p>',
      author: 'HSE Operations',
      imageSrc: 'https://picsum.photos/id/504/640/400',
      imageAlt: 'Safety briefing on a project site',
    },
    {
      id: 'n3',
      date: 'May 16, 2026',
      location: 'Atlantic Canada',
      headline: 'Investor call replay and slide deck posted',
      summary: '<p>Guidance, backlog, and cash discussion from the latest quarterly webcast.</p>',
      author: 'Investor Relations',
      imageSrc: 'https://picsum.photos/id/201/640/400',
      imageAlt: 'Business presentation charts',
    },
    {
      id: 'n4',
      date: 'May 7, 2026',
      location: 'Western Canada',
      headline: 'STEM scholarship recipients announced',
      summary:
        '<p>Partnerships with schools near major project sites for the upcoming academic year.</p>',
      author: 'Community & Citizenship',
      imageSrc: 'https://picsum.photos/id/384/640/400',
      imageAlt: 'Students in a classroom workshop',
    },
  ],
};

export const demoSpotlights = {
  title: 'Spotlights',
  items: [
    {
      id: 's1',
      title: 'Advanced modularization pilot — Aliso Viejo',
      subtitle: 'Innovation',
      imageSrc: 'https://picsum.photos/id/535/960/720',
      imageAlt: 'Construction and modular assembly yard',
    },
    {
      id: 's2',
      title: 'Volunteer week: 2,400 hours served globally',
      subtitle: 'Community',
      imageSrc: 'https://picsum.photos/id/429/960/720',
      imageAlt: 'Volunteers planting trees together',
    },
    {
      id: 's3',
      title: 'Contractor onboarding checklist refreshes for summer turnaround season',
      subtitle: 'Operations',
      imageSrc: 'https://picsum.photos/id/318/960/720',
      imageAlt: 'Team reviewing procedures at a project site',
    },
    {
      id: 's4',
      title: 'Quarterly Values in Action recognition — submit nominations by July 15',
      subtitle: 'People',
      imageSrc: 'https://picsum.photos/id/593/960/720',
      imageAlt: 'Colleagues collaborating in an office meeting',
    },
  ],
};

export const demoFooter = {
  /** Column under logo — matches typical intranet wireframe “brand + notice” stack. */
  brandBlurb:
    'Internal networks and tools for Cenovus employees and authorized contractors. Protect confidential information—do not forward externally without approval.',
  linksHeading: 'Popular shortcuts',
  links: [
    { label: 'Workday (pay, time & absence)', href: '#' },
    { label: 'IT service catalog & outages', href: '#' },
    { label: 'Travel, corporate card & safety', href: '#' },
    { label: 'Policies, standards & delegation of authority', href: '#' },
    { label: 'Integrity Helpline & ethics resources', href: '#' },
    { label: 'Operations readiness & JSA library', href: '#' },
  ],
  supportHeading: 'IT & HR support',
  supportHtml: `<p><strong>IT Service Desk</strong> · Calgary <strong>403-769-5500</strong> · Toll-free <strong>1-855-555-0148</strong></p><p>Monday–Friday · 6:00 AM–6:00 PM MT · Critical production issues escalated after hours via on-call.</p><p><strong>HR Connect</strong> · Benefits, payroll & mobility <strong>1-888-555-0175</strong></p>`,
  supportCta: 'Open the help & service hub',
  feedbackHeading: 'Site feedback',
  feedbackIntro:
    'Tell us what would make this hub easier to use—broken links, confusing labels, or missing content. Messages are reviewed by Workplace Communications with the digital workplace team.',
  feedbackPlaceholder:
    'Describe the page, what you tried to do, and what would have helped (screenshots welcome in the full form).',
  /** Bottom bar — corporate-style legal line plus copyright. */
  copyright:
    '© 2026 Cenovus Energy Inc. · Employees & authorized contractors · Confidential · Privacy · Accessibility · Terms of use',
};

/** Categories used by the fake article listing (filter UI + row badges). */
export const demoArticleListingCategories = [
  'Operations',
  'Safety',
  'People',
  'Technology',
  'Community',
] as const;

export type DemoArticleListingCategory = (typeof demoArticleListingCategories)[number];

export type DemoArticleListingItem = {
  id: string;
  title: string;
  dateIso: string;
  category: DemoArticleListingCategory;
  excerpt: string;
  href: string;
};

const listingPrefixes = [
  'Turnaround bulletin',
  'HSE spotlight',
  'IT & digital workplace',
  'People & careers',
  'Community update',
] as const;

/**
 * 100 fake articles (newest first by date) for the Cenovus article landing demo.
 * 10 per page → 10 pages. Not wired to Sitecore search yet.
 */
function buildDemoArticleListingItems(): DemoArticleListingItem[] {
  return Array.from({ length: 100 }, (_, i) => {
    const n = i + 1;
    const category = demoArticleListingCategories[i % demoArticleListingCategories.length];
    const d = new Date(Date.UTC(2026, 7, 15));
    d.setUTCDate(d.getUTCDate() - i);
    return {
      id: `cenovus-demo-article-${n}`,
      title: listingPrefixes[i % listingPrefixes.length],
      dateIso: d.toISOString().slice(0, 10),
      category,
      excerpt:
        'Preview line for the intranet article index—replace with search-driven or folder-driven results when connected.',
      href: '#',
    };
  });
}

export const demoArticleListingItems: DemoArticleListingItem[] = buildDemoArticleListingItems();
