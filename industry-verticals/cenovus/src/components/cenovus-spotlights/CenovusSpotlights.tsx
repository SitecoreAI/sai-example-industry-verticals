import { IGQLTextField } from '@/types/igql';
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

  if (!isEditing && items.length === 0) {
    return null;
  }

  return (
    <section
      className={`font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="container py-12 lg:py-16">
        {(sectionTitle?.jsonValue || isEditing) && (
          <h2 className="font-heading mb-8 text-2xl font-semibold tracking-[0.12em] uppercase md:mb-10 md:text-3xl">
            <Text field={sectionTitle?.jsonValue} />
          </h2>
        )}

        {!items.length && isEditing && (
          <p className="text-foreground-light mb-6 text-sm">
            Add Cenovus Spotlight Item entries under this datasource.
          </p>
        )}

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
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
    </section>
  );
};
