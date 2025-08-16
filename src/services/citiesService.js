import { fetchPollutionData } from '../clients/pollutionApi.js';
import { getCitySummary } from '../clients/wiki.js';
import { normalizeCityName, normalizeCountryName, isLikelyCityName } from '../utils/cityUtils.js';
import { memoCache } from '../utils/memoCache.js';
import pLimit from 'p-limit';

/**
 * Main orchestrator for /cities
 */
export async function getPollutedCities({ page = 1, limit = 10, country }) {
  // 1) Pull raw data from the mock API (cached for a short window)
  const apiResponse = await memoCache(
    `pollution:raw:${country || ''}:${page}:${limit}`,
    60_000,
    () => fetchPollutionData({ country, page, limit })
  )();
  const raw = Array.isArray(apiResponse) ? apiResponse : apiResponse.results;
  // Debug: log raw data to help diagnose country filtering
  console.log('[pollution raw]', JSON.stringify(raw, null, 2));

  // 2) Normalize and coarse-filter obvious junk (no external calls yet)
  let normalized = raw
    .map((it) => ({
      name: normalizeCityName(it.name ?? it.city ?? it.City ?? ''),
      country: normalizeCountryName(it.country ?? it.Country ?? ''),
      pollution: safeNumber(it.pollution ?? it.aqi ?? it.pm25 ?? it.PM25 ?? it.value)
    }))
    .filter((it) => !!it.name && Number.isFinite(it.pollution))
    .filter((it) => isLikelyCityName(it.name));

  // Only filter by country if the country field exists and is not empty
  if (country && normalized.some(it => it.country)) {
    const countryNorm = normalizeCountryName(country);
    normalized = normalized.filter((it) => it.country.toLowerCase() === countryNorm.toLowerCase());
  }

  // 3) Dedupe by (name,country) and keep the worst pollution value
  const deduped = Object.values(normalized.reduce((acc, curr) => {
    const key = `${curr.name.toLowerCase()}|${curr.country.toLowerCase()}`;
    const prev = acc[key];
    if (!prev || curr.pollution > prev.pollution) {
      acc[key] = curr;
    }
    return acc;
  }, {}));

  // 4) Sort by pollution desc
  deduped.sort((a, b) => b.pollution - a.pollution);

  // 5) Validate with Wikipedia & enrich with description (cached, limited concurrency)
  const limitConcurrency = pLimit(5);
  const enriched = await Promise.all(deduped.map(item => limitConcurrency(async () => {
    const summary = await getCitySummary(item.name, item.country);
    if (!summary || !summary.isCity) return null;
    return { ...item, description: summary.description };
  })));

  const valid = enriched.filter(Boolean);

  // 6) Paginate
  const total = valid.length;
  const start = (page - 1) * limit;
  const cities = valid.slice(start, start + limit);

  return { page, limit, total, cities };
}

function safeNumber(v) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  if (Number.isFinite(n)) return Math.round(n * 10) / 10;
  return NaN;
}
