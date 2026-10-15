import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import styles from 'src/assets/westfield-advice.module.css';

export const Default = ({ params, rendering }: ComponentProps): JSX.Element => (
  <div
    className={['component', styles.bodyLayout, params.GridParameters, params.styles]
      .filter(Boolean)
      .join(' ')}
    id={params.RenderingIdentifier || undefined}
    data-class-change
  >
    <div className={styles.articleWidth}>
      <Placeholder name={`article-content-${params.DynamicPlaceholderId}`} rendering={rendering} />
    </div>
  </div>
);
