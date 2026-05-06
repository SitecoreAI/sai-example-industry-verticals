import React, { JSX } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content text-foreground mx-auto max-w-5xl px-4 py-8 [&_a]:text-[var(--color-brand-teal)] [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint border-border bg-background-accent/60 text-foreground-light inline-flex rounded-md border border-dashed px-4 py-6 text-sm">
            Rich text — connect a datasource or add copy in Experience Editor.
          </span>
        )}
      </div>
    </div>
  );
};
