import { useEffect, useId, useRef, useState } from 'react';
import type { ComponentProps as ReactComponentProps, JSX } from 'react';
import { Image, Link, Text } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { nativeMediaSource } from 'lib/native-media';
import { nativeLinkProps } from 'lib/native-link';
import { campaignLoginProps, useCampaignQuery } from 'lib/campaign-links';
import { Caret, Chevron, CloseIcon, MenuIcon, SearchIcon } from 'lib/westfield-icons';

export type HeaderMenuItem = {
  id: string;
  fields?: {
    Eyebrow?: Field<string>;
    Heading?: Field<string>;
    Link?: LinkField;
    Image?: ImageField;
  };
};
export type SiteHeaderFields = {
  Logo?: ImageField;
  HomeLink?: LinkField;
  BusinessLink?: LinkField;
  HomeAndAutoLink?: LinkField;
  AboutLink?: LinkField;
  CareersLink?: LinkField;
  PaperlessLink?: LinkField;
  AdviceLink?: LinkField;
  SearchLink?: LinkField;
  AccountLink?: LinkField;
  ClaimsLink?: LinkField;
  AgentLink?: LinkField;
  BillingLink?: LinkField;
  BecomeAgentLink?: LinkField;
  ContactLink?: LinkField;
  BusinessLinks?: HeaderMenuItem[];
  HomeAutoLinks?: HeaderMenuItem[];
  AboutLinks?: HeaderMenuItem[];
  CareersLinks?: HeaderMenuItem[];
};
export type SiteHeaderProps = ComponentProps & { fields?: SiteHeaderFields };
type MenuGroup = { marker?: HeaderMenuItem; links: HeaderMenuItem[] };

const NativeLink = ({
  field,
  ...props
}: Omit<ReactComponentProps<typeof Link>, 'field'> & { field?: LinkField }): JSX.Element | null =>
  field ? <Link field={field} {...nativeLinkProps(field)} {...props} /> : null;

/** Native marker items start columns; singleton link groups share the final column. */
function groupMenu(items: HeaderMenuItem[] = []): MenuGroup[][] {
  const groups: MenuGroup[] = [];
  for (const item of items) {
    const isStandaloneHeading = Boolean(
      item.fields?.Eyebrow?.value && item.fields.Heading?.value === item.fields.Eyebrow.value
    );
    if (item.fields?.Eyebrow?.value || !groups.length) {
      groups.push({ marker: item.fields?.Eyebrow?.value ? item : undefined, links: [] });
    }
    if (!isStandaloneHeading) groups[groups.length - 1].links.push(item);
  }
  const columns: MenuGroup[][] = [];
  const remaining: MenuGroup[] = [];
  for (const group of groups) {
    if (group.links.length && columns.length < 3) columns.push([group]);
    else remaining.push(group);
  }
  if (remaining.length) columns.push(remaining);
  return columns;
}

const SearchForm = ({ className = '' }: { className?: string }): JSX.Element => (
  <form className={`wf-source-search ${className}`} action="/search" method="get" role="search">
    <input type="search" name="q" aria-label="Search" placeholder="Search" required />
    <button type="submit" aria-label="Submit search">
      <SearchIcon />
    </button>
  </form>
);

