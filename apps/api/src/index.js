import 'dotenv/config';
import axios from 'axios';

// Route all axios requests through ScraperAPI
axios.interceptors.request.use(config => {
  const target = config.url;
  config.url = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(target)}`;
  return config;
}, error => Promise.reject(error));

import express from 'express';
import bodyParser from 'body-parser';
import { runJob } from './controllers/job.controller.js';
import { log } from './utils/logger.js';
import { randomUUID } from 'crypto';

const app = express();
app.use(bodyParser.json());

// Assign a unique jobId for each incoming request
app.use((req, res, next) => {
  res.locals.jobId = randomUUID();
  next();

// Health check endpoint
app.get('/healthz', (_, res) => res.send('ok'));

// Start a new skip-trace job
app.post('/run', runJob);

  res.json({ status: job.status, count: job.data?.length || 0 });

// Download results in JSON or CSV

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => log(`API listening on ${PORT}`));
