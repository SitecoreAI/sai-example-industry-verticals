import React, { JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Field,
  ImageField,
  Link,
  LinkField,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { CommonStyles } from 'types/styleFlags';

/** Sitecore checkbox param `Reversed` (`1`/`0`) or style token `reversed` in `styles`. */
function isPromoReversed(params: ComponentProps['params']): boolean {
  const styles = `${params.styles ?? ''}`.toLowerCase();
  return styles.includes(CommonStyles.Reversed) || params.Reversed === '1';
}

interface Fields {
  PromoImageOne: ImageField;
  PromoTitle: Field<string>;
  PromoDescription: RichTextField;
  PromoSubTitle: Field<string>;
  PromoMoreInfo: LinkField;
}

export type PromoProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const imageOrderClass = isPromoReversed(props.params) ? 'order-last' : '';
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-16`} id={id ? id : undefined}>
      <div className="container grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        {/* Image Section — square crop, no full-viewport column height */}
        <div className={`${imageOrderClass} relative aspect-square w-full overflow-hidden`}>
          <ContentSdkImage field={props.fields.PromoImageOne} className="size-full object-cover" />
        </div>

        {/* Text Section */}
        <div className="font-body relative flex flex-col">
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">
              {(props.fields.PromoSubTitle?.value || isPageEditing) && (
                <div className="text-foreground-light text-sm tracking-wide uppercase">
                  <Text field={props.fields.PromoSubTitle} />
                </div>
              )}

              <Text field={props.fields.PromoTitle} tag="h3" />

              <div className="text-foreground text-base lg:text-lg">
                <ContentSdkRichText field={props.fields.PromoDescription} />
              </div>

              {(props.fields.PromoMoreInfo?.value?.href || isPageEditing) && (
                <Link field={props.fields.PromoMoreInfo} className="outline-btn !inline-flex" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const WithQuote = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const reversed = isPromoReversed(props.params);
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-30`} id={id ? id : undefined}>
      <div className="container">
        <div
          className={`flex flex-col space-y-5 ${
            reversed ? 'items-end text-right' : 'items-start text-left'
          } `}
        >
          <h2 className="font-heading text-foreground max-w-4xl text-4xl tracking-tight lg:text-7xl">
            <ContentSdkRichText field={props.fields.PromoTitle} />
          </h2>

          {(props.fields.PromoMoreInfo?.value?.href || isPageEditing) && (
            <Link field={props.fields.PromoMoreInfo} className="outline-btn !inline-flex" />
          )}
        </div>
      </div>
    </section>
  );
};
