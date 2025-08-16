const NON_CITY_KEYWORDS = [
  'Station', 'Area', 'Zone', 'District', 'PowerPlant', 'Plant', 'Unknown', 'Region', 'Test', 'Sample', 'HutA', 'Eašt'
];

export function normalizeCityName(name) {
  return name.replace(/[^\w\s-]/gi, '').trim();
}

export function isLikelyCityName(name) {
  if (!name || typeof name !== 'string') return false;
  return !NON_CITY_KEYWORDS.some(keyword => name.toLowerCase().includes(keyword.toLowerCase())) && name.length > 2;
}

export function normalizeCountryName(name) {
  return name ? name.trim() : '';
}
