import axios from 'axios';
import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

/**
 * Build the search URL based on input.
 */
export function urlBuilder({ query, firstName, lastName }) {
  if (query && /\d{7,}/.test(query)) {
    const digits = query.replace(/[^0-9]/g, '');
    return `https://www.example.com/phone/${digits}`;
  }
  if (query && /\d+\s+/.test(query)) {
    const slug = encodeURIComponent(query.trim().replace(/\s+/g, '-').toLowerCase());
    return `https://www.example.com/address/${slug}`;
  }
  if (firstName && lastName) {
    const slug = encodeURIComponent(`${firstName.trim()}-${lastName.trim()}`.toLowerCase());
    return `https://www.example.com/name/${slug}`;
  }
  throw new Error('Invalid input for urlBuilder');
}

/**
 * Parse HTML and extract structured data.
 */
export async function parse(html, context = {}) {
  try {
    const $ = cheerio.load(html);

    const phones = [];
    $('a[href^="tel:"]').each((_, el) => phones.push($(el).text().trim()));

    const emails = [];
    $('a[href^="mailto:"]').each((_, el) => emails.push($(el).text().trim()));

    const name = $('h1').first().text().trim() || context.name || '';
    const address = $('div.address').first().text().trim() || context.address || '';

    return {
      source: 'STUB',
      phones,
      emails,
      name,
      address
    };
  } catch (error) {
    throw new Error(`Parser error: ${error.message}`);
  }
}

// Default export for ESM imports
export default { modes, urlBuilder, parse };
