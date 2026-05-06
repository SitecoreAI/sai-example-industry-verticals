'use client';

import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Link,
  LinkField,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { JSX, useCallback, useEffect, useMemo, useState } from 'react';

interface HomeHeroSlide {
  id: string;
  slideImage: { jsonValue: ImageField };
  slideTitle: { jsonValue: Field<string> };
  slideDescription: { jsonValue: RichTextField };
  slideDate: { jsonValue: Field<string> };
  slideLink: { jsonValue: LinkField };
}

interface Fields {
  data: {
    datasource: {
      children: {
        results: HomeHeroSlide[];
      };
      title?: IGQLTextField;
      description?: IGQLTextField;
    };
  };
}

type CenovusHomeHeroProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

function formatSlideDate(value: string | undefined): string {
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

export const Default = (props: CenovusHomeHeroProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const slides = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;
  const sectionDescription = props.fields?.data?.datasource?.description;

  const [index, setIndex] = useState(0);
  const total = slides.length;
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const slide = total > 0 ? slides[safeIndex] : undefined;

  useEffect(() => {
    if (index > 0 && index >= total) {
      setIndex(Math.max(0, total - 1));
    }
  }, [index, total]);

  const goPrev = useCallback(() => {
    if (total < 2) return;
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total < 2) return;
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const dateDisplay = useMemo(
    () => formatSlideDate(slide?.slideDate?.jsonValue?.value as string | undefined),
    [slide],
  );

  if (!isEditing && total === 0) {
    return null;
  }

  return (
    <section
      className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="mx-auto max-w-[1600px]">
        {(sectionTitle?.jsonValue || sectionDescription?.jsonValue || isEditing) && (
          <div className="container py-8 pb-0">
            {(sectionTitle?.jsonValue || isEditing) && (
              <h2 className="font-heading text-3xl tracking-tight md:text-4xl">
                <Text field={sectionTitle?.jsonValue} />
              </h2>
            )}
            {(sectionDescription?.jsonValue || isEditing) && (
              <p className="text-foreground-light mt-2 max-w-3xl text-base md:text-lg">
                <Text field={sectionDescription?.jsonValue} />
              </p>
            )}
          </div>
        )}

        <div className="grid min-h-[420px] grid-cols-1 lg:min-h-[480px] lg:grid-cols-12 lg:gap-0">
          <div className="relative lg:col-span-8">
            <div className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden bg-neutral-200 lg:aspect-auto lg:min-h-[480px]">
              {slide?.slideImage?.jsonValue && (
                <ContentSdkImage
                  field={slide.slideImage.jsonValue}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
              {isEditing && !slide?.slideImage?.jsonValue?.value?.src && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-300 text-sm text-neutral-600">
                  Slide image
                </div>
              )}

              {total > 0 && (
                <div className="absolute bottom-4 left-4 flex items-center gap-0 bg-white/95 px-1 py-1 text-neutral-900 shadow-sm">
                  <button
                    type="button"
                    className="px-3 py-2 text-lg leading-none hover:bg-neutral-100"
                    aria-label="Previous slide"
                    onClick={goPrev}
                  >
                    ‹
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    className="px-3 py-2 text-lg leading-none hover:bg-neutral-100"
                    aria-label="Next slide"
                    onClick={goNext}
                  >
                    ›
                  </button>
                  <span className="text-neutral-300">|</span>
                  <span className="px-3 py-2 text-sm tabular-nums">
                    {total > 0 ? `${safeIndex + 1}/${total}` : '0/0'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white px-6 py-10 lg:col-span-4 lg:px-10 lg:py-14">
            {!slide && isEditing && (
              <p className="text-sm text-neutral-500">Add one or more Cenovus Home Hero Slide items.</p>
            )}
            {slide && (
              <>
                {(slide.slideTitle?.jsonValue || isEditing) && (
                  <h3 className="font-heading text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                    <Text field={slide.slideTitle.jsonValue} />
                  </h3>
                )}
                {(slide.slideDescription?.jsonValue || isEditing) && (
                  <div className="text-foreground-light mt-4 text-base leading-relaxed">
                    <ContentSdkRichText field={slide.slideDescription.jsonValue} />
                  </div>
                )}
                {(dateDisplay || isEditing) && (
                  <p className="text-foreground-light mt-4 text-sm">{dateDisplay || '\u00a0'}</p>
                )}
                {(slide.slideLink?.jsonValue?.value?.href || isEditing) && (
                  <div className="mt-8">
                    <Link
                      field={slide.slideLink.jsonValue}
                      className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.2em] underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
