import type { JSX } from 'react';
import { Image, Placeholder, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { nativeMediaSource } from 'lib/native-media';
import styles from 'src/assets/westfield-advice.module.css';

type ArticleFields = {
  pageSummary?: Field<string>;
  HeroImage?: ImageField;
};

export const Default = ({ params, rendering }: ComponentProps): JSX.Element => {
  const { page } = useSitecore();
  const fields = page.layout.sitecore.route?.fields as ArticleFields | undefined;

  return (
    <div
      className={['component', styles.bodyLayout, params.GridParameters, params.styles]
        .filter(Boolean)
        .join(' ')}
      id={params.RenderingIdentifier || undefined}
      data-class-change
    >
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={`${styles.articleWidth} ${styles.articleFlow}`}>
            {fields?.HeroImage?.value?.src || page.mode.isEditing ? (
              <figure className={styles.heroFigure}>
                <Image
                  className={styles.heroImage}
                  field={fields?.HeroImage}
                  {...nativeMediaSource(fields?.HeroImage)}
                  loading="eager"
                  fetchPriority="high"
                />
              </figure>
            ) : null}
            <Text tag="div" className={styles.summary} field={fields?.pageSummary} />
            <Placeholder
              name={`article-content-${params.DynamicPlaceholderId}`}
              rendering={rendering}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
