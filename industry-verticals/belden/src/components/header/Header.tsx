import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;

  return (
    <div className={`component header bg-background relative z-50 ${styles}`} id={id}>
      <div className="relative container overflow-visible px-3 py-4 lg:px-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center overflow-visible">
          <div className="header-left z-10 justify-self-start">
            <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>
          <div className="header-nav relative z-20 flex justify-self-center overflow-visible">
            <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
          </div>
          <div className="header-right z-10 flex justify-self-end [&_.language-switcher~.language-switcher]:hidden">
            <Placeholder
              name={`header-right-${DynamicPlaceholderId}`}
              rendering={props.rendering}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
