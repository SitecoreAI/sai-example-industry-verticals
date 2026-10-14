import { IGQLTextField } from '@/types/igql';
import { demoCompanyNews, shouldShowCenovusDemo } from '@/lib/cenovus-demo';
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
import Image from 'next/image';
import NextLink from 'next/link';
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
      seeAllLabel?: IGQLTextField;
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
  const seeAllLabel = props.fields?.data?.datasource?.seeAllLabel;
  const seeAll = props.fields?.data?.datasource?.seeAllLink;
  const seeAllLinkJson = seeAll?.jsonValue;
  const seeAllLinkField: LinkField = seeAllLinkJson ?? ({ value: {} } as LinkField);

  const showDemo = shouldShowCenovusDemo(isEditing);

  if (!isEditing && items.length === 0 && !showDemo) {
    return null;
  }

  if (showDemo) {
    return (
      <section
        className={`cenovus-company-news font-body text-foreground ${props.params.styles || ''}`}
        id={id || undefined}
      >
        <div className="w-full py-0">
          <div className="cenovus-homepage-panel">
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-12 xl:[grid-template-columns:minmax(0,1fr)_minmax(0,2fr)] xl:gap-14 xl:gap-x-16 [&>*]:min-w-0">
              <div className="flex h-full min-h-0 flex-col">
                <h2 className="font-heading text-2xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:text-3xl">
                  {sectionTitle?.jsonValue?.value || isEditing ? (
                    <Text field={sectionTitle?.jsonValue} />
                  ) : (
                    demoCompanyNews.title
                  )}
                </h2>
                <div className="mt-6">
                  {seeAll?.jsonValue?.value?.href ? (
                    <Link
                      field={seeAll.jsonValue}
                      className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                    />
                  ) : (
                    <NextLink
                      href="#"
                      className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                    >
                      {seeAllLabel?.jsonValue?.value ?? demoCompanyNews.seeAllLabel}
                    </NextLink>
                  )}
                </div>
              </div>

              <div className="flex h-full min-h-0 flex-col">
                <ul className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
                  {demoCompanyNews.items.map((item) => (
                    <li
                      className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm"
                      key={item.id}
                    >
                      <div className="relative aspect-[16/10] w-full shrink-0 bg-neutral-200">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-col p-5">
                        <div className="text-foreground-light flex flex-wrap items-baseline gap-x-2 text-sm">
                          <span>{item.date}</span>
                          <span className="text-neutral-300">·</span>
                          <span>{item.location}</span>
                        </div>
                        <h3 className="font-heading mt-2 text-lg leading-snug font-semibold text-[var(--color-foreground)] md:text-xl">
                          {item.headline}
                        </h3>
                        <div
                          className="text-foreground-light mt-3 line-clamp-4 text-sm leading-relaxed md:text-base [&_p]:mb-2 [&_p:last-child]:mb-0"
                          dangerouslySetInnerHTML={{ __html: item.summary }}
                        />
                        <p className="text-foreground-light mt-4 text-xs">{item.author}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`cenovus-company-news font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="w-full py-0">
        <div className="cenovus-homepage-panel">
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-12 xl:[grid-template-columns:minmax(0,1fr)_minmax(0,2fr)] xl:gap-14 xl:gap-x-16 [&>*]:min-w-0">
            <div className="flex h-full min-h-0 flex-col">
              {(sectionTitle?.jsonValue || isEditing) && (
                <h2 className="font-heading text-2xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:text-3xl">
                  <Text field={sectionTitle?.jsonValue} />
                </h2>
              )}
              {(seeAll?.jsonValue || seeAllLabel?.jsonValue || isEditing) && (
                <div className="mt-6 flex flex-col gap-1">
                  {(seeAllLinkJson || isEditing) && (
                    <Link
                      field={seeAllLinkField}
                      className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                    />
                  )}
                  {(seeAllLabel?.jsonValue || isEditing) && !seeAllLinkJson?.value?.href && (
                    <span className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4">
                      <Text field={seeAllLabel?.jsonValue} />
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex h-full min-h-0 flex-col">
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
      </div>
    </section>
  );
};
