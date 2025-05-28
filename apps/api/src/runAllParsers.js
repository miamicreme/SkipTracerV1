import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { getParsersForMode } from './parsers/index.js';
import 'dotenv/config';

/**
 * Run all parsers for given mode and query object, save raw JSON to file.
 * @param {string} mode - e.g. 'PHONE','NAME','ADDR'
 * @param {object} queryObj - { query } or { firstName, lastName }
 * @param {string} outFile - output filename
 */
export async function aggregate(mode, queryObj, outFile = 'raw-results.json') {
  const parsers = getParsersForMode(mode);
  const results = [];
  for (const parser of parsers) {
    const url = parser.urlBuilder(queryObj);
    try {
      const { data: html } = await axios.get(url);
      const parsed = await parser.parse(html, queryObj);
      results.push({ parser: parser.urlBuilder.name, data: parsed });
    } catch (err) {
      results.push({ parser: parser.urlBuilder.name, error: err.message });
    }
  }
  const fullPath = path.resolve(process.cwd(), outFile);
  await fs.writeFile(fullPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Wrote ${results.length} entries to ${fullPath}`);
  return fullPath;
}