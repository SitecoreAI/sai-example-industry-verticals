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
import { isParamTruthy } from '@/helpers/isParamEnabled';
import { CommonStyles } from '@/types/styleFlags';

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

type ParamBag = Record<string, string | undefined>;

function mergePromoParamBag(props: PromoProps): ParamBag {
  const fromRendering = props.rendering?.params as ParamBag | undefined;
  const fromProps = props.params as ParamBag;
  return { ...(fromRendering ?? {}), ...(fromProps ?? {}) };
}

function combinedStyleClassString(bag: ParamBag): string {
  return [bag.styles, bag.Styles, bag.CSSStyles].filter(Boolean).join(' ').toLowerCase();
}

/**
 * Image-right layout when:
 * - Style token `reversed` appears on resolved class lists (`styles` / `Styles` / `CSSStyles`), or
 * - Rendering checkbox `Reversed` / `reversed` is truthy (merged from `rendering.params` + `params`).
 */
function isPromoReversed(props: PromoProps): boolean {
  const bag = mergePromoParamBag(props);
  if (combinedStyleClassString(bag).includes(CommonStyles.Reversed)) return true;
  if (isParamTruthy(bag.Reversed) || isParamTruthy(bag.reversed)) return true;
  return false;
}

function sectionClassNames(props: PromoProps): string {
  return mergePromoParamBag(props).styles ?? props.params.styles ?? '';
}

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const reversed = isPromoReversed(props);
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const sectionStyles = sectionClassNames(props);

  return (
    <section className={`${sectionStyles} py-10 lg:py-16`} id={id ? id : undefined}>
      <div className="container grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        {/* Image Section — square crop; explicit columns at lg so reversal does not rely on `order` */}
        <div
          className={`relative aspect-square w-full overflow-hidden${reversed ? 'lg:col-start-2 lg:row-start-1' : ''}`}
        >
          <ContentSdkImage field={props.fields.PromoImageOne} className="size-full object-cover" />
        </div>

        {/* Text Section */}
        <div
          className={`font-body relative flex flex-col${reversed ? 'lg:col-start-1 lg:row-start-1' : ''}`}
        >
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
  const reversed = isPromoReversed(props);
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${sectionClassNames(props)} py-10 lg:py-30`} id={id ? id : undefined}>
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
