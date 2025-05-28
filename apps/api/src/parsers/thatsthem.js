import axios from 'axios';
import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

/**
 * Construct the appropriate search URL based on input.
 * Supports phone, name, and address lookup.
 */
export function urlBuilder({ query, firstName, lastName }) {
  // Phone lookup when digits
  if (query && /\d{7,}/.test(query)) {
    const digits = query.replace(/[^0-9]/g, '');
    return `https://www.example.com/phone/${digits}`;
  }
  // Address lookup when query has numbers and street name
  if (query && /\d+\s+/.test(query)) {
    const slug = encodeURIComponent(query.trim().replace(/\s+/g, '-').toLowerCase());
    return `https://www.example.com/address/${slug}`;
  }
  // Name lookup when firstName & lastName provided
  if (firstName && lastName) {
    const slug = encodeURIComponent(`${firstName.trim()}-${lastName.trim()}`.toLowerCase());
    return `https://www.example.com/name/${slug}`;
  }
  throw new Error('Invalid input for urlBuilder');
}

/**
 * Parse the HTML response and extract structured fields.
 */
export async function parse(html, context = {}) {
  try {
    const $ = cheerio.load(html);

    // Phones
    const phones = [];
    $('a[href^="tel:"]').each((_, el) => {
      phones.push($(el).text().trim());
    });

    // Emails
    const emails = [];
    $('a[href^="mailto:"]').each((_, el) => {
      emails.push($(el).text().trim());
    });

    // Name
    const name = $('h1').first().text().trim() || context.name || '';

    // Address
    const address = $('div.address').first().text().trim() || context.address || '';

    return {
      source: 'STUB',
      phones,
      emails,
      name,
      address
    };
  } catch (error) {
    throw new Error(`Parser stub error: ${error.message}`);
  }
}

// Default export for easy ESM import
export default { modes, urlBuilder, parse };