import express from 'express';
import bodyParser from 'body-parser';
import { runJob, downloadJob, memoryStore } from './controllers/job.controller.js';
import { log } from './utils/logger.js';
import { randomUUID } from 'crypto';

const app = express();
app.use(bodyParser.json());

// Assign a unique jobId for each incoming request
app.use((req, res, next) => {
  res.locals.jobId = randomUUID();
  next();
});

// Health check endpoint
app.get('/healthz', (_, res) => res.send('ok'));

// Start a new skip-trace job
app.post('/run', runJob);

// Pollable status endpoint
app.get('/status/:id', (req, res) => {
  const job = memoryStore.get(req.params.id);
  if (!job) return res.status(404).json({ status: 'not found' });
  res.json({ status: job.status, count: job.data?.length || 0 });
});

// Download results in JSON or CSV
app.get('/download/:id', downloadJob);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => log(`API listening on ${PORT}`));
