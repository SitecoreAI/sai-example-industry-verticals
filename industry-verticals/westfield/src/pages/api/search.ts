import type { NextApiRequest, NextApiResponse } from 'next';
import { validateSearchQuery } from 'lib/published-content';
import { searchNativePages } from 'lib/native-search';
import type { SearchResponse } from 'lib/published-content';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { error: string }>
): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Use GET for website search.' });
    return;
  }

  let query: string;
  try {
    query = validateSearchQuery(req.query.q);
  } catch (cause) {
    res
      .status(400)
      .json({ error: cause instanceof Error ? cause.message : 'Enter a search term.' });
    return;
  }

  try {
    res.status(200).json(await searchNativePages(query));
  } catch {
    res.status(503).json({ error: 'Search is temporarily unavailable.' });
  }
}
