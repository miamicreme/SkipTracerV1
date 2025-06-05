import cors from 'cors';
// apps/api/src/index.js

import 'dotenv/config';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import axios from 'axios';
import { runJob } from './controllers/job.controller.js';

// Configure Axios to route requests through ScraperAPI when configured
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_API_BASE = process.env.SCRAPER_API_BASE ?? 'http://api.scraperapi.com';
if (SCRAPER_API_KEY) {
  axios.interceptors.request.use((config) => {
    const method = config.method ? config.method.toLowerCase() : 'get';
    if (method === 'get' && /^https?:/i.test(config.url) && !config.url.startsWith(SCRAPER_API_BASE)) {
      const params = new URLSearchParams({
        api_key: SCRAPER_API_KEY,
        url: config.url,
        render: 'true',
        keep_headers: 'true',
      });
      config.url = `${SCRAPER_API_BASE}?${params.toString()}`;
    }
    return config;
  }, error => Promise.reject(error));
}

const app = express();
app.use(cors());
app.use(express.static(path.resolve(process.cwd(), 'public')));
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Main endpoint: runs all parsers, invokes AI, returns the ranked file
app.post('/run', async (req, res) => {
  try {
    await runJob(req, res);
  } catch (err) {
    console.error('Unhandled error in /run:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Healthcheck for Docker
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
