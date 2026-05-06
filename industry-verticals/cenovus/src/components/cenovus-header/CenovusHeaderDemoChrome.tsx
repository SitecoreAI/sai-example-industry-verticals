'use client';

import { CenovusBrandLogo } from '@/components/cenovus-brand/CenovusBrandLogo';
import {
  demoHeaderUtility,
  demoIntranetBrand,
  demoNav,
  demoRegionDefault,
  demoRegions,
  type DemoRegion,
} from '@/lib/cenovus-demo';
import { ChevronDown, Menu, Search, TrendingDown, TrendingUp, X } from 'lucide-react';
import NextLink from 'next/link';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';

import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/shadcn/components/ui/drawer';

type Props = {
  id?: string;
  styles?: string;
};

/** Full intranet header layout when no CMS header datasource is connected. */
export function CenovusHeaderDemoChrome({ id, styles = '' }: Props): JSX.Element {
  const searchAction = '/search';
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<DemoRegion>(demoRegionDefault);
  const shellRef = useRef<HTMLElement>(null);

  const closeAll = useCallback(() => {
    setOpenMenuId(null);
    setRegionOpen(false);
  }, []);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = shellRef.current;
      if (!el || !(e.target instanceof Node) || el.contains(e.target)) return;
      closeAll();
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [closeAll]);

  return (
    <header
      ref={shellRef}
      className={`font-body bg-background text-foreground shadow-sm ${styles}`}
      id={id || undefined}
    >
      <div className="h-1 bg-[var(--color-brand-teal)]" aria-hidden />

      <div className="border-border border-b bg-[var(--color-background-muted)]/60">
        <div className="container flex flex-col gap-3 py-2 text-sm md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-foreground shrink-0">{demoHeaderUtility.welcomeText}</span>
            <div className="relative">
              <button
                type="button"
                className="text-foreground-light hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
                aria-expanded={regionOpen}
                aria-haspopup="listbox"
                onClick={() => {
                  setRegionOpen((o) => !o);
                  setOpenMenuId(null);
                }}
              >
                <span className="text-foreground-light">{demoHeaderUtility.regionPrefix}</span>
                <span className="text-foreground font-semibold">{selectedOffice}</span>
                <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
              </button>
              {regionOpen && (
                <ul
                  className="border-border absolute left-0 z-50 mt-1 min-w-[12rem] rounded-md border bg-[var(--color-background)] py-1 shadow-md"
                  role="listbox"
                >
                  {demoRegions.map((r) => (
                    <li key={r}>
                      <button
                        type="button"
                        className="hover:bg-background-accent block w-full px-3 py-2 text-left text-sm"
                        onClick={() => {
                          setSelectedOffice(r);
                          setRegionOpen(false);
                        }}
                      >
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:flex-1 md:justify-center">
            {demoHeaderUtility.stocks.map((s) => (
              <span
                key={s.label}
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  s.trend === 'down' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]'
                }`}
              >
                {s.trend === 'down' ? (
                  <TrendingDown className="size-4 shrink-0" aria-hidden />
                ) : (
                  <TrendingUp className="size-4 shrink-0" aria-hidden />
                )}
                {s.display}
              </span>
            ))}
          </div>

          <nav
            className="text-foreground-light flex flex-wrap items-center gap-x-4 gap-y-1 md:justify-end"
            aria-label="Utility links"
          >
            {demoHeaderUtility.utilityLinks.map((u) => (
              <NextLink
                key={u.label}
                href={u.href}
                className="text-xs underline-offset-4 transition-colors hover:text-[var(--color-foreground)] hover:underline"
              >
                {u.label}
              </NextLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-border border-b-4 border-[var(--color-brand-teal)]">
        <div className="container flex items-center gap-4 py-3 lg:gap-8">
          <NextLink
            href="/"
            className="block shrink-0 text-[var(--color-foreground)] no-underline"
            aria-label={demoIntranetBrand.homeAriaLabel}
          >
            <CenovusBrandLogo className="h-10 w-auto max-w-[200px] object-contain" priority />
          </NextLink>

          <nav
            className="font-heading hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {demoNav.map((item) => {
              const open = openMenuId === item.label;
              const hasSubs = item.children.length > 0;
              if (hasSubs) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-1 px-2 py-2 text-xs font-bold tracking-wide text-[var(--color-brand-teal)] uppercase hover:text-[var(--color-accent)]"
                      aria-expanded={open}
                      aria-haspopup="true"
                      onClick={() => {
                        setRegionOpen(false);
                        setOpenMenuId(open ? null : item.label);
                      }}
                    >
                      {item.label}
                      <ChevronDown className="size-3.5 shrink-0 opacity-70" aria-hidden />
                    </button>
                    {open && (
                      <ul className="border-border absolute left-0 z-50 mt-0 min-w-[14rem] rounded-md border bg-[var(--color-background)] py-2 shadow-lg">
                        {item.children.map((sub) => (
                          <li key={sub.label}>
                            <NextLink
                              href={sub.href}
                              className="text-foreground hover:bg-background-accent block px-4 py-2 text-sm no-underline"
                            >
                              {sub.label}
                            </NextLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }
              return (
                <div key={item.label} className="px-1">
                  <NextLink
                    href={item.href}
                    className="inline-flex items-center px-2 py-2 text-xs font-bold tracking-wide text-[var(--color-brand-teal)] uppercase no-underline hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </NextLink>
                </div>
              );
            })}
          </nav>

          <form
            className="hidden min-w-0 flex-[0_1_20rem] lg:block lg:flex-[0_1_24rem]"
            action={searchAction}
            method="get"
            role="search"
          >
            <label className="relative block w-full">
              <span className="sr-only">Search</span>
              <input
                type="search"
                name="q"
                placeholder={demoHeaderUtility.searchPlaceholder}
                className="font-body border-border focus-visible:ring-accent w-full rounded-full border-0 bg-[var(--color-background-muted)] py-2.5 pr-11 pl-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-light)] focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-brand-teal)]">
                <Search className="size-5" aria-hidden />
              </span>
            </label>
          </form>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <form className="min-w-0 flex-1" action={searchAction} method="get" role="search">
              <label className="relative block">
                <span className="sr-only">Search</span>
                <input
                  type="search"
                  name="q"
                  placeholder={demoHeaderUtility.searchPlaceholder}
                  className="font-body border-border w-full min-w-0 rounded-full border-0 bg-[var(--color-background-muted)] py-2 pr-9 pl-3 text-sm"
                />
                <Search
                  className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-[var(--color-brand-teal)]"
                  aria-hidden
                />
              </label>
            </form>

            <Drawer direction="left">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="text-foreground hover:text-foreground-light p-2 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-background-accent !w-xl !max-w-full p-5">
                <div className="flex h-full flex-col">
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-[var(--color-brand-teal)] uppercase">
                      Menu
                    </span>
                    <DrawerClose asChild>
                      <button type="button" aria-label="Close menu">
                        <X className="h-5 w-5" />
                      </button>
                    </DrawerClose>
                  </div>
                  <ul className="flex flex-col gap-4">
                    {demoNav.map((item) => (
                      <li key={item.label} className="border-border border-b pb-4">
                        {item.children.length > 0 ? (
                          <>
                            <p className="font-heading mb-2 text-xs font-bold tracking-wide text-[var(--color-brand-teal)] uppercase">
                              {item.label}
                            </p>
                            <ul className="flex flex-col gap-2 pl-0">
                              {item.children.map((sub) => (
                                <li key={sub.label}>
                                  <NextLink
                                    href={sub.href}
                                    className="text-foreground text-sm no-underline underline-offset-4 hover:underline"
                                  >
                                    {sub.label}
                                  </NextLink>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <NextLink
                            href={item.href}
                            className="font-heading text-xs font-bold tracking-wide text-[var(--color-brand-teal)] uppercase no-underline"
                          >
                            {item.label}
                          </NextLink>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  );
}
