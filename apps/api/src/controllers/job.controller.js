import { createQueue } from '../services/queue.js';
import { fetchHtml } from '../services/scraper.js';
import { getParsersForMode } from '../parsers/index.js';
import { Parser as Json2csvParser } from 'json2csv';
import { mergeRecords } from '../services/mergeRecords.js';
import { validateJobInput } from '../utils/validators.js';
import { log } from '../utils/logger.js';

// Store to track job status and results
export const memoryStore = new Map();

/**
 * Initiates a skip-trace job: queues targets, scrapes data, merges results.
 */
export async function runJob(req, res) {
  const jobId = res.locals.jobId;
  try {
    const body = validateJobInput(req.body);
    // Mark job as pending
    memoryStore.set(jobId, { status: 'pending' });

    const queue = createQueue();
    const results = [];
    const targets = buildTargets(body);

    for (const { mode, value } of targets) {
      const parsers = getParsersForMode(mode);
      for (const parser of parsers) {
        queue.push(async () => {
          try {
            const html = await fetchHtml(parser.urlBuilder(value));
            const rec = await parser.parse(html, { mode, value });
            results.push(rec);
          } catch (err) {
            log(`Error in parser ${parser.source || parser.name}:`, err.message);
          }
        });
      }
    }

    // Run all queued tasks
    await queue.runAll();
    const merged = mergeRecords(results);

    // Mark job as completed with data
    memoryStore.set(jobId, { status: 'completed', data: merged });

    res.json({ jobId, count: merged.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

/**
 * Returns job results in JSON or CSV format.
 */
export function downloadJob(req, res) {
  const jobId = req.params.id;
  const job = memoryStore.get(jobId);
  if (!job || job.status !== 'completed') {
    return res.status(404).json({ error: 'Not found or not completed' });
  }

  const rows = job.data;
  const format = req.query.format;

  if (format === 'csv') {
    const parser = new Json2csvParser({
      fields: ['fullName', 'age', 'phones', 'emails', 'addressCurrent', 'addressPrevious']
    });
    const csv = parser.parse(rows);
    res.setHeader('Content-Type', 'text/csv');
    return res.send(csv);
  }

  res.json({ count: rows.length, results: rows });
}

/**
 * Builds a list of scraping targets from input payload.
 */
function buildTargets(body) {
  const arr = [];
  (body.phones || []).forEach(p => arr.push({ mode: 'PHONE', value: p }));
  (body.addresses || []).forEach(a => arr.push({ mode: 'ADDR', value: a }));
  (body.names || []).forEach(n => arr.push({ mode: 'NAME', value: n }));
  return arr;
}
