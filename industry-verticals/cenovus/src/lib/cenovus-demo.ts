/**
 * Wireframe-style demo content when CMS datasources are empty (Fluor intranet persona).
 * When editing in Pages, CMS fields take precedence.
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

/** Text logo / aria when no image logo is configured (demo + CMS fallback). */
export const demoIntranetBrand = {
  homeAriaLabel: 'Fluor intranet home',
  wordmarkLine1: 'fluor',
  wordmarkLine2: 'Intranet',
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

export const demoHeaderUtility = {
  welcomeText: 'Fluor intranet — welcome',
  regionPrefix: 'Office',
  searchPlaceholder: 'Search directory, projects, policies…',
  stocks: [
    { label: 'FLR', trend: 'up' as const, display: 'FLR $51.84' },
    { label: 'SPX', trend: 'up' as const, display: 'S&P 500 5,926' },
  ],
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
    id: 'demo-slide-1',
    title: 'Global town hall — strategy & outlook',
    description:
      '<p>Replay available for all regions. Q&amp;A summary posted to leadership channels.</p>',
    date: '2026-06-04',
    cta: 'Watch replay',
    gradient: 'from-[#005568] to-[#003d4d]',
  },
  {
    id: 'demo-slide-2',
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
  linksHeading: 'Quick links',
  links: [
    { label: 'Code of Business Conduct', href: '#' },
    { label: 'Information security', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Procurement portal', href: '#' },
  ],
  supportHeading: 'Need help?',
  supportHtml:
    '<p>IT Service Desk <strong>469-555-0140</strong> · HR Answers <strong>1-866-555-0193</strong></p>',
  supportCta: 'Visit support hub',
  feedbackHeading: 'Feedback',
  copyright: '© 2026 Fluor Corporation',
};
