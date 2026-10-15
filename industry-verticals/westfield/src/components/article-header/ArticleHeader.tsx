import type { JSX } from 'react';
import Link from 'next/link';
import { DateField, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import styles from 'src/assets/westfield-advice.module.css';

type ArticleFields = {
  Title?: Field<string>;
  PublishedDate?: Field<string>;
};

export const Default = ({ params }: ComponentProps): JSX.Element => {
  const { page } = useSitecore();
  const fields = page.layout.sitecore.route?.fields as ArticleFields | undefined;

  return (
    <header
      className={['component', styles.header, params.GridParameters, params.styles]
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
            <li>
              <Link href="/advice">Articles</Link>
              <span aria-hidden="true">/</span>
            </li>
            <li aria-current="page">
              <Text field={fields?.Title} editable={false} />
            </li>
          </ol>
        </nav>
        <div className={styles.row}>
          <div className={styles.articleWidth}>
            <Text tag="h1" className={styles.articleTitle} field={fields?.Title} />
            <div className={styles.meta}>
              {fields?.PublishedDate ? (
                <DateField
                  field={fields.PublishedDate}
                  render={(date) =>
                    date && !Number.isNaN(date.getTime()) ? (
                      <time dateTime={date.toISOString().slice(0, 10)}>
                        {new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(date)}
                      </time>
                    ) : null
                  }
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
