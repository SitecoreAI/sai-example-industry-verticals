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
  const viewAll = props.fields?.data?.datasource?.viewAllLink;

  const showDemo = shouldShowCenovusDemo(isEditing, items.length > 0);

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
        className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
        id={id || undefined}
      >
        <div className="container max-w-none py-10 lg:max-w-none">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 shadow-sm lg:p-8">
            <h2 className="font-heading mb-6 border-b border-[var(--color-brand-teal)]/30 pb-3 text-xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:text-2xl">
              Key dates
            </h2>
            <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {demoKeyDates.map((row) => (
                <li className="py-4 first:pt-0 last:pb-0" key={row.id}>
                  <p className="text-base leading-snug font-medium text-[var(--color-foreground)]">
                    {row.title}
                  </p>
                  <p className="text-foreground-light mt-1 text-sm">{row.date}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <NextLink
                href="#"
                className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
              >
                View all dates
              </NextLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="container max-w-3xl py-10">
        {(sectionTitle?.jsonValue || isEditing) && (
          <h2 className="font-heading mb-8 text-xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:text-2xl">
            <Text field={sectionTitle?.jsonValue} />
          </h2>
        )}

        {!items.length && isEditing && (
          <p className="text-foreground-light mb-6 text-sm">
            Add Cenovus Key Date Item entries under this datasource.
          </p>
        )}

        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {visibleItems.map((row) => (
            <li className="py-5 first:pt-0 last:pb-0" key={row.id}>
              {(row.eventTitle?.jsonValue || isEditing) && (
                <p className="text-base leading-snug font-medium text-neutral-900">
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

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {(viewAll?.jsonValue?.value?.href || isEditing) && (
            <div>
              {viewAll?.jsonValue ? (
                <Link
                  field={viewAll.jsonValue}
                  className="inline-flex items-center text-sm font-semibold tracking-[0.12em] text-[var(--color-accent)] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                />
              ) : isEditing ? (
                <p className="text-foreground-light text-sm">
                  Configure the View All link on the datasource.
                </p>
              ) : null}
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
    </section>
  );
};
