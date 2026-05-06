/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, Page, ImageField } from '@sitecore-content-sdk/nextjs';
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

/** Stacks on small screens; from lg: first rendering ~8/12 cols, second ~4/12; single child spans full row. */
const cenovusMainTwoColumnBandGridClass =
  'grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8 [&>*:nth-child(1)]:min-w-0 [&>*:nth-child(1)]:lg:col-span-8 [&>*:nth-child(2)]:min-w-0 [&>*:nth-child(2)]:lg:col-span-4 [&>*:only-child]:lg:col-span-12';

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';

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
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          <DesignLibraryLayout />
        ) : (
          <>
            <header>
              <div id="header">
                {route && <Placeholder name="headless-header" rendering={route} />}
              </div>
            </header>
            <main>
              <div id="content">
                {route && (
                  <div className="cenovus-main-hero-band mx-auto w-full max-w-[1600px]">
                    <div className={cenovusMainTwoColumnBandGridClass}>
                      <Placeholder name="headless-main-hero-band" rendering={route} />
                    </div>
                  </div>
                )}
                {route && <Placeholder name="headless-main" rendering={route} />}
                {route && (
                  <div className="cenovus-main-news-spotlights-band mx-auto w-full max-w-[1600px]">
                    <div className={cenovusMainTwoColumnBandGridClass}>
                      <Placeholder name="headless-main-news-spotlights-band" rendering={route} />
                    </div>
                  </div>
                )}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
