import type { JSX } from 'react';
import { Image, Link } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { nativeMediaSource } from 'lib/native-media';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';

export type SiteHeaderFields = {
  Logo?: ImageField;
  HomeLink?: LinkField;
  BusinessLink?: LinkField;
  HomeAndAutoLink?: LinkField;
  AboutLink?: LinkField;
  CareersLink?: LinkField;
  PaperlessLink?: LinkField;
  AccountLink?: LinkField;
  ClaimsLink?: LinkField;
  AgentLink?: LinkField;
  BillingLink?: LinkField;
  ContactLink?: LinkField;
};

export type SiteHeaderProps = ComponentProps & {
  fields?: SiteHeaderFields;
};

type HeaderLinksProps = { fields?: SiteHeaderFields; campaignQuery: string };

const MainLinks = ({ fields, campaignQuery }: HeaderLinksProps): JSX.Element => (
  <ul className="westfield-header__links">
    {(
      [
        'HomeLink',
        'BusinessLink',
        'HomeAndAutoLink',
        'AboutLink',
        'CareersLink',
        'PaperlessLink',
      ] as const
    ).map((name) => {
      const field = fields?.[name];
      return field ? (
        <li key={name}>
          <Link
            className="westfield-header__main-link"
            field={field}
            {...campaignLoginProps(field, campaignQuery)}
          />
        </li>
      ) : null;
    })}
  </ul>
);

const UtilityLinks = ({ fields, campaignQuery }: HeaderLinksProps): JSX.Element => (
  <ul className="westfield-header__links">
    {(['AccountLink', 'ClaimsLink', 'AgentLink', 'BillingLink', 'ContactLink'] as const).map(
      (name) => {
        const field = fields?.[name];
        return field ? (
          <li key={name}>
            <Link
              className="westfield-header__utility-link"
              field={field}
              {...campaignLoginProps(field, campaignQuery)}
            />
          </li>
        ) : null;
      }
    )}
  </ul>
);

export const Default = ({ fields, params }: SiteHeaderProps): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  return (
    <header
      className={['component', 'westfield-header', params.GridParameters, params.styles]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className="component-content">
        <div className="westfield-header__utility">
          <nav className="westfield-header__utility-inner" aria-label="Customer services">
            <UtilityLinks fields={fields} campaignQuery={campaignQuery} />
          </nav>
        </div>
        <div className="westfield-header__main">
          <div className="westfield-header__main-inner">
            <div className="westfield-header__brand">
              {fields?.HomeLink ? (
                <Link className="westfield-header__brand-link" field={fields.HomeLink}>
                  <Image
                    className="westfield-header__logo"
                    field={fields?.Logo}
                    {...nativeMediaSource(fields?.Logo)}
                    width={288}
                    height={56}
                  />
                </Link>
              ) : (
                <Image
                  className="westfield-header__logo"
                  field={fields?.Logo}
                  {...nativeMediaSource(fields?.Logo)}
                  width={288}
                  height={56}
                />
              )}
            </div>
            <nav className="westfield-header__desktop-nav" aria-label="Main navigation">
              <MainLinks fields={fields} campaignQuery={campaignQuery} />
            </nav>
            <details className="westfield-header__mobile-menu">
              <summary className="westfield-header__menu-toggle">Main navigation</summary>
              <nav className="westfield-header__mobile-main" aria-label="Main navigation">
                <MainLinks fields={fields} campaignQuery={campaignQuery} />
              </nav>
              <nav className="westfield-header__mobile-utility" aria-label="Customer services">
                <UtilityLinks fields={fields} campaignQuery={campaignQuery} />
              </nav>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
};
