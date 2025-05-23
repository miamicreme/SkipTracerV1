import express from 'express';
import bodyParser from 'body-parser';
import { runJob, downloadJob } from './controllers/job.controller.js';
import { log } from './utils/logger.js';
import { randomUUID } from 'crypto';

const app = express();
app.use(bodyParser.json());

app.use((req,res,next) => { res.locals.jobId = randomUUID(); next(); });

app.get('/healthz', (_,res)=>res.send('ok'));
app.post('/run', runJob);
app.get('/download/:id', downloadJob);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => log(`API listening on ${PORT}`));
