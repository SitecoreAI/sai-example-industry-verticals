import type { ImageField } from '@sitecore-content-sdk/nextjs';

/**
 * Whether an ImageField has a URL Sitecore can render (layout / Edge payloads vary slightly).
 */
export function imageFieldHasRenderableSrc(field?: ImageField | null): boolean {
  if (!field?.value) {
    return false;
  }
  const v = field.value as { src?: string | null; href?: string | null };
  const src = typeof v.src === 'string' ? v.src.trim() : '';
  if (src.length > 0) {
    return true;
  }
  const href = typeof v.href === 'string' ? v.href.trim() : '';
  return href.length > 0;
}
