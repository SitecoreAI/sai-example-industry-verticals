import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, JSX } from 'react';
import Link from 'next/link';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import type { PublishedArticle } from 'lib/published-content';
import { nativeMediaSource } from 'lib/native-media';
import styles from 'src/assets/westfield-advice.module.css';

type ListingFields = { Title?: Field<string>; pageSummary?: Field<string> };
type ArticlesResponse = { articles?: PublishedArticle[] };
const PAGE_SIZE = 10;
const normalize = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const articleDate = (value: string): string => {
  if (!value) return '';
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : '';
};

export const Default = ({ params }: ComponentProps): JSX.Element => {
  const { page } = useSitecore();
  const fields = page.layout.sitecore.route?.fields as ListingFields | undefined;
  const id = useId();
  const filterToggle = useRef<HTMLButtonElement>(null);
  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [sort, setSort] = useState('relevancy');
  const [currentPage, setCurrentPage] = useState(1);
  const [facetsOpen, setFacetsOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    async function loadArticles(): Promise<void> {
      try {
        const response = await fetch('/api/articles', {
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Articles request failed');
        const result = (await response.json()) as ArticlesResponse;
        if (!Array.isArray(result.articles)) throw new Error('Invalid articles response');
        if (controller.signal.aborted) return;
        setArticles(result.articles);
        setStatus('ready');
      } catch {
        if (!controller.signal.aborted) setStatus('error');
      }
    }
    void loadArticles();
    return () => controller.abort();
  }, [attempt]);

  const availableTopics = [
    ...new Set(articles.map((article) => article.topic).filter(Boolean)),
  ].sort();
  const terms: string[] = normalize(query).match(/[a-z\d]+/g) ?? [];
  const filtered = articles
    .map((article) => {
      const title = normalize(article.title);
      const summary = normalize(article.summary);
      const content = `${title} ${summary} ${normalize(article.body)} ${normalize(article.topic)}`;
      const date = articleDate(article.publishedDate);
      const matches =
        terms.every((term) => content.includes(term)) &&
        (!topics.length || topics.includes(article.topic)) &&
        (!dates.start || (date !== '' && date >= dates.start)) &&
        (!dates.end || (date !== '' && date <= dates.end));
      const score = terms.reduce(
        (total, term) => total + (title.includes(term) ? 8 : summary.includes(term) ? 4 : 1),
        0
      );
      return { article, date, matches, score };
    })
    .filter((item) => item.matches)
    .sort(
      (first, second) =>
        (sort === 'newest' ? second.date.localeCompare(first.date) : second.score - first.score) ||
        first.article.title.localeCompare(second.article.title, 'en')
    );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const selectedPage = Math.min(currentPage, pageCount || 1);
  const firstIndex = (selectedPage - 1) * PAGE_SIZE;
  const visibleArticles = filtered.slice(firstIndex, firstIndex + PAGE_SIZE);
  const hasFilters = Boolean(query || topics.length || dates.start || dates.end);

  const search = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setQuery(input.trim());
    setCurrentPage(1);
  };
  const clearFilters = (): void => {
    setInput('');
    setQuery('');
    setTopics([]);
    setStartInput('');
    setEndInput('');
    setDates({ start: '', end: '' });
    setCurrentPage(1);
  };
  const closeFacets = (): void => {
    setFacetsOpen(false);
    filterToggle.current?.focus();
  };
  const pager = (position: string): JSX.Element | null => {
    if (pageCount <= 1) return null;
    const start = Math.max(1, Math.min(selectedPage - 1, pageCount - 2));
    const pages = Array.from({ length: Math.min(3, pageCount) }, (_, index) => start + index);
    return (
      <nav aria-label={`Article results pages ${position}`} className={styles.pager}>
        {selectedPage > 1 ? (
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => setCurrentPage(selectedPage - 1)}
          >
            ‹
          </button>
        ) : null}
        {pages.map((number) => (
          <button
            type="button"
            key={number}
            aria-label={`Page ${number}`}
            aria-current={number === selectedPage ? 'page' : undefined}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))}
        {selectedPage < pageCount ? (
          <button
            type="button"
            aria-label="Next page"
            onClick={() => setCurrentPage(selectedPage + 1)}
          >
            ›
          </button>
        ) : null}
      </nav>
    );
  };

  return (
    <section
      className={['component', styles.listing, params.GridParameters, params.styles]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className={styles.container}>
        <nav aria-label="breadcrumb" className={styles.breadcrumbNav}>
          <ol className={styles.breadcrumbs}>
            <li>
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
            </li>
            <li>
              <a href="#">About Us</a>
              <span aria-hidden="true">/</span>
            </li>
            <li aria-current="page">Articles</li>
          </ol>
        </nav>
        <div className={`${styles.row} ${styles.listingRow}`}>
          <aside
            className={`${styles.facets} ${facetsOpen ? styles.mobileOpen : ''}`}
            aria-label="Filter results"
            id={`${id}-facets`}
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeFacets();
            }}
          >
            <div className={styles.mobileFilterHeader}>
              <h2>Filter Results</h2>
              <button type="button" onClick={closeFacets} aria-label="Close filters">
                ×
              </button>
            </div>
            <div className={styles.facetStack}>
              <details className={styles.facet}>
                <summary>Article Tags</summary>
                <div className={styles.facetOptions}>
                  {availableTopics.map((topic) => (
                    <label key={topic}>
                      <input
                        type="checkbox"
                        checked={topics.includes(topic)}
                        onChange={(event) => {
                          setTopics(
                            event.target.checked
                              ? [...topics, topic]
                              : topics.filter((value) => value !== topic)
                          );
                          setCurrentPage(1);
                        }}
                      />
                      <span>{topic}</span>
                      <span className={styles.facetCount}>
                        {articles.filter((article) => article.topic === topic).length}
                      </span>
                    </label>
                  ))}
                </div>
              </details>
              <details className={styles.facet}>
                <summary>Date Range</summary>
                <form
                  className={styles.dateForm}
                  onSubmit={(event) => {
                    event.preventDefault();
                    setDates({ start: startInput, end: endInput });
                    setCurrentPage(1);
                  }}
                >
                  <label htmlFor={`${id}-start`}>Start</label>
                  <input
                    id={`${id}-start`}
                    type="date"
                    value={startInput}
                    max={endInput || undefined}
                    onChange={(event) => setStartInput(event.target.value)}
                  />
                  <label htmlFor={`${id}-end`}>End</label>
                  <input
                    id={`${id}-end`}
                    type="date"
                    value={endInput}
                    min={startInput || undefined}
                    onChange={(event) => setEndInput(event.target.value)}
                  />
                  <button type="submit">Apply</button>
                </form>
              </details>
            </div>
          </aside>
          <div className={styles.resultsColumn}>
            <Text tag="h1" className={styles.hubTitle} field={fields?.Title} />
            <Text tag="p" className={styles.hubSummary} field={fields?.pageSummary} />
            <div className={styles.searchRow}>
              <button
                ref={filterToggle}
                type="button"
                className={styles.filterToggle}
                aria-label="Open filters"
                aria-expanded={facetsOpen}
                aria-controls={`${id}-facets`}
                onClick={() => setFacetsOpen(true)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 5h10v2H3zm14 0h4v2h-4zm-2-2h2v6h-2zM3 11h4v2H3zm8 0h10v2H11zM7 9h2v6H7zm-4 8h6v2H3zm10 0h8v2h-8zm-2-2h2v6h-2z" />
                </svg>
              </button>
              <form className={styles.searchForm} role="search" onSubmit={search}>
                <label className={styles.visuallyHidden} htmlFor={`${id}-search`}>
                  Search articles
                </label>
                <input
                  id={`${id}-search`}
                  type="search"
                  value={input}
                  maxLength={120}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Search"
                />
                <button type="submit" aria-label="Search articles">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="10" cy="10" r="6.5" />
                    <path d="m15 15 6 6" />
                  </svg>
                </button>
              </form>
            </div>
            {status === 'ready' ? (
              <>
                <div className={styles.resultInfo}>
                  <p aria-live="polite">
                    {filtered.length
                      ? `${firstIndex + 1}–${Math.min(firstIndex + PAGE_SIZE, filtered.length)} of `
                      : ''}
                    {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                    {query ? ` for “${query}”` : ''}
                  </p>
                  {hasFilters ? (
                    <button type="button" className={styles.clearFilters} onClick={clearFilters}>
                      Clear filters ×
                    </button>
                  ) : null}
                </div>
                <div className={styles.sortRow}>
                  <label className={styles.visuallyHidden} htmlFor={`${id}-sort`}>
                    Sort articles
                  </label>
                  <select
                    id={`${id}-sort`}
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="relevancy">Relevancy</option>
                    <option value="newest">Newest</option>
                  </select>
                  {pager('top')}
                </div>
                {visibleArticles.length ? (
                  <div className={styles.resultList}>
                    {visibleArticles.map(({ article }) => (
                      <article className={styles.result} key={article.id}>
                        <Link
                          className={styles.resultImageLink}
                          href={article.url}
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <Image
                            className={styles.resultImage}
                            field={article.image}
                            {...nativeMediaSource(article.image)}
                            loading="lazy"
                          />
                        </Link>
                        <div className={styles.resultCopy}>
                          <h2>
                            <Link href={article.url}>{article.title}</Link>
                          </h2>
                          <p>{article.summary}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={styles.feedback}>
                    No results found. Try another search or clear your filters.
                  </p>
                )}
                <div className={styles.bottomResults}>
                  <p>
                    {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                  </p>
                  {pager('bottom')}
                </div>
              </>
            ) : null}
            {status === 'loading' ? (
              <p className={styles.feedback} role="status">
                Loading articles…
              </p>
            ) : null}
            {status === 'error' ? (
              <div className={styles.feedback} role="status">
                <p>We couldn’t load these articles. Please try again.</p>
                <button
                  className={styles.retryButton}
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Try again
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
