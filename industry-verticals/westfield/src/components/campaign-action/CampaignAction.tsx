import type { JSX } from 'react';
import { Link, RichText, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

export type CampaignActionProps = ComponentProps & {
  fields?: {
    Heading?: Field<string>;
    Body?: Field<string>;
    Link?: LinkField;
  };
};

type CampaignActionPresentationProps = CampaignActionProps & {
  presentation: 'default' | 'quiet';
};

const CampaignAction = ({
  fields,
  params,
  presentation,
}: CampaignActionPresentationProps): JSX.Element | null => {
  const { page } = useSitecore();
  const hasContent =
    fields?.Heading?.value?.trim() ||
    fields?.Body?.value
      ?.replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, '')
      .trim() ||
    /<(?:img|iframe|video|audio|table|svg)\b/i.test(fields?.Body?.value ?? '') ||
    fields?.Link?.value?.href;
  if (!page.mode.isEditing && !hasContent) return null;

  return (
    <section
      className={[
        'component',
        'westfield-campaign-action',
        `westfield-campaign-action--${presentation}`,
        params.GridParameters,
        params.styles,
      ]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className="component-content westfield-campaign-action__inner">
        <div className="westfield-campaign-action__copy">
          <Text tag="h2" className="westfield-campaign-action__heading" field={fields?.Heading} />
          <RichText className="westfield-campaign-action__body" field={fields?.Body} />
        </div>
        {fields?.Link ? (
          <Link className="westfield-campaign-action__link" field={fields.Link} />
        ) : null}
      </div>
    </section>
  );
};

export const Default = (props: CampaignActionProps): JSX.Element | null => (
  <CampaignAction {...props} presentation="default" />
);

export const Quiet = (props: CampaignActionProps): JSX.Element | null => (
  <CampaignAction {...props} presentation="quiet" />
);
