import { createQueue }             from '../services/queue.js';
import { fetchHtml }               from '../services/scraper.js';
import { getParsersForMode }       from '../parsers/index.js';
import { Parser as Json2csvParser } from 'json2csv';
import { mergeRecords }            from '../services/mergeRecords.js';
import { validateJobInput }        from '../utils/validators.js';
import { log }                     from '../utils/logger.js';

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

    const queue   = createQueue();
    const results = [];
    const targets = buildTargets(body);

    for (const { mode, value } of targets) {
      const parsers = getParsersForMode(mode);
      for (const parser of parsers) {
        queue.push(async () => {
          try {
            const html = await fetchHtml(parser.urlBuilder(value));
            const rec  = await parser.parse(html, { mode, value });
            results.push(rec);
          } catch (err) {
            log(`Parser error (${parser.source || parser.name}):`, err.message);
          }
        });
      }
    }

    // Run all queued tasks
    await queue.runAll();
    const merged = mergeRecords(results);

    // Mark job as completed with data
    memoryStore.set(jobId, { status: 'completed', data: merged });

    // Respond with jobId & count
    res.json({ jobId, count: merged.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

/**
 * Returns job results in JSON or CSV format.
 */
export function downloa
