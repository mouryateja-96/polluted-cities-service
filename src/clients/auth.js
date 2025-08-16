import axios from 'axios';

const BASE_URL = 'https://be-recruitment-task.onrender.com';
const USERNAME = 'testuser';
const PASSWORD = 'testpass';

let cachedToken = null;
let tokenExpiry = 0;
let cachedRefreshToken = null;

async function loginAndGetTokens() {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    username: USERNAME,
    password: PASSWORD
  });
  if (!response.data || !response.data.token) {
    console.error('Login response missing token:', response.data);
    throw new Error('Authentication failed: No token received');
  }
  cachedToken = response.data.token;
  cachedRefreshToken = response.data.refreshToken;
  // Assume token is valid for 30 minutes
  tokenExpiry = Date.now() + 30 * 60 * 1000;
  return cachedToken;
}

async function refreshAccessToken() {
  if (!cachedRefreshToken) throw new Error('No refresh token available');
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: cachedRefreshToken
    });
    if (!response.data || !response.data.token) {
      throw new Error('Refresh response missing token');
    }
    cachedToken = response.data.token;
    // Optionally update refresh token if provided
    if (response.data.refreshToken) cachedRefreshToken = response.data.refreshToken;
    tokenExpiry = Date.now() + 30 * 60 * 1000;
    return cachedToken;
  } catch (err) {
    console.error('Refresh token failed:', err.response ? err.response.data : err.message);
    // Fallback to login if refresh fails
    return await loginAndGetTokens();
  }
}

export async function getAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }
  if (cachedRefreshToken) {
    try {
      return await refreshAccessToken();
    } catch (err) {
      // Fallback to login if refresh fails
      return await loginAndGetTokens();
    }
  }
  return await loginAndGetTokens();
}
