// src/utils/fetchHtml.js
import axios from 'axios';

const API_KEY = process.env.SCRAPER_API_KEY;
const BASE_URL = process.env.SCRAPER_API_BASE ?? 'http://api.scraperapi.com'; // fallback base

export async function fetchHtml(url, extra = {}) {
  if (!API_KEY) {
    throw new Error('❌ Missing SCRAPER_API_KEY in environment variables');
  }

  const params = new URLSearchParams({
    api_key: API_KEY,
    url,
    render: 'true',       // default param — override with extra if needed
    keep_headers: 'true', // example default — optional
    ...extra,             // allow overrides from caller
  });

  const fullUrl = `${BASE_URL}?${params.toString()}`;
  const { data } = await axios.get(fullUrl, { timeout: 30000 });

  return data;
}
