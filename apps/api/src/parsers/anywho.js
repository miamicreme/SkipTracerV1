import axios from 'axios';
import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

/**
 * Build the AnyWho search URL.
 * Accepts either:
 *   - a string (the raw query), or
 *   - an object { query, firstName, lastName }
 */
export function urlBuilder(input) {
  const value =
    typeof input === 'object' && input.query
      ? input.query
      : String(input || '');

  const digitsOnly = value.replace(/[^0-9]/g, '');
  // PHONE lookup if looks like a phone
  if (digitsOnly.length >= 7) {
    return `https://www.anywho.com/phone/${digitsOnly}`;
  }
  // ADDRESS lookup
  if (/\d+\s+/.test(value)) {
    const slug = encodeURIComponent(value.toLowerCase().trim().replace(/\s+/g, '-'));
    return `https://www.anywho.com/address/${slug}`;
  }
  // NAME lookup
  const nameSlug = encodeURIComponent(value.toLowerCase().trim().replace(/\s+/g, '-'));
  return `https://www.anywho.com/people/${nameSlug}`;
}

export async function parse(html, context = {}) {
  try {
    const $ = cheerio.load(html);
    // TODO: adapt selectors to AnyWho’s page structure
    const results = [];
    $('div.result').each((i, el) => {
      results.push($(el).text().trim());
    });
    return { source: 'AnyWho', results };
  } catch (err) {
    throw new Error(`AnyWho parse error: ${err.message}`);
  }
}

export default { modes, urlBuilder, parse };
