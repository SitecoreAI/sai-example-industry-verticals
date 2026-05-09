/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import { Placeholder, Field, Page, ImageField } from '@sitecore-content-sdk/nextjs';
import { isCenovusShowcaseShellEnabled } from '@/lib/cenovus-demo';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'src/components/content-sdk/SitecoreStyles';
import { DesignLibraryLayout } from './DesignLibraryLayout';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  metadataTitle?: Field;
  metadataKeywords?: Field;
  metadataDescription?: Field;
  pageSummary?: Field;
  ogImage?: ImageField;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  const showcaseShell = isCenovusShowcaseShellEnabled();

  const metaDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';
  const metaKeywords = fields?.metadataKeywords?.value?.toString() || '';
  const ogTitle = fields?.metadataTitle?.value?.toString() || 'Page';
  const ogImage = fields?.ogImage?.value?.src;
  const ogDescription =
    fields?.metadataDescription?.value?.toString() || fields?.pageSummary?.value?.toString() || '';

  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{fields?.Title?.value?.toString() || 'Page'}</title>
        <link rel="icon" href="/favicon.ico" />
        {metaDescription && <meta name="description" content={metaDescription} />}
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        <link rel="icon" href="/favicon.ico" />
        {ogTitle && <meta property="og:title" content={ogTitle} />}
        {ogDescription && <meta property="og:description " content={ogDescription} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div
        className={clsx(
          'cenovus-site-root',
          mainClassPageEditing,
          showcaseShell && 'cenovus-layout-shell bg-background-muted flex min-h-screen flex-col'
        )}
      >
        {mode.isDesignLibrary ? (
          <DesignLibraryLayout />
        ) : (
          <>
            <div id="header">
              {route && <Placeholder name="headless-header" rendering={route} />}
            </div>
            <main className="flex min-h-0 flex-1 flex-col">
              <div id="content" className="flex min-h-0 flex-1 flex-col">
                {route && <Placeholder name="headless-main" rendering={route} />}
              </div>
            </main>
            <div id="footer">
              {route && <Placeholder name="headless-footer" rendering={route} />}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
