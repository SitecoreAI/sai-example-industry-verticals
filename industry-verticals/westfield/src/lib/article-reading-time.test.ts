import { describe, expect, it } from 'vitest';
import { articleReadingTime, readingTime } from './article-reading-time';
import { plainText } from './plain-text';

const words = (count: number): string => Array(count).fill('insurance').join(' ');
const text = (body: string, heading = '') => ({
  componentName: 'ArticleText',
  fields: { Heading: { value: heading }, Body: { value: body } },
});
const article = (children: unknown[], extra: Record<string, unknown> = {}) => ({
  sitecore: {
    route: {
      fields: { ReadTime: { value: '99 min read' } },
      placeholders: {
        'headless-header': [text(words(1000))],
        'headless-main': [
          {
            componentName: 'PartialDesignDynamicPlaceholder',
            placeholders: {
              'sxa-article': [
                {
                  componentName: 'ArticleBodyLayout',
                  placeholders: { 'article-content-2': children, ...extra },
                },
              ],
            },
          },
        ],
        'headless-footer': [text(words(1000))],
      },
    },
  },
});

describe('article reading time', () => {
  it('rounds readable words up at 200 words per minute', () => {
    expect(readingTime(words(200))).toBe('1 min read');
    expect(readingTime(words(201))).toBe('2 min read');
    expect(readingTime(words(400))).toBe('2 min read');
  });

  it('ignores markup, non-readable code, comments, whitespace and punctuation', () => {
    const content = `<p>${words(200)}</p><script>${words(300)}</script><style>${words(300)}</style><!-- > ${words(300)} -->`;
    expect(readingTime(content)).toBe('1 min read');
    expect(readingTime('<p>&nbsp; &#160; &#xA0; … ! —</p>')).toBe('');
    expect(readingTime('<img src="photo.jpg" alt="Photo of a family" />')).toBe('');
    expect(plainText('Casey&#39;s&nbsp;home &amp; auto &#x2014; coverages')).toBe(
      "Casey's home & auto — coverages"
    );
  });

  it('counts entities, apostrophes and hyphenated words as readable text', () => {
    expect(readingTime(`${words(198)} Casey&#39;s café-au-lait`)).toBe('1 min read');
    expect(readingTime(`${words(198)} Casey&#39;s café-au-lait — insurance`)).toBe('2 min read');
  });

  it('uses summary and permitted Text/Action body fields but excludes shell and unrelated content', () => {
    const layout = article(
      [
        text(`<p>${words(197)}</p>`),
        {
          componentName: 'CampaignAction',
          fields: {
            Heading: { value: 'Help' },
            Body: { value: '<p>Today</p>' },
            Link: { value: { text: 'Ask', href: `https://example.com/${words(100)}` } },
          },
        },
        { componentName: 'AdviceListing', fields: { Body: { value: words(1000) } } },
      ],
      { 'unrelated-slot': [text(words(1000))] }
    );
    expect(articleReadingTime(layout)).toBe('1 min read');
    expect(articleReadingTime(JSON.stringify(layout), 'Summary')).toBe('2 min read');
  });

  it('leaves blank drafts blank despite a stored manual value and tolerates absent layout data', () => {
    expect(articleReadingTime(article([text('<p>&nbsp;</p>')]))).toBe('');
    expect(articleReadingTime(undefined)).toBe('');
    expect(articleReadingTime('{invalid json')).toBe('');
  });
});
