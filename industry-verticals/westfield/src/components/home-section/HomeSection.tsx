import { useRef, useState } from 'react';
import type { JSX, UIEvent } from 'react';
import { Link, Placeholder, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { HomeCardProps } from 'components/home-card/HomeCard';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';
import { nativeLinkProps } from 'lib/native-link';
import { HomeNewsContext } from 'lib/home-news';

type SectionPresentation = 'default' | 'services' | 'account' | 'benefits' | 'news';

const HomeSection = ({
  fields,
  params,
  rendering,
  presentation,
}: HomeCardProps & { presentation: SectionPresentation }): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  const track = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const placeholderName = `home-cards-${params.DynamicPlaceholderId}`;
  // The SDK resolves the raw dynamic key while rendering; read either shape before
  // that step so SSR and hydration derive the same native card identities.
  const cards =
    rendering.placeholders?.[placeholderName] || rendering.placeholders?.['home-cards-{*}'] || [];
  const newsCards = cards.filter(
    (card) => 'componentName' in card && card.componentName === 'HomeCard'
  );
  const cardCount = newsCards.length;
  const isNews = presentation === 'news';

  const updateActiveCard = (event: UIEvent<HTMLDivElement>): void => {
    const element = event.currentTarget;
    const slide = element.querySelector<HTMLElement>('.wf-home-card');
    if (slide) {
      setActiveCard(Math.round(element.scrollLeft / (slide.offsetWidth + 20)));
    }
  };

  const selectCard = (index: number): void => {
    setActiveCard(index);
    const element = track.current;
    const slide = element?.querySelectorAll<HTMLElement>('.wf-home-card')[index];
    if (element && slide) {
      element.scrollTo({
        left:
          element.scrollLeft +
          slide.getBoundingClientRect().left -
          element.getBoundingClientRect().left -
          parseFloat(window.getComputedStyle(element).scrollPaddingLeft || '0'),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  };

  const heading = (
    <div className="wf-home-container">
      <div className="wf-home-section__heading">
        <Text tag="span" className="wf-home-section__eyebrow" field={fields?.Eyebrow} />
        <Text tag="h2" className="wf-home-section__title" field={fields?.Heading} />
        <RichText className="wf-home-section__body" field={fields?.Body} />
      </div>
    </div>
  );

  const cardPlaceholder = (
    <div
      className="wf-home-section__cards"
      ref={isNews ? track : undefined}
      onScroll={isNews ? updateActiveCard : undefined}
    >
      <HomeNewsContext.Provider value={isNews ? newsCards[activeCard]?.uid : undefined}>
        <Placeholder name={placeholderName} rendering={rendering} />
      </HomeNewsContext.Provider>
    </div>
  );

  return (
    <section
      className={[
        'component',
        'wf-home-section',
        `wf-home-section--${presentation}`,
        params.GridParameters,
        params.styles,
      ]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className="wf-home-section__heading-wrapper">
        {heading}
        {presentation === 'services' ? (
          <div className="wf-home-section__accent" aria-hidden="true" />
        ) : null}
      </div>
      {isNews ? cardPlaceholder : <div className="wf-home-container">{cardPlaceholder}</div>}
      {isNews && cardCount > 1 ? (
        <ul className="wf-home-section__pagination" aria-label="News slides">
          {Array.from({ length: cardCount }, (_, index) => (
            <li key={index}>
              <button
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === activeCard ? 'true' : undefined}
                onClick={() => selectCard(index)}
              />
            </li>
          ))}
        </ul>
      ) : null}
      {fields?.Link ? (
        <div className="wf-home-container wf-home-section__cta">
          <Link
            className="wf-home-body-button"
            field={fields.Link}
            {...nativeLinkProps(fields.Link)}
            {...campaignLoginProps(fields.Link, campaignQuery)}
          />
        </div>
      ) : null}
    </section>
  );
};

export const Default = (props: HomeCardProps): JSX.Element => (
  <HomeSection {...props} presentation="default" />
);
export const Services = (props: HomeCardProps): JSX.Element => (
  <HomeSection {...props} presentation="services" />
);
export const Account = (props: HomeCardProps): JSX.Element => (
  <HomeSection {...props} presentation="account" />
);
export const Benefits = (props: HomeCardProps): JSX.Element => (
  <HomeSection {...props} presentation="benefits" />
);
export const News = (props: HomeCardProps): JSX.Element => (
  <HomeSection {...props} presentation="news" />
);
