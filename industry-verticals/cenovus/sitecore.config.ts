import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

const personalizeEdgeMs = parseInt(process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT || '400', 10);
const personalizeCdpMs = parseInt(
  process.env.PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT || process.env.PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT || '400',
  10,
);

/**
 * @type {import('@sitecore-content-sdk/nextjs/config').SitecoreConfig}
 * See: https://doc.sitecore.com/xmc/en/developers/content-sdk/the-sitecore-configuration-file.html
 *
 * For local builds, copy `.env.remote.example` to `.env.local` and set `SITECORE_EDGE_CONTEXT_ID`
 * (and related vars). `sitecore.cli.config.ts` loads `.env` / `.env.local` before Sitecore CLI tasks.
 */
export default defineConfig({
  api: {
    edge: {
      contextId:
        process.env.SITECORE_EDGE_CONTEXT_ID || process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID || '',
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      edgeUrl: process.env.SITECORE_EDGE_URL || process.env.NEXT_PUBLIC_SITECORE_EDGE_URL,
    },
    local: {
      apiKey: process.env.NEXT_PUBLIC_SITECORE_API_KEY || '',
      apiHost: process.env.NEXT_PUBLIC_SITECORE_API_HOST || '',
    },
  },
  defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME,
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  editingSecret: process.env.SITECORE_EDITING_SECRET,
  redirects: {
    enabled: true,
    locales: ['en'],
  },
  multisite: {
    enabled: true,
    useCookieResolution: () => process.env.VERCEL_ENV === 'preview',
  },
  personalize: {
    scope: process.env.NEXT_PUBLIC_PERSONALIZE_SCOPE,
    edgeTimeout: Number.isNaN(personalizeEdgeMs) ? 400 : personalizeEdgeMs,
    cdpTimeout: Number.isNaN(personalizeCdpMs) ? 400 : personalizeCdpMs,
  },
});
