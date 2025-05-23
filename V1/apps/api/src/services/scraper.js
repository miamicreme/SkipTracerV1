import axios from 'axios';
import config from 'config';

const { base, opts } = config.get('scraper');
const API_KEY = process.env.SCRAPER_API_KEY;

export async function fetchHtml(url, extra = {}) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    url,
    ...opts,
    ...extra,
  });
  const fullUrl = `${base}?${params.toString()}`;
  const { data } = await axios.get(fullUrl, { timeout: 30000 });
  return data;
}
