import { IGQLTextField } from '@/types/igql';
import { demoSpotlights, shouldShowCenovusDemo } from '@/lib/cenovus-demo';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Link,
  LinkField,
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import NextLink from 'next/link';
import React, { JSX } from 'react';

const emptyLinkField = { value: {} } as LinkField;

interface SpotlightItem {
  id: string;
  spotlightImage: { jsonValue: ImageField };
  spotlightTitle: { jsonValue: Field<string> };
  spotlightLink: { jsonValue: LinkField };
}

interface Fields {
  data: {
    datasource: {
      children: {
        results: SpotlightItem[];
      };
      title?: IGQLTextField;
    };
  };
}

type CenovusSpotlightsProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: CenovusSpotlightsProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const items = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;

  const showDemo = shouldShowCenovusDemo(isPageEditing);

  if (!isPageEditing && items.length === 0 && !showDemo) {
    return null;
  }

  if (showDemo) {
    return (
      <section
        className={`cenovus-spotlights font-body bg-background text-foreground ${props.params.styles || ''}`}
        id={id || undefined}
      >
        <div className="w-full py-12 lg:py-16">
          <h2 className="font-heading mb-8 text-2xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:mb-10 md:text-3xl">
            {sectionTitle?.jsonValue?.value ? (
              <Text field={sectionTitle?.jsonValue} />
            ) : (
              demoSpotlights.title
            )}
          </h2>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {demoSpotlights.items.map((item, idx) => (
              <li className="min-w-0" key={item.id}>
                <NextLink
                  href="#"
                  className="group block overflow-hidden rounded-xl border-2 border-[var(--color-brand-teal)]/20 bg-[var(--color-background)] shadow-md transition hover:border-[var(--color-accent)]/50 hover:shadow-lg"
                >
                  <div
                    className={`relative aspect-[4/3] min-h-[160px] w-full bg-gradient-to-br ${
                      idx === 0
                        ? 'from-[var(--color-brand-teal)] to-[var(--color-brand-teal-dark)]'
                        : 'from-[var(--color-accent)] to-[#8a4e19]'
                    }`}
                  >
                    <span className="font-heading absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/90">
                      {idx === 0 ? 'Ops' : 'People'}
                    </span>
                  </div>
                  <div className="border-border border-t bg-[var(--color-background-muted)]/50 p-5">
                    <p className="text-foreground-light mb-1 text-xs font-semibold tracking-wider uppercase">
                      {item.subtitle}
                    </p>
                    <p className="text-left text-lg leading-snug font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-brand-teal)]">
                      {item.title}
                    </p>
                  </div>
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`cenovus-spotlights font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="w-full py-12 lg:py-16">
        <Text
          field={sectionTitle?.jsonValue}
          tag="h2"
          className="font-heading mb-8 text-2xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:mb-10 md:text-3xl"
        />

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {items.map((item) => {
            const imgField = item.spotlightImage?.jsonValue;
            const linkField = item.spotlightLink?.jsonValue;

            const card = (
              <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-lg bg-[#eeeeee] shadow-sm">
                <div className="relative aspect-[4/3] min-h-[160px] w-full bg-neutral-300/80">
                  <ContentSdkImage field={imgField} className="size-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-end p-4">
                  <Text
                    field={item.spotlightTitle?.jsonValue}
                    tag="p"
                    className="text-left text-base leading-snug font-semibold text-neutral-900"
                  />
                </div>
              </div>
            );

            return (
              <li className="min-w-0" key={item.id}>
                {linkField?.value?.href || isPageEditing ? (
                  <Link
                    field={linkField ?? emptyLinkField}
                    className="block text-inherit no-underline transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                  >
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
