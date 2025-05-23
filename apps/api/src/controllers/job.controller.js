import { createQueue } from '../services/queue.js';
import { fetchHtml } from '../services/scraper.js';
import * as parsers from '../parsers/index.js';
import { Parser as Json2csvParser } from 'json2csv';
import { mergeRecords } from '../services/mergeRecords.js';
import { validateJobInput } from '../utils/validators.js';
import { log } from '../utils/logger.js';

const memoryStore = new Map();

export async function runJob(req, res) {
  try {
    const body = validateJobInput(req.body);
    const queue = createQueue();
    const results = [];

    const targets = buildTargets(body);
    for (const t of targets) {
      const parserList = parsers.getParsersForMode(t.mode);
      for (const p of parserList) {
        queue.push(async () => {
          try {
            const html = await fetchHtml(p.urlBuilder(t.value));
            const rec = await p.parse(html, t);
            results.push(rec);
          } catch (err) {
            log('scrape error', err.message);
          }
        });
      }
    }
    await queue.runAll();
    const merged = mergeRecords(results);
    memoryStore.set(res.locals.jobId, merged);
    res.json({ jobId: res.locals.jobId, count: merged.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export function downloadJob(req, res) {
  const jobId = req.params.id;
  const rows = memoryStore.get(jobId);
  if (!rows) return res.status(404).send('Not found');
  const format = req.query.format;
if(format==='csv'){
  const parser = new Json2csvParser({fields:['fullName','age','phones','emails','addressCurrent','addressPrevious']});
  const csv = parser.parse(rows);
  res.setHeader('Content-Type','text/csv');
  return res.send(csv);
}
  res.json(rows);
}

function buildTargets(body) {
  const arr = [];
  if (body.phones) body.phones.forEach(p => arr.push({ mode:'PHONE', value:p }));
  if (body.addresses) body.addresses.forEach(a => arr.push({ mode:'ADDR', value:a }));
  if (body.names) body.names.forEach(n => arr.push({ mode:'NAME', value:n }));
  return arr;
}
