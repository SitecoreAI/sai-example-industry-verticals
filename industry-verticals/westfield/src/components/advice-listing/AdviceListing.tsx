import { useEffect, useId, useState } from 'react';
import type { JSX } from 'react';
import Link from 'next/link';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import type { PublishedArticle } from 'lib/published-content';
import { nativeMediaSource } from 'lib/native-media';
import styles from 'src/assets/westfield-advice.module.css';

type ListingFields = {
  Title?: Field<string>;
  pageSummary?: Field<string>;
};

type ArticlesResponse = {
  articles?: PublishedArticle[];
};

export const Default = ({ params }: ComponentProps): JSX.Element => {
  const { page } = useSitecore();
  const fields = page.layout.sitecore.route?.fields as ListingFields | undefined;
  const topicId = useId();
  const [articles, setArticles] = useState<PublishedArticle[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [topic, setTopic] = useState('');
  const [attempt, setAttempt] = useState(0);

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

  const topics = [...new Set(articles.map((article) => article.topic).filter(Boolean))].sort();
  const visibleArticles = topic ? articles.filter((article) => article.topic === topic) : articles;

  return (
    <section
      className={['component', styles.listing, params.GridParameters, params.styles]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className={styles.listingWidth}>
        <Text tag="h1" className={styles.hubTitle} field={fields?.Title} />
        <Text tag="p" className={styles.hubSummary} field={fields?.pageSummary} />
        {status === 'ready' && articles.length > 0 ? (
          <div className={styles.listingTools}>
            <div className={styles.topicFilter}>
              <label htmlFor={topicId}>Filter by topic</label>
              <select id={topicId} value={topic} onChange={(event) => setTopic(event.target.value)}>
                <option value="">All topics</option>
                {topics.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <p className={styles.resultCount} aria-live="polite">
              {visibleArticles.length} {visibleArticles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        ) : null}
        {status === 'loading' ? (
          <p className={styles.feedback} role="status">
            Loading advice…
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
        {status === 'ready' && visibleArticles.length === 0 ? (
          <p className={styles.feedback} role="status">
            {articles.length > 0 ? 'No articles match this topic.' : 'New advice is on the way.'}
          </p>
        ) : null}
        {status === 'ready' && visibleArticles.length > 0 ? (
          <div className={styles.cardGrid}>
            {visibleArticles.map((article) => (
              <article className={styles.card} key={article.id}>
                <Link className={styles.cardLink} href={article.url}>
                  <div className={styles.cardMedia}>
                    <Image
                      className={styles.cardImage}
                      field={article.image}
                      {...nativeMediaSource(article.image)}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.cardMeta}>
                      <span>{article.topic}</span>
                      <span>{article.readTime}</span>
                    </p>
                    <h2 className={styles.cardTitle}>{article.title}</h2>
                    <p className={styles.cardSummary}>{article.summary}</p>
                    <span className={styles.cardAction}>
                      Read article<span aria-hidden="true"> →</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
