import React, { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/** Stacks on small screens; from lg: first child ~8/12 cols, second ~4/12; single child spans full row. */
const cenovusMainTwoColumnBandGridClass =
  'grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8 [&>*:nth-child(1)]:min-w-0 [&>*:nth-child(1)]:lg:col-span-8 [&>*:nth-child(2)]:min-w-0 [&>*:nth-child(2)]:lg:col-span-4 [&>*:only-child]:lg:col-span-12';

/** Nested placeholders — keys match Placeholder Settings (dynamic suffix for EE/Pages). */
export const CENOVUS_HOMEPAGE_HERO_BAND = 'cenovus-homepage-hero-band-{*}';
export const CENOVUS_HOMEPAGE_NEWS_SPOTLIGHTS_BAND = 'cenovus-homepage-news-spotlights-band-{*}';

export const Default = ({ params, rendering }: ComponentProps): JSX.Element => {
  const id = params.RenderingIdentifier;

  return (
    <div className="cenovus-homepage font-body flex flex-col gap-8 lg:gap-10" id={id || undefined}>
      <div className="cenovus-main-hero-band mx-auto w-full max-w-[1600px] rounded-2xl bg-[var(--color-background-accent)]/35 px-2 py-4 shadow-sm sm:px-4 lg:py-6">
        <div className={cenovusMainTwoColumnBandGridClass}>
          <Placeholder name={CENOVUS_HOMEPAGE_HERO_BAND} rendering={rendering} />
        </div>
      </div>
      <div className="cenovus-main-news-spotlights-band mx-auto w-full max-w-[1600px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-4 shadow-sm sm:px-4 lg:py-6">
        <div className={cenovusMainTwoColumnBandGridClass}>
          <Placeholder name={CENOVUS_HOMEPAGE_NEWS_SPOTLIGHTS_BAND} rendering={rendering} />
        </div>
      </div>
    </div>
  );
};
