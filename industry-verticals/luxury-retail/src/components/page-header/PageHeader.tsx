import React, { JSX } from 'react';
import {
  RichText,
  RichTextField,
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface PageHeaderDatasource {
  pageTitle?: { jsonValue?: TextField };
  pageContent?: { jsonValue?: RichTextField };
}

interface Fields {
  'Page Title'?: TextField;
  'Page Content'?: RichTextField;
  PageTitle?: TextField;
  PageContent?: RichTextField;
  data?: {
    datasource?: PageHeaderDatasource | null;
  };
}

type PageContentProps = ComponentProps & {
  fields: Fields;
};

function flatPageTitle(fields: Fields | undefined): TextField | undefined {
  return fields?.['Page Title'] ?? fields?.PageTitle;
}

function flatPageContent(fields: Fields | undefined): RichTextField | undefined {
  return fields?.['Page Content'] ?? fields?.PageContent;
}

function resolvePageHeaderFields(fields: Fields | undefined): {
  title: TextField | undefined;
  content: RichTextField | undefined;
} {
  const ds = fields?.data?.datasource;
  return {
    title: ds?.pageTitle?.jsonValue ?? flatPageTitle(fields),
    content: ds?.pageContent?.jsonValue ?? flatPageContent(fields),
  };
}

export const Default = ({ params, fields, rendering }: PageContentProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = params;

  const { title, content } = resolvePageHeaderFields(fields);
  const searchbarPlaceholderKey = `page-header-searchbar-${params.DynamicPlaceholderId}`;

  return (
    <section className={`component page-header py-18 ${styles}`} id={id}>
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-8 lg:col-span-3">
            <h2>
              <Text field={title} />
            </h2>
            <div className="text-lg">
              <RichText field={content} />
            </div>
          </div>
          <div className="max-lg:order-last">
            <Placeholder name={searchbarPlaceholderKey} rendering={rendering} />
          </div>
        </div>
      </div>
    </section>
  );
};
