import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/router';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import type { SearchResponse } from 'lib/published-content';
import styles from './SearchResults.module.css';

type SearchState = 'idle' | 'loading' | 'ready' | 'error';

export const Default = ({ params }: ComponentProps): JSX.Element => {
  const router = useRouter();
  const { page } = useSitecore();
  const routeFields = page.layout.sitecore.route?.fields as
    | { Title?: Field<string>; pageSummary?: Field<string> }
    | undefined;
  const query = typeof router.query.q === 'string' ? router.query.q.trim() : '';
  const [input, setInput] = useState('');
  const [state, setState] = useState<SearchState>('idle');
  const [result, setResult] = useState<SearchResponse>();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    setInput(query);
    setResult(undefined);
    setError('');
    if (!query) {
      setState('idle');
      return;
    }

    const controller = new AbortController();
    setState('loading');
    fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Search is temporarily unavailable.');
        return data as SearchResponse;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        setResult(data);
        setState('ready');
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : 'Search is temporarily unavailable.');
        setState('error');
      });
    return () => controller.abort();
  }, [router.isReady, query]);

  return (
    <section
      className={[
        'component',
        'westfield-search',
        styles.root,
        params.GridParameters,
        params.styles,
      ]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className={`component-content ${styles.inner}`}>
        <Text tag="h1" className={styles.heading} field={routeFields?.Title} />
        <Text tag="p" className={styles.intro} field={routeFields?.pageSummary} />
        <form className={styles.form} role="search" action="/search" method="get">
          <label className={styles.label} htmlFor="westfield-search-query">
            Search Westfield
          </label>
          <div className={styles.controls}>
            <input
              id="westfield-search-query"
              name="q"
              type="search"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={120}
              placeholder="Search insurance, claims or account help"
              required
            />
            <button type="submit">Search</button>
          </div>
        </form>
        <div className={styles.status} role="status" aria-live="polite" aria-atomic="true">
          {state === 'idle' ? 'Enter a word or phrase to find information on this website.' : null}
          {state === 'loading' ? 'Searching…' : null}
          {state === 'ready' && result
            ? `${result.total} ${result.total === 1 ? 'result' : 'results'} for “${result.query}”`
            : null}
        </div>
        {state === 'error' ? (
          <p className={styles.error} role="alert">
            {error} Please try again.
          </p>
        ) : null}
        {state === 'ready' && result?.total === 0 ? (
          <div className={styles.empty}>
            <h2>No results found</h2>
            <p>
              Try a broader term, check the spelling, or search for home, auto, claims or billing.
            </p>
          </div>
        ) : null}
        {state === 'ready' && result?.results.length ? (
          <ol className={styles.results}>
            {result.results.map((item) => (
              <li key={item.id} className={styles.result}>
                {item.topic ? <p className={styles.topic}>{item.topic}</p> : null}
                <h2>
                  <a href={item.url}>{item.title}</a>
                </h2>
                <p>{item.snippet}</p>
                <span className={styles.path}>{item.url}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
};
