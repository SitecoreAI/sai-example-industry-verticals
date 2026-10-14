import type { JSX } from 'react';
import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

export type CampaignContentProps = ComponentProps & {
  fields?: {
    Heading?: Field<string>;
    Body?: Field<string>;
  };
};

export const Default = ({ fields, params }: CampaignContentProps): JSX.Element => (
  <section
    className={['component', 'westfield-campaign-content', params.GridParameters, params.styles]
      .filter(Boolean)
      .join(' ')}
    id={params.RenderingIdentifier || undefined}
    data-class-change
  >
    <div className="component-content westfield-campaign-content__inner">
      <Text tag="h2" className="westfield-campaign-content__heading" field={fields?.Heading} />
      <RichText className="westfield-campaign-content__body" field={fields?.Body} />
    </div>
  </section>
);
