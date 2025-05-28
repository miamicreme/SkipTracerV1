// apps/api/src/parsers/whitepages.js

import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Build the search URL for Whitepages
 */
export function urlBuilder({ query }) {
  // e.g. query = phone number, name, or address
  return `https://www.whitepages.com/search?${encodeURIComponent(query)}`;
}

export async function parse(html) {
  try {
    const $ = cheerio.load(html);
    // TODO: implement actual scraping logic for phone, name, address, etc.
    const results = [];
    $('div.result').each((i, el) => {
      results.push($(el).text().trim());
    });
    return { results };
  } catch (error) {
    throw new Error(`whitepages parse error: ${error.message}`);
  }
}

export default { urlBuilder, parse };
