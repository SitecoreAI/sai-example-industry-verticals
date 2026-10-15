import type { JSX } from 'react';
import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import type { Field } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import styles from 'src/assets/westfield-advice.module.css';

type ArticleTextProps = ComponentProps & {
  fields?: {
    Heading?: Field<string>;
    Body?: Field<string>;
  };
};

export const Default = ({ fields, params }: ArticleTextProps): JSX.Element => (
  <section
    className={['component', styles.textBlock, params.GridParameters, params.styles]
      .filter(Boolean)
      .join(' ')}
    id={params.RenderingIdentifier || undefined}
    data-class-change
  >
    <Text tag="h2" className={styles.sectionTitle} field={fields?.Heading} />
    <RichText className={styles.articleCopy} field={fields?.Body} />
  </section>
);
