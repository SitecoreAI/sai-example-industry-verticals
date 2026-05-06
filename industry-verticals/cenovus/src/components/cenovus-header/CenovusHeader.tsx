'use client';

import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  Link as SitecoreLink,
  LinkField,
  NextImage as ContentSdkImage,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ChevronDown, Menu, Search, TrendingDown, TrendingUp, X } from 'lucide-react';
import NextLink from 'next/link';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';

import { demoIntranetBrand, demoRegionDefault, demoRegions } from '@/lib/cenovus-demo';
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from '@/shadcn/components/ui/drawer';
import { IGQLTextField } from '@/types/igql';

import { CenovusHeaderDemoChrome } from './CenovusHeaderDemoChrome';

interface NavSubLink {
  id: string;
  subLink: { jsonValue: LinkField };
}

interface NavItem {
  id: string;
  navItemTitle: { jsonValue: Field<string> };
  navItemLink: { jsonValue: LinkField };
  children: { results: NavSubLink[] };
}

interface DatasourceFields {
  welcomeText?: IGQLTextField;
  regionPrefix?: IGQLTextField;
  regionName?: IGQLTextField;
  utilityIntegrity?: { jsonValue: LinkField };
  utilityWorkday?: { jsonValue: LinkField };
  utilitySelfServe?: { jsonValue: LinkField };
  utilityCenovusCom?: { jsonValue: LinkField };
  logo?: { jsonValue: ImageField };
  stock1Text?: IGQLTextField;
  stock1Trend?: IGQLTextField;
  stock2Text?: IGQLTextField;
  stock2Trend?: IGQLTextField;
  searchPlaceholder?: IGQLTextField;
  searchUrl?: IGQLTextField;
  children?: { results: NavItem[] };
}

interface Fields {
  data: {
    datasource?: DatasourceFields;
  };
}

type CenovusHeaderProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: { [key: string]: string };
  fields: Fields;
};

function hasLinkHref(field?: LinkField): boolean {
  const href = field?.value?.href;
  return Boolean(href && href.length > 0);
}

