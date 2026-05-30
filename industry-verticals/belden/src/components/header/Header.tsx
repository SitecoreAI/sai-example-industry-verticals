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
      <div className="container relative flex items-center gap-3 py-4 lg:gap-5">
        <div className="header-left z-10 shrink-0">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="header-nav flex min-w-0 flex-1 justify-center">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="header-right z-10 shrink-0">
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
      </div>
    </div>
  );
};
