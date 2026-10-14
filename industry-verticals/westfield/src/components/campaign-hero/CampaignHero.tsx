import type { JSX } from 'react';
import { Image, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

export type CampaignHeroProps = ComponentProps & {
  fields?: {
    Eyebrow?: Field<string>;
    Heading?: Field<string>;
    Body?: Field<string>;
    Image?: ImageField;
  };
};

export const Default = ({ fields, params }: CampaignHeroProps): JSX.Element => (
  <section
    className={['component', 'westfield-campaign-hero', params.GridParameters, params.styles]
      .filter(Boolean)
      .join(' ')}
    id={params.RenderingIdentifier || undefined}
    data-class-change
  >
    <div className="component-content westfield-campaign-hero__inner">
      <div className="westfield-campaign-hero__copy">
        <Text tag="p" className="westfield-campaign-hero__eyebrow" field={fields?.Eyebrow} />
        <Text tag="h1" className="westfield-campaign-hero__heading" field={fields?.Heading} />
        <RichText className="westfield-campaign-hero__body" field={fields?.Body} />
      </div>
      <div className="westfield-campaign-hero__media">
        <Image
          className="westfield-campaign-hero__image"
          field={fields?.Image}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  </section>
);
