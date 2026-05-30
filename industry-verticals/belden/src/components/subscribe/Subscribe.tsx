import React, { JSX } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Text, Field, RichText, RichTextField } from '@sitecore-content-sdk/nextjs';
import { useI18n } from 'next-localization';

export type SubscribeBannerProps = ComponentProps & {
  params: { [key: string]: string };
  fields?: {
    Title: Field<string>;
    ConsentText?: RichTextField;
  };
};

export const Default = (props: SubscribeBannerProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const { t } = useI18n();
  const fields = props.fields;
  const submitLabel = t('button_text') || 'Subscribe';

  return (
    <section
      className={`component subscribe-banner group py-10 md:py-14 ${styles ?? ''}`}
      id={id || undefined}
    >
      <div className="container max-w-4xl md:max-w-5xl md:px-10">
        <div className="grid items-center gap-y-6 md:grid-cols-2 md:gap-x-12 md:gap-y-0">
          {/* Headline */}
          <div>
            <h2 className="text-foreground text-2xl leading-tight font-medium xl:text-3xl">
              <Text field={fields?.Title} />
            </h2>
            {fields?.ConsentText && (
              <div className="text-foreground-muted mt-4 text-base leading-7">
                <RichText field={fields.ConsentText} />
              </div>
            )}
          </div>

          {/* Form */}
          <form className="w-full md:max-w-lg" action="">
            <label htmlFor="subscribe-email" className="sr-only">
              {t('your_email_label') || 'your@email.com'}
            </label>

            <div className="relative">
              <input
                id="subscribe-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder={t('your_email') || 'E.g. your@email.com'}
                className="bg-background-surface ring-border text-foreground placeholder:text-foreground-muted h-12 w-full rounded-md ps-5 pe-32 ring-1 focus:ring-2 focus:outline-none md:h-14"
              />

              <button
                type="submit"
                className="bg-accent text-on-accent absolute top-1/2 right-2 h-9 -translate-y-1/2 rounded-md px-4 text-sm font-semibold hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none md:right-3 md:h-10 md:px-5"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export const WithConsent = (props: SubscribeBannerProps): JSX.Element => {
  const { styles, RenderingIdentifier: id } = props.params;
  const uid = props.rendering.uid;
  const { t } = useI18n();
  const fields = props.fields;
  const submitLabel = t('button_text') || 'Subscribe';

  return (
    <section className={`component subscribe-banner group ${styles ?? ''}`} id={id || undefined}>
      {/* Headline*/}
      <div className="max-w-sm">
        <div className="mb-6">
          <h2 className="text-foreground text-lg leading-tight font-medium xl:text-xl">
            <Text field={fields?.Title} />
          </h2>
        </div>

        <form className="w-full" action="">
          <label htmlFor={`subscribe-email-${uid}`} className="sr-only">
            {t('enter_email') || 'Enter your email'}
          </label>

          {/* Email and Submit Button */}
          <input
            id={`subscribe-email-${uid}`}
            type="email"
            inputMode="email"
            name="email"
            autoComplete="email"
            required
            placeholder={t('enter_email') || 'Enter your email'}
            className="bg-background-surface text-foreground placeholder:text-foreground-muted ring-border h-12 w-full rounded-sm ps-5 pe-5 ring-1 focus:ring-2 focus:outline-none md:h-14"
          />

          <button
            type="submit"
            className="bg-accent text-on-accent mt-3 inline-flex h-12 w-full items-center justify-center rounded-sm font-semibold tracking-widest uppercase hover:opacity-90 md:h-12"
          >
            {submitLabel}
          </button>

          {/* Consent text and Checkbox  */}
          {fields?.ConsentText && (
            <div className="mt-4 flex items-start gap-3">
              <input
                id="subscribe-consent"
                type="checkbox"
                className="border-border bg-background-surface accent-accent mt-1 size-4 rounded-sm border"
                required
              />
              <label htmlFor="subscribe-consent" className="text-foreground/70 text-sm leading-6">
                <RichText field={fields.ConsentText} />
              </label>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
