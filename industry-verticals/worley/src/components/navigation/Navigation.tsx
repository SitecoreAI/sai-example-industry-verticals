'use client';

import React from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { useStopResponsiveTransition } from '@/hooks/useStopResponsiveTransition';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import { getLinkContent, getLinkField, isNavRootItem, prepareFields } from '@/helpers/navHelpers';
import clsx from 'clsx';
import { isParamEnabled } from '@/helpers/isParamEnabled';

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: Array<NavItemFields>;
  Styles: string[];
}

interface NavigationListItemProps {
  fields: NavItemFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  logoSrc?: string;
  isSimpleLayout?: boolean;
}

export interface NavigationProps extends ComponentProps {
  fields: Record<string, NavItemFields>;
}

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  logoSrc,
  isSimpleLayout,
}) => {
  const { page } = useSitecore();

  const isRootItem = isNavRootItem(fields);
  const isLogoRootItem = isRootItem && logoSrc;

  return (
    <li
      tabIndex={0}
      role="menuitem"
      className={clsx(
        fields?.Styles?.join(' '),
        'relative flex flex-col gap-x-8 gap-y-4 xl:gap-x-14',
        isRootItem && 'lg:flex-row',
        isLogoRootItem && 'shrink-0 max-lg:hidden',
        isLogoRootItem && isSimpleLayout && 'lg:mr-auto'
      )}
    >
      <div className="">
        <Link
          field={getLinkField(fields)}
          editable={page.mode.isEditing}
          onClick={handleClick}
          className="navigation-item navigation-item-primary"
        >
          {getLinkContent(fields, logoSrc)}
        </Link>
      </div>
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id, Logo: logoImage, SimpleLayout: simpleLayout } = params;

  useStopResponsiveTransition();

  if (!Object.values(fields).some((v) => !!v)) {
    return (
      <div className={`component navigation ${styles}`} id={id}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleNavLinkClick = (event?: React.MouseEvent<HTMLElement>) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }
  };

  const isSimpleLayout = isParamEnabled(simpleLayout);
  const preparedFields = prepareFields(fields, !isSimpleLayout);
  const rootItem = Object.values(preparedFields).find((item) => isNavRootItem(item));
  const logoSrc = extractMediaUrl(logoImage);
  const hasLogoRootItem = rootItem && logoSrc;

  const navigationItems = Object.values(preparedFields)
    .filter((item): item is NavItemFields => !!item)
    .map((item) => (
      <NavigationListItem
        key={item.Id}
        fields={item}
        handleClick={handleNavLinkClick}
        logoSrc={logoSrc}
        isSimpleLayout={!!isSimpleLayout}
      />
    ));

  return (
    <div className={`component navigation ${styles}`} id={id}>
      {logoSrc && (
        <img
          src={logoSrc}
          alt={'logo'}
          className="mb-18 hidden h-auto w-36 [.drawer-content_&]:block"
        />
      )}

      <nav>
        <ul
          role="menubar"
          className={clsx(
            'container flex flex-row items-center gap-x-6 gap-y-4 text-lg lg:justify-center [.component.header_&]:px-0 [.drawer-content_&]:flex-col [.drawer-content_&]:items-start [.drawer-content_&]:px-0',
            isSimpleLayout && !hasLogoRootItem && 'lg:justify-end'
          )}
        >
          {navigationItems}
        </ul>
      </nav>
    </div>
  );
};
