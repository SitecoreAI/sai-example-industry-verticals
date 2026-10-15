import type { JSX } from 'react';
import { Image, Link, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { nativeMediaSource } from 'lib/native-media';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';

export type SiteFooterProps = ComponentProps & {
  fields?: {
    Logo?: ImageField;
    Address?: Field<string>;
    Phone?: LinkField;
    ContactLink?: LinkField;
    AccountLink?: LinkField;
    PrivacyLink?: LinkField;
    TermsLink?: LinkField;
    Copyright?: Field<string>;
  };
};

export const Default = ({ fields, params }: SiteFooterProps): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  return (
    <footer
      className={['component', 'westfield-footer', params.GridParameters, params.styles]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className="component-content westfield-footer__inner">
        <div className="westfield-footer__main">
          <div className="westfield-footer__brand">
            <Image
              className="westfield-footer__logo"
              field={fields?.Logo}
              {...nativeMediaSource(fields?.Logo)}
              width={210}
              height={41}
            />
            <address className="westfield-footer__address">
              <RichText field={fields?.Address} />
            </address>
            {fields?.Phone ? (
              <Link
                className="westfield-footer__phone"
                field={fields.Phone}
                {...(typeof fields.Phone.value.url === 'string' &&
                fields.Phone.value.url.startsWith('tel:')
                  ? { href: fields.Phone.value.url }
                  : {})}
              />
            ) : null}
          </div>
          <nav className="westfield-footer__service-nav" aria-label="Contact and account">
            <ul className="westfield-footer__links">
              {fields?.ContactLink ? (
                <li>
                  <Link field={fields.ContactLink} />
                </li>
              ) : null}
              {fields?.AccountLink ? (
                <li>
                  <Link
                    field={fields.AccountLink}
                    {...campaignLoginProps(fields.AccountLink, campaignQuery)}
                  />
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
        <div className="westfield-footer__legal">
          <Text tag="p" className="westfield-footer__copyright" field={fields?.Copyright} />
          <nav aria-label="Legal">
            <ul className="westfield-footer__links westfield-footer__legal-links">
              {fields?.PrivacyLink ? (
                <li>
                  <Link field={fields.PrivacyLink} />
                </li>
              ) : null}
              {fields?.TermsLink ? (
                <li>
                  <Link field={fields.TermsLink} />
                </li>
              ) : null}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
