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
  const isPromoReversed = props?.params?.styles?.includes('reversed') ? 'order-last' : '';
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${props.params.styles || ''} py-0`} id={id ? id : undefined}>
      <div className="container grid grid-cols-1 items-start gap-0 lg:grid-cols-[minmax(0,416px)_1fr] lg:gap-10">
        {/* Image Section - fit image in frame without cropping */}
        <div
          className={`${isPromoReversed} relative flex h-[396px] w-full items-center justify-center overflow-hidden lg:w-[416px]`}
        >
          <ContentSdkImage
            field={props.fields.PromoImageOne}
            className="!h-auto !max-h-full !w-full object-contain object-center"
          />
        </div>

        {/* Text Section */}
        <div className="font-body relative flex flex-col py-6 lg:flex lg:py-0 lg:pl-2">
          <div>
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
                <Link field={props.fields.PromoMoreInfo} className="outline-btn" />
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
  const isPromoReversed = props?.params?.styles?.includes('reversed');
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-30`} id={id ? id : undefined}>
      <div className="container">
        <div
          className={`flex flex-col space-y-5 ${
            isPromoReversed ? 'items-end text-right' : 'items-start text-left'
          } `}
        >
          <h2 className="font-heading text-foreground max-w-4xl text-4xl tracking-tight lg:text-7xl">
            <ContentSdkRichText field={props.fields.PromoTitle} />
          </h2>

          {(props.fields.PromoMoreInfo?.value?.href || isPageEditing) && (
            <Link field={props.fields.PromoMoreInfo} className="outline-btn" />
          )}
        </div>
      </div>
    </section>
  );
};
