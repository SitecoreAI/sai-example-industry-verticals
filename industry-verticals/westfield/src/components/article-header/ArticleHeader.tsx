import type { JSX } from 'react';
import Link from 'next/link';
import { Image, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { nativeMediaSource } from 'lib/native-media';
import styles from 'src/assets/westfield-advice.module.css';

type ArticleFields = {
  Title?: Field<string>;
  pageSummary?: Field<string>;
  Topic?: Field<string>;
  ReadTime?: Field<string>;
  HeroImage?: ImageField;
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
      <div className={styles.articleWidth}>
        <Link className={styles.backLink} href="/advice">
          <span aria-hidden="true">← </span>Back to advice
        </Link>
        <Text tag="h1" className={styles.articleTitle} field={fields?.Title} />
        <div className={styles.meta}>
          <Text tag="span" className={styles.topic} field={fields?.Topic} />
          <Text tag="span" className={styles.readTime} field={fields?.ReadTime} />
        </div>
        <div className={styles.lead}>
          <Image
            className={styles.heroImage}
            field={fields?.HeroImage}
            {...nativeMediaSource(fields?.HeroImage)}
            loading="eager"
            fetchPriority="high"
          />
          <Text tag="p" className={styles.summary} field={fields?.pageSummary} />
        </div>
      </div>
    </header>
  );
};
