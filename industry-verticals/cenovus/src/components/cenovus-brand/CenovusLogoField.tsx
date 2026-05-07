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
 * Logo driven by the datasource Image field. Uses `NextImage` like the Promo component.
 * The home link is an overlay so field chromes are not nested inside `<a>`.
 */
export function CenovusLogoField({
  field,
  imgClassName,
  wrapperClassName,
}: CenovusLogoFieldProps): JSX.Element {
  return (
    <div className={`relative inline-block shrink-0 ${wrapperClassName ?? ''}`}>
      <ContentSdkImage field={field} className={`relative z-0 ${imgClassName ?? ''}`} />
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
