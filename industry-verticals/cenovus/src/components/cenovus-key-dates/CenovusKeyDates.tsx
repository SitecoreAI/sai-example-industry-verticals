'use client';

import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  Link,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';

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

export const Default = (props: CenovusKeyDatesProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const items = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;
  const viewAll = props.fields?.data?.datasource?.viewAllLink;

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [pageIndex, totalPages]);

  const visibleItems = useMemo(() => {
    const start = pageIndex * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, pageIndex]);

  const goPrev = useCallback(() => {
    if (totalPages < 2) return;
    setPageIndex((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goNext = useCallback(() => {
    if (totalPages < 2) return;
    setPageIndex((p) => (p + 1) % totalPages);
  }, [totalPages]);

  if (!isEditing && items.length === 0) {
    return null;
  }

  const showPager = items.length > ITEMS_PER_PAGE;

  return (
    <section
      className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="container max-w-3xl py-10">
        {(sectionTitle?.jsonValue || isEditing) && (
          <h2 className="font-heading mb-8 text-xl font-semibold tracking-[0.12em] uppercase md:text-2xl">
            <Text field={sectionTitle?.jsonValue} />
          </h2>
        )}

        {!items.length && isEditing && (
          <p className="text-foreground-light mb-6 text-sm">Add Cenovus Key Date Item entries under this datasource.</p>
        )}

        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {visibleItems.map((row) => (
            <li className="py-5 first:pt-0 last:pb-0" key={row.id}>
              {(row.eventTitle?.jsonValue || isEditing) && (
                <p className="text-base font-medium leading-snug text-neutral-900">
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
              <Link
                field={viewAll?.jsonValue}
                className="inline-flex items-center text-sm font-semibold tracking-[0.12em] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
              />
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
