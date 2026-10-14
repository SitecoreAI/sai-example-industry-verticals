import type { JSX } from 'react';
import { Image, Link } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';

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

const MainLinks = ({ fields }: { fields?: SiteHeaderFields }): JSX.Element => (
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
          <Link className="westfield-header__main-link" field={field} />
        </li>
      ) : null;
    })}
  </ul>
);

const UtilityLinks = ({ fields }: { fields?: SiteHeaderFields }): JSX.Element => (
  <ul className="westfield-header__links">
    {(['AccountLink', 'ClaimsLink', 'AgentLink', 'BillingLink', 'ContactLink'] as const).map(
      (name) => {
        const field = fields?.[name];
        return field ? (
          <li key={name}>
            <Link className="westfield-header__utility-link" field={field} />
          </li>
        ) : null;
      }
    )}
  </ul>
);

export const Default = ({ fields, params }: SiteHeaderProps): JSX.Element => (
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
          <UtilityLinks fields={fields} />
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
                  width={288}
                  height={56}
                />
              </Link>
            ) : (
              <Image
                className="westfield-header__logo"
                field={fields?.Logo}
                width={288}
                height={56}
              />
            )}
          </div>
          <nav className="westfield-header__desktop-nav" aria-label="Main navigation">
            <MainLinks fields={fields} />
          </nav>
          <details className="westfield-header__mobile-menu">
            <summary className="westfield-header__menu-toggle">Main navigation</summary>
            <nav className="westfield-header__mobile-main" aria-label="Main navigation">
              <MainLinks fields={fields} />
            </nav>
            <nav className="westfield-header__mobile-utility" aria-label="Customer services">
              <UtilityLinks fields={fields} />
            </nav>
          </details>
        </div>
      </div>
    </div>
  </header>
);
