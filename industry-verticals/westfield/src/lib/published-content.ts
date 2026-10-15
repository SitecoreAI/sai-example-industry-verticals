import type { ImageField } from '@sitecore-content-sdk/nextjs';
import { articleReadingTime } from './article-reading-time';
import { plainText } from './plain-text';
import scConfig from 'sitecore.config';

export { plainText } from './plain-text';

const HOME_ID = '27da11a8e0dc42d49e3fb4073306679b';
const HOME_PATH = '/sitecore/content/Westfield/westfield/Home';
const ARTICLE_PAGE_TEMPLATE_ID = '31f25fea085e51939637b13fc2f7a385';

export type PublishedPage = {
  id: string;
  title: string;
  summary: string;
  topic: string;
  readTime: string;
  publishedDate: string;
  image?: ImageField;
  url: string;
  body: string;
  isArticle: boolean;
};

export type PublishedArticle = PublishedPage & { isArticle: true };

export type SearchResult = {
  id: string;
  title: string;
  snippet: string;
  topic: string;
  url: string;
};

export type SearchResponse = { query: string; total: number; results: SearchResult[] };

type NativeItem = {
  id: string;
  name: string;
  path: string;
  template: { id: string };
  url: { path: string };
  rendered: unknown;
  title: { jsonValue: unknown } | null;
  summary: { jsonValue: unknown } | null;
  topic: { jsonValue: unknown } | null;
  publishedDate: { jsonValue: unknown } | null;
  image: { jsonValue: unknown } | null;
};

type NativeSearch = {
  total: number;
  pageInfo: { hasNext: boolean; endCursor: string };
  results: NativeItem[];
};

const PUBLISHED_PAGES_QUERY = `
  query PublishedWestfieldPages($after: String) {
    search(
      where: { AND: [
        { name: "_path", value: "${HOME_ID}", operator: CONTAINS }
        { name: "_hasLayout", value: "true", operator: EQ }
        { name: "_language", value: "en", operator: EQ }
      ] }
      first: 50
      after: $after
    ) {
      total
      pageInfo { hasNext endCursor }
      results {
        id name path template { id } url { path } rendered
        title: field(name: "Title") { jsonValue }
        summary: field(name: "pageSummary") { jsonValue }
        topic: field(name: "Topic") { jsonValue }
        publishedDate: field(name: "PublishedDate") { jsonValue }
        image: field(name: "HeroImage") { jsonValue }
      }
    }
  }
`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const stringValue = (field: unknown): string =>
  isRecord(field) && typeof field.value === 'string' ? field.value : '';

export function safeLocalRoute(value: string): string | undefined {
  if (!value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) {
    return undefined;
  }
  const url = new URL(value, 'https://westfield.example.invalid');
  if (url.origin !== 'https://westfield.example.invalid') return undefined;
  return url.pathname;
}

function mainText(rendered: unknown): { headings: string[]; bodies: string[] } {
  const layout = typeof rendered === 'string' ? JSON.parse(rendered) : rendered;
  const sitecore = isRecord(layout) && isRecord(layout.sitecore) ? layout.sitecore : undefined;
  const route = sitecore && isRecord(sitecore.route) ? sitecore.route : undefined;
  const placeholders = route && isRecord(route.placeholders) ? route.placeholders : undefined;
  const headings: string[] = [];
  const bodies: string[] = [];

  const visit = (components: unknown): void => {
    if (!Array.isArray(components)) return;
    for (const component of components) {
      if (!isRecord(component)) continue;
      if (isRecord(component.fields)) {
        const heading = plainText(stringValue(component.fields.Heading));
        const body = plainText(stringValue(component.fields.Body));
        if (heading) headings.push(heading);
        if (body) bodies.push(body);
      }
      if (isRecord(component.placeholders)) Object.values(component.placeholders).forEach(visit);
    }
  };
  // Do not index shared shell content or alternate personalized experiences.
  visit(placeholders?.['headless-main']);
  return { headings, bodies };
}

