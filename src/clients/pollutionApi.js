import axios from 'axios';
import { getAuthToken } from './auth.js';

const BASE_URL = 'https://be-recruitment-task.onrender.com';

export async function fetchPollutionData({ country, page = 1, limit = 10 } = {}) {
  const token = await getAuthToken();
  const params = {};
  if (country) params.country = country;
  if (page) params.page = page;
  if (limit) params.limit = limit;
  const response = await axios.get(`${BASE_URL}/pollution`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}
