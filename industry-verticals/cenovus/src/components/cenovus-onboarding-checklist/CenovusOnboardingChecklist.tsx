'use client';

import { IGQLTextField } from '@/types/igql';
import {
  ComponentParams,
  ComponentRendering,
  RichText as ContentSdkRichText,
  RichTextField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ExternalLink } from 'lucide-react';
import React, { JSX } from 'react';

interface Fields {
  data: {
    datasource?: {
      headline?: IGQLTextField;
      copy?: { jsonValue: RichTextField };
    };
  };
}

type IntegratedFields = Fields & { datasource?: Fields['data']['datasource'] };

type CenovusOnboardingChecklistProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

function formatDueDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(d);
}

/** Hard-coded onboarding checklist steps (not Sitecore-authored). */
const ONBOARDING_CHECKLIST_ITEMS: ReadonlyArray<{ id: string; label: string; dueIso: string }> = [
  {
    id: 'onb-1',
    label: 'Finish accounts setup (SSO, MFA, laptop encryption)',
    dueIso: '2026-05-14',
  },
  {
    id: 'onb-2',
    label: 'Complete security & data-handling acknowledgment',
    dueIso: '2026-05-16',
  },
  {
    id: 'onb-3',
    label: 'Meet your manager and assigned onboarding buddy',
    dueIso: '2026-05-20',
  },
  {
    id: 'onb-4',
    label: 'Enroll in payroll, benefits, and emergency contacts',
    dueIso: '2026-05-27',
  },
  {
    id: 'onb-5',
    label: 'Review intranet policies and submit equipment acceptance',
    dueIso: '2026-06-03',
  },
];

export const Default = (props: CenovusOnboardingChecklistProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const merged = (props.fields ?? props.rendering?.fields) as IntegratedFields | undefined;
  const ds = merged?.data?.datasource ?? merged?.datasource;

  const headline = ds?.headline;
  const copy = ds?.copy;
  const copyField: RichTextField = copy?.jsonValue ?? ({} as RichTextField);

  const showIntro = isEditing || Boolean(headline?.jsonValue?.value) || Boolean(copyField?.value);

  return (
    <section
      className={`cenovus-onboarding-checklist font-body bg-background text-foreground ${props.params.styles || ''}`}
      id={id || undefined}
    >
      <div className="w-full py-0">
        <div className="cenovus-homepage-panel">
          {showIntro && (
            <header className="mb-8 max-w-3xl">
              {(headline?.jsonValue?.value || isEditing) && (
                <h2 className="font-heading text-3xl tracking-tight text-[var(--color-brand-teal)] md:text-4xl">
                  <Text field={headline?.jsonValue} />
                </h2>
              )}
              {(copyField?.value || isEditing) && (
                <div className="text-foreground-light mt-4 max-w-3xl text-base leading-relaxed md:text-lg [&_p]:mb-3 [&_p:last-child]:mb-0">
                  <ContentSdkRichText field={copyField} />
                </div>
              )}
            </header>
          )}

          <div className={showIntro ? 'border-t border-[var(--color-border)] pt-8' : undefined}>
            <p className="font-heading text-sm font-semibold tracking-[0.14em] text-[var(--color-brand-teal)] uppercase">
              Suggested timeline
            </p>
            <ol className="mt-6 space-y-0">
              {ONBOARDING_CHECKLIST_ITEMS.map((item, index) => (
                <li
                  key={item.id}
                  className="relative flex gap-4 pb-8 pl-1 last:pb-0 md:gap-6 [&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:top-8 [&:not(:last-child)]:before:left-[15px] [&:not(:last-child)]:before:h-[calc(100%-0.5rem)] [&:not(:last-child)]:before:w-px [&:not(:last-child)]:before:bg-[var(--color-border)] md:[&:not(:last-child)]:before:left-[19px]"
                >
                  <span
                    className="relative z-[1] mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-brand-teal)] bg-[var(--color-background)] text-sm font-semibold text-[var(--color-brand-teal)] tabular-nums md:size-10 md:text-base"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-base leading-snug font-medium text-[var(--color-foreground)]">
                      {item.label}
                      <ExternalLink
                        className="ml-1 inline-block size-[1.05em] shrink-0 align-[-0.15em] text-[var(--color-accent)] opacity-90"
                        strokeWidth={2.25}
                        aria-hidden
                      />
                    </p>
                    <p className="text-foreground-light mt-2 text-sm">
                      <span className="font-medium text-[var(--color-foreground)]">Due: </span>
                      <time dateTime={item.dueIso}>{formatDueDate(item.dueIso)}</time>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
