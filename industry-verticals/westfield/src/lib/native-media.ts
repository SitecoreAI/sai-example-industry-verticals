import type { ImageField } from '@sitecore-content-sdk/nextjs';

/**
 * Preview media uses the site's TargetHostName. Correct that host only for this
 * editing app; the original SDK field and all of its editing metadata stay intact.
 * Published Edge media and Content Hub URLs pass through unchanged.
 */
export function nativeMediaSource(field?: ImageField): { src?: string } {
  const src = field?.value?.src;
  const cmHost = process.env.NEXT_PUBLIC_SITECORE_CM_HOST;
  const targetHost = process.env.NEXT_PUBLIC_SITECORE_TARGET_HOST;
  if (!src || !cmHost || !targetHost) return {};

  try {
    const url = new URL(src);
    if (url.hostname !== targetHost || !url.pathname.startsWith('/-/media/')) return {};
    url.host = cmHost;
    url.protocol = 'https:';
    return { src: url.toString() };
  } catch {
    return {};
  }
}
