import React, { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/** Wireframe: ~⅔ main (hero / news) + ~⅓ rail (key dates / spotlights). Uses 2fr/1fr tracks so the
 * first two placeholder children map to columns without brittle col-span + nth-child (which breaks
 * when Pages injects wrappers). Single child spans full width. */
const cenovusMainTwoColumnBandGridClass =
  'cenovus-homepage-band-grid grid w-full grid-cols-1 items-start gap-6 lg:gap-8 lg:[grid-template-columns:minmax(0,2fr)_minmax(0,1fr)] [&>*]:min-w-0 lg:[&>*:only-child]:[grid-column:1/-1]';

export const CENOVUS_HOMEPAGE_HERO_BAND = 'cenovus-homepage-hero-band-{*}';
export const CENOVUS_HOMEPAGE_NEWS_SPOTLIGHTS_BAND = 'cenovus-homepage-news-spotlights-band-{*}';

export const Default = ({ params, rendering }: ComponentProps): JSX.Element => {
  const id = params.RenderingIdentifier;

  return (
    <div
      className="cenovus-homepage font-body flex w-full min-w-0 flex-col gap-8 lg:gap-10"
      id={id || undefined}
    >
      <div className="cenovus-main-hero-band container w-full rounded-2xl bg-[var(--color-background-accent)]/35 py-4 shadow-sm lg:py-6">
        <div className={cenovusMainTwoColumnBandGridClass}>
          <Placeholder name={CENOVUS_HOMEPAGE_HERO_BAND} rendering={rendering} />
        </div>
      </div>
      <div className="cenovus-main-news-spotlights-band container w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] py-4 shadow-sm lg:py-6">
        <div className={cenovusMainTwoColumnBandGridClass}>
          <Placeholder name={CENOVUS_HOMEPAGE_NEWS_SPOTLIGHTS_BAND} rendering={rendering} />
        </div>
      </div>
    </div>
  );
};
