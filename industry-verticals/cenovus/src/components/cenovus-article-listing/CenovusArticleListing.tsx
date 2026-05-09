'use client';

import { IGQLTextField } from '@/types/igql';
import { demoArticleListingCategories, demoArticleListingItems } from '@/lib/cenovus-demo';
import { ComponentProps } from 'lib/component-props';
import {
  RichText as ContentSdkRichText,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import NextLink from 'next/link';
import React, { JSX, useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

type SortOrder = 'newest' | 'oldest';

interface ListingDatasource {
  heading?: IGQLTextField;
  intro?: { jsonValue: RichTextField };
}

interface Fields {
  data?: {
    datasource?: ListingDatasource;
  };
}

type MergedFields = Fields & { datasource?: ListingDatasource };

function formatListDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

const defaultCategoryState: Record<string, boolean> = Object.fromEntries(
  demoArticleListingCategories.map((c) => [c, true])
) as Record<string, boolean>;

type CenovusArticleListingProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CenovusArticleListingProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const merged = (props.fields ?? props.rendering?.fields) as MergedFields | undefined;
  const ds = merged?.data?.datasource ?? merged?.datasource;

  const heading = ds?.heading;
  const intro = ds?.intro;
  const introField: RichTextField = intro?.jsonValue ?? ({} as RichTextField);

  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoryEnabled, setCategoryEnabled] = useState(defaultCategoryState);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, categoryEnabled]);

  const processed = useMemo(() => {
    const enabledCats = new Set(
      demoArticleListingCategories.filter((c) => categoryEnabled[c] !== false)
    );
    const filtered = demoArticleListingItems.filter((row) => enabledCats.has(row.category));
    const dir = sortOrder === 'newest' ? -1 : 1;
    return [...filtered].sort(
      (a, b) => (new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()) * dir
    );
  }, [sortOrder, categoryEnabled]);

  const pageCount =
    processed.length === 0 ? 0 : Math.max(1, Math.ceil(processed.length / PAGE_SIZE));

  useEffect(() => {
    if (pageCount === 0) {
      return;
    }
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processed.slice(start, start + PAGE_SIZE);
  }, [processed, currentPage]);

  const showIntro = isEditing || Boolean(introField?.value);

  return (
    <section
      className={`cenovus-article-listing font-body text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="w-full px-[20px] py-10 md:py-14">
        <h1 className="font-heading mb-3 text-3xl font-semibold tracking-tight text-[var(--color-brand-teal)] md:text-4xl">
          {heading?.jsonValue?.value || isEditing ? (
            <Text field={heading?.jsonValue} />
          ) : (
            'Articles & updates'
          )}
        </h1>

        {showIntro ? (
          <div className="text-foreground-light mb-8 max-w-3xl text-base [&_a]:text-[var(--color-accent)]">
            <ContentSdkRichText field={introField} />
          </div>
        ) : null}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="text-foreground inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm font-medium shadow-sm transition hover:border-[var(--color-brand-teal)]/50 hover:bg-[var(--color-background-muted)]/40"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <ListFilter className="size-4 text-[var(--color-brand-teal)]" aria-hidden />
              Filters
            </button>
            <label className="sr-only" htmlFor={id ? `${id}-sort` : 'cenovus-article-sort'}>
              Sort order
            </label>
            <select
              id={id ? `${id}-sort` : 'cenovus-article-sort'}
              className="text-foreground rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm shadow-sm focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-brand-teal)]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          <p className="text-foreground-light text-sm tabular-nums">
            {processed.length} stories
            {pageCount > 1 ? ` · Page ${currentPage} of ${pageCount}` : null}
            {pageCount === 0 ? ' · Adjust filters to see stories' : null}
          </p>
        </div>

        {filtersOpen ? (
          <div
            className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-muted)]/30 p-4"
            role="region"
            aria-label="Filter by category"
          >
            <p className="text-foreground-light mb-3 text-xs font-semibold tracking-wide uppercase">
              Category
            </p>
            <ul className="flex flex-wrap gap-3">
              {demoArticleListingCategories.map((cat) => (
                <li key={cat}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-[var(--color-border)]"
                      checked={categoryEnabled[cat] !== false}
                      onChange={() =>
                        setCategoryEnabled((prev) => ({ ...prev, [cat]: !prev[cat] }))
                      }
                    />
                    {cat}
                  </label>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="text-foreground-light mt-4 text-xs font-medium underline-offset-2 hover:underline"
              onClick={() => setCategoryEnabled({ ...defaultCategoryState })}
            >
              Select all
            </button>
          </div>
        ) : null}

        {processed.length === 0 ? (
          <p className="text-foreground-light rounded-xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-sm">
            No stories match the filters. Turn categories back on or click Select all.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {pageItems.map((item) => (
              <li key={item.id} className="py-5">
                <article className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground-light mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className="rounded-full bg-[var(--color-background-muted)] px-2 py-0.5 font-semibold tracking-wide uppercase">
                        {item.category}
                      </span>
                      <time className="tabular-nums" dateTime={item.dateIso}>
                        {formatListDate(item.dateIso)}
                      </time>
                    </div>
                    <h2 className="font-heading text-lg font-semibold text-[var(--color-foreground)]">
                      <NextLink
                        href={item.href}
                        className="hover:text-[var(--color-brand-teal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-teal)]"
                      >
                        {item.title}
                      </NextLink>
                    </h2>
                    <p className="text-foreground-light mt-1 text-sm leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 ? (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Pagination"
          >
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-[var(--color-border)] px-2 py-2 text-sm disabled:pointer-events-none disabled:opacity-40"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`min-w-10 rounded-lg border px-3 py-2 text-sm tabular-nums transition ${
                  p === currentPage
                    ? 'border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/10 font-semibold text-[var(--color-brand-teal)]'
                    : 'border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-brand-teal)]/40'
                }`}
                aria-current={p === currentPage ? 'page' : undefined}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-[var(--color-border)] px-2 py-2 text-sm disabled:pointer-events-none disabled:opacity-40"
              disabled={currentPage >= pageCount}
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        ) : null}

        <p className="text-foreground-light mt-8 text-center text-xs">
          Demo listing: sample stories only. Wire Sitecore search or folder queries to replace this
          grid.
        </p>
      </div>
    </section>
  );
};
