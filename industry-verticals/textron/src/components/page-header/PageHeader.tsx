import React, { JSX } from 'react';
import {
  RichText,
  RichTextField,
  TextField,
  Text,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

/**
 * Integrated GraphQL (ComponentQuery on the rendering) returns datasource fields here.
 * Prefer this over top-level `fields.Title` / `fields.Content`, which can reflect the
 * context page when placeholder datasource context is enabled on the rendering.
 */
interface PageHeaderDatasource {
  title?: { jsonValue?: TextField };
  content?: { jsonValue?: RichTextField };
}

interface Fields {
  Title?: TextField;
  Content?: RichTextField;
  data?: {
    datasource?: PageHeaderDatasource | null;
  };
}

type PageContentProps = ComponentProps & {
  fields: Fields;
};

function resolvePageHeaderFields(fields: Fields | undefined): {
  title: TextField | undefined;
  content: RichTextField | undefined;
} {
  const ds = fields?.data?.datasource;
  return {
    title: ds?.title?.jsonValue ?? fields?.Title,
    content: ds?.content?.jsonValue ?? fields?.Content,
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
