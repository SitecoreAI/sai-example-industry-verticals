import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

const campaignParameters = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
] as const;

/** Read after hydration so server and initial client links use the same native field. */
export function useCampaignQuery(): string {
  const { asPath } = useRouter();
  const [search, setSearch] = useState('');
  useEffect(() => setSearch(window.location.search), [asPath]);
  return search;
}

/** Override only the SDK href prop; preserve the original field and editing metadata. */
export function campaignLoginProps(
  field: LinkField | undefined,
  search: string
): { href?: string } {
  const href = field?.value?.href;
  if (
    (field && 'metadata' in field && field.metadata) ||
    typeof href !== 'string' ||
    !/^\/login\/?(?:[?#]|$)/.test(href)
  ) {
    return {};
  }

  const incoming = new URLSearchParams(search);
  if (!campaignParameters.some((name) => incoming.has(name))) return {};

  const destination = new URL(href, 'https://westfield.example.invalid');
  const nativeQuery = field?.value?.querystring;
  if (typeof nativeQuery === 'string') {
    for (const [name, value] of new URLSearchParams(nativeQuery)) {
      destination.searchParams.append(name, value);
    }
  }
  for (const name of campaignParameters) {
    if (incoming.has(name)) {
      destination.searchParams.delete(name);
      for (const value of incoming.getAll(name)) destination.searchParams.append(name, value);
    }
  }
  if (!destination.hash && field?.value?.anchor) destination.hash = field.value.anchor;

  return { href: `${destination.pathname}${destination.search}${destination.hash}` };
}
