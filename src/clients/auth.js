import axios from 'axios';

const BASE_URL = 'https://be-recruitment-task.onrender.com';
const USERNAME = 'testuser';
const PASSWORD = 'testpass';

let cachedToken = null;
let tokenExpiry = 0;

export async function getAuthToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: USERNAME,
      password: PASSWORD
    });    
    console.log(`respose is ${response}`)
    if (!response.data || !response.data.token) {
      console.error('Login response missing token:', response.data);
      throw new Error('Authentication failed: No token received');
    }
    cachedToken = response.data.token;
    console.log('Login successful, token received:', cachedToken);
    // Assume token is valid for 30 minutes
    tokenExpiry = now + 30 * 60 * 1000;
    return cachedToken;
  } catch (err) {
    console.error('Login request failed:', err.response ? err.response.data : err.message);
    throw new Error('Authentication failed: ' + (err.response ? err.response.data?.error || err.response.status : err.message));
  }
}
