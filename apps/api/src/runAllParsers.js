import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { getParsersForMode } from './parsers/index.js';

/**
 * Run all parsers for the given mode and query, saving raw JSON to file.
 *
 * @param {string} mode - e.g. 'PHONE', 'NAME', 'ADDR'
 * @param {string|object} queryObj - a raw query string or an object such as
 *   `{ firstName, lastName }` or `{ query }`
 * @param {string} outFile - output filename
 */
export async function aggregate(mode, queryObj, outFile = 'raw-results.json') {
  const parsers = getParsersForMode(mode);
  const results = [];
  // Normalize input so parsers always receive an object
  const value = typeof queryObj === 'string'
    ? queryObj
    : (queryObj.query && typeof queryObj.query === 'string')
      ? queryObj.query
      : null;
  const ctx =
    typeof queryObj === 'object'
      ? { query: value, ...queryObj }
      : { query: value };

  for (const parser of parsers) {
    try {
      const url = parser.urlBuilder(ctx);
      const { data: html } = await axios.get(url);
      const parsed = await parser.parse(html, ctx);
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
