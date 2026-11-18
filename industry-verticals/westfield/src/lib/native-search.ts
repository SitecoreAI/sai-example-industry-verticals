import { SearchService } from '@sitecore-content-sdk/search';
import type { SearchDocument } from '@sitecore-content-sdk/search';
import scConfig from 'sitecore.config';
import { getPublishedPages, safeLocalRoute, searchResult } from 'lib/published-content';
import type { SearchResponse } from 'lib/published-content';

const SITE_ORIGIN = 'https://thlt-westfield-demo.vercel.app';
const RESULT_LIMIT = 500;

type IndexedSitePage = SearchDocument & { sc_url: string };

function pageRoute(indexedUrl: string): string | undefined {
  try {
    const url = new URL(indexedUrl);
    if (url.origin !== SITE_ORIGIN) return undefined;
    const route = safeLocalRoute(url.pathname);
    return route === '/' ? route : route?.replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

/** Native Search chooses and orders matches; live CMS data supplies their displayed content. */
export async function searchNativePages(query: string): Promise<SearchResponse> {
  const searchIndexId = process.env.SITECORE_SEARCH_INDEX_ID;
  const contextId = scConfig.api.edge.clientContextId;
  if (!searchIndexId || !contextId) throw new Error('Website search is not configured.');

  const service = new SearchService({
    contextId,
    edgeUrl: scConfig.api.edge.edgeUrl,
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const [native, pages] = await Promise.all([
      service.search<IndexedSitePage>(
        { searchIndexId, keyphrase: query, limit: RESULT_LIMIT },
        { cache: 'no-store', signal: controller.signal }
      ),
      getPublishedPages(),
    ]);
    const publishedByRoute = new Map(
      pages.map((page) => [page.url.replace(/\/$/, '') || '/', page])
    );
    const visited = new Set<string>();
    const results = [];
    for (const document of native.results) {
      if (typeof document.sc_url !== 'string') throw new Error('Search result URL is missing.');
      const route = pageRoute(document.sc_url);
      const page = route && publishedByRoute.get(route);
      // A stale crawler entry must not reveal an unpublished or retired page.
      if (!page || visited.has(page.id)) continue;
      visited.add(page.id);
      results.push(searchResult(page, query));
    }
    return { query, total: results.length, results };
  } finally {
    clearTimeout(timeout);
  }
}
