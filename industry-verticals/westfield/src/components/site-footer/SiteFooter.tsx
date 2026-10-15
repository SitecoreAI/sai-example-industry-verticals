import { Fragment, useId, useState } from 'react';
import type { ComponentProps as ReactComponentProps, JSX } from 'react';
import { Image, Link, RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import type { HeaderMenuItem } from 'components/site-header/SiteHeader';
import { nativeMediaSource } from 'lib/native-media';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';
import { AgentFinder } from 'lib/agent-finder';
import { BackToTopIcon, Caret, LocationIcon, MailIcon, PhoneIcon } from 'lib/westfield-icons';

const NativeLink = ({
  field,
  ...props
}: Omit<ReactComponentProps<typeof Link>, 'field'> & { field?: LinkField }): JSX.Element | null =>
  field ? <Link field={field} {...props} /> : null;

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
    ProductsTitle?: Field<string>;
    CompanyTitle?: Field<string>;
    ConnectTitle?: Field<string>;
    ProductsLinks?: HeaderMenuItem[];
    CompanyLinks?: HeaderMenuItem[];
    ConnectLinks?: HeaderMenuItem[];
    SocialLinks?: HeaderMenuItem[];
    LegalLinks?: HeaderMenuItem[];
    LegalBody?: Field<string>;
  };
};

export const Default = ({ fields, params }: SiteFooterProps): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  const uid = useId().replace(/:/g, '');
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
  const groups = [
    { title: fields?.ProductsTitle, links: fields?.ProductsLinks },
    { title: fields?.CompanyTitle, links: fields?.CompanyLinks },
    { title: fields?.ConnectTitle, links: fields?.ConnectLinks },
  ];

  return (
    <footer
      className={[
        'component',
        'wf-source',
        'footer_footer__jKVF3',
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
            <div className="footer_footerLogo__M4GzX">
              <Image field={fields?.Logo} {...nativeMediaSource(fields?.Logo)} loading="lazy" />
            </div>
            <div className="footer_top__1_q94">
              <div className="footer_innerTop__dHYfe">
                <div className="footer-location_location__CC6pk">
                  <LocationIcon />
                  <RichText field={fields?.Address} />
                </div>
                <div className="footer-contact_contact__xQMzZ">
                  <div className="footer-contact_contactLine__0pY8d">
                    <PhoneIcon />
                    <NativeLink
                      field={fields?.Phone}
                      {...(typeof fields?.Phone?.value?.url === 'string' &&
                      fields.Phone.value.url.startsWith('tel:')
                        ? { href: fields.Phone.value.url }
                        : {})}
                    />
                  </div>
                  <div className="footer-contact_contactLine__0pY8d">
                    <MailIcon />
                    <NativeLink field={fields?.ContactLink} />
                  </div>
                  <ul className="footer-social_list__zwe15">
                    {fields?.SocialLinks?.map((item) => (
                      <li key={item.id} className="footer-social_item___Pwkm">
                        <NativeLink field={item.fields?.Link}>
                          <Image
                            field={item.fields?.Image}
                            {...nativeMediaSource(item.fields?.Image)}
                            loading="lazy"
                          />
                        </NativeLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <nav className="footer_navigation__kvCNN" aria-label="Footer navigation">
                {groups.map((group, index) => (
                  <div className="footer_linksBlock__XWPFf" key={index}>
                    <h2 className="footer_navTitleHeader__9Xg12 wf-source-footer__mobile-title">
                      <button
                        className={`footer_navTitle__Ghv4Z ${expandedGroups[index] ? 'open' : ''}`}
                        type="button"
                        aria-expanded={!!expandedGroups[index]}
                        aria-controls={`${uid}-footer-${index}`}
                        onClick={() =>
                          setExpandedGroups((previous) => ({
                            ...previous,
                            [index]: !previous[index],
                          }))
                        }
                      >
                        <Text field={group.title} />
                        <Caret width="12" height="8" className="" />
                      </button>
                    </h2>
                    <ul
                      id={`${uid}-footer-${index}`}
                      className={expandedGroups[index] ? 'show' : ''}
                    >
                      <li className="wf-source-footer__desktop-title">
                        <Text tag="h2" className="footer_navTitle__Ghv4Z" field={group.title} />
                      </li>
                      {group.links?.map((item) => (
                        <li key={item.id}>
                          <NativeLink
                            field={item.fields?.Link}
                            {...campaignLoginProps(item.fields?.Link, campaignQuery)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
            <div className="footer_bottom__U3_so">
              <AgentFinder placement="footer" />
              <div className="footer-links_links__BVBK5">
                <Text tag="span" field={fields?.Copyright} />
                {fields?.LegalLinks?.map((item) => (
                  <Fragment key={item.id}>
                    <span className="footer-links_divider__VlpKt">|</span>
                    <NativeLink
                      className={['footer-links_link__Iwhry', item.fields?.Link?.value?.class]
                        .filter(Boolean)
                        .join(' ')}
                      field={item.fields?.Link}
                      {...campaignLoginProps(item.fields?.Link, campaignQuery)}
                    />
                  </Fragment>
                ))}
              </div>
              <RichText className="footer_legalDisclaimer__CBnxc" field={fields?.LegalBody} />
            </div>
          </div>
        </div>
      </div>
      <button
        className="scroll-to-top_scrollTop__KFxgB"
        type="button"
        aria-label="Back to top"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
          })
        }
      >
        <BackToTopIcon />
      </button>
    </footer>
  );
};
