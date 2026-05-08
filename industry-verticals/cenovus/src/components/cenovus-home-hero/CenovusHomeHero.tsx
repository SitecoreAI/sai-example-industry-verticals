'use client';

import { IGQLTextField } from '@/types/igql';
import { demoHeroSection, demoHeroSlides, shouldShowCenovusDemo } from '@/lib/cenovus-demo';
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

export const Default = (props: CenovusHomeHeroProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const slides = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;
  const sectionDescription = props.fields?.data?.datasource?.description;

  const showDemo = shouldShowCenovusDemo();

  const [index, setIndex] = useState(0);
  const total = slides.length;
  const safeIndex = total > 0 ? Math.min(index, total - 1) : 0;
  const slide = total > 0 ? slides[safeIndex] : undefined;

  const demoTotal = demoHeroSlides.length;
  const demoSafeIndex = demoTotal > 0 ? Math.min(index, demoTotal - 1) : 0;
  const demoSlide = showDemo ? demoHeroSlides[demoSafeIndex] : undefined;

  useEffect(() => {
    if (index > 0 && index >= total && !showDemo) {
      setIndex(Math.max(0, total - 1));
    }
  }, [index, total, showDemo]);

  useEffect(() => {
    if (showDemo && index >= demoTotal) {
      setIndex(Math.max(0, demoTotal - 1));
    }
  }, [index, demoTotal, showDemo]);

  const goPrev = useCallback(() => {
    const n = showDemo ? demoTotal : total;
    if (n < 2) return;
    setIndex((i) => (i - 1 + n) % n);
  }, [total, demoTotal, showDemo]);

  const goNext = useCallback(() => {
    const n = showDemo ? demoTotal : total;
    if (n < 2) return;
    setIndex((i) => (i + 1) % n);
  }, [total, demoTotal, showDemo]);

  const dateDisplay = useMemo(
    () => formatSlideDate(slide?.slideDate?.jsonValue?.value as string | undefined),
    [slide]
  );

  const demoDateDisplay = useMemo(
    () => formatSlideDate(showDemo ? demoSlide?.date : undefined),
    [showDemo, demoSlide?.date]
  );

  if (!isEditing && total === 0 && !showDemo) {
    return null;
  }

  const carouselCount = showDemo ? demoTotal : total;
  const carouselIndex = showDemo ? demoSafeIndex : safeIndex;

  return (
    <section
      className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="mx-auto max-w-[1600px]">
        {(showDemo || sectionTitle?.jsonValue || sectionDescription?.jsonValue || isEditing) && (
          <div className="container py-8 pb-0">
            {(showDemo || sectionTitle?.jsonValue || isEditing) && (
              <h2 className="font-heading text-3xl tracking-tight text-[var(--color-brand-teal)] md:text-4xl">
                {showDemo ? demoHeroSection.title : <Text field={sectionTitle?.jsonValue} />}
              </h2>
            )}
            {(showDemo || sectionDescription?.jsonValue || isEditing) && (
              <p className="text-foreground-light mt-2 max-w-3xl text-base md:text-lg">
                {showDemo ? (
                  demoHeroSection.description
                ) : (
                  <Text field={sectionDescription?.jsonValue} />
                )}
              </p>
            )}
          </div>
        )}

        <div className="cenovus-home-hero-split grid min-h-[420px] grid-cols-1 lg:min-h-[480px] lg:[grid-template-columns:minmax(0,2fr)_minmax(0,1fr)] lg:gap-0 [&>*]:min-w-0">
          <div className="relative">
            <div className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden bg-neutral-200 lg:aspect-auto lg:min-h-[480px]">
              {showDemo && demoSlide ? (
                <>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${demoSlide.gradient}`}
                    aria-hidden
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <p className="font-heading absolute bottom-12 left-6 max-w-lg text-2xl leading-tight font-semibold text-white drop-shadow-md md:text-3xl">
                    {demoSlide.title}
                  </p>
                </>
              ) : (
                <>
                  {slide?.slideImage?.jsonValue && (
                    <ContentSdkImage
                      field={slide.slideImage.jsonValue}
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                  {isEditing && !slide?.slideImage?.jsonValue?.value?.src && (
                    <div className="absolute inset-0 bg-neutral-300/90" aria-hidden />
                  )}
                </>
              )}

              {carouselCount > 0 && (
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
                    {carouselCount > 0 ? `${carouselIndex + 1}/${carouselCount}` : '0/0'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center border-t border-[var(--color-border)] bg-[var(--color-background-accent)] px-6 py-10 lg:border-t-0 lg:border-l lg:px-10 lg:py-14">
            {showDemo && demoSlide ? (
              <>
                <h3 className="font-heading text-2xl leading-tight font-semibold tracking-tight text-[var(--color-brand-teal)] md:text-3xl">
                  {demoSlide.title}
                </h3>
                <div
                  className="text-foreground-light mt-4 text-base leading-relaxed [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: demoSlide.description }}
                />
                <p className="text-foreground-light mt-4 text-sm">{demoDateDisplay}</p>
                <div className="mt-8">
                  <span className="inline-flex items-center text-sm font-semibold tracking-[0.2em] text-[var(--color-accent)] uppercase underline underline-offset-4">
                    {demoSlide.cta} →
                  </span>
                </div>
              </>
            ) : (
              slide && (
                <>
                  {(slide.slideTitle?.jsonValue || isEditing) && (
                    <h3 className="font-heading text-2xl leading-tight font-semibold tracking-tight md:text-3xl">
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
                        className="inline-flex items-center text-sm font-semibold tracking-[0.2em] uppercase underline-offset-4 after:ml-1 after:inline-block after:content-['→'] hover:underline"
                      />
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