function publishedPage(item: NativeItem): PublishedPage | undefined {
  if (item.path !== HOME_PATH && !item.path.startsWith(`${HOME_PATH}/`)) return undefined;
  const url = safeLocalRoute(item.url.path);
  if (!url || url.replace(/\/$/, '').toLowerCase() === '/search') return undefined;
  const text = mainText(item.rendered);
  const title = plainText(stringValue(item.title?.jsonValue)) || text.headings[0] || item.name;
  const summary = plainText(stringValue(item.summary?.jsonValue)) || text.bodies[0] || '';
  const image = item.image?.jsonValue;
  const imageField =
    isRecord(image) && isRecord(image.value) && typeof image.value.src === 'string'
      ? (image as unknown as ImageField)
      : undefined;
  const isArticle =
    item.template.id.replace(/[{}-]/g, '').toLowerCase() === ARTICLE_PAGE_TEMPLATE_ID;

  return {
    id: item.id,
    title,
    summary,
    topic: plainText(stringValue(item.topic?.jsonValue)),
    readTime: isArticle
      ? articleReadingTime(item.rendered, stringValue(item.summary?.jsonValue))
      : '',
    publishedDate: stringValue(item.publishedDate?.jsonValue),
    image: imageField,
    url,
    body: [...text.headings, ...text.bodies].join(' '),
    isArticle,
  };
}

async function fetchPublishedBatch(after?: string): Promise<NativeSearch> {
  // Always use the live browser context, including on the separate preview editing host.
  const contextId = scConfig.api.edge.clientContextId;
  if (!contextId) throw new Error('Published content is not configured.');
  const edgeUrl = scConfig.api.edge.edgeUrl || 'https://edge-platform.sitecorecloud.io';
  const endpoint = `${edgeUrl.replace(/\/$/, '')}/v1/content/api/graphql/v1?sitecoreContextId=${encodeURIComponent(contextId)}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: PUBLISHED_PAGES_QUERY, variables: { after } }),
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Published content is temporarily unavailable.');
    const payload = await response.json();
    if (payload.errors?.length || !payload.data?.search) {
      throw new Error('Published content is temporarily unavailable.');
    }
    return payload.data.search as NativeSearch;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPublishedPages(): Promise<PublishedPage[]> {
  const pages: PublishedPage[] = [];
  let after: string | undefined;
  for (let batch = 0; batch < 10; batch += 1) {
    const data = await fetchPublishedBatch(after);
    for (const item of data.results) {
      const page = publishedPage(item);
      if (page) pages.push(page);
    }
    if (!data.pageInfo.hasNext) return pages;
    if (!data.pageInfo.endCursor || data.pageInfo.endCursor === after) break;
    after = data.pageInfo.endCursor;
  }
  throw new Error('The published content listing could not be completed.');
}

export async function getPublishedArticles(): Promise<PublishedArticle[]> {
  const pages = await getPublishedPages();
  return pages
    .filter((page): page is PublishedArticle => page.isArticle)
    .sort((first, second) => first.title.localeCompare(second.title, 'en'));
}

const normalize = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function validateSearchQuery(value: unknown): string {
  if (typeof value !== 'string' || !value.trim())
    throw new Error('Enter a word or phrase to search.');
  const query = value.replace(/\s+/g, ' ').trim();
  if (query.length > 120) throw new Error('Use 120 characters or fewer.');
  if (/[\u0000-\u001f]/.test(query) || !/[a-z\d]/.test(normalize(query))) {
    throw new Error('Enter a word or phrase to search.');
  }
  return query;
}

function snippet(page: PublishedPage, terms: string[]): string {
  const source = page.body || page.summary;
  const normalized = normalize(source);
  const firstMatch = terms.reduce((found, term) => {
    const index = normalized.indexOf(term);
    return index >= 0 && (found < 0 || index < found) ? index : found;
  }, -1);
  const start = firstMatch > 70 ? firstMatch - 70 : 0;
  const text = source.slice(start, start + 210);
  return `${start ? '…' : ''}${text}${start + 210 < source.length ? '…' : ''}`;
}

/** Simple keyword matching over published native content; this is not the Sitecore Search product. */
export function searchPublishedPages(pages: PublishedPage[], query: string): SearchResponse {
  const terms = Array.from(new Set(normalize(query).match(/[a-z\d]+/g) || []));
  const matches = pages
    .map((page) => {
      const title = normalize(page.title);
      const summary = normalize(page.summary);
      const topic = normalize(page.topic);
      const body = normalize(page.body);
      const all = `${title} ${summary} ${topic} ${body}`;
      if (!terms.every((term) => all.includes(term))) return { page, score: 0 };
      const score = terms.reduce(
        (total, term) =>
          total +
          (title.includes(term) ? 8 : 0) +
          (summary.includes(term) ? 4 : 0) +
          (topic.includes(term) ? 4 : 0) +
          (body.includes(term) ? 1 : 0),
        0
      );
      return { page, score };
    })
    .filter((match) => match.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score || first.page.title.localeCompare(second.page.title, 'en')
    );

  return {
    query,
    total: matches.length,
    results: matches.map(({ page }) => ({
      id: page.id,
      title: page.title,
      snippet: snippet(page, terms),
      topic: page.topic,
      url: page.url,
    })),
  };
}
