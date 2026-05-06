import {
  ComponentParams,
  ComponentRendering,
  ImageField,
  Link as SitecoreLink,
  LinkField,
  NextImage as ContentSdkImage,
  RichText,
  RichTextField,
  Text,
  TextField,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ArrowRight, ExternalLink, Facebook, Instagram } from 'lucide-react';
import NextLink from 'next/link';
import React, { JSX } from 'react';

import { CenovusBrandLogo } from '@/components/cenovus-brand/CenovusBrandLogo';
import { demoFooter, demoIntranetBrand } from '@/lib/cenovus-demo';
import { IGQLTextField } from '@/types/igql';

interface FooterLinkItem {
  id: string;
  footerLink: { jsonValue: LinkField };
}

interface DatasourceFields {
  logo?: { jsonValue: ImageField };
  linksHeading?: IGQLTextField;
  supportHeading?: IGQLTextField;
  supportBody?: { jsonValue: RichTextField };
  supportCta?: { jsonValue: LinkField };
  feedbackHeading?: IGQLTextField;
  feedbackPlaceholder?: IGQLTextField;
  feedbackSendLabel?: IGQLTextField;
  feedbackFormAction?: IGQLTextField;
  copyrightLine?: IGQLTextField;
  socialFacebook?: { jsonValue: LinkField };
  socialTwitter?: { jsonValue: LinkField };
  socialInstagram?: { jsonValue: LinkField };
  children?: { results: FooterLinkItem[] };
}

interface Fields {
  data: {
    datasource?: DatasourceFields;
  };
}

type CenovusFooterProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

function hasHref(field?: LinkField): boolean {
  const href = field?.value?.href;
  return Boolean(href && href.length > 0);
}

function isExternalHref(field?: LinkField): boolean {
  if (!field?.value?.href) {
    return false;
  }
  const href = field.value.href;
  const type = field.value.linktype?.toLowerCase() ?? '';
  if (type === 'external') {
    return true;
  }
  return /^https?:\/\//i.test(href);
}

