import * as cheerio from 'cheerio';

export const modes = ['PHONE', 'NAME', 'ADDR'];

/**
 * Build the TruePeopleSearch URL based on the input value.
 * Supports phone lookup, address lookup, and name lookup.
 */
export function urlBuilder(value) {
  const digitsOnly = String(value).replace(/[^0-9]/g, '');

  // Phone lookup (at least 7 digits)
  if (digitsOnly.length >= 7) {
    return `https://www.truepeoplesearch.com/phone/${digitsOnly}`;
  }

  // Address lookup (detect numeric street numbers)
  if (/\d+\s+/.test(value)) {
    const slug = encodeURIComponent(
      value.toLowerCase().trim().replace(/\s+/g, '-')
    );
    return `https://www.truepeoplesearch.com/address/${slug}`;
  }

  // Name lookup
  const nameSlug = encodeURIComponent(
    value.toLowerCase().trim().replace(/\s+/g, '-')
  );
  return `https://www.truepeoplesearch.com/people/${nameSlug}`;
}

/**
 * Parse the HTML response from TruePeopleSearch and extract structured data.
 */
export function parse(html) {
  try {
    const $ = cheerio.load(html);
    let profile = null;

    // JSON-LD extraction (Person type)
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '');
        if (json['@type'] === 'Person') {
          profile = json;
        }
      } catch {
        // ignore malformed JSON
      }
    });

    // Name
    const fullName = profile?.name || $('h1').first().text().trim() || '';

    // Age
    const ageText = $('span:contains("Age")').text();
    const ageMatch = ageText.match(/(\d+)/);
    const age = ageMatch ? parseInt(ageMatch[1], 10) : null;

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

    // Current address
    let addressCurrent = '';
    if (profile?.address) {
      const addr = profile.address;
      addressCurrent =
        typeof addr === 'string'
          ? addr
          : `${addr.streetAddress || ''} ${addr.addressLocality || ''} ${addr.addressRegion || ''} ${addr.postalCode || ''}`.trim();
    } else {
      addressCurrent = $('div:contains("Current Address")').next().text().trim();
    }

    return {
      source: 'TruePeopleSearch',
      fullName,
      age,
      phones,
      emails,
      addressCurrent,
      addressPrevious: []
    };
  } catch (error) {
    throw new Error(`TruePeopleSearch parse error: ${error.message}`);
  }
}

// Default export: include every export
export default { modes, urlBuilder, parse };
