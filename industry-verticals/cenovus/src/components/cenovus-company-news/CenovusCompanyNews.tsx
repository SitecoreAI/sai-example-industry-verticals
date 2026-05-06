import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  Link,
  LinkField,
  RichText as ContentSdkRichText,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { JSX } from 'react';

interface CompanyNewsItem {
  id: string;
  newsDate: { jsonValue: Field<string> };
  location: { jsonValue: Field<string> };
  headline: { jsonValue: Field<string> };
  summary: { jsonValue: RichTextField };
  author: { jsonValue: Field<string> };
}

interface Fields {
  data: {
    datasource: {
      children: {
        results: CompanyNewsItem[];
      };
      title?: IGQLTextField;
      seeAllLink?: {
        jsonValue: LinkField;
      };
    };
  };
}

type CenovusCompanyNewsProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: CenovusCompanyNewsProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const items = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;
  const seeAll = props.fields?.data?.datasource?.seeAllLink;

  if (!isEditing && items.length === 0) {
    return null;
  }

  return (
    <section
      className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="container py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 lg:gap-x-16">
          <header className="lg:col-span-4 xl:col-span-3">
            {(sectionTitle?.jsonValue || isEditing) && (
              <h2 className="font-heading text-2xl font-semibold tracking-[0.12em] uppercase md:text-3xl">
                <Text field={sectionTitle?.jsonValue} />
              </h2>
            )}
            {(seeAll?.jsonValue?.value?.href || isEditing) && (
              <div className="mt-6">
                {seeAll?.jsonValue ? (
                  <Link
                    field={seeAll.jsonValue}
                    className="inline-flex items-center text-sm font-semibold tracking-[0.12em] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                  />
                ) : isEditing ? (
                  <p className="text-foreground-light text-sm">
                    Configure the See All link on the datasource.
                  </p>
                ) : null}
              </div>
            )}
          </header>

          <div className="lg:col-span-8 xl:col-span-9">
            {!items.length && isEditing && (
              <p className="text-foreground-light text-sm">
                Add Cenovus Company News Item entries under this datasource.
              </p>
            )}
            <ul className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
              {items.map((item) => {
                const hasDate = Boolean(item.newsDate?.jsonValue?.value);
                const hasLocation = Boolean(item.location?.jsonValue?.value);
                const showMeta = hasDate || hasLocation || isEditing;
                const showSep =
                  (hasDate && hasLocation) ||
                  (isEditing && (item.newsDate?.jsonValue || item.location?.jsonValue));

                return (
                  <li className="flex flex-col" key={item.id}>
                    {showMeta && (
                      <div className="text-foreground-light flex flex-wrap items-baseline gap-x-2 text-sm">
                        {(hasDate || isEditing) && (
                          <span>
                            <Text field={item.newsDate?.jsonValue} />
                          </span>
                        )}
                        {showSep && <span className="text-neutral-300">·</span>}
                        {(hasLocation || isEditing) && (
                          <span>
                            <Text field={item.location?.jsonValue} />
                          </span>
                        )}
                      </div>
                    )}

                    {(item.headline?.jsonValue || isEditing) && (
                      <h3
                        className={`font-heading text-lg leading-snug font-semibold text-neutral-900 md:text-xl ${showMeta ? 'mt-2' : ''}`}
                      >
                        <Text field={item.headline?.jsonValue} />
                      </h3>
                    )}

                    {(item.summary?.jsonValue || isEditing) && (
                      <div className="text-foreground-light mt-3 line-clamp-4 text-sm leading-relaxed md:text-base [&_p]:mb-2 [&_p:last-child]:mb-0">
                        <ContentSdkRichText field={item.summary?.jsonValue} />
                      </div>
                    )}

                    {(item.author?.jsonValue?.value || isEditing) && (
                      <p className="text-foreground-light mt-4 text-sm">
                        <Text field={item.author?.jsonValue} />
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
