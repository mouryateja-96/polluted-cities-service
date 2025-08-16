import axios from 'axios';

const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

export async function getCitySummary(city) {
  try {
    const response = await axios.get(`${WIKI_API}${encodeURIComponent(city)}`);
    const data = response.data;
    // Heuristic: Wikipedia returns 'type' as 'city' for actual cities
    const isCity = data.type === 'city' || (data.description && /city/i.test(data.description));
    return {
      description: data.extract || '',
      isCity
    };
  } catch (err) {
    return { description: '', isCity: false };
  }
}