export const Default = ({ fields, params }: SiteHeaderProps): JSX.Element => {
  const campaignQuery = useCampaignQuery();
  const uid = useId().replace(/:/g, '');
  const header = useRef<HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menus = [
    { field: fields?.BusinessLink, items: fields?.BusinessLinks },
    { field: fields?.HomeAndAutoLink, items: fields?.HomeAutoLinks },
    { field: fields?.AboutLink, items: fields?.AboutLinks },
    { field: fields?.CareersLink, items: fields?.CareersLinks },
  ];
  const closeMenus = (): void => {
    setMobileOpen(false);
    setOpenMenu(null);
    setOpenGroups({});
    setLoginOpen(false);
    setSearchOpen(false);
  };
  useEffect(() => {
    const closeOutside = (event: MouseEvent): void => {
      if (header.current && !header.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setOpenMenu(null);
        setLoginOpen(false);
        setSearchOpen(false);
      }
    };
    const closeWithEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setOpenMenu(null);
        setLoginOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('mousedown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, []);
  useEffect(() => {
    document.body.classList.toggle('wf-source-menu-open', mobileOpen);
    return () => document.body.classList.remove('wf-source-menu-open');
  }, [mobileOpen]);

  const utilityLinks = (): JSX.Element => (
    <>
      {(['ClaimsLink', 'AgentLink', 'BillingLink', 'BecomeAgentLink', 'ContactLink'] as const).map(
        (name) =>
          fields?.[name] ? (
            <NativeLink key={name} field={fields[name]} onClick={closeMenus} />
          ) : null
      )}
    </>
  );
  const login = (mobile = false): JSX.Element => (
    <div className={`header-login_loginWrap__JmSjy ${mobile ? 'wf-source-mobile-login' : ''}`}>
      <button
        className={`button_btn__V5_h7 button_primary__fehsi header-login_loginLink___r27_ ${mobile ? 'header_mobileLoginBtn__DWoFW' : ''} ${loginOpen ? 'open' : ''}`}
        type="button"
        aria-expanded={loginOpen}
        aria-controls={`${uid}-login-${mobile ? 'mobile' : 'desktop'}`}
        onClick={() => {
          setLoginOpen(!loginOpen);
          setOpenMenu(null);
          setSearchOpen(false);
        }}
      >
        Login
        <Caret className="" />
      </button>
      <div
        id={`${uid}-login-${mobile ? 'mobile' : 'desktop'}`}
        className={`header-login_dropdown__Lsfep ${loginOpen ? 'open' : ''}`}
      >
        <NativeLink field={fields?.AgentLink} onClick={closeMenus}>
          Agent
        </NativeLink>
        {fields?.AccountLink ? (
          <NativeLink
            field={fields.AccountLink}
            {...campaignLoginProps(fields.AccountLink, campaignQuery)}
            onClick={closeMenus}
          >
            Customer
          </NativeLink>
        ) : null}
      </div>
    </div>
  );
  const renderGroup = (group: MenuGroup, menuIndex: number, groupIndex: string): JSX.Element => {
    const marker = group.marker;
    const key = `${menuIndex}-${groupIndex}`;
    const expanded = !!openGroups[key];
    const markerLink =
      marker?.fields?.Heading?.value === marker?.fields?.Eyebrow?.value
        ? marker?.fields?.Link
        : undefined;
    const links = (mobile: boolean): JSX.Element[] =>
      group.links.map((item) => (
        <li className={mobile ? 'navigation_mobileSubNavLi__gBHhs' : undefined} key={item.id}>
          <NativeLink
            field={item.fields?.Link}
            {...campaignLoginProps(item.fields?.Link, campaignQuery)}
            onClick={closeMenus}
          />
        </li>
      ));
    return (
      <li className="navigation_categories__V2OF5" key={marker?.id || key}>
        <div className="navigation_mobileNavWrapper__dq3oO">
          {marker ? (
            <button
              className="navigation_catTitle__we_q8"
              type="button"
              aria-expanded={expanded}
              aria-controls={`${uid}-group-${key}`}
              onClick={() => setOpenGroups((previous) => ({ ...previous, [key]: !expanded }))}
            >
              <Text field={marker.fields?.Eyebrow} />
              <Caret
                width="12"
                height="8"
                className="navigation_arrow__p4kL1 navigation_mobileChevron__I7GRF"
              />
            </button>
          ) : null}
          <ul
            className={`navigation_mobileSubNav__pVaaD ${expanded || !marker ? 'a11y-nav-active' : ''}`}
            id={`${uid}-group-${key}`}
          >
            {markerLink?.value?.href ? (
              <li className="navigation_mobileSubNavLi__gBHhs">
                <NativeLink
                  field={markerLink}
                  {...campaignLoginProps(markerLink, campaignQuery)}
                  onClick={closeMenus}
                >
                  <Text field={marker?.fields?.Eyebrow} />
                </NativeLink>
              </li>
            ) : null}
            {links(true)}
          </ul>
        </div>
        <ul className="navigation_desktopNavWrapper__8zCrc">
          {marker ? (
            <li className="navigation_catTitle__we_q8">
              {markerLink?.value?.href ? (
                <NativeLink
                  field={markerLink}
                  {...campaignLoginProps(markerLink, campaignQuery)}
                  onClick={closeMenus}
                >
                  <Text field={marker.fields?.Eyebrow} />
                </NativeLink>
              ) : (
                <Text field={marker.fields?.Eyebrow} />
              )}
            </li>
          ) : null}
          {links(false)}
        </ul>
      </li>
    );
  };

  return (
    <header
      ref={header}
      className={[
        'component',
        'wf-source',
        'header_header__v8u0o',
        params.GridParameters,
        params.styles,
      ]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <a className="focusable sr-only" href="#maincontent">
        Skip to Main Content
      </a>
      <div className="header_top__LRj6c">
        <div className="header_fullTabletWidthElement__XRzgj container">
          <div className="row header_fullTabletWidthElement__XRzgj">
            <div className="col header_topLinks___lzzn">
              {utilityLinks()}
              {login()}
            </div>
          </div>
        </div>
      </div>
      <div className="header_bottom__1gz_A">
        <div className="header_fullHeightElement__ptDZL header_fullTabletWidthElement__XRzgj container">
          <div className="row header_fullHeightElement__ptDZL header_fullTabletWidthElement__XRzgj">
            <div className="col header_bottomLinks__imp_j">
              <NativeLink
                className="header_darkLogo__tOqen"
                field={fields?.HomeLink}
                aria-label="Link to homepage"
                onClick={closeMenus}
              >
                <Image
                  field={fields?.Logo}
                  {...nativeMediaSource(fields?.Logo)}
                  width={288}
                  height={56}
                />
              </NativeLink>
              {login(true)}
              <nav
                className={`navigation_navigation__9vL7B ${mobileOpen ? 'a11y-nav-child-open' : ''}`}
                aria-label="Main navigation"
              >
                <button
                  type="button"
                  className="navigation_hamburgerButton__GoKSb"
                  aria-controls={`${uid}-nav`}
                  aria-expanded={mobileOpen}
                  onClick={() => {
                    setMobileOpen(!mobileOpen);
                    setOpenMenu(null);
                    setOpenGroups({});
                    setSearchOpen(false);
                    setLoginOpen(false);
                  }}
                >
                  <MenuIcon className="hamburger_svg__icon" />
                  <CloseIcon className="close_svg__icon" />
                  <span className="sr-only">Toggle navigation</span>
                </button>
                <div
                  id={`${uid}-nav`}
                  className={`navigation_nav__vv_jX ${mobileOpen ? 'a11y-nav-active' : ''}`}
                >
                  <div className="navigation_topLevelMenu__9vLUh">
                    <ul className="navigation_mobileMenuTop__2bjdg">
                      <li className="wf-source-mobile-search">
                        <SearchForm className="navigation_mobileMenuSearch__Qy3tU" />
                      </li>
                      {menus.map((menu, index) => {
                        const expanded = openMenu === index;
                        return (
                          <li
                            key={index}
                            className={`navigation_topLevelMenuLi__XVhWH ${expanded ? 'a11y-nav-child-open' : ''}`}
                          >
                            <button
                              className="navigation_item__qBtiV"
                              type="button"
                              aria-expanded={expanded}
                              aria-controls={`${uid}-menu-${index}`}
                              onClick={() => {
                                setOpenMenu(expanded ? null : index);
                                setLoginOpen(false);
                                setSearchOpen(false);
                              }}
                            >
                              <span className="navigation_navItemName__mpmrZ">
                                {menu.field?.value?.text}
                              </span>
                              <Caret className="navigation_arrow__p4kL1 navigation_desktopCaret__cGFs4" />
                              <Chevron className="navigation_arrow__p4kL1 navigation_mobileChevron__I7GRF" />
                            </button>
                            <ul
                              id={`${uid}-menu-${index}`}
                              className={`navigation_menu__Yw8jv ${expanded ? 'a11y-nav-active' : ''}`}
                            >
                              <li className="navigation_navMenuContainer__qhk1X">
                                <button
                                  type="button"
                                  className="navigation_backBtn__QNTTa"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <Chevron className="navigation_arrow__p4kL1 navigation_mobileChevron__I7GRF" />
                                  <span className="navigation_navItemBack__0rZD4">BACK</span>
                                </button>
                                <div className="navigation_navMenuTitle__PaC4W">
                                  {menu.field?.value?.text}
                                  <NativeLink
                                    field={menu.field}
                                    className="navigation_navMenuBtn__MK_zV"
                                    aria-label={menu.field?.value?.text}
                                    onClick={closeMenus}
                                  >
                                    <svg aria-hidden="true" viewBox="0 0 44 44" fill="none">
                                      <circle
                                        cx="22"
                                        cy="22"
                                        r="21"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      />
                                      <path
                                        fill="currentColor"
                                        d="m22 14-1.41 1.41L26.17 21H14v2h12.17l-5.58 5.59L22 30l8-8z"
                                      />
                                    </svg>
                                  </NativeLink>
                                </div>
                                <ul className="navigation_navMenuItems__nXgsd navigation_fourCol__L1GjC">
                                  {groupMenu(menu.items).map((column, columnIndex) => (
                                    <li key={columnIndex} className="wf-source-menu-column">
                                      <ul>
                                        {column.map((group, groupIndex) =>
                                          renderGroup(group, index, `${columnIndex}-${groupIndex}`)
                                        )}
                                      </ul>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="navigation_mobileMenuLinks__jIT9_">{utilityLinks()}</div>
                  </div>
                </div>
              </nav>
              <div className="header-search_toggleSearchContainer__sSYgx">
                <button
                  className="header-search_toggleSearch__NHjjW"
                  type="button"
                  aria-expanded={searchOpen}
                  aria-controls={`${uid}-search`}
                  aria-label="search"
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    setOpenMenu(null);
                    setLoginOpen(false);
                  }}
                >
                  <SearchIcon />
                </button>
                <div
                  id={`${uid}-search`}
                  className={`header-search_container__rXX8o ${searchOpen ? '' : 'header-search_hideSearchContainer__y7O8A'}`}
                >
                  <div className="header-search_title__UTCzn">Search</div>
                  <button
                    className="header-search_closeSearch__HCvlK"
                    type="button"
                    aria-label="close search"
                    onClick={() => setSearchOpen(false)}
                  >
                    <CloseIcon />
                  </button>
                  <SearchForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
