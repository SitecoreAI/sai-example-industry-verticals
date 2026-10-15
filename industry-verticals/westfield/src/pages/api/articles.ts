import type { NextApiRequest, NextApiResponse } from 'next';
import { getPublishedArticles } from 'lib/published-content';
import type { PublishedArticle } from 'lib/published-content';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ articles: PublishedArticle[] } | { error: string }>
): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Use GET for the article listing.' });
    return;
  }

  try {
    res.status(200).json({ articles: await getPublishedArticles() });
  } catch {
    res.status(503).json({ error: 'Articles are temporarily unavailable.' });
  }
}
