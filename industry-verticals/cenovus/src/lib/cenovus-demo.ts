/**
 * Fluor intranet sample content used when route components have no CMS datasource yet.
 * In Experience Editor or Pages, authored fields replace this content.
 */

/**
 * Default-on full-page shell (muted canvas, full-height stack). Opt out with
 * `NEXT_PUBLIC_CENOVUS_SHOWCASE=false` when you want a minimal wrapper.
 */
export function isCenovusShowcaseShellEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CENOVUS_SHOWCASE !== 'false';
}

export function shouldShowCenovusDemo(isEditing: boolean, hasDatasourceContent: boolean): boolean {
  return !isEditing && !hasDatasourceContent;
}

/** Home link label on the header/footer logo (CMS image or default below). */
export const demoIntranetBrand = {
  homeAriaLabel: 'Cenovus intranet home',
} as const;

/**
 * Default logo file in `/public` when no logo image is set in Sitecore.
 * Replace `cenovus-logo.svg` or point `src` at your own asset (e.g. `.png`).
 */
export const defaultBrandLogo = {
  src: '/cenovus-logo.svg',
  width: 200,
  height: 48,
  alt: 'Cenovus',
} as const;

export const demoRegions = ['Dallas', 'Houston', 'Greenville', 'Aliso Viejo', 'London'] as const;
export type DemoRegion = (typeof demoRegions)[number];
export const demoRegionDefault: DemoRegion = 'Dallas';

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
      { label: 'Learning @ Fluor', href: '#' },
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
  welcomeText: 'Fluor intranet — welcome',
  regionPrefix: 'Office',
  searchPlaceholder: 'Search directory, projects, policies…',
  stocks: [
    { label: 'FLR', trend: 'up', display: 'FLR $51.84' },
    { label: 'SPX', trend: 'down', display: 'S&P 500 5,926' },
  ] satisfies DemoStockTicker[],
  utilityLinks: [
    { label: 'Ethics helpline', href: '#' },
    { label: 'Workday', href: '#' },
    { label: 'ServiceNow', href: '#' },
    { label: 'fluor.com', href: '#', external: true },
  ],
};

export const demoHeroSection = {
  title: 'Building a better world',
  description:
    'Your hub for projects, people, and policies—aligned with Fluor standards for safety, quality, and delivery.',
};

export const demoHeroSlides = [
  {
    id: 'intranet-hero-1',
    title: 'Global town hall — strategy & outlook',
    description:
      '<p>Replay available for all regions. Q&amp;A summary posted to leadership channels.</p>',
    date: '2026-06-04',
    cta: 'Watch replay',
    gradient: 'from-[#005568] to-[#003d4d]',
  },
  {
    id: 'intranet-hero-2',
    title: 'Scheduled maintenance: SAP & VPN',
    description:
      '<p>Saturday 1:00–5:00 AM CT. Remote access may cycle briefly during the window.</p>',
    date: '2026-06-14',
    cta: 'Read IT bulletin',
    gradient: 'from-[#b66721] to-[#8a4e19]',
  },
];

export const demoKeyDates = [
  { id: 'kd1', title: 'Annual compliance attestation due', date: 'June 20, 2026' },
  { id: 'kd2', title: 'Greenville office safety stand-down', date: 'July 9, 2026' },
  { id: 'kd3', title: 'Mid-year performance conversations', date: 'July 21 — Aug 8, 2026' },
  { id: 'kd4', title: 'Enterprise engineering summit (virtual)', date: 'September 3, 2026' },
];

export const demoCompanyNews = {
  title: 'News & announcements',
  seeAllLabel: 'View all',
  items: [
    {
      id: 'n1',
      date: 'June 3, 2026',
      location: 'Irving',
      headline: 'Fluor awarded FEED study for Gulf Coast chemical expansion',
      summary:
        '<p>Multi-office execution with shared engineering centers in Houston and Manila.</p>',
      author: 'Corporate Communications',
    },
    {
      id: 'n2',
      date: 'May 29, 2026',
      location: 'Greenville',
      headline: 'Zero recordables milestone recognized at packaging facility project',
      summary: '<p>Joint venture teams highlighted for field leadership and pre-job briefings.</p>',
      author: 'HSE Operations',
    },
    {
      id: 'n3',
      date: 'May 16, 2026',
      location: 'London',
      headline: 'Investor call replay and slide deck posted',
      summary: '<p>Guidance, backlog, and cash discussion from the latest quarterly webcast.</p>',
      author: 'Investor Relations',
    },
    {
      id: 'n4',
      date: 'May 7, 2026',
      location: 'Aliso Viejo',
      headline: 'STEM scholarship recipients announced',
      summary:
        '<p>Partnerships with schools near major project sites for the upcoming academic year.</p>',
      author: 'Community & Citizenship',
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
    },
    {
      id: 's2',
      title: 'Volunteer week: 2,400 hours served globally',
      subtitle: 'Community',
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