function StockRow({
  textField,
  trendField,
}: {
  textField?: IGQLTextField;
  trendField?: IGQLTextField;
}): JSX.Element | null {
  const raw = String(trendField?.jsonValue?.value ?? '')
    .trim()
    .toLowerCase();
  const isDown = raw === 'down';
  const Icon = isDown ? TrendingDown : TrendingUp;
  const tone = isDown ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]';

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${tone}`}>
      <Icon className="size-4 shrink-0" aria-hidden />
      <Text field={textField?.jsonValue} />
    </span>
  );
}

function UtilityLinkRow({
  label,
  field,
  isEditing,
}: {
  label: string;
  field?: { jsonValue: LinkField };
  isEditing: boolean;
}): JSX.Element | null {
  const linkField = field?.jsonValue;
  if (!hasLinkHref(linkField) && !isEditing) {
    return null;
  }
  if (!linkField) {
    return isEditing ? (
      <span className="text-foreground-light text-xs underline-offset-4">{label}</span>
    ) : null;
  }
  return (
    <SitecoreLink
      field={linkField}
      className="text-foreground-light hover:text-foreground text-xs underline-offset-4 transition-colors hover:underline"
    >
      {!hasLinkHref(linkField) ? label : undefined}
    </SitecoreLink>
  );
}

export const Default = (props: CenovusHeaderProps): JSX.Element | null => {
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles ?? '';
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  const ds = props.fields?.data?.datasource;
  const navItems = ds?.children?.results ?? [];

  const logoField = ds?.logo?.jsonValue;
  const hasLogo = Boolean(logoField?.value?.src);

  const searchUrlRaw = String(ds?.searchUrl?.jsonValue?.value ?? '').trim();
  const searchAction = searchUrlRaw.length > 0 ? searchUrlRaw : '/search';

  const regionDefault = String(ds?.regionName?.jsonValue?.value ?? '').trim();
  const [selectedRegion, setSelectedRegion] = useState(regionDefault || demoRegionDefault);
  useEffect(() => {
    if (regionDefault) {
      setSelectedRegion(regionDefault);
    }
  }, [regionDefault]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [regionOpen, setRegionOpen] = useState(false);
  const shellRef = useRef<HTMLElement>(null);

  const closeAll = useCallback(() => {
    setOpenMenuId(null);
    setRegionOpen(false);
  }, []);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = shellRef.current;
      if (!el || !(e.target instanceof Node) || el.contains(e.target)) {
        return;
      }
      closeAll();
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [closeAll]);

  const utilityPairs: { label: string; field?: { jsonValue: LinkField } }[] = [
    { label: 'integrity helpline', field: ds?.utilityIntegrity },
    { label: 'Workday', field: ds?.utilityWorkday },
    { label: 'SelfServe', field: ds?.utilitySelfServe },
    { label: 'fluor.com', field: ds?.utilityCenovusCom },
  ];

  if (!isEditing && !ds) {
    return <CenovusHeaderDemoChrome id={id} styles={styles} />;
  }

  return (
    <header
      ref={shellRef}
      className={`font-body bg-background text-foreground shadow-sm ${styles}`}
      id={id || undefined}
    >
      <div className="h-1 bg-[var(--color-brand-teal)]" aria-hidden />
      {/* Utility bar */}
      <div className="border-border border-b bg-[var(--color-background-muted)]/60">
        <div className="container flex flex-col gap-3 py-2 text-sm md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            {(ds?.welcomeText?.jsonValue || isEditing) && (
              <span className="text-foreground shrink-0">
                <Text field={ds?.welcomeText?.jsonValue} />
              </span>
            )}
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
                {(ds?.regionPrefix?.jsonValue || isEditing) && (
                  <span className="text-foreground-light">
                    <Text field={ds?.regionPrefix?.jsonValue} />
                  </span>
                )}
                <span className="text-foreground font-semibold">{selectedRegion}</span>
                <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
              </button>
              {regionOpen && (
                <ul
                  className="border-border absolute left-0 z-50 mt-1 min-w-[12rem] rounded-md border bg-[var(--color-background)] py-1 shadow-md"
                  role="listbox"
                >
                  {demoRegions.map((r) => (
                    <li key={r} role="option" aria-selected={r === selectedRegion}>
                      <button
                        type="button"
                        className="hover:bg-background-accent block w-full px-3 py-2 text-left text-sm"
                        onClick={() => {
                          setSelectedRegion(r);
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

          <div className="flex flex-wrap items-center justify-center gap-4 md:flex-1 md:justify-center">
            {(ds?.stock1Text?.jsonValue || isEditing) && (
              <StockRow textField={ds?.stock1Text} trendField={ds?.stock1Trend} />
            )}
            {(ds?.stock2Text?.jsonValue || isEditing) && (
              <StockRow textField={ds?.stock2Text} trendField={ds?.stock2Trend} />
            )}
          </div>

          <nav
            className="text-foreground-light flex flex-wrap items-center gap-x-4 gap-y-1 md:justify-end"
            aria-label="Utility links"
          >
            {utilityPairs.map(({ label, field }) => (
              <UtilityLinkRow key={label} label={label} field={field} isEditing={isEditing} />
            ))}
          </nav>
        </div>
      </div>

      {/* Main row */}
      <div className="border-border container flex items-center gap-4 border-b-4 border-[var(--color-brand-teal)] py-3 lg:gap-8">
        <div className="flex min-w-0 shrink-0 items-center gap-3 lg:gap-6">
          {(hasLogo || isEditing) && (
            <NextLink
              href="/"
              className="block shrink-0 text-[var(--color-foreground)] no-underline"
              aria-label={demoIntranetBrand.homeAriaLabel}
            >
              {hasLogo ? (
                <ContentSdkImage
                  field={logoField}
                  className="h-10 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <div className="font-heading flex flex-col leading-tight">
                  <span className="text-2xl font-semibold lowercase italic">
                    {demoIntranetBrand.wordmarkLine1}
                  </span>
                  <span className="text-[0.65rem] font-normal tracking-[0.2em] uppercase">
                    {demoIntranetBrand.wordmarkLine2}
                  </span>
                </div>
              )}
            </NextLink>
          )}
        </div>

        {/* Desktop nav */}
        <nav
          className="font-heading hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const subs =
              item.children?.results?.filter((s) => hasLinkHref(s.subLink?.jsonValue)) ?? [];
            const titleField = item.navItemTitle?.jsonValue;
            const parentLink = item.navItemLink?.jsonValue;
            const hasSubs = subs.length > 0;
            const open = openMenuId === item.id;

            if (hasSubs) {
              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2 py-2 text-xs font-bold tracking-wide uppercase"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => {
                      setRegionOpen(false);
                      setOpenMenuId(open ? null : item.id);
                    }}
                  >
                    <Text field={titleField} />
                    <ChevronDown className="size-3.5 shrink-0 opacity-70" aria-hidden />
                  </button>
                  {open && (
                    <ul className="border-border absolute left-0 z-50 mt-0 min-w-[14rem] rounded-md border bg-[var(--color-background)] py-2 shadow-lg">
                      {subs.map((sub) => (
                        <li key={sub.id}>
                          <SitecoreLink
                            field={sub.subLink?.jsonValue}
                            className="text-foreground hover:bg-background-accent block px-4 py-2 text-sm no-underline"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }

            return (
              <div key={item.id} className="px-1">
                <SitecoreLink
                  field={parentLink}
                  className="inline-flex items-center px-2 py-2 text-xs font-bold tracking-wide uppercase no-underline"
                >
                  {(titleField || isEditing) && <Text field={titleField} />}
                </SitecoreLink>
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
              placeholder={(ds?.searchPlaceholder?.jsonValue?.value as string) || 'Search'}
              className="font-body border-border focus-visible:ring-accent w-full rounded-full border-0 bg-[var(--color-background-muted)] py-2.5 pr-11 pl-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-light)] focus-visible:ring-2 focus-visible:outline-none"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[var(--color-foreground)]">
              <Search className="size-5" aria-hidden />
            </span>
          </label>
        </form>

        {/* Mobile drawer */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <form className="min-w-0 flex-1" action={searchAction} method="get" role="search">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <input
                type="search"
                name="q"
                placeholder={(ds?.searchPlaceholder?.jsonValue?.value as string) || 'Search'}
                className="font-body border-border w-full min-w-0 rounded-full border-0 bg-[var(--color-background-muted)] py-2 pr-9 pl-3 text-sm"
              />
              <Search
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2"
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
                  <span className="font-heading text-sm font-bold uppercase">Menu</span>
                  <DrawerClose asChild>
                    <button type="button" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </button>
                  </DrawerClose>
                </div>
                <ul className="flex flex-col gap-4">
                  {navItems.map((item) => {
                    const subs =
                      item.children?.results?.filter((s) => hasLinkHref(s.subLink?.jsonValue)) ??
                      [];
                    const titleField = item.navItemTitle?.jsonValue;
                    const parentLink = item.navItemLink?.jsonValue;
                    return (
                      <li key={item.id} className="border-border border-b pb-4">
                        {subs.length > 0 ? (
                          <>
                            <p className="font-heading mb-2 text-xs font-bold tracking-wide uppercase">
                              <Text field={titleField} />
                            </p>
                            <ul className="flex flex-col gap-2 pl-0">
                              {subs.map((sub) => (
                                <li key={sub.id}>
                                  <SitecoreLink
                                    field={sub.subLink?.jsonValue}
                                    className="text-foreground text-sm no-underline underline-offset-4 hover:underline"
                                  />
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <SitecoreLink
                            field={parentLink}
                            className="font-heading text-xs font-bold tracking-wide uppercase no-underline"
                          >
                            <Text field={titleField} />
                          </SitecoreLink>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};
