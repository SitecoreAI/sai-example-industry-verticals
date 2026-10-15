import type { JSX } from 'react';
import { Image, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { nativeMediaSource } from 'lib/native-media';
import { AgentFinder } from 'lib/agent-finder';
import { HeroSun } from 'lib/westfield-icons';

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
          {...nativeMediaSource(fields?.Image)}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </div>
  </section>
);

export const Home = ({ fields, params }: CampaignHeroProps): JSX.Element => (
  <section
    className={[
      'wf-source hero-banner_heroBanner__Af7BC hero-banner_agentSearchVisible__eQdCU',
      'component',
      params.GridParameters,
      params.styles,
    ]
      .filter(Boolean)
      .join(' ')}
    id={params.RenderingIdentifier || undefined}
    data-class-change
  >
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="hero-banner_contentWrapper__32nTp">
            <div className="hero-banner_content__3kw8L">
              <Text tag="h1" className="hero-banner_title__pNOM6" field={fields?.Heading} />
              <RichText className="hero-banner_richText__NJzEH rich-text" field={fields?.Body} />
            </div>
            <div className="hero-banner_agentSearchWrapper__VR4Fh">
              <AgentFinder placement="hero" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="hero-banner_sunWrapper__TACH7">
      <HeroSun />
    </div>
    <div className="hero-banner_imageWrapper__xwOk3">
      <Image
        field={fields?.Image}
        {...nativeMediaSource(fields?.Image)}
        loading="eager"
        fetchPriority="high"
      />
    </div>
  </section>
);