/** Lucide dropped the Twitter icon in favor of X in some versions; keep a simple bird glyph label. */
function TwitterIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export const Default = (props: CenovusFooterProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles ?? '';
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const ds = props.fields?.data?.datasource;
  const linkItems = ds?.children?.results ?? [];

  const logoField = ds?.logo?.jsonValue;
  const hasLogo = Boolean(logoField?.value?.src);

  const formAction = String(ds?.feedbackFormAction?.jsonValue?.value ?? '').trim();
  const placeholder =
    (ds?.feedbackPlaceholder?.jsonValue as TextField | undefined)?.value?.toString() ||
    'Your message';
  const sendLabel =
    (ds?.feedbackSendLabel?.jsonValue as TextField | undefined)?.value?.toString() || 'SEND →';

  const socialEntries: {
    key: string;
    field?: { jsonValue: LinkField };
    Icon: React.ComponentType<{ className?: string }>;
    label: string;
  }[] = [
    { key: 'fb', field: ds?.socialFacebook, Icon: Facebook, label: 'Facebook' },
    { key: 'tw', field: ds?.socialTwitter, Icon: TwitterIcon, label: 'X (Twitter)' },
    { key: 'ig', field: ds?.socialInstagram, Icon: Instagram, label: 'Instagram' },
  ];

  if (!isEditing && !ds) {
    return (
      <footer className={`font-body text-foreground ${styles}`} id={id || undefined}>
        <div className="bg-[var(--color-background-muted)]">
          <div className="container grid gap-10 py-12 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:py-16">
            <div className="flex flex-col gap-4">
              <NextLink
                href="/"
                className="inline-block max-w-[200px] shrink-0 no-underline"
                aria-label={demoIntranetBrand.homeAriaLabel}
              >
                <CenovusBrandLogo className="h-auto max-h-14 w-full object-contain object-left" />
              </NextLink>
              <p className="text-foreground-light max-w-[17rem] text-sm leading-relaxed">
                {demoFooter.brandBlurb}
              </p>
            </div>
            <div>
              <h2 className="font-heading mb-4 text-base font-bold text-[var(--color-brand-teal)]">
                {demoFooter.linksHeading}
              </h2>
              <ul className="flex flex-col gap-3">
                {demoFooter.links.map((link) => (
                  <li key={link.label}>
                    <NextLink
                      href={link.href}
                      className="text-foreground-light hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
                    >
                      {link.label}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-base font-bold text-[var(--color-brand-teal)]">
                {demoFooter.supportHeading}
              </h2>
              <div
                className="text-foreground-light text-sm leading-relaxed [&_p+p]:mt-3 [&_strong]:text-[var(--color-foreground)]"
                dangerouslySetInnerHTML={{ __html: demoFooter.supportHtml }}
              />
              <span className="font-heading mt-1 inline-flex items-center gap-2 text-sm font-bold tracking-wide text-[var(--color-accent)] uppercase">
                {demoFooter.supportCta}
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-base font-bold text-[var(--color-brand-teal)]">
                {demoFooter.feedbackHeading}
              </h2>
              <p className="text-foreground-light text-sm leading-relaxed">
                {demoFooter.feedbackIntro}
              </p>
              <textarea
                rows={5}
                readOnly
                placeholder={demoFooter.feedbackPlaceholder}
                className="border-border min-h-[120px] w-full resize-y rounded-lg border-0 bg-[var(--color-background)] p-4 text-sm shadow-inner placeholder:text-[var(--color-foreground-light)]"
              />
            </div>
          </div>
        </div>
        <div className="border-border border-t bg-[var(--color-brand-teal)]/10">
          <div className="container flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-foreground-light text-xs sm:text-sm">{demoFooter.copyright}</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <NextLink
                href="#"
                className="border-border flex size-10 items-center justify-center rounded-full border bg-[var(--color-background)] text-[var(--color-brand-teal)] shadow-sm hover:opacity-90"
                aria-label="Facebook"
              >
                <Facebook className="size-5" aria-hidden />
              </NextLink>
              <NextLink
                href="#"
                className="border-border flex size-10 items-center justify-center rounded-full border bg-[var(--color-background)] text-[var(--color-brand-teal)] shadow-sm hover:opacity-90"
                aria-label="X (Twitter)"
              >
                <TwitterIcon className="size-5" aria-hidden />
              </NextLink>
              <NextLink
                href="#"
                className="border-border flex size-10 items-center justify-center rounded-full border bg-[var(--color-background)] text-[var(--color-brand-teal)] shadow-sm hover:opacity-90"
                aria-label="Instagram"
              >
                <Instagram className="size-5" aria-hidden />
              </NextLink>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`font-body text-foreground ${styles}`} id={id || undefined}>
      <div className="bg-[var(--color-background-muted)]">
        <div className="container grid gap-10 py-12 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:py-16">
          {/* Logo */}
          <div className="flex flex-col gap-4">
            {(hasLogo || isEditing) && (
              <NextLink
                href="/"
                className="inline-block max-w-[200px] shrink-0 no-underline"
                aria-label={demoIntranetBrand.homeAriaLabel}
              >
                {hasLogo ? (
                  <ContentSdkImage
                    field={logoField}
                    className="h-auto max-h-14 w-full object-contain object-left"
                  />
                ) : (
                  <CenovusBrandLogo className="h-auto max-h-14 w-full object-contain object-left" />
                )}
              </NextLink>
            )}
          </div>

          {/* Links */}
          <div>
            {(ds?.linksHeading?.jsonValue || isEditing) && (
              <h2 className="font-heading mb-4 text-base font-bold text-[var(--color-foreground)]">
                <Text field={ds?.linksHeading?.jsonValue} />
              </h2>
            )}
            <ul className="flex flex-col gap-3">
              {linkItems.map((row) => {
                const f = row.footerLink?.jsonValue;
                const external = isExternalHref(f);
                const show = hasHref(f) || isEditing;
                if (!show) {
                  return null;
                }
                return (
                  <li key={row.id}>
                    <span className="inline-flex items-center gap-2">
                      <SitecoreLink
                        field={f}
                        className="text-foreground-light hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
                      />
                      {hasHref(f) && external && (
                        <ExternalLink
                          className="text-foreground-light size-3.5 shrink-0"
                          aria-hidden
                        />
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            {(ds?.supportHeading?.jsonValue || isEditing) && (
              <h2 className="font-heading text-base font-bold text-[var(--color-foreground)]">
                <Text field={ds?.supportHeading?.jsonValue} />
              </h2>
            )}
            {(ds?.supportBody?.jsonValue || isEditing) && (
              <div className="text-foreground-light text-sm leading-relaxed [&_a]:text-[var(--color-accent)] [&_a]:underline">
                <RichText field={ds?.supportBody?.jsonValue} />
              </div>
            )}
            {ds?.supportCta?.jsonValue && (
              <SitecoreLink
                field={ds.supportCta.jsonValue}
                className="font-heading mt-1 inline-flex items-center gap-2 text-sm font-bold tracking-wide uppercase no-underline transition-opacity hover:opacity-80"
              >
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </SitecoreLink>
            )}
          </div>

          {/* Feedback */}
          <div className="flex flex-col gap-4">
            {(ds?.feedbackHeading?.jsonValue || isEditing) && (
              <h2 className="font-heading text-base font-bold text-[var(--color-foreground)]">
                <Text field={ds?.feedbackHeading?.jsonValue} />
              </h2>
            )}
            {formAction.length > 0 ? (
              <form className="flex flex-col gap-3" action={formAction} method="post" noValidate>
                <label className="sr-only" htmlFor={`${id || 'cenovus-footer'}-feedback`}>
                  Feedback message
                </label>
                <textarea
                  id={`${id || 'cenovus-footer'}-feedback`}
                  name="message"
                  rows={5}
                  placeholder={placeholder}
                  className="border-border focus-visible:ring-accent min-h-[120px] w-full resize-y rounded-lg border-0 bg-[var(--color-background)] p-4 text-sm text-[var(--color-foreground)] shadow-inner placeholder:text-[var(--color-foreground-light)] focus-visible:ring-2 focus-visible:outline-none"
                />
                <button
                  type="submit"
                  className="font-heading inline-flex w-fit items-center gap-2 self-start border-0 bg-transparent p-0 text-sm font-bold tracking-wide uppercase underline-offset-4 transition-opacity hover:opacity-80"
                >
                  {sendLabel}
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-3">
                <label className="sr-only" htmlFor={`${id || 'cenovus-footer'}-feedback-preview`}>
                  Feedback message
                </label>
                <textarea
                  id={`${id || 'cenovus-footer'}-feedback-preview`}
                  name="message"
                  rows={5}
                  placeholder={placeholder}
                  className="border-border focus-visible:ring-accent min-h-[120px] w-full resize-y rounded-lg border-0 bg-[var(--color-background)] p-4 text-sm text-[var(--color-foreground)] shadow-inner placeholder:text-[var(--color-foreground-light)] focus-visible:ring-2 focus-visible:outline-none"
                />
                <button
                  type="button"
                  disabled
                  className="font-heading inline-flex w-fit cursor-not-allowed items-center gap-2 self-start border-0 bg-transparent p-0 text-sm font-bold tracking-wide uppercase opacity-60"
                >
                  {sendLabel}
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-border border-t bg-neutral-400/25">
        <div className="container flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          {(ds?.copyrightLine?.jsonValue || isEditing) && (
            <p className="text-foreground-light text-xs sm:text-sm">
              <Text field={ds?.copyrightLine?.jsonValue} />
            </p>
          )}
          <div className="flex items-center gap-3 sm:gap-4">
            {socialEntries.map(({ key, field, Icon, label }) => {
              const lf = field?.jsonValue;
              if (!hasHref(lf) && !isEditing) {
                return null;
              }
              if (!lf) {
                return isEditing ? (
                  <span
                    key={key}
                    className="border-border flex size-10 items-center justify-center rounded-full border bg-[var(--color-background)] text-[10px] font-medium text-[var(--color-foreground)] shadow-sm"
                  >
                    {label}
                  </span>
                ) : null;
              }
              return (
                <SitecoreLink
                  key={key}
                  field={lf}
                  className="border-border flex size-10 items-center justify-center rounded-full border bg-[var(--color-background)] text-[var(--color-foreground)] shadow-sm transition-opacity hover:opacity-90"
                  aria-label={label}
                >
                  <Icon className="size-5" aria-hidden />
                </SitecoreLink>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
