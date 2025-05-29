import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { getParsersForMode } from './parsers/index.js';

/**
 * Run all parsers for given mode and query object, save raw JSON to file.
 * @param {string} mode - e.g. 'PHONE','NAME','ADDR'
 * @param {object} queryObj - { query } or { firstName, lastName }
 * @param {string} outFile - output filename
 */
export async function aggregate(mode, queryObj, outFile = 'raw-results.json') {
  const parsers = getParsersForMode(mode);
  const results = [];
  // Normalize input value
  const value = typeof queryObj === 'string'
    ? queryObj
    : (queryObj.query && typeof queryObj.query === 'string')
      ? queryObj.query
      : null;

  for (const parser of parsers) {
    try {
      const url = parser.urlBuilder(
        parser.urlBuilder.length > 1
          ? { query: value, ...queryObj }
          : value
      );
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
