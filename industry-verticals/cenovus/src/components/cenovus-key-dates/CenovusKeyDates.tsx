'use client';

import { IGQLTextField } from '@/types/igql';
import { demoKeyDates, shouldShowCenovusDemo } from '@/lib/cenovus-demo';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  Link,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import React, { JSX, useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 7;

interface KeyDateItem {
  id: string;
  eventTitle: { jsonValue: Field<string> };
  eventDate: { jsonValue: Field<string> };
}

interface Fields {
  data: {
    datasource: {
      children: {
        results: KeyDateItem[];
      };
      title?: IGQLTextField;
      viewAllLabel?: IGQLTextField;
      viewAllLink?: {
        jsonValue: LinkField;
      };
    };
  };
}

type CenovusKeyDatesProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: CenovusKeyDatesProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const items = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;
  const viewAllLabel = props.fields?.data?.datasource?.viewAllLabel;
  const viewAll = props.fields?.data?.datasource?.viewAllLink;
  const viewAllLinkJson = viewAll?.jsonValue;
  const viewAllLinkField: LinkField = viewAllLinkJson ?? ({ value: {} } as LinkField);

  const showDemo = shouldShowCenovusDemo(isEditing);

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [pageIndex, totalPages]);

  const start = pageIndex * ITEMS_PER_PAGE;
  const visibleItems = items.slice(start, start + ITEMS_PER_PAGE);

  const goPrev = useCallback(() => {
    if (totalPages < 2) return;
    setPageIndex((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goNext = useCallback(() => {
    if (totalPages < 2) return;
    setPageIndex((p) => (p + 1) % totalPages);
  }, [totalPages]);

  if (!isEditing && items.length === 0 && !showDemo) {
    return null;
  }

  const showPager = items.length > ITEMS_PER_PAGE;

  if (showDemo) {
    return (
      <section
        className={`cenovus-key-dates font-body bg-background text-foreground ${props.params.styles || ''}`}
        id={id || undefined}
      >
        <div className="w-full py-0">
          <div className="cenovus-homepage-panel">
            <h2 className="font-heading mb-6 shrink-0 text-xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:text-2xl">
              {sectionTitle?.jsonValue?.value || isEditing ? (
                <Text field={sectionTitle?.jsonValue} />
              ) : (
                'Key dates'
              )}
            </h2>
            <ul className="min-h-0 flex-1 divide-y divide-[var(--color-border)] border-b border-[var(--color-border)]">
              {demoKeyDates.map((row) => (
                <li className="py-4 first:pt-0 last:pb-0" key={row.id}>
                  <p className="text-base leading-snug font-medium text-[var(--color-foreground)]">
                    {row.title}
                  </p>
                  <p className="text-foreground-light mt-1 text-sm">{row.date}</p>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              {viewAll?.jsonValue?.value?.href ? (
                <Link
                  field={viewAll.jsonValue}
                  className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                />
              ) : (
                <NextLink
                  href="#"
                  className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                >
                  {viewAllLabel?.jsonValue?.value ?? 'View all dates'}
                </NextLink>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`cenovus-key-dates font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="w-full py-0">
        <div className="cenovus-homepage-panel">
          {(sectionTitle?.jsonValue || isEditing) && (
            <h2 className="font-heading mb-6 shrink-0 text-xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:text-2xl">
              <Text field={sectionTitle?.jsonValue} />
            </h2>
          )}

          <ul className="min-h-0 flex-1 divide-y divide-[var(--color-border)] border-b border-[var(--color-border)]">
            {visibleItems.map((row) => (
              <li className="py-4 first:pt-0 last:pb-0" key={row.id}>
                {(row.eventTitle?.jsonValue || isEditing) && (
                  <p className="text-base leading-snug font-medium text-[var(--color-foreground)]">
                    <Text field={row.eventTitle?.jsonValue} />
                  </p>
                )}
                {(row.eventDate?.jsonValue?.value || isEditing) && (
                  <p className="text-foreground-light mt-1 text-sm">
                    <Text field={row.eventDate?.jsonValue} />
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
            {(viewAll?.jsonValue || viewAllLabel?.jsonValue || isEditing) && (
              <div className="flex flex-col gap-1">
                {(viewAllLinkJson || isEditing) && (
                  <Link
                    field={viewAllLinkField}
                    className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                  />
                )}
                {(viewAllLabel?.jsonValue || isEditing) && !viewAllLinkJson?.value?.href && (
                  <span className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4">
                    <Text field={viewAllLabel?.jsonValue} />
                  </span>
                )}
              </div>
            )}

            {showPager && (
              <div className="flex items-center gap-0 self-start bg-white px-1 py-1 text-neutral-900 shadow-sm sm:self-auto">
                <button
                  type="button"
                  className="px-3 py-2 text-lg leading-none hover:bg-neutral-100"
                  aria-label="Previous page"
                  onClick={goPrev}
                >
                  ‹
                </button>
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  className="px-3 py-2 text-lg leading-none hover:bg-neutral-100"
                  aria-label="Next page"
                  onClick={goNext}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
