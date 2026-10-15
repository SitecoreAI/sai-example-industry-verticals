import { plainText } from './plain-text';

const WORDS_PER_MINUTE = 200;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const fieldValue = (field: unknown): string =>
  isRecord(field) && typeof field.value === 'string' ? field.value : '';

/** An estimate for readable article copy; blank drafts have no reading time. */
export function readingTime(copy: string): string {
  const words = plainText(copy).match(new RegExp("[\\p{L}\\p{N}]+(?:['’-][\\p{L}\\p{N}]+)*", 'gu'));
  return words?.length ? `${Math.ceil(words.length / WORDS_PER_MINUTE)} min read` : '';
}

/** Use only the native article body, excluding navigation and other page/design content. */
export function articleReadingTime(rendered: unknown, summary = ''): string {
  let layout = rendered;
  if (typeof layout === 'string') {
    try {
      layout = JSON.parse(layout);
    } catch {
      return '';
    }
  }
  const sitecore = isRecord(layout) && isRecord(layout.sitecore) ? layout.sitecore : undefined;
  const route = sitecore && isRecord(sitecore.route) ? sitecore.route : undefined;
  const placeholders = route && isRecord(route.placeholders) ? route.placeholders : undefined;
  const copy: string[] = [summary];

  const visit = (components: unknown): void => {
    if (!Array.isArray(components)) return;
    for (const component of components) {
      if (!isRecord(component)) continue;
      if (component.componentName === 'ArticleBodyLayout' && isRecord(component.placeholders)) {
        for (const [key, children] of Object.entries(component.placeholders)) {
          if (!/^article-content-\d+$/.test(key) || !Array.isArray(children)) continue;
          for (const child of children) {
            if (
              !isRecord(child) ||
              !['ArticleText', 'CampaignAction'].includes(String(child.componentName)) ||
              !isRecord(child.fields)
            ) {
              continue;
            }
            copy.push(fieldValue(child.fields.Heading), fieldValue(child.fields.Body));
            const link = child.fields.Link;
            if (isRecord(link) && isRecord(link.value) && typeof link.value.href === 'string') {
              // Match the Content SDK Link's text-or-href label, never its hidden target URL.
              copy.push(
                typeof link.value.text === 'string' && link.value.text
                  ? link.value.text
                  : link.value.href
              );
            }
          }
        }
      } else if (isRecord(component.placeholders)) {
        Object.values(component.placeholders).forEach(visit);
      }
    }
  };
  visit(placeholders?.['headless-main']);
  return readingTime(copy.join(' '));
}
