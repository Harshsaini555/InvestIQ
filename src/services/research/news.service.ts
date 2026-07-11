import { env } from '@/lib/validators/env';
import { parseOrNull } from '@/lib/validators/zod-helpers';
import { type ServiceResult, type NewsArticle } from '@/types/research.types';
import { timedGet } from '@/services/research/http-client';
import { newsApiResponseSchema, newsResponseSchema } from '@/services/research/schemas';

const API_NAME  = 'NewsAPI';
const MAX_ARTICLES = 10;

function buildNewsUrl(company: string): string {
  const query     = encodeURIComponent(`"${company}" stock OR earnings OR revenue`);
  const fromDate  = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return `${env.NEWS_API_BASE_URL}/everything?q=${query}&from=${fromDate}&sortBy=relevancy&pageSize=${MAX_ARTICLES}&language=en&apiKey=${env.NEWS_API_KEY}`;
}

function categorise(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('earn') || t.includes('revenue') || t.includes('profit')) return 'earnings';
  if (t.includes('acqui') || t.includes('merger'))                          return 'merger_acquisition';
  if (t.includes('product') || t.includes('launch') || t.includes('release')) return 'product';
  if (t.includes('regulat') || t.includes('lawsuit') || t.includes('sec'))  return 'regulatory';
  if (t.includes('partner') || t.includes('deal') || t.includes('contract')) return 'partnership';
  return 'general';
}

/**
 * Fetches the latest news articles for a company from NewsAPI.
 * Returns raw structured articles — no sentiment, no AI summaries.
 */
export async function fetchNews(
  company: string
): Promise<ServiceResult<NewsArticle[]>> {
  const result = await timedGet<unknown>(buildNewsUrl(company), API_NAME);

  if (!result.success) return result;

  const parsed = parseOrNull(newsApiResponseSchema, result.data);

  if (!parsed || parsed.status !== 'ok') {
    return {
      success: false,
      error: { code: 'INVALID_RESPONSE', message: 'NewsAPI returned unexpected response', api: API_NAME },
    };
  }

  const mapped = parsed.articles
    .filter((a) => a.title && a.url)
    .slice(0, MAX_ARTICLES)
    .map((a) => ({
      title:       a.title ?? '',
      summary:     a.description ?? '',
      source:      a.source.name,
      publishedAt: a.publishedAt,
      url:         a.url,
      category:    categorise(a.title ?? ''),
    }));

  const validated = parseOrNull(newsResponseSchema, mapped);

  if (!validated) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'News articles failed schema validation', api: API_NAME },
    };
  }

  return { success: true, data: validated };
}
