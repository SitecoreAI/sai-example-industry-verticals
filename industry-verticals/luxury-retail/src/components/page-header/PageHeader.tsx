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
  pageTitle?: { jsonValue?: TextField } | TextField;
  pageContent?: { jsonValue?: RichTextField } | RichTextField;
}

interface Fields {
  'Page Title'?: TextField;
  'Page Content'?: RichTextField;
  PageTitle?: TextField;
  PageContent?: RichTextField;
  pageTitle?: TextField;
  pageContent?: RichTextField;
  data?: Record<string, unknown> | null;
}

type PageContentProps = ComponentProps & {
  fields: Fields;
};

function unwrapTextField(
  raw: { jsonValue?: TextField } | TextField | undefined | null,
): TextField | undefined {
  if (raw == null) return undefined;
  if (typeof raw === 'object' && 'jsonValue' in raw && raw.jsonValue != null) {
    return raw.jsonValue;
  }
  if (typeof raw === 'object' && 'value' in raw) {
    return raw as TextField;
  }
  return undefined;
}

function unwrapRichTextField(
  raw: { jsonValue?: RichTextField } | RichTextField | undefined | null,
): RichTextField | undefined {
  if (raw == null) return undefined;
  if (typeof raw === 'object' && 'jsonValue' in raw && raw.jsonValue != null) {
    return raw.jsonValue;
  }
  if (typeof raw === 'object' && 'value' in raw) {
    return raw as RichTextField;
  }
  return undefined;
}

function getPageHeaderDatasource(fields: Fields | undefined): PageHeaderDatasource | null {
  const data = fields?.data;
  if (!data || typeof data !== 'object') return null;

  const direct = data.datasource;
  if (direct && typeof direct === 'object') {
    return direct as PageHeaderDatasource;
  }

  for (const key of Object.keys(data)) {
    const block = data[key];
    if (block && typeof block === 'object' && 'datasource' in block) {
      const ds = (block as { datasource: unknown }).datasource;
      if (ds && typeof ds === 'object') {
        return ds as PageHeaderDatasource;
      }
    }
  }
  return null;
}

function flatPageTitle(fields: Fields | undefined): TextField | undefined {
  return fields?.['Page Title'] ?? fields?.PageTitle ?? fields?.pageTitle;
}

function flatPageContent(fields: Fields | undefined): RichTextField | undefined {
  return fields?.['Page Content'] ?? fields?.PageContent ?? fields?.pageContent;
}

function resolvePageHeaderFields(fields: Fields | undefined): {
  title: TextField | undefined;
  content: RichTextField | undefined;
} {
  const ds = getPageHeaderDatasource(fields);
  return {
    title: unwrapTextField(ds?.pageTitle) ?? flatPageTitle(fields),
    content: unwrapRichTextField(ds?.pageContent) ?? flatPageContent(fields),
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
