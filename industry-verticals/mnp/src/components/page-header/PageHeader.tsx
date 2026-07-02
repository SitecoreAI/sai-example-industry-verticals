import React, { JSX } from 'react';
import {
  RichText,
  useSitecore,
  RichTextField,
  TextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Title: TextField;
  Content: RichTextField;
}

type PageContentProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: PageContentProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  const title = fields?.Title ?? (page.layout.sitecore.route?.fields?.Title as TextField);
  const content = fields?.Content ?? (page.layout.sitecore.route?.fields?.Content as RichTextField);

  return (
    <section className={`component page-header py-18 ${styles}`} id={id}>
      <div className="container">
        <div className="max-w-4xl space-y-8">
          <h2>
            <Text field={title} />
          </h2>
          <div className="text-lg">
            <RichText field={content} />
          </div>
        </div>
      </div>
    </section>
  );
};
