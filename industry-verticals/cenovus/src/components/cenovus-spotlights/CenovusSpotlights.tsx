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
import Image from 'next/image';
import NextLink from 'next/link';
import React, { JSX } from 'react';

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
  const isEditing = page.mode.isEditing;

  const items = props.fields?.data?.datasource?.children?.results ?? [];
  const sectionTitle = props.fields?.data?.datasource?.title;

  const showDemo = shouldShowCenovusDemo(isEditing);

  if (!isEditing && items.length === 0 && !showDemo) {
    return null;
  }

  if (showDemo) {
    return (
      <section
        className={`cenovus-spotlights font-body bg-background text-foreground ${props.params.styles || ''}`}
        id={id || undefined}
      >
        <div className="w-full py-0">
          <div className="cenovus-homepage-panel">
            <h2 className="font-heading mb-8 shrink-0 text-2xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:mb-10 md:text-3xl">
              {sectionTitle?.jsonValue?.value || isEditing ? (
                <Text field={sectionTitle?.jsonValue} />
              ) : (
                demoSpotlights.title
              )}
            </h2>

            <ul className="grid min-h-0 flex-1 grid-cols-1 content-start gap-6 md:grid-cols-2 md:gap-8">
              {demoSpotlights.items.map((item) => (
                <li className="min-w-0" key={item.id}>
                  <NextLink
                    href="#"
                    className="group block overflow-hidden rounded-xl border-2 border-[var(--color-brand-teal)]/20 bg-[var(--color-background)] shadow-md transition hover:border-[var(--color-accent)]/50 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] min-h-[160px] w-full overflow-hidden bg-neutral-200">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
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
        </div>
      </section>
    );
  }

  return (
    <section
      className={`cenovus-spotlights font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="w-full py-0">
        <div className="cenovus-homepage-panel">
          {(sectionTitle?.jsonValue || isEditing) && (
            <h2 className="font-heading mb-8 shrink-0 text-2xl font-semibold tracking-[0.12em] text-[var(--color-brand-teal)] uppercase md:mb-10 md:text-3xl">
              <Text field={sectionTitle?.jsonValue} />
            </h2>
          )}

          <ul className="grid min-h-0 flex-1 grid-cols-1 content-start gap-6 md:grid-cols-2 md:gap-8">
            {items.map((item) => {
              const imgField = item.spotlightImage?.jsonValue;
              const hasImage = Boolean(imgField?.value?.src);
              const linkField = item.spotlightLink?.jsonValue;
              const hasLink = Boolean(linkField?.value?.href);

              const card = hasImage ? (
                <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-lg bg-[#eeeeee] shadow-sm">
                  <div className="relative aspect-[4/3] min-h-[160px] w-full bg-neutral-300/80">
                    <ContentSdkImage field={imgField} className="size-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-end p-4">
                    {(item.spotlightTitle?.jsonValue || isEditing) && (
                      <p className="text-left text-base leading-snug font-semibold text-neutral-900">
                        <Text field={item.spotlightTitle?.jsonValue} />
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-[#eeeeee] px-4 py-4 shadow-sm">
                  {(item.spotlightTitle?.jsonValue || isEditing) && (
                    <p className="text-left text-base leading-snug font-semibold text-neutral-900">
                      <Text field={item.spotlightTitle?.jsonValue} />
                    </p>
                  )}
                </div>
              );

              const linked =
                hasLink || isEditing ? (
                  <Link
                    field={linkField}
                    className="block text-inherit no-underline transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
                  >
                    {card}
                  </Link>
                ) : (
                  card
                );

              return (
                <li className="min-w-0" key={item.id}>
                  {linked}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
