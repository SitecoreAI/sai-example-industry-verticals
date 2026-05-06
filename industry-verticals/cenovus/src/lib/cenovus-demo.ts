/**
 * Wireframe-style demo content for Cenovus when CMS datasources are empty.
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

export const demoNav = [
  {
    label: 'Safety & operations',
    href: '#',
    children: [
      { label: 'Operations dashboard', href: '#' },
      { label: 'Emergency procedures', href: '#' },
      { label: 'Field updates', href: '#' },
    ],
  },
  {
    label: 'Tools & resources',
    href: '#',
    children: [
      { label: 'Employee portal', href: '#' },
      { label: 'IT service desk', href: '#' },
      { label: 'Brand guidelines', href: '#' },
    ],
  },
  {
    label: 'Newsroom',
    href: '#',
    children: [
      { label: 'Press releases', href: '#' },
      { label: 'Media contacts', href: '#' },
    ],
  },
  {
    label: 'Careers',
    href: '#',
    children: [],
  },
  {
    label: 'Investors',
    href: '#',
    children: [
      { label: 'Quarterly results', href: '#' },
      { label: 'Annual reports', href: '#' },
    ],
  },
] as const;

export const demoHeaderUtility = {
  welcomeText: 'Employee hub — Calgary HQ',
  regionPrefix: 'Region',
  searchPlaceholder: 'Search people, policies, tools…',
  stocks: [
    { label: 'CVE', trend: 'up' as const, display: 'CVE $28.42' },
    { label: 'WTI', trend: 'down' as const, display: 'WTI $72.10' },
  ],
  utilityLinks: [
    { label: 'Integrity helpline', href: '#' },
    { label: 'Workday', href: '#' },
    { label: 'SelfServe', href: '#' },
    { label: 'cenovus.com', href: '#', external: true },
  ],
};

export const demoHeroSection = {
  title: 'How we create value',
  description:
    'Operational excellence, disciplined capital, and clear communication across our regions.',
};

export const demoHeroSlides = [
  {
    id: 'demo-slide-1',
    title: 'Town hall: Q2 priorities',
    description:
      '<p>Join leadership for updates on safety metrics, production outlook, and community partnerships.</p>',
    date: '2026-06-15',
    cta: 'Add to calendar',
    gradient: 'from-[#005568] to-[#003d4d]',
  },
  {
    id: 'demo-slide-2',
    title: 'Maintenance window — enterprise apps',
    description:
      '<p>Planned downtime Sunday 2:00–6:00 AM MT. VPN and SSO may be briefly unavailable.</p>',
    date: '2026-06-22',
    cta: 'Read bulletin',
    gradient: 'from-[#b66721] to-[#8a4e19]',
  },
];

export const demoKeyDates = [
  { id: 'kd1', title: 'Benefits enrolment opens', date: 'June 9 — July 4, 2026' },
  { id: 'kd2', title: 'Corporate volunteer day', date: 'July 18, 2026' },
  { id: 'kd3', title: 'Investor day (virtual)', date: 'August 6, 2026' },
  { id: 'kd4', title: 'Town hall — Denver office', date: 'September 12, 2026' },
];

export const demoCompanyNews = {
  title: 'Company news',
  seeAllLabel: 'See all stories',
  items: [
    {
      id: 'n1',
      date: 'June 2, 2026',
      location: 'Calgary',
      headline: 'Cenovus publishes annual sustainability report',
      summary:
        '<p>Highlights progress on emissions intensity, water stewardship, and Indigenous partnerships.</p>',
      author: 'Corporate Communications',
    },
    {
      id: 'n2',
      date: 'May 28, 2026',
      location: 'Field',
      headline: 'Safety milestone: 365 days LTI-free at Christina Lake',
      summary:
        '<p>Teams recognized for hazard identification and peer-to-peer coaching programs.</p>',
      author: 'HSE Central',
    },
    {
      id: 'n3',
      date: 'May 14, 2026',
      location: 'Houston',
      headline: 'Investor webcast replay available',
      summary: '<p>Replay and slides from the latest guidance and balance sheet discussion.</p>',
      author: 'Investor Relations',
    },
    {
      id: 'n4',
      date: 'May 6, 2026',
      location: 'Toronto',
      headline: 'New partnership supports STEM scholarships',
      summary: '<p>Funding for students in communities near operating assets.</p>',
      author: 'Community Investment',
    },
  ],
};

export const demoSpotlights = {
  title: 'Spotlights',
  items: [
    {
      id: 's1',
      title: 'Digital field tickets pilot',
      subtitle: 'Operations',
    },
    {
      id: 's2',
      title: 'ERG spotlight: Pride network',
      subtitle: 'People & culture',
    },
  ],
};

export const demoFooter = {
  linksHeading: 'Quick links',
  links: [
    { label: 'Code of conduct', href: '#' },
    { label: 'Privacy & data', href: '#' },
    { label: 'Accessibility', href: '#' },
    { label: 'Supplier portal', href: '#' },
  ],
  supportHeading: 'Need help?',
  supportHtml:
    '<p>IT Service Desk <strong>403-555-0199</strong> · HR Connect <strong>1-888-555-0142</strong></p>',
  supportCta: 'Visit support hub',
  feedbackHeading: 'Feedback',
  copyright: '© 2026 Cenovus Energy Inc. Demo experience — not production content.',
};
