import type { JSX } from 'react';
import { Image, Link, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { HomeCardProps } from 'components/home-card/HomeCard';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';
import { nativeMediaSource } from 'lib/native-media';
import { nativeLinkProps } from 'lib/native-link';

type FeaturePresentation = 'default' | 'video' | 'mywestfield' | 'about';

const HomeFeature = ({
  fields,
  params,
  presentation,
}: HomeCardProps & { presentation: FeaturePresentation }): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  const isAbout = presentation === 'about';

  return (
    <section
      className={[
        'component',
        'wf-home-feature',
        `wf-home-feature--${presentation}`,
        params.GridParameters,
        params.styles,
      ]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className="wf-home-container">
        <div className="wf-home-feature__row">
          {!isAbout ? (
            <div className="wf-home-feature__media">
              {presentation === 'video' && fields?.VideoUrl?.value ? (
                <div className="wf-home-feature__video">
                  <iframe
                    src={fields.VideoUrl.value}
                    title={fields?.Heading?.value || 'Westfield video'}
                    allow="fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="wf-home-feature__image">
                  <Image
                    field={fields?.Image}
                    {...nativeMediaSource(fields?.Image)}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          ) : null}
          <div className="wf-home-feature__copy">
            <div className="wf-home-feature__inner">
              <Text tag="span" className="wf-home-feature__eyebrow" field={fields?.Eyebrow} />
              <Text tag="h2" className="wf-home-feature__title" field={fields?.Heading} />
              <RichText className="wf-home-feature__body" field={fields?.Body} />
              {fields?.Link ? (
                <div className="wf-home-feature__cta">
                  <Link
                    className="wf-home-body-button"
                    field={fields.Link}
                    {...nativeLinkProps(fields.Link)}
                    {...campaignLoginProps(fields.Link, campaignQuery)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Default = (props: HomeCardProps): JSX.Element => (
  <HomeFeature {...props} presentation="default" />
);
export const Video = (props: HomeCardProps): JSX.Element => (
  <HomeFeature {...props} presentation="video" />
);
export const MyWestfield = (props: HomeCardProps): JSX.Element => (
  <HomeFeature {...props} presentation="mywestfield" />
);
export const About = (props: HomeCardProps): JSX.Element => (
  <HomeFeature {...props} presentation="about" />
);
