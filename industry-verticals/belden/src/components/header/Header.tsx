import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <div className={`component header bg-background ${styles}`} id={id}>
      <div className="relative container grid grid-cols-[auto_1fr_auto] items-center gap-x-3 py-4 lg:gap-x-6 has-[.header-right_.component.language-switcher]:[&_.header-left_.component.language-switcher]:hidden">
        <div className="header-left z-10 col-start-1 row-start-1 shrink-0 [&_.component.image_img]:h-8 [&_.component.image_img]:w-auto lg:[&_.component.image_img]:h-10 [&_.component.language-switcher]:absolute [&_.component.language-switcher]:top-1/2 [&_.component.language-switcher]:right-0 [&_.component.language-switcher]:z-20 [&_.component.language-switcher]:-translate-y-1/2">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="header-nav z-0 col-start-2 row-start-1 flex min-w-0 justify-center">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="header-right z-10 col-start-3 row-start-1 flex shrink-0 justify-end [&_.component.language-switcher~.component.language-switcher]:hidden">
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
