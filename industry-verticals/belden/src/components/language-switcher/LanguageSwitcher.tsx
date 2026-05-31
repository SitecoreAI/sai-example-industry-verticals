'use client';

import React, { useMemo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../shadcn/components/ui/select';
import { Globe } from 'lucide-react';
import { ComponentProps } from '@/lib/component-props';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { localeOptions } from '@/constants/localeOptions';
import clsx from 'clsx';

export type LanguageSwitcherProps = ComponentProps & {
  params: { [key: string]: string };
};

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  const { styles, RenderingIdentifier: id } = props.params;
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [shouldHide, setShouldHide] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const { pathname, asPath, query } = router;

  const { page } = useSitecore();
  const activeLocale = useMemo<string>(() => page?.locale as string, [page?.locale]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const header = element.closest('.component.header');
    if (!header || element.closest('.header-right')) {
      setIsReady(true);
      return;
    }

    const leftSlot = element.closest('.header-left');
    if (!leftSlot) {
      setIsReady(true);
      return;
    }

    const rightSlot = header.querySelector('.header-right');
    if (!rightSlot) {
      setIsReady(true);
      return;
    }

    const existingSwitcher = rightSlot.querySelector('.language-switcher');
    if (existingSwitcher && existingSwitcher !== element) {
      setShouldHide(true);
      setIsReady(true);
      return;
    }

    setPortalTarget(rightSlot as HTMLElement);
    setIsReady(true);
  }, []);

  const changeLanguage = useCallback(
    (langCode: string) => {
      if (pathname && asPath && query) {
        router.push(
          {
            pathname,
            query,
          },
          asPath,
          {
            locale: langCode,
            shallow: false,
          }
        );
      }
    },
    [asPath, pathname, query, router]
  );

  const selectedLocale: string = localeOptions.some((l) => l.code === activeLocale)
    ? activeLocale
    : 'en';

  if (shouldHide) {
    return null;
  }

  const content = (
    <div
      ref={containerRef}
      className={clsx('component language-switcher', styles, !isReady && 'opacity-0')}
      id={id}
    >
      <Select value={selectedLocale} onValueChange={(value) => changeLanguage(value as string)}>
        <SelectTrigger
          id="language-select"
          aria-label={`Current Language: ${selectedLocale}`}
          className="border-0 shadow-none [&>svg]:hidden [.component.header_&]:px-1"
        >
          <div className="flex items-center gap-2">
            <Globe className="size-5" />
            <span className="max-lg:hidden">
              <SelectValue placeholder="Language" />
            </span>
          </div>
        </SelectTrigger>
        <SelectContent className="min-w-44 border-0">
          {localeOptions.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <span>{language.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  if (portalTarget) {
    return createPortal(content, portalTarget);
  }

  return content;
}
