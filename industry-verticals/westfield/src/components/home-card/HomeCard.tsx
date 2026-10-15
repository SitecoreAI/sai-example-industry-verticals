import { useContext, type JSX } from 'react';
import { Image, Link, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';
import { nativeMediaSource } from 'lib/native-media';
import { nativeLinkProps } from 'lib/native-link';
import { HomeNewsContext } from 'lib/home-news';

export type HomeCardProps = ComponentProps & {
  fields?: {
    Eyebrow?: Field<string>;
    Heading?: Field<string>;
    Body?: Field<string>;
    Image?: ImageField;
    Link?: LinkField;
    VideoUrl?: Field<string>;
  };
};

/** The native parent section controls card presentation, preserving one card contract. */
export const Default = ({ fields, params, rendering }: HomeCardProps): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  const activeNewsCard = useContext(HomeNewsContext);
  const hasLink = Boolean(
    fields?.Link?.value?.href || (fields?.Link && 'metadata' in fields.Link && fields.Link.metadata)
  );

  return (
    <article
      className={['component', 'wf-home-card', params.GridParameters, params.styles]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
      data-news-active={activeNewsCard ? rendering.uid === activeNewsCard : undefined}
    >
      <div className="wf-home-card__box">
        <div className="wf-home-card__image">
          <Image field={fields?.Image} {...nativeMediaSource(fields?.Image)} loading="lazy" />
        </div>
        <div className="wf-home-card__content">
          <h3 className="wf-home-card__heading">
            {hasLink && fields?.Link ? (
              <Link
                className="wf-home-card__link"
                field={fields.Link}
                {...nativeLinkProps(fields.Link)}
                {...campaignLoginProps(fields.Link, campaignQuery)}
              >
                <Text field={fields?.Heading} />
              </Link>
            ) : (
              <Text field={fields?.Heading} />
            )}
          </h3>
          <RichText className="wf-home-card__body" field={fields?.Body} />
          <Text tag="span" className="wf-home-card__eyebrow" field={fields?.Eyebrow} />
        </div>
      </div>
    </article>
  );
};
