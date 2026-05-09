'use client';

import { IGQLTextField } from '@/types/igql';
import { ComponentProps } from 'lib/component-props';
import {
  ImageField,
  NextImage as ContentSdkImage,
  Placeholder,
  RichText as ContentSdkRichText,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { JSX } from 'react';

/** Dynamic placeholder for components below the article body (e.g. Promo). */
export const CENOVUS_ARTICLE_BELOW = 'cenovus-article-below-{*}';

interface ArticlePageDatasource {
  title?: IGQLTextField;
  image?: { jsonValue: ImageField };
  content?: { jsonValue: RichTextField };
  publishedDate?: IGQLTextField;
  category?: IGQLTextField;
  location?: IGQLTextField;
}

interface Fields {
  data?: {
    datasource?: ArticlePageDatasource;
  };
}

type IntegratedFields = Fields & { datasource?: ArticlePageDatasource };

function formatArticleDate(value: string | undefined): string {
  if (!value?.trim()) return '';
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return new Intl.DateTimeFormat(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  }
  return value;
}

function hasImageSrc(field: ImageField | undefined): boolean {
  return Boolean(field?.value?.src?.trim());
}

type CenovusArticlePageProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: CenovusArticlePageProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const merged = (props.fields ?? props.rendering?.fields) as IntegratedFields | undefined;
  const ds = merged?.data?.datasource ?? merged?.datasource;

  const title = ds?.title;
  const imageJson = ds?.image?.jsonValue;
  const content = ds?.content;
  const dateField = ds?.publishedDate;
  const location = ds?.location;
  const category = ds?.category;

  const bodyField: RichTextField = content?.jsonValue ?? ({} as RichTextField);
  const dateRaw = dateField?.jsonValue?.value as string | undefined;
  const dateDisplay = formatArticleDate(dateRaw);

  const showTitle = isEditing || Boolean(title?.jsonValue?.value);
  const showImage = isEditing || hasImageSrc(imageJson);
  const showBody = isEditing || Boolean(bodyField?.value);
  const showDate = isEditing || Boolean(dateRaw?.trim());
  const showLocation = isEditing || Boolean(location?.jsonValue?.value);
  const showCategory = isEditing || Boolean(category?.jsonValue?.value);

  const showMeta = showDate || showLocation || showCategory;

  if (!isEditing && !showTitle && !showImage && !showBody && !showMeta) {
    return null;
  }

  return (
    <div
      className={`cenovus-article-page font-body text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <article className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
        {showTitle ? (
          <h1 className="font-heading mb-6 text-3xl font-semibold tracking-tight text-[var(--color-brand-teal)] md:text-4xl">
            <Text field={title?.jsonValue} />
          </h1>
        ) : null}

        {showMeta ? (
          <div className="text-foreground-light mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {showCategory ? (
              <span className="rounded-full bg-[var(--color-background-muted)] px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase">
                <Text field={category?.jsonValue} />
              </span>
            ) : null}
            {showCategory && (showDate || showLocation) ? (
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
            ) : null}
            {showDate ? (
              <span className="tabular-nums">
                {isEditing ? <Text field={dateField?.jsonValue} /> : dateDisplay}
              </span>
            ) : null}
            {showDate && showLocation ? (
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
            ) : null}
            {showLocation ? <Text field={location?.jsonValue} /> : null}
          </div>
        ) : null}

        {showImage ? (
          <div className="relative mb-10 aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-200">
            {imageJson && (isEditing || hasImageSrc(imageJson)) ? (
              <ContentSdkImage
                field={imageJson}
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}
            {isEditing && !hasImageSrc(imageJson) ? (
              <div className="absolute inset-0 bg-neutral-300/90" aria-hidden />
            ) : null}
          </div>
        ) : null}

        {showBody ? (
          <div className="cenovus-article-page-copy prose prose-neutral dark:prose-invert max-w-none [&_a]:text-[var(--color-accent)] [&_a]:underline-offset-4">
            <ContentSdkRichText field={bodyField} />
          </div>
        ) : null}
      </article>

      <div className="mx-auto w-full max-w-3xl px-4 pb-10 md:pb-14">
        <Placeholder name={CENOVUS_ARTICLE_BELOW} rendering={props.rendering} />
      </div>
    </div>
  );
};
