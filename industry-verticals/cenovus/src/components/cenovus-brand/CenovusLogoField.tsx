import { NextImage as ContentSdkImage, type ImageField } from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import React, { JSX } from 'react';

import { demoIntranetBrand } from '@/lib/cenovus-demo';

type CenovusLogoFieldProps = {
  /** Sitecore Image field (`logo.jsonValue` from integrated GraphQL). */
  field?: ImageField;
  /** Classes on the rendered `<img>` (object-fit, height, etc.). */
  imgClassName?: string;
  /** Optional width constraint on the wrapper (e.g. max-w). */
  wrapperClassName?: string;
};

/**
 * Logo driven by the datasource Image field. When the media has a URL, we render a plain `<img>` so
 * XM Cloud media URLs are not dependent on Next/Image optimization or remotePatterns matching edge cases.
 * When there is no `src`, `NextImage` keeps authoring chromes for an empty field.
 */
export function CenovusLogoField({
  field,
  imgClassName,
  wrapperClassName,
}: CenovusLogoFieldProps): JSX.Element {
  const rawSrc = field?.value?.src;
  const src = typeof rawSrc === 'string' && rawSrc.length > 0 ? rawSrc : undefined;
  const alt =
    typeof field?.value?.alt === 'string' ? field.value.alt : String(field?.value?.alt ?? '');

  return (
    <div className={`relative inline-block shrink-0 ${wrapperClassName ?? ''}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- intentional: reliable CMS media URLs outside optimizer
        <img src={src} alt={alt} className={`relative z-0 ${imgClassName ?? ''}`} />
      ) : (
        <ContentSdkImage field={field} className={`relative z-0 ${imgClassName ?? ''}`} />
      )}
      <NextLink
        href="/"
        className="absolute inset-0 z-10 rounded-sm focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)] focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={demoIntranetBrand.homeAriaLabel}
      >
        <span className="sr-only">{demoIntranetBrand.homeAriaLabel}</span>
      </NextLink>
    </div>
  );
}
