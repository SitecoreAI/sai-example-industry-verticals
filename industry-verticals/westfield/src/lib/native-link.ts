import type { LinkField } from '@sitecore-content-sdk/nextjs';

/** Preserve an authored fragment when Sitecore prefixes its external-link URL. */
export function nativeLinkProps(field?: LinkField): { href?: string } {
  return field?.value?.url === '#' ? { href: '#' } : {};
}
